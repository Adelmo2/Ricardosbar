package com.ricardosbar.service;

import com.ricardosbar.dto.DadosUsuarioDto;
import com.ricardosbar.repository.UsuarioRepository;
import com.ricardosbar.validacoes.ValidaCadastroUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CadastroDeUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ValidaCadastroUsuario validaCadastroUsuario;

    public void verificaLogin(DadosUsuarioDto dados) {
        validaCadastroUsuario.ValidaLoginUsuario(dados, usuarioRepository);
    }
}
