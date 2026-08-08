package com.noorulain.contactmanagementsystem.service;

import com.noorulain.contactmanagementsystem.entity.User;
import com.noorulain.contactmanagementsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));
    }

    @Override
    public User updateUser(Long id, User user) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        if (!existingUser.getEmail().equals(user.getEmail())
                && userRepository.existsByEmail(user.getEmail())) {

            throw new IllegalArgumentException(
                    "A user with this email already exists");
        }

        if (!existingUser.getPhone().equals(user.getPhone())
                && userRepository.existsByPhone(user.getPhone())) {

            throw new IllegalArgumentException(
                    "A user with this phone number already exists");
        }

        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());

        User updatedUser = userRepository.save(existingUser);

        log.info("User updated successfully with ID: {}", id);

        return updatedUser;
    }

    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        userRepository.delete(user);

        log.info("User deleted successfully with ID: {}", id);
    }
}