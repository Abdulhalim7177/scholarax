# Scholarly Authenticated Dashboard — Design & Interaction Brief

## 1. Product context

**Product:** Scholarly  
**Surface:** Authenticated student dashboard  
**Primary goal:** Give learners a calm, useful overview of their scholarship journey and make the next action obvious.

The dashboard should feel like a supportive scholarship coach rather than a generic analytics screen. It should help a learner answer:

1. What should I work on next?
2. Which applications are currently moving forward?
3. Which scholarships have I saved?
4. How strong are my CV and statement of purpose?
5. Which deadlines or mentor updates need attention?

## 2. Approved visual direction

The approved direction is the **first clean dashboard concept**, expanded into a multi-section page that continues beyond one viewport. It should be structured and polished, with enough warmth to feel encouraging without becoming decorative or overly editorial.

### Brand palette

| Role              | Token                  |       Hex | Usage                                              |
| ----------------- | ---------------------- | --------: | -------------------------------------------------- |
| Primary           | `scholarly-blue`       | `#155EEF` | Actions, active states, progress, links            |
| Dark              | `scholarly-navy`       | `#102A43` | Headings, navigation, high-contrast areas          |
| Secondary         | `scholarly-gold`       | `#F4B942` | Deadline emphasis, saved highlights, small accents |
| Page background   | `scholarly-blue-white` | `#F5F9FF` | Main dashboard canvas                              |
| Supporting accent | `scholarly-sky`        | `#DCEBFF` | Selected panels and application surfaces           |
| Success           | `scholarly-teal`       | `#18A37A` | Completed work and positive status                 |
| Warm accent       | `scholarly-coral`      | `#FF8A72` | Mentor activity and human signals                  |
| Body text         | `scholarly-slate`      | `#52606D` | Supporting text and metadata                       |
| Border            | `scholarly-border`     | `#D9E6F5` | Card borders and dividers                          |

### Typography

- **Plus Jakarta Sans:** all UI labels, body copy, buttons, metadata, and navigation.
- **DM Serif Display:** greeting and selected major headings only.
- **Caveat:** optional encouragement annotations only; never use it for functional controls.

## 3. Page structure

The dashboard is intentionally longer than one viewport.

### 3.1 Dashboard header

- Greeting: `Good morning, Amina`
- Supporting line: `Here is your scholarship journey at a glance.`
- Notification control
- Primary action: `Explore scholarships`

### 3.2 Overview metrics

Four compact summary cards:

- Saved scholarships — `12`
- Applications in progress — `4`
- Profile completion — `82%`
- Upcoming deadlines — `3`

### 3.3 Application progress

A large progress card containing:

- Three-step journey: Discover, Prepare, Apply
- Overall completion indicator: `68% complete`
- Featured application: Chevening Scholarships
- Destination: United Kingdom
- Deadline: 18 Nov 2026
- Status: Draft in progress
- CTA: `Continue application`

### 3.4 Upcoming deadlines

A compact list containing:

- Chevening Scholarships — 18 Nov — Deadline soon
- DAAD Scholarships — 5 Dec — 32 days left
- Erasmus Mundus — 14 Jan — 72 days left

### 3.5 Mentor activity

- Mentor: Dr. Maya Chen
- Status: SOP feedback is ready
- CTA: `View message`

### 3.6 Application strength

This section summarizes application quality without copying a separate widget literally.

- **CV Strength:** 92% — Strong foundation
- **SOP Strength:** 84% — Add more personal detail
- Supporting copy explains that the scores are based on the learner’s profile, CV, and SOP.
- CTA: `Improve my application`

### 3.7 Saved scholarships sneak peek

Show four saved opportunities:

- Chevening Scholarships
- DAAD Scholarships
- Erasmus Mundus
- Fulbright Foreign Student Program

Each card includes country, study level, funding/deadline status, saved state, and `View scholarship`.

Section action: `See all saved scholarships`.

### 3.8 Recent activity

A short timeline for:

- Saved DAAD Scholarships
- Completed education history
- Mentor reviewed SOP
- Updated profile information

### 3.9 Upcoming application tasks

Checklist rows:

- Personal statement
- Recommendation letter
- English test score
- Application fee waiver

Each task includes a status and due date. The first implementation may use static sample data until backend data is connected.

### 3.10 Momentum CTA

Closing panel:

- Heading: `Keep your momentum going`
- Supporting copy encouraging the learner to continue improving their applications
- CTA: `Explore more scholarships`

## 4. Interaction requirements

Every visible action must do something.

### Current implementation behavior

- Existing dashboard route remains the authenticated dashboard.
- Implemented destinations use real Inertia links where routes already exist.
- Features without backend routes use `/coming-soon?feature=...`.
- The Coming Soon page explains that the feature is planned and provides a return-to-dashboard action.
- No button should be visually interactive while silently doing nothing.

### Temporary destinations

Until the relevant backend and frontend flows exist, the following actions should redirect to Coming Soon:

- Explore scholarships
- Find scholarships
- Continue application
- View application
- Improve my application
- View scholarship
- See all saved scholarships
- View message
- View all activity
- View all tasks
- CV & SOP builder actions
- Mentor actions

### Existing routes that can be used now

- Dashboard: existing team dashboard route
- Profile settings: existing profile settings route
- Security settings: existing security settings route
- Appearance settings: existing appearance settings route

## 5. Responsive behavior

- Desktop: persistent application shell with a structured multi-column dashboard.
- Tablet: two-column cards collapse into a readable stacked layout.
- Mobile: single-column content, horizontally scrollable saved scholarship cards, and compact metric cards.
- Maintain clear focus states and keyboard-accessible links.

## 6. Data strategy for the first pass

The first visual implementation may use representative static data for:

- Saved scholarship counts
- Application progress
- CV/SOP scores
- Saved scholarships
- Deadline dates
- Activity timeline
- Application tasks

The component structure should make it straightforward to replace static arrays with Inertia props from Laravel later.

## 7. Acceptance criteria

- The page is visibly longer than one viewport.
- The first viewport communicates the learner’s current state immediately.
- CV and SOP strength are represented as meaningful dashboard insights.
- Saved scholarships are visible as a useful preview, not only a metric.
- Every CTA and actionable-looking control redirects to a real page or Coming Soon.
- Colors come from shared `app.css` theme tokens rather than page-level hex literals.
- The design remains consistent with the approved Scholarly landing-page system.
