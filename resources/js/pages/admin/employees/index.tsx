import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    email: string;
    phone?: string;
    grade: string;
    department?: string;
    status: string;
    created_at: string;
}

interface Props {
    employees: {
        data: Employee[];
        current_page: number;
        last_page: number;
        total: number;
    };
    [key: string]: unknown;
}

export default function EmployeesIndex({ employees }: Props) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const deleteEmployee = (employeeId: number, employeeName: string) => {
        if (confirm(`Are you sure you want to delete employee ${employeeName}? This action cannot be undone.`)) {
            setLoading(true);
            router.delete(`/admin/employees/${employeeId}`, {
                onSuccess: () => {
                    setSuccess('Employee deleted successfully');
                },
                onError: () => {
                    setError('Error deleting employee');
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        }
    };

    const getStatusBadge = (status: string) => {
        return status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    };

    const getGradeBadge = (grade: string) => {
        const gradeColors = {
            'G7': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            'G8': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            'G9': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'G10': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'G11': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            'G12': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            'G13': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return gradeColors[grade as keyof typeof gradeColors] || 'bg-gray-100 text-gray-800';
    };

    const getQuotaForGrade = (grade: string) => {
        const quotas = {
            'G7': 24, 'G8': 24, 'G9': 12, 'G10': 10, 
            'G11': 7, 'G12': 7, 'G13': 7
        };
        return quotas[grade as keyof typeof quotas] || 0;
    };

    return (
        <AppShell>
            <Head title="Employee Management - Sistem Jatah Galon" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            👥 Employee Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Kelola data karyawan dan kuota galon mereka
                        </p>
                    </div>
                    
                    <Link
                        href="/admin/employees/create"
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <span className="mr-1">➕</span>
                        Add Employee
                    </Link>
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

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{employees.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                <span className="text-2xl">✅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Employees</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {employees.data.filter(emp => emp.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                                <span className="text-2xl">❌</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Employees</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {employees.data.filter(emp => emp.status === 'inactive').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employees Table */}
                <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            📋 Employee List
                        </h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <span className="text-2xl">🔄</span>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
                            </div>
                        ) : employees.data.length > 0 ? (
                            <table className="w-full table-auto">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Contact Info
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Grade & Quota
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {employees.data.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            {employee.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {employee.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {employee.employee_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">{employee.email}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {employee.phone || 'No phone'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getGradeBadge(employee.grade)}`}>
                                                    {employee.grade}
                                                </span>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {getQuotaForGrade(employee.grade)} gallons/month
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {employee.department || 'Not assigned'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge(employee.status)}`}>
                                                    {employee.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <Link
                                                    href={`/admin/employees/${employee.id}`}
                                                    className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                                >
                                                    👁️ View
                                                </Link>
                                                <Link
                                                    href={`/admin/employees/${employee.id}/edit`}
                                                    className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                                                >
                                                    ✏️ Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteEmployee(employee.id, employee.name)}
                                                    disabled={loading}
                                                    className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 disabled:opacity-50"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center">
                                <span className="text-4xl">👥</span>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    No employees found
                                </p>
                                <Link
                                    href="/admin/employees/create"
                                    className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Add First Employee
                                </Link>
                            </div>
                        )}
                    </div>
                    
                    {/* Pagination */}
                    {employees.last_page > 1 && (
                        <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <Link
                                    href={`?page=${employees.current_page - 1}`}
                                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                                        employees.current_page <= 1 ? 'pointer-events-none opacity-50' : ''
                                    }`}
                                >
                                    Previous
                                </Link>
                                <Link
                                    href={`?page=${employees.current_page + 1}`}
                                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                                        employees.current_page >= employees.last_page ? 'pointer-events-none opacity-50' : ''
                                    }`}
                                >
                                    Next
                                </Link>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing page {employees.current_page} of {employees.last_page} ({employees.total} total employees)
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {Array.from({ length: employees.last_page }, (_, i) => i + 1).map((page) => (
                                            <Link
                                                key={page}
                                                href={`?page=${page}`}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    page === employees.current_page
                                                        ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}