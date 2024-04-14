package com.capstone.eapa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EapaApplication {

	public static void main(String[] args) {
		SpringApplication.run(EapaApplication.class, args);
		System.out.println("Relapse is not an option.");
	}

}
