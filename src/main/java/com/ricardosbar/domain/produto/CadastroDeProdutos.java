package com.ricardosbar.domain.produto;

import com.ricardosbar.domain.cliente.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CadastroDeProdutos {

    @Autowired
    private ProdutoRepository produtoRepository;

    public DadosDetalhamentoProduto cadastrar(DadosCadastroProduto dados) {

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
        return new DadosDetalhamentoProduto(produto);
    }
}
