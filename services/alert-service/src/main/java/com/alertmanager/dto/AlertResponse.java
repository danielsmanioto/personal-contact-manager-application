package com.alertmanager.dto;

import java.time.LocalDateTime;

public class AlertResponse {

  private String id;
  private String contactId;
  private String contactName;
  private String contactEmail;
  private String alertType;
  private String message;
  private String status;
  private LocalDateTime createdAt;

  public AlertResponse() {}

  public AlertResponse(
      String id,
      String contactId,
      String contactName,
      String contactEmail,
      String alertType,
      String message,
      String status,
      LocalDateTime createdAt) {
    this.id = id;
    this.contactId = contactId;
    this.contactName = contactName;
    this.contactEmail = contactEmail;
    this.alertType = alertType;
    this.message = message;
    this.status = status;
    this.createdAt = createdAt;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
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

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
