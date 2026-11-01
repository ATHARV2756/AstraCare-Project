/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  AlertOctagon, 
  Trash2, 
  CheckCircle, 
  ShieldAlert, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  generateHealthAssistantResponse, 
  ChatMessage, 
  checkEmergencyQuery 
} from '../../services/geminiService';
import EmergencySosModal from './EmergencySosModal';

export default function AiHealthAssistant() {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Priya';
  const isPregnancy = user?.lifeStage === 'pregnancy';

  const suggestedQuestions = isPregnancy
    ? [
        "How is my 2nd trimester progression?",
        "What are healthy fetal kick counts?",
        "Analyze my sleep & resting HR",
        "How much water should I drink in pregnancy?",
        "Explain my overall health score"
      ]
    : [
        "How was my sleep this week?",
        "When is my next period?",
        "Analyze my stress & HRV level",
        "How much water did I drink today?",
        "Explain my health insights"
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const vitalsContext = {
        hr: 64,
        hrv: 58,
        spo2: 98,
        skinTemp: 36.6,
        cycleDay: 11,
        hydration: 1750,
      };

      const res = await generateHealthAssistantResponse(query, user, vitalsContext);

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: res.isEmergencyAlert,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'assistant',
          text: "I experienced a temporary connection hiccup. Please ask again or check your recent telemetry in the Dashboard.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div id="ai-assistant-module" className="flex flex-col h-[calc(100vh-130px)] max-w-5xl mx-auto space-y-4">
      
      {/* Emergency SOS Modal (if triggered from chat) */}
      <EmergencySosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />

      {/* Header Bar */}
      <div className="p-4 bg-white rounded-3xl border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FCE4EC] flex items-center justify-center text-[#C2456B] shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-serif font-black text-[#3B2A33] tracking-tight">
                AstraCare AI Health Assistant
              </h1>
            </div>
            <p className="text-[11px] text-[#8A7580]">
              Context Injected: {firstName} ({user?.lifeStage || 'Reproductive'}) • AstraBand Biosensors Synced
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="px-3 py-1.5 text-xs text-[#8A7580] hover:text-[#3B2A33] hover:bg-[#FCE4EC]/50 rounded-xl transition-colors flex items-center gap-1 font-medium"
            >
              <Trash2 size={13} />
              <span>Clear Chat</span>
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E9E6B] bg-[#E4F5EC] px-2.5 py-1 rounded-full border border-[#2E9E6B]/20">
            <CheckCircle size={12} className="text-[#2E9E6B]" />
            <span>Clinical Guardrails Active</span>
          </span>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 bg-white rounded-3xl border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] overflow-y-auto p-4 sm:p-6 space-y-4">
        
        {/* Welcome Empty State (Matching Document p. 114) */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-8 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#FCE4EC] flex items-center justify-center text-[#C2456B] shadow-xs">
              <Bot size={32} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-serif font-black text-[#3B2A33] tracking-tight">
                How can I help you today, {firstName}?
              </h2>
              <p className="text-xs text-[#8A7580] leading-relaxed max-w-md">
                Ask me anything about your cycle history, sleep trends, stress levels, hydration goals, or general women's health.
              </p>
            </div>

            {/* Suggested Question Chips (Document p. 114) */}
            <div className="w-full space-y-2">
              <span className="text-[11px] font-bold text-[#8A7580] uppercase tracking-wider block">
                Suggested Questions
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="px-3.5 py-2 rounded-2xl bg-[#FFF8F9] hover:bg-[#FCE4EC] border border-[#F6E3E8] text-xs font-semibold text-[#3B2A33] hover:text-[#C2456B] transition-all text-left shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                  >
                    <span>{q}</span>
                    <ArrowRight size={12} className="text-[#9B5B7A]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#FCE4EC] flex items-center justify-center text-[#C2456B] shrink-0 mt-1 shadow-xs">
                  <Sparkles size={15} />
                </div>
              )}

              <div className={`max-w-2xl space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#C2456B] text-white rounded-tr-xs shadow-xs'
                      : msg.isEmergencyAlert
                      ? 'bg-red-50 text-red-950 border-2 border-red-300 rounded-tl-xs shadow-xs'
                      : 'bg-[#FFF8F9] text-[#3B2A33] border border-[#F6E3E8] rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {/* Emergency Special Banner */}
                  {msg.isEmergencyAlert && (
                    <div className="mb-3 flex items-center justify-between pb-2 border-b border-red-200">
                      <span className="text-xs font-black uppercase tracking-wider text-[#D93A3A] flex items-center gap-1.5">
                        <AlertOctagon size={16} className="text-[#D93A3A] animate-pulse" />
                        Triage Emergency Protocol
                      </span>
                      <button
                        onClick={() => setSosModalOpen(true)}
                        className="px-3 py-1 bg-[#D93A3A] hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-xs"
                      >
                        Open SOS Trigger →
                      </button>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>
                </div>

                <div className={`text-[10px] text-[#8A7580] px-1 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#3B2A33] flex items-center justify-center text-white shrink-0 mt-1 font-bold text-xs">
                  {firstName[0]}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Loading / Typing State */}
        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-[#FCE4EC] flex items-center justify-center text-[#C2456B] shrink-0 shadow-xs">
              <Sparkles size={15} />
            </div>
            <div className="p-3.5 bg-[#FFF8F9] border border-[#F6E3E8] rounded-2xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8758F] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#D4879C] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#C2456B] animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-[#8A7580] font-medium ml-1">Analyzing health telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer (Matching Document p. 114) */}
      <div className="p-3 bg-white rounded-3xl border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AstraCare AI about your cycle, sleep, stress, vitals, hydration..."
            className="flex-1 px-4 py-3 bg-[#FFF8F9] border border-[#F6E3E8] focus:outline-none focus:ring-2 focus:ring-[#C2456B]/20 focus:border-[#C2456B] rounded-2xl text-xs sm:text-sm text-[#3B2A33] transition-all placeholder:text-[#8A7580]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-3 bg-[#C2456B] hover:bg-[#b03d60] active:scale-95 text-white font-bold rounded-2xl text-xs transition-all shadow-xs disabled:opacity-40 disabled:scale-100 flex items-center gap-1.5"
          >
            <span>Ask</span>
            <Send size={14} />
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8A7580] text-center">
          <Info size={11} className="text-[#8A7580]" />
          <span>AstraCare AI provides evidence-backed wellness guidance and does not replace medical advice by licensed physicians.</span>
        </div>
      </div>

    </div>
  );
}

