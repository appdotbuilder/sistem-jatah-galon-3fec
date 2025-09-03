<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Employee
 *
 * @property int $id
 * @property string $employee_id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string $grade
 * @property string|null $department
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GallonRequest> $gallonRequests
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee query()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereDepartment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee active()
 * @method static \Database\Factories\EmployeeFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'name',
        'email',
        'phone',
        'grade',
        'department',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the gallon requests for the employee.
     */
    public function gallonRequests(): HasMany
    {
        return $this->hasMany(GallonRequest::class);
    }

    /**
     * Scope a query to only include active employees.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Get the monthly quota for the employee based on grade.
     *
     * @return int
     */
    public function getMonthlyQuotaAttribute(): int
    {
        return match ($this->grade) {
            'G7', 'G8' => 24,
            'G9' => 12,
            'G10' => 10,
            'G11', 'G12', 'G13' => 7,
            default => 0,
        };
    }

    /**
     * Get the used quota for a specific month.
     *
     * @param  string  $month Format: YYYY-MM
     * @return int
     */
    public function getUsedQuota(string $month): int
    {
        return $this->gallonRequests()
            ->where('month', $month)
            ->where('type', 'output')
            ->where('status', 'completed')
            ->sum('quantity');
    }

    /**
     * Get the remaining quota for a specific month.
     *
     * @param  string  $month Format: YYYY-MM
     * @return int
     */
    public function getRemainingQuota(string $month): int
    {
        return $this->monthly_quota - $this->getUsedQuota($month);
    }
}