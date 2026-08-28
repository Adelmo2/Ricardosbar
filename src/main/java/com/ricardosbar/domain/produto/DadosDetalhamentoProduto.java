package com.ricardosbar.domain.produto;

public record DadosDetalhamentoProduto(
        Long id,
        String descricao,
        Double preco,
        Boolean casco,
        Boolean bloqueado
) {
    public DadosDetalhamentoProduto(Produto produto) {
        this(produto.getId(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getCasco(),
            produto.getBloqueado()
        );
    }
}
