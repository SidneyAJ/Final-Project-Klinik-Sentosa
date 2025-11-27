

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Download, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'

export default function Payments() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, paid, pending
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        try {
            const [resPayments, resBills] = await Promise.all([
                fetch('http://localhost:3000/api/patients/my-payments', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:3000/api/patients/my-bills', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ])

            const paymentsData = await resPayments.json()
            const billsData = await resBills.json()

            let allItems = []

            // Process payments (History)
            if (resPayments.ok && Array.isArray(paymentsData)) {
                allItems = [...allItems, ...paymentsData]
            }

            // Process bills (Unpaid)
            if (resBills.ok && Array.isArray(billsData)) {
                const formattedBills = billsData.map(bill => ({
                    id: `bill-${bill.prescription_id}`,
                    amount: bill.amount,
                    status: 'unpaid', // Custom status for frontend
                    created_at: bill.date,
                    description: `Tagihan Pengobatan - Dr. ${bill.doctor_name}`,
                    is_bill: true, // Flag to identify it's a bill
                    prescription_id: bill.prescription_id
                }))
                allItems = [...allItems, ...formattedBills]
            }

            // Sort by date desc
            allItems.sort((a, b) => new Date(b.created_at || b.payment_date) - new Date(a.created_at || a.payment_date))

            setPayments(allItems)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
        }
    }

    const filteredPayments = payments.filter(payment => {
        if (filter === 'paid') return payment.status === 'verified' || payment.status === 'paid'
        if (filter === 'pending') return payment.status === 'pending' || payment.status === 'unpaid'
        return true
    })

    const totalPaid = payments.filter(p => p.status === 'verified' || p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
    const totalPending = payments.filter(p => p.status === 'pending' || p.status === 'unpaid').reduce((sum, p) => sum + p.amount, 0)

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
    )

    return (
        <div className="space-y-6">
            <ScrollReveal direction="up">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Pembayaran</h1>
                    <p className="text-gray-600">Kelola transaksi dan tagihan</p>
                </div>
            </ScrollReveal>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScrollReveal direction="up" delay={100}>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Terbayar</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={150}>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg p-6 border border-orange-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Belum Dibayar</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPending)}</p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            {/* Filters */}
            <ScrollReveal direction="up" delay={200}>
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilter('paid')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'paid'
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Terbayar
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'pending'
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Belum Dibayar
                        </button>
                    </div>
                </div>
            </ScrollReveal>

            {/* Payments List */}
            <div className="space-y-4">
                {filteredPayments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
                        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800">Tidak ada riwayat pembayaran</h3>
                        <p className="text-gray-500">Belum ada transaksi yang tercatat.</p>
                    </div>
                ) : (
                    filteredPayments.map((payment, idx) => (
                        <ScrollReveal key={payment.id} direction="up" delay={250 + idx * 50}>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${payment.status === 'paid'
                                                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                                : 'bg-gradient-to-br from-orange-500 to-amber-500'
                                                }`}>
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-900 mb-2">{payment.description}</h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4  h-4 text-primary-600" />
                                                        {new Date(payment.created_at || Date.now()).toLocaleDateString('id-ID')}
                                                    </div>
                                                    {payment.receipt_number && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-500">No. Kwitansi:</span>
                                                            <span className="font-mono font-semibold text-gray-700">{payment.receipt_number}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${payment.status === 'verified' || payment.status === 'paid'
                                            ? 'bg-green-100 text-green-700'
                                            : payment.status === 'rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : payment.status === 'unpaid'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {payment.status === 'verified' || payment.status === 'paid' ? 'Lunas' :
                                                payment.status === 'rejected' ? 'Ditolak' :
                                                    payment.status === 'unpaid' ? 'Belum Dibayar' : 'Menunggu Verifikasi'}
                                        </span>
                                        {payment.status === 'unpaid' && (
                                            <button
                                                onClick={() => navigate('/patient/payments/upload')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 hover:scale-105 transition-all duration-300"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                Bayar
                                            </button>
                                        )}
                                        {payment.status === 'paid' && (
                                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 hover:scale-105 transition-all duration-300">
                                                <Download className="w-4 h-4" />
                                                Kwitansi
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))
                )}
            </div>
        </div>
    )
}
