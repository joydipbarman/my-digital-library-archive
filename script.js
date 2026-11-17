(function () {
  "use strict";

  var books = [];
  var state = { q: "", category: "All", sort: "title", view: "grid" };

  var els = {
    library: document.getElementById("library"),
    search: document.getElementById("search"),
    category: document.getElementById("category"),
    sort: document.getElementById("sort"),
    count: document.getElementById("count"),
    empty: document.getElementById("empty"),
    viewGrid: document.getElementById("viewGrid"),
    viewList: document.getElementById("viewList"),
    theme: document.getElementById("themeToggle")
  };

  /* ---------- Theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("lib-theme", t); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem("lib-theme"); } catch (e) {}
  applyTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  els.theme.addEventListener("click", function () {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- Helpers ---------- */
  function hashHue(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
    return h;
  }
  function coverStyle(book) {
    if (book.cover) {
      return "background-image:url('" + encodeURI(book.cover) + "')";
    }
    var h = hashHue(book.title || "x");
    return "background:linear-gradient(145deg,hsl(" + h + ",45%,32%),hsl(" + ((h + 40) % 360) + ",50%,22%))";
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function safeUrl(u) {
    if (!u) return "";
    // allow relative paths, http(s) only
    if (/^(https?:)?\/\//i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u)) return u;
    return "";
  }

  /* ---------- Rendering ---------- */
  function matches(book) {
    if (state.category !== "All" && book.category !== state.category) return false;
    if (!state.q) return true;
    var hay = [book.title, book.author, book.category, book.description, (book.tags || []).join(" ")]
      .join(" ").toLowerCase();
    return state.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function sorted(list) {
    var s = list.slice();
    var cmp = {
      "title": function (a, b) { return (a.title || "").localeCompare(b.title || ""); },
      "author": function (a, b) { return (a.author || "").localeCompare(b.author || ""); },
      "year-desc": function (a, b) { return (b.year || 0) - (a.year || 0); },
      "year-asc": function (a, b) { return (a.year || 0) - (b.year || 0); },
      "added": function (a, b) { return (b.added || "").localeCompare(a.added || ""); }
    }[state.sort];
    return s.sort(cmp);
  }

  function card(book) {
    var c = el("article", "card");

    var cover = el("div", "cover");
    cover.setAttribute("style", coverStyle(book));
    cover.setAttribute("role", "img");
    cover.setAttribute("aria-label", "Cover of " + book.title);
    if (!book.cover) cover.appendChild(el("span", "cover-title", book.title));
    c.appendChild(cover);

    var body = el("div", "card-body");
    body.appendChild(el("h2", null, book.title));
    if (book.author) body.appendChild(el("p", "author", book.author));

    var meta = [book.category, book.year, book.format].filter(Boolean).join(" · ");
    if (meta) body.appendChild(el("p", "meta", meta));
    if (book.description) body.appendChild(el("p", "desc", book.description));

    if (book.tags && book.tags.length) {
      var tags = el("div", "tags");
      book.tags.forEach(function (t) {
        var b = el("button", "tag", "#" + t);
        b.type = "button";
        b.addEventListener("click", function () {
          els.search.value = t;
          state.q = t;
          render();
        });
        tags.appendChild(b);
      });
      body.appendChild(tags);
    }

    var actions = el("div", "actions");
    var url = safeUrl(book.url);
    var a = el("a", "btn" + (url ? "" : " disabled"), url ? "Open" : "Unavailable");
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    actions.appendChild(a);
    body.appendChild(actions);

    c.appendChild(body);
    return c;
  }

  function render() {
    var result = sorted(books.filter(matches));
    els.library.textContent = "";
    result.forEach(function (b) { els.library.appendChild(card(b)); });
    els.count.textContent = result.length + " of " + books.length + " item" + (books.length === 1 ? "" : "s");
    els.empty.hidden = result.length !== 0;
    els.library.className = "grid" + (state.view === "list" ? " list" : "");
  }

  function buildCategories() {
    var cats = Array.from(new Set(books.map(function (b) { return b.category; }).filter(Boolean))).sort();
    els.category.textContent = "";
    ["All"].concat(cats).forEach(function (c) {
      var o = el("option", null, c === "All" ? "All categories" : c);
      o.value = c;
      els.category.appendChild(o);
    });
  }

  /* ---------- Events ---------- */
  els.search.addEventListener("input", function () { state.q = els.search.value.trim(); render(); });
  els.category.addEventListener("change", function () { state.category = els.category.value; render(); });
  els.sort.addEventListener("change", function () { state.sort = els.sort.value; render(); });

  function setView(v) {
    state.view = v;
    els.viewGrid.classList.toggle("active", v === "grid");
    els.viewList.classList.toggle("active", v === "list");
    els.viewGrid.setAttribute("aria-pressed", v === "grid");
    els.viewList.setAttribute("aria-pressed", v === "list");
    render();
  }
  els.viewGrid.addEventListener("click", function () { setView("grid"); });
  els.viewList.addEventListener("click", function () { setView("list"); });

  /* ---------- Load data ---------- */
  fetch("books.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      books = Array.isArray(data) ? data : (data.books || []);
      buildCategories();
      render();
    })
    .catch(function (err) {
      els.count.textContent = "Could not load books.json (" + err.message + "). If you opened this file directly, serve it over HTTP or use GitHub Pages.";
    });
})();
