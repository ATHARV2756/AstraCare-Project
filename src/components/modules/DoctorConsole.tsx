/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Stethoscope,
  UserCheck,
  FileText,
  Calendar,
  Clock,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Send,
  Plus,
  Shield,
  Phone,
  Mail,
  Download,
  Share2,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../data/demoAccounts';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/apiClient';

interface ClinicalNote {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  specialty: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  prescriptions: string[];
  status: 'signed' | 'draft';
}

export default function DoctorConsole() {
  const { user } = useApp();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    user?.email.includes('ananya') ? 'demo-pregnancy' : 'demo-reproductive'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [approvedReports, setApprovedReports] = useState<Record<string, boolean>>({
    'rep-oct-2026': true,
  });

  // Clinical notes state
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([
    {
      id: 'cn-1',
      patientId: 'demo-reproductive',
      date: '2026-10-24',
      doctorName: 'Dr. Anjali Mehta, MD',
      specialty: 'Obstetrics & Gynecology',
      subjective: 'Patient reports mild dysmenorrhea during luteal-to-menstrual transition. Adhering to Metformin.',
      objective: 'BP 118/76 mmHg. Resting HR 68 bpm. SpO2 99%. HRV baseline 58ms stable.',
      assessment: 'PCOS phenotypic presentation well-regulated under current lifestyle sync and inositol support.',
      plan: 'Continue Metformin 500mg OD. Recheck fasting insulin & HbA1c in 6 weeks. Encourage cycle-synced moderate cardio.',
      prescriptions: ['Metformin 500mg (Post breakfast)', 'Vitamin D3 2000IU daily', 'Myo-Inositol 2000mg'],
      status: 'signed',
    },
    {
      id: 'cn-2',
      patientId: 'demo-pregnancy',
      date: '2026-10-22',
      doctorName: 'Dr. Anjali Mehta, MD',
      specialty: 'Maternal-Fetal Medicine',
      subjective: 'Week 24 routine antenatal review. Fetal kicks active (avg 12/hour). No ankle edema or headaches.',
      objective: 'Fundal height corresponds to gestational age (24 cm). Fetal heart rate 142 bpm. BP 114/72 mmHg.',
      assessment: 'Intrauterine pregnancy at 24 weeks, singleton cephalic. Normal fetal movement rhythm.',
      plan: 'Schedule 75g OGTT screening for gestational diabetes next week. Continue prenatal iron-folate.',
      prescriptions: ['Iron-Folic Acid 100mg daily', 'Calcium Carbonate 500mg twice daily'],
      status: 'signed',
    },
  ]);

  // Form for drafting a new clinical note
  const [newNote, setNewNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    prescriptions: '',
  });

  const selectedPatient = DEMO_ACCOUNTS.find((acc) => acc.id === selectedPatientId) || DEMO_ACCOUNTS[0];

  const filteredPatients = DEMO_ACCOUNTS.filter(
    (acc) =>
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.stageBadge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.assessment.trim()) return;

    const created: ClinicalNote = {
      id: `cn-${Date.now()}`,
      patientId: selectedPatient.id,
      date: new Date().toISOString().split('T')[0],
      doctorName: 'Dr. Anjali Mehta, MD',
      specialty: 'Obstetrics & Gynecology',
      subjective: newNote.subjective || 'Patient presented for routine telemetry-reviewed consultation.',
      objective: newNote.objective || 'Vitals telemetry reviewed: HR 68 bpm, SpO2 98.8%, Temp 36.6°C normal.',
      assessment: newNote.assessment,
      plan: newNote.plan || 'Routine follow-up in 4 weeks.',
      prescriptions: newNote.prescriptions
        ? newNote.prescriptions.split(',').map((p) => p.trim()).filter(Boolean)
        : [],
      status: 'signed',
    };

    setClinicalNotes([created, ...clinicalNotes]);
    api.saveClinicalNote({
      patientId: selectedPatient.id,
      subjective: created.subjective,
      objective: created.objective,
      assessment: created.assessment,
      plan: created.plan,
      prescriptions: created.prescriptions,
    });
    setNewNote({ subjective: '', objective: '', assessment: '', plan: '', prescriptions: '' });
    setShowNewNoteModal(false);
  };

  const toggleReportApproval = (reportId: string) => {
    setApprovedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  const patientNotes = clinicalNotes.filter((cn) => cn.patientId === selectedPatient.id);

  return (
    <div className="space-y-8 pb-12">
      {/* Clinician Header */}
      <div className="bg-gradient-to-r from-[#D9607F] via-[#E8758F] to-[#D4879C] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-[#C2456B]/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 shadow-sm backdrop-blur-sm">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  Verified Clinician Portal
                </span>
                <span className="text-xs text-white/80 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-white" />
                  MCI-Reg #74829-MH
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif mt-1">Dr. Anjali Mehta, MD</h1>
              <p className="text-white/90 text-sm mt-0.5">
                Senior Consultant, Obstetrics & Gynecology • Bombay Hospital & Medical Research Centre
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewNoteModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-[#C2456B] hover:bg-white/90 font-semibold text-sm transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Clinical Note
            </button>
          </div>
        </div>

        {/* Quick Patient Stat Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20 text-xs">
          <div>
            <span className="text-white/80 block">Active Telemetry Patients</span>
            <span className="text-lg font-bold text-white mt-0.5 block">2 Monitored</span>
          </div>
          <div>
            <span className="text-white/80 block">Critical Alerts</span>
            <span className="text-lg font-bold text-white mt-0.5 block">0 Active Flags</span>
          </div>
          <div>
            <span className="text-white/80 block">Consented Data Access</span>
            <span className="text-lg font-bold text-white mt-0.5 block">100% Granted</span>
          </div>
          <div>
            <span className="text-white/80 block">AstraBand Streams</span>
            <span className="text-lg font-bold text-white mt-0.5 block">Live 5.3 BLE</span>
          </div>
        </div>
      </div>

      {/* Patient Directory & Active Patient Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Directory Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#F6E3E8] rounded-2xl p-4 shadow-[0_4px_24px_rgba(194,69,107,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#3B2A33] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#C2456B]" />
                Assigned Patients ({DEMO_ACCOUNTS.length})
              </h2>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-[#8A7580] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient name, condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFF8F9] border border-[#F6E3E8] rounded-lg text-[#3B2A33] placeholder-[#8A7580] focus:outline-none focus:ring-2 focus:ring-[#C2456B]"
              />
            </div>

            <div className="space-y-2">
              {filteredPatients.map((account) => {
                const isSelected = account.id === selectedPatient.id;
                return (
                  <button
                    key={account.id}
                    onClick={() => setSelectedPatientId(account.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#C2456B] bg-[#FCE4EC] shadow-sm'
                        : 'border-[#F6E3E8] hover:border-[#E8758F]/50 bg-white'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-tr ${account.avatarColor} text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-sm`}
                    >
                      {account.name.split(' ').map((n) => n[0]).join('')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#3B2A33] truncate">
                          {account.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-[#FCE4EC] text-[#C2456B]">
                          {account.profile.bloodGroup}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A7580] truncate mt-0.5">
                        {account.stageBadge}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E6B] animate-pulse" />
                        <span className="text-[10px] text-[#2E9E6B] font-medium">
                          Active Telemetry
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient Consent & Privacy Status */}
          <div className="bg-[#E3F5F4] border border-[#2BA6A0]/30 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#2BA6A0] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-semibold text-[#1F5450]">
                  Authenticated Consent Active
                </h3>
                <p className="text-xs text-[#2F6B66] mt-1 leading-relaxed">
                  {selectedPatient.name} granted HIPAA / DISHA-compliant clinical data sharing for longitudinal biosensors, cycle records, and risk assessments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Patient Clinical Detail Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* Patient Overview Card */}
          <div className="bg-white border border-[#F6E3E8] rounded-2xl p-6 shadow-[0_4px_24px_rgba(194,69,107,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E3E8]">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedPatient.avatarColor} text-white font-bold text-xl flex items-center justify-center shadow-md`}
                >
                  {selectedPatient.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#3B2A33]">
                      {selectedPatient.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FCE4EC] text-[#C2456B] border border-[#F6E3E8]">
                      {selectedPatient.stageBadge}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A7580] mt-1">
                    <span>DOB: {selectedPatient.profile.dob}</span>
                    <span>•</span>
                    <span>Blood: {selectedPatient.profile.bloodGroup}</span>
                    <span>•</span>
                    <span>City: {selectedPatient.profile.city}</span>
                    <span>•</span>
                    <span>Height: {selectedPatient.profile.height}</span>
                    <span>•</span>
                    <span>Weight: {selectedPatient.profile.weight}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedPatient.phone}`}
                  className="p-2.5 rounded-xl border border-[#F6E3E8] text-[#8A7580] hover:text-[#C2456B] hover:bg-[#FCE4EC] transition-colors"
                  title="Call Patient"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${selectedPatient.email}`}
                  className="p-2.5 rounded-xl border border-[#F6E3E8] text-[#8A7580] hover:text-[#C2456B] hover:bg-[#FCE4EC] transition-colors"
                  title="Email Patient"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Live Clinical Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-3.5 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8]">
                <div className="flex items-center justify-between text-[#8A7580] text-xs mb-1">
                  <span>Heart Rate</span>
                  <Heart className="w-4 h-4 text-[#C2456B]" />
                </div>
                <div className="text-lg font-bold text-[#3B2A33]">
                  {selectedPatient.id === 'demo-pregnancy' ? '74 bpm' : '68 bpm'}
                </div>
                <span className="text-[11px] text-[#2E9E6B] font-medium">
                  Normal Sinus Rhythm
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8]">
                <div className="flex items-center justify-between text-[#8A7580] text-xs mb-1">
                  <span>HRV (SDNN)</span>
                  <Activity className="w-4 h-4 text-[#9B5B7A]" />
                </div>
                <div className="text-lg font-bold text-[#3B2A33]">
                  {selectedPatient.id === 'demo-pregnancy' ? '46 ms' : '58 ms'}
                </div>
                <span className="text-[11px] text-[#8A7580]">
                  Autonomic balance stable
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8]">
                <div className="flex items-center justify-between text-[#8A7580] text-xs mb-1">
                  <span>Skin Temp (TMP117)</span>
                  <Activity className="w-4 h-4 text-[#E0A030]" />
                </div>
                <div className="text-lg font-bold text-[#3B2A33]">
                  {selectedPatient.id === 'demo-pregnancy' ? '36.8°C' : '36.6°C'}
                </div>
                <span className="text-[11px] text-[#2E9E6B] font-medium">
                  Normothermic baseline
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8]">
                <div className="flex items-center justify-between text-[#8A7580] text-xs mb-1">
                  <span>SpO2 Telemetry</span>
                  <Activity className="w-4 h-4 text-[#2BA6A0]" />
                </div>
                <div className="text-lg font-bold text-[#3B2A33]">99.1%</div>
                <span className="text-[11px] text-[#2E9E6B] font-medium">
                  Optimal Oxygenation
                </span>
              </div>
            </div>

            {/* Conditions & Allergies Badges */}
            <div className="mt-6 pt-6 border-t border-[#F6E3E8] flex flex-wrap gap-4 text-xs">
              <div>
                <span className="text-[#8A7580] block mb-1">Diagnosed Conditions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPatient.profile.existingConditions.map((cond, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#FFF4E5] text-[#B26A00] border border-[#F6D8A8] font-medium"
                    >
                      {cond}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#8A7580] block mb-1">Documented Allergies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPatient.profile.allergies.map((allergy, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#FDE8E8] text-[#D93A3A] border border-[#F8C4C4] font-medium"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#8A7580] block mb-1">Active Prescriptions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPatient.profile.medications.map((med, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#FCE4EC] text-[#C2456B] border border-[#F6E3E8] font-medium"
                    >
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Reports Awaiting Review */}
          <div className="bg-white border border-[#F6E3E8] rounded-2xl p-6 shadow-[0_4px_24px_rgba(194,69,107,0.04)]">
            <h3 className="text-base font-bold text-[#3B2A33] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C2456B]" />
              Monthly Diagnostic Reports & Physician Approvals
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-[#F6E3E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFF8F9]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#FCE4EC] text-[#C2456B]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#3B2A33]">
                      Comprehensive Telemetry & Ovulation Report — October 2026
                    </h4>
                    <p className="text-xs text-[#8A7580] mt-0.5">
                      Contains 30-day continuous ECG metrics, HRV trend maps, cycle length shifts, and AI risk score breakdown.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleReportApproval('rep-oct-2026')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      approvedReports['rep-oct-2026']
                        ? 'bg-[#E4F5EC] text-[#2E9E6B] border border-[#BCE8D1]'
                        : 'bg-[#C2456B] hover:bg-[#A8385A] text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {approvedReports['rep-oct-2026'] ? 'Approved & Signed' : 'Sign & Approve'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Consultation Notes Timeline */}
          <div className="bg-white border border-[#F6E3E8] rounded-2xl p-6 shadow-[0_4px_24px_rgba(194,69,107,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#3B2A33] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C2456B]" />
                Clinical Encounter History & Prescriptions ({patientNotes.length})
              </h3>
              <button
                onClick={() => setShowNewNoteModal(true)}
                className="text-xs font-semibold text-[#C2456B] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Encounter
              </button>
            </div>

            {patientNotes.length === 0 ? (
              <div className="text-center py-8 text-[#8A7580] text-sm">
                No clinical notes recorded for this patient yet. Click "+ New Clinical Note" above.
              </div>
            ) : (
              <div className="space-y-4">
                {patientNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#3B2A33]">
                          {note.doctorName}
                        </span>
                        <span className="text-xs text-[#8A7580]">• {note.specialty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#8A7580] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {note.date}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E4F5EC] text-[#2E9E6B]">
                          {note.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#F6E3E8]">
                      <div>
                        <span className="font-semibold text-[#3B2A33] block mb-0.5">
                          Subjective / History:
                        </span>
                        <p className="text-[#8A7580] leading-relaxed">
                          {note.subjective}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-[#3B2A33] block mb-0.5">
                          Objective Vitals:
                        </span>
                        <p className="text-[#8A7580] leading-relaxed">
                          {note.objective}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-[#3B2A33] block mb-0.5">
                          Assessment / Diagnosis:
                        </span>
                        <p className="text-[#8A7580] leading-relaxed">
                          {note.assessment}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-[#3B2A33] block mb-0.5">
                          Care Plan:
                        </span>
                        <p className="text-[#8A7580] leading-relaxed">
                          {note.plan}
                        </p>
                      </div>
                    </div>

                    {note.prescriptions && note.prescriptions.length > 0 && (
                      <div className="pt-2 border-t border-[#F6E3E8]">
                        <span className="text-xs font-semibold text-[#3B2A33] block mb-1.5">
                          Prescribed Regimen:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {note.prescriptions.map((p, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-md bg-[#FCE4EC] text-[#C2456B] border border-[#F6E3E8] text-xs font-medium"
                            >
                              💊 {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Clinical Note Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#F6E3E8] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#F6E3E8]">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#C2456B]" />
                <h3 className="font-bold text-lg text-[#3B2A33]">
                  New Clinical Encounter — {selectedPatient.name}
                </h3>
              </div>
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="text-[#8A7580] hover:text-[#3B2A33] text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#3B2A33] mb-1">
                  Subjective / Chief Complaints
                </label>
                <textarea
                  rows={2}
                  value={newNote.subjective}
                  onChange={(e) => setNewNote({ ...newNote, subjective: e.target.value })}
                  placeholder="Patient statements, symptom chronology, current complaints..."
                  className="w-full text-xs p-3 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] placeholder-[#8A7580] focus:ring-2 focus:ring-[#C2456B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2A33] mb-1">
                  Objective Vitals & Observations
                </label>
                <textarea
                  rows={2}
                  value={newNote.objective}
                  onChange={(e) => setNewNote({ ...newNote, objective: e.target.value })}
                  placeholder="BP, Heart rate telemetry, ECG regularity, physical findings..."
                  className="w-full text-xs p-3 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] placeholder-[#8A7580] focus:ring-2 focus:ring-[#C2456B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2A33] mb-1">
                  Assessment / Clinical Impression *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newNote.assessment}
                  onChange={(e) => setNewNote({ ...newNote, assessment: e.target.value })}
                  placeholder="Clinical assessment, differential diagnosis, status..."
                  className="w-full text-xs p-3 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] placeholder-[#8A7580] focus:ring-2 focus:ring-[#C2456B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2A33] mb-1">
                  Treatment Plan & Recommendations
                </label>
                <textarea
                  rows={2}
                  value={newNote.plan}
                  onChange={(e) => setNewNote({ ...newNote, plan: e.target.value })}
                  placeholder="Lifestyle advice, lab tests, dietary modifications, follow-up..."
                  className="w-full text-xs p-3 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] placeholder-[#8A7580] focus:ring-2 focus:ring-[#C2456B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2A33] mb-1">
                  Prescriptions (comma separated)
                </label>
                <input
                  type="text"
                  value={newNote.prescriptions}
                  onChange={(e) => setNewNote({ ...newNote, prescriptions: e.target.value })}
                  placeholder="e.g. Metformin 500mg, Iron Supplement 100mg"
                  className="w-full text-xs p-3 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] placeholder-[#8A7580] focus:ring-2 focus:ring-[#C2456B] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F6E3E8]">
                <button
                  type="button"
                  onClick={() => setShowNewNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A7580] hover:bg-[#FCE4EC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#C2456B] hover:bg-[#A8385A] text-white shadow-md shadow-[#C2456B]/25 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Sign & Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

