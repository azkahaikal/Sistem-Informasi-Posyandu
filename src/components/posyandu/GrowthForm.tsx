import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Patient, GrowthRecord } from '@/types';
import DatabaseService from '@/services/database';
import { calculateNutritionStatus } from '@/lib/nutrition';
import { Badge } from '@/components/ui/badge';

interface GrowthFormProps {
  patient: Patient;
  record?: GrowthRecord;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function GrowthForm({ patient, record, onSuccess, onCancel }: GrowthFormProps) {
  if (!patient) return null;

  const [formData, setFormData] = useState<Partial<GrowthRecord>>({
    patient_id: patient.id,
    tanggal: record?.tanggal || new Date().toISOString().split('T')[0],
    berat_badan: record?.berat_badan,
    tinggi_badan: record?.tinggi_badan,
    lingkar_kepala: record?.lingkar_kepala,
    status_gizi: record?.status_gizi || 'Normal',
  });

  const [calculatedStatus, setCalculatedStatus] = useState<any>(null);

  useEffect(() => {
    if (formData.berat_badan && formData.tinggi_badan && formData.tanggal) {
      const result = calculateNutritionStatus(patient, formData.berat_badan, formData.tinggi_badan, formData.tanggal);
      setCalculatedStatus(result);
      setFormData(prev => ({ ...prev, status_gizi: result.status }));
    }
  }, [formData.berat_badan, formData.tinggi_badan, formData.tanggal, patient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: GrowthRecord = {
      ...formData as GrowthRecord,
      id: record?.id || Math.random().toString(36).substring(2, 9),
      wfa_zscore: calculatedStatus?.wfaZ || record?.wfa_zscore,
      hfa_zscore: calculatedStatus?.hfaZ || record?.hfa_zscore,
      created_at: record?.created_at || new Date().toISOString(),
    };
    DatabaseService.saveGrowthRecord(newRecord);
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
          <Label className="text-[10px] font-black uppercase text-gray-400">Status Gizi (WHO)</Label>
          <div className="h-12 rounded-xl border border-green-100 bg-emerald-50/30 flex items-center px-3">
             {calculatedStatus ? (
               <Badge className={`border-none font-bold uppercase text-[9px] tracking-widest ${
                 calculatedStatus.primaryStatus === 'Gizi Baik' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
               }`}>
                 {calculatedStatus.status}
               </Badge>
             ) : (
               <span className="text-xs text-gray-400 font-medium italic">Menunggu input data...</span>
             )}
          </div>
        </div>
      </div>

      {calculatedStatus && (
        <div className="p-4 rounded-2xl border border-emerald-100 bg-white space-y-2 shadow-sm">
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span>Z-Score BB/U</span>
              <span className={calculatedStatus.wfaZ < -2 ? 'text-rose-500' : 'text-emerald-600'}>{calculatedStatus.wfaZ} SD</span>
           </div>
           <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${calculatedStatus.wfaZ < -2 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                style={{ width: `${Math.min(Math.max((calculatedStatus.wfaZ + 4) * 20, 0), 100)}%` }} 
              />
           </div>
        </div>
      )}

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
