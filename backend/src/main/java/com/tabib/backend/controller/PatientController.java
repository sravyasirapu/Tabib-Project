package com.tabib.backend.controller;

import com.tabib.backend.entity.Patient;
import com.tabib.backend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    // 1. GET ALL PATIENTS
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // 2. GET PATIENT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        if (patient.isPresent()) {
            return ResponseEntity.ok(patient.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. CREATE PATIENT
    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    // 4. UPDATE PATIENT (FIXED: Added setPhoto)
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient details) {
        Optional<Patient> optional = patientRepository.findById(id);

        if (optional.isPresent()) {
            Patient existing = optional.get();
            
            existing.setFullName(details.getFullName());
            existing.setPhone(details.getPhone());
            existing.setEmail(details.getEmail());
            existing.setGender(details.getGender());
            existing.setDob(details.getDob());
            existing.setAddress(details.getAddress());
            existing.setCity(details.getCity());
            
            // --- THIS LINE WAS MISSING! ---
            existing.setPhoto(details.getPhoto()); 
            // ------------------------------

            return ResponseEntity.ok(patientRepository.save(existing));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. DELETE PATIENT
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return ResponseEntity.ok("Patient deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}