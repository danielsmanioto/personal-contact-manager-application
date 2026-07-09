package com.contactmanager.exception;

/**
 * Exception thrown when trying to create/update contact with an email that already exists.
 *
 * HTTP Status: 409 Conflict
 */
public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String message) {
        super(message);
    }

    public EmailAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
