<?php

namespace App\Support;

use App\Models\PlatformSetting;

final class PlatformSettings
{
    /**
     * Get the default platform settings.
     *
     * @return array<string, string>
     */
    public static function defaults(): array
    {
        return [
            'require_mentor_verification' => '1',
            'review_new_scholarships' => '1',
            'report_notifications' => '1',
            'weekly_platform_digest' => '0',
            'default_timezone' => 'Europe/London',
            'application_data_retention_months' => '24',
        ];
    }

    /**
     * Get every platform setting merged with defaults.
     *
     * @return array<string, string>
     */
    public static function all(): array
    {
        $stored = PlatformSetting::query()
            ->pluck('value', 'key')
            ->map(fn (?string $value): string => (string) $value)
            ->all();

        return [...self::defaults(), ...$stored];
    }

    /**
     * Get a setting value, falling back to the default.
     */
    public static function get(string $key): string
    {
        $setting = PlatformSetting::query()->where('key', $key)->value('value');

        if ($setting !== null) {
            return (string) $setting;
        }

        return self::defaults()[$key] ?? '';
    }

    /**
     * Determine whether a boolean setting is enabled.
     */
    public static function enabled(string $key): bool
    {
        return filter_var(self::get($key), FILTER_VALIDATE_BOOL);
    }

    /**
     * Persist a batch of validated settings.
     *
     * @param  array<string, string|int|bool>  $values
     */
    public static function setMany(array $values, ?int $userId = null): void
    {
        $allowed = array_keys(self::defaults());

        foreach ($values as $key => $value) {
            if (! in_array($key, $allowed, true)) {
                continue;
            }

            if (is_bool($value)) {
                $value = $value ? '1' : '0';
            }

            PlatformSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => (string) $value, 'updated_by' => $userId],
            );
        }
    }
}
