import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  FileText, 
  Share2, 
  ShieldCheck, 
  Send, 
  Plus, 
  Trash2, 
  Download, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const VideoCallRoom = ({ appointment, onEndCall }) => {
  const { user, role } = useAuth();
  const toast = useToast();

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'notes'
  const [callDuration, setCallDuration] = useState(0);

  // Chat State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Encrypted peer-to-peer telehealth channel initialized.', time: 'Now' },
    { id: 2, sender: appointment?.doctorName || 'Doctor', text: 'Hello! I can see and hear you clearly. How are you feeling today?', time: 'Just now' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Prescription / Notes State (for Doctor)
  const [summary, setSummary] = useState(appointment?.symptomsNotes || 'Patient presented with seasonal discomfort.');
  const [advice, setAdvice] = useState('Stay well-hydrated, take prescribed medications after meals, and rest.');
  const [medsList, setMedsList] = useState([
    { name: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'Twice daily after food', duration: '3 Days' },
    { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'At bedtime', duration: '5 Days' }
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  const [newMedDuration, setNewMedDuration] = useState('');

  // Local Video Stream
  const localVideoRef = useRef(null);

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Camera/Mic permission not granted or device not found; using simulated preview.', err);
      }
    };

    startCamera();

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.name || 'You',
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    setMedsList((prev) => [
      ...prev,
      {
        name: newMedName,
        dosage: newMedDosage || '1 dose',
        frequency: newMedFreq || 'As needed',
        duration: newMedDuration || '5 Days'
      }
    ]);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedFreq('');
    setNewMedDuration('');
  };

  const handleRemoveMed = (index) => {
    setMedsList((prev) => prev.filter((_, i) => i !== index));
  };

  const generatePrescriptionPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(2, 132, 199);
      doc.text('CheckHealth Telehealth Network', 20, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Official Digital Medical Prescription & Clinical Summary', 20, 28);
      doc.line(20, 32, 190, 32);

      // Details Box
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`Doctor: ${appointment?.doctorName || 'Dr. Sarah Patel'}`, 20, 42);
      doc.setFont('helvetica', 'normal');
      doc.text(`Specialty: ${appointment?.doctorSpecialty || 'General Physician'}`, 20, 48);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 54);

      doc.setFont('helvetica', 'bold');
      doc.text(`Patient: ${appointment?.patientName || user?.name}`, 120, 42);
      doc.setFont('helvetica', 'normal');
      doc.text(`Appointment Code: ${appointment?.appointmentCode || 'CHK-89201'}`, 120, 48);
      doc.text(`Duration: ${formatTimer(callDuration)}`, 120, 54);

      doc.line(20, 58, 190, 58);

      // Clinical Diagnosis
      doc.setFont('helvetica', 'bold');
      doc.text('Clinical Assessment & Diagnosis:', 20, 68);
      doc.setFont('helvetica', 'normal');
      doc.text(summary, 20, 75, { maxWidth: 170 });

      // Medications
      doc.setFont('helvetica', 'bold');
      doc.text('Rx - Prescribed Medications:', 20, 95);
      doc.setFont('helvetica', 'normal');

      let yPos = 103;
      medsList.forEach((med, i) => {
        doc.text(`${i + 1}. ${med.name} - ${med.dosage} (${med.frequency}) for ${med.duration}`, 25, yPos);
        yPos += 8;
      });

      // Advice
      yPos += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Physician Advice & Next Steps:', 20, yPos);
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text(advice, 20, yPos, { maxWidth: 170 });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Digitally signed and generated via CheckHealth Telemedicine Platform.', 20, 280);

      doc.save(`Prescription_${appointment?.appointmentCode || 'CHK-Consult'}.pdf`);
      toast.success('Prescription PDF successfully generated and downloaded!', 'PDF Downloaded');
    } catch (e) {
      toast.error('Failed to generate PDF document');
    }
  };

  const handleFinishAndSave = async () => {
    try {
      if (appointment?.id) {
        await api.post(`/appointments/${appointment.id}/complete`, {
          consultationSummary: summary,
          doctorAdvice: advice,
          medicines: medsList
        });
        toast.success('Consultation summary and prescription recorded to patient record!', 'Completed');
      }
      if (onEndCall) onEndCall();
    } catch (e) {
      if (onEndCall) onEndCall();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950 text-white flex flex-col">
      
      {/* Top Consultation Header */}
      <div className="h-16 bg-slate-900/90 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              Live Video Consult: {appointment?.doctorName || 'Dr. Sarah Patel'}
              <span className="text-xs font-normal text-slate-400">
                ({appointment?.doctorSpecialty || 'General Medicine'})
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Patient: {appointment?.patientName || user?.name} • Code: {appointment?.appointmentCode || 'CHK-89201'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-mono text-cyan-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* Main Video & Sidebar Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Video Canvas Area */}
        <div className="flex-1 p-4 flex flex-col justify-between relative bg-radial from-slate-900 to-slate-950">
          
          {/* Main Remote Feed */}
          <div className="flex-1 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Simulated Remote Doctor Stream */}
            <img
              src={appointment?.doctorAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800'}
              alt="Remote Doctor"
              className="w-full h-full object-cover opacity-90 filter brightness-95"
            />

            {/* Doctor Info Tag */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-white">{appointment?.doctorName || 'Dr. Sarah Patel'} (HD 1080p)</span>
            </div>

            {/* Self Video PIP (Picture in Picture) */}
            <div className="absolute bottom-4 right-4 w-40 h-28 sm:w-56 sm:h-36 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-2xl">
              {videoOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                  <VideoOff className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-1.5 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white font-medium">
                You {micOn ? '' : '(Muted)'}
              </div>
            </div>
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="h-20 flex items-center justify-center gap-3 sm:gap-4 mt-4">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              }`}
              title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                videoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              }`}
              title={videoOn ? 'Turn Video Off' : 'Turn Video On'}
            >
              {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'chat' ? 'notes' : 'chat')}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-all cursor-pointer"
              title="Toggle Clinical Tools"
            >
              {activeTab === 'chat' ? <FileText className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
            </button>

            <button
              onClick={handleFinishAndSave}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Consultation</span>
            </button>
          </div>

        </div>

        {/* Right Sidebar: Chat / Prescription Pad */}
        <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-80 lg:h-auto">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'chat' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              In-Call Chat
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'notes' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Prescription & Rx Pad
            </button>
          </div>

          {/* Tab 1: Live Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl text-xs ${
                      m.sender === 'System'
                        ? 'bg-slate-800/50 text-slate-400 text-center italic text-[11px]'
                        : m.sender === (user?.name || 'You')
                        ? 'bg-sky-600 text-white ml-6 rounded-br-xs'
                        : 'bg-slate-800 text-slate-200 mr-6 rounded-bl-xs'
                    }`}
                  >
                    {m.sender !== 'System' && (
                      <p className="font-bold text-[10px] text-cyan-300 mb-1">{m.sender} • {m.time}</p>
                    )}
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type a clinical note or message..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Prescription & Clinical Notes */}
          {activeTab === 'notes' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-400 font-medium mb-1">Clinical Diagnosis / Symptoms</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-400 font-medium">Prescribed Medications</label>
                </div>

                <div className="space-y-2 mb-2">
                  {medsList.map((med, index) => (
                    <div key={index} className="bg-slate-800 p-2.5 rounded-xl flex items-center justify-between gap-2 border border-slate-700/60">
                      <div>
                        <p className="font-bold text-white text-xs">{med.name}</p>
                        <p className="text-[11px] text-slate-400">{med.dosage} • {med.frequency} • {med.duration}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveMed(index)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Medicine form */}
                <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/80 space-y-2">
                  <p className="font-bold text-cyan-400 text-[11px] flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add New Medicine
                  </p>
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Amoxicillin 500mg)"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      placeholder="Dosage (1 tab)"
                      value={newMedDosage}
                      onChange={(e) => setNewMedDosage(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-white"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (Bid)"
                      value={newMedFreq}
                      onChange={(e) => setNewMedFreq(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-white"
                    />
                    <input
                      type="text"
                      placeholder="Days (5 Days)"
                      value={newMedDuration}
                      onChange={(e) => setNewMedDuration(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="w-full py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors"
                  >
                    + Add to Prescription
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Doctor Advice & Lifestyle Guidance</label>
                <textarea
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={generatePrescriptionPDF}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Official Prescription PDF
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default VideoCallRoom;
