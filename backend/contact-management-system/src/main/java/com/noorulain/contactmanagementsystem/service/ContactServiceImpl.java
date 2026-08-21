package com.noorulain.contactmanagementsystem.service;

import com.noorulain.contactmanagementsystem.entity.Contact;
import com.noorulain.contactmanagementsystem.entity.User;
import com.noorulain.contactmanagementsystem.exception.ResourceNotFoundException;
import com.noorulain.contactmanagementsystem.repository.ContactRepository;
import com.noorulain.contactmanagementsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    private User getUser(String username) {

        if (username == null || username.trim().isEmpty()) {
            throw new ResourceNotFoundException(
                    "Authenticated user not found"
            );
        }

        String identifier = username.trim();

        if (identifier.contains("@")) {

            return userRepository.findByEmail(
                    identifier.toLowerCase()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found"
                    )
            );
        }

        return userRepository.findByPhone(identifier)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    @Override
    public Contact createContact(Contact contact, String username) {

        User user = getUser(username);

        if (contactRepository.existsByPhoneAndUser(
                contact.getPhone(), user)) {

            throw new IllegalArgumentException(
                    "A contact with this phone number already exists"
            );
        }

        contact.setUser(user);

        Contact savedContact = contactRepository.save(contact);

        log.info(
                "Contact created successfully with ID: {} for user ID: {}",
                savedContact.getId(),
                user.getId()
        );

        return savedContact;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Contact> getAllContacts(
            String username,
            Pageable pageable) {

        User user = getUser(username);

        return contactRepository.findByUser(user, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Contact> searchContacts(
            String keyword,
            String username) {

        User user = getUser(username);

        return contactRepository
                .findByUserAndFirstNameContainingIgnoreCaseOrUserAndLastNameContainingIgnoreCase(
                        user,
                        keyword,
                        user,
                        keyword
                );
    }

    @Override
    @Transactional(readOnly = true)
    public Contact getContactById(Long id, String username) {

        User user = getUser(username);

        return contactRepository.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact not found"
                        )
                );
    }

    @Override
    public Contact updateContact(
            Long id,
            Contact contact,
            String username) {

        User user = getUser(username);

        Contact existingContact =
                contactRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contact not found"
                                )
                        );

        if (!existingContact.getPhone()
                .equals(contact.getPhone())
                && contactRepository.existsByPhoneAndUser(
                        contact.getPhone(), user)) {

            throw new IllegalArgumentException(
                    "A contact with this phone number already exists"
            );
        }

        existingContact.setFirstName(contact.getFirstName());
        existingContact.setLastName(contact.getLastName());
        existingContact.setPhone(contact.getPhone());
        existingContact.setEmail(contact.getEmail());
        existingContact.setCompany(contact.getCompany());
        existingContact.setAddress(contact.getAddress());

        Contact updatedContact =
                contactRepository.save(existingContact);

        log.info(
                "Contact updated successfully with ID: {}",
                id
        );

        return updatedContact;
    }

    @Override
    public void deleteContact(Long id, String username) {

        User user = getUser(username);

        Contact contact =
                contactRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contact not found"
                                )
                        );

        contactRepository.delete(contact);

        log.info(
                "Contact deleted successfully with ID: {}",
                id
        );
    }
}