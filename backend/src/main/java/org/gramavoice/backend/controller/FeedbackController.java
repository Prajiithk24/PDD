package org.gramavoice.backend.controller;

import org.gramavoice.backend.dto.FeedbackRequest;
import org.gramavoice.backend.dto.FeedbackResponse;
import org.gramavoice.backend.model.Complaint;
import org.gramavoice.backend.model.ComplaintFeedback;
import org.gramavoice.backend.model.ComplaintStatus;
import org.gramavoice.backend.model.User;
import org.gramavoice.backend.model.UserRole;
import org.gramavoice.backend.repository.ComplaintFeedbackRepository;
import org.gramavoice.backend.repository.ComplaintRepository;
import org.gramavoice.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final ComplaintFeedbackRepository feedbackRepository;
    private final ComplaintRepository complaintRepository;
    private final UserService userService;

    public FeedbackController(ComplaintFeedbackRepository feedbackRepository,
                              ComplaintRepository complaintRepository,
                              UserService userService) {
        this.feedbackRepository = feedbackRepository;
        this.complaintRepository = complaintRepository;
        this.userService = userService;
    }

    @PostMapping
    public FeedbackResponse submitFeedback(@RequestBody FeedbackRequest request, Principal principal) {
        User user = userService.getByUsername(principal.getName());
        Complaint complaint = complaintRepository.findById(request.complaintId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "குறை கிடைக்கவில்லை"));

        if (user.getRole() == UserRole.CITIZEN) {
            boolean ownsByUsername = user.getUsername().equals(complaint.getOwnerUsername());
            boolean ownsByMobile = user.getMobileNumber() != null && user.getMobileNumber().equals(complaint.getMobileNumber());
            if (!ownsByUsername && !ownsByMobile) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "இது உங்கள் குறை அல்ல");
            }
        }

        if (complaint.getStatus() != ComplaintStatus.RESOLVED && complaint.getStatus() != ComplaintStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "தீர்வு பெற்ற குறைகளுக்கு மட்டுமே மதிப்பீடு அளிக்க முடியும்");
        }

        if (feedbackRepository.existsByComplaintId(request.complaintId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "இந்த குறைக்கு ஏற்கெனவே மதிப்பீடு அளிக்கப்பட்டுள்ளது");
        }

        if (request.rating() < 1 || request.rating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "மதிப்பீடு 1 முதல் 5 வரை இருக்க வேண்டும்");
        }

        ComplaintFeedback feedback = new ComplaintFeedback();
        feedback.setComplaint(complaint);
        feedback.setRating(request.rating());
        feedback.setCommentTa(request.commentTa());
        ComplaintFeedback saved = feedbackRepository.save(feedback);

        return new FeedbackResponse(
                saved.getId(),
                complaint.getId(),
                complaint.getReferenceNumber(),
                saved.getRating(),
                saved.getCommentTa(),
                saved.getCreatedAt()
        );
    }

    @GetMapping("/{complaintId}")
    public FeedbackResponse getFeedback(@PathVariable Long complaintId) {
        ComplaintFeedback feedback = feedbackRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "மதிப்பீடு கிடைக்கவில்லை"));
        return new FeedbackResponse(
                feedback.getId(),
                feedback.getComplaint().getId(),
                feedback.getComplaint().getReferenceNumber(),
                feedback.getRating(),
                feedback.getCommentTa(),
                feedback.getCreatedAt()
        );
    }

    @GetMapping("/stats")
    public Map<String, Object> feedbackStats() {
        Double avg = feedbackRepository.averageRating();
        long total = feedbackRepository.totalFeedbacks();
        return Map.of(
                "averageRating", avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0,
                "totalFeedbacks", total
        );
    }
}
