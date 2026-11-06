package com.ricardosbar.repository;

import com.ricardosbar.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProdutoRepository  extends JpaRepository<Produto, Long> {
    // bloqueado é Integer (0/1), então "BloqueadoFalse/True" derivado não funciona: consulta explícita
    @Query("select p from Produto p where coalesce(p.bloqueado, 0) = 0")
    Page<Produto> findAllByBloqueadoFalse(Pageable paginacao);

    @Query("select p from Produto p where p.bloqueado = 1")
    Page<Produto> findAllByBloqueadoTrue(Pageable paginacao);
    //Page<Produto> findAll(Pageable paginacao);

    @Query("""
            select max(p.descricao)
            from Produto p
            where
            p.descricao = :descricaoProduto
            and p.id <> :id
            """)
    String produtoDuplicado(String descricaoProduto, Long id);

    List<Produto> findAllByDescricaoContainingIgnoreCase(String descricao);

    //Boolean findByBloqueadoFalse();
}
