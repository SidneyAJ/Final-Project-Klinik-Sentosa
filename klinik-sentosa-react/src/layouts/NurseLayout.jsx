import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, UserCheck, Users, LogOut, Menu, X, Activity, Building2
} from 'lucide-react'
import NotificationDropdown from '../components/NotificationDropdown'

export default function NurseLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const handleLogout = () => {
        if (confirm('Apakah anda yakin ingin keluar?')) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/login')
        }
    }

    const menuItems = [
        { path: '/nurse', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/nurse/queue', icon: UserCheck, label: 'Antrian & Pemeriksaan' },
        { path: '/nurse/patients', icon: Users, label: 'Riwayat Pasien' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-emerald-900 to-teal-900 text-white transform transition-transform duration-300 ease-in-out shadow-2xl
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-emerald-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500 p-2 rounded-xl">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Klinik Sentosa</h1>
                                <p className="text-xs text-emerald-400 font-bold tracking-wider uppercase">Nurse Panel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-emerald-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="px-6 py-4 bg-emerald-800/50 border-b border-emerald-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {user.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{user.name}</p>
                                <p className="text-xs text-emerald-300 flex items-center gap-1">
                                    <Activity className="w-3 h-3" />
                                    Perawat
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                            ? 'bg-emerald-500 text-white shadow-lg'
                                            : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-semibold">{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-emerald-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-semibold shadow-lg"
                        >
                            <LogOut className="w-5 h-5" />
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                    <div className="px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>

                        <div className="flex-1 lg:flex-none">
                            <h2 className="text-xl font-bold text-gray-800">
                                Pemeriksaan Tanda Vital
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <NotificationDropdown />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 px-4 lg:px-8 py-6 overflow-y-auto">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 px-4 lg:px-8 py-4">
                    <p className="text-sm text-gray-600 text-center">
                        © 2025 Klinik Sentosa - Nurse Panel
                    </p>
                </footer>
            </div>
        </div>
    )
}
