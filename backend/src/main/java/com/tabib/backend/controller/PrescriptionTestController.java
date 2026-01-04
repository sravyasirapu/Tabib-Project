package com.tabib.backend.controller;

import com.tabib.backend.entity.PrescriptionTest;
import com.tabib.backend.repository.PrescriptionTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescription_tests")
@CrossOrigin(origins = "*")
public class PrescriptionTestController {

    @Autowired
    private PrescriptionTestRepository ptRepository;

    // 1. GET ALL (Global List)
    @GetMapping
    public List<PrescriptionTest> getAllPrescriptionTests() {
        return ptRepository.findAll();
    }

    // 2. GET TESTS BY PRESCRIPTION ID (Show tests for one prescription)
    @GetMapping("/prescription/{prescriptionId}")
    public List<PrescriptionTest> getByPrescriptionId(@PathVariable Long prescriptionId) {
        return ptRepository.findByPrescriptionId(prescriptionId);
    }

    // 3. GET SINGLE ENTRY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionTest> getById(@PathVariable Long id) {
        Optional<PrescriptionTest> pt = ptRepository.findById(id);
        if (pt.isPresent()) {
            return ResponseEntity.ok(pt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 4. ADD TEST TO PRESCRIPTION
    @PostMapping
    public PrescriptionTest addTestToPrescription(@RequestBody PrescriptionTest prescriptionTest) {
        return ptRepository.save(prescriptionTest);
    }

    // 5. REMOVE TEST FROM PRESCRIPTION
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeTestFromPrescription(@PathVariable Long id) {
        if (ptRepository.existsById(id)) {
            ptRepository.deleteById(id);
            return ResponseEntity.ok("Test removed from prescription");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}