import { useState, useEffect } from 'react'
import { ClipboardList, Package, AlertTriangle, CheckCircle, ChevronRight, TrendingUp } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'
import CountUp from '../../components/CountUp'
import { Link } from 'react-router-dom'

export default function PharmacistDashboard() {
    const [stats, setStats] = useState({
        pendingPrescriptions: 0,
        lowStockItems: [],
        lowStockCount: 0,
        completedToday: 0,
        totalMedicines: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/api/pharmacy/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Resep Menunggu',
            value: stats.pendingPrescriptions,
            icon: ClipboardList,
            color: 'bg-orange-500',
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            link: '/pharmacist/verification'
        },
        {
            title: 'Stok Menipis',
            value: stats.lowStockCount,
            icon: AlertTriangle,
            color: 'bg-red-500',
            bg: 'bg-red-50',
            text: 'text-red-600',
            link: '/pharmacist/inventory'
        },
        {
            title: 'Selesai Hari Ini',
            value: stats.completedToday,
            icon: CheckCircle,
            color: 'bg-emerald-500',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            link: '/pharmacist/verification'
        },
        {
            title: 'Total Jenis Obat',
            value: stats.totalMedicines,
            icon: Package,
            color: 'bg-blue-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            link: '/pharmacist/inventory'
        }
    ]

    return (
        <div className="space-y-8 pb-10">
            <ScrollReveal direction="up">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Halo, Apoteker!</h2>
                        <p className="text-emerald-100 text-lg">
                            Siap melayani resep dan mengelola stok obat hari ini?
                        </p>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <ScrollReveal key={idx} direction="up" delay={idx * 100}>
                        <Link to={stat.link} className="block group">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-50 hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.text} shadow-sm group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    {stat.title === 'Selesai Hari Ini' && (
                                        <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> +{stat.value}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-slate-500 font-medium mb-1">{stat.title}</h3>
                                <div className="text-3xl font-bold text-slate-800 mb-2">
                                    <CountUp end={stat.value} />
                                </div>
                                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Lihat Detail <ChevronRight className="w-3 h-3" />
                                </p>
                            </div>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>

            {/* Low Stock Alert Section */}
            <ScrollReveal direction="up" delay={400}>
                <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Peringatan Stok Menipis</h3>
                                <p className="text-slate-500 text-sm">Segera lakukan restock untuk obat berikut</p>
                            </div>
                        </div>
                        <Link to="/pharmacist/inventory" className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                            Lihat Semua <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Obat</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sisa Stok</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Satuan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats.lowStockItems.length > 0 ? (
                                    stats.lowStockItems.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-red-600">{item.stock}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{item.unit}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg inline-flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> Kritis
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <CheckCircle className="w-8 h-8 text-emerald-400" />
                                                <p>Semua stok obat aman!</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}
