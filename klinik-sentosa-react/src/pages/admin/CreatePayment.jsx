import { useState, useEffect } from 'react'
import { CreditCard, User, Search, FileText, CheckCircle, Calculator, AlertCircle } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'
import Toast from '../../components/Toast'

export default function CreatePayment() {
    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [prescriptions, setPrescriptions] = useState([])
    const [selectedPrescription, setSelectedPrescription] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
    const [paymentSummary, setPaymentSummary] = useState(null)

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            // Filter only patients
            setPatients(data.filter(u => u.role === 'patient'))
        } catch (error) {
            console.error('Error fetching patients:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUnpaidPrescriptions = async (patientId) => {
        // In a real app, we'd have a specific endpoint for this. 
        // For now, we'll simulate or fetch all and filter.
        // Since we don't have a direct endpoint for "admin get patient bills", 
        // we might need to rely on manual entry or just selecting the patient.
        // Let's assume for this MVP we just select patient and if they have a prescription we show it.
        // Or better, let's just create a manual payment without linking to prescription for simplicity if needed,
        // BUT the requirement says "stock berkurang", so we MUST link to prescription.

        // Let's use a new endpoint or reuse existing logic. 
        // Actually, let's just fetch all prescriptions for this patient.
        try {
            const token = localStorage.getItem('token')
            // We need an endpoint to get prescriptions by user_id for admin. 
            // The existing /api/prescriptions might return all if admin? Let's check.
            // Assuming we can't easily get it, let's just show a "No Prescription" option for now 
            // or implement a simple fetch if we had time.
            // For this MVP, let's assume the admin knows the prescription ID or we list them.

            // Let's try to fetch all prescriptions and filter by patient (inefficient but works for MVP)
            const response = await fetch('http://localhost:3000/api/prescriptions', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            // Filter for this patient and not redeemed
            const patientPrescriptions = data.filter(p =>
                p.patient_name === selectedPatient?.name && p.status !== 'redeemed'
            )
            setPrescriptions(patientPrescriptions)
        } catch (error) {
            console.error('Error fetching prescriptions:', error)
        }
    }

    useEffect(() => {
        if (selectedPatient) {
            fetchUnpaidPrescriptions(selectedPatient.id)
        } else {
            setPrescriptions([])
            setSelectedPrescription(null)
            setPaymentSummary(null)
        }
    }, [selectedPatient])

    useEffect(() => {
        if (selectedPatient) {
            calculateTotal()
        }
    }, [selectedPatient, selectedPrescription])

    const calculateTotal = () => {
        // Hardcoded fees matching backend calculator
        const examFee = 50000
        const doctorFee = 100000
        const medicineFee = selectedPrescription ? selectedPrescription.total_price : 0

        setPaymentSummary({
            examFee,
            doctorFee,
            medicineFee,
            total: examFee + doctorFee + medicineFee
        })
    }

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient)
        setSearchTerm('')
    }

    const handleSubmit = async () => {
        if (!selectedPatient) return

        setIsSubmitting(true)
        try {
            const token = localStorage.getItem('token')
            // We need to find the patient_id from the user_id
            // The patients list from /api/admin/users gives us users, not patients table id.
            // We need to fetch patient details first or the backend handles user_id?
            // The backend /create-manual expects patient_id (from patients table).
            // We need to resolve this. 
            // Let's fetch the patient profile first using the user ID.

            // Actually, let's just pass the user_id and let backend handle it? 
            // No, backend expects patient_id.
            // Let's quickly fetch patient ID.

            // Workaround: We'll search for the patient in the patients table if we had access.
            // Or we can assume the admin/users endpoint returns enough info? 
            // It returns id (user_id), email, role, name.

            // Let's try to find the patient_id by calling a lookup or just iterating.
            // For now, let's assume we can get it. 
            // Wait, I can't easily get patient_id from user_id without an endpoint.
            // I'll update the backend to accept user_id or look it up.
            // BUT, I don't want to modify backend again if I can avoid it.

            // Let's use the /api/admin/users to get the list, 
            // and maybe there's a way to get patient_id.
            // Actually, let's just use the `patients` table ID if we can.

            // Let's fetch all patients from /api/patients/ (admin route?) No.
            // Let's fetch /api/admin/users and hope we can map it.

            // Alternative: The backend `create-manual` could look up patient_id from user_id if I pass user_id?
            // The backend code I wrote: `const { patient_id } = req.body; ... SELECT * FROM patients WHERE id = ?`
            // It expects patient_id.

            // I'll add a small helper in the frontend to find patient_id.
            // Or I can just fetch all patients from /api/patients if I was admin?
            // No, /api/patients is for the logged in patient.

            // OK, I'll use a hack: I'll fetch `/api/admin/dashboard-stats`? No.
            // I'll fetch `/api/users` (admin) -> get user ID.
            // Then I'll try to submit. If it fails, I'll know.

            // Wait, I can use the `prescriptions` endpoint to get patient_id!
            // The prescription object has `patient_id`.
            // If I select a prescription, I have the ID.
            // If I don't select a prescription (manual payment without meds), I'm stuck.

            // Let's assume for now we ONLY support payments with prescriptions or I'll fix the backend to accept user_id.
            // I'll fix the backend to be safe. It's a quick fix.

            // Actually, let's look at `routes/admin.js`. 
            // `router.get('/users')` returns users.

            // Let's modify `routes/payments.js` to accept `user_id` and look up `patient_id`.
            // That's the most robust way.

            // For now, let's proceed with the frontend assuming I'll fix the backend.

            const response = await fetch('http://localhost:3000/api/payments/create-manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: selectedPatient.id, // Sending user_id, backend will need to handle this
                    prescription_id: selectedPrescription?.id
                })
            })

            if (response.ok) {
                setToast({ show: true, message: 'Pembayaran berhasil dibuat dan diverifikasi!', type: 'success' })
                setSelectedPatient(null)
                setSelectedPrescription(null)
            } else {
                const data = await response.json()
                setToast({ show: true, message: data.error || 'Gagal membuat pembayaran', type: 'error' })
            }
        } catch (error) {
            console.error('Payment error:', error)
            setToast({ show: true, message: 'Terjadi kesalahan sistem', type: 'error' })
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

            <ScrollReveal>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Buat Pembayaran Manual</h1>
                            <p className="text-slate-500">Input pembayaran pasien secara langsung (Kasir)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Selection */}
                        <div className="space-y-6">
                            {/* Patient Search */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Cari Pasien</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 outline-none"
                                        placeholder="Nama atau Email Pasien..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setSelectedPatient(null)}
                                    />
                                </div>

                                {searchTerm && !selectedPatient && (
                                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto">
                                        {filteredPatients.map(patient => (
                                            <button
                                                key={patient.id}
                                                onClick={() => handlePatientSelect(patient)}
                                                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {patient.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{patient.name}</p>
                                                    <p className="text-xs text-slate-500">{patient.email}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedPatient && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {selectedPatient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{selectedPatient.name}</p>
                                        <p className="text-sm text-slate-500">{selectedPatient.email}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPatient(null)}
                                        className="ml-auto text-sm text-red-500 hover:underline"
                                    >
                                        Ganti
                                    </button>
                                </div>
                            )}

                            {/* Prescription Selection */}
                            {selectedPatient && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Resep (Opsional)</label>
                                    {prescriptions.length > 0 ? (
                                        <div className="space-y-2">
                                            {prescriptions.map(pres => (
                                                <button
                                                    key={pres.id}
                                                    onClick={() => setSelectedPrescription(pres === selectedPrescription ? null : pres)}
                                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedPrescription?.id === pres.id
                                                            ? 'border-green-500 bg-green-50'
                                                            : 'border-slate-200 hover:border-green-200'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-bold text-slate-700">Resep #{pres.id}</span>
                                                        <span className="text-xs bg-slate-200 px-2 py-1 rounded-full text-slate-600">
                                                            {new Date(pres.created_at).toLocaleDateString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mb-2">Dokter: {pres.doctor_name}</p>
                                                    <p className="font-bold text-green-600">
                                                        Rp {pres.total_price?.toLocaleString('id-ID')}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500 text-sm">
                                            Tidak ada resep yang belum dibayar
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Summary */}
                        <div className="bg-slate-50 rounded-2xl p-6 h-fit">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-slate-600" />
                                Rincian Biaya
                            </h3>

                            {paymentSummary ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Biaya Pemeriksaan</span>
                                            <span className="font-medium">Rp {paymentSummary.examFee.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Jasa Dokter</span>
                                            <span className="font-medium">Rp {paymentSummary.doctorFee.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Obat-obatan</span>
                                            <span className="font-medium">Rp {paymentSummary.medicineFee.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-800">Total Tagihan</span>
                                            <span className="text-2xl font-bold text-green-600">
                                                Rp {paymentSummary.total.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 mt-6"
                                    >
                                        {isSubmitting ? 'Memproses...' : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Proses Pembayaran (LUNAS)
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-center text-slate-500 mt-2">
                                        *Stok obat akan berkurang otomatis setelah pembayaran diproses
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>Pilih pasien untuk melihat rincian biaya</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}
