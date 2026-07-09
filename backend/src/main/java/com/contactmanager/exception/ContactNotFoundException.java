package com.contactmanager.exception;

/**
 * Exception thrown when a requested contact is not found.
 *
 * HTTP Status: 404 Not Found
 */
public class ContactNotFoundException extends RuntimeException {

    public ContactNotFoundException(String message) {
        super(message);
    }

    public ContactNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
