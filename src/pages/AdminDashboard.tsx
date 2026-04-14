import { useState, useEffect } from 'react';
import { 
  Users, Activity, 
  User, FileSpreadsheet,
  HeartPulse, Utensils, TrendingUp,
  Download, UserPlus, Trash2, FileText, Bell,
  Newspaper, BookOpen, Globe, ExternalLink, Search, Plus, Edit2, ChevronLeft,
  Heart, Map as MapIcon, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

import { Separator } from '@/components/ui/separator';
import DatabaseService from '@/services/database';
import type { Patient, DashboardStats, UserRole, GrowthRecord } from '@/types';
import { WHO_GLOBAL_AVERAGES } from '@/lib/nutrition';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { toast } from 'sonner';
import "@/health-theme.css";

// Feature Components
import GrowthForm from '@/components/posyandu/GrowthForm';
import MealPlanner from '@/components/posyandu/MealPlanner';

import SidebarNav from '@/components/posyandu/SidebarNav';
import AnnouncementView from '@/pages/AnnouncementView';
import PatientDetailView from '@/pages/PatientDetailView';
import UserManagementView from '@/pages/UserManagementView';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NotificationPanel from '@/components/posyandu/NotificationPanel';

type ViewType = 'dashboard' | 'patients' | 'growth' | 'meal-planner' | 'users' | 'reports' | 'announcements';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Auth & Roles
  const userRole = (localStorage.getItem("userRole") as UserRole) || "nakes";
  const userName = localStorage.getItem("userName") || "Petugas Kesehatan";
  const userPatientId = localStorage.getItem("userPatientId"); 

  const isParent = userRole === "orang_tua";

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  // Action States
  const [activeAction, setActiveAction] = useState<'none' | 'growth' | 'edit_growth'>('none');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    DatabaseService.initSampleData();
    refreshData();
    if (isParent) setCurrentView('dashboard');
  }, [userRole, isParent]);

  const refreshData = () => {
    setStats(DatabaseService.getDashboardStats());
    setPatients(DatabaseService.getPatients());
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Berhasil keluar sistem");
    navigate('/login');
  };

  const handleDeletePatient = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pasien ini?")) {
      DatabaseService.deletePatient(id);
      toast.success("Data pasien berhasil dihapus");
      refreshData();
    }
  };

  const handleDeleteGrowth = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pengukuran ini?")) {
      DatabaseService.deleteGrowthRecord(id);
      toast.success("Data pengukuran berhasil dihapus");
      refreshData();
    }
  };

  const renderContent = () => {
    if (isParent && currentView === 'patients') {
       const myData = patients.find(p => p.id === userPatientId) || patients[0];
       return myData ? <PatientDetailView patient={myData} /> : <div>Data tidak ditemukan</div>;
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView 
          stats={stats} 
          role={userRole} 
          onAddPatient={() => setIsAddingPatient(true)}
          onInputGrowth={() => { setSelectedPatient(patients[0]); setActiveAction('growth'); }}
          onMealPlan={() => setCurrentView('meal-planner')}
        />;
      case 'patients':
        return <PatientsView 
          role={userRole} 
          onRefresh={refreshData} 
          onAdd={() => setIsAddingPatient(true)} 
          onEdit={(p: Patient) => { setSelectedPatient(p); setIsEditingPatient(true); }}
          onDelete={(id: string) => handleDeletePatient(id)}
        />;
      case 'growth':
        return <GrowthMonitoringView 
          patients={patients}
          onInput={() => setActiveAction('growth')} 
          onEdit={(_: GrowthRecord) => { setActiveAction('edit_growth'); }}
          onDelete={handleDeleteGrowth}
        />;
      case 'announcements':
        return <AnnouncementView />;
      case 'meal-planner':
        return <MealPlannerMainView patients={patients} role={userRole} myPatientId={userPatientId} />;
      case 'users':
        return <UserManagementView />;
      case 'reports':
        return <ReportsView stats={stats} />;
      default:
        return <DashboardView stats={stats} role={userRole} onAddPatient={() => setIsAddingPatient(true)} onInputGrowth={() => {}} onMealPlan={() => setCurrentView('meal-planner')} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-emerald-950">
      <SidebarNav 
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={userRole}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-[#f0fdf4]/30 relative">
        {/* Unified Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-emerald-50 px-10 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-emerald-950">
              {currentView === 'dashboard' ? 'Beranda Utama' : 
               currentView === 'patients' ? 'Data Kesehatan KIA' :
               currentView === 'growth' ? 'Status Gizi WHO' :
               currentView === 'announcements' ? 'Pengumuman & Jadwal' :
               currentView === 'meal-planner' ? 'Rencana Makan' :
               currentView === 'users' ? 'Manajemen User' : 'Rekap Laporan'}
            </h2>
            <Badge variant="outline" className="hidden md:flex border-emerald-100 text-emerald-600 font-bold px-4 py-1 rounded-full text-xs">
              {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
            </Badge>
          </div>

          <div className="flex items-center gap-6">
             <Popover>
                <PopoverTrigger asChild>
                  <button className="relative p-3 text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all active:scale-90">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="p-0 border-none shadow-none bg-transparent">
                  <NotificationPanel />
                </PopoverContent>
             </Popover>

             <div className="h-10 w-px bg-emerald-100 hidden md:block" />

             <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setIsProfileOpen(true)}>
                <div className="text-right hidden lg:block">
                    <p className="text-sm font-black text-emerald-950 leading-none">{userName}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1 tracking-wider opacity-70">{userRole.replace('_', ' ')}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-100 group-hover:scale-105 transition-transform">
                    {userName.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="p-10 max-w-[1600px] mx-auto pb-32">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentView} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-md rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
           <div className="bg-emerald-600 p-12 text-white text-center relative">
              <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black border-4 border-white/30 backdrop-blur-md">
                 {userName.charAt(0)}
              </div>
              <h3 className="text-2xl font-black">{userName}</h3>
              <p className="text-emerald-100 font-bold uppercase text-[10px] tracking-widest mt-2">{userRole.replace('_', ' ')}</p>
           </div>
           <div className="p-10 space-y-6">
              <div className="space-y-4">
                 <ProfileItem label="Nama Lengkap" value={userName} icon={User} />
                 <ProfileItem label="Peran Sistem" value={userRole.replace('_', ' ').toUpperCase()} icon={ShieldCheck} />
                 <ProfileItem label="Tanggal Bergabung" value={format(new Date(), 'dd MMMM yyyy', { locale: id })} icon={Activity} />
              </div>
              <Separator className="bg-emerald-50" />
              <div className="flex gap-3">
                 <Button className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 h-12 font-bold" onClick={() => setIsProfileOpen(false)}>Kembali</Button>
                 <Button variant="outline" className="flex-1 rounded-2xl border-emerald-100 h-12 font-bold text-red-500 hover:bg-red-50" onClick={handleLogout}>Keluar</Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>

      {/* Growth Action Dialog */}
      <Dialog open={activeAction === 'growth'} onOpenChange={() => setActiveAction('none')}>
        <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
           <div className="bg-emerald-600 p-10 text-white relative">
              <TrendingUp className="absolute top-10 right-10 w-20 h-20 opacity-10" />
              <h3 className="text-2xl font-black">Input Pengukuran KIA</h3>
              <p className="text-emerald-100 text-sm font-bold tracking-widest uppercase mt-1">Sistem Pendukung Keputusan Gizi</p>
           </div>
           <div className="p-10">
              {selectedPatient && <GrowthForm patient={selectedPatient} onSuccess={() => { refreshData(); setActiveAction('none'); }} onCancel={() => setActiveAction('none')} />}
           </div>
        </DialogContent>
      </Dialog>

      <AddPatientDialog isOpen={isAddingPatient} onOpenChange={setIsAddingPatient} onRefresh={refreshData} />
      <AddPatientDialog isOpen={isEditingPatient} onOpenChange={setIsEditingPatient} onRefresh={refreshData} initialData={selectedPatient} isEdit />
    </div>
  );
}

// --- Dashboard Component ---

function DashboardView({ stats, role, onAddPatient, onInputGrowth, onMealPlan }: any) {
  if (!stats) return <div className="p-20 text-center text-emerald-300 animate-pulse font-black uppercase tracking-widest">Sinkronisasi Data...</div>;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Pasien" value={stats.total_pasien} icon={Users} color="bg-emerald-600" />
        <StatCard title="Ibu Hamil" value={stats.total_ibu_hamil} icon={HeartPulse} color="bg-rose-500" />
        <StatCard title="Balita & Bayi" value={stats.total_balita + stats.total_bayi} icon={Activity} color="bg-blue-500" />
        <StatCard title="Status Stunting" value={stats.stunting_count} icon={TrendingUp} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-none shadow-xl shadow-green-900/5 overflow-hidden rounded-[3rem] bg-white">
          <CardHeader className="p-8 border-b border-emerald-50">
            <div className="flex justify-between items-start">
               <div>
                  <CardTitle className="text-xl font-black flex items-center gap-3 text-emerald-950">
                    <Globe className="w-6 h-6 text-emerald-600" />
                    Monitoring Pertumbuhan Global
                  </CardTitle>
                  <CardDescription className="text-emerald-600/60 font-medium">Dataset WHO 2026 vs Rata-rata Pertumbuhan Lokal</CardDescription>
               </div>
               <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black px-4 py-1 uppercase text-[10px]">Statistik WHO</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-10">
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={WHO_GLOBAL_AVERAGES}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{fontSize: 12, fontWeight: 700}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fontSize: 12, fontWeight: 700}} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px' }}
                      />
                      <Legend verticalAlign="top" height={36}/>
                      <Line type="monotone" dataKey="weight" name="Standar Global WHO" stroke="#10b981" strokeWidth={5} dot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: '#10b981' }} />
                      <Line type="monotone" dataKey={() => 8.5} name="Rata-rata Lokal" stroke="#f43f5e" strokeWidth={3} strokeDasharray="8 8" />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-green-900/5 rounded-[3rem] bg-white flex flex-col">
           <CardHeader className="p-8 border-b border-emerald-50">
              <CardTitle className="text-xl font-black flex items-center gap-3 text-emerald-950">
                 <Newspaper className="w-6 h-6 text-blue-600" />
                 Berita Kesehatan
              </CardTitle>
           </CardHeader>
           <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-[480px] p-8">
                 <div className="space-y-8">
                    <NewsItem title="Pembaruan Protokol Imunisasi Nasional Tahun 2026" source="Kemenkes RI" time="2 Jam" category="Lokal" />
                    <NewsItem title="Laporan WHO: Tren Penurunan Angka Stunting Global" source="Reuters Health" time="5 Jam" category="Global" />
                    <NewsItem title="Strategi Optimalisasi Nutrisi pada 1000 Hari Pertama Kehidupan" source="IDAI" time="1 Hari" category="Edukasi" />
                    <NewsItem title="Inovasi Alat Pendeteksi Dini Anemia pada Ibu Hamil" source="Tech Health" time="2 Hari" category="Global" />
                 </div>
              </ScrollArea>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-black text-emerald-950 flex items-center gap-3">
               <BookOpen className="w-7 h-7 text-emerald-600" />
               Edukasi & Sosialisasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <EducationCard title="Nutrisi Ibu Menyusui" desc="Panduan asupan kalori dan mikronutrisi selama masa menyusui eksklusif." img="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80" />
               <EducationCard title="Mengenal Gejala Stunting" desc="Cara praktis memantau keterlambatan pertumbuhan fisik dan kognitif anak." img="https://images.unsplash.com/photo-1502086223501-7ea2443915b1?w=400&q=80" />
            </div>
         </div>

         <Card className="border-none shadow-xl shadow-green-900/5 rounded-[3rem] bg-white p-2">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black text-emerald-950">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
               {role !== 'orang_tua' && <QuickAction icon={UserPlus} label="Daftar Pasien Baru" color="text-blue-600" onClick={onAddPatient} />}
               {role !== 'orang_tua' && <QuickAction icon={TrendingUp} label="Input Data Ukur" color="text-emerald-600" onClick={onInputGrowth} />}
               <QuickAction icon={Utensils} label="Buat Rencana Makan" color="text-orange-600" onClick={onMealPlan} />
               {role === 'admin' && <QuickAction icon={Download} label="Ekspor Laporan" color="text-rose-600" onClick={() => toast.success("Menyiapkan dokumen...")} />}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

// --- CRUD & Sub-components ---

function PatientsView({ role, onRefresh, onAdd, onEdit, onDelete }: any) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => { setPatients(DatabaseService.getPatients()); }, [onRefresh]);

  const filtered = patients.filter(p => p.nama.toLowerCase().includes(search.toLowerCase()) || p.no_rm.toLowerCase().includes(search.toLowerCase()));

  if (selectedPatient) {
     return (
       <div className="space-y-10">
          <Button variant="ghost" onClick={() => setSelectedPatient(null)} className="font-black text-emerald-600 uppercase text-[10px] tracking-widest hover:bg-emerald-50 rounded-2xl px-6 py-2 transition-all"><ChevronLeft className="w-4 h-4 mr-2"/> Kembali ke Database</Button>
          <PatientDetailView patient={selectedPatient} />
       </div>
     );
  }

  return (
    <div className="space-y-10">
       <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full max-w-xl">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-200" />
             <Input placeholder="Cari berdasarkan nama atau No. RM..." className="pl-14 rounded-[2rem] h-16 border-emerald-50 bg-white shadow-xl shadow-emerald-900/5 text-lg font-bold text-emerald-950 focus-visible:ring-emerald-500 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {role !== 'orang_tua' && (
            <Button onClick={onAdd} className="h-16 px-10 bg-emerald-600 hover:bg-emerald-700 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-200 transition-all active:scale-95">
               <Plus className="w-5 h-5 mr-3" />
               Registrasi KIA Baru
            </Button>
          )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(p => (
             <Card key={p.id} className="border-none shadow-xl shadow-green-900/5 rounded-[3rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 bg-white group border border-transparent hover:border-emerald-100">
                <div className={`h-2.5 w-full ${p.jenis_pasien.includes('hamil') ? 'bg-rose-500' : 'bg-blue-500'}`} />
                <CardContent className="p-10">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center font-black text-emerald-600 text-xl group-hover:scale-110 transition-transform shadow-sm">
                         {p.nama.charAt(0)}
                      </div>
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-black uppercase text-[9px] tracking-widest px-4 py-1.5 rounded-full">{p.jenis_pasien.replace('_', ' ')}</Badge>
                   </div>
                   <h4 className="font-black text-emerald-950 text-xl mb-1 line-clamp-1">{p.nama}</h4>
                   <p className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase mb-6">{p.no_rm}</p>
                   
                   <div className="space-y-3 mb-10 text-gray-500 font-medium text-xs">
                      <div className="flex items-center gap-3"><MapIcon className="w-4 h-4 text-emerald-500 opacity-50" /> {p.alamat}</div>
                      <div className="flex items-center gap-3"><Heart className="w-4 h-4 text-rose-500 opacity-50" /> {p.riwayat_penyakit?.[0] || 'Riwayat Kesehatan Bersih'}</div>
                   </div>

                   <div className="flex gap-3">
                      <Button onClick={() => setSelectedPatient(p)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 border-none rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 transition-all active:scale-95">Buka Rekam Medis</Button>
                      {role !== 'orang_tua' && (
                        <div className="flex gap-2">
                           <Button variant="outline" className="rounded-2xl border-emerald-100 h-12 px-4 hover:bg-emerald-50 transition-colors" onClick={() => onEdit(p)}><Edit2 className="w-4 h-4 text-emerald-600" /></Button>
                           <Button variant="outline" className="rounded-2xl border-rose-100 h-12 px-4 hover:bg-rose-50 text-rose-500" onClick={() => onDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      )}
                   </div>
                </CardContent>
             </Card>
          ))}
       </div>
    </div>
  );
}

function GrowthMonitoringView({ patients, onInput, onEdit, onDelete, refreshData }: any) {
  const records = DatabaseService.getGrowthRecords();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [isInputOpen, setIsInputOpen] = useState(false);

  const handleInputOpen = () => {
    if (selectedPatientId) {
      setIsInputOpen(true);
    } else {
      toast.error("Silakan pilih pasien terlebih dahulu");
    }
  };

  return (
    <div className="space-y-10">
       <Card className="border-none shadow-2xl shadow-green-900/5 rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="p-10 border-b border-emerald-50 flex flex-col md:flex-row justify-between items-start md:items-center bg-white gap-6">
             <div>
                <CardTitle className="text-2xl font-black text-emerald-950">Pemantauan Gizi (DSS)</CardTitle>
                <CardDescription className="text-emerald-600 font-bold uppercase text-[10px] mt-1 tracking-widest">Sistem Pendukung Keputusan Berdasarkan Standar WHO</CardDescription>
             </div>
             <div className="flex gap-4 w-full md:w-auto">
                <select 
                  className="h-14 bg-emerald-50 border-none rounded-2xl px-6 font-bold text-emerald-950 outline-none flex-1 md:w-64"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                >
                  <option value="">Pilih Pasien...</option>
                  {patients.map((p: Patient) => (
                    <option key={p.id} value={p.id}>{p.nama} ({p.no_rm})</option>
                  ))}
                </select>
                <Button onClick={handleInputOpen} className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl px-8 h-14 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 active:scale-95 transition-all">
                   <Plus className="w-5 h-5 mr-3" />
                   Tambah Pengukuran
                </Button>
             </div>
          </CardHeader>
          <div className="overflow-x-auto">
             <table className="w-full">
                <thead className="bg-emerald-50/30 border-b border-emerald-50 text-left">
                   <tr>
                      <th className="p-8 text-[11px] font-black uppercase tracking-widest text-emerald-800">Identitas Pasien</th>
                      <th className="p-8 text-[11px] font-black uppercase tracking-widest text-emerald-800">Tgl. Ukur</th>
                      <th className="p-8 text-[11px] font-black uppercase tracking-widest text-emerald-800">BB / TB</th>
                      <th className="p-8 text-[11px] font-black uppercase tracking-widest text-emerald-800">Status Gizi (WHO)</th>
                      <th className="p-8 text-[11px] font-black uppercase tracking-widest text-emerald-800 text-center">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50/50">
                   {records.map(r => (
                      <tr key={r.id} className="hover:bg-emerald-50/10 transition-colors">
                         <td className="p-8">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm font-black text-emerald-600">
                                  {DatabaseService.getPatientById(r.patient_id)?.nama.charAt(0)}
                               </div>
                               <span className="font-bold text-emerald-950">{DatabaseService.getPatientById(r.patient_id)?.nama}</span>
                            </div>
                         </td>
                         <td className="p-8 text-sm font-bold text-gray-400">{format(new Date(r.tanggal), 'dd MMM yyyy', { locale: id })}</td>
                         <td className="p-8 text-sm font-black text-emerald-700">{r.berat_badan} kg / {r.tinggi_badan} cm</td>
                         <td className="p-8">
                            <Badge className={cn(
                               "border-none font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full shadow-sm",
                               r.status_gizi?.includes('Baik') || r.status_gizi?.includes('Normal') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
                            )}>
                               {r.status_gizi}
                            </Badge>
                         </td>
                         <td className="p-8">
                            <div className="flex justify-center gap-2">
                               <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-emerald-50 transition-colors" onClick={() => onEdit(r)}><Edit2 className="w-4 h-4 text-emerald-600" /></Button>
                               <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors" onClick={() => onDelete(r.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </Card>

       <Dialog open={isInputOpen} onOpenChange={setIsInputOpen}>
          <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
            <div className="bg-emerald-600 p-10 text-white relative">
                <TrendingUp className="absolute top-10 right-10 w-20 h-20 opacity-10" />
                <h3 className="text-2xl font-black">Input Pengukuran KIA</h3>
                <p className="text-emerald-100 text-sm font-bold tracking-widest uppercase mt-1">Sistem Pendukung Keputusan Gizi</p>
            </div>
            <div className="p-10">
                {selectedPatientId && (
                  <GrowthForm 
                    patient={DatabaseService.getPatientById(selectedPatientId)!} 
                    onSuccess={() => { onInput(); setIsInputOpen(false); refreshData(); }} 
                    onCancel={() => setIsInputOpen(false)} 
                  />
                )}
            </div>
          </DialogContent>
       </Dialog>
    </div>
  );
}

function AddPatientDialog({ isOpen, onOpenChange, onRefresh, initialData, isEdit }: any) {
  const [formData, setFormData] = useState({ 
    nama: '', nik: '', jenis_pasien: 'balita' as any, alamat: '' 
  });

  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        nama: initialData.nama || '',
        nik: initialData.nik || '',
        jenis_pasien: initialData.jenis_pasien || 'balita',
        alamat: initialData.alamat || ''
      });
    } else {
      setFormData({ nama: '', nik: '', jenis_pasien: 'balita', alamat: '' });
    }
  }, [initialData, isEdit, isOpen]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isEdit && initialData) {
      DatabaseService.savePatient({ ...initialData, ...formData, updated_at: new Date().toISOString() });
      toast.success("Data pasien berhasil diperbarui");
    } else {
      const newId = Math.random().toString(36).substring(2, 9);
      DatabaseService.savePatient({ 
        ...formData, id: newId, 
        no_rm: DatabaseService.generateNoRM(formData.jenis_pasien),
        is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() 
      } as any);
      toast.success("Pasien berhasil didaftarkan");
    }
    onRefresh();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-emerald-600 p-12 text-white relative">
           <UserPlus className="absolute top-10 right-10 w-20 h-20 opacity-10" />
           <h3 className="text-2xl font-black tracking-tight">{isEdit ? 'Ubah Informasi KIA' : 'Registrasi KIA Baru'}</h3>
           <p className="text-emerald-100 font-bold uppercase text-[10px] mt-1 tracking-widest opacity-70">Manajemen Database KIA Posyandu</p>
        </div>
        <form onSubmit={handleSubmit} className="p-12 space-y-6">
          <div className="grid grid-cols-1 gap-6">
             <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Nama Lengkap</Label><Input required className="h-14 rounded-2xl border-emerald-50 bg-emerald-50/30 font-bold px-6" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} /></div>
             <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">NIK (16 Digit)</Label><Input required maxLength={16} className="h-14 rounded-2xl border-emerald-50 bg-emerald-50/30 font-bold px-6" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} /></div>
             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Kategori Pasien</Label>
               <select className="w-full h-14 border border-emerald-50 bg-emerald-50/30 rounded-2xl px-6 font-bold text-emerald-950 appearance-none outline-none" value={formData.jenis_pasien} onChange={e => setFormData({...formData, jenis_pasien: e.target.value})}>
                 <option value="balita">Balita</option>
                 <option value="ibu_hamil">Ibu Hamil</option>
                 <option value="ibu_menyusui">Ibu Menyusui</option>
               </select>
             </div>
             <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Alamat Domisili</Label><Input required className="h-14 rounded-2xl border-emerald-50 bg-emerald-50/30 font-bold px-6" value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} /></div>
          </div>
          <div className="pt-8 flex gap-4">
             <Button type="submit" className="flex-1 h-16 bg-emerald-600 hover:bg-emerald-700 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95">{isEdit ? 'Simpan Perubahan' : 'Daftarkan Pasien'}</Button>
             <Button type="button" variant="ghost" className="h-16 px-10 rounded-[2rem] font-black uppercase text-xs tracking-widest" onClick={() => onOpenChange(false)}>Batal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Common UI Components ---

function ProfileItem({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/30 border border-emerald-50">
       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm"><Icon className="w-5 h-5" /></div>
       <div>
          <p className="text-[10px] font-black text-emerald-800/40 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="font-bold text-emerald-950">{value}</p>
       </div>
    </div>
  );
}

function NewsItem({ title, source, time, category }: any) {
   return (
      <div className="group cursor-pointer">
         <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="text-[10px] font-black uppercase px-3 py-0.5 border-emerald-100 text-emerald-600 rounded-full">{category}</Badge>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{time} Lalu</span>
         </div>
         <h4 className="text-base font-bold text-gray-800 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2">{title}</h4>
         <p className="text-[11px] text-gray-400 font-bold mt-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {source}
         </p>
      </div>
   );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-2xl shadow-emerald-900/5 rounded-[2.5rem] bg-white overflow-hidden group hover:-translate-y-1 transition-all duration-500">
      <CardContent className="p-8 flex items-center gap-8">
        <div className={cn("w-16 h-16 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:scale-110", color)}>
           <Icon className="w-8 h-8" />
        </div>
        <div>
           <p className="text-[11px] font-black text-emerald-600/40 uppercase tracking-[0.15em] mb-1">{title}</p>
           <p className="text-4xl font-black text-emerald-950 tracking-tighter leading-none">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({ icon: Icon, label, color, onClick }: any) {
  return (
    <Button variant="ghost" className="w-full justify-start h-16 rounded-3xl hover:bg-emerald-50 group border border-transparent hover:border-emerald-100 transition-all duration-300" onClick={onClick}>
       <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center mr-5 transition-all duration-500 group-hover:scale-110 shadow-sm border border-gray-50"><Icon className={cn("w-5 h-5", color)} /></div>
       <span className="font-black text-emerald-950 uppercase text-[10px] tracking-widest">{label}</span>
    </Button>
  );
}

function EducationCard({ title, desc, img }: any) {
   return (
      <Card className="rounded-[2.5rem] border-none shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white">
         <div className="h-48 overflow-hidden relative">
            <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors z-10" />
            <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
         </div>
         <CardContent className="p-8">
            <h4 className="text-lg font-black text-emerald-950 mb-3 leading-tight">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-6 font-medium">{desc}</p>
            <Button variant="ghost" className="w-full justify-between rounded-2xl hover:bg-emerald-50 text-emerald-600 font-black uppercase text-[10px] tracking-widest h-12">
               Baca Selengkapnya
               <ExternalLink className="w-4 h-4" />
            </Button>
         </CardContent>
      </Card>
   );
}

function MealPlannerMainView({ patients, role, myPatientId }: any) {
  const [selected, setSelected] = useState<Patient | null>(null);
  useEffect(() => {
    if (role === 'orang_tua' && myPatientId) {
      setSelected(patients.find((p: any) => p.id === myPatientId) || patients[0]);
    }
  }, [role, myPatientId, patients]);

  if (role === 'orang_tua' && selected) return <MealPlanner patient={selected} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <Card className="md:col-span-1 rounded-[3rem] shadow-2xl shadow-green-900/5 overflow-hidden border-none bg-white">
        <CardHeader className="p-8 border-b border-emerald-50 bg-white"><CardTitle className="text-xl font-black text-emerald-950">Pilih Pasien</CardTitle></CardHeader>
        <ScrollArea className="h-[600px] p-6">
          <div className="space-y-3">
            {patients.map((p: any) => (
              <button key={p.id} onClick={() => setSelected(p)} className={cn(
                "w-full p-6 rounded-[2rem] text-left transition-all duration-300 relative overflow-hidden group",
                selected?.id === p.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 scale-[1.02]' : 'bg-gray-50/50 hover:bg-white border border-transparent hover:border-emerald-50'
              )}>
                <div className="relative z-10">
                   <p className="font-black tracking-tight text-lg leading-none">{p.nama}</p>
                   <p className={cn("text-[10px] uppercase font-black tracking-widest mt-2", selected?.id === p.id ? 'text-emerald-100' : 'text-emerald-500')}>{p.no_rm}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>
      <div className="md:col-span-2">
        {selected ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <MealPlanner patient={selected} />
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-white rounded-[4rem] border-4 border-dashed border-emerald-50 text-emerald-100 p-20 text-center">
            <div className="w-32 h-32 bg-emerald-50 rounded-[3rem] flex items-center justify-center mb-8"><Utensils className="w-16 h-16 opacity-30" /></div>
            <h4 className="text-2xl font-black text-emerald-900/20 uppercase tracking-[0.2em]">Pilih Pasien</h4>
            <p className="text-sm font-bold text-emerald-600/30 mt-4 max-w-xs uppercase tracking-widest">Silakan pilih pasien dari daftar untuk membuat rencana makan personal.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportsView({ stats }: any) {
   return (
      <div className="space-y-10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ReportItem title="Statistik Pertumbuhan" type="PDF" icon={FileSpreadsheet} color="bg-emerald-50 text-emerald-600" />
            <ReportItem title="Distribusi Gizi" type="EXCEL" icon={FileText} color="bg-blue-50 text-blue-600" />
            <ReportItem title="Rekap Database KIA" type="PDF" icon={Download} color="bg-rose-50 text-rose-600" />
         </div>
         <Card className="rounded-[4rem] p-16 shadow-2xl shadow-green-900/5 bg-white border-none">
            <h3 className="text-3xl font-black text-emerald-950 mb-12 tracking-tight uppercase border-l-8 border-emerald-500 pl-8">Summary Laporan Global</h3>
            <div className="space-y-6">
               <SummaryRow label="Total Stunting Terdeteksi" value={`${stats?.stunting_count || 0} Anak`} />
               <SummaryRow label="Total Kunjungan Periode Ini" value={`${stats?.kunjungan_bulan_ini || 0} Kunjungan`} />
               <SummaryRow label="Efektivitas Program Gizi" value="92.4%" />
            </div>
         </Card>
      </div>
   );
}

function SummaryRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center p-8 bg-emerald-50/20 rounded-[2.5rem] border border-emerald-50/50 group hover:bg-white hover:shadow-xl transition-all duration-500">
       <span className="font-black text-emerald-900/40 uppercase text-xs tracking-widest">{label}</span>
       <span className="font-black text-emerald-950 text-2xl tracking-tighter">{value}</span>
    </div>
  );
}

function ReportItem({ title, type, icon: Icon, color }: any) {
  return (
    <Card className="rounded-[3rem] shadow-2xl shadow-green-900/5 hover:-translate-y-3 transition-all duration-500 cursor-pointer group bg-white border-none overflow-hidden" onClick={() => toast.success(`Mendownload ${title}...`)}>
       <div className="p-10 space-y-6">
          <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 shadow-lg", color)}><Icon className="w-8 h-8" /></div>
          <div>
             <p className="text-[10px] font-black text-emerald-600/40 uppercase tracking-[0.2em] mb-2">{type} EKSPOR</p>
             <h4 className="text-lg font-black text-emerald-950 leading-tight">{title}</h4>
          </div>
       </div>
    </Card>
  );
}


