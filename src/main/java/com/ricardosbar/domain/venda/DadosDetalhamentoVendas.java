package com.ricardosbar.domain.venda;

import com.ricardosbar.domain.cliente.ClienteRepository;
import com.ricardosbar.domain.produto.ProdutoRepository;
import com.ricardosbar.domain.validacaoException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DadosDetalhamentoVendas {

    private final VendaRepository vendaRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository  produtoRepository;
    public DadosDetalhamentoVendas(VendaRepository vendaRepository, ClienteRepository clienteRepository, ProdutoRepository produtoRepository) {
        this.vendaRepository = vendaRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }
//    public List<DadosDetalhamentoVendaDto> listaVendaDoCliente(Long id) {
//        List<Venda> vendas = vendaRepository.vendasPorCliente(id);
//        return vendas.stream()
//                .map(DadosDetalhamentoVendaDto::new)
//                .toList();
//    }

    public List<DadosDetalhamentoVendaDto> listaVendaDoCliente(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new validacaoException("Id do cliente informado não existe!");
        }
        return  vendaRepository.vendasPorCliente(id);
    }

    public List<DadosDetalhamentoVendaDto> listaVendaDoProduto(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new validacaoException("Id do produto informado não existe!");
        }
        return  vendaRepository.vendasPorProduto(id);
    }

}