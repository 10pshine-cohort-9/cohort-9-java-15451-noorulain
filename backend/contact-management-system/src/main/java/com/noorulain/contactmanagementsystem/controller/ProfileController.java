package com.noorulain.contactmanagementsystem.controller;

import com.noorulain.contactmanagementsystem.dto.ApiResponse;
import com.noorulain.contactmanagementsystem.dto.ChangePasswordRequest;
import com.noorulain.contactmanagementsystem.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final ProfileService profileService;

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        profileService.changePassword(
                email,
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        ApiResponse<Void> response =
                new ApiResponse<>(
                        true,
                        "Password changed successfully",
                        null
                );

        return ResponseEntity.ok(response);
    }
}