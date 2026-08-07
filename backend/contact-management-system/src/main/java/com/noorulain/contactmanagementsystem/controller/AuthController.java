package com.noorulain.contactmanagementsystem.controller;

import com.noorulain.contactmanagementsystem.dto.ApiResponse;
import com.noorulain.contactmanagementsystem.dto.LoginRequest;
import com.noorulain.contactmanagementsystem.dto.LoginResponse;
import com.noorulain.contactmanagementsystem.dto.RegisterRequest;
import com.noorulain.contactmanagementsystem.entity.User;
import com.noorulain.contactmanagementsystem.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        User user =
                authService.register(request);

        Map<String, Object> userData =
                new HashMap<>();

        userData.put(
                "userId",
                user.getId()
        );

        userData.put(
                "firstName",
                user.getFirstName()
        );

        userData.put(
                "lastName",
                user.getLastName()
        );

        userData.put(
                "email",
                user.getEmail()
        );

        userData.put(
                "phone",
                user.getPhone()
        );

        ApiResponse<Map<String, Object>> response =
                new ApiResponse<>(
                        true,
                        "User registered successfully",
                        userData
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {

        LoginResponse loginResponse =
                authService.login(request);

        ApiResponse<LoginResponse> response =
                new ApiResponse<>(
                        true,
                        "Login successful",
                        loginResponse
                );

        return ResponseEntity.ok(response);
    }
}