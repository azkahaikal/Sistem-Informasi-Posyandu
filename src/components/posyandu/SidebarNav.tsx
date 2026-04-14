import { useMemo } from 'react';
import { 
  Users, Activity, 
  ChevronLeft, ChevronRight,
  LogOut, HeartPulse, Utensils, TrendingUp, 
  ShieldCheck, FileText, MessageSquare, User
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from '@/components/ui/scroll-area';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userRole: UserRole;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export default function SidebarNav({ 
  currentView, 
  setCurrentView, 
  sidebarOpen, 
  setSidebarOpen, 
  userRole, 
  onLogout,
  onOpenProfile
}: SidebarNavProps) {
  
  const isAdmin = userRole === "admin";
  const isParent = userRole === "orang_tua";

  const menuItems = useMemo(() => {
    const items = [
      { id: 'dashboard', label: 'Beranda Utama', icon: Activity, show: true, color: 'text-blue-500' },
      { id: 'patients', label: isParent ? 'Data Saya' : 'Manajemen KIA', icon: Users, show: true, color: 'text-emerald-500' },
      { id: 'growth', label: 'Status Gizi (DSS)', icon: TrendingUp, show: !isParent, color: 'text-amber-500' },
      { id: 'announcements', label: 'Pengumuman & Jadwal', icon: MessageSquare, show: isAdmin, color: 'text-rose-500' },
      { id: 'meal-planner', label: 'Rencana Makan', icon: Utensils, show: true, color: 'text-orange-500' },
      { id: 'users', label: 'Pengaturan User', icon: ShieldCheck, show: isAdmin, color: 'text-indigo-500' },
      { id: 'reports', label: 'Rekap Laporan', icon: FileText, show: isAdmin, color: 'text-cyan-500' },
    ];
    return items.filter(i => i.show);
  }, [isAdmin, isParent]);

  return (
    <motion.aside 
      animate={{ width: sidebarOpen ? 300 : 110 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="h-screen sticky top-0 bg-white border-r border-emerald-50 shadow-[20px_0_40px_rgba(0,0,0,0.02)] z-30 flex flex-col group"
    >
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-emerald-100 to-transparent" />

      {/* Logo Area */}
      <div className="p-8 flex items-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-xl shadow-emerald-100 cursor-pointer"
        >
          <HeartPulse className="w-8 h-8 text-white" />
        </motion.div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="font-black text-emerald-950 text-xl leading-tight">Posyandu</h1>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em]">Digital Indonesia</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-2 py-6">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-4 rounded-[1.5rem] transition-all duration-500 group/item relative overflow-hidden",
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                    : 'text-gray-400 hover:bg-emerald-50/50 hover:text-emerald-600'
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-100"
                  />
                )}

                <div className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 z-10",
                  isActive ? 'bg-white/20 shadow-inner' : 'bg-gray-50'
                )}>
                  <item.icon className={cn("w-5 h-5 transition-transform duration-500 group-hover/item:scale-110", isActive ? 'text-white' : item.color)} />
                </div>
                
                {sidebarOpen && (
                  <span className={cn(
                    "text-[13px] font-bold tracking-tight transition-colors z-10",
                    isActive ? 'text-white' : 'text-gray-600 group-hover/item:text-emerald-700'
                  )}>
                    {item.label}
                  </span>
                )}

                {!sidebarOpen && (
                  <div className="absolute left-full ml-4 px-4 py-2 bg-emerald-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover/item:opacity-100 pointer-events-none transition-all translate-x-4 group-hover/item:translate-x-0 z-50 whitespace-nowrap shadow-2xl">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-6 mt-auto space-y-3">
        <div className="bg-emerald-50/50 rounded-[2.5rem] p-2 space-y-1">
          <button 
            onClick={onOpenProfile}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white hover:shadow-sm text-emerald-700 transition-all w-full group/prof"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 group-hover/prof:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            {sidebarOpen && <span className="text-[11px] font-black uppercase tracking-wider">Profil Saya</span>}
          </button>

          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="flex items-center justify-center p-3 rounded-2xl hover:bg-white hover:shadow-sm text-gray-400 transition-all w-full"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
            {sidebarOpen && <span className="text-[11px] font-black uppercase tracking-wider ml-2">Sembunyikan</span>}
          </button>
        </div>

        <button 
          onClick={onLogout} 
          className="w-full flex items-center gap-4 px-4 py-5 rounded-[2rem] text-rose-500 hover:bg-rose-50 transition-all group/logout"
        >
          <div className="w-11 h-11 bg-rose-100 rounded-2xl flex items-center justify-center shrink-0 group-hover/logout:bg-rose-500 group-hover/logout:text-white transition-all duration-500">
            <LogOut className="w-5 h-5" />
          </div>
          {sidebarOpen && (
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-widest leading-none">Keluar</p>
              <p className="text-[9px] font-bold text-rose-400 mt-1 uppercase">Sesi Berakhir</p>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
