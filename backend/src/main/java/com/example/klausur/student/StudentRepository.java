package com.example.klausur.student;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Long>{
	
	Optional<StudentEntity> findByUserId(Long userId);
	Optional<StudentEntity> findByUserEmail(String email); 
	boolean existsByMatrikelnummer(String matrikelnummer);
	long countByDepartmentId(Long departmentId); 
	long countByDepartmentIdAndUserActiveTrue(Long departmentId); 
	Optional<StudentEntity> findByIdAndDepartmentId(Long studentId, Long examId);
	
	@Query("SELECT s FROM StudentEntity s WHERE " +
	           "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
	           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
	           "LOWER(s.matrikelnummer) LIKE LOWER(CONCAT('%', :search, '%'))")
	    Page<StudentEntity> searchStudents(@Param("search") String search, Pageable pageable);
	
}
 