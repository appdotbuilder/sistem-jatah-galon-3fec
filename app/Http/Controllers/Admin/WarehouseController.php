<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GallonRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class WarehouseController extends Controller
{
    /**
     * Display warehouse dashboard with approved requests.
     */
    public function index()
    {
        $approvedRequests = GallonRequest::with(['employee'])
            ->where('status', 'approved')
            ->where('type', 'input')
            ->orderBy('approved_at', 'desc')
            ->get();

        $stats = [
            'total_approved' => $approvedRequests->count(),
            'total_quantity' => $approvedRequests->sum('quantity'),
        ];

        return Inertia::render('admin/warehouse/index', [
            'approvedRequests' => $approvedRequests->map(function ($request) {
                return [
                    'id' => $request->id,
                    'employee' => [
                        'name' => $request->employee->name,
                        'employee_id' => $request->employee->employee_id,
                        'grade' => $request->employee->grade,
                        'department' => $request->employee->department,
                    ],
                    'quantity' => $request->quantity,
                    'requested_at' => $request->requested_at->format('Y-m-d H:i:s'),
                    'approved_at' => $request->approved_at->format('Y-m-d H:i:s'),
                    'notes' => $request->notes,
                ];
            }),
            'stats' => $stats,
        ]);
    }

    /**
     * Update the specified resource in storage (confirm preparation).
     */
    public function update(Request $request, GallonRequest $gallonRequest)
    {
        if ($gallonRequest->status !== 'approved' || $gallonRequest->type !== 'input') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid request for preparation confirmation.',
            ], 400);
        }

        $gallonRequest->update([
            'notes' => ($gallonRequest->notes ? $gallonRequest->notes . ' | ' : '') . 'Prepared for pickup at ' . now()->format('Y-m-d H:i:s'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Gallon preparation confirmed.',
        ]);
    }

    /**
     * Display a listing of requests that need preparation.
     */
    public function show(Request $request, string $type = 'pending')
    {
        if ($type === 'pending') {
            $requests = GallonRequest::with(['employee'])
                ->where('status', 'approved')
                ->where('type', 'input')
                ->where(function ($query) {
                    $query->whereNull('notes')
                        ->orWhere('notes', 'not like', '%Prepared for pickup%');
                })
                ->orderBy('approved_at', 'desc')
                ->get();
        } else {
            $requests = GallonRequest::with(['employee'])
                ->where('status', 'approved')
                ->where('type', 'input')
                ->where('notes', 'like', '%Prepared for pickup%')
                ->orderBy('approved_at', 'desc')
                ->get();
        }

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
                    'approved_at' => $request->approved_at->format('Y-m-d H:i:s'),
                    'notes' => $request->notes,
                ];
            }),
        ]);
    }
}