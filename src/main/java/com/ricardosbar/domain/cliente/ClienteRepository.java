package com.ricardosbar.domain.cliente;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Page<Cliente> findAllByBloqueadoFalse(Pageable paginacao);

    @Query("""
            select max(c.nome)
            from Cliente c
            where
            c.nome = :nomeCliente
            """)
    String clienteDuplicado(String nomeCliente);
}
