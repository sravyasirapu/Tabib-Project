package com.tabib.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "prescription_items")
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to the main Prescription
    @ManyToOne
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    // Link to the Drug/Medicine
    @ManyToOne
    @JoinColumn(name = "drug_id")
    private Drug drug;

    private String dosage;      // e.g., 500mg
    private String frequency;   // e.g., Twice daily
    private String duration;    // e.g., 5 days
    
    @Column(columnDefinition = "TEXT")
    private String instructions; // e.g., After meals

    // --- MANUAL GETTERS AND SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Prescription getPrescription() {
        return prescription;
    }

    public void setPrescription(Prescription prescription) {
        this.prescription = prescription;
    }

    public Drug getDrug() {
        return drug;
    }

    public void setDrug(Drug drug) {
        this.drug = drug;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}