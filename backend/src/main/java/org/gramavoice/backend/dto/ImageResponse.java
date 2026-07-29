package org.gramavoice.backend.dto;

import java.time.LocalDateTime;

public record ImageResponse(
        Long id,
        Long complaintId,
        String fileName,
        String contentType,
        String imageData,
        String captionTa,
        LocalDateTime createdAt
) {
}
