
package com.careertwin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CareerTwinBackendApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                CareerTwinBackendApplication.class, args
        );
        System.out.println("Hello");
    }
}
