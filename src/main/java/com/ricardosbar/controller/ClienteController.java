package com.ricardosbar.controller;

import com.ricardosbar.domain.cliente.ClienteRepository;
import com.ricardosbar.domain.cliente.DadosCadastroCliente;
import com.ricardosbar.domain.cliente.CadastroDeClientes;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriBuilder;

@RestController
@RequestMapping("clientes")
//@SecurityRequirement(name = "bearer-key")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private CadastroDeClientes cadastroDeClientes;

    @PostMapping
    @Transactional
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroCliente dados, UriBuilder uriBuilder){
        //clienteRepository.save(cliente);
        var dto = cadastroDeClientes.cadastrar(dados);
        return ResponseEntity.ok(dto);

    }

}
