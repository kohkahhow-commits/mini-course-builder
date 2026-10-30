# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks or libraries (no React, Vue, Tailwind, etc.).
- No build step: files are opened or served exactly as written.

## Project Structure

Everything lives at the top level:

- `index.html` — the whole course: header, lesson menu, all lessons,
  previous/next buttons, footer.
- `styles.css` — styling; light and dark colors are CSS variables.
- `script.js` — theme toggle (saved in the browser), lesson switching and
  check-in questions.
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

One page (`index.html`) that shows one lesson at a time:

1. **Header**: course title and the light/dark theme toggle.
2. **Lesson menu**: links to every lesson.
3. **Lessons**: one per content slide (12 for LU01). Each has a heading and
   the slide's key points as explained paragraphs or a short list.
4. **Check-in question** at the end of each lesson: one multiple-choice or
   short numeric answer. Once answered it shows right/wrong, the correct
   answer and a short explanation, then locks; "Next lesson" moves on either
   way. Nothing is saved.
5. **Previous/Next buttons** and a footer.

Students switch lessons with the menu or Previous/Next. JavaScript shows the
chosen lesson and hides the rest; the address ends in `#lesson-N`, so the
back button and links to a lesson work. Without JavaScript, all lessons show.

### Phases

- **Phase 1: course from the slides.** Done: lessons, menu, lesson
  switching, check-in questions and theme toggle, with plain styling. Slide
  images are still to do.
- **Phase 2: design and polish.** Visual design, then test on phone,
  tablet and desktop widths, in both themes, and with a keyboard.
- **Later (only if asked):** extras such as a key-terms summary.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
