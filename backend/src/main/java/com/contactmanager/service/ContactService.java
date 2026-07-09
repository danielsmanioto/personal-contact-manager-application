package com.contactmanager.service;

import com.contactmanager.dto.ContactRequest;
import com.contactmanager.dto.ContactResponse;
import com.contactmanager.entity.Contact;
import com.contactmanager.exception.ContactNotFoundException;
import com.contactmanager.exception.EmailAlreadyExistsException;
import com.contactmanager.repository.ContactRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service layer for contact management.
 *
 * Handles business logic for CRUD operations, search, filter, sort, and soft delete.
 * All database interactions go through this layer.
 */
@Service
@Transactional
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);
    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    /**
     * Create a new contact.
     *
     * @param request Contact create request with name, email, phone, birthDate
     * @return Created contact response
     * @throws EmailAlreadyExistsException if email already exists
     */
    public ContactResponse create(ContactRequest request) {
        log.debug("Creating new contact with email: {}", request.getEmail());

        if (contactRepository.existsByEmailAndNotDeleted(request.getEmail())) {
            log.warn("Email already exists: {}", request.getEmail());
            throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        Contact contact = new Contact(
            request.getName(),
            request.getEmail(),
            request.getPhone(),
            request.getBirthDate()
        );

        Contact savedContact = contactRepository.save(contact);
        log.info("Contact created with ID: {}", savedContact.getId());

        return mapToResponse(savedContact);
    }

    /**
     * Get contact by ID.
     *
     * @param id Contact UUID
     * @return Contact response if found and not deleted
     * @throws ContactNotFoundException if contact not found or deleted
     */
    @Transactional(readOnly = true)
    public ContactResponse getById(UUID id) {
        log.debug("Fetching contact by ID: {}", id);

        Contact contact = contactRepository.findByIdAndNotDeleted(id)
            .orElseThrow(() -> {
                log.warn("Contact not found: {}", id);
                return new ContactNotFoundException("Contact not found: " + id);
            });

        return mapToResponse(contact);
    }

    /**
     * Get all active contacts with pagination.
     *
     * @param page Page number (0-indexed)
     * @param size Page size
     * @return Page of contact responses
     */
    @Transactional(readOnly = true)
    public Page<ContactResponse> getAll(int page, int size) {
        log.debug("Fetching all contacts - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Contact> contacts = contactRepository.findAllActive(pageable);

        return contacts.map(this::mapToResponse);
    }

    /**
     * Update an existing contact.
     *
     * @param id Contact UUID
     * @param request Contact update request
     * @return Updated contact response
     * @throws ContactNotFoundException if contact not found or deleted
     * @throws EmailAlreadyExistsException if email already exists (for another contact)
     */
    public ContactResponse update(UUID id, ContactRequest request) {
        log.debug("Updating contact: {}", id);

        Contact contact = contactRepository.findByIdAndNotDeleted(id)
            .orElseThrow(() -> {
                log.warn("Contact not found for update: {}", id);
                return new ContactNotFoundException("Contact not found: " + id);
            });

        if (!contact.getEmail().equals(request.getEmail()) &&
            contactRepository.existsByEmailAndNotDeletedExcludingId(request.getEmail(), id)) {
            log.warn("Email already exists (for update): {}", request.getEmail());
            throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setBirthDate(request.getBirthDate());

        Contact updatedContact = contactRepository.save(contact);
        log.info("Contact updated: {}", id);

        return mapToResponse(updatedContact);
    }

    /**
     * Soft delete a contact by ID.
     *
     * @param id Contact UUID
     * @throws ContactNotFoundException if contact not found or already deleted
     */
    public void delete(UUID id) {
        log.debug("Deleting contact: {}", id);

        Contact contact = contactRepository.findByIdAndNotDeleted(id)
            .orElseThrow(() -> {
                log.warn("Contact not found for delete: {}", id);
                return new ContactNotFoundException("Contact not found: " + id);
            });

        contact.softDelete();
        contactRepository.save(contact);
        log.info("Contact soft-deleted: {}", id);
    }

    /**
     * Search contacts by name or email.
     *
     * @param query Search term
     * @param page Page number (0-indexed)
     * @param size Page size
     * @return Page of matching contacts
     */
    @Transactional(readOnly = true)
    public Page<ContactResponse> search(String query, int page, int size) {
        log.debug("Searching contacts - query: '{}', page: {}, size: {}", query, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Contact> contacts = contactRepository.searchByNameOrEmail(query, pageable);

        return contacts.map(this::mapToResponse);
    }

    /**
     * Filter contacts by birth date range (inclusive).
     *
     * @param from Start date (inclusive)
     * @param to End date (inclusive)
     * @param page Page number (0-indexed)
     * @param size Page size
     * @return Page of contacts within date range
     */
    @Transactional(readOnly = true)
    public Page<ContactResponse> filterByBirthDateRange(LocalDate from, LocalDate to, int page, int size) {
        log.debug("Filtering contacts by birth date - from: {}, to: {}, page: {}, size: {}", from, to, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Contact> contacts = contactRepository.filterByBirthDateBetween(from, to, pageable);

        return contacts.map(this::mapToResponse);
    }

    /**
     * Sort contacts by name (ascending).
     *
     * @param page Page number (0-indexed)
     * @param size Page size
     * @return Page of contacts sorted by name
     */
    @Transactional(readOnly = true)
    public Page<ContactResponse> sortByNameAscending(int page, int size) {
        log.debug("Sorting contacts by name (ascending) - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Contact> contacts = contactRepository.findAllSortedByName(pageable);

        return contacts.map(this::mapToResponse);
    }

    /**
     * Sort contacts by creation date (descending = newest first).
     *
     * @param page Page number (0-indexed)
     * @param size Page size
     * @return Page of contacts sorted by creation date (newest first)
     */
    @Transactional(readOnly = true)
    public Page<ContactResponse> sortByCreatedAtDescending(int page, int size) {
        log.debug("Sorting contacts by created date (descending) - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Contact> contacts = contactRepository.findAllSortedByCreatedAtDesc(pageable);

        return contacts.map(this::mapToResponse);
    }

    /**
     * Get total count of active contacts.
     *
     * @return Number of active (not soft-deleted) contacts
     */
    @Transactional(readOnly = true)
    public long countActive() {
        return contactRepository.countActive();
    }

    /**
     * Map Contact entity to ContactResponse DTO.
     *
     * @param contact Contact entity
     * @return ContactResponse DTO
     */
    private ContactResponse mapToResponse(Contact contact) {
        return new ContactResponse(
            contact.getId(),
            contact.getName(),
            contact.getEmail(),
            contact.getPhone(),
            contact.getBirthDate(),
            contact.getCreatedAt(),
            contact.getUpdatedAt()
        );
    }
}
