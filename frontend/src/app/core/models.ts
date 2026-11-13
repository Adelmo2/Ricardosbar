// Interfaces espelhando os DTOs da API ricardosbar

export interface UsuarioLogado {
  id: number;
  login: string;
}

export interface Cliente {
  id?: number;
  nome: string;
  telefone?: string;
  endereco?: string;
  bairro?: string;
  cidade: string;
  uf?: string;
  valor_ult_pagto?: number | null;
  dt_ult_pago?: string | null;
  hora_ult_pago?: string | null;
  saldo_pagar?: number | null;
  primeira_compra?: string | null;
  limite?: number | null;
  bloqueado?: number | null;
  observacao?: string;
  email?: string;
}

export interface SaldoCliente {
  id: number;
  nome: string;
  telefone: string;
  limite: number;
  saldo_pagar: number;
}

export interface Produto {
  id?: number;
  descricao: string;
  preco: number | null;
  casco?: number | null;
  bloqueado?: number | null;
}

/** Página do Spring Data (formato antigo ou PagedModel do Spring Data 4) */
export interface Pagina<T> {
  content: T[];
  number?: number;
  totalPages?: number;
  totalElements?: number;
  page?: { size: number; number: number; totalElements: number; totalPages: number };
}

export interface CadastroVenda {
  id_clientes: number | null;
  id_produtos: number | null;
  quantidade: number | null;
  valor: number | null;
  cupom: number;
  pago: number;
}

export interface AtualizacaoVenda {
  id: number;
  quantidade?: number | null;
  valor?: number | null;
  cupom?: number | null;
  pago?: number | null;
}

/** DadosDetalhamentoVendaFullDto */
export interface Venda {
  id: number;
  id_cliente: number;
  nome_cliente: string;
  id_produto: number;
  descricao_produto: string;
  quantidade: number;
  data_pagamento: string;
  valor: number;
  total: number;
  cupom: number;
  pago: number;
  saldo_pagar_cliente: number | null;
}
