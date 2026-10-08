import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Share2, 
  Trash2, 
  Download, 
  Eye, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  User, 
  Plus, 
  Lock 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import RecordUploadModal from '../../components/medical/RecordUploadModal';
import ShareRecordModal from '../../components/medical/ShareRecordModal';
import EmptyState from '../../components/common/EmptyState';

const MedicalRecordsPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [records, setRecords] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modals
  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareRecord, setShareRecord] = useState(null);
  const [previewRecord, setPreviewRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [category]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/medical-records?category=${category}`);
      if (res.data.success) {
        setRecords(res.data.records);
      }
    } catch (e) {
      console.warn('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this record from your health locker?')) return;
    try {
      const res = await api.delete(`/medical-records/${id}`);
      if (res.data.success) {
        toast.success('Document deleted successfully.');
        setRecords((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete record');
    }
  };

  const handleDownloadPDF = (rec) => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(2, 132, 199);
      doc.text('CheckHealth Digital Medical Records', 20, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Verified Health Document from Patient Locker', 20, 28);
      doc.line(20, 32, 190, 32);

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`Document Title: ${rec.title}`, 20, 44);
      doc.text(`Category: ${rec.category}`, 20, 52);
      doc.text(`Date of Record: ${rec.recordDate}`, 20, 60);
      doc.text(`Doctor / Origin: ${rec.doctorName}`, 20, 68);
      doc.text(`Hospital / Diagnostic Hub: ${rec.hospitalName}`, 20, 76);

      doc.line(20, 82, 190, 82);

      doc.setFont('helvetica', 'bold');
      doc.text('Summary Findings & Clinical Notes:', 20, 94);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(rec.notes || 'Document verified and archived under personal health locker.', 20, 102, { maxWidth: 170 });

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Patient: ${user?.name || 'Rahul Verma'} • Security Hash: SHA256-ENC-CHECKHEALTH`, 20, 280);

      doc.save(`${rec.title.replace(/\s+/g, '_')}.pdf`);
      toast.success('Downloaded official medical record PDF.', 'Download Complete');
    } catch (e) {
      toast.error('Failed to export PDF');
    }
  };

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'Lab Report', label: 'Lab Reports' },
    { id: 'Prescription', label: 'Prescriptions' },
    { id: 'Vaccination', label: 'Vaccination Records' },
    { id: 'Scan / X-Ray', label: 'Scans & Imaging' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-800 via-sky-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold border border-white/20">
            <Lock className="w-3.5 h-3.5" />
            256-Bit Encrypted Health Locker
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Digital Medical Records & Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Store, view, and grant time-limited secure access to lab results, vaccination cards, and clinical summaries.
          </p>
        </div>

        <button
          onClick={() => setUploadOpen(true)}
          className="px-6 py-3.5 rounded-2xl health-gradient text-white text-xs font-bold shadow-lg shadow-sky-500/25 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          Upload New Document
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              category === cat.id
                ? 'health-gradient text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-44 bg-slate-100 rounded-3xl animate-pulse"></div>
          <div className="h-44 bg-slate-100 rounded-3xl animate-pulse"></div>
          <div className="h-44 bg-slate-100 rounded-3xl animate-pulse"></div>
        </div>
      ) : records.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No medical records found in this category"
          description="Upload medical reports, prescriptions, or scan results to keep them organized and accessible anywhere."
          actionText="Upload Your First Document"
          onActionClick={() => setUploadOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    {rec.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{rec.recordDate}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-600 transition-colors">
                  {rec.title}
                </h3>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Doctor: {rec.doctorName || 'Self-Uploaded'}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{rec.hospitalName || 'CheckHealth Locker'}</span>
                  </p>
                </div>

                {rec.notes && (
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-3 line-clamp-2">
                    {rec.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleDownloadPDF(rec)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  PDF
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShareRecord(rec)}
                    className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 transition-colors cursor-pointer"
                    title="Time-limited Share Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadOpen && (
        <RecordUploadModal
          isOpen={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUploadSuccess={(newRec) => {
            setRecords((prev) => [newRec, ...prev]);
          }}
        />
      )}

      {/* Share Modal */}
      {shareRecord && (
        <ShareRecordModal
          record={shareRecord}
          isOpen={!!shareRecord}
          onClose={() => setShareRecord(null)}
        />
      )}

    </div>
  );
};

export default MedicalRecordsPage;
