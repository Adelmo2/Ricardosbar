package com.ricardosbar.model;

import com.ricardosbar.dto.DadosAtualizacaoProdutoDto;
import com.ricardosbar.dto.DadosCadastroProdutoDto;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.*;

@Table(name = "produtos")
@Entity(name = "Produto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;
    private Double preco;
    private Integer casco;
    private Integer bloqueado;

    public Produto(DadosCadastroProdutoDto dto) {
        this.descricao = dto.descricao().toUpperCase();
        this.preco = dto.preco();
        this.casco = dto.casco();
        this.bloqueado = dto.bloqueado();
    }

    public void atualizarCadastroProduto(@Valid DadosAtualizacaoProdutoDto dto) {
        if  (dto.descricao() != null) {
            this.descricao = dto.descricao().toUpperCase();
        }
        if  (dto.preco() != null) {
            this.preco = dto.preco();
        }
        if  (dto.casco() != null) {
            this.casco = dto.casco();
        }
        if  (dto.bloqueado() != null) {
            this.bloqueado = dto.bloqueado();
        }
    }

    public void inativar() {
        this.bloqueado = 1;
    }

    public void ativar() {
        this.bloqueado = 0;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao.toUpperCase();
    }

    public String getDescricao() {
        return descricao.toUpperCase();
    }
}