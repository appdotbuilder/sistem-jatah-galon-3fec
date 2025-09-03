<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\GallonRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;

class GallonRequestController extends Controller
{
    /**
     * Store a new gallon request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string|exists:employees,employee_id',
            'quantity' => 'required|integer|min:1|max:10',
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

        $gallonRequest = GallonRequest::create([
            'employee_id' => $employee->id,
            'quantity' => $request->quantity,
            'type' => 'input',
            'status' => 'pending',
            'requested_at' => now(),
            'month' => $currentMonth,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Request submitted successfully.',
            'data' => [
                'request_id' => $gallonRequest->id,
                'employee' => [
                    'name' => $employee->name,
                    'employee_id' => $employee->employee_id,
                ],
                'quantity' => $gallonRequest->quantity,
            ],
        ]);
    }

    /**
     * Display pending requests for employee.
     */
    public function index(Request $request)
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

        $pendingRequests = GallonRequest::where('employee_id', $employee->id)
            ->where('status', 'approved')
            ->where('type', 'input')
            ->orderBy('approved_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'quantity' => $request->quantity,
                    'requested_at' => $request->requested_at->format('Y-m-d H:i:s'),
                    'approved_at' => $request->approved_at?->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'employee' => [
                    'name' => $employee->name,
                    'employee_id' => $employee->employee_id,
                ],
                'pending_requests' => $pendingRequests,
            ],
        ]);
    }

    /**
     * Update request status (confirm pickup).
     */
    public function update(Request $request, GallonRequest $gallonRequest)
    {
        $request->validate([
            'employee_id' => 'required|string|exists:employees,employee_id',
        ]);

        $employee = Employee::where('employee_id', $request->employee_id)
            ->where('status', 'active')
            ->first();

        if (!$employee || $gallonRequest->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found or request mismatch.',
            ], 404);
        }

        if ($gallonRequest->status !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Approved request not found.',
            ], 404);
        }

        $currentMonth = Carbon::now()->format('Y-m');
        
        // Check quota for output requests
        if ($gallonRequest->type === 'input') {
            $currentUsed = $employee->getUsedQuota($currentMonth);
            if (($currentUsed + $gallonRequest->quantity) > $employee->monthly_quota) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pickup would exceed monthly quota.',
                ], 400);
            }

            // Create corresponding output request
            $outputRequest = GallonRequest::create([
                'employee_id' => $employee->id,
                'quantity' => $gallonRequest->quantity,
                'type' => 'output',
                'status' => 'completed',
                'requested_at' => $gallonRequest->requested_at,
                'approved_at' => $gallonRequest->approved_at,
                'completed_at' => now(),
                'month' => $currentMonth,
                'notes' => "Pickup for request #{$gallonRequest->id}",
            ]);

            // Mark original input request as completed
            $gallonRequest->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pickup confirmed successfully.',
                'data' => [
                    'employee' => [
                        'name' => $employee->name,
                        'employee_id' => $employee->employee_id,
                    ],
                    'quantity' => $gallonRequest->quantity,
                    'pickup_id' => $outputRequest->id,
                ],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid request type for pickup.',
        ], 400);
    }
}