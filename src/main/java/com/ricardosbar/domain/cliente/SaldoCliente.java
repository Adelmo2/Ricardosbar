package com.ricardosbar.domain.cliente;

public record SaldoCliente(
        Long id,
        String nome,
        String telefone,
        Double saldo_pagar
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
