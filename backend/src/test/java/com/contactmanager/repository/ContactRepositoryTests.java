package com.contactmanager.repository;

import com.contactmanager.entity.Contact;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

/**
 * Integration tests for ContactRepository using Testcontainers.
 *
 * Tests real PostgreSQL database behavior without mocking.
 * Coverage: search, filter, soft delete, pagination.
 */
@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DisplayName("ContactRepository Tests")
class ContactRepositoryTests {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
        .withDatabaseName("contact_manager_test")
        .withUsername("postgres")
        .withPassword("postgres");

    @Autowired
    private ContactRepository contactRepository;

    private Contact testContact1;
    private Contact testContact2;
    private Contact testContact3;

    @BeforeEach
    void setUp() {
        contactRepository.deleteAll();

        testContact1 = createContact("John Doe", "john@example.com", "1234567890",
            LocalDate.of(1990, 1, 15));
        testContact2 = createContact("Jane Smith", "jane@example.com", "9876543210",
            LocalDate.of(1995, 5, 20));
        testContact3 = createContact("Bob Johnson", "bob@example.com", "5555555555",
            LocalDate.of(1985, 12, 25));
    }

    // Helper method to create contact
    private Contact createContact(String name, String email, String phone, LocalDate birthDate) {
        Contact contact = new Contact();
        contact.setName(name);
        contact.setEmail(email);
        contact.setPhone(phone);
        contact.setBirthDate(birthDate);
        return contact;
    }

    @Test
    @DisplayName("Should save contact to database")
    void testSaveContact() {
        Contact saved = contactRepository.save(testContact1);

        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("John Doe");
        assertThat(saved.getEmail()).isEqualTo("john@example.com");
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
        assertThat(saved.getDeletedAt()).isNull();
    }

    @Test
    @DisplayName("Should find contact by ID (active only)")
    void testFindByIdAndNotDeleted() {
        Contact saved = contactRepository.save(testContact1);

        Optional<Contact> found = contactRepository.findByIdAndNotDeleted(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("John Doe");
    }

    @Test
    @DisplayName("Should not find soft-deleted contact by ID")
    void testFindByIdAndNotDeleted_SoftDeleted() {
        Contact saved = contactRepository.save(testContact1);
        saved.softDelete();
        contactRepository.save(saved);

        Optional<Contact> found = contactRepository.findByIdAndNotDeleted(saved.getId());

        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Should find all active contacts with pagination")
    void testFindAllActive() {
        contactRepository.save(testContact1);
        contactRepository.save(testContact2);
        contactRepository.save(testContact3);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> page = contactRepository.findAllActive(pageable);

        assertThat(page.getContent()).hasSize(3);
        assertThat(page.getTotalElements()).isEqualTo(3);
    }

    @Test
    @DisplayName("Should exclude soft-deleted contacts from findAll")
    void testFindAllActive_ExcludeSoftDeleted() {
        Contact saved1 = contactRepository.save(testContact1);
        Contact saved2 = contactRepository.save(testContact2);
        Contact saved3 = contactRepository.save(testContact3);

        saved2.softDelete();
        contactRepository.save(saved2);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> page = contactRepository.findAllActive(pageable);

        assertThat(page.getContent()).hasSize(2);
        assertThat(page.getContent())
            .extracting(Contact::getEmail)
            .containsExactlyInAnyOrder("john@example.com", "bob@example.com");
    }

    @Test
    @DisplayName("Should search contacts by name (case-insensitive)")
    void testSearchByName() {
        contactRepository.save(testContact1);
        contactRepository.save(testContact2);
        contactRepository.save(testContact3);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> results = contactRepository.searchByName("john", pageable);

        assertThat(results.getContent()).hasSize(2);
        assertThat(results.getContent())
            .extracting(Contact::getEmail)
            .containsExactlyInAnyOrder("john@example.com", "bob@example.com");
    }

    @Test
    @DisplayName("Should search contacts by name (uppercase)")
    void testSearchByName_UpperCase() {
        contactRepository.save(testContact1);
        contactRepository.save(testContact2);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> results = contactRepository.searchByName("JANE", pageable);

        assertThat(results.getContent()).hasSize(1);
        assertThat(results.getContent().get(0).getEmail()).isEqualTo("jane@example.com");
    }

    @Test
    @DisplayName("Should search contacts by email (case-insensitive)")
    void testSearchByEmail() {
        contactRepository.save(testContact1);
        contactRepository.save(testContact2);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> results = contactRepository.searchByEmail("example.com", pageable);

        assertThat(results.getContent()).hasSize(2);
    }

    @Test
    @DisplayName("Should search contacts by name or email")
    void testSearchByNameOrEmail() {
        contactRepository.save(testContact1);
        contactRepository.save(testContact2);
        contactRepository.save(testContact3);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> results = contactRepository.searchByNameOrEmail("john", pageable);

        assertThat(results.getContent()).hasSize(2);
    }

    @Test
    @DisplayName("Should exclude soft-deleted from search results")
    void testSearchByNameOrEmail_ExcludeSoftDeleted() {
        Contact saved1 = contactRepository.save(testContact1);
        Contact saved2 = contactRepository.save(testContact2);

        saved1.softDelete();
        contactRepository.save(saved1);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> results = contactRepository.searchByNameOrEmail("john", pageable);

        assertThat(results.getContent()).isEmpty();
    }

    @Test
    @DisplayName("Should filter contacts by birth date range")
    void testFilterByBirthDateBetween() {
        contactRepository.save(testContact1);
        contactRepository.save(testContact2);
        contactRepository.save(testContact3);

        LocalDate from = LocalDate.of(1990, 1, 1);
        LocalDate to = LocalDate.of(1995, 12, 31);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> results = contactRepository.filterByBirthDateBetween(from, to, pageable);

        assertThat(results.getContent()).hasSize(2);
    }

    @Test
    @DisplayName("Should find contacts sorted by name")
    void testFindAllSortedByName() {
        contactRepository.save(testContact1);
        contactRepository.save(testContact2);
        contactRepository.save(testContact3);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> results = contactRepository.findAllSortedByName(pageable);

        assertThat(results.getContent()).hasSize(3);
        assertThat(results.getContent())
            .extracting(Contact::getName)
            .containsExactly("Bob Johnson", "Jane Smith", "John Doe");
    }

    @Test
    @DisplayName("Should find contacts sorted by creation date (newest first)")
    void testFindAllSortedByCreatedAtDesc() {
        Contact saved1 = contactRepository.save(testContact1);
        Contact saved2 = contactRepository.save(testContact2);
        Contact saved3 = contactRepository.save(testContact3);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> results = contactRepository.findAllSortedByCreatedAtDesc(pageable);

        assertThat(results.getContent()).hasSize(3);
        assertThat(results.getContent().get(0).getId()).isEqualTo(saved3.getId());
        assertThat(results.getContent().get(2).getId()).isEqualTo(saved1.getId());
    }

    @Test
    @DisplayName("Should check if email exists (active only)")
    void testExistsByEmailAndNotDeleted() {
        contactRepository.save(testContact1);

        boolean exists = contactRepository.existsByEmailAndNotDeleted("john@example.com");

        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("Should return false for soft-deleted email")
    void testExistsByEmailAndNotDeleted_SoftDeleted() {
        Contact saved = contactRepository.save(testContact1);
        saved.softDelete();
        contactRepository.save(saved);

        boolean exists = contactRepository.existsByEmailAndNotDeleted("john@example.com");

        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("Should check if email exists excluding current contact")
    void testExistsByEmailAndNotDeletedExcludingId() {
        Contact saved1 = contactRepository.save(testContact1);
        Contact saved2 = contactRepository.save(testContact2);

        boolean existsForAnother = contactRepository
            .existsByEmailAndNotDeletedExcludingId("john@example.com", saved2.getId());
        boolean existsForSame = contactRepository
            .existsByEmailAndNotDeletedExcludingId("john@example.com", saved1.getId());

        assertThat(existsForAnother).isTrue();
        assertThat(existsForSame).isFalse();
    }

    @Test
    @DisplayName("Should count active contacts")
    void testCountActive() {
        contactRepository.save(testContact1);
        contactRepository.save(testContact2);
        Contact saved3 = contactRepository.save(testContact3);

        saved3.softDelete();
        contactRepository.save(saved3);

        long count = contactRepository.countActive();

        assertThat(count).isEqualTo(2);
    }

    @Test
    @DisplayName("Should soft delete contact")
    void testSoftDelete() {
        Contact saved = contactRepository.save(testContact1);

        saved.softDelete();
        contactRepository.save(saved);

        Contact updated = contactRepository.findById(saved.getId()).orElseThrow();

        assertThat(updated.getDeletedAt()).isNotNull();
        assertThat(updated.isActive()).isFalse();
    }

    @Test
    @DisplayName("Should handle pagination correctly")
    void testPaginationWithMultiplePages() {
        for (int i = 0; i < 25; i++) {
            Contact contact = createContact("Contact " + i, "contact" + i + "@example.com", null, null);
            contactRepository.save(contact);
        }

        Pageable pageable1 = PageRequest.of(0, 10);
        Page<Contact> page1 = contactRepository.findAllActive(pageable1);

        Pageable pageable2 = PageRequest.of(1, 10);
        Page<Contact> page2 = contactRepository.findAllActive(pageable2);

        Pageable pageable3 = PageRequest.of(2, 10);
        Page<Contact> page3 = contactRepository.findAllActive(pageable3);

        assertThat(page1.getContent()).hasSize(10);
        assertThat(page2.getContent()).hasSize(10);
        assertThat(page3.getContent()).hasSize(5);
        assertThat(page1.getTotalPages()).isEqualTo(3);
        assertThat(page1.getTotalElements()).isEqualTo(25);
    }
}
