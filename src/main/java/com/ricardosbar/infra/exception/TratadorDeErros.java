package com.ricardosbar.infra.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.ricardosbar.domain.validacaoException;

@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(EntityNotFoundException.class) //para quando tem erro 404
    public ResponseEntity tratarError404() {
        System.out.println("**** NESSE MOMENTO CHAMEI O METODO tratarError404() DA CLASE TratadorDeErros");
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) //para quando tem erro 400
    public ResponseEntity tratarError400(MethodArgumentNotValidException ex) {
        System.out.println("**** NESSE MOMENTO CHAMEI O METODO tratarError400() DA CLASE TratadorDeErros");
        var erros = ex.getFieldErrors();
        //return ResponseEntity.badRequest().build(); //Retorna o erro 400 porém sem a mensagem no corpo da api
        //return ResponseEntity.badRequest().body(erros); //Retorna o erro 400 porém com as informações de todos campos com erro no corpo da api.
        return ResponseEntity.badRequest().body(erros.stream().map(DadosErroValidacao::new).toList()); //Retorna o erro 400 porém com as informações dos campos detalhados com erro no corpo da api.    }
    }

    @ExceptionHandler(validacaoException.class)
    public ResponseEntity tratarRegraDeNegocio(validacaoException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    private record DadosErroValidacao(String campo, String mensagem) {

        public DadosErroValidacao(FieldError erro) {
            this(erro.getField(), erro.getDefaultMessage());
        }
    }
}
