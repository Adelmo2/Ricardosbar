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
        <h1>Ricardo's Bar</h1>
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
    .tela { min-height: 100vh; display: grid; place-items: center; padding: 16px; }
    .caixa { width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 14px; }
    h1 { margin: 0; color: var(--primary); }
    .sub { margin: -8px 0 6px; color: var(--muted); }
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
