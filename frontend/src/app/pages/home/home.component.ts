import { Location, UpperCasePipe } from '@angular/common';
import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';

const CHAVE_ZOOM = 'ricardosbar.zoom';

function lerZoomSalvo(): number {
  try {
    const z = Number(localStorage.getItem(CHAVE_ZOOM));
    return z >= 0.5 && z <= 2 ? z : 1;
  } catch {
    return 1;
  }
}

interface Botao {
  rotulo: string;
  rota: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UpperCasePipe],
  template: `
    <header>
      <strong>Ricardo's Bar</strong>
      <span class="zooms">
        <button type="button" class="secundario zoom" (click)="alterarZoom(0.1)"
                [disabled]="zoom() >= ZOOM_MAX" title="Aumentar o zoom ({{ zoomPct() }}%)" aria-label="Aumentar o zoom">+</button>
        <button type="button" class="secundario zoom" (click)="alterarZoom(-0.1)"
                [disabled]="zoom() <= ZOOM_MIN" title="Diminuir o zoom ({{ zoomPct() }}%)" aria-label="Diminuir o zoom">−</button>
        <button type="button" class="secundario tela-inteira" (click)="alternarTelaInteira()"
                [title]="telaInteira() ? 'Sair da tela inteira' : 'Colocar o navegador em tela inteira'">
          {{ telaInteira() ? 'Sair da Tela Inteira' : 'Tela Inteira' }}
        </button>
      </span>
      <span class="usuario">
        {{ auth.usuario()?.login | uppercase }}
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
    :host { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    header {
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px;
      padding: 10px 16px; background: var(--primary); color: #fff;
    }
    header strong { font-size: 1.15rem; }
    .zooms { display: flex; gap: 8px; }
    .usuario { display: flex; gap: 10px; align-items: center; justify-self: end; }
    .usuario button, .zoom, .tela-inteira { color: #fff; border-color: #fff; }
    .usuario button:hover, .zoom:hover:not(:disabled), .tela-inteira:hover { background: rgba(255,255,255,.15); }
    .tela-inteira { height: 30px; padding: 0 12px; font-weight: 600; white-space: nowrap; }
    .corpo { display: flex; flex: 1; min-height: 0; }
    nav {
      width: 209px; flex-shrink: 0; background: var(--sidebar); color: var(--sidebar-text);
      padding: 12px; overflow-y: auto;
    }
    h3 { font-size: .9rem; text-transform: uppercase; letter-spacing: .08em; opacity: .7; margin: 14px 4px 6px; }
    h3.destaque {
      color: #00008b; font-weight: 700; opacity: 1; font-size: 1.26rem;
      background: #f5f0e1; padding: 5px 8px; border-radius: 4px; margin-left: 0; margin-right: 0;
    }
    .botao {
      display: flex; align-items: center; gap: 8px; padding: 7px 8px; margin-bottom: 4px;
      border-radius: 6px; color: var(--sidebar-text); text-decoration: none; font-size: 1.08rem;
      border: 1px solid rgba(255,255,255,.12);
    }
    .botao:hover { background: rgba(255,255,255,.08); }
    .botao.ativo { background: var(--primary); border-color: var(--primary); }
    main { flex: 1; padding: 20px; overflow-x: hidden; overflow-y: auto; min-width: 0; }
    .voltar {
      display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px;
      padding: 5px 12px 5px 6px; font-weight: 600;
    }
    .voltar svg { flex-shrink: 0; }
    .zoom {
      width: 34px; height: 30px; padding: 0;
      font-size: 1.3rem; font-weight: 700; line-height: 1;
      display: inline-flex; align-items: center; justify-content: center;
    }
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

  readonly ZOOM_MIN = 0.5;
  readonly ZOOM_MAX = 2;

  /** Zoom da página (1 = 100%), aplicado ao documento inteiro como o zoom do navegador. */
  zoom = signal(lerZoomSalvo());
  zoomPct = computed(() => Math.round(this.zoom() * 100));

  constructor() {
    effect(() => {
      const z = this.zoom();
      document.documentElement.style.zoom = z === 1 ? '' : String(z);
      try { localStorage.setItem(CHAVE_ZOOM, String(z)); } catch { /* armazenamento indisponível */ }
    });
  }

  /** Indica se o navegador está em tela inteira (também acompanha a saída pela tecla Esc). */
  telaInteira = signal(!!document.fullscreenElement);

  @HostListener('document:fullscreenchange')
  aoMudarTelaInteira(): void {
    this.telaInteira.set(!!document.fullscreenElement);
  }

  alternarTelaInteira(): void {
    const pedido = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
    pedido?.catch(() => { /* navegador recusou ou não suporta tela inteira */ });
  }

  alterarZoom(passo: number): void {
    const novo = Math.round((this.zoom() + passo) * 10) / 10;
    this.zoom.set(Math.min(this.ZOOM_MAX, Math.max(this.ZOOM_MIN, novo)));
  }

  /** Retorna para a tela visitada anteriormente (histórico do navegador). */
  voltar(): void {
    this.location.back();
  }

  grupos: { titulo: string; destaque?: boolean; botoes: Botao[] }[] = [
    {
      titulo: 'V E N D A',
      destaque: true,
      botoes: [
        { rotulo: 'Listar todas', rota: 'vendas/listar' },
        { rotulo: 'Vendas por cliente', rota: 'vendas/por-cliente' },
        { rotulo: 'Vendas por produto', rota: 'vendas/por-produto' },
        { rotulo: 'Venda e Pagamento', rota: 'vendas/cadastrar' },
      ],
    },
    {
      titulo: 'C L I E N T E',
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
      titulo: 'P R O D U T O',
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
  ];
}
