package com.ricardosbar.dto;

import com.ricardosbar.model.Usuario;

public record DadosUsuarioDto(
        Long id,
        String login,
        String senha
) {
    public DadosUsuarioDto(Usuario usuario){
        this(
                usuario.getId(),
                usuario.getLogin(),
                usuario.getSenha()
        );
    }
}
