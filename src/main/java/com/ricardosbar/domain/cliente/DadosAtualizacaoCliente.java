package com.ricardosbar.domain.cliente;

import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoCliente(
        @NotNull
        Long id,
        String nome,
        String telefone,
        String endereco,
        String bairro,
        String cidade,
        String uf,
        Double limite,
        String observacao,
        String email)
{
    public DadosAtualizacaoCliente(Cliente cliente) {
        this(cliente.getId(),
                cliente.getNome(),
                cliente.getTelefone(),
                cliente.getEndereco(),
                cliente.getBairro(),
                cliente.getCidade(),
                cliente.getUf(),
                cliente.getLimite(),
                cliente.getObservacao(),
                cliente.getEmail()
        );
    }
}
