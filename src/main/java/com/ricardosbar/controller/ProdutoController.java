package com.ricardosbar.controller;

import com.ricardosbar.dto.DadosAtualizacaoProdutoDto;
import com.ricardosbar.dto.DadosCadastroProdutoDto;
import com.ricardosbar.dto.DadosDetalhamentoProdutoDto;
import com.ricardosbar.model.Produto;
import com.ricardosbar.repository.ProdutoRepository;
import com.ricardosbar.service.CadastroDeProdutosService;
import com.ricardosbar.validacoes.ValidaCadastroProduto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("produtos")
@SecurityRequirement(name = "bearer-key")
public class ProdutoController {

    @Autowired
    private CadastroDeProdutosService cadastroDeProdutos;

    @Autowired
    private ProdutoRepository produtoRepository;

    @GetMapping
    @RequestMapping("/listarapi")
    public ResponseEntity cadastrarProduto(@RequestBody @Valid DadosCadastroProdutoDto dados){
        System.out.println("TesteApi | Dados: " + dados);
        var produto = new Produto(dados);
        return ResponseEntity.ok(new DadosDetalhamentoProdutoDto(produto));
    }

    @PostMapping
    @Transactional
    @RequestMapping("/cadastrar")
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroProdutoDto dados, UriComponentsBuilder uriBuilder){
        var dto = cadastroDeProdutos.cadastrar(dados);
        return ResponseEntity.ok(dto);
    }

    @PutMapping
    @Transactional
    @RequestMapping("/alterar")
    public ResponseEntity atualizar(@RequestBody @Valid DadosAtualizacaoProdutoDto dados) {
        var produto = produtoRepository.getReferenceById(dados.id());
        var validaCadastro = new ValidaCadastroProduto();
        validaCadastro.ValidaAlteracaoProduto(dados, produtoRepository);

        produto.atualizarCadastroProduto(dados);
        return ResponseEntity.ok(new DadosAtualizacaoProdutoDto(produto));
    }

    @DeleteMapping("/inativar/{id}")
    @Transactional
    public ResponseEntity inativar(@PathVariable Long id) {
        var produto = produtoRepository.getReferenceById(id);
        produto.inativar();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/ativar/{id}")
    @Transactional
    public ResponseEntity ativar(@PathVariable Long id) {
        var produto = produtoRepository.getReferenceById(id);
        produto.ativar();
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @RequestMapping("/listartodos")
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    @GetMapping
    @RequestMapping("/listarativos")
    public ResponseEntity<Page<DadosDetalhamentoProdutoDto>> listarAtivos(@PageableDefault(size = 10, sort = {"descricao"}) Pageable paginacao) {
        var page = produtoRepository.findAllByBloqueadoFalse(paginacao).map(DadosDetalhamentoProdutoDto::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping
    @RequestMapping("/listarinativos")
    public ResponseEntity<Page<DadosDetalhamentoProdutoDto>> listarInativos(@PageableDefault(size = 10, sort = {"descricao"}) Pageable paginacao) {
        var page = produtoRepository.findAllByBloqueadoTrue(paginacao).map(DadosDetalhamentoProdutoDto::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/consultar/{id}")
    public ResponseEntity consultarProduto(@PathVariable Long id) {
        var produto = produtoRepository.getReferenceById(id);
        return ResponseEntity.ok(new DadosDetalhamentoProdutoDto(produto));
    }

    @GetMapping("/pesquisarnomeproduto/{nomeProduto}")
    public ResponseEntity<List<DadosDetalhamentoProdutoDto>> pesquisarNomeProduto(@PathVariable String nomeProduto) {

        List<Produto> produtos = produtoRepository.findAllByDescricaoContainingIgnoreCase(nomeProduto);

        List<DadosDetalhamentoProdutoDto> retorno = produtos.stream()
                .map(DadosDetalhamentoProdutoDto::new)
                .toList();
        System.out.println(retorno);
        return ResponseEntity.ok(retorno);
    }
}
