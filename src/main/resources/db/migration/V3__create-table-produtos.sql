Create table produtos (
	
	id bigint not null auto_increment,

    descricao varchar(50) not null,
    preco decimal(12,2) ,
    casco tinyint,
    bloqueado tinyint,
	primary key(id)
);