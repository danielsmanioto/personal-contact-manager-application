package com.alertmanager.controller;

import com.alertmanager.dto.AlertRequest;
import com.alertmanager.dto.AlertResponse;
import com.alertmanager.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alerts")
@Tag(name = "Alerts", description = "Alert management API")
public class AlertController {

  private static final Logger log = LoggerFactory.getLogger(AlertController.class);
  private final AlertService alertService;

  public AlertController(AlertService alertService) {
    this.alertService = alertService;
  }

  @PostMapping
  @Operation(summary = "Create alert", description = "Create a new alert for a contact")
  @ApiResponse(responseCode = "201", description = "Alert created successfully")
  @ApiResponse(responseCode = "400", description = "Validation failed")
  public ResponseEntity<AlertResponse> createAlert(@Valid @RequestBody AlertRequest request) {
    log.info("Creating alert for contact: {}", request.getContactId());
    AlertResponse alert = alertService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(alert);
  }

  @GetMapping
  @Operation(summary = "List all alerts", description = "Retrieve paginated list of all alerts")
  @ApiResponse(responseCode = "200", description = "Successfully retrieved alerts")
  public ResponseEntity<Page<AlertResponse>> listAlerts(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

    log.debug("Listing alerts - page: {}, size: {}", page, size);
    Page<AlertResponse> alerts = alertService.getAll(page, size);
    return ResponseEntity.ok(alerts);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get alert by ID", description = "Retrieve a specific alert by its ID")
  @ApiResponse(responseCode = "200", description = "Alert found")
  @ApiResponse(responseCode = "404", description = "Alert not found")
  public ResponseEntity<AlertResponse> getAlert(@PathVariable String id) {
    log.debug("Getting alert: {}", id);
    AlertResponse alert = alertService.getById(id);
    return ResponseEntity.ok(alert);
  }

  @GetMapping("/contact/{contactId}")
  @Operation(
      summary = "Get alerts by contact ID",
      description = "Retrieve all alerts for a specific contact")
  @ApiResponse(responseCode = "200", description = "Alerts retrieved")
  public ResponseEntity<List<AlertResponse>> getAlertsByContact(@PathVariable String contactId) {
    log.debug("Getting alerts for contact: {}", contactId);
    List<AlertResponse> alerts = alertService.getByContactId(contactId);
    return ResponseEntity.ok(alerts);
  }

  @GetMapping("/status/{status}")
  @Operation(
      summary = "Get alerts by status",
      description = "Retrieve all alerts with a specific status")
  @ApiResponse(responseCode = "200", description = "Alerts retrieved")
  public ResponseEntity<List<AlertResponse>> getAlertsByStatus(@PathVariable String status) {
    log.debug("Getting alerts with status: {}", status);
    List<AlertResponse> alerts = alertService.getByStatus(status);
    return ResponseEntity.ok(alerts);
  }

  @PutMapping("/{id}/mark-processed")
  @Operation(summary = "Mark alert as processed", description = "Update alert status to PROCESSED")
  @ApiResponse(responseCode = "204", description = "Alert marked as processed")
  @ApiResponse(responseCode = "404", description = "Alert not found")
  public ResponseEntity<Void> markAsProcessed(@PathVariable String id) {
    log.info("Marking alert as processed: {}", id);
    alertService.markAsProcessed(id);
    return ResponseEntity.noContent().build();
  }
}
