package com.ricardosbar.service;

import com.ricardosbar.dto.DadosDetalhamentoVendaFullDto;
import com.ricardosbar.repository.ClienteRepository;
import com.ricardosbar.repository.ProdutoRepository;
import com.ricardosbar.validacoes.validacaoException;
import com.ricardosbar.repository.VendaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DadosDetalhamentoVendasService {

    private final VendaRepository vendaRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository  produtoRepository;
    public DadosDetalhamentoVendasService(VendaRepository vendaRepository, ClienteRepository clienteRepository, ProdutoRepository produtoRepository) {
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

    public List<DadosDetalhamentoVendaFullDto> listaVendaDoCliente(String nome) {
        if (clienteRepository.findByNomeContainingIgnoreCaseOrderByNome(nome.trim()).isEmpty()) {
            throw new validacaoException("Nenhum cliente encontrado com o nome informado!");
        }
        return  vendaRepository.vendasPorCliente(nome.trim());
    }

    public List<DadosDetalhamentoVendaFullDto> listaTodas() {
        return vendaRepository.listarTodas();
    }

    /** Vendas cujo nome do cliente e descrição do produto contêm os textos informados (vazio = sem filtro) */
    public List<DadosDetalhamentoVendaFullDto> pesquisar(String cliente, String produto) {
        return vendaRepository.pesquisar(cliente.trim(), produto.trim());
    }

    public List<DadosDetalhamentoVendaFullDto> listaVendaDoProduto(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new validacaoException("Id do produto informado não existe!");
        }
        return  vendaRepository.vendasPorProduto(id);
    }

}