import { useState, useEffect } from 'react'
import { Users, Wallet, Calendar, Activity, TrendingUp, ChevronRight } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'
import CountUp from '../../components/CountUp'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

export default function OwnerDashboard() {
    const [stats, setStats] = useState({
        revenue: 0,
        newPatients: 0,
        appointments: 0,
        activeStaff: 0
    })

    const [revenueData, setRevenueData] = useState([])
    const [visitsData, setVisitsData] = useState([])

    useEffect(() => {
        fetchStats()
        fetchChartData()

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchStats()
            fetchChartData()
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/api/admin/dashboard-stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    const fetchChartData = async () => {
        try {
            const token = localStorage.getItem('token')

            // Fetch revenue chart
            const revenueRes = await fetch('http://localhost:3000/api/admin/reports/revenue-chart?days=7', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (revenueRes.ok) {
                const data = await revenueRes.json()
                setRevenueData(data)
            }

            // Fetch visits chart
            const visitsRes = await fetch('http://localhost:3000/api/admin/reports/visits-chart?days=7', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (visitsRes.ok) {
                const data = await visitsRes.json()
                setVisitsData(data)
            }
        } catch (error) {
            console.error('Error fetching chart data:', error)
        }
    }

    const statCards = [
        {
            title: 'Pendapatan Hari Ini',
            value: stats.revenue,
            prefix: 'Rp ',
            icon: Wallet,
            color: 'bg-amber-500',
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            link: '/owner/financial'
        },
        {
            title: 'Pasien Baru',
            value: stats.newPatients,
            icon: Users,
            color: 'bg-blue-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            link: '/owner/activity'
        },
        {
            title: 'Janji Temu',
            value: stats.appointments,
            icon: Calendar,
            color: 'bg-emerald-500',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            link: '/owner/activity'
        },
        {
            title: 'Staf Aktif',
            value: stats.activeStaff,
            icon: Activity,
            color: 'bg-purple-500',
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            link: '/owner/activity'
        }
    ]

    const revenueChartData = {
        labels: revenueData.map(item => {
            const date = new Date(item.date)
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        }),
        datasets: [{
            label: 'Pendapatan (Rp)',
            data: revenueData.map(item => item.amount),
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4
        }]
    }

    const visitsChartData = {
        labels: visitsData.map(item => {
            const date = new Date(item.date)
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        }),
        datasets: [{
            label: 'Kunjungan Pasien',
            data: visitsData.map(item => item.visits),
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
        }]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            if (label.includes('Pendapatan')) {
                                label += new Intl.NumberFormat('id-ID').format(context.parsed.y);
                            } else {
                                label += context.parsed.y;
                            }
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value);
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }

    return (
        <div className="space-y-8">
            <ScrollReveal direction="up">
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Selamat Datang, Pemilik!</h2>
                        <p className="text-slate-300 text-lg">
                            Pantau performa klinik Anda secara real-time hari ini.
                        </p>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/20 to-transparent pointer-events-none" />
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <ScrollReveal key={idx} direction="up" delay={idx * 100}>
                        <Link to={stat.link} className="block group">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.text} shadow-sm group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <TrendingUp className={`w-5 h-5 ${stat.text} opacity-50`} />
                                </div>
                                <h3 className="text-slate-500 font-medium mb-1">{stat.title}</h3>
                                <div className="text-2xl font-bold text-slate-800 mb-2 truncate">
                                    {stat.prefix && <span className="text-sm font-normal text-slate-400">{stat.prefix}</span>}
                                    <CountUp end={stat.value} />
                                </div>
                                <p className="text-xs text-slate-400 font-bold flex items-center gap-1 group-hover:text-amber-500 transition-colors">
                                    Lihat Detail <ChevronRight className="w-3 h-3" />
                                </p>
                            </div>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>

            {/* Charts */}
            <ScrollReveal direction="up" delay={400}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Grafik Pendapatan</h3>
                            <p className="text-sm text-slate-500">7 Hari Terakhir</p>
                        </div>
                        <div className="h-64">
                            {revenueData.length > 0 ? (
                                <Line data={revenueChartData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    Tidak ada data
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Grafik Kunjungan Pasien</h3>
                            <p className="text-sm text-slate-500">7 Hari Terakhir</p>
                        </div>
                        <div className="h-64">
                            {visitsData.length > 0 ? (
                                <Line data={visitsChartData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    Tidak ada data
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}
