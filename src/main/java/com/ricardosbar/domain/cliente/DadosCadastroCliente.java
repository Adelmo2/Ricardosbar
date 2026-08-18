package com.ricardosbar.domain.cliente;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record DadosCadastroCliente(

        @NotBlank(message = "Nome é Obrigatório...")
        String nome,

        String telefone,

        String endereco,
        String bairro,

        @NotBlank(message = "Cidade é Obrigatório...")
        String cidade,

        String uf,
        String valor_ult_pagto,
        LocalDateTime dt_ult_pago,
        String hora_ult_pago,
        Double saldo_pagar,
        LocalDateTime primeira_compra,
        Double limite,
        Boolean bloqueado,
        String observacao,
        String email
) {
}
