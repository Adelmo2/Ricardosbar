# Ricardo's Bar

Sistema de gestão para bar com controle de **clientes**, **produtos** e **vendas (fiado)**, incluindo saldo devedor, limite de crédito e registro de pagamentos.

O projeto é composto por uma **API REST em Java/Spring Boot** e um **frontend em Angular**.

## Tecnologias

**Backend**
- Java 17
- Spring Boot 4 (Web, Data JPA, Validation, DevTools)
- PostgreSQL
- Flyway (migrações de banco)
- Lombok
- SpringDoc OpenAPI (Swagger UI)

**Frontend**
- Angular 22 (standalone components)
- Proxy de desenvolvimento para a API (`/api` → `http://localhost:8080`)

## Estrutura do projeto

```
ricardosbar/
├── src/main/java/com/ricardosbar/
│   ├── controller/     # Endpoints REST (clientes, produtos, vendas, usuário)
│   ├── dto/            # Records de entrada/saída da API
│   ├── model/          # Entidades JPA (Cliente, Produto, Venda, Usuario)
│   ├── repository/     # Repositórios Spring Data
│   ├── service/        # Regras de negócio
│   ├── validacoes/     # Validações de cadastro
│   └── infra/          # Tratamento de erros, segurança, SpringDoc
├── src/main/resources/
│   ├── application.properties
│   └── db/migration/   # Scripts Flyway (V1..V4)
└── frontend/           # Aplicação Angular
    └── src/app/
        ├── core/       # Serviços de API, autenticação, guard e modelos
        └── pages/      # Login, Home, Clientes, Produtos, Vendas
```

## Modelo de dados

| Tabela     | Descrição |
|------------|-----------|
| `usuarios` | Login e senha dos usuários do sistema |
| `clientes` | Dados cadastrais, saldo a pagar, limite de crédito, último pagamento e status de bloqueio |
| `produtos` | Descrição, preço, indicador de casco e status de bloqueio |
| `vendidos` | Vendas (cliente × produto), quantidade, valor, total, cupom e status de pagamento |

## Regras de negócio

- Não é possível vender para cliente ou produto inexistente.
- Produtos bloqueados não podem ser vendidos.
- Clientes bloqueados não podem comprar (apenas registrar pagamento).
- Se o cliente possui limite, o total da venda não pode ultrapassá-lo.
- O **produto de ID 1** representa um **pagamento**: lançá-lo abate o valor do saldo do cliente; os demais produtos somam `valor × quantidade` ao saldo.
- Clientes e produtos são inativados/ativados (exclusão lógica).

## Endpoints da API

### Usuário
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/usuario/login` | Autentica o usuário |

### Clientes
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/clientes/cadastrar` | Cadastra cliente |
| PUT | `/clientes/alterar` | Altera cliente |
| GET | `/clientes/listartodos` | Lista todos os clientes |
| GET | `/clientes/listarapi` | Lista clientes (formato para o frontend) |
| GET | `/clientes/{id}` | Detalha cliente |
| GET | `/clientes/consultarcliente/{nome}` | Consulta clientes cujo nome contém o texto |
| GET | `/clientes/saldo/{nome}` | Saldo dos clientes cujo nome contém o texto |
| DELETE | `/clientes/inativar/{id}` | Inativa cliente |
| POST | `/clientes/ativar/{id}` | Reativa cliente |

### Produtos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/produtos/cadastrar` | Cadastra produto |
| PUT | `/produtos/alterar` | Altera produto |
| GET | `/produtos/listartodos` | Lista todos |
| GET | `/produtos/listarativos` | Lista ativos |
| GET | `/produtos/listarinativos` | Lista inativos |
| GET | `/produtos/listarapi` | Lista produtos (formato para o frontend) |
| GET | `/produtos/consultar/{id}` | Consulta produto |
| GET | `/produtos/pesquisarnomeproduto/{nome}` | Pesquisa por nome |
| DELETE | `/produtos/inativar/{id}` | Inativa produto |
| POST | `/produtos/ativar/{id}` | Reativa produto |

### Vendas
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/vendas/cadastrar` | Registra venda/pagamento |
| PUT | `/vendas/alterar` | Altera venda |
| GET | `/vendas/listartodos` | Lista todas as vendas |
| GET | `/vendas/consultarvendascliente/{nome}` | Vendas dos clientes cujo nome contém o texto |
| GET | `/vendas/consultarvendasproduto/{id}` | Vendas de um produto |
| DELETE | `/vendas/excluir/{id}` | Exclui venda |

A documentação interativa fica disponível em **http://localhost:8080/swagger-ui.html** com a aplicação rodando.

## Como executar

### Pré-requisitos
- JDK 17+
- PostgreSQL
- Node.js 20+ e npm

### 1. Banco de dados

Crie o banco:

```sql
CREATE DATABASE ricardosbar;
```

Ajuste usuário, senha e o segredo do token em `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost/ricardosbar
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA
api.security.token.secret=SEU_SEGREDO
```

As tabelas são criadas automaticamente pelo Flyway na primeira execução.

### 2. Backend

```bash
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Acesse `http://localhost:4200`. As chamadas para `/api` são redirecionadas para o backend pelo `proxy.conf.json`.

## Testes

```bash
./mvnw test
```

## Autor

**Adelmo S. Ricardo** — [GitHub](https://github.com/Adelmo2)
