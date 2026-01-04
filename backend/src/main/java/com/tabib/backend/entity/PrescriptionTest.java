package com.tabib.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "prescription_tests")
public class PrescriptionTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to the Prescription
    @ManyToOne
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    // Link to the Test (Entity)
    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;

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

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }
}