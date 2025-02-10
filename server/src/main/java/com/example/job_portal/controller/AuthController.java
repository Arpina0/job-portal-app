package com.example.job_portal.controller;

import com.example.job_portal.model.User;
import com.example.job_portal.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        String response = authService.register(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        return authService.login(loginRequest)
                .map(token -> ResponseEntity.ok().body("{\"token\": \"" + token + "\"}"))
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid credentials"));
    }
}