# Database-First Migration Plan

## 1. Executive summary

The application currently has two layers:

- **Real, database-backed functionality:** authentication, users, roles, teams, invitations, passkeys, 2FA, and basic profile fields (name, email, avatar).
- **Static demo functionality:** scholarships, applications, mentors, mentor profiles, reviews, sessions, messages, learner lists, admin users/scholarships/mentors/applications, reports, settings, dashboard metrics, activity, tasks, CV/SOP builder content, testimonials, and public impact statistics.

This plan converts every domain value rendered by the UI into database-backed records, read through controllers and passed to Inertia as typed props. A small amount of non-domain UI copy (button labels, section headings) can remain in React, but editorial content and all business data must come from the database.

The target outcome:

- No page or layout imports a `data.ts` domain fixture.
- No page defines arrays of users, scholarships, mentors, applications, sessions, messages, tasks, reviews, statistics, or testimonials.
- Every list, card, metric, and detail view reflects persisted data after a refresh.
- Every save action performs a real write (or explicitly disabled/read-only state).
- Demo data is produced by seeders/factories, not by React constants.

---

## 2. Current hardcoded-data inventory

### 2.1 Frontend fixture files

| Current file                                    | Contents                                                     | Replace with                                                   |
| ----------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| `resources/js/layouts/scholarships/data.ts`     | 6 scholarships, country/level/field filter lists             | `scholarships`, `countries`, `study_levels`, `fields_of_study` |
| `resources/js/layouts/applications/data.ts`     | 4 applications, statuses                                     | `applications`                                                 |
| `resources/js/layouts/mentors/data.ts`          | 6 mentors, expertise/country filters, external pravatar URLs | `mentor_profiles`, `users`, `expertise_tags`, `mentor_reviews` |
| `resources/js/layouts/dashboard/data.ts`        | 4 saved scholarships, 4 tasks                                | `saved_scholarships`, `application_tasks`                      |
| `resources/js/layouts/mentor-dashboard/data.ts` | review queue, sessions, recent messages                      | `document_reviews`, `mentor_sessions`, `mentor_messages`       |
| `resources/js/layouts/builder/data.ts`          | CV/SOP templates and section names                           | `builder_templates`, `cv_sop_sections`                         |
| `resources/js/layouts/home_page/data.ts`        | feature cards, 3 featured scholarships                       | `content_blocks`, `scholarships`                               |

### 2.2 Pages with inline domain data

| Page                            | Hardcoded data                                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `pages/admin-dashboard.tsx`     | recent users, moderation counts, total users, live scholarships, applications, health %, open-task count |
| `pages/admin-users.tsx`         | 5 users with role/status/joined date                                                                     |
| `pages/admin-scholarships.tsx`  | 5 scholarships with status/deadline/updated                                                              |
| `pages/admin-mentors.tsx`       | 4 mentors with verification/rating/learner count                                                         |
| `pages/admin-applications.tsx`  | 4 applications with stage/risk/submission                                                                |
| `pages/admin-reports.tsx`       | all KPI values, growth chart, top destinations                                                           |
| `pages/admin-settings.tsx`      | moderation toggles and local-only save state                                                             |
| `pages/mentor-dashboard.tsx`    | 4 KPI cards, impact copy, “28 learners”                                                                  |
| `pages/mentor-learners.tsx`     | 6 learners with goals/progress/next step/status                                                          |
| `pages/mentor-review-queue.tsx` | due-today count and queue summaries                                                                      |
| `pages/mentor-sessions.tsx`     | 3 upcoming sessions, 3 KPI values, week label                                                            |
| `pages/mentor-impact.tsx`       | 4 KPIs, 12-column growth chart, helpfulness %, 3 learner quotes                                          |
| `pages/mentor-profile.tsx`      | name, bio, expertise, availability slots, 86% completion                                                 |
| `pages/cv-sop-builder.tsx`      | profile name/headline/statement, scores, completion, next action                                         |
| `layouts/dashboard/*`           | metrics, current application, deadlines, mentor activity, strength scores, activity feed                 |
| `layouts/home_page/*`           | impact stats, testimonial, chat mock, process steps, application mock                                    |
| `layouts/mentor-dashboard/*`    | queue/session/message presentation driven by fixtures                                                    |
| `layouts/mentors/*`             | mentor cards and filters driven by fixtures                                                              |
| `layouts/scholarships/*`        | scholarship cards driven by fixtures                                                                     |

### 2.3 Backend gaps

- Only `users`, `teams`, `team_members`, `team_invitations`, passkeys, and auth tables exist.
- Every domain page is currently registered with `Route::inertia(...)`; there are no scholarship/application/mentor/session controllers.
- `DashboardController` only returns pending team invitations.
- Profile update supports name, email, and avatar only.
- No policies for student-owned or mentor-assigned data.
- No activity/notification, moderation, settings, or reporting tables.

---

## 3. Recommended domain schema

Use conventional Laravel tables, integer IDs, foreign keys, indexes, soft deletes where records are editable, and PHP enums for statuses. Store timestamps in UTC; render relative dates on the client.

### 3.1 Reference data

| Table               | Key columns                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `countries`         | `id`, `name`, `iso2`, `iso3`, `is_active`                                                          |
| `study_levels`      | `id`, `name`, `slug`, `sort_order`                                                                 |
| `fields_of_study`   | `id`, `name`, `slug`, `sort_order`                                                                 |
| `expertise_tags`    | `id`, `name`, `slug`                                                                               |
| `builder_templates` | `id`, `type`, `name`, `slug`, `description`, `accent`, `is_recommended`, `is_active`, `sort_order` |

### 3.2 Users and student profiles

Alter `users`:

- `phone`, `country_id`, `timezone`, `locale`
- `status` (`active`, `pending`, `suspended`)
- `last_login_at`, `onboarding_completed_at`

New tables:

| Table              | Key columns                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `student_profiles` | `user_id` unique, `headline`, `bio`, `date_of_birth`, `city`, `linkedin_url`, `website_url`, `target_level_id`, `target_field_id` |
| `educations`       | `user_id`, `institution`, `degree`, `field`, `started_at`, `ended_at`, `grade`, `is_current`                                      |
| `work_experiences` | `user_id`, `organization`, `role`, `started_at`, `ended_at`, `description`, `is_current`                                          |
| `test_scores`      | `user_id`, `type`, `score`, `tested_at`, `expires_at`                                                                             |

Profile completion must be calculated from required fields, not stored as a fake percentage.

### 3.3 Scholarships

| Table                          | Key columns                                                                                                                                                                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `scholarships`                 | `slug`, `title`, `provider`, `summary`, `description`, `host_country_id`, `funding_type`, `funding_amount`, `currency`, `deadline_at`, `application_url`, `eligibility`, `required_documents` JSON, `status`, `is_featured`, `verified_at`, `published_at`, `created_by`, `approved_by`, `views_count` |
| `scholarship_study_level`      | `scholarship_id`, `study_level_id`                                                                                                                                                                                                                                                                     |
| `scholarship_field_of_study`   | `scholarship_id`, `field_of_study_id`                                                                                                                                                                                                                                                                  |
| `scholarship_eligible_country` | `scholarship_id`, `country_id`                                                                                                                                                                                                                                                                         |
| `saved_scholarships`           | `user_id`, `scholarship_id`, timestamps; unique pair                                                                                                                                                                                                                                                   |

Statuses: `draft`, `pending`, `live`, `closed`, `archived`.

Derived values (`days_left`, `deadline_label`, initials, save count) are computed, never stored as strings.

### 3.4 Applications and documents

| Table                          | Key columns                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `applications`                 | `student_id`, `scholarship_id`, `status`, `progress`, `next_step`, `deadline_at`, `submitted_at`, `decision_at`, `offer_details` JSON; unique student/scholarship; soft deletes |
| `application_tasks`            | `application_id`, `title`, `description`, `due_at`, `completed_at`, `sort_order`, `type`                                                                                        |
| `application_documents`        | `application_id`, `type`, `title`, `version`, `file_path`, `status`, `submitted_at`                                                                                             |
| `document_reviews`             | `application_document_id`, `mentor_id`, `status`, `priority`, `due_at`, `feedback`, `reviewed_at`                                                                               |
| `application_status_histories` | `application_id`, `from_status`, `to_status`, `changed_by`, `note`, `created_at`                                                                                                |

Application statuses: `draft`, `in_review`, `submitted`, `offer_received`, `rejected`, `withdrawn`.

Document statuses: `draft`, `submitted`, `changes_requested`, `approved`.

Review statuses: `pending`, `in_review`, `completed`, `overdue`.

Progress is derived from completed tasks and approved documents, or recalculated and stored as a cached value in a transaction.

### 3.5 CV/SOP builder

| Table              | Key columns                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `cv_sop_documents` | `user_id`, `type` (`cv`/`sop`), `title`, `builder_template_id`, `headline`, `summary`, `status`, `last_saved_at` |
| `cv_sop_sections`  | `document_id`, `key`, `title`, `content` longText/JSON, `sort_order`, `completed_at`                             |

The builder must create/load the user’s document, persist section edits, and support explicit save plus debounced autosave.

### 3.6 Mentor domain

| Table                       | Key columns                                                                                                                                                                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mentor_profiles`           | `user_id` unique, `headline`, `current_role`, `organization`, `country_id`, `bio`, `years_experience`, `linkedin_url`, `website_url`, `intro_video_path`, `verification_status`, `verified_at`, `availability_status`, `response_time_minutes`, `rating_avg`, `reviews_count`, `learners_count` cached |
| `mentor_expertise`          | `mentor_profile_id`, `expertise_tag_id`                                                                                                                                                                                                                                                                |
| `mentor_availability_slots` | `mentor_profile_id`, `weekday`, `start_time`, `end_time`, `timezone`, `is_active`                                                                                                                                                                                                                      |
| `mentorships`               | `mentor_profile_id`, `student_id`, `status`, `started_at`, `ended_at`, `goals`                                                                                                                                                                                                                         |
| `mentor_sessions`           | `mentorship_id`, `requested_by`, `topic`, `scheduled_at`, `duration_minutes`, `meeting_url`, `status`, `attendance_status`, `notes`, `completed_at`                                                                                                                                                    |
| `mentor_messages`           | `mentorship_id`, `sender_id`, `recipient_id`, `body`, `read_at`                                                                                                                                                                                                                                        |
| `mentor_reviews`            | `mentorship_id`, `student_id`, `mentor_profile_id`, `rating`, `comment`, `is_published`                                                                                                                                                                                                                |

Statuses: mentorship `active/completed/paused/cancelled`; session `requested/confirmed/completed/cancelled/no_show`; verification `pending/verified/rejected`; availability `available/limited/unavailable`.

Ratings and counts are derived from reviews/sessions/mentorships and may be cached on `mentor_profiles`.

### 3.7 Activity, notifications, and content

| Table             | Key columns                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `activity_events` | `user_id`, `type`, `subject_type`, `subject_id`, `title`, `body`, `icon`, `metadata` JSON, `created_at`          |
| `notifications`   | Laravel database notifications                                                                                   |
| `testimonials`    | `user_id` nullable, `name`, `role`, `quote`, `avatar_path`, `rating`, `is_approved`, `is_featured`, `sort_order` |
| `impact_stats`    | `key`, `label`, `value`, `icon`, `sort_order`, `is_active`                                                       |
| `content_blocks`  | `page`, `section`, `key`, `title`, `body`, `data` JSON, `is_active`, `sort_order`                                |
| `feature_flags`   | `key`, `is_enabled`, `description`                                                                               |

Use `content_blocks`/`impact_stats`/`testimonials` for public marketing content so the home page is not dependent on source-code copy.

### 3.8 Admin, settings, moderation, reports

| Table                | Key columns                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `platform_settings`  | `key` primary, `value` JSON/text, `type`, `group`, `updated_by`                                                             |
| `moderation_reports` | `reporter_id`, `subject_type`, `subject_id`, `reason`, `details`, `status`, `resolved_by`, `resolution_note`, `resolved_at` |
| `survey_responses`   | `user_id`, `type`, `score`, `comment`, `submitted_at` (only if satisfaction KPI remains)                                    |
| `report_exports`     | `requested_by`, `type`, `filters` JSON, `file_path`, `status`, `completed_at` (optional for real exports)                   |

Admin KPI values are aggregate queries, not rows in a metrics table. Cache expensive counts for 1–5 minutes and invalidate on writes.

---

## 4. Backend implementation

### 4.1 Enums and models

Create PHP enums:

- `UserStatus`
- `ScholarshipStatus`, `FundingType`
- `ApplicationStatus`, `ApplicationDocumentType`, `ApplicationDocumentStatus`
- `ReviewStatus`, `ReviewPriority`
- `MentorshipStatus`, `SessionStatus`, `AttendanceStatus`
- `VerificationStatus`, `AvailabilityStatus`
- `ModerationStatus`

Create Eloquent models with relationships, casts, scopes, factories, and PHPDoc property blocks. Keep the existing `UserRole`.

### 4.2 Controllers and routes

Replace `Route::inertia(...)` with controllers:

**Public**

- `HomeController` — featured scholarships, featured mentors, testimonials, impact stats, content blocks.
- `ScholarshipController@index/show` — public/student listing and detail.
- `MentorDirectoryController@index/show` — verified mentors only.

**Student**

- `DashboardController` — all dashboard props.
- `SavedScholarshipController@store/destroy`.
- `ApplicationController@index/store/show/update`.
- `ApplicationTaskController@store/update/destroy`.
- `ApplicationDocumentController@store/update/destroy`.
- `BuilderDocumentController@index/store/show/update`, `BuilderSectionController@update`.
- `MentorshipController@store` (request a mentor).
- `MentorSessionController@index/store/cancel`.
- `MessageController@index/store`.

**Mentor**

- `MentorDashboardController`.
- `MentorReviewController@index/show/update`.
- `MentorLearnerController@index/show`.
- `MentorSessionController@index/store/update`.
- `MentorImpactController`.
- `MentorProfileController@edit/update`, `MentorExpertiseController@store/destroy`, `MentorAvailabilityController@index/store/update/destroy`.

**Admin**

- `AdminDashboardController`.
- `AdminUserController@index/update`.
- `AdminScholarshipController@index/store/show/update/destroy/publish/approve`.
- `AdminMentorController@index/verify`.
- `AdminApplicationController@index/show`.
- `AdminReportController@index/export`.
- `AdminSettingController@edit/update`.
- `ModerationController@index/resolve`.

### 4.3 Requests, policies, and writes

- FormRequest per write action with validation and authorization.
- Policies: `ScholarshipPolicy`, `ApplicationPolicy`, `ApplicationDocumentPolicy`, `MentorProfilePolicy`, `MentorshipPolicy`, `MentorSessionPolicy`, `MessagePolicy`, `DocumentReviewPolicy`, `ModerationReportPolicy`.
- Students can only read/write their own applications, tasks, documents, saved scholarships, and builder documents.
- Mentors can only read/write learners, reviews, sessions, and messages linked to their mentorships.
- Admins bypass ownership through policies.
- Use DB transactions for multi-table writes (application creation + tasks, document submission + review creation, session completion + activity event).
- Use events/listeners or observers to create activity events and notifications after writes.
- Private documents stored on a private disk; downloads through signed/authorized routes.

### 4.4 Inertia prop contracts

- Prefer API Resources or explicit controller mapping.
- Keep prop names consistent (choose camelCase for Inertia props).
- Send ISO timestamps and raw numeric values; compute labels on the client.
- Paginate lists and support query-string filters (`search`, `country`, `level`, `field`, `status`, `page`).
- Never send all rows to the client just to filter locally.

---

## 5. Frontend implementation

### 5.1 Types

Create `resources/js/types/domain.ts` with interfaces matching controller props:

- `Scholarship`, `ScholarshipFilters`
- `Application`, `ApplicationTask`, `ApplicationDocument`
- `MentorProfile`, `MentorSession`, `MentorMessage`, `MentorReview`
- `LearnerSummary`, `ReviewRequest`
- `BuilderTemplate`, `BuilderDocument`, `BuilderSection`
- `DashboardMetrics`, `ActivityEvent`
- `AdminUser`, `AdminScholarship`, `ModerationItem`, `ReportData`
- `PlatformSetting`, `Testimonial`, `ImpactStat`, `ContentBlock`

Delete or reduce fixture files to type-only modules. Remove every `from '@/layouts/.../data'` import from pages once its controller exists.

### 5.2 Page changes

- Accept typed props from Inertia; remove local arrays.
- Use `router.get` with query params for filters/search/sort/pagination.
- Use `useForm`/`router.post/patch/delete` for all save/toggle/complete actions.
- Add loading, empty, and validation states.
- Replace external avatar URLs with uploaded/stored avatars or initials fallback.
- Remove local-only “Saved” state; show persisted state from props.
- Add debounced autosave in the builder and a visible last-saved timestamp.
- Close the loop on currently “coming soon” controls that represent core flows.

### 5.3 Shared UI data rules

- No `const users = [...]`, `const scholarships = [...]`, `const sessions = [...]`, etc. in `resources/js`.
- No numeric KPI literals in JSX.
- No hardcoded names such as “Amina Yusuf” or “Dr. Maya Chen”.
- Relative dates come from timestamps using a shared date helper.
- Colors/tones may remain presentation mappings keyed by enum values, but they must not contain business records.

---

## 6. Data migration and seeding

### 6.1 Convert current fixtures to seed data

Use the current static arrays as the initial seed source, but move the values into:

- `ReferenceDataSeeder` — countries, study levels, fields, expertise, builder templates.
- `DemoDataSeeder` — students, mentors, scholarships, applications, tasks, documents, reviews, sessions, messages, saved scholarships, activity, testimonials, impact stats, content blocks, platform settings.
- `DatabaseSeeder` — calls reference data always; calls demo data only outside production.

Dates must be relative to `now()` (e.g. `now()->addDays(14)`) so the seeded UI never looks stale.

### 6.2 Production-safe seeding

- Reference data is safe to seed everywhere.
- Demo users/passwords and demo records only in local/testing.
- Do not import current fixture values into production automatically; provide a separate content-import command if real content exists.

### 6.3 Backfill order

1. Reference tables.
2. Users/student/mentor profiles.
3. Scholarships and pivots.
4. Saved scholarships.
5. Applications, tasks, documents, reviews.
6. Builder templates/documents/sections.
7. Mentorships, sessions, messages, reviews.
8. Activity, notifications, testimonials, settings, content.
9. Recalculate cached counters/progress.

---

## 7. Delivery phases

### Phase 1 — Foundation

- Add enums, migrations, models, factories, reference seeders.
- Add `countries`, study levels, fields, expertise, builder templates.
- Add base policies and TypeScript domain types.
- Add model-level tests.

### Phase 2 — Scholarships and public directory

- Scholarship CRUD and approval workflow.
- Public/student scholarship index/detail with server-side filters and pagination.
- Saved scholarships.
- Replace `scholarships/data.ts` and home featured scholarship fixtures.
- Admin scholarship page reads DB and supports create/edit/publish.

### Phase 3 — Student profile and applications

- Student profile/education/work/test scores.
- Application index/create/show/update.
- Tasks, documents, status histories.
- Dashboard controller returning real metrics, current application, deadlines, tasks, saved scholarships, activity, strength.
- Replace `applications/data.ts` and `dashboard/data.ts`.

### Phase 4 — CV/SOP builder

- Builder templates and document persistence.
- Section editing, save, autosave, last-saved timestamp.
- Link builder documents to application documents.
- Replace `builder/data.ts` and builder page state fixtures.

### Phase 5 — Mentor profiles and directory

- Mentor profile edit/update, expertise, availability, avatar/video.
- Verification workflow.
- Public mentor directory with server-side filters.
- Replace `mentors/data.ts`, mentor profile fixtures, and home mentor mock.

### Phase 6 — Mentorship, sessions, messages, reviews

- Mentorships/assignments.
- Session request/confirm/complete/cancel.
- Messages and read state.
- Review queue and document reviews.
- Mentor dashboard/learners/sessions/impact from DB.
- Replace `mentor-dashboard/data.ts` and mentor page fixtures.

### Phase 7 — Admin operations and reports

- Admin users/mentors/applications pages.
- Admin dashboard aggregates and moderation counts.
- Platform settings persistence.
- Reports (aggregate queries), top destinations, growth series, export job.
- Moderation reports.
- Replace all admin page fixtures.

### Phase 8 — Public content and cleanup

- Testimonials, impact stats, content blocks.
- Home page consumes DB content and featured records.
- Remove remaining domain fixtures and `coming-soon` dead ends for core flows.
- Add a CI guard that fails if domain arrays or fixture imports are reintroduced.

### Phase 9 — Hardening

- Authorization/feature tests for every write.
- Query/index/performance review and pagination.
- Cache invalidation for dashboard/report aggregates.
- Accessibility and empty/loading/error states.
- Final build, type, PHPStan, Pint, and Pest checks.

---

## 8. Acceptance criteria

- `rg "@/layouts/.*/data" resources/js/pages resources/js/layouts` returns no domain imports.
- No page-level arrays of domain records or KPI literals remain.
- Every list/detail/stat changes when the corresponding DB row changes.
- Every form action persists and survives refresh.
- Student, mentor, and admin authorization is covered by tests.
- Filters/pagination/search execute against the database.
- Demo data comes from seeders; production seeds only reference data.
- `composer ci:check` and `npm run build` pass.
- No core flow routes to `coming-soon`.

---

## 9. Key risks and decisions

| Risk / decision                                             | Recommendation                                                                                            |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Moving all marketing copy to DB could be over-engineering   | Keep labels/headings in code; store editorial content, testimonials, stats, and featured records in DB    |
| Normalizing every scholarship attribute creates many tables | Normalize countries, study levels, and fields; use pivots because scholarships can accept multiple values |
| Real-time messaging is a large scope increase               | Start with persisted messages + polling/refresh; add broadcasting later                                   |
| File storage for CVs/transcripts is sensitive               | Use private disk + authorized download routes; never public URLs                                          |
| Reports can become slow                                     | Compute from indexed queries, cache aggregates briefly, and queue exports                                 |
| Single-role users may limit future mentor/student overlap   | Keep single role for now; revisit if mentors also need student features                                   |
| Existing tests assume static pages                          | Update tests to assert Inertia props and DB state per phase                                               |

---

## 10. Recommended starting point

Start with **Phase 1 + Phase 2** in one sprint:

1. Reference tables, scholarship tables, enums, models, factories, seeders.
2. Scholarship controller/routes/policies.
3. Public/student scholarship index/detail from DB.
4. Saved scholarships.
5. Admin scholarship list/approval from DB.
6. Frontend scholarship types and removal of `scholarships/data.ts`.
7. Tests for filters, saves, admin approval, and authorization.

This delivers the first complete DB-backed vertical slice and establishes the patterns (controller → props → typed page → form write → test) for every later phase.
