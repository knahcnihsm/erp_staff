import {
  StudentSummary,
  PersonalDetails,
  SemesterGpa,
  Cgpa,
  Arrear,
  AttendanceData,
  AcademicSummary,
  DashboardSummary,
} from '../types';

const now = new Date();

const daysAgo = (n: number): string => {
  const d = new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
  return d.toISOString();
};

export const students: StudentSummary[] = [
  { studentId: 6, regNo: '24TD0064', name: 'Mohankumar S', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 8, regNo: '2026BTECH001', name: 'Student 1', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'B', status: 'ARCHIVED' },
  { studentId: 11, regNo: '24TD0063', name: 'Student 2', department: 'Artificial Intelligence and Data Science (AI&DS)', deptShort: 'AI&DS', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 14, regNo: '24TP0074', name: 'Aarav Sharma', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 15, regNo: '24TP0073', name: 'Ananya', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'B', status: 'ACTIVE' },
  { studentId: 16, regNo: '24TP0072', name: 'Rahul Varma', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 17, regNo: '24TP0071', name: 'Kavya Subramanian', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'B', status: 'ACTIVE' },
  { studentId: 18, regNo: '24TP0070', name: 'Dhruv Patel', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 19, regNo: '24TP0069', name: 'Priya Sundaram', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'B', status: 'ACTIVE' },
  { studentId: 20, regNo: '24TD0068', name: 'Vikramaditya Reddy', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 21, regNo: '24TD0067', name: 'Sneha Venkatesh', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'B', status: 'ACTIVE' },
  { studentId: 22, regNo: '24TD0066', name: 'Karthik Nair', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 23, regNo: '24TD0065', name: 'Divya Iyer', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'B', status: 'ACTIVE' },
  { studentId: 24, regNo: '24TD0062', name: 'Student 6', department: 'Biomedical Engineering (BME)', deptShort: 'BME', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 25, regNo: '24TD0061', name: 'Suresh Kumar R G', department: 'M.Tech Computer Science & Engineering (MTech CSE)', deptShort: 'MTech CSE', year: 3, semester: 5, section: 'A', status: 'ACTIVE' },
  { studentId: 28, regNo: '24TD0062', name: 'Mohan Kumar S', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'B', status: 'ACTIVE' },
  { studentId: 29, regNo: '26BTECH012', name: 'Arun Kumar', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 30, regNo: '24TD0069', name: 'Meena Priya', department: 'Information Technology (IT)', deptShort: 'IT', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 31, regNo: '24TD0068', name: 'Rahul Prakash', department: 'Electronics & Communication Engineering (ECE)', deptShort: 'ECE', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 32, regNo: '24TD0067', name: 'Ananya Ramesh', department: 'Artificial Intelligence and Data Science (AI&DS)', deptShort: 'AI&DS', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 33, regNo: '24TD0066', name: 'Vishnu Raj', department: 'Artificial Intelligence and Machine Learning (AI&ML)', deptShort: 'AI&ML', year: 1, semester: 1, section: 'A', status: 'ACTIVE' },
  { studentId: 34, regNo: '24TD0065', name: 'Karthik Raj', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 2, semester: 3, section: 'A', status: 'ACTIVE' },
  { studentId: 35, regNo: '24TD0064', name: 'Nithya Devi', department: 'Electronics & Communication Engineering (ECE)', deptShort: 'ECE', year: 2, semester: 3, section: 'A', status: 'ACTIVE' },
  { studentId: 36, regNo: '24TD0063', name: 'Sanjay Mohan', department: 'Biomedical Engineering (BME)', deptShort: 'BME', year: 2, semester: 3, section: 'A', status: 'ACTIVE' },
  { studentId: 37, regNo: '24TD0062', name: 'Priyanka Suresh', department: 'Master of Computer Applications (MCA)', deptShort: 'MCA', year: 3, semester: 5, section: 'A', status: 'ACTIVE' },
  { studentId: 38, regNo: '24TD0061', name: 'Aravind Kumar', department: 'M.Tech Computer Science & Engineering (MTech CSE)', deptShort: 'MTech CSE', year: 3, semester: 5, section: 'A', status: 'ACTIVE' },
  { studentId: 39, regNo: '24TD0060', name: 'Akash', department: 'Computer Science & Engineering (CSE)', deptShort: 'CSE', year: 1, semester: 1, section: 'B', status: 'ACTIVE' },
];

const personal: Record<number, PersonalDetails> = {
  6: { studentId: 6, regNo: '24TD0064', applicationNo: 'RGCET/2026/1001', name: 'Mohankumar S', dob: '2007-05-25', gender: 'Male', email: '-', mobile: '-', district: 'Puducherry', caste: 'OBC', aadhaar: '****-****-1012', batch: '2026 - 2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-05' },
  8: { studentId: 8, regNo: '2026BTECH001', applicationNo: 'RGCET/2026/100', name: 'Student 1', dob: '2007-05-25', gender: 'Male', email: '-', mobile: '-', district: 'Puducherry', caste: 'OBC', aadhaar: '****-****-1000', batch: '2026 - 2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-05-25' },
  11: { studentId: 11, regNo: '24TD0063', applicationNo: 'RGCET/2026/1002', name: 'Student 2', dob: '2008-06-11', gender: 'Female', email: '-', mobile: '-', district: 'Villupuram', caste: 'OBC', aadhaar: '****-****-1001', batch: '2026-2030', program: 'First Year B.Tech', department: 'Artificial Intelligence and Data Science (AI&DS)', admissionDate: '2026-05-05' },
  14: { studentId: 14, regNo: '24TP0074', applicationNo: 'RGCET/2026/2001', name: 'Aarav Sharma', dob: '2008-06-10', gender: 'Male', email: '-', mobile: '-', district: 'Karaikal', caste: 'OTHERS', aadhaar: '****-****-1200', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-01' },
  15: { studentId: 15, regNo: '24TP0073', applicationNo: 'RGCET/2026/2002', name: 'Ananya', dob: '2008-06-11', gender: 'Female', email: '-', mobile: '-', district: 'Karaikal', caste: 'OBC', aadhaar: '****-****-1201', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-01' },
  16: { studentId: 16, regNo: '24TP0072', applicationNo: 'RGCET/2026/2003', name: 'Rahul Varma', dob: '2008-06-12', gender: 'Male', email: '-', mobile: '-', district: 'Karaikal', caste: 'SC', aadhaar: '****-****-1202', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-01' },
  17: { studentId: 17, regNo: '24TP0071', applicationNo: 'RGCET/2026/2004', name: 'Kavya Subramanian', dob: '2008-06-13', gender: 'Female', email: '-', mobile: '-', district: 'Karaikal', caste: 'OBC', aadhaar: '****-****-1203', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-01' },
  18: { studentId: 18, regNo: '24TP0070', applicationNo: 'RGCET/2026/2005', name: 'Dhruv Patel', dob: '2008-06-14', gender: 'Male', email: '-', mobile: '-', district: 'Karaikal', caste: 'OBC', aadhaar: '****-****-1204', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-01' },
  19: { studentId: 19, regNo: '24TP0069', applicationNo: 'RGCET/2026/2006', name: 'Priya Sundaram', dob: '2008-06-15', gender: 'Female', email: '-', mobile: '-', district: 'Karaikal', caste: 'OTHERS', aadhaar: '****-****-1205', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-01' },
  20: { studentId: 20, regNo: '24TD0068', applicationNo: 'RGCET/2026/2007', name: 'Vikramaditya Reddy', dob: '2008-06-16', gender: 'Male', email: '-', mobile: '-', district: 'Karaikal', caste: 'OBC', aadhaar: '****-****-1206', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-01' },
  21: { studentId: 21, regNo: '24TD0067', applicationNo: 'RGCET/2026/2008', name: 'Sneha Venkatesh', dob: '2008-06-17', gender: 'Female', email: '-', mobile: '-', district: 'Karaikal', caste: 'OTHERS', aadhaar: '****-****-1207', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-01' },
  22: { studentId: 22, regNo: '24TD0066', applicationNo: 'RGCET/2026/2009', name: 'Karthik Nair', dob: '2008-06-18', gender: 'Male', email: '-', mobile: '-', district: 'Karaikal', caste: 'OTHERS', aadhaar: '****-****-1208', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-01' },
  23: { studentId: 23, regNo: '24TD0065', applicationNo: 'RGCET/2026/2010', name: 'Divya Iyer', dob: '2008-06-19', gender: 'Female', email: '-', mobile: '-', district: 'Karaikal', caste: 'OBC', aadhaar: '****-****-1209', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-01' },
  24: { studentId: 24, regNo: '24TD0062', applicationNo: 'RGCET/2026/1006', name: 'Student 6', dob: '2008-06-15', gender: 'Female', email: '-', mobile: '-', district: 'Nagapattinam', caste: 'OBC', aadhaar: '****-****-1005', batch: '2026-2030', program: 'First Year B.Tech', department: 'Biomedical Engineering (BME)', admissionDate: '2026-01-01' },
  25: { studentId: 25, regNo: '24TD0061', applicationNo: 'RGCET/2026/1098', name: 'Suresh Kumar R G', dob: '2008-01-02', gender: 'Male', email: '-', mobile: '-', district: 'Cuddalore', caste: 'OBC', aadhaar: '****-****-1013', batch: '2026 - 2028', program: 'PG', department: 'M.Tech Computer Science & Engineering (MTech CSE)', admissionDate: '2026-08-06' },
  28: { studentId: 28, regNo: '24TD0062', applicationNo: 'RGCET/2026/1023', name: 'Mohan Kumar S', dob: '2007-05-25', gender: 'Male', email: 'gkmohankumars@gmail.com', mobile: '9514250507', district: 'Puducherry', caste: 'OTHERS', aadhaar: '****-****-1012', batch: '2026 - 2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-09' },
  29: { studentId: 29, regNo: '26BTECH012', applicationNo: 'RGCET/2026/2012', name: 'Arun Kumar', dob: '2008-02-14', gender: 'Male', email: 'arun.kumar@example.com', mobile: '9840112212', district: 'Puducherry', caste: 'OBC', aadhaar: '****-****-1212', batch: '2026-2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-09' },
  30: { studentId: 30, regNo: '24TD0069', applicationNo: 'RGCET/2026/2013', name: 'Meena Priya', dob: '2008-07-21', gender: 'Female', email: 'meena.priya@example.com', mobile: '9840112213', district: 'Cuddalore', caste: 'OTHERS', aadhaar: '****-****-1213', batch: '2026-2030', program: 'First Year B.Tech', department: 'Information Technology (IT)', admissionDate: '2026-08-09' },
  31: { studentId: 31, regNo: '24TD0068', applicationNo: 'RGCET/2026/2014', name: 'Rahul Prakash', dob: '2008-11-03', gender: 'Male', email: 'rahul.prakash@example.com', mobile: '9840112214', district: 'Villupuram', caste: 'OBC', aadhaar: '****-****-1214', batch: '2026-2030', program: 'First Year B.Tech', department: 'Electronics & Communication Engineering (ECE)', admissionDate: '2026-08-09' },
  32: { studentId: 32, regNo: '24TD0067', applicationNo: 'RGCET/2026/2015', name: 'Ananya Ramesh', dob: '2008-04-29', gender: 'Female', email: 'ananya.ramesh@example.com', mobile: '9840112215', district: 'Chennai', caste: 'OTHERS', aadhaar: '****-****-1215', batch: '2026-2030', program: 'First Year B.Tech', department: 'Artificial Intelligence and Data Science (AI&DS)', admissionDate: '2026-08-09' },
  33: { studentId: 33, regNo: '24TD0066', applicationNo: 'RGCET/2026/2016', name: 'Vishnu Raj', dob: '2008-09-12', gender: 'Male', email: 'vishnu.raj@example.com', mobile: '9840112216', district: 'Karaikal', caste: 'OBC', aadhaar: '****-****-1216', batch: '2026-2030', program: 'First Year B.Tech', department: 'Artificial Intelligence and Machine Learning (AI&ML)', admissionDate: '2026-08-09' },
  34: { studentId: 34, regNo: '24TD0065', applicationNo: 'RGCET/2026/3011', name: 'Karthik Raj', dob: '2006-06-18', gender: 'Male', email: 'karthik.raj@example.com', mobile: '9840203011', district: 'Puducherry', caste: 'OBC', aadhaar: '****-****-2211', batch: '2026-2029', program: 'Second Year B.Tech (Lateral Entry)', department: 'Computer Science & Engineering (CSE)', admissionDate: '2026-08-09' },
  35: { studentId: 35, regNo: '24TD0064', applicationNo: 'RGCET/2026/3012', name: 'Nithya Devi', dob: '2006-10-04', gender: 'Female', email: 'nithya.devi@example.com', mobile: '9840203012', district: 'Cuddalore', caste: 'OTHERS', aadhaar: '****-****-2212', batch: '2026-2029', program: 'Second Year B.Tech (Lateral Entry)', department: 'Electronics & Communication Engineering (ECE)', admissionDate: '2026-08-09' },
  36: { studentId: 36, regNo: '24TD0063', applicationNo: 'RGCET/2026/3013', name: 'Sanjay Mohan', dob: '2006-01-27', gender: 'Male', email: 'sanjay.mohan@example.com', mobile: '9840203013', district: 'Villupuram', caste: 'SC', aadhaar: '****-****-2213', batch: '2026-2029', program: 'Second Year B.Tech (Lateral Entry)', department: 'Biomedical Engineering (BME)', admissionDate: '2026-08-09' },
  37: { studentId: 37, regNo: '24TD0062', applicationNo: 'RGCET/2026/4011', name: 'Priyanka Suresh', dob: '2003-08-15', gender: 'Female', email: 'priyanka.suresh@example.com', mobile: '9840304011', district: 'Chennai', caste: 'ST', aadhaar: '****-****-3211', batch: '2026-2028', program: 'PG', department: 'Master of Computer Applications (MCA)', admissionDate: '2026-08-09' },
  38: { studentId: 38, regNo: '24TD0061', applicationNo: 'RGCET/2026/4012', name: 'Aravind Kumar', dob: '2003-12-09', gender: 'Male', email: 'aravind.kumar@example.com', mobile: '9840304012', district: 'Karaikal', caste: 'OBC', aadhaar: '****-****-3212', batch: '2026-2028', program: 'PG', department: 'M.Tech Computer Science & Engineering (MTech CSE)', admissionDate: '2026-08-09' },
  39: { studentId: 39, regNo: '24TD0060', applicationNo: 'RGCET', name: 'Akash', dob: '2007-05-12', gender: 'Male', email: '-', mobile: '1234567890', district: 'Puducherry', caste: 'OBC', aadhaar: '****-****-9098', batch: '2026 - 2030', program: 'First Year B.Tech', department: 'Computer Science & Engineering (CSE)', admissionDate: '2007-08-12' },
};

export const semesterGpaData: SemesterGpa[] = [
  { gpaId: 101, studentId: 6, semesterNumber: 1, semesterGpa: 8.5 },
  { gpaId: 102, studentId: 6, semesterNumber: 2, semesterGpa: 8.7 },
  { gpaId: 103, studentId: 14, semesterNumber: 1, semesterGpa: 9.2 },
  { gpaId: 104, studentId: 14, semesterNumber: 2, semesterGpa: 9.1 },
  { gpaId: 105, studentId: 29, semesterNumber: 1, semesterGpa: 8.9 },
  { gpaId: 106, studentId: 29, semesterNumber: 2, semesterGpa: 8.5 },
  { gpaId: 107, studentId: 34, semesterNumber: 1, semesterGpa: 8.2 },
  { gpaId: 108, studentId: 34, semesterNumber: 2, semesterGpa: 7.6 },
  { gpaId: 109, studentId: 34, semesterNumber: 3, semesterGpa: 7.9 },
  { gpaId: 110, studentId: 35, semesterNumber: 1, semesterGpa: 8.8 },
  { gpaId: 111, studentId: 35, semesterNumber: 2, semesterGpa: 8.1 },
  { gpaId: 112, studentId: 37, semesterNumber: 1, semesterGpa: 8.4 },
  { gpaId: 113, studentId: 37, semesterNumber: 2, semesterGpa: 8.8 },
  { gpaId: 114, studentId: 38, semesterNumber: 1, semesterGpa: 9.0 },
  { gpaId: 115, studentId: 28, semesterNumber: 1, semesterGpa: 8.1 },
  { gpaId: 116, studentId: 30, semesterNumber: 1, semesterGpa: 7.4 },
  { gpaId: 117, studentId: 31, semesterNumber: 1, semesterGpa: 8.6 },
  { gpaId: 118, studentId: 32, semesterNumber: 1, semesterGpa: 8.3 },
  { gpaId: 119, studentId: 33, semesterNumber: 1, semesterGpa: 8.8 },
  { gpaId: 120, studentId: 25, semesterNumber: 1, semesterGpa: 8.7 },
];

export const cgpaData: Cgpa[] = [
  { cgpaId: 201, studentId: 6, cgpa: 8.6 },
  { cgpaId: 202, studentId: 14, cgpa: 9.15 },
  { cgpaId: 203, studentId: 29, cgpa: 8.7 },
  { cgpaId: 204, studentId: 34, cgpa: 7.9 },
  { cgpaId: 205, studentId: 35, cgpa: 8.45 },
  { cgpaId: 206, studentId: 37, cgpa: 8.6 },
  { cgpaId: 207, studentId: 38, cgpa: 9.0 },
  { cgpaId: 208, studentId: 28, cgpa: 8.1 },
  { cgpaId: 209, studentId: 30, cgpa: 7.4 },
  { cgpaId: 210, studentId: 31, cgpa: 8.6 },
  { cgpaId: 211, studentId: 32, cgpa: 8.3 },
  { cgpaId: 212, studentId: 33, cgpa: 8.8 },
  { cgpaId: 213, studentId: 25, cgpa: 8.7 },
];

export const arrearData: Arrear[] = [
  { arrearId: 301, studentId: 6, semesterNumber: 1, subjectName: 'Digital Electronics', examAttempt: 1, arrearStatus: 'ACTIVE', remarks: 'Eligible for Supplementary Exam - Nov 2026' },
  { arrearId: 302, studentId: 14, semesterNumber: 1, subjectName: 'Engineering Mathematics - I', examAttempt: 2, arrearStatus: 'CLEARED', remarks: 'Cleared in Re-exam' },
  { arrearId: 303, studentId: 29, semesterNumber: 1, subjectName: 'Computer Architecture', examAttempt: 2, arrearStatus: 'ACTIVE', remarks: 'Re-exam scheduled' },
  { arrearId: 304, studentId: 34, semesterNumber: 2, subjectName: 'Data Structures', examAttempt: 1, arrearStatus: 'ACTIVE', remarks: 'Supplementary exam pending' },
  { arrearId: 305, studentId: 34, semesterNumber: 3, subjectName: 'Operating Systems', examAttempt: 1, arrearStatus: 'ACTIVE', remarks: 'Supplementary exam pending' },
  { arrearId: 306, studentId: 34, semesterNumber: 1, subjectName: 'Mathematics II', examAttempt: 2, arrearStatus: 'CLEARED', remarks: 'Cleared in Re-exam' },
  { arrearId: 307, studentId: 35, semesterNumber: 2, subjectName: 'Signals & Systems', examAttempt: 1, arrearStatus: 'ACTIVE', remarks: 'Supplementary exam pending' },
  { arrearId: 308, studentId: 37, semesterNumber: 1, subjectName: 'Financial Accounting', examAttempt: 1, arrearStatus: 'CLEARED', remarks: 'Cleared' },
  { arrearId: 309, studentId: 37, semesterNumber: 2, subjectName: 'Marketing Management', examAttempt: 2, arrearStatus: 'CLEARED', remarks: 'Cleared in Re-exam' },
  { arrearId: 310, studentId: 25, semesterNumber: 1, subjectName: 'Advanced Computer Networks', examAttempt: 1, arrearStatus: 'CLEARED', remarks: 'Cleared' },
];

const rand = (seed: number, min: number, max: number): number => {
  const x = Math.sin(seed * 999) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
};

export const attendanceData: Record<number, AttendanceData> = {};
for (const s of students) {
  const semesterCount = Math.min(8, s.year * 2);
  const records = [];
  for (let sem = 1; sem <= semesterCount; sem += 1) {
    const total = rand(s.studentId * 7 + sem, 28, 32);
    const present = total - rand(s.studentId * 11 + sem, 1, 4);
    records.push({ semesterNumber: sem, present, total });
  }
  const totalPresent = records.reduce((acc, r) => acc + r.present, 0);
  const totalAll = records.reduce((acc, r) => acc + r.total, 0);
  attendanceData[s.studentId] = {
    studentId: s.studentId,
    overall: Math.round((totalPresent / totalAll) * 1000) / 10,
    records,
  };
}

export const recentUpdates = [
  { id: 1, regNo: '26BTECH012', studentId: 29, studentName: 'Arun Kumar', type: 'GPA' as const, description: 'Semester 2 GPA added (8.5)', updatedAt: daysAgo(1) },
  { id: 2, regNo: '24TD0065', studentId: 34, studentName: 'Karthik Raj', type: 'CGPA' as const, description: 'Year 1 CGPA updated (7.9)', updatedAt: daysAgo(2) },
  { id: 3, regNo: '24TD0069', studentId: 30, studentName: 'Meena Priya', type: 'Arrear' as const, description: 'Supplementary exam recorded for Computer Networks', updatedAt: daysAgo(3) },
  { id: 4, regNo: '24TD0006', studentId: 6, studentName: 'Mohankumar S', type: 'CGPA' as const, description: 'Year 1 CGPA added (8.6)', updatedAt: daysAgo(5) },
  { id: 5, regNo: '24TD0062', studentId: 37, studentName: 'Priyanka Suresh', type: 'Arrear' as const, description: 'Arrear cleared - Marketing Management', updatedAt: daysAgo(6) },
  { id: 6, regNo: '24TD0065', studentId: 34, studentName: 'Karthik Raj', type: 'GPA' as const, description: 'Semester 3 GPA added (7.9)', updatedAt: daysAgo(8) },
];

export const dashboardSummary: DashboardSummary = {
  totalStudents: students.length,
  activeStudents: students.filter((s) => s.status === 'ACTIVE').length,
  activeArrears: arrearData.filter((a) => a.arrearStatus === 'ACTIVE').length,
  recentUpdates,
};

export interface PersonalDetailsMap {
  [key: number]: PersonalDetails;
}

export const personalDetailsMap: PersonalDetailsMap = personal;

export const getAcademicSummary = (studentId: number): AcademicSummary => {
  const gpas = semesterGpaData.filter((g) => g.studentId === studentId);
  const cgpas = cgpaData.filter((c) => c.studentId === studentId);
  const arrears = arrearData.filter((a) => a.studentId === studentId);
  return {
    latestGpa: gpas.length ? gpas[gpas.length - 1].semesterGpa : 0,
    latestCgpa: cgpas.length ? cgpas[cgpas.length - 1].cgpa : null,
    activeArrears: arrears.filter((a) => a.arrearStatus === 'ACTIVE').length,
    clearedArrears: arrears.filter((a) => a.arrearStatus === 'CLEARED').length,
  };
};