package com.tabib.backend.repository;

import com.tabib.backend.entity.PrescriptionTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionTestRepository extends JpaRepository<PrescriptionTest, Long> {
    // Find all tests ordered in a specific prescription
    List<PrescriptionTest> findByPrescriptionId(Long prescriptionId);
}