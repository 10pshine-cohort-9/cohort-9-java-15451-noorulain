package com.noorulain.contactmanagementsystem.controller;

import com.noorulain.contactmanagementsystem.entity.User;
import com.noorulain.contactmanagementsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            Authentication authentication
    ) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        String identifier = authentication.getName();

        User user;

        if (identifier.contains("@")) {
            user = userRepository.findByEmail(identifier.toLowerCase())
                    .orElseThrow(() ->
                            new RuntimeException("User not found")
                    );
        } else {
            user = userRepository.findByPhone(identifier)
                    .orElseThrow(() ->
                            new RuntimeException("User not found")
                    );
        }

        Map<String, Object> userData = new LinkedHashMap<>();

        userData.put("userId", user.getId());
        userData.put("firstName", user.getFirstName());
        userData.put("lastName", user.getLastName());
        userData.put("email", user.getEmail());
        userData.put("phone", user.getPhone());
        userData.put("createdAt", user.getCreatedAt());

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "User profile retrieved successfully"
        );
        response.put("data", userData);

        return ResponseEntity.ok(response);
    }
}