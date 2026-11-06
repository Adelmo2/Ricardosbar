package com.ricardosbar.validacoes;

import com.ricardosbar.dto.DadosUsuarioDto;
import com.ricardosbar.repository.UsuarioRepository;
import org.springframework.stereotype.Component;

@Component
public class ValidaCadastroUsuario {

    public void ValidaLoginUsuario(DadosUsuarioDto dadosUsuarioDto, UsuarioRepository usuarioRepository) {

        boolean loginExistente = usuarioRepository.existsByLogin(dadosUsuarioDto.login());
        if (!loginExistente) {
            throw new validacaoException("Login não cadastrado!...");
        }

        boolean verificaLoginESenha = usuarioRepository.existsByLoginAndSenha(dadosUsuarioDto.login(), dadosUsuarioDto.senha());
        if (!verificaLoginESenha) {
            throw new validacaoException("Senha incorreta!...");
        }
    }
}
