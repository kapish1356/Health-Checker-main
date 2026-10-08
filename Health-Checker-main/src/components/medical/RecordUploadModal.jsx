import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const RecordUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Lab Report');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!title) {
        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning('Please enter a document title.');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('recordDate', recordDate);
      formData.append('doctorName', doctorName);
      formData.append('hospitalName', hospitalName);
      formData.append('notes', notes);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await api.post('/medical-records/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Medical document uploaded & encrypted in your health locker.');
        if (onUploadSuccess) onUploadSuccess(res.data.record);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Upload Medical Record</h3>
            <p className="text-xs text-slate-500">Safely store prescriptions, scans, or lab reports</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* File input dropzone */}
          <div className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-2xl p-4 text-center cursor-pointer relative bg-slate-50 transition-colors">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-sky-500 mx-auto mb-1" />
            <p className="font-bold text-slate-700">
              {selectedFile ? selectedFile.name : 'Click or drag PDF / Image to upload'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, PNG, JPG (Max 10MB)</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Thyroid Blood Test June 2026"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 bg-white"
              >
                <option value="Lab Report">Lab Report</option>
                <option value="Prescription">Prescription</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Scan / X-Ray">Scan / X-Ray</option>
                <option value="Discharge Summary">Discharge Summary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Record Date</label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Doctor Name (Optional)</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Dr. Sarah Patel"
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hospital / Lab</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="Apollo Diagnostics"
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Key Notes / Diagnostic Findings</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Normal TSH levels, recommended to repeat in 6 months."
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3 rounded-xl health-gradient text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isUploading ? 'Encrypting & Storing...' : 'Save to Health Locker'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordUploadModal;
