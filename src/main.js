import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { pages } from './pages.js';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';

gsap.registerPlugin(SplitText, ScrollTrigger);

// ── Logo colour ───────────────────────────────────────────────────────────────
// CSS filters cannot reliably produce an exact colour across rendering engines.
// Instead we pixel-replace: every opaque pixel becomes exactly #00bbd1.
function colorizeImg(img) {
  const apply = () => {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const id = ctx.getImageData(0, 0, c.width, c.height);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 0) { d[i] = 0; d[i + 1] = 187; d[i + 2] = 209; }
    }
    ctx.putImageData(id, 0, 0);
    img.src = c.toDataURL('image/png');
    img.style.filter = 'none';
  };
  if (img.complete && img.naturalWidth) apply();
  else img.addEventListener('load', apply, { once: true });
}

// Colorize header logo immediately
colorizeImg(document.querySelector('.pf-logo-img'));

// ── Language ──────────────────────────────────────────────────────────────────
window.LANG = 'fr';
window.t = (fr, en) => window.LANG === 'en' ? en : fr;

// ── Router ────────────────────────────────────────────────────────────────────
const pfPage        = document.getElementById('pf-page');
let gooeyCleanup    = null;
let dfCleanup       = null;
let currentPage     = 'projets';

function navigateTo(pageId) {
  if (!pages[pageId]) return;
  if (gooeyCleanup)      { gooeyCleanup();      gooeyCleanup      = null; }
  if (dfCleanup)         { dfCleanup();         dfCleanup         = null; }
  if (window._lbCleanup) { window._lbCleanup(); window._lbCleanup = null; }
  currentPage = pageId;

  // Hide the star splash canvas when navigating away from home
  const sc = document.getElementById('splash-canvas');
  if (sc && pageId !== 'home') sc.style.display = 'none';

  const noScroll = pageId === 'home' || pageId === 'projets';
  const outgoing = pfPage.firstElementChild;

  const doRender = () => {
    pfPage.innerHTML = pages[pageId]();
    pfPage.className = noScroll ? '' : 'page-scrollable';
    document.querySelectorAll('.nav-link').forEach(l =>
      l.classList.toggle('active', l.dataset.page === pageId)
    );

    const incoming = pfPage.firstElementChild;
    if (!incoming) return;
    incoming.querySelectorAll('.proj-logo-anim').forEach(colorizeImg);

    if (pageId === 'home') {
      animateHomeEntrance(incoming, false);
      incoming.querySelectorAll('video').forEach(v => {
        v.muted = true;
        const frac = parseFloat(v.dataset.offset || 0);
        const maxDur = parseFloat(v.dataset.maxDuration || 0);
        v.addEventListener('loadedmetadata', () => {
          if (frac > 0) v.currentTime = v.duration * frac;
        }, { once: true });
        if (maxDur > 0) {
          v.loop = false;
          v.addEventListener('timeupdate', () => {
            if (v.currentTime >= maxDur) v.currentTime = 0;
          });
        }
        v.play().catch(() => {});
      });
    } else if (pageId === 'projets') {
      // TOC rows smooth-scroll to their section
      incoming.querySelectorAll('.proj-toc-row[data-scroll-to]').forEach(row => {
        const go = () => {
          const target = incoming.querySelector(row.dataset.scrollTo);
          if (!target) return;
          const containerTop = incoming.getBoundingClientRect().top;
          const targetTop = target.getBoundingClientRect().top - containerTop + incoming.scrollTop - 32;
          incoming.scrollTo({ top: targetTop, behavior: 'smooth' });
        };
        row.addEventListener('click', go);
        row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
      });
      // "Voir le projet" links navigate to the full project page
      incoming.querySelectorAll('.proj-inline-link[data-page]').forEach(link => {
        link.addEventListener('click', e => { e.preventDefault(); navigateTo(link.dataset.page); });
        initLetterSwap(link, { staggerDuration: 0.02, duration: 0.55 });
      });
      // Init carousels for inline sections
      incoming.querySelectorAll('.proj-story-strip').forEach(strip => initNativeCarousel(strip));
      // Autoplay inline video
      incoming.querySelectorAll('.proj-inline-video').forEach(v => {
        v.muted = true;
        if (v.classList.contains('proj-inline-video--clip')) {
          v.addEventListener('loadedmetadata', () => { v.currentTime = 5; });
          v.addEventListener('timeupdate', () => { if (v.currentTime >= 8) v.currentTime = 5; });
        }
        v.play().catch(() => {});
      });
      gsap.fromTo(incoming,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    } else {
      gsap.fromTo(incoming,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
      incoming.querySelectorAll('.proj-back[data-page]').forEach(btn => {
        btn.addEventListener('click', e => { e.preventDefault(); navigateTo(btn.dataset.page); });
        initLetterSwap(btn);
      });
      const grid = incoming.querySelector('.proj-image-grid');
      if (grid) initLightbox(grid);
      incoming.querySelectorAll('.readme-btn').forEach(initReadMe);
      const contactForm = incoming.querySelector('#contact-form');
      if (contactForm) initContactForm(contactForm);
      const strips = incoming.querySelectorAll('.proj-story-strip');
      if (strips.length) {
        strips.forEach(s => initStoryCarousel(s));
        const toggle = incoming.querySelector('.pf-toggle');
        if (toggle) {
          initToggle(toggle);
          const activeBtn = toggle.querySelector('.pf-toggle-btn.active');
          if (activeBtn && activeBtn.dataset.view === 'identite') {
            setTimeout(() => initFlowArt(), 50);
          }
          // Wire motion play/pause if motion is the default active tab
          if (activeBtn && activeBtn.dataset.view === 'motion') {
            const motionPanel = document.getElementById('sc-motion');
            if (motionPanel) {
              const vid = motionPanel.querySelector('video');
              const playBtn = motionPanel.querySelector('.motion-playpause');
              if (vid && playBtn) {
                vid.play().catch(() => {});
                playBtn.textContent = '❚❚';
                playBtn.onclick = () => {
                  if (vid.paused) { vid.play(); playBtn.textContent = '❚❚'; }
                  else { vid.pause(); playBtn.textContent = '▶'; }
                };
              }
            }
          }
        }
      } else {
        const strip = incoming.querySelector('.proj-story-strip');
        if (strip) initStoryCarousel(strip);
      }
    }
  };

  if (outgoing) {
    gsap.to(outgoing, {
      opacity: 0, y: -10, duration: 0.22, ease: 'power2.in',
      onComplete: doRender,
    });
    // Fallback: if GSAP onComplete doesn't fire (animation killed), render anyway
    setTimeout(() => {
      if (currentPage === pageId && pfPage.firstElementChild === outgoing) doRender();
    }, 350);
  } else {
    doRender();
  }
}

// ── Read Me ───────────────────────────────────────────────────────────────────
const readmeContent = {
  'petits-freres': {
    title: 'Les Petits Frères des Pauvres',
    body: window.LANG === 'en'
      ? `Les Petits Frères des Pauvres is an association that fights against the isolation and loneliness of elderly people. As a group, we created the visual identity for a popular dance event in Paris — centred around illustration, vivid colours, dancing and community. We also respected the existing brand guidelines of the association to ensure visual consistency.`
      : `Les Petits Frères des Pauvres luttent contre l'isolement et la solitude des personnes âgées. En groupes, nous étions chargées de créer l'identité visuelle d'une balle se rendre à Paris. La direction artistique générale est axée autour du dessin, des couleurs vives, et met en avant la danse, le vivre-ensemble, la joie, le partage. Nous devions également intégrer et respecter des éléments et des règles de la charte graphique, afin de garantir une cohérence avec l'identité existante de l'association. Nous avons basé notre campagne de communication à travers la création de deux personnages principaux : Annie et Léo, représentants une accompagnée et un accompagnant de l'association Petits Frères des Pauvres. Ils seront mis en avant dans chacun de nos canaux de communication, afin de créer de l'attachement et de permettre aux lecteurs de s'identifier, de se sentir concernés. L'objectif de l'événement n'était pas seulement de rassembler les gens autour de la danse, mais aussi de sensibiliser à l'association et de recruter de nouveaux bénévoles. Nous avons donc créé des flyers pensés pour attirer un public jeune et engagé. Enfin, nous avons créé une série de goodies pour l'événement, mettant en avant Annie et Leo sur chaque support, ainsi que le logo original et les éléments de la charte graphique.`,
  },
  'brume': {
    title: 'Brume',
    body: window.LANG === 'en'
      ? `An editorial project exploring texture, blur and print. Brume is a graphic exploration of the in-between — between visible and invisible, between form and matter.`
      : `Ce livre fait partie d'une collection de trois éditions. La collection est née de l'envie de confronter l'écriture poétique aux regards de graphistes contemporains, et ce livret explore les poèmes à travers des illustrations. J'ai choisi de centrer mon édition de Brume sur la bande dessinée car j'ai voulu concevoir une bande dessinée qui puisse être regardée avec ou sans texte. Les personnages ont d'abord été dessinés à la main pour développer leur identité et explorer les liens possibles avec le poème. Les bandes dessinées étaient originalement en couleur, mais le résultat final était trop lourd pour un livre pensé comme léger et délicat. J'ai donc converti les dessins en bitmap afin d'obtenir un rendu plus léger et épuré, tout en renforçant l'esthétique de la bande dessinée et du pop art. Enfin, chaque édition de Brume est accompagnée d'une courte vidéo de feuilletage, offrant un effet visuel supplémentaire et privilégiant la lecture des images plutôt que celle du texte. Bien que toujours délicat, Brume s'apparente davantage à une œuvre d'art qu'à un livre destiné à la lecture régulièrement. La reliure, tout aussi fragile, fait pleinement partie de la composition au même titre que les dessins, et l'objet doit donc être manipulé avec soin et respect.`,
  },
  'star-guitar': {
    title: 'Star Guitar',
    body: window.LANG === 'en'
      ? `An animation inspired by the Chemical Brothers' eponymous music video. A train travels through shifting landscapes — day, night, different climates — each carriage bearing the mark of its sonic environment.`
      : `Inspired by the Chemical Brother's clip Star Guitar, mon idée était que le train traverse le jour et la nuit, ainsi que différents climats. En suivant son trajet, le train raconte une histoire de son environnement. J'ai choisi un thème bleu et turquoise pour le train afin d'ajouter une touche de couleur, en accord avec les rythmes fun et dynamiques de la musique, tout en complétant l'environnement naturel en arrière-plan. Chaque déclinaison existe en deux versions, une avec des fenêtres turquoise pour représenter les lumières éteintes pendant la journée, et une avec des lumières jaunes pour représenter les lumières allumées dans les wagons la nuit.`,
  },
  'do-it-again-edition': {
    title: 'Do It Again Édition',
    body: window.LANG === 'en'
      ? `An editorial project built around repetition and rhythm. The layout explores the page as a visual score — each spread replays the same graphic gesture in a slightly different form, creating a hypnotic progression from start to finish.`
      : `Projet éditorial autour de la répétition et du rythme. La maquette explore la mise en page comme partition visuelle — chaque double-page rejoue un même geste graphique sous une forme légèrement différente, créant une progression hypnotique du début à la fin.`,
  },
  'do-it-again': {
    title: 'Do It Again',
    body: window.LANG === 'en'
      ? `In this project, I created the visual identity for a fictitious tour by The Chemical Brothers, an iconic duo on the electronic music scene. Starting from the concept of a retrospective album gathering their greatest hits, I wanted to design a visual identity capable of representing that era on its own, while fitting harmoniously into the group's existing artistic direction. To achieve this, I chose to work with circular and geometric shapes, which can be easily juxtaposed with the recurring images and characters strongly present in the duo's earlier works.`
      : `Dans ce projet, j'ai créé l'identité visuelle d'une tournée fictive de The Chemical Brothers, un duo emblématique de la scène de la musique électronique. En partant de l'idée d'un album rétrospectif regroupant leurs plus grands succès, j'ai souhaité concevoir une identité visuelle capable de représenter cette époque à elle seule, tout en s'intégrant harmonieusement à la direction artistique déjà existante du groupe. Pour cela, j'ai choisi de travailler avec des formes circulaires et géométriques, qui peuvent être facilement juxtaposées aux images et personnages récurrents fortement présents dans les œuvres plus anciennes du duo.`,
  },
  'terrasses': {
    title: 'Terrasses des Oliviers',
    body: window.LANG === 'en'
      ? `An illustrated and editorial project about the Mediterranean landscape — olive trees, terraces and southern light. Combining illustration and photography, it explores the relationship between memory, place and nature.`
      : `Un projet illustré et éditorial autour du paysage méditerranéen — oliviers, terrasses et lumière du sud. Mêlant illustration et photographie, il explore la relation entre mémoire, lieu et nature.`,
  },
  'paris': {
    title: 'Paris',
    body: `L'objectif du projet consistait à explorer les formes carrées et triangulaires dans la ville. J'ai choisi le noir et blanc afin de mieux souligner les lignes, les formes et les jeux d'ombres.`,
  },
  'whitby': {
    title: 'Whitby',
    body: `Une exploration de la ville historique de Whitby, qui s'est inspirée par ses racines gothiques tout en les réinterprétant de manière contemporaine.`,
  },
};

function initContactRibbons(el) {
  function split() {
    el.classList.add('is-split');
    el.removeEventListener('click', split);
    el.removeEventListener('keydown', onKey);
    // Hide after animation so the form is fully interactive
    setTimeout(() => { el.style.display = 'none'; }, 750);
  }
  function onKey(e) { if (e.key === 'Enter' || e.key === ' ') split(); }
  el.addEventListener('click', split);
  el.addEventListener('keydown', onKey);
}

function initContactForm(form) {
  const btn     = form.querySelector('#contact-submit');
  const success = form.querySelector('#contact-success');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, {
        method:  'POST',
        body:    data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.reset();
        if (btn)     { btn.style.display = 'none'; }
        if (success) { success.style.display = ''; }
      } else {
        throw new Error('server error');
      }
    } catch {
      if (btn) { btn.disabled = false; btn.textContent = 'Envoyer'; }
      alert('Une erreur est survenue, veuillez réessayer.');
    }
  });
}

function initReadMe(btn) {
  const key = btn.dataset.readme;
  const content = readmeContent[key];
  if (!content) return;

  btn.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'rm-overlay';
    overlay.innerHTML = `
      <div class="rm-card">
        <button class="rm-close">✕</button>
        <h3 class="rm-title">${content.title}</h3>
        <p class="rm-body">${content.body}</p>
      </div>`;
    document.body.appendChild(overlay);

    const card = overlay.querySelector('.rm-card');

    const close = () => { overlay.classList.remove('rm-active'); setTimeout(() => overlay.remove(), 300); };
    overlay.querySelector('.rm-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    const esc = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } };
    document.addEventListener('keydown', esc);

    requestAnimationFrame(() => overlay.classList.add('rm-active'));
  });
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function initToggle(toggle) {
  const btns = toggle.querySelectorAll('.pf-toggle-btn');
  const panels = { identite: 'sc-identite', contexte: 'sc-contexte', motion: 'sc-motion', livrables: 'sc-livrables', images: 'sc-images', illustration: 'sc-illustration', edition: 'sc-edition', logo: 'sc-logo', affiche: 'sc-affiche', goodies: 'sc-goodies', charte: 'sc-charte', uxui: 'sc-uxui', paris: 'sc-paris', whitby: 'sc-whitby', diptyques: 'sc-diptyques' };
  const emblaInstances = {};

  // Pre-init Embla only on the active (visible) panel; lazy-init hidden ones on first show
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      Object.entries(panels).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const isActive = key === view;
        el.style.display = isActive ? '' : 'none';
        if (!isActive) {
          el.querySelectorAll('video').forEach(v => v.pause());
        }
        if (isActive) {
          // Lazy-init native carousel on first reveal
          if (!emblaInstances[id]) {
            initNativeCarousel(el);
            emblaInstances[id] = true;
          }
          // Autoplay videos inside the revealed panel
          el.querySelectorAll('video').forEach(v => v.play().catch(() => {}));
          // Init book for charte panel
          if (key === 'charte') initBook();
          // Init flow art for identite panel
          if (key === 'identite') initFlowArt();
          // Show/hide Storyboard btn and book controls based on active section
          const sbBtn = document.getElementById('storyboard-btn');
          if (sbBtn) sbBtn.style.display = (isActive && key === 'motion') ? '' : 'none';
          const bookCtrl = document.getElementById('book-controls');
          if (bookCtrl) bookCtrl.style.display = (isActive && key === 'charte') ? 'flex' : 'none';

          // Wire play/pause for motion panel
          if (isActive && key === 'motion') {
            const vid = el.querySelector('video');
            const playBtn = el.querySelector('.motion-playpause');
            if (vid) {
              vid.play().catch(() => {});
              if (playBtn) {
                playBtn.textContent = '❚❚';
                playBtn.onclick = () => {
                  if (vid.paused) { vid.play(); playBtn.textContent = '❚❚'; }
                  else { vid.pause(); playBtn.textContent = '▶'; }
                };
              }
            }
            // Wire storyboard modal (lives outside sc-motion)
            const sbOverlay = document.getElementById('sb-overlay');
            const sbClose = document.getElementById('sb-close');
            if (sbBtn && sbOverlay && !sbBtn._sbWired) {
              sbBtn._sbWired = true;
              sbBtn.onclick = () => { sbOverlay.style.display = 'flex'; };
              sbClose.onclick = () => { sbOverlay.style.display = 'none'; };
              sbOverlay.onclick = (e) => { if (e.target === sbOverlay) sbOverlay.style.display = 'none'; };
            }
          }
        }
      });
    });
  });
}

// ── Universal native carousel — scroll + progress bar + trackpad ─────────────
function initNativeCarousel(strip) {
  const viewport = strip.querySelector('.sc-viewport');
  if (!viewport || strip.dataset.nativeReady) return;
  strip.dataset.nativeReady = '1';

  // Apply native scroll to viewport
  viewport.style.overflowX = 'scroll';
  viewport.style.overflowY = 'hidden';
  viewport.style.cursor    = 'grab';

  // Compute available height: full viewport minus header and tab bar
  function applyItemHeights() {
    // Measure where the strip actually starts on screen — accounts for all elements above it
    const stripTop = strip.getBoundingClientRect().top;
    const PROGRESS_H = 32; // progress bar (2px) + its margin (0.9rem ≈ 14px) + bottom gap
    const BOTTOM_PAD = 16; // breathing room at the bottom of the viewport
    const available = window.innerHeight - stripTop - PROGRESS_H - BOTTOM_PAD;
    const h = Math.max(180, available) + 'px';
    strip.querySelectorAll('.sc-item').forEach(item => { item.style.height = h; });
  }
  // Run after layout (needed when strip was just made visible)
  requestAnimationFrame(applyItemHeights);

  // Progress bar
  const track = document.createElement('div');
  track.className = 'sc-progress-track';
  track.innerHTML = '<div class="sc-progress-fill"></div>';
  strip.appendChild(track);
  const fill = track.querySelector('.sc-progress-fill');

  function updateProgress() {
    const max = viewport.scrollWidth - viewport.clientWidth;
    fill.style.width = (max > 0 ? (viewport.scrollLeft / max) * 100 : 0) + '%';
  }

  viewport.addEventListener('scroll', updateProgress, { passive: true });

  // Wheel: redirect vertical scroll to horizontal (mouse wheel compat)
  viewport.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
    e.preventDefault();
    viewport.scrollLeft += e.deltaY * 1.2;
  }, { passive: false });

  // Mouse drag with momentum
  let dragging = false, startX = 0, startScroll = 0, velX = 0, lastX = 0, rafId = 0;
  viewport.addEventListener('mousedown', e => {
    dragging = true; startX = lastX = e.clientX; startScroll = viewport.scrollLeft;
    velX = 0; cancelAnimationFrame(rafId);
    viewport.style.userSelect = 'none';
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    velX = e.clientX - lastX; lastX = e.clientX;
    viewport.scrollLeft = startScroll - (e.clientX - startX);
  });
  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false; viewport.style.userSelect = '';
    // Fling with momentum
    let v = -velX;
    function fling() {
      if (Math.abs(v) < 0.5) return;
      viewport.scrollLeft += v; v *= 0.92;
      rafId = requestAnimationFrame(fling);
    }
    rafId = requestAnimationFrame(fling);
  });

  // Resize: recompute heights
  const ro = new ResizeObserver(() => { requestAnimationFrame(applyItemHeights); });
  ro.observe(document.body);

  updateProgress();
}

// ── Flow Art scroll animation (Identité visuelle) ─────────────────────────────
function initFlowArt() {
  const root     = document.getElementById('sc-identite');
  const scroller = document.getElementById('flow-scroller');
  if (!root || !scroller || root.dataset.flowReady) return;
  root.dataset.flowReady = '1';

  const sections = Array.from(scroller.querySelectorAll('[data-flow-section]'));
  if (!sections.length) return;

  // Tell GSAP how to read scroll position from our custom scroller div
  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      if (arguments.length) { scroller.scrollTop = value; }
      return scroller.scrollTop;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: scroller.clientWidth, height: scroller.clientHeight };
    },
    pinType: 'transform',
  });

  scroller.addEventListener('scroll', ScrollTrigger.update);

  sections.forEach((section, i) => {
    gsap.set(section, { zIndex: i + 1 });
    const inner = section.querySelector('.flow-art-container');
    if (!inner) return;

    if (i > 0) {
      gsap.set(inner, { rotation: 30, transformOrigin: 'bottom right' });
      gsap.to(inner, {
        rotation: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          scroller,
          start: 'top bottom',
          end: 'top 25%',
          scrub: true,
        },
      });
    }

    if (i < sections.length - 1) {
      ScrollTrigger.create({
        trigger: section,
        scroller,
        start: 'bottom bottom',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        pinContainer: scroller,
      });
    }
  });

  ScrollTrigger.refresh();

  // Init affiche click gallery inside slide 3
  const gallery = document.getElementById('affiche-gallery');
  if (gallery) {
    const imgs = Array.from(gallery.querySelectorAll('.affiche-img'));
    let idx = 0;
    const show = (n) => {
      imgs[idx].classList.remove('active');
      idx = (n + imgs.length) % imgs.length;
      imgs[idx].classList.add('active');
    };
    gallery.querySelector('.affiche-prev').addEventListener('click', () => show(idx - 1));
    gallery.querySelector('.affiche-next').addEventListener('click', () => show(idx + 1));
  }
}

// ── PDF Book viewer (native img — retina-accurate) ────────────────────────────
function initBook() {
  const container = document.getElementById('book-container');
  if (!container || container.dataset.ready) return;
  container.dataset.ready = '1';

  const loadingEl = document.getElementById('book-loading');
  const prevBtn   = document.getElementById('book-prev');
  const nextBtn   = document.getElementById('book-next');
  const pageLabel = document.getElementById('book-page-label');

  const NUM_PAGES  = 32;
  const NUM_SPREADS = Math.ceil(NUM_PAGES / 2); // 16 spreads
  const baseUrl    = '/DO%20IT%20AGAIN/Charte%20graphique/pages/';
  let spread = 0; // 0 = pages 1-2, 1 = pages 3-4, …

  container.innerHTML = `
    <div class="cbook-spread" id="cbook-spread">
      <div class="cbook-page cbook-left"  id="cbook-left"><img id="cbook-img-l" src="${baseUrl}1.png" alt="Page 1"></div>
      <div class="cbook-spine"></div>
      <div class="cbook-page cbook-right" id="cbook-right"><img id="cbook-img-r" src="${baseUrl}2.png" alt="Page 2"></div>
    </div>`;
  container.style.display = '';
  if (loadingEl) loadingEl.style.display = 'none';

  const imgL = container.querySelector('#cbook-img-l');
  const imgR = container.querySelector('#cbook-img-r');
  const leftEl  = container.querySelector('#cbook-left');
  const rightEl = container.querySelector('#cbook-right');

  function pageNums(s) {
    return { left: s * 2 + 1, right: s * 2 + 2 };
  }
  function updateLabel() {
    const { left, right } = pageNums(spread);
    if (pageLabel) pageLabel.textContent = `${left}–${Math.min(right, NUM_PAGES)} / ${NUM_PAGES}`;
  }
  updateLabel();

  function goTo(n) {
    if (n < 0 || n >= NUM_SPREADS) return;
    spread = n;
    const { left, right } = pageNums(spread);
    imgL.src = `${baseUrl}${left}.png`;
    if (right <= NUM_PAGES) { imgR.src = `${baseUrl}${right}.png`; imgR.style.display = ''; }
    else                    { imgR.style.display = 'none'; }
    updateLabel();
  }

  prevBtn.onclick = () => goTo(spread - 1);
  nextBtn.onclick = () => goTo(spread + 1);
}

// ── Story Carousel ────────────────────────────────────────────────────────────
function initStoryCarousel(strip) {
  if (strip.style.display !== 'none') initNativeCarousel(strip);

  // Click any item to open lightbox
  const items = Array.from(strip.querySelectorAll('img, video'));
  let current = 0;

  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.innerHTML = `
    <button class="lb-close">✕</button>
    <button class="lb-prev">‹</button>
    <img class="lb-img" src="" alt="">
    <video class="lb-video" autoplay muted loop playsinline style="display:none;max-width:90vw;max-height:88vh;border-radius:4px;"></video>
    <button class="lb-next">›</button>`;
  document.body.appendChild(overlay);

  const lbImg   = overlay.querySelector('.lb-img');
  const lbVideo = overlay.querySelector('.lb-video');
  const close   = overlay.querySelector('.lb-close');
  const prev    = overlay.querySelector('.lb-prev');
  const next    = overlay.querySelector('.lb-next');

  function show(i) {
    current = (i + items.length) % items.length;
    const el = items[current];
    if (el.tagName === 'VIDEO') {
      lbImg.style.display = 'none';
      lbVideo.style.display = '';
      lbVideo.src = el.src;
      lbVideo.play();
    } else {
      lbVideo.style.display = 'none'; lbVideo.src = '';
      lbImg.style.display = ''; lbImg.src = el.src;
    }
    overlay.classList.add('lb-active');
  }
  function hide() { overlay.classList.remove('lb-active'); lbVideo.pause(); lbVideo.src = ''; }

  items.forEach((el, i) => el.addEventListener('click', () => show(i)));
  close.addEventListener('click', hide);
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  overlay.addEventListener('click', e => { if (e.target === overlay) hide(); });

  const onKey = e => {
    if (!overlay.classList.contains('lb-active')) return;
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'Escape')     hide();
  };
  document.addEventListener('keydown', onKey);

  const prev_lbCleanup = window._lbCleanup;
  window._lbCleanup = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    if (prev_lbCleanup) prev_lbCleanup();
  };
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function initLightbox(grid) {
  const media = Array.from(grid.querySelectorAll('img, video'));
  let current = 0;

  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.innerHTML = `
    <button class="lb-close">✕</button>
    <button class="lb-prev">‹</button>
    <img class="lb-img" src="" alt="">
    <video class="lb-video" autoplay muted loop playsinline style="display:none;max-width:90vw;max-height:88vh;border-radius:4px;"></video>
    <button class="lb-next">›</button>`;
  document.body.appendChild(overlay);

  const lbImg   = overlay.querySelector('.lb-img');
  const lbVideo = overlay.querySelector('.lb-video');
  const close   = overlay.querySelector('.lb-close');
  const prev    = overlay.querySelector('.lb-prev');
  const next    = overlay.querySelector('.lb-next');

  function show(i) {
    current = (i + media.length) % media.length;
    const el = media[current];
    if (el.tagName === 'VIDEO') {
      lbImg.style.display = 'none';
      lbVideo.style.display = '';
      lbVideo.src = el.src;
      lbVideo.play();
    } else {
      lbVideo.style.display = 'none';
      lbVideo.src = '';
      lbImg.style.display = '';
      lbImg.src = el.src;
    }
    overlay.classList.add('lb-active');
  }

  function hide() {
    overlay.classList.remove('lb-active');
    lbVideo.pause();
    lbVideo.src = '';
  }

  media.forEach((el, i) => el.addEventListener('click', () => show(i)));
  close.addEventListener('click', hide);
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  overlay.addEventListener('click', e => { if (e.target === overlay) hide(); });

  const onKey = e => {
    if (!overlay.classList.contains('lb-active')) return;
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'Escape')     hide();
  };
  document.addEventListener('keydown', onKey);

  // cleanup handled by navigateTo removing the overlay via dfCleanup isn't needed —
  // overlay is on body so we remove it when the page navigates away
  const origCleanup = window._lbCleanup;
  window._lbCleanup = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
}

// ── OGL Horizontal Carousel ───────────────────────────────────────────────────
function initOGLCarousel(container, items) {
  if (!container) return null;

  // helpers
  const lerp = (a, b, t) => a + (b - a) * t;
  const deb  = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  function makeTitleMesh(gl, plane, text, font, color) {
    const c = document.createElement('canvas');
    const x = c.getContext('2d');
    x.font = font;
    const m = x.measureText(text);
    c.width  = Math.ceil(m.width) + 20;
    c.height = Math.ceil(parseInt(font, 10) * 1.4) + 20;
    x.font = font; x.fillStyle = color;
    x.textBaseline = 'middle'; x.textAlign = 'center';
    x.fillText(text, c.width / 2, c.height / 2);
    const tex = new Texture(gl, { generateMipmaps: false });
    tex.image = c;
    const geo = new Plane(gl);
    const prog = new Program(gl, {
      vertex: `attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragment: `precision highp float;uniform sampler2D tMap;varying vec2 vUv;void main(){vec4 col=texture2D(tMap,vUv);if(col.a<0.1)discard;gl_FragColor=col;}`,
      uniforms: { tMap: { value: tex } },
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry: geo, program: prog });
    const aspect = c.width / c.height;
    const th = plane.scale.y * 0.10;
    mesh.scale.set(th * aspect, th, 1);
    mesh.position.y = -plane.scale.y * 0.5 - th * 0.6 - 0.05;
    mesh.setParent(plane);
    return mesh;
  }

  // renderer
  const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(devicePixelRatio || 1, 2) });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  container.style.position = 'relative';
  container.appendChild(gl.canvas);

  const camera = new Camera(gl);
  camera.fov = 45;
  camera.position.z = 20;

  const scene = new Transform();
  const BEND = 3;
  const SCROLL_SPEED = 2;
  const EASE = 0.05;

  let screen = { width: container.clientWidth, height: container.clientHeight };
  let viewport = { width: 1, height: 1 };

  function updateSizes() {
    screen = { width: container.clientWidth, height: container.clientHeight };
    renderer.setSize(screen.width, screen.height);
    camera.perspective({ aspect: screen.width / screen.height });
    const fov = (camera.fov * Math.PI) / 180;
    const h = 2 * Math.tan(fov / 2) * camera.position.z;
    viewport = { width: h * camera.aspect, height: h };
  }
  updateSizes();

  const planeGeo = new Plane(gl, { heightSegments: 50, widthSegments: 100 });

  // Build doubled items for seamless loop
  const doubled = [...items, ...items];
  const COUNT = doubled.length;

  const planes = doubled.map((item, i) => {
    const tex = new Texture(gl, { generateMipmaps: true });
    const prog = new Program(gl, {
      depthTest: false, depthWrite: false,
      vertex: `precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragment: `precision highp float;uniform vec2 uImageSizes;uniform vec2 uPlaneSizes;uniform sampler2D tMap;uniform float uBorderRadius;varying vec2 vUv;float rSDF(vec2 p,vec2 b,float r){vec2 d=abs(p)-b;return length(max(d,vec2(0.0)))+min(max(d.x,d.y),0.0)-r;}void main(){vec2 ratio=vec2(min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y),1.0),min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x),1.0));vec2 uv=vec2(vUv.x*ratio.x+(1.0-ratio.x)*0.5,vUv.y*ratio.y+(1.0-ratio.y)*0.5);vec4 col=texture2D(tMap,uv);float d=rSDF(vUv-0.5,vec2(0.5-uBorderRadius),uBorderRadius);float alpha=1.0-smoothstep(-0.002,0.002,d);gl_FragColor=vec4(col.rgb,alpha);}`,
      uniforms: {
        tMap: { value: tex },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [1, 1] },
        uBorderRadius: { value: 0.04 },
      },
      transparent: true,
    });

    const entry = { plane: null, prog, title: null, extra: 0, width: 0, widthTotal: 0, x: 0, label: item.text, naturalAspect: 1 };

    if (item.image) {
      const img = new Image();
      img.src = item.image;
      img.onload = () => {
        tex.image = img;
        entry.naturalAspect = img.naturalWidth / img.naturalHeight;
        prog.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
        // Resize plane to match image aspect, keeping height fixed
        if (entry.plane) {
          const h = entry.plane.scale.y;
          entry.plane.scale.x = h * entry.naturalAspect;
          prog.uniforms.uPlaneSizes.value = [entry.plane.scale.x, h];
          entry.width = entry.plane.scale.x + 2;
          entry.widthTotal = entry.width * COUNT;
          // Reposition all planes from scratch
          planes.forEach((p, i) => { p.x = planes.slice(0, i).reduce((s, q) => s + q.width, 0); });
        }
      };
    }

    const plane = new Mesh(gl, { geometry: planeGeo, program: prog });
    plane.setParent(scene);
    entry.plane = plane;
    return entry;
  });

  function resizePlanes() {
    const scale = screen.height / 1500;
    planes.forEach((p, i) => {
      p.plane.scale.y = (viewport.height * (900 * scale)) / screen.height;
      p.plane.scale.x = p.plane.scale.y * (p.naturalAspect || 1);
      p.prog.uniforms.uPlaneSizes.value = [p.plane.scale.x, p.plane.scale.y];
      p.width      = p.plane.scale.x + 2;
      p.widthTotal = p.width * COUNT;
      p.x          = p.width * i;
      // Create title label on first resize
      if (!p.title && p.label) {
        p.title = makeTitleMesh(gl, p.plane, p.label, 'bold 28px Inter,sans-serif', '#00bbd1');
      }
      if (p.title) {
        const th = p.plane.scale.y * 0.10;
        p.title.position.y = -p.plane.scale.y * 0.5 - th * 0.6 - 0.05;
      }
    });
  }
  resizePlanes();

  const scroll = { ease: EASE, current: 0, target: 0, last: 0 };
  let isDown = false, startX = 0, scrollPos = 0;

  function onResize() { updateSizes(); resizePlanes(); }
  function onWheel(e) {
    const d = e.deltaY || e.detail;
    scroll.target += (d > 0 ? SCROLL_SPEED : -SCROLL_SPEED) * 0.2;
    snapDebounced();
  }
  function onDown(e) { isDown = true; startX = e.touches ? e.touches[0].clientX : e.clientX; scrollPos = scroll.current; }
  function onMove(e) {
    if (!isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    scroll.target = scrollPos + (startX - x) * (SCROLL_SPEED * 0.025);
  }
  function onUp() { isDown = false; snap(); }
  function snap() {
    if (!planes[0]) return;
    const w = planes[0].width;
    const idx = Math.round(Math.abs(scroll.target) / w);
    scroll.target = (scroll.target < 0 ? -1 : 1) * w * idx;
  }
  const snapDebounced = deb(snap, 200);

  window.addEventListener('resize', onResize);
  window.addEventListener('wheel', onWheel);
  container.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  container.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onUp);

  let raf;
  function tick() {
    scroll.current = lerp(scroll.current, scroll.target, scroll.ease);
    const dir = scroll.current > scroll.last ? 'right' : 'left';

    planes.forEach(p => {
      p.plane.position.x = p.x - scroll.current - p.extra;
      const x = p.plane.position.x;
      const H = viewport.width / 2;
      const B = Math.abs(BEND);
      const R = (H * H + B * B) / (2 * B);
      const ex = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - ex * ex);
      p.plane.position.y = -arc;
      p.plane.rotation.z = -Math.sign(x) * Math.asin(ex / R);

      const po = p.plane.scale.x / 2, vo = viewport.width / 2;
      if (dir === 'right' && p.plane.position.x + po < -vo) p.extra -= p.widthTotal;
      if (dir === 'left'  && p.plane.position.x - po >  vo) p.extra += p.widthTotal;
    });

    renderer.render({ scene, camera });
    scroll.last = scroll.current;
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('wheel', onWheel);
    container.removeEventListener('mousedown', onDown);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    container.removeEventListener('touchstart', onDown);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', onUp);
    if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas);
  };
}

// ── Circular Gallery ──────────────────────────────────────────────────────────
function initFanCarousel() {
  const wrap = document.getElementById('fan-gallery');
  if (!wrap) return null;

  const projects = [
    { title: 'Terrasses des Oliviers',        type: 'Illustration',      video: null, bg: 'linear-gradient(135deg,#1a1510,#3a2a1a)', cover: '/images/terrasse_6.jpg',          page: 'proj_terrasses' },
    { title: 'Les Petits Frères des Pauvres', type: 'Identité Visuelle', video: null, bg: 'linear-gradient(135deg,#1a0a1a,#4a1a4a)', cover: '/images/petits-freres-cover-left.png', coverPos: 'center center', page: 'proj_petits_freres' },
    { title: 'Do It Again',                   type: 'Identité Visuelle', video: null, bg: 'linear-gradient(135deg,#2a0a0a,#5c1a1a)', cover: '/images/rendu.jpg',               page: 'proj_do_it_again' },
    { title: 'Brume',                         type: 'Édition',           video: null, bg: 'linear-gradient(135deg,#0a1a10,#1a4a28)', cover: '/images/_MG_0108.jpg',           page: 'proj_brume' },
    { title: 'Star Guitar',                   type: 'Motion Design',     video: '/videos/Trainanimation_1.MP4', bg: 'linear-gradient(135deg,#0d1b2a,#1a3a5c)', page: 'proj_star_guitar' },
    { title: 'Photographie',                   type: 'Photographie',      video: null, bg: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)', cover: '/images/Photographie/LUCAS-Sofia-001.jpg', coverPos: 'center center', page: 'proj_photographie' },
  ];

  const MAX_VISIBLE = 7;
  const HALF        = 3;
  const FAN         = [
    { rot: -21, scale: 0.7756, x: -30, y: -4, zIndex: 1  },
    { rot: -14, scale: 0.8498, x: -22, y: -6, zIndex: 2  },
    { rot:  -7, scale: 0.9346, x: -11, y: -7, zIndex: 3  },
    { rot:   0, scale: 1.0,    x:   0, y: -8, zIndex: 10 },
    { rot:   7, scale: 0.9346, x:  11, y: -7, zIndex: 3  },
    { rot:  14, scale: 0.8498, x:  22, y: -6, zIndex: 2  },
    { rot:  21, scale: 0.7756, x:  30, y: -4, zIndex: 1  },
  ];

  const totalCards      = projects.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  let centerIndex       = needsPagination ? HALF : Math.floor(totalCards / 2);
  let isAnimating       = false;
  let hasEntered        = false;
  let currentDir        = null;
  const prevVisible     = new Set();

  function rem() { return parseFloat(getComputedStyle(document.documentElement).fontSize); }
  function rMult() {
    const w = window.innerWidth;
    if (w < 480) return 0.28; if (w < 640) return 0.38;
    if (w < 768) return 0.5;  if (w < 1024) return 0.75;
    return 1.0;
  }
  function hMult() {
    const w = window.innerWidth;
    const ideal = w < 480 ? 352 : w < 640 ? 416 : w < 768 ? 448 : w < 1024 ? 544 : 608;
    const avail = window.innerHeight * 0.7;
    return avail >= ideal ? 1 : avail / ideal;
  }
  function slotConfig(slot) {
    if (totalCards >= MAX_VISIBLE) return FAN[slot];
    const center = totalCards >> 1;
    const dist   = totalCards > 1 ? (slot - center) / center : 0;
    const abs    = Math.abs(dist);
    return { rot: dist * 21, scale: 1 - 0.2244 * abs * abs, x: dist * 30, y: abs * abs * 7.3, zIndex: 10 - Math.abs(slot - center) };
  }
  function visibleMap(center) {
    const map = new Map();
    if (!needsPagination) { projects.forEach((_, i) => map.set(i, i)); return map; }
    for (let s = 0; s < MAX_VISIBLE; s++)
      map.set(((center + s - HALF) % totalCards + totalCards) % totalCards, s);
    return map;
  }

  // Build card elements
  const videos = [];
  const cardEls = projects.map((p, i) => {
    const card = document.createElement('div');
    card.className = 'fan-card';
    card.style.background = p.bg;
    gsap.set(card, { opacity: 0 });

    if (p.cover) {
      const img = document.createElement('img');
      img.src = p.cover;
      img.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;${p.coverPos ? `object-position:${p.coverPos};` : ''}`;
      card.appendChild(img);
    }
    if (p.video) {
      const v = document.createElement('video');
      v.src = p.video; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;';
      card.appendChild(v); v.play().catch(() => {}); videos.push(v);
    }
    const lbl = document.createElement('div');
    lbl.className = 'fan-card-label';
    lbl.innerHTML = `<span class="fan-card-type">${p.type}</span><span class="fan-card-title">${p.title}</span>`;
    card.appendChild(lbl);

    if (p.page) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        if (isAnimating) return;
        const app = document.getElementById('pf-app');
        const a = document.createElement('a'); a.dataset.page = p.page;
        app.appendChild(a); a.click(); app.removeChild(a);
      });
    }
    wrap.appendChild(card);
    return card;
  });

  // Dots
  const dotsEl = document.getElementById('fan-dots');
  if (needsPagination && dotsEl) {
    projects.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'fan-dot'; dot.dataset.idx = i;
      dotsEl.appendChild(dot);
    });
    document.getElementById('fan-nav').style.display = 'flex';
  }
  function updateDots() {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.fan-dot').forEach((d, i) => d.classList.toggle('active', i === centerIndex));
  }

  function animate() {
    const vMap    = visibleMap(centerIndex);
    const rm      = rMult(), hm = hMult(), r = rem();
    const isFirst = !hasEntered;
    let done = 0;
    const total = vMap.size;
    const onDone = () => { if (++done >= total) { isAnimating = false; if (isFirst) hasEntered = true; } };

    cardEls.forEach((card, ci) => {
      const slot    = vMap.get(ci);
      const wasVis  = prevVisible.has(ci);
      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = slotConfig(slot);
        const target = { x: x * rm * r, y: y * hm * r, rotation: rot, scale, opacity: 1, zIndex };
        if (isFirst) {
          gsap.set(card, { x: 0, y: 12 * hm * r, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: 'elastic.out(1.05,0.78)', delay: 0.2 + slot * 0.06, onComplete: onDone });
        } else if (!wasVis) {
          const ex = currentDir === 'right' ? 40 * r : -40 * r;
          gsap.set(card, { x: ex, y: y * hm * r, rotation: currentDir === 'right' ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: 'power2.out', onComplete: onDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: 'power2.out', onComplete: onDone });
        }
      } else if (wasVis) {
        const ex = currentDir === 'right' ? -40 * r : 40 * r;
        gsap.to(card, { x: ex, opacity: 0, scale: 0.5, rotation: currentDir === 'right' ? -30 : 30, duration: 0.4, ease: 'power2.in', zIndex: 0 });
      } else if (isFirst) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });
    prevVisible.clear(); vMap.forEach((_, ci) => prevVisible.add(ci));
    updateDots();
  }

  function cycle(dir) {
    if (isAnimating || !needsPagination) return;
    isAnimating  = true; currentDir = dir;
    centerIndex  = dir === 'right' ? (centerIndex + 1) % totalCards : (centerIndex - 1 + totalCards) % totalCards;
    animate();
  }

  // Hover spread
  function applyHover(hoveredSlot) {
    const vMap = visibleMap(centerIndex);
    const rm = rMult(), hm = hMult(), r = rem();
    const entries = [];
    cardEls.forEach((el, ci) => { const s = vMap.get(ci); if (s !== undefined) entries.push({ el, slot: s }); });
    entries.sort((a, b) => a.slot - b.slot);
    const centerSlot = entries.length >> 1;
    entries.forEach(({ el, slot }) => {
      const base = slotConfig(slot);
      let tx = base.x * rm * r, ty = base.y * hm * r, tr = base.rot, ts = base.scale;
      const delay = Math.abs(slot - (hoveredSlot ?? centerSlot)) * 0.02;
      if (hoveredSlot !== null) {
        if (slot === hoveredSlot) { ty -= 2.5 * hm * r; ts *= 1.08; }
        else {
          const norm = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
          const push = 8 * r * (1 - Math.abs(norm)) * (1 + 0.2 * Math.max(0, 3 - Math.abs(slot - hoveredSlot)));
          if (slot < hoveredSlot) { tx -= push * rm; tr -= 3 / (Math.abs(slot - hoveredSlot) + 1); }
          else                    { tx += push * rm; tr += 3 / (Math.abs(slot - hoveredSlot) + 1); }
        }
      }
      gsap.to(el, { x: tx, y: ty, rotation: tr, scale: ts, duration: 0.5, delay, ease: 'elastic.out(1,0.75)', overwrite: 'auto' });
      gsap.set(el, { zIndex: base.zIndex });
    });
  }

  let activeSlot = null, leaveTimer = null;
  const enterHandlers = cardEls.map((card, ci) => {
    const handler = () => {
      if (isAnimating) return;
      const vMap = visibleMap(centerIndex);
      const slot = vMap.get(ci);
      if (slot === undefined) return;
      if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
      if (activeSlot !== slot) { activeSlot = slot; applyHover(slot); }
    };
    card.addEventListener('mouseenter', handler);
    return { card, handler };
  });
  const onLeave = () => {
    if (isAnimating) return;
    if (leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => { activeSlot = null; applyHover(null); }, 50);
  };
  wrap.addEventListener('mouseleave', onLeave);

  const onResize = () => { if (!isAnimating) applyHover(activeSlot); };
  window.addEventListener('resize', onResize);

  document.getElementById('fan-prev')?.addEventListener('click', () => cycle('left'));
  document.getElementById('fan-next')?.addEventListener('click', () => cycle('right'));

  animate(); // entry animation

  return () => {
    videos.forEach(v => { v.pause(); v.src = ''; });
    enterHandlers.forEach(({ card, handler }) => card.removeEventListener('mouseenter', handler));
    wrap.removeEventListener('mouseleave', onLeave);
    window.removeEventListener('resize', onResize);
    if (leaveTimer) clearTimeout(leaveTimer);
  };
}

// ── Dynamic Frame Layout (3×3 hover-expand grid) ─────────────────────────────
function initDynamicFrameLayout() {
  const grid = document.getElementById('df-grid');
  if (!grid) return null;

  const HOVER_SIZE = 6;
  const REST_SIZE  = (12 - HOVER_SIZE) / 2; // 3fr each

  const frames = [
    { video: '/videos/Trainanimation_1.MP4',          title: 'Star Guitar',        type: 'Motion Design', bg: 'linear-gradient(135deg,#0d1b2a,#1a3a5c)' },
    { video: '/videos/LUCAS-Sofia-dossiermotion.mp4', title: 'Do It Again',        type: 'Motion Design', bg: 'linear-gradient(135deg,#1a0a0a,#5c1a1a)' },
    { video: '/videos/Brumejpeg.mp4',                 title: 'Brume',              type: 'Édition',       bg: 'linear-gradient(135deg,#0a1a10,#1a4a28)' },
    { video: '/videos/Take3_2.mp4',           title: 'Les Petits Frères des Pauvres', type: 'Identité Visuelle', bg: 'linear-gradient(135deg,#1a0a1a,#4a1a4a)' },
    { video: '/videos/Book_open_2.mov',               title: 'Terrasses des Oliviers', type: 'Édition · Livre', bg: 'linear-gradient(135deg,#1a1510,#3a2a1a)' },
    { video: null, title: 'Terrasses des Oliviers',   type: 'Édition · Livre',     bg: '#f0ede8' },
    { video: null, title: '',                         type: '',                    bg: '#f0ede8' },
    { video: null, title: '',                         type: '',                    bg: '#f0ede8' },
    { video: null, title: '',                         type: '',                    bg: '#f0ede8' },
    { video: null, title: '',                         type: '',                    bg: '#f0ede8' },
  ];

  frames.forEach((frame, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;

    const cell = document.createElement('div');
    cell.className = 'df-cell';

    const fallback = document.createElement('div');
    fallback.className = 'df-cell-fallback';
    fallback.style.background = frame.bg;
    cell.appendChild(fallback);

    let video = null;
    if (frame.video) {
      video = document.createElement('video');
      video.src    = frame.video;
      video.loop   = true;
      video.muted  = true;
      video.autoplay = true;
      video.playsInline = true;
      video.disablePictureInPicture = true;
      video.setAttribute('disablepictureinpicture', '');
      video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
      video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;pointer-events:none;';
      cell.appendChild(video);
      // Retry play — browser may block autoplay until user interaction
      const tryPlay = () => video.play().catch(() => {});
      tryPlay();
      document.addEventListener('click', tryPlay, { once: true });
      document.addEventListener('keydown', tryPlay, { once: true });
      document.addEventListener('scroll', tryPlay, { once: true });
    }

    const label = document.createElement('div');
    label.className = 'df-cell-label';
    label.innerHTML =
      `<span class="df-cell-type">${frame.type}</span>` +
      `<span class="df-cell-title">${frame.title}</span>`;
    cell.appendChild(label);

    cell.addEventListener('mouseenter', () => {
      const rowStr = [0,1,2].map(r => r === row ? `${HOVER_SIZE}fr` : `${REST_SIZE}fr`).join(' ');
      const colStr = [0,1,2].map(c => c === col ? `${HOVER_SIZE}fr` : `${REST_SIZE}fr`).join(' ');
      grid.style.gridTemplateRows    = rowStr;
      grid.style.gridTemplateColumns = colStr;
      if (video) video.play().catch(() => {});
      cell.classList.add('df-playing');
    });

    cell.addEventListener('mouseleave', () => {
      grid.style.gridTemplateRows    = '4fr 4fr 4fr';
      grid.style.gridTemplateColumns = '4fr 4fr 4fr';
      if (video) video.pause();
      cell.classList.remove('df-playing');
    });

    grid.appendChild(cell);
  });

  return () => {
    grid.querySelectorAll('video').forEach(v => { v.pause(); v.src = ''; });
  };
}

// ── Home entrance ─────────────────────────────────────────────────────────────
function animateHomeEntrance(root, fromSplash = false) {
  const delay = fromSplash ? 0.1 : 0;

  const aurora = root.querySelector('.aurora-root');
  if (aurora) gsap.fromTo(aurora, { opacity: 0 }, { opacity: 1, duration: 1.2, delay, ease: 'power2.out' });

  const nameGroup = root.querySelector('.home-name-group');
  if (nameGroup) gsap.fromTo(nameGroup, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.7, delay: delay + 0.05, ease: 'power3.out', clearProps: 'transform,opacity' });

  const crosses = root.querySelectorAll('.home-cross');
  gsap.fromTo(crosses,
    { opacity: 0, scale: 0 },
    { opacity: 1, scale: 1, duration: 0.5, delay: delay + 0.25, stagger: { each: 0.08, from: 'random' }, ease: 'back.out(2)', clearProps: 'transform,opacity' }
  );

  const reel = root.querySelector('.home-reel');
  if (reel) {
    gsap.fromTo(reel,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, delay: delay + 0.35, ease: 'power3.out', clearProps: 'transform,opacity' }
    );
  }

  const footer = root.querySelector('.home-footer');
  if (footer) {
    gsap.fromTo(footer,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, delay: delay + 0.5, ease: 'power2.out', clearProps: 'opacity' }
    );
  }

}

// ── Gooey text morph ──────────────────────────────────────────────────────────
function initGooeyMorph() {
  const t1 = document.querySelector('.home-gooey-t1');
  const t2 = document.querySelector('.home-gooey-t2');
  if (!t1 || !t2) return null;

  const texts     = ['SOFIA LUCAS', 'DIRECTRICE ARTISTIQUE JUNIOR'];
  const morphTime = 1.5;
  const cooldown0 = 2.8;
  let textIndex   = texts.length - 1;
  let then        = Date.now();
  let morph       = 0;
  let cooldown    = cooldown0;
  let raf;

  t1.textContent = texts[0];
  t2.textContent = texts[1];

  const setMorph = (f) => {
    t2.style.filter  = `blur(${Math.min(8 / f - 8, 100)}px)`;
    t2.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
    const g = 1 - f;
    t1.style.filter  = `blur(${Math.min(8 / g - 8, 100)}px)`;
    t1.style.opacity = `${Math.pow(g, 0.4) * 100}%`;
  };

  const doCooldown = () => {
    morph = 0;
    t2.style.filter = ''; t2.style.opacity = '100%';
    t1.style.filter = ''; t1.style.opacity = '0%';
  };

  const doMorph = () => {
    morph -= cooldown; cooldown = 0;
    let f = morph / morphTime;
    if (f > 1) { cooldown = cooldown0; f = 1; }
    setMorph(f);
  };

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const now = Date.now();
    const dt  = (now - then) / 1000;
    then = now;
    const wasCooling = cooldown > 0;
    cooldown -= dt;
    if (cooldown <= 0) {
      if (wasCooling) {
        textIndex      = (textIndex + 1) % texts.length;
        t1.textContent = texts[textIndex % texts.length];
        t2.textContent = texts[(textIndex + 1) % texts.length];
      }
      doMorph();
    } else {
      doCooldown();
    }
  };

  tick();
  return () => cancelAnimationFrame(raf);
}

// ── Nav letter-swap hover ─────────────────────────────────────────────────────
function initLetterSwap(el, { staggerDuration = 0.03, duration = 0.7 } = {}) {
  const label = el.textContent.trim();

  el.innerHTML =
    `<span class="sr-only">${label}</span>` +
    label.split('').map((ch, i) =>
      `<span class="ls-char">` +
        `<span class="ls-primary ls-p-${i}">${ch}</span>` +
        `<span class="ls-secondary ls-s-${i}" aria-hidden="true">${ch}</span>` +
      `</span>`
    ).join('');

  const shuffled = [...Array(label.length).keys()].sort(() => Math.random() - 0.5);
  let blocked = false;

  el.addEventListener('mouseenter', () => {
    if (blocked) return;
    blocked = true;
    shuffled.forEach((ri, i) => {
      const delay     = i * staggerDuration;
      const primary   = el.querySelector(`.ls-p-${ri}`);
      const secondary = el.querySelector(`.ls-s-${ri}`);
      if (!primary || !secondary) return;
      gsap.to(primary,   { y: '100%', duration, ease: 'power3.inOut', delay })
          .then(() => gsap.set(primary, { y: 0 }));
      gsap.to(secondary, { top: '0%', duration, ease: 'power3.inOut', delay })
          .then(() => {
            gsap.set(secondary, { top: '-100%' });
            if (i === label.length - 1) blocked = false;
          });
    });
  });
}

document.querySelectorAll('.nav-link').forEach(link => initLetterSwap(link));

// ── Click handler ─────────────────────────────────────────────────────────────
document.getElementById('pf-app').addEventListener('click', e => {
  const link = e.target.closest('[data-page]');
  if (!link) return;
  e.preventDefault();
  navigateTo(link.dataset.page);
});

// ── Language splash ───────────────────────────────────────────────────────────
function applyLang(lang) {
  window.LANG = lang;
  document.documentElement.lang = lang;
  const navProjets = document.getElementById('nav-projets');
  const navApropos = document.getElementById('nav-apropos');
  if (navProjets) { navProjets.textContent = lang === 'en' ? 'PROJECTS' : 'PROJETS'; initLetterSwap(navProjets); }
  if (navApropos) { navApropos.textContent = lang === 'en' ? 'ABOUT' : 'À PROPOS'; initLetterSwap(navApropos); }
  // Re-colorize header logo in case the img reloaded during language switch
  const logoImg = document.querySelector('.pf-logo-img');
  if (logoImg) colorizeImg(logoImg);
}

const langSplash = document.getElementById('lang-splash');
const startSite = (lang) => {
  applyLang(lang);
  gsap.to(langSplash, {
    opacity: 0, duration: 0.4, ease: 'power2.in',
    onComplete: () => { langSplash.classList.add('lang-hidden'); },
  });
  navigateTo('home');
};

document.getElementById('lang-fr').addEventListener('click', () => startSite('fr'));
document.getElementById('lang-en').addEventListener('click', () => startSite('en'));

// Load the site immediately so the nav/app is interactive behind the language splash
navigateTo('home');

// ── Splash canvas ─────────────────────────────────────────────────────────────
const splashCanvas  = document.getElementById('splash-canvas');
const splashCtx     = splashCanvas.getContext('2d');
const projectsLayer = document.getElementById('projects-layer');
const hint          = document.getElementById('scroll-hint');

const SENSITIVITY    = 0.012;
const STAR_SCALE_MIN = 0.18;
const STAR_SCALE_MAX = 8.0;
const DAMPING        = 0.08;  // lerp factor — lower = more momentum

let zoomTarget   = 0;  // raw scroll input drives this
let zoomProgress = 0;  // smoothed display value
let hintGone     = false;
let handedOff    = false;
let starImg       = null;
let starCentroidX = 0.5;  // fractional position of star's visual centre within the image
let starCentroidY = 0.5;

// ── Preprocess PNG: star (bright) → opaque, background (dark blue) → transparent
// destination-out on canvas punches the opaque star shape out of the blue fill.
// Also computes the visual centroid so we can zoom from the star's true centre.
(function loadStarMask() {
  const raw = new Image();
  raw.onload = () => {
    const tmp    = document.createElement('canvas');
    tmp.width    = raw.naturalWidth;
    tmp.height   = raw.naturalHeight;
    const tmpCtx = tmp.getContext('2d');
    tmpCtx.drawImage(raw, 0, 0);

    const id   = tmpCtx.getImageData(0, 0, tmp.width, tmp.height);
    const data = id.data;

    let sumX = 0, sumY = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 10) {
        const px = (i / 4) % tmp.width;
        const py = Math.floor((i / 4) / tmp.width);
        sumX += px; sumY += py; count++;
        data[i] = data[i + 1] = data[i + 2] = 255;
        data[i + 3] = 255;
      } else {
        data[i] = data[i + 1] = data[i + 2] = 0;
        data[i + 3] = 0;
      }
    }
    if (count > 0) {
      starCentroidX = sumX / count / tmp.width;
      starCentroidY = sumY / count / tmp.height;
    }

    tmpCtx.putImageData(id, 0, 0);

    const ready = new Image();
    ready.onload = () => { starImg = ready; };
    ready.src = tmp.toDataURL('image/png');
  };
  raw.src = '/STAR.png';
})();

// Draw blue + star-shaped cutout at given star scale (fraction of viewport)
function drawSplash(starScale) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  splashCanvas.width  = W;
  splashCanvas.height = H;

  // Fill solid blue
  splashCtx.fillStyle = '#00bbd1';
  splashCtx.fillRect(0, 0, W, H);

  if (!starImg) return;

  // Punch star-shaped hole — anchor zoom to the star's visual centroid
  const aspect = starImg.naturalWidth / starImg.naturalHeight;
  const sw = W * starScale;
  const sh = sw / aspect;
  // Offset so the centroid stays fixed at the canvas centre as the star scales
  const x = W / 2 - starCentroidX * sw;
  const y = H / 2 - starCentroidY * sh;
  splashCtx.globalCompositeOperation = 'destination-out';
  splashCtx.drawImage(starImg, x, y, sw, sh);
  splashCtx.globalCompositeOperation = 'source-over';
}

// Draw initial state (blue, no hole yet)
splashCanvas.style.opacity = '1';
drawSplash(STAR_SCALE_MIN);

// ── Input ─────────────────────────────────────────────────────────────────────
function normaliseDelta(e) {
  if (e.deltaMode === 1) return e.deltaY * 16;
  if (e.deltaMode === 2) return e.deltaY * 400;
  return e.deltaY;
}

window.addEventListener('wheel', e => {
  const px    = normaliseDelta(e);
  const atTop = pfPage.scrollTop <= 0;
  if (zoomTarget < 1) {
    e.preventDefault();
    zoomTarget = Math.max(0, Math.min(1, zoomTarget + px * SENSITIVITY));
  }
}, { passive: false });

let touchY = 0;
window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchmove', e => {
  const dy    = touchY - e.touches[0].clientY;
  touchY      = e.touches[0].clientY;
  const atTop = pfPage.scrollTop <= 0;
  if (zoomTarget < 1) {
    e.preventDefault();
    zoomTarget = Math.max(0, Math.min(1, zoomTarget + dy * SENSITIVITY));
  }
}, { passive: false });

// ── GSAP ticker — star cutout grows on scroll ─────────────────────────────────
gsap.ticker.add(() => {
  // Lerp display value toward target — faster once fade begins at 70%
  const damping = zoomProgress > 0.70 ? 0.18 : DAMPING;
  zoomProgress += (zoomTarget - zoomProgress) * damping;

  if (zoomProgress >= 0.999) {
    zoomProgress = 1;
    if (!handedOff) {
      handedOff = true;
      splashCanvas.style.display = 'none';
      hint.style.display         = 'none';
      projectsLayer.classList.add('active');
    }
    return;
  }

  // Linear scale so growth doesn't decelerate into the fade
  const scale = STAR_SCALE_MIN + zoomProgress * (STAR_SCALE_MAX - STAR_SCALE_MIN);
  drawSplash(scale);

  // Fade starts at 70%
  splashCanvas.style.opacity = zoomProgress > 0.70
    ? Math.max(0, 1 - (zoomProgress - 0.70) / 0.30).toFixed(3)
    : '1';

  if (!hintGone) {
    hint.style.opacity = Math.max(0, 1 - zoomProgress * 10).toFixed(2);
    if (zoomProgress > 0.1) { hint.style.display = 'none'; hintGone = true; }
  }
});

// ── Custom cursor ─────────────────────────────────────────────────────────────
(function initCustomCursor() {
  const BLUE  = '#00bbd1';
  const WHITE = '#ffffff';
  const RADIUS = 6;
  const TAIL_MAX = 46;
  const FADE_DELAY = 120;
  const FADE_DURATION = 200;

  const canvas = document.createElement('canvas');
  canvas.id = 'pf-cursor-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let mx = -999, my = -999;
  let px = -999, py = -999;
  let tailOpacity = 0;
  let fadeTimer = null;
  let fadeStart = null;
  let moving = false;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function onSplash() {
    const langSplash = document.getElementById('lang-splash');
    const splashCanvas = document.getElementById('splash-canvas');
    const langVisible = langSplash && !langSplash.classList.contains('lang-hidden');
    const starVisible = splashCanvas && splashCanvas.style.display !== 'none';
    return langVisible || starVisible;
  }

  window.addEventListener('mousemove', e => {
    px = mx; py = my;
    mx = e.clientX; my = e.clientY;
    tailOpacity = 1;
    moving = true;
    if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; fadeStart = null; }
    fadeTimer = setTimeout(() => {
      moving = false;
      fadeStart = performance.now();
    }, FADE_DELAY);
  });

  function draw(now) {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mx < 0) return;

    if (!moving && fadeStart !== null) {
      const elapsed = now - fadeStart;
      tailOpacity = Math.max(0, 1 - elapsed / FADE_DURATION);
    }

    const color = onSplash() ? WHITE : BLUE;

    if (tailOpacity > 0 && px > -999) {
      const dx = px - mx, dy = py - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        const len = Math.min(dist, TAIL_MAX);
        const tx = mx + (dx / dist) * len;
        const ty = my + (dy / dist) * len;
        ctx.save();
        ctx.globalAlpha = tailOpacity;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(mx, my, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  requestAnimationFrame(draw);
})();
