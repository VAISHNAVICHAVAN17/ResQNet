package com.relief.disasterrelief.repository;

import com.relief.disasterrelief.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);   // For AuthController and CustomUserDetailsService
    List<User> findByRole(String role);         // For UserController and NgoController
    boolean existsByAadharNumber(String aadharNumber);
}
