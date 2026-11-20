package com.example.klausur.department;

import java.util.List;

import com.example.klausur.module.ModuleEntity;
import com.example.klausur.professor.ProfessorEntity;
import com.example.klausur.student.StudentEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="departments")
public class DepartmentEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(unique = true, nullable = false)
	private String code; 	@Column(unique = true, nullable = false)
	private String name;
	@Column(nullable = false)
	private boolean active;
	
	@OneToMany(mappedBy = "department")
	private List<ProfessorEntity> professors;
	
	  @OneToMany(mappedBy = "department")
	    private List <StudentEntity> students; 
	  @OneToMany(mappedBy = "department")
	  private List<ModuleEntity> modules; 
	
	
	
}
