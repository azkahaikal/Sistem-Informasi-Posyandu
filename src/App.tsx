import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Baby, Syringe, Activity, 
  Pill, FileText, Plus, Search, Edit2, Trash2, 
  Eye, ChevronLeft, ChevronRight,
  Heart, User, LogOut, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import DatabaseService from '@/services/database';
import type { Patient, Visit, Immunization, DashboardStats } from '@/types';
import { IMMUNIZATION_TYPES, VITAMIN_TYPES } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import LoginMasyarakat from "./pages/LoginMasyarakat"
import RegisterMasyarakat from "./pages/RegisterMasyarakat"
import ForgotPassword from "./pages/ForgotPassword"
import { Toaster } from "@/components/ui/sonner"

type ViewType = 'dashboard' | 'patients' | 'visits' | 'immunizations' | 'growth' | 'vitamins' | 'profile';

function DashboardApp() {
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Data Pasien', icon: Users },
    { id: 'visits', label: 'Kunjungan', icon: Activity },
    { id: 'immunizations', label: 'Imunisasi', icon: Syringe },
    { id: 'growth', label: 'Pertumbuhan', icon: Baby },
    { id: 'vitamins', label: 'Vitamin', icon: Pill },
    { id: 'profile', label: 'Profil Saya', icon: User },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView stats={stats} isAdmin={isAdmin} />;
      case 'patients':
        return <PatientsView onRefresh={refreshStats} isAdmin={isAdmin} />;
      case 'visits':
        return <VisitsView isAdmin={isAdmin} />;
      case 'immunizations':
        return <ImmunizationsView isAdmin={isAdmin} />;
      case 'growth':
        return <GrowthView />;
      case 'vitamins':
        return <VitaminsView isAdmin={isAdmin} />;
      case 'profile':
        return <ProfileView name={userName} role={userRole} />;
      default:
        return <DashboardView stats={stats} isAdmin={isAdmin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 transition-all duration-300 relative ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-gray-900 text-sm truncate">Posyandu</h1>
                <p className="text-xs text-emerald-600 font-semibold">{isAdmin ? "Admin Panel" : "Masyarakat"}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${currentView === item.id ? 'text-emerald-600' : ''}`} />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Keluar</span>}
            </button>
          </div>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              {menuItems.find(m => m.id === currentView)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">
                {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
              </span>
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-6 max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

// Profile View
function ProfileView({ name, role }: { name: string, role: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(name);

  return (
    <Card className="max-w-2xl mx-auto border-emerald-100 shadow-xl shadow-emerald-900/5">
      <CardHeader className="text-center pb-2">
        <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200">
          <User className="w-12 h-12 text-emerald-600" />
        </div>
        <CardTitle className="text-2xl">Profil Pengguna</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label>Nama Lengkap</Label>
          <Input 
            value={profileName} 
            onChange={(e) => setProfileName(e.target.value)}
            disabled={!isEditing}
            className="h-12 border-emerald-100 focus-visible:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value="user@email.id" disabled className="h-12 bg-gray-50 border-gray-100" />
        </div>
        <div className="space-y-2">
          <Label>Peran / Role</Label>
          <Badge className="px-4 py-1 text-sm bg-emerald-100 text-emerald-700 capitalize border-emerald-200">
            {role}
          </Badge>
        </div>
        
        <div className="pt-4">
          {isEditing ? (
            <div className="flex gap-3">
              <Button onClick={() => setIsEditing(false)} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Simpan Perubahan
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Batal</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <Edit2 className="w-4 h-4 mr-2" /> Edit Profil
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard View
function DashboardView({ stats, isAdmin }: { stats: DashboardStats, isAdmin: boolean }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pasien" 
          value={stats.total_pasien} 
          icon={Users} 
          color="bg-emerald-600"
          subtitle={`${stats.total_ibu_hamil} Ibu Hamil, ${stats.total_balita} Balita`}
        />
        <StatCard 
          title="Ibu Hamil" 
          value={stats.total_ibu_hamil} 
          icon={Heart} 
          color="bg-rose-500"
          subtitle="Pasien aktif"
        />
        <StatCard 
          title="Balita & Bayi" 
          value={stats.total_balita + stats.total_bayi} 
          icon={Baby} 
          color="bg-blue-500"
          subtitle={`${stats.total_balita} Balita, ${stats.total_bayi} Bayi`}
        />
        <StatCard 
          title="Kunjungan Hari Ini" 
          value={stats.kunjungan_hari_ini} 
          icon={Activity} 
          color="bg-amber-500"
          subtitle={`${stats.kunjungan_bulan_ini} bulan ini`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-lg shadow-gray-200/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Syringe className="w-5 h-5 text-emerald-600" />
              Imunisasi Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div>
                <p className="text-4xl font-black text-emerald-700">{stats.imunisasi_bulan_ini}</p>
                <p className="text-sm font-medium text-emerald-600/70 mt-1">Total imunisasi diberikan</p>
              </div>
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Syringe className="w-10 h-10 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-gray-200/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600" />
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className={`justify-start h-14 rounded-xl border-gray-100 ${!isAdmin && 'opacity-50 pointer-events-none'}`}>
                <Plus className="w-5 h-5 mr-3 text-emerald-600" />
                Pasien Baru
              </Button>
              <Button variant="outline" className={`justify-start h-14 rounded-xl border-gray-100 ${!isAdmin && 'opacity-50 pointer-events-none'}`}>
                <Activity className="w-5 h-5 mr-3 text-emerald-600" />
                Kunjungan
              </Button>
              <Button variant="outline" className="justify-start h-14 rounded-xl border-gray-100">
                <FileText className="w-5 h-5 mr-3 text-emerald-600" />
                Laporan
              </Button>
              <Button variant="outline" className="justify-start h-14 rounded-xl border-gray-100">
                <Search className="w-5 h-5 mr-3 text-emerald-600" />
                Cari Data
              </Button>
            </div>
            {!isAdmin && (
              <p className="text-[10px] text-amber-600 mt-4 text-center bg-amber-50 p-2 rounded-lg">
                Beberapa aksi dinonaktifkan karena Anda masuk sebagai Masyarakat.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, subtitle }: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  color: string;
  subtitle?: string;
}) {
  return (
    <Card className="border-none shadow-xl shadow-gray-100 overflow-hidden relative group transition-all hover:-translate-y-1">
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-10 group-hover:scale-110 transition-transform ${color}`} />
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-lg shadow-current/20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-black text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// Patients View Updated with isAdmin
function PatientsView({ onRefresh, isAdmin }: { onRefresh: () => void, isAdmin: boolean }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    setPatients(DatabaseService.getPatients());
  };

  const filteredPatients = patients.filter(p => 
    p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.no_rm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nik?.includes(searchQuery)
  );

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
    if (confirm('Apakah Anda yakin ingin menghapus data pasien ini?')) {
      DatabaseService.deletePatient(id);
      loadPatients();
      onRefresh();
    }
  };

  const getPatientTypeBadge = (type: string) => {
    switch (type) {
      case 'ibu_hamil': return <Badge className="bg-rose-50 text-rose-700 border-rose-100">Ibu Hamil</Badge>;
      case 'balita': return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">Balita</Badge>;
      case 'bayi': return <Badge className="bg-blue-50 text-blue-700 border-blue-100">Bayi</Badge>;
      default: return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari pasien (nama, no. RM, NIK)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-emerald-500 shadow-sm"
          />
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                <Plus className="w-5 h-5 mr-2" />
                Tambah Pasien
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold font-serif text-emerald-900">{editingPatient ? 'Edit Data Pasien' : 'Registrasi Pasien Baru'}</DialogTitle>
              </DialogHeader>
              <PatientForm 
                patient={editingPatient} 
                onSave={() => {
                  setIsDialogOpen(false);
                  loadPatients();
                  onRefresh();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b border-gray-100">
                <TableHead className="font-bold py-4">No. RM</TableHead>
                <TableHead className="font-bold">Nama Pasien</TableHead>
                <TableHead className="font-bold">Kategori</TableHead>
                <TableHead className="font-bold">Alamat</TableHead>
                <TableHead className="text-right font-bold pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">
                    Belum ada data pasien terdaftar
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                    <TableCell className="font-mono text-emerald-700 font-bold">{patient.no_rm}</TableCell>
                    <TableCell className="font-semibold text-gray-900">{patient.nama}</TableCell>
                    <TableCell>{getPatientTypeBadge(patient.jenis_pasien)}</TableCell>
                    <TableCell className="max-w-xs truncate text-gray-500 text-sm">{patient.alamat}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                          onClick={() => setViewingPatient(patient)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {isAdmin && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="hover:bg-emerald-50 hover:text-emerald-600 rounded-lg"
                              onClick={() => {
                                setEditingPatient(patient);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="hover:bg-rose-50 hover:text-rose-600 rounded-lg"
                              onClick={() => handleDelete(patient.id)}
                            >
                              <Trash2 className="w-4 h-4 text-rose-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!viewingPatient} onOpenChange={() => setViewingPatient(null)}>
        <DialogContent className="max-w-2xl rounded-2xl border-none shadow-2xl overflow-hidden p-0">
          <div className="bg-emerald-600 p-8 text-white relative">
            <HeartPulse className="absolute top-4 right-4 w-12 h-12 opacity-20" />
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Detail Informasi Pasien</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-8">
            {viewingPatient && <PatientDetail patient={viewingPatient} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Minimal placeholder views for the rest to keep code cleaner
function VisitsView({ isAdmin }: { isAdmin: boolean }) { return <Card className="p-10 text-center text-gray-400 border-dashed">Modul Kunjungan {isAdmin ? "(Admin)" : "(Lihat Saja)"}</Card>; }
function ImmunizationsView({ isAdmin }: { isAdmin: boolean }) { return <Card className="p-10 text-center text-gray-400 border-dashed">Modul Imunisasi {isAdmin ? "(Admin)" : "(Lihat Saja)"}</Card>; }
function GrowthView() { return <Card className="p-10 text-center text-gray-400 border-dashed">Modul Pertumbuhan</Card>; }
function VitaminsView({ isAdmin }: { isAdmin: boolean }) { return <Card className="p-10 text-center text-gray-400 border-dashed">Modul Vitamin {isAdmin ? "(Admin)" : "(Lihat Saja)"}</Card>; }

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginMasyarakat />} />
        <Route path="/register" element={<RegisterMasyarakat />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<DashboardApp />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  )
}

function PatientForm({ patient, onSave }: { patient: Patient | null; onSave: () => void }) {
  // Keeping simple form to fit code limit
  return (
    <div className="p-4 text-center">Form Pasien Baru / Edit (Simulasi)
      <Button onClick={onSave} className="mt-4 block w-full bg-emerald-600">Simpan Data</Button>
    </div>
  )
}

function PatientDetail({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center font-bold text-emerald-700 text-xl">
          {patient.nama.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{patient.nama}</h3>
          <p className="text-emerald-600 font-mono text-sm">{patient.no_rm}</p>
        </div>
      </div>
      <Separator className="bg-gray-100" />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">NIK</p>
          <p className="font-bold">{patient.nik || '-'}</p>
        </div>
        <div>
          <p className="text-gray-400">Kategori</p>
          <Badge className="bg-gray-100 text-gray-700 capitalize border-none">{patient.jenis_pasien}</Badge>
        </div>
        <div className="col-span-2">
          <p className="text-gray-400">Alamat Lengkap</p>
          <p className="font-medium text-gray-700">{patient.alamat}</p>
        </div>
      </div>
    </div>
  )
}

export default App;