import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Baby, Syringe, Activity, 
  Pill, FileText, Plus, Search, Edit2, Trash2, 
  Eye, ChevronLeft, ChevronRight,
  Heart, User
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

type ViewType = 'dashboard' | 'patients' | 'visits' | 'immunizations' | 'growth' | 'vitamins';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Data Pasien', icon: Users },
    { id: 'visits', label: 'Kunjungan', icon: Activity },
    { id: 'immunizations', label: 'Imunisasi', icon: Syringe },
    { id: 'growth', label: 'Pertumbuhan', icon: Baby },
    { id: 'vitamins', label: 'Vitamin', icon: Pill },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView stats={stats} />;
      case 'patients':
        return <PatientsView onRefresh={refreshStats} />;
      case 'visits':
        return <VisitsView />;
      case 'immunizations':
        return <ImmunizationsView />;
      case 'growth':
        return <GrowthView />;
      case 'vitamins':
        return <VitaminsView />;
      default:
        return <DashboardView stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-gray-900 text-sm">Posyandu</h1>
                <p className="text-xs text-gray-500">Sistem Informasi</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                currentView === item.id 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {menuItems.find(m => m.id === currentView)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
              </span>
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </header>

        <ScrollArea className="h-[calc(100vh-73px)]">
          <div className="p-6">
            {renderContent()}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

// Dashboard View
function DashboardView({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Pasien" 
          value={stats.total_pasien} 
          icon={Users} 
          color="bg-blue-500"
          subtitle={`${stats.total_ibu_hamil} Ibu Hamil, ${stats.total_balita} Balita`}
        />
        <StatCard 
          title="Ibu Hamil" 
          value={stats.total_ibu_hamil} 
          icon={Heart} 
          color="bg-pink-500"
          subtitle="Pasien aktif"
        />
        <StatCard 
          title="Balita & Bayi" 
          value={stats.total_balita + stats.total_bayi} 
          icon={Baby} 
          color="bg-emerald-500"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Imunisasi Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600">{stats.imunisasi_bulan_ini}</p>
                <p className="text-sm text-gray-500 mt-1">Total imunisasi diberikan</p>
              </div>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Syringe className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Menu Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start gap-2">
                <Plus className="w-4 h-4" />
                Pasien Baru
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <Activity className="w-4 h-4" />
                Kunjungan
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <Syringe className="w-4 h-4" />
                Imunisasi
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <FileText className="w-4 h-4" />
                Laporan
              </Button>
            </div>
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          </div>
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Patients View
function PatientsView({ onRefresh }: { onRefresh: () => void }) {
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
    if (confirm('Apakah Anda yakin ingin menghapus data pasien ini?')) {
      DatabaseService.deletePatient(id);
      loadPatients();
      onRefresh();
    }
  };

  const getPatientTypeBadge = (type: string) => {
    switch (type) {
      case 'ibu_hamil': return <Badge className="bg-pink-100 text-pink-700">Ibu Hamil</Badge>;
      case 'balita': return <Badge className="bg-emerald-100 text-emerald-700">Balita</Badge>;
      case 'bayi': return <Badge className="bg-blue-100 text-blue-700">Bayi</Badge>;
      default: return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari pasien (nama, no. RM, NIK)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPatient(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pasien
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPatient ? 'Edit Pasien' : 'Tambah Pasien Baru'}</DialogTitle>
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
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. RM</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>No. Telp</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Tidak ada data pasien
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.no_rm}</TableCell>
                  <TableCell>{patient.nama}</TableCell>
                  <TableCell>{getPatientTypeBadge(patient.jenis_pasien)}</TableCell>
                  <TableCell className="max-w-xs truncate">{patient.alamat}</TableCell>
                  <TableCell>{patient.no_telp || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setViewingPatient(patient)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
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
                        onClick={() => handleDelete(patient.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Patient Dialog */}
      <Dialog open={!!viewingPatient} onOpenChange={() => setViewingPatient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pasien</DialogTitle>
          </DialogHeader>
          {viewingPatient && <PatientDetail patient={viewingPatient} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Patient Form Component
function PatientForm({ patient, onSave }: { patient: Patient | null; onSave: () => void }) {
  const [formData, setFormData] = useState<Partial<Patient>>({
    jenis_pasien: 'ibu_hamil',
    jenis_kelamin: 'P',
    ...patient,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient: Patient = {
      id: patient?.id || Date.now().toString(),
      no_rm: patient?.no_rm || DatabaseService.generateNoRM(formData.jenis_pasien as 'ibu_hamil' | 'balita' | 'bayi'),
      nama: formData.nama || '',
      nik: formData.nik,
      tempat_lahir: formData.tempat_lahir,
      tanggal_lahir: formData.tanggal_lahir || '',
      jenis_kelamin: formData.jenis_kelamin || 'P',
      alamat: formData.alamat || '',
      rt: formData.rt,
      rw: formData.rw,
      desa: formData.desa,
      kecamatan: formData.kecamatan,
      no_telp: formData.no_telp,
      golongan_darah: formData.golongan_darah,
      nama_suami: formData.nama_suami,
      hpht: formData.hpht,
      htp: formData.htp,
      kehamilan_ke: formData.kehamilan_ke,
      nama_ayah: formData.nama_ayah,
      nama_ibu: formData.nama_ibu,
      berat_lahir: formData.berat_lahir,
      panjang_lahir: formData.panjang_lahir,
      jenis_pasien: formData.jenis_pasien as 'ibu_hamil' | 'balita' | 'bayi',
      created_at: patient?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };

    DatabaseService.savePatient(newPatient);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue={formData.jenis_pasien} onValueChange={(v) => setFormData({ ...formData, jenis_pasien: v as any })}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ibu_hamil">Ibu Hamil</TabsTrigger>
          <TabsTrigger value="balita">Balita</TabsTrigger>
          <TabsTrigger value="bayi">Bayi</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nama Lengkap *</Label>
          <Input 
            value={formData.nama || ''} 
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>NIK</Label>
          <Input 
            value={formData.nik || ''} 
            onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
            maxLength={16}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tempat Lahir</Label>
          <Input 
            value={formData.tempat_lahir || ''} 
            onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Tanggal Lahir *</Label>
          <Input 
            type="date"
            value={formData.tanggal_lahir || ''} 
            onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Jenis Kelamin</Label>
          <Select 
            value={formData.jenis_kelamin} 
            onValueChange={(v) => setFormData({ ...formData, jenis_kelamin: v as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Golongan Darah</Label>
          <Select 
            value={formData.golongan_darah} 
            onValueChange={(v) => setFormData({ ...formData, golongan_darah: v as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="AB">AB</SelectItem>
              <SelectItem value="O">O</SelectItem>
              <SelectItem value="Tidak Tahu">Tidak Tahu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Alamat *</Label>
        <Textarea 
          value={formData.alamat || ''} 
          onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>RT</Label>
          <Input 
            value={formData.rt || ''} 
            onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>RW</Label>
          <Input 
            value={formData.rw || ''} 
            onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Desa</Label>
          <Input 
            value={formData.desa || ''} 
            onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Kecamatan</Label>
          <Input 
            value={formData.kecamatan || ''} 
            onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>No. Telepon</Label>
        <Input 
          value={formData.no_telp || ''} 
          onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
        />
      </div>

      {formData.jenis_pasien === 'ibu_hamil' && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-gray-900">Data Kehamilan</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Suami</Label>
              <Input 
                value={formData.nama_suami || ''} 
                onChange={(e) => setFormData({ ...formData, nama_suami: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Kehamilan Ke-</Label>
              <Input 
                type="number"
                value={formData.kehamilan_ke || ''} 
                onChange={(e) => setFormData({ ...formData, kehamilan_ke: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>HPHT (Hari Pertama Haid Terakhir)</Label>
              <Input 
                type="date"
                value={formData.hpht || ''} 
                onChange={(e) => setFormData({ ...formData, hpht: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>HTP (Hari Taksir Persalinan)</Label>
              <Input 
                type="date"
                value={formData.htp || ''} 
                onChange={(e) => setFormData({ ...formData, htp: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {(formData.jenis_pasien === 'balita' || formData.jenis_pasien === 'bayi') && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-gray-900">Data Orang Tua</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Ayah</Label>
              <Input 
                value={formData.nama_ayah || ''} 
                onChange={(e) => setFormData({ ...formData, nama_ayah: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nama Ibu</Label>
              <Input 
                value={formData.nama_ibu || ''} 
                onChange={(e) => setFormData({ ...formData, nama_ibu: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Berat Lahir (kg)</Label>
              <Input 
                type="number"
                step="0.1"
                value={formData.berat_lahir || ''} 
                onChange={(e) => setFormData({ ...formData, berat_lahir: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Panjang Lahir (cm)</Label>
              <Input 
                type="number"
                step="0.1"
                value={formData.panjang_lahir || ''} 
                onChange={(e) => setFormData({ ...formData, panjang_lahir: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSave}>Batal</Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}

// Patient Detail Component
function PatientDetail({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{patient.nama}</h3>
          <p className="text-gray-500">{patient.no_rm}</p>
          <Badge className="mt-2">
            {patient.jenis_pasien === 'ibu_hamil' ? 'Ibu Hamil' : patient.jenis_pasien === 'balita' ? 'Balita' : 'Bayi'}
          </Badge>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">NIK</p>
          <p className="font-medium">{patient.nik || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tanggal Lahir</p>
          <p className="font-medium">
            {patient.tempat_lahir ? `${patient.tempat_lahir}, ` : ''}
            {patient.tanggal_lahir ? format(new Date(patient.tanggal_lahir), 'dd MMMM yyyy', { locale: id }) : '-'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Jenis Kelamin</p>
          <p className="font-medium">{patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Golongan Darah</p>
          <p className="font-medium">{patient.golongan_darah || '-'}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500">Alamat</p>
        <p className="font-medium">{patient.alamat}</p>
        <p className="text-sm text-gray-400">
          RT {patient.rt || '-'}, RW {patient.rw || '-'}, {patient.desa || '-'}, {patient.kecamatan || '-'}
        </p>
      </div>

      {patient.no_telp && (
        <div>
          <p className="text-sm text-gray-500">No. Telepon</p>
          <p className="font-medium">{patient.no_telp}</p>
        </div>
      )}

      {patient.jenis_pasien === 'ibu_hamil' && (
        <div className="bg-pink-50 p-4 rounded-lg">
          <h4 className="font-medium text-pink-900 mb-2">Data Kehamilan</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-pink-700">Nama Suami</p>
              <p className="font-medium">{patient.nama_suami || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-pink-700">Kehamilan Ke-</p>
              <p className="font-medium">{patient.kehamilan_ke || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-pink-700">HPHT</p>
              <p className="font-medium">{patient.hpht || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-pink-700">HTP</p>
              <p className="font-medium">{patient.htp || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {(patient.jenis_pasien === 'balita' || patient.jenis_pasien === 'bayi') && (
        <div className="bg-emerald-50 p-4 rounded-lg">
          <h4 className="font-medium text-emerald-900 mb-2">Data Orang Tua</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-emerald-700">Nama Ayah</p>
              <p className="font-medium">{patient.nama_ayah || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Nama Ibu</p>
              <p className="font-medium">{patient.nama_ibu || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Berat Lahir</p>
              <p className="font-medium">{patient.berat_lahir ? `${patient.berat_lahir} kg` : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Panjang Lahir</p>
              <p className="font-medium">{patient.panjang_lahir ? `${patient.panjang_lahir} cm` : '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Visits View
function VisitsView() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVisits(DatabaseService.getVisits());
    setPatients(DatabaseService.getPatients());
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.nama || 'Unknown';
  };

  const filteredVisits = visits.filter(v => 
    getPatientName(v.patient_id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari kunjungan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kunjungan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Kunjungan Baru</DialogTitle>
            </DialogHeader>
            <VisitForm onSave={() => {
              setIsDialogOpen(false);
              loadData();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pasien</TableHead>
              <TableHead>Berat Badan</TableHead>
              <TableHead>Tinggi Badan</TableHead>
              <TableHead>Tekanan Darah</TableHead>
              <TableHead>Petugas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Tidak ada data kunjungan
                </TableCell>
              </TableRow>
            ) : (
              filteredVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>{format(new Date(visit.tanggal_kunjungan), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="font-medium">{getPatientName(visit.patient_id)}</TableCell>
                  <TableCell>{visit.berat_badan ? `${visit.berat_badan} kg` : '-'}</TableCell>
                  <TableCell>{visit.tinggi_badan ? `${visit.tinggi_badan} cm` : '-'}</TableCell>
                  <TableCell>
                    {visit.tekanan_darah_sistole && visit.tekanan_darah_diastole 
                      ? `${visit.tekanan_darah_sistole}/${visit.tekanan_darah_diastole}` 
                      : '-'}
                  </TableCell>
                  <TableCell>{visit.petugas}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// Visit Form Component
function VisitForm({ onSave }: { onSave: () => void }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState<Partial<Visit>>({
    tanggal_kunjungan: new Date().toISOString().split('T')[0],
    petugas: '',
  });

  useEffect(() => {
    setPatients(DatabaseService.getPatients());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVisit: Visit = {
      id: Date.now().toString(),
      patient_id: formData.patient_id || '',
      tanggal_kunjungan: formData.tanggal_kunjungan || '',
      berat_badan: formData.berat_badan,
      tinggi_badan: formData.tinggi_badan,
      lingkar_lengan: formData.lingkar_lengan,
      lingkar_kepala: formData.lingkar_kepala,
      tekanan_darah_sistole: formData.tekanan_darah_sistole,
      tekanan_darah_diastole: formData.tekanan_darah_diastole,
      usia_kehamilan: formData.usia_kehamilan,
      tinggi_fundus: formData.tinggi_fundus,
      denyut_jantung_janin: formData.denyut_jantung_janin,
      keluhan: formData.keluhan,
      diagnosis: formData.diagnosis,
      tindakan: formData.tindakan,
      petugas: formData.petugas || '',
      created_at: new Date().toISOString(),
    };

    DatabaseService.saveVisit(newVisit);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Pasien *</Label>
        <Select 
          value={formData.patient_id} 
          onValueChange={(v) => setFormData({ ...formData, patient_id: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih pasien" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.no_rm} - {patient.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tanggal Kunjungan *</Label>
        <Input 
          type="date"
          value={formData.tanggal_kunjungan} 
          onChange={(e) => setFormData({ ...formData, tanggal_kunjungan: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Berat Badan (kg)</Label>
          <Input 
            type="number"
            step="0.1"
            value={formData.berat_badan || ''} 
            onChange={(e) => setFormData({ ...formData, berat_badan: parseFloat(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Tinggi Badan (cm)</Label>
          <Input 
            type="number"
            step="0.1"
            value={formData.tinggi_badan || ''} 
            onChange={(e) => setFormData({ ...formData, tinggi_badan: parseFloat(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Lingkar Lengan (cm)</Label>
          <Input 
            type="number"
            step="0.1"
            value={formData.lingkar_lengan || ''} 
            onChange={(e) => setFormData({ ...formData, lingkar_lengan: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Lingkar Kepala (cm)</Label>
          <Input 
            type="number"
            step="0.1"
            value={formData.lingkar_kepala || ''} 
            onChange={(e) => setFormData({ ...formData, lingkar_kepala: parseFloat(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Tekanan Darah Sistol</Label>
          <Input 
            type="number"
            value={formData.tekanan_darah_sistole || ''} 
            onChange={(e) => setFormData({ ...formData, tekanan_darah_sistole: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Tekanan Darah Diastol</Label>
          <Input 
            type="number"
            value={formData.tekanan_darah_diastole || ''} 
            onChange={(e) => setFormData({ ...formData, tekanan_darah_diastole: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Usia Kehamilan (minggu)</Label>
          <Input 
            type="number"
            value={formData.usia_kehamilan || ''} 
            onChange={(e) => setFormData({ ...formData, usia_kehamilan: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Tinggi Fundus (cm)</Label>
          <Input 
            type="number"
            step="0.1"
            value={formData.tinggi_fundus || ''} 
            onChange={(e) => setFormData({ ...formData, tinggi_fundus: parseFloat(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Denyut Jantung Janin</Label>
          <Input 
            type="number"
            value={formData.denyut_jantung_janin || ''} 
            onChange={(e) => setFormData({ ...formData, denyut_jantung_janin: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Keluhan</Label>
        <Textarea 
          value={formData.keluhan || ''} 
          onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Diagnosis</Label>
        <Textarea 
          value={formData.diagnosis || ''} 
          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Tindakan</Label>
        <Textarea 
          value={formData.tindakan || ''} 
          onChange={(e) => setFormData({ ...formData, tindakan: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Petugas *</Label>
        <Input 
          value={formData.petugas} 
          onChange={(e) => setFormData({ ...formData, petugas: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSave}>Batal</Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}

// Immunizations View
function ImmunizationsView() {
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setImmunizations(DatabaseService.getImmunizations());
    setPatients(DatabaseService.getPatients());
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.nama || 'Unknown';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Imunisasi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Tambah Imunisasi</DialogTitle>
            </DialogHeader>
            <ImmunizationForm onSave={() => {
              setIsDialogOpen(false);
              loadData();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pasien</TableHead>
              <TableHead>Jenis Imunisasi</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Petugas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {immunizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Tidak ada data imunisasi
                </TableCell>
              </TableRow>
            ) : (
              immunizations.map((imm) => (
                <TableRow key={imm.id}>
                  <TableCell>{format(new Date(imm.tanggal), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="font-medium">{getPatientName(imm.patient_id)}</TableCell>
                  <TableCell>{imm.jenis_imunisasi}</TableCell>
                  <TableCell>{imm.batch || '-'}</TableCell>
                  <TableCell>{imm.petugas}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// Immunization Form Component
function ImmunizationForm({ onSave }: { onSave: () => void }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState<Partial<Immunization>>({
    tanggal: new Date().toISOString().split('T')[0],
    petugas: '',
  });

  useEffect(() => {
    setPatients(DatabaseService.getPatients().filter(p => p.jenis_pasien === 'balita' || p.jenis_pasien === 'bayi'));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newImmunization: Immunization = {
      id: Date.now().toString(),
      patient_id: formData.patient_id || '',
      jenis_imunisasi: formData.jenis_imunisasi || '',
      tanggal: formData.tanggal || '',
      batch: formData.batch,
      keterangan: formData.keterangan,
      petugas: formData.petugas || '',
      created_at: new Date().toISOString(),
    };

    DatabaseService.saveImmunization(newImmunization);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Pasien *</Label>
        <Select 
          value={formData.patient_id} 
          onValueChange={(v) => setFormData({ ...formData, patient_id: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih pasien" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.no_rm} - {patient.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Jenis Imunisasi *</Label>
        <Select 
          value={formData.jenis_imunisasi} 
          onValueChange={(v) => setFormData({ ...formData, jenis_imunisasi: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis imunisasi" />
          </SelectTrigger>
          <SelectContent>
            {IMMUNIZATION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tanggal *</Label>
        <Input 
          type="date"
          value={formData.tanggal} 
          onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>No. Batch</Label>
        <Input 
          value={formData.batch || ''} 
          onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Keterangan</Label>
        <Textarea 
          value={formData.keterangan || ''} 
          onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Petugas *</Label>
        <Input 
          value={formData.petugas} 
          onChange={(e) => setFormData({ ...formData, petugas: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSave}>Batal</Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}

// Growth View
function GrowthView() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [growthRecords, setGrowthRecords] = useState<any[]>([]);

  useEffect(() => {
    setPatients(DatabaseService.getPatients().filter(p => p.jenis_pasien === 'balita' || p.jenis_pasien === 'bayi'));
  }, []);

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient || null);
    if (patient) {
      setGrowthRecords(DatabaseService.getGrowthRecordsByPatient(patientId));
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return months;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label>Pilih Pasien</Label>
        <Select onValueChange={handlePatientSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih pasien balita/bayi" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.no_rm} - {patient.nama} ({calculateAge(patient.tanggal_lahir)} bulan)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {selectedPatient && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pertumbuhan - {selectedPatient.nama}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Berat Badan (kg)</TableHead>
                    <TableHead>Tinggi Badan (cm)</TableHead>
                    <TableHead>Lingkar Kepala (cm)</TableHead>
                    <TableHead>Status Gizi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {growthRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Belum ada data pertumbuhan
                      </TableCell>
                    </TableRow>
                  ) : (
                    growthRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.tanggal), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{record.berat_badan}</TableCell>
                        <TableCell>{record.tinggi_badan}</TableCell>
                        <TableCell>{record.lingkar_kepala || '-'}</TableCell>
                        <TableCell>
                          <Badge className={
                            record.status_gizi === 'baik' ? 'bg-emerald-100 text-emerald-700' :
                            record.status_gizi === 'kurang' ? 'bg-amber-100 text-amber-700' :
                            record.status_gizi === 'buruk' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {record.status_gizi || 'Tidak diketahui'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Vitamins View
function VitaminsView() {
  const [vitamins, setVitamins] = useState<any[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVitamins(DatabaseService.getVitaminDistributions());
    setPatients(DatabaseService.getPatients());
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.nama || 'Unknown';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Distribusi Vitamin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Distribusi Vitamin</DialogTitle>
            </DialogHeader>
            <VitaminForm onSave={() => {
              setIsDialogOpen(false);
              loadData();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pasien</TableHead>
              <TableHead>Jenis Vitamin</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Petugas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vitamins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Tidak ada data distribusi vitamin
                </TableCell>
              </TableRow>
            ) : (
              vitamins.map((vit) => (
                <TableRow key={vit.id}>
                  <TableCell>{format(new Date(vit.tanggal), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="font-medium">{getPatientName(vit.patient_id)}</TableCell>
                  <TableCell>{vit.jenis_vitamin}</TableCell>
                  <TableCell>{vit.jumlah}</TableCell>
                  <TableCell>{vit.petugas}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// Vitamin Form Component
function VitaminForm({ onSave }: { onSave: () => void }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState<Partial<any>>({
    tanggal: new Date().toISOString().split('T')[0],
    jumlah: 1,
    petugas: '',
  });

  useEffect(() => {
    setPatients(DatabaseService.getPatients());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVitamin: any = {
      id: Date.now().toString(),
      patient_id: formData.patient_id || '',
      jenis_vitamin: formData.jenis_vitamin || '',
      tanggal: formData.tanggal || '',
      jumlah: formData.jumlah || 1,
      petugas: formData.petugas || '',
      created_at: new Date().toISOString(),
    };

    DatabaseService.saveVitaminDistribution(newVitamin);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Pasien *</Label>
        <Select 
          value={formData.patient_id} 
          onValueChange={(v) => setFormData({ ...formData, patient_id: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih pasien" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.no_rm} - {patient.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Jenis Vitamin *</Label>
        <Select 
          value={formData.jenis_vitamin} 
          onValueChange={(v) => setFormData({ ...formData, jenis_vitamin: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis vitamin" />
          </SelectTrigger>
          <SelectContent>
            {VITAMIN_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tanggal *</Label>
        <Input 
          type="date"
          value={formData.tanggal} 
          onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Jumlah *</Label>
        <Input 
          type="number"
          min="1"
          value={formData.jumlah} 
          onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Petugas *</Label>
        <Input 
          value={formData.petugas} 
          onChange={(e) => setFormData({ ...formData, petugas: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSave}>Batal</Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}

export default App;
