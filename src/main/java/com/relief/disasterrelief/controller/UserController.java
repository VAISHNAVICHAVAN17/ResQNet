package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.dto.UserRegistrationDto;
import com.relief.disasterrelief.model.User;
import com.relief.disasterrelief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @DeleteMapping("/{id}")

    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        logger.info("Delete request by user: {}, roles: {}", auth.getName(), auth.getAuthorities());

        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDto userDto) {
        logger.info("Registering user with Aadhaar: {}", userDto.getAadharNumber());

        if (userRepository.existsByAadharNumber(userDto.getAadharNumber())) {
            logger.warn("Aadhaar number {} already registered", userDto.getAadharNumber());
            return ResponseEntity.badRequest().body("Aadhaar number already registered");
        }

        User user = new User();
        user.setName(userDto.getName());
        user.setOrgName(userDto.getOrgName());
        user.setEmail(userDto.getEmail());
        user.setDob(userDto.getDob());
        user.setAddress(userDto.getAddress());
        user.setAadharNumber(userDto.getAadharNumber());
        user.setPanNumber(userDto.getPanNumber());
        user.setRole(userDto.getRole());
        user.setLatitude(userDto.getLatitude());
        user.setLongitude(userDto.getLongitude());

        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        User savedUser = userRepository.save(user);
        logger.info("User registered successfully with id: {}", savedUser.getId());

        return ResponseEntity.ok("User registered successfully");
    }
}
