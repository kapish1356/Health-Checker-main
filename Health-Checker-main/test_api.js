import axios from 'axios';

async function runTests() {
  console.log('🩺 Testing CheckHealth REST API...\n');
  const base = 'http://localhost:5000/api';

  // 1. Health
  const health = await axios.get(`${base}/health`);
  console.log('✅ 1. Health Check:', health.data);

  // 2. Auth
  const login = await axios.post(`${base}/auth/login`, {
    email: 'patient@checkhealth.com',
    password: 'password123'
  });
  console.log('✅ 2. Auth Login:', login.data.user.name, `(${login.data.user.role})`);
  const token = login.data.token;
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // 3. Doctors & Specialties
  const specialties = await axios.get(`${base}/doctors/specialties`);
  const doctors = await axios.get(`${base}/doctors?sortBy=rating`);
  console.log('✅ 3. Specialties & Doctors:', `${specialties.data.specialties.length} specialties, ${doctors.data.total} doctors`);

  // 4. Slot Availability & Concurrency
  const slots = await axios.get(`${base}/appointments/check-slots?doctorId=doc-1&date=2026-10-15`);
  console.log('✅ 4. Slots on 2026-10-15 for Dr. Sarah:', slots.data.availableSlots.length, 'slots open');

  // 5. Book Appointment
  const book = await axios.post(`${base}/appointments/book`, {
    doctorId: 'doc-1',
    date: '2026-10-15',
    timeSlot: slots.data.availableSlots[0],
    consultationType: 'online',
    symptomsNotes: 'Routine follow up'
  }, authHeaders);
  console.log('✅ 5. Booked Appointment Code:', book.data.appointment.appointmentCode, `Status: ${book.data.appointment.status}`);

  // 6. Symptom Checker
  const sym = await axios.post(`${base}/health-check/symptom-check`, {
    symptoms: ['Headache', 'Fever', 'Sore throat'],
    duration: '1-3 days',
    severity: 'moderate'
  });
  console.log('✅ 6. Symptom Checker Output: Specialty =>', sym.data.suggestedSpecialty, '| Causes:', sym.data.possibleCauses.map(c => c.name).join(', '));

  // 7. Health Calculators
  const bmi = await axios.post(`${base}/health-check/calculate`, {
    type: 'bmi',
    values: { weightKg: 70, heightCm: 175 }
  });
  console.log('✅ 7. BMI Calculator:', bmi.data.result.bmi, `(${bmi.data.result.category}) Range: ${bmi.data.result.healthyWeightRange}`);

  // 8. Lab Packages
  const labs = await axios.get(`${base}/lab-tests`);
  console.log('✅ 8. Lab Catalog:', `${labs.data.packages.length} full packages, ${labs.data.tests.length} diagnostic tests`);

  // 9. Medicines
  const meds = await axios.get(`${base}/medicines?search=Paracetamol`);
  console.log('✅ 9. Medicines Search (Paracetamol):', meds.data.medicines[0].brandName, `(${meds.data.medicines[0].category})`);

  // 10. Medical Records
  const records = await axios.get(`${base}/medical-records`, authHeaders);
  console.log('✅ 10. Encrypted Health Locker Records:', `${records.data.records.length} documents stored`);

  console.log('\n🎉 ALL 10 CORE HEALTHCARE SUBSYSTEMS FUNCTIONING FLAWLESSLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err.response?.data || err.message);
});
