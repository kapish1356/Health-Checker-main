import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Search,
  Stethoscope,
  Video,
  Building2,
  Activity,
  FlaskConical,
  Pill,
  FileText,
  Scale,
  Brain,
  Baby,
  ShieldPlus,
  Smile,
  Eye,
  Ear,
  Flame,
  SmilePlus,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Clock,
  Star,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Plus,
  Sparkles,
  Users
} from 'lucide-react';
import api from '../../services/api';
import DoctorCard from '../../components/doctors/DoctorCard';
import BookingModal from '../../components/doctors/BookingModal';
import RatingStars from '../../components/common/RatingStars';
import MedicalHeroAnimation from '../../components/home/MedicalHeroAnimation';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTab, setSearchTab] = useState('doctors');
  const [topDoctors, setTopDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [healthPackages, setHealthPackages] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [docRes, spRes, labRes] = await Promise.all([
          api.get('/doctors?sortBy=rating'),
          api.get('/doctors/specialties'),
          api.get('/lab-tests')
        ]);

        if (docRes.data.success) setTopDoctors(docRes.data.doctors.slice(0, 4));
        if (spRes.data.success) setSpecialties(spRes.data.specialties);
        if (labRes.data.success) setHealthPackages(labRes.data.packages.slice(0, 3));
      } catch (e) {
        console.warn('Error loading home data:', e);
      }
    };
    loadHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchTab === 'doctors') {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    } else if (searchTab === 'lab') {
      navigate(`/lab-tests?search=${encodeURIComponent(searchQuery)}`);
    } else if (searchTab === 'medicines') {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickServices = [
    { title: 'Online Video Consult', desc: 'Connect in 10 mins with top specialists', icon: Video, color: 'sky', link: '/doctors?type=online' },
    { title: 'Book Clinic Visit', desc: 'Skip waiting queues at top hospitals', icon: Building2, color: 'teal', link: '/doctors' },
    { title: 'Full Body Checkup', desc: '85+ tests with free home sample pickup', icon: FlaskConical, color: 'blue', link: '/lab-tests' },
    { title: 'Symptom Checker', desc: 'AI-assisted clinical guidance & triage', icon: Activity, color: 'rose', link: '/health-check' },
    { title: 'Verified Medicines', desc: 'Precautions, dosage & interactions guide', icon: Pill, color: 'indigo', link: '/medicines' },
    { title: 'Digital Health Locker', desc: 'Secure lifetime storage for records', icon: FileText, color: 'emerald', link: '/medical-records' },
    { title: 'BMI & Calorie Calc', desc: 'Interactive metabolic wellness tools', icon: Scale, color: 'amber', link: '/health-check' },
    { title: 'Mental Wellness', desc: 'Confidential therapy & stress relief', icon: SmilePlus, color: 'purple', link: '/doctors?specialty=Psychiatrist' },
  ];

  const specialtyIcons = {
    'General Physician': Stethoscope,
    'Cardiologist': HeartPulse,
    'Dermatologist': Sparkles,
    'Neurologist': Brain,
    'Orthopedic Specialist': Activity,
    'Gynecologist': ShieldPlus,
    'Pediatrician': Baby,
    'Dentist': Smile,
    'Ophthalmologist': Eye,
    'Psychiatrist': SmilePlus,
    'ENT Specialist': Ear,
    'Endocrinologist': Flame,
  };

  const faqs = [
    {
      q: 'How does an online video doctor consultation work?',
      a: 'After booking your preferred time slot, you will receive an encrypted video room link. At the scheduled time, enter the consultation room directly through your web browser with no download required. The doctor will review your medical history, assess symptoms, and provide an official digital prescription with medications and follow-up advice.'
    },
    {
      q: 'Are the doctors verified and licensed?',
      a: 'Yes, 100%. Every medical practitioner on CheckHealth undergoes a multi-step credential verification process validating their MBBS/MD registrations with the Medical Council of India (MCI) / State Councils, hospital affiliations, and active licenses before receiving a Verified Doctor badge.'
    },
    {
      q: 'How does home sample collection for lab tests work?',
      a: 'When booking a full body package or blood test, select "Home Collection". A certified phlebotomist arrives at your chosen morning time slot with sterilized collection kits. Samples are processed at NABL-accredited diagnostic labs, and your digital PDF report is delivered securely to your health dashboard within 24 hours.'
    },
    {
      q: 'Can I cancel or reschedule my appointment?',
      a: 'Yes, appointments can be easily rescheduled or cancelled free of charge up to 2 hours prior to the scheduled slot from your "My Appointments" portal with an instant 100% refund.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 health-gradient-subtle border-b border-slate-200/60">

        {/* Background decorative glowing orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-200/40 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
                </span>
                <span>India’s Most Trusted Healthcare & Telemedicine Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Your Health, <br />
                <span className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-600 bg-clip-text text-transparent">
                  Our Priority.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
                Find trusted verified doctors, book instant video consultations or clinic visits, schedule full-body health checks with home pickup, and safeguard all medical records in one place.
              </p>

              {/* Multi-Tab Universal Search Box */}
              <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-200/80 max-w-2xl mx-auto lg:mx-0">
                {/* Search Tabs */}
                <div className="flex items-center gap-1 mb-2.5 border-b border-slate-100 pb-2">
                  <button
                    onClick={() => setSearchTab('doctors')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${searchTab === 'doctors' ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    Doctors & Specialists
                  </button>
                  <button
                    onClick={() => setSearchTab('lab')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${searchTab === 'lab' ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    Lab Tests & Packages
                  </button>
                  <button
                    onClick={() => setSearchTab('medicines')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${searchTab === 'medicines' ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    Medicines Directory
                  </button>
                </div>

                <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        searchTab === 'doctors'
                          ? 'Search by Doctor name, specialty (e.g. Cardiologist), or clinic...'
                          : searchTab === 'lab'
                            ? 'Search tests like CBC, Thyroid, Full Body, HbA1c...'
                            : 'Search medicines like Paracetamol, Metformin, Pantocid...'
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-7 rounded-2xl health-gradient text-white font-bold text-sm shadow-md shadow-sky-500/25 hover:opacity-95 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Search className="w-4 h-4" />
                    Search Now
                  </button>
                </form>
              </div>

              {/* Quick Hero CTA Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/doctors"
                  className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 shadow-xs text-slate-800 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Stethoscope className="w-4 h-4 text-sky-600" />
                  Book Appointment
                </Link>

                <Link
                  to="/health-check"
                  className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-xs text-slate-800 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Activity className="w-4 h-4 text-teal-600" />
                  Check Your Health
                </Link>

                <Link
                  to="/doctors?type=online"
                  className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 shadow-xs text-slate-800 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Video className="w-4 h-4 text-rose-500" />
                  Online Consultation
                </Link>
              </div>

            </div>

            {/* Right Hero Visual: Framer Motion Cardless Medical Animation */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <MedicalHeroAnimation />
            </div>

          </div>
        </div>
      </section>

      {/* 2. QUICK SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold text-sky-600 tracking-wider">Fast & Comprehensive</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Our Healthcare Services</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Access all your medical essentials with guaranteed quality and verified care.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {quickServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <Link
                key={idx}
                to={srv.link}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-sky-600 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">
                  {srv.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. MEDICAL SPECIALTIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase font-bold text-teal-600 tracking-wider">Expertise Across Disciplines</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Medical Specialties</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Consult certified doctors across 12+ clinical specialties.</p>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            View All Doctors <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {specialties.map((sp) => {
            const Icon = specialtyIcons[sp.name] || Stethoscope;
            return (
              <Link
                key={sp.id}
                to={`/doctors?specialty=${encodeURIComponent(sp.name)}`}
                className="bg-white rounded-2xl p-4 text-center border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-sky-400 hover:bg-sky-50/40 transition-all group flex flex-col items-center justify-center min-h-[130px]"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center mb-2.5 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs group-hover:text-sky-700 transition-colors leading-tight">
                  {sp.name}
                </h4>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. TOP VERIFIED DOCTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase font-bold text-sky-600 tracking-wider">Top Rated Practitioners</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Consult Leading Specialists</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Experienced clinicians available for clinic visits and live video calls.</p>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            Explore All Specialists <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {topDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onBookClick={(d) => setSelectedDoctorForBooking(d)}
            />
          ))}
        </div>
      </section>

      {/* 5. POPULAR FULL BODY HEALTH PACKAGES */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Preventive Diagnostics</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Full Body Health Packages</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Comprehensive lab tests with 100% free home sample pickup.</p>
            </div>
            <Link
              to="/lab-tests"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Browse All Health Packages →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700 flex flex-col justify-between hover:border-cyan-400 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-[11px] font-bold">
                      {pkg.testsCount} Essential Tests
                    </span>
                    {pkg.isPopular && (
                      <span className="px-2.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold uppercase">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {pkg.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed line-clamp-2">
                    {pkg.subtitle}
                  </p>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-slate-700/80 pt-4 mb-6">
                    {pkg.includes.slice(0, 4).map((inc, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] truncate">{inc}</span>
                      </div>
                    ))}
                    {pkg.includes.length > 4 && (
                      <p className="text-[10px] text-slate-500 pl-5">+{pkg.includes.length - 4} additional parameters</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-700/80 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through mr-2">₹{pkg.originalPrice}</span>
                    <span className="text-xl font-black text-white">₹{pkg.discountPrice}</span>
                  </div>
                  <Link
                    to="/lab-tests"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
                  >
                    Book Home Pickup
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (3 Simple Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-sky-600 tracking-wider">Simple & Seamless</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">How CheckHealth Works</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Complete your healthcare journey in 3 easy steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs relative">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4 text-xl font-black">
              1
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Find Doctor or Health Test</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Search by medical specialty, condition, doctor experience, or choose from comprehensive full body lab checkups.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs relative">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4 text-xl font-black">
              2
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Choose Time & Mode</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select in-person clinic visit or connect via HD video consultation. Pick home sample collection for blood work.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs relative">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-xl font-black">
              3
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Prescription & Locker Storage</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive official digital prescriptions, verified lab reports, and automatic lifetime storage in your encrypted health locker.
            </p>
          </div>
        </div>
      </section>

      {/* 7. AUTHENTIC PATIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold text-teal-600 tracking-wider">Patient Trust</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Real Stories & Feedback</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Authentic reviews submitted by verified patients after completed appointments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <RatingStars rating={5} size="w-4 h-4" />
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Booking an online consult with Dr. Sarah Patel took less than 2 minutes. She reviewed my blood reports carefully and gave clear diet and medication guidance. The digital prescription was generated immediately."
            </p>
            <div className="border-t border-slate-100 pt-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                RV
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Rahul Verma</p>
                <p className="text-[10px] text-slate-400">Verified Patient • Delhi</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <RatingStars rating={5} size="w-4 h-4" />
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The Full Body Checkup service was prompt and well-coordinated. The phlebotomist Anil was punctual, gentle, and the complete 85 biomarker report was uploaded to my health locker the very next morning."
            </p>
            <div className="border-t border-slate-100 pt-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                PN
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Priya Nair</p>
                <p className="text-[10px] text-slate-400">Verified Patient • Bengaluru</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <RatingStars rating={5} size="w-4 h-4" />
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Dr. Ramesh Kumar provided exceptional cardiology guidance. Having all past lab reports and prescriptions securely organized in my health locker made the follow-up consultation effortless."
            </p>
            <div className="border-t border-slate-100 pt-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                VS
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Vikram S.</p>
                <p className="text-[10px] text-slate-400">Verified Patient • Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold text-sky-600 tracking-wider">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-sky-600 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180 text-sky-600' : ''
                    }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

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

export default HomePage;
