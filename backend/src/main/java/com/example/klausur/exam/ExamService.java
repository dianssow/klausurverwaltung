package com.example.klausur.exam;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.klausur.admin.dto.ModuleResponse;
import com.example.klausur.common.BusinessRuleException;
import com.example.klausur.common.ForbiddenException;
import com.example.klausur.common.ResourceNotFoundException;
import com.example.klausur.exam.dto.CreateExamRequest;
import com.example.klausur.exam.dto.ExamResponse;
import com.example.klausur.exam.dto.UpdateExamRequest;
import com.example.klausur.module.ModuleEntity;
import com.example.klausur.module.ModuleRepository;
import com.example.klausur.professor.ProfessorEntity;
import com.example.klausur.professor.ProfessorRepository;
import com.example.klausur.registration.ExamRegistrationRepository;
import com.example.klausur.registration.RegistrationStatus;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ExamService {
	
	private final ProfessorRepository professorRepository;
	private final ModuleRepository moduleRepository;
	private final ExamRepository examRepository;
	private final ExamRegistrationRepository examRegistrationRepository;
	
	private ProfessorEntity getProfessorByEmail(String email) {
	    return professorRepository.findByUserEmail(email)
	            .orElseThrow(() -> new BusinessRuleException("Prof doesnt exist with email: " + email));
	}
	
	@Transactional(readOnly = true)
	public List<ModuleResponse> getModulesForProfessor(String email){
		ProfessorEntity professor = getProfessorByEmail(email);
		
		List<ModuleEntity> modules =  moduleRepository.findByProfessorId(professor.getId());
		
		return modules.stream().map(this::toModuleResponse) 
				.toList();
	}
	
	@Transactional(readOnly = true)
	public List<ExamResponse> getExamsForProfessor(String email){
		ProfessorEntity professor = getProfessorByEmail(email);
		
		List<ExamEntity> exams = examRepository.findByModuleProfessorId(professor.getId());
		
		return exams.stream()
				.map(this::toExamResponse)
				.toList(); 
	}
	
	@Transactional
	public  ExamResponse createExam(CreateExamRequest r, String professorEmail) {
		ProfessorEntity professor = professorRepository.findByUserEmail(professorEmail)
				.orElseThrow(() -> new BusinessRuleException("Prof does not exist"));
		
		ModuleEntity module = moduleRepository.findById(r.moduleId())
				.orElseThrow(()-> new BusinessRuleException("Module not found"));
		
		if (!module.getProfessor().getId().equals(professor.getId())) {
	        throw new BusinessRuleException("Your are not the prof in charge of the module  " + module.getCode());
	    }
		
		if (!module.isActive()) 
            throw new BusinessRuleException("The module is not activ");
		
		if (examRepository.existsByModuleIdAndTerm(module.getId(), r.term()))
            throw new BusinessRuleException("A exam already exists for this module und this semester (" + r.term() + ")");
		
		validateDeadlines(r.registrationDeadline(), r.deregistrationDeadline(),r.examDate());
		
		ExamEntity exam = new ExamEntity();
	    exam.setModule(module);
	    exam.setTerm(r.term());
	    exam.setExamDate(r.examDate());
	    exam.setExamRoom(r.examRoom());
	    exam.setRegistrationDeadline(r.registrationDeadline());
	    exam.setDeregistrationDeadline(r.deregistrationDeadline());
	    exam.setMaxParticipants(r.maxParticipants());
	    exam.setStatus(ExamStatus.OPEN);

	    ExamEntity savedExam = examRepository.save(exam);
	    return toExamResponse(savedExam);
	}
	
	@Transactional
	public  ExamResponse updateExam(Long examId, UpdateExamRequest request, String professorEmail) {
		ExamEntity exam = examRepository.findById(examId)
				.orElseThrow(()-> new BusinessRuleException("Exam not found with id :" + examId));
		
		if(exam.getStatus() != ExamStatus.OPEN) throw new BusinessRuleException("Only opened exam can be updated");	
		
		long count = examRegistrationRepository.countByExamIdAndStatus(examId, RegistrationStatus.ANGEMELDET);
		
		if(count > 0 && !exam.getExamDate().equals(request.examDate())) throw new BusinessRuleException("The exam with id :" + examId + " cannot be modified, already has enrolled student");
		
		  
		ProfessorEntity professor = getProfessorByEmail(professorEmail);
		
		if(!exam.getModule().getProfessor().getId().equals(professor.getId())) {
			throw new ForbiddenException("Access denied: This exam does not belong to your module ");
		}
		
		if(request.maxParticipants() < count) {
			throw new BusinessRuleException("max partipants cannot  less than " +  count );
		}

		
		validateDeadlines(request.registrationDeadline(), request.deregistrationDeadline(), request.examDate());

	    exam.setTerm(request.term());
	    exam.setExamDate(request.examDate());
	    exam.setExamRoom(request.examRoom()); 
	    exam.setRegistrationDeadline(request.registrationDeadline());
	    exam.setDeregistrationDeadline(request.deregistrationDeadline());
	    exam.setMaxParticipants(request.maxParticipants());

	    return toExamResponse(exam);
		
	}
	
	@Transactional
    public void cancelExam(Long examId, String email) {
        ExamEntity exam = getOwnedExam(examId, email);
        if (exam.getStatus() != ExamStatus.OPEN)
            throw new BusinessRuleException("Seul un examen ouvert peut être annulé");
        exam.setStatus(ExamStatus.CLOSED);
    }
	
	 private ExamEntity getOwnedExam(Long examId, String email) {
	        ProfessorEntity prof = currentProfessor(email);
	        ExamEntity exam = examRepository.findById(examId)
	                .orElseThrow(() -> new ResourceNotFoundException("Examen introuvable"));
	        if (!exam.getModule().getProfessor().getId().equals(prof.getId()))
	            throw new ForbiddenException("Cet examen n'appartient pas à l'un de vos modules");
	        return exam;
	    }
	 
	  private ProfessorEntity currentProfessor(String email) {
	        return professorRepository.findByUserEmail(email)
	                .orElseThrow(() -> new ForbiddenException("Aucun profil professeur associé à ce compte"));
	    }
	
	private ExamResponse toExamResponse(ExamEntity e) {
		long registeredCount = examRegistrationRepository.countByExamIdAndStatus(e.getId(), RegistrationStatus.ANGEMELDET);
		return new ExamResponse(
				e.getId(),
				e.getModule().getId(),
				e.getModule().getCode(),
				e.getModule().getName(),
				e.getTerm(),
				e.getExamDate(),
				e.getExamRoom(),
				e.getRegistrationDeadline(),
				e.getDeregistrationDeadline(),
				e.getMaxParticipants(),
				e.getStatus(),
				registeredCount
				
				);
	}
	
	private ModuleResponse toModuleResponse(ModuleEntity m) {
		
		return new ModuleResponse(
				m.getId(),
				m.getCode(),
				m.getName(),
				m.getCredits(),
				m.getRecommendedSemester(),
				m.getMaxAttempts(),
				m.isActive(),
				m.getDepartment() != null ? m.getDepartment().getId() : null,
				m.getDepartment() != null ? m.getDepartment().getName() : null,
				m.getProfessor() !=null ? m.getProfessor().getId() : null,
			    m.getProfessor() !=null ? m.getProfessor().getFirstName() : null,
			    m.getProfessor() !=null ? m.getProfessor().getLastName() : null
				
				);
		
	}
	
	private void validateDeadlines(
	        LocalDateTime registrationDeadline, 
	        LocalDateTime deregistrationDeadline, 
	        LocalDateTime examDate) {

	    if (registrationDeadline == null || deregistrationDeadline == null || examDate == null) {
	        throw new BusinessRuleException("Exam date and deadline dates cannot be null");
	    }

	    if (registrationDeadline.isAfter(examDate) || registrationDeadline.isEqual(examDate)) {
	        throw new BusinessRuleException("Registration deadline must be strictly before the exam date");
	    }

	    if (deregistrationDeadline.isAfter(registrationDeadline)) {
	        throw new BusinessRuleException("Deregistration deadline cannot be after the registration deadline");
	    }
	}
	
}
























