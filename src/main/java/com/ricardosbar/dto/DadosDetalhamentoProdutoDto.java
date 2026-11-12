package com.ricardosbar.dto;

import com.ricardosbar.model.Produto;

public record DadosDetalhamentoProdutoDto(
        Long id,
        String descricao,
        Double preco,
        Integer casco,
        Integer bloqueado
) {
    public DadosDetalhamentoProdutoDto(Produto produto) {
        this(produto.getId(),
            produto.getDescricao().toUpperCase(),
            produto.getPreco(),
            produto.getCasco(),
            produto.getBloqueado()
        );
    }
}
