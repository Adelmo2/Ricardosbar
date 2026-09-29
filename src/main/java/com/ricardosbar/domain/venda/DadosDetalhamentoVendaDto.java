package com.ricardosbar.domain.venda;

import java.time.LocalDateTime;

public record DadosDetalhamentoVendaDto(
        Long id,
        Long id_cliente,
        String nome_cliente,
        Long id_produto,
        String descricao_produto,
        Double quantidade,
        LocalDateTime data_pagamento,
        Double valor,
        Double total,
        Boolean cupom,
        Boolean pago
) {

    public DadosDetalhamentoVendaDto(Venda venda) {
        this(
            venda.getId(),
            venda.getCliente().getId(),
            venda.getCliente().getNome(),
            venda.getProduto().getId(),
            venda.getProduto().getDescricao(),
            venda.getQuantidade(),
            venda.getData_pagamento(),
            venda.getValor(),
            venda.getTotal(),
            venda.getCupom(),
            venda.getPago()
        );
    }
}
