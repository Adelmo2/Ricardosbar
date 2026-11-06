package com.ricardosbar.service;

import com.ricardosbar.repository.ClienteRepository;
import com.ricardosbar.repository.ProdutoRepository;
import com.ricardosbar.validacoes.validacaoException;
import com.ricardosbar.dto.DadosCadastroVendaDto;
import com.ricardosbar.dto.DadosDetalhamentoVendaDto;
import com.ricardosbar.dto.DadosAtualizacaoVendaDto;
import com.ricardosbar.dto.DadosDetalhamentoVendaFullDto;
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

    public DadosDetalhamentoVendaFullDto alterar(DadosAtualizacaoVendaDto dados) {
        if (!vendaRepository.existsById(dados.id())) {
            throw new validacaoException("Id da venda informado não existe!");
        }

        var venda = vendaRepository.getReferenceById(dados.id());
        var cliente = clienteRepository.getReferenceById(venda.getCliente().getId());
        boolean pagamento = venda.getProduto().getId() == 1;

        Double valorAntigo = venda.getValor();
        Double totalAntigo = venda.getTotal();

        venda.atualizar(dados);

        if (!pagamento) {
            if (venda.getQuantidade() == 0) {
                throw new validacaoException("Informe a quantidade!");
            }
            if (venda.getValor() == 0) {
                throw new validacaoException("Informe o valor!");
            }
            if (cliente.getLimite() > 0 && venda.getTotal() > totalAntigo && venda.getTotal() > cliente.getLimite()) {
                throw new validacaoException("Valor Total de venda(s): " + venda.getTotal()
                        + " Maior que o Limite do cliente: " + cliente.getLimite());
            }
        }

        // Ajusta o saldo pela diferença, usando "+" para não alterar os dados de último pagamento
        if (pagamento) {
            cliente.atualizaSaldo(valorAntigo - venda.getValor(), "+");
        } else {
            cliente.atualizaSaldo(venda.getTotal() - totalAntigo, "+");
        }

        return new DadosDetalhamentoVendaFullDto(venda);
    }

    public void excluir(Long id) {
        var venda = vendaRepository.getReferenceById(id);
        var cliente =  clienteRepository.getReferenceById(venda.getCliente().getId());
        var produto = produtoRepository.getReferenceById(venda.getProduto().getId());
        if (produto.getId() == 1) {
            cliente.atualizaSaldo(venda.getTotal(), "+");
        } else {
            cliente.atualizaSaldo(venda.getTotal(), "-");
        }
        vendaRepository.deleteById(id);
    }
}
