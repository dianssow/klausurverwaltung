package com.example.klausur.auth;

public record LoginResponse(String token, String email, String role, boolean mustChangePassword) {}