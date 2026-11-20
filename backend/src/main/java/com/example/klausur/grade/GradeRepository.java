package com.example.klausur.grade;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GradeRepository  extends JpaRepository<GradeEntity, Long>{

	Optional<GradeEntity> findByRegistrationId(Long registrationId);
	List<GradeEntity> findByRegistrationStudentId(long studentId);
	long countByRegistrationStudentIdAndRegistrationExamModuleId(Long studentId, Long moduleId); 
	boolean existsByRegistrationStudentIdAndRegistrationExamModuleIdAndGradeValueLessThanEqual(
            Long studentId, 
            Long moduleId, 
            BigDecimal maxPassingGrade 
    );
}
