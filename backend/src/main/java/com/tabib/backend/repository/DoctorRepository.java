package com.tabib.backend.repository;

import com.tabib.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    // You can add custom queries here later if needed, e.g.:
    // List<Doctor> findBySpecialization(String specialization);
}