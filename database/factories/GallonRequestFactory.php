<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GallonRequest>
 */
class GallonRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $requestedAt = fake()->dateTimeBetween('-3 months', 'now');
        
        return [
            'employee_id' => Employee::factory(),
            'quantity' => fake()->numberBetween(1, 5),
            'type' => fake()->randomElement(['input', 'output']),
            'status' => fake()->randomElement(['pending', 'approved', 'completed']),
            'requested_at' => $requestedAt,
            'approved_at' => fake()->boolean(70) ? fake()->dateTimeBetween($requestedAt, 'now') : null,
            'completed_at' => fake()->boolean(50) ? fake()->dateTimeBetween($requestedAt, 'now') : null,
            'notes' => fake()->optional()->sentence(),
            'month' => $requestedAt->format('Y-m'),
        ];
    }

    /**
     * Indicate that the request is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'approved_at' => null,
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the request is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'approved_at' => fake()->dateTimeBetween($attributes['requested_at'], 'now'),
            'completed_at' => fake()->dateTimeBetween($attributes['requested_at'], 'now'),
        ]);
    }
}