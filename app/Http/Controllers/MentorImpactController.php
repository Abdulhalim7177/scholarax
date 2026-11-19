<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\EnsuresMentorProfile;
use App\Support\MentorWorkspaceData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MentorImpactController extends Controller
{
    use EnsuresMentorProfile;

    /**
     * Display the mentor impact report.
     */
    public function __invoke(Request $request): Response
    {
        $profile = $this->mentorProfileFor($request->user());
        $profile->loadMissing('user');

        return Inertia::render('mentor-impact', MentorWorkspaceData::impact($profile));
    }

    /**
     * Download the mentor impact report as a CSV.
     */
    public function download(Request $request): StreamedResponse
    {
        $profile = $this->mentorProfileFor($request->user());
        $profile->loadMissing('user');

        $impact = MentorWorkspaceData::impact($profile);

        $lines = [
            ['Metric', 'Value'],
            ['Learners supported', $impact['stats']['learners']],
            ['Application progress', $impact['stats']['progress'].'%'],
            ['Average rating', $impact['stats']['rating']],
            ['Reviews', $impact['stats']['reviews']],
            ['Offer rate', $impact['stats']['offerRate'].'%'],
            ['Helpfulness', $impact['helpfulness'].'%'],
            [],
            ['Month', 'Completed sessions'],
        ];

        foreach ($impact['series'] as $point) {
            $lines[] = [$point['label'], $point['value']];
        }

        $lines[] = [];
        $lines[] = ['Learner', 'Quote'];

        foreach ($impact['voices'] as $voice) {
            $lines[] = [$voice['learner'], $voice['quote']];
        }

        $handle = fopen('php://temp', 'r+');
        assert($handle !== false);

        foreach ($lines as $line) {
            fputcsv($handle, $line);
        }

        rewind($handle);
        $csv = (string) stream_get_contents($handle);
        fclose($handle);

        return response()->streamDownload(
            fn () => print $csv,
            'scholarax-mentor-impact.csv',
            ['Content-Type' => 'text/csv'],
        );
    }
}
