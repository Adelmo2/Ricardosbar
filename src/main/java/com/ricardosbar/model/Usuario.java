package com.ricardosbar.model;

import com.ricardosbar.dto.DadosUsuarioDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "usuarios")
@Entity(name = "Usuario")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String login;
    private String senha;

    public Usuario(DadosUsuarioDto dadosUsuarioDto) {
        this.id = dadosUsuarioDto.id();
        this.login = dadosUsuarioDto.login();
        this.senha = dadosUsuarioDto.senha();
    }
}
