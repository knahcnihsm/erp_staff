package com.rgcet.admission.controller;

import com.rgcet.admission.dto.StaffDtos.StaffAcademicRecordRow;
import com.rgcet.admission.dto.StaffDtos.StaffAcademicSummary;
import com.rgcet.admission.dto.StaffDtos.StaffActiveArrearsRow;
import com.rgcet.admission.dto.StaffDtos.StaffArrearRecord;
import com.rgcet.admission.dto.StaffDtos.StaffArrearRequest;
import com.rgcet.admission.dto.StaffDtos.StaffBulkAcademicRequest;
import com.rgcet.admission.dto.StaffDtos.StaffBulkAcademicResponse;
import com.rgcet.admission.dto.StaffDtos.StaffCgpaRecord;
import com.rgcet.admission.dto.StaffDtos.StaffCgpaRequest;
import com.rgcet.admission.dto.StaffDtos.StaffDashboardSummary;
import com.rgcet.admission.dto.StaffDtos.StaffGpaRecord;
import com.rgcet.admission.dto.StaffDtos.StaffGpaRequest;
import com.rgcet.admission.dto.StaffDtos.StaffPersonalDetails;
import com.rgcet.admission.dto.StaffDtos.StaffStudentSummary;
import com.rgcet.admission.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping("/students")
    public List<StaffStudentSummary> listStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String section,
            @RequestParam(required = false) String status) {
        return staffService.listStudents(search, department, year, section, status);
    }

    @GetMapping("/students/{id}")
    public StaffStudentSummary getStudent(@PathVariable Long id) {
        return staffService.getStudent(id);
    }

    @GetMapping("/students/{id}/personal")
    public StaffPersonalDetails getPersonal(@PathVariable Long id) {
        return staffService.getPersonalDetails(id);
    }

    @GetMapping("/students/{id}/gpa")
    public List<StaffGpaRecord> getGpa(@PathVariable Long id) {
        return staffService.getGpa(id);
    }

    @PostMapping("/students/{id}/gpa")
    public ResponseEntity<StaffGpaRecord> addGpa(@PathVariable Long id, @Valid @RequestBody StaffGpaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(staffService.addGpa(id, request));
    }

    @PutMapping("/gpa/{gpaId}")
    public StaffGpaRecord updateGpa(@PathVariable Long gpaId, @Valid @RequestBody StaffGpaRequest request) {
        return staffService.updateGpa(gpaId, request);
    }

    @GetMapping("/students/{id}/cgpa")
    public List<StaffCgpaRecord> getCgpa(@PathVariable Long id) {
        return staffService.getCgpa(id);
    }

    @PostMapping("/students/{id}/cgpa")
    public ResponseEntity<StaffCgpaRecord> addCgpa(@PathVariable Long id, @Valid @RequestBody StaffCgpaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(staffService.addCgpa(id, request));
    }

    @PutMapping("/cgpa/{cgpaId}")
    public StaffCgpaRecord updateCgpa(@PathVariable Long cgpaId, @Valid @RequestBody StaffCgpaRequest request) {
        return staffService.updateCgpa(cgpaId, request);
    }

    @GetMapping("/students/{id}/arrears")
    public List<StaffArrearRecord> getArrears(@PathVariable Long id) {
        return staffService.getArrears(id);
    }

    @PostMapping("/students/{id}/arrears")
    public ResponseEntity<StaffArrearRecord> addArrear(@PathVariable Long id,
                                                       @RequestBody StaffArrearRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(staffService.addArrear(id, request));
    }

    @PutMapping("/arrears/{arrearId}")
    public StaffArrearRecord updateArrear(@PathVariable Long arrearId, @RequestBody StaffArrearRequest request) {
        return staffService.updateArrear(arrearId, request);
    }

    @DeleteMapping("/arrears/{arrearId}")
    public ResponseEntity<Void> deleteArrear(@PathVariable Long arrearId) {
        staffService.deleteArrear(arrearId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/students/{id}/academic-summary")
    public StaffAcademicSummary getAcademicSummary(@PathVariable Long id) {
        return staffService.getAcademicSummary(id);
    }

    @GetMapping("/active-arrears")
    public List<StaffActiveArrearsRow> getActiveArrears() {
        return staffService.getActiveArrears();
    }

    @GetMapping("/academic-records")
    public List<StaffAcademicRecordRow> getAcademicRecords(@RequestParam Integer semester) {
        return staffService.getAcademicRecords(semester);
    }

    @PostMapping("/academic-records/bulk")
    public StaffBulkAcademicResponse saveAcademicRecords(@Valid @RequestBody StaffBulkAcademicRequest request) {
        return staffService.saveAcademicRecords(request);
    }

    @GetMapping("/dashboard/summary")
    public StaffDashboardSummary getDashboard() {
        return staffService.getDashboard();
    }
}