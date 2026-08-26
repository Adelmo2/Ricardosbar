package com.ricardosbar.controller;

import com.ricardosbar.domain.cliente.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("clientes")
@SecurityRequirement(name = "bearer-key")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private CadastroDeClientes cadastroDeClientes;

    @PostMapping
    @Transactional
    @RequestMapping("/cadastrar")
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroCliente dados, UriComponentsBuilder uriBuilder){
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

    @GetMapping
    @RequestMapping("/listartodos")
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity detalhar(@PathVariable Long id) {
        var cliente = clienteRepository.getReferenceById(id);
        return ResponseEntity.ok(new DadosDetalhamentoCliente(cliente));
    }

    @GetMapping("/saldo/{id}")
    public ResponseEntity saldo(@PathVariable Long id) {
        var cliente = clienteRepository.getReferenceById(id);
        return ResponseEntity.ok(new SaldoCliente(cliente));
    }

    @GetMapping("/consultarcliente/{id}")
    public ResponseEntity consultarCliente(@PathVariable Long id) {
        var cliente = clienteRepository.getReferenceById(id);
        return ResponseEntity.ok(new DadosDetalhamentoCliente(cliente));
    }

    @DeleteMapping("/inativar/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity excluir(@PathVariable Long id) {
        var cliente = clienteRepository.getReferenceById(id);
        cliente.excluir();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/ativar/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity ativar(@PathVariable Long id) {
        var cliente = clienteRepository.getReferenceById(id);
        cliente.ativar();
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    @Transactional
    @RequestMapping("/alterar")
    public ResponseEntity atualizar(@RequestBody @Valid DadosAtualizacaoCliente dados) {
        var cliente =  clienteRepository.getReferenceById(dados.id());
        var valildaCadastro = new ValidaCadastroCliente();
        valildaCadastro.ValidaAlteracaoCliente(dados, clienteRepository);

        cliente.atualizarCadastroCliente(dados);
        return ResponseEntity.ok(new DadosAtualizacaoCliente(cliente));
    }

}
