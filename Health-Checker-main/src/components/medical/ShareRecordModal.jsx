import React, { useState } from 'react';
import { X, Share2, Copy, Check, Clock, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const ShareRecordModal = ({ record, isOpen, onClose }) => {
  const [expiryHours, setExpiryHours] = useState('24');
  const [shareData, setShareData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!isOpen || !record) return null;

  const handleGenerateLink = async () => {
    try {
      setLoading(true);
      const res = await api.post('/medical-records/share', {
        recordId: record.id,
        expiryHours: Number(expiryHours)
      });
      if (res.data.success) {
        setShareData(res.data);
        toast.success('Time-limited doctor access token generated.');
      }
    } catch (err) {
      toast.error('Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (shareData) {
      const fullUrl = `${window.location.origin}${shareData.shareUrl}`;
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.info('Direct secure link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-200 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Secure Doctor Sharing</h3>
            <p className="text-slate-500 truncate max-w-[280px]">{record.title}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!shareData ? (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              Generate an encrypted, time-limited access link to share this document with your consulting physician. Access expires automatically.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                Access Duration Expiry
              </label>
              <select
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              >
                <option value="6">6 Hours (One-time consultation)</option>
                <option value="24">24 Hours (Recommended)</option>
                <option value="72">3 Days (Comprehensive review)</option>
                <option value="168">7 Days (Post-operative monitoring)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full py-3 rounded-xl health-gradient text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              {loading ? 'Generating Security Keys...' : 'Generate Temporary Access Link'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Encrypted token generated! Valid for {expiryHours} hours.</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Doctor Access URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}${shareData.shareUrl}`}
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-700 font-mono select-all"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareRecordModal;
