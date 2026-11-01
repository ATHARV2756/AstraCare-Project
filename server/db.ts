/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

export interface DbState {
  users: any[];
  biometric_profiles: any[];
  menstrual_logs: any[];
  ovulation_records: any[];
  vitals_telemetry: any[];
  sleep_sessions: any[];
  nutrition_logs: any[];
  activity_logs: any[];
  mental_wellness_logs: any[];
  medications: any[];
  medication_adherence: any[];
  ai_conversations: any[];
  ai_risk_assessments: any[];
  digital_health_twins: any[];
  emergency_sos_events: any[];
  emergency_contacts: any[];
  doctors: any[];
  clinical_consultations: any[];
  health_reports: any[];
  audit_logs: any[];
  astraband_devices: any[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'database', 'data_store.json');

const INITIAL_SEED: DbState = {
  users: [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      password: 'password123',
      role: 'patient',
      status: 'active',
      language_preference: 'en',
      created_at: '2026-01-10T00:00:00Z',
    },
    {
      id: 'b2222222-2222-2222-2222-222222222222',
      email: 'ananya@example.com',
      phone: '+91 91234 56789',
      password: 'password123',
      role: 'patient',
      status: 'active',
      language_preference: 'en',
      created_at: '2026-02-15T00:00:00Z',
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      email: 'dr.mehta@bombayhospital.org',
      phone: '+91 98200 12345',
      password: 'password123',
      role: 'doctor',
      status: 'active',
      language_preference: 'en',
      created_at: '2025-11-01T00:00:00Z',
    },
    {
      id: 'e5555555-5555-5555-5555-555555555555',
      email: 'admin@womenshealth.internal',
      phone: '+91 90000 00000',
      password: 'adminpassword',
      role: 'admin',
      status: 'active',
      language_preference: 'en',
      created_at: '2025-01-01T00:00:00Z',
    },
  ],
  biometric_profiles: [
    {
      id: 'bp-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      full_name: 'Priya Sharma',
      dob: '1998-05-14',
      height_cm: 165,
      weight_kg: 58,
      blood_group: 'O+',
      city: 'Mumbai',
      life_stage: 'reproductive',
      existing_conditions: ['PCOS', 'Iron Deficiency'],
      allergies: ['Penicillin', 'Peanuts'],
      active_medications: ['Metformin 500mg', 'Vitamin D3 2000IU'],
      cycle_length: 28,
      last_period_date: '2026-10-15',
    },
    {
      id: 'bp-2',
      user_id: 'b2222222-2222-2222-2222-222222222222',
      full_name: 'Ananya Patel',
      dob: '1994-08-22',
      height_cm: 160,
      weight_kg: 64,
      blood_group: 'B+',
      city: 'Bengaluru',
      life_stage: 'pregnancy',
      existing_conditions: ['Gestational Diabetes Risk', 'Mild Thyroid'],
      allergies: ['Dust Mites', 'Sulfa Drugs'],
      active_medications: ['Prenatal Multivitamin', 'Folic Acid 5mg'],
      gestational_week: 24,
      due_date: '2027-02-14',
    },
  ],
  menstrual_logs: [
    {
      id: 'ml-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      start_date: '2026-10-15',
      end_date: '2026-10-20',
      cycle_length_days: 28,
      period_duration_days: 5,
      flow_intensity: 'medium',
      pain_severity: 4,
      symptoms: ['Mild lower abdominal cramping', 'Fatigue'],
      created_at: '2026-10-15T08:00:00Z',
    },
  ],
  ovulation_records: [
    {
      id: 'ov-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      ovulation_date: '2026-10-29',
      fertile_window_start: '2026-10-26',
      fertile_window_end: '2026-10-31',
      lh_surge_detected: true,
      cervical_mucus_type: 'egg_white',
      bbt_celsius: 36.8,
    },
  ],
  astraband_devices: [
    {
      id: 'dev-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      serial_number: 'ASTRA-5340-9842',
      ble_mac_address: 'C4:D8:F9:3B:11:A2',
      battery_pct: 84,
      firmware_version: 'v2.4.1-rc',
      connection_status: 'connected',
      last_sync_timestamp: new Date().toISOString(),
    },
  ],
  vitals_telemetry: [
    {
      id: 'vit-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      heart_rate_bpm: 68,
      spo2_pct: 99.1,
      skin_temp_c: 36.6,
      hrv_sdnn_ms: 58,
      bp_systolic: 118,
      bp_diastolic: 76,
      timestamp: new Date().toISOString(),
    },
  ],
  sleep_sessions: [
    {
      id: 'slp-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      session_date: '2026-10-30',
      total_duration_mins: 455, // 7h 35m
      deep_sleep_mins: 105, // 1h 45m
      rem_sleep_mins: 115, // 1h 55m
      light_sleep_mins: 235, // 3h 55m
      restorative_pct: 86,
      sleep_score: 88,
    },
  ],
  nutrition_logs: [
    {
      id: 'nut-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      log_date: '2026-10-31',
      water_intake_ml: 1750,
      calories_kcal: 1840,
      protein_g: 62.0,
      carbs_g: 210.0,
      fats_g: 52.0,
      meals: [
        { id: 'm1', name: 'Spinach & Moong Dal Cheela with Mint Chutney', time: '08:30 AM', cal: 320, protein: '14g' },
        { id: 'm2', name: 'Brown Rice Khichdi with Steamed Broccoli & Curd', time: '01:15 PM', cal: 480, protein: '18g' },
        { id: 'm3', name: 'Roasted Flaxseed Makhana & Herbal Chamomile Tea', time: '05:00 PM', cal: 160, protein: '6g' },
      ],
    },
  ],
  activity_logs: [
    {
      id: 'act-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      log_date: '2026-10-31',
      step_count: 8420,
      active_calories_kcal: 430,
      active_duration_mins: 75,
      activity_type: 'Brisk Walking & Hatha Yoga',
    },
  ],
  mental_wellness_logs: [
    {
      id: 'mw-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      log_date: '2026-10-31',
      mood_state: 'calm',
      stress_level_1_10: 3,
      journal_entry: 'Feeling centered today. Completed evening 4-7-8 breathing session.',
      breathing_completed: true,
    },
  ],
  medications: [
    {
      id: 'med-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      medication_name: 'Metformin',
      dosage: '500 mg',
      frequency: 'Once Daily',
      scheduled_time: '08:30 AM',
      instruction: 'With breakfast',
      status: 'taken',
    },
    {
      id: 'med-2',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      medication_name: 'Vitamin D3 & K2',
      dosage: '2,000 IU',
      frequency: 'Once Daily',
      scheduled_time: '01:00 PM',
      instruction: 'After lunch',
      status: 'taken',
    },
    {
      id: 'med-3',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      medication_name: 'Iron (Ferrous Ascorbate)',
      dosage: '100 mg',
      frequency: 'Once Daily',
      scheduled_time: '09:00 PM',
      instruction: 'Before sleep with citrus water',
      status: 'pending',
    },
  ],
  medication_adherence: [
    {
      id: 'ma-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      scheduled_date: '2026-10-31',
      compliance_pct: 67,
      streak_days: 14,
    },
  ],
  ai_conversations: [],
  ai_risk_assessments: [
    {
      id: 'ara-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      assessment_date: '2026-10-31',
      pcos_risk_pct: 14,
      gestational_diabetes_risk_pct: 8,
      cardiovascular_risk_level: 'Optimal',
      thyroid_risk_level: 'Low',
      contributing_factors: {
        cycle_regularity: 'High',
        resting_hr: 'Normal (68 bpm)',
        hrv_stability: '58 ms',
      },
    },
  ],
  digital_health_twins: [
    {
      id: 'dht-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      vitality_score: 85,
      biological_age_delta: -1.8,
      hormonal_stability_pct: 84,
      allostatic_resilience_pct: 78,
      endocrine_score: 84,
      sleep_score: 88,
      cardio_score: 91,
      last_updated: new Date().toISOString(),
    },
  ],
  emergency_sos_events: [],
  emergency_contacts: [
    {
      id: 'ec-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      contact_name: 'Rahul Sharma',
      relationship: 'Spouse',
      phone_number: '+91 98765 00001',
      is_primary: true,
    },
    {
      id: 'ec-2',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      contact_name: 'Dr. Anjali Mehta',
      relationship: 'Gynecologist',
      phone_number: '+91 98765 00002',
      is_primary: false,
    },
  ],
  doctors: [
    {
      id: 'd4444444-4444-4444-4444-444444444444',
      user_id: 'c3333333-3333-3333-3333-333333333333',
      full_name: 'Dr. Anjali Mehta, MD',
      registration_number: 'MCI-Reg #74829-MH',
      specialization: 'Obstetrics & Gynecology',
      hospital_affiliation: 'Bombay Hospital & Medical Research Centre',
      verification_status: 'verified',
    },
  ],
  clinical_consultations: [
    {
      id: 'cn-1',
      doctor_id: 'd4444444-4444-4444-4444-444444444444',
      patient_id: 'a1111111-1111-1111-1111-111111111111',
      consultation_date: '2026-10-24',
      doctor_name: 'Dr. Anjali Mehta, MD',
      specialty: 'Obstetrics & Gynecology',
      subjective_notes: 'Patient reports mild dysmenorrhea during luteal-to-menstrual transition. Adhering to Metformin.',
      objective_vitals: 'BP 118/76 mmHg. Resting HR 68 bpm. SpO2 99%. HRV baseline 58ms stable.',
      assessment: 'PCOS phenotypic presentation well-regulated under current lifestyle sync and inositol support.',
      treatment_plan: 'Continue Metformin 500mg OD. Recheck fasting insulin & HbA1c in 6 weeks.',
      prescriptions: ['Metformin 500mg (Post breakfast)', 'Vitamin D3 2000IU daily', 'Myo-Inositol 2000mg'],
      status: 'signed',
    },
  ],
  health_reports: [
    {
      id: 'rep-1',
      user_id: 'a1111111-1111-1111-1111-111111111111',
      report_title: 'Comprehensive Telemetry & Ovulation Report — October 2026',
      report_period: 'Oct 01 - Oct 31, 2026',
      doctor_approved: true,
      summary_text: 'Optimal baseline across 30 days. No malignant arrhythmias or nocturnal desaturations.',
      created_at: '2026-10-31T10:00:00Z',
    },
  ],
  audit_logs: [
    {
      id: 'log-101',
      timestamp: '2026-10-31 20:45:12',
      actor_email: 'priya@example.com',
      actor_role: 'Patient',
      action_event: 'CYCLE_LOG_ENTRY_CREATED',
      module_code: 'M2_CYCLE_TRACKING',
      ip_address: '103.21.124.89 (Mumbai, IN)',
      status: 'SUCCESS',
    },
    {
      id: 'log-102',
      timestamp: '2026-10-31 20:38:04',
      actor_email: 'ananya@example.com',
      actor_role: 'Patient',
      action_event: 'AI_ASSISTANT_QUERY_SUBMITTED',
      module_code: 'M4_AI_HEALTH_ASSISTANT',
      ip_address: '117.195.42.10 (Bengaluru, IN)',
      status: 'SUCCESS',
    },
    {
      id: 'log-103',
      timestamp: '2026-10-31 20:15:55',
      actor_email: 'dr.mehta@bombayhospital.org',
      actor_role: 'Doctor',
      action_event: 'CLINICAL_NOTE_SIGNED_M14',
      module_code: 'M14_DOCTORS_CONSOLE',
      ip_address: '14.139.122.5 (Mumbai, IN)',
      status: 'SUCCESS',
    },
  ],
};

class DatabaseManager {
  private state: DbState;

  constructor() {
    this.state = this.load();
  }

  private load(): DbState {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing data_store.json, initializing fresh seed.', e);
    }
    // ensure dir exists
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.save(INITIAL_SEED);
    return INITIAL_SEED;
  }

  public save(customState?: DbState) {
    try {
      const data = customState || this.state;
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save to data_store.json', e);
    }
  }

  public getState(): DbState {
    return this.state;
  }

  public appendAuditLog(entry: {
    actor_email: string;
    actor_role: string;
    action_event: string;
    module_code: string;
    ip_address?: string;
    status?: string;
  }) {
    const log = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor_email: entry.actor_email,
      actor_role: entry.actor_role,
      action_event: entry.action_event,
      module_code: entry.module_code,
      ip_address: entry.ip_address || '127.0.0.1',
      status: entry.status || 'SUCCESS',
    };
    this.state.audit_logs.unshift(log);
    this.save();
    return log;
  }
}

export const db = new DatabaseManager();

