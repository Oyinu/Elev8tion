// Clock + countdown to next 8AM/8PM (US Central Time)
const TIME_ZONE = "America/Chicago";

function getCentralParts(date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = {};
  fmt.formatToParts(date).forEach(({ type, value }) => {
    parts[type] = value;
  });
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function tick() {
  const now = new Date();
  const c = getCentralParts(now);

  document.getElementById("clock-time").textContent =
    String(c.hour).padStart(2, "0") +
    ":" +
    String(c.minute).padStart(2, "0") +
    ":" +
    String(c.second).padStart(2, "0");

  // Build a UTC timestamp representing "now" expressed in Central time,
  // so we can do simple arithmetic for the countdown.
  const centralNowAsUTC = Date.UTC(
    c.year,
    c.month - 1,
    c.day,
    c.hour,
    c.minute,
    c.second,
  );

  let targetHour = 8;
  let dayOffset = 0;
  if (c.hour < 8) {
    targetHour = 8;
  } else if (c.hour < 20) {
    targetHour = 20;
  } else {
    targetHour = 8;
    dayOffset = 1;
  }

  const centralTargetAsUTC = Date.UTC(
    c.year,
    c.month - 1,
    c.day + dayOffset,
    targetHour,
    0,
    0,
  );

  const diff = Math.max(0, centralTargetAsUTC - centralNowAsUTC);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById("clock-next").textContent =
    String(h).padStart(2, "0") +
    "h " +
    String(m).padStart(2, "0") +
    "m " +
    String(s).padStart(2, "0") +
    "s";
}
tick();
setInterval(tick, 1000);

document.getElementById("year").textContent = new Date().getFullYear();

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "-80px" },
);

document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

// Audio player
const audio = document.getElementById("theme-audio");
const playBtn = document.getElementById("play-btn");
const barFill = document.getElementById("player-bar-fill");

if (audio && playBtn && barFill) {
  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = "⏸";
      playBtn.setAttribute("aria-label", "Pause theme");
    } else {
      audio.pause();
      playBtn.textContent = "▶";
      playBtn.setAttribute("aria-label", "Play theme");
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      barFill.style.width = pct + "%";
    }
  });

  audio.addEventListener("ended", () => {
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play theme");
    barFill.style.width = "0%";
  });

  // Allow seeking by clicking the bar
  const playerBar = barFill.parentElement;
  playerBar.style.cursor = "pointer";
  playerBar.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const rect = playerBar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  });
}