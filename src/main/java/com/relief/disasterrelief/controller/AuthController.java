package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.dto.UserRegistrationDto;
import com.relief.disasterrelief.security.JwtUtil;

import com.relief.disasterrelief.model.User;
import com.relief.disasterrelief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public record LoginRequest(String email, String password) {}

    public record LoginResponse(String token, Long userId, String role) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userRepository.findByEmail(loginRequest.email())
                    .orElse(null);
            if (user == null || user.getPassword() == null) {
                return ResponseEntity.status(401).body("Invalid email or password");
            }
            boolean passwordMatch = BCrypt.checkpw(loginRequest.password(), user.getPassword());
            if (!passwordMatch) {
                return ResponseEntity.status(401).body("Invalid email or password");
            }
            if (user.getRole() == null || user.getRole().isEmpty()) {
                return ResponseEntity.status(401).body("User role invalid");
            }
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new LoginResponse(token, user.getId(), user.getRole()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error");
        }
    }
}
