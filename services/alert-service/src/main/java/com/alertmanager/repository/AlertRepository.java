package com.alertmanager.repository;

import com.alertmanager.entity.Alert;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertRepository extends MongoRepository<Alert, String> {

  List<Alert> findByContactId(String contactId);

  List<Alert> findByStatus(String status);

  List<Alert> findByAlertType(String alertType);

  List<Alert> findByContactIdAndStatus(String contactId, String status);
}
