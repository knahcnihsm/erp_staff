package com.rgcet.admission.dto;

import com.rgcet.admission.entity.ArrearStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public final class StaffDtos {

    private StaffDtos() {
    }

    public record StaffStudentSummary(
            Long studentId,
            String regNo,
            String name,
            String department,
            String deptShort,
            Integer year,
            Integer semester,
            String section,
            String status) {
    }

    public record StaffPersonalDetails(
            Long studentId,
            String regNo,
            String applicationNo,
            String name,
            String dob,
            String gender,
            String email,
            String mobile,
            String district,
            String caste,
            String aadhaar,
            String batch,
            String program,
            String department,
            String admissionDate) {
    }

    public record StaffGpaRecord(
            Long gpaId,
            Long studentId,
            Integer semesterNumber,
            BigDecimal semesterGpa) {
    }

    public record StaffCgpaRecord(
            Long cgpaId,
            Long studentId,
            BigDecimal cgpa) {
    }

    public record StaffArrearRecord(
            Long arrearId,
            Long studentId,
            Integer semesterNumber,
            String subjectName,
            Integer examAttempt,
            ArrearStatus arrearStatus,
            String remarks) {
    }

    public record StaffGpaRequest(
            @NotNull @Positive Integer semesterNumber,
            @NotNull BigDecimal semesterGpa) {
    }

    public record StaffCgpaRequest(
            @NotNull BigDecimal cgpa) {
    }

    public record StaffArrearRequest(
            @Positive Integer semesterNumber,
            String subjectName,
            @Positive Integer examAttempt,
            ArrearStatus arrearStatus,
            String remarks) {
    }

    public record StaffAcademicSummary(
            BigDecimal latestGpa,
            BigDecimal latestCgpa,
            long activeArrears,
            long clearedArrears) {
    }

    public record StaffRecentUpdate(
            Long id,
            String regNo,
            Long studentId,
            String studentName,
            String type,
            String description,
            LocalDateTime updatedAt) {
    }

    public record StaffDashboardSummary(
            long totalStudents,
            long activeStudents,
            long activeArrears,
            List<StaffRecentUpdate> recentUpdates) {
    }

    public record StaffAcademicRecordRow(
            Long studentId,
            String regNo,
            String name,
            Integer semester,
            BigDecimal semesterGpa,
            BigDecimal cgpa) {
    }

    public record StaffBulkAcademicItem(
            @NotNull Long studentId,
            BigDecimal gpa,
            BigDecimal cgpa) {
    }

    public record StaffBulkAcademicRequest(
            @NotNull @Positive Integer semesterNumber,
            @NotEmpty @Valid List<StaffBulkAcademicItem> records) {
    }

    public record StaffBulkAcademicResponse(
            int gpaRecords,
            int cgpaRecords) {
    }

    public record StaffActiveArrearsRow(
            Long studentId,
            String regNo,
            String name,
            Integer semester,
            Integer activeArrears,
            List<String> subjects) {
    }
}