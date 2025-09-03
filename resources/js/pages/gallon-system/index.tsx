import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

interface EmployeeData {
    employee: {
        id: number;
        employee_id: string;
        name: string;
        grade: string;
        department: string;
    };
    quota: {
        monthly: number;
        used: number;
        remaining: number;
        month: string;
    };
    history: Array<{
        id: number;
        date: string;
        time: string;
        year: string;
        month: string;
        quantity: number;
    }>;
}

export default function GallonSystemIndex() {
    const [employeeId, setEmployeeId] = useState('');
    const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
    const [requestQuantity, setRequestQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState<'check' | 'request'>('check');

    const checkQuota = async () => {
        if (!employeeId.trim()) {
            setError('Please enter Employee ID');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/quota?employee_id=${encodeURIComponent(employeeId)}`);

            const data = await response.json();

            if (data.success) {
                setEmployeeData(data.data);
                setSuccess('Quota data loaded successfully');
            } else {
                setError(data.message);
                setEmployeeData(null);
            }
        } catch {
            setError('Error connecting to server');
            setEmployeeData(null);
        } finally {
            setLoading(false);
        }
    };

    const submitRequest = async () => {
        if (!employeeId.trim()) {
            setError('Please enter Employee ID');
            return;
        }

        if (requestQuantity < 1 || requestQuantity > 10) {
            setError('Quantity must be between 1 and 10');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/gallon-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    employee_id: employeeId,
                    quantity: requestQuantity 
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Request submitted successfully! Request ID: ${data.data.request_id}`);
                setRequestQuantity(1);
            } else {
                setError(data.message);
            }
        } catch {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Gallon System - Check Quota & Request" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-indigo-900">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                                <span className="text-4xl">🚰</span>
                            </div>
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                            Sistem Jatah Galon
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Cek kuota dan request galon dengan mudah
                        </p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex rounded-lg bg-white p-1 shadow-md dark:bg-gray-800">
                            <button
                                onClick={() => setActiveTab('check')}
                                className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
                                    activeTab === 'check'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                                }`}
                            >
                                🔍 Cek Kuota
                            </button>
                            <button
                                onClick={() => setActiveTab('request')}
                                className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
                                    activeTab === 'request'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                                }`}
                            >
                                📝 Request Galon
                            </button>
                        </div>
                    </div>

                    {/* Employee ID Input */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                        <div className="mb-4">
                            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Employee ID
                            </label>
                            <div className="mt-1 flex">
                                <input
                                    type="text"
                                    id="employeeId"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    placeholder="Masukkan Employee ID atau scan QR"
                                    className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                <button
                                    onClick={() => {
                                        // QR Scanner simulation - in real app, integrate with QR scanner library
                                        const mockId = 'EMP' + Math.floor(Math.random() * 9000 + 1000);
                                        setEmployeeId(mockId);
                                    }}
                                    className="rounded-r-lg border border-l-0 border-gray-300 bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200 focus:outline-none dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                                >
                                    📱 QR Scan
                                </button>
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-300">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900 dark:text-green-300">
                                {success}
                            </div>
                        )}

                        {/* Tab Content */}
                        {activeTab === 'check' && (
                            <div>
                                <button
                                    onClick={checkQuota}
                                    disabled={loading}
                                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {loading ? '🔄 Loading...' : '🔍 Cek Kuota'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'request' && (
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Jumlah Galon
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={requestQuantity}
                                        onChange={(e) => setRequestQuantity(parseInt(e.target.value) || 1)}
                                        min={1}
                                        max={10}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <button
                                    onClick={submitRequest}
                                    disabled={loading}
                                    className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {loading ? '🔄 Submitting...' : '📝 Submit Request'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Employee Data Display */}
                    {employeeData && (
                        <div className="space-y-6">
                            {/* Employee Info */}
                            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                    👤 Data Karyawan
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Nama:</span>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {employeeData.employee.name}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Employee ID:</span>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {employeeData.employee.employee_id}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Grade:</span>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {employeeData.employee.grade}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Department:</span>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {employeeData.employee.department}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quota Info */}
                            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                    📊 Kuota Bulan {employeeData.quota.month}
                                </h3>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {employeeData.quota.monthly}
                                            </div>
                                            <div className="text-sm text-blue-600 dark:text-blue-400">Kuota Bulanan</div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                {employeeData.quota.used}
                                            </div>
                                            <div className="text-sm text-red-600 dark:text-red-400">Sudah Digunakan</div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {employeeData.quota.remaining}
                                            </div>
                                            <div className="text-sm text-green-600 dark:text-green-400">Sisa Kuota</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* History */}
                            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                    📋 Riwayat Penggunaan
                                </h3>
                                {employeeData.history.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full table-auto">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Tanggal
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Waktu
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Jumlah
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Bulan
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeData.history.map((item) => (
                                                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700">
                                                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                                                            {item.date}
                                                        </td>
                                                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                                                            {item.time}
                                                        </td>
                                                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                                                            {item.quantity} galon
                                                        </td>
                                                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                                                            {item.month}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400">
                                        Belum ada riwayat penggunaan galon
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Back to Home */}
                    <div className="mt-8 text-center">
                        <a
                            href="/"
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            ← Kembali ke Beranda
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}