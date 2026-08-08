package com.noorulain.contactmanagementsystem.service;

import com.noorulain.contactmanagementsystem.entity.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    User updateUser(Long id, User user);

    void deleteUser(Long id);
}