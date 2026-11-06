package com.ricardosbar.repository;

import com.ricardosbar.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByLogin(String login);
    boolean existsByLoginAndSenha(String login, String senha);

    Usuario findByLogin(String login);

}
