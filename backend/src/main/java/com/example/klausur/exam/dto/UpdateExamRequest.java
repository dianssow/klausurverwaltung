package com.example.klausur.exam.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateExamRequest(
		
		@NotBlank String term, @NotNull LocalDateTime examDate,
		String examRoom, @NotNull LocalDateTime registrationDeadline,
		@NotNull LocalDateTime deregistrationDeadline, @Min(1) Integer maxParticipants 
		
		) {

}
