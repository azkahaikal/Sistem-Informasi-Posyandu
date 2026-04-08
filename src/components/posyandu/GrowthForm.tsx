import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Patient, GrowthRecord } from '@/types';
import DatabaseService from '@/services/database';

interface GrowthFormProps {
  patient: Patient;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function GrowthForm({ patient, onSuccess, onCancel }: GrowthFormProps) {
  if (!patient) return null;

  const [formData, setFormData] = useState<Partial<GrowthRecord>>({
    patient_id: patient.id,
    tanggal: new Date().toISOString().split('T')[0],
    berat_badan: undefined,
    tinggi_badan: undefined,
    lingkar_kepala: undefined,
    status_gizi: 'baik',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: GrowthRecord = {
      ...formData as GrowthRecord,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    DatabaseService.saveGrowthRecord(record);
    onSuccess();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-400">Tanggal Pengukuran</Label>
        <Input 
          type="date" 
          name="tanggal" 
          value={formData.tanggal} 
          onChange={handleChange} 
          required 
          className="rounded-xl border-green-100"
        />
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
            required 
            placeholder="0.00"
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
            required 
            placeholder="0.0"
            className="rounded-xl border-green-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-gray-400">Lingkar Kepala (cm)</Label>
          <Input 
            type="number" 
            step="0.1"
            name="lingkar_kepala" 
            value={formData.lingkar_kepala || ''} 
            onChange={handleChange} 
            placeholder="0.0"
            className="rounded-xl border-green-100"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-gray-400">Status Gizi (Awal)</Label>
          <select 
            name="status_gizi" 
            value={formData.status_gizi} 
            onChange={handleChange} 
            className="w-full h-12 rounded-xl border border-green-100 bg-white px-3 font-bold text-emerald-900"
          >
            <option value="baik">Gizi Baik (Normal)</option>
            <option value="kurang">Gizi Kurang</option>
            <option value="buruk">Gizi Buruk</option>
            <option value="lebih">Gizi Lebih</option>
          </select>
        </div>
      </div>

      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
        <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
          Sistem akan secara otomatis memplot data ini ke dalam grafik pertumbuhan KMS (Kartu Menuju Sehat) untuk pemantauan lebih lanjut.
        </p>
      </div>

      <div className="pt-4 flex gap-3">
        <Button type="submit" className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold">Simpan Pengukuran</Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">Batal</Button>
      </div>
    </form>
  );
}
