package com.noorulain.contactmanagementsystem.dto;

import com.noorulain.contactmanagementsystem.entity.Contact;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ContactResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String company;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ContactResponse fromEntity(Contact contact) {

        ContactResponse response = new ContactResponse();

        response.setId(contact.getId());
        response.setFirstName(contact.getFirstName());
        response.setLastName(contact.getLastName());
        response.setPhone(contact.getPhone());
        response.setEmail(contact.getEmail());
        response.setCompany(contact.getCompany());
        response.setAddress(contact.getAddress());
        response.setCreatedAt(contact.getCreatedAt());
        response.setUpdatedAt(contact.getUpdatedAt());

        return response;
    }
}