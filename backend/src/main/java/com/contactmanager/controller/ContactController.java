package com.contactmanager.controller;

import com.contactmanager.dto.ContactRequest;
import com.contactmanager.dto.ContactResponse;
import com.contactmanager.dto.PaginatedResponse;
import com.contactmanager.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST Controller for contact management endpoints.
 *
 * Provides CRUD operations and search/filter/sort capabilities for contacts.
 * All endpoints return standardized responses with proper HTTP status codes.
 */
@RestController
@RequestMapping("/api/contacts")
@Tag(name = "Contacts", description = "Contact management API")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    /**
     * List all active contacts with pagination.
     *
     * @param page Page number (0-indexed, default 0)
     * @param size Page size (default 10)
     * @return Page of contacts
     */
    @GetMapping
    @Operation(summary = "List all contacts", description = "Retrieve paginated list of active contacts")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved contacts")
    public ResponseEntity<PaginatedResponse<ContactResponse>> listContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.debug("Listing contacts - page: {}, size: {}", page, size);
        Page<ContactResponse> contacts = contactService.getAll(page, size);
        return ResponseEntity.ok(toPaginatedResponse(contacts));
    }

    /**
     * Get a single contact by ID.
     *
     * @param id Contact UUID
     * @return Contact response
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get contact by ID", description = "Retrieve a specific contact by its UUID")
    @ApiResponse(responseCode = "200", description = "Contact found")
    @ApiResponse(responseCode = "404", description = "Contact not found")
    public ResponseEntity<ContactResponse> getContact(@PathVariable UUID id) {
        log.debug("Getting contact: {}", id);
        ContactResponse contact = contactService.getById(id);
        return ResponseEntity.ok(contact);
    }

    /**
     * Create a new contact.
     *
     * @param request Contact create request with validation
     * @return Created contact response (HTTP 201)
     */
    @PostMapping
    @Operation(summary = "Create contact", description = "Create a new contact with provided data")
    @ApiResponse(responseCode = "201", description = "Contact created successfully")
    @ApiResponse(responseCode = "400", description = "Validation failed")
    @ApiResponse(responseCode = "409", description = "Email already exists")
    public ResponseEntity<ContactResponse> createContact(@Valid @RequestBody ContactRequest request) {
        log.info("Creating new contact with email: {}", request.getEmail());
        ContactResponse contact = contactService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(contact);
    }

    /**
     * Update an existing contact.
     *
     * @param id Contact UUID
     * @param request Contact update request with validation
     * @return Updated contact response
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update contact", description = "Update an existing contact")
    @ApiResponse(responseCode = "200", description = "Contact updated successfully")
    @ApiResponse(responseCode = "400", description = "Validation failed")
    @ApiResponse(responseCode = "404", description = "Contact not found")
    @ApiResponse(responseCode = "409", description = "Email already exists")
    public ResponseEntity<ContactResponse> updateContact(
            @PathVariable UUID id,
            @Valid @RequestBody ContactRequest request) {

        log.info("Updating contact: {}", id);
        ContactResponse contact = contactService.update(id, request);
        return ResponseEntity.ok(contact);
    }

    /**
     * Soft delete a contact by ID.
     *
     * @param id Contact UUID
     * @return No content (HTTP 204)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete contact", description = "Soft delete a contact (mark as deleted, not removed)")
    @ApiResponse(responseCode = "204", description = "Contact deleted successfully")
    @ApiResponse(responseCode = "404", description = "Contact not found")
    public ResponseEntity<Void> deleteContact(@PathVariable UUID id) {
        log.info("Deleting contact: {}", id);
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Search contacts by name or email.
     *
     * @param q Search query (name or email)
     * @param page Page number (0-indexed, default 0)
     * @param size Page size (default 10)
     * @return Page of matching contacts
     */
    @GetMapping("/search")
    @Operation(summary = "Search contacts", description = "Search contacts by name or email (case-insensitive)")
    @ApiResponse(responseCode = "200", description = "Search results retrieved")
    public ResponseEntity<PaginatedResponse<ContactResponse>> searchContacts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.debug("Searching contacts - query: '{}', page: {}, size: {}", q, page, size);
        Page<ContactResponse> results = contactService.search(q, page, size);
        return ResponseEntity.ok(toPaginatedResponse(results));
    }

    /**
     * Filter contacts by birth date range.
     *
     * @param fromDate Start date (ISO format: YYYY-MM-DD)
     * @param toDate End date (ISO format: YYYY-MM-DD)
     * @param page Page number (0-indexed, default 0)
     * @param size Page size (default 10)
     * @return Page of matching contacts
     */
    @GetMapping("/filter")
    @Operation(summary = "Filter contacts by birth date", description = "Filter contacts by birth date range")
    @ApiResponse(responseCode = "200", description = "Filter results retrieved")
    public ResponseEntity<PaginatedResponse<ContactResponse>> filterByDateRange(
            @RequestParam String fromDate,
            @RequestParam String toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.debug("Filtering contacts by date - from: '{}', to: '{}', page: {}, size: {}", fromDate, toDate, page, size);
        java.time.LocalDate from = java.time.LocalDate.parse(fromDate);
        java.time.LocalDate to = java.time.LocalDate.parse(toDate);
        Page<ContactResponse> results = contactService.filterByBirthDateRange(from, to, page, size);
        return ResponseEntity.ok(toPaginatedResponse(results));
    }

    private <T> PaginatedResponse<T> toPaginatedResponse(Page<T> page) {
        return new PaginatedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}
