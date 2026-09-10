package com.rgcet.admission.repository;

import com.rgcet.admission.entity.StudentArrear;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentArrearRepository extends JpaRepository<StudentArrear, Long> {

    List<StudentArrear> findByStudentStudentIdOrderBySemesterNumberAsc(Long studentId);

    List<StudentArrear> findAllByOrderByCreatedAtDescArrearIdDesc();
}