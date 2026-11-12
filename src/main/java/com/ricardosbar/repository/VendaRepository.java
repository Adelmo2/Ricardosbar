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
    WHERE UPPER(v.cliente.nome) LIKE UPPER(CONCAT('%', :nome, '%'))
    ORDER BY v.cliente.nome, v.id DESC
    """)
    List<DadosDetalhamentoVendaFullDto> vendasPorCliente(@Param("nome") String nome);

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

    // filtros opcionais: texto vazio casa com qualquer cliente/produto
    @Query("""
    SELECT new com.ricardosbar.dto.DadosDetalhamentoVendaFullDto(v)
    FROM Venda v
    WHERE UPPER(v.cliente.nome) LIKE UPPER(CONCAT('%', :cliente, '%'))
      AND UPPER(v.produto.descricao) LIKE UPPER(CONCAT('%', :produto, '%'))
    ORDER BY v.id DESC
    """)
    List<DadosDetalhamentoVendaFullDto> pesquisar(@Param("cliente") String cliente, @Param("produto") String produto);
}
