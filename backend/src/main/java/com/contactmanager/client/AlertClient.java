package com.contactmanager.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "alert-service",
    url = "${alert-service.url:http://localhost:8082}",
    fallback = AlertClientFallback.class)
public interface AlertClient {

  @PostMapping("/api/alerts")
  ResponseEntity<AlertResponse> sendAlert(@RequestBody AlertRequest request);

  class AlertRequest {
    public String contactId;
    public String contactName;
    public String contactEmail;
    public String alertType;
    public String message;

    public AlertRequest(
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
    }
  }

  class AlertResponse {
    public String id;
    public String contactId;
    public String status;
  }
}
