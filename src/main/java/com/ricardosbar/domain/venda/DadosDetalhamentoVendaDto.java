package com.ricardosbar.domain.venda;

import com.ricardosbar.model.Venda;

import java.time.LocalDateTime;

public record DadosDetalhamentoVendaDto(
        Long id,
        Long id_produtos,
        Long id_clientes,
        Double quantidade,
        LocalDateTime data_pagamento,
        String hora_pagamento,
        Double valor,
        Double total,
        Boolean cupom,
        Boolean pago
) {
    public DadosDetalhamentoVendaDto(Venda venda) {
        this(
            venda.getId(),
            venda.getCliente().getId(),
            venda.getProduto().getId(),
            venda.getQuantidade(),
            venda.getData_pagamento(),
            venda.getHora_pagamento(),
            venda.getValor(),
            venda.getTotal(),
            venda.getCupom(),
            venda.getPago());
    }
}
