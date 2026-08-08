package com.noorulain.contactmanagementsystem.service;

import com.noorulain.contactmanagementsystem.entity.Contact;

import java.util.List;

public interface ContactService {

    Contact createContact(Contact contact, String username);

    List<Contact> getAllContacts(String username);

    Contact getContactById(Long id, String username);

    Contact updateContact(
            Long id,
            Contact contact,
            String username
    );

    void deleteContact(Long id, String username);
}