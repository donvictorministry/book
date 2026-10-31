/* book.js - book metadata, offline copy of the unlocked content, and the text parser.
   The chapters themselves live in the "Book" sheet and arrive only after a valid unlock.
   Edit the placeholder values in META below. */
(function () {
  'use strict';

  var META = {
    title: "Don't Give Up!",
    subtitle: 'A Journey of Faith and Perseverance',
    author: 'Rev. Dr. Chris Johnson, PhD',
    edition: 'Edition 1.0, 2025',
    kicker: 'A Christian devotional',

    about: [
      "Don't Give Up! is a faith-based devotional for anyone walking through a dark valley. Drawing on Jeremiah 29:11 and the stories of Joseph, David, the woman with the issue of blood, and Paul and Silas, it shows how God's faithfulness prevails in every season of struggle.",
      'Each chapter ends with a short declaration you can speak aloud. Read one chapter at a time, or follow the Table of Contents in any order.'
    ],

    /* Contact: replace every placeholder below */
    email: 'ministry@ebook.org',
    phone: '+10000000000',
    whatsapp: '10000000000',
    facebook: 'https://www.facebook.com/YOUR-PAGE',

    /* Link people get when they tap Share App. Leave empty to share the current page. */
    shareUrl: '',
    shareText: "Read \"Don't Give Up!\" by Rev. Dr. Chris Johnson.",

    developer: {
      name: 'Developer Name',
      role: 'Software Developer',
      bio: 'Write a short bio here. Describe who built this app and why.',
      photo: 'https://REPLACE-WITH-YOUR-HOSTED-URL/developer.png'
    }
  };

  var KEY = 'ebook_book_v1';
  var chapters = [];

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      chapters = Array.isArray(d) ? d.filter(valid) : [];
    } catch (e) { chapters = []; }
  }
  function valid(c) { return c && typeof c.id === 'string' && typeof c.title === 'string' && typeof c.body === 'string'; }
  function save(list) {
    chapters = (Array.isArray(list) ? list : []).filter(valid);
    try { localStorage.setItem(KEY, JSON.stringify(chapters)); } catch (e) {}
  }
  function clear() {
    chapters = [];
    try { localStorage.removeItem(KEY); } catch (e) {}
  }
  function has() { return chapters.length > 0; }
  function list() { return chapters.slice(); }
  function find(id) {
    for (var i = 0; i < chapters.length; i++) { if (chapters[i].id === id) { return chapters[i]; } }
    return null;
  }
  /* Reading order: front page first, then every chapter. */
  function ids() { return ['front'].concat(chapters.map(function (c) { return c.id; })); }
  function sections() {
    var out = [], map = {};
    chapters.forEach(function (c) {
      var s = c.section || 'Contents';
      if (!map[s]) { map[s] = { name: s, items: [] }; out.push(map[s]); }
      map[s].items.push(c);
    });
    return out;
  }

  /* Body format: blank line = paragraph; "> text -- Ref" = scripture; "# " = sub-heading; "* " = declaration */
  function parse(body) {
    return String(body || '').split(/\n\s*\n/).map(function (raw) {
      var b = raw.trim();
      if (!b) { return null; }
      if (b.indexOf('> ') === 0) {
        var t = b.slice(2), c = '', i = t.lastIndexOf(' -- ');
        if (i > -1) { c = t.slice(i + 4); t = t.slice(0, i); }
        return { t: 'quote', text: t, cite: c };
      }
      if (b.indexOf('# ') === 0) { return { t: 'sub', text: b.slice(2) }; }
      if (b.indexOf('* ') === 0) { return { t: 'decl', text: b.slice(2) }; }
      return { t: 'p', text: b };
    }).filter(Boolean);
  }

  load();
  window.Book = { meta: META, load: load, save: save, clear: clear, has: has, list: list, find: find, ids: ids, sections: sections, parse: parse };
})();
