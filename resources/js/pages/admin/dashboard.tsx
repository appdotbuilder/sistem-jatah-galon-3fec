import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface DailyRequest {
    id: number;
    employee: {
        name: string;
        employee_id: string;
        grade: string;
    };
    quantity: number;
    type: string;
    status: string;
    requested_at: string;
    notes?: string;
}

interface Stats {
    total_requests_today: number;
    pending_requests: number;
    approved_requests: number;
    completed_requests: number;
}

interface Props {
    dailyRequests: DailyRequest[];
    stats: Stats;
    [key: string]: unknown;
}

export default function AdminDashboard({ dailyRequests: initialRequests, stats: initialStats }: Props) {
    const [requests, setRequests] = useState<DailyRequest[]>(initialRequests);
    const [stats, setStats] = useState<Stats>(initialStats);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const fetchRequests = async (date: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/requests?date=${date}`);
            const data = await response.json();
            
            if (data.success) {
                setRequests(data.data);
                // Update stats based on filtered data
                const newStats = {
                    total_requests_today: data.data.length,
                    pending_requests: data.data.filter((r: DailyRequest) => r.status === 'pending').length,
                    approved_requests: data.data.filter((r: DailyRequest) => r.status === 'approved').length,
                    completed_requests: data.data.filter((r: DailyRequest) => r.status === 'completed').length,
                };
                setStats(newStats);
            }
        } catch {
            setError('Error fetching requests');
        } finally {
            setLoading(false);
        }
    };

    const approveRequest = async (requestId: number) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/admin/requests/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Request approved successfully');
                // Refresh the current date's data
                fetchRequests(selectedDate);
            } else {
                setError(data.message);
            }
        } catch {
            setError('Error approving request');
        } finally {
            setLoading(false);
        }
    };

    const downloadDailyReport = () => {
        const url = `/admin/reports/daily?date=${selectedDate}`;
        window.open(url, '_blank');
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const getTypeIcon = (type: string) => {
        return type === 'input' ? '📥' : '📤';
    };

    return (
        <AppShell>
            <Head title="Admin Dashboard - Sistem Jatah Galon" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            🏢 Admin Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Kelola dan verifikasi semua request galon harian
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                fetchRequests(e.target.value);
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            onClick={downloadDailyReport}
                            className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            📊 Download Excel
                        </button>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-300">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {success}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_requests_today}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
                                <span className="text-2xl">⏳</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending_requests}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                <span className="text-2xl">✅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.approved_requests}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                <span className="text-2xl">🎉</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed_requests}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            📋 Daily Requests - {new Date(selectedDate).toLocaleDateString()}
                        </h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <span className="text-2xl">🔄</span>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
                            </div>
                        ) : requests.length > 0 ? (
                            <table className="w-full table-auto">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Type & Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Requested At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {requests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            {request.employee.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {request.employee.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {request.employee.employee_id} - {request.employee.grade}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">{getTypeIcon(request.type)}</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {request.quantity} galon
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                    {request.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {request.requested_at}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {request.status === 'pending' && (
                                                    <button
                                                        onClick={() => approveRequest(request.id)}
                                                        disabled={loading}
                                                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                )}
                                                {request.status === 'approved' && (
                                                    <span className="text-xs text-blue-600 dark:text-blue-400">
                                                        Ready for pickup
                                                    </span>
                                                )}
                                                {request.status === 'completed' && (
                                                    <span className="text-xs text-green-600 dark:text-green-400">
                                                        Completed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center">
                                <span className="text-4xl">📭</span>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    No requests found for {new Date(selectedDate).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Historical Reports */}
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                        📈 Historical Reports
                    </h3>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <input
                            type="month"
                            id="start-month"
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <span className="flex items-center text-gray-500">to</span>
                        <input
                            type="month"
                            id="end-month"
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            onClick={() => {
                                const startMonth = (document.getElementById('start-month') as HTMLInputElement).value;
                                const endMonth = (document.getElementById('end-month') as HTMLInputElement).value;
                                if (startMonth && endMonth) {
                                    const url = `/admin/reports/historical?type=historical&start_month=${startMonth}&end_month=${endMonth}`;
                                    window.open(url, '_blank');
                                }
                            }}
                            className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                            📊 Download Historical Data
                        </button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}