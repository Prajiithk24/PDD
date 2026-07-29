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
public class PublicWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectTitleTa;
    
    @Column(columnDefinition = "TEXT")
    private String descriptionTa;

    private String categoryCode;
    private String departmentCode;
    private String departmentNameTa;
    private String village;
    private String district;
    private String locationArea;

    private Double allocatedBudgetLakhs;
    private Double spentBudgetLakhs;
    private Integer completionPercentage;

    private String status; // PROPOSED, IN_PROGRESS, COMPLETED
    private String startDate;
    private String expectedEndDate;
    private String contractorName;

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

    public PublicWork() {}

    public PublicWork(String projectTitleTa, String descriptionTa, String categoryCode, String departmentCode, String departmentNameTa, String village, String district, String locationArea, Double allocatedBudgetLakhs, Double spentBudgetLakhs, Integer completionPercentage, String status, String startDate, String expectedEndDate, String contractorName) {
        this.projectTitleTa = projectTitleTa;
        this.descriptionTa = descriptionTa;
        this.categoryCode = categoryCode;
        this.departmentCode = departmentCode;
        this.departmentNameTa = departmentNameTa;
        this.village = village;
        this.district = district;
        this.locationArea = locationArea;
        this.allocatedBudgetLakhs = allocatedBudgetLakhs;
        this.spentBudgetLakhs = spentBudgetLakhs;
        this.completionPercentage = completionPercentage;
        this.status = status;
        this.startDate = startDate;
        this.expectedEndDate = expectedEndDate;
        this.contractorName = contractorName;
    }

    public Long getId() {
        return id;
    }

    public String getProjectTitleTa() {
        return projectTitleTa;
    }

    public void setProjectTitleTa(String projectTitleTa) {
        this.projectTitleTa = projectTitleTa;
    }

    public String getDescriptionTa() {
        return descriptionTa;
    }

    public void setDescriptionTa(String descriptionTa) {
        this.descriptionTa = descriptionTa;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getDepartmentNameTa() {
        return departmentNameTa;
    }

    public void setDepartmentNameTa(String departmentNameTa) {
        this.departmentNameTa = departmentNameTa;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getLocationArea() {
        return locationArea;
    }

    public void setLocationArea(String locationArea) {
        this.locationArea = locationArea;
    }

    public Double getAllocatedBudgetLakhs() {
        return allocatedBudgetLakhs;
    }

    public void setAllocatedBudgetLakhs(Double allocatedBudgetLakhs) {
        this.allocatedBudgetLakhs = allocatedBudgetLakhs;
    }

    public Double getSpentBudgetLakhs() {
        return spentBudgetLakhs;
    }

    public void setSpentBudgetLakhs(Double spentBudgetLakhs) {
        this.spentBudgetLakhs = spentBudgetLakhs;
    }

    public Integer getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Integer completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getExpectedEndDate() {
        return expectedEndDate;
    }

    public void setExpectedEndDate(String expectedEndDate) {
        this.expectedEndDate = expectedEndDate;
    }

    public String getContractorName() {
        return contractorName;
    }

    public void setContractorName(String contractorName) {
        this.contractorName = contractorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
