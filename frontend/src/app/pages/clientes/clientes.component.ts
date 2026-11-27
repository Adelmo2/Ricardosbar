import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { ClienteService, mensagemErro } from '../../core/api.service';
import { Cliente, SaldoCliente } from '../../core/models';

const TITULOS: Record<string, string> = {
  listar: 'Clientes — listar todos',
  consultar: 'Clientes — consultar por nome',
  saldo: 'Clientes — saldo',
  cadastrar: 'Clientes — cadastrar',
  alterar: 'Clientes — alterar',
  ativar: 'Clientes — ativar',
  inativar: 'Clientes — inativar',
};

type CampoTexto = 'nome' | 'telefone' | 'cidade' | 'uf';
type CampoNumero = 'id' | 'limite' | 'saldo_pagar' | 'bloqueado';
type CampoOrdenacao = CampoTexto | CampoNumero;
const CAMPOS_TEXTO: readonly CampoOrdenacao[] = ['nome', 'telefone', 'cidade', 'uf'];

function clienteVazio(): Cliente {
  return {
    nome: '', telefone: '', endereco: '', bairro: '', cidade: '', uf: '',
    limite: 0, saldo_pagar: 0, bloqueado: 0, observacao: '', email: '',
  };
}

@Component({
  selector: 'app-clientes',
  imports: [FormsModule, DecimalPipe, DatePipe, NgTemplateOutlet],
  template: `
    <h2>{{ titulo() }}</h2>

    @if (erro()) { <div class="msg erro">{{ erro() }}</div> }
    @if (sucesso()) { <div class="msg ok">{{ sucesso() }}</div> }

    @switch (acao()) {
      @case ('listar') {
        <form class="linha" (ngSubmit)="listar()">
          <label>Nome do cliente
            <input name="filtroNome" [(ngModel)]="filtroNome" placeholder="Parte do nome (vazio = todos)" maxlength="40" />
          </label>
          <button type="submit" [disabled]="carregando()">Pesquisar</button>
          <button type="button" class="secundario" (click)="limparFiltro()" [disabled]="!filtroNome">Limpar</button>
        </form>
        <div class="tabela-wrap">
          <table [attr.aria-busy]="carregando()">
            <thead>
              <tr>
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'id', rotulo: 'ID', num: false }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'nome', rotulo: 'Nome', num: false }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'telefone', rotulo: 'Telefone', num: false }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'cidade', rotulo: 'Cidade', num: false }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'uf', rotulo: 'UF', num: false }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'limite', rotulo: 'Limite', num: true }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'saldo_pagar', rotulo: 'Saldo a pagar', num: true }" />
                <ng-container *ngTemplateOutlet="thOrdenavel; context: { campo: 'bloqueado', rotulo: 'Situação', num: false }" />
                <th>Alterar</th><th>Ação</th>
              </tr>
            </thead>
            <tbody>
              @if (carregando()) {
                @for (l of linhasSkeleton; track l) {
                  <tr class="skeleton-linha" aria-hidden="true">
                    @for (c of colunasSkeleton; track $index) { <td><span class="skeleton"></span></td> }
                  </tr>
                }
              } @else {
              @for (c of listaOrdenada(); track c.id) {
                <tr [class.inativo]="c.bloqueado === 1">
                  <td>{{ c.id }}</td><td>{{ c.nome }}</td><td>{{ c.telefone }}</td>
                  <td>{{ c.cidade }}</td><td>{{ c.uf }}</td>
                  <td class="num">{{ c.limite | number: '1.2-2' }}</td>
                  <td class="num">{{ c.saldo_pagar | number: '1.2-2' }}</td>
                  <td>{{ c.bloqueado === 1 ? 'Inativo' : 'Ativo' }}</td>
                  <td><button class="secundario pequeno" (click)="irParaAlterar(c.id!)">Alterar</button></td>
                  <td>
                    @if (c.bloqueado === 1) {
                      <button class="secundario pequeno" (click)="ativar(c.id!)">Ativar</button>
                    } @else {
                      <button class="perigo pequeno" (click)="inativar(c.id!)">Inativar</button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="10">Nenhum cliente encontrado.</td></tr>
              }
              }
            </tbody>
            @if (!carregando() && lista().length) {
              <tfoot>
                <tr class="total">
                  <td colspan="6">Total ({{ lista().length }} {{ lista().length === 1 ? 'cliente' : 'clientes' }})</td>
                  <td class="num">{{ totalSaldo() | number: '1.2-2' }}</td>
                  <td colspan="3"></td>
                </tr>
              </tfoot>
            }
          </table>
        </div>
      }

      @case ('consultar') {
        <div class="linha">
          <label>Nome do cliente <input type="text" [(ngModel)]="nome" (keyup.enter)="consultar()" /></label>
          <button (click)="consultar()" [disabled]="!nome.trim()">Consultar</button>
        </div>
        @for (c of detalhes(); track c.id) {
          <dl class="cartao detalhe">
            <dt>ID</dt><dd>{{ c.id }}</dd>
            <dt>Nome</dt><dd>{{ c.nome }}</dd>
            <dt>Telefone</dt><dd>{{ c.telefone }}</dd>
            <dt>Endereço</dt><dd>{{ c.endereco }}</dd>
            <dt>Bairro</dt><dd>{{ c.bairro }}</dd>
            <dt>Cidade/UF</dt><dd>{{ c.cidade }} / {{ c.uf }}</dd>
            <dt>E-mail</dt><dd>{{ c.email }}</dd>
            <dt>Limite</dt><dd>{{ c.limite | number: '1.2-2' }}</dd>
            <dt>Saldo a pagar</dt><dd>{{ c.saldo_pagar | number: '1.2-2' }}</dd>
            <dt>Último pagamento</dt><dd>{{ c.valor_ult_pagto | number: '1.2-2' }} em {{ c.dt_ult_pago | date: 'dd/MM/yyyy HH:mm' }}</dd>
            <dt>Primeira compra</dt><dd>{{ c.primeira_compra | date: 'dd/MM/yyyy HH:mm' }}</dd>
            <dt>Situação</dt><dd>{{ c.bloqueado === 1 ? 'Inativo' : 'Ativo' }}</dd>
            <dt>Observação</dt><dd>{{ c.observacao }}</dd>
          </dl>
        } @empty {
          @if (pesquisou()) { <p>Nenhum cliente encontrado.</p> }
        }
      }

      @case ('saldo') {
        <div class="linha">
          <label>Nome do cliente <input type="text" [(ngModel)]="nome" (keyup.enter)="consultarSaldo()" /></label>
          <button (click)="consultarSaldo()" [disabled]="!nome.trim()">Consultar saldo</button>
        </div>
        @for (s of saldos(); track s.id) {
          <dl class="cartao detalhe">
            <dt>ID</dt><dd>{{ s.id }}</dd>
            <dt>Nome</dt><dd>{{ s.nome }}</dd>
            <dt>Telefone</dt><dd>{{ s.telefone }}</dd>
            <dt>Limite</dt><dd>{{ s.limite | number: '1.2-2' }}</dd>
            <dt>Saldo a pagar</dt><dd><strong>{{ s.saldo_pagar | number: '1.2-2' }}</strong></dd>
          </dl>
        } @empty {
          @if (pesquisou()) { <p>Nenhum cliente encontrado.</p> }
        }
      }

      @case ('alterar') {
        <div class="linha">
          <label>ID do cliente <input type="number" [(ngModel)]="id" (keyup.enter)="carregarParaAlterar()" /></label>
          <button class="secundario" (click)="carregarParaAlterar()" [disabled]="!id">Carregar</button>
        </div>
        <ng-container *ngTemplateOutlet="formulario" />
      }

      @case ('cadastrar') {
        <ng-container *ngTemplateOutlet="formulario" />
      }

      @case ('ativar') {
        <div class="linha">
          <label>ID do cliente <input type="number" [(ngModel)]="id" /></label>
          <button (click)="ativar(id!)" [disabled]="!id">Ativar</button>
        </div>
      }

      @case ('inativar') {
        <div class="linha">
          <label>ID do cliente <input type="number" [(ngModel)]="id" /></label>
          <button class="perigo" (click)="inativar(id!)" [disabled]="!id">Inativar</button>
        </div>
      }
    }

    <ng-template #thOrdenavel let-campo="campo" let-rotulo="rotulo" let-num="num">
      <th class="ordenavel" [class.num]="num" tabindex="0" role="columnheader"
          [attr.aria-sort]="ordemCampo() === campo ? (ordemDir() === 'asc' ? 'ascending' : 'descending') : 'none'"
          [title]="'Ordenar por ' + rotulo"
          (click)="ordenarPor(campo)" (keydown.enter)="ordenarPor(campo)" (keydown.space)="$event.preventDefault(); ordenarPor(campo)">
        {{ rotulo }}<span class="seta" aria-hidden="true">{{ ordemCampo() === campo ? (ordemDir() === 'asc' ? '▲' : '▼') : '↕' }}</span>
      </th>
    </ng-template>

    <ng-template #formulario>
      @if (form(); as f) {
        <form class="cartao" (ngSubmit)="salvar()">
          <div class="form-grid">
            <label>Nome * <input name="nome" [(ngModel)]="f.nome" required maxlength="40" /></label>
            <label>Telefone <input name="telefone" [(ngModel)]="f.telefone" maxlength="15" /></label>
            <label>Endereço <input name="endereco" [(ngModel)]="f.endereco" maxlength="40" /></label>
            <label>Bairro <input name="bairro" [(ngModel)]="f.bairro" maxlength="40" /></label>
            <label>Cidade * <input name="cidade" [(ngModel)]="f.cidade" required maxlength="35" /></label>
            <label>UF <input name="uf" [(ngModel)]="f.uf" maxlength="2" /></label>
            <label>E-mail <input name="email" type="email" [(ngModel)]="f.email" maxlength="100" /></label>
            <label>Limite <input name="limite" type="number" step="0.01" [(ngModel)]="f.limite" /></label>
            @if (acao() === 'alterar' && f.id) {
              <label>Saldo a pagar <input name="saldo_pagar" [value]="(f.saldo_pagar ?? 0) | number: '1.2-2'" readonly disabled /></label>
            }
            <label>Observação <input name="observacao" [(ngModel)]="f.observacao" maxlength="150" /></label>
          </div>
          <button type="submit" [disabled]="!f.nome || !f.cidade">
            {{ acao() === 'alterar' ? 'Salvar alteração' : 'Cadastrar' }}
          </button>
        </form>
      }
    </ng-template>
  `,
})
export class ClientesComponent {
  private api = inject(ClienteService);
  private router = inject(Router);

  acao = input('listar');
  /** Query param ?id= (usado pelo botão "Alterar" da listagem para abrir o cliente já carregado) */
  idParam = input<string | undefined>(undefined, { alias: 'id' });
  titulo = signal('');
  erro = signal('');
  sucesso = signal('');

  id: number | null = null;
  lista = signal<Cliente[]>([]);
  /** Coluna e direção da ordenação da grade (clique no cabeçalho alterna crescente/decrescente) */
  ordemCampo = signal<CampoOrdenacao>('id');
  ordemDir = signal<'asc' | 'desc'>('desc');
  listaOrdenada = computed(() => {
    const campo = this.ordemCampo();
    const fator = this.ordemDir() === 'asc' ? 1 : -1;
    return [...this.lista()].sort((a, b) => {
      const r = CAMPOS_TEXTO.includes(campo)
        ? (a[campo as CampoTexto] ?? '').localeCompare(b[campo as CampoTexto] ?? '', 'pt-BR', { sensitivity: 'base', numeric: true })
        : (a[campo as CampoNumero] ?? 0) - (b[campo as CampoNumero] ?? 0);
      // desempate estável pelo ID, para a ordem não "pular" entre cliques
      return (r || (a.id ?? 0) - (b.id ?? 0)) * fator;
    });
  });
  /** Soma da coluna "Saldo a pagar" dos clientes exibidos (respeita o filtro por nome) */
  totalSaldo = computed(() => this.lista().reduce((s, c) => s + (c.saldo_pagar ?? 0), 0));
  nome = '';
  filtroNome = '';
  pesquisou = signal(false);
  /** true enquanto a listagem/pesquisa está em andamento: a tabela mostra o "Aguarde" em skeleton */
  carregando = signal(false);
  readonly linhasSkeleton = [1, 2, 3, 4, 5, 6];
  readonly colunasSkeleton = Array.from({ length: 10 });
  detalhes = signal<Cliente[]>([]);
  saldos = signal<SaldoCliente[]>([]);
  form = signal<Cliente | null>(null);

  constructor() {
    effect(() => {
      const a = this.acao();
      const idParam = this.idParam();
      untracked(() => this.iniciar(a, idParam));
    });
  }

  private iniciar(acao: string, idParam?: string): void {
    this.titulo.set(TITULOS[acao] ?? 'Clientes');
    this.limparMensagens();
    this.pesquisou.set(false);
    this.detalhes.set([]);
    this.saldos.set([]);
    this.form.set(acao === 'cadastrar' ? clienteVazio() : null);
    this.filtroNome = '';
    if (acao === 'listar') this.listar();
    const idNum = Number(idParam);
    if (acao === 'alterar' && idParam && Number.isInteger(idNum) && idNum > 0) {
      this.id = idNum;
      this.carregarParaAlterar();
    }
  }

  /** Abre a tela de alteração com o cliente da linha já carregado */
  irParaAlterar(id: number): void {
    this.router.navigate(['/home/clientes/alterar'], { queryParams: { id } });
  }

  private limparMensagens(): void {
    this.erro.set('');
    this.sucesso.set('');
  }

  private executar<T>(obs: Observable<T>, ok: (r: T) => void): void {
    this.limparMensagens();
    obs.subscribe({ next: ok, error: (e) => this.erro.set(mensagemErro(e)) });
  }

  /** Lista os clientes cujo nome contém o filtro (sem filtro, lista todos); a ordem segue o cabeçalho escolhido */
  listar(): void {
    const filtro = this.filtroNome.trim();
    const obs = filtro ? this.api.consultar(filtro) : this.api.listarTodos();
    this.carregando.set(true);
    this.executar(obs.pipe(finalize(() => this.carregando.set(false))), (r) => this.lista.set(r));
  }

  /** Clique no cabeçalho: mesma coluna inverte a direção; coluna nova começa crescente (ID começa decrescente) */
  ordenarPor(campo: CampoOrdenacao): void {
    if (this.ordemCampo() === campo) {
      this.ordemDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.ordemCampo.set(campo);
      this.ordemDir.set(campo === 'id' ? 'desc' : 'asc');
    }
  }

  limparFiltro(): void {
    this.filtroNome = '';
    this.listar();
  }

  consultar(): void {
    if (!this.nome.trim()) return;
    this.executar(this.api.consultar(this.nome), (r) => {
      this.detalhes.set(r);
      this.pesquisou.set(true);
    });
  }

  consultarSaldo(): void {
    if (!this.nome.trim()) return;
    this.executar(this.api.saldo(this.nome), (r) => {
      this.saldos.set(r);
      this.pesquisou.set(true);
    });
  }

  carregarParaAlterar(): void {
    this.form.set(null);
    this.executar(this.api.detalhar(this.id!), (r) => this.form.set({ ...r, limite: r.limite ?? 0 }));
  }

  salvar(): void {
    const f = this.form()!;
    if (this.acao() === 'alterar') {
      this.executar(this.api.alterar({ ...f, limite: f.limite ?? 0 }), (r) => {
        this.sucesso.set(`Cliente ${r.id} alterado com sucesso.`);
      });
    } else {
      this.executar(this.api.cadastrar({ ...f, limite: f.limite ?? 0 }), (r) => {
        this.sucesso.set(`Cliente cadastrado com ID ${r.id}.`);
        this.form.set(clienteVazio());
      });
    }
  }

  ativar(id: number): void {
    this.executar(this.api.ativar(id), () => {
      if (this.acao() === 'listar') this.listar();
      this.sucesso.set(`Cliente ${id} ativado.`);
    });
  }

  inativar(id: number): void {
    if (!confirm(`Inativar o cliente ${id}?`)) return;
    this.executar(this.api.inativar(id), () => {
      if (this.acao() === 'listar') this.listar();
      this.sucesso.set(`Cliente ${id} inativado.`);
    });
  }
}
