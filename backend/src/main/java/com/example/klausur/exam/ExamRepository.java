package com.example.klausur.exam;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface ExamRepository extends JpaRepository<ExamEntity, Long>{

	List<ExamEntity> findByModuleProfessorId(Long professorId );
	List<ExamEntity> findByModuleDepartmentIdAndStatus(Long departmentId, ExamStatus status);
	List<ExamEntity> findByModuleDepartmentIdAndStatusAndRegistrationDeadlineAfter(
			Long departmentId,
			ExamStatus status,
			LocalDateTime now 
			);
	boolean existsByModuleIdAndTerm(Long moduleId, String term);
	
	long countByModuleIdAndExamDateAfter(Long moduleId, LocalDateTime now); 
	long countByIdAndStatus(Long id, ExamStatus status);
	
	
}


