<?php

namespace App\Http\Controllers;

use App\Support\AdminData;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin overview.
     */
    public function __invoke(): Response
    {
        return Inertia::render('admin-dashboard', AdminData::dashboard());
    }
}
