package com.noorulain.contactmanagementsystem.controller;

import com.noorulain.contactmanagementsystem.dto.ApiResponse;
import com.noorulain.contactmanagementsystem.entity.User;
import com.noorulain.contactmanagementsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Users retrieved successfully",
                        userService.getAllUsers()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User retrieved successfully",
                        userService.getUserById(id)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User updated successfully",
                        userService.updateUser(id, user)
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User deleted successfully",
                        null
                )
        );
    }
}