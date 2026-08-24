import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { 
  X, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Award, 
  Globe2, 
  Quote, 
  Sun, 
  Moon,
  Sparkles,
  Loader2
} from 'lucide-react';
import timoraLogo from '../assets/timora-logo.jpg';

export default function DailyReportModal({ isOpen, onClose, records = [] }) {
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      // High-resolution canvas capture
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // 2x resolution for crisp text and graphics
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });
      
      const imageURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = `timora-daily-progress-report-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export daily report as image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content daily-report-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', maxHeight: '92vh', background: '#F8FAFC' }}
      >
        {/* Modal Top Actions */}
        <div className="modal-header" style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <h3 style={{ color: '#0F172A', fontSize: '1.1rem', fontWeight: '700' }}>
              Daily Progress Report
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button 
              className="primary-btn" 
              onClick={handleDownloadImage}
              disabled={isExporting}
              style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
            >
              {isExporting ? <Loader2 size={14} className="spin-anim" /> : <Download size={14} />}
              <span>{isExporting ? 'Exporting...' : 'Save as Image (PNG)'}</span>
            </button>

            <button 
              className="secondary-btn" 
              onClick={handlePrint}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', color: '#0F172A', borderColor: '#CBD5E1' }}
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button 
              className="modal-close-btn" 
              onClick={onClose}
              style={{ color: '#64748B' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Canvas (Exact match to design specification sheet) */}
        <div className="modal-body" style={{ padding: '1.5rem', background: '#F1F5F9' }}>
          <div 
            ref={reportRef} 
            className="printable-report-card"
            style={{ 
              background: '#FFFFFF', 
              borderRadius: '16px', 
              padding: '2rem', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              color: '#0F172A',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {/* Header / Brand Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img 
                  src={timoraLogo} 
                  alt="Timora Logo" 
                  style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A', margin: 0, lineHeight: '1.2' }}>
                    Good day, Vidhya! 👋
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                    Here is your daily focus & productivity summary.
                  </p>
                </div>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', background: '#F8FAFC', borderRadius: '9999px', border: '1px solid #E2E8F0', fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>
                <Calendar size={14} color="var(--primary)" />
                <span>{todayDateStr}</span>
              </div>
            </div>

            {/* 4 Metric Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              {/* Stat 1: Focus Sessions */}
              <div style={{ background: '#FFF1F2', borderRadius: '12px', padding: '1rem', border: '1px solid #FFE4E6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E11D48', fontSize: '0.75rem', fontWeight: '600' }}>
                  <Clock size={14} /> Focus Sessions
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', margin: '0.25rem 0' }}>
                  12
                </div>
                <span style={{ fontSize: '0.725rem', color: '#E11D48', fontWeight: '600' }}>Today</span>
              </div>

              {/* Stat 2: Focus Time */}
              <div style={{ background: '#ECFDF5', borderRadius: '12px', padding: '1rem', border: '1px solid #D1FAE5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.75rem', fontWeight: '600' }}>
                  <TrendingUp size={14} /> Focus Time
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', margin: '0.25rem 0' }}>
                  8h 30m
                </div>
                <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: '600' }}>This Week</span>
              </div>

              {/* Stat 3: Tasks Completed */}
              <div style={{ background: '#FFFBEB', borderRadius: '12px', padding: '1rem', border: '1px solid #FEF3C7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#D97706', fontSize: '0.75rem', fontWeight: '600' }}>
                  <CheckCircle2 size={14} /> Tasks Completed
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', margin: '0.25rem 0' }}>
                  18
                </div>
                <span style={{ fontSize: '0.725rem', color: '#D97706', fontWeight: '600' }}>This Week</span>
              </div>

              {/* Stat 4: Productivity */}
              <div style={{ background: '#F5F3FF', borderRadius: '12px', padding: '1rem', border: '1px solid #EDE9FE' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7C3AED', fontSize: '0.75rem', fontWeight: '600' }}>
                  <Award size={14} /> Productivity
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', margin: '0.25rem 0' }}>
                  92%
                </div>
                <span style={{ fontSize: '0.725rem', color: '#7C3AED', fontWeight: '600' }}>Efficiency Rate</span>
              </div>
            </div>

            {/* Middle 2-Column Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
              {/* World Clock Snapshot */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  <Globe2 size={16} color="var(--primary)" />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Global Clocks</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', paddingBottom: '0.35rem', borderBottom: '1px solid #EDF2F7' }}>
                    <span>🇮🇳 Mumbai, India</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>09:30 AM <Sun size={12} color="#F59E0B" style={{ verticalAlign: 'middle' }} /></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', paddingBottom: '0.35rem', borderBottom: '1px solid #EDF2F7' }}>
                    <span>🇺🇸 New York, USA</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>12:00 AM <Moon size={12} color="#8B5CF6" style={{ verticalAlign: 'middle' }} /></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', paddingBottom: '0.35rem', borderBottom: '1px solid #EDF2F7' }}>
                    <span>🇬🇧 London, UK</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>05:00 AM</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', paddingBottom: '0.35rem', borderBottom: '1px solid #EDF2F7' }}>
                    <span>🇯🇵 Tokyo, Japan</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>01:00 PM <Sun size={12} color="#F59E0B" style={{ verticalAlign: 'middle' }} /></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem' }}>
                    <span>🇦🇺 Sydney, Australia</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>02:00 PM <Sun size={12} color="#F59E0B" style={{ verticalAlign: 'middle' }} /></span>
                  </div>
                </div>
              </div>

              {/* Tasks Checklist */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Today's Tasks</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ textDecoration: 'line-through', color: '#94A3B8' }}>✓ Complete research proposal</span>
                    <span style={{ background: '#FFE4E6', color: '#E11D48', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600' }}>Work</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>✓ Read 20 pages of book</span>
                    <span style={{ background: '#EDE9FE', color: '#7C3AED', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600' }}>Personal</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>✓ Workout for 30 minutes</span>
                    <span style={{ background: '#DCFCE7', color: '#059669', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600' }}>Health</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>✓ Learn new concepts</span>
                    <span style={{ background: '#E0F2FE', color: '#0284C7', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600' }}>Study</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Time Chart & Stephen Covey Quote */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {/* Focus Time Chart */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Focus Time This Week</h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)' }}>Peak: 8h 30m</span>
                </div>

                {/* Minimalist Bar Chart */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '90px', paddingBottom: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
                  {[
                    { day: 'Mon', height: '35%' },
                    { day: 'Tue', height: '65%' },
                    { day: 'Wed', height: '45%' },
                    { day: 'Thu', height: '95%', active: true },
                    { day: 'Fri', height: '60%' },
                    { day: 'Sat', height: '80%' },
                    { day: 'Sun', height: '40%' },
                  ].map((bar, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', width: '28px' }}>
                      <div 
                        style={{ 
                          width: '12px', 
                          height: bar.height, 
                          background: bar.active ? 'linear-gradient(180deg, #FF4D6D, #FF8FA3)' : '#CBD5E1', 
                          borderRadius: '4px' 
                        }} 
                      />
                      <span style={{ fontSize: '0.7rem', color: bar.active ? 'var(--primary)' : '#64748B', fontWeight: bar.active ? '700' : '500' }}>
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote Widget */}
              <div style={{ background: 'linear-gradient(135deg, #FFF5F7 0%, #FFF0F3 100%)', borderRadius: '12px', padding: '1.25rem', border: '1px solid #FFE4E6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Quote size={20} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.8rem', color: '#1E293B', fontStyle: 'italic', lineHeight: '1.4', margin: 0 }}>
                  "The key is not to prioritize what's on your schedule, but to schedule your priorities."
                </p>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', marginTop: '0.5rem' }}>
                  — Stephen Covey
                </div>
              </div>
            </div>

            {/* Footer Sign-off */}
            <div style={{ textAlign: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '1rem', fontSize: '0.75rem', color: '#94A3B8' }}>
              Generated by <strong>Timora</strong> • No registration needed • Downloaded locally on {todayDateStr}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
