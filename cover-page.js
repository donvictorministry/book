/* cover-page.js - the cover (welcome) page of "Don't Give Up!"
 *
 * STANDALONE: this file carries its own CSS, HTML and JavaScript.
 * The book works without it. If you delete or edit this file, the app simply
 * skips the cover and opens the access-code screen. Nothing else is affected.
 *
 * Contract with the app (the only link between them):
 *     window.CoverPage.render(containerElement, onBegin)
 * It also fires a "coverpage:begin" event on the container when the button is tapped.
 */
(function () {
  'use strict';
  try {
    /* ---------- edit the words and colours here ---------- */
    var TEXT = {
      line1: "Don't Give",
      line2: 'Up!',
      kicker: 'A DEVOTIONAL BY',
      author: 'Rev. Dr. Chris Johnson, PhD',
      button: 'BEGIN JOURNEY'
    };
    var C = {
      brand: '#DF1E5A', brandDark: '#B3124A', brandDeep: '#6E0A2E', plum: '#3A0A1F',
      gold: '#FFD54A', goldDeep: '#D9981E', goldPale: '#FFF3C4', cloud: '#FFE9F1'
    };
    /* ----------------------------------------------------- */

    var STYLE_ID = 'cvp-style';

    function css() {
      return [
        '.cvp{position:fixed;inset:0;z-index:30;width:100dvw;height:100dvh;overflow:hidden;color:#FFFFFF;',
        'background:radial-gradient(ellipse 120% 70% at 50% -6%,#FFF6E6 0%,#FFC9D9 14%,#F2578D 38%,' + C.brand + ' 56%,' + C.brandDark + ' 80%,' + C.brandDeep + ' 100%);',
        'font-family:Roboto,Inter,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-user-select:none;user-select:none}',
        '.cvp *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
        '.cvp-art{position:absolute;inset:0;width:100%;height:100%;display:block}',
        '.cvp-content{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;',
        'padding:env(safe-area-inset-top,0px) 24px calc(env(safe-area-inset-bottom,0px) + 28px)}',
        '.cvp-top{flex:1.25 1 0;min-height:24px}',
        '.cvp-gap{flex:1 1 0;min-height:12px}',
        '.cvp-title{margin:0;font-family:Georgia,"Times New Roman",serif;font-weight:700;letter-spacing:-.01em}',
        '.cvp-l1{display:block;font-size:clamp(46px,15vw,76px);line-height:1;color:#FFFFFF;text-shadow:0 4px 22px rgba(110,10,46,.45)}',
        '.cvp-l2{display:block;font-size:clamp(72px,25vw,124px);line-height:.95;color:' + C.gold + ';',
        'background:linear-gradient(180deg,' + C.goldPale + ' 0%,' + C.gold + ' 46%,' + C.goldDeep + ' 100%);-webkit-background-clip:text;background-clip:text;',
        '-webkit-text-fill-color:transparent;filter:drop-shadow(0 5px 16px rgba(110,10,46,.5))}',
        '.cvp-orn{width:78%;height:24px;margin-top:20px}',
        '.cvp-orn svg{width:100%;height:100%;display:block}',
        '.cvp-book{margin-top:22px;width:64px;height:42px;filter:drop-shadow(0 0 10px rgba(255,213,74,.7))}',
        '.cvp-book svg{width:100%;height:100%;display:block}',
        '.cvp-by{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:22px;font-size:19px;font-weight:600;line-height:1.2;letter-spacing:.16em;color:#FFF1D0}',
        '.cvp-by i{display:block;width:34px;height:2px;background:linear-gradient(90deg,rgba(255,213,74,0),' + C.gold + ')}',
        '.cvp-by i:last-child{transform:scaleX(-1)}',
        '.cvp-author{margin-top:12px;font-size:20px;font-weight:600;line-height:1.3;letter-spacing:.06em;color:#FFFFFF;text-shadow:0 2px 10px rgba(110,10,46,.5)}',
        '.cvp-stage{position:relative;width:100%;height:152px;flex:none}',
        '.cvp-pod{position:absolute;left:0;right:0;bottom:0;width:100%;height:132px;display:block}',
        '.cvp-btn{position:absolute;left:7%;right:7%;bottom:54px;height:66px;display:flex;align-items:center;justify-content:center;gap:16px;',
        'border:3px solid #E9B93C;border-radius:33px;cursor:pointer;color:#FFFFFF;font:700 22px/1 Roboto,Inter,system-ui,sans-serif;letter-spacing:.08em;',
        'background:linear-gradient(180deg,#F23E78 0%,' + C.brandDark + ' 52%,#7A0D38 100%);',
        'box-shadow:inset 0 2px 0 rgba(255,255,255,.35),inset 0 -6px 14px rgba(58,10,31,.45),0 0 0 2px rgba(255,243,196,.35),0 10px 26px rgba(58,10,31,.5);',
        'animation:cvpglow 2.6s ease-in-out infinite;padding:0 12px}',
        '.cvp-btn:active{transform:scale(.97);filter:brightness(.95)}',
        '.cvp-btn svg{width:34px;height:24px;flex:none;display:block}',
        '.cvp-drift1{animation:cvpdrift 26s ease-in-out infinite alternate}',
        '.cvp-drift2{animation:cvpdrift 34s ease-in-out -9s infinite alternate-reverse}',
        '.cvp-drift3{animation:cvpdrift 30s ease-in-out -4s infinite alternate}',
        '.cvp-sway{transform-origin:180px -20px;animation:cvpsway 14s ease-in-out infinite alternate}',
        '.cvp-tw{animation:cvptw 3.2s ease-in-out infinite}',
        '.cvp-wave{animation:cvpwave 7s ease-in-out infinite alternate}',
        '.cvp-shine{animation:cvpshine 5s ease-in-out infinite}',
        '.cvp-in{opacity:0;animation:cvpup .9s cubic-bezier(.2,0,0,1) forwards}',
        '@keyframes cvpdrift{from{transform:translateX(-14px)}to{transform:translateX(14px)}}',
        '@keyframes cvpsway{from{transform:rotate(-2.2deg)}to{transform:rotate(2.2deg)}}',
        '@keyframes cvptw{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:1;transform:scale(1.15)}}',
        '@keyframes cvpwave{from{transform:translateX(-12px)}to{transform:translateX(12px)}}',
        '@keyframes cvpshine{0%,100%{opacity:.35}50%{opacity:.8}}',
        '@keyframes cvpup{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}',
        '@keyframes cvpglow{0%,100%{box-shadow:inset 0 2px 0 rgba(255,255,255,.35),inset 0 -6px 14px rgba(58,10,31,.45),0 0 0 2px rgba(255,243,196,.35),0 10px 26px rgba(58,10,31,.5)}',
        '50%{box-shadow:inset 0 2px 0 rgba(255,255,255,.35),inset 0 -6px 14px rgba(58,10,31,.45),0 0 0 6px rgba(255,243,196,.28),0 10px 34px rgba(255,213,74,.55)}}',
        '@media (max-height:640px){.cvp-l1{font-size:clamp(40px,12vw,60px)}.cvp-l2{font-size:clamp(58px,19vw,92px)}.cvp-orn{margin-top:12px}.cvp-book{margin-top:12px}.cvp-by{margin-top:12px}.cvp-stage{height:140px}}',
        '@media (prefers-reduced-motion:reduce){.cvp *{animation-duration:.01ms!important;animation-iteration-count:1!important;animation-delay:0s!important}}'
      ].join('');
    }

    function cloud(x, y, s, o, cls) {
      return '<g class="' + cls + '"><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" filter="url(#cvpBlur)" opacity="' + o + '" fill="' + C.cloud + '">' +
        '<circle cx="0" cy="0" r="34"/><circle cx="38" cy="-14" r="44"/><circle cx="82" cy="0" r="38"/><circle cx="116" cy="14" r="28"/><ellipse cx="58" cy="26" rx="86" ry="22"/></g></g>';
    }
    function spark(x, y, s, d) {
      return '<path class="cvp-tw" style="animation-delay:' + d + 's;transform-box:fill-box;transform-origin:center" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" ' +
        'd="M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8Z" fill="' + C.goldPale + '"/>';
    }

    function art() {
      var rays = '', i;
      for (i = -9; i <= 9; i++) {
        var x = 180 + Math.tan(i * 7 * Math.PI / 180) * 820, w = 10 + (i % 3 === 0 ? 8 : 0);
        rays += '<polygon points="180,-20 ' + (x - w).toFixed(1) + ',780 ' + (x + w).toFixed(1) + ',780" opacity="' + (i % 2 ? 0.5 : 0.8) + '"/>';
      }
      var waves = '';
      for (i = 0; i < 6; i++) {
        waves += '<rect x="' + (20 + i * 38) + '" y="' + (706 + (i % 3) * 8) + '" width="' + (90 - (i % 3) * 18) + '" height="2.4" rx="1.2" fill="' + C.goldPale + '" opacity="' + (0.25 + (i % 3) * 0.12) + '"/>';
      }
      return '<svg class="cvp-art" viewBox="0 0 360 740" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
        '<radialGradient id="cvpSun" cx="50%" cy="0%" r="75%"><stop offset="0" stop-color="#FFFFFF" stop-opacity="1"/><stop offset=".16" stop-color="#FFF3C4" stop-opacity=".95"/><stop offset=".42" stop-color="#FFC0D3" stop-opacity=".45"/><stop offset="1" stop-color="' + C.brand + '" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="cvpRay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".6"/><stop offset=".7" stop-color="#FFE9F1" stop-opacity=".12"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="cvpRib" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".5" stop-color="' + C.goldPale + '" stop-opacity=".95"/><stop offset="1" stop-color="' + C.gold + '" stop-opacity="0"/></linearGradient>' +
        '<filter id="cvpBlur" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="5.5"/></filter>' +
        '<filter id="cvpBlurS"><feGaussianBlur stdDeviation="14"/></filter>' +
        '</defs>' +
        '<ellipse cx="180" cy="-20" rx="300" ry="260" fill="url(#cvpSun)"/>' +
        '<g class="cvp-sway" fill="url(#cvpRay)">' + rays + '</g>' +
        '<circle cx="180" cy="-6" r="46" fill="#FFFFFF" opacity=".9" filter="url(#cvpBlurS)"/>' +
        '<circle cx="180" cy="318" r="196" fill="none" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="1.6"/>' +
        '<circle cx="180" cy="318" r="204" fill="none" stroke="' + C.goldPale + '" stroke-opacity=".16" stroke-width="1"/>' +
        '<path d="M-20 332 C 38 292 122 326 150 420 S 58 524 -32 474" fill="rgba(255,255,255,.07)" stroke="url(#cvpRib)" stroke-width="2.2"/>' +
        '<path d="M-14 350 C 40 316 110 344 134 420 S 54 500 -26 462" fill="none" stroke="url(#cvpRib)" stroke-width="1.2" opacity=".7"/>' +
        '<path d="M382 566 C 302 520 240 556 208 606 S 296 650 392 626" fill="rgba(255,255,255,.07)" stroke="url(#cvpRib)" stroke-width="2.2"/>' +
        '<path d="M390 590 C 318 548 262 576 236 612 S 312 640 394 618" fill="none" stroke="url(#cvpRib)" stroke-width="1.2" opacity=".7"/>' +
        cloud(-52, 150, 1.05, 0.9, 'cvp-drift1') + cloud(262, 92, 0.5, 0.6, 'cvp-drift2') + cloud(268, 338, 0.95, 0.9, 'cvp-drift3') +
        cloud(-60, 604, 1.25, 0.95, 'cvp-drift2') + cloud(236, 640, 1.15, 0.95, 'cvp-drift1') +
        spark(60, 250, 1.1, 0) + spark(306, 214, 0.9, 1.1) + spark(120, 130, 0.7, 2.1) + spark(250, 150, 0.8, 0.6) + spark(40, 430, 0.8, 1.6) + spark(330, 470, 1, 2.4) +
        spark(180, 40, 1.3, 0.3) +
        '<rect x="0" y="690" width="360" height="60" fill="' + C.brandDeep + '" opacity=".35"/>' +
        '<g class="cvp-wave">' + waves + '</g></svg>';
    }

    function ornament() {
      return '<svg viewBox="0 0 320 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs>' +
        '<linearGradient id="cvpOrnL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + C.gold + '" stop-opacity="0"/><stop offset="1" stop-color="' + C.gold + '"/></linearGradient>' +
        '<linearGradient id="cvpOrnR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="' + C.gold + '" stop-opacity="0"/><stop offset="1" stop-color="' + C.gold + '"/></linearGradient></defs>' +
        '<circle cx="4" cy="12" r="3" fill="' + C.gold + '"/><rect x="14" y="11" width="118" height="2" fill="url(#cvpOrnL)"/><path d="M132 12 L146 12" stroke="' + C.gold + '" stroke-width="2"/>' +
        '<path d="M160 1 L169 12 L160 23 L151 12 Z" fill="' + C.gold + '"/><path d="M160 6 L165 12 L160 18 L155 12 Z" fill="' + C.goldPale + '"/>' +
        '<path d="M174 12 L188 12" stroke="' + C.gold + '" stroke-width="2"/><rect x="188" y="11" width="118" height="2" fill="url(#cvpOrnR)"/><circle cx="316" cy="12" r="3" fill="' + C.gold + '"/></svg>';
    }

    function book() {
      return '<svg viewBox="0 0 64 42" aria-hidden="true"><path d="M4 8 C 14 4 24 6 32 12 C 40 6 50 4 60 8 L60 36 C 50 32 40 34 32 40 C 24 34 14 32 4 36 Z" fill="rgba(255,213,74,.18)" stroke="' + C.gold + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M32 12 L32 40" stroke="' + C.gold + '" stroke-width="2"/><path d="M9 13 C 16 11 23 13 28 17 M9 20 C 16 18 23 20 28 24 M55 13 C 48 11 41 13 36 17 M55 20 C 48 18 41 20 36 24" fill="none" stroke="' + C.goldPale + '" stroke-width="1.2" stroke-linecap="round" opacity=".8"/></svg>';
    }

    function podium() {
      return '<svg class="cvp-pod" viewBox="0 0 360 132" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs>' +
        '<linearGradient id="cvpGS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A5A12"/><stop offset=".22" stop-color="#FFE08A"/><stop offset=".5" stop-color="#C99422"/><stop offset=".78" stop-color="#FFF0B5"/><stop offset="1" stop-color="#8A5A12"/></linearGradient>' +
        '<linearGradient id="cvpGT" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9B93C"/><stop offset=".5" stop-color="#FFF0B5"/><stop offset="1" stop-color="#E9B93C"/></linearGradient>' +
        '<radialGradient id="cvpWT" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#FFE9F1"/><stop offset="1" stop-color="#F6B6CC"/></radialGradient>' +
        '<filter id="cvpBlurG"><feGaussianBlur stdDeviation="7"/></filter></defs>' +
        '<ellipse cx="180" cy="116" rx="176" ry="13" fill="' + C.gold + '" opacity=".45" filter="url(#cvpBlurG)"/>' +
        '<path d="M12 64 L12 86 A168 26 0 0 0 348 86 L348 64 Z" fill="url(#cvpGS)"/>' +
        '<ellipse cx="180" cy="64" rx="168" ry="26" fill="url(#cvpGT)"/>' +
        '<ellipse cx="180" cy="62" rx="159" ry="21" fill="url(#cvpWT)"/>' +
        '<ellipse class="cvp-shine" cx="180" cy="116" rx="120" ry="5" fill="' + C.goldPale + '" opacity=".5"/></svg>';
    }

    function arrow() {
      return '<svg viewBox="0 0 34 24" aria-hidden="true"><path d="M2 12 H30 M21 3 L31 12 L21 21" fill="none" stroke="' + C.gold + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    function injectStyle() {
      if (document.getElementById(STYLE_ID)) { return; }
      var st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent = css();
      document.head.appendChild(st);
    }

    function render(container, onBegin) {
      if (!container) { return; }
      injectStyle();
      container.innerHTML =
        '<section class="cvp" role="region" aria-label="Cover">' + art() +
        '<div class="cvp-content"><div class="cvp-top"></div>' +
        '<h2 class="cvp-title cvp-in" style="animation-delay:.1s" aria-label="' + TEXT.line1 + ' ' + TEXT.line2 + '"><span class="cvp-l1">' + TEXT.line1 + '</span><span class="cvp-l2">' + TEXT.line2 + '</span></h2>' +
        '<div class="cvp-orn cvp-in" style="animation-delay:.35s">' + ornament() + '</div>' +
        '<div class="cvp-book cvp-in" style="animation-delay:.5s">' + book() + '</div>' +
        '<div class="cvp-by cvp-in" style="animation-delay:.65s"><i></i><span>' + TEXT.kicker + '</span><i></i></div>' +
        '<div class="cvp-author cvp-in" style="animation-delay:.8s">' + TEXT.author + '</div>' +
        '<div class="cvp-gap"></div>' +
        '<div class="cvp-stage cvp-in" style="animation-delay:.95s">' + podium() +
        '<button class="cvp-btn" type="button" aria-label="' + TEXT.button.toLowerCase() + '">' + arrow() + '<span>' + TEXT.button + '</span></button></div>' +
        '</div></section>';
      var btn = container.querySelector('.cvp-btn');
      btn.addEventListener('click', function () {
        try { container.dispatchEvent(new CustomEvent('coverpage:begin', { bubbles: true })); } catch (e) { /* ignore */ }
        if (typeof onBegin === 'function') { onBegin(); }
      });
    }

    window.CoverPage = { version: '1.0.0', render: render };
  } catch (err) {
    /* If this file has a mistake, the app just skips the cover. */
  }
})();
