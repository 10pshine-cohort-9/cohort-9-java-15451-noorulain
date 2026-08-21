package com.noorulain.contactmanagementsystem.service;

import com.noorulain.contactmanagementsystem.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ContactService {

    Contact createContact(Contact contact, String username);

  Page<Contact> getAllContacts(String username, Pageable pageable);
    // ADD THIS METHOD
    List<Contact> searchContacts(String keyword, String username);

    Contact getContactById(Long id, String username);

    Contact updateContact(
            Long id,
            Contact contact,
            String username
    );

    void deleteContact(Long id, String username);
}