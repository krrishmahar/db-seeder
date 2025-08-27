import { faker } from '@faker-js/faker';

// Helper: Capitalize string
export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Helper: Generate 10-digit Indian-style phone numbers
export function generatePhone(): string {
  // Indian mobile numbers usually start with [6-9]
  return faker.number.int({ min: 6000000000, max: 9999999999 }).toString();
}

// Helper: Generate lab image URL based on initials
export function generateLabImageUrl(labName: string): string {
  const sanitized = labName.replace(/[^a-zA-Z\s]/g, ''); // Remove special chars
  const initials = sanitized
    .trim()
    .split(/\s+/) // split by spaces
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
  return `https://placehold.co/100x100/F7E8F6/333333?text=${initials}`;
}


// Helper: Random subset of collection types
export function randomCollectionTypes(): string[] {
  const types = ['Home Collection', 'Lab Visit', 'Home Clinic'];
  const count = faker.number.int({ min: 1, max: 3 });
  return faker.helpers.arrayElements(types, count);
}


// Helper: Generate random time slots
export function generateTimeSlots() {
  const sessions = [
    { time: '08:30', session: 'MORNING' },
    { time: '10:00', session: 'MORNING' },
    { time: '11:30', session: 'MORNING' },
    { time: '13:30', session: 'AFTERNOON' },
    { time: '15:00', session: 'AFTERNOON' },
    { time: '16:30', session: 'AFTERNOON' },
    { time: '18:30', session: 'EVENING' },
    { time: '20:00', session: 'EVENING' },
    { time: '21:30', session: 'EVENING' },
];

// Shuffle
const shuffled = faker.helpers.shuffle(sessions);

// Pick random count between 3 and 9
const count = faker.number.int({ min: 3, max: 9 });

// Randomly shuffle and pick at least {count} per session
    return shuffled.slice(0, count).map((slot) => ({
        ...slot,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

// Helper: Randomly pick test type and one of its tests
export function randomTestType() {
  const categories = Object.keys(testCatalog);
  const selectedCategory = faker.helpers.arrayElement(categories);
  const test = faker.helpers.arrayElement(testCatalog[selectedCategory]);
  return { category: selectedCategory, test };
}

// Helper of Helper{randomTestType}: Generate up to N unique random tests (default: 11)
export function randomTests(limit = 11) {
  const selected = new Set<string>();
  const result: { category: string; test: string }[] = [];

  // Flatten category+test into unique combinations
  const allTests: { category: string; test: string }[] = [];
  for (const [category, tests] of Object.entries(testCatalog)) {
    for (const t of tests) {
      allTests.push({ category, test: t });
    }
  }

  while (result.length < limit && result.length < allTests.length) {
    const pick = faker.helpers.arrayElement(allTests);
    const key = `${pick.category}::${pick.test}`;
    if (!selected.has(key)) {
      selected.add(key);
      result.push(pick);
    }
  }

  return result;
}


// Predefined tests map
const testCatalog: Record<string, string[]> = {
  'Hematology Tests': [
    'CBC (Complete Blood Count)',
    'Hemoglobin (Hb)',
    'RBC Count',
    'WBC Count',
    'Platelet Count',
    'ESR (Erythrocyte Sedimentation Rate)',
    'PCV (Packed Cell Volume)',
    'MCV, MCH, MCHC',
    'Peripheral Blood Smear',
    'Reticulocyte Count',
    'Bleeding Time (BT)',
    'Clotting Time (CT)',
    'Prothrombin Time (PT)',
    'INR (International Normalized Ratio)',
  ],
  'Biochemistry Tests': [
    'Blood Glucose (Fasting / PP / Random)',
    'HbA1c (Glycated Hemoglobin)',
    'Lipid Profile',
    'Total Cholesterol',
    'HDL',
    'LDL',
    'Triglycerides',
    'VLDL',
    'Liver Function Test (LFT)',
    'Bilirubin (Total, Direct, Indirect)',
    'SGOT / AST',
    'SGPT / ALT',
    'ALP (Alka Phosphatase)',
    'GGT',
    'Albumin',
    'Globulin',
    'Kidney Function Test (KFT / RFT)',
    'Urea',
    'Creatinine',
    'Uric Acid',
    'Electrolytes (Na⁺, K⁺, Cl⁻)',
    'Thyroid Profile (T3, T4, TSH)',
    'Calcium',
    'Phosphorus',
    'Magnesium',
    'CRP (C-Reactive Protein)',
    'Vitamin D',
    'Vitamin B12',
  ],
  'Urine Tests': [
    'Urine Routine and Microscopy',
    'Urine Culture',
    'Urine Pregnancy Test',
    '24-hour Urine Protein',
    'Urine Albumin / Creatinine Ratio',
  ],
  'Stool Tests': [
    'Stool Routine and Microscopy',
    'Stool Culture',
    'Occult Blood Test',
  ],
  'Microbiology Tests': [
    'Blood Culture',
    'Throat Swab Culture',
    'Sputum Culture',
    'Urine Culture',
    'Stool Culture',
    'Wound Swab Culture',
    'AFB (Acid Fast Bacilli for TB)',
    'Gram Stain',
    'KOH Mount',
  ],
  'Serology & Immunology': [
    'HIV Test (ELISA / Rapid)',
    'Hepatitis B Surface Antigen (HBsAg)',
    'Hepatitis C Antibody',
    'VDRL / RPR (Syphilis)',
    'Dengue NS1, IgM, IgG',
    'Widal Test (Typhoid)',
    'ASO Titre (Rheumatic Fever)',
    'Rheumatoid Factor (RA Test)',
    'CRP',
    'ANA (Anti-Nuclear Antibody)',
    'COVID-19 RT-PCR / Antibody Test',
  ],
  'Hormone & Endocrine Tests': [
    'Insulin',
    'Cortisol',
    'FSH',
    'LH',
    'Prolactin',
    'Testosterone',
    'Estrogen',
    'Beta-hCG',
  ],
  'Histopathology & Cytology': [
    'FNAC (Fine Needle Aspiration Cytology)',
    'Biopsy (Tissue Examination)',
    'Pap Smear',
  ],
  'Panels / Packages': [
    'Fever Panel',
    'Anemia Panel',
    'Diabetes Panel',
    'Infection Panel',
    'Cardiac Risk Markers (Troponin, CK-MB)',
    'TORCH Panel',
  ],
};