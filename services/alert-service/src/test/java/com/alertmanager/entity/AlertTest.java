package com.alertmanager.entity;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("Alert Entity Unit Tests")
class AlertTest {

  private Alert alert;

  @Nested
  @DisplayName("Constructor tests")
  class ConstructorTests {

    @Test
    @DisplayName("should create alert with all-args constructor")
    void shouldCreateAlertWithAllArgsConstructor() {
      alert = new Alert("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");

      assertEquals("contact-123", alert.getContactId());
      assertEquals("John Doe", alert.getContactName());
      assertEquals("john@example.com", alert.getContactEmail());
      assertEquals("BIRTHDAY", alert.getAlertType());
      assertEquals("Birthday coming up", alert.getMessage());
    }

    @Test
    @DisplayName("should initialize status to PENDING in constructor")
    void shouldInitializeStatusToPending() {
      alert = new Alert("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");

      assertEquals("PENDING", alert.getStatus());
    }

    @Test
    @DisplayName("should initialize createdAt in constructor")
    void shouldInitializeCreatedAtInConstructor() {
      LocalDateTime beforeCreation = LocalDateTime.now();
      alert = new Alert("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
      LocalDateTime afterCreation = LocalDateTime.now();

      assertNotNull(alert.getCreatedAt());
      assertTrue(alert.getCreatedAt().isAfter(beforeCreation.minusSeconds(1)));
      assertTrue(alert.getCreatedAt().isBefore(afterCreation.plusSeconds(1)));
    }

    @Test
    @DisplayName("should create alert with no-args constructor")
    void shouldCreateAlertWithNoArgsConstructor() {
      alert = new Alert();

      assertNull(alert.getId());
      assertNull(alert.getContactId());
      assertNull(alert.getContactName());
      assertNull(alert.getContactEmail());
      assertNull(alert.getAlertType());
      assertNull(alert.getMessage());
      assertNull(alert.getStatus());
      assertNull(alert.getCreatedAt());
    }
  }

  @Nested
  @DisplayName("Getters and Setters")
  class GettersAndSetters {

    @BeforeEach
    void setUp() {
      alert = new Alert();
    }

    @Test
    @DisplayName("should set and get id")
    void shouldSetAndGetId() {
      alert.setId("alert-123");
      assertEquals("alert-123", alert.getId());
    }

    @Test
    @DisplayName("should set and get contactId")
    void shouldSetAndGetContactId() {
      alert.setContactId("contact-456");
      assertEquals("contact-456", alert.getContactId());
    }

    @Test
    @DisplayName("should set and get contactName")
    void shouldSetAndGetContactName() {
      alert.setContactName("Jane Doe");
      assertEquals("Jane Doe", alert.getContactName());
    }

    @Test
    @DisplayName("should set and get contactEmail")
    void shouldSetAndGetContactEmail() {
      alert.setContactEmail("jane@example.com");
      assertEquals("jane@example.com", alert.getContactEmail());
    }

    @Test
    @DisplayName("should set and get alertType")
    void shouldSetAndGetAlertType() {
      alert.setAlertType("ANNIVERSARY");
      assertEquals("ANNIVERSARY", alert.getAlertType());
    }

    @Test
    @DisplayName("should set and get message")
    void shouldSetAndGetMessage() {
      alert.setMessage("Important reminder");
      assertEquals("Important reminder", alert.getMessage());
    }

    @Test
    @DisplayName("should set and get status")
    void shouldSetAndGetStatus() {
      alert.setStatus("PROCESSED");
      assertEquals("PROCESSED", alert.getStatus());
    }

    @Test
    @DisplayName("should set and get createdAt")
    void shouldSetAndGetCreatedAt() {
      LocalDateTime now = LocalDateTime.now();
      alert.setCreatedAt(now);
      assertEquals(now, alert.getCreatedAt());
    }
  }

  @Nested
  @DisplayName("toString() method")
  class ToStringMethod {

    @Test
    @DisplayName("should include all fields in toString")
    void shouldIncludeAllFieldsInToString() {
      alert = new Alert("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
      alert.setId("alert-456");

      String toStringResult = alert.toString();

      assertTrue(toStringResult.contains("alert-456"));
      assertTrue(toStringResult.contains("contact-123"));
      assertTrue(toStringResult.contains("John Doe"));
      assertTrue(toStringResult.contains("john@example.com"));
      assertTrue(toStringResult.contains("BIRTHDAY"));
      assertTrue(toStringResult.contains("Birthday coming up"));
    }

    @Test
    @DisplayName("should have Alert class name in toString")
    void shouldHaveAlertClassNameInToString() {
      alert = new Alert();
      assertTrue(alert.toString().startsWith("Alert{"));
    }
  }

  @Nested
  @DisplayName("Field validation")
  class FieldValidation {

    @BeforeEach
    void setUp() {
      alert = new Alert("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
    }

    @Test
    @DisplayName("should allow null id initially")
    void shouldAllowNullIdInitially() {
      Alert newAlert = new Alert("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
      assertNull(newAlert.getId());
    }

    @Test
    @DisplayName("should allow different alert types")
    void shouldAllowDifferentAlertTypes() {
      alert.setAlertType("APPOINTMENT");
      assertEquals("APPOINTMENT", alert.getAlertType());

      alert.setAlertType("REMINDER");
      assertEquals("REMINDER", alert.getAlertType());

      alert.setAlertType("BIRTHDAY");
      assertEquals("BIRTHDAY", alert.getAlertType());
    }

    @Test
    @DisplayName("should allow different statuses")
    void shouldAllowDifferentStatuses() {
      alert.setStatus("PENDING");
      assertEquals("PENDING", alert.getStatus());

      alert.setStatus("PROCESSED");
      assertEquals("PROCESSED", alert.getStatus());

      alert.setStatus("CANCELLED");
      assertEquals("CANCELLED", alert.getStatus());
    }

    @Test
    @DisplayName("should preserve email format")
    void shouldPreserveEmailFormat() {
      String email = "john.doe+test@example.co.uk";
      alert.setContactEmail(email);
      assertEquals(email, alert.getContactEmail());
    }
  }

  @Nested
  @DisplayName("Time tracking")
  class TimeTracking {

    @Test
    @DisplayName("should set createdAt to current time on construction")
    void shouldSetCreatedAtToCurrentTimeOnConstruction() {
      LocalDateTime beforeCreation = LocalDateTime.now();
      alert = new Alert("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
      LocalDateTime afterCreation = LocalDateTime.now();

      assertNotNull(alert.getCreatedAt());
      assertTrue(alert.getCreatedAt().isAfter(beforeCreation.minusSeconds(1)));
      assertTrue(alert.getCreatedAt().isBefore(afterCreation.plusSeconds(1)));
    }

    @Test
    @DisplayName("should allow manual setting of createdAt")
    void shouldAllowManualSettingOfCreatedAt() {
      alert = new Alert();
      LocalDateTime specificTime = LocalDateTime.of(2025, 1, 1, 12, 0, 0);
      alert.setCreatedAt(specificTime);

      assertEquals(specificTime, alert.getCreatedAt());
    }
  }
}
