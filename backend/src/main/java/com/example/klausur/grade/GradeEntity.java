package com.example.klausur.grade;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.klausur.professor.ProfessorEntity;
import com.example.klausur.registration.ExamRegistrationEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity 
@Table(name = "grades")
public class GradeEntity {
	
	    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

	    @OneToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "registration_id", unique = true, nullable = false)
	    private ExamRegistrationEntity registration;

	    @Column(nullable = false, precision = 2, scale = 1)
	    private BigDecimal gradeValue;

	    @Column(nullable = false) private boolean passed;

		private LocalDateTime enteredAt;
	    @PrePersist
	    void onCreate() { enteredAt = LocalDateTime.now(); }

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "entered_by_id", nullable = false) 
	    private ProfessorEntity enteredBy;

}
