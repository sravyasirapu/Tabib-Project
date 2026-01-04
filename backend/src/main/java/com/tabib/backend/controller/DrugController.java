package com.tabib.backend.controller;

import com.tabib.backend.entity.Drug;
import com.tabib.backend.repository.DrugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drugs")
@CrossOrigin(origins = "*")
public class DrugController {

    @Autowired
    private DrugRepository drugRepository;

    // 1. GET ALL DRUGS
    @GetMapping
    public List<Drug> getAllDrugs() {
        return drugRepository.findAll();
    }

    // 2. GET DRUG BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Drug> getDrugById(@PathVariable Long id) {
        Optional<Drug> drug = drugRepository.findById(id);
        if (drug.isPresent()) {
            return ResponseEntity.ok(drug.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. CREATE DRUG
    @PostMapping
    public Drug createDrug(@RequestBody Drug drug) {
        return drugRepository.save(drug);
    }

    // 4. UPDATE DRUG
    @PutMapping("/{id}")
    public ResponseEntity<Drug> updateDrug(@PathVariable Long id, @RequestBody Drug details) {
        Optional<Drug> optional = drugRepository.findById(id);

        if (optional.isPresent()) {
            Drug existing = optional.get();
            existing.setDrugName(details.getDrugName());
            existing.setCategory(details.getCategory());
            existing.setDescription(details.getDescription());

            return ResponseEntity.ok(drugRepository.save(existing));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. DELETE DRUG
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDrug(@PathVariable Long id) {
        if (drugRepository.existsById(id)) {
            drugRepository.deleteById(id);
            return ResponseEntity.ok("Drug deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}