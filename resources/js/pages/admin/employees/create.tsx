import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';



export default function CreateEmployee() {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        name: '',
        email: '',
        phone: '',
        grade: 'G7',
        department: '',
        status: 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.employees.store'));
    };

    const grades = [
        { value: 'G7', label: 'G7 (24 gallons/month)' },
        { value: 'G8', label: 'G8 (24 gallons/month)' },
        { value: 'G9', label: 'G9 (12 gallons/month)' },
        { value: 'G10', label: 'G10 (10 gallons/month)' },
        { value: 'G11', label: 'G11 (7 gallons/month)' },
        { value: 'G12', label: 'G12 (7 gallons/month)' },
        { value: 'G13', label: 'G13 (7 gallons/month)' },
    ];

    return (
        <AppShell>
            <Head title="Add Employee - Sistem Jatah Galon" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            ➕ Add New Employee
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Tambahkan karyawan baru ke sistem jatah galon
                        </p>
                    </div>
                    
                    <Link
                        href="/admin/employees"
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        ← Back to Employees
                    </Link>
                </div>

                {/* Form */}
                <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Employee Information
                        </h3>
                    </div>
                    
                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Employee ID */}
                            <div>
                                <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Employee ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="employee_id"
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                    placeholder="e.g., EMP1001"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                {errors.employee_id && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employee_id}</p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter full name"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="employee@company.com"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="081234567890"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                                )}
                            </div>

                            {/* Grade */}
                            <div>
                                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Grade <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="grade"
                                    value={data.grade}
                                    onChange={(e) => setData('grade', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    {grades.map((grade) => (
                                        <option key={grade.value} value={grade.value}>
                                            {grade.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.grade && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.grade}</p>
                                )}
                            </div>

                            {/* Department */}
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    id="department"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    placeholder="e.g., IT, HR, Finance"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                {errors.department && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department}</p>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                            <Link
                                href="/admin/employees"
                                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {processing ? '🔄 Creating...' : '✅ Create Employee'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Grade Information */}
                <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900">
                    <h3 className="mb-3 text-lg font-bold text-blue-900 dark:text-blue-100">
                        📊 Grade & Quota Information:
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-white p-4 dark:bg-blue-800">
                            <div className="text-center">
                                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">G7 & G8</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">24 gallons/month</div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white p-4 dark:bg-blue-800">
                            <div className="text-center">
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">G9</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">12 gallons/month</div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white p-4 dark:bg-blue-800">
                            <div className="text-center">
                                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">G10</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">10 gallons/month</div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white p-4 dark:bg-blue-800">
                            <div className="text-center">
                                <div className="text-lg font-bold text-red-600 dark:text-red-400">G11-G13</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">7 gallons/month</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}