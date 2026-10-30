# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks or libraries (no React, Vue, Tailwind, etc.).
- No build step: files are opened or served exactly as written.

## Project Structure

Everything lives at the top level:

- `index.html` — the whole course: header, Lesson and Quiz tabs, lesson
  menu, all lessons, previous/next buttons, the quiz, footer.
- `styles.css` — styling; light and dark colors are CSS variables.
- `script.js` — theme toggle (saved in the browser), tabs, lesson
  switching, check-in questions and the quiz.
- `CLAUDE.md` — this file.

Keep new files at the top level unless we agree on folders. Never commit the
source slide deck. Update this section when the structure changes.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the
   light theme.

## Feature Plan

Audience: students in a class. Goal: they understand the key concepts and can
explain them in their own words.

### Site structure

One page (`index.html`). Under the header (course title and light/dark
theme toggle) are two tabs:

- **Lesson** tab, showing one lesson at a time:
  1. **Lesson menu**: links to every lesson.
  2. **Lessons**: one per content slide (12 for LU01). Each has a heading
     and the slide's key points as explained paragraphs or a short list.
  3. **Check-in question** at the end of each lesson: one multiple-choice
     or short numeric answer. Once answered it shows right/wrong, the
     correct answer and a short explanation, then locks; "Next lesson"
     moves on either way.
  4. **Previous/Next buttons**.
- **Quiz** tab: 8 multiple-choice questions on the whole course (different
  from the check-ins). Each shows right/wrong once answered; the score shows
  after all 8, with a "Try again" button.
- A **Simulator** tab is added only if the course has a practice simulator
  (LU01 has none).

Nothing the student answers is saved. The address says what's showing:
`#lesson-N` for a lesson, `#quiz` for the quiz, so the back button and links
work. Without JavaScript, everything shows on one long page.

### Phases

- **Phase 1: course from the slides.** Done: lessons, menu, lesson
  switching, check-in questions, Lesson/Quiz tabs and theme toggle, with
  plain styling. Slide
  images are still to do.
- **Phase 2: design and polish.** Visual design, then test on phone,
  tablet and desktop widths, in both themes, and with a keyboard.
- **Later (only if asked):** extras such as a key-terms summary.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
