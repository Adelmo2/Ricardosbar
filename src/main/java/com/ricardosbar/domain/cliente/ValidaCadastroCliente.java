package com.ricardosbar.domain.cliente;

import com.ricardosbar.domain.validacaoException;
import org.springframework.beans.factory.annotation.Autowired;

public class ValidaCadastroCliente {

    @Autowired
    private ClienteRepository clienteRepository;

    public void ValidaCliente(DadosCadastroCliente dados, boolean alteracao){

    //public void validar(DadosCadastroCliente dados, boolean alteracao) {
    //public void validar(DadosAtualizacaoCliente dados, boolean alteracao) {

        if (dados.nome().isEmpty()) {
            throw new validacaoException("O nome do cliente é obrigatório!!");
        }

        if (alteracao) {
            var temCliente = clienteRepository.clienteDuplicado(dados.nome());
            if (temCliente != null) {
                throw new validacaoException("Cliente já cadastrado!");
            }
        }

        if (!dados.email().isEmpty()) {
            if (!dados.email().contains("@")) {
                throw new validacaoException("Email inválido!!");
            }
            if (!dados.email().contains(".")) {
                throw new validacaoException("Email inválido!");
            }
        }
    }
}
