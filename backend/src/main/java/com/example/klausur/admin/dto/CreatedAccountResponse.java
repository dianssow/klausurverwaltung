package com.example.klausur.admin.dto;

public record CreatedAccountResponse(Long id, String email, String firstName,
                                     String lastName, String temporaryPassword) {}