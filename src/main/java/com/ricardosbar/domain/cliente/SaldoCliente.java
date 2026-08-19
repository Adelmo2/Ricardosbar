package com.ricardosbar.domain.cliente;

import java.time.LocalDateTime;

public record SaldoCliente(
        Long id,
        String nome,
        String telefone,
        Double sado_pagar
)
{
    public SaldoCliente(Cliente cliente) {
        this(cliente.getId(),
                cliente.getNome(),
                cliente.getTelefone(),
                cliente.getSaldo_pagar()
        );
    }
}
