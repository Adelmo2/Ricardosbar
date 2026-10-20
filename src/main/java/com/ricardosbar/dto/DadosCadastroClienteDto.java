package com.ricardosbar.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record DadosCadastroClienteDto(
        Long id,
        //@NotBlank(message = "Nome é Obrigatório...")
        String nome,

        String telefone,
        String endereco,
        String bairro,

        @NotBlank(message = "Cidade é Obrigatório...")
        String cidade,

        String uf,
        Double valor_ult_pagto,
        LocalDateTime dt_ult_pago,
        String hora_ult_pago,
        Double saldo_pagar,
        LocalDateTime primeira_compra,
        Double limite,
        Integer bloqueado,
        String observacao,
        
        @Email(message = "Email inválido...")
        String email
) {
}
