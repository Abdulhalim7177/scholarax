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
        Schema::create('mentorships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentor_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('active');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->text('goals')->nullable();
            $table->timestamps();

            $table->unique(['mentor_profile_id', 'student_id']);
            $table->index(['student_id', 'status']);
            $table->index(['mentor_profile_id', 'status']);
        });

        Schema::create('mentor_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentorship_id')->constrained()->cascadeOnDelete();
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
            $table->string('topic');
            $table->timestamp('scheduled_at');
            $table->unsignedSmallInteger('duration_minutes')->default(45);
            $table->string('meeting_url', 2048)->nullable();
            $table->string('status')->default('requested');
            $table->string('attendance_status')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['mentorship_id', 'scheduled_at']);
            $table->index(['status', 'scheduled_at']);
        });

        Schema::create('mentor_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentorship_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('recipient_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['mentorship_id', 'created_at']);
            $table->index(['recipient_id', 'read_at']);
        });

        Schema::create('mentor_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentorship_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mentor_profile_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['mentor_profile_id', 'is_published']);
        });

        Schema::create('document_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_document_id')->constrained()->cascadeOnDelete();
            $table->foreignId('mentor_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('pending');
            $table->string('priority')->default('normal');
            $table->timestamp('due_at')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->unique(['application_document_id', 'mentor_id']);
            $table->index(['mentor_id', 'status', 'due_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_reviews');
        Schema::dropIfExists('mentor_reviews');
        Schema::dropIfExists('mentor_messages');
        Schema::dropIfExists('mentor_sessions');
        Schema::dropIfExists('mentorships');
    }
};
