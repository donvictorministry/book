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
  "More than a devotional, this is a heartfelt reminder that your present struggles do not define your future. No matter how dark the valley may seem, God's faithfulness remains constant.",

  "𝗕𝗜𝗕𝗟𝗜𝗖𝗔𝗟 𝗜𝗡𝗦𝗣𝗜𝗥𝗔𝗧𝗜𝗢𝗡\n\nDrawing on 𝗝𝗲𝗿𝗲𝗺𝗶𝗮𝗵 𝟮𝟵:𝟭𝟭 and the inspiring stories of Joseph, David, the woman with the issue of blood, and Paul and Silas, this devotional reveals how God remains faithful through life's most difficult seasons.",

  "𝗪𝗛𝗔𝗧 𝗬𝗢𝗨 𝗪𝗜𝗟𝗟 𝗗𝗜𝗦𝗖𝗢𝗩𝗘𝗥\n\n Delays do not mean God has forgotten you.\n\n Setbacks do not determine your final destination.\n\n God is still at work, even when you cannot see it.\n\n Your circumstances do not have the final say over your future.",

  "𝗔 𝗪𝗢𝗥𝗗 𝗢𝗙 𝗘𝗡𝗖𝗢𝗨𝗥𝗔𝗚𝗘𝗠𝗘𝗡𝗧\n\nWhether you are battling disappointment, facing uncertainty, enduring hardship, or struggling to find the strength to keep going, these pages will encourage you to hold on to God's promises, trust His timing, and keep your faith alive.",

  "𝗦𝗣𝗘𝗔𝗞 𝗙𝗔𝗜𝗧𝗛 𝗢𝗩𝗘𝗥 𝗬𝗢𝗨𝗥 𝗟𝗜𝗙𝗘\n\nEach chapter concludes with a short declaration of faith designed to strengthen your spirit and help you speak God's promises over your life.",

  "𝗥𝗘𝗔𝗗 𝗔𝗧 𝗬𝗢𝗨𝗥 𝗢𝗪𝗡 𝗣𝗔𝗖𝗘\n\nRead one chapter at a time or explore the chapters in any order using the Table of Contents.",

  "𝗬𝗢𝗨𝗥 𝗦𝗧𝗢𝗥𝗬 𝗜𝗦 𝗡𝗢𝗧 𝗢𝗩𝗘𝗥\n\nGod is still faithful. Don't give up!\n\nWishing you a rewarding and enriching reading encounter with God."
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
