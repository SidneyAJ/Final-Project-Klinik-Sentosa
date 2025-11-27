import { useState, useEffect } from 'react'
import { Users, CheckCircle, Activity, UserCheck, Clock, TrendingUp } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'

export default function NurseDashboard() {
    const [stats, setStats] = useState({
        waitingQueue: 0,
        completedToday: 0,
        totalPatients: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardStats()
        // Refresh stats every 30 seconds
        const interval = setInterval(fetchDashboardStats, 30000)
        return () => clearInterval(interval)
    }, [])

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('http://localhost:3000/api/nurses/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
        } finally {
            setLoading(false)
        }
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
            {/* Header */}
            <ScrollReveal>
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Activity className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard Perawat</h1>
                            <p className="text-emerald-100 mt-1">Pemeriksaan Tanda Vital Pasien</p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Waiting Queue */}
                <ScrollReveal delay={50}>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <Clock className="w-8 h-8 text-orange-600" />
                            </div>
                            <span className="text-4xl font-bold text-orange-600">{stats.waitingQueue}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Antrian Menunggu</h3>
                        <p className="text-xs text-gray-500 mt-1">Pasien menunggu pemeriksaan</p>
                    </div>
                </ScrollReveal>

                {/* Completed Today */}
                <ScrollReveal delay={100}>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <span className="text-4xl font-bold text-green-600">{stats.completedToday}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Sudah Diperiksa</h3>
                        <p className="text-xs text-gray-500 mt-1">Hari ini</p>
                    </div>
                </ScrollReveal>

                {/* Total Patients */}
                <ScrollReveal delay={150}>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <span className="text-4xl font-bold text-blue-600">{stats.totalPatients}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Pasien</h3>
                        <p className="text-xs text-gray-500 mt-1">Terdaftar di klinik</p>
                    </div>
                </ScrollReveal>
            </div>

            {/* Quick Actions */}
            <ScrollReveal delay={200}>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                        Menu Cepat
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href="/nurse/queue"
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:shadow-md transition-all border border-orange-200"
                        >
                            <div className="p-3 bg-orange-500 rounded-xl">
                                <UserCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Periksa Pasien</h3>
                                <p className="text-sm text-gray-600">Panggil & periksa tanda vital</p>
                            </div>
                        </a>
                        <a
                            href="/nurse/patients"
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all border border-blue-200"
                        >
                            <div className="p-3 bg-blue-500 rounded-xl">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Riwayat Pasien</h3>
                                <p className="text-sm text-gray-600">Lihat data pemeriksaan</p>
                            </div>
                        </a>
                    </div>
                </div>
            </ScrollReveal>

            {/* Info Banner */}
            <ScrollReveal delay={250}>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-1">Panduan Pemeriksaan</h3>
                            <p className="text-sm text-gray-600">
                                Pastikan untuk memeriksa semua tanda vital pasien dengan teliti sebelum dikirim ke dokter.
                                Gunakan menu "Periksa Pasien" untuk memulai pemeriksaan.
                            </p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}
