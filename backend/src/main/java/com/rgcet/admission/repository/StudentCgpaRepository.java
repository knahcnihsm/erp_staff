package com.rgcet.admission.repository;

import com.rgcet.admission.entity.StudentCgpa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentCgpaRepository extends JpaRepository<StudentCgpa, Long> {

    List<StudentCgpa> findByStudentStudentIdOrderByYearNumberAsc(Long studentId);

    Optional<StudentCgpa> findByStudentStudentIdAndYearNumber(Long studentId, Integer yearNumber);

    List<StudentCgpa> findAllByOrderByCreatedAtDescCgpaIdDesc();
}