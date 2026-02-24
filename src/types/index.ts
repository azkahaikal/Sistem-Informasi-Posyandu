// Types for Posyandu Information System

export type PatientType = 'ibu_hamil' | 'balita' | 'bayi';
export type Gender = 'L' | 'P';
export type BloodType = 'A' | 'B' | 'AB' | 'O' | 'Tidak Tahu';

export interface Patient {
  id: string;
  no_rm: string; // Nomor Rekam Medis
  nama: string;
  nik?: string;
  tempat_lahir?: string;
  tanggal_lahir: string;
  jenis_kelamin: Gender;
  alamat: string;
  rt?: string;
  rw?: string;
  desa?: string;
  kecamatan?: string;
  no_telp?: string;
  golongan_darah?: BloodType;
  
  // For ibu hamil
  nama_suami?: string;
  hpht?: string; // Hari Pertama Haid Terakhir
  htp?: string; // Hari Taksir Persalinan
  kehamilan_ke?: number;
  
  // For balita/bayi
  nama_ayah?: string;
  nama_ibu?: string;
  berat_lahir?: number; // kg
  panjang_lahir?: number; // cm
  
  // Metadata
  jenis_pasien: PatientType;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Visit {
  id: string;
  patient_id: string;
  tanggal_kunjungan: string;
  
  // Vital signs
  berat_badan?: number; // kg
  tinggi_badan?: number; // cm
  lingkar_lengan?: number; // cm (LILA)
  lingkar_kepala?: number; // cm (for balita)
  tekanan_darah_sistole?: number;
  tekanan_darah_diastole?: number;
  
  // For ibu hamil
  usia_kehamilan?: number; // minggu
  tinggi_fundus?: number; // cm
  denyut_jantung_janin?: number;
  
  // Status
  keluhan?: string;
  diagnosis?: string;
  tindakan?: string;
  
  // Metadata
  petugas: string;
  created_at: string;
}

export interface Immunization {
  id: string;
  patient_id: string;
  jenis_imunisasi: string;
  tanggal: string;
  batch?: string;
  keterangan?: string;
  petugas: string;
  created_at: string;
}

export interface GrowthRecord {
  id: string;
  patient_id: string;
  tanggal: string;
  berat_badan: number;
  tinggi_badan: number;
  lingkar_kepala?: number;
  status_gizi?: 'baik' | 'kurang' | 'buruk' | 'lebih';
  created_at: string;
}

export interface VitaminDistribution {
  id: string;
  patient_id: string;
  jenis_vitamin: string;
  tanggal: string;
  jumlah: number;
  petugas: string;
  created_at: string;
}

export interface DashboardStats {
  total_pasien: number;
  total_ibu_hamil: number;
  total_balita: number;
  total_bayi: number;
  kunjungan_hari_ini: number;
  kunjungan_bulan_ini: number;
  imunisasi_bulan_ini: number;
}

// Available immunization types in Indonesia
export const IMMUNIZATION_TYPES = [
  'HB0 (Hepatitis B 0-7 hari)',
  'BCG',
  'Polio 1',
  'Polio 2',
  'Polio 3',
  'Polio 4',
  'DPT-HB-Hib 1',
  'DPT-HB-Hib 2',
  'DPT-HB-Hib 3',
  'Campak Rubella 1',
  'Campak Rubella 2',
  'PCV 1',
  'PCV 2',
  'PCV 3',
  'IPV',
  'MR (Measles Rubella)',
  'TT (Tetanus Toxoid)',
  'Td',
] as const;

// Available vitamin types
export const VITAMIN_TYPES = [
  'Vitamin A (Merah)',
  'Vitamin A (Biru)',
  'Tablet Tambah Darah (TTD)',
  'Zinc',
  'ORS',
] as const;
