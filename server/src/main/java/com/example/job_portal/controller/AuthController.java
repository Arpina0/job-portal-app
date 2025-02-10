package com.example.job_portal.controller;

import com.example.job_portal.model.User;
import com.example.job_portal.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Registers a new user.
     * @param user User object with username and password.
     * @return Success message.
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        String response = authService.register(user);
        return ResponseEntity.ok(response);
    }

    /**
     * Authenticates a user and returns a JWT token.
     * @param loginRequest User credentials (username & password).
     * @return JWT token if authentication is successful.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        return authService.login(loginRequest)
                .map(token -> ResponseEntity.ok().body("{\"token\": \"" + token + "\"}"))
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid credentials"));
    }

    /**
     * Retrieves details of the currently logged-in user.
     * @param token Authorization token from request header.
     * @return User details (excluding password).
     */
    @GetMapping("/me")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String token) {
        return authService.getUserDetails(token);
    }
}
