import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';

interface Botao {
  rotulo: string;
  rota: string;
  metodo: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <strong>Ricardo's Bar</strong>
      <span class="usuario">
        {{ auth.usuario()?.login }}
        <button class="secundario pequeno" (click)="auth.sair()">Sair</button>
      </span>
    </header>

    <div class="corpo">
      <nav>
        @for (grupo of grupos; track grupo.titulo) {
          <section>
            <h3>{{ grupo.titulo }}</h3>
            @for (b of grupo.botoes; track b.rota) {
              <a class="botao" [routerLink]="b.rota" routerLinkActive="ativo">
                <span class="metodo" [attr.data-m]="b.metodo">{{ b.metodo }}</span>
                {{ b.rotulo }}
              </a>
            }
          </section>
        }
      </nav>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 16px; background: var(--primary); color: #fff;
    }
    header strong { font-size: 1.15rem; }
    .usuario { display: flex; gap: 10px; align-items: center; }
    .usuario button { color: #fff; border-color: #fff; }
    .usuario button:hover { background: rgba(255,255,255,.15); }
    .corpo { display: flex; flex: 1; min-height: 0; }
    nav {
      width: 250px; flex-shrink: 0; background: var(--sidebar); color: var(--sidebar-text);
      padding: 12px; overflow-y: auto;
    }
    h3 { font-size: .75rem; text-transform: uppercase; letter-spacing: .08em; opacity: .7; margin: 14px 4px 6px; }
    .botao {
      display: flex; align-items: center; gap: 8px; padding: 7px 8px; margin-bottom: 4px;
      border-radius: 6px; color: var(--sidebar-text); text-decoration: none; font-size: .9rem;
      border: 1px solid rgba(255,255,255,.12);
    }
    .botao:hover { background: rgba(255,255,255,.08); }
    .botao.ativo { background: var(--primary); border-color: var(--primary); }
    .metodo {
      font-size: .65rem; font-weight: 700; width: 46px; text-align: center; padding: 2px 0;
      border-radius: 4px; background: #3d6fb6; color: #fff;
    }
    .metodo[data-m='POST'] { background: #2e8b57; }
    .metodo[data-m='PUT'] { background: #c58a12; }
    .metodo[data-m='DELETE'] { background: #b3261e; }
    main { flex: 1; padding: 20px; overflow-x: hidden; min-width: 0; }
    @media (max-width: 760px) {
      .corpo { flex-direction: column; }
      nav { width: 100%; }
      main { padding: 16px; }
    }
  `,
})
export class HomeComponent {
  auth = inject(AuthService);

  grupos: { titulo: string; botoes: Botao[] }[] = [
    {
      titulo: 'Clientes',
      botoes: [
        { rotulo: 'Listar todos', rota: 'clientes/listar', metodo: 'GET' },
        { rotulo: 'Consultar por nome', rota: 'clientes/consultar', metodo: 'GET' },
        { rotulo: 'Saldo do cliente', rota: 'clientes/saldo', metodo: 'GET' },
        { rotulo: 'Cadastrar', rota: 'clientes/cadastrar', metodo: 'POST' },
        { rotulo: 'Alterar', rota: 'clientes/alterar', metodo: 'PUT' },
        { rotulo: 'Ativar', rota: 'clientes/ativar', metodo: 'POST' },
        { rotulo: 'Inativar', rota: 'clientes/inativar', metodo: 'DELETE' },
      ],
    },
    {
      titulo: 'Produtos',
      botoes: [
        { rotulo: 'Listar todos', rota: 'produtos/listar', metodo: 'GET' },
        { rotulo: 'Listar ativos', rota: 'produtos/ativos', metodo: 'GET' },
        { rotulo: 'Listar inativos', rota: 'produtos/inativos', metodo: 'GET' },
        { rotulo: 'Consultar por ID', rota: 'produtos/consultar', metodo: 'GET' },
        { rotulo: 'Pesquisar por nome', rota: 'produtos/pesquisar', metodo: 'GET' },
        { rotulo: 'Cadastrar', rota: 'produtos/cadastrar', metodo: 'POST' },
        { rotulo: 'Alterar', rota: 'produtos/alterar', metodo: 'PUT' },
        { rotulo: 'Ativar', rota: 'produtos/ativar', metodo: 'POST' },
        { rotulo: 'Inativar', rota: 'produtos/inativar', metodo: 'DELETE' },
      ],
    },
    {
      titulo: 'Vendas',
      botoes: [
        { rotulo: 'Listar todas', rota: 'vendas/listar', metodo: 'GET' },
        { rotulo: 'Vendas por cliente', rota: 'vendas/por-cliente', metodo: 'GET' },
        { rotulo: 'Vendas por produto', rota: 'vendas/por-produto', metodo: 'GET' },
        { rotulo: 'Cadastrar venda', rota: 'vendas/cadastrar', metodo: 'POST' },
        { rotulo: 'Alterar venda', rota: 'vendas/alterar', metodo: 'PUT' },
        { rotulo: 'Excluir venda', rota: 'vendas/excluir', metodo: 'DELETE' },
      ],
    },
  ];
}
