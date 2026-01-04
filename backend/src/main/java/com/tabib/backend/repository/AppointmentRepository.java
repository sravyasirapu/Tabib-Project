package com.tabib.backend.repository;

import com.tabib.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Helper to find appointments by doctor
    List<Appointment> findByDoctorId(Long doctorId);
    
    // Helper to find appointments by patient
    List<Appointment> findByPatientId(Long patientId);
}