package com.ricardosbar.dto;

import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoVendaDto(
        @NotNull
        Long id,
        Double quantidade,
        Double valor,
        Integer cupom,
        Integer pago
) {
}
