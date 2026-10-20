package com.ricardosbar.validacoes;

import com.ricardosbar.domain.validacaoException;
import com.ricardosbar.dto.DadosAtualizacaoClienteDto;
import com.ricardosbar.dto.DadosCadastroClienteDto;
import com.ricardosbar.repository.ClienteRepository;

public class ValidaCadastroCliente {

    public void ValidaNovoCliente(DadosCadastroClienteDto dados, ClienteRepository clienteRepository) {

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

    public void ValidaAlteracaoCliente(DadosAtualizacaoClienteDto dados, ClienteRepository clienteRepository){

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
