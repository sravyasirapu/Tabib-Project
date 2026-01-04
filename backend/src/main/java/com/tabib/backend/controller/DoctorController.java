package com.tabib.backend.controller;

import com.tabib.backend.entity.Doctor;
import com.tabib.backend.repository.DoctorRepository;
import com.tabib.backend.repository.UserRepository; // <--- ADDED THIS IMPORT
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository; // <--- ADDED THIS TO DELETE LOGIN INFO

    // 1. GET ALL DOCTORS
    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // 2. GET DOCTOR BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        if (doctor.isPresent()) {
            return ResponseEntity.ok(doctor.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. CREATE DOCTOR
    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // 4. UPDATE DOCTOR
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);

        if (optionalDoctor.isPresent()) {
            Doctor existingDoctor = optionalDoctor.get();

            // Update fields
            existingDoctor.setSpecialization(doctorDetails.getSpecialization());
            existingDoctor.setQualification(doctorDetails.getQualification());
            existingDoctor.setExperience(doctorDetails.getExperience());
            existingDoctor.setAbout(doctorDetails.getAbout());
            existingDoctor.setConsultationFee(doctorDetails.getConsultationFee());

            Doctor updatedDoctor = doctorRepository.save(existingDoctor);
            return ResponseEntity.ok(updatedDoctor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. DELETE DOCTOR (UPDATED SMART DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        Optional<Doctor> doctorOptional = doctorRepository.findById(id);

        if (doctorOptional.isPresent()) {
            Doctor doctor = doctorOptional.get();
            
            // 1. Get the User ID (Login Account) associated with this Doctor
            Long userId = doctor.getUser().getId(); 

            // 2. Delete the Doctor Profile 
            // (Database Cascade will handle appointments/schedules if you ran the SQL I gave)
            doctorRepository.deleteById(id);
            
            // 3. Delete the User Login Account
            userRepository.deleteById(userId);

            return ResponseEntity.ok("Doctor and User account deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}