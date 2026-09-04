package com.ricardosbar.domain.venda;

import com.ricardosbar.domain.cliente.Cliente;
import com.ricardosbar.domain.produto.Produto;
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

    private int quantidade;
    private LocalDateTime data_pagamento;
    private String hora_pagamento;
    private Double valor;
    private Double total;
    private Boolean cupom;
    private Boolean pago;
}
