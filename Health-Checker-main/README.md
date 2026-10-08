# CheckHealth — Complete Healthcare & Doctor Consultation Platform

A modern, professional full-stack healthcare ecosystem built with **React, Vite, Tailwind CSS v4, Express.js, and Framer Motion**.

CheckHealth matches the product quality of digital healthcare platforms like Practo and Apollo 24|7, offering verified doctor discovery, real-time appointment scheduling, high-tech live telehealth video consultations with digital prescription pads, clinical symptom analysis, full-body health packages with home collection booking, an encrypted medical records locker, and dedicated Doctor & Admin portals.

---

## 🌟 Key Features

### 1. 🏥 Find & Consult Doctors
* **Smart Search & Filters:** Search by doctor name, specialty, condition, hospital, experience level, consultation fees, and availability days.
* **Verified Doctor Credentials:** MCI license number display, hospital affiliations, ratings, and authentic verified patient reviews.
* **Interactive 4-Step Booking Wizard:**
  1. Select consultation mode (Online Video or In-Person Clinic Visit).
  2. Live date & time slot selector with real-time backend concurrency checks to prevent double booking.
  3. Patient details & symptoms description.
  4. Instant checkout (Razorpay test mode / Pay at Clinic) with celebratory confetti and unique tracking code (`CHK-XXXXX`).

### 2. 📹 Live Telehealth Video Consultation Room
* **Real WebRTC & Media Stream:** Toggle live microphone and webcam.
* **Consultation Timer:** Accurate live session tracking.
* **In-Call Real-Time Chat:** Message your doctor during consultations.
* **Doctor's Digital Prescription Pad:** Doctors can write diagnoses, add medications with dosage & duration, and instantly generate official **downloadable PDF prescriptions** using jsPDF.

### 3. 🩺 Interactive Symptom Evaluator & Triage
* **Visual Body Region Selector:** Head, Chest, Abdomen, Skin, Joints, General.
* **Emergency Red Flag Detection:** Real-time detection of high-risk symptoms (chest pain, breathing distress, stroke FAST signs) with urgent 112 / 108 hotlines.
* **Differential Diagnostic Assessment:** Displays likelihood ratings, supportive home remedies, and directs the user to book the recommended specialist.

### 4. ⚖️ Interactive Health Calculators
* **BMI & Healthy Weight Range Calculator:** Accurate Body Mass Index with ideal target weight.
* **BMR & Daily Calorie Burn (TDEE):** Mifflin-St Jeor metabolic energy formula.
* **Daily Hydration Estimator:** Water intake based on weight, workout minutes, and climate.
* **FINDRISC Type 2 Diabetes Risk Questionnaire:** 10-year predictive risk scoring.

### 5. 🧪 Lab Tests & Full Body Checkups
* **Comprehensive Health Packages:** Full Body Checkup (85 biomarkers), Heart & Lipid, Diabetes Care, Women's Health, Vitamin & Immunity.
* **Doorstep Home Sample Collection:** Certified phlebotomist scheduling with morning slots.
* **Transparent Pricing & 24-Hour Digital PDF Reports.**

### 6. 💊 Verified Pharmacopeia & Medicines Directory
* Search verified medicines by brand or generic active ingredients (e.g. Paracetamol, Metformin, Pantoprazole).
* Clinical indications, precautions, known side effects, storage guidelines, and regulatory medical safety disclaimers.

### 7. 🔒 Encrypted Digital Health Locker
* Store lab reports, prescriptions, vaccination cards, and hospital discharge summaries.
* Upload PDF and image documents.
* One-click PDF export and download.
* **Secure Time-Limited Doctor Share Links** with auto-expiration (6h, 24h, 72h).

### 8. 👨‍⚕️ Doctor Dashboard & Admin Control Panel
* **Doctor Workspace:** Today's patient queue, schedule & consultation fee settings, earnings summary, and launch video room.
* **Admin Console:** Platform metrics, doctor credential verification approvals/revocations, users directory, master consultation records, audit logs, and support inquiries.

---

## ⚡ Quick Start Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Frontend & Backend Server Concurrently
```bash
npm run dev:all
```
* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔑 Pre-Configured Demo Accounts

Use the **Quick Role Switcher Ribbon** at the top of the website for 1-click login:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@checkhealth.com` | `password123` | Rahul Verma (Health Locker & Appointments) |
| **Doctor 1** | `doctor@checkhealth.com` | `password123` | Dr. Sarah Patel (General Physician) |
| **Doctor 2** | `ramesh.cardio@checkhealth.com` | `password123` | Dr. Ramesh Kumar (Cardiologist) |
| **Admin** | `admin@checkhealth.com` | `password123` | Platform Administrator (Verification & Audits) |

---

## 🛠️ Technology Stack

* **Frontend:** React 19, Vite, Tailwind CSS v4, React Router DOM, Framer Motion, Lucide React, Axios, Canvas-Confetti, jsPDF.
* **Backend:** Node.js, Express 5, JSON-persistent database engine, JWT Authentication, Multer file upload, Bcrypt.
* **Security & Regulatory Standards:** Role-based Authorization (`patient`, `doctor`, `admin`), Input Sanitization, Audit Logging, and DISHA / Telemedicine Compliance Guidelines.
