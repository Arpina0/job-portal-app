package com.example.job_portal.controller;

import com.example.job_portal.model.User;
import com.example.job_portal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") // ✅ Allow cross-origin requests
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        System.out.println("Received request: " + user); // ✅ Debugging log

        // Validate request body
        if (user.getUsername() == null || user.getPassword() == null || user.getRole() == null) {
            return ResponseEntity.badRequest().body("Invalid input: missing fields.");
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }
}
