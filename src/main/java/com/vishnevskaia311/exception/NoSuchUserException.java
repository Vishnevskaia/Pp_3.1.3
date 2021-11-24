package com.vishnevskaia311.exception;

public class NoSuchUserException extends RuntimeException{

    public NoSuchUserException(String message) {
        super(message);
    }
}
