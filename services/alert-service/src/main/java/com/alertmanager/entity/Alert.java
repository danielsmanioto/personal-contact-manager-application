package com.alertmanager.entity;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "alerts")
public class Alert {

  @Id private String id;

  @Field("contact_id")
  private String contactId;

  @Field("contact_name")
  private String contactName;

  @Field("contact_email")
  private String contactEmail;

  @Field("alert_type")
  private String alertType;

  @Field("message")
  private String message;

  @Field("status")
  private String status;

  @Field("created_at")
  private LocalDateTime createdAt;

  public Alert() {}

  public Alert(
      String contactId,
      String contactName,
      String contactEmail,
      String alertType,
      String message) {
    this.contactId = contactId;
    this.contactName = contactName;
    this.contactEmail = contactEmail;
    this.alertType = alertType;
    this.message = message;
    this.status = "PENDING";
    this.createdAt = LocalDateTime.now();
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

  @Override
  public String toString() {
    return "Alert{"
        + "id='"
        + id
        + '\''
        + ", contactId='"
        + contactId
        + '\''
        + ", contactName='"
        + contactName
        + '\''
        + ", contactEmail='"
        + contactEmail
        + '\''
        + ", alertType='"
        + alertType
        + '\''
        + ", message='"
        + message
        + '\''
        + ", status='"
        + status
        + '\''
        + ", createdAt="
        + createdAt
        + '}';
  }
}
