-- Dados mínimos para desenvolvimento (banco ricardosbar-dev-db).
-- Aplicar depois que o Flyway criou as tabelas (primeira subida do backend):
--   sudo docker exec -i ricardosbar-dev-db psql -U postgres -d ricardosbar < dev/seed.sql
INSERT INTO usuarios (login, senha)
SELECT 'dev', 'dev' WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE login = 'dev');

-- Produto 1 = pagamento (regra de negócio: abate do saldo do cliente)
INSERT INTO produtos (id, descricao, preco, casco, bloqueado)
VALUES (1, '***** P A G A M E N T O *****', 0.00, 0, 0)
ON CONFLICT (id) DO NOTHING;
SELECT setval('produtos_id_seq', (SELECT max(id) FROM produtos));
INSERT INTO produtos (descricao, preco, casco, bloqueado)
SELECT d, p, c, 0 FROM (VALUES ('Cerveja 600ml', 12.00, 1), ('Refrigerante lata', 6.00, 0), ('Porção de batata', 30.00, 0)) v(d, p, c)
WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE id > 1);
SELECT setval('produtos_id_seq', (SELECT max(id) FROM produtos));

INSERT INTO clientes (nome, saldo_pagar, limite)
SELECT 'Cliente Teste', 0.00, 0.00 WHERE NOT EXISTS (SELECT 1 FROM clientes);
