package com.ricardosbar.domain.cliente;

import java.time.LocalDateTime;

public record DadosDetalhamentoCliente(
        Long id,
        String nome,
        String telefone,
        String endereco,
        String bairro,
        String cidade,
        String uf,
        String valor_ult_pagto,
        LocalDateTime dt_ult_pago,
        String hora_ult_pago,
        Double sado_pagar,
        LocalDateTime primeira_compra,
        Double limite,
        Boolean bloqueado,
        String observacao,
        String email
)
{
    public DadosDetalhamentoCliente(Cliente cliente) {
        this(cliente.getId(),
                cliente.getNome(),
                cliente.getTelefone(),
                cliente.getEndereco(),
                cliente.getBairro(),
                cliente.getCidade(),
                cliente.getUf(),
                cliente.getValor_ult_pagto(),
                cliente.getDt_ult_pago(),
                cliente.getHora_ult_pago(),
                cliente.getSaldo_pagar(),
                cliente.getPrimeira_compra(),
                cliente.getLimite(),
                cliente.getBloqueado(),
                cliente.getObservacao(),
                cliente.getEmail()
        );
    }
}
