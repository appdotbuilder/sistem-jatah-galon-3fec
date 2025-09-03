<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\GallonRequest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class GallonSystemSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create sample employees
        $employees = [
            [
                'employee_id' => 'EMP1001',
                'name' => 'Ahmad Santoso',
                'email' => 'ahmad.santoso@company.com',
                'phone' => '081234567890',
                'grade' => 'G7',
                'department' => 'IT',
                'status' => 'active',
            ],
            [
                'employee_id' => 'EMP1002',
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@company.com',
                'phone' => '081234567891',
                'grade' => 'G8',
                'department' => 'HR',
                'status' => 'active',
            ],
            [
                'employee_id' => 'EMP1003',
                'name' => 'Budi Pratama',
                'email' => 'budi.pratama@company.com',
                'phone' => '081234567892',
                'grade' => 'G9',
                'department' => 'Finance',
                'status' => 'active',
            ],
            [
                'employee_id' => 'EMP1004',
                'name' => 'Dewi Sartika',
                'email' => 'dewi.sartika@company.com',
                'phone' => '081234567893',
                'grade' => 'G10',
                'department' => 'Marketing',
                'status' => 'active',
            ],
            [
                'employee_id' => 'EMP1005',
                'name' => 'Rizki Ramadhan',
                'email' => 'rizki.ramadhan@company.com',
                'phone' => '081234567894',
                'grade' => 'G11',
                'department' => 'Operations',
                'status' => 'active',
            ],
            [
                'employee_id' => 'EMP1006',
                'name' => 'Maya Sari',
                'email' => 'maya.sari@company.com',
                'phone' => '081234567895',
                'grade' => 'G12',
                'department' => 'Legal',
                'status' => 'inactive',
            ],
        ];

        foreach ($employees as $employeeData) {
            Employee::create($employeeData);
        }

        // Create sample gallon requests
        $currentMonth = Carbon::now()->format('Y-m');
        $lastMonth = Carbon::now()->subMonth()->format('Y-m');
        
        $employees = Employee::all();
        
        foreach ($employees as $employee) {
            // Create some historical requests (last month)
            for ($i = 0; $i < random_int(2, 5); $i++) {
                $requestDate = Carbon::now()->subMonth()->addDays(random_int(1, 28));
                
                GallonRequest::create([
                    'employee_id' => $employee->id,
                    'quantity' => random_int(1, 3),
                    'type' => 'input',
                    'status' => 'completed',
                    'requested_at' => $requestDate,
                    'approved_at' => $requestDate->copy()->addHours(random_int(1, 4)),
                    'completed_at' => $requestDate->copy()->addHours(random_int(5, 8)),
                    'month' => $lastMonth,
                    'notes' => 'Sample historical request',
                ]);
                
                // Create corresponding output request
                GallonRequest::create([
                    'employee_id' => $employee->id,
                    'quantity' => random_int(1, 3),
                    'type' => 'output',
                    'status' => 'completed',
                    'requested_at' => $requestDate,
                    'approved_at' => $requestDate->copy()->addHours(random_int(1, 4)),
                    'completed_at' => $requestDate->copy()->addHours(random_int(5, 8)),
                    'month' => $lastMonth,
                    'notes' => 'Sample pickup completion',
                ]);
            }
            
            // Create some current month requests
            for ($i = 0; $i < random_int(1, 3); $i++) {
                $status = ['pending', 'approved', 'completed'][random_int(0, 2)];
                $requestDate = Carbon::now()->subDays(random_int(1, 15));
                $approvedAt = $status !== 'pending' ? $requestDate->copy()->addHours(random_int(1, 4)) : null;
                $completedAt = $status === 'completed' ? $requestDate->copy()->addHours(random_int(5, 8)) : null;
                
                GallonRequest::create([
                    'employee_id' => $employee->id,
                    'quantity' => random_int(1, 4),
                    'type' => 'input',
                    'status' => $status,
                    'requested_at' => $requestDate,
                    'approved_at' => $approvedAt,
                    'completed_at' => $completedAt,
                    'month' => $currentMonth,
                    'notes' => $status === 'approved' ? 'Ready for preparation' : null,
                ]);
                
                // Create corresponding output if completed
                if ($status === 'completed') {
                    GallonRequest::create([
                        'employee_id' => $employee->id,
                        'quantity' => random_int(1, 4),
                        'type' => 'output',
                        'status' => 'completed',
                        'requested_at' => $requestDate,
                        'approved_at' => $approvedAt,
                        'completed_at' => $completedAt,
                        'month' => $currentMonth,
                        'notes' => 'Pickup completed',
                    ]);
                }
            }
        }

        $this->command->info('Gallon system sample data created successfully!');
    }
}