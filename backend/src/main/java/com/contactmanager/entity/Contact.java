package com.contactmanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA Entity representing a personal contact.
 *
 * Includes validation annotations enforced by Jakarta Bean Validation.
 * Soft delete is supported via deletedAt timestamp.
 */
@Entity
@Table(name = "contacts")
public class Contact {

    /**
     * Unique identifier (UUID, auto-generated).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Contact full name (1-255 characters, required).
     */
    @NotBlank(message = "Name is required and cannot be blank")
    @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
    @Column(nullable = false, length = 255)
    private String name;

    /**
     * Contact email address (RFC 5322 format, required, unique).
     */
    @NotBlank(message = "Email is required and cannot be blank")
    @Email(message = "Email must be in valid format (RFC 5322)")
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    /**
     * Contact phone number (10-20 digits, optional).
     * Pattern: 0-9 only, no special characters.
     */
    @Pattern(
        regexp = "^[0-9]{10,20}$|^$",
        message = "Phone must be 10-20 digits or empty"
    )
    @Column(length = 20)
    private String phone;

    /**
     * Contact date of birth (optional).
     * Must be in the past.
     */
    @PastOrPresent(message = "Birth date must be in the past or present")
    @Column(name = "birth_date")
    @Temporal(TemporalType.DATE)
    private LocalDate birthDate;

    /**
     * Timestamp when contact was created (auto-set, immutable).
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when contact was last updated (auto-updated).
     */
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Timestamp when contact was soft-deleted (null = active).
     * Soft delete: contact is marked as deleted but not removed from database.
     */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // Constructors
    public Contact() {
    }

    public Contact(String name, String email, String phone, LocalDate birthDate) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.birthDate = birthDate;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    // Helper methods
    /**
     * Check if contact is active (not soft-deleted).
     */
    @Transient
    public boolean isActive() {
        return deletedAt == null;
    }

    /**
     * Soft delete: mark as deleted by setting deletedAt timestamp.
     */
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    // toString, equals, hashCode
    @Override
    public String toString() {
        return "Contact{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", birthDate=" + birthDate +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", deletedAt=" + deletedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Contact contact = (Contact) o;
        return id != null && id.equals(contact.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
