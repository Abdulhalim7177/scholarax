<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expertise_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('mentor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('headline')->nullable();
            $table->string('current_role')->nullable();
            $table->string('organization')->nullable();
            $table->foreignId('country_id')->nullable()->constrained()->nullOnDelete();
            $table->text('bio')->nullable();
            $table->json('languages')->nullable();
            $table->unsignedTinyInteger('years_experience')->nullable();
            $table->string('linkedin_url', 2048)->nullable();
            $table->string('website_url', 2048)->nullable();
            $table->string('intro_video_path', 2048)->nullable();
            $table->string('verification_status')->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->string('availability_status')->default('available');
            $table->unsignedInteger('response_time_minutes')->default(240);
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->unsignedInteger('learners_count')->default(0);
            $table->unsignedInteger('sessions_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();

            $table->index(['verification_status', 'is_featured', 'rating_avg']);
            $table->index(['availability_status']);
        });

        Schema::create('mentor_expertise', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentor_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('expertise_tag_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['mentor_profile_id', 'expertise_tag_id']);
        });

        Schema::create('mentor_availability_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentor_profile_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('weekday');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('timezone')->default('UTC');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['mentor_profile_id', 'weekday', 'start_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentor_availability_slots');
        Schema::dropIfExists('mentor_expertise');
        Schema::dropIfExists('mentor_profiles');
        Schema::dropIfExists('expertise_tags');
    }
};
