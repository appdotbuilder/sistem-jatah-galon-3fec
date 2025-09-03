<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GallonRequest;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;


class AdminController extends Controller
{
    /**
     * Display admin dashboard with daily requests.
     */
    public function index()
    {
        $today = Carbon::today();
        
        $dailyRequests = GallonRequest::with(['employee'])
            ->whereDate('requested_at', $today)
            ->orderBy('requested_at', 'desc')
            ->get();

        $stats = [
            'total_requests_today' => $dailyRequests->count(),
            'pending_requests' => $dailyRequests->where('status', 'pending')->count(),
            'approved_requests' => $dailyRequests->where('status', 'approved')->count(),
            'completed_requests' => $dailyRequests->where('status', 'completed')->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'dailyRequests' => $dailyRequests->map(function ($request) {
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
                    'requested_at' => $request->requested_at->format('H:i:s'),
                    'notes' => $request->notes,
                ];
            }),
            'stats' => $stats,
        ]);
    }


}