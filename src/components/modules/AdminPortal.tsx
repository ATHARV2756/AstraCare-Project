/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Database,
  Server,
  Activity,
  HardDrive,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Lock,
  Cpu,
  Layers,
  FileCode,
  Radio,
  Sliders,
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../data/demoAccounts';
import { api } from '../../services/apiClient';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  module: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'Patient' | 'Doctor' | 'Administrator';
  stage: string;
  status: 'Active' | 'Suspended';
  lastSeen: string;
}

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'audit' | 'cloud'>('overview');
  const [searchUser, setSearchUser] = useState('');
  const [backupRunning, setBackupRunning] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState('2026-10-29 18:30 IST');

  // Simulated User Accounts
  const [usersList, setUsersList] = useState<ManagedUser[]>([
    {
      id: 'demo-reproductive',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'Patient',
      stage: 'Reproductive (PCOS Focus)',
      status: 'Active',
      lastSeen: '2 mins ago',
    },
    {
      id: 'demo-pregnancy',
      name: 'Ananya Patel',
      email: 'ananya@example.com',
      role: 'Patient',
      stage: 'Pregnancy (Week 24)',
      status: 'Active',
      lastSeen: '14 mins ago',
    },
    {
      id: 'doc-mehta',
      name: 'Dr. Anjali Mehta, MD',
      email: 'dr.mehta@bombayhospital.org',
      role: 'Doctor',
      stage: 'Verified OB/GYN Clinician',
      status: 'Active',
      lastSeen: '1 hour ago',
    },
    {
      id: 'admin-super',
      name: 'System Superadmin',
      email: 'admin@womenshealth.internal',
      role: 'Administrator',
      stage: 'Infrastructure & Security',
      status: 'Active',
      lastSeen: 'Just now',
    },
  ]);

  // Simulated Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-101',
      timestamp: '2026-10-29 20:45:12',
      actor: 'priya@example.com',
      role: 'Patient',
      action: 'CYCLE_LOG_ENTRY_CREATED',
      module: 'M2_CYCLE_TRACKING',
      ipAddress: '103.21.124.89 (Mumbai, IN)',
      status: 'SUCCESS',
    },
    {
      id: 'log-102',
      timestamp: '2026-10-29 20:38:04',
      actor: 'ananya@example.com',
      role: 'Patient',
      action: 'AI_ASSISTANT_QUERY_SUBMITTED',
      module: 'M4_AI_HEALTH_ASSISTANT',
      ipAddress: '117.195.42.10 (Bengaluru, IN)',
      status: 'SUCCESS',
    },
    {
      id: 'log-103',
      timestamp: '2026-10-29 20:15:55',
      actor: 'dr.mehta@bombayhospital.org',
      role: 'Doctor',
      action: 'CLINICAL_NOTE_SIGNED_M14',
      module: 'M14_DOCTORS_CONSOLE',
      ipAddress: '14.139.122.5 (Mumbai, IN)',
      status: 'SUCCESS',
    },
    {
      id: 'log-104',
      timestamp: '2026-10-29 19:50:20',
      actor: 'AstraBand-Nordic-5340',
      role: 'Telemetry_Daemon',
      action: 'BLE_MAX30003_ECG_STREAM_SYNC',
      module: 'M9_ASTRABAND_TELEMETRY',
      ipAddress: '192.168.1.104 (Gateway)',
      status: 'SUCCESS',
    },
    {
      id: 'log-105',
      timestamp: '2026-10-29 18:30:00',
      actor: 'admin@womenshealth.internal',
      role: 'Administrator',
      action: 'SYSTEM_BACKUP_SNAPSHOT_TRIGGERED',
      module: 'M18_CLOUD_MANAGEMENT',
      ipAddress: '127.0.0.1 (Localhost)',
      status: 'SUCCESS',
    },
  ]);

  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    // Probe backend server
    api.getHealth().then((res) => {
      if (res && res.status === 'ONLINE') {
        setServerOnline(true);
      }
    });

    api.getAuditLogs().then((res) => {
      if (res && res.success && res.logs && res.logs.length > 0) {
        setAuditLogs(
          res.logs.map((l: any) => ({
            id: l.id,
            timestamp: l.timestamp,
            actor: l.actor_email,
            role: l.actor_role,
            action: l.action_event,
            module: l.module_code,
            ipAddress: l.ip_address,
            status: (l.status || 'SUCCESS') as 'SUCCESS' | 'WARNING' | 'FAILED',
          }))
        );
      }
    });
  }, []);

  const toggleUserStatus = (userId: string) => {
    api.toggleUserStatus(userId);
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleTriggerBackup = () => {
    setBackupRunning(true);
    api.triggerBackup().then(() => {
      setBackupRunning(false);
      const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
      setLastBackupTime(nowStr);
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: 'admin@womenshealth.internal',
          role: 'Administrator',
          action: 'MANUAL_ENCRYPTED_SNAPSHOT_SUCCESS',
          module: 'M18_CLOUD_MANAGEMENT',
          ipAddress: '127.0.0.1',
          status: 'SUCCESS',
        },
        ...prev,
      ]);
    }).catch(() => {
      setBackupRunning(false);
    });
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#D9607F] via-[#E8758F] to-[#D4879C] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-[#C2456B]/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 shadow-sm backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  System Governance & Infrastructure
                </span>
                <span className="text-xs text-white/80 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-white" />
                  DISHA & ISO-27001 Compliant
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border border-white/30 bg-white/20 text-white flex items-center gap-1.5 backdrop-blur-sm">
                  <span className={`w-1.5 h-1.5 rounded-full ${serverOnline ? 'bg-emerald-300 animate-pulse' : 'bg-amber-300'}`} />
                  {serverOnline ? 'REST API Online (Port 5000)' : 'Client Local DB'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif mt-1">Platform Admin & Infrastructure</h1>
              <p className="text-white/90 text-sm mt-0.5">
                Central control panel for user governance, telemetry streams, audit security logs, and encrypted cloud backups.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerBackup}
              disabled={backupRunning}
              className="px-4 py-2.5 rounded-xl bg-white text-[#C2456B] hover:bg-white/90 disabled:opacity-50 font-semibold text-sm transition-all shadow-md flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${backupRunning ? 'animate-spin' : ''}`} />
              {backupRunning ? 'Encrypting & Syncing...' : 'Backup Cloud Now'}
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-[#C2456B] shadow font-bold'
                : 'text-white/85 hover:bg-white/15'
            }`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-white text-[#C2456B] shadow font-bold'
                : 'text-white/85 hover:bg-white/15'
            }`}
          >
            User Governance ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'audit'
                ? 'bg-white text-[#C2456B] shadow font-bold'
                : 'text-white/85 hover:bg-white/15'
            }`}
          >
            Audit Security Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cloud'
                ? 'bg-white text-[#C2456B] shadow font-bold'
                : 'text-white/85 hover:bg-white/15'
            }`}
          >
            Cloud & Data Portability
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#F6E3E8] rounded-2xl p-5 shadow-[0_4px_24px_rgba(194,69,107,0.04)]">
              <div className="flex items-center justify-between text-[#8A7580] text-xs mb-2">
                <span>Active User Accounts</span>
                <Users className="w-4 h-4 text-[#C2456B]" />
              </div>
              <div className="text-2xl font-bold text-[#3B2A33]">
                {usersList.length} Accounts
              </div>
              <div className="text-xs text-[#2E9E6B] font-medium mt-1">
                2 Patients • 1 Doctor • 1 Admin
              </div>
            </div>

            <div className="bg-white border border-[#F6E3E8] rounded-2xl p-5 shadow-[0_4px_24px_rgba(194,69,107,0.04)]">
              <div className="flex items-center justify-between text-[#8A7580] text-xs mb-2">
                <span>AI Service (Gemini API)</span>
                <Cpu className="w-4 h-4 text-[#9B5B7A]" />
              </div>
              <div className="text-2xl font-bold text-[#3B2A33]">340 ms avg</div>
              <div className="text-xs text-[#2E9E6B] font-medium mt-1">
                99.98% uptime • Active key bound
              </div>
            </div>

            <div className="bg-white border border-[#F6E3E8] rounded-2xl p-5 shadow-[0_4px_24px_rgba(194,69,107,0.04)]">
              <div className="flex items-center justify-between text-[#8A7580] text-xs mb-2">
                <span>AstraBand BLE Streams</span>
                <Radio className="w-4 h-4 text-[#D9607F]" />
              </div>
              <div className="text-2xl font-bold text-[#3B2A33]">2 Devices</div>
              <div className="text-xs text-[#2E9E6B] font-medium mt-1">
                Nordic nRF5340 dual-core BLE 5.3
              </div>
            </div>

            <div className="bg-white border border-[#F6E3E8] rounded-2xl p-5 shadow-[0_4px_24px_rgba(194,69,107,0.04)]">
              <div className="flex items-center justify-between text-[#8A7580] text-xs mb-2">
                <span>Encrypted Cloud Sync</span>
                <UploadCloud className="w-4 h-4 text-[#2BA6A0]" />
              </div>
              <div className="text-2xl font-bold text-[#3B2A33]">AES-256 GCM</div>
              <div className="text-xs text-[#8A7580] font-medium mt-1">
                Last sync: {lastBackupTime}
              </div>
            </div>
          </div>

          {/* Subsystems Architecture Health */}
          <div className="bg-white border border-[#F6E3E8] rounded-2xl p-6 shadow-[0_4px_24px_rgba(194,69,107,0.04)]">
            <h2 className="text-base font-bold text-[#3B2A33] mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#C2456B]" />
              Document Architecture Modules Status (M1 through M18)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {[
                { name: 'M1: User Onboarding & Auth', status: 'Operational', color: 'emerald' },
                { name: 'M2: Menstrual & Pregnancy Engine', status: 'Operational', color: 'emerald' },
                { name: 'M3: AI Health Intelligence', status: 'Operational', color: 'emerald' },
                { name: 'M4: Conversational Assistant', status: 'Operational', color: 'emerald' },
                { name: 'M5: Central Health Dashboard', status: 'Operational', color: 'emerald' },
                { name: 'M6: Nutrition & Hydration Tracker', status: 'Operational', color: 'emerald' },
                { name: 'M7: Fitness & Sleep Architecture', status: 'Operational', color: 'emerald' },
                { name: 'M8: Mental Wellness & 4-7-8 Soothing', status: 'Operational', color: 'emerald' },
                { name: 'M9: AstraBand BLE Telemetry & ECG', status: 'Operational', color: 'emerald' },
                { name: 'M10: Clinical Reports & PDF Export', status: 'Operational', color: 'emerald' },
                { name: 'M11: AI Multi-Risk Predictor', status: 'Operational', color: 'emerald' },
                { name: 'M12: Medication Reminders & Adherence', status: 'Operational', color: 'emerald' },
                { name: 'M13: Emergency SOS & Medical ID', status: 'Operational', color: 'emerald' },
                { name: 'M14: Doctor Consultation Console', status: 'Operational', color: 'emerald' },
                { name: 'M15: Admin Governance Portal', status: 'Operational', color: 'emerald' },
                { name: 'M16: Notification Center & Alerts', status: 'Operational', color: 'emerald' },
                { name: 'M17: AI Digital Health Twin', status: 'Operational', color: 'emerald' },
                { name: 'M18: Cloud Data Sync & Schema Backup', status: 'Operational', color: 'emerald' },
              ].map((mod, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8] flex items-center justify-between"
                >
                  <span className="font-medium text-[#3B2A33] truncate pr-2">
                    {mod.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E4F5EC] text-[#2E9E6B] shrink-0 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {mod.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white border border-[#F6E3E8] rounded-2xl p-6 shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#3B2A33] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C2456B]" />
                User & Clinician Account Management
              </h2>
              <p className="text-xs text-[#8A7580] mt-0.5">
                Manage roles, inspect active consent tokens, and toggle account states.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#8A7580] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-[#FFF8F9] border border-[#F6E3E8] rounded-xl text-[#3B2A33] placeholder-[#8A7580] focus:outline-none focus:ring-2 focus:ring-[#C2456B]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF8F9] text-[#8A7580] font-semibold border-y border-[#F6E3E8]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Profile Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6E3E8]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FFF8F9]/60">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#3B2A33]">{u.name}</div>
                      <div className="text-[11px] text-[#8A7580]">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.role === 'Patient'
                            ? 'bg-[#FCE4EC] text-[#C2456B]'
                            : u.role === 'Doctor'
                            ? 'bg-[#E3F5F4] text-[#2BA6A0]'
                            : 'bg-[#FCE4EC] text-[#9B5B7A]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#3B2A33]">{u.stage}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.status === 'Active'
                            ? 'bg-[#E4F5EC] text-[#2E9E6B]'
                            : 'bg-[#FDE8E8] text-[#D93A3A]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'Active' ? 'bg-[#2E9E6B]' : 'bg-[#D93A3A]'
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#8A7580]">{u.lastSeen}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          u.status === 'Active'
                            ? 'bg-[#FFF8F9] hover:bg-[#FDE8E8] text-[#8A7580] hover:text-[#D93A3A] border border-[#F6E3E8]'
                            : 'bg-[#2E9E6B] text-white'
                        }`}
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[#F6E3E8] rounded-2xl p-6 shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#3B2A33] flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#C2456B]" />
                Security & Compliance Audit Logs (Document Table 5.20)
              </h2>
              <p className="text-xs text-[#8A7580] mt-0.5">
                Immutable chronological event trail recording patient data accesses, doctor notes, and hardware telemetry ingest.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E4F5EC] text-[#2E9E6B] border border-[#BCE8D1]">
              Live Stream Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FFF8F9] text-[#8A7580] font-semibold border-y border-[#F6E3E8]">
                <tr>
                  <th className="py-3 px-4">Timestamp (IST)</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Module Code</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6E3E8]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FFF8F9]/60">
                    <td className="py-3 px-4 text-[#8A7580]">{log.timestamp}</td>
                    <td className="py-3 px-4 font-sans text-[#3B2A33]">
                      {log.actor}
                    </td>
                    <td className="py-3 px-4 text-[#C2456B] font-semibold">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-[#8A7580]">{log.module}</td>
                    <td className="py-3 px-4 text-[#8A7580]">{log.ipAddress}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E4F5EC] text-[#2E9E6B]">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CLOUD MANAGEMENT & DATA PORTABILITY (M18) */}
      {activeTab === 'cloud' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#F6E3E8] rounded-2xl p-6 shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
            <h2 className="text-base font-bold text-[#3B2A33] flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#C2456B]" />
              Cloud Sync & Encrypted Snapshots
            </h2>
            <p className="text-xs text-[#8A7580] leading-relaxed">
              Longitudinal biometrics and clinical charts are backed up using end-to-end authenticated encryption (AES-256-GCM) with automated failover and schema checksum verification.
            </p>

            <div className="p-4 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8A7580]">Database Schema Version:</span>
                <span className="font-semibold text-[#3B2A33]">v2.4 (Tables 5.1 - 5.21)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A7580]">Total Encrypted Storage:</span>
                <span className="font-semibold text-[#3B2A33]">4.82 MB / 5.0 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A7580]">Last Snapshot Timestamp:</span>
                <span className="font-semibold text-[#2E9E6B]">{lastBackupTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleTriggerBackup}
                disabled={backupRunning}
                className="px-4 py-2.5 rounded-xl bg-[#C2456B] hover:bg-[#A8385A] text-white font-medium text-xs shadow-md shadow-[#C2456B]/20 flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${backupRunning ? 'animate-spin' : ''}`} />
                {backupRunning ? 'Taking Snapshot...' : 'Create Snapshot Now'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#F6E3E8] rounded-2xl p-6 shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
            <h2 className="text-base font-bold text-[#3B2A33] flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#2BA6A0]" />
              Data Portability & Patient Data Rights
            </h2>
            <p className="text-xs text-[#8A7580] leading-relaxed">
              In accordance with DPDP (Digital Personal Data Protection Act) and GDPR, users may download full data portability dumps in machine-readable JSON format at any time.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  const dump = {
                    metadata: {
                      system: 'AI Based Women Health Tracker',
                      exportedAt: new Date().toISOString(),
                      schemaVersion: '2.4',
                    },
                    accounts: DEMO_ACCOUNTS,
                  };
                  const blob = new Blob([JSON.stringify(dump, null, 2)], {
                    type: 'application/json',
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `womens_health_platform_dump_${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full p-3.5 rounded-xl border border-[#F6E3E8] hover:border-[#C2456B] bg-[#FFF8F9] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-semibold text-[#3B2A33] block">
                    Download Full Patient Database (JSON)
                  </span>
                  <span className="text-[#8A7580] text-[11px]">
                    Includes demography, menstrual cycles, meal logs, fitness, and telemetry
                  </span>
                </div>
                <Download className="w-4 h-4 text-[#8A7580]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

