# CourseCraft redesign and project audit

CourseCraft already brings courses, AI study plans, notes, quizzes, and progress tracking together. The goal is to make it easier to understand what the product does, start studying, and pick up where you left off. Preserve existing features and routes while improving the screens people use most.

## Baseline findings

- The landing page uses a 350vh scroll sequence. Replace it with a clear opening message, a primary action, and a visible preview of the workspace.
- Login and registration use different visual styles and rely on placeholders for labels. Give them a shared layout, visible labels, and clear loading and error states.
- The desktop sidebar starts collapsed, and mobile navigation uses unlabeled icons and omits Achievements. Make essential destinations easy to find at every screen size.
- The frontend production build passes. Its largest chunk is about 1.75 MB minified (516 KB gzip). Measure the impact of loading routes and heavy tools on demand.
- Lint currently reports 55 errors and 4 warnings. Record the baseline, fix issues in touched code, and prioritize other errors by their effect on users.
- The email service includes a hard-coded fallback that appears to be a credential. Remove the fallback, use environment configuration, and rotate the key if it is real. Do not use the embedded value to test the service.

## Implementation order

1. **Establish the design system.** Use the installed UI/UX Pro Max skill to guide typography, color, spacing, and shared components. Keep its clear feature hierarchy and approachable styling, adapting the more playful recommendations to a student workspace. Design and verify both themes.
2. **Rebuild the landing and account screens.** Show what someone can do with CourseCraft in the first screen. Provide direct sign-in and registration paths, a compact feature overview, and consistent forms with keyboard focus and readable feedback.
3. **Redesign the student workspace.** Start with the shared navigation and dashboard. Give the next study action priority and improve course cards, progress summaries, and empty states. Apply the same patterns to course discovery, course learning, the study planner, notes, and quizzes.
4. **Test and fix confirmed problems.** Use the verification approach from pstack. Check landing, account flows, navigation, course enrollment and progress, plan generation, notes, and quizzes. Cover mobile and desktop widths, keyboard navigation, both themes, and loading, empty, and error states. Use local fixtures for frontend states; mark MongoDB, Gemini, YouTube, and email flows as unverified until they run against configured services.
5. **Measure and report.** Re-run the build and lint, compare bundle sizes, and document each confirmed issue with its impact and verification result. Separate fixes delivered from remaining upgrades, ordered by priority.

The redesign is ready when the main journeys are usable on mobile and desktop, key actions are discoverable and keyboard accessible, changed code introduces no new lint failures, and the handoff makes clear which flows passed and which still require live verification.
