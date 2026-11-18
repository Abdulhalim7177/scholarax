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
        Schema::create('builder_templates', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description');
            $table->string('accent')->default('blue');
            $table->json('sections');
            $table->boolean('is_recommended')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['type', 'is_active', 'sort_order']);
        });

        Schema::create('cv_sop_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('title');
            $table->foreignId('builder_template_id')->nullable()->constrained('builder_templates')->nullOnDelete();
            $table->string('headline')->nullable();
            $table->text('summary')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('last_saved_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'type']);
        });

        Schema::create('cv_sop_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('cv_sop_documents')->cascadeOnDelete();
            $table->string('key');
            $table->string('title');
            $table->longText('content')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['document_id', 'key']);
            $table->index(['document_id', 'sort_order']);
        });

        Schema::table('application_documents', function (Blueprint $table) {
            $table->unsignedBigInteger('builder_document_id')->nullable()->after('application_id');
            $table->index('builder_document_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_documents', function (Blueprint $table) {
            $table->dropIndex(['builder_document_id']);
            $table->dropColumn('builder_document_id');
        });

        Schema::dropIfExists('cv_sop_sections');
        Schema::dropIfExists('cv_sop_documents');
        Schema::dropIfExists('builder_templates');
    }
};
