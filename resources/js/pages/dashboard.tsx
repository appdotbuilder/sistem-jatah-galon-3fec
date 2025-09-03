import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Dashboard() {
    useEffect(() => {
        // Redirect authenticated users to admin dashboard
        router.visit('/admin');
    }, []);

    return (
        <>
            <Head title="Dashboard - Redirecting..." />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">🔄</div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Admin Dashboard...</h1>
                    <p className="text-gray-600">Please wait while we redirect you.</p>
                </div>
            </div>
        </>
    );
}