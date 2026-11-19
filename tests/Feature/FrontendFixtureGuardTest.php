<?php

use Illuminate\Support\Facades\File;

test('frontend source has no domain fixture imports or coming soon links', function () {
    $files = File::allFiles(resource_path('js'));

    foreach ($files as $file) {
        if (! in_array($file->getExtension(), ['ts', 'tsx'], true)) {
            continue;
        }

        $relative = $file->getRelativePathname();
        $contents = $file->getContents();

        expect(preg_match('/from\s+[\'"][^\'"]*layouts\/[^\'"]*\/data[\'"]/', $contents))
            ->toBe(0, "Domain fixture import found in {$relative}.");

        expect(str_contains($contents, 'coming-soon'))
            ->toBeFalse("Coming soon link found in {$relative}.");
    }

    expect(File::glob(resource_path('js/layouts/*/data.ts')))
        ->toBe([], 'Domain fixture data files must not be reintroduced.');
});
