package com.example.klausur.registration;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.klausur.common.BusinessRuleException;

import com.example.klausur.exam.ExamEntity;
import com.example.klausur.exam.ExamRepository;
import com.example.klausur.exam.ExamStatus;
import com.example.klausur.exam.dto.ExamResponse;
import com.example.klausur.grade.GradeRepository;
import com.example.klausur.registration.dto.RegisterRequest;
import com.example.klausur.registration.dto.RegistrationResponse;
import com.example.klausur.student.StudentEntity;
import com.example.klausur.student.StudentRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class StudentRegistrationService {
	private final StudentRepository studentRepository;
	private final ExamRepository examRepository;
	private final GradeRepository gradeRepository;
	private final ExamRegistrationRepository examRegistrationRepository; 
	
	
	@Transactional
	public RegistrationResponse  registerStudent(RegisterRequest r, String email) {
	
		StudentEntity student  = getStudentByEmail(email);
		
		ExamEntity exam = examRepository.findById(r.examId())
				.orElseThrow(() -> new BusinessRuleException("Exam not exist"));
		if(exam.getStatus() != ExamStatus.OPEN) throw new BusinessRuleException("Exam is not open for registration");
		
		if(LocalDateTime.now().isAfter(exam.getRegistrationDeadline())) throw new BusinessRuleException("The registration deadline has been reached "); 
		
		
		if(!exam.getModule().getDepartment().getId().equals(student.getDepartment().getId())) throw new BusinessRuleException("You're in a Wrong Department");
		if(!exam.getModule().isActive()) throw new BusinessRuleException("This module is not active");
		
		boolean hasPassed =  gradeRepository.existsByRegistrationStudentIdAndRegistrationExamModuleIdAndGradeValueLessThanEqual(student.getId(), exam.getModule().getId(), new BigDecimal("4.0"));
		if(hasPassed) throw new BusinessRuleException("Your are already passed this module"); 
		
		long registrationCount = examRegistrationRepository.countByExamIdAndStatus(exam.getId(), RegistrationStatus.ANGEMELDET);
		
		if(registrationCount >= exam.getMaxParticipants()) throw new BusinessRuleException("The total number of particpants is reached");
		
		Optional<ExamRegistrationEntity> existing = examRegistrationRepository.findByStudentIdAndExamId(student.getId(), exam.getId());
		
		ExamRegistrationEntity registration;
		if(existing.isPresent() ) {
			registration = existing.get();
			if(registration.getStatus() ==  RegistrationStatus.ANGEMELDET) {
			throw new BusinessRuleException("You are already enrolled");
		}
			registration.setStatus(RegistrationStatus.ANGEMELDET);
			registration.setStudent(student);
			registration.setRegisteredAt(LocalDateTime.now());
			registration.setDeregisteredAt(null);
		} else {
			
			 registration = new ExamRegistrationEntity();
	          registration.setStudent(student);
	          registration.setExam(exam);
	          registration.setStatus(RegistrationStatus.ANGEMELDET);
	          registration.setRegisteredAt(LocalDateTime.now());
		}
		
		
		
          
          
          ExamRegistrationEntity saved = examRegistrationRepository.save(registration); 
     
		return  toRegistrationResponse(saved); 
				
	 
	}
	
	@Transactional(readOnly = true)
	public List<ExamResponse> getAvailableExams(String email){
		StudentEntity student = getStudentByEmail(email);
		List<ExamEntity> result = examRepository.findByModuleDepartmentIdAndStatus(student.getDepartment().getId(), ExamStatus.OPEN);
		return result.stream()
				.filter(exam -> exam.getModule().isActive())
				.filter(exam -> LocalDateTime.now().isBefore(exam.getRegistrationDeadline()))
				.map(this::toExamResponse)
				.toList();
				}
	
	@Transactional(readOnly = true)
	public List<RegistrationResponse> getMyRegistrations(String email){
		StudentEntity student = getStudentByEmail(email);
		
		return examRegistrationRepository.findByStudentId(student.getId())
				.stream()
				.map(this::toRegistrationResponse)
				.toList();  
	}
	
	
	
	@Transactional
	public void deregisterStudent(Long registrationId,String email) {
		StudentEntity student = getStudentByEmail(email);
		
		ExamRegistrationEntity registration = examRegistrationRepository.findById(registrationId) 
				.orElseThrow(() -> new BusinessRuleException("Registration not  found"));
		
		if(!registration.getStudent().getId().equals(student.getId())) throw new BusinessRuleException("Access denied: Deregistration doesnt allowed for you");
		if(registration.getStatus() == RegistrationStatus.ABGEMELDET) {
			throw new BusinessRuleException("Your are already deregired");
		}
		if(LocalDateTime.now().isAfter(registration.getExam().getDeregistrationDeadline())) {
			throw new BusinessRuleException("The deregisteration deadline has passed");
		}
		
		registration.setStatus(RegistrationStatus.ABGEMELDET);
		registration.setDeregisteredAt(LocalDateTime.now());
		examRegistrationRepository.save(registration);
		
	}
	
	private RegistrationResponse toRegistrationResponse(ExamRegistrationEntity entity) {
		return new RegistrationResponse(
				entity.getId(),
				entity.getExam().getId(),
				entity.getExam().getModule().getCode(),
				entity.getExam().getModule().getName(),
				entity.getExam().getTerm(),
				entity.getExam().getExamDate(),
				entity.getStatus(),
				entity.getRegisteredAt(),
				entity.getDeregisteredAt(),
				entity.getExam().getModule().getCredits()
		);
	}
	
	private StudentEntity getStudentByEmail(String email) {
		return studentRepository.findByUserEmail(email)
				.orElseThrow(() -> new BusinessRuleException("The student with " + email + "doesnt exist"));
	}
	
	private ExamResponse toExamResponse(ExamEntity entity) {
		long registeredCount = examRegistrationRepository.countByExamIdAndStatus(entity.getId(), RegistrationStatus.ANGEMELDET);
		
		return new ExamResponse(
				entity.getId(),
				entity.getModule().getId(),
				entity.getModule().getCode(),
				entity.getModule().getName(),
				entity.getTerm(),
				entity.getExamDate(),
				entity.getExamRoom(),
				entity.getRegistrationDeadline(),
				entity.getDeregistrationDeadline(),
				entity.getMaxParticipants(),
				entity.getStatus(),
				registeredCount 
				);
				
	}
	
	
	

}
