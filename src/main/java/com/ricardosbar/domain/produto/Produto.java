package com.ricardosbar.domain.produto;

import com.ricardosbar.domain.cliente.DadosCadastroCliente;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "produtos")
@Entity(name = "Produto")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;
    private Double preco;
    private Boolean casco;
    private Boolean bloqueado;

    public Produto(DadosCadastroProduto dados) {
        this.descricao = dados.descricao().toUpperCase();
        this.preco = dados.preco();
        this.casco = dados.casco();
        this.bloqueado = dados.bloqueado();
    }
}