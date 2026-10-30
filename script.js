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

// Tabs and lessons. The address bar says what to show: #quiz opens the Quiz
// tab, #lesson-3 opens the Lesson tab at lesson 3. So the back button,
// reloads and shared links all land in the right place.
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const lessonTab = document.getElementById("tab-lesson");
const quizTab = document.getElementById("tab-quiz");
const lessons = Array.from(document.querySelectorAll(".lesson"));
const navLinks = Array.from(document.querySelectorAll(".lesson-nav a"));
const prevButton = document.getElementById("prev-lesson");
const nextButton = document.getElementById("next-lesson");
const status = document.getElementById("lesson-status");
let lastLessonIndex = 0;

function currentIndex() {
  const index = lessons.findIndex((lesson) => "#" + lesson.id === location.hash);
  return index === -1 ? lastLessonIndex : index;
}

function selectTab(activeTab) {
  tabs.forEach((tab) => {
    const active = tab === activeTab;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
  });
}

function showLesson(moveFocus) {
  const index = currentIndex();
  lastLessonIndex = index;

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
  }
}

function route(moveFocus) {
  if (location.hash === "#quiz") {
    selectTab(quizTab);
    if (moveFocus) document.getElementById("quiz-title").focus();
  } else {
    selectTab(lessonTab);
    showLesson(moveFocus);
  }
  if (moveFocus) window.scrollTo(0, 0);
}

function goTo(index) {
  location.hash = lessons[index].id;
}

prevButton.addEventListener("click", () => goTo(currentIndex() - 1));
nextButton.addEventListener("click", () => goTo(currentIndex() + 1));

// Set when a tab is clicked, so focus stays on the tab after the switch.
// (Changing the address to #lesson-N makes the browser move focus into that
// lesson, so we can't just check which element has focus.)
let tabClicked = null;

function openTab(tab, hash) {
  if (location.hash === hash) return; // already open: nothing changes
  tabClicked = tab;
  location.hash = hash;
}

lessonTab.addEventListener("click", () => openTab(lessonTab, "#" + lessons[lastLessonIndex].id));
quizTab.addEventListener("click", () => openTab(quizTab, "#quiz"));

// Left/right arrow keys move between tabs, as in most tab interfaces.
document.querySelector(".tabs").addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  const step = event.key === "ArrowRight" ? 1 : -1;
  const next = tabs[(tabs.indexOf(event.target) + step + tabs.length) % tabs.length];
  next.focus();
  next.click();
});

window.addEventListener("hashchange", () => {
  if (tabClicked) {
    route(false);
    tabClicked.focus();
    tabClicked = null;
  } else {
    route(true);
  }
});

// Questions: the check-in at the end of each lesson and the quiz questions
// share the same markup. Either multiple choice (radio buttons, data-answer
// is the index of the right option) or short answer (a number, accepted
// within data-tolerance). Once answered, the result and an explanation show
// and the question locks; nothing is saved.
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

function wireQuestion(form, onAnswered) {
  const verdict = form.querySelector(".check-in-verdict");

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
    form.querySelector(".check-in-result").hidden = false;
    if (onAnswered) onAnswered(outcome.correct);
  });

  form.hidden = false;
}

function resetQuestion(form) {
  form.reset();
  form.dataset.correct = "";
  const verdict = form.querySelector(".check-in-verdict");
  verdict.textContent = "";
  verdict.className = "check-in-verdict";
  form.querySelector("fieldset").disabled = false;
  form.querySelector('button[type="submit"]').hidden = false;
  form.querySelector(".check-in-result").hidden = true;
}

document.querySelectorAll(".lesson .check-in").forEach((form) => {
  const continueButton = form.querySelector(".continue");
  const lessonIndex = lessons.indexOf(form.closest(".lesson"));

  if (lessonIndex === lessons.length - 1) {
    continueButton.remove();
  } else {
    continueButton.addEventListener("click", () => goTo(lessonIndex + 1));
  }

  wireQuestion(form);
});

// Quiz: the score appears once every question has been answered.
const quizQuestions = Array.from(document.querySelectorAll(".quiz-question"));
const quizScore = document.getElementById("quiz-score");
const quizRetry = document.getElementById("quiz-retry");

function updateScore() {
  const answered = quizQuestions.filter((form) => form.dataset.correct);
  if (answered.length < quizQuestions.length) return;
  const right = answered.filter((form) => form.dataset.correct === "yes").length;
  quizScore.textContent = `You scored ${right} out of ${quizQuestions.length}.`;
  quizRetry.hidden = false;
}

quizQuestions.forEach((form) => {
  wireQuestion(form, (correct) => {
    form.dataset.correct = correct ? "yes" : "no";
    updateScore();
  });
});

quizRetry.addEventListener("click", () => {
  quizQuestions.forEach(resetQuestion);
  quizScore.textContent = "";
  quizRetry.hidden = true;
  document.getElementById("quiz-title").focus();
  window.scrollTo(0, 0);
});

document.querySelector(".tabs").hidden = false;
document.querySelector(".pager").hidden = false;
route(false);
