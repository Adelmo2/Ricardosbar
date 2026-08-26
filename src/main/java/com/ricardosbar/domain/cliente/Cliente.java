package com.ricardosbar.domain.cliente;

import com.ricardosbar.domain.validacaoException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Table(name = "clientes")
@Entity(name = "Cliente")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String telefone;
    private String endereco;
    private String bairro;
    private String cidade;
    private String uf;
    private String valor_ult_pagto;
    private LocalDateTime dt_ult_pago;
    private String hora_ult_pago;
    private Double saldo_pagar;
    private LocalDateTime primeira_compra;
    private Double limite;
    private Boolean bloqueado;
    private String observacao;
    private String email;

    public Cliente(DadosCadastroCliente dados) {

        this.nome = dados.nome();
        this.telefone = dados.telefone();
        this.endereco = dados.endereco();
        this.bairro = dados.bairro();
        this.cidade = dados.cidade();
        this.uf = dados.uf();
        this.valor_ult_pagto = dados.valor_ult_pagto();
        this.dt_ult_pago = dados.dt_ult_pago();
        this.hora_ult_pago = dados.hora_ult_pago();
        this.saldo_pagar = dados.saldo_pagar();
        this.primeira_compra = dados.primeira_compra();
        this.limite = dados.limite();
        this.bloqueado = dados.bloqueado();
        this.observacao = dados.observacao();
        this.email = dados.email();
    }

    public void atualizarCadastroCliente(DadosAtualizacaoCliente dados) {
    //public void atualizarInformacoes(DadosCadastroCliente dados) {

        //asr
        //var validaCadastro = new ValidaCadastroCliente();
        //validaCadastro.ValidaCliente(dados, true, null);
        //validaCadastro.ValidaAlteracaoCliente(dados);


        //if (nomeExistente != null) {
        //    var mensagem = ("O Cliente " + dados.nome() + " Já esta cadastrado em outro registro!");
        //    throw new validacaoException("Nome Cliente o cliente possui já cadastrado!...");
        //}

//        if (dados.nome().isEmpty()) {
//            throw new validacaoException("O nome do cliente é obrigatório!..");
//        }
//
//
//        if (!dados.email().isEmpty()) {
//            if (!dados.email().contains("@")) {
//                throw new validacaoException("Email inválido!...");
//            }
//            if (!dados.email().contains(".")) {
//                throw new validacaoException("Email inválido!...");
//            }
//        }

        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.telefone() != null) {
            this.telefone = dados.telefone();
        }
        if (dados.endereco() != null) {
            this.endereco = dados.endereco();
        }
        if (dados.bairro() != null) {
            this.bairro = dados.bairro();
        }
        if (dados.cidade() != null) {
            this.cidade = dados.cidade();
        }
        if (dados.uf() != null) {
            this.uf = dados.uf();
        }
        if (dados.observacao() != null) {
            this.observacao = dados.observacao();
        }
        if (dados.email() != null) {
            this.email = dados.email();
        }
        if (dados.limite() > 0) {
            this.limite = dados.limite();
        }
    }

    public void excluir() {
        this.bloqueado = true;
    }

    public void ativar() {
        this.bloqueado = false;
    }
}
