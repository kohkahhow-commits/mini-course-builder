# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks or libraries (no React, Vue, Tailwind, etc.).
- No build step: files are opened or served exactly as written.

## Project Structure

The repository is nearly empty for now. Everything lives at the top level:

- `CLAUDE.md` — this file.

As pages are added, keep HTML, CSS, and JavaScript files at the top level
unless we agree on folders. Update this section when the structure changes.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the
   light theme.

## Feature Plan

Audience: students in a class. Goal: they understand the key concepts and can
explain them in their own words.

### Site structure

One long scrolling page (`index.html`), top to bottom:

1. **Header**: course title and the light/dark theme toggle.
2. **Lessons**: one per slide (3–5). Each has short explained paragraphs
   plus any useful image or diagram from the slide.
3. **Quiz after each lesson**: 1–3 multiple-choice questions. Answers are
   checked instantly with a one-line explanation. Nothing is saved.
4. **Footer**: short closing note.

Students move through the course by scrolling down. Each lesson is followed
by its quiz, then the next lesson starts.

### Phases

- **Phase 1: course from the slides.** Ask for the slides (PDF or
  PowerPoint) and confirm the lesson list and quiz questions with the user.
  Then build `index.html`, `styles.css`, `script.js` and `images/`.
- **Phase 2: check and polish.** Test on phone, tablet and desktop widths,
  in both themes, and with a keyboard. Fix any problems found.
- **Later (only if asked):** extras such as a lesson menu or a key-terms
  summary.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
