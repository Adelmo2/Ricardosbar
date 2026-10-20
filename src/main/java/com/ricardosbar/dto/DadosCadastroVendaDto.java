package com.ricardosbar.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosCadastroVendaDto(
        @NotNull
        Long id_produtos,

        @NotNull
        Long id_clientes,

        Double quantidade,
        LocalDateTime data_pagamento,
        String hora_pagamento,
        Double valor,
        Double total,
        Integer cupom,
        Integer pago
) {
}
