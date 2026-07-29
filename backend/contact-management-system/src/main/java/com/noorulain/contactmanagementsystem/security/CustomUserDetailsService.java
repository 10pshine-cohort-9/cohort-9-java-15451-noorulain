package com.noorulain.contactmanagementsystem.security;

import com.noorulain.contactmanagementsystem.entity.User;
import com.noorulain.contactmanagementsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user;

        // Login using email
        if (username != null && username.contains("@")) {

            user = userRepository.findByEmail(
                    username.trim().toLowerCase()
            ).orElseThrow(() ->
                    new UsernameNotFoundException(
                            "User not found with email: " + username
                    )
            );

        } else {

            // Login using phone
            user = userRepository.findByPhone(
                    username.trim()
            ).orElseThrow(() ->
                    new UsernameNotFoundException(
                            "User not found with phone: " + username
                    )
            );
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(
                        user.getEmail() != null
                                ? user.getEmail()
                                : user.getPhone()
                )
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }
}