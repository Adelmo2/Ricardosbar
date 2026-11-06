package com.ricardosbar.controller;

import com.ricardosbar.repository.ClienteRepository;
import com.ricardosbar.service.CadastroDeVendasService;
import com.ricardosbar.dto.DadosCadastroVendaDto;
import com.ricardosbar.dto.DadosAtualizacaoVendaDto;
import com.ricardosbar.service.DadosDetalhamentoVendasService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("vendas")
//@SecurityRequirement(name = "bearer-key")
public class VendaController {

    @Autowired
    private CadastroDeVendasService cadastroDeVendasServie;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private DadosDetalhamentoVendasService dadosDetalhamentoVendasService;

    @PostMapping
    @Transactional
    @RequestMapping("/cadastrar")
    public ResponseEntity cadastrarVenda(@RequestBody @Valid DadosCadastroVendaDto dados) {
        try {
            var dto = cadastroDeVendasServie.cadastrarVenda(dados);
            return ResponseEntity.ok(dto);
        } catch (ValidationException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    @PutMapping("/alterar")
    @Transactional
    public ResponseEntity alterarVenda(@RequestBody @Valid DadosAtualizacaoVendaDto dados) {
        return ResponseEntity.ok(cadastroDeVendasServie.alterar(dados));
    }

    @GetMapping("/listartodos")
    public ResponseEntity listarTodas() {
        return ResponseEntity.ok(dadosDetalhamentoVendasService.listaTodas());
    }

    @DeleteMapping("/excluir/{id}")
    @Transactional
    public ResponseEntity excluir(@PathVariable Long id) {
        cadastroDeVendasServie.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/consultarvendascliente/{nome}")
    public ResponseEntity consultarVendaCliente(@PathVariable String nome) {
        return ResponseEntity.ok(dadosDetalhamentoVendasService.listaVendaDoCliente(nome)
        );
    }

    @GetMapping("/consultarvendasproduto/{id}")
    public ResponseEntity consultarVendaProduto(@PathVariable Long id) {
        return ResponseEntity.ok(dadosDetalhamentoVendasService.listaVendaDoProduto(id)
        );
    }
}
