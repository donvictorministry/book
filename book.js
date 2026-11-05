/* book.js - book metadata, offline copy of the unlocked content, and the text parser.  */

(function () {
  'use strict';

  var META = {
    title: "Don't Give Up!",
    subtitle: 'A Journey of Faith and Perseverance',
    author: 'Rev. Don Victor, PhD',
    edition: 'Edition 1.0, 2026',
    kicker: 'A Christian Devotional',

    /* LOGO */
    logo: 'https://app.donvictorministry.org.ng/book/ebook-icon.png',

    about: [
      "Don't Give Up! is more than a devotional; it is a heartfelt reminder that your present struggles do not define your future, and your darkest season is never beyond the reach of God's faithfulness.",
      'Inspired by Jeremiah 29:11 and the powerful biblical stories of Joseph, David, the woman with the issue of blood, and Paul and Silas, this devotional offers hope, encouragement, and renewed strength for anyone navigating life's valleys. Through their experiences, you will discover that delays are not denials, setbacks are not the end, and even in seasons when God seems silent, He is still at work.'
      'Whether you are battling disappointment, facing uncertainty, enduring hardship, or simply struggling to find the strength to keep going, these pages will encourage you to hold on to God's promises, trust His timing, and keep your faith alive.'
      'Each chapter concludes with a short, faith-filled declaration designed to strengthen your spirit and help you speak God's promises over your life.'
      'Read one chapter at a time, or explore the chapters in any order using the Table of Contents. Wherever you begin, let each reading remind you of one enduring truth: Your story is not over. God is still faithful.' 
       'Don't Give Up! © Dr. Don Victor, PhD.' 
 
  ],

    /* Contact */
    email: 'donvictorministry@gmail.com',
    phone: '+2347035794649',
    whatsapp: '2348086590253',
    facebook: 'https://www.facebook.com/Rev.DonVictor',

    /* Link people get when they tap Share App.*/
    shareUrl: '',
    shareText: "Read \"Don't Give Up!\" by Rev. Don Victor, PhD.",

    developer: {
      name: 'Rev. Don Victor, PhD',
      role: 'Prophet of God | Founder & Visionary | Trainer | Researcher | Full Stack Developer',
      bio: 'Dr. Don Victor is an ordained Reverend Minister of the Lord Jesus Christ, scholar, interdisciplinary researcher, trainer, web developer, and software engineer. His work integrates Christian ministry, theological scholarship, education, research, and technological innovation to advance the Gospel and create meaningful global impact. Driven by a vision to reach six million souls for Christ, he has developed and founded diverse ministries, educational initiatives, and technology-driven platforms serving both online and offline communities.',
      photo: 'https://app.donvictorministry.org.ng/gospel/dvg-logo-pic.png'
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