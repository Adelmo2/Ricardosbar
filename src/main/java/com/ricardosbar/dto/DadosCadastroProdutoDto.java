package com.ricardosbar.dto;

public record DadosCadastroProdutoDto(
        Long id,
        String descricao,
        Double preco,
        Boolean casco,
        Boolean bloqueado
) {
}
