package com.noorulain.contactmanagementsystem.service;

import com.noorulain.contactmanagementsystem.dto.LoginRequest;
import com.noorulain.contactmanagementsystem.dto.LoginResponse;
import com.noorulain.contactmanagementsystem.dto.RegisterRequest;
import com.noorulain.contactmanagementsystem.entity.User;
import com.noorulain.contactmanagementsystem.repository.UserRepository;
import com.noorulain.contactmanagementsystem.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log =
            LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public User register(RegisterRequest request) {

        log.info("Registration attempt received");

        // Convert blank email to null
        if (request.getEmail() != null &&
                request.getEmail().isBlank()) {

            request.setEmail(null);
        }

        // Convert blank phone to null
        if (request.getPhone() != null &&
                request.getPhone().isBlank()) {

            request.setPhone(null);
        }

        // At least email or phone must be provided
        if (request.getEmail() == null &&
                request.getPhone() == null) {

            throw new IllegalArgumentException(
                    "Either email or phone number is required"
            );
        }

        // Normalize and check email
        if (request.getEmail() != null) {

            String email =
                    request.getEmail()
                            .trim()
                            .toLowerCase();

            if (userRepository.existsByEmail(email)) {

                log.warn(
                        "Registration failed because email already exists"
                );

                throw new IllegalArgumentException(
                        "An account with this email already exists"
                );
            }

            request.setEmail(email);
        }

        // Normalize and check phone
        if (request.getPhone() != null) {

            String phone =
                    request.getPhone()
                            .trim();

            if (userRepository.existsByPhone(phone)) {

                log.warn(
                        "Registration failed because phone already exists"
                );

                throw new IllegalArgumentException(
                        "An account with this phone number already exists"
                );
            }

            request.setPhone(phone);
        }

        // Create new user
        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Encode password before saving
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        User savedUser =
                userRepository.save(user);

        log.info(
                "User registered successfully with ID: {}",
                savedUser.getId()
        );

        return savedUser;
    }

    public LoginResponse login(LoginRequest request) {

        String identifier =
                request.getIdentifier()
                        .trim();

        // Authenticate user
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                identifier,
                                request.getPassword()
                        )
                );

        User user;

        // Find user by email
        if (identifier.contains("@")) {

            user =
                    userRepository.findByEmail(
                            identifier.toLowerCase()
                    ).orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User not found"
                            )
                    );

        } else {

            // Find user by phone
            user =
                    userRepository.findByPhone(
                            identifier
                    ).orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User not found"
                            )
                    );
        }

        // Generate JWT token
        String token =
                jwtService.generateToken(
                        authentication.getName()
                );

        log.info(
                "User logged in successfully with ID: {}",
                user.getId()
        );

        return new LoginResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                token
        );
    }
}