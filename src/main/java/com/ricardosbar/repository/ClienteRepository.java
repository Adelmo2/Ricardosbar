package com.ricardosbar.repository;

import com.ricardosbar.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Page<Cliente> findAllByBloqueadoFalse(Pageable paginacao);

    List<Cliente> findByNomeContainingIgnoreCaseOrderByNome(String nome);

    @Query("""
            select max(c.nome)
            from Cliente c
            where
            c.nome = :nomeCliente
            and c.id <> :id
            """)
    String clienteDuplicado(String nomeCliente, Long id);
}
