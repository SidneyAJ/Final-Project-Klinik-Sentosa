import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Users, Shield, Activity, Database, UserPlus, Clock,
    Server, FileText, Eye, Settings, Zap, Lock, ChevronRight
} from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'
import CountUp from '../../components/CountUp'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPatients: 0,
        totalDoctors: 0,
        totalNurses: 0,
        totalPharmacists: 0,
        totalAdmins: 0,
        recentActivities: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/api/admin/dashboard-stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (err) {
            console.error('Error fetching stats:', err)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Total Pengguna',
            value: stats.totalUsers || 0,
            icon: Users,
            gradient: 'from-blue-500 via-blue-600 to-cyan-600',
            bgGlow: 'bg-blue-500/20',
            desc: 'Semua role sistem'
        },
        {
            title: 'Pasien Terdaftar',
            value: stats.totalPatients || 0,
            icon: UserPlus,
            gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
            bgGlow: 'bg-emerald-500/20',
            desc: 'Total pasien aktif'
        },
        {
            title: 'Tenaga Medis',
            value: (stats.totalDoctors || 0) + (stats.totalNurses || 0) + (stats.totalPharmacists || 0),
            icon: Activity,
            gradient: 'from-purple-500 via-purple-600 to-indigo-600',
            bgGlow: 'bg-purple-500/20',
            desc: 'Dokter, Perawat & Apoteker'
        },
        {
            title: 'Administrator',
            value: stats.totalAdmins || 0,
            icon: Shield,
            gradient: 'from-orange-500 via-orange-600 to-amber-600',
            bgGlow: 'bg-orange-500/20',
            desc: 'Admin & IT Staff'
        }
    ]

    const systemStatus = [
        { label: 'Database', status: 'online', icon: Database, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Authentication', status: 'online', icon: Lock, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'API Server', status: 'online', icon: Server, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'File Storage', status: 'online', icon: FileText, color: 'text-green-500', bg: 'bg-green-50' },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Memuat dashboard IT...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Premium Header */}
            <ScrollReveal direction="up">
                <div className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-3xl p-8 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 -right-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400 text-sm font-bold">System Online</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">IT Administrator Dashboard</h1>
                        <p className="text-white/80 text-lg font-medium">
                            Kelola pengguna, monitor sistem, dan pantau aktivitas keamanan
                        </p>
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-40 h-40 border-4 border-white/10 rounded-full"></div>
                    <div className="absolute top-1/2 right-20 w-2 h-2 bg-white/40 rounded-full"></div>
                    <div className="absolute top-1/3 right-40 w-1 h-1 bg-white/60 rounded-full"></div>
                </div>
            </ScrollReveal>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <ScrollReveal key={idx} direction="up" delay={idx * 100}>
                        <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            <div className={`absolute -top-20 -right-20 w-40 h-40 ${stat.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <stat.icon className="w-7 h-7" />
                                    </div>
                                    <Zap className="w-5 h-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">{stat.title}</h3>
                                <div className="text-4xl font-bold text-slate-800 mb-1">
                                    <CountUp end={stat.value} />
                                </div>
                                <p className="text-sm text-slate-400 font-medium">{stat.desc}</p>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Status */}
                <ScrollReveal direction="up">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                            <div className="flex items-center gap-3 text-white">
                                <Server className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Status Sistem</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {systemStatus.map((system, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 ${system.bg} rounded-lg group-hover:scale-110 transition-transform`}>
                                            <system.icon className={`w-5 h-5 ${system.color}`} />
                                        </div>
                                        <span className="font-semibold text-slate-700">{system.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-bold text-green-600 uppercase">{system.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Quick Actions */}
                <ScrollReveal direction="up" delay={100}>
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
                            <div className="flex items-center gap-3 text-white">
                                <Zap className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Aksi Cepat</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-3">
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all group border border-blue-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-slate-700">Tambah Pengguna Baru</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => navigate('/admin/logs')}
                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-all group border border-purple-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-slate-700">Lihat Audit Logs</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => navigate('/admin/settings')}
                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all group border border-orange-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-slate-700">Pengaturan Sistem</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            {/* Recent Activity */}
            <ScrollReveal direction="up">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <Clock className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Aktivitas Terbaru</h3>
                            </div>
                            <span className="text-sm font-medium text-slate-300">Real-time</span>
                        </div>
                    </div>
                    <div className="p-6">
                        {stats.recentActivities && stats.recentActivities.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentActivities.map((activity, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <Activity className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-700">{activity.action}</p>
                                            <p className="text-sm text-slate-500 mt-1">{activity.details}</p>
                                            <p className="text-xs text-slate-400 mt-1">{activity.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-10 h-10 text-slate-400" />
                                </div>
                                <h4 className="font-bold text-slate-700 mb-2">Belum Ada Aktivitas</h4>
                                <p className="text-slate-500 text-sm">Log aktivitas sistem akan muncul di sini</p>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}
