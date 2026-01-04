package com.tabib.backend.repository;

import com.tabib.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // We add this so you can login or check for duplicates later
    Optional<User> findByEmail(String email);
}