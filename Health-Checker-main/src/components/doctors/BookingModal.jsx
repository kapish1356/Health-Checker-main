import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  Building2, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle, 
  User, 
  Phone, 
  FileText, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const BookingModal = ({ doctor, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState('online');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // Available slots from backend
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Patient info
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientAge, setPatientAge] = useState(user?.dob ? '31' : '28');
  const [patientGender, setPatientGender] = useState(user?.gender || 'Male');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '+91 91234 56789');
  const [symptomsNotes, setSymptomsNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Next 7 days generator
  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  };

  const datesList = getDates();

  useEffect(() => {
    if (datesList.length > 0 && !selectedDate) {
      setSelectedDate(datesList[0].fullDate);
    }
  }, []);

  useEffect(() => {
    if (doctor && selectedDate) {
      fetchSlotAvailability();
    }
  }, [doctor, selectedDate]);

  const fetchSlotAvailability = async () => {
    try {
      setLoadingSlots(true);
      const res = await api.get(`/appointments/check-slots?doctorId=${doctor.id}&date=${selectedDate}`);
      if (res.data.success) {
        setAvailableSlots(res.data.availableSlots || doctor.timeSlots || []);
        if (res.data.availableSlots?.length > 0) {
          setSelectedSlot(res.data.availableSlots[0]);
        } else {
          setSelectedSlot('');
        }
      }
    } catch (err) {
      setAvailableSlots(doctor.timeSlots || []);
    } finally {
      setLoadingSlots(false);
    }
  };

  if (!isOpen || !doctor) return null;

  const currentFee = consultationType === 'online' ? (doctor.onlineFee || doctor.consultationFee) : doctor.consultationFee;

  const handleNextStep = () => {
    if (step === 1 && !consultationType) {
      toast.warning('Please choose a consultation mode.');
      return;
    }
    if (step === 2 && (!selectedDate || !selectedSlot)) {
      toast.warning('Please select a date and an available time slot.');
      return;
    }
    if (step === 3 && (!patientName.trim() || !patientPhone.trim())) {
      toast.warning('Please enter patient name and contact phone number.');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleConfirmBooking = async () => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        doctorId: doctor.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        consultationType,
        symptomsNotes,
        patientName,
        patientAge,
        patientGender,
        patientPhone,
        paymentMethod
      };

      const res = await api.post('/appointments/book', payload);
      if (res.data.success) {
        setConfirmedBooking(res.data.appointment);
        setStep(5); // Confirmation screen
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast.success(`Appointment Confirmed! Unique Code: ${res.data.appointment.appointmentCode}`);
        if (onSuccess) onSuccess(res.data.appointment);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to confirm booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white/40"
            />
            <div>
              <h3 className="text-base sm:text-lg font-bold">{doctor.name}</h3>
              <p className="text-xs text-sky-100 font-medium">{doctor.specialty} • {doctor.hospital}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Progress Indicator */}
        {step < 5 && (
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className={step === 1 ? 'text-sky-600 font-bold' : ''}>1. Consult Mode</span>
            <span className="text-slate-300">→</span>
            <span className={step === 2 ? 'text-sky-600 font-bold' : ''}>2. Date & Slot</span>
            <span className="text-slate-300">→</span>
            <span className={step === 3 ? 'text-sky-600 font-bold' : ''}>3. Patient Info</span>
            <span className="text-slate-300">→</span>
            <span className={step === 4 ? 'text-sky-600 font-bold' : ''}>4. Payment</span>
          </div>
        )}

        {/* Step 1: Consult Mode */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <h4 className="text-base font-bold text-slate-900">Choose Consultation Type</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setConsultationType('online')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  consultationType === 'online'
                    ? 'border-sky-500 bg-sky-50/50 shadow-md ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                  <Video className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm">Online Video Consult</h5>
                <p className="text-xs text-slate-500 mt-1">Connect from home via secure HD video room with instant digital prescription.</p>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Consultation Fee</span>
                  <span className="text-sm font-black text-sky-600">₹{doctor.onlineFee || doctor.consultationFee}</span>
                </div>
              </div>

              <div
                onClick={() => setConsultationType('in-person')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  consultationType === 'in-person'
                    ? 'border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm">In-Person Clinic Visit</h5>
                <p className="text-xs text-slate-500 mt-1">{doctor.clinicAddress}</p>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Consultation Fee</span>
                  <span className="text-sm font-black text-teal-600">₹{doctor.consultationFee}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date & Slot Picker */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-sky-500" />
                Select Date
              </h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {datesList.map((d) => (
                  <button
                    key={d.fullDate}
                    onClick={() => setSelectedDate(d.fullDate)}
                    className={`shrink-0 w-20 py-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                      selectedDate === d.fullDate
                        ? 'border-sky-500 bg-sky-500 text-white shadow-md'
                        : 'border-slate-200 hover:border-sky-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="block text-[11px] uppercase font-semibold">{d.dayName}</span>
                    <span className="block text-base font-black leading-tight">{d.dateNum}</span>
                    <span className="block text-[10px] opacity-80">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-500" />
                Available Time Slots
              </h4>

              {loadingSlots ? (
                <div className="py-6 text-center text-xs text-slate-400">Checking slot availability...</div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl text-xs border border-amber-200">
                  No slots available for {selectedDate}. Please pick another date.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-500/20 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Patient Info */}
        {step === 3 && (
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Patient & Medical Details</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  placeholder="Patient Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Visit / Primary Symptoms (Optional)
              </label>
              <textarea
                value={symptomsNotes}
                onChange={(e) => setSymptomsNotes(e.target.value)}
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                placeholder="Briefly describe what symptoms or issues you would like to discuss..."
              />
            </div>
          </div>
        )}

        {/* Step 4: Payment & Review */}
        {step === 4 && (
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Review & Payment Summary</h4>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-800">{doctor.name} ({doctor.specialty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Mode:</span>
                <span className="font-semibold text-sky-600 uppercase">{consultationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-bold text-slate-800">{selectedDate} at {selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-800">{patientName} ({patientAge} yrs, {patientGender})</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm">
                <span className="font-bold text-slate-900">Total Payable Amount:</span>
                <span className="font-black text-sky-600">₹{currentFee}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                    paymentMethod === 'online'
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Razorpay / UPI / Card</span>
                </div>

                <div
                  onClick={() => setPaymentMethod('pay_at_clinic')}
                  className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                    paymentMethod === 'pay_at_clinic'
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Pay at Clinic</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free cancellation and 100% instant refund up to 2 hours prior to scheduled appointment.</span>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation Success */}
        {step === 5 && confirmedBooking && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Appointment Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                A confirmation SMS & email have been dispatched with appointment instructions.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Unique Code:</span>
                <span className="font-mono font-bold text-sky-600 text-sm">{confirmedBooking.appointmentCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-800">{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-bold text-slate-800">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Mode:</span>
                <span className="font-bold uppercase text-teal-600">{confirmedBooking.consultationType}</span>
              </div>
              {confirmedBooking.meetingRoomId && (
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Telehealth Video Link:</span>
                  <span className="font-semibold text-sky-600 truncate">{confirmedBooking.meetingRoomId}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl health-gradient text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:opacity-95 transition-all cursor-pointer"
              >
                Go to My Appointments
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        {step < 5 && (
          <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl health-gradient text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSubmitting ? 'Securing Slot...' : `Pay & Confirm (₹${currentFee})`}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingModal;
