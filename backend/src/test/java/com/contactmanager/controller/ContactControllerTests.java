package com.contactmanager.controller;

import com.contactmanager.dto.ContactRequest;
import com.contactmanager.entity.Contact;
import com.contactmanager.repository.ContactRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for ContactController.
 *
 * Uses Testcontainers to run tests with real PostgreSQL database.
 * Tests all 6 REST endpoints with real HTTP requests.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class ContactControllerTests {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
        .withDatabaseName("contact_manager_test")
        .withUsername("postgres")
        .withPassword("postgres");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Contact testContact;
    private UUID testContactId;

    @BeforeEach
    void setup() {
        contactRepository.deleteAll();

        testContact = new Contact(
            "John Doe",
            "john@example.com",
            "1234567890",
            LocalDate.of(1990, 1, 15)
        );
        testContact = contactRepository.save(testContact);
        testContactId = testContact.getId();
    }

    // GET /api/contacts - List all contacts
    @Test
    void testListContacts_Success() throws Exception {
        mockMvc.perform(get("/api/contacts?page=0&size=10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(1)))
            .andExpect(jsonPath("$.content[0].name", equalTo("John Doe")))
            .andExpect(jsonPath("$.content[0].email", equalTo("john@example.com")))
            .andExpect(jsonPath("$.totalElements", equalTo(1)))
            .andExpect(jsonPath("$.size", equalTo(10)));
    }

    @Test
    void testListContacts_EmptyList() throws Exception {
        contactRepository.deleteAll();

        mockMvc.perform(get("/api/contacts?page=0&size=10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(0)))
            .andExpect(jsonPath("$.totalElements", equalTo(0)));
    }

    @Test
    void testListContacts_WithPagination() throws Exception {
        for (int i = 0; i < 15; i++) {
            Contact contact = new Contact(
                "Contact " + i,
                "contact" + i + "@example.com",
                "1234567890",
                null
            );
            contactRepository.save(contact);
        }

        mockMvc.perform(get("/api/contacts?page=0&size=10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(10)))
            .andExpect(jsonPath("$.totalPages", equalTo(2)));
    }

    // GET /api/contacts/{id} - Get single contact
    @Test
    void testGetContact_Success() throws Exception {
        mockMvc.perform(get("/api/contacts/" + testContactId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", notNullValue()))
            .andExpect(jsonPath("$.name", equalTo("John Doe")))
            .andExpect(jsonPath("$.email", equalTo("john@example.com")))
            .andExpect(jsonPath("$.phone", equalTo("1234567890")));
    }

    @Test
    void testGetContact_NotFound() throws Exception {
        UUID nonExistentId = UUID.randomUUID();

        mockMvc.perform(get("/api/contacts/" + nonExistentId))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status", equalTo(404)))
            .andExpect(jsonPath("$.message", containsString("Contact not found")));
    }

    // POST /api/contacts - Create contact
    @Test
    void testCreateContact_Success() throws Exception {
        ContactRequest request = new ContactRequest(
            "Jane Smith",
            "jane@example.com",
            "9876543210",
            LocalDate.of(1995, 5, 20)
        );

        mockMvc.perform(post("/api/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id", notNullValue()))
            .andExpect(jsonPath("$.name", equalTo("Jane Smith")))
            .andExpect(jsonPath("$.email", equalTo("jane@example.com")))
            .andExpect(jsonPath("$.phone", equalTo("9876543210")));
    }

    @Test
    void testCreateContact_InvalidEmail() throws Exception {
        ContactRequest request = new ContactRequest(
            "Jane",
            "invalid-email",
            "1234567890",
            null
        );

        mockMvc.perform(post("/api/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status", equalTo(400)))
            .andExpect(jsonPath("$.message", equalTo("Validation failed")))
            .andExpect(jsonPath("$.errors.email", notNullValue()));
    }

    @Test
    void testCreateContact_EmailAlreadyExists() throws Exception {
        ContactRequest request = new ContactRequest(
            "Different Name",
            "john@example.com",
            "1234567890",
            null
        );

        mockMvc.perform(post("/api/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.status", equalTo(409)))
            .andExpect(jsonPath("$.message", containsString("Email already exists")));
    }

    @Test
    void testCreateContact_MissingName() throws Exception {
        ContactRequest request = new ContactRequest(
            "",
            "test@example.com",
            "1234567890",
            null
        );

        mockMvc.perform(post("/api/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.name", notNullValue()));
    }

    // PUT /api/contacts/{id} - Update contact
    @Test
    void testUpdateContact_Success() throws Exception {
        ContactRequest request = new ContactRequest(
            "John Updated",
            "john.updated@example.com",
            "9876543210",
            LocalDate.of(1992, 6, 10)
        );

        mockMvc.perform(put("/api/contacts/" + testContactId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", equalTo(testContactId.toString())))
            .andExpect(jsonPath("$.name", equalTo("John Updated")))
            .andExpect(jsonPath("$.email", equalTo("john.updated@example.com")));
    }

    @Test
    void testUpdateContact_NotFound() throws Exception {
        UUID nonExistentId = UUID.randomUUID();
        ContactRequest request = new ContactRequest("Jane", "jane@example.com", "1234567890", null);

        mockMvc.perform(put("/api/contacts/" + nonExistentId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status", equalTo(404)));
    }

    @Test
    void testUpdateContact_EmailAlreadyExists() throws Exception {
        Contact contact2 = new Contact("Jane", "jane@example.com", "1111111111", null);
        contactRepository.save(contact2);

        ContactRequest request = new ContactRequest(
            "John",
            "jane@example.com",
            "1234567890",
            null
        );

        mockMvc.perform(put("/api/contacts/" + testContactId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.status", equalTo(409)));
    }

    // DELETE /api/contacts/{id} - Soft delete contact
    @Test
    void testDeleteContact_Success() throws Exception {
        mockMvc.perform(delete("/api/contacts/" + testContactId))
            .andExpect(status().isNoContent());

        // Verify contact is soft-deleted (deleted_at is set)
        mockMvc.perform(get("/api/contacts/" + testContactId))
            .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteContact_NotFound() throws Exception {
        UUID nonExistentId = UUID.randomUUID();

        mockMvc.perform(delete("/api/contacts/" + nonExistentId))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status", equalTo(404)));
    }

    // GET /api/contacts/search - Search contacts
    @Test
    void testSearchContacts_ByName() throws Exception {
        mockMvc.perform(get("/api/contacts/search?q=John&page=0&size=10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(1)))
            .andExpect(jsonPath("$.content[0].name", equalTo("John Doe")));
    }

    @Test
    void testSearchContacts_ByEmail() throws Exception {
        mockMvc.perform(get("/api/contacts/search?q=john@example.com&page=0&size=10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(1)))
            .andExpect(jsonPath("$.content[0].email", equalTo("john@example.com")));
    }

    @Test
    void testSearchContacts_CaseInsensitive() throws Exception {
        mockMvc.perform(get("/api/contacts/search?q=JOHN&page=0&size=10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(1)))
            .andExpect(jsonPath("$.content[0].name", equalTo("John Doe")));
    }

    @Test
    void testSearchContacts_NoResults() throws Exception {
        mockMvc.perform(get("/api/contacts/search?q=NonExistent&page=0&size=10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(0)))
            .andExpect(jsonPath("$.totalElements", equalTo(0)));
    }
}
