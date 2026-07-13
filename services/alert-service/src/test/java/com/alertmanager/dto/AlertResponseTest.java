package com.alertmanager.dto;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("AlertResponse DTO Unit Tests")
class AlertResponseTest {

  private AlertResponse alertResponse;
  private LocalDateTime now;

  @BeforeEach
  void setUp() {
    now = LocalDateTime.now();
  }

  @Nested
  @DisplayName("Constructor tests")
  class ConstructorTests {

    @Test
    @DisplayName("should create AlertResponse with all-args constructor")
    void shouldCreateAlertResponseWithAllArgsConstructor() {
      alertResponse =
          new AlertResponse(
              "alert-456",
              "contact-123",
              "John Doe",
              "john@example.com",
              "BIRTHDAY",
              "Birthday coming up",
              "PENDING",
              now);

      assertEquals("alert-456", alertResponse.getId());
      assertEquals("contact-123", alertResponse.getContactId());
      assertEquals("John Doe", alertResponse.getContactName());
      assertEquals("john@example.com", alertResponse.getContactEmail());
      assertEquals("BIRTHDAY", alertResponse.getAlertType());
      assertEquals("Birthday coming up", alertResponse.getMessage());
      assertEquals("PENDING", alertResponse.getStatus());
      assertEquals(now, alertResponse.getCreatedAt());
    }

    @Test
    @DisplayName("should create AlertResponse with no-args constructor")
    void shouldCreateAlertResponseWithNoArgsConstructor() {
      alertResponse = new AlertResponse();

      assertNull(alertResponse.getId());
      assertNull(alertResponse.getContactId());
      assertNull(alertResponse.getContactName());
      assertNull(alertResponse.getContactEmail());
      assertNull(alertResponse.getAlertType());
      assertNull(alertResponse.getMessage());
      assertNull(alertResponse.getStatus());
      assertNull(alertResponse.getCreatedAt());
    }
  }

  @Nested
  @DisplayName("Getters and Setters")
  class GettersAndSetters {

    @BeforeEach
    void setUp() {
      alertResponse = new AlertResponse();
    }

    @Test
    @DisplayName("should set and get id")
    void shouldSetAndGetId() {
      alertResponse.setId("alert-789");
      assertEquals("alert-789", alertResponse.getId());
    }

    @Test
    @DisplayName("should set and get contactId")
    void shouldSetAndGetContactId() {
      alertResponse.setContactId("contact-456");
      assertEquals("contact-456", alertResponse.getContactId());
    }

    @Test
    @DisplayName("should set and get contactName")
    void shouldSetAndGetContactName() {
      alertResponse.setContactName("Jane Doe");
      assertEquals("Jane Doe", alertResponse.getContactName());
    }

    @Test
    @DisplayName("should set and get contactEmail")
    void shouldSetAndGetContactEmail() {
      alertResponse.setContactEmail("jane@example.com");
      assertEquals("jane@example.com", alertResponse.getContactEmail());
    }

    @Test
    @DisplayName("should set and get alertType")
    void shouldSetAndGetAlertType() {
      alertResponse.setAlertType("ANNIVERSARY");
      assertEquals("ANNIVERSARY", alertResponse.getAlertType());
    }

    @Test
    @DisplayName("should set and get message")
    void shouldSetAndGetMessage() {
      alertResponse.setMessage("Important reminder");
      assertEquals("Important reminder", alertResponse.getMessage());
    }

    @Test
    @DisplayName("should set and get status")
    void shouldSetAndGetStatus() {
      alertResponse.setStatus("PROCESSED");
      assertEquals("PROCESSED", alertResponse.getStatus());
    }

    @Test
    @DisplayName("should set and get createdAt")
    void shouldSetAndGetCreatedAt() {
      alertResponse.setCreatedAt(now);
      assertEquals(now, alertResponse.getCreatedAt());
    }
  }

  @Nested
  @DisplayName("Field modifications")
  class FieldModifications {

    @BeforeEach
    void setUp() {
      alertResponse =
          new AlertResponse(
              "alert-456",
              "contact-123",
              "John Doe",
              "john@example.com",
              "BIRTHDAY",
              "Birthday coming up",
              "PENDING",
              now);
    }

    @Test
    @DisplayName("should allow status change from PENDING to PROCESSED")
    void shouldAllowStatusChangeFromPendingToProcessed() {
      alertResponse.setStatus("PROCESSED");
      assertEquals("PROCESSED", alertResponse.getStatus());
    }

    @Test
    @DisplayName("should allow multiple status changes")
    void shouldAllowMultipleStatusChanges() {
      alertResponse.setStatus("PENDING");
      assertEquals("PENDING", alertResponse.getStatus());

      alertResponse.setStatus("PROCESSING");
      assertEquals("PROCESSING", alertResponse.getStatus());

      alertResponse.setStatus("PROCESSED");
      assertEquals("PROCESSED", alertResponse.getStatus());
    }

    @Test
    @DisplayName("should allow message update")
    void shouldAllowMessageUpdate() {
      String newMessage = "Updated message";
      alertResponse.setMessage(newMessage);
      assertEquals(newMessage, alertResponse.getMessage());
    }

    @Test
    @DisplayName("should preserve createdAt timestamp")
    void shouldPreserveCreatedAtTimestamp() {
      LocalDateTime originalCreatedAt = alertResponse.getCreatedAt();
      alertResponse.setMessage("New message");
      alertResponse.setStatus("PROCESSED");

      assertEquals(originalCreatedAt, alertResponse.getCreatedAt());
    }
  }

  @Nested
  @DisplayName("Time tracking")
  class TimeTracking {

    @Test
    @DisplayName("should accept past timestamps")
    void shouldAcceptPastTimestamps() {
      LocalDateTime pastTime = LocalDateTime.of(2020, 1, 1, 12, 0, 0);
      alertResponse = new AlertResponse("id", "cid", "name", "email", "type", "message", "status", pastTime);

      assertEquals(pastTime, alertResponse.getCreatedAt());
    }

    @Test
    @DisplayName("should accept future timestamps")
    void shouldAcceptFutureTimestamps() {
      LocalDateTime futureTime = LocalDateTime.of(2030, 1, 1, 12, 0, 0);
      alertResponse = new AlertResponse("id", "cid", "name", "email", "type", "message", "status", futureTime);

      assertEquals(futureTime, alertResponse.getCreatedAt());
    }

    @Test
    @DisplayName("should handle current time")
    void shouldHandleCurrentTime() {
      LocalDateTime now = LocalDateTime.now();
      alertResponse = new AlertResponse("id", "cid", "name", "email", "type", "message", "status", now);

      assertNotNull(alertResponse.getCreatedAt());
    }
  }

  @Nested
  @DisplayName("Status values")
  class StatusValues {

    @BeforeEach
    void setUp() {
      alertResponse = new AlertResponse();
    }

    @Test
    @DisplayName("should accept PENDING status")
    void shouldAcceptPendingStatus() {
      alertResponse.setStatus("PENDING");
      assertEquals("PENDING", alertResponse.getStatus());
    }

    @Test
    @DisplayName("should accept PROCESSED status")
    void shouldAcceptProcessedStatus() {
      alertResponse.setStatus("PROCESSED");
      assertEquals("PROCESSED", alertResponse.getStatus());
    }

    @Test
    @DisplayName("should accept CANCELLED status")
    void shouldAcceptCancelledStatus() {
      alertResponse.setStatus("CANCELLED");
      assertEquals("CANCELLED", alertResponse.getStatus());
    }

    @Test
    @DisplayName("should accept custom status values")
    void shouldAcceptCustomStatusValues() {
      alertResponse.setStatus("CUSTOM_STATUS");
      assertEquals("CUSTOM_STATUS", alertResponse.getStatus());
    }
  }

  @Nested
  @DisplayName("Alert type values")
  class AlertTypeValues {

    @BeforeEach
    void setUp() {
      alertResponse = new AlertResponse();
    }

    @Test
    @DisplayName("should accept BIRTHDAY alert type")
    void shouldAcceptBirthdayAlertType() {
      alertResponse.setAlertType("BIRTHDAY");
      assertEquals("BIRTHDAY", alertResponse.getAlertType());
    }

    @Test
    @DisplayName("should accept ANNIVERSARY alert type")
    void shouldAcceptAnniversaryAlertType() {
      alertResponse.setAlertType("ANNIVERSARY");
      assertEquals("ANNIVERSARY", alertResponse.getAlertType());
    }

    @Test
    @DisplayName("should accept REMINDER alert type")
    void shouldAcceptReminderAlertType() {
      alertResponse.setAlertType("REMINDER");
      assertEquals("REMINDER", alertResponse.getAlertType());
    }
  }

  @Nested
  @DisplayName("Email validation scenarios")
  class EmailValidationScenarios {

    @BeforeEach
    void setUp() {
      alertResponse = new AlertResponse();
    }

    @Test
    @DisplayName("should preserve email with special characters")
    void shouldPreserveEmailWithSpecialCharacters() {
      String email = "john.doe+test@example.co.uk";
      alertResponse.setContactEmail(email);
      assertEquals(email, alertResponse.getContactEmail());
    }

    @Test
    @DisplayName("should preserve email with numbers")
    void shouldPreserveEmailWithNumbers() {
      String email = "user123@example.com";
      alertResponse.setContactEmail(email);
      assertEquals(email, alertResponse.getContactEmail());
    }
  }

  @Nested
  @DisplayName("Object integrity")
  class ObjectIntegrity {

    @Test
    @DisplayName("should maintain all fields independently")
    void shouldMaintainAllFieldsIndependently() {
      alertResponse = new AlertResponse();

      alertResponse.setId("alert-1");
      alertResponse.setContactId("contact-1");
      alertResponse.setContactName("Name 1");
      alertResponse.setContactEmail("email1@example.com");
      alertResponse.setAlertType("BIRTHDAY");
      alertResponse.setMessage("Message 1");
      alertResponse.setStatus("PENDING");
      alertResponse.setCreatedAt(now);

      assertEquals("alert-1", alertResponse.getId());
      assertEquals("contact-1", alertResponse.getContactId());
      assertEquals("Name 1", alertResponse.getContactName());
      assertEquals("email1@example.com", alertResponse.getContactEmail());
      assertEquals("BIRTHDAY", alertResponse.getAlertType());
      assertEquals("Message 1", alertResponse.getMessage());
      assertEquals("PENDING", alertResponse.getStatus());
      assertEquals(now, alertResponse.getCreatedAt());
    }
  }
}
