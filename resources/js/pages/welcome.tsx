import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sistem Jatah Galon">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900 lg:justify-center lg:p-8 dark:from-gray-900 dark:to-indigo-900 dark:text-white">
                <header className="mb-8 w-full max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-blue-600 p-2">
                                <span className="text-2xl">🚰</span>
                            </div>
                            <h1 className="text-xl font-bold">Sistem Jatah Galon</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Dashboard Admin
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Masuk Admin
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Daftar Admin
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="w-full max-w-6xl">
                    {/* Hero Section */}
                    <div className="mb-12 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="rounded-full bg-blue-100 p-8 dark:bg-blue-900">
                                <span className="text-6xl">🚰</span>
                            </div>
                        </div>
                        <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
                            Sistem Jatah Galon
                        </h2>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                            Sistem modern untuk mengelola kuota galon karyawan dengan fitur QR scan, 
                            tracking real-time, dan laporan lengkap untuk administrasi yang efisien.
                        </p>
                        
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Link
                                href="/gallon-system"
                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                🔍 Cek Kuota & Request
                            </Link>
                            <Link
                                href="/gallon-system/pickup"
                                className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-white px-8 py-3 text-lg font-medium text-blue-600 shadow-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                            >
                                📦 Konfirmasi Pickup
                            </Link>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* User Features */}
                        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                <span className="text-2xl">👥</span>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Fitur Karyawan</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    Cek kuota bulanan dengan QR scan
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    Request galon dengan mudah
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    History penggunaan lengkap
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    Konfirmasi pickup galon
                                </li>
                            </ul>
                        </div>

                        {/* Admin Features */}
                        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                <span className="text-2xl">👨‍💼</span>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Admin HR & Administrator</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    Kelola data karyawan (CRUD)
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    Verifikasi request harian
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    Download laporan Excel
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    Analisa historical data
                                </li>
                            </ul>
                        </div>

                        {/* Warehouse Features */}
                        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                                <span className="text-2xl">🏭</span>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Admin Gudang</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    Konfirmasi stok tersedia
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    Persiapan galon untuk pickup
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    Track status preparation
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    History persiapan barang
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Quota System */}
                    <div className="mb-12 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-6 text-center">
                            <h3 className="mb-2 text-2xl font-bold">📊 Sistem Kuota Berdasarkan Grade</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Kuota galon disesuaikan dengan grade karyawan dan di-reset setiap awal bulan
                            </p>
                        </div>
                        
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">24</div>
                                    <div className="text-sm opacity-90">Galon/Bulan</div>
                                    <div className="mt-2 text-xs opacity-75">Grade G7 & G8</div>
                                </div>
                            </div>
                            <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">12</div>
                                    <div className="text-sm opacity-90">Galon/Bulan</div>
                                    <div className="mt-2 text-xs opacity-75">Grade G9</div>
                                </div>
                            </div>
                            <div className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-white">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">10</div>
                                    <div className="text-sm opacity-90">Galon/Bulan</div>
                                    <div className="mt-2 text-xs opacity-75">Grade G10</div>
                                </div>
                            </div>
                            <div className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">7</div>
                                    <div className="text-sm opacity-90">Galon/Bulan</div>
                                    <div className="mt-2 text-xs opacity-75">Grade G11-G13</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="mb-12 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                        <h3 className="mb-6 text-center text-2xl font-bold">🔄 Cara Kerja Sistem</h3>
                        
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-900">
                                        1️⃣
                                    </div>
                                </div>
                                <h4 className="mb-2 text-lg font-semibold">Request Galon</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Karyawan scan QR/input ID untuk request galon sesuai kebutuhan
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl dark:bg-green-900">
                                        2️⃣
                                    </div>
                                </div>
                                <h4 className="mb-2 text-lg font-semibold">Approval & Preparation</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Admin approve request, gudang siapkan galon untuk pickup
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl dark:bg-purple-900">
                                        3️⃣
                                    </div>
                                </div>
                                <h4 className="mb-2 text-lg font-semibold">Pickup & Update</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Karyawan konfirmasi pickup, kuota otomatis ter-update
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        <p>© 2024 Sistem Jatah Galon - Kelola kuota galon dengan mudah dan efisien</p>
                    </div>
                </main>
            </div>
        </>
    );
}