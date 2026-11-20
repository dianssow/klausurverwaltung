package com.example.klausur.exam;

import java.time.LocalDateTime;

import com.example.klausur.module.ModuleEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="exams", uniqueConstraints = @UniqueConstraint(columnNames = {"module_id", "term"}))
public class ExamEntity {


	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "module_id", nullable = false)
	private ModuleEntity module;
	@Column(name = "exam_date", nullable = false)
	private LocalDateTime examDate;
    @Column(nullable = false, length = 10)
	private String term;
	private String examRoom;
	@Column(nullable = false)
	private LocalDateTime registrationDeadline;
	@Column(nullable = false)
	private LocalDateTime deregistrationDeadline;
	private Integer maxParticipants;
	
	@Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamStatus status = ExamStatus.OPEN; 
	
	
	
}
