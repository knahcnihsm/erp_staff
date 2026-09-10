export interface StudentSummary {
  studentId: number;
  regNo: string;
  name: string;
  department: string;
  deptShort: string;
  year: number;
  section: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface PersonalDetails {
  studentId: number;
  regNo: string;
  applicationNo: string;
  name: string;
  dob: string;
  gender: string;
  email: string;
  mobile: string;
  district: string;
  caste: string;
  aadhaar: string;
  batch: string;
  program: string;
  department: string;
  admissionDate: string;
}

export type ArrearStatus = 'ACTIVE' | 'CLEARED';

export interface SemesterGpa {
  gpaId: number;
  studentId: number;
  semesterNumber: number;
  academicYear: string;
  semesterGpa: number;
}

export interface YearCgpa {
  cgpaId: number;
  studentId: number;
  yearNumber: number;
  academicYear: string;
  cgpa: number;
}

export interface Arrear {
  arrearId: number;
  studentId: number;
  semesterNumber: number;
  subjectName: string;
  examAttempt: number;
  arrearStatus: ArrearStatus;
  remarks: string;
}

export interface AttendanceRecord {
  semesterNumber: number;
  present: number;
  total: number;
}

export interface AttendanceData {
  studentId: number;
  overall: number;
  records: AttendanceRecord[];
}

export interface AcademicSummary {
  latestGpa: number;
  latestCgpa: number;
  activeArrears: number;
  clearedArrears: number;
}

export interface RecentUpdate {
  id: number;
  regNo: string;
  studentId: number;
  studentName: string;
  type: 'GPA' | 'CGPA' | 'Arrear';
  description: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalStudents: number;
  activeStudents: number;
  activeArrears: number;
  recentUpdates: RecentUpdate[];
}