package com.alertmanager.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("AlertRequest DTO Unit Tests")
class AlertRequestTest {

  private AlertRequest alertRequest;

  @Nested
  @DisplayName("Constructor tests")
  class ConstructorTests {

    @Test
    @DisplayName("should create AlertRequest with all-args constructor")
    void shouldCreateAlertRequestWithAllArgsConstructor() {
      alertRequest =
          new AlertRequest("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");

      assertEquals("contact-123", alertRequest.getContactId());
      assertEquals("John Doe", alertRequest.getContactName());
      assertEquals("john@example.com", alertRequest.getContactEmail());
      assertEquals("BIRTHDAY", alertRequest.getAlertType());
      assertEquals("Birthday coming up", alertRequest.getMessage());
    }

    @Test
    @DisplayName("should create AlertRequest with no-args constructor")
    void shouldCreateAlertRequestWithNoArgsConstructor() {
      alertRequest = new AlertRequest();

      assertNull(alertRequest.getContactId());
      assertNull(alertRequest.getContactName());
      assertNull(alertRequest.getContactEmail());
      assertNull(alertRequest.getAlertType());
      assertNull(alertRequest.getMessage());
    }
  }

  @Nested
  @DisplayName("Getters and Setters")
  class GettersAndSetters {

    @BeforeEach
    void setUp() {
      alertRequest = new AlertRequest();
    }

    @Test
    @DisplayName("should set and get contactId")
    void shouldSetAndGetContactId() {
      alertRequest.setContactId("contact-456");
      assertEquals("contact-456", alertRequest.getContactId());
    }

    @Test
    @DisplayName("should set and get contactName")
    void shouldSetAndGetContactName() {
      alertRequest.setContactName("Jane Doe");
      assertEquals("Jane Doe", alertRequest.getContactName());
    }

    @Test
    @DisplayName("should set and get contactEmail")
    void shouldSetAndGetContactEmail() {
      alertRequest.setContactEmail("jane@example.com");
      assertEquals("jane@example.com", alertRequest.getContactEmail());
    }

    @Test
    @DisplayName("should set and get alertType")
    void shouldSetAndGetAlertType() {
      alertRequest.setAlertType("ANNIVERSARY");
      assertEquals("ANNIVERSARY", alertRequest.getAlertType());
    }

    @Test
    @DisplayName("should set and get message")
    void shouldSetAndGetMessage() {
      alertRequest.setMessage("Important reminder");
      assertEquals("Important reminder", alertRequest.getMessage());
    }
  }

  @Nested
  @DisplayName("Field modifications")
  class FieldModifications {

    @BeforeEach
    void setUp() {
      alertRequest =
          new AlertRequest("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Birthday coming up");
    }

    @Test
    @DisplayName("should allow multiple updates to same field")
    void shouldAllowMultipleUpdatesToSameField() {
      alertRequest.setAlertType("BIRTHDAY");
      assertEquals("BIRTHDAY", alertRequest.getAlertType());

      alertRequest.setAlertType("ANNIVERSARY");
      assertEquals("ANNIVERSARY", alertRequest.getAlertType());

      alertRequest.setAlertType("REMINDER");
      assertEquals("REMINDER", alertRequest.getAlertType());
    }

    @Test
    @DisplayName("should allow long message")
    void shouldAllowLongMessage() {
      String longMessage = "A".repeat(1000);
      alertRequest.setMessage(longMessage);
      assertEquals(longMessage, alertRequest.getMessage());
    }

    @Test
    @DisplayName("should preserve special characters in email")
    void shouldPreserveSpecialCharactersInEmail() {
      String email = "john.doe+test@example.co.uk";
      alertRequest.setContactEmail(email);
      assertEquals(email, alertRequest.getContactEmail());
    }
  }

  @Nested
  @DisplayName("Validation annotations")
  class ValidationAnnotations {

    @Test
    @DisplayName("should accept non-blank contactId")
    void shouldAcceptNonBlankContactId() {
      alertRequest = new AlertRequest("contact-123", "John", "john@example.com", "BIRTHDAY", "Message");
      assertNotNull(alertRequest.getContactId());
    }

    @Test
    @DisplayName("should accept non-blank contactName")
    void shouldAcceptNonBlankContactName() {
      alertRequest = new AlertRequest("contact-123", "John Doe", "john@example.com", "BIRTHDAY", "Message");
      assertNotNull(alertRequest.getContactName());
    }

    @Test
    @DisplayName("should accept non-blank contactEmail")
    void shouldAcceptNonBlankContactEmail() {
      alertRequest = new AlertRequest("contact-123", "John", "john@example.com", "BIRTHDAY", "Message");
      assertNotNull(alertRequest.getContactEmail());
    }

    @Test
    @DisplayName("should accept non-blank alertType")
    void shouldAcceptNonBlankAlertType() {
      alertRequest = new AlertRequest("contact-123", "John", "john@example.com", "BIRTHDAY", "Message");
      assertNotNull(alertRequest.getAlertType());
    }

    @Test
    @DisplayName("should accept non-blank message")
    void shouldAcceptNonBlankMessage() {
      alertRequest = new AlertRequest("contact-123", "John", "john@example.com", "BIRTHDAY", "Birthday coming up");
      assertNotNull(alertRequest.getMessage());
    }
  }

  @Nested
  @DisplayName("Object equality")
  class ObjectEquality {

    @Test
    @DisplayName("should create independent instances")
    void shouldCreateIndependentInstances() {
      AlertRequest request1 =
          new AlertRequest("contact-123", "John", "john@example.com", "BIRTHDAY", "Message");
      AlertRequest request2 =
          new AlertRequest("contact-123", "John", "john@example.com", "BIRTHDAY", "Message");

      assertEquals(request1.getContactId(), request2.getContactId());
      assertEquals(request1.getContactName(), request2.getContactName());
      assertEquals(request1.getContactEmail(), request2.getContactEmail());
      assertEquals(request1.getAlertType(), request2.getAlertType());
      assertEquals(request1.getMessage(), request2.getMessage());
    }
  }
}
