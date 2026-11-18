<?php

namespace App\Http\Controllers;

use App\Models\CvSopDocument;
use App\Support\BuilderData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BuilderController extends Controller
{
    /**
     * Display the CV and statement of purpose builder.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', CvSopDocument::class);

        return Inertia::render('cv-sop-builder', BuilderData::page($request->user()));
    }
}
