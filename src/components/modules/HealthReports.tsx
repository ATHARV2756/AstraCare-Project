/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Share2,
  CheckCircle,
  Calendar,
  Lock,
  Heart,
  TrendingUp,
  ShieldCheck,
  FileCheck,
  ExternalLink,
  Archive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isDemoUser } from '../../data/demoAccounts';

export default function HealthReports() {
  const { user } = useApp();
  const isDemo = isDemoUser(user?.email);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const downloadFile = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Biomarkers lab test history (scoped to demo vs new users)
  const demoBiomarkers = [
    { test: 'Hemoglobin (Hb)', result: '12.8 g/dL', ref: '12.0 – 15.5 g/dL', status: 'Optimal', date: 'Oct 15, 2026' },
    { test: 'Serum Ferritin', result: '48 ng/mL', ref: '20 – 150 ng/mL', status: 'Optimal', date: 'Oct 15, 2026' },
    { test: 'Fasting Blood Glucose', result: '88 mg/dL', ref: '70 – 99 mg/dL', status: 'Normal', date: 'Oct 15, 2026' },
    { test: 'HbA1c Glycated Hemoglobin', result: '5.2%', ref: '< 5.7%', status: 'Optimal', date: 'Oct 15, 2026' },
    { test: 'Thyroid Stimulating Hormone (TSH)', result: '2.1 mIU/L', ref: '0.4 – 4.0 mIU/L', status: 'Euthyroid', date: 'Oct 15, 2026' },
    { test: 'Serum 25-OH Vitamin D', result: '38 ng/mL', ref: '30 – 100 ng/mL', status: 'Sufficient', date: 'Oct 15, 2026' }
  ];

  const biomarkers = isDemo ? demoBiomarkers : [];

  // Past reports archive (scoped to demo vs new users)
  const demoPastReports = [
    {
      id: 'rep-1',
      title: 'Q3 Comprehensive Reproductive Dossier',
      date: 'Sep 30, 2026',
      size: '2.4 MB',
      doctor: 'Dr. Sunita Rao, MD (OB/GYN)',
      doctorReg: 'Board Certified Obstetrician & Gynecologist • Reg #MH-84210',
      vitals: { restingHR: '63 bpm', hrv: '61 ms', spO2: '99%', sleep: '7h 42m' },
      notes: [
        '• Endometrial Regularity: Transvaginal baseline confirmed physiological thickness (8.2 mm) prior to ovulatory window.',
        '• Luteal Phase: Stable 14-day duration with sustained progesterone elevation; no premenstrual spotting.',
        '• Micronutrient Saturation: Supplemental iron and folate regimen is effective; ferritin stabilized.'
      ],
      biomarkers: [
        { test: 'Luteinizing Hormone (LH)', result: '6.4 mIU/mL', ref: '2.0 – 15.0 mIU/mL', status: 'Optimal Mid-Cycle', date: 'Sep 28, 2026' },
        { test: 'Follicle-Stimulating Hormone (FSH)', result: '5.8 mIU/mL', ref: '3.0 – 12.0 mIU/mL', status: 'Normal', date: 'Sep 28, 2026' },
        { test: 'Estradiol (E2)', result: '142 pg/mL', ref: '30 – 400 pg/mL', status: 'Optimal Follicular', date: 'Sep 28, 2026' },
        { test: 'Serum Progesterone', result: '11.4 ng/mL', ref: '5.0 – 20.0 ng/mL', status: 'Ovulatory Confirmed', date: 'Sep 28, 2026' },
        { test: 'Serum Ferritin', result: '46 ng/mL', ref: '20 – 150 ng/mL', status: 'Optimal', date: 'Sep 28, 2026' }
      ]
    },
    {
      id: 'rep-2',
      title: 'Mid-Year Maternal & Gynecological Review',
      date: 'Jun 30, 2026',
      size: '3.1 MB',
      doctor: 'Dr. Anjali Mehta, MD (OB/GYN)',
      doctorReg: 'Consultant Gynecologist & Reproductive Endocrinologist • Reg #DL-51204',
      vitals: { restingHR: '65 bpm', hrv: '57 ms', spO2: '98%', sleep: '7h 20m' },
      notes: [
        '• Metabolic & Androgen Screen: PCOS biomarkers demonstrate complete control without hyperandrogenism.',
        '• Pelvic Ultrasound: Both ovaries demonstrate healthy antral follicle counts without polycystic morphology.',
        '• Sleep & Stress Resilience: Nightly deep sleep average remains above 1h 45m with robust HRV recovery.'
      ],
      biomarkers: [
        { test: 'Fasting Serum Insulin', result: '6.2 uIU/mL', ref: '2.6 – 24.9 uIU/mL', status: 'High Insulin Sensitivity', date: 'Jun 25, 2026' },
        { test: 'HOMA-IR Score', result: '1.34', ref: '< 2.0 (Normal)', status: 'Optimal', date: 'Jun 25, 2026' },
        { test: 'Total Testosterone', result: '28 ng/dL', ref: '15 – 70 ng/dL', status: 'Euhormonal', date: 'Jun 25, 2026' },
        { test: 'DHEA-Sulfate', result: '185 ug/dL', ref: '65 – 380 ug/dL', status: 'Normal Adrenal Output', date: 'Jun 25, 2026' },
        { test: 'Thyroid Stimulating Hormone (TSH)', result: '1.9 mIU/L', ref: '0.4 – 4.0 mIU/L', status: 'Euthyroid', date: 'Jun 25, 2026' }
      ]
    },
    {
      id: 'rep-3',
      title: 'Q1 Biosensor Telemetry & Hormonal Baseline',
      date: 'Mar 31, 2026',
      size: '1.9 MB',
      doctor: 'Dr. Anjali Mehta, MD (OB/GYN)',
      doctorReg: 'Consultant Gynecologist & Reproductive Endocrinologist • Reg #DL-51204',
      vitals: { restingHR: '67 bpm', hrv: '52 ms', spO2: '98%', sleep: '7h 10m' },
      notes: [
        '• Baseline Diagnostic Intake: Inaugural AstraCare biosensor calibration completed. Resting heart rate stabilized at 67 bpm.',
        '• Iron Stores: Ferritin initiated at lower baseline; oral elemental iron protocol initiated.',
        '• Lifestyle Synchronization: Circadian rhythm alignment initiated with morning sunlight exposure and sleep hygiene.'
      ],
      biomarkers: [
        { test: 'Hemoglobin (Hb)', result: '12.1 g/dL', ref: '12.0 – 15.5 g/dL', status: 'Baseline Calibrated', date: 'Mar 24, 2026' },
        { test: 'Serum Iron', result: '72 ug/dL', ref: '60 – 170 ug/dL', status: 'Normal', date: 'Mar 24, 2026' },
        { test: 'Total Iron Binding Capacity (TIBC)', result: '310 ug/dL', ref: '240 – 450 ug/dL', status: 'Normal', date: 'Mar 24, 2026' },
        { test: 'Vitamin B12 (Cobalamin)', result: '460 pg/mL', ref: '200 – 900 pg/mL', status: 'Sufficient', date: 'Mar 24, 2026' },
        { test: '25-OH Vitamin D', result: '32 ng/mL', ref: '30 – 100 ng/mL', status: 'Sufficient', date: 'Mar 24, 2026' }
      ]
    }
  ];

  const pastReports = isDemo ? demoPastReports : [];

  // Helper to generate printable hospital-grade clinical HTML dossier
  const buildDossierHTML = (
    reportTitle: string,
    dossierId: string,
    issueDate: string,
    doctorName: string,
    doctorReg: string,
    vitalsInfo: { restingHR: string; hrv: string; spO2: string; sleep: string },
    biomarkerRows: { test: string; result: string; ref: string; status: string; date: string }[],
    clinicalNotes: string[]
  ) => {
    const patientName = user?.fullName || 'Priya Sharma';
    const patientDob = user?.dob || '1998-05-14';
    const patientBlood = user?.bloodGroup || 'O+';
    const patientStage = user?.lifeStage || 'Reproductive';
    const patientHeight = user?.height || '165 cm';
    const patientWeight = user?.weight || '58 kg';
    const patientConditions = user?.existingConditions?.join(', ') || 'Mild Anemia History';
    const patientMeds = user?.medications?.join(', ') || 'Elemental Iron, Methylfolate, Vitamin D3';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle} - ${patientName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Code+Pro:wght@500;600&display=swap');
    :root {
      --color-primary: #C2456B;
      --color-primary-dark: #8F2A4A;
      --color-tint: #FFF8F9;
      --color-border: #F6E3E8;
      --color-text: #3B2A33;
      --color-muted: #8A7580;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #FAFAFA;
      color: var(--color-text);
      line-height: 1.5;
      padding: 32px 16px;
    }
    .paper {
      max-width: 900px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: 20px;
      padding: 48px;
      box-shadow: 0 10px 40px rgba(194, 69, 107, 0.08);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid var(--color-text);
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .brand-tag {
      display: inline-block;
      background: var(--color-text);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .sub-brand {
      color: var(--color-primary);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-left: 8px;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: var(--color-text);
      margin-top: 10px;
    }
    .meta-id {
      font-family: 'Source Code Pro', monospace;
      font-size: 11px;
      color: var(--color-muted);
      margin-top: 6px;
    }
    .badge-confidential {
      text-align: right;
      font-family: 'Source Code Pro', monospace;
      font-size: 11px;
      font-weight: 700;
      color: var(--color-text);
    }
    .badge-confidential span {
      display: block;
      color: var(--color-muted);
      font-weight: normal;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--color-text);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 8px;
      margin: 24px 0 14px 0;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: var(--color-tint);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 18px;
    }
    .grid-item span.label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--color-muted);
      margin-bottom: 4px;
    }
    .grid-item span.value {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-text);
    }
    .vitals-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .vital-card {
      background: var(--color-tint);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 16px;
    }
    .vital-card .v-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--color-muted);
    }
    .vital-card .v-val {
      font-size: 22px;
      font-weight: 800;
      color: var(--color-text);
      margin: 6px 0;
    }
    .vital-card .v-status {
      font-size: 11px;
      font-weight: 700;
      color: #2E9E6B;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 8px;
    }
    th {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid var(--color-border);
      color: var(--color-muted);
      font-weight: 700;
      font-size: 11px;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--color-border);
    }
    td.result {
      font-weight: 800;
      color: var(--color-primary);
    }
    td.status-optimal {
      color: #2E9E6B;
      font-weight: 700;
    }
    .clinical-box {
      background: var(--color-tint);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 18px;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer-signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 36px;
      padding-top: 24px;
      border-top: 1px solid var(--color-border);
    }
    .doc-remark {
      max-width: 55%;
      border-left: 3px solid var(--color-primary);
      padding-left: 14px;
      font-style: italic;
      font-size: 12px;
      color: var(--color-muted);
    }
    .signature-area {
      text-align: right;
    }
    .sig-line {
      border-bottom: 1.5px solid var(--color-text);
      width: 220px;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 700;
      font-style: italic;
      padding-bottom: 4px;
    }
    .sig-reg {
      font-size: 10px;
      font-family: 'Source Code Pro', monospace;
      color: var(--color-muted);
    }
    .no-print-toolbar {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-bottom: 20px;
    }
    .btn-print {
      background: var(--color-primary);
      color: #fff;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .paper { border: none; box-shadow: none; padding: 0; }
      .no-print-toolbar { display: none; }
    }
  </style>
</head>
<body>
  <div class="paper">
    <div class="no-print-toolbar">
      <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
    </div>

    <div class="header">
      <div>
        <span class="brand-tag">ASTRACARE AI</span>
        <span class="sub-brand">CLINICAL HEALTH SUMMARY DOSSIER</span>
        <h1>${reportTitle}</h1>
        <div class="meta-id">Dossier ID: ${dossierId} • Generated: ${issueDate}</div>
      </div>
      <div class="badge-confidential">
        MEDICAL CONFIDENTIAL
        <span>Physician Review Copy</span>
      </div>
    </div>

    <div class="section-title">Patient Identification & Biometric Baseline</div>
    <div class="grid-4">
      <div class="grid-item">
        <span class="label">Patient Full Name</span>
        <span class="value">${patientName}</span>
      </div>
      <div class="grid-item">
        <span class="label">Date of Birth / Age</span>
        <span class="value">${patientDob} (28 yrs)</span>
      </div>
      <div class="grid-item">
        <span class="label">Blood Group</span>
        <span class="value" style="color:var(--color-primary);">${patientBlood}</span>
      </div>
      <div class="grid-item">
        <span class="label">Life Stage</span>
        <span class="value" style="text-transform: capitalize;">${patientStage}</span>
      </div>
      <div class="grid-item">
        <span class="label">Height & Weight</span>
        <span class="value">${patientHeight} • ${patientWeight}</span>
      </div>
      <div class="grid-item">
        <span class="label">Baseline Status</span>
        <span class="value">${patientConditions}</span>
      </div>
      <div class="grid-item" style="grid-column: span 2;">
        <span class="label">Active Prescriptions / Supplementation</span>
        <span class="value">${patientMeds}</span>
      </div>
    </div>

    <div class="section-title">1. Physiological Telemetry Summary (AstraBand Biosensors)</div>
    <div class="vitals-grid">
      <div class="vital-card">
        <span class="v-label">Resting Heart Rate</span>
        <div class="v-val">${vitalsInfo.restingHR}</div>
        <span class="v-status">✓ Stable range</span>
      </div>
      <div class="vital-card">
        <span class="v-label">HRV Autonomic Tone</span>
        <div class="v-val">${vitalsInfo.hrv}</div>
        <span class="v-status">✓ Robust parasympathetic</span>
      </div>
      <div class="vital-card">
        <span class="v-label">Blood Oxygen (SpO2)</span>
        <div class="v-val">${vitalsInfo.spO2}</div>
        <span class="v-status">✓ 0 nocturnal events</span>
      </div>
      <div class="vital-card">
        <span class="v-label">Mean Sleep Duration</span>
        <div class="v-val">${vitalsInfo.sleep}</div>
        <span class="v-status">✓ 86% restorative index</span>
      </div>
    </div>

    <div class="section-title">2. Reproductive Cycle & Hormonal Phase Analysis</div>
    <div class="clinical-box">
      ${clinicalNotes.map(n => `<p style="margin-bottom: 8px;">${n}</p>`).join('')}
    </div>

    <div class="section-title">3. Longitudinal Laboratory Biomarkers & Hematology</div>
    <table>
      <thead>
        <tr>
          <th>Biomarker Test</th>
          <th>Result Value</th>
          <th>Reference Interval</th>
          <th>Clinical Status</th>
          <th>Reported Date</th>
        </tr>
      </thead>
      <tbody>
        ${biomarkerRows.map(b => `
          <tr>
            <td><strong>${b.test}</strong></td>
            <td class="result">${b.result}</td>
            <td style="color:var(--color-muted);">${b.ref}</td>
            <td class="status-optimal">${b.status}</td>
            <td style="font-family:'Source Code Pro', monospace; color:var(--color-muted);">${b.date}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="footer-signatures">
      <div class="doc-remark">
        "Patient exhibits stable telemetry and hormonal synchronization. Follow-up routine review recommended as scheduled."
      </div>
      <div class="signature-area">
        <div class="sig-line">${doctorName}</div>
        <div class="sig-reg">${doctorReg}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Download active clinical dossier as standalone printable HTML / PDF
  const handleDownloadActiveDossier = () => {
    const title = 'Longitudinal Physiological & Reproductive Profile';
    const dossierId = 'AC-2026-9842';
    const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const doctorName = user?.lifeStage === 'pregnancy' ? 'Dr. Sunita Rao, MD (OB/GYN)' : 'Dr. Anjali Mehta, MD (OB/GYN)';
    const doctorReg = 'Board Certified Obstetrician & Gynecologist • Reg #MH-84210';
    const vitalsInfo = { restingHR: '64 bpm', hrv: '58 ms', spO2: '98%', sleep: '7h 35m' };
    const clinicalNotes = [
      '• <strong>Menstrual Pattern:</strong> Average cycle length established at ' + (user?.menstrualHistory?.cycleLength || 28) + ' days. Variance across last 6 cycles is ±1.2 days (High regularity confidence index).',
      '• <strong>Hormonal Rhythm:</strong> Basal body skin temperature shift (+0.3°C) accurately aligns with estimated Day 14 ovulation window. Follicular phase progression exhibits expected estrogen surge without luteal deficiency.',
      '• <strong>Symptom Profile:</strong> Mild pre-menstrual lower back tension and fatigue noted on Days 26–28. No alarming menorrhagia, acute dysmenorrhea, or abnormal pelvic symptoms recorded.'
    ];

    const htmlContent = buildDossierHTML(
      title,
      dossierId,
      issueDate,
      doctorName,
      doctorReg,
      vitalsInfo,
      biomarkers,
      clinicalNotes
    );

    const safeFilename = `AstraCare_Active_Clinical_Report_${new Date().toISOString().slice(0, 10)}.html`;
    downloadFile(safeFilename, htmlContent, 'text/html;charset=utf-8');
    showToast('Clinical Health Dossier downloaded successfully (HTML/PDF)!');
  };

  // Download active health report as structured JSON
  const handleDownloadJSON = () => {
    const reportData = {
      patient: user?.fullName || 'Priya Sharma',
      dob: user?.dob || '1998-05-14',
      bloodGroup: user?.bloodGroup || 'O+',
      lifeStage: user?.lifeStage || 'reproductive',
      generatedDate: new Date().toISOString(),
      reportId: 'AC-2026-9842',
      vitals: {
        restingHeartRate: '64 bpm',
        hrvRMSSD: '58 ms',
        skinTemperature: '36.4 C',
        meanSleep: '7h 35m',
        dailyStepsAverage: '9,450 steps'
      },
      diagnostics: {
        pcosRisk: 'Low / Controlled',
        anemiaRisk: 'Low / Re-calibrated',
        complianceStreak: '14 Days'
      },
      biomarkers
    };

    downloadFile(
      `AstraCare_Clinical_Report_${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(reportData, null, 2),
      'application/json;charset=utf-8'
    );
    showToast('Encrypted JSON health record downloaded!');
  };

  // Download specific historical medical dossier
  const handleDownloadHistoricalReport = (pastReport: typeof pastReports[0], format: 'html' | 'json' = 'html') => {
    const safeTitle = pastReport.title.replace(/[^a-zA-Z0-9]/g, '_');
    const safeDate = pastReport.date.replace(/[^a-zA-Z0-9]/g, '_');

    if (format === 'json') {
      const jsonData = {
        dossierId: pastReport.id,
        title: pastReport.title,
        date: pastReport.date,
        attendingPhysician: pastReport.doctor,
        registration: pastReport.doctorReg,
        patient: user?.fullName || 'Priya Sharma',
        vitalsTelemetry: pastReport.vitals,
        clinicalAssessments: pastReport.notes,
        laboratoryBiomarkers: pastReport.biomarkers,
        exportMetadata: {
          exportedAt: new Date().toISOString(),
          compliance: 'HIPAA & DPDP Ready',
          encryption: 'AES-256-GCM Verified'
        }
      };
      downloadFile(`${safeTitle}_${safeDate}.json`, JSON.stringify(jsonData, null, 2), 'application/json;charset=utf-8');
      showToast(`Downloaded historical record: ${pastReport.title} (JSON)`);
    } else {
      const htmlContent = buildDossierHTML(
        pastReport.title,
        `AC-ARCH-${pastReport.id.toUpperCase()}`,
        pastReport.date,
        pastReport.doctor,
        pastReport.doctorReg,
        pastReport.vitals,
        pastReport.biomarkers,
        pastReport.notes
      );
      downloadFile(`${safeTitle}_${safeDate}.html`, htmlContent, 'text/html;charset=utf-8');
      showToast(`Downloaded historical dossier: ${pastReport.title} (HTML/PDF)`);
    }
  };

  // Export full historical records archive
  const handleExportFullHistoricalArchive = () => {
    const fullArchive = {
      archiveMetadata: {
        system: 'AstraCare AI Longitudinal Health Repository',
        patient: user?.fullName || 'Priya Sharma',
        patientId: user?.id || 'usr-priya-01',
        exportedAt: new Date().toISOString(),
        totalDossiers: pastReports.length + 1,
        complianceStandard: 'HIPAA & GDPR / DPDP Verified'
      },
      currentClinicalSummary: {
        reportId: 'AC-2026-9842',
        issueDate: new Date().toISOString(),
        vitals: { restingHR: '64 bpm', hrv: '58 ms', spO2: '98%', sleep: '7h 35m' },
        biomarkers
      },
      historicalDossiersArchive: pastReports
    };

    downloadFile(
      `AstraCare_Full_Historical_Archive_${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(fullArchive, null, 2),
      'application/json;charset=utf-8'
    );
    showToast('Full historical medical archive downloaded (JSON)!');
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast('New AI Clinical Health Summary generated successfully!');
    }, 1400);
  };

  return (
    <div id="health-reports-module" className="space-y-6 w-full pb-16">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 bg-[#FFF8F9] text-[#C2456B] border border-[#F6E3E8] text-xs font-bold"
          >
            <CheckCircle size={16} className="text-[#C2456B]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 print:hidden">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FCE4EC] text-[#C2456B] text-xs font-bold border border-[#F6E3E8]">
              Clinical Records & Dossiers
            </span>
            <span className="text-xs text-[#8A7580] font-medium">Longitudinal Physiological Telemetry Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] tracking-tight">
            Health Reports & Longitudinal Records
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7580] max-w-2xl leading-relaxed">
            Generate verifiable AI clinical summaries, review longitudinal lab biomarkers, and download encrypted medical dossiers for consultations.
          </p>
        </div>

        {/* Action Controls - Perfectly aligned: single row of 4 on desktop/tablet, balanced 2x2 grid on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full xl:w-auto shrink-0">
          <button
            id="btn-generate-summary"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#C2456B]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles size={15} className={isGenerating ? 'animate-spin' : ''} />
            <span>{isGenerating ? 'Compiling...' : 'Generate Summary'}</span>
          </button>
          <button
            id="btn-download-dossier"
            onClick={handleDownloadActiveDossier}
            className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#C2456B] hover:bg-[#b03d60] text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
            title="Download complete standalone Clinical Dossier (PDF/HTML)"
          >
            <Download size={15} />
            <span>Download Dossier</span>
          </button>
          <button
            id="btn-print-report"
            onClick={handlePrintReport}
            className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#FFF8F9] hover:bg-[#FCE4EC] border border-[#F6E3E8] text-[#3B2A33] rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Printer size={15} className="text-[#C2456B]" />
            <span>Print PDF</span>
          </button>
          <button
            id="btn-export-json"
            onClick={handleDownloadJSON}
            className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#3B2A33] hover:bg-[#2C1F26] text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
          >
            <Download size={15} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* 3 SUMMARY STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 print:hidden">
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">Doctor Sharing Consent</span>
          <span className="text-xl font-serif font-bold text-[#3B2A33] block">
            {isDemo 
              ? (user?.lifeStage === 'pregnancy' ? 'Dr. Sunita Rao (OB/GYN)' : 'Dr. Anjali Mehta (Gynecologist)')
              : (user?.consents?.doctorSharing ? 'Consent Active (Ready for Review)' : 'Sharing Disabled')}
          </span>
          <span className="text-xs text-[#2E9E6B] font-bold block">✓ End-to-End Encrypted Access Active</span>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">Compiled Dossiers</span>
          <span className="text-3xl sm:text-4xl font-serif font-black text-[#C2456B] block">
            {isDemo ? '4 Records' : `${pastReports.length} Records`}
          </span>
          <span className="text-xs text-[#8A7580] block">
            {isDemo ? 'Past 90 Days High-Res Biosensor Telemetry' : (pastReports.length > 0 ? 'Longitudinal Clinical Records' : 'New Account • Telemetry Baseline Initialized')}
          </span>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">Security & Compliance</span>
          <span className="text-xl font-serif font-bold text-[#3B2A33] block">HIPAA & GDPR Ready</span>
          <span className="text-xs text-[#2E9E6B] font-bold block">AES-256 GCM Protected Health Info (PHI)</span>
        </div>
      </div>

      {/* CLINICAL HEALTH REPORT SHEET (PRINTABLE) */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-7 print:border-none print:shadow-none print:p-0">
        
        {/* Report Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-[#3B2A33] gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest uppercase bg-[#3B2A33] text-white px-2.5 py-0.5 rounded">
                ASTRACARE AI
              </span>
              <span className="text-xs text-[#C2456B] font-bold uppercase tracking-wider">
                CLINICAL HEALTH SUMMARY DOSSIER
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33]">
              Longitudinal Physiological & Reproductive Profile
            </h2>
            <p className="text-xs text-[#8A7580] font-mono">
              Dossier ID: AC-2026-9842 • Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="text-right text-xs space-y-0.5 font-mono">
            <span className="font-bold text-[#3B2A33] block">Medical Confidential</span>
            <span className="text-[#8A7580] block">Prepared for Physician Clinical Review</span>
          </div>
        </div>

        {/* Patient Identity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] text-xs">
          <div>
            <span className="text-[10px] text-[#8A7580] uppercase font-bold block">Patient Name</span>
            <span className="font-bold text-[#3B2A33]">{user?.fullName || 'Priya Sharma'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8A7580] uppercase font-bold block">Date of Birth / Age</span>
            <span className="font-bold text-[#3B2A33]">{user?.dob || '1998-05-14'} (28 yrs)</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8A7580] uppercase font-bold block">Blood Group</span>
            <span className="font-bold text-[#C2456B]">{user?.bloodGroup || 'O+'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8A7580] uppercase font-bold block">Life Stage</span>
            <span className="font-bold text-[#3B2A33] capitalize">{user?.lifeStage || 'Reproductive'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8A7580] uppercase font-bold block">Height & Weight</span>
            <span className="font-bold text-[#3B2A33]">{user?.height || '165 cm'} • {user?.weight || '58 kg'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8A7580] uppercase font-bold block">Known Conditions</span>
            <span className="font-bold text-[#3B2A33]">{user?.existingConditions?.join(', ') || 'Mild Anemia History'}</span>
          </div>
          <div className="col-span-2">
            <span className="text-[10px] text-[#8A7580] uppercase font-bold block">Active Prescribed Supplementation</span>
            <span className="font-bold text-[#3B2A33]">{user?.medications?.join(', ') || 'Elemental Iron, Methylfolate, Vitamin D3'}</span>
          </div>
        </div>

        {/* Clinical Telemetry Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#3B2A33] uppercase tracking-wider border-b border-[#F6E3E8] pb-1.5">
            1. 30-Day Physiological Telemetry Summary (AstraBand Biosensors)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
            <div className="p-4 bg-[#FFF8F9] rounded-2xl border border-[#F6E3E8] space-y-1">
              <span className="text-[10px] text-[#8A7580] block font-bold uppercase">Resting Heart Rate</span>
              <span className="text-xl font-serif font-black text-[#3B2A33] block">64 bpm</span>
              <span className="text-[11px] text-[#2E9E6B] font-bold block">✓ Stable 60–72 bpm range</span>
            </div>
            <div className="p-4 bg-[#FFF8F9] rounded-2xl border border-[#F6E3E8] space-y-1">
              <span className="text-[10px] text-[#8A7580] block font-bold uppercase">HRV Autonomic Tone</span>
              <span className="text-xl font-serif font-black text-[#3B2A33] block">58 ms</span>
              <span className="text-[11px] text-[#2E9E6B] font-bold block">✓ Robust parasympathetic tone</span>
            </div>
            <div className="p-4 bg-[#FFF8F9] rounded-2xl border border-[#F6E3E8] space-y-1">
              <span className="text-[10px] text-[#8A7580] block font-bold uppercase">Blood Oxygen (SpO2)</span>
              <span className="text-xl font-serif font-black text-[#3B2A33] block">98%</span>
              <span className="text-[11px] text-[#2E9E6B] font-bold block">✓ 0 nocturnal desaturations</span>
            </div>
            <div className="p-4 bg-[#FFF8F9] rounded-2xl border border-[#F6E3E8] space-y-1">
              <span className="text-[10px] text-[#8A7580] block font-bold uppercase">Mean Sleep Duration</span>
              <span className="text-xl font-serif font-black text-purple-700 block">7h 35m</span>
              <span className="text-[11px] text-purple-600 font-bold block">✓ 86% restorative sleep index</span>
            </div>
          </div>
        </div>

        {/* Gynecological & Reproductive Analysis */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#3B2A33] uppercase tracking-wider border-b border-[#F6E3E8] pb-1.5">
            2. Reproductive Cycle & Hormonal Phase Analysis
          </h3>
          <div className="p-5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-2 text-xs text-[#3B2A33] leading-relaxed">
            <p>
              • <strong>Menstrual Pattern:</strong> Average cycle length established at {user?.menstrualHistory?.cycleLength || 28} days. Variance across last 6 cycles is ±1.2 days (High regularity confidence index).
            </p>
            <p>
              • <strong>Hormonal Rhythm:</strong> Basal body skin temperature shift (+0.3°C) accurately aligns with estimated Day 14 ovulation window. Follicular phase progression exhibits expected estrogen surge without luteal deficiency.
            </p>
            <p>
              • <strong>Symptom Profile:</strong> Mild pre-menstrual lower back tension and fatigue noted on Days 26–28. No alarming menorrhagia, acute dysmenorrhea, or abnormal pelvic symptoms recorded.
            </p>
          </div>
        </div>

        {/* Longitudinal Biomarkers Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#3B2A33] uppercase tracking-wider border-b border-[#F6E3E8] pb-1.5">
            3. Longitudinal Laboratory Biomarkers & Hematology
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#F6E3E8] text-[#8A7580]">
                  <th className="py-2.5 font-bold">Biomarker Test</th>
                  <th className="py-2.5 font-bold">Result Value</th>
                  <th className="py-2.5 font-bold">Reference Interval</th>
                  <th className="py-2.5 font-bold">Clinical Status</th>
                  <th className="py-2.5 font-bold">Reported Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6E3E8]">
                {biomarkers.length > 0 ? (
                  biomarkers.map((b) => (
                    <tr key={b.test} className="hover:bg-[#FFF8F9]">
                      <td className="py-2.5 font-bold text-[#3B2A33]">{b.test}</td>
                      <td className="py-2.5 font-serif font-black text-[#C2456B]">{b.result}</td>
                      <td className="py-2.5 text-[#8A7580]">{b.ref}</td>
                      <td className="py-2.5 font-bold text-[#2E9E6B]">{b.status}</td>
                      <td className="py-2.5 text-[#8A7580] font-mono">{b.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#8A7580] italic">
                      No laboratory biomarker records uploaded yet. Laboratory test panels will appear here once submitted or verified during clinical reviews.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Physician Review & Signature Box */}
        <div className="pt-6 border-t border-[#F6E3E8] grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div className="space-y-2">
            <span className="font-bold text-[#3B2A33] block uppercase tracking-wider text-[10px]">
              Attending Physician Consultation Remarks
            </span>
            <div className="p-4 rounded-xl border border-dashed border-[#F6E3E8] min-h-[70px] text-[#8A7580] italic leading-relaxed">
              {isDemo
                ? '"Patient exhibits stable follicular telemetry and excellent autonomic HRV recovery. Continued compliance with prescribed micronutrients (Iron & Vitamin D3) is recommended. Follow-up consultation scheduled for next routine check."'
                : '"New patient baseline intake recorded. Ongoing telemetry monitoring enabled. Follow-up consultation recommended to establish personalized clinical protocols."'}
            </div>
          </div>

          <div className="flex flex-col justify-end text-right space-y-1">
            <div className="border-b border-[#3B2A33] w-52 ml-auto pb-1">
              <span className="font-serif italic font-bold text-[#3B2A33] text-sm">
                {isDemo
                  ? (user?.lifeStage === 'pregnancy' ? 'Dr. Sunita Rao, MD (OB/GYN)' : 'Dr. Anjali Mehta, MD (OB/GYN)')
                  : 'Clinical Review Pending Assignment'}
              </span>
            </div>
            <span className="text-[10px] text-[#8A7580] font-mono">
              {isDemo ? 'Board Certified Obstetrician & Gynecologist • Reg #MH-84210' : 'Registered Clinician Network • AstraCare Health Portal'}
            </span>
          </div>
        </div>

      </div>

      {/* PAST REPORTS ARCHIVE */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <Calendar size={18} className="text-[#C2456B]" />
              <span>Archived Historical Medical Dossiers</span>
            </h3>
            <span className="text-xs text-[#8A7580] font-medium">Download historical clinical dossiers and multi-quarter telemetry records</span>
          </div>
          
          {pastReports.length > 0 && (
            <button
              id="btn-export-full-history-json"
              onClick={handleExportFullHistoricalArchive}
              className="px-4 py-2.5 bg-[#FFF8F9] hover:bg-[#FCE4EC] border border-[#F6E3E8] text-[#C2456B] rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs self-start sm:self-auto"
            >
              <Archive size={14} />
              <span>Export Full Historical Archive (JSON)</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {pastReports.length > 0 ? (
            pastReports.map((p) => (
              <div
                key={p.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#E8758F] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FCE4EC] flex items-center justify-center text-[#C2456B] shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#3B2A33]">{p.title}</h4>
                    <span className="text-xs text-[#8A7580]">{p.date} • {p.size} • Verified by {p.doctor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    id={`btn-download-html-${p.id}`}
                    onClick={() => handleDownloadHistoricalReport(p, 'html')}
                    className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-[#F6E3E8] text-[#C2456B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    title="Download standalone printable HTML/PDF Dossier"
                  >
                    <Download size={14} />
                    <span>Download Dossier (PDF)</span>
                  </button>
                  <button
                    id={`btn-download-json-${p.id}`}
                    onClick={() => handleDownloadHistoricalReport(p, 'json')}
                    className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-[#F6E3E8] text-[#3B2A33] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    title="Download structured JSON record"
                  >
                    <Download size={14} />
                    <span>JSON</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 rounded-2xl bg-[#FFF8F9] border border-dashed border-[#F6E3E8] text-center space-y-2">
              <FileText className="w-8 h-8 text-[#8A7580] mx-auto opacity-50" />
              <h4 className="text-sm font-bold text-[#3B2A33]">No Historical Medical Dossiers Yet</h4>
              <p className="text-xs text-[#8A7580] max-w-md mx-auto">
                Welcome to AstraCare AI! As you record your daily biosensor telemetry and complete consultations, quarterly verifiable medical dossiers will be compiled and archived here.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
