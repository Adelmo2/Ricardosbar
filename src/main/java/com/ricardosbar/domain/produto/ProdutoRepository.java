package com.ricardosbar.domain.produto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProdutoRepository  extends JpaRepository<Produto, Long> {
    Page<Produto> findAllByBloqueadoFalse(Pageable paginacao);
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

    //Boolean findByBloqueadoFalse();
}
