package com.example.klausur.exam.dto;

import java.time.LocalDateTime;

import com.example.klausur.exam.ExamStatus;

public record ExamResponse(
		Long id, Long moduleId, String moduleCode, String moduleName,String term, 
		LocalDateTime examDate, String examRoom, LocalDateTime registrationDeadline, 
		LocalDateTime deregistrationDeadline,Integer maxParticipants, ExamStatus status, long registeredCount 
		) {

}
