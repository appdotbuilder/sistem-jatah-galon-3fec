<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ExportService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Download daily requests report.
     */
    public function show(Request $request, ExportService $exportService)
    {
        $type = $request->get('type', 'daily');
        
        if ($type === 'daily') {
            $date = $request->get('date', Carbon::today()->format('Y-m-d'));
            $data = $exportService->exportDailyRequests($date);
            return $exportService->generateCsvResponse($data, "daily-requests-{$date}.csv");
        }
        
        if ($type === 'historical') {
            $request->validate([
                'start_month' => 'required|date_format:Y-m',
                'end_month' => 'required|date_format:Y-m|after_or_equal:start_month',
            ]);

            $startMonth = $request->start_month;
            $endMonth = $request->end_month;
            $data = $exportService->exportHistoricalData($startMonth, $endMonth);
            
            return $exportService->generateCsvResponse($data, "historical-data-{$startMonth}-to-{$endMonth}.csv");
        }
        
        return response()->json(['error' => 'Invalid report type'], 400);
    }
}