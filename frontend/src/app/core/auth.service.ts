import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { UsuarioLogado } from './models';

const CHAVE = 'ricardosbar.usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly usuario = signal<UsuarioLogado | null>(this.lerSessao());

  /** POST /usuario/login — a API devolve o Usuario; guardamos só id e login (nunca a senha) */
  login(login: string, senha: string): Observable<UsuarioLogado> {
    return this.http.post<UsuarioLogado>('/api/usuario/login', { login, senha }).pipe(
      map((u) => ({ id: u.id, login: u.login })),
      tap((u) => {
        try {
          sessionStorage.setItem(CHAVE, JSON.stringify(u));
        } catch {}
        this.usuario.set(u);
      }),
    );
  }

  sair(): void {
    try {
      sessionStorage.removeItem(CHAVE);
    } catch {}
    this.usuario.set(null);
    this.router.navigateByUrl('/login');
  }

  private lerSessao(): UsuarioLogado | null {
    try {
      const v = sessionStorage.getItem(CHAVE);
      return v ? (JSON.parse(v) as UsuarioLogado) : null;
    } catch {
      return null;
    }
  }
}
