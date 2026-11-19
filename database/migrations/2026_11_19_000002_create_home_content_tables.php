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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->text('quote');
            $table->string('author_name');
            $table->string('author_detail')->nullable();
            $table->string('initials', 4);
            $table->string('tone')->default('gold');
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'sort_order']);
        });

        Schema::create('impact_stats', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            $table->string('source')->default('static');
            $table->unsignedInteger('value')->default(0);
            $table->string('icon')->default('book');
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'sort_order']);
        });

        Schema::create('content_blocks', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('eyebrow')->nullable();
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('badge')->nullable();
            $table->string('icon')->nullable();
            $table->string('tone')->default('blue');
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['type', 'is_published', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_blocks');
        Schema::dropIfExists('impact_stats');
        Schema::dropIfExists('testimonials');
    }
};
