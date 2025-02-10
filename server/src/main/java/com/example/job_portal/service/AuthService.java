package com.example.job_portal.service;

import com.example.job_portal.model.User;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Registers a new user with an encrypted password.
     *
     * @param user User object with username and password.
     * @return Success message.
     */
    public String register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    /**
     * Authenticates a user and generates a JWT token upon successful login.
     *
     * @param loginRequest User credentials (username & password).
     * @return Optional JWT token if authentication is successful.
     */
    public Optional<String> login(User loginRequest) {
        System.out.println("Login attempt for username: " + loginRequest.getUsername()); // Debug log
        
        Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());
        
        if (!user.isPresent()) {
            System.out.println("User not found"); // Debug log
            return Optional.empty();
        }
        
        if (passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            String token = jwtUtil.generateToken(user.get().getUsername());
            System.out.println("Login successful, token generated"); // Debug log
            return Optional.of(token);
        }
        
        System.out.println("Password mismatch"); // Debug log
        return Optional.empty();
    }

    /**
     * Retrieves the currently logged-in user's details based on the JWT token.
     *
     * @param token Authorization token.
     * @return User details (excluding password) or error response.
     */
    public ResponseEntity<?> getUserDetails(String token) {
        // Extract username from the JWT token
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = userOpt.get();

        // Return user details excluding password
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("id", user.getId());
        userDetails.put("username", user.getUsername());
        userDetails.put("email", user.getEmail());
        userDetails.put("role", user.getRole().name());

        return ResponseEntity.ok(userDetails);
    }
}
