import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { GrowthRecord, Patient } from '@/types';

interface GrowthChartProps {
  records: GrowthRecord[];
  patient: Patient;
  type: 'weight' | 'height';
}

export default function GrowthChart({ records, patient, type }: GrowthChartProps) {
  const data = records
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
    .map(r => {
      const birthDate = new Date(patient.tanggal_lahir);
      const checkDate = new Date(r.tanggal);
      const ageInMonths = Math.floor(Math.abs(checkDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
      
      return {
        age: ageInMonths,
        value: type === 'weight' ? r.berat_badan : r.tinggi_badan,
        date: r.tanggal
      };
    });

  const unit = type === 'weight' ? 'kg' : 'cm';
  const color = type === 'weight' ? '#10b981' : '#3b82f6';

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="age" 
            label={{ value: 'Usia (Bulan)', position: 'insideBottomRight', offset: -5, fontSize: 10 }} 
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            label={{ value: unit, angle: -90, position: 'insideLeft', fontSize: 10 }} 
            tick={{ fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            labelFormatter={(value) => `Usia: ${value} Bulan`}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={3} 
            dot={{ r: 6, fill: color, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8 }}
            name={type === 'weight' ? 'Berat Badan' : 'Tinggi Badan'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
