package com.ricardosbar.domain.cliente;

import com.ricardosbar.domain.validacaoException;

public class ValidaCadastroCliente {

    public void ValidaNovoCliente(DadosCadastroCliente dados, ClienteRepository clienteRepository) {

        String nomeExistente = clienteRepository.clienteDuplicado(dados.nome(),0L);
        if (nomeExistente != null) {
            throw new validacaoException("Cliente já cadastrado!...");
        }

        if (dados.nome().isEmpty()) {
            throw new validacaoException("O nome do cliente é obrigatório!..");
        }

        if (!dados.email().isEmpty()) {
            if (!dados.email().contains("@")) {
                throw new validacaoException("Email inválido!...");
            }
            if (!dados.email().contains(".")) {
                throw new validacaoException("Email inválido!...");
            }
        }
    }

    public void ValidaAlteracaoCliente(DadosAtualizacaoCliente dados, ClienteRepository clienteRepository){

        String nomeExistente = clienteRepository.clienteDuplicado(dados.nome(), dados.id());
        if (nomeExistente != null) {
            var jaCadastrado = ("Cliente (" + dados.nome() + ") já cadastrado!...");
            throw new validacaoException(jaCadastrado);
        }

        if (dados.nome().isEmpty()) {
            throw new validacaoException("O nome do cliente é obrigatório!..");
        }

        if (!dados.email().isEmpty()) {
            if (!dados.email().contains("@")) {
                throw new validacaoException("Email inválido!...");
            }
            if (!dados.email().contains(".")) {
                throw new validacaoException("Email inválido!...");
            }
        }
    }
}
