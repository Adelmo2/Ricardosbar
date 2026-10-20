package com.ricardosbar.dto;

public record DadosCadastroProdutoDto(
        Long id,
        String descricao,
        Double preco,
        Integer casco,
        Integer bloqueado
) {
}
