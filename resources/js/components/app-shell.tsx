import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

interface AppShellProps {
    children: React.ReactNode;
    variant?: string;
}

export function AppShell({ children, variant }: AppShellProps) {
    const { auth } = usePage<SharedData>().props;
    
    // Handle different variants for compatibility
    if (variant === 'sidebar') {
        // Return a basic wrapper for sidebar variant
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>;
    }

    const navigation = [
        { name: '🏢 Admin Dashboard', href: '/admin', current: location.pathname === '/admin' },
        { name: '👥 Employee Management', href: '/admin/employees', current: location.pathname.startsWith('/admin/employees') },
        { name: '🏭 Warehouse Admin', href: '/admin/warehouse', current: location.pathname.startsWith('/admin/warehouse') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation */}
            <nav className="bg-white shadow-sm dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <Link href="/" className="flex items-center space-x-2">
                                    <div className="rounded-lg bg-blue-600 p-2">
                                        <span className="text-white">🚰</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        Sistem Jatah Galon
                                    </span>
                                </Link>
                            </div>
                            <div className="ml-6 flex space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                                            item.current
                                                ? 'border-blue-500 text-gray-900 dark:text-white'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                🏠 Public Site
                            </Link>
                            
                            {auth.user && (
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Welcome, {auth.user.name}
                                    </span>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
