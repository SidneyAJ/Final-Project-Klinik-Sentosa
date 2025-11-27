import { useState, useEffect } from 'react'
import { Users, Calendar, Activity, Eye } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'

export default function NursePatientList() {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedVital, setSelectedVital] = useState(null)

    useEffect(() => {
        fetchPatientHistory()
    }, [])

    const fetchPatientHistory = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('http://localhost:3000/api/nurses/patients/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setPatients(data)
            }
        } catch (error) {
            console.error('Error fetching patient history:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatVitalSigns = (vital) => {
        const parts = []
        if (vital.blood_pressure_systolic && vital.blood_pressure_diastolic) {
            parts.push(`BP: ${vital.blood_pressure_systolic}/${vital.blood_pressure_diastolic}`)
        }
        if (vital.heart_rate) parts.push(`HR: ${vital.heart_rate}`)
        if (vital.temperature) parts.push(`Temp: ${vital.temperature}°C`)
        if (vital.weight) parts.push(`${vital.weight}kg`)
        if (vital.oxygen_saturation) parts.push(`SpO2: ${vital.oxygen_saturation}%`)
        return parts.join(' • ')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <ScrollReveal>
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Users className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Riwayat Pemeriksaan</h1>
                            <p className="text-emerald-100 mt-1">Daftar pasien yang sudah diperiksa</p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <ScrollReveal delay={50}>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Total: {patients.length} pemeriksaan</h2>

                    {patients.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">Belum ada riwayat pemeriksaan</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {patients.map((patient) => (
                                <div key={patient.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {patient.patient_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800">{patient.patient_name}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(patient.recorded_at).toLocaleString('id-ID')}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">{formatVitalSigns(patient)}</p>
                                            {patient.blood_type && (
                                                <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                                                    Gol. Darah: {patient.blood_type}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setSelectedVital(patient)}
                                            className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-semibold flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Detail
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollReveal>

            {/* Detail Modal */}
            {selectedVital && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVital(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Detail Tanda Vital</h3>

                        <div className="space-y-4">
                            <div className="bg-emerald-50 p-4 rounded-xl">
                                <h4 className="font-bold text-gray-800 mb-2">{selectedVital.patient_name}</h4>
                                <p className="text-sm text-gray-600">
                                    {new Date(selectedVital.recorded_at).toLocaleString('id-ID')}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {selectedVital.blood_pressure_systolic && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Tekanan Darah</p>
                                        <p className="font-bold text-gray-800">
                                            {selectedVital.blood_pressure_systolic}/{selectedVital.blood_pressure_diastolic} mmHg
                                        </p>
                                    </div>
                                )}
                                {selectedVital.heart_rate && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Denyut Jantung</p>
                                        <p className="font-bold text-gray-800">{selectedVital.heart_rate} bpm</p>
                                    </div>
                                )}
                                {selectedVital.temperature && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Suhu Tubuh</p>
                                        <p className="font-bold text-gray-800">{selectedVital.temperature}°C</p>
                                    </div>
                                )}
                                {selectedVital.weight && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Berat Badan</p>
                                        <p className="font-bold text-gray-800">{selectedVital.weight} kg</p>
                                    </div>
                                )}
                                {selectedVital.height && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Tinggi Badan</p>
                                        <p className="font-bold text-gray-800">{selectedVital.height} cm</p>
                                    </div>
                                )}
                                {selectedVital.blood_type && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Golongan Darah</p>
                                        <p className="font-bold text-gray-800">{selectedVital.blood_type}</p>
                                    </div>
                                )}
                                {selectedVital.oxygen_saturation && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Saturasi Oksigen</p>
                                        <p className="font-bold text-gray-800">{selectedVital.oxygen_saturation}%</p>
                                    </div>
                                )}
                            </div>

                            {selectedVital.notes && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Catatan</p>
                                    <p className="text-gray-800">{selectedVital.notes}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedVital(null)}
                            className="w-full mt-6 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
