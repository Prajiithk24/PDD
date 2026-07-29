package org.gramavoice.backend.dto;

import java.time.LocalDateTime;

public record FeedbackResponse(
        Long id,
        Long complaintId,
        String referenceNumber,
        int rating,
        String commentTa,
        LocalDateTime createdAt
) {
}
