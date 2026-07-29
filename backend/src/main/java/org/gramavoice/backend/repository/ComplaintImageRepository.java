package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.ComplaintImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintImageRepository extends JpaRepository<ComplaintImage, Long> {
    List<ComplaintImage> findByComplaintIdOrderByCreatedAtAsc(Long complaintId);
    int countByComplaintId(Long complaintId);
}
