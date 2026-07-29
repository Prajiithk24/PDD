package org.gramavoice.backend.controller;

import org.gramavoice.backend.model.PublicWork;
import org.gramavoice.backend.repository.PublicWorkRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/public-works")
@CrossOrigin(origins = "*")
public class PublicWorkController {

    private final PublicWorkRepository publicWorkRepository;

    public PublicWorkController(PublicWorkRepository publicWorkRepository) {
        this.publicWorkRepository = publicWorkRepository;
    }

    private List<PublicWork> getSamplePublicWorks() {
        List<PublicWork> sample = new ArrayList<>();
        sample.add(new PublicWork(
            "சோழவந்தான் பிரதான தார்ச்சாலை சீரமைப்பு",
            "3 கி.மீ தொலைவு தார்ச்சாலை புதியதாக அமைத்தல் மற்றும் பக்கவாட்டு வடிகால் கால்வாய் சீரமைக்கும் பணி.",
            "ROAD_DAMAGE", "ROADS", "சாலை மற்றும் போக்குவரத்து துறை",
            "சோழவந்தான்", "மதுரை", "பேருந்து நிலையம் முதல் சந்தை வரை",
            24.50, 18.20, 75, "IN_PROGRESS", "2026-03-01", "2026-08-30", "ஸ்ரீ குமரன் இன்ஃப்ரா லிமிடெட்"
        ));
        sample.add(new PublicWork(
            "ஊராட்சி ஒன்றிய 50,000 லிட்டர் மேல்நிலை குடிநீர் தொட்டி",
            "சுத்திகரிக்கப்பட்ட குடிநீர் வழங்கும் புதிய குடிநீர் சுத்திகரிப்பு ஆலை மற்றும் மேல்நிலைத் தொட்டி கட்டும் பணி.",
            "WATER_SHORTAGE", "WATER", "குடிநீர் துறை",
            "சோழவந்தான்", "மதுரை", "மேற்கு தெரு சந்தை பகுதி",
            18.00, 18.00, 100, "COMPLETED", "2026-01-10", "2026-06-15", "தமிழ்நாடு குடிநீர் வாரியம்"
        ));
        sample.add(new PublicWork(
            "அலங்காநல்லூர் கிராமிய LED தெருவிளக்குகள் அமைத்தல்",
            "கிராமம் முழுவதும் 120 புதிய சோலார் மற்றும் மின்சார எல்.இ.டி தெருவிளக்குகள் நிறுவும் பணி.",
            "STREETLIGHT", "MUNICIPAL", "ஊராட்சி சேவை மையம்",
            "அலங்காநல்லூர்", "மதுரை", "பள்ளி தெரு மற்றும் பிரதான பாதை",
            8.75, 4.20, 50, "IN_PROGRESS", "2026-04-15", "2026-09-10", "கிராம மின் கூட்டமைப்பு"
        ));
        sample.add(new PublicWork(
            "கழிவுநீர் சுத்திகரிப்பு வடிகால் அமைக்கும் திட்டம்",
            "மழைநீர் வடிகால் மற்றும் கழிவுநீர் பாதை மூடிய சிமெண்ட் காங்ரீட் கால்வாயாக மாற்றுதல்.",
            "SANITATION", "MUNICIPAL", "ஊராட்சி சேவை மையம்",
            "சோழவந்தான்", "மதுரை", "தெற்கு வீதி",
            14.20, 2.00, 15, "PROPOSED", "2026-07-01", "2026-12-20", "மதுரை நகராட்சி ஒப்பந்தக்குழு"
        ));
        return sample;
    }

    @GetMapping
    public ResponseEntity<List<PublicWork>> getAllPublicWorks() {
        List<PublicWork> works = publicWorkRepository.findAll();
        if (works.isEmpty()) {
            return ResponseEntity.ok(getSamplePublicWorks());
        }
        return ResponseEntity.ok(works);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicWork> getPublicWorkById(@PathVariable Long id) {
        return publicWorkRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PublicWork> createPublicWork(@RequestBody PublicWork work) {
        PublicWork saved = publicWorkRepository.save(work);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PublicWork> updatePublicWork(@PathVariable Long id, @RequestBody PublicWork updated) {
        return publicWorkRepository.findById(id)
            .map(existing -> {
                if (updated.getProjectTitleTa() != null) existing.setProjectTitleTa(updated.getProjectTitleTa());
                if (updated.getDescriptionTa() != null) existing.setDescriptionTa(updated.getDescriptionTa());
                if (updated.getCategoryCode() != null) existing.setCategoryCode(updated.getCategoryCode());
                if (updated.getDepartmentCode() != null) existing.setDepartmentCode(updated.getDepartmentCode());
                if (updated.getDepartmentNameTa() != null) existing.setDepartmentNameTa(updated.getDepartmentNameTa());
                if (updated.getVillage() != null) existing.setVillage(updated.getVillage());
                if (updated.getDistrict() != null) existing.setDistrict(updated.getDistrict());
                if (updated.getLocationArea() != null) existing.setLocationArea(updated.getLocationArea());
                if (updated.getAllocatedBudgetLakhs() != null) existing.setAllocatedBudgetLakhs(updated.getAllocatedBudgetLakhs());
                if (updated.getSpentBudgetLakhs() != null) existing.setSpentBudgetLakhs(updated.getSpentBudgetLakhs());
                if (updated.getCompletionPercentage() != null) existing.setCompletionPercentage(updated.getCompletionPercentage());
                if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
                if (updated.getStartDate() != null) existing.setStartDate(updated.getStartDate());
                if (updated.getExpectedEndDate() != null) existing.setExpectedEndDate(updated.getExpectedEndDate());
                if (updated.getContractorName() != null) existing.setContractorName(updated.getContractorName());
                PublicWork saved = publicWorkRepository.save(existing);
                return ResponseEntity.ok(saved);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublicWork(@PathVariable Long id) {
        if (publicWorkRepository.existsById(id)) {
            publicWorkRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

