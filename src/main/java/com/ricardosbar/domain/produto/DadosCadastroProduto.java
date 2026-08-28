package com.ricardosbar.domain.produto;

public record DadosCadastroProduto(
        Long id,
        String descricao,
        Double preco,
        Boolean casco,
        Boolean bloqueado
) {
}
