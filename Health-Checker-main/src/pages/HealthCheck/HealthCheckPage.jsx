import React, { useState } from 'react';
import { 
  Activity, 
  Scale, 
  Flame, 
  Droplet, 
  HeartPulse, 
  ShieldCheck, 
  Info 
} from 'lucide-react';
import SymptomCheckerModal from '../../components/health/SymptomCheckerModal';
import { 
  BMICalculator, 
  BMRCalorieCalculator, 
  WaterIntakeCalculator, 
  DiabetesRiskCalculator 
} from '../../components/health/HealthCalculators';

const HealthCheckPage = () => {
  const [activeTab, setActiveTab] = useState('symptoms'); // 'symptoms' | 'calculators' | 'risk'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-teal-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold border border-white/20">
            <Activity className="w-3.5 h-3.5 text-sky-300" />
            Clinical Algorithms & Triage
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Health Check & Symptom Evaluator
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed font-normal">
            Evaluate symptoms with evidence-based decision trees, calculate vital metabolic health metrics, and identify potential risk factors before consulting your physician.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('symptoms')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'symptoms'
              ? 'health-gradient text-white shadow-md shadow-sky-500/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          Symptom Checker
        </button>

        <button
          onClick={() => setActiveTab('calculators')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'calculators'
              ? 'health-gradient text-white shadow-md shadow-sky-500/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          Health Calculators
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'risk'
              ? 'health-gradient text-white shadow-md shadow-sky-500/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          Risk Assessments
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'symptoms' && (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-200">
          <SymptomCheckerModal />
        </div>
      )}

      {activeTab === 'calculators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          <BMICalculator />
          <BMRCalorieCalculator />
          <div className="md:col-span-2">
            <WaterIntakeCalculator />
          </div>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
          <DiabetesRiskCalculator />
        </div>
      )}

      {/* Safety Notice */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Safety Notice:</strong> These self-assessment questionnaires and calculators provide educational indicators and do not substitute for formal clinical laboratory analysis or diagnostic physician consultation. If experiencing intense chest pain, shortness of breath, or emergency symptoms, contact local emergency services immediately.
        </p>
      </div>

    </div>
  );
};

export default HealthCheckPage;
