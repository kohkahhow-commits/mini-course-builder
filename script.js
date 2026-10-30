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

document.querySelector(".pager").hidden = false;
showLesson(false);
