package com.noorulain.contactmanagementsystem.service;

import com.noorulain.contactmanagementsystem.entity.Contact;
import com.noorulain.contactmanagementsystem.entity.User;
import com.noorulain.contactmanagementsystem.exception.ResourceNotFoundException;
import com.noorulain.contactmanagementsystem.repository.ContactRepository;
import com.noorulain.contactmanagementsystem.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceImplTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ContactServiceImpl contactService;

    private User user;
    private Contact contact;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setFirstName("Noorulain");
        user.setLastName("Shah");
        user.setEmail("noorulain@example.com");
        user.setPhone("03001234567");

        contact = new Contact();
        contact.setId(1L);
        contact.setFirstName("Ali");
        contact.setLastName("Khan");
        contact.setPhone("03111234567");
        contact.setEmail("ali@example.com");
        contact.setCompany("ABC Company");
        contact.setAddress("Sukkur");
    }

    @Test
    void createContact_shouldCreateSuccessfully() {
        when(userRepository.findByEmail("noorulain@example.com"))
                .thenReturn(Optional.of(user));

        when(contactRepository.existsByPhoneAndUser(
                contact.getPhone(), user))
                .thenReturn(false);

        when(contactRepository.save(contact))
                .thenReturn(contact);

        Contact result = contactService.createContact(
                contact,
                "noorulain@example.com"
        );

        assertNotNull(result);
        assertEquals("Ali", result.getFirstName());
        assertEquals(user, result.getUser());

        verify(contactRepository).save(contact);
    }

    @Test
    void createContact_shouldRejectDuplicatePhone() {
        when(userRepository.findByEmail("noorulain@example.com"))
                .thenReturn(Optional.of(user));

        when(contactRepository.existsByPhoneAndUser(
                contact.getPhone(), user))
                .thenReturn(true);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> contactService.createContact(
                                contact,
                                "noorulain@example.com"
                        )
                );

        assertEquals(
                "A contact with this phone number already exists",
                exception.getMessage()
        );

        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void getAllContacts_shouldReturnContacts() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Contact> page =
                new PageImpl<>(List.of(contact));

        when(userRepository.findByEmail("noorulain@example.com"))
                .thenReturn(Optional.of(user));

        when(contactRepository.findByUser(user, pageable))
                .thenReturn(page);

        Page<Contact> result =
                contactService.getAllContacts(
                        "noorulain@example.com",
                        pageable
                );

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Ali",
                result.getContent().get(0).getFirstName());
    }

    @Test
    void searchContacts_shouldReturnMatchingContacts() {
        when(userRepository.findByEmail("noorulain@example.com"))
                .thenReturn(Optional.of(user));

        when(contactRepository
                .findByUserAndFirstNameContainingIgnoreCaseOrUserAndLastNameContainingIgnoreCase(
                        user,
                        "Ali",
                        user,
                        "Ali"
                ))
                .thenReturn(List.of(contact));

        List<Contact> result =
                contactService.searchContacts(
                        "Ali",
                        "noorulain@example.com"
                );

        assertEquals(1, result.size());
        assertEquals("Ali",
                result.get(0).getFirstName());
    }

    @Test
    void getContactById_shouldReturnContact() {
        when(userRepository.findByEmail("noorulain@example.com"))
                .thenReturn(Optional.of(user));

        when(contactRepository.findByIdAndUser(1L, user))
                .thenReturn(Optional.of(contact));

        Contact result =
                contactService.getContactById(
                        1L,
                        "noorulain@example.com"
                );

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Ali", result.getFirstName());
    }

    @Test
    void getContactById_shouldThrowExceptionWhenNotFound() {
        when(userRepository.findByEmail("noorulain@example.com"))
                .thenReturn(Optional.of(user));

        when(contactRepository.findByIdAndUser(99L, user))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> contactService.getContactById(
                        99L,
                        "noorulain@example.com"
                )
        );
    }

    @Test
    void updateContact_shouldUpdateSuccessfully() {
        Contact updatedData = new Contact();
        updatedData.setFirstName("Ahmed");
        updatedData.setLastName("Khan");
        updatedData.setPhone("03221234567");
        updatedData.setEmail("ahmed@example.com");
        updatedData.setCompany("XYZ Company");
        updatedData.setAddress("Karachi");

        when(userRepository.findByEmail("noorulain@example.com"))
                .thenReturn(Optional.of(user));

        when(contactRepository.findByIdAndUser(1L, user))
                .thenReturn(Optional.of(contact));

        when(contactRepository.existsByPhoneAndUser(
                updatedData.getPhone(), user))
                .thenReturn(false);

        when(contactRepository.save(contact))
                .thenReturn(contact);

        Contact result =
                contactService.updateContact(
                        1L,
                        updatedData,
                        "noorulain@example.com"
                );

        assertNotNull(result);
        assertEquals("Ahmed", result.getFirstName());
        assertEquals("03221234567", result.getPhone());

        verify(contactRepository).save(contact);
    }

    @Test
    void deleteContact_shouldDeleteSuccessfully() {
        when(userRepository.findByEmail("noorulain@example.com"))
                .thenReturn(Optional.of(user));

        when(contactRepository.findByIdAndUser(1L, user))
                .thenReturn(Optional.of(contact));

        contactService.deleteContact(
                1L,
                "noorulain@example.com"
        );

        verify(contactRepository).delete(contact);
    }
}