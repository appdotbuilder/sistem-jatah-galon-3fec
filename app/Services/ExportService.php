<?php

namespace App\Services;

use App\Models\GallonRequest;
use Carbon\Carbon;

class ExportService
{
    /**
     * Export daily requests data as CSV array.
     *
     * @param string $date
     * @return array
     */
    public function exportDailyRequests(string $date): array
    {
        $requests = GallonRequest::with(['employee'])
            ->whereDate('requested_at', $date)
            ->orderBy('requested_at', 'desc')
            ->get();

        $data = [
            [
                'Request ID',
                'Employee ID',
                'Employee Name',
                'Grade',
                'Department',
                'Quantity',
                'Type',
                'Status',
                'Requested At',
                'Approved At',
                'Completed At',
                'Notes',
            ]
        ];

        foreach ($requests as $request) {
            $data[] = [
                $request->id,
                $request->employee->employee_id,
                $request->employee->name,
                $request->employee->grade,
                $request->employee->department,
                $request->quantity,
                $request->type,
                $request->status,
                $request->requested_at->format('Y-m-d H:i:s'),
                $request->approved_at?->format('Y-m-d H:i:s') ?? 'N/A',
                $request->completed_at?->format('Y-m-d H:i:s') ?? 'N/A',
                $request->notes ?? 'N/A',
            ];
        }

        return $data;
    }

    /**
     * Export historical data as CSV array.
     *
     * @param string $startMonth
     * @param string $endMonth
     * @return array
     */
    public function exportHistoricalData(string $startMonth, string $endMonth): array
    {
        $startDate = Carbon::createFromFormat('Y-m', $startMonth)->startOfMonth();
        $endDate = Carbon::createFromFormat('Y-m', $endMonth)->endOfMonth();

        $requests = GallonRequest::with(['employee'])
            ->whereBetween('requested_at', [$startDate, $endDate])
            ->whereIn('type', ['input', 'output'])
            ->orderBy('requested_at', 'desc')
            ->get();

        $data = [
            [
                'Request ID',
                'Employee ID',
                'Employee Name',
                'Grade',
                'Department',
                'Quantity',
                'Type',
                'Status',
                'Month',
                'Requested At',
                'Approved At',
                'Completed At',
                'Notes',
            ]
        ];

        foreach ($requests as $request) {
            $data[] = [
                $request->id,
                $request->employee->employee_id,
                $request->employee->name,
                $request->employee->grade,
                $request->employee->department,
                $request->quantity,
                $request->type,
                $request->status,
                $request->month,
                $request->requested_at->format('Y-m-d H:i:s'),
                $request->approved_at?->format('Y-m-d H:i:s') ?? 'N/A',
                $request->completed_at?->format('Y-m-d H:i:s') ?? 'N/A',
                $request->notes ?? 'N/A',
            ];
        }

        return $data;
    }

    /**
     * Generate CSV response.
     *
     * @param array $data
     * @param string $filename
     * @return \Illuminate\Http\Response
     */
    public function generateCsvResponse(array $data, string $filename)
    {
        $csv = '';
        foreach ($data as $row) {
            $csv .= implode(',', array_map(function ($field) {
                return '"' . str_replace('"', '""', $field) . '"';
            }, $row)) . "\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }
}