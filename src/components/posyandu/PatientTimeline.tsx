import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Activity, Syringe, Pill, Stethoscope, Baby } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import DatabaseService from '@/services/database';
import { Badge } from '@/components/ui/badge';

interface PatientTimelineProps {
  patientId: string;
}

export default function PatientTimeline({ patientId }: PatientTimelineProps) {
  const visits = DatabaseService.getVisitsByPatient(patientId);
  const immunizations = DatabaseService.getImmunizationsByPatient(patientId);
  const growth = DatabaseService.getGrowthRecordsByPatient(patientId);
  const vitamins = DatabaseService.getVitaminDistributionsByPatient(patientId);

  const events = [
    ...visits.map(v => ({ type: 'visit', date: v.tanggal_kunjungan, data: v, icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-50' })),
    ...immunizations.map(i => ({ type: 'immunization', date: i.tanggal, data: i, icon: Syringe, color: 'text-emerald-600', bg: 'bg-emerald-50' })),
    ...growth.map(g => ({ type: 'growth', date: g.tanggal, data: g, icon: Baby, color: 'text-blue-600', bg: 'bg-blue-50' })),
    ...vitamins.map(v => ({ type: 'vitamin', date: v.tanggal, data: v, icon: Pill, color: 'text-amber-600', bg: 'bg-amber-50' })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">Belum ada riwayat medis tercatat.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-200 before:to-transparent">
      {events.map((event, idx) => (
        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon */}
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${event.bg} z-10`}>
             <event.icon className={`w-5 h-5 ${event.color}`} />
          </div>
          
          {/* Card */}
          <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] border-none shadow-lg shadow-green-900/5 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform">
            <div className={`h-1 ${event.bg.replace('50', '500')}`} />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <time className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                  {format(new Date(event.date), 'dd MMMM yyyy', { locale: id })}
                </time>
                <Badge variant="outline" className="text-[9px] uppercase font-black">{event.type}</Badge>
              </div>
              <h4 className="font-bold text-gray-900">
                {event.type === 'immunization' ? (event.data as any).jenis_imunisasi : 
                 event.type === 'growth' ? `Pengukuran BB: ${(event.data as any).berat_badan}kg` :
                 event.type === 'vitamin' ? `Pemberian ${(event.data as any).jenis_vitamin}` :
                 `Kunjungan Rutin`}
              </h4>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {(event.data as any).keluhan || (event.data as any).keterangan || (event.data as any).status_gizi || 'Pemeriksaan rutin berkala.'}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
