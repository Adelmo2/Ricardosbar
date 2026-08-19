package com.ricardosbar.controller;

import com.ricardosbar.domain.cliente.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
    @RequestMapping("/cadastrar")
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroCliente dados, UriBuilder uriBuilder){
        //clienteRepository.save(cliente);
        var dto = cadastroDeClientes.cadastrar(dados);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("listarapi")
    public ResponseEntity listarClientes(@RequestBody @Valid DadosCadastroCliente dados) {
        System.out.println("* * * * * dados: " + dados);
        System.out.println("Nome: " + dados.nome() + " Telefone: " + dados.telefone() + " Cidade:" + dados.cidade() + " UF:" + dados.uf());
        var cliente = new Cliente(dados);
        return ResponseEntity.ok(new DadosDetalhamentoCliente(cliente));
    }
}
