package com.ricardosbar.domain.venda;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosCadastroVenda(
        @NotNull
        Long id_produtos,

        @NotNull
        Long id_clientes,

        Double quantidade,
        LocalDateTime data_pagamento,
        String hora_pagamento,
        Double valor,
        Double total,
        Boolean cupom,
        Boolean pago
) {
}
