package com.ricardosbar.controller;

import com.ricardosbar.dto.DadosUsuarioDto;
import com.ricardosbar.repository.UsuarioRepository;
import com.ricardosbar.service.CadastroDeUsuarioService;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("usuario")
public class UsuarioController {

    @Autowired
    private CadastroDeUsuarioService cadastroDeUsuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity verificaLogin(@RequestBody @Valid DadosUsuarioDto dados){
        try {
            cadastroDeUsuarioService.verificaLogin(dados);
            var usuario = usuarioRepository.findByLogin(dados.login());
            return ResponseEntity.ok(usuario);
        } catch (ValidationException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

}
