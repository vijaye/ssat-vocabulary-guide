(function () {
  const app = document.getElementById("app");
  const { vocabulary, collections } = window;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function header(back) {
    return `<header class="site-header">
      <a href="#/" class="brand" aria-label="Lexicon home"><span class="brand-mark">L</span><span>LEXICON</span></a>
      ${back ? `<a class="back-link" href="${back.href}">← ${back.label}</a>` : `<nav aria-label="Primary navigation"><a href="#/collections">Collections</a><a href="#/study">Study guide</a></nav>`}
    </header>`;
  }

  function footer() {
    return `<footer><a href="#/" class="brand"><span class="brand-mark">L</span><span>LEXICON</span></a><p>Built for curious minds preparing for the SSAT.</p></footer>`;
  }

  function home(anchor) {
    const cards = collections.map((collection, index) => `<a class="collection-card" href="#/collection/${collection.slug}">
      <span class="collection-number">0${index + 1}</span><div class="collection-letters">${collection.label}</div><p>${collection.description}</p><span class="card-link">Explore 25 words <span>→</span></span>
    </a>`).join("");
    const featured = ["aberration", "ambiguous", "astute"].map(slug => vocabulary.find(word => word.slug === slug)).map(word => `<a href="#/words/${word.slug}" class="featured-card"><span class="part">${word.part}</span><h3>${word.word}</h3><p>${word.definition}</p><span class="card-link">Open entry <span>↗</span></span></a>`).join("");
    app.innerHTML = `<main>${header()}
      <section class="hero">
        <div class="hero-kicker"><span>SSAT</span> Vocabulary Field Guide</div>
        <h1>Words worth<br><em>knowing.</em></h1>
        <p class="hero-copy">A thoughtfully curated collection of 200 essential words—explained clearly, rooted in their origins, and ready to use.</p>
        <div class="search-wrap"><label class="search-box"><span aria-hidden="true">⌕</span><input id="search" placeholder="Search a word or meaning…" aria-label="Search vocabulary"><kbd>⌘ K</kbd></label><div id="search-results" class="search-results" hidden></div></div>
        <div class="hero-meta"><span><strong>200</strong> essential words</span><span><strong>8</strong> alphabetic collections</span><span><strong>1</strong> stronger vocabulary</span></div>
        <div class="orb orb-one" aria-hidden="true"></div><div class="orb orb-two" aria-hidden="true"></div><div class="letter-cascade" aria-hidden="true">Aa<br>Bb<br>Cc</div>
      </section>
      <section id="collections" class="section-shell collections-section"><div class="section-heading"><div><p class="eyebrow">Browse the collection</p><h2>Choose your chapter.</h2></div><p>Each chapter contains 25 words—a focused set for one or two study sessions.</p></div><div class="collection-grid">${cards}</div></section>
      <section class="featured-section"><div class="section-shell"><p class="eyebrow light">A taste of the collection</p><h2>Three words to start.</h2><div class="featured-grid">${featured}</div></div></section>
      <section id="study" class="section-shell study-section"><div class="study-copy"><p class="eyebrow">How to use Lexicon</p><h2>Don’t memorize.<br>Make connections.</h2><p>Learn the meaning, notice the word’s roots, then say the example aloud. Return tomorrow and try to use it in a new sentence.</p></div><ol class="study-steps"><li><span>01</span><div><strong>Read the meaning</strong><p>Start with the plain-English explanation.</p></div></li><li><span>02</span><div><strong>Follow the roots</strong><p>Etymology turns unfamiliar words into memorable stories.</p></div></li><li><span>03</span><div><strong>Use it yourself</strong><p>Write a sentence that could only use this exact word.</p></div></li></ol></section>
      ${footer()}</main>`;
    wireSearch();
    if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
  }

  function collectionPage(slug) {
    const collection = collections.find(item => item.slug === slug);
    if (!collection) return notFound();
    const [start, end] = slug.split("-");
    const words = vocabulary.filter(item => item.word[0] >= start && item.word[0] <= end);
    app.innerHTML = `<main class="inner-page">${header({ href: "#/", label: "All collections" })}
      <section class="collection-hero"><p class="eyebrow">Collection ${collections.indexOf(collection) + 1} of 8</p><h1>${collection.label}</h1><p>${collection.description} <span>${words.length} words</span></p></section>
      <section class="word-list">${words.map((word, index) => `<a href="#/words/${word.slug}" class="word-row"><span class="row-number">${String(index + 1).padStart(2, "0")}</span><div><h2>${word.word}</h2><span>${word.part}</span></div><p>${word.definition}</p><span class="row-arrow">→</span></a>`).join("")}</section>
      <div class="chapter-nav">${collections.map(item => `<a class="${item.slug === slug ? "active" : ""}" href="#/collection/${item.slug}">${item.label}</a>`).join("")}</div>
    </main>`;
  }

  function wordPage(slug) {
    const word = vocabulary.find(item => item.slug === slug);
    if (!word) return notFound();
    const initial = word.word[0];
    const collection = collections.find(item => { const [start, end] = item.slug.split("-"); return initial >= start && initial <= end; });
    const index = vocabulary.indexOf(word), previous = vocabulary[index - 1], next = vocabulary[index + 1];
    app.innerHTML = `<main class="inner-page word-page">${header({ href: `#/collection/${collection.slug}`, label: `Collection ${collection.label}` })}
      <article class="entry"><div class="entry-title"><p class="eyebrow">${word.part} · ${word.pronunciation}</p><h1>${word.word}</h1><p class="entry-definition">${word.definition}</p></div>
        <div class="entry-grid"><section><span class="detail-label">In plain English</span><p>${word.explanation}</p></section><section><span class="detail-label">Word origin</span><p>${word.etymology}</p></section><section class="usage"><span class="detail-label">In a sentence</span><blockquote>“${word.usage}”</blockquote></section><section><span class="detail-label">Opposite</span><p class="antonym">${word.antonym}</p></section><section><span class="detail-label">Related words</span><div class="chips">${word.related.map(item => `<span>${item}</span>`).join("")}</div></section></div>
      </article><nav class="word-nav">${previous ? `<a href="#/words/${previous.slug}"><span>Previous</span>← ${previous.word}</a>` : "<span></span>"}${next ? `<a class="next" href="#/words/${next.slug}"><span>Next</span>${next.word} →</a>` : ""}</nav>
    </main>`;
  }

  function wireSearch() {
    const input = document.getElementById("search"), results = document.getElementById("search-results");
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      if (!query) { results.hidden = true; return; }
      const matches = vocabulary.filter(item => item.word.includes(query) || item.definition.toLowerCase().includes(query)).slice(0, 6);
      results.innerHTML = matches.length ? matches.map(item => `<a href="#/words/${item.slug}"><strong>${escapeHtml(item.word)}</strong><span>${escapeHtml(item.definition)}</span></a>`).join("") : "<p>No matching words yet.</p>";
      results.hidden = false;
    });
    document.addEventListener("keydown", event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); input.focus(); } }, { once: true });
  }

  function notFound() { app.innerHTML = `<main class="inner-page">${header({ href: "#/", label: "Home" })}<section class="collection-hero"><p class="eyebrow">404</p><h1>Lost?</h1><p>That word isn’t in this collection.</p></section></main>`; }

  function route() {
    const path = (location.hash.slice(1) || "/").replace(/^\//, "");
    const [section, slug] = path.split("/");
    if (!section) home(); else if (section === "collections" || section === "study") home(section); else if (section === "collection") collectionPage(slug); else if (section === "words") wordPage(slug); else notFound();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route); route();
})();
