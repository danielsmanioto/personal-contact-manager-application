package com.contactmanager.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * DTO for contact create/update requests.
 *
 * Includes validation annotations for API input validation.
 */
public class ContactRequest {

    @NotBlank(message = "Name is required and cannot be blank")
    @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
    private String name;

    @NotBlank(message = "Email is required and cannot be blank")
    @Email(message = "Email must be in valid format (RFC 5322)")
    private String email;

    @Pattern(
        regexp = "^[0-9]{10,20}$|^$",
        message = "Phone must be 10-20 digits or empty"
    )
    private String phone;

    @PastOrPresent(message = "Birth date must be in the past or present")
    private LocalDate birthDate;

    // Constructors
    public ContactRequest() {
    }

    public ContactRequest(String name, String email, String phone, LocalDate birthDate) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.birthDate = birthDate;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
}
