import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Calendar, Megaphone } from 'lucide-react';
import { toast } from 'sonner';

export default function AnnouncementView() {
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'Jadwal Dokter Spesialis Anak', date: '2026-04-10', content: 'Dr. Budi Sp.A akan melayani pada hari Senin & Kamis pukul 09.00 - 12.00.' },
    { id: '2', title: 'Imunisasi Massal', date: '2026-04-15', content: 'Kegiatan imunisasi akan dilaksanakan di Balai Desa Sukamaju pada pukul 08.00.' }
  ]);
  const [newTitle, setNewTitle] = useState('');

  const addAnnouncement = () => {
    if (!newTitle) return;
    setAnnouncements([...announcements, { id: Math.random().toString(), title: newTitle, date: new Date().toISOString().split('T')[0], content: 'Detail pengumuman baru...' }]);
    setNewTitle('');
    toast.success('Pengumuman ditambahkan');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-emerald-950 uppercase tracking-widest">Pusat Pengumuman & Jadwal</h3>
        <div className="flex gap-2">
            <Input placeholder="Judul pengumuman..." value={newTitle} onChange={e => setNewTitle(e.target.value)} className="rounded-2xl h-12" />
            <Button onClick={addAnnouncement} className="bg-emerald-600 rounded-2xl"><Plus className="w-4 h-4 mr-2" /> Tambah</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {announcements.map(ann => (
          <Card key={ann.id} className="rounded-[2rem] p-8 border-emerald-50 bg-white shadow-lg">
            <CardHeader className="p-0 mb-6 flex flex-row justify-between items-center">
              <CardTitle className="text-lg font-black text-emerald-950 flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-emerald-600" /> {ann.title}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setAnnouncements(announcements.filter(a => a.id !== ann.id))} className="text-rose-500"><Trash2 className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
               <p className="text-sm text-gray-600 font-medium leading-relaxed">{ann.content}</p>
               <div className="flex items-center text-xs text-emerald-500 font-bold gap-2">
                  <Calendar className="w-4 h-4" /> {ann.date}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}