import { useState, useEffect } from 'react'
import { UserCheck, Activity, Heart, Thermometer, Weight, Ruler, Droplet, Wind, FileText, AlertCircle, CheckCircle, ArrowRight, X } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'
import Toast from '../../components/Toast'

export default function NurseQueue() {
    const [pendingQueue, setPendingQueue] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

    const [vitalSigns, setVitalSigns] = useState({
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        heart_rate: '',
        temperature: '',
        weight: '',
        height: '',
        blood_type: '',
        oxygen_saturation: '',
        notes: ''
    })

    useEffect(() => {
        fetchPendingQueue()
    }, [])

    const fetchPendingQueue = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('http://localhost:3000/api/nurses/queue/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setPendingQueue(data)
            }
        } catch (error) {
            console.error('Error fetching queue:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient)
        // Reset form
        setVitalSigns({
            blood_pressure_systolic: '',
            blood_pressure_diastolic: '',
            heart_rate: '',
            temperature: '',
            weight: '',
            height: '',
            blood_type: '',
            oxygen_saturation: '',
            notes: ''
        })
    }

    const handleDeleteQueue = async (queueId, e) => {
        e.stopPropagation()

        if (!confirm('Apakah Anda yakin ingin menolak antrian ini?')) return

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:3000/api/nurses/queue/${queueId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (res.ok) {
                setToast({ show: true, message: '✅ Antrian berhasil ditolak', type: 'success' })
                if (selectedPatient?.queue_id === queueId) {
                    setSelectedPatient(null)
                }
                fetchPendingQueue()
            } else {
                setToast({ show: true, message: '❌ Gagal menolak antrian', type: 'error' })
            }
        } catch (error) {
            console.error('Error deleting queue:', error)
            setToast({ show: true, message: '❌ Terjadi kesalahan', type: 'error' })
        }
    }

    const handleInputChange = (field, value) => {
        setVitalSigns(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedPatient) return

        setSubmitting(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('http://localhost:3000/api/nurses/vital-signs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    patient_id: selectedPatient.patient_id,
                    queue_id: selectedPatient.queue_id,
                    appointment_id: selectedPatient.appointment_id,
                    ...vitalSigns
                })
            })

            if (res.ok) {
                setToast({ show: true, message: '✅ Tanda vital berhasil dicatat!', type: 'success' })
                setSelectedPatient(null)
                fetchPendingQueue()
            } else {
                setToast({ show: true, message: '❌ Gagal menyimpan tanda vital', type: 'error' })
            }
        } catch (error) {
            console.error('Error submitting vital signs:', error)
            setToast({ show: true, message: '❌ Terjadi kesalahan', type: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {/* Header */}
            <ScrollReveal>
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <UserCheck className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Antrian Pemeriksaan</h1>
                            <p className="text-emerald-100 mt-1">Scan & periksa tanda vital pasien</p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Queue List */}
                <ScrollReveal>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-emerald-600" />
                            Antrian Menunggu ({pendingQueue.length})
                        </h2>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                            </div>
                        ) : pendingQueue.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium">Tidak ada antrian</p>
                                <p className="text-sm text-gray-500">Semua pasien sudah diperiksa</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {pendingQueue.map((patient) => (
                                    <div
                                        key={patient.queue_id}
                                        className={`relative p-4 rounded-xl border-2 transition-all ${selectedPatient?.queue_id === patient.queue_id
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <button
                                            onClick={() => handleSelectPatient(patient)}
                                            className="w-full text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {patient.queue_number}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-800">{patient.patient_name}</h3>
                                                    <p className="text-sm text-gray-600">Jam: {patient.appointment_time}</p>
                                                    {patient.phone && (
                                                        <p className="text-xs text-gray-500">📱 {patient.phone}</p>
                                                    )}
                                                </div>
                                                {selectedPatient?.queue_id === patient.queue_id && (
                                                    <ArrowRight className="w-5 h-5 text-emerald-600" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDeleteQueue(patient.queue_id, e)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                            title="Tolak Antrian"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollReveal>

                {/* Vital Signs Form */}
                <ScrollReveal delay={50}>
                    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-emerald-600" />
                            Input Tanda Vital
                        </h2>

                        {!selectedPatient ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium">Pilih pasien dari antrian</p>
                                <p className="text-sm text-gray-500">Klik pada pasien untuk memulai pemeriksaan</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Patient Info */}
                                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {selectedPatient.queue_number}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{selectedPatient.patient_name}</h3>
                                            <p className="text-sm text-gray-600">Antrian #{selectedPatient.queue_number}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Blood Pressure */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Heart className="w-4 h-4 text-red-500" />
                                        Tekanan Darah (mmHg)
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            placeholder="Sistol"
                                            value={vitalSigns.blood_pressure_systolic}
                                            onChange={(e) => handleInputChange('blood_pressure_systolic', e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Diastol"
                                            value={vitalSigns.blood_pressure_diastolic}
                                            onChange={(e) => handleInputChange('blood_pressure_diastolic', e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Heart Rate */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Activity className="w-4 h-4 text-pink-500" />
                                        Denyut Jantung (bpm)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Contoh: 75"
                                        value={vitalSigns.heart_rate}
                                        onChange={(e) => handleInputChange('heart_rate', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Temperature */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Thermometer className="w-4 h-4 text-orange-500" />
                                        Suhu Tubuh (°C)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Contoh: 36.5"
                                        value={vitalSigns.temperature}
                                        onChange={(e) => handleInputChange('temperature', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Weight & Height */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Weight className="w-4 h-4 text-blue-500" />
                                            Berat (kg)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="Contoh: 65"
                                            value={vitalSigns.weight}
                                            onChange={(e) => handleInputChange('weight', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Ruler className="w-4 h-4 text-purple-500" />
                                            Tinggi (cm)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="Contoh: 165"
                                            value={vitalSigns.height}
                                            onChange={(e) => handleInputChange('height', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Blood Type */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Droplet className="w-4 h-4 text-red-600" />
                                        Golongan Darah
                                    </label>
                                    <select
                                        value={vitalSigns.blood_type}
                                        onChange={(e) => handleInputChange('blood_type', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    >
                                        <option value="">Pilih golongan darah</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>

                                {/* Oxygen Saturation */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Wind className="w-4 h-4 text-cyan-500" />
                                        Saturasi Oksigen (%)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Contoh: 98"
                                        value={vitalSigns.oxygen_saturation}
                                        onChange={(e) => handleInputChange('oxygen_saturation', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        Catatan Tambahan
                                    </label>
                                    <textarea
                                        placeholder="Catatan pemeriksaan..."
                                        value={vitalSigns.notes}
                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Simpan & Kirim ke Dokter
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </ScrollReveal>
            </div>
        </div>
    )
}
