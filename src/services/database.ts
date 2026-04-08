// Database service using localStorage for simplicity
// In production, this should be replaced with a proper backend API

import type { Patient, Visit, Immunization, GrowthRecord, VitaminDistribution, DashboardStats } from '@/types';

const DB_KEYS = {
  PATIENTS: 'posyandu_patients',
  VISITS: 'posyandu_visits',
  IMMUNIZATIONS: 'posyandu_immunizations',
  GROWTH_RECORDS: 'posyandu_growth_records',
  VITAMINS: 'posyandu_vitamins',
};

// Generic CRUD operations
class DatabaseService {
  // Patients
  static getPatients(): Patient[] {
    const data = localStorage.getItem(DB_KEYS.PATIENTS);
    try {
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed.filter(p => p && typeof p === 'object' && p.id) : [];
    } catch (e) {
      console.error('Error parsing patients data', e);
      return [];
    }
  }

  static getPatientById(id: string): Patient | null {
    const patients = this.getPatients();
    return patients.find(p => p.id === id) || null;
  }

  static savePatient(patient: Patient): void {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === patient.id);
    
    if (index >= 0) {
      patients[index] = { ...patient, updated_at: new Date().toISOString() };
    } else {
      patients.push({
        ...patient,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify(patients));
  }

  static deletePatient(id: string): void {
    const patients = this.getPatients().filter(p => p.id !== id);
    localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify(patients));
  }

  static generateNoRM(jenisPasien: 'ibu_hamil' | 'balita' | 'bayi'): string {
    const patients = this.getPatients();
    const prefix = jenisPasien === 'ibu_hamil' ? 'IH' : jenisPasien === 'balita' ? 'BL' : 'BY';
    const year = new Date().getFullYear().toString().slice(-2);
    const count = patients.filter(p => p.jenis_pasien === jenisPasien).length + 1;
    return `${prefix}${year}${count.toString().padStart(4, '0')}`;
  }

  // Visits
  static getVisits(): Visit[] {
    const data = localStorage.getItem(DB_KEYS.VISITS);
    try {
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  static getVisitsByPatient(patientId: string): Visit[] {
    return this.getVisits().filter(v => v && v.patient_id === patientId);
  }

  static saveVisit(visit: Visit): void {
    const visits = this.getVisits();
    const index = visits.findIndex(v => v.id === visit.id);
    
    if (index >= 0) {
      visits[index] = visit;
    } else {
      visits.push({
        ...visit,
        created_at: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(DB_KEYS.VISITS, JSON.stringify(visits));
  }

  static deleteVisit(id: string): void {
    const visits = this.getVisits().filter(v => v.id !== id);
    localStorage.setItem(DB_KEYS.VISITS, JSON.stringify(visits));
  }

  // Immunizations
  static getImmunizations(): Immunization[] {
    const data = localStorage.getItem(DB_KEYS.IMMUNIZATIONS);
    try {
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  static getImmunizationsByPatient(patientId: string): Immunization[] {
    return this.getImmunizations().filter(i => i && i.patient_id === patientId);
  }

  static saveImmunization(immunization: Immunization): void {
    const immunizations = this.getImmunizations();
    const index = immunizations.findIndex(i => i.id === immunization.id);
    
    if (index >= 0) {
      immunizations[index] = immunization;
    } else {
      immunizations.push({
        ...immunization,
        created_at: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(DB_KEYS.IMMUNIZATIONS, JSON.stringify(immunizations));
  }

  static deleteImmunization(id: string): void {
    const immunizations = this.getImmunizations().filter(i => i.id !== id);
    localStorage.setItem(DB_KEYS.IMMUNIZATIONS, JSON.stringify(immunizations));
  }

  // Growth Records
  static getGrowthRecords(): GrowthRecord[] {
    const data = localStorage.getItem(DB_KEYS.GROWTH_RECORDS);
    try {
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  static getGrowthRecordsByPatient(patientId: string): GrowthRecord[] {
    return this.getGrowthRecords().filter(g => g && g.patient_id === patientId);
  }

  static saveGrowthRecord(record: GrowthRecord): void {
    const records = this.getGrowthRecords();
    const index = records.findIndex(r => r.id === record.id);
    
    if (index >= 0) {
      records[index] = record;
    } else {
      records.push({
        ...record,
        created_at: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(DB_KEYS.GROWTH_RECORDS, JSON.stringify(records));
  }

  // Vitamin Distribution
  static getVitaminDistributions(): VitaminDistribution[] {
    const data = localStorage.getItem(DB_KEYS.VITAMINS);
    try {
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  static getVitaminDistributionsByPatient(patientId: string): VitaminDistribution[] {
    return this.getVitaminDistributions().filter(v => v && v.patient_id === patientId);
  }

  static saveVitaminDistribution(vitamin: VitaminDistribution): void {
    const vitamins = this.getVitaminDistributions();
    const index = vitamins.findIndex(v => v.id === vitamin.id);
    
    if (index >= 0) {
      vitamins[index] = vitamin;
    } else {
      vitamins.push({
        ...vitamin,
        created_at: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(DB_KEYS.VITAMINS, JSON.stringify(vitamins));
  }

  // Dashboard Stats
  static getDashboardStats(): DashboardStats {
    const patients = this.getPatients();
    const visits = this.getVisits();
    const immunizations = this.getImmunizations();
    
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    return {
      total_pasien: patients.length,
      total_ibu_hamil: patients.filter(p => p.jenis_pasien === 'ibu_hamil').length,
      total_balita: patients.filter(p => p.jenis_pasien === 'balita').length,
      total_bayi: patients.filter(p => p.jenis_pasien === 'bayi').length,
      kunjungan_hari_ini: visits.filter(v => v.tanggal_kunjungan === today).length,
      kunjungan_bulan_ini: visits.filter(v => v.tanggal_kunjungan.startsWith(currentMonth)).length,
      imunisasi_bulan_ini: immunizations.filter(i => i.tanggal.startsWith(currentMonth)).length,
    };
  }

  // Initialize sample data
  static initSampleData(): void {
    if (this.getPatients().length === 0) {
      const samplePatients: Patient[] = [
        {
          id: '1',
          no_rm: 'IH250001',
          nama: 'Siti Aminah',
          nik: '3201234567890001',
          tempat_lahir: 'Jakarta',
          tanggal_lahir: '1995-03-15',
          jenis_kelamin: 'P',
          alamat: 'Jl. Mawar No. 123',
          rt: '001',
          rw: '002',
          desa: 'Sukamaju',
          kecamatan: 'Cibinong',
          no_telp: '081234567890',
          golongan_darah: 'O',
          nama_suami: 'Ahmad Fauzi',
          hpht: '2025-01-10',
          htp: '2025-10-17',
          kehamilan_ke: 2,
          jenis_pasien: 'ibu_hamil',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
        },
        {
          id: '2',
          no_rm: 'BL250001',
          nama: 'Budi Santoso',
          nik: '3201234567890002',
          tempat_lahir: 'Bogor',
          tanggal_lahir: '2023-06-20',
          jenis_kelamin: 'L',
          alamat: 'Jl. Melati No. 45',
          rt: '003',
          rw: '001',
          desa: 'Sukamaju',
          kecamatan: 'Cibinong',
          nama_ayah: 'Joko Santoso',
          nama_ibu: 'Dewi Lestari',
          berat_lahir: 3.2,
          panjang_lahir: 50,
          jenis_pasien: 'balita',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
        },
        {
          id: '3',
          no_rm: 'BY250001',
          nama: 'Anisa Putri',
          nik: '3201234567890003',
          tempat_lahir: 'Depok',
          tanggal_lahir: '2025-01-05',
          jenis_kelamin: 'P',
          alamat: 'Jl. Anggrek No. 78',
          rt: '002',
          rw: '003',
          desa: 'Sukamaju',
          kecamatan: 'Cibinong',
          nama_ayah: 'Rudi Hartono',
          nama_ibu: 'Maya Sari',
          berat_lahir: 2.8,
          panjang_lahir: 48,
          jenis_pasien: 'bayi',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
        },
      ];
      
      localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify(samplePatients));
    }
  }
}

export default DatabaseService;
