package com.ricardosbar.controller;

import com.ricardosbar.domain.venda.CadastroDeVendas;
import com.ricardosbar.domain.venda.DadosCadastroVenda;
import com.ricardosbar.domain.venda.VendaRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("vendas")
@SecurityRequirement(name = "bearer-key")
public class VendaController {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private CadastroDeVendas cadastroDeVendas;

    @PostMapping
    @Transactional
    @RequestMapping("/cadastrar")
    public ResponseEntity cadastrarVenda(@RequestBody @Valid DadosCadastroVenda dados) {
        System.out.println("******DADOS****");
        System.out.println(dados);
        var dto = cadastroDeVendas.cadastrarVenda(dados);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/excluir/{id}")
    @Transactional
    public ResponseEntity excluir(@PathVariable Long id) {
        //var produto = produtoRepository.getReferenceById(id);
        //produto.inativar();
        cadastroDeVendas.excluir(id);
        return ResponseEntity.noContent().build();
    }

}
