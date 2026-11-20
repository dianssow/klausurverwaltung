package com.example.klausur.registration.dto;

import jakarta.validation.constraints.NotNull;

public record RegisterRequest(@NotNull Long examId) {

}
