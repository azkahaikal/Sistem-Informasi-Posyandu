import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Utensils, Filter, Check, Plus, Calendar, Download } from 'lucide-react';
import type { Patient, MealPlan } from '@/types';
import { NUTRIENT_RECOMMENDATIONS, MEAL_DATABASE } from '@/lib/nutrition';
import DatabaseService from '@/services/database';
import { toast } from 'sonner';

interface MealPlannerProps {
  patient: Patient;
}

export default function MealPlanner({ patient }: MealPlannerProps) {
  const [activeTab, setActiveTab] = useState<'recommend' | 'current'>('recommend');
  const [allergies, setAllergies] = useState<string[]>(patient.alergi_makanan || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    const existing = DatabaseService.getMealPlanByPatient(patient.id);
    if (existing) setGeneratedPlan(existing);
  }, [patient.id]);

  const addAllergy = () => {
    if (newAllergy && !allergies.includes(newAllergy)) {
      setAllergies([...allergies, newAllergy]);
      setNewAllergy('');
    }
  };

  const generatePlan = () => {
    let recommendations: any = NUTRIENT_RECOMMENDATIONS.TODDLER_12_23;
    let category: 'ibu_hamil' | 'ibu_menyusui' | 'balita' = 'balita';
    
    if (patient.jenis_pasien === 'ibu_hamil') {
      category = 'ibu_hamil';
      recommendations = patient.kehamilan_ke && patient.kehamilan_ke > 1 ? NUTRIENT_RECOMMENDATIONS.PREGNANT_T2 : NUTRIENT_RECOMMENDATIONS.PREGNANT_T1;
    } else if (patient.jenis_pasien === 'ibu_menyusui') {
      category = 'ibu_menyusui';
      recommendations = NUTRIENT_RECOMMENDATIONS.BREASTFEEDING;
    }

    const filteredMeals = MEAL_DATABASE.filter(meal => 
      !meal.ingredients.some(ing => allergies.some(al => ing.toLowerCase().includes(al.toLowerCase())))
    );

    const days: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu')[] = 
      ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    const menu = days.map(hari => ({
      hari,
      pagi: filteredMeals.filter(m => !m.tags.includes('snack'))[Math.floor(Math.random() * filteredMeals.length)]?.name || "Nasi Putih & Telur Rebus",
      snack_pagi: filteredMeals.filter(m => m.tags.includes('snack'))[Math.floor(Math.random() * filteredMeals.length)]?.name || "Buah Potong",
      siang: filteredMeals[Math.floor(Math.random() * filteredMeals.length)]?.name || "Sayur Bening & Ikan",
      snack_sore: "Susu / Jus Buah",
      malam: filteredMeals[Math.floor(Math.random() * filteredMeals.length)]?.name || "Nasi & Lauk Pauk"
    }));

    const newPlan: MealPlan = {
      id: Math.random().toString(36).substring(2, 9),
      patient_id: patient.id,
      jenis_rencana: category,
      tanggal_dibuat: new Date().toISOString(),
      alergi_dihindari: allergies,
      menu_mingguan: menu,
      target_nutrisi: recommendations
    };

    setGeneratedPlan(newPlan);
    DatabaseService.saveMealPlan(newPlan);
    toast.success("Meal plan cerdas berhasil dibuat!");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button 
          variant={activeTab === 'recommend' ? 'default' : 'outline'}
          onClick={() => setActiveTab('recommend')}
          className="rounded-xl"
        >
          <Utensils className="w-4 h-4 mr-2" /> Rekomendasi Baru
        </Button>
        <Button 
          variant={activeTab === 'current' ? 'default' : 'outline'}
          onClick={() => setActiveTab('current')}
          className="rounded-xl"
        >
          <Calendar className="w-4 h-4 mr-2" /> Meal Plan Saat Ini
        </Button>
      </div>

      {activeTab === 'recommend' ? (
        <Card className="border-none shadow-xl shadow-green-900/5 rounded-3xl overflow-hidden">
          <CardHeader className="bg-emerald-600 text-white">
            <CardTitle className="text-xl">Generate Meal Plan Cerdas</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase text-gray-400">Filter Alergi / Pantangan</Label>
              <div className="flex gap-2">
                <Input 
                  value={newAllergy} 
                  onChange={e => setNewAllergy(e.target.value)}
                  placeholder="Contoh: Udang, Kacang, Telur..."
                  className="rounded-xl"
                />
                <Button onClick={addAllergy} className="bg-emerald-600 rounded-xl"><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergies.map(al => (
                  <Badge key={al} variant="secondary" className="bg-rose-50 text-rose-600 border-rose-100 px-3 py-1">
                    {al} <button onClick={() => setAllergies(allergies.filter(a => a !== al))} className="ml-2">×</button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Filter className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900">Algoritma Personalisasi</h4>
                <p className="text-xs text-emerald-700 mt-1">Sistem akan menyesuaikan menu berdasarkan usia, status gizi, dan alergi yang Anda masukkan.</p>
              </div>
            </div>

            <Button onClick={generatePlan} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-lg font-black shadow-lg shadow-emerald-200">
              Buat Rencana Makan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {!generatedPlan ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Utensils className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Belum ada meal plan aktif. Silakan buat rekomendasi baru.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <NutrientCard label="Energi" value={`${generatedPlan.target_nutrisi.kalori} kkal`} color="text-orange-600" />
                <NutrientCard label="Protein" value={`${generatedPlan.target_nutrisi.protein} g`} color="text-emerald-600" />
                <NutrientCard label="Karbohidrat" value={`${generatedPlan.target_nutrisi.karbohidrat} g`} color="text-blue-600" />
                <NutrientCard label="Lemak" value={`${generatedPlan.target_nutrisi.lemak} g`} color="text-rose-600" />
              </div>

              <div className="space-y-4">
                {generatedPlan.menu_mingguan.map((day, idx) => (
                  <Card key={idx} className="border-none shadow-md shadow-green-900/5 rounded-2xl overflow-hidden">
                    <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex justify-between items-center">
                      <span className="font-black text-emerald-900">{day.hari}</span>
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <MenuSlot label="Pagi" value={day.pagi} />
                      <MenuSlot label="Snack" value={day.snack_pagi} />
                      <MenuSlot label="Siang" value={day.siang} />
                      <MenuSlot label="Sore" value={day.snack_sore} />
                      <MenuSlot label="Malam" value={day.malam} />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full h-12 rounded-xl border-emerald-200 text-emerald-700 font-bold">
                <Download className="w-4 h-4 mr-2" /> Unduh Menu Mingguan (PDF)
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function NutrientCard({ label, value, color }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{label}</p>
      <p className={`text-xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function MenuSlot({ label, value }: any) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-800">{value}</p>
    </div>
  );
}
