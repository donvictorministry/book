/* cover-page.js
 * Premium Android-inspired welcome screen
 * Book: Don't Give Up!
 *
 * Standalone module.
 * Contract:
 * window.CoverPage.render(containerElement, onBegin)
 *
 * Fires: coverpage:begin
 */

(function () {
  'use strict';

  try {

    /* =========================================
       BRAND CONFIGURATION
    ========================================= */

    var TEXT = {
      title: "DON'T GIVE",
      subtitle: "UP!",
      kicker: "A DEVOTIONAL BOOK",
      author: "Rev. Dr. Chris Johnson, PhD",
      tagline: "Faith. Hope. Perseverance.",
      button: "BEGIN READING",
      footer: "A JOURNEY OF FAITH AND RENEWAL"
    };

    var C = {
      brand: '#DF1E5A',
      brandDark: '#B7194B',
      burgundy: '#390B20',
      burgundyLight: '#59142F',
      gold: '#EAC36A',
      goldLight: '#FFE8AC',
      white: '#FFFFFF',
      cream: '#FFF8F3',
      muted: '#E8C9D3'
    };

    var STYLE_ID = 'cvp-style';

    /* =========================================
       STYLES
    ========================================= */

    function css() {

      return [

        '.cvp{',
        'position:fixed;inset:0;',
        'width:100%;height:100%;',
        'width:100dvw;height:100dvh;',
        'overflow:hidden;z-index:30;',
        'background:linear-gradient(160deg,#210817 0%,#390B20 45%,#69112F 100%);',
        'color:#FFFFFF;',
        'font-family:system-ui,-apple-system,"Segoe UI",sans-serif;',
        '-webkit-user-select:none;user-select:none;',
        '-webkit-font-smoothing:antialiased;',
        '}',

        '.cvp *{',
        'box-sizing:border-box;',
        '-webkit-tap-highlight-color:transparent;',
        '}',

        /* Background */

        '.cvp-bg{',
        'position:absolute;inset:0;',
        'width:100%;height:100%;',
        'pointer-events:none;',
        '}',

        '.cvp-glow{',
        'position:absolute;',
        'width:310px;height:310px;',
        'border-radius:50%;',
        'background:rgba(223,30,90,.17);',
        'filter:blur(75px);',
        'top:-120px;left:50%;',
        'transform:translateX(-50%);',
        '}',

        '.cvp-glow-bottom{',
        'position:absolute;',
        'width:260px;height:260px;',
        'border-radius:50%;',
        'background:rgba(234,195,106,.08);',
        'filter:blur(85px);',
        'bottom:-130px;right:-80px;',
        '}',

        '.cvp-pattern{',
        'position:absolute;inset:0;',
        'opacity:.045;',
        'background-image:radial-gradient(#FFFFFF 1px,transparent 1px);',
        'background-size:24px 24px;',
        '}',

        /* Main layout */

        '.cvp-content{',
        'position:relative;z-index:2;',
        'height:100%;width:100%;',
        'display:flex;flex-direction:column;',
        'align-items:center;text-align:center;',
        'padding:calc(env(safe-area-inset-top,0px) + 25px) 25px ',
        'calc(env(safe-area-inset-bottom,0px) + 24px);',
        '}',

        /* Top identity */

        '.cvp-top{',
        'width:100%;display:flex;',
        'justify-content:center;align-items:center;',
        'flex:none;',
        '}',

        '.cvp-brand{',
        'display:flex;align-items:center;gap:9px;',
        'font-size:15px;font-weight:700;',
        'letter-spacing:.17em;',
        'color:#F8DCE5;',
        '}',

        '.cvp-brand-dot{',
        'width:7px;height:7px;',
        'border-radius:50%;',
        'background:' + C.gold + ';',
        'box-shadow:0 0 12px rgba(234,195,106,.7);',
        '}',

        '.cvp-space{',
        'flex:1;min-height:12px;',
        '}',

        /* Title */

        '.cvp-heading{',
        'width:100%;flex:none;',
        '}',

        '.cvp-kicker{',
        'font-size:13px;font-weight:700;',
        'letter-spacing:.25em;',
        'color:' + C.gold + ';',
        'margin-bottom:17px;',
        '}',

        '.cvp-title{',
        'margin:0;',
        'font-family:Georgia,"Times New Roman",serif;',
        'font-weight:700;',
        'line-height:.98;',
        'letter-spacing:-.045em;',
        '}',

        '.cvp-title-main{',
        'display:block;',
        'font-size:clamp(39px,12vw,61px);',
        'color:#FFFFFF;',
        '}',

        '.cvp-title-highlight{',
        'display:block;',
        'font-size:clamp(91px,29vw,130px);',
        'font-style:italic;',
        'letter-spacing:-.065em;',
        'background:linear-gradient(180deg,#FFF2CE 0%,#EAC36A 60%,#C28A37 100%);',
        '-webkit-background-clip:text;',
        'background-clip:text;',
        '-webkit-text-fill-color:transparent;',
        'filter:drop-shadow(0 5px 15px rgba(0,0,0,.2));',
        '}',

        /* Book illustration */

        '.cvp-book-area{',
        'position:relative;',
        'width:100%;',
        'flex:1;min-height:145px;',
        'display:flex;',
        'align-items:center;',
        'justify-content:center;',
        '}',

        '.cvp-book-halo{',
        'position:absolute;',
        'width:190px;height:190px;',
        'border-radius:50%;',
        'border:1px solid rgba(234,195,106,.2);',
        'box-shadow:0 0 55px rgba(223,30,90,.16),inset 0 0 35px rgba(234,195,106,.06);',
        '}',

        '.cvp-book-halo:before{',
        'content:"";position:absolute;',
        'inset:13px;border-radius:50%;',
        'border:1px solid rgba(234,195,106,.12);',
        '}',

        '.cvp-book-art{',
        'position:relative;',
        'width:min(230px,65vw);',
        'height:175px;',
        'filter:drop-shadow(0 17px 22px rgba(0,0,0,.35));',
        'animation:cvpfloat 5s ease-in-out infinite;',
        '}',

        '.cvp-book-art svg{',
        'width:100%;height:100%;display:block;',
        '}',

        /* Author */

        '.cvp-author-area{',
        'width:100%;flex:none;',
        'margin-top:5px;',
        '}',

        '.cvp-author-line{',
        'width:45px;height:2px;',
        'margin:0 auto 15px;',
        'background:linear-gradient(90deg,transparent,' + C.gold + ',transparent);',
        '}',

        '.cvp-author-label{',
        'font-size:12px;font-weight:700;',
        'letter-spacing:.2em;',
        'color:' + C.muted + ';',
        'margin-bottom:9px;',
        '}',

        '.cvp-author{',
        'font-size:18px;',
        'font-weight:650;',
        'line-height:1.4;',
        'color:#FFFFFF;',
        '}',

        '.cvp-tagline{',
        'margin-top:12px;',
        'font-size:14px;',
        'letter-spacing:.07em;',
        'color:#EBCBD5;',
        '}',

        /* Bottom action */

        '.cvp-bottom{',
        'width:100%;flex:none;',
        'margin-top:24px;',
        '}',

        '.cvp-btn{',
        'width:100%;',
        'height:62px;',
        'border:1px solid rgba(255,255,255,.22);',
        'border-radius:18px;',
        'background:linear-gradient(135deg,#F43D78 0%,#DF1E5A 55%,#B7194B 100%);',
        'color:#FFFFFF;',
        'display:flex;',
        'align-items:center;',
        'justify-content:center;',
        'gap:14px;',
        'font-family:inherit;',
        'font-size:16px;',
        'font-weight:800;',
        'letter-spacing:.13em;',
        'cursor:pointer;',
        'box-shadow:0 9px 25px rgba(223,30,90,.27),inset 0 1px 0 rgba(255,255,255,.25);',
        'transition:transform .12s ease,filter .12s ease;',
        '}',

        '.cvp-btn:active{',
        'transform:scale(.975);',
        'filter:brightness(.9);',
        '}',

        '.cvp-btn svg{',
        'width:23px;height:23px;',
        'flex:none;',
        '}',

        '.cvp-footer{',
        'margin-top:21px;',
        'font-size:10px;',
        'font-weight:650;',
        'letter-spacing:.19em;',
        'color:rgba(255,255,255,.48);',
        '}',

        /* Entry animation */

        '.cvp-in{',
        'opacity:0;',
        'animation:cvpenter .7s cubic-bezier(.2,.7,.2,1) forwards;',
        '}',

        '@keyframes cvpenter{',
        'from{opacity:0;transform:translateY(17px)}',
        'to{opacity:1;transform:translateY(0)}',
        '}',

        '@keyframes cvpfloat{',
        '0%,100%{transform:translateY(0)}',
        '50%{transform:translateY(-7px)}',
        '}',

        /* Compact Android screens */

        '@media(max-height:680px){',
        '.cvp-content{padding-top:calc(env(safe-area-inset-top,0px) + 15px);padding-bottom:calc(env(safe-area-inset-bottom,0px) + 14px)}',
        '.cvp-kicker{margin-bottom:10px}',
        '.cvp-title-main{font-size:clamp(35px,10vw,49px)}',
        '.cvp-title-highlight{font-size:clamp(75px,23vw,100px)}',
        '.cvp-book-art{height:145px;width:195px}',
        '.cvp-book-halo{width:155px;height:155px}',
        '.cvp-bottom{margin-top:15px}',
        '.cvp-btn{height:56px}',
        '.cvp-footer{margin-top:13px}',
        '}',

        '@media(prefers-reduced-motion:reduce){',
        '.cvp *, .cvp *:before{',
        'animation:none!important;',
        'transition:none!important;',
        '}',
        '.cvp-in{opacity:1}',
        '}'

      ].join('');
    }


    /* =========================================
       BOOK ILLUSTRATION
    ========================================= */

    function bookIllustration() {

      return `
      <svg viewBox="0 0 260 190"
           xmlns="http://www.w3.org/2000/svg"
           role="img"
           aria-label="An illuminated open devotional book">

        <defs>

          <linearGradient id="cvpCover" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#F34B83"/>
            <stop offset="1" stop-color="#8D123F"/>
          </linearGradient>

          <linearGradient id="cvpPage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#FFFFFF"/>
            <stop offset="1" stop-color="#F3D9C8"/>
          </linearGradient>

          <linearGradient id="cvpGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#FFF2C7"/>
            <stop offset=".5" stop-color="#EAC36A"/>
            <stop offset="1" stop-color="#B98235"/>
          </linearGradient>

          <filter id="cvpLight">
            <feGaussianBlur stdDeviation="9"/>
          </filter>

        </defs>

        <!-- Illumination -->

        <circle cx="130" cy="84" r="63"
                fill="#EAC36A" opacity=".13"
                filter="url(#cvpLight)"/>

        <!-- Book cover -->

        <path d="M34 53 Q81 36 130 67
                 Q179 36 226 53
                 L226 144 Q179 127 130 157
                 Q81 127 34 144 Z"
              fill="url(#cvpCover)"
              stroke="#EAC36A"
              stroke-width="2"/>

        <!-- Left page -->

        <path d="M40 48 Q85 34 130 65
                 L130 145 Q82 119 40 133 Z"
              fill="url(#cvpPage)"
              stroke="#EAC36A"
              stroke-width="1.5"/>

        <!-- Right page -->

        <path d="M130 65 Q175 34 220 48
                 L220 133 Q178 119 130 145 Z"
              fill="url(#cvpPage)"
              stroke="#EAC36A"
              stroke-width="1.5"/>

        <!-- Page lines -->

        <g fill="none" stroke="#C7A58A"
           stroke-width="1.4" opacity=".7">

          <path d="M53 65 Q88 57 116 77"/>
          <path d="M53 76 Q88 68 116 88"/>
          <path d="M53 87 Q88 79 116 99"/>
          <path d="M53 98 Q88 90 116 110"/>

          <path d="M144 77 Q173 57 207 65"/>
          <path d="M144 88 Q173 68 207 76"/>
          <path d="M144 99 Q173 79 207 87"/>
          <path d="M144 110 Q173 90 207 98"/>

        </g>

        <!-- Book centre -->

        <path d="M130 65 L130 157"
              stroke="#A97839"
              stroke-width="2.5"/>

        <!-- Golden bookmark -->

        <path d="M193 42 L202 42 L202 103 L197.5 97 L193 103 Z"
              fill="url(#cvpGold)"/>

        <!-- Small illumination rays -->

        <g stroke="#EAC36A"
           stroke-width="2"
           stroke-linecap="round"
           opacity=".8">

          <path d="M130 20 V8"/>
          <path d="M98 28 L91 17"/>
          <path d="M162 28 L169 17"/>
          <path d="M75 46 L64 39"/>
          <path d="M185 46 L196 39"/>

        </g>

      </svg>`;
    }


    /* =========================================
       BUTTON ICON
    ========================================= */

    function arrow() {

      return `
      <svg viewBox="0 0 24 24"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
           aria-hidden="true">

        <path d="M4 12H19"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"/>

        <path d="M13 6L19 12L13 18"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"/>

      </svg>`;
    }


    /* =========================================
       STYLE INJECTION
    ========================================= */

    function injectStyle() {

      if (document.getElementById(STYLE_ID)) {
        return;
      }

      var style = document.createElement('style');

      style.id = STYLE_ID;
      style.textContent = css();

      document.head.appendChild(style);
    }


    /* =========================================
       RENDER COVER
    ========================================= */

    function render(container, onBegin) {

      if (!container) {
        return;
      }

      injectStyle();

      container.innerHTML = `

        <section class="cvp"
                 role="region"
                 aria-label="Don't Give Up devotional welcome page">

          <div class="cvp-bg" aria-hidden="true">
            <div class="cvp-glow"></div>
            <div class="cvp-glow-bottom"></div>
            <div class="cvp-pattern"></div>
          </div>

          <div class="cvp-content">

            <!-- TOP IDENTITY -->

            <div class="cvp-top cvp-in"
                 style="animation-delay:.05s">

              <div class="cvp-brand">
                <span class="cvp-brand-dot"></span>
                <span>DEVOTIONAL READING</span>
              </div>

            </div>

            <div class="cvp-space"></div>

            <!-- BOOK TITLE -->

            <div class="cvp-heading cvp-in"
                 style="animation-delay:.15s">

              <div class="cvp-kicker">
                ${TEXT.kicker}
              </div>

              <h1 class="cvp-title">

                <span class="cvp-title-main">
                  ${TEXT.title}
                </span>

                <span class="cvp-title-highlight">
                  ${TEXT.subtitle}
                </span>

              </h1>

            </div>

            <!-- BOOK ART -->

            <div class="cvp-book-area cvp-in"
                 style="animation-delay:.3s">

              <div class="cvp-book-halo"></div>

              <div class="cvp-book-art">
                ${bookIllustration()}
              </div>

            </div>

            <!-- AUTHOR -->

            <div class="cvp-author-area cvp-in"
                 style="animation-delay:.45s">

              <div class="cvp-author-line"></div>

              <div class="cvp-author-label">
                WRITTEN BY
              </div>

              <div class="cvp-author">
                ${TEXT.author}
              </div>

              <div class="cvp-tagline">
                ${TEXT.tagline}
              </div>

            </div>

            <div class="cvp-space"></div>

            <!-- PRIMARY ACTION -->

            <div class="cvp-bottom cvp-in"
                 style="animation-delay:.6s">

              <button class="cvp-btn"
                      type="button"
                      aria-label="Begin reading Don't Give Up">

                <span>${TEXT.button}</span>

                ${arrow()}

              </button>

              <div class="cvp-footer">
                ${TEXT.footer}
              </div>

            </div>

          </div>

        </section>

      `;


      /* =====================================
         BEGIN READING EVENT
      ===================================== */

      var btn = container.querySelector('.cvp-btn');

      if (btn) {

        btn.addEventListener('click', function () {

          try {

            container.dispatchEvent(
              new CustomEvent('coverpage:begin', {
                bubbles: true
              })
            );

          } catch (e) {}

          if (typeof onBegin === 'function') {
            onBegin();
          }

        });

      }

    }


    /* =========================================
       PUBLIC API
    ========================================= */

    window.CoverPage = {
      version: '2.0.0',
      render: render
    };

  } catch (err) {

    /* App gracefully skips cover if unavailable */

  }

})();