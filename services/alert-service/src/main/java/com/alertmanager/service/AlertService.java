package com.alertmanager.service;

import com.alertmanager.dto.AlertRequest;
import com.alertmanager.dto.AlertResponse;
import com.alertmanager.entity.Alert;
import com.alertmanager.repository.AlertRepository;
import java.util.List;
import java.util.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class AlertService {

  private static final Logger log = LoggerFactory.getLogger(AlertService.class);

  private final AlertRepository alertRepository;

  public AlertService(AlertRepository alertRepository) {
    this.alertRepository = alertRepository;
  }

  public AlertResponse create(AlertRequest request) {
    log.info(
        "Creating alert for contact: {} ({})",
        request.getContactId(),
        request.getContactName());

    Alert alert =
        new Alert(
            request.getContactId(),
            request.getContactName(),
            request.getContactEmail(),
            request.getAlertType(),
            request.getMessage());

    Alert saved = alertRepository.save(alert);
    log.info("Alert created successfully with ID: {}", saved.getId());

    return toResponse(saved);
  }

  public AlertResponse getById(String id) {
    log.debug("Fetching alert with ID: {}", id);

    Alert alert =
        alertRepository
            .findById(id)
            .orElseThrow(() -> new NoSuchElementException("Alert not found with ID: " + id));

    return toResponse(alert);
  }

  public Page<AlertResponse> getAll(int page, int size) {
    log.debug("Fetching all alerts - page: {}, size: {}", page, size);

    Page<Alert> alerts = alertRepository.findAll(PageRequest.of(page, size));
    List<AlertResponse> responses = alerts.getContent().stream().map(this::toResponse).toList();

    return new PageImpl<>(responses, alerts.getPageable(), alerts.getTotalElements());
  }

  public List<AlertResponse> getByContactId(String contactId) {
    log.debug("Fetching alerts for contact: {}", contactId);

    List<Alert> alerts = alertRepository.findByContactId(contactId);
    return alerts.stream().map(this::toResponse).toList();
  }

  public List<AlertResponse> getByStatus(String status) {
    log.debug("Fetching alerts with status: {}", status);

    List<Alert> alerts = alertRepository.findByStatus(status);
    return alerts.stream().map(this::toResponse).toList();
  }

  public void markAsProcessed(String id) {
    log.info("Marking alert as PROCESSED: {}", id);

    Alert alert =
        alertRepository
            .findById(id)
            .orElseThrow(() -> new NoSuchElementException("Alert not found with ID: " + id));

    alert.setStatus("PROCESSED");
    alertRepository.save(alert);
  }

  private AlertResponse toResponse(Alert alert) {
    return new AlertResponse(
        alert.getId(),
        alert.getContactId(),
        alert.getContactName(),
        alert.getContactEmail(),
        alert.getAlertType(),
        alert.getMessage(),
        alert.getStatus(),
        alert.getCreatedAt());
  }
}
