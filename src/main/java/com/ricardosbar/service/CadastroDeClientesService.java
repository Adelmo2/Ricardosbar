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

    public DadosDetalhamentoClienteDto cadastrar(DadosCadastroClienteDto dto) {

        var validaCadastro = new ValidaCadastroCliente();
        validaCadastro.ValidaNovoCliente(dto, clienteRepository);

        var cliente = new Cliente(
                null,
                dto.nome(),
                dto.telefone(),
                dto.endereco(),
                dto.bairro(),
                dto.cidade(),
                dto.uf(),
                dto.valor_ult_pagto(),
                dto.dt_ult_pago(),
                dto.hora_ult_pago(),
                dto.saldo_pagar(),
                dto.primeira_compra(),
                dto.limite(),
                dto.bloqueado(),
                dto.observacao(),
                dto.email()
                );
        clienteRepository.save(cliente);
        return new DadosDetalhamentoClienteDto(cliente);
    }
}
