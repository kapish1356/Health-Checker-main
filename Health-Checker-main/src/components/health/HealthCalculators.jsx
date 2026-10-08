import React, { useState } from 'react';
import { 
  Scale, 
  Flame, 
  Droplet, 
  Activity, 
  Heart, 
  HelpCircle, 
  CheckCircle2, 
  Calculator 
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const BMICalculator = () => {
  const [weightKg, setWeightKg] = useState('70');
  const [heightCm, setHeightCm] = useState('172');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/health-check/calculate', {
        type: 'bmi',
        values: { weightKg: Number(weightKg), heightCm: Number(heightCm) }
      });
      if (res.data.success) {
        setResult(res.data.result);
      }
    } catch (err) {
      toast.error('Failed to compute BMI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-base">BMI & Healthy Weight Calculator</h4>
          <p className="text-xs text-slate-500">Calculate Body Mass Index & ideal weight range</p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            step="0.5"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
          />
        </div>

        <button
          type="submit"
          className="col-span-2 py-2.5 rounded-xl health-gradient text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:opacity-95 transition-all cursor-pointer"
        >
          {loading ? 'Calculating...' : 'Compute Body Mass Index'}
        </button>
      </form>

      {result && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Your Calculated BMI:</span>
            <span className="text-xl font-black text-sky-600">{result.bmi}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Classification:</span>
            <span className="font-bold text-slate-800">{result.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Healthy Weight Range:</span>
            <span className="font-bold text-teal-600">{result.healthyWeightRange}</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80 leading-relaxed">
            {result.interpretation}
          </p>
        </div>
      )}
    </div>
  );
};

export const BMRCalorieCalculator = () => {
  const [weightKg, setWeightKg] = useState('70');
  const [heightCm, setHeightCm] = useState('172');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [result, setResult] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    const res = await api.post('/health-check/calculate', {
      type: 'bmr',
      values: { weightKg: Number(weightKg), heightCm: Number(heightCm), age: Number(age), gender, activityLevel }
    });
    if (res.data.success) {
      setResult(res.data.result);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-base">BMR & Daily Calorie Needs (TDEE)</h4>
          <p className="text-xs text-slate-500">Mifflin-St Jeor clinical metabolic expenditure</p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Age (Years)</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
          />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">Activity Routine</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
          >
            <option value="sedentary">Sedentary (Little or no exercise)</option>
            <option value="light">Light Activity (Exercise 1-3 times/week)</option>
            <option value="moderate">Moderate Activity (Exercise 3-5 times/week)</option>
            <option value="active">High Activity (Exercise 6-7 times/week)</option>
          </select>
        </div>

        <button
          type="submit"
          className="col-span-2 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Calculate Calorie Burn
        </button>
      </form>

      {result && (
        <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-4 text-xs space-y-2 animate-in fade-in">
          <div className="flex justify-between">
            <span className="text-slate-600">Base BMR (Resting Burn):</span>
            <span className="font-bold text-slate-900">{result.bmr} kcal/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Maintenance TDEE:</span>
            <span className="font-black text-orange-600 text-sm">{result.tdee} kcal/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Target for Fat Loss:</span>
            <span className="font-bold text-emerald-600">{result.weightLossCalories} kcal/day</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const WaterIntakeCalculator = () => {
  const [weightKg, setWeightKg] = useState('68');
  const [activityMin, setActivityMin] = useState('45');
  const [climate, setClimate] = useState('moderate');
  const [result, setResult] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    const res = await api.post('/health-check/calculate', {
      type: 'water',
      values: { weightKg: Number(weightKg), activityMinutes: Number(activityMin), climate }
    });
    if (res.data.success) {
      setResult(res.data.result);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
          <Droplet className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-base">Daily Water & Hydration Estimator</h4>
          <p className="text-xs text-slate-500">Based on body weight, daily workout & climate</p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Body Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Daily Exercise (Mins)</label>
          <input
            type="number"
            value={activityMin}
            onChange={(e) => setActivityMin(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
          />
        </div>

        <button
          type="submit"
          className="col-span-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Calculate Daily Fluid Target
        </button>
      </form>

      {result && (
        <div className="bg-cyan-50/60 border border-cyan-200 rounded-2xl p-4 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Daily Water Goal:</span>
            <span className="text-xl font-black text-cyan-700">{result.dailyWaterLiters} Liters</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Equivalent Standard Glasses:</span>
            <span className="font-bold text-slate-800">{result.glassesCount} Glasses (250ml each)</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">{result.interpretation}</p>
        </div>
      )}
    </div>
  );
};

export const DiabetesRiskCalculator = () => {
  const [age, setAge] = useState(40);
  const [bmi, setBmi] = useState(26);
  const [waistCm, setWaistCm] = useState(88);
  const [physicalActivityDaily, setPhysicalActivityDaily] = useState(true);
  const [familyHistory, setFamilyHistory] = useState(false);
  const [highBp, setHighBp] = useState(false);
  const [result, setResult] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    const res = await api.post('/health-check/calculate', {
      type: 'diabetes_risk',
      values: { age, bmi, waistCm, physicalActivityDaily, familyHistory, highBp }
    });
    if (res.data.success) {
      setResult(res.data.result);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-base">Type 2 Diabetes Risk Score (FINDRISC)</h4>
          <p className="text-xs text-slate-500">10-Year risk assessment based on validated clinical parameters</p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="space-y-3 text-xs">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">BMI</label>
            <input
              type="number"
              value={bmi}
              onChange={(e) => setBmi(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Waist (cm)</label>
            <input
              type="number"
              value={waistCm}
              onChange={(e) => setWaistCm(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
            />
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={physicalActivityDaily}
              onChange={(e) => setPhysicalActivityDaily(e.target.checked)}
              className="rounded text-teal-600"
            />
            <span>I perform at least 30 mins of daily physical activity</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={familyHistory}
              onChange={(e) => setFamilyHistory(e.target.checked)}
              className="rounded text-teal-600"
            />
            <span>Immediate family member (parent/sibling) diagnosed with diabetes</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={highBp}
              onChange={(e) => setHighBp(e.target.checked)}
              className="rounded text-teal-600"
            />
            <span>Diagnosed with high blood pressure / taking antihypertensives</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Evaluate Diabetes Risk Level
        </button>
      </form>

      {result && (
        <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 text-xs space-y-2 animate-in fade-in">
          <div className="flex justify-between">
            <span className="text-slate-600">FINDRISC Score:</span>
            <span className="font-black text-teal-800">{result.riskScore} Points</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Estimated Risk Category:</span>
            <span className="font-bold text-slate-900">{result.riskLevel}</span>
          </div>
          <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">{result.recommendation}</p>
        </div>
      )}
    </div>
  );
};
