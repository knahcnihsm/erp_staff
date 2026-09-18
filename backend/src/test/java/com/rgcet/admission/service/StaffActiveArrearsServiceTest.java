package com.rgcet.admission.service;

import com.rgcet.admission.dto.StaffDtos.StaffActiveArrearsRow;
import com.rgcet.admission.entity.Admission;
import com.rgcet.admission.entity.ArrearStatus;
import com.rgcet.admission.entity.Student;
import com.rgcet.admission.entity.StudentArrear;
import com.rgcet.admission.repository.StudentArrearRepository;
import com.rgcet.admission.repository.StudentCgpaRepository;
import com.rgcet.admission.repository.StudentRepository;
import com.rgcet.admission.repository.StudentSemesterGpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class StaffActiveArrearsServiceTest {

    private StudentRepository studentRepository;
    private StudentArrearRepository arrearRepository;
    private StaffService staffService;

    private Student student(String regNo, String name, Long id, Integer currentSemester) {
        Student student = mock(Student.class);
        Admission admission = mock(Admission.class);
        when(admission.getCurrentSemester()).thenReturn(currentSemester);
        when(student.getStudentId()).thenReturn(id);
        when(student.getRegisterNo()).thenReturn(regNo);
        when(student.getStudentName()).thenReturn(name);
        when(student.getAdmission()).thenReturn(admission);
        return student;
    }

    private StudentArrear arrear(Student student, String subject, ArrearStatus status) {
        StudentArrear arrear = mock(StudentArrear.class);
        when(arrear.getStudent()).thenReturn(student);
        when(arrear.getSubjectName()).thenReturn(subject);
        when(arrear.getArrearStatus()).thenReturn(status);
        return arrear;
    }

    @BeforeEach
    void setUp() {
        studentRepository = mock(StudentRepository.class);
        arrearRepository = mock(StudentArrearRepository.class);
        staffService = new StaffService(
                studentRepository,
                mock(StudentSemesterGpaRepository.class),
                mock(StudentCgpaRepository.class),
                arrearRepository);
    }

    @Test
    void returnsOnlyStudentsWithActiveArrearsSortedByRegNo() {
        Student alice = student("26BTECH002", "Alice", 1L, 1);
        Student bob = student("26BTECH001", "Bob", 2L, null);
        Student cara = student("26BTECH003", "Cara", 3L, 2);
        Student david = student("26BTECH004", "David", 4L, 1);

        StudentArrear aliceMaths = arrear(alice, "Mathematics", ArrearStatus.ACTIVE);
        StudentArrear alicePhysics = arrear(alice, "Physics", ArrearStatus.ACTIVE);
        StudentArrear bobEnglish = arrear(bob, "English", ArrearStatus.ACTIVE);
        StudentArrear caraCleared = arrear(cara, "Chemistry", ArrearStatus.CLEARED);

        when(arrearRepository.findByArrearStatus(ArrearStatus.ACTIVE))
                .thenReturn(List.of(aliceMaths, alicePhysics, bobEnglish));
        when(studentRepository.findAll())
                .thenReturn(List.of(alice, bob, cara, david));

        List<StaffActiveArrearsRow> rows = staffService.getActiveArrears();

        verify(arrearRepository).findByArrearStatus(ArrearStatus.ACTIVE);

        assertEquals(2, rows.size());
        assertEquals("26BTECH001", rows.get(0).regNo());
        assertEquals("Bob", rows.get(0).name());
        assertEquals(1, rows.get(0).activeArrears());
        assertEquals(List.of("English"), rows.get(0).subjects());
        assertEquals(1, rows.get(0).semester());

        assertEquals("26BTECH002", rows.get(1).regNo());
        assertEquals("Alice", rows.get(1).name());
        assertEquals(2, rows.get(1).activeArrears());
        assertEquals(List.of("Mathematics", "Physics"), rows.get(1).subjects());
        assertEquals(1, rows.get(1).semester());

        assertTrue(rows.stream().noneMatch(row -> row.regNo().equals("26BTECH003")));
        assertTrue(rows.stream().noneMatch(row -> row.regNo().equals("26BTECH004")));
    }

    @Test
    void returnsEmptyListWhenNoActiveArrears() {
        when(arrearRepository.findByArrearStatus(ArrearStatus.ACTIVE)).thenReturn(List.of());
        when(studentRepository.findAll()).thenReturn(List.of());

        List<StaffActiveArrearsRow> rows = staffService.getActiveArrears();

        assertTrue(rows.isEmpty());
    }
}