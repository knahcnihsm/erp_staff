package com.rgcet.admission.service;

import com.rgcet.admission.common.ResourceNotFoundException;
import com.rgcet.admission.dto.StaffDtos.StaffAcademicRecordRow;
import com.rgcet.admission.dto.StaffDtos.StaffAcademicSummary;
import com.rgcet.admission.dto.StaffDtos.StaffActiveArrearsRow;
import com.rgcet.admission.dto.StaffDtos.StaffArrearRecord;
import com.rgcet.admission.dto.StaffDtos.StaffArrearRequest;
import com.rgcet.admission.dto.StaffDtos.StaffBulkAcademicItem;
import com.rgcet.admission.dto.StaffDtos.StaffBulkAcademicRequest;
import com.rgcet.admission.dto.StaffDtos.StaffBulkAcademicResponse;
import com.rgcet.admission.dto.StaffDtos.StaffCgpaRecord;
import com.rgcet.admission.dto.StaffDtos.StaffCgpaRequest;
import com.rgcet.admission.dto.StaffDtos.StaffDashboardSummary;
import com.rgcet.admission.dto.StaffDtos.StaffGpaRecord;
import com.rgcet.admission.dto.StaffDtos.StaffGpaRequest;
import com.rgcet.admission.dto.StaffDtos.StaffPersonalDetails;
import com.rgcet.admission.dto.StaffDtos.StaffRecentUpdate;
import com.rgcet.admission.dto.StaffDtos.StaffStudentSummary;
import com.rgcet.admission.entity.Admission;
import com.rgcet.admission.entity.ArrearStatus;
import com.rgcet.admission.entity.Student;
import com.rgcet.admission.entity.StudentArrear;
import com.rgcet.admission.entity.StudentCgpa;
import com.rgcet.admission.entity.StudentSemesterGpa;
import com.rgcet.admission.entity.StudentStatus;
import com.rgcet.admission.repository.StudentArrearRepository;
import com.rgcet.admission.repository.StudentCgpaRepository;
import com.rgcet.admission.repository.StudentRepository;
import com.rgcet.admission.repository.StudentSemesterGpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StudentRepository studentRepository;
    private final StudentSemesterGpaRepository gpaRepository;
    private final StudentCgpaRepository cgpaRepository;
    private final StudentArrearRepository arrearRepository;

    @Transactional(readOnly = true)
    public List<StaffStudentSummary> listStudents(String search, String department, Integer year,
                                                  String section, String status) {
        List<Student> students = studentRepository.findAll();

        return students.stream()
                .map(this::toSummary)
                .filter(s -> matches(s, search, department, year, section, status))
                .sorted(Comparator.comparing(StaffStudentSummary::regNo))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StaffAcademicRecordRow> getAcademicRecords(Integer semester) {
        if (semester == null || semester < 1 || semester > 8) {
            throw new IllegalArgumentException("Semester must be between 1 and 8.");
        }
        List<Student> students = studentRepository.findAll();

        List<Long> studentIds = students.stream()
                .map(Student::getStudentId)
                .collect(Collectors.toList());
        Map<Long, StudentSemesterGpa> gpas = gpaRepository
                .findByStudentStudentIdInAndSemesterNumber(studentIds, semester).stream()
                .collect(Collectors.toMap(g -> g.getStudent().getStudentId(), g -> g, (a, b) -> a));
        Map<Long, StudentCgpa> cgpas = cgpaRepository.findByStudentStudentIdIn(studentIds).stream()
                .collect(Collectors.toMap(c -> c.getStudent().getStudentId(), c -> c, (a, b) -> a));

        return students.stream()
                .map(s -> {
                    Admission admission = s.getAdmission();
                    Integer currentSemester = admission == null ? null : admission.getCurrentSemester();
                    StudentSemesterGpa gpa = gpas.get(s.getStudentId());
                    StudentCgpa cgpa = cgpas.get(s.getStudentId());
                    return new StaffAcademicRecordRow(
                            s.getStudentId(),
                            regNoOf(s),
                            s.getStudentName(),
                            currentSemester != null ? currentSemester : 1,
                            gpa == null ? null : gpa.getSemesterGpa(),
                            cgpa == null ? null : cgpa.getCgpa());
                })
                .sorted(Comparator.comparing(StaffAcademicRecordRow::regNo))
                .collect(Collectors.toList());
    }

    @Transactional
    public StaffBulkAcademicResponse saveAcademicRecords(StaffBulkAcademicRequest request) {
        if (request.semesterNumber() == null || request.semesterNumber() < 1 || request.semesterNumber() > 8) {
            throw new IllegalArgumentException("Semester must be between 1 and 8.");
        }
        Integer semester = request.semesterNumber();

        List<Long> studentIds = request.records().stream()
                .map(StaffBulkAcademicItem::studentId)
                .distinct()
                .collect(Collectors.toList());
        Map<Long, Student> students = studentRepository.findAllById(studentIds).stream()
                .collect(Collectors.toMap(Student::getStudentId, s -> s));
        for (Long id : studentIds) {
            if (!students.containsKey(id)) {
                throw new ResourceNotFoundException("Student not found: " + id);
            }
        }

        Map<Long, StudentSemesterGpa> gpasByStudent = gpaRepository
                .findByStudentStudentIdInAndSemesterNumber(studentIds, semester).stream()
                .collect(Collectors.toMap(g -> g.getStudent().getStudentId(), g -> g, (a, b) -> a));
        Map<Long, StudentCgpa> cgpasByStudent = cgpaRepository.findByStudentStudentIdIn(studentIds).stream()
                .collect(Collectors.toMap(c -> c.getStudent().getStudentId(), c -> c, (a, b) -> a));

        List<StudentSemesterGpa> gpasToSave = new ArrayList<>();
        List<StudentCgpa> cgpasToSave = new ArrayList<>();
        int gpaCount = 0;
        int cgpaCount = 0;

        for (StaffBulkAcademicItem item : request.records()) {
            Student student = students.get(item.studentId());
            String regNo = regNoOf(student);

            if (item.gpa() != null) {
                validateAcademicValue(item.gpa(), "GPA", regNo);
                StudentSemesterGpa gpa = gpasByStudent.get(student.getStudentId());
                if (gpa == null) {
                    gpa = new StudentSemesterGpa();
                    gpa.setStudent(student);
                    gpa.setSemesterNumber(semester);
                    gpasByStudent.put(student.getStudentId(), gpa);
                    gpasToSave.add(gpa);
                }
                gpa.setSemesterGpa(item.gpa());
                gpaCount++;
            }

            if (item.cgpa() != null) {
                validateAcademicValue(item.cgpa(), "CGPA", regNo);
                StudentCgpa cgpa = cgpasByStudent.get(student.getStudentId());
                if (cgpa == null) {
                    cgpa = new StudentCgpa();
                    cgpa.setStudent(student);
                    cgpasByStudent.put(student.getStudentId(), cgpa);
                    cgpasToSave.add(cgpa);
                }
                cgpa.setCgpa(item.cgpa());
                cgpaCount++;
            }
        }

        if (!gpasToSave.isEmpty()) {
            gpaRepository.saveAll(gpasToSave);
        }
        if (!cgpasToSave.isEmpty()) {
            cgpaRepository.saveAll(cgpasToSave);
        }
        return new StaffBulkAcademicResponse(gpaCount, cgpaCount);
    }

    @Transactional(readOnly = true)
    public List<StaffActiveArrearsRow> getActiveArrears() {
        List<StudentArrear> active = arrearRepository.findByArrearStatus(ArrearStatus.ACTIVE);
        Map<Long, Student> students = studentRepository.findAll().stream()
                .collect(Collectors.toMap(Student::getStudentId, s -> s));

        Map<Long, StaffActiveArrearsRow> rows = new java.util.LinkedHashMap<>();
        for (StudentArrear arrear : active) {
            Student student = students.get(arrear.getStudent().getStudentId());
            if (student == null) {
                continue;
            }
            Long studentId = student.getStudentId();
            StaffActiveArrearsRow existing = rows.computeIfAbsent(studentId, id -> {
                Admission admission = student.getAdmission();
                Integer currentSemester = admission == null ? null : admission.getCurrentSemester();
                return new StaffActiveArrearsRow(
                        studentId,
                        regNoOf(student),
                        student.getStudentName(),
                        currentSemester != null ? currentSemester : 1,
                        0,
                        new ArrayList<>());
            });
            List<String> subjects = new ArrayList<>(existing.subjects());
            subjects.add(arrear.getSubjectName());
            rows.put(studentId, new StaffActiveArrearsRow(
                    existing.studentId(),
                    existing.regNo(),
                    existing.name(),
                    existing.semester(),
                    existing.activeArrears() + 1,
                    subjects));
        }

        return rows.values().stream()
                .sorted(Comparator.comparing(StaffActiveArrearsRow::regNo))
                .collect(Collectors.toList());
    }

    private void validateAcademicValue(BigDecimal value, String label, String regNo) {
        if (value.compareTo(BigDecimal.ZERO) < 0
                || value.compareTo(new BigDecimal("10")) > 0
                || value.scale() > 2) {
            throw new IllegalArgumentException("Invalid " + label + " for Register No. " + regNo + ".");
        }
    }

    @Transactional(readOnly = true)
    public StaffStudentSummary getStudent(Long id) {
        Student student = getStudentOrThrow(id);
        return toSummary(student);
    }

    @Transactional(readOnly = true)
    public StaffPersonalDetails getPersonalDetails(Long id) {
        Student s = getStudentOrThrow(id);
        Admission admission = s.getAdmission();
        return new StaffPersonalDetails(
                s.getStudentId(),
                regNoOf(s),
                s.getApplicationNo(),
                s.getStudentName(),
                s.getDateOfBirth() == null ? null : s.getDateOfBirth().toString(),
                titleCase(s.getGender() == null ? null : s.getGender().name()),
                s.getEmailId(),
                s.getMobileNumber(),
                s.getDistrict(),
                s.getCaste() == null ? null : s.getCaste().name(),
                maskAadhaar(s.getAadhaarNo()),
                admission == null ? null : admission.getBatch(),
                admission == null || admission.getProgram() == null ? null : admission.getProgram().getProgramName(),
                deptName(s),
                admission == null || admission.getDateOfAdmission() == null
                        ? null : admission.getDateOfAdmission().toString());
    }

    @Transactional(readOnly = true)
    public List<StaffGpaRecord> getGpa(Long studentId) {
        getStudentOrThrow(studentId);
        return gpaRepository.findByStudentStudentIdOrderBySemesterNumberAsc(studentId).stream()
                .map(this::toGpa)
                .collect(Collectors.toList());
    }

    @Transactional
    public StaffGpaRecord addGpa(Long studentId, StaffGpaRequest request) {
        Student student = getStudentOrThrow(studentId);
        assertGpaSemesterFree(studentId, request.semesterNumber(), null);
        StudentSemesterGpa gpa = new StudentSemesterGpa();
        gpa.setStudent(student);
        gpa.setSemesterNumber(request.semesterNumber());
        gpa.setSemesterGpa(request.semesterGpa());
        return toGpa(gpaRepository.save(gpa));
    }

    @Transactional
    public StaffGpaRecord updateGpa(Long gpaId, StaffGpaRequest request) {
        StudentSemesterGpa gpa = gpaRepository.findById(gpaId)
                .orElseThrow(() -> new IllegalArgumentException("GPA record not found."));
        assertGpaSemesterFree(gpa.getStudent().getStudentId(), request.semesterNumber(), gpaId);
        gpa.setSemesterNumber(request.semesterNumber());
        gpa.setSemesterGpa(request.semesterGpa());
        return toGpa(gpaRepository.save(gpa));
    }

    private void assertGpaSemesterFree(Long studentId, Integer semesterNumber, Long excludeGpaId) {
        gpaRepository.findByStudentStudentIdAndSemesterNumber(studentId, semesterNumber).ifPresent(existing -> {
            if (excludeGpaId == null || !existing.getGpaId().equals(excludeGpaId)) {
                throw new IllegalArgumentException("GPA already exists for Semester " + semesterNumber + ".");
            }
        });
    }

    @Transactional(readOnly = true)
    public List<StaffCgpaRecord> getCgpa(Long studentId) {
        getStudentOrThrow(studentId);
        return cgpaRepository.findByStudentStudentId(studentId).stream()
                .map(this::toCgpa)
                .collect(Collectors.toList());
    }

    @Transactional
    public StaffCgpaRecord addCgpa(Long studentId, StaffCgpaRequest request) {
        Student student = getStudentOrThrow(studentId);
        if (!cgpaRepository.findByStudentStudentId(studentId).isEmpty()) {
            throw new IllegalArgumentException("CGPA already exists for this student.");
        }
        StudentCgpa cgpa = new StudentCgpa();
        cgpa.setStudent(student);
        cgpa.setCgpa(request.cgpa());
        return toCgpa(cgpaRepository.save(cgpa));
    }

    @Transactional
    public StaffCgpaRecord updateCgpa(Long cgpaId, StaffCgpaRequest request) {
        StudentCgpa cgpa = cgpaRepository.findById(cgpaId)
                .orElseThrow(() -> new IllegalArgumentException("CGPA record not found."));
        cgpa.setCgpa(request.cgpa());
        return toCgpa(cgpaRepository.save(cgpa));
    }

    @Transactional(readOnly = true)
    public List<StaffArrearRecord> getArrears(Long studentId) {
        getStudentOrThrow(studentId);
        return arrearRepository.findByStudentStudentIdOrderBySemesterNumberAsc(studentId).stream()
                .map(this::toArrear)
                .collect(Collectors.toList());
    }

    @Transactional
    public StaffArrearRecord addArrear(Long studentId, StaffArrearRequest request) {
        Student student = getStudentOrThrow(studentId);
        StudentArrear arrear = new StudentArrear();
        arrear.setStudent(student);
        applyArrear(arrear, request, true);
        return toArrear(arrearRepository.save(arrear));
    }

    @Transactional
    public StaffArrearRecord updateArrear(Long arrearId, StaffArrearRequest request) {
        StudentArrear arrear = arrearRepository.findById(arrearId)
                .orElseThrow(() -> new IllegalArgumentException("Arrear record not found."));
        applyArrear(arrear, request, false);
        return toArrear(arrearRepository.save(arrear));
    }

    private void applyArrear(StudentArrear arrear, StaffArrearRequest request, boolean create) {
        if (create || request.semesterNumber() != null) {
            arrear.setSemesterNumber(request.semesterNumber());
        }
        if (create || request.subjectName() != null) {
            arrear.setSubjectName(request.subjectName());
        }
        if (create || request.examAttempt() != null) {
            arrear.setExamAttempt(request.examAttempt());
        }
        if (request.arrearStatus() != null) {
            arrear.setArrearStatus(request.arrearStatus());
            if (request.arrearStatus() == ArrearStatus.CLEARED && arrear.getClearedDate() == null) {
                arrear.setClearedDate(LocalDate.now());
            }
        }
        if (request.remarks() != null) {
            arrear.setRemarks(request.remarks());
        }
        if (create && arrear.getAttemptDate() == null) {
            arrear.setAttemptDate(LocalDate.now());
        }
    }

    @Transactional
    public void deleteArrear(Long arrearId) {
        if (!arrearRepository.existsById(arrearId)) {
            throw new IllegalArgumentException("Arrear record not found.");
        }
        arrearRepository.deleteById(arrearId);
    }

    @Transactional(readOnly = true)
    public StaffAcademicSummary getAcademicSummary(Long studentId) {
        getStudentOrThrow(studentId);
        List<StudentSemesterGpa> gpas = gpaRepository.findByStudentStudentIdOrderBySemesterNumberAsc(studentId);
        List<StudentCgpa> cgpas = cgpaRepository.findByStudentStudentId(studentId);
        List<StudentArrear> arrears = arrearRepository.findByStudentStudentIdOrderBySemesterNumberAsc(studentId);
        BigDecimal latestGpa = gpas.isEmpty() ? BigDecimal.ZERO : gpas.get(gpas.size() - 1).getSemesterGpa();
        BigDecimal latestCgpa = cgpas.isEmpty() ? null : cgpas.get(0).getCgpa();
        return new StaffAcademicSummary(
                latestGpa,
                latestCgpa,
                arrears.stream().filter(a -> a.getArrearStatus() == ArrearStatus.ACTIVE).count(),
                arrears.stream().filter(a -> a.getArrearStatus() == ArrearStatus.CLEARED).count());
    }

    @Transactional(readOnly = true)
    public StaffDashboardSummary getDashboard() {
        List<Student> students = studentRepository.findAll();
        long total = students.size();
        long active = students.stream()
                .filter(s -> s.getStatus() != StudentStatus.ARCHIVED)
                .count();
        long activeArrears = arrearRepository.findAll().stream()
                .filter(a -> a.getArrearStatus() == ArrearStatus.ACTIVE)
                .count();

        List<StaffRecentUpdate> updates = new ArrayList<>();
        addGpaUpdates(updates);
        addCgpaUpdates(updates);
        addArrearUpdates(updates);
        updates.sort((x, y) -> {
            LocalDateTime a = x.updatedAt();
            LocalDateTime b = y.updatedAt();
            if (a == null && b == null) {
                return Long.compare(y.id(), x.id());
            }
            if (a == null) {
                return 1;
            }
            if (b == null) {
                return -1;
            }
            int byTime = b.compareTo(a);
            return byTime != 0 ? byTime : Long.compare(y.id(), x.id());
        });

        return new StaffDashboardSummary(total, active, activeArrears,
                updates.stream().limit(6).collect(Collectors.toList()));
    }

    private void addGpaUpdates(List<StaffRecentUpdate> updates) {
        for (StudentSemesterGpa gpa : gpaRepository.findAllByOrderByCreatedAtDescGpaIdDesc()) {
            updates.add(new StaffRecentUpdate(
                    gpa.getGpaId(),
                    regNoOf(gpa.getStudent()),
                    gpa.getStudent().getStudentId(),
                    gpa.getStudent().getStudentName(),
                    "GPA",
                    "Semester " + gpa.getSemesterNumber() + " GPA updated (" + gpa.getSemesterGpa() + ")",
                    gpa.getUpdatedAt() != null ? gpa.getUpdatedAt() : gpa.getCreatedAt()));
        }
    }

    private void addCgpaUpdates(List<StaffRecentUpdate> updates) {
        for (StudentCgpa cgpa : cgpaRepository.findAllByOrderByCreatedAtDescCgpaIdDesc()) {
            updates.add(new StaffRecentUpdate(
                    cgpa.getCgpaId(),
                    regNoOf(cgpa.getStudent()),
                    cgpa.getStudent().getStudentId(),
                    cgpa.getStudent().getStudentName(),
                    "CGPA",
                    "CGPA updated (" + cgpa.getCgpa() + ")",
                    cgpa.getUpdatedAt() != null ? cgpa.getUpdatedAt() : cgpa.getCreatedAt()));
        }
    }

    private void addArrearUpdates(List<StaffRecentUpdate> updates) {
        for (StudentArrear arrear : arrearRepository.findAllByOrderByCreatedAtDescArrearIdDesc()) {
            String description = arrear.getArrearStatus() == ArrearStatus.CLEARED
                    ? "Arrear cleared - " + arrear.getSubjectName()
                    : "Supplementary exam recorded for " + arrear.getSubjectName();
            updates.add(new StaffRecentUpdate(
                    arrear.getArrearId(),
                    regNoOf(arrear.getStudent()),
                    arrear.getStudent().getStudentId(),
                    arrear.getStudent().getStudentName(),
                    "Arrear",
                    description,
                    arrear.getUpdatedAt() != null ? arrear.getUpdatedAt() : arrear.getCreatedAt()));
        }
    }

    private StaffStudentSummary toSummary(Student student) {
        String department = deptName(student);
        Admission admission = student.getAdmission();
        Integer currentYear = admission == null ? null : admission.getCurrentYear();
        Integer currentSemester = admission == null ? null : admission.getCurrentSemester();
        String section = admission == null ? null : admission.getSection();
        return new StaffStudentSummary(
                student.getStudentId(),
                regNoOf(student),
                student.getStudentName(),
                department,
                deptShort(department),
                currentYear != null ? currentYear : 1,
                currentSemester != null ? currentSemester : 1,
                section,
                student.getStatus().name());
    }

    private StaffGpaRecord toGpa(StudentSemesterGpa gpa) {
        return new StaffGpaRecord(gpa.getGpaId(), gpa.getStudent().getStudentId(),
                gpa.getSemesterNumber(), gpa.getSemesterGpa());
    }

    private StaffCgpaRecord toCgpa(StudentCgpa cgpa) {
        return new StaffCgpaRecord(cgpa.getCgpaId(), cgpa.getStudent().getStudentId(),
                cgpa.getCgpa());
    }

    private StaffArrearRecord toArrear(StudentArrear arrear) {
        return new StaffArrearRecord(arrear.getArrearId(), arrear.getStudent().getStudentId(),
                arrear.getSemesterNumber(), arrear.getSubjectName(), arrear.getExamAttempt(),
                arrear.getArrearStatus(), arrear.getRemarks());
    }

    private boolean matches(StaffStudentSummary s, String search, String department, Integer year,
                            String section, String status) {
        if (isNotBlank(search)) {
            String q = search.trim().toLowerCase();
            if (!s.name().toLowerCase().contains(q) && !s.regNo().toLowerCase().contains(q)) {
                return false;
            }
        }
        if (isNotBlank(department) && !department.equalsIgnoreCase(s.department())) {
            return false;
        }
        if (year != null && !year.equals(s.year())) {
            return false;
        }
        if (isNotBlank(section) && !section.equalsIgnoreCase(s.section())) {
            return false;
        }
        if (isNotBlank(status) && !status.equalsIgnoreCase(s.status())) {
            return false;
        }
        return true;
    }

    private String deptName(Student student) {
        if (student.getAdmission() == null || student.getAdmission().getDepartment() == null) {
            return "";
        }
        return student.getAdmission().getDepartment().getDepartmentName();
    }

    private String deptShort(String department) {
        if (department == null || department.isBlank()) {
            return "";
        }
        int open = department.indexOf('(');
        int close = department.lastIndexOf(')');
        if (open >= 0 && close > open) {
            return department.substring(open + 1, close).trim();
        }
        String upper = department.toUpperCase();
        if (upper.startsWith("M.TECH COMPUTER")) {
            return "MTech CSE";
        }
        if (upper.startsWith("M.TECH WIRELESS")) {
            return "MTech WC";
        }
        if (upper.startsWith("MASTER OF BUSINESS")) {
            return "MBA";
        }
        if (upper.startsWith("MASTER OF COMPUTER")) {
            return "MCA";
        }
        return department;
    }

    private String regNoOf(Student student) {
        return student.getRegisterNo() != null && !student.getRegisterNo().isBlank()
                ? student.getRegisterNo()
                : student.getApplicationNo();
    }

    private static String titleCase(String value) {
        if (value == null || value.isEmpty()) {
            return value;
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1).toLowerCase();
    }

    private static String maskAadhaar(String aadhaar) {
        if (aadhaar == null || aadhaar.isBlank()) {
            return "****-****-****";
        }
        String digits = aadhaar.replaceAll("[^0-9]", "");
        if (digits.length() < 4) {
            return "****-****-****";
        }
        return "****-****-" + digits.substring(digits.length() - 4);
    }

    private static boolean isNotBlank(String value) {
        return value != null && !value.isBlank();
    }

    private Student getStudentOrThrow(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));
    }
}