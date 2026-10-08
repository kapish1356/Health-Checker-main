import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Stethoscope, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  ShieldCheck 
} from 'lucide-react';
import api from '../../services/api';
import DoctorCard from '../../components/doctors/DoctorCard';
import BookingModal from '../../components/doctors/BookingModal';
import { DoctorCardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialSpecialty = searchParams.get('specialty') || 'all';

  const [search, setSearch] = useState(initialSearch);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [maxFee, setMaxFee] = useState('');
  const [minExp, setMinExp] = useState('');
  const [day, setDay] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const [doctors, setDoctors] = useState([]);
  const [specialtiesList, setSpecialtiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [search, specialty, maxFee, minExp, day, sortBy]);

  const fetchSpecialties = async () => {
    try {
      const res = await api.get('/doctors/specialties');
      if (res.data.success) {
        setSpecialtiesList(res.data.specialties);
      }
    } catch (e) {
      console.warn('Failed to fetch specialties');
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (specialty && specialty !== 'all') params.append('specialty', specialty);
      if (maxFee) params.append('maxFee', maxFee);
      if (minExp) params.append('minExp', minExp);
      if (day && day !== 'all') params.append('day', day);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await api.get(`/doctors?${params.toString()}`);
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (e) {
      console.warn('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSpecialty('all');
    setMaxFee('');
    setMinExp('');
    setDay('all');
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-teal-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold mb-3 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
            Verified Medical Specialists
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Find & Consult Trusted Doctors
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-2 leading-relaxed">
            Browse verified clinical practitioners by specialty, hospital affiliation, experience, and consultation fees. Book seamless in-person appointments or instant video sessions.
          </p>
        </div>
      </div>

      {/* Main Content Layout: Filters Sidebar + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filters Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              Filter Doctors
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search keyword */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Query</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Doctor name, hospital, symptom..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Specialty Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Medical Specialty</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Specialties (12+)</option>
              {specialtiesList.map((sp) => (
                <option key={sp.id} value={sp.name}>{sp.name}</option>
              ))}
            </select>
          </div>

          {/* Max Consultation Fee */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Consultation Fee</label>
            <select
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="">Any Fee Range</option>
              <option value="500">Under ₹500</option>
              <option value="800">Under ₹800</option>
              <option value="1200">Under ₹1,200</option>
              <option value="2000">Under ₹2,000</option>
            </select>
          </div>

          {/* Minimum Experience */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Clinical Experience</label>
            <select
              value={minExp}
              onChange={(e) => setMinExp(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="">Any Experience</option>
              <option value="5">5+ Years</option>
              <option value="10">10+ Years</option>
              <option value="15">15+ Years</option>
            </select>
          </div>

          {/* Day of Week */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Day Available</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="all">Any Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

        </div>

        {/* Doctor Results Column */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Top Sort & Result Count Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-700">
              Showing <span className="text-sky-600">{doctors.length}</span> Verified Specialists
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="fee_low">Fee: Low to High</option>
                <option value="fee_high">Fee: High to Low</option>
              </select>
            </div>
          </div>

          {/* Doctor Cards */}
          {loading ? (
            <div className="space-y-4">
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
            </div>
          ) : doctors.length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title="No doctors match your criteria"
              description="Try adjusting your specialty or fee filter parameters to discover more specialists."
              actionText="Reset All Filters"
              onActionClick={resetFilters}
            />
          ) : (
            <div className="space-y-4">
              {doctors.map((doc) => (
                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  onBookClick={(d) => setSelectedDoctorForBooking(d)}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Booking Wizard Modal */}
      {selectedDoctorForBooking && (
        <BookingModal
          doctor={selectedDoctorForBooking}
          isOpen={!!selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onSuccess={() => setSelectedDoctorForBooking(null)}
        />
      )}

    </div>
  );
};

export default DoctorsPage;
