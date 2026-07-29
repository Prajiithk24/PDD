package org.gramavoice.backend.service;

import org.gramavoice.backend.dto.AnalyticsResponse;
import org.gramavoice.backend.dto.ChartPointResponse;
import org.gramavoice.backend.model.Complaint;
import org.gramavoice.backend.model.ComplaintStatus;
import org.gramavoice.backend.repository.ComplaintFeedbackRepository;
import org.gramavoice.backend.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintFeedbackRepository feedbackRepository;

    public ReportService(ComplaintRepository complaintRepository, ComplaintFeedbackRepository feedbackRepository) {
        this.complaintRepository = complaintRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public AnalyticsResponse getAnalytics(LocalDateTime from, LocalDateTime to, String department, String status) {
        List<Complaint> complaints = filterComplaints(from, to, department, status);

        long total = complaints.size();
        long resolved = complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.CLOSED).count();
        long pending = total - resolved;

        double avgHours = complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.RESOLVED && c.getUpdatedAt() != null)
                .mapToLong(c -> Duration.between(c.getCreatedAt(), c.getUpdatedAt()).toHours())
                .average()
                .orElse(0.0);

        Double avgRating = feedbackRepository.averageRating();
        long totalFeedbacks = feedbackRepository.totalFeedbacks();

        List<ChartPointResponse> departmentBreakdown = complaints.stream()
                .collect(Collectors.groupingBy(c -> c.getDepartmentLabelTa() != null ? c.getDepartmentLabelTa() : "வகைப்படுத்தப்படாதது", Collectors.counting()))
                .entrySet().stream()
                .map(e -> new ChartPointResponse(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(ChartPointResponse::value).reversed())
                .toList();

        List<ChartPointResponse> statusBreakdown = complaints.stream()
                .collect(Collectors.groupingBy(c -> statusLabel(c.getStatus()), Collectors.counting()))
                .entrySet().stream()
                .map(e -> new ChartPointResponse(e.getKey(), e.getValue()))
                .toList();

        List<ChartPointResponse> priorityBreakdown = complaints.stream()
                .collect(Collectors.groupingBy(c -> c.getPriority().name(), Collectors.counting()))
                .entrySet().stream()
                .map(e -> new ChartPointResponse(e.getKey(), e.getValue()))
                .toList();

        List<ChartPointResponse> monthlyTrend = buildMonthlyTrend(complaints);

        return new AnalyticsResponse(
                total, resolved, pending,
                Math.round(avgHours * 10.0) / 10.0,
                avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0,
                totalFeedbacks,
                departmentBreakdown, statusBreakdown, priorityBreakdown, monthlyTrend
        );
    }

    public byte[] exportCsv(LocalDateTime from, LocalDateTime to, String department, String status) {
        List<Complaint> complaints = filterComplaints(from, to, department, status);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // BOM for Excel Tamil support
        try {
            baos.write(new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF});
        } catch (Exception ignored) {}
        PrintWriter writer = new PrintWriter(new OutputStreamWriter(baos, StandardCharsets.UTF_8));

        writer.println("குறை எண்,பெயர்,கைபேசி,வகை,துறை,நிலை,முன்னுரிமை,ஊர்,மாவட்டம்,பதிவு நாள்,கடைசி புதுப்பிப்பு");

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        for (Complaint c : complaints) {
            writer.printf("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s%n",
                    csvSafe(c.getReferenceNumber()),
                    csvSafe(c.getCitizenName()),
                    csvSafe(c.getMobileNumber()),
                    csvSafe(c.getCategoryLabelTa()),
                    csvSafe(c.getDepartmentLabelTa()),
                    csvSafe(statusLabel(c.getStatus())),
                    csvSafe(c.getPriority().name()),
                    csvSafe(c.getVillage()),
                    csvSafe(c.getDistrict()),
                    c.getCreatedAt() != null ? c.getCreatedAt().format(fmt) : "",
                    c.getUpdatedAt() != null ? c.getUpdatedAt().format(fmt) : ""
            );
        }
        writer.flush();
        return baos.toByteArray();
    }

    private List<Complaint> filterComplaints(LocalDateTime from, LocalDateTime to, String department, String status) {
        if (from == null) from = LocalDateTime.of(2020, 1, 1, 0, 0);
        if (to == null) to = LocalDateTime.now().plusDays(1);

        if (department != null && !department.isBlank() && status != null && !status.isBlank()) {
            return complaintRepository.findByDepartmentCodeAndStatusAndCreatedAtBetween(department, ComplaintStatus.valueOf(status), from, to);
        }
        if (department != null && !department.isBlank()) {
            return complaintRepository.findByDepartmentCodeAndCreatedAtBetween(department, from, to);
        }
        if (status != null && !status.isBlank()) {
            return complaintRepository.findByStatusAndCreatedAtBetween(ComplaintStatus.valueOf(status), from, to);
        }
        return complaintRepository.findByCreatedAtBetween(from, to);
    }

    private List<ChartPointResponse> buildMonthlyTrend(List<Complaint> complaints) {
        Map<String, Long> grouped = complaints.stream()
                .filter(c -> c.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getCreatedAt().getYear() + "-" + String.format("%02d", c.getCreatedAt().getMonthValue()),
                        Collectors.counting()
                ));
        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new ChartPointResponse(e.getKey(), e.getValue()))
                .toList();
    }

    private String statusLabel(ComplaintStatus status) {
        return switch (status) {
            case REGISTERED -> "பதிவு";
            case ROUTED -> "அனுப்பப்பட்டது";
            case IN_PROGRESS -> "செயலில்";
            case FIELD_VISIT -> "தள ஆய்வு";
            case RESOLVED -> "தீர்வு";
            case ESCALATED -> "உயர்த்தப்பட்டது";
            case CLOSED -> "மூடப்பட்டது";
        };
    }

    private String csvSafe(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
