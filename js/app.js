"use strict";

const $ = (id) => document.getElementById(id);
const symbols = {
  moon: '<path d="M20.5 14a8.7 8.7 0 0 1-10.9-10.5A8.8 8.8 0 1 0 20.5 14Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  list: '<path d="m3 6 1.5 1.5L7 4m3 2h11M3 12l1.5 1.5L7 10m3 2h11M3 18l1.5 1.5L7 16m3 2h11"/>',
  timer: '<circle cx="12" cy="14" r="7.5"/><path d="M12 10v4l2 1M9 2h6m-3 0v4m6 1 2-2"/>',
  link: '<path d="m10 13 4-4M9 16l-1.5 1.5a3.5 3.5 0 1 1-5-5l4-4a3.5 3.5 0 0 1 5 0m1 0 1.5-1.5a3.5 3.5 0 1 1 5 5l-4 4a3.5 3.5 0 0 1-5 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  notebook: '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M3 7h4m-4 5h4m-4 5h4m3-8h6m-6 4h5"/>',
  pause: '<path d="M8 5v14m8-14v14" stroke-width="3"/>',
  play: '<path d="m7 4 12 8-12 8Z" fill="currentColor" stroke="none"/>',
  reset: '<path d="M4 11a8 8 0 1 1 1 6M4 5v6h6"/>',
  edit: '<path d="m14 5 5 5M4 20l5-1L20 8a2 2 0 0 0-5-5L4 14Z"/>',
  trash: '<path d="M4 6h16M9 6V3h6v3M6 6l1 14h10l1-14m-8 5v5m4-5v5"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  device: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>'
};
// Only fixed drawing data enters SVG markup. User-entered text uses textContent.
function drawIcon(node, name) {
  node.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + symbols[name] + '</svg>';
}
document.querySelectorAll("[data-icon]").forEach(node => drawIcon(node, node.dataset.icon));

const prefix = "sela.dashboard.v1.";
const memory = new Map();
let storageAvailable = true;
function storageWarning() {
  storageAvailable = false;
  $("storage-note").textContent = "Penyimpanan terbatas • perubahan hanya untuk sesi ini";
}
function read(key, fallback) {
  if (storageAvailable) {
    try {
      const stored = localStorage.getItem(prefix + key);
      if (stored === null) return fallback;
      try {
        const value = JSON.parse(stored);
        memory.set(key, value);
        return value;
      } catch { return fallback; }
    } catch { storageWarning(); }
  }
  return memory.get(key) ?? fallback;
}
function write(key, value) {
  memory.set(key, value);
  if (storageAvailable) {
    try { localStorage.setItem(prefix + key, JSON.stringify(value)); }
    catch { storageWarning(); }
  }
}
function newId() {
  return typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function element(tag, cssClass, text) {
  const node = document.createElement(tag);
  node.className = cssClass;
  if (text !== undefined) node.textContent = text;
  return node;
}
function iconButton(icon, label, onClick) {
  const button = element("button", "action");
  button.type = "button";
  button.title = label;
  button.setAttribute("aria-label", label);
  drawIcon(button, icon);
  button.addEventListener("click", onClick);
  return button;
}

const dateFormat = new Intl.DateTimeFormat("id-ID", {weekday: "long", day: "numeric", month: "long", year: "numeric"});
let displayName = read("name", "");
function renderClock() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 4 || hour >= 18 ? "malam" : hour < 11 ? "pagi" : hour < 15 ? "siang" : "sore";
  $("greeting-title").textContent = "Selamat " + greeting + (displayName ? ", " + displayName : "") + ".";
  $("date").textContent = dateFormat.format(now);
  const pad = n => String(n).padStart(2, "0");
  $("date").dateTime = [now.getFullYear(), pad(now.getMonth()+1), pad(now.getDate())].join("-");
  const time = [now.getHours(), now.getMinutes(), now.getSeconds()].map(pad).join(":");
  $("clock").textContent = time;
  $("clock").dateTime = time;
}
function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const label = dark ? "Aktifkan mode terang" : "Aktifkan mode gelap";
  $("theme").title = label;
  $("theme").setAttribute("aria-label", label);
  drawIcon($("theme"), dark ? "sun" : "moon");
}
function restoreTheme() {
  applyTheme(read("theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
}
$("theme").onclick = () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  write("theme", theme);
  applyTheme(theme);
};

function tasks() {
  const items = read("tasks", []);
  return Array.isArray(items) ? items.filter(t => t && typeof t.id === "string" && typeof t.text === "string") : [];
}
const tidy = text => text.trim().replace(/\s+/g, " ");
function taskError(items, text, exceptId) {
  if (!text) return "Tulis nama tugas terlebih dahulu.";
  const duplicate = items.some(t => t.id !== exceptId && tidy(t.text).toLocaleLowerCase("id") === text.toLocaleLowerCase("id"));
  return duplicate ? "Tugas dengan nama ini sudah ada." : "";
}
function saveTasks(items) {
  write("tasks", items);
  renderTasks();
}
function renderTasks() {
  const items = tasks();
  $("tasks").replaceChildren();
  $("empty").hidden = items.length > 0;
  $("task-count").textContent = items.filter(t => t.done).length + " / " + items.length + " selesai";
  for (const task of items) {
    const row = element("li", "task-row");
    const label = document.createElement("label");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = Boolean(task.done);
    check.addEventListener("change", () => {
      saveTasks(tasks().map(t => t.id === task.id ? {...t, done: check.checked} : t));
      const replacement = Array.from($("tasks").children).find(li => li.dataset.id === task.id);
      replacement?.querySelector("input").focus();
    });
    row.dataset.id = task.id;
    label.append(check, element("span", "", task.text));
    row.append(label,
      iconButton("edit", "Ubah tugas " + task.text, () => openEditor("task", task)),
      iconButton("trash", "Hapus tugas " + task.text, () => {
        saveTasks(tasks().filter(t => t.id !== task.id));
        $("notice").textContent = "Tugas dihapus.";
        $("task-text").focus();
      })
    );
    $("tasks").append(row);
  }
}
$("task-form").addEventListener("submit", event => {
  event.preventDefault();
  const items = tasks();
  const text = tidy($("task-text").value);
  const error = taskError(items, text);
  $("task-error").textContent = error;
  if (!error) {
    saveTasks([...items, {id: newId(), text, done: false}]);
    $("task-form").reset();
    $("notice").textContent = "Tugas ditambahkan.";
  }
  $("task-text").focus();
});
$("task-text").oninput = () => { $("task-error").textContent = ""; };

const duration = 25 * 60 * 1000;
const ready = () => ({remaining: duration, deadline: null});
function readTimer() {
  const value = read("timer", null);
  if (!value || !Number.isFinite(value.remaining) || value.remaining < 0 || value.remaining > duration) return ready();
  return {...value, deadline: Number.isFinite(value.deadline) ? value.deadline : null};
}
let timer = readTimer();
function setTimer(value) {
  timer = value;
  write("timer", value);
  renderTimer();
}
function remainingMs() {
  return timer.deadline === null ? timer.remaining : Math.max(0, timer.deadline - Date.now());
}
function renderTimer() {
  const ms = remainingMs();
  if (timer.deadline !== null && ms === 0) {
    setTimer({remaining: 0, deadline: null});
    return;
  }
  const seconds = Math.ceil(ms/1000);
  const running = timer.deadline !== null;
  $("remaining").textContent = String(Math.floor(seconds/60)).padStart(2,"0") + ":" + String(seconds%60).padStart(2,"0");
  const status = running ? "Sedang fokus" : ms === 0 ? "Sesi selesai" : ms === duration ? "Siap mulai" : "Dijeda";
  if ($("timer-status").textContent !== status) $("timer-status").textContent = status;
  $("dial").style.setProperty("--elapsed", (1 - ms/duration) * 360 + "deg");
  $("start").disabled = running;
  $("stop").disabled = !running;
}
$("start").onclick = () => {
  timer = readTimer();
  if (timer.deadline !== null && remainingMs() > 0) return renderTimer();
  const remaining = remainingMs() || duration;
  setTimer({remaining, deadline: Date.now() + remaining});
};
$("stop").onclick = () => {
  timer = readTimer();
  setTimer({remaining: remainingMs(), deadline: null});
};
$("reset").onclick = () => setTimer(ready());

const initialLinks = [
  {id: "google", name: "Google", url: "https://www.google.com/"},
  {id: "github", name: "GitHub", url: "https://github.com/"},
  {id: "gmail", name: "Gmail", url: "https://mail.google.com/"}
];
function webAddress(raw) {
  let address = raw.trim();
  if (!address) return null;
  if (!/^[a-z][a-z\d+.-]*:/i.test(address)) address = "https://" + address;
  try {
    const url = new URL(address);
    return ["https:", "http:"].includes(url.protocol) && url.hostname && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
function links() {
  let records = read("links", null);
  if (!Array.isArray(records)) {
    records = initialLinks;
    write("links", records);
  }
  return records.filter(l => l && typeof l.name === "string" && typeof l.url === "string" && webAddress(l.url));
}
function renderLinks() {
  const records = links();
  $("links").replaceChildren();
  $("no-links").hidden = records.length > 0;
  for (const item of records) {
    const row = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = webAddress(item.url);
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    const mark = element("span", "link-mark", Array.from(item.name)[0]?.toUpperCase());
    mark.setAttribute("aria-hidden", "true");
    anchor.append(mark, element("span", "link-name", item.name));
    const remove = iconButton("x", "Hapus tautan " + item.name, () => {
      write("links", links().filter(l => l.id !== item.id));
      renderLinks();
      $("add-link").focus();
    });
    row.append(anchor, remove);
    $("links").append(row);
  }
}

const editor = $("editor");
let editing = null;
function openEditor(kind, item = null) {
  editing = {kind, id: item?.id};
  $("editor-form").reset();
  $("editor-error").textContent = "";
  const titles = {name: "Nama sapaan", task: "Ubah tugas", link: "Tambah tautan"};
  const labels = {name: "Nama panggilan (opsional)", task: "Nama tugas", link: "Nama situs"};
  $("editor-title").textContent = titles[kind];
  $("field-caption").textContent = labels[kind];
  $("field").maxLength = {name: 32, task: 180, link: 48}[kind];
  $("field").required = kind !== "name";
  $("field").value = kind === "name" ? displayName : item?.text || "";
  $("url-group").hidden = kind !== "link";
  $("url").required = kind === "link";
  editor.showModal();
  $("field").focus();
  $("field").select();
}
$("personalize").onclick = () => openEditor("name");
$("add-link").onclick = () => openEditor("link");
$("cancel").onclick = $("close").onclick = () => editor.close();
$("editor-form").addEventListener("submit", event => {
  event.preventDefault();
  const text = tidy($("field").value);
  const {kind, id} = editing;
  if (kind === "name") {
    displayName = text;
    write("name", text);
    renderClock();
  } else if (kind === "task") {
    const items = tasks();
    const error = taskError(items, text, id);
    if (error) { $("editor-error").textContent = error; return; }
    if (!items.some(t => t.id === id)) { $("editor-error").textContent = "Tugas ini sudah dihapus."; return; }
    saveTasks(items.map(t => t.id === id ? {...t, text} : t));
  } else {
    const url = webAddress($("url").value);
    if (!text || !url) {
      $("editor-error").textContent = "Isi nama situs dan alamat web HTTP atau HTTPS yang valid.";
      return;
    }
    write("links", [...links(), {id: newId(), name: text, url}]);
    renderLinks();
  }
  editor.close();
  if (kind === "task") $("task-text").focus();
});
function restoreDashboard() {
  displayName = read("name", "");
  timer = readTimer();
  restoreTheme();
  renderTasks();
  renderLinks();
  renderClock();
  renderTimer();
}
window.addEventListener("storage", event => {
  if (!event.key || event.key.startsWith(prefix)) restoreDashboard();
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) restoreDashboard();
});
restoreDashboard();
setInterval(() => { renderClock(); renderTimer(); }, 250);
