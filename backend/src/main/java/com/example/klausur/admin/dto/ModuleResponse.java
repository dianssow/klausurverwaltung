package com.example.klausur.admin.dto;

public record ModuleResponse(
		Long id, String code, String name, int credits,
		int recommendedSemester, int maxAttempts,
		boolean active,Long departmentId, String departmentName, 
		Long professorId,String professorFirstName, String professorLastName) {} 
 