/*
 * Memento Mori - live mortality counters + daily Stoic quote.
 * Counters extrapolate from the UN World Population Prospects estimate
 * of roughly 62 million deaths per year worldwide. A meditation, not a measurement.
 */

const DEATHS_PER_YEAR = 62_000_000;
const SECONDS_PER_YEAR = 365.2425 * 24 * 60 * 60;
const DEATHS_PER_MS = DEATHS_PER_YEAR / (SECONDS_PER_YEAR * 1000);

const pageOpenedAt = Date.now();
const fmt = new Intl.NumberFormat("en-US");

const isMini = new URLSearchParams(location.search).has("mini");
if (isMini) document.body.classList.add("mini");

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function startOfYear() {
  return new Date(new Date().getFullYear(), 0, 1).getTime();
}

function dayOfYear() {
  const now = new Date();
  return Math.floor((now.getTime() - startOfYear()) / 86_400_000);
}

function tick() {
  const now = Date.now();
  setText("count-page", fmt.format(Math.floor((now - pageOpenedAt) * DEATHS_PER_MS)));
  setText("count-today", fmt.format(Math.floor((now - startOfToday()) * DEATHS_PER_MS)));
  setText("count-year", fmt.format(Math.floor((now - startOfYear()) * DEATHS_PER_MS)));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && el.textContent !== value) el.textContent = value;
}

let quoteDayShown = -1;

async function loadQuotes() {
  const res = await fetch("quotes.json");
  const data = await res.json();
  return data.quotes;
}

function showDailyQuote(quotes) {
  const day = dayOfYear();
  if (day === quoteDayShown) return;
  quoteDayShown = day;
  const q = quotes[day % quotes.length];
  setText("quote-text", q.text);
  setText("quote-author", q.author);
  setText("quote-source", q.source);
  setText("quote-count", String(quotes.length));
  const dateEl = document.getElementById("quote-date");
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    });
  }
}

/* Floating reminder window.
 * Preferred: Document Picture-in-Picture (Chrome/Edge 116+), which stays on top
 * of ALL windows, is resizable, and keeps running while you work elsewhere.
 * Fallback: a small always-openable popup positioned at the top-right of the screen.
 */
async function openFloatingReminder() {
  if ("documentPictureInPicture" in window) {
    try {
      const pip = await documentPictureInPicture.requestWindow({ width: 320, height: 240 });
      for (const sheet of document.styleSheets) {
        try {
          const css = [...sheet.cssRules].map(r => r.cssText).join("\n");
          const style = pip.document.createElement("style");
          style.textContent = css;
          pip.document.head.appendChild(style);
        } catch { /* cross-origin sheet: skip */ }
      }
      pip.document.body.classList.add("mini");
      pip.document.body.innerHTML = document.getElementById("page").outerHTML;
      const interval = setInterval(() => {
        const now = Date.now();
        const write = (id, v) => {
          const el = pip.document.getElementById(id);
          if (el) el.textContent = v;
        };
        write("count-page", fmt.format(Math.floor((now - pageOpenedAt) * DEATHS_PER_MS)));
        write("count-today", fmt.format(Math.floor((now - startOfToday()) * DEATHS_PER_MS)));
        write("count-year", fmt.format(Math.floor((now - startOfYear()) * DEATHS_PER_MS)));
      }, 250);
      pip.addEventListener("pagehide", () => clearInterval(interval));
      return;
    } catch { /* fall through to popup */ }
  }
  const w = 340, h = 260;
  const left = (window.screen.availWidth || window.screen.width) - w - 16;
  window.open(
    location.pathname + "?mini=1",
    "memento-mori-mini",
    `popup=yes,width=${w},height=${h},left=${left},top=16,resizable=yes`
  );
}

async function main() {
  tick();
  setInterval(tick, 250);
  const quotes = await loadQuotes();
  showDailyQuote(quotes);
  setInterval(() => showDailyQuote(quotes), 60_000);

  const btn = document.getElementById("btn-float");
  if (btn) {
    btn.addEventListener("click", openFloatingReminder);
    if (isMini) btn.closest(".actions")?.remove();
    if (!("documentPictureInPicture" in window)) {
      const hint = document.getElementById("float-hint");
      if (hint) hint.textContent = "Opens a small resizable window pinned to the top-right of your screen. For a true always-on-top window, use Chrome or Edge.";
    }
  }
}

main();
