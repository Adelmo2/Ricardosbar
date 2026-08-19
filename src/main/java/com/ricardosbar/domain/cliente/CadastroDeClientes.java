package com.ricardosbar.domain.cliente;

import com.ricardosbar.domain.validacaoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CadastroDeClientes {

    @Autowired
    private ClienteRepository clienteRepository;

    public DadosDetalhamentoCliente cadastrar(DadosCadastroCliente dados) {

        if (dados.nome().isEmpty()) {
            throw new validacaoException("O nome do cliente é obrigatório!!");
        }

        var temCliente = clienteRepository.clienteDuplicado(dados.nome());
        if (temCliente != null) {
            throw new validacaoException("Cliente já cadastrado!");
        }

        if (!dados.email().isEmpty()) {
            if (!dados.email().contains("@")) {
                throw new validacaoException("Email inválido!!");
            }
            if (!dados.email().contains(".")) {
                throw new validacaoException("Email inválido!");
            }
        }

        var cliente = new Cliente(
                null,
                dados.nome(),
                dados.telefone(),
                dados.endereco(),
                dados.bairro(),
                dados.cidade(),
                dados.uf(),
                dados.valor_ult_pagto(),
                dados.dt_ult_pago(),
                dados.hora_ult_pago(),
                dados.saldo_pagar(),
                dados.primeira_compra(),
                dados.limite(),
                dados.bloqueado(),
                dados.observacao(),
                dados.email()
                );
        clienteRepository.save(cliente);
        return new DadosDetalhamentoCliente(cliente);
    }
}
