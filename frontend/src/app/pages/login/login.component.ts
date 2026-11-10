import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { mensagemErro } from '../../core/api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="tela">
      <form class="cartao caixa" (ngSubmit)="entrar()">
        <h1 class="logo">
          <img src="logotipo_ricardosbar.jpg" alt="Ricardo's Bar — desde 1995" width="640" height="640" />
        </h1>
        <p class="sub">Controle de clientes, produtos e vendas</p>

        @if (erro()) {
          <div class="msg erro">{{ erro() }}</div>
        }

        <label>Login
          <input name="login" [(ngModel)]="login" required autocomplete="username" autofocus />
        </label>
        <label>Senha
          <input name="senha" type="password" [(ngModel)]="senha" required autocomplete="current-password" />
        </label>

        <button type="submit" [disabled]="carregando() || !login || !senha">
          {{ carregando() ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  `,
  styles: `
    .tela {
      min-height: 100vh; display: grid; place-items: center; padding: 96px 16px 24px;
      background:
        radial-gradient(circle at 50% 30%, rgba(226, 178, 60, .28), transparent 60%),
        var(--sidebar);
    }
    .caixa {
      width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 14px;
      padding-top: 0; border-color: #d9a93a;
      box-shadow: 0 18px 40px rgba(0, 0, 0, .45);
    }
    /* O logotipo é um círculo preto sobre fundo amarelo: o recorte circular com
       um leve zoom esconde os cantos amarelos e deixa só o emblema. */
    .logo {
      width: 168px; height: 168px; margin: -84px auto 0;
      border-radius: 50%; overflow: hidden; background: #000;
      border: 3px solid #d9a93a;
      box-shadow: 0 0 0 5px var(--sidebar), 0 8px 22px rgba(0, 0, 0, .5);
    }
    .logo img { display: block; width: 100%; height: 100%; object-fit: cover; transform: scale(1.12); }
    .sub { margin: 0 0 6px; color: var(--muted); text-align: center; }
    @media (max-height: 560px) {
      .tela { padding-top: 72px; }
      .logo { width: 120px; height: 120px; margin-top: -60px; }
    }
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  login = '';
  senha = '';
  carregando = signal(false);
  erro = signal('');

  constructor() {
    if (this.auth.usuario()) this.router.navigateByUrl('/home');
  }

  entrar(): void {
    this.erro.set('');
    this.carregando.set(true);
    this.auth.login(this.login.trim(), this.senha).subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: (e) => {
        this.erro.set(mensagemErro(e));
        this.carregando.set(false);
      },
    });
  }
}
