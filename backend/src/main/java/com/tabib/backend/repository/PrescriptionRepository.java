package com.tabib.backend.repository;

import com.tabib.backend.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    // Get all prescriptions for a specific patient (History)
    List<Prescription> findByPatientId(Long patientId);
    
    // Get all prescriptions written by a specific doctor
    List<Prescription> findByDoctorId(Long doctorId);
}