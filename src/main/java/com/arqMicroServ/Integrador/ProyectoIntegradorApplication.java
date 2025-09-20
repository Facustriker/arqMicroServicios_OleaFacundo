package com.arqMicroServ.Integrador;


import com.arqMicroServ.Integrador.Entidades.EstadoResena;
import com.arqMicroServ.Integrador.Repositorios.RepositorioEstadoResena;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.text.SimpleDateFormat;
import java.util.Date;

@EnableScheduling
@SpringBootApplication
public class ProyectoIntegradorApplication {

	@Autowired
	private RepositorioEstadoResena repositorioEstadoResena;

	public static void main(String[] args) {
		SpringApplication.run(ProyectoIntegradorApplication.class, args);
		System.out.println("El proyecto está funcionando");
	}

	@Bean
	public CommandLineRunner init() {
		return args -> {

			if(repositorioEstadoResena.existsById(1L)){

			}else{
				EstadoResena estadoVacia = EstadoResena.builder()
						.nombreEstadoResena("Vacia")
						.build();

				EstadoResena estadoCompleta = EstadoResena.builder()
						.nombreEstadoResena("Completa")
						.build();

				repositorioEstadoResena.save(estadoVacia);
				repositorioEstadoResena.save(estadoCompleta);
			}
			
		};
	}

}
