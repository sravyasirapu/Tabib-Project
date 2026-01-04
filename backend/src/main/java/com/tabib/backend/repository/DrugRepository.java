package com.tabib.backend.repository;

import com.tabib.backend.entity.Drug;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrugRepository extends JpaRepository<Drug, Long> {
    // You can add a search method later if needed:
    // List<Drug> findByDrugNameContaining(String name);
}
