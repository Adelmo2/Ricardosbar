import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
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

function vendaVazia(): CadastroVenda {
  return { id_clientes: null, id_produtos: null, quantidade: 1, valor: null, cupom: 0, pago: 0 };
}

function alteracaoVazia(): AtualizacaoVenda {
  return { id: null as unknown as number, quantidade: null, valor: null, cupom: null, pago: null };
}

@Component({
  selector: 'app-vendas',
  imports: [FormsModule, DecimalPipe, DatePipe, NgTemplateOutlet],
  template: `
    <h2>{{ titulo() }}</h2>

    @if (erro()) { <div class="msg erro">{{ erro() }}</div> }
    @if (sucesso()) { <div class="msg ok">{{ sucesso() }}</div> }

    @switch (acao()) {
      @case ('listar') {
        <form class="linha" (ngSubmit)="recarregar()">
          <label>Nome do cliente
            <input name="filtroNome" [(ngModel)]="filtroNome" placeholder="Parte do nome (vazio = todas)" maxlength="40" />
          </label>
          <button type="submit">Pesquisar</button>
          <button type="button" class="secundario" (click)="limparFiltro()" [disabled]="!filtroNome">Limpar</button>
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
              <select name="cliente" [(ngModel)]="nova.id_clientes" required>
                <option [ngValue]="null">Selecione...</option>
                @for (c of clientesAtivos(); track c.id) {
                  <option [ngValue]="c.id">{{ c.id }} — {{ c.nome }} (saldo: {{ (c.saldo_pagar ?? 0) | number: '1.2-2' }})</option>
                }
              </select>
            </label>
            <label>Produto *
              <select name="produto" [(ngModel)]="nova.id_produtos" (ngModelChange)="aoEscolherProduto($event)" required>
                <option [ngValue]="null">Selecione...</option>
                @for (p of produtosAtivos(); track p.id) {
                  <option [ngValue]="p.id">{{ p.id }} — {{ p.descricao }}</option>
                }
              </select>
            </label>
            <label>Quantidade <input name="quantidade" type="number" step="0.01" [(ngModel)]="nova.quantidade" /></label>
            <label>Valor unitário <input name="valor" type="number" step="0.01" [(ngModel)]="nova.valor" /></label>
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
            · O produto de ID 1 é tratado pela API como pagamento (abate o valor do saldo do cliente).
          </p>
          <button type="submit" [disabled]="!nova.id_clientes || !nova.id_produtos">Cadastrar venda</button>
        </form>
      }

      @case ('alterar') {
        <form class="cartao" (ngSubmit)="alterarPorId()">
          <p class="dica">Informe o ID da venda e apenas os campos que deseja alterar. Também é possível alterar pela coluna "Alterar" na lista de vendas.</p>
          <div class="form-grid">
            <label>ID da venda * <input name="id" type="number" [(ngModel)]="alteracao.id" required /></label>
            <label>Quantidade <input name="quantidade" type="number" step="0.01" [(ngModel)]="alteracao.quantidade" /></label>
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
          <button type="submit" [disabled]="!alteracao.id">Salvar alteração</button>
        </form>
      }

      @case ('excluir') {
        <div class="linha">
          <label>ID da venda <input type="number" [(ngModel)]="filtroId" /></label>
          <button class="perigo" (click)="excluir(filtroId!)" [disabled]="!filtroId">Excluir</button>
        </div>
      }
    }

    <ng-template #tabela>
      <div class="tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Cliente</th><th>Produto</th>
              <th class="num">Qtde</th><th class="num">Valor</th><th class="num">Total</th>
              <th>Data</th><th>Cupom</th><th>Pago</th>
              <th>Alterar</th><th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            @for (v of vendas(); track v.id) {
              @if (editandoId() === v.id) {
                <tr class="editando">
                  <td>{{ v.id }}</td>
                  <td>{{ v.nome_cliente }}</td>
                  <td>{{ v.descricao_produto }}</td>
                  <td><input type="number" step="0.01" [(ngModel)]="edicao.quantidade" /></td>
                  <td><input type="number" step="0.01" [(ngModel)]="edicao.valor" /></td>
                  <td class="num">{{ (edicao.quantidade ?? 0) * (edicao.valor ?? 0) | number: '1.2-2' }}</td>
                  <td>{{ v.data_pagamento | date: 'dd/MM/yyyy HH:mm' }}</td>
                  <td>
                    <select [(ngModel)]="edicao.cupom"><option [ngValue]="0">Não</option><option [ngValue]="1">Sim</option></select>
                  </td>
                  <td>
                    <select [(ngModel)]="edicao.pago"><option [ngValue]="0">Não</option><option [ngValue]="1">Sim</option></select>
                  </td>
                  <td class="acoes">
                    <button class="pequeno" (click)="salvarEdicao()">Salvar</button>
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
                  <td>{{ v.data_pagamento | date: 'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ v.cupom === 1 ? 'Sim' : 'Não' }}</td>
                  <td>{{ v.pago === 1 ? 'Sim' : 'Não' }}</td>
                  <td><button class="secundario pequeno" (click)="editar(v)">Alterar</button></td>
                  <td><button class="perigo pequeno" (click)="excluir(v.id)">Excluir</button></td>
                </tr>
              }
            } @empty {
              <tr><td colspan="11">Nenhuma venda encontrada.</td></tr>
            }
          </tbody>
          @if (vendas().length) {
            <tfoot>
              <tr><th colspan="5">Total geral</th><th class="num">{{ totalGeral() | number: '1.2-2' }}</th><th colspan="5"></th></tr>
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
    tr.negativa td { color: #0d47a1; font-weight: bold; }
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
  clientesAtivos = computed(() => this.clientes().filter((c) => c.bloqueado !== 1));
  produtosAtivos = computed(() => this.produtos().filter((p) => p.bloqueado !== 1));
  totalGeral = computed(() => this.vendas().reduce((s, v) => s + (v.total ?? 0), 0));

  filtroId: number | null = null;
  filtroNome = '';
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
    this.filtroId = null;
    this.filtroNome = '';
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
        obs = this.filtroNome.trim() ? this.vendaApi.porCliente(this.filtroNome) : this.vendaApi.listarTodas();
        break;
      case 'por-cliente':
        if (this.filtroNome.trim()) { obs = this.vendaApi.porCliente(this.filtroNome); this.pesquisouCliente = true; }
        break;
      case 'por-produto': if (this.filtroId) obs = this.vendaApi.porProduto(this.filtroId); break;
    }
    if (!obs) return;
    this.limparMensagens();
    obs.subscribe({
      next: (r) => this.vendas.set(r),
      // a API responde com erro quando nenhum cliente casa com o nome: não deixa a lista anterior na tela
      error: (e) => { this.vendas.set([]); this.erro.set(mensagemErro(e)); },
    });
  }

  limparFiltro(): void {
    this.filtroNome = '';
    this.recarregar();
  }

  aoEscolherProduto(id: number | null): void {
    const p = this.produtos().find((x) => x.id === id);
    if (p) this.nova.valor = p.preco;
  }

  cadastrar(): void {
    this.executar(this.vendaApi.cadastrar(this.nova), () => {
      this.sucesso.set('Venda cadastrada com sucesso.');
      this.nova = vendaVazia();
      // recarrega os clientes para refletir o saldo a pagar atualizado
      this.clienteApi.listarTodos().subscribe({ next: (c) => this.clientes.set(c) });
    });
  }

  /** Coluna "Alterar": abre a linha em modo de edição */
  editar(v: Venda): void {
    this.limparMensagens();
    this.edicao = { id: v.id, quantidade: v.quantidade, valor: v.valor, cupom: v.cupom, pago: v.pago };
    this.editandoId.set(v.id);
  }

  salvarEdicao(): void {
    this.executar(this.vendaApi.alterar(this.edicao), (r) => {
      this.recarregar();
      this.sucesso.set(`Venda ${r.id} alterada com sucesso.`);
    });
  }

  alterarPorId(): void {
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
