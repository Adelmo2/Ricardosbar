package com.ricardosbar.dto;

import com.ricardosbar.model.Produto;

public record DadosDetalhamentoProdutoDto(
        Long id,
        String descricao,
        Double preco,
        Boolean casco,
        Boolean bloqueado
) {
    public DadosDetalhamentoProdutoDto(Produto produto) {
        this(produto.getId(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getCasco(),
            produto.getBloqueado()
        );
    }
}
