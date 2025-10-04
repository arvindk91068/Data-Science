const STORAGE_KEY = "liblite_bookmarks_v1";
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
const q = document.getElementById('q');
const clearBtn = document.getElementById('clearBtn');
const list = document.getElementById('bookList');
const stats = document.getElementById('stats');

navToggle.addEventListener('click', () => {
  loadBooks();
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navList.classList.toggle('open');
});
});

// Load books
async function loadBooks() {
  const res = await fetch('books.json');
  const items = await res.json();
  window.__BOOKS__ = items;
  window.__BM__ = new Set(loadBookmarks());
  render(items);
  updateStats(items.length);
}

function loadBookmarks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveBookmarks(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
}

function bookTemplate(b) {
  const pressed = window.__BM__.has(b.id) ? 'true' : 'false';
  const tags = b.tags.map(t=>`<span class="tag">${t}</span>`).join(' ');
  return `<li class="card">
    <h3>${b.title}</h3>
    <p>${b.author} • ${b.year}</p>
    <p>${tags}</p>
    <div class="book-actions">
      <button class="bookmark" data-id="${b.id}" aria-pressed="${pressed}" aria-label="Bookmark ${b.title}">★ Bookmark</button>
    </div>
  </li>`;
}

function render(items) {
  list.innerHTML = items.map(bookTemplate).join('');
}

// TODO 2: Implement search (title/author/tags)
q.addEventListener('input', () => {
  const term = q.value.trim().toLowerCase();
  const items = (window.__BOOKS__ || []).filter(b =>
    b.title.toLowerCase().includes(term) ||
    b.author.toLowerCase().includes(term) ||
    b.tags.some(t => t.toLowerCase().includes(term))
  );
  render(items);
  updateStats(items.length);
});

clearBtn.addEventListener('click', () => {
  q.value = "";
  q.dispatchEvent(new Event('input'));
  q.focus();
});

// BONUS: bookmark toggle (optional)
list.addEventListener('click', (e) => {
  const btn = e.target.closest('.bookmark');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  const bm = window.__BM__;
  if (btn.getAttribute('aria-pressed') === 'true') {
    bm.delete(id); btn.setAttribute('aria-pressed','false');
  } else {
    bm.add(id); btn.setAttribute('aria-pressed','true');
  }
  saveBookmarks(bm);
});

function updateStats(n) {
  const total = (window.__BOOKS__ || []).length;
  stats.textContent = `${n} shown / ${total} total`;
}

