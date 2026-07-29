package org.gramavoice.backend.dto;

import java.util.List;

public record AnalyticsResponse(
        long totalComplaints,
        long resolvedCount,
        long pendingCount,
        double avgResolutionHours,
        double avgFeedbackRating,
        long totalFeedbacks,
        List<ChartPointResponse> departmentBreakdown,
        List<ChartPointResponse> statusBreakdown,
        List<ChartPointResponse> priorityBreakdown,
        List<ChartPointResponse> monthlyTrend
) {
}
