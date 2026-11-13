package com.ricardosbar.model;

import com.ricardosbar.dto.DadosAtualizacaoClienteDto;
import com.ricardosbar.dto.DadosCadastroClienteDto;
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
    private Double valor_ult_pagto;
    private LocalDateTime dt_ult_pago;
    private String hora_ult_pago;
    private Double saldo_pagar;
    private LocalDateTime primeira_compra;
    private Double limite;
    private Integer bloqueado;
    private String observacao;
    private String email;

    public Cliente(DadosCadastroClienteDto dto) {

        this.nome = dto.nome().toUpperCase();
        this.telefone = dto.telefone();
        this.endereco = dto.endereco();
        this.bairro = dto.bairro();
        this.cidade = dto.cidade().toUpperCase();
        this.uf = dto.uf().toUpperCase();
        this.valor_ult_pagto = dto.valor_ult_pagto();
        this.dt_ult_pago = dto.dt_ult_pago();
        this.hora_ult_pago = dto.hora_ult_pago();
        this.saldo_pagar = dto.saldo_pagar();
        this.primeira_compra = dto.primeira_compra();
        this.limite = dto.limite();
        this.bloqueado = dto.bloqueado();
        this.observacao = dto.observacao();
        this.email = dto.email();
    }

    public void atualizarCadastroCliente(DadosAtualizacaoClienteDto dto) {

        if (dto.nome() != null) {
            this.nome = dto.nome().toUpperCase();
        }
        if (dto.telefone() != null) {
            this.telefone = dto.telefone();
        }
        if (dto.endereco() != null) {
            this.endereco = dto.endereco();
        }
        if (dto.bairro() != null) {
            this.bairro = dto.bairro().toUpperCase();
        }
        if (dto.cidade() != null) {
            this.cidade = dto.cidade().toUpperCase();
        }
        if (dto.uf() != null) {
            this.uf = dto.uf().toUpperCase();
        }
        if (dto.observacao() != null) {
            this.observacao = dto.observacao();
        }
        if (dto.email() != null) {
            this.email = dto.email();
        }
        if (dto.limite() > 0) {
            this.limite = dto.limite();
        }
    }

    public void excluir() {
        this.bloqueado = 1;
    }

    public void ativar() {
        this.bloqueado = 0;
    }

    public void atualizaSaldo(Double valor, String operacao) {
        if (operacao.equals("+")) {
            this.saldo_pagar += valor;
        } else if (operacao.equals("-")) {
            this.saldo_pagar -= valor;
        }
        if (this.primeira_compra == null && valor > 0) {
            this.primeira_compra = LocalDateTime.now();
        }
        if (operacao.equals("+") && valor < 0) {
            this.dt_ult_pago = LocalDateTime.now();
            this.valor_ult_pagto = valor;
        }
    }

    public void atualizaSaldoDeExclusao(Double valor) {
        this.saldo_pagar -= valor;
    }
}
