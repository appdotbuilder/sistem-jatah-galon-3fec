<?php

use App\Http\Controllers\GallonSystemController;
use App\Http\Controllers\Api\QuotaController;
use App\Http\Controllers\Api\GallonRequestController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\WarehouseController;
use App\Http\Controllers\Admin\RequestController;
use App\Http\Controllers\Admin\ReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public Gallon System Routes
Route::controller(GallonSystemController::class)->group(function () {
    Route::get('/gallon-system', 'index')->name('gallon-system.index');
    Route::get('/gallon-system/pickup', 'show')->name('gallon-system.pickup');
});

// API Routes for public features
Route::prefix('api')->middleware(['web'])->group(function () {
    Route::get('/quota', [QuotaController::class, 'show']);
    Route::resource('gallon-requests', GallonRequestController::class, ['only' => ['index', 'store', 'update']]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Admin Dashboard
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        
        // Reports
        Route::get('/reports/{type}', [ReportController::class, 'show'])->name('reports.show');
        
        // Employee Management (HR Admin)
        Route::resource('employees', EmployeeController::class);
        
        // Warehouse Management
        Route::prefix('warehouse')->name('warehouse.')->controller(WarehouseController::class)->group(function () {
            Route::get('/', 'index')->name('index');
        });
    });
    
    // API Routes for admin features
    Route::prefix('api')->middleware(['web'])->group(function () {
        Route::prefix('admin')->group(function () {
            Route::resource('requests', RequestController::class, ['only' => ['index', 'update']]);
        });
        
        Route::prefix('warehouse')->group(function () {
            Route::resource('requests', WarehouseController::class, ['only' => ['show', 'update']]);
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
