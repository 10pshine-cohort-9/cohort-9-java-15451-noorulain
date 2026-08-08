package com.noorulain.contactmanagementsystem.controller;

import com.noorulain.contactmanagementsystem.dto.ContactRequest;
import com.noorulain.contactmanagementsystem.dto.ContactResponse;
import com.noorulain.contactmanagementsystem.entity.Contact;
import com.noorulain.contactmanagementsystem.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactResponse> createContact(
            @Valid @RequestBody ContactRequest request,
            Authentication authentication) {

        Contact contact = new Contact();

        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setPhone(request.getPhone());
        contact.setEmail(request.getEmail());
        contact.setCompany(request.getCompany());
        contact.setAddress(request.getAddress());

        Contact savedContact = contactService.createContact(
                contact,
                authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ContactResponse.fromEntity(savedContact));
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAllContacts(
            Authentication authentication) {

        List<ContactResponse> contacts =
                contactService.getAllContacts(authentication.getName())
                        .stream()
                        .map(ContactResponse::fromEntity)
                        .toList();

        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContactById(
            @PathVariable Long id,
            Authentication authentication) {

        Contact contact = contactService.getContactById(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok(
                ContactResponse.fromEntity(contact)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest request,
            Authentication authentication) {

        Contact contact = new Contact();

        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setPhone(request.getPhone());
        contact.setEmail(request.getEmail());
        contact.setCompany(request.getCompany());
        contact.setAddress(request.getAddress());

        Contact updatedContact = contactService.updateContact(
                id,
                contact,
                authentication.getName()
        );

        return ResponseEntity.ok(
                ContactResponse.fromEntity(updatedContact)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(
            @PathVariable Long id,
            Authentication authentication) {

        contactService.deleteContact(
                id,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}