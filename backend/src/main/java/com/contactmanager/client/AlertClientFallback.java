package com.contactmanager.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class AlertClientFallback implements AlertClient {

  private static final Logger log = LoggerFactory.getLogger(AlertClientFallback.class);

  @Override
  public ResponseEntity<AlertResponse> sendAlert(AlertClient.AlertRequest request) {
    log.warn(
        "Alert service unavailable. Alert not sent for contact: {} ({})",
        request.contactId,
        request.contactName);
    // Silently fail - logs are sufficient for audit trail
    return ResponseEntity.ok(null);
  }
}
