package com.example.klausur.registration;

import java.time.LocalDateTime;

import com.example.klausur.exam.ExamEntity;

import com.example.klausur.student.StudentEntity;

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
@Table(name="exam_registrations", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "exam_id"}))
public class ExamRegistrationEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id",nullable = false)
	private StudentEntity student;
	 
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exam_id", nullable= false)
	private ExamEntity exam;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RegistrationStatus status = RegistrationStatus.ANGEMELDET;
	
	
	private LocalDateTime registeredAt;
	private LocalDateTime deregisteredAt;
	
	

}
