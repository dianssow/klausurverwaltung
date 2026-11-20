package com.example.klausur.admin.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateModuleRequest(
		
		@NotBlank String code,
		@NotBlank String name,
		@Min(1) int credits,
		@Min(1) int recommendedSemester,
		@Min(1) int maxAttempts,
		@NotNull Long departmentId,
		@NotNull Long professorId
		
		) {}
