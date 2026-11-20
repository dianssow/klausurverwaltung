package com.example.klausur.department;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<DepartmentEntity, Long> {
	
	List<DepartmentEntity> findByActiveTrue();
	boolean existsByCode(String code);
	boolean existsByName(String name);
}
