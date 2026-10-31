/* lock.js - access code check against your Google Apps Script web app.
   Paste your Web App URL into API_URL (see Deployment.md). Each code works on one device only. */
(function () {
  'use strict';

  var CFG = {
    API_URL: 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE',
    PRODUCT: 'dont-give-up',     /* must match PRODUCT in the Settings sheet */
    VERIFY_HOURS: 6,             /* how often an unlocked device re-checks its code (when online) */
    TIMEOUT_MS: 25000
  };

  var K = { token: 'ebook_token', device: 'ebook_device', verified: 'ebook_verified' };

  var MESSAGES = {
    invalid: 'That code was not found. Check the code and try again.',
    used: 'This code is already active on another device. Each code works on one device only.',
    revoked: 'This code has been disabled. Please contact support.',
    unbound: 'Your access was reset. Enter your code again to unlock this device.',
    product: 'This code belongs to a different product.',
    missing: 'Enter your access code.',
    network: 'No internet connection. You need to be online the first time you unlock the book.',
    timeout: 'The server took too long to answer. Check your connection and try again.',
    not_configured: 'The app is not connected yet. The admin must paste the Web App URL into lock.js.',
    not_installed: 'The database is not installed yet. The admin must run Install / Repair Database.',
    server: 'Something went wrong on the server. Please try again in a moment.'
  };

  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function drop(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function normalize(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }

  function deviceId() {
    var id = read(K.device);
    if (id) { return id; }
    var a = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(a);
    id = Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    write(K.device, id);
    return id;
  }

  function configured() { return /^https:\/\/script\.google\.com\//.test(CFG.API_URL); }

  /* Every backend call goes through here: spinner at screen center, timeout, clean errors. */
  function api(payload, label) {
    if (!configured()) { return Promise.resolve({ ok: false, error: 'not_configured' }); }
    if (!navigator.onLine) { return Promise.resolve({ ok: false, error: 'network' }); }
    UI.spinner(true, label);
    var ctl = new AbortController();
    var timer = setTimeout(function () { ctl.abort(); }, CFG.TIMEOUT_MS);
    return fetch(CFG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: ctl.signal
    }).then(function (r) { return r.json(); })
      .catch(function (e) { return { ok: false, error: e && e.name === 'AbortError' ? 'timeout' : 'network' }; })
      .then(function (res) {
        clearTimeout(timer);
        UI.spinner(false);
        return res && typeof res === 'object' ? res : { ok: false, error: 'server' };
      });
  }

  function hasToken() { return !!read(K.token); }
  function token() { try { return JSON.parse(read(K.token) || 'null'); } catch (e) { return null; } }

  function wipe() { drop(K.token); drop(K.verified); Book.clear(); }

  /* First unlock on this device */
  function unlock(code) {
    var c = normalize(code);
    if (!c) { return Promise.resolve({ ok: false, error: 'missing' }); }
    var device = deviceId();
    return api({ action: 'activate', code: c, device: device, product: CFG.PRODUCT }, 'Checking your code...')
      .then(function (res) {
        if (res.ok && Array.isArray(res.book) && res.book.length) {
          write(K.token, JSON.stringify({ code: c, at: Date.now() }));
          write(K.verified, String(Date.now()));
          Book.save(res.book);
          return { ok: true };
        }
        return { ok: false, error: res.ok ? 'server' : (res.error || 'server') };
      });
  }

  /* Re-check an unlocked device. Offline or slow network never locks the reader out. */
  function verify(force) {
    var t = token();
    if (!t) { return Promise.resolve({ ok: false, error: 'none' }); }
    var last = parseInt(read(K.verified), 10) || 0;
    var due = Date.now() - last > CFG.VERIFY_HOURS * 3600000;
    if (!force && !due && Book.has()) { return Promise.resolve({ ok: true, skipped: true }); }
    return api({ action: 'verify', code: t.code, device: deviceId(), product: CFG.PRODUCT }, 'Checking your access...')
      .then(function (res) {
        if (res.ok && Array.isArray(res.book) && res.book.length) {
          write(K.verified, String(Date.now()));
          Book.save(res.book);
          return { ok: true, refreshed: true };
        }
        var definitive = { invalid: 1, revoked: 1, used: 1, unbound: 1, product: 1 };
        if (definitive[res.error]) { wipe(); return { ok: false, error: res.error }; }
        /* network, timeout, server problems: keep reading from the saved copy */
        return { ok: Book.has(), offline: true, error: res.error };
      });
  }

  window.Lock = {
    cfg: CFG,
    normalize: normalize,
    hasToken: hasToken,
    unlock: unlock,
    verify: verify,
    wipe: wipe,
    message: function (e) { return MESSAGES[e] || MESSAGES.server; }
  };
})();
