package com.alertmanager.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.alertmanager.dto.AlertRequest;
import com.alertmanager.dto.AlertResponse;
import com.alertmanager.entity.Alert;
import com.alertmanager.repository.AlertRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
@DisplayName("AlertService Unit Tests")
class AlertServiceTest {

  @Mock private AlertRepository alertRepository;
  private AlertService alertService;

  @BeforeEach
  void setUp() {
    alertService = new AlertService(alertRepository);
  }

  @Nested
  @DisplayName("create() method")
  class CreateMethod {

    @Test
    @DisplayName("should create alert successfully with valid request")
    void shouldCreateAlertSuccessfully() {
      AlertRequest request =
          new AlertRequest("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
      Alert savedAlert = new Alert("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
      savedAlert.setId("alert-456");

      when(alertRepository.save(any(Alert.class))).thenReturn(savedAlert);

      AlertResponse response = alertService.create(request);

      assertNotNull(response);
      assertEquals("alert-456", response.getId());
      assertEquals("contact-123", response.getContactId());
      assertEquals("John Doe", response.getContactName());
      assertEquals("john@example.com", response.getContactEmail());
      assertEquals("BIRTHDAY", response.getAlertType());
      assertEquals("Birthday coming up", response.getMessage());
      assertEquals("PENDING", response.getStatus());
      verify(alertRepository, times(1)).save(any(Alert.class));
    }

    @Test
    @DisplayName("should set initial status as PENDING")
    void shouldSetInitialStatusAsPending() {
      AlertRequest request =
          new AlertRequest("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
      Alert savedAlert = new Alert("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
      savedAlert.setId("alert-456");

      when(alertRepository.save(any(Alert.class))).thenReturn(savedAlert);

      AlertResponse response = alertService.create(request);

      assertEquals("PENDING", response.getStatus());
    }

    @Test
    @DisplayName("should capture alert properties correctly")
    void shouldCaptureAlertPropertiesCorrectly() {
      AlertRequest request =
          new AlertRequest("contact-789", "Jane Smith", "jane@example.com", "ANNIVERSARY", "Anniversary reminder");
      Alert savedAlert =
          new Alert("contact-789", "Jane Smith", "jane@example.com", "ANNIVERSARY", "Anniversary reminder");
      savedAlert.setId("alert-999");

      when(alertRepository.save(any(Alert.class))).thenReturn(savedAlert);

      alertService.create(request);

      ArgumentCaptor<Alert> alertCaptor = ArgumentCaptor.forClass(Alert.class);
      verify(alertRepository).save(alertCaptor.capture());

      Alert capturedAlert = alertCaptor.getValue();
      assertEquals("contact-789", capturedAlert.getContactId());
      assertEquals("Jane Smith", capturedAlert.getContactName());
      assertEquals("jane@example.com", capturedAlert.getContactEmail());
      assertEquals("ANNIVERSARY", capturedAlert.getAlertType());
      assertEquals("Anniversary reminder", capturedAlert.getMessage());
    }
  }

  @Nested
  @DisplayName("getById() method")
  class GetByIdMethod {

    @Test
    @DisplayName("should return alert when found")
    void shouldReturnAlertWhenFound() {
      String alertId = "alert-123";
      Alert alert = new Alert("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
      alert.setId(alertId);
      alert.setStatus("PENDING");

      when(alertRepository.findById(alertId)).thenReturn(Optional.of(alert));

      AlertResponse response = alertService.getById(alertId);

      assertNotNull(response);
      assertEquals(alertId, response.getId());
      assertEquals("John Doe", response.getContactName());
      verify(alertRepository, times(1)).findById(alertId);
    }

    @Test
    @DisplayName("should throw NoSuchElementException when alert not found")
    void shouldThrowExceptionWhenAlertNotFound() {
      String alertId = "non-existent";

      when(alertRepository.findById(alertId)).thenReturn(Optional.empty());

      assertThrows(NoSuchElementException.class, () -> alertService.getById(alertId));
      verify(alertRepository, times(1)).findById(alertId);
    }

    @Test
    @DisplayName("should throw exception with proper message")
    void shouldThrowExceptionWithProperMessage() {
      String alertId = "missing-alert";

      when(alertRepository.findById(alertId)).thenReturn(Optional.empty());

      NoSuchElementException exception =
          assertThrows(NoSuchElementException.class, () -> alertService.getById(alertId));
      assertTrue(exception.getMessage().contains("Alert not found"));
      assertTrue(exception.getMessage().contains(alertId));
    }
  }

  @Nested
  @DisplayName("getAll() method")
  class GetAllMethod {

    @Test
    @DisplayName("should return paginated alerts")
    void shouldReturnPaginatedAlerts() {
      Alert alert1 = new Alert("contact-1", "John", "john@example.com", "BIRTHDAY", "Message 1");
      alert1.setId("alert-1");
      Alert alert2 = new Alert("contact-2", "Jane", "jane@example.com", "ANNIVERSARY", "Message 2");
      alert2.setId("alert-2");

      Page<Alert> alertPage = new PageImpl<>(List.of(alert1, alert2), PageRequest.of(0, 10), 2);

      when(alertRepository.findAll(PageRequest.of(0, 10))).thenReturn(alertPage);

      Page<AlertResponse> response = alertService.getAll(0, 10);

      assertEquals(2, response.getContent().size());
      assertEquals(0, response.getNumber());
      assertEquals(10, response.getSize());
      assertEquals(2, response.getTotalElements());
      verify(alertRepository, times(1)).findAll(PageRequest.of(0, 10));
    }

    @Test
    @DisplayName("should return empty page when no alerts exist")
    void shouldReturnEmptyPageWhenNoAlertsExist() {
      Page<Alert> emptyPage = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0);

      when(alertRepository.findAll(PageRequest.of(0, 10))).thenReturn(emptyPage);

      Page<AlertResponse> response = alertService.getAll(0, 10);

      assertTrue(response.getContent().isEmpty());
      assertEquals(0, response.getTotalElements());
    }

    @Test
    @DisplayName("should handle different page numbers and sizes")
    void shouldHandleDifferentPageNumbersAndSizes() {
      Page<Alert> alertPage = new PageImpl<>(List.of(), PageRequest.of(2, 20), 0);

      when(alertRepository.findAll(PageRequest.of(2, 20))).thenReturn(alertPage);

      alertService.getAll(2, 20);

      verify(alertRepository).findAll(PageRequest.of(2, 20));
    }
  }

  @Nested
  @DisplayName("getByContactId() method")
  class GetByContactIdMethod {

    @Test
    @DisplayName("should return all alerts for a contact")
    void shouldReturnAllAlertsForContact() {
      String contactId = "contact-123";
      Alert alert1 = new Alert(contactId, "John Doe", "john@example.com", "BIRTHDAY", "Message 1");
      alert1.setId("alert-1");
      Alert alert2 = new Alert(contactId, "John Doe", "john@example.com", "ANNIVERSARY", "Message 2");
      alert2.setId("alert-2");

      when(alertRepository.findByContactId(contactId)).thenReturn(List.of(alert1, alert2));

      List<AlertResponse> responses = alertService.getByContactId(contactId);

      assertEquals(2, responses.size());
      assertEquals("alert-1", responses.get(0).getId());
      assertEquals("alert-2", responses.get(1).getId());
      verify(alertRepository, times(1)).findByContactId(contactId);
    }

    @Test
    @DisplayName("should return empty list when no alerts found for contact")
    void shouldReturnEmptyListWhenNoAlertsFound() {
      String contactId = "contact-999";

      when(alertRepository.findByContactId(contactId)).thenReturn(List.of());

      List<AlertResponse> responses = alertService.getByContactId(contactId);

      assertTrue(responses.isEmpty());
      verify(alertRepository, times(1)).findByContactId(contactId);
    }
  }

  @Nested
  @DisplayName("getByStatus() method")
  class GetByStatusMethod {

    @Test
    @DisplayName("should return all alerts with specific status")
    void shouldReturnAllAlertsWithStatus() {
      String status = "PENDING";
      Alert alert1 = new Alert("contact-1", "John", "john@example.com", "BIRTHDAY", "Message 1");
      alert1.setId("alert-1");
      alert1.setStatus(status);
      Alert alert2 = new Alert("contact-2", "Jane", "jane@example.com", "ANNIVERSARY", "Message 2");
      alert2.setId("alert-2");
      alert2.setStatus(status);

      when(alertRepository.findByStatus(status)).thenReturn(List.of(alert1, alert2));

      List<AlertResponse> responses = alertService.getByStatus(status);

      assertEquals(2, responses.size());
      assertTrue(responses.stream().allMatch(r -> r.getStatus().equals(status)));
      verify(alertRepository, times(1)).findByStatus(status);
    }

    @Test
    @DisplayName("should return empty list when no alerts with status found")
    void shouldReturnEmptyListWhenNoAlertsWithStatus() {
      String status = "PROCESSED";

      when(alertRepository.findByStatus(status)).thenReturn(List.of());

      List<AlertResponse> responses = alertService.getByStatus(status);

      assertTrue(responses.isEmpty());
    }
  }

  @Nested
  @DisplayName("markAsProcessed() method")
  class MarkAsProcessedMethod {

    @Test
    @DisplayName("should update alert status to PROCESSED")
    void shouldUpdateAlertStatusToProcessed() {
      String alertId = "alert-123";
      Alert alert = new Alert("contact-123", "John", "john@example.com", "BIRTHDAY", "Message");
      alert.setId(alertId);
      alert.setStatus("PENDING");

      when(alertRepository.findById(alertId)).thenReturn(Optional.of(alert));

      alertService.markAsProcessed(alertId);

      ArgumentCaptor<Alert> alertCaptor = ArgumentCaptor.forClass(Alert.class);
      verify(alertRepository).save(alertCaptor.capture());

      Alert savedAlert = alertCaptor.getValue();
      assertEquals("PROCESSED", savedAlert.getStatus());
    }

    @Test
    @DisplayName("should throw NoSuchElementException when alert not found")
    void shouldThrowExceptionWhenAlertNotFoundForUpdate() {
      String alertId = "non-existent";

      when(alertRepository.findById(alertId)).thenReturn(Optional.empty());

      assertThrows(NoSuchElementException.class, () -> alertService.markAsProcessed(alertId));
      verify(alertRepository, never()).save(any());
    }

    @Test
    @DisplayName("should call repository save after finding alert")
    void shouldCallRepositorySaveAfterFindingAlert() {
      String alertId = "alert-123";
      Alert alert = new Alert("contact-123", "John", "john@example.com", "BIRTHDAY", "Message");
      alert.setId(alertId);

      when(alertRepository.findById(alertId)).thenReturn(Optional.of(alert));

      alertService.markAsProcessed(alertId);

      verify(alertRepository, times(1)).findById(alertId);
      verify(alertRepository, times(1)).save(alert);
    }
  }
}
