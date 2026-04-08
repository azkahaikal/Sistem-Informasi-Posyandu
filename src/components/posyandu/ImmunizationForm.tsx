import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Patient, Immunization } from '@/types';
import { IMMUNIZATION_TYPES } from '@/types';
import DatabaseService from '@/services/database';

interface ImmunizationFormProps {
  patient: Patient;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ImmunizationForm({ patient, onSuccess, onCancel }: ImmunizationFormProps) {
  if (!patient) return null;

  const [formData, setFormData] = useState<Partial<Immunization>>({
    patient_id: patient.id,
    tanggal: new Date().toISOString().split('T')[0],
    jenis_imunisasi: IMMUNIZATION_TYPES[0],
    batch: '',
    keterangan: '',
    petugas: localStorage.getItem('userName') || 'Petugas',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const immunization: Immunization = {
      ...formData as Immunization,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    DatabaseService.saveImmunization(immunization);
    onSuccess();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-400">Jenis Imunisasi</Label>
        <select 
          name="jenis_imunisasi" 
          value={formData.jenis_imunisasi} 
          onChange={handleChange} 
          required 
          className="w-full h-12 rounded-xl border border-green-100 bg-white px-3 font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {IMMUNIZATION_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-gray-400">Tanggal Pemberian</Label>
          <Input 
            type="date" 
            name="tanggal" 
            value={formData.tanggal} 
            onChange={handleChange} 
            required 
            className="rounded-xl border-green-100"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-gray-400">Nomor Batch</Label>
          <Input 
            name="batch" 
            value={formData.batch} 
            onChange={handleChange} 
            placeholder="Contoh: B12345"
            className="rounded-xl border-green-100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-400">Petugas Pemvaksin</Label>
        <Input 
          name="petugas" 
          value={formData.petugas} 
          onChange={handleChange} 
          required 
          className="rounded-xl border-green-100"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-400">Keterangan/Observasi</Label>
        <Textarea 
          name="keterangan" 
          value={formData.keterangan} 
          onChange={handleChange} 
          placeholder="Suhu tubuh, reaksi pasca imunisasi, dll."
          className="rounded-xl border-green-100 min-h-[100px]"
        />
      </div>

      <div className="pt-4 flex gap-3">
        <Button type="submit" className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold">Simpan Imunisasi</Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">Batal</Button>
      </div>
    </form>
  );
}
