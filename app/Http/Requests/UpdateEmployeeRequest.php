<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $employeeId = $this->route('employee')->id;
        
        return [
            'employee_id' => 'required|string|max:20|unique:employees,employee_id,' . $employeeId,
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,' . $employeeId,
            'phone' => 'nullable|string|max:20',
            'grade' => 'required|in:G7,G8,G9,G10,G11,G12,G13',
            'department' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.required' => 'Employee ID is required.',
            'employee_id.unique' => 'This employee ID is already registered to another employee.',
            'name.required' => 'Employee name is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered to another employee.',
            'grade.required' => 'Employee grade is required.',
            'grade.in' => 'Please select a valid grade.',
        ];
    }
}