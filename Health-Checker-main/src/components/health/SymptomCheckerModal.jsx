import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Stethoscope, 
  ArrowRight, 
  RotateCcw, 
  PhoneCall, 
  HelpCircle, 
  Thermometer, 
  Heart, 
  Brain, 
  Sparkles, 
  Flame 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const commonSymptomsByBodyPart = {
  Head: ['Headache', 'Dizziness', 'Migraine', 'Lightheadedness', 'Sinus Pressure', 'Facial Pain'],
  Chest: ['Chest Pain / Tightness', 'Shortness of Breath', 'Palpitations / Rapid Heartbeat', 'Persistent Cough', 'Wheezing'],
  Abdomen: ['Stomach Ache / Cramps', 'Acidity & Heartburn', 'Nausea / Vomiting', 'Bloating / Gas', 'Diarrhea / Loose Stools'],
  Skin: ['Skin Rash / Redness', 'Severe Itching / Hives', 'Acne Outbreak', 'Dry Peeling Patches', 'Hair Fall'],
  Joints: ['Joint Pain / Stiffness', 'Lower Back Pain', 'Knee Swelling', 'Neck & Shoulder Strain', 'Muscle Soreness'],
  General: ['Fever & Chills', 'Extreme Fatigue', 'Unexplained Weight Loss', 'Night Sweats', 'Loss of Appetite']
};

const SymptomCheckerModal = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState('Head');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState('moderate');
  const [hasFever, setHasFever] = useState(false);
  const [redFlags, setRedFlags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const toast = useToast();

  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleRunAnalysis = async () => {
    if (selectedSymptoms.length === 0) {
      toast.warning('Please select at least one symptom to evaluate.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/health-check/symptom-check', {
        symptoms: selectedSymptoms,
        duration,
        severity,
        hasFever,
        redFlags
      });

      if (res.data.success) {
        setAnalysis(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to complete analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAnalysis(null);
    setRedFlags([]);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
      
      {/* Title & Emergency Notice */}
      <div className="border-b border-slate-100 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl health-gradient text-white flex items-center justify-center shadow-md">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Interactive Symptom Evaluator
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your symptoms for educational guidance & doctor specialty recommendation.
            </p>
          </div>
        </div>
      </div>

      {!analysis ? (
        <div className="space-y-6">
          
          {/* Step 1: Body Area Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              1. Select Affected Body Region
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {Object.keys(commonSymptomsByBodyPart).map((part) => (
                <button
                  key={part}
                  type="button"
                  onClick={() => setSelectedBodyPart(part)}
                  className={`py-3 px-3 rounded-2xl text-xs font-bold border-2 transition-all cursor-pointer text-center ${
                    selectedBodyPart === part
                      ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Symptom Checkboxes for active part */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              2. Select Specific Symptoms ({selectedBodyPart})
            </label>
            <div className="flex flex-wrap gap-2">
              {commonSymptomsByBodyPart[selectedBodyPart].map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {sym}
                  </button>
                );
              })}
            </div>

            {/* Custom symptom input */}
            <form onSubmit={handleAddCustom} className="mt-4 flex gap-2 max-w-md">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="Or type another symptom (e.g. sore throat)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Add
              </button>
            </form>
          </div>

          {/* Selected Symptoms Pills */}
          {selectedSymptoms.length > 0 && (
            <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
              <p className="text-xs font-bold text-sky-800 mb-2">Selected Symptoms ({selectedSymptoms.length}):</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSymptoms.map((sym) => (
                  <span
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className="inline-flex items-center gap-1 text-xs bg-white text-sky-700 font-bold px-3 py-1 rounded-lg border border-sky-200 shadow-xs cursor-pointer hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                    title="Click to remove"
                  >
                    {sym} ✕
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Duration & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
              >
                <option value="Less than 24 hours">Less than 24 hours</option>
                <option value="1-3 days">1 - 3 Days</option>
                <option value="4-7 days">4 - 7 Days</option>
                <option value="More than a week">More than a week</option>
                <option value="Chronic (> 1 month)">Chronic (Over a month)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Discomfort Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
              >
                <option value="mild">Mild (Noticeable but does not restrict normal activities)</option>
                <option value="moderate">Moderate (Interferes with daily routine or focus)</option>
                <option value="severe">Severe (Intense, limiting mobility or causing distress)</option>
              </select>
            </div>
          </div>

          {/* Run Assessment Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={loading || selectedSymptoms.length === 0}
            className="w-full py-4 rounded-2xl health-gradient text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Evaluating Clinical Indicators...' : 'Analyze Symptoms & Get Recommendations'}
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      ) : (
        /* Analysis Results View */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Emergency Warning if triggered */}
          {analysis.isEmergency ? (
            <div className="bg-rose-50 border-2 border-rose-500 p-6 rounded-3xl text-rose-900 space-y-3">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-rose-600 animate-bounce" />
                <div>
                  <h4 className="font-black text-lg text-rose-700">Urgent Medical Attention Warning</h4>
                  <p className="text-xs text-rose-800 font-medium">Critical or high-risk symptoms reported.</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-rose-900 font-semibold">{analysis.nextSteps}</p>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="tel:112"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <PhoneCall className="w-4 h-4" /> Call 112 (National Emergency)
                </a>
                <a
                  href="tel:108"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Call Ambulance (108)
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Assessment complete. Non-emergency profile detected. See details below.</span>
            </div>
          )}

          {/* Recommended Specialist Card */}
          <div className="bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md text-sky-600 flex items-center justify-center shrink-0">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-sky-700 tracking-wider">Suggested Medical Specialty</span>
                <h4 className="text-xl font-black text-slate-900">{analysis.suggestedSpecialty}</h4>
                <p className="text-xs text-slate-600 mt-0.5">Specialists best equipped to review your symptom cluster.</p>
              </div>
            </div>

            <Link
              to={`/doctors?specialty=${encodeURIComponent(analysis.suggestedSpecialty)}`}
              className="px-6 py-3 rounded-2xl health-gradient text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:opacity-95 whitespace-nowrap transition-all"
            >
              Consult {analysis.suggestedSpecialty} Doctors →
            </Link>
          </div>

          {/* Probable Explanations */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Potential Differential Considerations:</h4>
            <div className="space-y-2.5">
              {analysis.possibleCauses.map((cause, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-sm">{cause.name}</h5>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      Likelihood: {cause.probability}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{cause.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Home Remedies / Supportive Care */}
          {analysis.homeRemedies && analysis.homeRemedies.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">Supportive Wellness Measures:</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {analysis.homeRemedies.map((rem, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{rem}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer text */}
          <div className="text-[11px] text-slate-400 bg-slate-100/70 p-3 rounded-xl">
            {analysis.disclaimer}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Check Another Symptom
            </button>

            <Link
              to="/doctors"
              className="px-6 py-2.5 rounded-xl health-gradient text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:opacity-95 transition-all"
            >
              Book Doctor Consultation
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};

export default SymptomCheckerModal;
