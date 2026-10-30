// Theme toggle: light is the default; the visitor's choice is remembered.
const THEME_KEY = "theme";
const themeButton = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeButton.setAttribute("aria-pressed", String(isDark));
  themeButton.textContent = isDark ? "Light theme" : "Dark theme";
}

function savedTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

applyTheme(savedTheme());

themeButton.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // Storage can be blocked (e.g. private browsing); the toggle still works.
  }
});

// Lessons: show one at a time. The address bar (#lesson-3) says which one,
// so the back button, reloads and shared links all land on the right lesson.
const lessons = Array.from(document.querySelectorAll(".lesson"));
const navLinks = Array.from(document.querySelectorAll(".lesson-nav a"));
const prevButton = document.getElementById("prev-lesson");
const nextButton = document.getElementById("next-lesson");
const status = document.getElementById("lesson-status");

function currentIndex() {
  const index = lessons.findIndex((lesson) => "#" + lesson.id === location.hash);
  return index === -1 ? 0 : index;
}

function showLesson(moveFocus) {
  const index = currentIndex();

  lessons.forEach((lesson, i) => {
    lesson.hidden = i !== index;
  });
  navLinks.forEach((link, i) => {
    if (i === index) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  prevButton.disabled = index === 0;
  nextButton.disabled = index === lessons.length - 1;
  status.textContent = `Lesson ${index + 1} of ${lessons.length}`;

  if (moveFocus) {
    // Put keyboard and screen-reader users at the start of the new lesson.
    lessons[index].querySelector("h2").focus();
    window.scrollTo(0, 0);
  }
}

function goTo(index) {
  location.hash = lessons[index].id;
}

prevButton.addEventListener("click", () => goTo(currentIndex() - 1));
nextButton.addEventListener("click", () => goTo(currentIndex() + 1));
window.addEventListener("hashchange", () => showLesson(true));

// Check-in questions: one per lesson, either multiple choice (radio buttons,
// data-answer is the index of the right option) or short answer (a number,
// accepted within data-tolerance). Once answered, the result and an
// explanation show and the question locks; nothing is saved.
function checkAnswer(form) {
  const radios = form.querySelectorAll('input[type="radio"]');

  if (radios.length > 0) {
    const chosen = form.querySelector('input[type="radio"]:checked');
    if (!chosen) return { error: "Choose an answer first." };
    const right = radios[Number(form.dataset.answer)];
    return {
      correct: chosen === right,
      answerText: right.parentElement.textContent.trim(),
    };
  }

  // Accept "0.27", "0.27%" or "56.0"; ignore spaces and a trailing unit.
  const raw = form.querySelector('input[type="text"]').value;
  const value = parseFloat(raw.replace(/[\s,%]/g, ""));
  if (Number.isNaN(value)) return { error: "Enter a number first." };
  const diff = Math.abs(value - Number(form.dataset.answer));
  return {
    correct: diff <= Number(form.dataset.tolerance),
    answerText: form.dataset.answerText,
  };
}

document.querySelectorAll(".check-in").forEach((form) => {
  const verdict = form.querySelector(".check-in-verdict");
  const result = form.querySelector(".check-in-result");
  const continueButton = form.querySelector(".continue");
  const lessonIndex = lessons.indexOf(form.closest(".lesson"));

  if (lessonIndex === lessons.length - 1) {
    continueButton.remove();
  } else {
    continueButton.addEventListener("click", () => goTo(lessonIndex + 1));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const outcome = checkAnswer(form);

    if (outcome.error) {
      verdict.textContent = outcome.error;
      return;
    }

    verdict.textContent = outcome.correct
      ? "Correct!"
      : `Not quite. The answer is: ${outcome.answerText}`;
    verdict.className = "check-in-verdict " + (outcome.correct ? "is-correct" : "is-incorrect");
    form.querySelector("fieldset").disabled = true;
    form.querySelector('button[type="submit"]').hidden = true;
    result.hidden = false;
  });

  form.hidden = false;
});

document.querySelector(".pager").hidden = false;
showLesson(false);
