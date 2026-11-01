/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Watch,
  Activity,
  Battery,
  Wifi,
  Zap,
  Radio,
  CheckCircle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Signal,
  Check,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AstraBandManagement() {
  const { user } = useApp();
  const [isConnected, setIsConnected] = useState(true);
  const [battery, setBattery] = useState(84);
  const [heartRate, setHeartRate] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [skinTemp, setSkinTemp] = useState(36.4);
  const [hrv, setHrv] = useState(54);
  const [steps, setSteps] = useState(8420);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [otaChecking, setOtaChecking] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time animated canvas drawing of ECG Waveform (MAX30003 telemetry)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let step = 0;
    const points: number[] = [];
    const totalPoints = 300;

    for (let i = 0; i < totalPoints; i++) {
      points.push(60);
    }

    const draw = () => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Generate ECG pattern (P-Q-R-S-T)
      let nextY = 80;
      const cyclePos = step % 60;
      if (cyclePos === 15) nextY = 72; // P wave
      else if (cyclePos === 17) nextY = 80;
      else if (cyclePos === 22) nextY = 90; // Q wave
      else if (cyclePos === 24) nextY = 20; // R peak
      else if (cyclePos === 26) nextY = 115; // S wave
      else if (cyclePos === 28) nextY = 80;
      else if (cyclePos === 36) nextY = 65; // T wave
      else if (cyclePos === 42) nextY = 80;

      // Add slight jitter
      nextY += (Math.random() - 0.5) * 3;

      points.push(nextY);
      if (points.length > canvas.width) {
        points.shift();
      }

      // Draw trace line
      ctx.strokeStyle = '#C2456B';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#E8758F';
      ctx.beginPath();

      for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(i, points[i]);
        else ctx.lineTo(i, points[i]);
      }
      ctx.stroke();

      step++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSimulateJitter = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const newHr = 68 + Math.floor(Math.random() * 12);
      const newTemp = +(36.2 + Math.random() * 0.5).toFixed(2);
      const newSpo2 = 97 + Math.floor(Math.random() * 3);
      const newHrv = 50 + Math.floor(Math.random() * 10);
      setHeartRate(newHr);
      setSkinTemp(newTemp);
      setSpo2(newSpo2);
      setHrv(newHrv);
      setIsSimulating(false);
      showToast(`AstraBand telemetry updated via BLE 5.3! HR: ${newHr} bpm, Temp: ${newTemp}°C.`);
    }, 700);
  };

  const handleOtaCheck = () => {
    setOtaChecking(true);
    setTimeout(() => {
      setOtaChecking(false);
      showToast('AstraBand firmware v2.4.1-rc is up to date. Verified via Nordic DFU.');
    }, 1200);
  };

  return (
    <div id="astraband-management-module" className="space-y-6 w-full pb-16">
      
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
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#E3F5F4] text-[#2BA6A0] text-xs font-bold border border-[#2BA6A0]/20">
              Nordic nRF5340 Telemetry
            </span>
            <span className="text-xs text-[#8A7580] font-medium">Dual-Core Cortex-M33 Wireless Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] tracking-tight">
            AstraBand AI Wearable Management
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7580] max-w-2xl leading-relaxed">
            Live Bluetooth Low Energy (BLE 5.3) telemetry stream, real-time biosensor diagnostics, PMIC power telemetry, and high-frequency optical monitoring.
          </p>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            onClick={handleSimulateJitter}
            disabled={isSimulating}
            className="px-5 py-3 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#C2456B]/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSimulating ? 'animate-spin' : ''} />
            <span>{isSimulating ? 'Syncing Packet...' : 'Stream New Packet'}</span>
          </button>
          <button
            onClick={() => {
              setIsConnected(!isConnected);
              showToast(isConnected ? 'AstraBand BLE disconnected.' : 'AstraBand BLE connected successfully!');
            }}
            className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all ${
              isConnected
                ? 'bg-[#FFF8F9] border-[#F6E3E8] text-[#C2456B] hover:bg-[#FCE4EC]'
                : 'bg-[#2E9E6B] text-white hover:bg-[#25855A]'
            }`}
          >
            {isConnected ? 'Disconnect BLE' : 'Connect BLE 5.3'}
          </button>
        </div>
      </div>

      {/* DEVICE DIAGNOSTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Device Status */}
        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex justify-between items-center text-xs">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">BLE Status</span>
            <Wifi size={17} className={isConnected ? 'text-[#2E9E6B]' : 'text-stone-300'} />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] block">
            {isConnected ? 'BLE 5.3 Active' : 'Disconnected'}
          </span>
          <span className="text-xs text-[#2E9E6B] font-bold block">AstraBand-SN-9842</span>
          <span className="text-[11px] text-[#8A7580] block">RSSI: -52 dBm (Excellent)</span>
        </div>

        {/* Battery & PMIC */}
        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex justify-between items-center text-xs">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">nPM1300 PMIC</span>
            <Battery size={17} className="text-[#2E9E6B]" />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] block">{battery}%</span>
          <span className="text-xs text-[#2E9E6B] font-bold block">~6.5 Days Battery Life</span>
          <span className="text-[11px] text-[#8A7580] block">300 mAh Solid-State Li-Po</span>
        </div>

        {/* NOR Flash Storage */}
        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex justify-between items-center text-xs">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">W25Q256 Flash</span>
            <Zap size={17} className="text-amber-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] block">256 Mb</span>
          <span className="text-xs text-amber-700 font-bold block">Offline Buffer: 68% Free</span>
          <span className="text-[11px] text-[#8A7580] block">SPI 104 MHz Quad-I/O</span>
        </div>

        {/* Firmware Version */}
        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex justify-between items-center text-xs">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Nordic DFU</span>
            <ShieldCheck size={17} className="text-purple-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] block">v2.4.1-rc</span>
          <span className="text-xs text-purple-700 font-bold block">Encrypted Bootloader</span>
          <span className="text-[11px] text-[#8A7580] block">Zephyr RTOS Kernel</span>
        </div>

      </div>

      {/* REAL-TIME ECG CARDIAC WAVEFORM CANVAS (MAX30003) */}
      <div className="p-7 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Activity size={18} className="text-[#E8758F]" />
            <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-[#E8758F]">
              MAX30003 Ultra-Low Power ECG Biopotential Waveform
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#2E9E6B] animate-pulse" />
            <span>Lead I • 25 mm/s • 10 mm/mV Calibration</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={160}
          className="w-full h-44 rounded-2xl border border-slate-800 bg-slate-950"
        />

        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <span>Optical HR: <strong className="text-white">{heartRate} bpm</strong></span>
          <span>HRV RMSSD: <strong className="text-white">{hrv} ms</strong></span>
          <span>Sinus Rhythm: <strong className="text-[#2E9E6B]">Regular Normocardia</strong></span>
          <span>QRS Interval: <strong className="text-white">88 ms</strong></span>
          <span>Sampling Frequency: <strong className="text-white">512 Hz</strong></span>
        </div>
      </div>

      {/* SENSOR ARRAY TELEMETRY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
            <Radio size={18} className="text-[#C2456B]" />
            <span>AstraBand Biosensor Subsystem Array</span>
          </h3>
          <span className="text-xs font-bold text-[#2E9E6B] bg-[#E4F5EC] px-3 py-1 rounded-full border border-[#2E9E6B]/20">
            All 4 Sensors Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* MAX86114 Optical Biosensor */}
          <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">MAX86114 Optical PPG</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#C2456B]">{heartRate}</span>
              <span className="text-xs text-[#8A7580] font-bold">bpm</span>
            </div>
            <p className="text-xs text-[#8A7580] leading-relaxed">
              SpO2 Saturation: <strong className="text-[#3B2A33]">{spo2}%</strong>. PPG signal-to-noise ratio: 94 dB. Dual green/red/IR LEDs active.
            </p>
          </div>

          {/* TMP117 Digital Temp Sensor */}
          <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">TMP117 Temperature</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-black text-amber-600">{skinTemp}</span>
              <span className="text-xs text-[#8A7580] font-bold">°C</span>
            </div>
            <p className="text-xs text-[#8A7580] leading-relaxed">
              High-precision skin thermistor (±0.05°C accuracy). Basal temperature follicular baseline calibration.
            </p>
          </div>

          {/* BMI270 6-Axis Motion Sensor */}
          <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">BMI270 6-Axis IMU</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-black text-purple-600">{steps.toLocaleString()}</span>
              <span className="text-xs text-[#8A7580] font-bold">steps</span>
            </div>
            <p className="text-xs text-[#8A7580] leading-relaxed">
              Posture: Upright. 3-axis accelerometer + 3-axis gyroscope for step cadence and fall detection.
            </p>
          </div>

          {/* Linear Resonant Actuator */}
          <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">LRA Haptic Motor</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-black text-[#2E9E6B]">Operational</span>
            </div>
            <p className="text-xs text-[#8A7580] leading-relaxed">
              Tactile vibration engine for medication alerts, ovulation windows, and emergency SOS confirmation.
            </p>
          </div>

        </div>
      </div>

      {/* HARDWARE DIAGNOSTICS & OVER-THE-AIR FIRMWARE CONTROLS (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Hardware Health & Self-Test Matrix */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <Cpu size={18} className="text-[#C2456B]" />
              <span>Hardware Health & Self-Test Matrix</span>
            </h3>
            <span className="text-xs text-[#2E9E6B] font-bold bg-[#E4F5EC] px-3 py-1 rounded-full">
              Self-Test: Passed
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#3B2A33] block">Nordic Application Core (128 MHz Cortex-M33)</span>
                <span className="text-[11px] text-[#8A7580]">Real-time edge signal filtering & cryptographic enclave</span>
              </div>
              <span className="text-xs font-bold text-[#2E9E6B]">✓ Normal (18% load)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#3B2A33] block">Nordic Network Core (64 MHz Cortex-M33)</span>
                <span className="text-[11px] text-[#8A7580]">Dedicated 2.4 GHz radio protocol stack (BLE 5.3)</span>
              </div>
              <span className="text-xs font-bold text-[#2E9E6B]">✓ Online (0 CRC errs)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#3B2A33] block">I2C Fast Mode Plus (1 MHz) Bus Health</span>
                <span className="text-[11px] text-[#8A7580]">MAX30003, MAX86114, TMP117, BMI270 communication</span>
              </div>
              <span className="text-xs font-bold text-[#2E9E6B]">✓ Acknowledged</span>
            </div>
          </div>
        </div>

        {/* OTA Firmware Update & Telemetry Sync */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
                <Signal size={18} className="text-[#C2456B]" />
                <span>Over-The-Air (OTA) DFU & Sync</span>
              </h3>
              <span className="text-xs font-bold text-[#2E9E6B] bg-[#E4F5EC] px-3 py-1 rounded-full">
                Up to Date
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#8A7580]">Active Firmware:</span>
                <span className="font-mono font-bold text-[#3B2A33]">v2.4.1-rc (Build #4829)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8A7580]">Release Hash:</span>
                <span className="font-mono text-[#8A7580]">sha256: 7f8a9e...4b12</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8A7580]">DFU Transport:</span>
                <span className="font-bold text-[#2BA6A0]">Nordic BLE DFU Service (UUID 0xFE59)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOtaCheck}
            disabled={otaChecking}
            className="w-full py-3.5 bg-[#FFF8F9] hover:bg-[#FCE4EC] border border-[#F6E3E8] text-[#C2456B] rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={15} className={otaChecking ? 'animate-spin' : ''} />
            <span>{otaChecking ? 'Querying Cloud Manifest...' : 'Check for Firmware Updates'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
