/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiClient {
  private baseUrl: string = '/api';
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('astracare_auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('astracare_auth_token', token);
      } else {
        localStorage.removeItem('astracare_auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options?.headers,
        },
      });

      const json = await res.json();
      return json;
    } catch (err) {
      console.warn(`[ApiClient] Request to ${endpoint} failed, falling back to client simulation:`, err);
      return { success: false, message: 'Server offline or request failed' };
    }
  }

  // System Health
  async getHealth() {
    return this.request('/health');
  }

  // Auth & Accounts
  async getDemoAccounts() {
    return this.request('/auth/demo-accounts');
  }

  async login(email: string, password?: string) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res && res.success && res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async verifyOtp(phone: string, otp: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  }

  // Dashboard & Vitals
  async getDashboard(userId: string) {
    return this.request(`/dashboard/${userId}`);
  }

  async ingestVitals(data: { userId?: string; heartRate: number; spo2: number; skinTemp: number; hrv: number }) {
    return this.request('/vitals/ingest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Menstrual & Ovulation
  async getCycle(userId: string) {
    return this.request(`/cycle/${userId}`);
  }

  async logPeriodStart(data: {
    userId?: string;
    startDate: string;
    flowIntensity: string;
    painSeverity: number;
    symptoms?: string[];
  }) {
    return this.request('/cycle/log-period', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Nutrition & Hydration
  async getNutrition(userId: string) {
    return this.request(`/nutrition/${userId}`);
  }

  async logWater(userId: string, deltaMl: number) {
    return this.request('/nutrition/water', {
      method: 'POST',
      body: JSON.stringify({ userId, deltaMl }),
    });
  }

  async logMeal(userId: string, meal: { mealName: string; calories: number; protein?: string }) {
    return this.request('/nutrition/meal', {
      method: 'POST',
      body: JSON.stringify({ userId, ...meal }),
    });
  }

  // Medications
  async getMedications(userId: string) {
    return this.request(`/medications/${userId}`);
  }

  async markMedicationTaken(medicationId: string) {
    return this.request('/medications/mark-taken', {
      method: 'POST',
      body: JSON.stringify({ medicationId }),
    });
  }

  async addMedication(data: {
    userId?: string;
    name: string;
    dosage: string;
    time: string;
    instruction?: string;
  }) {
    return this.request('/medications/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Digital Health Twin & Risk Predictor
  async getHealthTwin(userId: string) {
    return this.request(`/health-twin/${userId}`);
  }

  async simulateHealthTwin(sleepDeltaHours: number, stepsDelta: number) {
    return this.request('/health-twin/simulate', {
      method: 'POST',
      body: JSON.stringify({ sleepDeltaHours, stepsDelta }),
    });
  }

  async getRiskAssessment(userId: string) {
    return this.request(`/risk-predictor/${userId}`);
  }

  // Doctor Portal
  async getDoctorPatients() {
    return this.request('/doctor/patients');
  }

  async getPatientConsultations(patientId: string) {
    return this.request(`/doctor/consultations/${patientId}`);
  }

  async saveClinicalNote(note: {
    patientId: string;
    subjective?: string;
    objective?: string;
    assessment: string;
    plan?: string;
    prescriptions?: string[];
  }) {
    return this.request('/doctor/consultations', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  // Admin Governance
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async toggleUserStatus(userId: string) {
    return this.request(`/admin/users/${userId}/toggle-status`, {
      method: 'POST',
    });
  }

  async getAuditLogs() {
    return this.request('/admin/audit-logs');
  }

  async triggerBackup() {
    return this.request('/admin/backup', {
      method: 'POST',
    });
  }

  // Emergency SOS
  async dispatchSos(data: { userId?: string; latitude?: number; longitude?: number; heartRate?: number }) {
    return this.request('/emergency/sos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelSos() {
    return this.request('/emergency/sos/cancel', {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();

