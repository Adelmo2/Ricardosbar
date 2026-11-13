package com.ricardosbar.model;

import com.ricardosbar.dto.DadosAtualizacaoVendaDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "vendidos")
@Entity(name = "Venda")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_clientes")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produtos")
    private Produto produto;

    private Double quantidade;
    private LocalDateTime data_pagamento;
    private String hora_pagamento;
    private Double valor;
    private Double total;
    private Integer cupom;
    private Integer pago;

    public Venda(Cliente cliente, Produto produto, Double quantidade, Double valor, Integer cupom, Integer pago) {
        this.cliente = cliente;
        this.produto = produto;
        this.quantidade = quantidade;
        this.data_pagamento = LocalDateTime.now();
        this.hora_pagamento = "";
        if (produto.getId() == 1 && valor > 0) {
            this.valor = (valor * -1);
            this.total = (quantidade * (valor * -1));
        } else {
            this.valor = valor;
            this.total = (quantidade * valor);
        }
        this.cupom = cupom;
        this.pago = pago;
    }

    public void atualizar(DadosAtualizacaoVendaDto dto) {
        if (dto.quantidade() != null) {
            this.quantidade = dto.quantidade();
        }
        if (dto.valor() != null) {
            if (this.produto.getId() == 1 && dto.valor() > 0) {
                this.valor = (dto.valor() * -1);
            } else {
                this.valor = dto.valor();
            }
        }
        if (dto.cupom() != null) {
            this.cupom = dto.cupom();
        }
        if (dto.pago() != null) {
            this.pago = dto.pago();
        }
        this.total = (this.quantidade * this.valor);
//        if (this.produto.getId() == 1 && dto.valor() > 0) {
//            this.total = (this.quantidade * (this.valor * -1));
//        } else {
//            this.total = (this.quantidade * this.valor);
//        }
    }
}
