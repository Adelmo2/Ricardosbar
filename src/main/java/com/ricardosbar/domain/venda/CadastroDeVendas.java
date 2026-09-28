package com.ricardosbar.domain.venda;

import com.ricardosbar.domain.cliente.ClienteRepository;
import com.ricardosbar.domain.produto.ProdutoRepository;
import com.ricardosbar.domain.validacaoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CadastroDeVendas {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public DadosDetalhamentoVenda cadastrarVenda(DadosCadastroVenda dados) {
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

        if (cliente.getBloqueado() == true && produto.getId() != 1) {
            throw new validacaoException("Cliente bloqueado!");
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
        return new DadosDetalhamentoVenda(venda);
    }

    public void excluir(Long id) {
        var venda = vendaRepository.getReferenceById(id);
        var cliente =  clienteRepository.getReferenceById(venda.getCliente().getId());
        cliente.atualizaSaldo(venda.getTotal(), "-");
        vendaRepository.deleteById(id);
    }
}
