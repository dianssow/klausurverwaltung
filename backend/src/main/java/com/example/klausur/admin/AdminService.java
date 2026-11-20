package com.example.klausur.admin;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.klausur.admin.dto.CreateDepartmentRequest;
import com.example.klausur.admin.dto.CreateProfessorRequest;
import com.example.klausur.admin.dto.CreateStudentRequest;
import com.example.klausur.admin.dto.CreatedAccountResponse;
import com.example.klausur.common.BusinessRuleException;
import com.example.klausur.common.ResourceNotFoundException;
import com.example.klausur.department.DepartmentEntity;
import com.example.klausur.department.DepartmentRepository;
import com.example.klausur.professor.ProfessorEntity;
import com.example.klausur.professor.ProfessorRepository;
import com.example.klausur.student.StudentEntity;
import com.example.klausur.student.StudentRepository;
import com.example.klausur.user.UserEntity;
import com.example.klausur.user.UserRepository;
import com.example.klausur.user.UserRoles;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public DepartmentEntity createDepartment(CreateDepartmentRequest r) {
        if (departmentRepository.existsByCode(r.code())) throw new BusinessRuleException("Code de département déjà utilisé");
        if (departmentRepository.existsByName(r.name())) throw new BusinessRuleException("Nom de département déjà utilisé");
        DepartmentEntity d = new DepartmentEntity();
        d.setCode(r.code());
        d.setName(r.name());
        d.setActive(true);
        return departmentRepository.save(d);
    }

    @Transactional
    public CreatedAccountResponse createStudent(CreateStudentRequest r) {
        if (userRepository.existsByEmail(r.email())) throw new BusinessRuleException("Email déjà utilisé");
        if (studentRepository.existsByMatrikelnummer(r.matrikelnummer()))
            throw new BusinessRuleException("Matrikelnummer déjà utilisée");
        DepartmentEntity dept = activeDepartment(r.departmentId());

        String tempPassword = PasswordGenerator.generate();
        UserEntity user = createUser(r.email(), tempPassword, UserRoles.STUDENT);

        StudentEntity s = new StudentEntity();
        s.setUser(user);
        s.setMatrikelnummer(r.matrikelnummer());
        s.setFirstName(r.firstName());
        s.setLastName(r.lastName());
        s.setDepartment(dept);
        s.setStudiengang(r.studiengang());
        s.setCurrentSemester(r.currentSemester());
        studentRepository.save(s);

        return new CreatedAccountResponse(s.getId(), user.getEmail(), s.getFirstName(), s.getLastName(), tempPassword);
    }

    @Transactional
    public CreatedAccountResponse createProfessor(CreateProfessorRequest r) {
        if (userRepository.existsByEmail(r.email())) throw new BusinessRuleException("Email déjà utilisé");
        if (professorRepository.existsByCode(r.code())) throw new BusinessRuleException("Code professeur déjà utilisé");
        DepartmentEntity dept = activeDepartment(r.departmentId());

        String tempPassword = PasswordGenerator.generate();
        UserEntity user = createUser(r.email(), tempPassword, UserRoles.PROFESSOR);

        ProfessorEntity p = new ProfessorEntity();
        p.setUser(user);
        p.setCode(r.code());
        p.setFirstName(r.firstName());
        p.setLastName(r.lastName());
        p.setDepartment(dept);
        professorRepository.save(p);

        return new CreatedAccountResponse(p.getId(), user.getEmail(), p.getFirstName(), p.getLastName(), tempPassword);
    }

    private DepartmentEntity activeDepartment(Long id) {
        DepartmentEntity d = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Département introuvable"));
        if (!d.isActive()) throw new BusinessRuleException("Département inactif");
        return d;
    }

    private UserEntity createUser(String email, String rawPassword, UserRoles role) {
        UserEntity u = new UserEntity();
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setRole(role);
        u.setActive(true);
        u.setMustChangePassword(true);
        return userRepository.save(u);
    }
}