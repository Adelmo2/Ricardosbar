package com.ricardosbar.controller;

import com.ricardosbar.domain.cliente.CadastroDeClientes;
import com.ricardosbar.domain.cliente.DadosCadastroCliente;
import com.ricardosbar.domain.produto.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("produtos")
@SecurityRequirement(name = "bearer-key")
public class ProdutoController {

    @Autowired
    private CadastroDeProdutos cadastroDeProdutos;

    @Autowired
    private ProdutoRepository produtoRepository;

    @GetMapping
    @RequestMapping("/listarapi")
    public ResponseEntity cadastrarProduto(@RequestBody @Valid DadosCadastroProduto dados){
        System.out.println("TesteApi | Dados: " + dados);
        var produto = new Produto(dados);
        return ResponseEntity.ok(new DadosDetalhamentoProduto(produto));
    }

    @PostMapping
    @Transactional
    @RequestMapping("/cadastrar")
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroProduto dados, UriComponentsBuilder uriBuilder){
        var dto = cadastroDeProdutos.cadastrar(dados);
        return ResponseEntity.ok(dto);
    }
}
