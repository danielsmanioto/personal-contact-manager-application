package com.contactmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Main entry point for the Personal Contact Manager Application.
 */
@SpringBootApplication
@EnableFeignClients
public class ContactManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ContactManagerApplication.class, args);
    }

    /**
     * CORS configuration for local development (Frontend on http://localhost:5173).
     */
    @Configuration
    public static class CorsConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
        }
    }
}
