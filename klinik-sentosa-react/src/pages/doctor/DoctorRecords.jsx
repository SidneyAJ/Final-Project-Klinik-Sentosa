import { useState, useEffect } from 'react'
import { FileText, User, Calendar, Search, Eye, Filter, TrendingUp, Activity, Plus, Edit2, X, Save, Trash2, Pill } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'
import CreateMedicalRecord from './CreateMedicalRecord'
import Toast from '../../components/Toast'

export default function DoctorRecords() {
    const [records, setRecords] = useState([])
    const [filteredRecords, setFilteredRecords] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        patientId: '',
        dateFrom: '',
        dateTo: '',
        diagnosis: ''
    })
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
    const [editFormData, setEditFormData] = useState({
        symptoms: '',
        diagnosis: '',
        treatment: '',
        notes: ''
    })
    const [editMedications, setEditMedications] = useState([])
    const [medicines, setMedicines] = useState([])
    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', duration: '' })
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchRecords()
        fetchMedicines()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [records, searchQuery, filters])

    const fetchMedicines = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/medicines', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setMedicines(data)
            }
        } catch (error) {
            console.error('Failed to fetch medicines:', error)
        }
    }

    const fetchRecords = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/doctors/medical-records', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setRecords(data)
            }
        } catch (error) {
            console.error('Failed to fetch records:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchRecordDetail = async (recordId) => {
        try {
            const res = await fetch(`http://localhost:3000/api/doctors/medical-records/${recordId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setSelectedRecord(data)
            }
        } catch (error) {
            console.error('Failed to fetch record detail:', error)
        }
    }

    const applyFilters = () => {
        let filtered = records

        if (searchQuery) {
            filtered = filtered.filter(r =>
                r.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredRecords(filtered)
    }

    const formatDate = (date) => {
        if (!date) return '-'
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDateOnly = (date) => {
        if (!date) return '-'
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const handleEdit = () => {
        if (!selectedRecord) return
        setEditFormData({
            symptoms: selectedRecord.symptoms || '',
            diagnosis: selectedRecord.diagnosis || '',
            treatment: selectedRecord.treatment || '',
            notes: selectedRecord.notes || ''
        })
        setIsEditing(true)
    }

    const handleManagePrescription = () => {
        if (!selectedRecord) return
        setEditMedications(selectedRecord.prescriptions || [])
        setShowPrescriptionModal(true)
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditFormData({ symptoms: '', diagnosis: '', treatment: '', notes: '' })
    }

    const handleClosePrescriptionModal = () => {
        setShowPrescriptionModal(false)
        setEditMedications([])
        setNewMed({ name: '', dosage: '', frequency: '', duration: '' })
    }

    const handleAddMedication = () => {
        if (newMed.name && newMed.dosage) {
            setEditMedications([...editMedications, { ...newMed }])
            setNewMed({ name: '', dosage: '', frequency: '', duration: '' })
        }
    }

    const handleRemoveMedication = (index) => {
        setEditMedications(editMedications.filter((_, i) => i !== index))
    }

    const handleSaveEdit = async () => {
        try {
            // Update medical record
            const mrRes = await fetch(`http://localhost:3000/api/medical-records/${selectedRecord.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    symptoms: editFormData.symptoms,
                    diagnosis: editFormData.diagnosis,
                    treatment: editFormData.treatment,
                    notes: editFormData.notes
                })
            })

            if (!mrRes.ok) throw new Error('Failed to update medical record')

            setToast({ show: true, message: 'Rekam medis berhasil diperbarui!', type: 'success' })
            setIsEditing(false)
            setSelectedRecord(null)
            fetchRecords()

        } catch (error) {
            console.error('Failed to update medical record:', error)
            setToast({ show: true, message: 'Gagal memperbarui rekam medis', type: 'error' })
        }
    }

    const handleSavePrescription = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/prescriptions/${selectedRecord.id}/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appointment_id: selectedRecord.appointment_id,
                    medications: editMedications
                })
            })

            if (!res.ok) throw new Error('Failed to update prescription')

            setToast({ show: true, message: 'Resep obat berhasil diperbarui!', type: 'success' })
            setShowPrescriptionModal(false)
            setSelectedRecord(null)
            fetchRecords()
        } catch (error) {
            console.error('Failed to update prescription:', error)
            setToast({ show: true, message: 'Gagal memperbarui resep', type: 'error' })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
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
            <ScrollReveal direction="up">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Rekam Medis</h1>
                            <p className="text-gray-600">Lihat dan kelola rekam medis pasien</p>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Buat Rekam Medis Baru
                        </button>
                    </div>
                </div>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal direction="up" delay={50}>
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                    <div className="text-3xl font-bold text-gray-800">{records.length}</div>
                    <div className="text-sm text-gray-600">Total Rekam Medis</div>
                </div>
            </ScrollReveal>

            {/* Search */}
            <ScrollReveal direction="up" delay={100}>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama pasien atau diagnosis..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>
            </ScrollReveal>

            {/* Records List */}
            <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada rekam medis</h3>
                        <p className="text-gray-600">Rekam medis akan muncul di sini setelah Anda membuatnya</p>
                    </div>
                ) : (
                    filteredRecords.map((record, idx) => (
                        <ScrollReveal key={record.id} direction="up" delay={idx * 30}>
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-800">{record.diagnosis}</h3>
                                            <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {record.patient_name}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(record.created_at)}
                                                </span>
                                                {record.appointment_date && (
                                                    <span className="text-xs text-gray-500">
                                                        Appointment: {formatDate(record.appointment_date)}
                                                    </span>
                                                )}
                                            </div>
                                            {record.treatment && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    <strong>Pengobatan:</strong> {record.treatment}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => fetchRecordDetail(record.id)}
                                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all font-medium flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Lihat Detail
                                    </button>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))
                )}
            </div>

            {/* Record Detail Modal */}
            {selectedRecord && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedRecord.diagnosis}</h2>
                                    <p className="text-gray-600">{selectedRecord.patient_name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isEditing ? (
                                        <>
                                            <button
                                                onClick={handleManagePrescription}
                                                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all font-medium flex items-center gap-2"
                                            >
                                                <Pill className="w-4 h-4" />
                                                Kelola Resep
                                            </button>
                                            <button
                                                onClick={handleEdit}
                                                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all font-medium flex items-center gap-2"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Medis
                                            </button>
                                            <button
                                                onClick={() => { setSelectedRecord(null); setIsEditing(false) }}
                                                className="text-gray-400 hover:text-gray-600 text-2xl"
                                            >
                                                ×
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleSaveEdit}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                Simpan
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium flex items-center gap-2"
                                            >
                                                <X className="w-4 h-4" />
                                                Batal
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Patient Info */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-3">Informasi Pasien</h3>
                                <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-600">Nama:</span>
                                        <span className="font-semibold text-gray-800 ml-2">{selectedRecord.patient_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">NIK:</span>
                                        <span className="font-semibold text-gray-800 ml-2">{selectedRecord.nik}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Telepon:</span>
                                        <span className="font-semibold text-gray-800 ml-2">{selectedRecord.phone}</span>
                                    </div>
                                    {selectedRecord.date_of_birth && (
                                        <div>
                                            <span className="text-gray-600">Tanggal Lahir:</span>
                                            <span className="font-semibold text-gray-800 ml-2">
                                                {formatDateOnly(selectedRecord.date_of_birth)}
                                            </span>
                                        </div>
                                    )}
                                    {selectedRecord.gender && (
                                        <div>
                                            <span className="text-gray-600">Jenis Kelamin:</span>
                                            <span className="font-semibold text-gray-800 ml-2">
                                                {selectedRecord.gender === 'M' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-gray-600">Tanggal Pemeriksaan:</span>
                                        <span className="font-semibold text-gray-800 ml-2">
                                            {formatDate(selectedRecord.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Vital Signs */}
                            {(selectedRecord.blood_pressure_systolic || selectedRecord.weight) && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-emerald-600" />
                                        Tanda Vital
                                    </h3>
                                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {selectedRecord.blood_pressure_systolic && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Tekanan Darah</p>
                                                    <p className="font-bold text-gray-800">
                                                        {selectedRecord.blood_pressure_systolic}/{selectedRecord.blood_pressure_diastolic} <span className="text-xs font-normal text-gray-500">mmHg</span>
                                                    </p>
                                                </div>
                                            )}
                                            {selectedRecord.heart_rate && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Denyut Jantung</p>
                                                    <p className="font-bold text-gray-800">
                                                        {selectedRecord.heart_rate} <span className="text-xs font-normal text-gray-500">bpm</span>
                                                    </p>
                                                </div>
                                            )}
                                            {selectedRecord.temperature && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Suhu Tubuh</p>
                                                    <p className="font-bold text-gray-800">
                                                        {selectedRecord.temperature} <span className="text-xs font-normal text-gray-500">°C</span>
                                                    </p>
                                                </div>
                                            )}
                                            {selectedRecord.weight && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Berat Badan</p>
                                                    <p className="font-bold text-gray-800">
                                                        {selectedRecord.weight} <span className="text-xs font-normal text-gray-500">kg</span>
                                                    </p>
                                                </div>
                                            )}
                                            {selectedRecord.height && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Tinggi Badan</p>
                                                    <p className="font-bold text-gray-800">
                                                        {selectedRecord.height} <span className="text-xs font-normal text-gray-500">cm</span>
                                                    </p>
                                                </div>
                                            )}
                                            {selectedRecord.oxygen_saturation && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Saturasi Oksigen</p>
                                                    <p className="font-bold text-gray-800">
                                                        {selectedRecord.oxygen_saturation} <span className="text-xs font-normal text-gray-500">%</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {selectedRecord.vital_notes && (
                                            <div className="mt-3 pt-3 border-t border-emerald-200">
                                                <p className="text-xs text-emerald-700 font-bold mb-1">Catatan Perawat:</p>
                                                <p className="text-sm text-gray-700">{selectedRecord.vital_notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!isEditing ? (
                                <>
                                    {/* VIEW MODE */}
                                    {/* Diagnosis */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-3">Diagnosis</h3>
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                            <p className="text-gray-800 font-semibold">{selectedRecord.diagnosis}</p>
                                        </div>
                                    </div>

                                    {/* Symptoms */}
                                    {selectedRecord.symptoms && (
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-3">Gejala</h3>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-700">{selectedRecord.symptoms}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Treatment */}
                                    {selectedRecord.treatment && (
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-3">Pengobatan</h3>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-700">{selectedRecord.treatment}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {selectedRecord.notes && (
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-3">Catatan Dokter</h3>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-700">{selectedRecord.notes}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Prescriptions */}
                                    {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-3">Resep Obat</h3>
                                            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                                <ol className="list-decimal list-inside space-y-2">
                                                    {selectedRecord.prescriptions.map((med, idx) => (
                                                        <li key={idx} className="text-gray-800">
                                                            <strong>{med.name}</strong> - {med.dosage}
                                                            {med.frequency && <span className="text-gray-600"> - {med.frequency}</span>}
                                                            {med.duration && <span className="text-gray-600"> selama {med.duration}</span>}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* EDIT MODE */}
                                    {/* Diagnosis */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Diagnosis *</label>
                                        <input
                                            type="text"
                                            value={editFormData.diagnosis}
                                            onChange={e => setEditFormData({ ...editFormData, diagnosis: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>

                                    {/* Symptoms */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Gejala</label>
                                        <textarea
                                            value={editFormData.symptoms}
                                            onChange={e => setEditFormData({ ...editFormData, symptoms: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                            rows="3"
                                        />
                                    </div>

                                    {/* Treatment */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Pengobatan</label>
                                        <textarea
                                            value={editFormData.treatment}
                                            onChange={e => setEditFormData({ ...editFormData, treatment: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                            rows="3"
                                            placeholder="Contoh: Operasi, Terapi, dll"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Catatan Dokter</label>
                                        <textarea
                                            value={editFormData.notes}
                                            onChange={e => setEditFormData({ ...editFormData, notes: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                            rows="3"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Prescription Management Modal */}
            {showPrescriptionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={handleClosePrescriptionModal}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Kelola Resep Obat</h2>
                                <p className="text-gray-600 text-sm">Tambah atau hapus obat untuk pasien ini</p>
                            </div>
                            <button onClick={handleClosePrescriptionModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Current Medications */}
                            {editMedications.length > 0 ? (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-700">Daftar Obat Saat Ini:</h3>
                                    {editMedications.map((med, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-green-50 p-4 rounded-xl border border-green-100">
                                            <div>
                                                <div className="font-bold text-gray-800">{med.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    {med.dosage} • {med.frequency} • {med.duration}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveMedication(idx)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500">Belum ada resep obat</p>
                                </div>
                            )}

                            {/* Add New Medication Form */}
                            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 space-y-4">
                                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Tambah Obat Baru
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <select
                                            value={newMed.name}
                                            onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">-- Pilih Obat --</option>
                                            {medicines.map(med => (
                                                <option key={med.id} value={med.name}>
                                                    {med.name} (Stock: {med.stock} {med.unit})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Dosis (ex: 500mg)"
                                        value={newMed.dosage}
                                        onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                                        className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Frekuensi (ex: 3x sehari)"
                                        value={newMed.frequency}
                                        onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                                        className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <div className="col-span-2">
                                        <input
                                            type="text"
                                            placeholder="Durasi (ex: 7 hari)"
                                            value={newMed.duration}
                                            onChange={e => setNewMed({ ...newMed, duration: e.target.value })}
                                            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddMedication}
                                    disabled={!newMed.name || !newMed.dosage}
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Tambahkan ke Daftar
                                </button>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={handleClosePrescriptionModal}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSavePrescription}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Simpan Resep
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Medical Record Modal */}
            {showCreateForm && (
                <CreateMedicalRecord
                    onClose={() => setShowCreateForm(false)}
                    onSuccess={() => {
                        fetchRecords()
                        setShowCreateForm(false)
                    }}
                />
            )}
        </div>
    )
}
