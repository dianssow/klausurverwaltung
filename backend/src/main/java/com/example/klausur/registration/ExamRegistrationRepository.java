package com.example.klausur.registration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamRegistrationRepository extends JpaRepository<ExamRegistrationEntity, Long> {

		Optional<ExamRegistrationEntity> findByStudentIdAndExamId(Long studentId, Long examId);
		long countByExamIdAndStatus(Long examId,RegistrationStatus status);
		List<ExamRegistrationEntity> findByStudentId(Long studentId);
		List<ExamRegistrationEntity> findByStudentIdAndStatus(Long studentId, RegistrationStatus status);
		List<ExamRegistrationEntity> findByExamId(Long examId);
		List<ExamRegistrationEntity> findByExamIdAndStatus( Long examId,RegistrationStatus status);
		long countByStudentIdAndExamModuleId(Long studentId, Long moduleId);
		long countByExamModuleIdAndExamExamDateAfterAndStatus(
		        Long moduleId, LocalDateTime now, RegistrationStatus status); 
		
}
