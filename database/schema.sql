-- ============================================================================
-- AI-BASED WOMEN'S HEALTH TRACKER & ASTRABAND PLATFORM
-- Relational Database Schema Specification (PostgreSQL / Supabase DDL)
-- Project Report Chapter 5 (Tables 5.1 through 5.21)
-- ============================================================================

-- Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USER & SECURITY MANAGEMENT
-- ============================================================================

-- Table 5.1: Users Master Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'patient', -- 'patient', 'doctor', 'admin'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'pending_verification'
    language_preference VARCHAR(10) NOT NULL DEFAULT 'en', -- 'en', 'hi'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.2: Biometric Profiles Table
CREATE TABLE IF NOT EXISTS biometric_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    height_cm NUMERIC(5, 2) NOT NULL,
    weight_kg NUMERIC(5, 2) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    life_stage VARCHAR(50) NOT NULL, -- 'adolescence', 'reproductive', 'pregnancy', 'postpartum', 'menopause'
    existing_conditions TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    active_medications TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.16: Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. REPRODUCTIVE & LIFE STAGE HEALTH
-- ============================================================================

-- Table 5.3: Menstrual Cycle Logs Table
CREATE TABLE IF NOT EXISTS menstrual_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    cycle_length_days INT NOT NULL DEFAULT 28,
    period_duration_days INT NOT NULL DEFAULT 5,
    flow_intensity VARCHAR(50) NOT NULL, -- 'spotting', 'light', 'medium', 'heavy'
    pain_severity INT CHECK (pain_severity BETWEEN 0 AND 10),
    symptoms TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.4: Ovulation & Fertility Records Table
CREATE TABLE IF NOT EXISTS ovulation_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ovulation_date DATE NOT NULL,
    fertile_window_start DATE NOT NULL,
    fertile_window_end DATE NOT NULL,
    lh_surge_detected BOOLEAN DEFAULT false,
    cervical_mucus_type VARCHAR(50), -- 'dry', 'sticky', 'creamy', 'egg_white'
    bbt_celsius NUMERIC(4, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. ASTRABAND WEARABLE & BIOSENSORS TELEMETRY
-- ============================================================================

-- Table 5.21: AstraBand Devices Master Table
CREATE TABLE IF NOT EXISTS astraband_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    ble_mac_address VARCHAR(50) UNIQUE NOT NULL,
    soc_chipset VARCHAR(50) DEFAULT 'Nordic nRF5340 Dual-Core',
    battery_pct INT DEFAULT 84 CHECK (battery_pct BETWEEN 0 AND 100),
    firmware_version VARCHAR(50) DEFAULT 'v2.4.1-rc',
    connection_status VARCHAR(50) DEFAULT 'connected', -- 'connected', 'scanning', 'disconnected'
    last_sync_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.5: Vitals Telemetry Ingest Table (High Frequency)
CREATE TABLE IF NOT EXISTS vitals_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES astraband_devices(id) ON DELETE SET NULL,
    heart_rate_bpm INT NOT NULL,
    spo2_pct NUMERIC(5, 2) NOT NULL,
    skin_temp_c NUMERIC(4, 2) NOT NULL,
    hrv_sdnn_ms INT NOT NULL,
    bp_systolic INT DEFAULT 120,
    bp_diastolic INT DEFAULT 80,
    ecg_quality_index NUMERIC(3, 2) DEFAULT 0.98,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_vitals_user_time ON vitals_telemetry(user_id, timestamp DESC);

-- ============================================================================
-- 4. SLEEP, FITNESS & NUTRITION MANAGEMENT
-- ============================================================================

-- Table 5.6: Sleep Architecture Sessions Table
CREATE TABLE IF NOT EXISTS sleep_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    total_duration_mins INT NOT NULL,
    deep_sleep_mins INT NOT NULL,
    rem_sleep_mins INT NOT NULL,
    light_sleep_mins INT NOT NULL,
    restorative_pct INT CHECK (restorative_pct BETWEEN 0 AND 100),
    sleep_score INT CHECK (sleep_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.7: Nutrition & Hydration Logs Table
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    water_intake_ml INT NOT NULL DEFAULT 0,
    calories_kcal INT NOT NULL DEFAULT 0,
    protein_g NUMERIC(5, 1) DEFAULT 0,
    carbs_g NUMERIC(5, 1) DEFAULT 0,
    fats_g NUMERIC(5, 1) DEFAULT 0,
    meal_name VARCHAR(255),
    meal_type VARCHAR(50), -- 'breakfast', 'lunch', 'snack', 'dinner'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.8: Physical Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    step_count INT NOT NULL DEFAULT 0,
    active_calories_kcal INT NOT NULL DEFAULT 0,
    active_duration_mins INT NOT NULL DEFAULT 0,
    activity_type VARCHAR(100) DEFAULT 'walking',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.9: Mental Health & Wellness Logs Table
CREATE TABLE IF NOT EXISTS mental_wellness_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    mood_state VARCHAR(50) NOT NULL, -- 'energized', 'calm', 'neutral', 'anxious', 'exhausted'
    stress_level_1_10 INT CHECK (stress_level_1_10 BETWEEN 1 AND 10),
    journal_entry TEXT,
    breathing_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. MEDICATION & HEALTH REMINDERS
-- ============================================================================

-- Table 5.10: Medications Master Table
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    scheduled_time VARCHAR(20) NOT NULL,
    instruction VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'discontinued'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.11: Medication Adherence Logs Table
CREATE TABLE IF NOT EXISTS medication_adherence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    taken_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL, -- 'taken', 'skipped', 'snoozed', 'missed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. AI INTELLIGENCE, ASSISTANT & RISK PREDICTION
-- ============================================================================

-- Table 5.12: AI Assistant Conversations Table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL,
    sender VARCHAR(20) NOT NULL, -- 'user', 'assistant'
    message_text TEXT NOT NULL,
    is_emergency_flag BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.13: AI Disease Risk Assessments Table
CREATE TABLE IF NOT EXISTS ai_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL,
    pcos_risk_pct NUMERIC(5, 2) NOT NULL,
    gestational_diabetes_risk_pct NUMERIC(5, 2) NOT NULL,
    cardiovascular_risk_level VARCHAR(50) NOT NULL,
    thyroid_risk_level VARCHAR(50) NOT NULL,
    contributing_factors JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.14: Digital Health Twin State Table
CREATE TABLE IF NOT EXISTS digital_health_twins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vitality_score INT CHECK (vitality_score BETWEEN 0 AND 100),
    biological_age_delta NUMERIC(4, 1), -- e.g. -1.8 years
    hormonal_stability_pct INT CHECK (hormonal_stability_pct BETWEEN 0 AND 100),
    allostatic_resilience_pct INT CHECK (allostatic_resilience_pct BETWEEN 0 AND 100),
    endocrine_score INT DEFAULT 84,
    sleep_score INT DEFAULT 88,
    cardio_score INT DEFAULT 91,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. EMERGENCY SOS & SAFETY
-- ============================================================================

-- Table 5.15: Emergency SOS Incidents Table
CREATE TABLE IF NOT EXISTS emergency_sos_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    gps_latitude NUMERIC(10, 7),
    gps_longitude NUMERIC(10, 7),
    heart_rate_at_trigger INT,
    status VARCHAR(50) DEFAULT 'dispatched', -- 'countdown', 'dispatched', 'cancelled', 'resolved'
    dispatched_recipients JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. CLINICAL DOCTOR CONSOLE & REPORTS
-- ============================================================================

-- Table 5.17: Doctors Directory Table
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    hospital_affiliation VARCHAR(255) NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.18: Clinical Consultations & Notes Table
CREATE TABLE IF NOT EXISTS clinical_consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consultation_date DATE NOT NULL,
    subjective_notes TEXT,
    objective_vitals TEXT,
    assessment TEXT NOT NULL,
    treatment_plan TEXT NOT NULL,
    prescriptions TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'signed', -- 'draft', 'signed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 5.19: Health Diagnostic Reports Table
CREATE TABLE IF NOT EXISTS health_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_title VARCHAR(255) NOT NULL,
    report_period VARCHAR(100) NOT NULL,
    doctor_approved BOOLEAN DEFAULT false,
    signed_by_doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    summary_text TEXT,
    pdf_download_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 9. ADMIN GOVERNANCE & SECURITY AUDIT
-- ============================================================================

-- Table 5.20: Security & Compliance Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action_event VARCHAR(100) NOT NULL,
    module_code VARCHAR(50) NOT NULL,
    ip_address VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS'
);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);

-- ============================================================================
-- SEED INITIAL CLINICAL DEMO ACCOUNTS
-- ============================================================================

-- Seed 1: Priya Sharma (Reproductive Age - PCOS Focus)
INSERT INTO users (id, email, phone, password_hash, role, status, language_preference)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'priya@example.com',
    '+91 98765 43210',
    crypt('password123', gen_salt('bf')),
    'patient',
    'active',
    'en'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO biometric_profiles (user_id, full_name, dob, height_cm, weight_kg, blood_group, city, life_stage, existing_conditions, allergies, active_medications)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'Priya Sharma',
    '1998-05-14',
    165.0,
    58.0,
    'O+',
    'Mumbai',
    'reproductive',
    ARRAY['PCOS', 'Iron Deficiency'],
    ARRAY['Penicillin', 'Peanuts'],
    ARRAY['Metformin 500mg', 'Vitamin D3 2000IU']
) ON CONFLICT DO NOTHING;

-- Seed 2: Ananya Patel (Pregnancy Journey - Week 24)
INSERT INTO users (id, email, phone, password_hash, role, status, language_preference)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'ananya@example.com',
    '+91 91234 56789',
    crypt('password123', gen_salt('bf')),
    'patient',
    'active',
    'en'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO biometric_profiles (user_id, full_name, dob, height_cm, weight_kg, blood_group, city, life_stage, existing_conditions, allergies, active_medications)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'Ananya Patel',
    '1994-08-22',
    160.0,
    64.0,
    'B+',
    'Bengaluru',
    'pregnancy',
    ARRAY['Gestational Diabetes Risk', 'Mild Thyroid'],
    ARRAY['Dust Mites', 'Sulfa Drugs'],
    ARRAY['Prenatal Multivitamin', 'Folic Acid 5mg']
) ON CONFLICT DO NOTHING;

-- Seed 3: Dr. Anjali Mehta, MD (Clinician)
INSERT INTO users (id, email, phone, password_hash, role, status, language_preference)
VALUES (
    'c3333333-3333-3333-3333-333333333333',
    'dr.mehta@bombayhospital.org',
    '+91 98200 12345',
    crypt('password123', gen_salt('bf')),
    'doctor',
    'active',
    'en'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO doctors (id, user_id, full_name, registration_number, specialization, hospital_affiliation, verification_status)
VALUES (
    'd4444444-4444-4444-4444-444444444444',
    'c3333333-3333-3333-3333-333333333333',
    'Dr. Anjali Mehta, MD',
    'MCI-Reg #74829-MH',
    'Obstetrics & Gynecology',
    'Bombay Hospital & Medical Research Centre',
    'verified'
) ON CONFLICT DO NOTHING;

-- Seed 4: System Superadmin
INSERT INTO users (id, email, phone, password_hash, role, status, language_preference)
VALUES (
    'e5555555-5555-5555-5555-555555555555',
    'admin@womenshealth.internal',
    '+91 90000 00000',
    crypt('adminpassword', gen_salt('bf')),
    'admin',
    'active',
    'en'
) ON CONFLICT (email) DO NOTHING;

