<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class GallonSystemController extends Controller
{
    /**
     * Display the main gallon system page.
     */
    public function index()
    {
        return Inertia::render('gallon-system/index');
    }

    /**
     * Show the pickup page.
     */
    public function show()
    {
        return Inertia::render('gallon-system/pickup');
    }
}