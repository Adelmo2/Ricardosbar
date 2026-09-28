package com.ricardosbar.domain.venda;

import com.ricardosbar.domain.cliente.ClienteRepository;
import com.ricardosbar.domain.produto.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class DadosDetalhamentoVendaCliente {

    private final VendaRepository vendaRepository;

    public DadosDetalhamentoVendaCliente(VendaRepository vendaRepository) {
        this.vendaRepository = vendaRepository;
    }

//    public List<DadosDetalhamentoVendaDto> listaVendaDoCliente(Long id) {
//
//        List<Venda> vendas = vendaRepository.vendasPorCliente(id);
//
//        return vendas.stream()
//                .map(DadosDetalhamentoVendaDto::new)
//                .toList();
//    }
    public List<DadosDetalhamentoVendaDto> listaVendaDoCliente(Long id) {
        return  vendaRepository.vendasPorCliente(id);
    }
}