package com.tabib.backend.repository;

import com.tabib.backend.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    // Helper method to find all schedules for a specific doctor
    List<DoctorAvailability> findByDoctorId(Long doctorId);
}