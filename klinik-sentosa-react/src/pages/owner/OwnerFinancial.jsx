import { useState, useEffect } from 'react'
import { Calendar, DollarSign, CreditCard, TrendingUp, Download } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'
import { Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement } from 'chart.js'

ChartJS.register(ArcElement)

export default function OwnerFinancial() {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [financialData, setFinancialData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Set default dates (today)
        const today = new Date()
        const todayStr = today.toISOString().split('T')[0]
        setStartDate(todayStr)
        setEndDate(todayStr)

        // Fetch data with default dates
        fetchFinancialData(todayStr, todayStr)
    }, [])

    const fetchFinancialData = async (start, end) => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3000/api/admin/reports/financial?startDate=${start}&endDate=${end}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setFinancialData(data)
            }
        } catch (error) {
            console.error('Error fetching financial data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        if (startDate && endDate) {
            fetchFinancialData(startDate, endDate)
        }
    }

    const paymentMethodChart = financialData?.paymentMethods ? {
        labels: financialData.paymentMethods.map(item => item.payment_method || 'Tunai'),
        datasets: [{
            data: financialData.paymentMethods.map(item => item.total),
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderWidth: 0
        }]
    } : null

    const insuranceChart = financialData?.insuranceBreakdown ? {
        labels: financialData.insuranceBreakdown.map(item => item.type),
        datasets: [{
            label: 'Total (Rp)',
            data: financialData.insuranceBreakdown.map(item => item.total),
            backgroundColor: [
                'rgba(16, 185, 129, 0.8)',
                'rgba(59, 130, 246, 0.8)'
            ],
            borderWidth: 0
        }]
    } : null

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += 'Rp ' + new Intl.NumberFormat('id-ID').format(context.parsed || context.parsed.y);
                        return label;
                    }
                }
            }
        }
    }

    const barOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return 'Rp ' + new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value);
                    }
                }
            }
        }
    }

    return (
        <div className="space-y-6">
            <ScrollReveal direction="up">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <DollarSign className="w-7 h-7 text-amber-500" />
                        Laporan Keuangan
                    </h2>

                    {/* Date Filter */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Tanggal Akhir
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="w-full bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Loading...' : 'Tampilkan Laporan'}
                            </button>
                        </div>
                    </div>

                    {financialData && (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-amber-700 font-medium text-sm">Total Pendapatan</p>
                                        <TrendingUp className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-amber-900">
                                        Rp {new Intl.NumberFormat('id-ID').format(financialData.totalRevenue)}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-blue-700 font-medium text-sm">Transaksi</p>
                                        <CreditCard className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {financialData.dailyBreakdown.reduce((sum, item) => sum + item.transactions, 0)}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-emerald-700 font-medium text-sm">Rata-rata/Hari</p>
                                        <DollarSign className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-emerald-900">
                                        Rp {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(
                                            financialData.dailyBreakdown.length > 0
                                                ? financialData.totalRevenue / financialData.dailyBreakdown.length
                                                : 0
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-slate-800 mb-4">Metode Pembayaran</h3>
                                    <div className="h-64">
                                        {paymentMethodChart && <Pie data={paymentMethodChart} options={chartOptions} />}
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-slate-800 mb-4">BPJS vs Tunai</h3>
                                    <div className="h-64">
                                        {insuranceChart && <Bar data={insuranceChart} options={barOptions} />}
                                    </div>
                                </div>
                            </div>

                            {/* Daily Breakdown Table */}
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800">Rincian Harian</h3>
                                    <button className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                                        <Download className="w-4 h-4" />
                                        Export CSV
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-300">
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Tanggal</th>
                                                <th className="text-right py-3 px-4 font-semibold text-slate-700">Transaksi</th>
                                                <th className="text-right py-3 px-4 font-semibold text-slate-700">Pendapatan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {financialData.dailyBreakdown.map((item, idx) => (
                                                <tr key={idx} className="border-b border-slate-200 hover:bg-white transition-colors">
                                                    <td className="py-3 px-4 text-slate-700">
                                                        {new Date(item.date).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-medium text-slate-700">{item.transactions}</td>
                                                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                                                        Rp {new Intl.NumberFormat('id-ID').format(item.revenue)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </ScrollReveal>
        </div>
    )
}
