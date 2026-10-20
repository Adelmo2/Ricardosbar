package com.ricardosbar.service;

import com.ricardosbar.repository.ClienteRepository;
import com.ricardosbar.repository.ProdutoRepository;
import com.ricardosbar.validacoes.validacaoException;
import com.ricardosbar.dto.DadosCadastroVendaDto;
import com.ricardosbar.dto.DadosDetalhamentoVendaDto;
import com.ricardosbar.repository.VendaRepository;
import com.ricardosbar.model.Venda;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CadastroDeVendasService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public DadosDetalhamentoVendaDto cadastrarVenda(DadosCadastroVendaDto dados) {
        if (!clienteRepository.existsById(dados.id_clientes())) {
            throw new validacaoException("Id do cliente informado não existe!");
        }

        if (!produtoRepository.existsById(dados.id_produtos())) {
            throw new validacaoException("Id do produto informado não existe!");
        }

        var cliente =  clienteRepository.getReferenceById(dados.id_clientes());
        var produto =  produtoRepository.getReferenceById(dados.id_produtos());

        if (produto.getBloqueado() == 1) {
            throw new validacaoException("Produto bloqueado!");
        }

        if (cliente.getBloqueado() == 1 && produto.getId() != 1) {
            throw new validacaoException("Cliente bloqueado!");
        }

        Double valorTotal = (dados.valor() * dados.quantidade());
        if (cliente.getLimite() > 0 && valorTotal >  cliente.getLimite() ) {
            String mensagem = ("Valor Total de venda(s): " +  valorTotal + " Maior que o Limite do cliente: " + cliente.getLimite() );
            throw new validacaoException(mensagem);
        }

        if (produto.getId() != 1) {
            if (dados.quantidade() == 0) {
                throw new validacaoException("Informe a quantidade!");
            }
            if (dados.valor() == 0) {
                throw new validacaoException("Informe o valor!");
            }
        }

        var venda = new Venda(cliente, produto, dados.quantidade(), dados.valor(), dados.cupom(), dados.pago());

        if (produto.getId() == 1) {
            cliente.atualizaSaldo((dados.valor()), "-");
        } else {
            cliente.atualizaSaldo((dados.valor() * dados.quantidade()), "+");
        }
        vendaRepository.save(venda);
        return new DadosDetalhamentoVendaDto(venda);
    }

    public void excluir(Long id) {
        var venda = vendaRepository.getReferenceById(id);
        var cliente =  clienteRepository.getReferenceById(venda.getCliente().getId());
        cliente.atualizaSaldo(venda.getTotal(), "-");
        vendaRepository.deleteById(id);
    }
}
