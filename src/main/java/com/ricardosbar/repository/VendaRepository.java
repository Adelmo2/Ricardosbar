package com.ricardosbar.repository;

import com.ricardosbar.dto.DadosDetalhamentoVendaFullDto;
import com.ricardosbar.model.Venda;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {
    Page<Venda> findAll(Pageable paginacao);

    @Query("""
    SELECT new com.ricardosbar.dto.DadosDetalhamentoVendaFullDto(v)
    FROM Venda v
    WHERE v.cliente.id = :id
    """)
    List<DadosDetalhamentoVendaFullDto> vendasPorCliente(@Param("id") Long id);

    @Query("""
    SELECT new com.ricardosbar.dto.DadosDetalhamentoVendaFullDto(v)
    FROM Venda v
    WHERE v.produto.id = :id
    """)
    List<DadosDetalhamentoVendaFullDto> vendasPorProduto(@Param("id") Long id);

    @Query("""
    SELECT new com.ricardosbar.dto.DadosDetalhamentoVendaFullDto(v)
    FROM Venda v
    ORDER BY v.id DESC
    """)
    List<DadosDetalhamentoVendaFullDto> listarTodas();
}
