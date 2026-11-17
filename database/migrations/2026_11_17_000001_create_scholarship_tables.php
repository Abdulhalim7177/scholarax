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
        Schema::create('scholarships', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('provider');
            $table->text('summary')->nullable();
            $table->longText('description');
            $table->foreignId('host_country_id')->nullable()->constrained('countries')->nullOnDelete();
            $table->string('funding_type');
            $table->string('funding_amount')->nullable();
            $table->string('currency', 3)->nullable();
            $table->timestamp('deadline_at')->nullable();
            $table->string('application_url', 2048)->nullable();
            $table->text('eligibility')->nullable();
            $table->json('required_documents')->nullable();
            $table->string('status')->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'deadline_at']);
            $table->index(['status', 'is_featured']);
        });

        Schema::create('scholarship_study_level', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scholarship_id')->constrained()->cascadeOnDelete();
            $table->foreignId('study_level_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['scholarship_id', 'study_level_id']);
        });

        Schema::create('scholarship_field_of_study', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scholarship_id')->constrained()->cascadeOnDelete();
            $table->foreignId('field_of_study_id')->constrained('fields_of_study')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['scholarship_id', 'field_of_study_id']);
        });

        Schema::create('scholarship_eligible_country', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scholarship_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['scholarship_id', 'country_id']);
        });

        Schema::create('saved_scholarships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('scholarship_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'scholarship_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_scholarships');
        Schema::dropIfExists('scholarship_eligible_country');
        Schema::dropIfExists('scholarship_field_of_study');
        Schema::dropIfExists('scholarship_study_level');
        Schema::dropIfExists('scholarships');
    }
};
