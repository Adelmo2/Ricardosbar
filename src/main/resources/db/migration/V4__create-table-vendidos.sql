Create table vendidos (
	
	id bigint not null auto_increment,

	id_clientes bigint not null,
	id_produtos bigint not null,

	quantidade decimal(12,2),
    data_pagamento datetime,
    hora_pagamento varchar(5),
    valor decimal(12,2),
    total decimal(12,2),
    cupom tinyint,
    pago tinyint,

	primary key(id),

    constraint fk_vendidos_id_clientes foreign key(id_clientes) references clientes(id),
    constraint fk_vendidos_id_produtos foreign key(id_produtos) references produtos(id)

);

