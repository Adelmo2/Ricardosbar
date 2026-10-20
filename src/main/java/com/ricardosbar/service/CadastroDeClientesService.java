package com.ricardosbar.service;

import com.ricardosbar.repository.ClienteRepository;
import com.ricardosbar.dto.DadosCadastroClienteDto;
import com.ricardosbar.dto.DadosDetalhamentoClienteDto;
import com.ricardosbar.validacoes.ValidaCadastroCliente;
import com.ricardosbar.model.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CadastroDeClientesService {

    @Autowired
    private ClienteRepository clienteRepository;

    public DadosDetalhamentoClienteDto cadastrar(DadosCadastroClienteDto dados) {

        var validaCadastro = new ValidaCadastroCliente();
        validaCadastro.ValidaNovoCliente(dados, clienteRepository);

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
        return new DadosDetalhamentoClienteDto(cliente);
    }
}
