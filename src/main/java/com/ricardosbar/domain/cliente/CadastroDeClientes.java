package com.ricardosbar.domain.cliente;

import com.ricardosbar.domain.validacaoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CadastroDeClientes {

    @Autowired
    private ClienteRepository clienteRepository;

    public DadosDetalhamentoCliente cadastrar(DadosCadastroCliente dados) {

        if (dados.nome().isEmpty()) {
            throw new validacaoException("O nome do cliente é obrigatório!");
        }

        var temCliente = clienteRepository.clienteDuplicado(dados.nome());
        if (temCliente != null) {
            throw new validacaoException("Cliente já cadastrado!");
        }

        var cliente = new Cliente(dados);
        clienteRepository.save(cliente);
        return new DadosDetalhamentoCliente(cliente);
    }
}
