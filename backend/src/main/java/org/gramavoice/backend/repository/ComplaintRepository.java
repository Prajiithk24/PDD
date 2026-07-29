package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.Complaint;
import org.gramavoice.backend.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByOwnerUsernameOrderByCreatedAtDesc(String ownerUsername);
    List<Complaint> findByMobileNumberOrderByCreatedAtDesc(String mobileNumber);
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
    List<Complaint> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
    List<Complaint> findByDepartmentCodeAndCreatedAtBetween(String departmentCode, LocalDateTime from, LocalDateTime to);
    List<Complaint> findByStatusAndCreatedAtBetween(ComplaintStatus status, LocalDateTime from, LocalDateTime to);
    List<Complaint> findByDepartmentCodeAndStatusAndCreatedAtBetween(String departmentCode, ComplaintStatus status, LocalDateTime from, LocalDateTime to);
}

