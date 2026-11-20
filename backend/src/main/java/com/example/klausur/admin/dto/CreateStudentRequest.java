package com.example.klausur.admin.dto;

import jakarta.validation.constraints.*;

public record CreateStudentRequest(
        @Email @NotBlank String email,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String matrikelnummer,
        @NotNull Long departmentId,
        @NotBlank String studiengang,
        @Min(1) int currentSemester) {}