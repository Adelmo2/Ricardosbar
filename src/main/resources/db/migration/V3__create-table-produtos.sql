Create table produtos (
--	id bigint not null auto_increment,
--    descricao varchar(50) not null,
--    preco decimal(12,2) ,
--    casco tinyint,
--    bloqueado tinyint,
--	primary key(id)

      id BIGSERIAL NOT NULL,
      descricao VARCHAR(50) NOT NULL,
      preco NUMERIC(12,2),
      casco SMALLINT DEFAULT 0,
      bloqueado SMALLINT DEFAULT 0,
      CONSTRAINT pk_produtos PRIMARY KEY (id)
);