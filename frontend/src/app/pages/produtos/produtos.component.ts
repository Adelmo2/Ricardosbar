import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProdutoService, lerPagina, mensagemErro } from '../../core/api.service';
import { Produto } from '../../core/models';

const TITULOS: Record<string, string> = {
  listar: 'Produtos — listar todos',
  ativos: 'Produtos — listar ativos',
  inativos: 'Produtos — listar inativos',
  consultar: 'Produtos — consultar por ID',
  pesquisar: 'Produtos — pesquisar por nome',
  cadastrar: 'Produtos — cadastrar',
  alterar: 'Produtos — alterar',
  ativar: 'Produtos — ativar',
  inativar: 'Produtos — inativar',
};

function produtoVazio(): Produto {
  return { descricao: '', preco: null, casco: 0, bloqueado: 0 };
}

@Component({
  selector: 'app-produtos',
  imports: [FormsModule, DecimalPipe, NgTemplateOutlet],
  template: `
    <h2>{{ titulo() }}</h2>

    @if (erro()) { <div class="msg erro">{{ erro() }}</div> }
    @if (sucesso()) { <div class="msg ok">{{ sucesso() }}</div> }

    @switch (acao()) {
      @case ('listar') {
        <div class="linha"><button class="secundario" (click)="listar()">Atualizar</button></div>
        <ng-container *ngTemplateOutlet="tabela" />
      }

      @case ('ativos') {
        <ng-container *ngTemplateOutlet="paginacao" />
        <ng-container *ngTemplateOutlet="tabela" />
      }

      @case ('inativos') {
        <ng-container *ngTemplateOutlet="paginacao" />
        <ng-container *ngTemplateOutlet="tabela" />
      }

      @case ('pesquisar') {
        <div class="linha">
          <label>Nome do produto <input [(ngModel)]="nome" (keyup.enter)="pesquisar()" /></label>
          <button (click)="pesquisar()" [disabled]="!nome.trim()">Pesquisar</button>
        </div>
        <ng-container *ngTemplateOutlet="tabela" />
      }

      @case ('consultar') {
        <div class="linha">
          <label>ID do produto <input type="number" [(ngModel)]="id" (keyup.enter)="consultar()" /></label>
          <button (click)="consultar()" [disabled]="!id">Consultar</button>
        </div>
        @if (detalhe(); as p) {
          <dl class="cartao detalhe">
            <dt>ID</dt><dd>{{ p.id }}</dd>
            <dt>Descrição</dt><dd>{{ p.descricao }}</dd>
            <dt>Preço</dt><dd>{{ p.preco | number: '1.2-2' }}</dd>
            <dt>Casco</dt><dd>{{ p.casco === 1 ? 'Sim' : 'Não' }}</dd>
            <dt>Situação</dt><dd>{{ p.bloqueado === 1 ? 'Inativo' : 'Ativo' }}</dd>
          </dl>
        }
      }

      @case ('cadastrar') {
        <ng-container *ngTemplateOutlet="formulario" />
      }

      @case ('alterar') {
        <div class="linha">
          <label>ID do produto <input type="number" [(ngModel)]="id" (keyup.enter)="carregarParaAlterar()" /></label>
          <button class="secundario" (click)="carregarParaAlterar()" [disabled]="!id">Carregar</button>
        </div>
        <ng-container *ngTemplateOutlet="formulario" />
      }

      @case ('ativar') {
        <div class="linha">
          <label>ID do produto <input type="number" [(ngModel)]="id" /></label>
          <button (click)="ativar(id!)" [disabled]="!id">Ativar</button>
        </div>
      }

      @case ('inativar') {
        <div class="linha">
          <label>ID do produto <input type="number" [(ngModel)]="id" /></label>
          <button class="perigo" (click)="inativar(id!)" [disabled]="!id">Inativar</button>
        </div>
      }
    }

    <ng-template #paginacao>
      <div class="linha">
        <button class="secundario" (click)="irPagina(pagina() - 1)" [disabled]="pagina() === 0">‹ Anterior</button>
        <span>Página {{ pagina() + 1 }} de {{ totalPaginas() || 1 }}</span>
        <button class="secundario" (click)="irPagina(pagina() + 1)" [disabled]="pagina() + 1 >= totalPaginas()">Próxima ›</button>
      </div>
    </ng-template>

    <ng-template #tabela>
      <div class="tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Descrição</th><th class="num">Preço</th><th>Casco</th><th>Situação</th>
              @if (acao() === 'listar') { <th>Alterar</th> }
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            @for (p of lista(); track p.id) {
              <tr [class.inativo]="p.bloqueado === 1">
                <td>{{ p.id }}</td>
                <td>{{ p.descricao }}</td>
                <td class="num">{{ p.preco | number: '1.2-2' }}</td>
                <td>{{ p.casco === 1 ? 'Sim' : 'Não' }}</td>
                <td>{{ p.bloqueado === 1 ? 'Inativo' : 'Ativo' }}</td>
                @if (acao() === 'listar') {
                  <td>
                    <button class="secundario pequeno alterar" (click)="irParaAlterar(p.id!)" title="Alterar o produto">
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" fill="none" stroke="currentColor"
                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      Alterar
                    </button>
                  </td>
                }
                <td>
                  @if (p.bloqueado === 1) {
                    <button class="secundario pequeno" (click)="ativar(p.id!)">Ativar</button>
                  } @else {
                    <button class="perigo pequeno" (click)="inativar(p.id!)">Inativar</button>
                  }
                </td>
              </tr>
            } @empty {
              <tr><td [attr.colspan]="acao() === 'listar' ? 7 : 6">Nenhum produto encontrado.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </ng-template>

    <ng-template #formulario>
      @if (form(); as f) {
        <form class="cartao" (ngSubmit)="salvar()">
          <div class="form-grid">
            <label>Descrição * <input name="descricao" [(ngModel)]="f.descricao" required maxlength="50" /></label>
            <label>Preço * <input name="preco" type="number" step="0.01" [(ngModel)]="f.preco" required /></label>
            <label>Casco
              <select name="casco" [(ngModel)]="f.casco">
                <option [ngValue]="0">Não</option>
                <option [ngValue]="1">Sim</option>
              </select>
            </label>
            <label>Situação
              <select name="bloqueado" [(ngModel)]="f.bloqueado">
                <option [ngValue]="0">Ativo</option>
                <option [ngValue]="1">Inativo</option>
              </select>
            </label>
          </div>
          <button type="submit" [disabled]="!f.descricao || f.preco === null">
            {{ acao() === 'alterar' ? 'Salvar alteração' : 'Cadastrar' }}
          </button>
        </form>
      }
    </ng-template>
  `,
  styles: `
    button.alterar { display: inline-flex; align-items: center; gap: 5px; }
    button.alterar svg { flex-shrink: 0; }
  `,
})
export class ProdutosComponent {
  private api = inject(ProdutoService);
  private router = inject(Router);

  acao = input('listar');
  /** Query param ?id= (usado pelo botão "Alterar" da listagem para abrir o produto já carregado) */
  idParam = input<string | undefined>(undefined, { alias: 'id' });
  titulo = signal('');
  erro = signal('');
  sucesso = signal('');

  id: number | null = null;
  nome = '';
  lista = signal<Produto[]>([]);
  detalhe = signal<Produto | null>(null);
  form = signal<Produto | null>(null);
  pagina = signal(0);
  totalPaginas = signal(0);

  constructor() {
    effect(() => {
      const a = this.acao();
      const idParam = this.idParam();
      untracked(() => this.iniciar(a, idParam));
    });
  }

  private iniciar(acao: string, idParam?: string): void {
    this.titulo.set(TITULOS[acao] ?? 'Produtos');
    this.limparMensagens();
    this.lista.set([]);
    this.detalhe.set(null);
    this.pagina.set(0);
    this.form.set(acao === 'cadastrar' ? produtoVazio() : null);
    this.recarregar();
    const idNum = Number(idParam);
    if (acao === 'alterar' && idParam && Number.isInteger(idNum) && idNum > 0) {
      this.id = idNum;
      this.carregarParaAlterar();
    }
  }

  /** Abre a tela de alteração com o produto da linha já carregado */
  irParaAlterar(id: number): void {
    this.router.navigate(['/home/produtos/alterar'], { queryParams: { id } });
  }

  private limparMensagens(): void {
    this.erro.set('');
    this.sucesso.set('');
  }

  private executar<T>(obs: Observable<T>, ok: (r: T) => void): void {
    this.limparMensagens();
    obs.subscribe({ next: ok, error: (e) => this.erro.set(mensagemErro(e)) });
  }

  /** Recarrega a listagem da ação corrente (se for uma ação de listagem) */
  private recarregar(): void {
    switch (this.acao()) {
      case 'listar': return this.listar();
      case 'ativos':
      case 'inativos': return this.irPagina(this.pagina());
      case 'pesquisar': if (this.nome.trim()) this.pesquisar(); return;
    }
  }

  listar(): void {
    this.executar(this.api.listarTodos(), (r) => this.lista.set(r));
  }

  irPagina(n: number): void {
    const obs = this.acao() === 'inativos' ? this.api.listarInativos(n) : this.api.listarAtivos(n);
    this.executar(obs, (r) => {
      const { itens, totalPaginas } = lerPagina(r);
      this.lista.set(itens);
      this.pagina.set(n);
      this.totalPaginas.set(totalPaginas);
    });
  }

  pesquisar(): void {
    this.executar(this.api.pesquisarNome(this.nome.trim()), (r) => this.lista.set(r));
  }

  consultar(): void {
    this.executar(this.api.consultar(this.id!), (r) => this.detalhe.set(r));
  }

  carregarParaAlterar(): void {
    this.form.set(null);
    this.executar(this.api.consultar(this.id!), (r) => this.form.set({ ...r }));
  }

  salvar(): void {
    const f = this.form()!;
    if (this.acao() === 'alterar') {
      this.executar(this.api.alterar(f), (r) => this.sucesso.set(`Produto ${r.id} alterado com sucesso.`));
    } else {
      this.executar(this.api.cadastrar(f), (r) => {
        this.sucesso.set(`Produto cadastrado com ID ${r.id}.`);
        this.form.set(produtoVazio());
      });
    }
  }

  ativar(id: number): void {
    this.executar(this.api.ativar(id), () => {
      this.recarregar();
      this.sucesso.set(`Produto ${id} ativado.`);
    });
  }

  inativar(id: number): void {
    if (!confirm(`Inativar o produto ${id}?`)) return;
    this.executar(this.api.inativar(id), () => {
      this.recarregar();
      this.sucesso.set(`Produto ${id} inativado.`);
    });
  }
}
