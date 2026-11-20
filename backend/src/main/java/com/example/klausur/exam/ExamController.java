package com.example.klausur.exam;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.klausur.admin.dto.ModuleResponse;
import com.example.klausur.exam.dto.CreateExamRequest;
import com.example.klausur.exam.dto.ExamResponse;
import com.example.klausur.exam.dto.UpdateExamRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/professor")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping("/modules")
    public List<ModuleResponse> myModules(Authentication auth) {
        return examService.getModulesForProfessor(auth.getName());
    }

    @GetMapping("/exams")
    public List<ExamResponse> myExams(Authentication auth) {
        return examService.getExamsForProfessor(auth.getName());
    }

    @PostMapping("/exams")
    public ResponseEntity<ExamResponse> create(@Valid @RequestBody CreateExamRequest r,
                                               Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(examService.createExam(r, auth.getName()));
    }

    @PutMapping("/exams/{id}")
    public ExamResponse update(@PathVariable Long id,
                               @Valid @RequestBody UpdateExamRequest r,
                               Authentication auth) {
        return examService.updateExam(id, r, auth.getName());
    }

    @DeleteMapping("/exams/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id, Authentication auth) {
        examService.cancelExam(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}