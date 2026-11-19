<?php

namespace Database\Seeders;

use App\Models\PlatformSetting;
use App\Support\PlatformSettings;
use Illuminate\Database\Seeder;

class PlatformSettingSeeder extends Seeder
{
    /**
     * Seed the default platform settings without overwriting admin edits.
     */
    public function run(): void
    {
        foreach (PlatformSettings::defaults() as $key => $value) {
            PlatformSetting::query()->firstOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }
    }
}
