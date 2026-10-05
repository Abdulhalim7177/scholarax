# Scholarly Landing Page — Visual Design Brief

## 1. Project overview

**Product:** Scholarly  
**Purpose:** A global scholarship platform that helps learners discover opportunities, build their CV and statement of purpose, connect with mentors, manage application steps, and track deadlines.  
**Primary deliverable:** A complete landing page from navbar through footer.  
**Design direction:** Trustworthy, optimistic, international, human, and editorial — avoiding a generic AI-generated SaaS appearance.

The page should communicate that Scholarly is more than a scholarship database: it is a guided application journey.

---

## 2. Approved brand direction

### Brand personality

- Trustworthy but not corporate
- Ambitious but approachable
- International and inclusive
- Structured and helpful
- Human rather than overly automated
- Aspirational without feeling exclusive

### Core design principle

Use the interface to create confidence. Every section should answer one of these questions:

1. **What opportunities are available to me?**
2. **How can Scholarly improve my application?**
3. **Who can help me when I get stuck?**
4. **How do I stay organized until the deadline?**

---

## 3. Color palette

Blue is the primary brand color. Gold is the secondary color because it represents achievement, opportunity, recognition, and aspiration.

| Role | Name | Hex | Recommended usage |
|---|---|---:|---|
| Primary | Academic Blue | `#155EEF` | Primary buttons, active states, links, icons, focus states |
| Dark | Midnight Navy | `#102A43` | Headlines, navigation text, footer, high-contrast content |
| Secondary | Scholarship Gold | `#F4B942` | Handwritten annotations, stars, highlights, deadline emphasis, small decorative details |
| Background | Blue White | `#F5F9FF` | Alternating section backgrounds, soft panels, page atmosphere |
| Supporting accent | Sky Tint | `#DCEBFF` | Search panels, cards, illustration backgrounds, selected states |
| Success | Calm Teal | `#18A37A` | Fully funded labels, completed steps, positive status indicators |
| Warm accent | Soft Coral | `#FF8A72` | Mentor/community highlights, supporting illustrations, occasional attention states |
| White | Pure White | `#FFFFFF` | Cards, navigation, primary content surfaces |
| Neutral text | Slate | `#52606D` | Body copy, helper text, metadata |
| Border | Mist Blue | `#D9E6F5` | Card borders, dividers, input outlines |

### Color usage rules

- Blue should be the dominant action color, not a background used everywhere.
- Navy should carry most large headings and important text.
- Gold should be used sparingly so it feels special.
- Teal should communicate completion or positive status, not general decoration.
- Coral should appear as a human, social, or mentor-oriented accent.
- Keep most content sections light and airy. Reserve the deepest navy for the final CTA and footer.

### Suggested ratios

- 55% white and blue-white surfaces
- 25% navy text and dark UI elements
- 12% academic blue
- 5% sky tint
- 2% scholarship gold
- 1% teal/coral supporting accents

---

## 4. Typography system

### Approved font pairing

```text
Body/UI: Plus Jakarta Sans
Selected headlines: DM Serif Display
Handwritten annotations: Caveat
```

### Plus Jakarta Sans

Use for:

- Navbar
- Body copy
- Buttons
- Search filters
- Scholarship cards
- Dashboard previews
- Labels and metadata
- Footer navigation

Recommended weights:

- 400 — body copy
- 500 — labels and supporting navigation
- 600 — buttons and card headings
- 700 — strong UI emphasis

### DM Serif Display

Use selectively for emotionally important or editorial moments:

- Main hero headline or second line of the hero headline
- Major section headings where an aspirational tone is useful
- Testimonial quote emphasis
- Final CTA heading

Do not use DM Serif Display for dense UI or long paragraphs. The contrast with Plus Jakarta Sans should feel intentional, not decorative everywhere.

### Caveat

Use for handwritten annotations only:

- Hero annotation
- Hand-drawn callouts
- Small editorial notes near illustrations
- Occasional “Fully funded” or “You’re ready” encouragement

Avoid using Caveat for buttons, navigation, functional labels, or important information.

### Typography scale

| Element | Font | Size guidance | Weight |
|---|---|---:|---:|
| Hero headline | DM Serif Display + Plus Jakarta Sans | 64–76px desktop | Regular/700 combination |
| Section heading | Plus Jakarta Sans or DM Serif Display | 40–52px desktop | 600/regular |
| Card heading | Plus Jakarta Sans | 18–22px | 600–700 |
| Body copy | Plus Jakarta Sans | 16–18px | 400 |
| Supporting copy | Plus Jakarta Sans | 14–16px | 400–500 |
| Button text | Plus Jakarta Sans | 15–16px | 600–700 |
| Annotation | Caveat | 24–32px | Regular |
| Metadata | Plus Jakarta Sans | 12–14px | 500 |

Use responsive type scaling so the hero does not overwhelm smaller screens.

---

## 5. Hero direction

### Goal

The hero should be clear and calm. It should introduce the promise of Scholarly without trying to show every feature immediately.

### Recommended content

**Handwritten annotation:**

> Your next scholarship starts here

**Main headline:**

> Find scholarships.  
> Build your future.

**Supporting copy:**

> Discover global opportunities, create a stronger application, and get guidance from mentors — all in one place.

**Primary CTA:**

> Explore scholarships

**Secondary CTA:**

> Get started

### Hero composition

- Compact navbar at the top
- Text column on the left
- One confident, editorial illustration on the right
- Diverse students with subtle global/education cues
- No dense dashboard cards floating inside the hero
- No excessive badges, pills, metrics, or competing messages
- Generous whitespace around the headline
- Primary CTA in academic blue
- Secondary CTA as a white button with a blue border

### Handwritten annotation treatment

The annotation should not be placed inside a rounded badge. It should feel like a personal note written onto the page.

Recommended visual treatment:

- Caveat font
- Scholarship Gold color `#F4B942`
- Slight natural rotation between `-3deg` and `2deg`
- A loose hand-drawn underline or curved arrow
- Position above or beside the hero headline
- Keep it visually connected to the illustration or primary CTA

Example layout:

```text
       Your next scholarship starts here  ↘

       Find scholarships.
       Build your future.
```

### Handwriting animation

The annotation can animate as if it is being written:

1. The text appears stroke by stroke.
2. The curved underline or arrow draws afterward.
3. The final state settles with a very small, natural movement.
4. The animation plays once on first view.
5. The animation should not loop continuously.
6. A static annotation must remain available when reduced motion is enabled.

Suggested implementation direction:

- Use a text reveal or clip-path animation for the wordmark-like writing effect.
- If the underline/arrow is SVG, animate its stroke using `stroke-dasharray` and `stroke-dashoffset`.
- Do not make the animation block the main hero content.
- Keep total animation duration between 900ms and 1,500ms.
- Start after the main page content has loaded.

Accessibility requirement:

```css
@media (prefers-reduced-motion: reduce) {
  /* Show the annotation immediately and disable drawing animation. */
}
```

---

## 6. Full landing-page structure

The landing page should show a complete journey from navbar to footer.

### 6.1 Navbar

Elements:

- Scholarly wordmark with a simple book/star icon
- Find scholarships
- Build your profile
- Mentors
- Resources
- Log in
- Get started

Design:

- White or transparent-over-hero background
- Midnight Navy text
- Academic Blue hover and active states
- One clear blue CTA
- Sticky behavior may be added later, but should remain visually light

### 6.2 Hero

Use the simplified hero direction described above.

### 6.3 Impact strip

Example metrics:

- 500,000+ students supported
- 190+ countries
- 2,500+ scholarship programs

Keep this strip compact. It should build trust without competing with the hero.

### 6.4 Core features

Section heading:

> Everything you need to move forward

Three feature cards:

1. **Discover scholarships**  
   Find opportunities that match your goals, background, field, and preferred country.
2. **Build your application**  
   Create a standout CV and statement of purpose with guided templates.
3. **Get expert guidance**  
   Connect with experienced mentors who can review your application.

### 6.5 Scholarship search preview

Section heading:

> Find opportunities that fit you

Include a realistic search interface preview with:

- Country filter
- Study level filter
- Field of study filter
- Funding type filter
- Scholarship results
- Fully funded status labels
- Country and deadline metadata

Use blue-white panels and clean card borders. The search experience should feel useful, not like a decorative screenshot.

### 6.6 CV and SOP builder

Section heading:

> Build a stronger application

Show:

- Profile progress
- Personal details
- Education
- Experience
- CV/resume
- Statement of purpose
- Preview or guided template state

Use Calm Teal for completed steps and Academic Blue for the current step.

### 6.7 Mentor section

Section heading:

> Guidance when it matters

Show:

- Mentor profile
- Area of expertise
- Rating or review count
- Small chat preview
- Review topics such as CV review, SOP review, and study-abroad planning
- CTA: “Meet our mentors”

Use Soft Coral sparingly here to make the section feel warmer and more human.

### 6.8 Application process

Section heading:

> Your application, step by step

Three steps:

1. **Discover** — Find scholarships that match you.
2. **Prepare** — Build a strong application with guided tools.
3. **Apply with confidence** — Submit and track your applications in one place.

Use a simple horizontal process on desktop and stacked cards on mobile.

### 6.9 Deadline reminder

Section heading:

> Never miss a deadline

Show:

- Calendar preview
- Upcoming application deadline
- Reminder setup action
- Small notification or bell illustration

Use Scholarship Gold for deadline emphasis and Calm Teal for confirmed reminders.

### 6.10 Testimonial

Section heading:

> Real stories. Brighter futures.

Use one strong learner quote rather than several competing testimonials. Include:

- Learner portrait
- Name
- Program or field
- Destination country
- Short, specific quote

### 6.11 Final CTA

Recommended headline:

> Your next chapter starts here.

Supporting copy:

> Join a global community of ambitious learners today.

CTA:

> Create your free profile

Design:

- Midnight Navy background
- Academic Blue or Gold decorative elements
- White text
- One prominent blue/green CTA with strong contrast
- Subtle globe or star motif, not a busy illustration

### 6.12 Footer

Include:

- Scholarly wordmark
- Short description
- Platform links
- Resource links
- Company links
- Social icons
- Privacy
- Terms
- Cookies
- Copyright

Suggested footer link groups:

**Platform**

- Find scholarships
- Build your profile
- Mentors
- Application tools

**Resources**

- Guides
- Scholarship database
- Blog
- Help center

**Company**

- About us
- Our mission
- Careers
- Contact

---

## 7. UI component styling

### Buttons

Primary button:

- Academic Blue background
- White text
- 10–14px radius
- Medium shadow on hover
- Arrow icon can be used sparingly

Secondary button:

- White or transparent background
- Academic Blue border and text
- Same height as the primary button

Tertiary action:

- Text link with a small arrow
- Use Academic Blue
- Underline or arrow appears on hover

### Cards

- White surfaces on blue-white backgrounds
- 16–24px corner radius
- 1px Mist Blue border
- Very soft shadow only when elevation is needed
- Avoid excessive glassmorphism
- Avoid putting every section inside a card

### Inputs and filters

- White background
- Mist Blue border
- Midnight Navy text
- Slate placeholder text
- Blue focus ring
- Clear labels above inputs

### Status labels

- “Fully funded” — light teal background, Calm Teal text
- “Deadline soon” — pale gold background, dark gold text
- “New” — pale blue background, Academic Blue text

---

## 8. Illustration and imagery direction

Use imagery that feels global, hopeful, and authentic.

Preferred:

- Diverse university-age learners
- Natural expressions
- Books, laptops, notebooks, or application materials
- Subtle global cues such as a globe or map lines
- Editorial compositions with clean negative space

Avoid:

- Generic corporate handshakes
- Overly staged stock-photo smiles
- Excessively literal graduation-cap imagery
- Busy collages in the hero
- Inconsistent illustration styles between sections

---

## 9. Motion principles

Motion should make the product feel alive without becoming distracting.

Recommended:

- Handwritten hero annotation reveal
- Gentle card hover elevation
- Progress-bar fill on scroll or first load
- Subtle arrow movement on CTA hover
- Soft fade/slide-in for section content
- Calendar reminder notification pulse once

Avoid:

- Continuous looping animations
- Aggressive parallax
- Large elements moving across the page
- Animations that delay access to content
- Motion that looks like a loading screen

All motion must respect `prefers-reduced-motion`.

---

## 10. Responsive behavior

### Desktop

- Two-column hero
- Horizontal feature cards
- Search preview with filters and results visible together
- Three-step process in one row
- Full multi-column footer

### Tablet

- Reduce hero scale and image width
- Allow feature cards to wrap
- Stack search controls into two rows
- Keep process steps readable

### Mobile

- Single-column hero
- Handwritten annotation remains visible but smaller
- Illustration moves below the CTA
- Feature cards stack vertically
- Search filters become expandable or horizontally scrollable
- Process steps stack vertically
- Footer link groups collapse into accordions if needed
- Preserve generous touch targets of at least 44px

---

## 11. Accessibility requirements

- Maintain WCAG-conscious contrast between text and surfaces.
- Academic Blue buttons must use white text with sufficient contrast.
- Do not communicate status through color alone.
- Provide visible keyboard focus states.
- Use semantic heading order from `h1` through section headings.
- Add descriptive alt text for meaningful images.
- Mark decorative illustrations as decorative.
- Provide reduced-motion behavior for all animated elements.
- Do not rely on Caveat for essential information.
- Ensure the handwritten annotation remains readable at zoomed sizes.

---

## 12. Content tone

Copy should be:

- Clear and encouraging
- Specific rather than vague
- Confident without making unrealistic promises
- Friendly but not overly casual
- Focused on progress and guidance

Avoid phrases that sound generic or generated, such as:

- “Unlock your potential” without context
- “Your journey begins here” as a standalone message
- “Empowering the future of tomorrow”
- Overuse of “seamless”, “transformative”, or “revolutionary”

Prefer concrete language:

- “Find scholarships that match your goals.”
- “Build your CV and SOP with guided templates.”
- “Get feedback before you submit.”
- “Keep every deadline in one place.”

---

## 13. Approved design decisions

- **Primary color:** Academic Blue `#155EEF`
- **Secondary color:** Scholarship Gold `#F4B942`
- **Body/UI font:** Plus Jakarta Sans
- **Selected headline font:** DM Serif Display
- **Handwritten annotation font:** Caveat
- **Hero annotation:** “Your next scholarship starts here”
- **Hero annotation style:** Handwritten, editorial, with a one-time writing animation
- **Hero layout:** Simplified, spacious, and free of dense floating product cards
- **Page structure:** Full landing page from navbar to footer

---

## 14. Next implementation phase

When building the page, implement in this order:

1. Establish color tokens and typography tokens.
2. Build the navbar and simplified hero.
3. Add the handwritten annotation and reduced-motion fallback.
4. Build the impact strip and core feature cards.
5. Add scholarship search, CV/SOP builder, mentor, process, deadline, testimonial, CTA, and footer sections.
6. Add responsive layouts.
7. Add hover and scroll motion carefully.
8. Validate contrast, keyboard focus, mobile spacing, and reduced-motion behavior.
