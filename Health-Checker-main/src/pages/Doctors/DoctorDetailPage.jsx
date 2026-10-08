import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Building2, 
  GraduationCap, 
  Clock, 
  Calendar, 
  Video, 
  ShieldCheck, 
  Star, 
  Languages, 
  MessageSquarePlus, 
  ArrowLeft 
} from 'lucide-react';
import api from '../../services/api';
import RatingStars from '../../components/common/RatingStars';
import BookingModal from '../../components/doctors/BookingModal';
import DoctorReviewModal from '../../components/doctors/DoctorReviewModal';
import { DoctorCardSkeleton } from '../../components/common/SkeletonLoader';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/doctors/${id}`);
      if (res.data.success) {
        setDoctor(res.data.doctor);
      }
    } catch (e) {
      console.warn('Failed to load doctor profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <DoctorCardSkeleton />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h3 className="text-lg font-bold text-slate-900">Doctor not found</h3>
        <Link to="/doctors" className="mt-4 inline-block px-5 py-2.5 health-gradient text-white font-bold rounded-xl text-xs">
          Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Link */}
      <Link
        to="/doctors"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Doctors
      </Link>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="flex flex-col items-center md:items-start shrink-0">
          <div className="relative">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-slate-100 shadow-md"
            />
            {doctor.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                <div className="bg-sky-500 text-white rounded-full p-1.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center md:text-left space-y-1">
            <div className="flex items-center gap-1.5 justify-center md:justify-start">
              <RatingStars rating={doctor.rating} size="w-4 h-4" />
              <span className="text-sm font-black text-slate-900">{doctor.rating}</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">({doctor.reviewCount} verified patient reviews)</p>
            {doctor.licenseNumber && (
              <p className="text-[11px] text-slate-400 font-mono">Reg: {doctor.licenseNumber}</p>
            )}
          </div>
        </div>

        {/* Middle Details */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{doctor.name}</h1>
              {doctor.isVerified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  MCI Verified
                </span>
              )}
            </div>
            <p className="text-base font-bold text-teal-600 mt-0.5">{doctor.specialty}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{doctor.qualifications}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span><strong>{doctor.experienceYears} Years</strong> of Practice</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{doctor.hospital}</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Speaks: {doctor.languages?.join(', ')}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">About Physician</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{doctor.about}</p>
          </div>

          {doctor.services && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Clinical Services</h4>
              <div className="flex flex-wrap gap-2">
                {doctor.services.map((srv, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-xl">
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right CTA Box */}
        <div className="w-full md:w-64 bg-slate-50 p-6 rounded-3xl border border-slate-200/80 flex flex-col justify-between shrink-0 space-y-4">
          <div className="space-y-2">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Fee Structure</span>
            <div>
              <p className="text-xs text-slate-500">Clinic In-Person:</p>
              <p className="text-2xl font-black text-slate-900">₹{doctor.consultationFee}</p>
            </div>
            {doctor.onlineFee && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-teal-600" />
                  Online Telehealth:
                </p>
                <p className="text-xl font-black text-teal-700">₹{doctor.onlineFee}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setBookingModalOpen(true)}
            className="w-full py-3.5 rounded-2xl health-gradient text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Book Consultation
          </button>
        </div>

      </div>

      {/* Clinic Location & Verified Patient Reviews Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Patient Reviews & Feedback</h3>
                <p className="text-xs text-slate-500">Verified reviews from authenticated consultations</p>
              </div>

              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-4 py-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Write Review
              </button>
            </div>

            {doctor.reviews && doctor.reviews.length > 0 ? (
              <div className="space-y-4">
                {doctor.reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-sky-200 text-sky-800 font-bold flex items-center justify-center text-xs">
                          {rev.patientName?.charAt(0) || 'P'}
                        </div>
                        <span className="font-bold text-xs text-slate-900">{rev.patientName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <RatingStars rating={rev.rating} size="w-3.5 h-3.5" />
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                No reviews yet. Be the first to consult and submit feedback!
              </p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Clinic Address & Hours */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600" />
            Clinic Location
          </h3>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-slate-900">{doctor.hospital}</p>
            <p className="text-slate-500 leading-relaxed">{doctor.clinicAddress}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Available Consultation Days</h4>
            <div className="flex flex-wrap gap-1.5">
              {doctor.availableDays?.map((d) => (
                <span key={d} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          doctor={doctor}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          onSuccess={() => setBookingModalOpen(false)}
        />
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <DoctorReviewModal
          doctor={doctor}
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onReviewSubmitted={() => fetchDoctor()}
        />
      )}

    </div>
  );
};

export default DoctorDetailPage;
