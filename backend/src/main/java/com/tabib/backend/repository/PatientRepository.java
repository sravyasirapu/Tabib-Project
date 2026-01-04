package com.tabib.backend.repository;

import com.tabib.backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    // Helper to find patient by phone (useful for registration checks)
    Optional<Patient> findByPhone(String phone);
}