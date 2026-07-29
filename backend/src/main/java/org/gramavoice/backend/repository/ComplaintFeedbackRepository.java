package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.ComplaintFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ComplaintFeedbackRepository extends JpaRepository<ComplaintFeedback, Long> {
    Optional<ComplaintFeedback> findByComplaintId(Long complaintId);
    List<ComplaintFeedback> findByComplaint_MobileNumberOrderByCreatedAtDesc(String mobileNumber);
    boolean existsByComplaintId(Long complaintId);

    @Query("SELECT AVG(f.rating) FROM ComplaintFeedback f")
    Double averageRating();

    @Query("SELECT COUNT(f) FROM ComplaintFeedback f")
    long totalFeedbacks();
}
