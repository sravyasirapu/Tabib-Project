package com.tabib.backend.controller;

import com.tabib.backend.entity.DoctorAvailability;
import com.tabib.backend.repository.DoctorAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctor_availability")
@CrossOrigin(origins = "*")
public class DoctorAvailabilityController {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    // 1. GET ALL
    @GetMapping
    public List<DoctorAvailability> getAllAvailabilities() {
        return availabilityRepository.findAll();
    }

    // 2. GET SINGLE AVAILABILITY BY ID (This was missing!)
    @GetMapping("/{id}")
    public ResponseEntity<DoctorAvailability> getAvailabilityById(@PathVariable Long id) {
        Optional<DoctorAvailability> availability = availabilityRepository.findById(id);
        if (availability.isPresent()) {
            return ResponseEntity.ok(availability.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. GET BY DOCTOR ID (Find all schedules for a doctor)
    @GetMapping("/doctor/{doctorId}")
    public List<DoctorAvailability> getByDoctorId(@PathVariable Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId);
    }

    // 4. CREATE
    @PostMapping
    public DoctorAvailability createAvailability(@RequestBody DoctorAvailability availability) {
        return availabilityRepository.save(availability);
    }

    // 5. UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<DoctorAvailability> updateAvailability(@PathVariable Long id, @RequestBody DoctorAvailability details) {
        Optional<DoctorAvailability> optional = availabilityRepository.findById(id);

        if (optional.isPresent()) {
            DoctorAvailability existing = optional.get();
            existing.setDayOfWeek(details.getDayOfWeek());
            existing.setStartTime(details.getStartTime());
            existing.setEndTime(details.getEndTime());
            
            return ResponseEntity.ok(availabilityRepository.save(existing));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 6. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long id) {
        if (availabilityRepository.existsById(id)) {
            availabilityRepository.deleteById(id);
            return ResponseEntity.ok("Schedule deleted");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}