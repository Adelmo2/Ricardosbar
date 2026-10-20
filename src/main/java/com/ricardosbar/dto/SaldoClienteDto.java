package com.ricardosbar.dto;

import com.ricardosbar.model.Cliente;

public record SaldoClienteDto(
        Long id,
        String nome,
        String telefone,
        double limite,
        Double saldo_pagar
)
{
    public SaldoClienteDto(Cliente cliente) {
        this(cliente.getId(),
                cliente.getNome(),
                cliente.getTelefone(),
                cliente.getLimite(),
                cliente.getSaldo_pagar()
        );
    }
}
