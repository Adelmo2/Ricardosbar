import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { ClienteService, ProdutoService, VendaService, mensagemErro } from '../../core/api.service';
import { AtualizacaoVenda, CadastroVenda, Cliente, Produto, Venda } from '../../core/models';

const TITULOS: Record<string, string> = {
  listar: 'Vendas — listar todas',
  'por-cliente': 'Vendas — por cliente',
  'por-produto': 'Vendas — por produto',
  cadastrar: 'Vendas — cadastrar',
  alterar: 'Vendas — alterar',
  excluir: 'Vendas — excluir',
};

type CampoTexto = 'nome_cliente' | 'descricao_produto';
type CampoNumero = 'id' | 'quantidade' | 'valor' | 'total' | 'saldo_pagar_cliente';
type CampoOrdenacao = CampoTexto | CampoNumero | 'data_pagamento';

function vendaVazia(): CadastroVenda {
  return { id_clientes: null, id_produtos: null, quantidade: 1, valor: null, cupom: 0, pago: 0 };
}

/** Data local no formato yyyy-MM-dd do input type="date" (sem converter para UTC). */
function dataInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function alteracaoVazia(): AtualizacaoVenda {
  return { id: null as unknown as number, quantidade: null, valor: null, cupom: null, pago: null };
}

@Component({
  selector: 'app-vendas',
  imports: [FormsModule, DecimalPipe, DatePipe, NgTemplateOutlet, RouterLink],
  template: `
    <h2>{{ titulo() }}</h2>

    @if (erro()) { <div class="msg erro">{{ erro() }}</div> }
    @if (sucesso()) { <div class="msg ok">{{ sucesso() }}</div> }

    @switch (acao()) {
      @case ('listar') {
        <div class="linha">
          <button type="button" routerLink="/home/vendas/cadastrar">Venda e Pagamento</button>
        </div>
        <form class="linha pesquisa" (ngSubmit)="recarregar()">
          <label>Nome do cliente
            <input name="filtroNome" [(ngModel)]="filtroNome" placeholder="Parte do nome (vazio = todas)" maxlength="40" />
          </label>
          <label>Nome do produto
            <input name="filtroProduto" [(ngModel)]="filtroProduto" placeholder="Parte do nome (vazio = todos)" maxlength="40" />
          </label>
          <label>Data da venda — de
            <input name="filtroDataInicio" type="date" [(ngModel)]="filtroDataInicio" [max]="filtroDataFim" />
          </label>
          <label>até
            <input name="filtroDataFim" type="date" [(ngModel)]="filtroDataFim" [min]="filtroDataInicio" />
          </label>
          <button type="submit" [disabled]="carregando()">Pesquisar</button>
          <button type="button" class="secundario" (click)="limparFiltro()"
                  [disabled]="!filtroNome && !filtroProduto">Limpar</button>
        </form>
        <ng-container *ngTemplateOutlet="tabela" />
      }

      @case ('por-cliente') {
        <div class="linha">
          <label>Nome do cliente <input type="text" [(ngModel)]="filtroNome" (keyup.enter)="recarregar()" /></label>
          <button (click)="recarregar()" [disabled]="!filtroNome.trim()">Consultar</button>
        </div>
        @if (pesquisouCliente) { <ng-container *ngTemplateOutlet="tabela" /> }
      }

      @case ('por-produto') {
        <div class="linha">
          <label>Produto
            <select [(ngModel)]="filtroId" (ngModelChange)="recarregar()">
              <option [ngValue]="null">Selecione...</option>
              @for (p of produtos(); track p.id) {
                <option [ngValue]="p.id">{{ p.id }} — {{ p.descricao }}</option>
              }
            </select>
          </label>
        </div>
        @if (filtroId) { <ng-container *ngTemplateOutlet="tabela" /> }
      }

      @case ('cadastrar') {
        <form class="cartao" (ngSubmit)="cadastrar()">
          <div class="form-grid">
            <label>Cliente *
              <select name="cliente" class="sel-cliente" [(ngModel)]="nova.id_clientes" required>
                <option [ngValue]="null">Selecione...</option>
                @for (c of clientesAtivos(); track c.id) {
                  <option [ngValue]="c.id">{{ c.nome }} (saldo: {{ (c.saldo_pagar ?? 0) | number: '1.2-2' }})</option>
                }
              </select>
            </label>
            <label>Produto *
              <select name="produto" class="sel-produto" [(ngModel)]="nova.id_produtos" (ngModelChange)="aoEscolherProduto($event)" required>
                <option [ngValue]="null">Selecione...</option>
                @for (p of produtosAtivos(); track p.id) {
                  <option [ngValue]="p.id">{{ p.descricao }}</option>
                }
              </select>
            </label>
            <label>Quantidade
              <input name="quantidade" type="number" step="1" min="1" inputmode="numeric"
                     [(ngModel)]="nova.quantidade" (keydown)="somenteInteiro($event)" (paste)="colarSomenteInteiro($event)" />
            </label>
            <label>Valor unitário{{ produtoCasco() ? '' : ' *' }}
              <input name="valor" type="number" step="0.01" [(ngModel)]="nova.valor"
                     [placeholder]="produtoCasco() ? 'Opcional (casco)' : ''" />
            </label>
            <label>Cupom
              <select name="cupom" [(ngModel)]="nova.cupom">
                <option [ngValue]="0">Não</option><option [ngValue]="1">Sim</option>
              </select>
            </label>
            <label>Pago
              <select name="pago" [(ngModel)]="nova.pago">
                <option [ngValue]="0">Não</option><option [ngValue]="1">Sim</option>
              </select>
            </label>
          </div>
          <p class="dica">
            Total: <strong>{{ (nova.quantidade ?? 0) * (nova.valor ?? 0) | number: '1.2-2' }}</strong>
            · O produto <strong>{{ produtoPagamento() ?? 'de ID 1' }}</strong> é tratado pela API como pagamento (abate o valor do saldo do cliente).
          </p>
          <button type="submit" [disabled]="!nova.id_clientes || !nova.id_produtos || !quantidadeValida(nova.quantidade) || !valorValido()">Cadastrar venda</button>
        </form>
      }

      @case ('alterar') {
        <form class="cartao" (ngSubmit)="alterarPorId()">
          <p class="dica">Informe o ID da venda e apenas os campos que deseja alterar. Também é possível alterar pela coluna "Alterar" na lista de vendas.</p>
          <div class="form-grid">
            <label>ID da venda * <input name="id" type="number" [(ngModel)]="alteracao.id" required /></label>
            <label>Quantidade <input name="quantidade" type="number" step="1" min="1" inputmode="numeric" (keydown)="somenteInteiro($event)" (paste)="colarSomenteInteiro($event)" [(ngModel)]="alteracao.quantidade" placeholder="(manter)" /></label>
            <label>Valor unitário <input name="valor" type="number" step="0.01" [(ngModel)]="alteracao.valor" /></label>
            <label>Cupom
              <select name="cupom" [(ngModel)]="alteracao.cupom">
                <option [ngValue]="null">(manter)</option><option [ngValue]="0">Não</option><option [ngValue]="1">Sim</option>
              </select>
            </label>
            <label>Pago
              <select name="pago" [(ngModel)]="alteracao.pago">
                <option [ngValue]="null">(manter)</option><option [ngValue]="0">Não</option><option [ngValue]="1">Sim</option>
              </select>
            </label>
          </div>
          <button type="submit" [disabled]="!alteracao.id || (alteracao.quantidade != null && !quantidadeValida(alteracao.quantidade))">Salvar alteração</button>
        </form>
      }

      @case ('excluir') {
        <div class="linha">
          <label>ID da venda <input type="number" [(ngModel)]="filtroId" /></label>
          <button class="perigo" (click)="excluir(filtroId!)" [disabled]="!filtroId">Excluir</button>
        </div>
      }
    }

    <ng-template #thOrdenavel let-campo="campo" let-rotulo="rotulo" let-classe="classe">
      <th [class]="'ordenavel ' + classe" tabindex="0" role="columnheader"
          [attr.aria-sort]="ordemCampo() === campo ? (ordemDir() === 'asc' ? 'ascending' : 'descending') : 'none'"
          [title]="'Ordenar por ' + rotulo"
          (click)="ordenarPor(campo)" (keydown.enter)="ordenarPor(campo)" (keydown.space)="$event.preventDefault(); ordenarPor(campo)">
        {{ rotulo }}<span class="seta" aria-hidden="true">{{ ordemCampo() === campo ? (ordemDir() === 'asc' ? '▲' : '▼') : '↕' }}</span>
      </th>
    </ng-template>

    <ng-template #tabela>
      <div class="tabela-wrap">
        <table [class.lista-todas]="acao() === 'listar'" [attr.aria-busy]="carregando()">
          <thead>
            <tr>
              @if (acao() === 'listar') {
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'id', rotulo: 'ID', classe: '' }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'nome_cliente', rotulo: 'Cliente', classe: '' }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'descricao_produto', rotulo: 'Produto', classe: '' }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'quantidade', rotulo: 'Qtde', classe: 'num' }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'valor', rotulo: 'Valor', classe: 'num' }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'total', rotulo: 'Total', classe: 'num' }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'data_pagamento', rotulo: 'Data', classe: '' }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'saldo_pagar_cliente', rotulo: 'Saldo do Cliente', classe: 'num col-saldo' }" />
              } @else {
                <th>ID</th><th>Cliente</th><th>Produto</th>
                <th class="num">Qtde</th><th class="num">Valor</th><th class="num">Total</th>
                <th>Data</th><th>Cupom</th><th>Pago</th><th class="num">Saldo do Cliente</th>
              }
              <th>Alterar</th><th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            @if (carregando()) {
              @for (l of linhasSkeleton; track l) {
                <tr class="skeleton-linha" aria-hidden="true">
                  @for (c of colunasSkeleton(); track $index) { <td><span class="skeleton"></span></td> }
                </tr>
              }
            } @else {
            @for (v of vendasOrdenadas(); track v.id) {
              @if (editandoId() === v.id) {
                <tr class="editando">
                  <td>{{ v.id }}</td>
                  <td>{{ v.nome_cliente }}</td>
                  <td>{{ v.descricao_produto }}</td>
                  <td><input type="number" step="1" min="1" inputmode="numeric" (keydown)="somenteInteiro($event)" (paste)="colarSomenteInteiro($event)" [(ngModel)]="edicao.quantidade" /></td>
                  <td><input type="number" step="0.01" [(ngModel)]="edicao.valor" /></td>
                  <td class="num">{{ (edicao.quantidade ?? 0) * (edicao.valor ?? 0) | number: '1.2-2' }}</td>
                  <td>{{ v.data_pagamento | date: 'dd/MM/yyyy HH:mm' }}</td>
                  @if (acao() !== 'listar') {
                    <td>
                      <select [(ngModel)]="edicao.cupom"><option [ngValue]="0">Não</option><option [ngValue]="1">Sim</option></select>
                    </td>
                    <td>
                      <select [(ngModel)]="edicao.pago"><option [ngValue]="0">Não</option><option [ngValue]="1">Sim</option></select>
                    </td>
                  }
                  <td class="num">{{ v.saldo_pagar_cliente ?? 0 | number: '1.2-2' }}</td>
                  <td class="acoes">
                    <button class="pequeno" (click)="salvarEdicao()" [disabled]="!quantidadeValida(edicao.quantidade)">Salvar</button>
                    <button class="secundario pequeno" (click)="editandoId.set(null)">Cancelar</button>
                  </td>
                  <td></td>
                </tr>
              } @else {
                <tr [class.negativa]="acao() === 'listar' && (v.total ?? 0) < 0">
                  <td>{{ v.id }}</td>
                  <td>{{ v.id_cliente }} — {{ v.nome_cliente }}</td>
                  <td>{{ v.id_produto }} — {{ v.descricao_produto }}</td>
                  <td class="num">{{ v.quantidade | number: '1.0-2' }}</td>
                  <td class="num">{{ v.valor | number: '1.2-2' }}</td>
                  <td class="num">{{ v.total | number: '1.2-2' }}</td>
                  <td class="col-data">{{ v.data_pagamento | date: 'dd/MM/yyyy HH:mm' }}</td>
                  @if (acao() !== 'listar') {
                    <td>{{ v.cupom === 1 ? 'Sim' : 'Não' }}</td>
                    <td>{{ v.pago === 1 ? 'Sim' : 'Não' }}</td>
                  }
                  <td class="num">{{ v.saldo_pagar_cliente ?? 0 | number: '1.2-2' }}</td>
                  <td><button class="secundario pequeno" (click)="editar(v)">Alterar</button></td>
                  <td><button class="perigo pequeno" (click)="excluir(v.id)">Excluir</button></td>
                </tr>
              }
            } @empty {
              <tr><td colspan="12">Nenhuma venda encontrada.</td></tr>
            }
            }
          </tbody>
          @if (vendas().length && !carregando()) {
            <tfoot>
              <tr><th colspan="5">Total geral</th><th class="num">{{ totalGeral() | number: '1.2-2' }}</th><th [attr.colspan]="acao() === 'listar' ? 4 : 6"></th></tr>
            </tfoot>
          }
        </table>
      </div>
    </ng-template>
  `,
  styles: `
    .dica { color: var(--muted); font-size: .85rem; margin: 0 0 14px; }
    tr.editando td { background: #fff7e8; }
    tr.editando input, tr.editando select { width: 90px; padding: 3px 6px; }
    td.acoes { display: flex; gap: 6px; }
    /* Tela "cadastrar": lista de clientes em negrito e com a fonte 20% maior. */
    select.sel-cliente { font-size: 1.2em; font-weight: bold; }
    select.sel-cliente option { font-weight: bold; }
    /* Tela "cadastrar": lista de produtos em negrito e com a fonte 15% maior. */
    select.sel-produto { font-size: 1.15em; font-weight: bold; }
    select.sel-produto option { font-weight: bold; }
    tr.negativa td { color: #0d47a1; font-weight: bold; }
    /* Tela "listar todas": rótulos da pesquisa e cabeçalhos das colunas 40% maiores (.85rem -> 1.19rem). */
    .pesquisa label, table.lista-todas th { font-size: 1.19rem; }
    .pesquisa label input { font-size: .85rem; }
    /* Tela "listar todas": coluna "Data" com espaçamento lateral menor (fonte igual à das outras colunas). */
    table.lista-todas td.col-data { padding-left: 7.2px; padding-right: 7.2px; }
    /* Tela "listar todas": coluna "Saldo do Cliente" 15% mais estreita. A largura vem do título,
       então o título fica com fonte e espaçamento lateral a 85% (1.19rem -> 1.01rem). */
    table.lista-todas th.col-saldo { font-size: 1.01rem; padding-left: 8.5px; padding-right: 8.5px; }
  `,
})
export class VendasComponent {
  private vendaApi = inject(VendaService);
  private clienteApi = inject(ClienteService);
  private produtoApi = inject(ProdutoService);

  acao = input('listar');
  titulo = signal('');
  erro = signal('');
  sucesso = signal('');

  vendas = signal<Venda[]>([]);
  clientes = signal<Cliente[]>([]);
  produtos = signal<Produto[]>([]);
  clientesAtivos = computed(() =>
    this.clientes()
      .filter((c) => c.bloqueado !== 1)
      .sort((a, b) => (a.nome ?? '').localeCompare(b.nome ?? '', 'pt-BR', { sensitivity: 'base' })),
  );
  // nome do produto de ID 1, que a API trata como pagamento (citado na dica da tela "cadastrar")
  produtoPagamento = computed(() => this.produtos().find((p) => p.id === 1)?.descricao);
  produtosAtivos = computed(() =>
    this.produtos()
      .filter((p) => p.bloqueado !== 1)
      .sort((a, b) => (a.descricao ?? '').localeCompare(b.descricao ?? '', 'pt-BR', { sensitivity: 'base' })),
  );
  /** true enquanto uma pesquisa está em andamento: a tabela mostra o "Aguarde" em skeleton */
  carregando = signal(false);
  readonly linhasSkeleton = [1, 2, 3, 4, 5, 6];
  colunasSkeleton = computed(() => Array.from({ length: this.acao() === 'listar' ? 10 : 12 }));
  /**
   * Ordenação da tela "listar todas" (clique no cabeçalho alterna crescente/decrescente).
   * null = ordem em que a API devolveu; as outras telas não ordenam.
   */
  ordemCampo = signal<CampoOrdenacao | null>(null);
  ordemDir = signal<'asc' | 'desc'>('asc');
  vendasOrdenadas = computed(() => {
    const campo = this.ordemCampo();
    const lista = this.vendas();
    if (!campo || this.acao() !== 'listar') return lista;
    const fator = this.ordemDir() === 'asc' ? 1 : -1;
    return [...lista].sort((a, b) => {
      let r: number;
      if (campo === 'nome_cliente' || campo === 'descricao_produto') {
        r = (a[campo] ?? '').localeCompare(b[campo] ?? '', 'pt-BR', { sensitivity: 'base', numeric: true });
      } else if (campo === 'data_pagamento') {
        r = (Date.parse(a.data_pagamento) || 0) - (Date.parse(b.data_pagamento) || 0);
      } else {
        r = (a[campo] ?? 0) - (b[campo] ?? 0);
      }
      // desempate estável pelo ID, para a ordem não "pular" entre cliques
      return (r || a.id - b.id) * fator;
    });
  });
  totalGeral = computed(() => this.vendas().reduce((s, v) => s + (v.total ?? 0), 0));

  filtroId: number | null = null;
  filtroNome = '';
  filtroProduto = '';
  /** período da data da venda, no formato yyyy-MM-dd do input type="date" (vazio = sem limite) */
  filtroDataInicio = '';
  filtroDataFim = '';
  pesquisouCliente = false;
  nova: CadastroVenda = vendaVazia();
  alteracao: AtualizacaoVenda = alteracaoVazia();

  editandoId = signal<number | null>(null);
  edicao: AtualizacaoVenda = alteracaoVazia();

  constructor() {
    effect(() => {
      const a = this.acao();
      untracked(() => this.iniciar(a));
    });
  }

  private iniciar(acao: string): void {
    this.titulo.set(TITULOS[acao] ?? 'Vendas');
    this.limparMensagens();
    this.vendas.set([]);
    this.editandoId.set(null);
    this.ordemCampo.set(null);
    this.ordemDir.set('asc');
    this.filtroId = null;
    this.filtroNome = '';
    this.filtroProduto = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    if (acao === 'listar') {
      // ao abrir "listar todas", o período padrão é do mesmo dia de dois anos atrás até hoje
      const hoje = new Date();
      const doisAnosAtras = new Date(hoje);
      doisAnosAtras.setFullYear(hoje.getFullYear() - 2);
      this.filtroDataInicio = dataInput(doisAnosAtras);
      this.filtroDataFim = dataInput(hoje);
    }
    this.pesquisouCliente = false;
    this.nova = vendaVazia();
    this.alteracao = alteracaoVazia();

    if (acao === 'cadastrar') {
      this.clienteApi.listarTodos().subscribe({ next: (r) => this.clientes.set(r), error: (e) => this.erro.set(mensagemErro(e)) });
    }
    if (acao === 'por-produto' || acao === 'cadastrar') {
      this.produtoApi.listarTodos().subscribe({ next: (r) => this.produtos.set(r), error: (e) => this.erro.set(mensagemErro(e)) });
    }
    if (acao === 'listar') this.recarregar();
  }

  private limparMensagens(): void {
    this.erro.set('');
    this.sucesso.set('');
  }

  private executar<T>(obs: Observable<T>, ok: (r: T) => void): void {
    this.limparMensagens();
    obs.subscribe({ next: ok, error: (e) => this.erro.set(mensagemErro(e)) });
  }

  /** Carrega a lista de vendas de acordo com a ação/filtro atual */
  recarregar(): void {
    this.editandoId.set(null);
    let obs: Observable<Venda[]> | null = null;
    switch (this.acao()) {
      case 'listar':
        // com filtro, lista só as vendas dos clientes cujo nome contém o texto; sem filtro, todas
        // o filtro por produto (sozinho ou combinado com o de cliente) usa a pesquisa combinada da API
        // o período de data da venda também usa a pesquisa combinada
        if (this.filtroDataInicio && this.filtroDataFim && this.filtroDataFim < this.filtroDataInicio) {
          this.vendas.set([]);
          this.sucesso.set('');
          this.erro.set('A data final não pode ser anterior à data inicial.');
          return;
        }
        if (this.filtroProduto.trim() || this.filtroDataInicio || this.filtroDataFim) {
          obs = this.vendaApi.pesquisar(this.filtroNome, this.filtroProduto, this.filtroDataInicio, this.filtroDataFim);
        } else obs = this.filtroNome.trim() ? this.vendaApi.porCliente(this.filtroNome) : this.vendaApi.listarTodas();
        break;
      case 'por-cliente':
        if (this.filtroNome.trim()) { obs = this.vendaApi.porCliente(this.filtroNome); this.pesquisouCliente = true; }
        break;
      case 'por-produto': if (this.filtroId) obs = this.vendaApi.porProduto(this.filtroId); break;
    }
    if (!obs) return;
    this.limparMensagens();
    this.carregando.set(true);
    obs.pipe(finalize(() => this.carregando.set(false))).subscribe({
      next: (r) => this.vendas.set(r),
      // a API responde com erro quando nenhum cliente casa com o nome: não deixa a lista anterior na tela
      error: (e) => { this.vendas.set([]); this.erro.set(mensagemErro(e)); },
    });
  }

  limparFiltro(): void {
    this.filtroNome = '';
    this.filtroProduto = '';
    // o período (Data da venda — de / até) é mantido de propósito
    this.recarregar();
  }

  aoEscolherProduto(id: number | null): void {
    const p = this.produtos().find((x) => x.id === id);
    if (p) this.nova.valor = p.preco;
  }

  /** Bloqueia no campo Quantidade as teclas que formariam número não inteiro (vírgula, ponto, sinal, expoente) */
  somenteInteiro(e: KeyboardEvent): void {
    if ([',', '.', '-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
  }

  /** Ao colar no campo Quantidade, aceita só texto formado por dígitos */
  colarSomenteInteiro(e: ClipboardEvent): void {
    const texto = e.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(texto.trim())) e.preventDefault();
  }

  quantidadeValida(q: number | null | undefined): boolean {
    return q != null && Number.isInteger(q) && q >= 1;
  }

  /** Produto escolhido na tela "cadastrar" é casco (descrição contém a palavra "CASCO")? */
  produtoCasco(): boolean {
    const p = this.produtos().find((x) => x.id === this.nova.id_produtos);
    return !!p?.descricao?.toUpperCase().includes('CASCO');
  }

  /** Valor unitário é obrigatório, exceto para produto casco e para o pagamento (produto de ID 1) */
  valorValido(): boolean {
    if (this.produtoCasco() || this.nova.id_produtos === 1) return true;
    return this.nova.valor != null && this.nova.valor > 0;
  }

  cadastrar(): void {
    if (!this.quantidadeValida(this.nova.quantidade) || !this.valorValido()) return;
    const dados: CadastroVenda = { ...this.nova, valor: this.nova.valor ?? 0 };
    this.executar(this.vendaApi.cadastrar(dados), () => {
      this.sucesso.set('Venda cadastrada com sucesso.');
      this.nova = vendaVazia();
      // recarrega os clientes para refletir o saldo a pagar atualizado
      this.clienteApi.listarTodos().subscribe({ next: (c) => this.clientes.set(c) });
    });
  }

  /** Coluna "Alterar": abre a linha em modo de edição */
  /** Clique no cabeçalho: mesma coluna inverte a direção; coluna nova começa crescente */
  ordenarPor(campo: CampoOrdenacao): void {
    if (this.ordemCampo() === campo) {
      this.ordemDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.ordemCampo.set(campo);
      this.ordemDir.set('asc');
    }
  }

  editar(v: Venda): void {
    this.limparMensagens();
    this.edicao = { id: v.id, quantidade: v.quantidade, valor: v.valor, cupom: v.cupom, pago: v.pago };
    this.editandoId.set(v.id);
  }

  salvarEdicao(): void {
    if (!this.quantidadeValida(this.edicao.quantidade)) return;
    this.executar(this.vendaApi.alterar(this.edicao), (r) => {
      this.recarregar();
      this.sucesso.set(`Venda ${r.id} alterada com sucesso.`);
    });
  }

  alterarPorId(): void {
    if (this.alteracao.quantidade != null && !this.quantidadeValida(this.alteracao.quantidade)) return;
    this.executar(this.vendaApi.alterar(this.alteracao), (r) => {
      this.sucesso.set(`Venda ${r.id} alterada. Novo total: ${r.total.toFixed(2)}`);
    });
  }

  /** Coluna "Excluir" e botão "Excluir venda" */
  excluir(id: number): void {
    if (!confirm(`Excluir a venda ${id}? O saldo do cliente será ajustado.`)) return;
    this.executar(this.vendaApi.excluir(id), () => {
      this.recarregar();
      this.sucesso.set(`Venda ${id} excluída.`);
    });
  }
}
