package com.contactmanager.service;

import com.contactmanager.dto.ContactRequest;
import com.contactmanager.dto.ContactResponse;
import com.contactmanager.entity.Contact;
import com.contactmanager.exception.ContactNotFoundException;
import com.contactmanager.exception.EmailAlreadyExistsException;
import com.contactmanager.repository.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ContactService.
 *
 * Tests CRUD operations, search/filter logic, validation, and soft delete behavior.
 * Repository is mocked to isolate service logic.
 */
@ExtendWith(MockitoExtension.class)
class ContactServiceTests {

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private ContactService contactService;

    private UUID testContactId;
    private Contact testContact;
    private ContactRequest testRequest;

    @BeforeEach
    void setup() {
        testContactId = UUID.randomUUID();
        testContact = new Contact(
            "John Doe",
            "john@example.com",
            "1234567890",
            LocalDate.of(1990, 1, 15)
        );
        testContact.setId(testContactId);
        testContact.setCreatedAt(LocalDateTime.now());
        testContact.setUpdatedAt(LocalDateTime.now());

        testRequest = new ContactRequest(
            "John Doe",
            "john@example.com",
            "1234567890",
            LocalDate.of(1990, 1, 15)
        );
    }

    // CREATE TESTS
    @Test
    void testCreate_Success() {
        when(contactRepository.existsByEmailAndNotDeleted(testRequest.getEmail())).thenReturn(false);
        when(contactRepository.save(any(Contact.class))).thenReturn(testContact);

        ContactResponse result = contactService.create(testRequest);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("john@example.com", result.getEmail());
        verify(contactRepository, times(1)).existsByEmailAndNotDeleted(testRequest.getEmail());
        verify(contactRepository, times(1)).save(any(Contact.class));
    }

    @Test
    void testCreate_EmailAlreadyExists() {
        when(contactRepository.existsByEmailAndNotDeleted(testRequest.getEmail())).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> contactService.create(testRequest));

        verify(contactRepository, times(1)).existsByEmailAndNotDeleted(testRequest.getEmail());
        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void testCreate_WithoutOptionalFields() {
        ContactRequest minimalRequest = new ContactRequest("Jane Doe", "jane@example.com", "", null);

        when(contactRepository.existsByEmailAndNotDeleted(minimalRequest.getEmail())).thenReturn(false);
        when(contactRepository.save(any(Contact.class))).thenReturn(testContact);

        ContactResponse result = contactService.create(minimalRequest);

        assertNotNull(result);
        verify(contactRepository, times(1)).save(any(Contact.class));
    }

    // READ TESTS
    @Test
    void testGetById_Success() {
        when(contactRepository.findByIdAndNotDeleted(testContactId)).thenReturn(Optional.of(testContact));

        ContactResponse result = contactService.getById(testContactId);

        assertNotNull(result);
        assertEquals(testContactId, result.getId());
        assertEquals("John Doe", result.getName());
    }

    @Test
    void testGetById_NotFound() {
        when(contactRepository.findByIdAndNotDeleted(testContactId)).thenReturn(Optional.empty());

        assertThrows(ContactNotFoundException.class, () -> contactService.getById(testContactId));

        verify(contactRepository, times(1)).findByIdAndNotDeleted(testContactId);
    }

    @Test
    void testGetAll_WithPagination() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> page = new PageImpl<>(List.of(testContact), pageable, 1);

        when(contactRepository.findAllActive(pageable)).thenReturn(page);

        Page<ContactResponse> result = contactService.getAll(0, 10);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("John Doe", result.getContent().get(0).getName());
    }

    @Test
    void testGetAll_EmptyResult() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> page = new PageImpl<>(List.of(), pageable, 0);

        when(contactRepository.findAllActive(pageable)).thenReturn(page);

        Page<ContactResponse> result = contactService.getAll(0, 10);

        assertNotNull(result);
        assertEquals(0, result.getContent().size());
    }

    // UPDATE TESTS
    @Test
    void testUpdate_Success() {
        when(contactRepository.findByIdAndNotDeleted(testContactId)).thenReturn(Optional.of(testContact));
        when(contactRepository.existsByEmailAndNotDeletedExcludingId(testRequest.getEmail(), testContactId))
            .thenReturn(false);
        when(contactRepository.save(any(Contact.class))).thenReturn(testContact);

        ContactResponse result = contactService.update(testContactId, testRequest);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        verify(contactRepository, times(1)).findByIdAndNotDeleted(testContactId);
        verify(contactRepository, times(1)).existsByEmailAndNotDeletedExcludingId(testRequest.getEmail(), testContactId);
        verify(contactRepository, times(1)).save(any(Contact.class));
    }

    @Test
    void testUpdate_ContactNotFound() {
        when(contactRepository.findByIdAndNotDeleted(testContactId)).thenReturn(Optional.empty());

        assertThrows(ContactNotFoundException.class, () -> contactService.update(testContactId, testRequest));

        verify(contactRepository, times(1)).findByIdAndNotDeleted(testContactId);
        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void testUpdate_EmailAlreadyExists() {
        when(contactRepository.findByIdAndNotDeleted(testContactId)).thenReturn(Optional.of(testContact));
        when(contactRepository.existsByEmailAndNotDeletedExcludingId("different@example.com", testContactId))
            .thenReturn(true);

        ContactRequest updateRequest = new ContactRequest("Jane", "different@example.com", "1234567890", null);

        assertThrows(EmailAlreadyExistsException.class, () -> contactService.update(testContactId, updateRequest));

        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void testUpdate_CanUpdateToSameEmail() {
        when(contactRepository.findByIdAndNotDeleted(testContactId)).thenReturn(Optional.of(testContact));
        when(contactRepository.existsByEmailAndNotDeletedExcludingId(testRequest.getEmail(), testContactId))
            .thenReturn(false);
        when(contactRepository.save(any(Contact.class))).thenReturn(testContact);

        ContactResponse result = contactService.update(testContactId, testRequest);

        assertNotNull(result);
        verify(contactRepository, times(1)).findByIdAndNotDeleted(testContactId);
        verify(contactRepository, times(1)).existsByEmailAndNotDeletedExcludingId(testRequest.getEmail(), testContactId);
        verify(contactRepository, times(1)).save(any(Contact.class));
    }

    // DELETE TESTS
    @Test
    void testDelete_Success() {
        when(contactRepository.findByIdAndNotDeleted(testContactId)).thenReturn(Optional.of(testContact));
        when(contactRepository.save(any(Contact.class))).thenReturn(testContact);

        assertDoesNotThrow(() -> contactService.delete(testContactId));

        verify(contactRepository, times(1)).findByIdAndNotDeleted(testContactId);
        verify(contactRepository, times(1)).save(any(Contact.class));
    }

    @Test
    void testDelete_ContactNotFound() {
        when(contactRepository.findByIdAndNotDeleted(testContactId)).thenReturn(Optional.empty());

        assertThrows(ContactNotFoundException.class, () -> contactService.delete(testContactId));

        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void testDelete_SetsDeletedAt() {
        Contact contactToDelete = new Contact("John", "john@example.com", "1234567890", null);
        contactToDelete.setId(testContactId);

        when(contactRepository.findByIdAndNotDeleted(testContactId)).thenReturn(Optional.of(contactToDelete));
        when(contactRepository.save(any(Contact.class))).thenAnswer(invocation -> invocation.getArgument(0));

        contactService.delete(testContactId);

        assertTrue(contactToDelete.getDeletedAt() != null);
    }

    // SEARCH TESTS
    @Test
    void testSearch_ByNameOrEmail() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> page = new PageImpl<>(List.of(testContact), pageable, 1);

        when(contactRepository.searchByNameOrEmail("john", pageable)).thenReturn(page);

        Page<ContactResponse> result = contactService.search("john", 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(contactRepository, times(1)).searchByNameOrEmail("john", pageable);
    }

    @Test
    void testSearch_NoResults() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> page = new PageImpl<>(List.of(), pageable, 0);

        when(contactRepository.searchByNameOrEmail("nonexistent", pageable)).thenReturn(page);

        Page<ContactResponse> result = contactService.search("nonexistent", 0, 10);

        assertNotNull(result);
        assertEquals(0, result.getContent().size());
    }

    // FILTER TESTS
    @Test
    void testFilterByBirthDateRange() {
        LocalDate from = LocalDate.of(1980, 1, 1);
        LocalDate to = LocalDate.of(2000, 12, 31);
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> page = new PageImpl<>(List.of(testContact), pageable, 1);

        when(contactRepository.filterByBirthDateBetween(from, to, pageable)).thenReturn(page);

        Page<ContactResponse> result = contactService.filterByBirthDateRange(from, to, 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(contactRepository, times(1)).filterByBirthDateBetween(from, to, pageable);
    }

    // SORT TESTS
    @Test
    void testSortByNameAscending() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> page = new PageImpl<>(List.of(testContact), pageable, 1);

        when(contactRepository.findAllSortedByName(pageable)).thenReturn(page);

        Page<ContactResponse> result = contactService.sortByNameAscending(0, 10);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(contactRepository, times(1)).findAllSortedByName(pageable);
    }

    @Test
    void testSortByCreatedAtDescending() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> page = new PageImpl<>(List.of(testContact), pageable, 1);

        when(contactRepository.findAllSortedByCreatedAtDesc(pageable)).thenReturn(page);

        Page<ContactResponse> result = contactService.sortByCreatedAtDescending(0, 10);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(contactRepository, times(1)).findAllSortedByCreatedAtDesc(pageable);
    }

    // COUNT TESTS
    @Test
    void testCountActive() {
        when(contactRepository.countActive()).thenReturn(5L);

        long result = contactService.countActive();

        assertEquals(5L, result);
        verify(contactRepository, times(1)).countActive();
    }

    @Test
    void testCountActive_Zero() {
        when(contactRepository.countActive()).thenReturn(0L);

        long result = contactService.countActive();

        assertEquals(0L, result);
    }
}
