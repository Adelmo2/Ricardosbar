package com.ricardosbar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class RicardosbarApplication {

	public static void main(String[] args) {
		// O contêiner roda em UTC; as datas (LocalDateTime.now()) devem sair no horário de São Paulo
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
		SpringApplication.run(RicardosbarApplication.class, args);
	}
}
