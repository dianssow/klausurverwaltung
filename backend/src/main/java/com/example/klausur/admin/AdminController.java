package com.example.klausur.admin;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.klausur.admin.dto.CreateDepartmentRequest;
import com.example.klausur.admin.dto.CreateProfessorRequest;
import com.example.klausur.admin.dto.CreateStudentRequest;
import com.example.klausur.admin.dto.CreatedAccountResponse;
import com.example.klausur.department.DepartmentEntity;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    public record DepartmentResponse(Long id, String code, String name, boolean active) {}

    @PostMapping("/departments")
    @ResponseStatus(HttpStatus.CREATED)
    public DepartmentResponse createDepartment(@Valid @RequestBody CreateDepartmentRequest r) {
        DepartmentEntity d = adminService.createDepartment(r);
        return new DepartmentResponse(d.getId(), d.getCode(), d.getName(), d.isActive());
    }

    @PostMapping("/students")
    @ResponseStatus(HttpStatus.CREATED)
    public CreatedAccountResponse createStudent(@Valid @RequestBody CreateStudentRequest r) {
        return adminService.createStudent(r);
    } 

    @PostMapping("/professors")
    @ResponseStatus(HttpStatus.CREATED)
    public CreatedAccountResponse createProfessor(@Valid @RequestBody CreateProfessorRequest r) {
        return adminService.createProfessor(r);
    }
}