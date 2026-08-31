package com.ricardosbar.domain.produto;

import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoProduto(
    @NotNull
    Long id,

    String descricao,
    Double preco,
    Boolean casco,
    Boolean bloqueado
    )
 {
    public DadosAtualizacaoProduto(Produto produto) {
        this(produto.getId(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getCasco(),
                produto.getBloqueado()
        );
    }
}
