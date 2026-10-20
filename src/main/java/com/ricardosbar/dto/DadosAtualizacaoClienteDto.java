package com.ricardosbar.dto;

import com.ricardosbar.model.Cliente;
import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoClienteDto(
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
    public DadosAtualizacaoClienteDto(Cliente cliente) {
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
