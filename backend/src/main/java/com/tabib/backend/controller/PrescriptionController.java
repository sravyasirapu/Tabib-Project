package com.tabib.backend.controller;

import com.tabib.backend.entity.Prescription;
import com.tabib.backend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    // 1. GET ALL
    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    // 2. GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        Optional<Prescription> prescription = prescriptionRepository.findById(id);
        if (prescription.isPresent()) {
            return ResponseEntity.ok(prescription.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. GET HISTORY BY PATIENT ID
    @GetMapping("/patient/{patientId}")
    public List<Prescription> getByPatientId(@PathVariable Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    // 4. CREATE
    @PostMapping
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    // 5. UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id, @RequestBody Prescription details) {
        Optional<Prescription> optional = prescriptionRepository.findById(id);

        if (optional.isPresent()) {
            Prescription existing = optional.get();
            existing.setDiagnosis(details.getDiagnosis());
            existing.setNextVisit(details.getNextVisit());
            // Usually we don't change doctor/patient/appointment ID, but you can if needed
            
            return ResponseEntity.ok(prescriptionRepository.save(existing));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 6. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrescription(@PathVariable Long id) {
        if (prescriptionRepository.existsById(id)) {
            prescriptionRepository.deleteById(id);
            return ResponseEntity.ok("Prescription deleted");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}