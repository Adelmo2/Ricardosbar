package com.ricardosbar.service;

import com.ricardosbar.model.Produto;
import com.ricardosbar.repository.ProdutoRepository;
import com.ricardosbar.validacoes.ValidaCadastroProduto;
import com.ricardosbar.dto.DadosCadastroProdutoDto;
import com.ricardosbar.dto.DadosDetalhamentoProdutoDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CadastroDeProdutosService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public DadosDetalhamentoProdutoDto cadastrar(DadosCadastroProdutoDto dados) {

        var validaCadastro = new ValidaCadastroProduto();
        validaCadastro.ValidaNovoProduto(dados, produtoRepository);

        var produto = new Produto(
                null,
                dados.descricao(),
                dados.preco(),
                dados.casco(),
                dados.bloqueado()
        );
        produtoRepository.save(produto);
        //return new DadosDetalhamentoProduto(produto);
        return new DadosDetalhamentoProdutoDto(produto);
    }
}
