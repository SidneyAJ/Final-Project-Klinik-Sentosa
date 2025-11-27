import { useState, useEffect } from 'react'
import { Pill, User, Calendar, Check, X, AlertTriangle, DollarSign, Package, FileText } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'
import Toast from '../../components/Toast'

export default function PrescriptionVerification() {
    const [prescriptions, setPrescriptions] = useState([])
    const [selectedPrescription, setSelectedPrescription] = useState(null)
    const [loading, setLoading] = useState(true)
    const [rejectReason, setRejectReason] = useState('')
    const [showRejectModal, setShowRejectModal] = useState(null)
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchPendingPrescriptions()
    }, [])

    const fetchPendingPrescriptions = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/prescription-verification/pending-verification', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setPrescriptions(data)
            }
        } catch (error) {
            console.error('Error fetching prescriptions:', error)
            showToast('Gagal memuat data resep', 'error')
        } finally {
            setLoading(false)
        }
    }

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type })
    }

    const calculateTotalPrice = (medications) => {
        // This is a placeholder - actual price will be calculated by backend
        return '(dihitung saat verifikasi)'
    }

    const handleVerify = async (prescriptionId) => {
        if (!confirm('Apakah Anda yakin ingin memverifikasi resep ini?')) return

        try {
            const res = await fetch(`http://localhost:3000/api/prescription-verification/${prescriptionId}/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await res.json()

            if (res.ok) {
                showToast(`✅ Resep diverifikasi! Total: Rp ${data.totalPrice?.toLocaleString('id-ID')}`, 'success')
                fetchPendingPrescriptions()
                setSelectedPrescription(null)
            } else {
                showToast(data.error || 'Gagal memverifikasi resep', 'error')
                if (data.details) {
                    console.error('Stock errors:', data.details)
                }
            }
        } catch (error) {
            console.error('Error verifying prescription:', error)
            showToast('Terjadi kesalahan saat verifikasi', 'error')
        }
    }

    const handleReject = async (prescriptionId) => {
        if (!rejectReason.trim()) {
            showToast('Alasan penolakan harus diisi', 'error')
            return
        }

        try {
            const res = await fetch(`http://localhost:3000/api/prescription-verification/${prescriptionId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: rejectReason })
            })

            if (res.ok) {
                showToast('Resep ditolak', 'success')
                fetchPendingPrescriptions()
                setShowRejectModal(null)
                setRejectReason('')
                setSelectedPrescription(null)
            } else {
                const data = await res.json()
                showToast(data.error || 'Gagal menolak resep', 'error')
            }
        } catch (error) {
            console.error('Error rejecting prescription:', error)
            showToast('Terjadi kesalahan', 'error')
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

            {/* Header */}
            <ScrollReveal>
                <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Pill className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Verifikasi Resep</h1>
                            <p className="text-purple-100 mt-1">Review dan verifikasi resep dari dokter</p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={50}>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold text-gray-800">{prescriptions.length}</div>
                    <div className="text-sm text-gray-600">Resep Menunggu Verifikasi</div>
                </div>
            </ScrollReveal>

            {/* Prescriptions List */}
            <div className="space-y-4">
                {prescriptions.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        <Pill className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada resep pending</h3>
                        <p className="text-gray-600">Semua resep sudah diverifikasi</p>
                    </div>
                ) : (
                    prescriptions.map((prescription, idx) => (
                        <ScrollReveal key={prescription.id} direction="up" delay={idx * 30}>
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Patient & Doctor Info */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                                {prescription.patient_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{prescription.patient_name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <User className="w-3 h-3" />
                                                    Dokter: {prescription.doctor_name}
                                                </div>
                                                {prescription.diagnosis && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <FileText className="w-3 h-3" />
                                                        Diagnosis: {prescription.diagnosis}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Medications */}
                                        <div className="bg-violet-50 rounded-xl p-4 mb-4">
                                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                <Package className="w-4 h-4 text-violet-600" />
                                                Obat yang Diresepkan ({prescription.medications?.length || 0})
                                            </h4>
                                            <div className="space-y-2">
                                                {prescription.medications?.map((med, medIdx) => (
                                                    <div key={medIdx} className="bg-white p-3 rounded-lg flex items-start justify-between">
                                                        <div>
                                                            <div className="font-semibold text-gray-800">{med.name}</div>
                                                            <div className="text-sm text-gray-600">
                                                                Dosis: {med.dosage} • {med.frequency} • {med.duration}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-semibold text-violet-600">
                                                            Qty: {med.quantity || 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(prescription.created_at).toLocaleString('id-ID')}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 ml-4">
                                        <button
                                            onClick={() => handleVerify(prescription.id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-semibold flex items-center gap-2 shadow-lg"
                                        >
                                            <Check className="w-4 h-4" />
                                            Verifikasi
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(prescription.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Tolak
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRejectModal(null)}>
                    <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-100 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Tolak Resep</h3>
                                <p className="text-sm text-gray-600">Berikan alasan penolakan</p>
                            </div>
                        </div>

                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Contoh: Stock obat tidak tersedia, dosis tidak sesuai, dll..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none"
                            rows="4"
                        />

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowRejectModal(null)}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleReject(showRejectModal)}
                                disabled={!rejectReason.trim()}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Tolak Resep
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
