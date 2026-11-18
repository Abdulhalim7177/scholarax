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
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('headline')->nullable();
            $table->text('bio')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('city')->nullable();
            $table->foreignId('country_id')->nullable()->constrained()->nullOnDelete();
            $table->string('linkedin_url', 2048)->nullable();
            $table->string('website_url', 2048)->nullable();
            $table->foreignId('target_level_id')->nullable()->constrained('study_levels')->nullOnDelete();
            $table->foreignId('target_field_id')->nullable()->constrained('fields_of_study')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('institution');
            $table->string('degree');
            $table->string('field')->nullable();
            $table->date('started_at')->nullable();
            $table->date('ended_at')->nullable();
            $table->string('grade')->nullable();
            $table->boolean('is_current')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'started_at']);
        });

        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('organization');
            $table->string('role');
            $table->date('started_at')->nullable();
            $table->date('ended_at')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_current')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'started_at']);
        });

        Schema::create('test_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('score');
            $table->date('tested_at')->nullable();
            $table->date('expires_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_scores');
        Schema::dropIfExists('work_experiences');
        Schema::dropIfExists('educations');
        Schema::dropIfExists('student_profiles');
    }
};
