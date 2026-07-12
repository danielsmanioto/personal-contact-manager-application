package com.alertmanager.dto;

import jakarta.validation.constraints.NotBlank;

public class AlertRequest {

  @NotBlank(message = "Contact ID is required")
  private String contactId;

  @NotBlank(message = "Contact name is required")
  private String contactName;

  @NotBlank(message = "Contact email is required")
  private String contactEmail;

  @NotBlank(message = "Alert type is required")
  private String alertType;

  @NotBlank(message = "Message is required")
  private String message;

  public AlertRequest() {}

  public AlertRequest(
      String contactId, String contactName, String contactEmail, String alertType, String message) {
    this.contactId = contactId;
    this.contactName = contactName;
    this.contactEmail = contactEmail;
    this.alertType = alertType;
    this.message = message;
  }

  public String getContactId() {
    return contactId;
  }

  public void setContactId(String contactId) {
    this.contactId = contactId;
  }

  public String getContactName() {
    return contactName;
  }

  public void setContactName(String contactName) {
    this.contactName = contactName;
  }

  public String getContactEmail() {
    return contactEmail;
  }

  public void setContactEmail(String contactEmail) {
    this.contactEmail = contactEmail;
  }

  public String getAlertType() {
    return alertType;
  }

  public void setAlertType(String alertType) {
    this.alertType = alertType;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
