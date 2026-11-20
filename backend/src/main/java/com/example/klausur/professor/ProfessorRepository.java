package com.example.klausur.professor;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorRepository  extends JpaRepository<ProfessorEntity, Long>{
	
	Optional<ProfessorEntity> findByUserId(Long userId);
	Optional<ProfessorEntity> findByUserEmail(String email);
    List<ProfessorEntity> findByDepartmentId(Long departmentId);
	boolean existsByCode(String code);
	long countByDepartmentId(Long departmentId); 
	
	@Query("Select p from ProfessorEntity p Where " + 
	"LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search , '%')) OR " +
	"LOWER(p.lastName ) LIKE LOWER(CONCAT('%', :search , '%')) OR " + 
	"LOWER(p.code)      LIKE LOWER(Concat('%', :search, '%'))" 
			)
	Page<ProfessorEntity> searchProfessors(@Param("search") String search, Pageable pageable);
	
}
