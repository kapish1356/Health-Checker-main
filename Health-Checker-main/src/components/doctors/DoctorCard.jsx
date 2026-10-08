import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  GraduationCap, 
  Star, 
  ShieldCheck 
} from 'lucide-react';
import RatingStars from '../common/RatingStars';

const DoctorCard = ({ doctor, onBookClick }) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col xl:flex-row gap-5 lg:gap-6 group w-full overflow-hidden min-w-0">
      
      {/* Avatar & Badges */}
      <div className="flex sm:flex-row xl:flex-col items-center sm:items-start gap-4 shrink-0">
        <div className="relative shrink-0">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-100 shadow-inner group-hover:scale-102 transition-transform"
          />
          {doctor.isVerified && (
            <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-md" title="MCI Verified Medical Doctor">
              <div className="bg-sky-500 text-white rounded-full p-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>

        <div className="text-left space-y-0.5">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={doctor.rating} size="w-3.5 h-3.5" />
            <span className="text-xs font-bold text-slate-800">{doctor.rating}</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{doctor.reviewCount} reviews</p>
        </div>
      </div>

      {/* Doctor Info Middle Section */}
      <div className="flex-1 min-w-0 space-y-2.5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
              <Link to={`/doctors/${doctor.id}`}>{doctor.name}</Link>
            </h3>
            {doctor.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
                <ShieldCheck className="w-3 h-3 text-sky-600" />
                Verified
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-semibold text-teal-600 truncate">{doctor.specialty}</p>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600">
          <p className="flex items-center gap-2 min-w-0">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.qualifications}</span>
          </p>
          <p className="flex items-center gap-2 min-w-0">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate"><strong className="text-slate-800">{doctor.experienceYears} Yrs</strong> experience</span>
          </p>
          <p className="flex items-center gap-2 min-w-0">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.hospital}</span>
          </p>
          <p className="flex items-center gap-2 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 truncate">{doctor.clinicAddress}</span>
          </p>
        </div>

        {/* Services Badges */}
        {doctor.services && doctor.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {doctor.services.slice(0, 2).map((srv, idx) => (
              <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[180px]">
                {srv}
              </span>
            ))}
            {doctor.services.length > 2 && (
              <span className="text-[10px] text-slate-400 self-center">+{doctor.services.length - 2} more</span>
            )}
          </div>
        )}
      </div>

      {/* Pricing & Booking CTA Right Column */}
      <div className="w-full xl:w-44 flex flex-col justify-between border-t xl:border-t-0 xl:border-l border-slate-100 xl:pl-5 pt-3 xl:pt-0 shrink-0 gap-3">
        <div className="space-y-1 flex xl:flex-col justify-between items-center xl:items-start">
          <div>
            <p className="text-[11px] text-slate-400">Consultation Fee</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">₹{doctor.consultationFee}</span>
              <span className="text-[10px] text-slate-400">/ visit</span>
            </div>
          </div>
          {doctor.onlineFee && (
            <p className="text-[11px] text-teal-600 font-medium flex items-center gap-1">
              <Video className="w-3 h-3 shrink-0" />
              Online: ₹{doctor.onlineFee}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-1 gap-2">
          <button
            onClick={() => onBookClick ? onBookClick(doctor) : null}
            className="w-full py-2 px-3 rounded-xl health-gradient text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:opacity-95 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Book Appointment</span>
          </button>

          <Link
            to={`/doctors/${doctor.id}`}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center block transition-colors border border-slate-200/80 truncate"
          >
            View Profile
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DoctorCard;
