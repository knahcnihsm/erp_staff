package com.rgcet.admission.repository;

import com.rgcet.admission.entity.StudentSemesterGpa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface StudentSemesterGpaRepository extends JpaRepository<StudentSemesterGpa, Long> {

    List<StudentSemesterGpa> findByStudentStudentIdOrderBySemesterNumberAsc(Long studentId);

    Optional<StudentSemesterGpa> findByStudentStudentIdAndSemesterNumber(Long studentId, Integer semesterNumber);

    List<StudentSemesterGpa> findByStudentStudentIdInAndSemesterNumber(Collection<Long> studentIds, Integer semesterNumber);

    List<StudentSemesterGpa> findAllByOrderByCreatedAtDescGpaIdDesc();
}