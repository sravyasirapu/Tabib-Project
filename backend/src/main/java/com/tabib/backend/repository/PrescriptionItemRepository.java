package com.tabib.backend.repository;

import com.tabib.backend.entity.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {
    // Essential: Find all medicines for a specific prescription ID
    List<PrescriptionItem> findByPrescriptionId(Long prescriptionId);
}