package org.gramavoice.backend.controller;

import org.gramavoice.backend.dto.ImageResponse;
import org.gramavoice.backend.model.Complaint;
import org.gramavoice.backend.model.ComplaintImage;
import org.gramavoice.backend.model.User;
import org.gramavoice.backend.model.UserRole;
import org.gramavoice.backend.repository.ComplaintImageRepository;
import org.gramavoice.backend.repository.ComplaintRepository;
import org.gramavoice.backend.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.Principal;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ImageController {

    private final ComplaintImageRepository imageRepository;
    private final ComplaintRepository complaintRepository;
    private final UserService userService;

    public ImageController(ComplaintImageRepository imageRepository, ComplaintRepository complaintRepository, UserService userService) {
        this.imageRepository = imageRepository;
        this.complaintRepository = complaintRepository;
        this.userService = userService;
    }

    @PostMapping("/complaints/{id}/images")
    public ImageResponse uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "captionTa", required = false) String captionTa,
            Principal principal
    ) {
        Complaint complaint = checkAccess(id, principal);

        if (imageRepository.countByComplaintId(id) >= 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "அதிகபட்சமாக 5 படங்கள் மட்டுமே அனுமதிக்கப்படும்");
        }

        try {
            String base64Data = Base64.getEncoder().encodeToString(file.getBytes());
            ComplaintImage image = new ComplaintImage();
            image.setComplaint(complaint);
            image.setFileName(file.getOriginalFilename());
            image.setContentType(file.getContentType());
            image.setImageData(base64Data);
            image.setCaptionTa(captionTa);

            ComplaintImage saved = imageRepository.save(image);
            return toResponse(saved);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "படத்தை பதிவேற்றுவதில் பிழை");
        }
    }

    @GetMapping("/complaints/{id}/images")
    public List<ImageResponse> getImages(@PathVariable Long id, Principal principal) {
        checkAccess(id, principal);
        return imageRepository.findByComplaintIdOrderByCreatedAtAsc(id)
                .stream().map(this::toResponse).toList();
    }

    @GetMapping("/images/{imageId}")
    public ResponseEntity<byte[]> downloadImage(@PathVariable Long imageId, Principal principal) {
        ComplaintImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "படம் கிடைக்கவில்லை"));
        checkAccess(image.getComplaint().getId(), principal);

        byte[] decoded = Base64.getDecoder().decode(image.getImageData());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(image.getContentType() != null ? image.getContentType() : "image/jpeg"));
        headers.setContentDispositionFormData("inline", image.getFileName());
        
        return new ResponseEntity<>(decoded, headers, HttpStatus.OK);
    }

    @DeleteMapping("/images/{imageId}")
    public void deleteImage(@PathVariable Long imageId, Principal principal) {
        ComplaintImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "படம் கிடைக்கவில்லை"));
        checkAccess(image.getComplaint().getId(), principal);
        imageRepository.delete(image);
    }

    private Complaint checkAccess(Long complaintId, Principal principal) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "குறை கிடைக்கவில்லை"));
        User user = userService.getByUsername(principal.getName());

        if (user.getRole() == UserRole.CITIZEN) {
            boolean ownsByUsername = user.getUsername().equals(complaint.getOwnerUsername());
            boolean ownsByMobile = user.getMobileNumber() != null && user.getMobileNumber().equals(complaint.getMobileNumber());
            if (!ownsByUsername && !ownsByMobile) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "இது உங்கள் குறை அல்ல");
            }
        }
        return complaint;
    }

    private ImageResponse toResponse(ComplaintImage image) {
        return new ImageResponse(
                image.getId(),
                image.getComplaint().getId(),
                image.getFileName(),
                image.getContentType(),
                "/api/images/" + image.getId(), // We return a URL that points to our GET /images/{id} endpoint
                image.getCaptionTa(),
                image.getCreatedAt()
        );
    }
}
