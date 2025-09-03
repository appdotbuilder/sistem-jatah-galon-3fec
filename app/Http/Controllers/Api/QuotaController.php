<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\GallonRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;

class QuotaController extends Controller
{
    /**
     * Display employee quota information.
     */
    public function show(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string',
        ]);

        $employee = Employee::where('employee_id', $request->employee_id)
            ->where('status', 'active')
            ->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found or inactive.',
            ], 404);
        }

        $currentMonth = Carbon::now()->format('Y-m');
        $monthlyQuota = $employee->monthly_quota;
        $usedQuota = $employee->getUsedQuota($currentMonth);
        $remainingQuota = $employee->getRemainingQuota($currentMonth);

        // Get complete history
        $history = GallonRequest::with('employee')
            ->where('employee_id', $employee->id)
            ->where('type', 'output')
            ->where('status', 'completed')
            ->orderBy('completed_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'date' => $request->completed_at->format('Y-m-d'),
                    'time' => $request->completed_at->format('H:i:s'),
                    'year' => $request->completed_at->format('Y'),
                    'month' => $request->month,
                    'quantity' => $request->quantity,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'employee' => [
                    'id' => $employee->id,
                    'employee_id' => $employee->employee_id,
                    'name' => $employee->name,
                    'grade' => $employee->grade,
                    'department' => $employee->department,
                ],
                'quota' => [
                    'monthly' => $monthlyQuota,
                    'used' => $usedQuota,
                    'remaining' => $remainingQuota,
                    'month' => $currentMonth,
                ],
                'history' => $history,
            ],
        ]);
    }
}