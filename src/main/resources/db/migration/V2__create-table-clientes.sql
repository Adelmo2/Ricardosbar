Create table clientes (    
	
	id bigint not null auto_increment,

    nome varchar(40) not null,
    telefone varchar(15),
    endereco varchar(40),
    bairro varchar(40),
    cidade varchar(35),
    uf varchar(2),
    valor_ult_pagto decimal(12,2) ,
    dt_ult_pago datetime,
    hora_ult_pago varchar(8),
    saldo_pagar decimal(12,2) ,
    primeira_compra datetime,
    limite decimal(12,2),
    bloqueado tinyint,
    observacao varchar(150),
    email varchar(100),

	primary key(id)
);