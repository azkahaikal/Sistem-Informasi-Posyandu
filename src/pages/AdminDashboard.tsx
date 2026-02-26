import { useState, useEffect } from 'react';
import { 
  Users, Baby, Syringe, Activity, 
  Pill, FileText, Plus, Search, Trash2, Edit2,
  Eye, ChevronLeft, ChevronRight,
  Heart, User, LogOut, Settings, Stethoscope, ClipboardPlus, FileSpreadsheet,
  Bell, BellDot, HeartPulse, UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import DatabaseService from '@/services/database';
import type { Patient, DashboardStats } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "@/health-theme.css";

type ViewType = 'dashboard' | 'patients' | 'visits' | 'immunizations' | 'growth' | 'vitamins' | 'reports' | 'profile';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const userRole = localStorage.getItem("userRole") || "masyarakat";
  const userName = localStorage.getItem("userName") || "User";
  const isAdmin = userRole === "admin";

  const [stats, setStats] = useState<DashboardStats>({
    total_pasien: 0,
    total_ibu_hamil: 0,
    total_balita: 0,
    total_bayi: 0,
    kunjungan_hari_ini: 0,
    kunjungan_bulan_ini: 0,
    imunisasi_bulan_ini: 0,
  });

  useEffect(() => {
    DatabaseService.initSampleData();
    refreshStats();
  }, []);

  const refreshStats = () => {
    setStats(DatabaseService.getDashboardStats());
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'Data Pasien', icon: Users },
    { id: 'visits', label: 'Kunjungan', icon: Stethoscope },
    { id: 'immunizations', label: 'Imunisasi', icon: Syringe },
    { id: 'growth', label: 'Pertumbuhan', icon: Baby },
    { id: 'vitamins', label: 'Vitamin', icon: Pill },
    { id: 'reports', label: 'Laporan', icon: FileSpreadsheet },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView stats={stats} isAdmin={isAdmin} />;
      case 'patients':
        return <PatientsView onRefresh={refreshStats} isAdmin={isAdmin} />;
      case 'profile':
        return <ProfileView name={userName} role={userRole} />;
      default:
        return <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
          <Stethoscope className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">Modul {currentView} sedang dalam pengembangan</p>
        </div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-green-100 shadow-xl z-20 flex flex-col"
      >
        <div className="p-6 border-b border-green-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-bold text-emerald-900 text-base">Posyandu Kita</h1>
                <p className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase">{isAdmin ? "Admin Panel" : "Layanan Masyarakat"}</p>
              </motion.div>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 sidebar-item ${
                  currentView === item.id 
                    ? 'bg-emerald-50 text-emerald-700 active shadow-sm ring-1 ring-emerald-100' 
                    : 'text-gray-500 hover:bg-green-50/50 hover:text-emerald-600'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${currentView === item.id ? 'text-emerald-600' : ''}`} />
                {sidebarOpen && <span className="text-sm font-semibold">{item.label}</span>}
              </button>
            ))}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-green-50 px-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              {sidebarOpen && <span className="text-sm font-semibold">Keluar Sistem</span>}
            </button>
          </div>
        </ScrollArea>

        <div className="p-4 bg-emerald-50/50 border-t border-green-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex justify-center p-2 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-green-100 px-8 py-4 z-10 sticky top-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-emerald-900 font-serif">
                {menuItems.find(m => m.id === currentView)?.label || 'Profil'}
              </h2>
              <p className="text-xs text-emerald-600/70 font-medium">
                {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <button className="relative p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <Separator orientation="vertical" className="h-8 bg-green-100" />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-emerald-50 transition-all group">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-200 group-hover:scale-105 transition-transform">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-bold text-emerald-900">{userName}</p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">{userRole}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border-green-100 shadow-xl">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-green-50" />
                  <DropdownMenuItem onClick={() => setCurrentView('profile')} className="cursor-pointer">
                    <UserCircle className="w-4 h-4 mr-2 text-emerald-500" />
                    Profil Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2 text-emerald-500" />
                    Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-green-50" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-8 max-w-7xl mx-auto w-full pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

// --- Sub-components (View Logic) ---

function DashboardView({ stats, isAdmin }: { stats: DashboardStats, isAdmin: boolean }) {
  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pasien" 
          value={stats.total_pasien} 
          icon={Users} 
          color="bg-emerald-600"
          subtitle={`${stats.total_ibu_hamil} Ibu Hamil, ${stats.total_balita} Anak`}
        />
        <StatCard 
          title="Ibu Hamil" 
          value={stats.total_ibu_hamil} 
          icon={Heart} 
          color="bg-rose-500"
          subtitle="Pasien Aktif"
        />
        <StatCard 
          title="Balita & Bayi" 
          value={stats.total_balita + stats.total_bayi} 
          icon={Baby} 
          color="bg-blue-500"
          subtitle={`${stats.total_balita} Balita, ${stats.total_bayi} Bayi`}
        />
        <StatCard 
          title="Kunjungan" 
          value={stats.kunjungan_hari_ini} 
          icon={Stethoscope} 
          color="bg-amber-500"
          subtitle={`${stats.kunjungan_bulan_ini} Kunjungan Bulan Ini`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl shadow-green-900/5 overflow-hidden">
          <CardHeader className="bg-white border-b border-green-50">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
              <Activity className="w-5 h-5 text-emerald-600" />
              Aktivitas Imunisasi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-3xl border border-emerald-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                <Syringe className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <p className="text-5xl font-black text-emerald-700">{stats.imunisasi_bulan_ini}</p>
                <p className="text-sm font-bold text-emerald-600/70 mt-2 uppercase tracking-wide">Imunisasi Diberikan Bulan Ini</p>
                <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6">Lihat Laporan Lengkap</Button>
              </div>
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-900/5 hidden sm:flex">
                <Syringe className="w-12 h-12 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-green-900/5">
          <CardHeader className="bg-white border-b border-green-50">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
              <ClipboardPlus className="w-5 h-5 text-emerald-600" />
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-3">
              <QuickActionButton icon={Plus} label="Pasien Baru" disabled={!isAdmin} color="text-blue-600" />
              <QuickActionButton icon={Stethoscope} label="Catat Kunjungan" disabled={!isAdmin} color="text-rose-600" />
              <QuickActionButton icon={Syringe} label="Data Imunisasi" color="text-emerald-600" />
              <QuickActionButton icon={FileText} label="Unduh Laporan" color="text-amber-600" />
            </div>
            {!isAdmin && (
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                   Akses terbatas untuk akun masyarakat. Silakan hubungi admin posyandu untuk pendaftaran data baru.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, subtitle }: any) {
  return (
    <Card className="border-none shadow-xl shadow-green-900/5 overflow-hidden relative group transition-all hover:-translate-y-2 health-card">
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500 ${color}`} />
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-lg shadow-current/20 group-hover:rotate-12 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-black text-emerald-950 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-emerald-600/60 font-bold">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({ icon: Icon, label, disabled, color }: any) {
  return (
    <Button 
      variant="outline" 
      disabled={disabled}
      className={`justify-start h-14 rounded-2xl border-green-50 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all group w-full ${disabled && 'opacity-50'}`}
    >
      <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-3 group-hover:bg-white transition-colors`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <span className="font-bold text-gray-700">{label}</span>
    </Button>
  );
}

function ProfileView({ name, role }: { name: string, role: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(name);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-none shadow-2xl shadow-green-900/10 rounded-[2rem] overflow-hidden">
        <div className="h-40 bg-emerald-600 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 bg-white rounded-3xl p-1 shadow-2xl shadow-emerald-900/20">
              <div className="w-full h-full bg-emerald-100 rounded-[1.25rem] flex items-center justify-center border-2 border-emerald-50">
                <User className="w-16 h-16 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-8">
             <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 text-xs px-4 py-1 rounded-full uppercase tracking-widest font-black">
                {role}
             </Badge>
          </div>
        </div>
        
        <CardContent className="pt-20 pb-12 px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-black text-emerald-950 mb-1">{profileName}</h3>
                <p className="text-emerald-600 font-bold text-sm">Terdaftar sejak 2024</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nama Lengkap</Label>
                  <Input 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)}
                    disabled={!isEditing}
                    className="h-12 border-green-100 rounded-xl focus-visible:ring-emerald-500 bg-green-50/30 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email Terdaftar</Label>
                  <Input value="user@email.id" disabled className="h-12 bg-gray-50 border-gray-100 rounded-xl" />
                </div>
              </div>

              <div className="pt-4">
                {isEditing ? (
                  <div className="flex gap-4">
                    <Button onClick={() => setIsEditing(false)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 font-bold shadow-lg shadow-emerald-200">
                      Simpan Data
                    </Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl h-12 px-6">Batal</Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl h-12 font-bold">
                    <Edit2 className="w-4 h-4 mr-2" /> Perbarui Profil
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100">
              <h4 className="font-black text-emerald-900 mb-6 flex items-center gap-2">
                <BellDot className="w-5 h-5 text-emerald-500" />
                Notifikasi Terbaru
              </h4>
              <div className="space-y-4">
                <NotificationItem title="Jadwal Imunisasi" desc="Besok jam 08:00 di Posyandu Melati" type="urgent" />
                <NotificationItem title="Pesan Admin" desc="Data balita anda telah diperbarui" type="info" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationItem({ title, desc, type }: any) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-green-50 group hover:border-emerald-200 transition-colors">
      <div className={`w-2 h-12 rounded-full ${type === 'urgent' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
      <div>
        <h5 className="font-bold text-gray-900 text-sm">{title}</h5>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function PatientsView({ isAdmin }: { onRefresh: () => void, isAdmin: boolean }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    setPatients(DatabaseService.getPatients());
  };

  const filteredPatients = patients.filter(p => 
    p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.no_rm.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative flex-1 w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
          <Input
            placeholder="Cari nama pasien atau nomor RM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white border-green-100 rounded-2xl focus-visible:ring-emerald-500 shadow-lg shadow-emerald-900/5 text-emerald-950 font-medium"
          />
        </div>
        {isAdmin && (
          <Button className="w-full md:w-auto h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95">
            <Plus className="w-5 h-5 mr-2" />
            Tambah Pasien Baru
          </Button>
        )}
      </div>

      <Card className="border-none shadow-2xl shadow-green-900/5 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-emerald-50/50 border-b border-green-100 text-left">
                <th className="p-6 font-black text-emerald-900 text-xs uppercase tracking-widest">Pasien</th>
                <th className="p-6 font-black text-emerald-900 text-xs uppercase tracking-widest">Kategori</th>
                <th className="p-6 font-black text-emerald-900 text-xs uppercase tracking-widest">Alamat</th>
                <th className="p-6 font-black text-emerald-900 text-xs uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center font-black text-emerald-700">
                        {patient.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{patient.nama}</p>
                        <p className="text-[10px] font-mono text-emerald-600 font-bold">{patient.no_rm}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <Badge className={`bg-white border text-xs px-3 py-1 rounded-full ${
                      patient.jenis_pasien === 'ibu_hamil' ? 'border-rose-100 text-rose-600' : 'border-blue-100 text-blue-600'
                    }`}>
                      {patient.jenis_pasien === 'ibu_hamil' ? 'Ibu Hamil' : 'Anak/Balita'}
                    </Badge>
                  </td>
                  <td className="p-6 text-sm text-gray-500 font-medium max-w-xs truncate">{patient.alamat}</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" className="rounded-xl hover:bg-emerald-100 hover:text-emerald-700" onClick={() => setViewingPatient(patient)}>
                          <Eye className="w-4 h-4" />
                       </Button>
                       {isAdmin && (
                         <Button variant="ghost" size="icon" className="rounded-xl hover:bg-rose-100 hover:text-rose-700">
                            <Trash2 className="w-4 h-4" />
                         </Button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Patient Detail Dialog */}
      <Dialog open={!!viewingPatient} onOpenChange={() => setViewingPatient(null)}>
        <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
           <div className="bg-emerald-600 p-10 text-white relative">
             <HeartPulse className="absolute top-6 right-6 w-20 h-20 opacity-10" />
             <h3 className="text-3xl font-black mb-2">Detail Pasien</h3>
             <p className="text-emerald-100 font-bold text-sm tracking-widest uppercase">Informasi Kesehatan Terpusat</p>
           </div>
           <div className="p-10 space-y-8">
              {viewingPatient && (
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</Label>
                    <p className="text-lg font-bold text-emerald-950">{viewingPatient.nama}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No. RM</Label>
                    <p className="text-lg font-mono font-bold text-emerald-600">{viewingPatient.no_rm}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alamat</Label>
                    <p className="text-gray-700 font-medium">{viewingPatient.alamat}</p>
                  </div>
                </div>
              )}
              <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-black text-white" onClick={() => setViewingPatient(null)}>
                Tutup Detail
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
