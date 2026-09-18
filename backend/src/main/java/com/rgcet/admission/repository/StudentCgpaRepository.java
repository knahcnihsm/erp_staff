package com.rgcet.admission.repository;

import com.rgcet.admission.entity.StudentCgpa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface StudentCgpaRepository extends JpaRepository<StudentCgpa, Long> {

    List<StudentCgpa> findByStudentStudentId(Long studentId);

    List<StudentCgpa> findByStudentStudentIdIn(Collection<Long> studentIds);

    List<StudentCgpa> findAllByOrderByCreatedAtDescCgpaIdDesc();
}