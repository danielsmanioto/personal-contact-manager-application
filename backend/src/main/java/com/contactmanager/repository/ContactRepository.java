package com.contactmanager.repository;

import com.contactmanager.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA Repository for Contact entity.
 *
 * Provides database access layer with custom queries for search, filter, and soft delete support.
 * All queries exclude soft-deleted contacts (deletedAt IS NULL).
 */
@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID> {

    /**
     * Find contact by ID, excluding soft-deleted records.
     *
     * @param id Contact UUID
     * @return Optional containing Contact if found and not deleted
     */
    @Query("SELECT c FROM Contact c WHERE c.id = :id AND c.deletedAt IS NULL")
    Optional<Contact> findByIdAndNotDeleted(@Param("id") UUID id);

    /**
     * Find all active (not deleted) contacts with pagination.
     *
     * @param pageable Pagination info
     * @return Page of active contacts
     */
    @Query("SELECT c FROM Contact c WHERE c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    Page<Contact> findAllActive(Pageable pageable);

    /**
     * Search contacts by name (case-insensitive), excluding soft-deleted.
     *
     * @param name Search term (will be wrapped with % for LIKE)
     * @param pageable Pagination info
     * @return Page of matching contacts
     */
    @Query("SELECT c FROM Contact c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
           "AND c.deletedAt IS NULL " +
           "ORDER BY c.name ASC")
    Page<Contact> searchByName(@Param("name") String name, Pageable pageable);

    /**
     * Search contacts by email (case-insensitive), excluding soft-deleted.
     *
     * @param email Search term (will be wrapped with % for LIKE)
     * @param pageable Pagination info
     * @return Page of matching contacts
     */
    @Query("SELECT c FROM Contact c WHERE LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%')) " +
           "AND c.deletedAt IS NULL " +
           "ORDER BY c.email ASC")
    Page<Contact> searchByEmail(@Param("email") String email, Pageable pageable);

    /**
     * Search contacts by name OR email (case-insensitive), excluding soft-deleted.
     *
     * @param query Search term (will be wrapped with % for LIKE)
     * @param pageable Pagination info
     * @return Page of matching contacts
     */
    @Query("SELECT c FROM Contact c WHERE (LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND c.deletedAt IS NULL " +
           "ORDER BY c.name ASC")
    Page<Contact> searchByNameOrEmail(@Param("query") String query, Pageable pageable);

    /**
     * Filter contacts by birth date range (inclusive), excluding soft-deleted.
     *
     * @param from Start date (inclusive)
     * @param to End date (inclusive)
     * @param pageable Pagination info
     * @return Page of contacts within date range
     */
    @Query("SELECT c FROM Contact c WHERE c.birthDate >= :from AND c.birthDate <= :to " +
           "AND c.deletedAt IS NULL " +
           "ORDER BY c.birthDate ASC")
    Page<Contact> filterByBirthDateBetween(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        Pageable pageable
    );

    /**
     * Find contacts sorted by name (ascending or descending), excluding soft-deleted.
     *
     * @param pageable Pagination info (includes sort order)
     * @return Page of contacts sorted by name
     */
    @Query("SELECT c FROM Contact c WHERE c.deletedAt IS NULL ORDER BY c.name ASC")
    Page<Contact> findAllSortedByName(Pageable pageable);

    /**
     * Find contacts sorted by creation date (descending = newest first), excluding soft-deleted.
     *
     * @param pageable Pagination info
     * @return Page of contacts sorted by creation date
     */
    @Query("SELECT c FROM Contact c WHERE c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    Page<Contact> findAllSortedByCreatedAtDesc(Pageable pageable);

    /**
     * Check if email already exists (excluding soft-deleted records).
     * Useful for validating email uniqueness before create/update.
     *
     * @param email Email to check
     * @return true if email exists in active contacts
     */
    @Query("SELECT COUNT(c) > 0 FROM Contact c WHERE c.email = :email AND c.deletedAt IS NULL")
    boolean existsByEmailAndNotDeleted(@Param("email") String email);

    /**
     * Check if email exists (excluding soft-deleted) AND not the same contact ID.
     * Useful for validating email uniqueness during update (allow same email for current contact).
     *
     * @param email Email to check
     * @param contactId Contact ID to exclude
     * @return true if email exists for another contact
     */
    @Query("SELECT COUNT(c) > 0 FROM Contact c WHERE c.email = :email AND c.id != :contactId AND c.deletedAt IS NULL")
    boolean existsByEmailAndNotDeletedExcludingId(
        @Param("email") String email,
        @Param("contactId") UUID contactId
    );

    /**
     * Count active (not deleted) contacts.
     *
     * @return Number of active contacts
     */
    @Query("SELECT COUNT(c) FROM Contact c WHERE c.deletedAt IS NULL")
    long countActive();

    /**
     * Find all contacts (including deleted) by ID.
     * Used for audit purposes or admin operations.
     *
     * @param id Contact UUID
     * @return Optional containing Contact (deleted or not)
     */
    Optional<Contact> findById(UUID id);

    /**
     * Find contact by ID and check it's not deleted.
     * Throws exception if not found or deleted.
     *
     * @param id Contact UUID
     * @return Contact if found and active
     */
    default Contact getActiveContactOrThrow(UUID id) {
        return findByIdAndNotDeleted(id)
            .orElseThrow(() -> new IllegalArgumentException("Contact not found: " + id));
    }
}
