import React from 'react';

interface PatientDetailViewProps {
  patient: any; // You might want to define a more specific type for patient
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient }) => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-semibold">Detail Pasien: {patient.nama}</h3>
      <p>No. RM: {patient.no_rm}</p>
      <p>NIK: {patient.nik}</p>
      <p>Jenis Pasien: {patient.jenis_pasien}</p>
      <p>Alamat: {patient.alamat}</p>
      {/* Add more patient details here */}
      <p className="mt-4 text-sm text-gray-500">Ini adalah tampilan placeholder untuk detail pasien. Implementasi lengkap akan menyusul.</p>
    </div>
  );
};

export default PatientDetailView;