import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Patient, Visit } from '@/types';
import DatabaseService from '@/services/database';

interface VisitFormProps {
  patient: Patient;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VisitForm({ patient, onSuccess, onCancel }: VisitFormProps) {
  if (!patient) return null;
  
  const [formData, setFormData] = useState<Partial<Visit>>({
    patient_id: patient.id,
    tanggal_kunjungan: new Date().toISOString().split('T')[0],
    berat_badan: undefined,
    tinggi_badan: undefined,
    lingkar_lengan: undefined,
    lingkar_kepala: undefined,
    tekanan_darah_sistole: undefined,
    tekanan_darah_diastole: undefined,
    usia_kehamilan: undefined,
    tinggi_fundus: undefined,
    denyut_jantung_janin: undefined,
    keluhan: '',
    diagnosis: '',
    tindakan: '',
    petugas: localStorage.getItem('userName') || 'Petugas',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const visit: Visit = {
      ...formData as Visit,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    DatabaseService.saveVisit(visit);
    onSuccess();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-gray-400">Tanggal Kunjungan</Label>
          <Input 
            type="date" 
            name="tanggal_kunjungan" 
            value={formData.tanggal_kunjungan} 
            onChange={handleChange} 
            required 
            className="rounded-xl border-green-100"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-gray-400">Petugas</Label>
          <Input 
            name="petugas" 
            value={formData.petugas} 
            onChange={handleChange} 
            required 
            className="rounded-xl border-green-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-gray-400">Berat Badan (kg)</Label>
          <Input 
            type="number" 
            step="0.01"
            name="berat_badan" 
            value={formData.berat_badan || ''} 
            onChange={handleChange} 
            className="rounded-xl border-green-100"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-gray-400">Tinggi/Panjang Badan (cm)</Label>
          <Input 
            type="number" 
            step="0.1"
            name="tinggi_badan" 
            value={formData.tinggi_badan || ''} 
            onChange={handleChange} 
            className="rounded-xl border-green-100"
          />
        </div>
      </div>

      {patient.jenis_pasien === 'ibu_hamil' ? (
        <div className="space-y-4 border-t border-green-50 pt-4">
          <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest">Data Kehamilan</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400">Usia Kehamilan (Minggu)</Label>
              <Input 
                type="number" 
                name="usia_kehamilan" 
                value={formData.usia_kehamilan || ''} 
                onChange={handleChange} 
                className="rounded-xl border-green-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400">Tinggi Fundus (cm)</Label>
              <Input 
                type="number" 
                name="tinggi_fundus" 
                value={formData.tinggi_fundus || ''} 
                onChange={handleChange} 
                className="rounded-xl border-green-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400">DJJ (x/menit)</Label>
              <Input 
                type="number" 
                name="denyut_jantung_janin" 
                value={formData.denyut_jantung_janin || ''} 
                onChange={handleChange} 
                className="rounded-xl border-green-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400">LILA (cm)</Label>
              <Input 
                type="number" 
                step="0.1"
                name="lingkar_lengan" 
                value={formData.lingkar_lengan || ''} 
                onChange={handleChange} 
                className="rounded-xl border-green-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400">TD Sistole</Label>
              <Input 
                type="number" 
                name="tekanan_darah_sistole" 
                value={formData.tekanan_darah_sistole || ''} 
                onChange={handleChange} 
                className="rounded-xl border-green-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400">TD Diastole</Label>
              <Input 
                type="number" 
                name="tekanan_darah_diastole" 
                value={formData.tekanan_darah_diastole || ''} 
                onChange={handleChange} 
                className="rounded-xl border-green-100"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 border-t border-green-50 pt-4">
          <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest">Data Pertumbuhan</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400">Lingkar Kepala (cm)</Label>
              <Input 
                type="number" 
                step="0.1"
                name="lingkar_kepala" 
                value={formData.lingkar_kepala || ''} 
                onChange={handleChange} 
                className="rounded-xl border-green-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400">Lingkar Lengan (cm)</Label>
              <Input 
                type="number" 
                step="0.1"
                name="lingkar_lengan" 
                value={formData.lingkar_lengan || ''} 
                onChange={handleChange} 
                className="rounded-xl border-green-100"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 border-t border-green-50 pt-4">
        <Label className="text-[10px] font-black uppercase text-gray-400">Keluhan</Label>
        <Textarea 
          name="keluhan" 
          value={formData.keluhan} 
          onChange={handleChange} 
          className="rounded-xl border-green-100 min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-400">Diagnosis/Saran</Label>
        <Textarea 
          name="diagnosis" 
          value={formData.diagnosis} 
          onChange={handleChange} 
          className="rounded-xl border-green-100 min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-400">Tindakan</Label>
        <Textarea 
          name="tindakan" 
          value={formData.tindakan} 
          onChange={handleChange} 
          className="rounded-xl border-green-100 min-h-[80px]"
        />
      </div>

      <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
        <Button type="submit" className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold">Simpan Kunjungan</Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">Batal</Button>
      </div>
    </form>
  );
}
