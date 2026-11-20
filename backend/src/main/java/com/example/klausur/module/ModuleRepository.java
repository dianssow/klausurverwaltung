package com.example.klausur.module;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<ModuleEntity, Long>{
	boolean existsByCode(String code);
	List<ModuleEntity> findByProfessorId(Long professorId);
	long countByProfessorIdAndActiveTrue(Long professorId); 
	long countByDepartmentIdAndActiveTrue(Long departmentId); 
	List<ModuleEntity> findByActiveTrue();
}
