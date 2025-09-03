<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\GallonRequest
 *
 * @property int $id
 * @property int $employee_id
 * @property int $quantity
 * @property string $type
 * @property string $status
 * @property \Illuminate\Support\Carbon $requested_at
 * @property \Illuminate\Support\Carbon|null $approved_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property string|null $notes
 * @property string $month
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Employee $employee
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereRequestedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereUpdatedAt($value)
 * @method static \Database\Factories\GallonRequestFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class GallonRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'quantity',
        'type',
        'status',
        'requested_at',
        'approved_at',
        'completed_at',
        'notes',
        'month',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'quantity' => 'integer',
    ];

    /**
     * Get the employee that owns the gallon request.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}