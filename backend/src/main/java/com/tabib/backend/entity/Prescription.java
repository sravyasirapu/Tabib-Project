package com.tabib.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign Key to Appointments
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    // Foreign Key to Doctors
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    // Foreign Key to Patients
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "next_visit")
    private LocalDate nextVisit;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // --- MANUAL GETTERS AND SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public LocalDate getNextVisit() {
        return nextVisit;
    }

    public void setNextVisit(LocalDate nextVisit) {
        this.nextVisit = nextVisit;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}