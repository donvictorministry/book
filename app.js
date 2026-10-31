/* app.js - Ebook app logic. Android phones only. */
(function () {
  'use strict';
  if (document.documentElement.classList.contains('blocked')) { return; }

  /* ---------- helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var ICON = {
    menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
    list: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z',
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    prev: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
    next: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    moon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z',
    sun: 'M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z',
    close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    help: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
    doc: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    mail: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
    whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
    facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    checkc: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    error: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
    del: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    install: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    share: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z',
    todo: 'M22 7h-9v2h9V7zm0 8h-9v2h9v-2zM5.54 11L2 7.46l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41L5.54 11zm0 8L2 15.46l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41L5.54 19z',
    textsize: 'M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z',
    lock: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
    boxoff: 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z',
    boxon: 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    cross: 'M10 2h4v7h7v4h-7v9h-4v-9H3V9h7z',
    eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    eyeoff: 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'
  };
  function svg(name, size) {
    var s = size || 24;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="currentColor" aria-hidden="true"><path d="' + ICON[name] + '"/></svg>';
  }

  /* ---------- UI: spinner, toast, dialogs (all centered, no browser alerts) ---------- */
  var UI = window.UI = {};
  var spinCount = 0;
  UI.spinner = function (on, msg) {
    var el = $('#spinner');
    if (on) {
      spinCount++;
      $('#spinMsg').textContent = msg || 'Please wait...';
      el.classList.add('show');
    } else {
      spinCount = Math.max(0, spinCount - 1);
      if (!spinCount) { el.classList.remove('show'); }
    }
  };
  var toastTimer;
  UI.toast = function (msg, type) {
    var t = $('#toast');
    t.textContent = msg;
    t.className = (type || '') + ' show';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = type || ''; }, 2200);
  };
  UI.dialog = function (o) {
    return new Promise(function (resolve) {
      var type = o.type || 'info';
      var acts = o.actions || [{ label: 'OK', value: 'ok' }];
      var wrap = document.createElement('div');
      wrap.className = 'dlg-scrim';
      var icon = type === 'success' ? 'checkc' : (type === 'error' ? 'error' : 'info');
      wrap.innerHTML = '<div class="dlg" role="alertdialog" aria-modal="true"><div class="dlg-ic ' + type + '">' + svg(icon, 38) +
        '</div><h2></h2><p></p><div class="dlg-actions"></div></div>';
      $('h2', wrap).textContent = o.title || '';
      $('p', wrap).textContent = o.message || '';
      var box = $('.dlg-actions', wrap);
      acts.forEach(function (a) {
        var b = document.createElement('button');
        b.className = 'btn ' + (a.style || '');
        b.textContent = a.label;
        b.onclick = function () { wrap.remove(); resolve(a.value); };
        box.appendChild(b);
      });
      $('#dialogHost').appendChild(wrap);
      if (box.lastChild) { box.lastChild.focus(); }
    });
  };
  UI.confirm = function (title, message, okLabel, danger) {
    return UI.dialog({
      type: 'info', title: title, message: message,
      actions: [{ label: 'Cancel', value: false, style: 'outline' }, { label: okLabel || 'OK', value: true, style: danger ? 'danger' : '' }]
    });
  };

  /* touch ripple */
  document.addEventListener('pointerdown', function (e) {
    var t = e.target.closest ? e.target.closest('button, a.cta') : null;
    if (!t || t.disabled) { return; }
    var r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
    var sp = document.createElement('span');
    sp.className = 'ripple';
    sp.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    t.appendChild(sp);
    setTimeout(function () { sp.remove(); }, 600);
  });

  /* ---------- theme and text size ---------- */
  var root = document.documentElement;
  function theme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    put('ebook_theme', t);
    var m = $('meta[name="theme-color"]');
    if (m) { m.content = t === 'dark' ? '#121212' : '#FFFFFF'; }
    syncTheme();
  }
  function syncTheme() {
    var dark = theme() === 'dark';
    $('#btnDark .pill').innerHTML = svg(dark ? 'sun' : 'moon');
    $('#btnDark .lbl').textContent = dark ? 'Light' : 'Dark';
    var sw = $('#swDark');
    if (sw) { sw.setAttribute('aria-checked', String(dark)); }
  }
  function fontSize() {
    var f = parseInt(get('ebook_fs', '19'), 10);
    return f >= 19 && f <= 23 ? f : 19;
  }
  function setFont(n) {
    n = Math.max(19, Math.min(23, n));
    root.style.setProperty('--fs', n + 'px');
    put('ebook_fs', String(n));
    var v = $('#fsVal'), r = $('#fsRange');
    if (v) { v.textContent = n + ' px'; }
    if (r) { r.value = n; }
  }

  /* ---------- overlays: each level has its own history entry, so Android back
     closes the page first, then the menu, then returns to the home page ---------- */
  var stack = [];
  function applyOv() {
    $('#drawerLeft').classList.toggle('open', stack.indexOf('left') > -1);
    $('#drawerRight').classList.toggle('open', stack.indexOf('right') > -1);
    $('#sheet').classList.toggle('open', stack.indexOf('sheet') > -1);
  }
  function pushOv(kind) {
    if (stack[stack.length - 1] === kind) { return; }
    stack.push(kind);
    history.pushState({ ov: stack.length }, '');
    applyOv();
  }
  function backOv() {
    if (!stack.length) { return; }
    stack.pop();
    applyOv();
    history.back();
  }
  function closeAll() {
    var n = stack.length;
    if (!n) { return; }
    stack.length = 0;
    applyOv();
    history.go(-n);
  }
  window.addEventListener('popstate', function (e) {
    var depth = (e.state && e.state.ov) || 0;
    if (stack.length > depth) { stack.length = depth; applyOv(); }
  });

  function openSheet(title, html, after) {
    $('#sheetTitle').textContent = title;
    $('#sheetBody').innerHTML = html;
    $('#sheetBody').scrollTop = 0;
    pushOv('sheet');
    if (after) { after(); }
  }

  /* ---------- information pages (left menu) ---------- */
  var M = Book.meta;
  function ctaRow() {
    var wa = 'https://wa.me/' + String(M.whatsapp).replace(/[^0-9]/g, '');
    return '<div class="cta-row">' +
      '<a class="cta email" href="mailto:' + esc(M.email) + '" aria-label="Email us">' + svg('mail', 30) + '</a>' +
      '<a class="cta whatsapp" href="' + esc(wa) + '" target="_blank" rel="noopener" aria-label="WhatsApp us">' + svg('whatsapp', 30) + '</a>' +
      '<a class="cta facebook" href="' + esc(M.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + svg('facebook', 30) + '</a>' +
      '<a class="cta phone" href="tel:' + esc(M.phone) + '" aria-label="Call us">' + svg('phone', 30) + '</a></div>';
  }
  var PAGES = {
    about: { title: 'About the Book', html: function () {
      return '<div class="info"><h3>' + esc(M.title) + '</h3>' + M.about.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
        '<p><b>Author:</b> ' + esc(M.author) + '</p><p><b>Edition:</b> ' + esc(M.edition) + '</p>' + ctaRow() + '</div>';
    } },
    dev: { title: 'About Developer', html: function () {
      var d = M.developer;
      return '<div class="info center"><img class="dev-photo" id="devPhoto" alt="' + esc(d.name) + '" src="' + esc(d.photo) + '">' +
        '<h3>' + esc(d.name) + '</h3><p class="muted">' + esc(d.role) + '</p><p>' + esc(d.bio) + '</p>' + ctaRow() + '</div>';
    }, after: function () {
      var img = $('#devPhoto');
      if (img) { img.onerror = function () { img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#F7C6D6"/><path fill="#DF1E5A" d="' + ICON.person + '"/></svg>'); }; }
    } },
    how: { title: 'How to Use', html: function () {
      return '<div class="info"><h3>Unlock</h3><ol><li>Type the access code you received and tap Unlock Book.</li><li>Each code works on one device only. Do not share it.</li></ol>' +
        '<h3>Move through the book</h3><ul><li><b>TOC</b> opens the Table of Contents.</li><li><b>Front</b> returns to the front page.</li><li><b>Prev</b> and <b>Next</b> turn the page.</li><li><b>Dark</b> switches dark and light mode.</li></ul>' +
        '<h3>Menus</h3><ul><li>The left menu has information about the book and the ministry.</li><li>The right menu has text size, dark mode, your to-do list, Install App and Share App.</li></ul>' +
        '<h3>Offline</h3><p>After you unlock the book once, it works without internet. It checks your access again when you are online.</p></div>';
    } },
    terms: { title: 'Terms of Use', html: function () {
      return '<div class="info"><h3>Copyright</h3><p>Copyright 2025 ' + esc(M.author) + '. All rights reserved.</p>' +
        '<h3>One-device license</h3><p>Your access code unlocks this book on one device only, for your personal reading and spiritual growth.</p>' +
        '<h3>You may</h3><ul><li>Read the book on your unlocked device.</li><li>Quote short passages with full credit for non-commercial ministry use.</li><li>Share the app link so others can ask for their own code.</li></ul>' +
        '<h3>You may not</h3><ul><li>Share, sell, or give away your access code.</li><li>Copy, republish, or redistribute the text.</li><li>Create derivative works without written permission.</li></ul>' +
        '<h3>Access changes</h3><p>Codes that are shared or resold can be disabled without notice.</p><h3>Permissions</h3><p>Write to ' + esc(M.email) + ' for permission requests.</p></div>';
    } },
    support: { title: 'Support Us', html: function () {
      return '<div class="info"><p>This ministry flourishes because of people who faithfully stand with us. Here is how you can help.</p>' +
        '<ul><li><b>Pray</b> for the lives this message reaches.</li><li><b>Give</b> to fund ministry outreach and new resources. Contact us for giving details.</li><li><b>Share</b> the app with someone who needs encouragement.</li><li><b>Volunteer</b> your time and skills.</li></ul>' +
        '<p>Heaven records every seed sown for the Gospel. Thank you for partnering with us.</p>' + ctaRow() + '</div>';
    } },
    contact: { title: 'Contact Us', html: function () {
      return '<div class="info"><p>Need a prayer, a testimony to share, an access code, or help with the app? Reach out. We reply within 48 hours.</p>' +
        '<p><b>Email:</b> ' + esc(M.email) + '</p><p><b>Phone:</b> ' + esc(M.phone) + '</p>' + ctaRow() + '</div>';
    } }
  };
  function openInfo(key) {
    var p = PAGES[key];
    if (p) { openSheet(p.title, p.html(), p.after); }
  }

  /* ---------- menus ---------- */
  function buildMenus() {
    $('#btnLeft').innerHTML = svg('menu');
    $('#btnRight').innerHTML = svg('more');
    $('#sheetBack').innerHTML = svg('back');
    $('#leftBack').innerHTML = svg('back');
    $('#rightBack').innerHTML = svg('back');
    $('#drLogo').innerHTML = svg('cross', 30);
    $('#drLogo2').innerHTML = svg('cross', 30);

    var left = [['info', 'About the Book', 'about'], ['person', 'About Developer', 'dev'], ['help', 'How to Use', 'how'],
      ['doc', 'Terms of Use', 'terms'], ['heart', 'Support Us', 'support'], ['mail', 'Contact Us', 'contact']];
    $('#leftList').innerHTML = left.map(function (i) {
      return '<button class="dr-item" data-info="' + i[2] + '"><span class="dr-ic">' + svg(i[0]) + '</span><span class="dr-txt">' + i[1] + '</span></button>';
    }).join('');

    $('#rightList').innerHTML =
      '<div class="dr-row"><span class="dr-ic">' + svg('moon') + '</span><span class="dr-txt">Dark mode</span><button class="switch" id="swDark" role="switch" aria-checked="false" aria-label="Dark mode"></button></div>' +
      '<div class="dr-row col"><div class="dr-line"><span class="dr-ic">' + svg('textsize') + '</span><span class="dr-txt">Text size</span><span class="dr-val" id="fsVal"></span></div>' +
      '<input id="fsRange" type="range" min="19" max="23" step="1" aria-label="Text size from 19 to 23 pixels"></div>' +
      '<button class="dr-item" id="miTodo"><span class="dr-ic">' + svg('todo') + '</span><span class="dr-txt">To-do list</span></button>' +
      '<button class="dr-item" id="miInstall"><span class="dr-ic">' + svg('install') + '</span><span class="dr-txt">Install App</span></button>' +
      '<button class="dr-item" id="miShare"><span class="dr-ic">' + svg('share') + '</span><span class="dr-txt">Share App</span></button>';

    $$('[data-info]').forEach(function (b) { b.addEventListener('click', function () { openInfo(b.getAttribute('data-info')); }); });
    $('#swDark').addEventListener('click', function () { setTheme(theme() === 'dark' ? 'light' : 'dark'); });
    $('#fsRange').addEventListener('input', function () { setFont(parseInt(this.value, 10)); });
    $('#miTodo').addEventListener('click', openTodo);
    $('#miInstall').addEventListener('click', installApp);
    $('#miShare').addEventListener('click', shareApp);

    $('#btnLeft').addEventListener('click', function () { pushOv('left'); });
    $('#btnRight').addEventListener('click', function () { pushOv('right'); });
    $('#sheetBack').addEventListener('click', backOv);
    $('#leftBack').addEventListener('click', backOv);
    $('#rightBack').addEventListener('click', backOv);

    $('#navToc').innerHTML = '<span class="pill">' + svg('list') + '</span><span>TOC</span>';
    $('#navFront').innerHTML = '<span class="pill">' + svg('home') + '</span><span>Front</span>';
    $('#navPrev').innerHTML = '<span class="pill">' + svg('prev') + '</span><span>Prev</span>';
    $('#navNext').innerHTML = '<span class="pill">' + svg('next') + '</span><span>Next</span>';
    $('#btnDark').innerHTML = '<span class="pill"></span><span class="lbl">Dark</span>';
    $('#navToc').addEventListener('click', function () { go('toc'); });
    $('#navFront').addEventListener('click', function () { go('front'); });
    $('#navPrev').addEventListener('click', function () { step(-1); });
    $('#navNext').addEventListener('click', function () { step(1); });
    $('#btnDark').addEventListener('click', function () { setTheme(theme() === 'dark' ? 'light' : 'dark'); });
  }

  /* ---------- views and navigation ---------- */
  var cur = 'welcome';
  var view = $('#view'), main = $('#main');

  function go(id) {
    if (id !== 'front' && id !== 'toc' && !Book.find(id)) { id = 'front'; }
    cur = id;
    if (id !== 'front' && id !== 'toc') { put('ebook_last', id); }
    closeAll();
    render();
    main.scrollTop = 0;
  }
  function step(dir) {
    var ids = Book.ids(), i = ids.indexOf(cur);
    if (i < 0) { return; }
    var n = i + dir;
    if (n >= 0 && n < ids.length) { go(ids[n]); }
  }
  function updateNav() {
    var locked = cur === 'lock' || cur === 'welcome', ids = Book.ids(), i = ids.indexOf(cur);
    $('#navToc').classList.toggle('active', cur === 'toc');
    $('#navFront').classList.toggle('active', cur === 'front');
    $('#navToc').disabled = locked;
    $('#navFront').disabled = locked;
    $('#navPrev').disabled = locked || cur === 'toc' || i <= 0;
    $('#navNext').disabled = locked || cur === 'toc' || i < 0 || i >= ids.length - 1;
    document.body.classList.toggle('locked', locked);
  }
  function render() {
    if (cur === 'welcome') { renderWelcome(); }
    else if (cur === 'lock') { renderLock(); }
    else if (cur === 'front') { renderFront(); }
    else if (cur === 'toc') { renderToc(); }
    else { renderPage(Book.find(cur)); }
    updateNav();
  }

  function renderWelcome() {
    var rays = '', k;
    for (k = 0; k < 12; k++) { rays += '<polygon points="180,150 169,-70 191,-70" transform="rotate(' + (k * 30) + ' 180 150)"/>'; }
    var stars = [[40, 44, 0], [92, 84, 1.2], [300, 52, 0.6], [331, 112, 1.8], [250, 28, 2.2], [58, 142, 2.6], [311, 184, 0.9], [122, 30, 1.5]]
      .map(function (s) { return '<circle class="tw" cx="' + s[0] + '" cy="' + s[1] + '" r="2.4" fill="#FFFFFF" style="animation-delay:' + s[2] + 's"/>'; }).join('');
    var dots = [[70, 270, 0], [140, 280, 2], [215, 276, 4], [290, 272, 1], [180, 282, 3], [110, 274, 5]]
      .map(function (s) { return '<circle class="pt" cx="' + s[0] + '" cy="' + s[1] + '" r="3" fill="#FFE3EC" style="animation-delay:' + s[2] + 's"/>'; }).join('');
    view.innerHTML = '<div class="welcome"><div class="w-art" aria-hidden="true">' +
      '<svg viewBox="0 0 360 320" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="wGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFE3EC" stop-opacity="0.95"/><stop offset="0.45" stop-color="#FF7BA3" stop-opacity="0.45"/><stop offset="1" stop-color="#DF1E5A" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="wM1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B3124A"/><stop offset="1" stop-color="#6E0A2E"/></linearGradient>' +
      '<linearGradient id="wM2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E0F3A"/><stop offset="1" stop-color="#4A0720"/></linearGradient>' +
      '<linearGradient id="wM3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5C0829"/><stop offset="1" stop-color="#2B0616"/></linearGradient></defs>' +
      '<g class="w-rays" fill="#FFE3EC" fill-opacity="0.16">' + rays + '</g>' +
      '<circle class="w-glow" cx="180" cy="150" r="130" fill="url(#wGlow)"/>' + stars +
      '<g class="w-cross"><rect x="168" y="94" width="24" height="112" rx="9" fill="#FFFFFF"/><rect x="136" y="124" width="88" height="24" rx="9" fill="#FFFFFF"/></g>' +
      '<path d="M0 250 L60 205 L110 235 L170 190 L230 238 L290 200 L360 245 L360 330 L0 330Z" fill="url(#wM1)"/>' +
      '<path d="M0 276 L70 236 L130 268 L200 228 L270 272 L330 246 L360 262 L360 330 L0 330Z" fill="url(#wM2)"/>' + dots +
      '<path d="M0 302 L80 272 L150 298 L230 268 L300 296 L360 282 L360 330 L0 330Z" fill="url(#wM3)"/></svg></div>' +
      '<div class="w-body"><div class="w-kicker" style="animation-delay:.2s">' + esc(M.author) + '</div>' +
      '<h2 class="w-title" style="animation-delay:.35s">' + esc(M.title) + '</h2>' +
      '<div class="w-tag" style="animation-delay:.5s">Your breakthrough is coming.</div>' +
      '<p class="w-text" style="animation-delay:.65s">Unlock your copy with the access code you received, then read online or offline.</p>' +
      '<button class="btn light block w-cta" id="btnStart">Get Started ' + svg('next') + '</button></div></div>';
    $('#btnStart').addEventListener('click', function () { cur = 'lock'; render(); main.scrollTop = 0; });
  }

  function renderLock() {
    view.innerHTML = '<div class="lock"><div class="lock-ic">' + svg('lock', 48) + '</div>' +
      '<h2>Unlock your book</h2>' +
      '<p class="muted">Enter the access code you received. Each code works on one device only.</p>' +
      '<div class="field"><label for="codeInput">Access code</label>' +
      '<div class="pw"><input id="codeInput" type="password" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" enterkeyhint="go" placeholder="Enter code">' +
      '<button class="eye" id="btnEye" type="button" aria-label="Show code" aria-pressed="false">' + svg('eye') + '</button></div></div>' +
      '<button class="btn block" id="btnUnlock">Unlock Book</button>' +
      '<button class="btn text" id="btnNeedCode">Need a code? Contact us</button>' +
      '<button class="btn text" id="btnWelcome">Back</button></div>';
    $('#btnUnlock').addEventListener('click', doUnlock);
    $('#codeInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') { doUnlock(); } });
    $('#btnEye').addEventListener('click', function () {
      var inp = $('#codeInput'), show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      this.setAttribute('aria-pressed', String(show));
      this.setAttribute('aria-label', show ? 'Hide code' : 'Show code');
      this.innerHTML = svg(show ? 'eyeoff' : 'eye');
      inp.focus();
    });
    $('#btnNeedCode').addEventListener('click', function () { openInfo('contact'); });
    $('#btnWelcome').addEventListener('click', function () { cur = 'welcome'; render(); main.scrollTop = 0; });
  }

  function doUnlock() {
    var input = $('#codeInput');
    if (!Lock.normalize(input.value)) { UI.toast('Enter your access code', 'error'); input.focus(); return; }
    Lock.unlock(input.value).then(function (r) {
      if (r.ok) {
        cur = 'front';
        render();
        UI.dialog({
          type: 'success', title: 'Book unlocked',
          message: 'This book is now unlocked on this device. It works offline from now on.',
          actions: [{ label: 'Start reading', value: 'ok' }]
        });
      } else {
        UI.dialog({ type: 'error', title: 'Could not unlock', message: Lock.message(r.error) });
      }
    });
  }

  function renderFront() {
    var ids = Book.ids(), last = Book.find(get('ebook_last', ''));
    view.innerHTML = '<div class="cover"><div>' + svg('cross', 72) + '</div>' +
      '<p class="cover-ed">' + esc(M.kicker) + '</p>' +
      '<h2 class="cover-title">' + esc(M.title) + '</h2>' +
      '<p class="cover-sub">' + esc(M.subtitle) + '</p>' +
      '<p class="cover-author">' + esc(M.author) + '</p>' +
      '<p class="cover-ed">' + esc(M.edition) + '</p>' +
      '<div class="cover-actions"><button class="btn light block" id="cvStart">Start Reading</button>' +
      (last ? '<button class="btn ghost block" id="cvCont">Continue: ' + esc(last.title) + '</button>' : '') +
      '<button class="btn ghost block" id="cvToc">Table of Contents</button></div></div>';
    $('#cvStart').addEventListener('click', function () { if (ids[1]) { go(ids[1]); } });
    if (last) { $('#cvCont').addEventListener('click', function () { go(last.id); }); }
    $('#cvToc').addEventListener('click', function () { go('toc'); });
  }

  function renderToc() {
    var h = '<div class="toc"><h2>Table of Contents</h2>';
    Book.sections().forEach(function (s) {
      h += '<div class="toc-sec">' + esc(s.name) + '</div>';
      s.items.forEach(function (c) {
        h += '<button class="toc-item' + (c.id === get('ebook_last', '') ? ' current' : '') + '" data-id="' + esc(c.id) + '"><span>' + esc(c.title) + '</span>' + svg('next') + '</button>';
      });
    });
    view.innerHTML = h + '</div>';
    $$('.toc-item').forEach(function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-id')); }); });
  }

  function renderPage(ch) {
    var ids = Book.ids(), i = ids.indexOf(ch.id);
    var h = '<article class="page"><div class="eyebrow">' + esc(ch.section) + '</div><h2>' + esc(ch.title) + '</h2>';
    Book.parse(ch.body).forEach(function (b) {
      if (b.t === 'quote') { h += '<blockquote class="quote"><p>' + esc(b.text) + '</p>' + (b.cite ? '<cite>' + esc(b.cite) + '</cite>' : '') + '</blockquote>'; }
      else if (b.t === 'sub') { h += '<h3 class="sub">' + esc(b.text) + '</h3>'; }
      else if (b.t === 'decl') { h += '<div class="decl"><b>Declaration</b><p>' + esc(b.text) + '</p></div>'; }
      else { h += '<p>' + esc(b.text) + '</p>'; }
    });
    h += '</article><div class="pager">' +
      '<button class="btn outline" id="pgPrev">Previous</button>' +
      (i < ids.length - 1 ? '<button class="btn" id="pgNext">Next</button>' : '<button class="btn" id="pgFront">Back to Front</button>') + '</div>';
    view.innerHTML = h;
    $('#pgPrev').addEventListener('click', function () { step(-1); });
    if ($('#pgNext')) { $('#pgNext').addEventListener('click', function () { step(1); }); }
    if ($('#pgFront')) { $('#pgFront').addEventListener('click', function () { go('front'); }); }
  }

  /* ---------- to-do list ---------- */
  function todos() { try { return JSON.parse(get('ebook_todos', '[]')) || []; } catch (e) { return []; } }
  function saveTodos(t) { put('ebook_todos', JSON.stringify(t)); }
  function openTodo() {
    openSheet('To-do list', '<div id="todoBox"></div>', drawTodo);
  }
  function drawTodo() {
    var t = todos(), done = t.filter(function (x) { return x.done; }).length;
    var h = '<div class="todo-add"><input id="todoText" type="text" maxlength="120" placeholder="Add a task" enterkeyhint="done" aria-label="New task">' +
      '<button class="btn" id="todoAdd" aria-label="Add task">' + svg('add') + '</button></div>';
    h += '<p class="todo-sum">' + (t.length ? done + ' of ' + t.length + ' done' : 'No tasks yet. Add your reading or prayer plan.') + '</p>';
    t.forEach(function (x) {
      h += '<div class="todo-item' + (x.done ? ' done' : '') + '"><button class="iconbtn" data-tg="' + x.id + '" aria-label="Mark done">' + svg(x.done ? 'boxon' : 'boxoff') +
        '</button><span class="tx">' + esc(x.text) + '</span><button class="iconbtn" data-rm="' + x.id + '" aria-label="Delete task">' + svg('del') + '</button></div>';
    });
    if (done) { h += '<div style="margin-top:16px"><button class="btn outline block" id="todoClear">Clear completed</button></div>'; }
    $('#todoBox').innerHTML = h;
    $('#todoAdd').addEventListener('click', addTodo);
    $('#todoText').addEventListener('keydown', function (e) { if (e.key === 'Enter') { addTodo(); } });
    $$('[data-tg]').forEach(function (b) { b.addEventListener('click', function () {
      var list = todos(); list.forEach(function (x) { if (String(x.id) === b.getAttribute('data-tg')) { x.done = !x.done; } });
      saveTodos(list); drawTodo();
    }); });
    $$('[data-rm]').forEach(function (b) { b.addEventListener('click', function () {
      UI.confirm('Delete task?', 'This task will be removed from your list.', 'Delete', true).then(function (ok) {
        if (!ok) { return; }
        saveTodos(todos().filter(function (x) { return String(x.id) !== b.getAttribute('data-rm'); }));
        drawTodo(); UI.toast('Task deleted', 'success');
      });
    }); });
    if ($('#todoClear')) { $('#todoClear').addEventListener('click', function () {
      UI.confirm('Clear completed?', 'All finished tasks will be removed.', 'Clear', true).then(function (ok) {
        if (!ok) { return; }
        saveTodos(todos().filter(function (x) { return !x.done; }));
        drawTodo(); UI.toast('Completed tasks cleared', 'success');
      });
    }); }
  }
  function addTodo() {
    var inp = $('#todoText'), v = inp.value.trim();
    if (!v) { UI.toast('Type a task first', 'error'); return; }
    var list = todos(); list.push({ id: Date.now(), text: v, done: false });
    saveTodos(list); drawTodo(); UI.toast('Task added', 'success');
    $('#todoText').focus();
  }

  /* ---------- install and share ---------- */
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener('appinstalled', function () { deferred = null; UI.toast('App installed', 'success'); });
  function installApp() {
    var standalone = window.matchMedia && matchMedia('(display-mode: standalone)').matches;
    if (standalone) { UI.dialog({ type: 'info', title: 'Already installed', message: 'You are using the installed app.' }); return; }
    if (deferred) {
      UI.confirm('Install this app?', 'Add Ebook to your home screen so it opens like a normal app.', 'Install').then(function (ok) {
        if (!ok) { return; }
        deferred.prompt();
        deferred.userChoice.then(function () { deferred = null; });
      });
      return;
    }
    UI.dialog({ type: 'info', title: 'Install this app', message: 'Tap the three dots in Chrome, then choose Add to Home screen or Install app.' });
  }
  function shareApp() {
    var url = M.shareUrl || location.href.split('#')[0];
    if (navigator.share) { navigator.share({ title: M.title, text: M.shareText, url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { UI.toast('Link copied', 'success'); }, function () { UI.dialog({ type: 'info', title: 'Share this link', message: url }); });
      return;
    }
    UI.dialog({ type: 'info', title: 'Share this link', message: url });
  }

  /* ---------- start ---------- */
  function start() {
    buildMenus();
    setFont(fontSize());
    syncTheme();

    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
    window.addEventListener('offline', function () { UI.toast('You are offline. Your book still works.'); });
    window.addEventListener('online', function () { UI.toast('Back online', 'success'); });

    if (Lock.hasToken()) {
      if (Book.has()) {
        cur = 'front';
        render();
        Lock.verify(false).then(function (r) {
          if (!r.ok) {
            cur = 'lock';
            render();
            UI.dialog({ type: 'error', title: 'Access ended', message: Lock.message(r.error) });
          } else if (r.refreshed && cur !== 'front' && cur !== 'toc' && !Book.find(cur)) {
            go('front');
          } else if (r.refreshed) {
            render();
          }
        });
      } else {
        /* token without a saved copy (storage was cleared): fetch the book again */
        cur = 'lock';
        render();
        Lock.verify(true).then(function (r) {
          if (r.ok && Book.has()) { go('front'); }
          else if (!r.ok && r.error && r.error !== 'none') { UI.dialog({ type: 'error', title: 'Could not open the book', message: Lock.message(r.error) }); }
        });
      }
    } else {
      cur = 'welcome';
      render();
    }
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
