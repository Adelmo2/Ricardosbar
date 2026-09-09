package com.ricardosbar.domain.venda;

//import com.ricardosbar.domain.ValidacaoException;
import com.ricardosbar.domain.cliente.ClienteRepository;
import com.ricardosbar.domain.produto.ProdutoRepository;
import com.ricardosbar.domain.validacaoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class CadastroDeVendas {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public DadosDetalhamentoConsulta cadastrarVenda(DadosCadastroVenda dados) {
        if (!clienteRepository.existsById(dados.id_clientes())) {
            throw new validacaoException("Id do paciente informado não existe!");
        }

        if (!produtoRepository.existsById(dados.id_produtos())) {
            throw new validacaoException("Id do produto informado não existe!");
        }

        var cliente =  clienteRepository.getReferenceById(dados.id_clientes());
        var produto =  produtoRepository.getReferenceById(dados.id_produtos());

        if (produto.getBloqueado() == true) {
            throw new validacaoException("Produto bloqueado!");
        }

        if (cliente.getBloqueado() == true) {
            throw new validacaoException("Cliente bloqueado!");
        }

        var venda = new Venda(cliente, produto, dados.quantidade(), dados.valor(), dados.cupom(), dados.pago());

        cliente.atualizaSaldo(dados.valor(), "+");

        vendaRepository.save(venda);

        return new DadosDetalhamentoConsulta(venda);

    }
}
