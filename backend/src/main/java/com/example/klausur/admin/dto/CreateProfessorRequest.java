package com.example.klausur.admin.dto;

import jakarta.validation.constraints.*;

public record CreateProfessorRequest(
        @Email @NotBlank String email,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String code,
        @NotNull Long departmentId) {}