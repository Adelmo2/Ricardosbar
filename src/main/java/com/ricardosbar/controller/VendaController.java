package com.ricardosbar.controller;

import com.ricardosbar.repository.ClienteRepository;
import com.ricardosbar.service.CadastroDeVendasService;
import com.ricardosbar.dto.DadosCadastroVendaDto;
import com.ricardosbar.service.DadosDetalhamentoVendasService;
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
    private CadastroDeVendasService cadastroDeVendas;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private DadosDetalhamentoVendasService dadosDetalhamentoVendasService;

    @PostMapping
    @Transactional
    @RequestMapping("/cadastrar")
    public ResponseEntity cadastrarVenda(@RequestBody @Valid DadosCadastroVendaDto dados) {
        System.out.println("******DADOS****");
        System.out.println(dados);
        var dto = cadastroDeVendas.cadastrarVenda(dados);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/excluir/{id}")
    @Transactional
    public ResponseEntity excluir(@PathVariable Long id) {
        cadastroDeVendas.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/consultarvendascliente/{id}")
    public ResponseEntity consultarVendaCliente(@PathVariable Long id) {
        return ResponseEntity.ok(dadosDetalhamentoVendasService.listaVendaDoCliente(id)
        );
    }

    @GetMapping("/consultarvendasproduto/{id}")
    public ResponseEntity consultarVendaProduto(@PathVariable Long id) {
        return ResponseEntity.ok(dadosDetalhamentoVendasService.listaVendaDoProduto(id)
        );
    }
}
