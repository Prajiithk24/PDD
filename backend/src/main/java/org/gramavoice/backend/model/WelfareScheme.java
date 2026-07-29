package org.gramavoice.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.LocalDateTime;

@Entity
public class WelfareScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titleTa;
    private String titleEn;
    private String departmentNameTa;
    private String categoryTa;

    @Column(columnDefinition = "TEXT")
    private String descriptionTa;

    @Column(columnDefinition = "TEXT")
    private String benefitsTa;

    private Integer minAge;
    private Integer maxAge;
    private Double maxAnnualIncome;
    private String eligibleGender; // ALL, FEMALE, MALE
    private String eligibleOccupation; // ALL, FARMER, STUDENT, SENIOR, WOMEN_ENTREPRENEUR, WORKER

    @Column(columnDefinition = "TEXT")
    private String requiredDocumentsTa;

    private String officialPortalUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public WelfareScheme() {}

    public WelfareScheme(String titleTa, String titleEn, String departmentNameTa, String categoryTa, String descriptionTa, String benefitsTa, Integer minAge, Integer maxAge, Double maxAnnualIncome, String eligibleGender, String eligibleOccupation, String requiredDocumentsTa, String officialPortalUrl) {
        this.titleTa = titleTa;
        this.titleEn = titleEn;
        this.departmentNameTa = departmentNameTa;
        this.categoryTa = categoryTa;
        this.descriptionTa = descriptionTa;
        this.benefitsTa = benefitsTa;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.maxAnnualIncome = maxAnnualIncome;
        this.eligibleGender = eligibleGender;
        this.eligibleOccupation = eligibleOccupation;
        this.requiredDocumentsTa = requiredDocumentsTa;
        this.officialPortalUrl = officialPortalUrl;
    }

    public Long getId() {
        return id;
    }

    public String getTitleTa() {
        return titleTa;
    }

    public void setTitleTa(String titleTa) {
        this.titleTa = titleTa;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public String getDepartmentNameTa() {
        return departmentNameTa;
    }

    public void setDepartmentNameTa(String departmentNameTa) {
        this.departmentNameTa = departmentNameTa;
    }

    public String getCategoryTa() {
        return categoryTa;
    }

    public void setCategoryTa(String categoryTa) {
        this.categoryTa = categoryTa;
    }

    public String getDescriptionTa() {
        return descriptionTa;
    }

    public void setDescriptionTa(String descriptionTa) {
        this.descriptionTa = descriptionTa;
    }

    public String getBenefitsTa() {
        return benefitsTa;
    }

    public void setBenefitsTa(String benefitsTa) {
        this.benefitsTa = benefitsTa;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
    }

    public Double getMaxAnnualIncome() {
        return maxAnnualIncome;
    }

    public void setMaxAnnualIncome(Double maxAnnualIncome) {
        this.maxAnnualIncome = maxAnnualIncome;
    }

    public String getEligibleGender() {
        return eligibleGender;
    }

    public void setEligibleGender(String eligibleGender) {
        this.eligibleGender = eligibleGender;
    }

    public String getEligibleOccupation() {
        return eligibleOccupation;
    }

    public void setEligibleOccupation(String eligibleOccupation) {
        this.eligibleOccupation = eligibleOccupation;
    }

    public String getRequiredDocumentsTa() {
        return requiredDocumentsTa;
    }

    public void setRequiredDocumentsTa(String requiredDocumentsTa) {
        this.requiredDocumentsTa = requiredDocumentsTa;
    }

    public String getOfficialPortalUrl() {
        return officialPortalUrl;
    }

    public void setOfficialPortalUrl(String officialPortalUrl) {
        this.officialPortalUrl = officialPortalUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
