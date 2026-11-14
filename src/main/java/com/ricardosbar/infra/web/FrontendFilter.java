package com.ricardosbar.infra.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Em produção o frontend Angular é servido pelo próprio Spring Boot (pasta /static).
 * Este filtro faz o papel do proxy.conf.json do Angular:
 *  - /api/xyz  -> encaminha para /xyz (os controllers não têm o prefixo /api)
 *  - navegação do navegador para uma rota do Angular (ex.: /home/vendas/listar) -> index.html
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class FrontendFilter extends OncePerRequestFilter {

    private static final String PREFIXO_API = "/api";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String caminho = request.getRequestURI().substring(request.getContextPath().length());

        if (caminho.startsWith(PREFIXO_API + "/")) {
            request.getRequestDispatcher(caminho.substring(PREFIXO_API.length())).forward(request, response);
            return;
        }

        if (ehNavegacaoDoAngular(request, caminho)) {
            request.getRequestDispatcher("/index.html").forward(request, response);
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean ehNavegacaoDoAngular(HttpServletRequest request, String caminho) {
        String accept = request.getHeader("Accept");
        return "GET".equals(request.getMethod())
                && accept != null && accept.contains("text/html")
                && (caminho.equals("/login") || caminho.equals("/home") || caminho.startsWith("/home/"));
    }
}
