import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, FileText, Search, Filter, DollarSign, Image } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'
import Toast from '../../components/Toast'

export default function PaymentVerification() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

    useEffect(() => {
        fetchPendingPayments()
    }, [])

    const fetchPendingPayments = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/api/payments/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            setPayments(data)
        } catch (error) {
            console.error('Error fetching payments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (paymentId) => {
        if (!confirm('Verifikasi pembayaran ini? Stok obat akan berkurang otomatis.')) return

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3000/api/payments/${paymentId}/verify`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                setToast({ show: true, message: 'Pembayaran berhasil diverifikasi', type: 'success' })
                fetchPendingPayments()
                setSelectedPayment(null)
            } else {
                setToast({ show: true, message: 'Gagal memverifikasi pembayaran', type: 'error' })
            }
        } catch (error) {
            console.error('Verify error:', error)
        }
    }

    const handleReject = async () => {
        if (!rejectReason) return

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3000/api/payments/${selectedPayment.id}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: rejectReason })
            })

            if (response.ok) {
                setToast({ show: true, message: 'Pembayaran ditolak', type: 'success' })
                fetchPendingPayments()
                setShowRejectModal(false)
                setSelectedPayment(null)
                setRejectReason('')
            } else {
                setToast({ show: true, message: 'Gagal menolak pembayaran', type: 'error' })
            }
        } catch (error) {
            console.error('Reject error:', error)
        }
    }

    return (
        <div className="space-y-6">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

            <ScrollReveal>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Verifikasi Pembayaran</h1>
                            <p className="text-slate-500">Konfirmasi bukti pembayaran dari pasien</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">Loading...</div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                            <p className="text-slate-500 font-medium">Tidak ada pembayaran menunggu verifikasi</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* List */}
                            <div className="space-y-4">
                                {payments.map(payment => (
                                    <button
                                        key={payment.id}
                                        onClick={() => setSelectedPayment(payment)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedPayment?.id === payment.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-blue-200'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-slate-800">{payment.patient_name}</p>
                                                <p className="text-xs text-slate-500">{payment.patient_email}</p>
                                            </div>
                                            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold">
                                                Pending
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock className="w-4 h-4" />
                                                {new Date(payment.payment_date).toLocaleDateString('id-ID')}
                                            </div>
                                            <p className="font-bold text-green-600">
                                                Rp {parseFloat(payment.amount).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Detail */}
                            <div className="bg-slate-50 rounded-2xl p-6 h-fit sticky top-6">
                                {selectedPayment ? (
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-slate-800 border-b pb-4">Detail Pembayaran</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Pasien</label>
                                                <p className="font-medium">{selectedPayment.patient_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Jumlah Transfer</label>
                                                <p className="text-2xl font-bold text-green-600">
                                                    Rp {parseFloat(selectedPayment.amount).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Bukti Transfer</label>
                                                {selectedPayment.payment_proof ? (
                                                    <div className="relative group cursor-pointer">
                                                        <img
                                                            src={selectedPayment.payment_proof}
                                                            alt="Bukti Transfer"
                                                            className="w-full rounded-lg border border-slate-200 shadow-sm"
                                                        />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                            <p className="text-white font-bold flex items-center gap-2">
                                                                <Image className="w-5 h-5" />
                                                                Lihat Full Size
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 bg-slate-200 rounded-lg text-center text-slate-500 text-sm">
                                                        Tidak ada bukti gambar
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <button
                                                onClick={() => setShowRejectModal(true)}
                                                className="py-3 px-4 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Tolak
                                            </button>
                                            <button
                                                onClick={() => handleVerify(selectedPayment.id)}
                                                className="py-3 px-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Verifikasi
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-400">
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Pilih pembayaran untuk melihat detail</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollReveal>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Tolak Pembayaran</h3>
                        <textarea
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-red-500 outline-none mb-4"
                            rows="3"
                            placeholder="Alasan penolakan..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
                            >
                                Tolak Pembayaran
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
