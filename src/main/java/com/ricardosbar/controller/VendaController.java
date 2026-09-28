package com.ricardosbar.controller;

import com.ricardosbar.domain.cliente.ClienteRepository;
import com.ricardosbar.domain.venda.CadastroDeVendas;
import com.ricardosbar.domain.venda.DadosCadastroVenda;
import com.ricardosbar.domain.venda.DadosDetalhamentoVendaCliente;
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
    private CadastroDeVendas cadastroDeVendas;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private DadosDetalhamentoVendaCliente dadosDetalhamentoVendaCliente;

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
        cadastroDeVendas.excluir(id);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/consultarvendascliente/{id}")
//    public ResponseEntity consultarVendaCliente(@PathVariable Long id) {
//        dadosDetalhamentoVendaCliente.listaVendaDoCliente(id);
//        return ResponseEntity.ok(new DadosDetalhamentoVendaCliente().listaVendaDoCliente(id));
//    }

    @GetMapping("/consultarvendascliente/{id}")
    //public ResponseEntity<List<DadosDetalhamentoVendaDto>> consultarVendaCliente(@PathVariable Long id) {
    public ResponseEntity consultarVendaCliente(@PathVariable Long id) {
        return ResponseEntity.ok(
                dadosDetalhamentoVendaCliente.listaVendaDoCliente(id)
        );
    }
}
