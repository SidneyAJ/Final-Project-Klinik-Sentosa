import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Upload, FileText, CheckCircle, AlertCircle, Smartphone, QrCode, Building } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'
import Toast from '../../components/Toast'

export default function UploadPayment() {
    const [bills, setBills] = useState([])
    const [selectedBill, setSelectedBill] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('transfer')
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
    const navigate = useNavigate()

    useEffect(() => {
        fetchBills()
    }, [])

    const fetchBills = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/api/patients/my-bills', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setBills(data)
                if (data.length > 0) setSelectedBill(data[0])
            }
        } catch (error) {
            console.error('Error fetching bills:', error)
        }
    }

    const handlePayment = async () => {
        if (!selectedBill) return

        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/api/patients/payments/pay', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prescription_id: selectedBill.prescription_id,
                    amount: selectedBill.amount,
                    payment_method: paymentMethod
                })
            })

            const data = await response.json()

            if (response.ok) {
                setToast({ show: true, message: 'Pembayaran berhasil!', type: 'success' })
                setTimeout(() => {
                    navigate('/patient/payments')
                }, 2000)
            } else {
                setToast({ show: true, message: data.error || 'Gagal memproses pembayaran', type: 'error' })
            }
        } catch (error) {
            console.error('Payment error:', error)
            setToast({ show: true, message: 'Terjadi kesalahan server', type: 'error' })
        } finally {
            setLoading(false)
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

            <ScrollReveal direction="up">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Pembayaran Tagihan</h1>
                            <p className="text-slate-500">Pilih tagihan dan metode pembayaran</p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bill Selection */}
                <ScrollReveal direction="left" delay={100}>
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-800">Pilih Tagihan</h2>
                        {bills.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                <h3 className="font-bold text-slate-800">Tidak Ada Tagihan</h3>
                                <p className="text-slate-500 text-sm">Semua tagihan Anda sudah lunas.</p>
                            </div>
                        ) : (
                            bills.map((bill) => (
                                <div
                                    key={bill.prescription_id}
                                    onClick={() => setSelectedBill(bill)}
                                    className={`
                                        bg-white p-5 rounded-2xl border-2 cursor-pointer transition-all
                                        ${selectedBill?.prescription_id === bill.prescription_id
                                            ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                                            : 'border-slate-200 hover:border-indigo-200'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-800">Tagihan #{bill.prescription_id}</h3>
                                            <p className="text-xs text-slate-500">
                                                {new Date(bill.date).toLocaleDateString('id-ID', {
                                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg">
                                            Belum Lunas
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                            <span className="font-bold text-xs">Dr</span>
                                        </div>
                                        {bill.doctor_name}
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-500">Total Tagihan</span>
                                        <span className="text-lg font-bold text-emerald-600">
                                            Rp {bill.amount.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollReveal>

                {/* Payment Method & Summary */}
                {selectedBill && (
                    <ScrollReveal direction="right" delay={200}>
                        <div className="space-y-6">
                            {/* Payment Method */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Metode Pembayaran</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPaymentMethod('transfer')}
                                        className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col gap-2 ${paymentMethod === 'transfer'
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                            }`}
                                    >
                                        <Building className="w-6 h-6" />
                                        <span className="font-bold text-sm">Transfer Bank</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('qris')}
                                        className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col gap-2 ${paymentMethod === 'qris'
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                            }`}
                                    >
                                        <QrCode className="w-6 h-6" />
                                        <span className="font-bold text-sm">QRIS</span>
                                    </button>
                                </div>

                                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    {paymentMethod === 'transfer' ? (
                                        <div className="space-y-3">
                                            <p className="text-sm font-medium text-slate-600">Silakan transfer ke rekening berikut:</p>
                                            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">BCA</div>
                                                    <div>
                                                        <p className="text-xs text-slate-500">Bank BCA</p>
                                                        <p className="font-mono font-bold text-slate-800">123 456 7890</p>
                                                    </div>
                                                </div>
                                                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">SALIN</button>
                                            </div>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Verifikasi otomatis dalam 5-10 menit
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-3">
                                            <p className="text-sm font-medium text-slate-600">Scan QRIS untuk membayar</p>
                                            <div className="w-48 h-48 bg-white mx-auto border-2 border-slate-200 rounded-xl flex items-center justify-center">
                                                <QrCode className="w-24 h-24 text-slate-300" />
                                            </div>
                                            <p className="text-xs text-slate-500">Mendukung GoPay, OVO, Dana, ShopeePay</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Rincian Pembayaran</h2>
                                <div className="space-y-3 mb-6">
                                    {selectedBill.details.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-slate-600">{item.description}</span>
                                            <span className="font-medium text-slate-800">
                                                Rp {item.total_price.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                        <span className="font-bold text-slate-800">Total Bayar</span>
                                        <span className="text-xl font-bold text-emerald-600">
                                            Rp {selectedBill.amount.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Bayar Sekarang
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>
                )}
            </div>
        </div>
    )
}
