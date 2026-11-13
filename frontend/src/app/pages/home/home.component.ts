import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';

interface Botao {
  rotulo: string;
  rota: string;
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
            <h3 [class.destaque]="grupo.destaque">{{ grupo.titulo }}</h3>
            @for (b of grupo.botoes; track b.rota) {
              <a class="botao" [routerLink]="b.rota" routerLinkActive="ativo">
                {{ b.rotulo }}
              </a>
            }
          </section>
        }
      </nav>
      <main>
        <button type="button" class="secundario voltar" (click)="voltar()" title="Voltar para a tela anterior">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="currentColor" />
            <path d="M13 6.5 7.5 12l5.5 5.5M8 12h9" fill="none" stroke="#fff" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Voltar
        </button>
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
    h3.destaque {
      color: #00008b; font-weight: 700; opacity: 1; font-size: 1.05rem;
      background: #f5f0e1; padding: 5px 8px; border-radius: 4px; margin-left: 0; margin-right: 0;
    }
    .botao {
      display: flex; align-items: center; gap: 8px; padding: 7px 8px; margin-bottom: 4px;
      border-radius: 6px; color: var(--sidebar-text); text-decoration: none; font-size: .9rem;
      border: 1px solid rgba(255,255,255,.12);
    }
    .botao:hover { background: rgba(255,255,255,.08); }
    .botao.ativo { background: var(--primary); border-color: var(--primary); }
    main { flex: 1; padding: 20px; overflow-x: hidden; min-width: 0; }
    .voltar {
      display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px;
      padding: 5px 12px 5px 6px; font-weight: 600;
    }
    .voltar svg { flex-shrink: 0; }
    @media (max-width: 760px) {
      .corpo { flex-direction: column; }
      nav { width: 100%; }
      main { padding: 16px; }
    }
  `,
})
export class HomeComponent {
  auth = inject(AuthService);
  private location = inject(Location);

  /** Retorna para a tela visitada anteriormente (histórico do navegador). */
  voltar(): void {
    this.location.back();
  }

  grupos: { titulo: string; destaque?: boolean; botoes: Botao[] }[] = [
    {
      titulo: 'C L I E N T E S',
      destaque: true,
      botoes: [
        { rotulo: 'Listar todos', rota: 'clientes/listar' },
        { rotulo: 'Consultar por nome', rota: 'clientes/consultar' },
        { rotulo: 'Cadastrar', rota: 'clientes/cadastrar' },
        { rotulo: 'Alterar', rota: 'clientes/alterar' },
        { rotulo: 'Ativar', rota: 'clientes/ativar' },
        { rotulo: 'Inativar', rota: 'clientes/inativar' },
      ],
    },
    {
      titulo: 'P R O D U T O S',
      destaque: true,
      botoes: [
        { rotulo: 'Listar todos', rota: 'produtos/listar' },
        { rotulo: 'Listar ativos', rota: 'produtos/ativos' },
        { rotulo: 'Listar inativos', rota: 'produtos/inativos' },
        { rotulo: 'Pesquisar por nome', rota: 'produtos/pesquisar' },
        { rotulo: 'Cadastrar', rota: 'produtos/cadastrar' },
        { rotulo: 'Alterar', rota: 'produtos/alterar' },
        { rotulo: 'Ativar', rota: 'produtos/ativar' },
        { rotulo: 'Inativar', rota: 'produtos/inativar' },
      ],
    },
    {
      titulo: 'V E N D A S',
      destaque: true,
      botoes: [
        { rotulo: 'Listar todas', rota: 'vendas/listar' },
        { rotulo: 'Vendas por cliente', rota: 'vendas/por-cliente' },
        { rotulo: 'Vendas por produto', rota: 'vendas/por-produto' },
        { rotulo: 'Cadastro de Venda e Pagamento', rota: 'vendas/cadastrar' },
        { rotulo: 'Alterar venda', rota: 'vendas/alterar' },
      ],
    },
  ];
}
