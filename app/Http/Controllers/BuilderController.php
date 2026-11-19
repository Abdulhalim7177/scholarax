<?php

namespace App\Http\Controllers;

use App\Models\CvSopDocument;
use App\Support\BuilderData;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BuilderController extends Controller
{
    /**
     * Display the CV and statement of purpose builder.
     */
    public function index(): Response
    {
        return Inertia::render('cv-sop-builder', BuilderData::page(request()->user()));
    }

    /**
     * Display a read-only preview of a saved builder document.
     */
    public function preview(CvSopDocument $document): Response
    {
        Gate::authorize('view', $document);

        return Inertia::render('builder-preview', [
            'document' => BuilderData::document($document),
        ]);
    }
}
