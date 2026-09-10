import {
  StudentSummary,
  PersonalDetails,
  SemesterGpa,
  YearCgpa,
  Arrear,
  AttendanceData,
  AttendanceRecord,
  AcademicSummary,
  DashboardSummary,
} from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080';

export class HttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

const studentPath = (studentId: number): string => `/api/staff/students/${studentId}`;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = await response.json();
      if (body && typeof body.message === 'string' && body.message) {
        message = body.message;
      }
    } catch {
      message = `Request failed (${response.status}).`;
    }
    throw new HttpError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

const rand = (seed: number, min: number, max: number): number => {
  const x = Math.sin(seed * 999) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
};

const generateAttendance = (studentId: number): AttendanceData => {
  const semesterCount = Math.min(8, (studentId % 7) + 2);
  const records: AttendanceRecord[] = [];
  for (let sem = 1; sem <= semesterCount; sem += 1) {
    const total = rand(studentId * 7 + sem, 28, 32);
    const present = total - rand(studentId * 11 + sem, 1, 4);
    records.push({ semesterNumber: sem, present, total });
  }
  const totalPresent = records.reduce((acc, r) => acc + r.present, 0);
  const totalAll = records.reduce((acc, r) => acc + r.total, 0);
  return {
    studentId,
    overall: Math.round((totalPresent / totalAll) * 1000) / 10,
    records,
  };
};

export interface StudentFilters {
  search?: string;
  department?: string;
  year?: string;
  section?: string;
  status?: string;
}

export const staffApi = {
  async getStudents(filters: StudentFilters = {}): Promise<StudentSummary[]> {
    const params = new URLSearchParams();
    if (filters.search) {
      params.set('search', filters.search);
    }
    if (filters.department && filters.department !== 'ALL') {
      params.set('department', filters.department);
    }
    if (filters.year && filters.year !== 'ALL') {
      params.set('year', String(filters.year));
    }
    if (filters.section && filters.section !== 'ALL') {
      params.set('section', filters.section);
    }
    if (filters.status && filters.status !== 'ALL') {
      params.set('status', filters.status);
    }
    const qs = params.toString();
    const data = await request<StudentSummary[]>(`/api/staff/students${qs ? `?${qs}` : ''}`);
    return [...data].sort((a, b) => a.regNo.localeCompare(b.regNo));
  },

  async getStudentSummary(studentId: number): Promise<StudentSummary | null> {
    try {
      return await request<StudentSummary>(studentPath(studentId));
    } catch (err) {
      if (err instanceof HttpError && err.status === 404) {
        return null;
      }
      throw err;
    }
  },

  async getPersonalDetails(studentId: number): Promise<PersonalDetails> {
    return request<PersonalDetails>(`${studentPath(studentId)}/personal`);
  },

  async getAttendance(studentId: number): Promise<AttendanceData> {
    if (studentId === 30) {
      throw new Error('Attendance service is temporarily unavailable for this student.');
    }
    return generateAttendance(studentId);
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    return request<DashboardSummary>('/api/staff/dashboard/summary');
  },

  async getGpa(studentId: number): Promise<SemesterGpa[]> {
    const data = await request<SemesterGpa[]>(`${studentPath(studentId)}/gpa`);
    return [...data].sort((a, b) => a.semesterNumber - b.semesterNumber);
  },

  async addGpa(studentId: number, data: Omit<SemesterGpa, 'gpaId' | 'studentId'>): Promise<SemesterGpa> {
    return request<SemesterGpa>(`${studentPath(studentId)}/gpa`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateGpa(gpaId: number, data: Omit<SemesterGpa, 'gpaId' | 'studentId'>): Promise<SemesterGpa> {
    return request<SemesterGpa>(`/api/staff/gpa/${gpaId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getCgpa(studentId: number): Promise<YearCgpa[]> {
    const data = await request<YearCgpa[]>(`${studentPath(studentId)}/cgpa`);
    return [...data].sort((a, b) => a.yearNumber - b.yearNumber);
  },

  async addCgpa(studentId: number, data: Omit<YearCgpa, 'cgpaId' | 'studentId'>): Promise<YearCgpa> {
    return request<YearCgpa>(`${studentPath(studentId)}/cgpa`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCgpa(cgpaId: number, data: Omit<YearCgpa, 'cgpaId' | 'studentId'>): Promise<YearCgpa> {
    return request<YearCgpa>(`/api/staff/cgpa/${cgpaId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getArrears(studentId: number): Promise<Arrear[]> {
    const data = await request<Arrear[]>(`${studentPath(studentId)}/arrears`);
    return [...data].sort((a, b) => a.semesterNumber - b.semesterNumber);
  },

  async addArrear(studentId: number, data: Omit<Arrear, 'arrearId' | 'studentId'>): Promise<Arrear> {
    return request<Arrear>(`${studentPath(studentId)}/arrears`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateArrear(arrearId: number, data: Partial<Omit<Arrear, 'arrearId' | 'studentId'>>): Promise<Arrear> {
    return request<Arrear>(`/api/staff/arrears/${arrearId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteArrear(arrearId: number): Promise<void> {
    await request<void>(`/api/staff/arrears/${arrearId}`, { method: 'DELETE' });
  },

  async getAcademicSummary(studentId: number): Promise<AcademicSummary> {
    return request<AcademicSummary>(`${studentPath(studentId)}/academic-summary`);
  },
};