package com.ricardosbar.domain.produto;

import com.ricardosbar.domain.validacaoException;

public class ValidaCadastroProduto {

    public void ValidaNovoProduto(DadosCadastroProduto dados, ProdutoRepository produtoRepository) {

        String produtoExistente = produtoRepository.produtoDuplicado(dados.descricao(), 0L);
        if (produtoExistente != null) {
            throw new validacaoException("Produto já cadastrado!...");
        }

        if (dados.descricao().isEmpty()) {
            throw new validacaoException("A descrição do produto é obrigatória!..");
        }

        if (dados.preco() < 0) {
            throw new validacaoException("Preço inválido!...");
        }
    }

    public void ValidaAlteracaoProduto(DadosCadastroProduto dados, ProdutoRepository produtoRepository) {

        String produtoExistente = produtoRepository.produtoDuplicado(dados.descricao(), dados.id());
        if (produtoExistente != null) {
            throw new validacaoException("Produto já cadastrado!...");
        }

        if (dados.descricao().isEmpty()) {
            throw new validacaoException("A descrição do produto é obrigatória!..");
        }

        if (dados.preco() < 0) {
            throw new validacaoException("Preço inválido!...");
        }
    }

}
