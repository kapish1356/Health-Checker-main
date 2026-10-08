import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  PhoneCall, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Send, 
  Lock, 
  Activity, 
  CheckCircle2 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const toast = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('You have subscribed to CheckHealth weekly wellness insights!', 'Subscribed');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Emergency Alert Banner inside Footer */}
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border border-rose-800/50 rounded-3xl p-6 sm:p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <PhoneCall className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                Experiencing a Medical Emergency?
                <span className="inline-block px-2 py-0.5 bg-rose-500 text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                  Immediate 24/7 Support
                </span>
              </h4>
              <p className="text-slate-400 text-sm mt-0.5">
                For life-threatening symptoms, chest pain, stroke signs, or severe trauma, call local emergency lines immediately.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <a
              href="tel:112"
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-900/30 transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Dial 112 (National Emergency)
            </a>
            <a
              href="tel:108"
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-800/40 font-bold text-sm transition-all"
            >
              Ambulance (108 / 102)
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl health-gradient flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">CheckHealth</span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed pr-6">
              CheckHealth is your all-in-one digital healthcare ecosystem. Find top verified medical specialists, book video & clinic consultations, order home lab tests, check symptoms with clinical algorithms, and safeguard all your medical records in one place.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                HIPAA & DISHA Aligned
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Lock className="w-4 h-4" />
                256-Bit Encrypted Data
              </span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Healthcare Services
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/doctors" className="hover:text-cyan-400 transition-colors">Find Doctors</Link></li>
              <li><Link to="/health-check" className="hover:text-cyan-400 transition-colors">Symptom Checker</Link></li>
              <li><Link to="/health-check" className="hover:text-cyan-400 transition-colors">Health Calculators</Link></li>
              <li><Link to="/lab-tests" className="hover:text-cyan-400 transition-colors">Full Body Checkups</Link></li>
              <li><Link to="/medicines" className="hover:text-cyan-400 transition-colors">Medicine Directory</Link></li>
              <li><Link to="/medical-records" className="hover:text-cyan-400 transition-colors">Digital Health Locker</Link></li>
            </ul>
          </div>

          {/* Top Specialties */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Top Specialties
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/doctors?specialty=General Physician" className="hover:text-cyan-400 transition-colors">General Physician</Link></li>
              <li><Link to="/doctors?specialty=Cardiologist" className="hover:text-cyan-400 transition-colors">Cardiologist</Link></li>
              <li><Link to="/doctors?specialty=Dermatologist" className="hover:text-cyan-400 transition-colors">Dermatologist</Link></li>
              <li><Link to="/doctors?specialty=Neurologist" className="hover:text-cyan-400 transition-colors">Neurologist</Link></li>
              <li><Link to="/doctors?specialty=Orthopedic Specialist" className="hover:text-cyan-400 transition-colors">Orthopedics</Link></li>
              <li><Link to="/doctors?specialty=Pediatrician" className="hover:text-cyan-400 transition-colors">Pediatrician</Link></li>
            </ul>
          </div>

          {/* Newsletter / Insights */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Health Newsletter
            </h5>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get weekly doctor-reviewed wellness tips, seasonal health alerts, and preventive care reminders.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Subscribe Insights
              </button>
            </form>
          </div>

        </div>

        {/* Medical Disclaimer & Copyright */}
        <div className="border-t border-slate-800 pt-8 mt-8 text-xs text-slate-500 space-y-4">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 text-[11px] leading-relaxed text-slate-400">
            <span className="font-bold text-slate-300">MEDICAL DISCLAIMER:</span> CheckHealth is an informational and health technology platform. The diagnostic algorithms, calculators, symptom checkers, and health assessments provided on this website are for educational and preventive awareness only. They do not substitute for professional clinical medical advice, diagnosis, or treatment. Always consult a licensed medical practitioner for personalized healthcare guidance.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} CheckHealth Healthcare Technologies Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Doctor Verification Standards</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Telemedicine Guidelines</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
