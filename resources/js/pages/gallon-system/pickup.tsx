import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

interface PendingRequest {
    id: number;
    quantity: number;
    requested_at: string;
    approved_at: string;
}

interface EmployeeData {
    employee: {
        name: string;
        employee_id: string;
    };
    pending_requests: PendingRequest[];
}

export default function GallonSystemPickup() {
    const [employeeId, setEmployeeId] = useState('');
    const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const checkPendingRequests = async () => {
        if (!employeeId.trim()) {
            setError('Please enter Employee ID');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/gallon-requests?employee_id=${encodeURIComponent(employeeId)}`);

            const data = await response.json();

            if (data.success) {
                setEmployeeData(data.data);
                if (data.data.pending_requests.length === 0) {
                    setError('No pending requests found for this employee');
                }
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

    const confirmPickup = async () => {
        if (!selectedRequest) {
            setError('Please select a request to confirm');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/gallon-requests/${selectedRequest}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    employee_id: employeeId
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Pickup confirmed! Employee: ${data.data.employee.name}, Quantity: ${data.data.quantity} gallons`);
                setSelectedRequest(null);
                // Refresh pending requests
                checkPendingRequests();
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
            <Head title="Gallon System - Confirm Pickup" />
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 dark:from-gray-900 dark:to-emerald-900">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                                <span className="text-4xl">📦</span>
                            </div>
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                            Konfirmasi Pickup Galon
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Verifikasi dan konfirmasi pengambilan galon yang sudah disetujui
                        </p>
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
                                    className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

                        <button
                            onClick={checkPendingRequests}
                            disabled={loading}
                            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? '🔄 Loading...' : '🔍 Cek Request yang Disetujui'}
                        </button>
                    </div>

                    {/* Employee Data & Pending Requests */}
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
                                </div>
                            </div>

                            {/* Pending Requests */}
                            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                    📋 Request yang Siap Diambil
                                </h3>
                                
                                {employeeData.pending_requests.length > 0 ? (
                                    <div className="space-y-4">
                                        {employeeData.pending_requests.map((request) => (
                                            <div
                                                key={request.id}
                                                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                                    selectedRequest === request.id
                                                        ? 'border-green-500 bg-green-50 dark:bg-green-900'
                                                        : 'border-gray-200 hover:border-green-300 dark:border-gray-700'
                                                }`}
                                                onClick={() => setSelectedRequest(request.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <input
                                                            type="radio"
                                                            name="selectedRequest"
                                                            checked={selectedRequest === request.id}
                                                            onChange={() => setSelectedRequest(request.id)}
                                                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                                                        />
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-2xl">🚰</span>
                                                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    {request.quantity} Galon
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                Request ID: #{request.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                                                        <div>Request: {new Date(request.requested_at).toLocaleDateString()}</div>
                                                        <div>Approved: {new Date(request.approved_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Confirm Button */}
                                        <div className="mt-6">
                                            <button
                                                onClick={confirmPickup}
                                                disabled={loading || !selectedRequest}
                                                className="w-full rounded-lg bg-green-600 px-6 py-3 text-lg font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {loading ? '🔄 Processing...' : '✅ Konfirmasi Pickup'}
                                            </button>
                                            {selectedRequest && (
                                                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                                    Anda akan mengonfirmasi pickup untuk request #{selectedRequest}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-700">
                                        <span className="mb-2 block text-4xl">📭</span>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Tidak ada request yang siap diambil saat ini
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="rounded-xl bg-blue-50 p-6 shadow-lg dark:bg-blue-900">
                        <h3 className="mb-3 text-lg font-bold text-blue-900 dark:text-blue-100">
                            ℹ️ Petunjuk Pickup:
                        </h3>
                        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                            <li className="flex items-start">
                                <span className="mr-2 mt-0.5 text-blue-600">1.</span>
                                Scan QR code atau masukkan Employee ID Anda
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 mt-0.5 text-blue-600">2.</span>
                                Pilih request yang ingin diambil dari daftar yang tersedia
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 mt-0.5 text-blue-600">3.</span>
                                Pastikan jumlah galon sesuai dengan yang diminta
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 mt-0.5 text-blue-600">4.</span>
                                Klik "Konfirmasi Pickup" untuk menyelesaikan proses
                            </li>
                        </ul>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-8 text-center">
                        <a
                            href="/"
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            ← Kembali ke Beranda
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}