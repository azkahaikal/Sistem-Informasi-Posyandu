import { useEffect, useState } from 'react';
import { Bell, Check, Calendar, Syringe, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import DatabaseService from '@/services/database';
import type { AppNotification } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const data = DatabaseService.getNotifications();
    // If empty, add mock reminders
    if (data.length === 0) {
      const mock: AppNotification[] = [
        { id: '1', patient_id: '2', pesan: 'Jadwal Imunisasi Polio 4 untuk Budi Santoso besok pagi.', tanggal: new Date().toISOString(), tipe: 'imunisasi', is_read: false },
        { id: '2', patient_id: '1', pesan: 'Pemeriksaan kehamilan rutin Siti Aminah (Trimester 2).', tanggal: new Date().toISOString(), tipe: 'pemeriksaan', is_read: false },
      ];
      mock.forEach(n => DatabaseService.saveNotification(n));
      setNotifications(mock);
    } else {
      setNotifications(data);
    }
  };

  const markRead = (id: string) => {
    DatabaseService.markNotificationAsRead(id);
    loadNotifications();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'imunisasi': return <Syringe className="w-4 h-4 text-blue-500" />;
      case 'pemeriksaan': return <Calendar className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <Card className="border-none shadow-2xl rounded-3xl overflow-hidden w-80 md:w-96">
      <CardHeader className="bg-emerald-600 text-white p-4">
        <CardTitle className="text-sm font-black flex items-center justify-between">
          <span>Notifikasi & Reminder</span>
          <Badge className="bg-white/20 text-white border-none">{notifications.filter(n => !n.is_read).length} Baru</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-xs">Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map(n => (
                <div key={n.id} className={`p-4 hover:bg-emerald-50/50 transition-colors ${!n.is_read ? 'bg-emerald-50/30' : ''}`}>
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(n.tipe)}</div>
                    <div className="flex-1 space-y-1">
                      <p className={`text-xs ${!n.is_read ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{n.pesan}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{format(new Date(n.tanggal), 'd MMM, HH:mm', { locale: id })}</span>
                        {!n.is_read && (
                          <button onClick={() => markRead(n.id)} className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Tandai Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t border-gray-50">
           <Button variant="ghost" className="w-full h-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bersihkan Semua</Button>
        </div>
      </CardContent>
    </Card>
  );
}
