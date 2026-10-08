import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  ShieldAlert, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  FileText 
} from 'lucide-react';
import api from '../../services/api';

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeMedicine, setActiveMedicine] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, [search, selectedCategory]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/medicines?search=${encodeURIComponent(search)}&category=${selectedCategory}`);
      if (res.data.success) {
        setMedicines(res.data.medicines);
        if (res.data.medicines.length > 0 && !activeMedicine) {
          setActiveMedicine(res.data.medicines[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-sky-800 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold border border-white/20">
            <Pill className="w-3.5 h-3.5" />
            Verified Pharmacopeia Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Medicine & Prescription Drug Directory
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-normal">
            Search clinically verified active ingredients, indications, precautions, dosages, and contraindications.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Brand (e.g. Dolo 650) or Generic name (e.g. Metformin)..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs"
        />
      </div>

      {/* Main Split: Medicine List + Active Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Medicine Catalog ({medicines.length})</h3>
          
          {loading ? (
            <div className="space-y-3">
              <div className="h-20 bg-slate-100 rounded-2xl animate-pulse"></div>
              <div className="h-20 bg-slate-100 rounded-2xl animate-pulse"></div>
              <div className="h-20 bg-slate-100 rounded-2xl animate-pulse"></div>
            </div>
          ) : medicines.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border text-center text-xs text-slate-400">
              No matching medicines found in catalog.
            </div>
          ) : (
            medicines.map((med) => (
              <div
                key={med.id}
                onClick={() => setActiveMedicine(med)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeMedicine?.id === med.id
                    ? 'border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{med.brandName}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {med.strength}
                  </span>
                </div>
                <p className="text-xs text-teal-700 font-medium mt-0.5">{med.genericName}</p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{med.intendedUses}</p>
              </div>
            ))
          )}
        </div>

        {/* Right Medicine Details Card */}
        <div className="lg:col-span-7">
          {activeMedicine ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                    {activeMedicine.category}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    activeMedicine.prescriptionRequired ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {activeMedicine.prescriptionRequired ? 'Rx Required' : 'Over The Counter (OTC)'}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{activeMedicine.brandName}</h2>
                <p className="text-xs font-bold text-slate-500">
                  Active Ingredient: <span className="text-slate-800 font-semibold">{activeMedicine.genericName}</span> ({activeMedicine.strength}, {activeMedicine.dosageForm})
                </p>
              </div>

              {/* Intended Uses */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Clinical Indications & Uses
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {activeMedicine.intendedUses}
                </p>
              </div>

              {/* Precautions & Warnings */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Key Precautions & Warnings
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60">
                  {activeMedicine.precautions}
                </p>
              </div>

              {/* Potential Side Effects */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  Reported Side Effects
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {activeMedicine.sideEffects}
                </p>
              </div>

              {/* Storage */}
              <div className="text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-3">
                <span>Storage: {activeMedicine.storage}</span>
                <span>Verified on: {activeMedicine.lastUpdated}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs border border-slate-200">
              Select a medicine from the directory to review indications and precautions.
            </div>
          )}
        </div>

      </div>

      {/* Mandatory Regulatory Medical Disclaimer */}
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Pharmacological Information Notice:</strong> The medicine data provided on this platform is for educational and reference purposes only. Never alter prescription doses, discontinue treatment, or self-administer prescription drugs without consulting a licensed physician.
        </p>
      </div>

    </div>
  );
};

export default MedicinesPage;
