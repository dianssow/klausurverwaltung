package com.example.klausur.registration.dto;

import java.time.LocalDateTime;

import com.example.klausur.registration.RegistrationStatus;

public record RegistrationResponse(Long id, Long examId, String modulecode,String moduleName, String term,LocalDateTime examDate, RegistrationStatus status, LocalDateTime registeredAt, LocalDateTime deregisteredAt, Integer credits) {

}
