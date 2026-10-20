package com.ricardosbar.dto;

import com.ricardosbar.model.Produto;
import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoProdutoDto(
    @NotNull
    Long id,

    String descricao,
    Double preco,
    Boolean casco,
    Boolean bloqueado
    )
 {
    public DadosAtualizacaoProdutoDto(Produto produto) {
        this(produto.getId(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getCasco(),
                produto.getBloqueado()
        );
    }
}
