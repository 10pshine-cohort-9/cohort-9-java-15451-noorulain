package com.noorulain.contactmanagementsystem.repository;

import com.noorulain.contactmanagementsystem.entity.Contact;
import com.noorulain.contactmanagementsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByUser(User user);

    Optional<Contact> findByIdAndUser(Long id, User user);

    boolean existsByPhoneAndUser(String phone, User user);

    List<Contact> findByUserAndFirstNameContainingIgnoreCaseOrUserAndLastNameContainingIgnoreCase(
            User user1,
            String firstName,
            User user2,
            String lastName
    );
}