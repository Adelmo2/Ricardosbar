package com.ricardosbar.validacoes;

import com.ricardosbar.dto.DadosAtualizacaoProdutoDto;
import com.ricardosbar.dto.DadosCadastroProdutoDto;
import com.ricardosbar.repository.ProdutoRepository;

public class ValidaCadastroProduto {

    public void ValidaNovoProduto(DadosCadastroProdutoDto dados, ProdutoRepository produtoRepository) {

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

    //public void ValidaAlteracaoProduto(@Valid @org.jetbrains.annotations.UnknownNullability DadosAtualizacaoProduto dados, ProdutoRepository produtoRepository) {
    public void ValidaAlteracaoProduto(DadosAtualizacaoProdutoDto dados, ProdutoRepository produtoRepository) {

        String produtoExistente = produtoRepository.produtoDuplicado(dados.descricao(), dados.id());
        if (produtoExistente != null) {
            throw new validacaoException("Produto já cadastrado!...");
        }

        //if (dados.descricao().isEmpty()) {
        //    throw new validacaoException("A descrição do produto é obrigatória!..");
        //}

        if (dados.preco() < 0) {
            throw new validacaoException("Preço inválido!...");
        }
    }

}
