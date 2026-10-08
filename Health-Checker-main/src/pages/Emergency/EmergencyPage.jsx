import React from 'react';
import { PhoneCall, ShieldAlert, Heart, Activity, AlertTriangle, LifeBuoy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmergencyPage = () => {
  const hotlines = [
    { title: 'National Emergency Helpline (All-in-One)', number: '112', desc: 'Police, Fire, Ambulance & Disaster Response', highlight: true },
    { title: 'Medical Emergency & Ambulance Services', number: '108 / 102', desc: '24x7 Free Ambulance Dispatch & Paramedic triage', highlight: true },
    { title: 'National Poison Information Centre (AIIMS)', number: '1800-116-117', desc: 'Accidental poisoning, toxic ingestion guidance', highlight: false },
    { title: 'Mental Health & Crisis Helpline (KIRAN)', number: '1800-599-0019', desc: '24x7 Confidential psychological first aid & support', highlight: false },
    { title: 'Women in Distress & Safety Helpline', number: '1091', desc: 'Immediate protection and emergency assistance', highlight: false },
    { title: 'Senior Citizen Health & Safety Helpline', number: '14567', desc: 'Elder care emergency and medical assistance', highlight: false }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Alert Header */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-rose-700/50">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40">
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            24x7 Critical Medical Assistance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Emergency Care & Direct Hotlines
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If you or someone around you is experiencing life-threatening symptoms, do not wait for an online appointment. Contact emergency services immediately.
          </p>
        </div>
      </div>

      {/* Direct Call Cards */}
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-4">Emergency Hotlines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotlines.map((h, i) => (
            <div
              key={i}
              className={`rounded-3xl p-6 border flex flex-col justify-between ${
                h.highlight
                  ? 'bg-rose-50/70 border-rose-300 shadow-sm'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">{h.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{h.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-2xl font-black text-rose-600">{h.number}</span>
                <a
                  href={`tel:${h.number.split('/')[0].trim()}`}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Direct Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Red Flag Protocols */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-black text-slate-900">Recognize Critical Red Flag Symptoms</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-rose-700 text-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4" /> Suspected Heart Attack
            </h3>
            <ul className="space-y-1 text-slate-600 list-disc pl-4 leading-relaxed">
              <li>Crushing pressure, fullness or squeezing in the center of the chest lasting &gt; a few minutes</li>
              <li>Pain radiating to the jaw, neck, left arm, or back</li>
              <li>Cold sweat, unexplained nausea, or extreme lightheadedness</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-rose-700 text-sm flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Stroke FAST Protocol
            </h3>
            <ul className="space-y-1 text-slate-600 list-disc pl-4 leading-relaxed">
              <li><strong>F - Face:</strong> One side of face droops when smiling</li>
              <li><strong>A - Arms:</strong> One arm drifts downward when raised</li>
              <li><strong>S - Speech:</strong> Slurred or strange speech</li>
              <li><strong>T - Time:</strong> Call 112 / 108 immediately if any symptom is present!</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Return to CheckHealth Home
        </Link>
      </div>

    </div>
  );
};

export default EmergencyPage;
