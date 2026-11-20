package com.example.klausur.registration;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.klausur.exam.dto.ExamResponse;
import com.example.klausur.registration.dto.RegisterRequest;
import com.example.klausur.registration.dto.RegistrationResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student")
public class StudentRegistrationController {
	
	private final StudentRegistrationService studentRegistrationService;

	@GetMapping("/exams/available")
	public ResponseEntity<List<ExamResponse>> getAvailableExams(Authentication auth) {
		List<ExamResponse> exams = studentRegistrationService.getAvailableExams(auth.getName());
		return ResponseEntity.ok(exams);
	} 

	@GetMapping("/registrations")
	public ResponseEntity<List<RegistrationResponse>> getMyRegistrations(Authentication auth) {
		List<RegistrationResponse> registrations = studentRegistrationService.getMyRegistrations(auth.getName());
		return ResponseEntity.ok(registrations);
	}

	@PostMapping("/registrations")
	public ResponseEntity<RegistrationResponse> register(
			@Valid @RequestBody RegisterRequest request, 
			Authentication auth) {
		
		RegistrationResponse response = studentRegistrationService.registerStudent(request, auth.getName());
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@DeleteMapping("/registrations/{id}")
	public ResponseEntity<Void> deregister(@PathVariable Long id, Authentication auth) {
		studentRegistrationService.deregisterStudent(id, auth.getName());
		return ResponseEntity.noContent().build();
	}
}