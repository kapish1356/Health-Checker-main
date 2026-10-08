import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  FileText 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LabTestsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [packages, setPackages] = useState([]);
  const [tests, setTests] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedItem, setSelectedItem] = useState(null); // package or test
  const [isPackage, setIsPackage] = useState(true);
  const [collectionType, setCollectionType] = useState('home');
  const [address, setAddress] = useState('Flat 401, Green Meadows, Bengaluru - 560038');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('07:30 AM - 08:30 AM');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLabCatalog();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, [category, search]);

  const fetchLabCatalog = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/lab-tests?category=${category}&search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setPackages(res.data.packages);
        setTests(res.data.tests);
      }
    } catch (e) {
      console.warn('Failed to load lab catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (item, packageType = true) => {
    setSelectedItem(item);
    setIsPackage(packageType);
    setBookingSuccess(null);
  };

  const handleConfirmLabBooking = async () => {
    if (!selectedItem) return;
    try {
      setIsSubmitting(true);
      const payload = {
        packageId: isPackage ? selectedItem.id : null,
        testId: !isPackage ? selectedItem.id : null,
        collectionType,
        address: collectionType === 'home' ? address : 'Apollo Lab Centre',
        date,
        timeSlot,
        patientName: user?.name || 'Rahul Verma',
        patientPhone: user?.phone || '+91 91234 56789'
      };

      const res = await api.post('/lab-tests/book', payload);
      if (res.data.success) {
        setBookingSuccess(res.data.booking);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        toast.success(`Lab Test Booked! Tracking ID: ${res.data.booking.bookingCode}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to book lab test');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Packages & Tests' },
    { id: 'Full Body', label: 'Full Body Checkups' },
    { id: 'Heart Health', label: 'Heart & Lipid' },
    { id: 'Diabetes', label: 'Diabetes Care' },
    { id: 'Women Health', label: 'Women’s Health' },
    { id: 'Vitamins', label: 'Vitamins & Immunity' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-800 via-sky-900 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold border border-white/20">
            <FlaskConical className="w-3.5 h-3.5" />
            NABL Accredited Diagnostic Labs
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Lab Tests & Full Body Checkups
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Certified phlebotomist sample collection at your doorstep. Transparent pricing, sterile vacutainer handling, and accurate 24-hour digital PDF reports.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests like CBC, Lipid Profile, Vitamin D, HbA1c..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs"
            />
          </div>
        </div>

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
      </div>

      {/* Section 1: Full Body Health Packages */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Comprehensive Health Check Packages
          </h2>
          <p className="text-xs text-slate-500">Multi-parameter checkups designed for annual preventive wellness</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-[11px] font-bold">
                    {pkg.testsCount} Essential Biomarkers
                  </span>
                  {pkg.isPopular && (
                    <span className="px-2.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-bold uppercase">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-600 transition-colors">
                  {pkg.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed line-clamp-2">
                  {pkg.subtitle}
                </p>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-6">
                  {pkg.includes.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through mr-1.5">₹{pkg.originalPrice}</span>
                  <span className="text-xl font-black text-slate-900">₹{pkg.discountPrice}</span>
                </div>
                <button
                  onClick={() => handleOpenBooking(pkg, true)}
                  className="px-4 py-2.5 rounded-xl health-gradient text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:opacity-95 transition-all cursor-pointer"
                >
                  Book Home Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Individual Diagnostic Tests */}
      <div className="space-y-6 pt-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Individual Routine & Pathology Tests
          </h2>
          <p className="text-xs text-slate-500">Fast, accurate standalone tests with digital reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-sky-300 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {test.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2">{test.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description}</p>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Report in: {test.tat}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-black text-base text-slate-900">₹{test.price}</span>
                <button
                  onClick={() => handleOpenBooking(test, false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Book Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lab Booking Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Book Diagnostic Sample Collection</h3>
                <p className="text-slate-500 truncate">{selectedItem.title || selectedItem.name}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!bookingSuccess ? (
              <div className="space-y-4">
                {/* Collection Type */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Collection Preference</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCollectionType('home')}
                      className={`p-3 rounded-xl border-2 font-bold cursor-pointer text-center transition-all ${
                        collectionType === 'home'
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Doorstep Home Collection
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollectionType('lab')}
                      className={`p-3 rounded-xl border-2 font-bold cursor-pointer text-center transition-all ${
                        collectionType === 'lab'
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Walk-in Diagnostic Centre
                    </button>
                  </div>
                </div>

                {collectionType === 'home' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Doorstep Address</label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Collection Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Morning Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 bg-white"
                    >
                      <option value="06:30 AM - 07:30 AM">06:30 AM - 07:30 AM</option>
                      <option value="07:30 AM - 08:30 AM">07:30 AM - 08:30 AM</option>
                      <option value="08:30 AM - 09:30 AM">08:30 AM - 09:30 AM</option>
                      <option value="09:30 AM - 10:30 AM">09:30 AM - 10:30 AM</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Package / Test:</span>
                    <span className="font-bold text-slate-900">{selectedItem.title || selectedItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Home Collection Fee:</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-sm">
                    <span>Total Amount:</span>
                    <span className="text-sky-600">₹{selectedItem.discountPrice || selectedItem.price}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmLabBooking}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl health-gradient text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmitting ? 'Confirming with Lab...' : 'Confirm Sample Collection Booking'}
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3 animate-in fade-in">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Lab Booking Confirmed!</h4>
                <p className="text-slate-500 text-xs">
                  Booking Tracking Code: <strong className="text-sky-600 font-mono">{bookingSuccess.bookingCode}</strong>
                </p>
                <p className="text-slate-500 text-xs">
                  A certified phlebotomist will arrive on <strong>{bookingSuccess.date}</strong> during <strong>{bookingSuccess.timeSlot}</strong>.
                </p>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default LabTestsPage;
