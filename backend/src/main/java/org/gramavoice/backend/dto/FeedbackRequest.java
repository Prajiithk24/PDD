package org.gramavoice.backend.dto;

public record FeedbackRequest(
        Long complaintId,
        int rating,
        String commentTa
) {
}
