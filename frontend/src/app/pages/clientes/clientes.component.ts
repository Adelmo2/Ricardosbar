import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ClienteService, mensagemErro } from '../../core/api.service';
import { Cliente, SaldoCliente } from '../../core/models';

const TITULOS: Record<string, string> = {
  listar: 'Clientes — listar todos',
  consultar: 'Clientes — consultar por ID',
  saldo: 'Clientes — saldo',
  cadastrar: 'Clientes — cadastrar',
  alterar: 'Clientes — alterar',
  ativar: 'Clientes — ativar',
  inativar: 'Clientes — inativar',
};

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
        <div class="linha"><button class="secundario" (click)="listar()">Atualizar</button></div>
        <div class="tabela-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Nome</th><th>Telefone</th><th>Cidade</th><th>UF</th>
                <th class="num">Limite</th><th class="num">Saldo a pagar</th><th>Situação</th><th>Ação</th>
              </tr>
            </thead>
            <tbody>
              @for (c of lista(); track c.id) {
                <tr [class.inativo]="c.bloqueado === 1">
                  <td>{{ c.id }}</td><td>{{ c.nome }}</td><td>{{ c.telefone }}</td>
                  <td>{{ c.cidade }}</td><td>{{ c.uf }}</td>
                  <td class="num">{{ c.limite | number: '1.2-2' }}</td>
                  <td class="num">{{ c.saldo_pagar | number: '1.2-2' }}</td>
                  <td>{{ c.bloqueado === 1 ? 'Inativo' : 'Ativo' }}</td>
                  <td>
                    @if (c.bloqueado === 1) {
                      <button class="secundario pequeno" (click)="ativar(c.id!)">Ativar</button>
                    } @else {
                      <button class="perigo pequeno" (click)="inativar(c.id!)">Inativar</button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="9">Nenhum cliente encontrado.</td></tr>
              }
            </tbody>
          </table>
        </div>
      }

      @case ('consultar') {
        <div class="linha">
          <label>ID do cliente <input type="number" [(ngModel)]="id" (keyup.enter)="consultar()" /></label>
          <button (click)="consultar()" [disabled]="!id">Consultar</button>
          <button class="secundario" (click)="detalhar()" [disabled]="!id">Detalhar (/clientes/id)</button>
        </div>
        @if (detalhe(); as c) {
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
        }
      }

      @case ('saldo') {
        <div class="linha">
          <label>ID do cliente <input type="number" [(ngModel)]="id" (keyup.enter)="consultarSaldo()" /></label>
          <button (click)="consultarSaldo()" [disabled]="!id">Consultar saldo</button>
        </div>
        @if (saldo(); as s) {
          <dl class="cartao detalhe">
            <dt>ID</dt><dd>{{ s.id }}</dd>
            <dt>Nome</dt><dd>{{ s.nome }}</dd>
            <dt>Telefone</dt><dd>{{ s.telefone }}</dd>
            <dt>Limite</dt><dd>{{ s.limite | number: '1.2-2' }}</dd>
            <dt>Saldo a pagar</dt><dd><strong>{{ s.saldo_pagar | number: '1.2-2' }}</strong></dd>
          </dl>
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

  acao = input('listar');
  titulo = signal('');
  erro = signal('');
  sucesso = signal('');

  id: number | null = null;
  lista = signal<Cliente[]>([]);
  detalhe = signal<Cliente | null>(null);
  saldo = signal<SaldoCliente | null>(null);
  form = signal<Cliente | null>(null);

  constructor() {
    effect(() => {
      const a = this.acao();
      untracked(() => this.iniciar(a));
    });
  }

  private iniciar(acao: string): void {
    this.titulo.set(TITULOS[acao] ?? 'Clientes');
    this.limparMensagens();
    this.detalhe.set(null);
    this.saldo.set(null);
    this.form.set(acao === 'cadastrar' ? clienteVazio() : null);
    if (acao === 'listar') this.listar();
  }

  private limparMensagens(): void {
    this.erro.set('');
    this.sucesso.set('');
  }

  private executar<T>(obs: Observable<T>, ok: (r: T) => void): void {
    this.limparMensagens();
    obs.subscribe({ next: ok, error: (e) => this.erro.set(mensagemErro(e)) });
  }

  listar(): void {
    this.executar(this.api.listarTodos(), (r) => this.lista.set(r));
  }

  consultar(): void {
    this.executar(this.api.consultar(this.id!), (r) => this.detalhe.set(r));
  }

  detalhar(): void {
    this.executar(this.api.detalhar(this.id!), (r) => this.detalhe.set(r));
  }

  consultarSaldo(): void {
    this.executar(this.api.saldo(this.id!), (r) => this.saldo.set(r));
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
