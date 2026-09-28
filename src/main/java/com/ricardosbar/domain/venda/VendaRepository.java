package com.ricardosbar.domain.venda;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {
    Page<Venda> findAll(Pageable paginacao);

    @Query("""
    SELECT new com.ricardosbar.domain.venda.DadosDetalhamentoVendaDto(v)
    FROM Venda v
    WHERE v.cliente.id = :id
    """)
    List<DadosDetalhamentoVendaDto> vendasPorCliente(@Param("id") Long id);
}
