import { useState, useEffect } from 'react'
import { Activity, Calendar, Filter, User, Clock } from 'lucide-react'
import ScrollReveal from '../../components/ScrollReveal'

export default function OwnerActivity() {
    const [activities, setActivities] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const limit = 50

    useEffect(() => {
        // Set default dates (last 7 days)
        const today = new Date()
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(today.getDate() - 7)

        const todayStr = today.toISOString().split('T')[0]
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]

        setStartDate(sevenDaysAgoStr)
        setEndDate(todayStr)

        // Fetch initial data
        fetchActivities(sevenDaysAgoStr, todayStr, '', 0)
    }, [])

    const fetchActivities = async (start, end, role, offset) => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            let url = `http://localhost:3000/api/admin/activity-logs?limit=${limit}&offset=${offset}`

            if (start && end) {
                url += `&startDate=${start}&endDate=${end}`
            }
            if (role) {
                url += `&role=${role}`
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setActivities(data)
            }
        } catch (error) {
            console.error('Error fetching activities:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        setPage(0)
        fetchActivities(startDate, endDate, roleFilter, 0)
    }

    const handleNextPage = () => {
        const newPage = page + 1
        setPage(newPage)
        fetchActivities(startDate, endDate, roleFilter, newPage * limit)
    }

    const handlePrevPage = () => {
        if (page > 0) {
            const newPage = page - 1
            setPage(newPage)
            fetchActivities(startDate, endDate, roleFilter, newPage * limit)
        }
    }

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: 'bg-purple-100 text-purple-700 border-purple-200',
            owner: 'bg-amber-100 text-amber-700 border-amber-200',
            doctor: 'bg-blue-100 text-blue-700 border-blue-200',
            nurse: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            apoteker: 'bg-pink-100 text-pink-700 border-pink-200',
            patient: 'bg-slate-100 text-slate-700 border-slate-200'
        }
        return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200'
    }

    const getActionIcon = (action) => {
        if (action.includes('LOGIN')) return '🔓'
        if (action.includes('REGISTER')) return '📝'
        if (action.includes('PAYMENT')) return '💳'
        if (action.includes('APPOINTMENT')) return '📅'
        if (action.includes('VITAL')) return '🩺'
        if (action.includes('PRESCRIPTION')) return '💊'
        return '📋'
    }

    return (
        <div className="space-y-6">
            <ScrollReveal direction="up">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="w-7 h-7 text-emerald-500" />
                        Aktivitas Klinik
                    </h2>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Filter className="w-4 h-4 inline mr-1" />
                                Role
                            </label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="">Semua Role</option>
                                <option value="admin">Admin</option>
                                <option value="owner">Owner</option>
                                <option value="doctor">Dokter</option>
                                <option value="nurse">Perawat</option>
                                <option value="apoteker">Apoteker</option>
                                <option value="patient">Pasien</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="w-full bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Loading...' : 'Filter'}
                            </button>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="space-y-3">
                        {activities.map((activity, idx) => (
                            <div
                                key={idx}
                                className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center text-xl">
                                        {getActionIcon(activity.action)}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-slate-800">{activity.name || 'Unknown User'}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getRoleBadgeColor(activity.role)}`}>
                                                        {activity.role?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600">{activity.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(activity.timestamp).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(activity.timestamp).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                                            <p className="text-sm font-semibold text-emerald-700 mb-1">
                                                {activity.action.replace(/_/g, ' ')}
                                            </p>
                                            {activity.details && (
                                                <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded border border-slate-200 overflow-x-auto">
                                                    {typeof activity.details === 'string'
                                                        ? activity.details
                                                        : JSON.stringify(JSON.parse(activity.details), null, 2)
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activities.length === 0 && !loading && (
                            <div className="text-center py-12 text-slate-400">
                                <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Tidak ada aktivitas ditemukan</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 0 || loading}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Sebelumnya
                        </button>
                        <span className="text-sm text-slate-600">
                            Halaman {page + 1}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={activities.length < limit || loading}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Selanjutnya →
                        </button>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}
