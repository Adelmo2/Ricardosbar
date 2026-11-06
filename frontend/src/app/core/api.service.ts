import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AtualizacaoVenda,
  CadastroVenda,
  Cliente,
  Pagina,
  Produto,
  SaldoCliente,
  Venda,
} from './models';

/** Base da API: o proxy do Angular (proxy.conf.json) redireciona /api -> http://localhost:8080 */
const API = '/api';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private url = `${API}/clientes`;

  listarTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.url}/listartodos`);
  }
  detalhar(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }
  consultar(nome: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.url}/consultarcliente/${encodeURIComponent(nome.trim())}`);
  }
  saldo(nome: string): Observable<SaldoCliente[]> {
    return this.http.get<SaldoCliente[]>(`${this.url}/saldo/${encodeURIComponent(nome.trim())}`);
  }
  cadastrar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.url}/cadastrar`, cliente);
  }
  alterar(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.url}/alterar`, cliente);
  }
  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/inativar/${id}`);
  }
  ativar(id: number): Observable<void> {
    return this.http.post<void>(`${this.url}/ativar/${id}`, null);
  }
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private url = `${API}/produtos`;

  listarTodos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.url}/listartodos`);
  }
  listarAtivos(page = 0, size = 10): Observable<Pagina<Produto>> {
    return this.http.get<Pagina<Produto>>(`${this.url}/listarativos`, { params: { page, size } });
  }
  listarInativos(page = 0, size = 10): Observable<Pagina<Produto>> {
    return this.http.get<Pagina<Produto>>(`${this.url}/listarinativos`, { params: { page, size } });
  }
  consultar(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.url}/consultar/${id}`);
  }
  pesquisarNome(nome: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.url}/pesquisarnomeproduto/${encodeURIComponent(nome)}`);
  }
  cadastrar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${this.url}/cadastrar`, produto);
  }
  alterar(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.url}/alterar`, produto);
  }
  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/inativar/${id}`);
  }
  ativar(id: number): Observable<void> {
    return this.http.post<void>(`${this.url}/ativar/${id}`, null);
  }
}

@Injectable({ providedIn: 'root' })
export class VendaService {
  private http = inject(HttpClient);
  private url = `${API}/vendas`;

  listarTodas(): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.url}/listartodos`);
  }
  porCliente(nome: string): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.url}/consultarvendascliente/${encodeURIComponent(nome.trim())}`);
  }
  porProduto(id: number): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.url}/consultarvendasproduto/${id}`);
  }
  cadastrar(venda: CadastroVenda): Observable<unknown> {
    return this.http.post(`${this.url}/cadastrar`, venda);
  }
  alterar(venda: AtualizacaoVenda): Observable<Venda> {
    return this.http.put<Venda>(`${this.url}/alterar`, venda);
  }
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/excluir/${id}`);
  }
}

/** Converte os formatos de erro da API (texto, lista {campo, mensagem}, 404) em uma mensagem legível */
export function mensagemErro(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Erro inesperado.';
  if (err.status === 0) return 'Não foi possível conectar à API (verifique se o backend está rodando na porta 8080).';
  if (err.status === 404) return 'Registro não encontrado.';
  const corpo = err.error;
  if (typeof corpo === 'string' && corpo.trim()) return corpo;
  if (Array.isArray(corpo)) {
    return corpo.map((e: { campo?: string; mensagem?: string }) => `${e.campo}: ${e.mensagem}`).join(' | ');
  }
  if (corpo && typeof corpo === 'object' && 'message' in corpo) return String(corpo.message);
  return `Erro ${err.status} ao chamar a API.`;
}

/** Extrai a lista e o total de páginas de uma Page do Spring (formato antigo ou novo) */
export function lerPagina<T>(p: Pagina<T>): { itens: T[]; totalPaginas: number } {
  return { itens: p.content ?? [], totalPaginas: p.page?.totalPages ?? p.totalPages ?? 1 };
}
