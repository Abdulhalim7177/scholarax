<?php

namespace App\Http\Controllers;

use App\Support\HomeData;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public home page.
     */
    public function __invoke(): Response
    {
        return Inertia::render('welcome', HomeData::page());
    }
}
