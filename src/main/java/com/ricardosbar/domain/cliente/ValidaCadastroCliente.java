package com.ricardosbar.domain.cliente;

import com.ricardosbar.domain.validacaoException;

public class ValidaCadastroCliente {


    public void ValidaCliente(DadosCadastroCliente dados, boolean alteracao, String nomeExistente){

        if (!alteracao) {
            if (nomeExistente != null) {
                throw new validacaoException("Cliente já cadastrado!...");
            }

            if (dados.nome().isEmpty()) {
                throw new validacaoException("O nome do cliente é obrigatório!..");
            }
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
