package com.example.klausur.exam.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateExamRequest(
			
		@NotNull Long moduleId, @NotBlank String term, @NotNull LocalDateTime examDate,
		String examRoom, @NotNull LocalDateTime registrationDeadline,
		@NotNull LocalDateTime deregistrationDeadline, @Min(1) Integer maxParticipants 
		
		) {

}
