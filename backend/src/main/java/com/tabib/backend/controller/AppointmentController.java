package com.tabib.backend.controller;

import com.tabib.backend.entity.Appointment;
import com.tabib.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // 1. GET ALL
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // 2. GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            return ResponseEntity.ok(appointment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. CREATE
    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        // Set default status if missing
        if (appointment.getStatus() == null) {
            appointment.setStatus("Scheduled");
        }
        return appointmentRepository.save(appointment);
    }

    // 4. UPDATE (e.g., Change Status or Reschedule)
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment details) {
        Optional<Appointment> optional = appointmentRepository.findById(id);

        if (optional.isPresent()) {
            Appointment existing = optional.get();
            existing.setAppointmentDate(details.getAppointmentDate());
            existing.setAppointmentTime(details.getAppointmentTime());
            existing.setStatus(details.getStatus());
            existing.setNotes(details.getNotes());
            
            // Note: We usually don't change the patient or doctor ID in an update
            
            return ResponseEntity.ok(appointmentRepository.save(existing));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return ResponseEntity.ok("Appointment deleted");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}