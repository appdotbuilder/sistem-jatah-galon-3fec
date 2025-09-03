import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface ApprovedRequest {
    id: number;
    employee: {
        name: string;
        employee_id: string;
        grade: string;
        department: string;
    };
    quantity: number;
    requested_at: string;
    approved_at: string;
    notes?: string;
}

interface Stats {
    total_approved: number;
    total_quantity: number;
}

interface Props {
    approvedRequests: ApprovedRequest[];
    stats: Stats;
    [key: string]: unknown;
}

export default function WarehouseIndex({ approvedRequests: initialRequests, stats: initialStats }: Props) {
    const [requests, setRequests] = useState<ApprovedRequest[]>(initialRequests);
    const [stats] = useState<Stats>(initialStats);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const confirmPreparation = async (requestId: number) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/warehouse/requests/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Gallon preparation confirmed successfully');
                // Remove the confirmed request from the list or refresh data
                setRequests(requests.map(req => 
                    req.id === requestId 
                        ? { ...req, notes: (req.notes || '') + ' | Prepared for pickup at ' + new Date().toLocaleString() }
                        : req
                ));
            } else {
                setError(data.message);
            }
        } catch {
            setError('Error confirming preparation');
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/warehouse/requests/pending');
            const data = await response.json();
            
            if (data.success) {
                setRequests(data.data);
            }
        } catch {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const isAlreadyPrepared = (notes?: string) => {
        return notes && notes.includes('Prepared for pickup');
    };

    return (
        <AppShell>
            <Head title="Warehouse Admin - Sistem Jatah Galon" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            🏭 Admin Gudang
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Konfirmasi persiapan galon untuk pickup karyawan
                        </p>
                    </div>
                    
                    <button
                        onClick={refreshData}
                        disabled={loading}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? '🔄' : '🔄'} Refresh
                    </button>
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
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Approved Requests</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_approved}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                                <span className="text-2xl">🚰</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gallons to Prepare</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.total_quantity}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Approved Requests List */}
                <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            📋 Approved Requests Needing Preparation
                        </h3>
                    </div>
                    
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center">
                                <span className="text-2xl">🔄</span>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
                            </div>
                        ) : requests.length > 0 ? (
                            <div className="space-y-4">
                                {requests.map((request) => (
                                    <div
                                        key={request.id}
                                        className={`rounded-lg border p-6 ${
                                            isAlreadyPrepared(request.notes)
                                                ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900'
                                                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {/* Employee Avatar */}
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {request.employee.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                
                                                {/* Request Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {request.employee.name}
                                                        </h4>
                                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                            {request.employee.grade}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                        ID: {request.employee.employee_id} • Department: {request.employee.department}
                                                    </div>
                                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span>📅 Requested: {new Date(request.requested_at).toLocaleDateString()}</span>
                                                        <span>✅ Approved: {new Date(request.approved_at).toLocaleDateString()}</span>
                                                    </div>
                                                    {request.notes && (
                                                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                            📝 Notes: {request.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity and Action */}
                                            <div className="flex items-center space-x-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                        {request.quantity}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">gallons</div>
                                                </div>
                                                
                                                {isAlreadyPrepared(request.notes) ? (
                                                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                                        <span className="text-2xl">✅</span>
                                                        <span className="text-sm font-medium">Prepared</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => confirmPreparation(request.id)}
                                                        disabled={loading}
                                                        className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                                                    >
                                                        <span className="mr-1">📦</span>
                                                        Confirm Prepared
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <span className="text-4xl">📭</span>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    No approved requests needing preparation
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900">
                    <h3 className="mb-3 text-lg font-bold text-blue-900 dark:text-blue-100">
                        ℹ️ Warehouse Instructions:
                    </h3>
                    <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                        <li className="flex items-start">
                            <span className="mr-2 mt-0.5 text-blue-600">1.</span>
                            Check approved requests that need gallon preparation
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 mt-0.5 text-blue-600">2.</span>
                            Verify stock availability for the requested quantity
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 mt-0.5 text-blue-600">3.</span>
                            Prepare the gallons and place them in the designated pickup area
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 mt-0.5 text-blue-600">4.</span>
                            Click "Confirm Prepared" to notify that gallons are ready for pickup
                        </li>
                    </ul>
                </div>
            </div>
        </AppShell>
    );
}