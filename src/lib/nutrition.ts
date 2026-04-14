/**
 * Nutrition Status Calculation (WHO Standards Simplified)
 * This utility calculates Z-scores for Weight-for-Age (WFA), 
 * Height-for-Age (HFA), and Weight-for-Height (WFH).
 */

import type { Patient } from "@/types";

// Standard Deviation tables (Simplified for demo)
// In a real app, these would be full WHO Growth Chart tables
const WHO_TABLES = {
  BOYS_WFA: [
    { month: 0, median: 3.3, sd: 0.4 },
    { month: 6, median: 7.9, sd: 0.8 },
    { month: 12, median: 9.6, sd: 1.0 },
    { month: 24, median: 12.2, sd: 1.2 },
    { month: 36, median: 14.3, sd: 1.5 },
    { month: 48, median: 16.3, sd: 1.8 },
    { month: 60, median: 18.3, sd: 2.1 },
  ],
  GIRLS_WFA: [
    { month: 0, median: 3.2, sd: 0.4 },
    { month: 6, median: 7.3, sd: 0.8 },
    { month: 12, median: 8.9, sd: 1.0 },
    { month: 24, median: 11.5, sd: 1.2 },
    { month: 36, median: 13.9, sd: 1.5 },
    { month: 48, median: 16.1, sd: 1.8 },
    { month: 60, median: 18.2, sd: 2.1 },
  ],
  BOYS_HFA: [
    { month: 0, median: 49.9, sd: 2.0 },
    { month: 6, median: 67.6, sd: 2.5 },
    { month: 12, median: 75.7, sd: 2.7 },
    { month: 24, median: 87.1, sd: 3.2 },
    { month: 36, median: 96.1, sd: 3.5 },
    { month: 48, median: 103.3, sd: 4.0 },
    { month: 60, median: 110.0, sd: 4.4 },
  ],
  GIRLS_HFA: [
    { month: 0, median: 49.1, sd: 2.0 },
    { month: 6, median: 65.7, sd: 2.5 },
    { month: 12, median: 74.0, sd: 2.7 },
    { month: 24, median: 85.7, sd: 3.2 },
    { month: 36, median: 95.1, sd: 3.5 },
    { month: 48, median: 102.7, sd: 4.0 },
    { month: 60, median: 109.4, sd: 4.4 },
  ]
};

function interpolate(ageInMonths: number, table: { month: number, median: number, sd: number }[]) {
  const lower = [...table].reverse().find(row => row.month <= ageInMonths) || table[0];
  const upper = table.find(row => row.month >= ageInMonths) || table[table.length - 1];
  
  if (lower.month === upper.month) return lower;
  
  const factor = (ageInMonths - lower.month) / (upper.month - lower.month);
  return {
    median: lower.median + (upper.median - lower.median) * factor,
    sd: lower.sd + (upper.sd - lower.sd) * factor
  };
}

export function calculateNutritionStatus(patient: Patient, weight: number, height: number, date: string) {
  const birthDate = new Date(patient.tanggal_lahir);
  const checkDate = new Date(date);
  const diffTime = Math.abs(checkDate.getTime() - birthDate.getTime());
  const ageInMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  
  const isMale = patient.jenis_kelamin === 'L';
  const wfaTable = isMale ? WHO_TABLES.BOYS_WFA : WHO_TABLES.GIRLS_WFA;
  const hfaTable = isMale ? WHO_TABLES.BOYS_HFA : WHO_TABLES.GIRLS_HFA;
  
  const wfaRef = interpolate(ageInMonths, wfaTable);
  const hfaRef = interpolate(ageInMonths, hfaTable);
  
  const wfaZ = (weight - wfaRef.median) / wfaRef.sd;
  const hfaZ = (height - hfaRef.median) / hfaRef.sd;
  
  // BB/U Status
  let wfaStatus = "Gizi Baik";
  if (wfaZ < -3) wfaStatus = "Gizi Buruk";
  else if (wfaZ < -2) wfaStatus = "Gizi Kurang";
  else if (wfaZ > 2) wfaStatus = "Gizi Lebih";
  
  // TB/U Status
  let hfaStatus = "Normal";
  if (hfaZ < -3) hfaStatus = "Sangat Pendek (Severely Stunted)";
  else if (hfaZ < -2) hfaStatus = "Pendek (Stunted)";
  else if (hfaZ > 3) hfaStatus = "Tinggi";

  return {
    wfaZ: parseFloat(wfaZ.toFixed(2)),
    hfaZ: parseFloat(hfaZ.toFixed(2)),
    status: `${wfaStatus} & ${hfaStatus}`,
    primaryStatus: wfaStatus,
    stuntingStatus: hfaStatus
  };
}

export const NUTRIENT_RECOMMENDATIONS = {
  PREGNANT_T1: { kalori: 2000, protein: 60, karbohidrat: 300, lemak: 65, zat_besi: 27, asam_folat: 600 },
  PREGNANT_T2: { kalori: 2300, protein: 70, karbohidrat: 340, lemak: 75, zat_besi: 27, asam_folat: 600 },
  PREGNANT_T3: { kalori: 2500, protein: 80, karbohidrat: 380, lemak: 85, zat_besi: 27, asam_folat: 600 },
  BREASTFEEDING: { kalori: 2600, protein: 85, karbohidrat: 400, lemak: 90, zat_besi: 18, asam_folat: 500 },
  TODDLER_12_23: { kalori: 1125, protein: 20, karbohidrat: 155, lemak: 45 },
  TODDLER_24_59: { kalori: 1400, protein: 25, karbohidrat: 200, lemak: 50 }
};

export const WHO_GLOBAL_AVERAGES = [
  { month: 0, weight: 3.3, height: 49.9 },
  { month: 6, weight: 7.9, height: 67.6 },
  { month: 12, weight: 9.6, height: 75.7 },
  { month: 24, weight: 12.2, height: 87.1 },
  { month: 36, weight: 14.3, height: 96.1 },
  { month: 48, weight: 16.3, height: 103.3 },
  { month: 60, weight: 18.3, height: 110.0 }
];

export const MEAL_DATABASE = [
  { name: "Nasi Tim Ayam & Brokoli", tags: ["balita", "tinggi_protein"], ingredients: ["beras", "ayam", "brokoli"] },
  { name: "Bubur Sumsum Saus Buah", tags: ["balita", "snack"], ingredients: ["tepung beras", "santan", "buah"] },
  { name: "Sup Ikan Patin", tags: ["ibu_hamil", "omega3"], ingredients: ["ikan patin", "kunyit", "sayur"] },
  { name: "Oatmeal Kurma & Susu", tags: ["ibu_hamil", "serat"], ingredients: ["oat", "kurma", "susu"] },
  { name: "Pepes Tahu Telur", tags: ["ekonomis", "tinggi_protein"], ingredients: ["tahu", "telur", "kemangi"] }
];
