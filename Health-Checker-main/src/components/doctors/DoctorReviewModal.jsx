import React, { useState } from 'react';
import { X, Send, Star } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const DoctorReviewModal = ({ doctor, isOpen, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  if (!isOpen || !doctor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('Please write a short review or feedback.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/doctors/reviews', {
        doctorId: doctor.id,
        rating,
        comment
      });

      if (res.data.success) {
        toast.success('Thank you! Your verified review has been published.');
        if (onReviewSubmitted) onReviewSubmitted(res.data.review);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Rate Your Experience</h3>
            <p className="text-xs text-slate-500">Consultation with {doctor.name}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-2">
            <label className="block text-xs font-semibold text-slate-600 mb-2">Overall Rating</label>
            <div className="flex justify-center">
              <RatingStars rating={rating} size="w-8 h-8" interactive onRate={(r) => setRating(r)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Written Review</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the doctor's explanation, timeliness, and treatment guidance?"
              className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl health-gradient text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'Publishing...' : 'Submit Verified Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorReviewModal;
