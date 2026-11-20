package com.example.klausur.module;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.klausur.admin.dto.CreateModuleRequest;
import com.example.klausur.admin.dto.ModuleResponse;
import com.example.klausur.common.BusinessRuleException;
import com.example.klausur.common.ForbiddenException;
import com.example.klausur.common.ResourceNotFoundException;
import com.example.klausur.department.DepartmentEntity;
import com.example.klausur.department.DepartmentRepository;
import com.example.klausur.professor.ProfessorEntity;
import com.example.klausur.professor.ProfessorRepository;


@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final DepartmentRepository departmentRepository;
    private final ProfessorRepository professorRepository;

    public ModuleService(ModuleRepository moduleRepository, DepartmentRepository departmentRepository,ProfessorRepository professorRepository) {
        this.moduleRepository = moduleRepository;
        this.departmentRepository = departmentRepository;
        this.professorRepository = professorRepository; 
    }

    @Transactional(readOnly = true)
    public ModuleResponse getModuleById(Long id) {
        ModuleEntity module = moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module non trouvé avec l'ID : " + id));

        return toResponse(module); 
    }

    @Transactional(readOnly = true)
    public List<ModuleResponse> getAllActiveModules() {
        return moduleRepository.findByActiveTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    private ModuleResponse toResponse(ModuleEntity entity) {
        
        Long departmentId = entity.getDepartment() != null ? entity.getDepartment().getId() : null;
        String departmentName = entity.getDepartment() != null ? entity.getDepartment().getName() : null;

        Long professorId = entity.getProfessor() != null ? entity.getProfessor().getId() : null;
        String professorFirstName = entity.getProfessor() != null ? entity.getProfessor().getFirstName() : null;
        String professorLastName = entity.getProfessor() != null ? entity.getProfessor().getLastName() : null;

        return new ModuleResponse(
                entity.getId(),
                entity.getCode(),
                entity.getName(), 
                entity.getCredits(),
                entity.getRecommendedSemester(),
                entity.getMaxAttempts(),
                entity.isActive(),
                departmentId,
                departmentName,
                professorId,
                professorFirstName,
                professorLastName
        ); 
    }

    @Transactional 
	public ModuleResponse createModule(CreateModuleRequest r) {
		
    	if (moduleRepository.existsByCode(r.code()))
    	    throw new BusinessRuleException("Code already exist");
		DepartmentEntity department = departmentRepository.findById(r.departmentId())
		        .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
		ProfessorEntity professor = professorRepository.findById(r.professorId())
		        .orElseThrow(() -> new ResourceNotFoundException("Professeur doesnt exist"));
		if (!department.isActive())
		    throw new BusinessRuleException("Departement is unactiv");
		
		  if(!professor.getUser().isActive()) { 
			 throw new BusinessRuleException("Prof is unactive");
		  }
		  if(!professor.getDepartment().getId().equals(r.departmentId())) {
			  throw new ForbiddenException("The Prof doesnt belong to this department");
		  }

	
		  
		  ModuleEntity m = new ModuleEntity();
		 m.setCode(r.code());
		 m.setName(r.name());
		 m.setCredits(r.credits());
		 m.setRecommendedSemester(r.recommendedSemester());
		 m.setMaxAttempts(r.maxAttempts());
		 m.setActive(true);
		 m.setDepartment(department); 
		 m.setProfessor(professor);
		 
		ModuleEntity saved = moduleRepository.save(m);
		  
		  
		return toResponse(saved); 
	}
}