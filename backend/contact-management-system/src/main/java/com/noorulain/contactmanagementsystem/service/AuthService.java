package com.noorulain.contactmanagementsystem.service;

import com.noorulain.contactmanagementsystem.dto.RegisterRequest;
import com.noorulain.contactmanagementsystem.entity.User;
import com.noorulain.contactmanagementsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(RegisterRequest request) {

        log.info("Registration attempt for email: {} and phone: {}",
                request.getEmail(), request.getPhone());

        if (request.getEmail() == null &&
                (request.getPhone() == null || request.getPhone().isBlank())) {

            throw new IllegalArgumentException(
                    "Either email or phone number is required"
            );
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {

            String email = request.getEmail().trim().toLowerCase();

            if (userRepository.existsByEmail(email)) {
                log.warn("Registration failed. Email already exists: {}", email);
                throw new IllegalArgumentException(
                        "An account with this email already exists"
                );
            }

            request.setEmail(email);
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()) {

            String phone = request.getPhone().trim();

            if (userRepository.existsByPhone(phone)) {
                log.warn("Registration failed. Phone already exists: {}", phone);
                throw new IllegalArgumentException(
                        "An account with this phone number already exists"
                );
            }

            request.setPhone(phone);
        }

     User user = new User();

user.setFirstName(request.getFirstName());
user.setLastName(request.getLastName());
user.setEmail(request.getEmail());
user.setPhone(request.getPhone());
user.setPassword(passwordEncoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);

        log.info("User registered successfully with ID: {}", savedUser.getId());

        return savedUser;
    }
}