package org.gramavoice.backend.controller;

import org.gramavoice.backend.model.WelfareScheme;
import org.gramavoice.backend.repository.WelfareSchemeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/welfare-schemes")
@CrossOrigin(origins = "*")
public class WelfareSchemeController {

    private final WelfareSchemeRepository welfareSchemeRepository;

    public WelfareSchemeController(WelfareSchemeRepository welfareSchemeRepository) {
        this.welfareSchemeRepository = welfareSchemeRepository;
    }

    private List<WelfareScheme> getSampleSchemes() {
        List<WelfareScheme> list = new ArrayList<>();
        list.add(new WelfareScheme(
            "கலைஞர் மகளிர் உரிமைத் திட்டம்",
            "Kalaignar Magalir Urimai Thittam",
            "சமூக நலன் மற்றும் மகளிர் உரிமைத் துறை",
            "மகளிர் நலன்",
            "குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 நிதி உதவி வழங்கும் முதன்மை திட்டம்.",
            "மாதம் ₹1,000 நேரடி வங்கிப் பரிமாற்றம் (DBT).",
            21, 65, 250000.0, "FEMALE", "ALL",
            "ஆதார் அட்டை, ரேஷன் அட்டை, வங்கி கணக்கு புத்தக நகல், வருமானச் சான்றிதழ்.",
            "https://kmut.tn.gov.in"
        ));
        list.add(new WelfareScheme(
            "முதலமைச்சரின் உழவர் பாதுகாப்புத் திட்டம்",
            "CM Farmers Protection Scheme",
            "வேளாண்மை மற்றும் உழவர் நலத்துறை",
            "விவசாயிகள் நலன்",
            "விவசாயிகள் மற்றும் விவசாயத் தொழிலாளர்களுக்கு இயற்கை மரணம், விபத்து மற்றும் கல்வி உதவித்தொகை வழங்கும் திட்டம்.",
            "விவசாயிகளுக்கு இலவச மின் இணைப்பு, பயிர் காப்பீட்டு மானியம் மற்றும் இயற்கை மரணத்திற்கு ₹50,000 நிதி உதவி.",
            18, 70, 300000.0, "ALL", "FARMER",
            "உழவர் பாதுகாப்பு அட்டை, சிட்டா/அடங்கல் நகல், ஆதார் அட்டை, வங்கி கணக்கு நகல்.",
            "https://tnagrisnet.tn.gov.in"
        ));
        list.add(new WelfareScheme(
            "முதியோர் ஓய்வூதியத் திட்டம் (OAP)",
            "Old Age Pension Scheme",
            "வருவாய்த்துறை",
            "முதியோர் நலன்",
            "ஆதரவற்ற முதியோருக்கு மாதம் ₹1,200 ஓய்வூதியம் மற்றும் இலவச ரேஷன் அரிசி வழங்கும் உதவித் திட்டம்.",
            "மாதம் ₹1,200 நிதி உதவி + 20 கிலோ இலவச அரிசி.",
            60, 100, 120000.0, "ALL", "ALL",
            "வயது சான்றிதழ் / ஆதார், குடும்ப அட்டை, வருமானச் சான்றிதழ், கிராம நிர்வாக அலுவலர் (VAO) சான்று.",
            "https://tnesevai.tn.gov.in"
        ));
        list.add(new WelfareScheme(
            "புதுமைப் பெண் திட்டம் (மூவலூர் ராமாமிர்தம் அம்மையார் நினைவு திட்டம்)",
            "Puthumai Penn Scheme",
            "உயர்கல்வித் துறை",
            "மாணவிகள் நலன்",
            "அரசுப் பள்ளிகளில் படித்த மாணவிகள் உயர்கல்வி பயில மாதம் ₹1,000 ஊக்கத்தொகை அளிக்கும் திட்டம்.",
            "பட்டப்படிப்பு/டிப்ளமோ படிப்ப காலம் வரை மாதம் ₹1,000 உதவித்தொகை.",
            17, 25, 500000.0, "FEMALE", "STUDENT",
            "6 முதல் 12-ஆம் வகுப்பு வரை அரசுப் பள்ளி பயின்ற சான்றிதழ், கல்லூரி சேர்க்கை ரசீது, ஆதார் அட்டை.",
            "https://penkalvi.tn.gov.in"
        ));
        list.add(new WelfareScheme(
            "பிரதம மந்திரி ஆவாஸ் யோஜனா - கிராமீன் (இலவச வீடு கட்டும் திட்டம்)",
            "PMAY Gramin Housing Scheme",
            "ஊரக வளர்ச்சி மற்றும் ஊராட்சித் துறை",
            "வீட்டு வசதி",
            "கிராமப்புறங்களில் வசதியற்ற ஏழை குடும்பங்களுக்கு காங்கிரீட் வீடு கட்ட ₹2.10 லட்சம் மானியம் வழங்கும் திட்டம்.",
            "வீடு கட்ட ₹2,10,000 வரை அரசு மானியம் + மகாத்மா காந்தி தேசிய ஊரக வேலைவாய்ப்பு கூலி உதவி.",
            18, 75, 180000.0, "ALL", "ALL",
            "நிலப் பட்டா நகல், குடும்ப அட்டை, ஆதார் அட்டை, வறுமைக் கோட்டிற்கு கீழ் (BPL) சான்றிதழ்.",
            "https://pmayg.nic.in"
        ));
        return list;
    }

    @GetMapping
    public ResponseEntity<List<WelfareScheme>> getAllSchemes() {
        List<WelfareScheme> schemes = welfareSchemeRepository.findAll();
        if (schemes.isEmpty()) {
            return ResponseEntity.ok(getSampleSchemes());
        }
        return ResponseEntity.ok(schemes);
    }

    @PostMapping
    public ResponseEntity<WelfareScheme> createScheme(@RequestBody WelfareScheme scheme) {
        WelfareScheme saved = welfareSchemeRepository.save(scheme);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WelfareScheme> updateScheme(@PathVariable Long id, @RequestBody WelfareScheme updated) {
        return welfareSchemeRepository.findById(id)
            .map(existing -> {
                if (updated.getTitleTa() != null) existing.setTitleTa(updated.getTitleTa());
                if (updated.getTitleEn() != null) existing.setTitleEn(updated.getTitleEn());
                if (updated.getDepartmentNameTa() != null) existing.setDepartmentNameTa(updated.getDepartmentNameTa());
                if (updated.getCategoryTa() != null) existing.setCategoryTa(updated.getCategoryTa());
                if (updated.getDescriptionTa() != null) existing.setDescriptionTa(updated.getDescriptionTa());
                if (updated.getBenefitsTa() != null) existing.setBenefitsTa(updated.getBenefitsTa());
                if (updated.getMinAge() != null) existing.setMinAge(updated.getMinAge());
                if (updated.getMaxAge() != null) existing.setMaxAge(updated.getMaxAge());
                if (updated.getMaxAnnualIncome() != null) existing.setMaxAnnualIncome(updated.getMaxAnnualIncome());
                if (updated.getEligibleGender() != null) existing.setEligibleGender(updated.getEligibleGender());
                if (updated.getEligibleOccupation() != null) existing.setEligibleOccupation(updated.getEligibleOccupation());
                if (updated.getRequiredDocumentsTa() != null) existing.setRequiredDocumentsTa(updated.getRequiredDocumentsTa());
                if (updated.getOfficialPortalUrl() != null) existing.setOfficialPortalUrl(updated.getOfficialPortalUrl());
                WelfareScheme saved = welfareSchemeRepository.save(existing);
                return ResponseEntity.ok(saved);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheme(@PathVariable Long id) {
        if (welfareSchemeRepository.existsById(id)) {
            welfareSchemeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


    public static class EligibilityCheckRequest {
        public Integer age;
        public Double annualIncome;
        public String gender;
        public String occupation;
    }

    @PostMapping("/check-eligibility")
    public ResponseEntity<List<Map<String, Object>>> checkEligibility(@RequestBody EligibilityCheckRequest req) {
        List<WelfareScheme> allSchemes = welfareSchemeRepository.findAll();
        if (allSchemes.isEmpty()) {
            allSchemes = getSampleSchemes();
        }

        List<Map<String, Object>> results = new ArrayList<>();
        int userAge = req.age != null ? req.age : 30;
        double userIncome = req.annualIncome != null ? req.annualIncome : 100000.0;
        String userGender = req.gender != null ? req.gender.toUpperCase() : "ALL";
        String userOccupation = req.occupation != null ? req.occupation.toUpperCase() : "ALL";

        for (WelfareScheme scheme : allSchemes) {
            int score = 0;
            int total = 4;
            List<String> matchReasons = new ArrayList<>();
            List<String> gaps = new ArrayList<>();

            // 1. Age check
            if (userAge >= scheme.getMinAge() && userAge <= scheme.getMaxAge()) {
                score++;
                matchReasons.add("வயது தகுதி பொருந்தது (" + scheme.getMinAge() + " - " + scheme.getMaxAge() + ")");
            } else {
                gaps.add("வயது வரம்பு: " + scheme.getMinAge() + " முதல் " + scheme.getMaxAge() + " வரை");
            }

            // 2. Income check
            if (userIncome <= scheme.getMaxAnnualIncome()) {
                score++;
                matchReasons.add("வருமான வரம்பிற்குள் உள்ளது (₹" + String.format("%.0f", scheme.getMaxAnnualIncome()) + " வரை)");
            } else {
                gaps.add("அதிகபட்ச வருமானம்: ₹" + String.format("%.0f", scheme.getMaxAnnualIncome()));
            }

            // 3. Gender check
            if ("ALL".equalsIgnoreCase(scheme.getEligibleGender()) || userGender.equalsIgnoreCase(scheme.getEligibleGender())) {
                score++;
                matchReasons.add("பாலின தகுதி பொருந்தது");
            } else {
                gaps.add("பாலின தகுதி: " + ("FEMALE".equals(scheme.getEligibleGender()) ? "பெண்கள் மட்டும்" : "ஆண்கள் மட்டும்"));
            }

            // 4. Occupation check
            if ("ALL".equalsIgnoreCase(scheme.getEligibleOccupation()) || userOccupation.equalsIgnoreCase(scheme.getEligibleOccupation())) {
                score++;
                matchReasons.add("தொழில்/பிரிவு தகுதி பொருந்தது");
            } else {
                gaps.add("குறிப்பிட்ட பிரிவு: " + scheme.getEligibleOccupation());
            }

            int matchPercentage = (int) Math.round(((double) score / total) * 100);

            Map<String, Object> res = new HashMap<>();
            res.put("scheme", scheme);
            res.put("matchPercentage", matchPercentage);
            res.put("isEligible", matchPercentage >= 75);
            res.put("matchReasons", matchReasons);
            res.put("gaps", gaps);
            results.add(res);
        }

        results.sort((a, b) -> Integer.compare((Integer) b.get("matchPercentage"), (Integer) a.get("matchPercentage")));
        return ResponseEntity.ok(results);
    }
}
