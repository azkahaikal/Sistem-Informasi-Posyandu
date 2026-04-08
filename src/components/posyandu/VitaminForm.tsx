import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Patient, VitaminDistribution } from '@/types';
import { VITAMIN_TYPES } from '@/types';
import DatabaseService from '@/services/database';

interface VitaminFormProps {
  patient: Patient;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VitaminForm({ patient, onSuccess, onCancel }: VitaminFormProps) {
  if (!patient) return null;

  const [formData, setFormData] = useState<Partial<VitaminDistribution>>({
    patient_id: patient.id,
    tanggal: new Date().toISOString().split('T')[0],
    jenis_vitamin: VITAMIN_TYPES[0],
    jumlah: 1,
    petugas: localStorage.getItem('userName') || 'Petugas',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const distribution: VitaminDistribution = {
      ...formData as VitaminDistribution,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    DatabaseService.saveVitaminDistribution(distribution);
    onSuccess();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-400">Jenis Vitamin/Suplemen</Label>
        <select 
          name="jenis_vitamin" 
          value={formData.jenis_vitamin} 
          onChange={handleChange} 
          required 
          className="w-full h-12 rounded-xl border border-green-100 bg-white px-3 font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {VITAMIN_TYPES.map(type => (
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
          <Label className="text-[10px] font-black uppercase text-gray-400">Jumlah (Dosis)</Label>
          <Input 
            type="number" 
            name="jumlah" 
            value={formData.jumlah} 
            onChange={handleChange} 
            required 
            min={1}
            className="rounded-xl border-green-100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-400">Petugas Pemberi</Label>
        <Input 
          name="petugas" 
          value={formData.petugas} 
          onChange={handleChange} 
          required 
          className="rounded-xl border-green-100"
        />
      </div>

      <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
           <span className="text-xl">💡</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Catatan Penting</p>
          <p className="text-[10px] text-amber-700/80 font-bold leading-relaxed">
            Pastikan dosis sesuai dengan kelompok umur balita atau usia kehamilan ibu. Edukasi cara konsumsi yang benar kepada orang tua/pasien.
          </p>
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <Button type="submit" className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-lg shadow-emerald-200">Simpan Distribusi</Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">Batal</Button>
      </div>
    </form>
  );
}
