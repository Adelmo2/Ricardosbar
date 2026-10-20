Create table vendidos (
--	id bigint not null auto_increment,
--	id_clientes bigint not null,
--	id_produtos bigint not null,
--	quantidade decimal(12,2),
--    data_pagamento datetime,
--    hora_pagamento varchar(5),
--    valor decimal(12,2),
--    total decimal(12,2),
--    cupom tinyint,
--    pago tinyint,
--	primary key(id),
--    constraint fk_vendidos_id_clientes foreign key(id_clientes) references clientes(id),
--    constraint fk_vendidos_id_produtos foreign key(id_produtos) references produtos(id)

    id BIGINT GENERATED ALWAYS AS IDENTITY,
    id_clientes BIGINT NOT NULL,
    id_produtos BIGINT NOT NULL,
    quantidade NUMERIC(12,2),
    data_pagamento TIMESTAMP,
    hora_pagamento VARCHAR(5),
    valor NUMERIC(12,2),
    total NUMERIC(12,2),
    cupom SMALLINT DEFAULT 0,
    pago SMALLINT DEFAULT 0,

    CONSTRAINT pk_vendidos PRIMARY KEY (id),
    CONSTRAINT fk_vendidos_id_clientes
        FOREIGN KEY (id_clientes)
        REFERENCES clientes(id),
    CONSTRAINT fk_vendidos_id_produtos
        FOREIGN KEY (id_produtos)
        REFERENCES produtos(id)
);



