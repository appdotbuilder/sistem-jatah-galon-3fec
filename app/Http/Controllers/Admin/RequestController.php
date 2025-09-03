<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GallonRequest;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    /**
     * Display a listing of requests.
     */
    public function index(Request $request)
    {
        $request->validate([
            'date' => 'sometimes|date',
            'status' => 'sometimes|in:pending,approved,completed',
        ]);

        $query = GallonRequest::with(['employee']);

        if ($request->has('date')) {
            $query->whereDate('requested_at', $request->date);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $requests = $query->orderBy('requested_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $requests->map(function ($request) {
                return [
                    'id' => $request->id,
                    'employee' => [
                        'name' => $request->employee->name,
                        'employee_id' => $request->employee->employee_id,
                        'grade' => $request->employee->grade,
                    ],
                    'quantity' => $request->quantity,
                    'type' => $request->type,
                    'status' => $request->status,
                    'requested_at' => $request->requested_at->format('Y-m-d H:i:s'),
                    'approved_at' => $request->approved_at?->format('Y-m-d H:i:s'),
                    'completed_at' => $request->completed_at?->format('Y-m-d H:i:s'),
                    'notes' => $request->notes,
                ];
            }),
        ]);
    }

    /**
     * Update the specified resource in storage (approve request).
     */
    public function update(Request $request, GallonRequest $gallonRequest)
    {
        if ($gallonRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Request is not in pending status.',
            ], 400);
        }

        $gallonRequest->update([
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Request approved successfully.',
        ]);
    }
}