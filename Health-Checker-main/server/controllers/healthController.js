export const analyzeSymptoms = (req, res) => {
  const { 
    symptoms = [], 
    duration = '1-3 days', 
    severity = 'moderate', 
    age = 30, 
    gender = 'all', 
    hasFever = false, 
    redFlags = [] 
  } = req.body;

  if (!symptoms || symptoms.length === 0) {
    return res.status(400).json({ success: false, message: 'Please select at least one symptom to evaluate.' });
  }

  const symptomList = symptoms.map(s => s.toLowerCase());

  // Check for critical emergency red flags
  const criticalConditions = [
    'chest pain or pressure radiating to arm or jaw',
    'sudden severe difficulty breathing or shortness of breath',
    'sudden facial drooping, arm weakness, or slurred speech',
    'uncontrolled bleeding or severe trauma',
    'loss of consciousness or sudden confusion'
  ];

  const matchedCritical = criticalConditions.filter(c => 
    symptomList.some(s => s.includes('chest pain') || s.includes('difficulty breathing') || s.includes('slurred speech') || s.includes('loss of consciousness')) ||
    redFlags.includes(c)
  );

  const isEmergency = matchedCritical.length > 0 || (severity === 'severe' && symptomList.some(s => s.includes('chest') || s.includes('breath')));

  // Differential Knowledge Base
  let possibleCauses = [];
  let suggestedSpecialty = 'General Physician';
  let homeRemedies = [];
  let nextSteps = '';

  if (isEmergency) {
    suggestedSpecialty = 'Cardiologist / Emergency Medicine';
    nextSteps = 'CRITICAL WARNING: Your symptoms may indicate an urgent medical situation. Please call 112 / 108 or proceed immediately to the nearest emergency department.';
    possibleCauses = [
      { name: 'Acute Coronary Syndrome / Angina', probability: 'Urgent Evaluation Needed', description: 'Requires immediate emergency ECG, cardiac enzymes, and specialist stabilization.' },
      { name: 'Severe Respiratory Distress', probability: 'Urgent', description: 'Prompt oxygenation and emergency medical attention required.' }
    ];
  } else if (symptomList.some(s => s.includes('fever') || s.includes('cough') || s.includes('sore throat') || s.includes('chills'))) {
    suggestedSpecialty = 'General Physician';
    possibleCauses = [
      { name: 'Viral Upper Respiratory Infection', probability: 'High', description: 'Common seasonal viral illness affecting nasal passages, pharynx, and upper airway.' },
      { name: 'Acute Pharyngitis / Tonsillitis', probability: 'Moderate', description: 'Inflammation of the throat tissues, typically self-limiting or responsive to targeted care.' },
      { name: 'Influenza (Flu)', probability: 'Moderate', description: 'Viral infection causing fever, chills, body aches, and fatigue.' }
    ];
    homeRemedies = [
      'Adequate hydration with warm fluids, electrolyte water, and herbal broths',
      'Warm saline gargles 3-4 times daily for throat discomfort',
      'Rest and sleep to support natural immune recovery',
      'Fever management under medical advice if temperature exceeds 101°F'
    ];
    nextSteps = 'Consult a General Physician if fever persists beyond 3 days, or if breathing difficulty develops.';
  } else if (symptomList.some(s => s.includes('skin') || s.includes('rash') || s.includes('itch') || s.includes('acne') || s.includes('hair'))) {
    suggestedSpecialty = 'Dermatologist';
    possibleCauses = [
      { name: 'Contact Dermatitis / Urticaria', probability: 'High', description: 'Allergic or irritant skin reaction triggering redness, itching, or localized hives.' },
      { name: 'Eczema / Atopic Dermatitis', probability: 'Moderate', description: 'Chronic inflammatory skin state characterized by dryness and pruritus.' },
      { name: 'Fungal Infection (Tinea)', probability: 'Moderate', description: 'Superficial fungal infection in humid skin folds.' }
    ];
    homeRemedies = [
      'Avoid scratching to prevent secondary bacterial infection',
      'Apply gentle hypoallergenic moisturizing lotion',
      'Wear loose, breathable cotton clothing',
      'Avoid harsh chemical soaps and perfumed detergents'
    ];
    nextSteps = 'Schedule a consultation with a Dermatologist for accurate dermoscopy and tailored topical treatment.';
  } else if (symptomList.some(s => s.includes('joint') || s.includes('back') || s.includes('knee') || s.includes('neck') || s.includes('muscle pain'))) {
    suggestedSpecialty = 'Orthopedic Specialist';
    possibleCauses = [
      { name: 'Acute Musculoskeletal Strain', probability: 'High', description: 'Muscle fiber or ligament irritation due to posture, lifting, or sudden exertion.' },
      { name: 'Early Osteoarthritis / Lumbar Spondylosis', probability: 'Moderate', description: 'Wear and tear of joint cartilage or lumbar vertebrae discs.' }
    ];
    homeRemedies = [
      'Apply cold pack for first 48 hours, followed by warm compress',
      'Gentle ergonomic posture corrections and core strengthening',
      'Avoid heavy weight-lifting or sudden twisting movements'
    ];
    nextSteps = 'Consult an Orthopedic Specialist if pain radiates down legs, causes numbness, or impairs mobility.';
  } else if (symptomList.some(s => s.includes('headache') || s.includes('dizziness') || s.includes('migraine') || s.includes('vertigo'))) {
    suggestedSpecialty = 'Neurologist';
    possibleCauses = [
      { name: 'Tension-Type Headache', probability: 'High', description: 'Dull ache around temples or neck caused by stress, eye strain, or muscle tension.' },
      { name: 'Migraine with/without Aura', probability: 'Moderate', description: 'Throbbing unilateral headache often accompanied by light or sound sensitivity.' },
      { name: 'Benign Positional Vertigo', probability: 'Moderate', description: 'Brief episodes of dizziness triggered by head posture changes.' }
    ];
    homeRemedies = [
      'Rest in a quiet, darkened room',
      'Ensure adequate hydration and regular meal intervals',
      'Limit digital screen time and practice gentle neck stretches'
    ];
    nextSteps = 'Seek Neurologist evaluation if headaches are waking you from sleep or accompanied by visual disturbances.';
  } else if (symptomList.some(s => s.includes('stomach') || s.includes('acidity') || s.includes('nausea') || s.includes('bloating') || s.includes('diarrhea'))) {
    suggestedSpecialty = 'General Physician';
    possibleCauses = [
      { name: 'Gastroesophageal Reflux (GERD) / Dyspepsia', probability: 'High', description: 'Stomach acid backflow irritating esophagus and upper abdominal lining.' },
      { name: 'Acute Gastroenteritis (Stomach Bug)', probability: 'Moderate', description: 'Temporary intestinal irritation or viral infection.' }
    ];
    homeRemedies = [
      'Sip oral rehydration salts (ORS) and coconut water',
      'Eat light, non-greasy foods (bananas, rice, applesauce, toast - BRAT diet)',
      'Avoid spicy, fried, and caffeine-heavy foods'
    ];
    nextSteps = 'Consult a doctor if unable to keep fluids down or if symptoms continue beyond 48 hours.';
  } else {
    suggestedSpecialty = 'General Physician';
    possibleCauses = [
      { name: 'Non-Specific Physiological Fatigue / Imbalance', probability: 'Moderate', description: 'May be related to sleep deprivation, mild dehydration, stress, or nutritional gaps.' }
    ];
    homeRemedies = [
      'Maintain 7-8 hours of sound sleep',
      'Stay hydrated with 2-3 liters of water daily',
      'Follow balanced nutrition with fresh fruits and green vegetables'
    ];
    nextSteps = 'Book a wellness checkup with a General Physician to review vitals and baseline lab biomarkers.';
  }

  return res.json({
    success: true,
    disclaimer: 'MEDICAL DISCLAIMER: This assessment is for educational guidance only and does NOT constitute a formal medical diagnosis. Always seek clinical advice from a qualified healthcare practitioner.',
    isEmergency,
    evaluatedSymptoms: symptoms,
    severity,
    duration,
    suggestedSpecialty,
    possibleCauses,
    homeRemedies,
    nextSteps
  });
};

export const calculateHealthMetrics = (req, res) => {
  const { type, values } = req.body;

  if (!type || !values) {
    return res.status(400).json({ success: false, message: 'Calculation type and values required.' });
  }

  let result = {};

  if (type === 'bmi') {
    const { weightKg, heightCm } = values;
    if (!weightKg || !heightCm) {
      return res.status(400).json({ success: false, message: 'Weight (kg) and Height (cm) required.' });
    }
    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    
    let category = 'Normal weight';
    let risk = 'Low Risk';
    let color = 'emerald';
    if (bmi < 18.5) {
      category = 'Underweight';
      risk = 'Risk of nutritional deficiency';
      color = 'amber';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Healthy / Normal';
      risk = 'Optimal metabolic health range';
      color = 'emerald';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      risk = 'Increased risk of cardiovascular & metabolic conditions';
      color = 'orange';
    } else {
      category = 'Obesity';
      risk = 'High risk of hypertension, type 2 diabetes & lipid disorders';
      color = 'rose';
    }

    const minHealthyWeight = (18.5 * heightM * heightM).toFixed(1);
    const maxHealthyWeight = (24.9 * heightM * heightM).toFixed(1);

    result = {
      bmi,
      category,
      risk,
      color,
      healthyWeightRange: `${minHealthyWeight} kg - ${maxHealthyWeight} kg`,
      interpretation: `A BMI of ${bmi} indicates ${category}. For a height of ${heightCm} cm, the ideal healthy weight is between ${minHealthyWeight} kg and ${maxHealthyWeight} kg.`
    };
  } else if (type === 'bmr') {
    const { weightKg, heightCm, age, gender = 'male', activityLevel = 'moderate' } = values;
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;
    bmr = Math.round(bmr);

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const multiplier = activityMultipliers[activityLevel] || 1.55;
    const tdee = Math.round(bmr * multiplier);

    result = {
      bmr,
      tdee,
      weightLossCalories: tdee - 500,
      weightGainCalories: tdee + 500,
      interpretation: `Your Basal Metabolic Rate (BMR) is approx. ${bmr} kcal/day (energy burned at complete rest). With your activity level, you burn approx. ${tdee} kcal/day.`
    };
  } else if (type === 'water') {
    const { weightKg, activityMinutes = 30, climate = 'moderate' } = values;
    let baselineMl = weightKg * 35;
    if (activityMinutes > 0) {
      baselineMl += (activityMinutes / 30) * 350;
    }
    if (climate === 'hot') {
      baselineMl += 500;
    }

    const liters = (baselineMl / 1000).toFixed(1);
    const glasses = Math.round(baselineMl / 250);

    result = {
      dailyWaterLiters: liters,
      glassesCount: glasses,
      interpretation: `Recommended daily fluid intake is approx. ${liters} Liters (around ${glasses} standard 250ml glasses) to support kidney function, cellular hydration, and energy.`
    };
  } else if (type === 'diabetes_risk') {
    const { age, bmi, waistCm, physicalActivityDaily, familyHistory, highBp } = values;
    let score = 0;
    if (age >= 45) score += 3;
    else if (age >= 35) score += 2;

    if (bmi >= 30) score += 3;
    else if (bmi >= 25) score += 1;

    if (waistCm > 90) score += 2;
    if (!physicalActivityDaily) score += 2;
    if (familyHistory) score += 3;
    if (highBp) score += 2;

    let riskLevel = 'Low Risk (1 in 100 chance)';
    let color = 'emerald';
    if (score >= 12) {
      riskLevel = 'High Risk (1 in 3 chance within 10 years)';
      color = 'rose';
    } else if (score >= 7) {
      riskLevel = 'Moderate Risk (1 in 7 chance within 10 years)';
      color = 'amber';
    }

    result = {
      riskScore: score,
      riskLevel,
      color,
      recommendation: score >= 7 ? 'Recommended to get an HbA1c and Fasting Glucose lab test done, plus consult a physician for lifestyle counseling.' : 'Your risk profile looks favorable. Continue regular physical activity and a balanced whole-foods diet.'
    };
  }

  return res.json({
    success: true,
    type,
    result
  });
};
