// ── Page templates for the SPA router ──────────────────────────────────────
const t = (fr, en) => window.t(fr, en);

export const pages = {

  // ── HOME ─────────────────────────────────────────────────────────────────
  home: () => `
    <div class="page page-home">

      <!-- Aurora background -->
      <div class="aurora-root" aria-hidden="true">
        <div class="aurora-layer"></div>
      </div>

      <!-- Vertical scrolling text strip -->
      <div class="home-strip" aria-hidden="true">
        <div class="home-strip-track">
          <span>${t('MOTION · UX · GRAPHISME · ILLUSTRATION · ÉDITION · COMMUNICATION · ', 'MOTION · UX · GRAPHIC DESIGN · ILLUSTRATION · EDITORIAL · COMMUNICATION · ')}</span>
          <span>${t('MOTION · UX · GRAPHISME · ILLUSTRATION · ÉDITION · COMMUNICATION · ', 'MOTION · UX · GRAPHIC DESIGN · ILLUSTRATION · EDITORIAL · COMMUNICATION · ')}</span>
        </div>
      </div>

      <!-- Decorative crosses -->
      <div class="home-left">
        <div class="home-footer">
          <span>—</span>
          <span>©${new Date().getFullYear()}</span>
        </div>
      </div>

      <!-- Name + subtitle grouped above reel -->
      <div class="home-name-group">
        <p class="home-name"><span>sofia</span><span>lucas</span></p>
        <p class="home-role">${t('DIRECTRICE ARTISTIQUE JUNIOR', 'JUNIOR ART DIRECTOR')}</p>
      </div>

    </div>
  `,

  // ── PROJETS ──────────────────────────────────────────────────────────────
  projets: () => {
    const rows = [
      { num: '01.', cat: t('Édition','Editorial'),             title: 'Brume',                        page: 'proj_brume',         sid: 'proj-s-01' },
      { num: '02.', cat: t('Identité Visuelle','Visual Identity'), title: 'Do It Again',              page: 'proj_do_it_again',   sid: 'proj-s-02' },
      { num: '03.', cat: t('Identité Visuelle II','Visual Identity II'), title: 'Les Petits Frères des Pauvres', page: 'proj_petits_freres', sid: 'proj-s-03' },
      { num: '04.', cat: 'Motion',                             title: 'Star Guitar',                  page: 'proj_star_guitar',   sid: 'proj-s-04' },
      { num: '05.', cat: t('Illustration','Illustration'),     title: 'Terrasses des Oliviers',        page: 'proj_terrasses',     sid: 'proj-s-05' },
      { num: '06.', cat: t('Photographie','Photography'),      title: t('Paris et Whitby','Paris & Whitby'), page: 'proj_photographie', sid: 'proj-s-06' },
    ];
    return `
    <div class="page proj-toc-page">
      <div class="proj-toc-inner">
      <div class="proj-toc-spacer"></div>
      <div class="proj-logo-anim-wrap">
        <img src="/STAR.png" alt="" class="proj-logo-anim" aria-hidden="true">
      </div>
      <div class="proj-toc-wrap">
        <p class="proj-discover-heading">${t('Choisissez un projet ou faites défiler pour découvrir', 'Choose a project or scroll down to discover')}</p>
        <hr class="proj-toc-rule">
        <table class="proj-toc-table">
          <tbody>
            ${rows.map(r => `
            <tr class="proj-toc-row" data-scroll-to="#${r.sid}" role="button" tabindex="0">
              <td class="proj-toc-num">${r.num}</td>
              <td class="proj-toc-cat">${r.cat}</td>
              <td class="proj-toc-title">${r.title}</td>
            </tr>
            <tr class="proj-toc-divider"><td colspan="3"><hr class="proj-toc-rule"></td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      </div><!-- /proj-toc-inner -->

      <div class="proj-inline-sections">

        <section class="proj-inline-section" id="proj-s-01">
          <div class="proj-inline-header">
            <span class="proj-toc-num">01.</span>
            <span class="proj-toc-cat">${t('Édition','Editorial')}</span>
            <a class="proj-inline-link" data-page="proj_brume" href="#proj_brume">${t('Voir le projet →','View project →')}</a>
          </div>
          <h3 class="proj-inline-title">Brume</h3>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container">
              ${['2.jpg','1.jpg','5.jpg','3.jpg','4.jpg'].map(f=>`<div class="sc-item"><img src="/images/Brume/Images/${f}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-02">
          <div class="proj-inline-header">
            <span class="proj-toc-num">02.</span>
            <span class="proj-toc-cat">${t('Identité Visuelle','Visual Identity')}</span>
            <a class="proj-inline-link" data-page="proj_do_it_again" href="#proj_do_it_again">${t('Voir le projet →','View project →')}</a>
          </div>
          <h3 class="proj-inline-title">Do It Again</h3>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container">
              ${['Cover.png','doublepage1.png','doublespread2.png','double page 3.png','double page4.png','double page5.png','double page6.png','double page7.png','double page8.png'].map(f=>`<div class="sc-item"><img src="/images/mockup-do-it-again-edition/${encodeURIComponent(f)}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-03">
          <div class="proj-inline-header">
            <span class="proj-toc-num">03.</span>
            <span class="proj-toc-cat">${t('Identité Visuelle II','Visual Identity II')}</span>
            <a class="proj-inline-link" data-page="proj_petits_freres" href="#proj_petits_freres">${t('Voir le projet →','View project →')}</a>
          </div>
          <h3 class="proj-inline-title">Les Petits Frères des Pauvres</h3>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container">
              ${['poster.png','mockup.png','3.jpg','mockup2.png','flyers.jpg','flyers.2.jpg','goodies-1.png','goodies-2.png'].map(f=>`<div class="sc-item"><img src="/images/petits-freres/${f}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-04">
          <div class="proj-inline-header">
            <span class="proj-toc-num">04.</span>
            <span class="proj-toc-cat">Motion</span>
            <a class="proj-inline-link" data-page="proj_star_guitar" href="#proj_star_guitar">${t('Voir le projet →','View project →')}</a>
          </div>
          <h3 class="proj-inline-title">Star Guitar</h3>
          <div class="proj-inline-video-wrap">
            <video class="proj-inline-video proj-inline-video--clip" muted playsinline src="/videos/Trainanimation_1.MP4"></video>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-05">
          <div class="proj-inline-header">
            <span class="proj-toc-num">05.</span>
            <span class="proj-toc-cat">${t('Illustration','Illustration')}</span>
            <a class="proj-inline-link" data-page="proj_terrasses" href="#proj_terrasses">${t('Voir le projet →','View project →')}</a>
          </div>
          <h3 class="proj-inline-title">Terrasses des Oliviers</h3>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container">
              ${['1.jpg','2.jpg','3.jpg','4.jpg'].map(f=>`<div class="sc-item"><img src="/images/KAP/Illustration/${f}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-06">
          <div class="proj-inline-header">
            <span class="proj-toc-num">06.</span>
            <span class="proj-toc-cat">${t('Photographie','Photography')}</span>
            <a class="proj-inline-link" data-page="proj_photographie" href="#proj_photographie">${t('Voir le projet →','View project →')}</a>
          </div>
          <h3 class="proj-inline-title">${t('Paris et Whitby','Paris & Whitby')}</h3>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container" style="gap:0.5rem">
              ${['LUCAS-Sofia-001.jpg','LUCAS-Sofia-002.jpg','LUCAS-Sofia-003.jpg','LUCAS-Sofia-004.jpg','LUCAS-Sofia-006.jpg','LUCAS-Sofia-008.jpg','IMG_6833.jpg'].map(f=>`<div class="sc-item"><img src="/images/Photographie/${encodeURIComponent(f)}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

      </div>
    </div>`;
  },

  // ── PROJECT DETAIL PAGES ─────────────────────────────────────────────────
  proj_star_guitar: () => `
    <div class="page page-inner proj-detail">
      <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
      <div class="proj-detail-info">
        <span class="proj-type">${t('Motion Design · 2026', 'Motion Design · 2026')}</span>
        <h2 class="proj-name">Star Guitar</h2>
      </div>
      <div class="pf-controls">
        <div class="pf-toggle" id="pf-toggle">
          <button class="pf-toggle-btn active" data-view="motion">Motion</button>
          <button class="pf-toggle-btn" data-view="contexte">${t('Contexte', 'Context')}</button>
        </div>
        <button class="readme-btn" data-readme="star-guitar">${t('Lisez-moi', 'Read me')}</button>
      </div>
      <div class="pf-motion-panel" id="sc-motion" style="margin-top:1cm">
        <div class="motion-player">
          <video loop playsinline src="/videos/Trainanimation_1.MP4" class="pf-motion-video"></video>
          <button class="motion-playpause" aria-label="Play/Pause">&#9654;</button>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-contexte" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container">
            ${[
              'Portfolio_elements_SG_1.jpg',
              'Portfolio_elements_SG_2.jpg',
              'Portfolio_elements_SG_3.jpg',
              'Portfolio_elements_sg_4.jpg',
              'Portfolio_elements_SG_5.jpg',
              'Portfolio_elements_SG_6.jpg',
              'Portfolio_elements_SG_7.jpg',
            ].map(f => `<div class="sc-item"><img src="/images/star-guitar/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  proj_do_it_again: () => `
    <div class="page page-inner proj-detail">
      <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
      <div class="pf-controls">
        <div class="pf-toggle" id="pf-toggle">
          <button class="pf-toggle-btn active" data-view="identite">${t('Identité visuelle', 'Visual Identity')}</button>
          <button class="pf-toggle-btn" data-view="edition">${t('Édition', 'Editorial')}</button>
          <button class="pf-toggle-btn" data-view="motion">Motion</button>
          <button class="pf-toggle-btn" data-view="uxui">UX/UI</button>
          <button class="pf-toggle-btn" data-view="charte">${t('Charte Graphique', 'Brand Guidelines')}</button>
        </div>
        <button class="readme-btn" data-readme="do-it-again">${t('Lisez-moi', 'Read me')}</button>
        <button class="storyboard-btn" id="storyboard-btn" style="display:none;">Storyboard</button>
        <div class="book-controls" id="book-controls" style="display:none;">
          <button class="book-ctrl-btn" id="book-prev">← ${t('Préc.', 'Prev.')}</button>
          <span class="book-page-label" id="book-page-label"></span>
          <button class="book-ctrl-btn" id="book-next">${t('Suiv.', 'Next')} →</button>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-identite">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0">
            ${['Slide plans.jpg','Slide plans.5.jpg','Slide plans2.jpg','Slide plans3.jpg','Slide plans4.jpg']
              .map(f => `<div class="sc-item"><img src="/DO%20IT%20AGAIN/SLIDES/${encodeURIComponent(f)}" alt="${f}" loading="lazy" style="object-fit:contain;background:#fff;"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-edition" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container">
            ${[
              'Cover.png',
              'doublepage1.png','doublespread2.png',
              'double page 3.png','double page4.png','double page5.png',
              'double page6.png','double page7.png','double page8.png',
              'double page9.png','double page10.png','double page11.png',
              'double page12.png','double page13.png','double page14.png',
              'double page15.png','double page16.png','double page17.png',
              'double page18.png','double page19.png','double page20.png',
              'double page21.png','back cover.png'
            ].map(f => `<div class="sc-item"><img src="/images/mockup-do-it-again-edition/${encodeURIComponent(f)}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="pf-motion-panel" id="sc-motion" style="display:none;margin-top:1cm">
        <div class="motion-player">
          <video loop playsinline src="/videos/LUCAS-Sofia-dossiermotion.mp4" class="pf-motion-video"></video>
          <button class="motion-playpause" aria-label="Play/Pause">&#9654;</button>
        </div>
      </div>
      <div class="sb-overlay" id="sb-overlay" style="display:none;">
        <div class="sb-card" id="sb-card">
          <button class="sb-close" id="sb-close">✕</button>
          <div style="display:flex;gap:0.75rem;align-items:flex-start;overflow-x:auto;">
            ${['1','2','3','4'].map(n => `<img src="/DO%20IT%20AGAIN/Motion/${n}.png" alt="Storyboard ${n}" style="height:80vh;width:auto;flex-shrink:0;display:block;">`).join('')}
          </div>
        </div>
      </div>
      <div id="sc-charte" style="display:none;margin-top:2cm;">
        <div class="book-wrap">
          <p class="book-loading" id="book-loading">${t('Chargement…', 'Loading…')}</p>
          <div class="book-container" id="book-container" style="display:none;"></div>
        </div>
      </div>
      <div id="sc-uxui" style="display:none;" class="sc-uxui-panel">
        <iframe style="border:1px solid rgba(0,0,0,0.1);width:100%;height:80vh;" src="https://embed.figma.com/proto/Kr5ime3omFXrMqLmSK9myq/PCG?page-id=265%3A1455&node-id=6-370&viewport=-1193%2C334%2C0.15&scaling=scale-down&content-scaling=fixed&starting-point-node-id=6%3A370&embed-host=share" allowfullscreen></iframe>
      </div>
    </div>`,

  proj_brume: () => `
    <div class="page page-inner proj-detail">
      <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
      <div class="proj-detail-info">
        <span class="proj-type">${t('Édition · 2025', 'Editorial · 2025')}</span>
        <h2 class="proj-name">Brume</h2>
      </div>
      <div class="pf-controls">
        <div class="pf-toggle" id="pf-toggle">
          <button class="pf-toggle-btn active" data-view="images">${t('Images', 'Images')}</button>
          <button class="pf-toggle-btn" data-view="livrables">${t('Livrables', 'Deliverables')}</button>
          <button class="pf-toggle-btn" data-view="contexte">${t('Contexte', 'Context')}</button>
        </div>
        <button class="readme-btn" data-readme="brume">${t('Lisez-moi', 'Read me')}</button>
        <span class="brume-note">${t('Brume, éditions I, II et III, étaient imprimées en impression laser sur calque 70 g/m². Chaque édition a été assemblée à la machine à coudre.', 'Brume, editions I, II and III, were printed by laser on 70 g/m² tracing paper. Each edition was assembled by sewing machine.')}</span>
      </div>
      <div class="proj-story-strip" id="sc-images">
        <div class="sc-viewport">
          <div class="sc-container">
            ${['2.jpg','1.jpg','5.jpg','3.jpg','4.jpg']
              .map(f => `<div class="sc-item"><img src="/images/Brume/Images/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-livrables" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0">
            ${['1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png']
              .map(f => `<div class="sc-item"><img src="/images/Brume/${f}" alt="${f}" loading="lazy"></div>`).join('')}
            <div class="sc-item" style="height:85vh"><video autoplay muted loop playsinline src="/videos/Brumejpeg.mp4" style="height:120%;width:auto;display:block;margin-top:calc(-10% - 2cm);margin-left:-3mm;"></video></div>
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-contexte" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container">
            ${['1.png','2.png','3.png']
              .map(f => `<div class="sc-item" style="height:50vh"><img src="/images/Brume/Contexte/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  proj_petits_freres: () => `
    <div class="page page-inner proj-detail">
      <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
      <div class="proj-detail-info">
        <span class="proj-type">${t('Identité Visuelle · Projet partenariat', 'Visual Identity · Partnership Project')}</span>
        <h2 class="proj-name">Les Petits Frères des Pauvres</h2>
      </div>
      <div class="pf-controls">
        <div class="pf-toggle" id="pf-toggle">
          <button class="pf-toggle-btn active" data-view="livrables">${t('Livrables', 'Deliverables')}</button>
          <button class="pf-toggle-btn" data-view="motion">Motion</button>
          <button class="pf-toggle-btn" data-view="contexte">${t('Contexte', 'Context')}</button>
        </div>
        <button class="readme-btn" data-readme="petits-freres">${t('Lisez-moi', 'Read me')}</button>
      </div>
      <div class="pf-motion-panel" id="sc-motion" style="display:none;">
        <video autoplay muted loop playsinline src="/videos/Take3_2.mp4" class="pf-motion-video"></video>
      </div>
      <div class="proj-story-strip" id="sc-contexte" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container">
            ${[
              'instagram-strips.png','typoetc.jpg','billboards.png','annie-leo.jpg','1.jpg',
            ].map(f => `<div class="sc-item"><img src="/images/petits-freres/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-livrables">
        <div class="sc-viewport">
          <div class="sc-container">
            ${[
              'poster.png','mockup.png','3.jpg','mockup2.png',
              'flyers.jpg','flyers.2.jpg','goodies-1.png','goodies-2.png',
            ].map(f => `<div class="sc-item"><img src="/images/petits-freres/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  proj_terrasses: () => `
    <div class="page page-inner proj-detail">
      <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
      <div class="proj-detail-info">
        <span class="proj-type">${t('Illustration · Édition · 2025', 'Illustration · Editorial · 2025')}</span>
        <h2 class="proj-name">Terrasses des Oliviers</h2>
      </div>
      <div class="pf-controls">
        <div class="pf-toggle" id="pf-toggle">
          <button class="pf-toggle-btn active" data-view="illustration">${t('Illustration', 'Illustration')}</button>
          <button class="pf-toggle-btn" data-view="edition">${t('Édition', 'Editorial')}</button>
          <button class="pf-toggle-btn" data-view="contexte">${t('Contexte', 'Context')}</button>
        </div>
        <button class="readme-btn" data-readme="terrasses">${t('Lisez-moi', 'Read me')}</button>
      </div>
      <div class="proj-story-strip" id="sc-illustration">
        <div class="sc-viewport">
          <div class="sc-container">
            ${['1.jpg','2.jpg','3.jpg','4.jpg']
              .map(f => `<div class="sc-item"><img src="/images/KAP/Illustration/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-edition" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container">
            <div class="sc-item"><img src="/images/KAP/edition/1.jpg" alt="1.jpg" loading="lazy"></div>
            <div class="sc-item"><video autoplay muted loop playsinline src="/images/KAP/edition/2.mp4" style="height:100%;width:auto;display:block;"></video></div>
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-contexte" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container">
            ${['1.jpg','2.jpg','3.jpg','5.png']
              .map(f => `<div class="sc-item"><img src="/images/KAP/Contexte/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  proj_do_it_again_edition: () => `
    <div class="page page-inner proj-detail">
      <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
      <div class="proj-detail-info">
        <span class="proj-type">${t('Édition · Projet fin d\'études', 'Editorial · Final Year Project')}</span>
        <h2 class="proj-name">Do It Again Édition</h2>
      </div>
      <button class="readme-btn readme-btn--spaced" data-readme="do-it-again-edition">${t('Lisez-moi', 'Read me')}</button>
      <div class="proj-story-strip">
        <div class="sc-viewport">
          <div class="sc-container">
            ${[
              'Cover.png',
              'doublepage1.png','doublespread2.png',
              'double page 3.png','double page4.png','double page5.png',
              'double page6.png','double page7.png','double page8.png',
              'double page9.png','double page10.png','double page11.png',
              'double page12.png','double page13.png','double page14.png',
              'double page15.png','double page16.png','double page17.png',
              'double page18.png','double page19.png','double page20.png',
              'double page21.png','back cover.png'
            ].map(f => `<div class="sc-item"><img src="/images/mockup-do-it-again-edition/${encodeURIComponent(f)}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  proj_photographie: () => `
    <div class="page page-inner proj-detail">
      <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
      <div class="pf-toggle" id="pf-toggle" style="margin-top:0.2rem">
        <button class="pf-toggle-btn active" data-view="paris">Paris</button>
        <button class="pf-toggle-btn" data-view="whitby">Whitby</button>
        <button class="pf-toggle-btn" data-view="diptyques">${t('Diptyques', 'Diptychs')}</button>
      </div>
      <button class="readme-btn readme-btn--spaced" data-readme="paris">${t('Lisez-moi', 'Read me')}</button>
      <div class="proj-story-strip" id="sc-paris">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0.5rem">
            ${['LUCAS-Sofia-001.jpg','LUCAS-Sofia-002.jpg','LUCAS-Sofia-003.jpg','LUCAS-Sofia-004.jpg','LUCAS-Sofia-006.jpg','LUCAS-Sofia-008.jpg','IMG_6833.jpg']
              .map(f => `<div class="sc-item"><img src="/images/Photographie/${encodeURIComponent(f)}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-whitby" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0.5rem">
            ${['13.jpg','14.jpg','15.jpg','16.jpg','17.jpg','18.jpg']
              .map(f => `<div class="sc-item"><img src="/images/Photographie/whitby/${encodeURIComponent(f)}" alt="Whitby ${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-diptyques" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0.5rem">
            ${['diptyque1.png','diptyque2.png','diptyque3.png']
              .map(f => `<div class="sc-item"><img src="/images/Photographie/${encodeURIComponent(f)}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  // ── CV ───────────────────────────────────────────────────────────────────
  cv: () => `
    <div class="page page-cv">
      <iframe src="/cv.pdf" class="cv-iframe" title="CV Sofia Lucas"></iframe>
    </div>
  `,

  // ── À PROPOS ─────────────────────────────────────────────────────────────
  apropos: () => `
    <div class="page page-inner page-about">
      <div class="about-bg-name" aria-hidden="true"><span>SOFIA</span><span>LUCAS</span></div>
      <div class="about-content">
        <p class="about-role">${t('Junior Art Director', 'Junior Art Director')}</p>
        <p class="about-lead">${t('Hey, je m\'appelle Sofia Lucas.', 'Hey, my name is Sofia Lucas.')}</p>
        <p>${t('Britannique installée à Paris, je réunis une double formation — une licence en Français et Sciences Politiques, suivie d\'un Bachelor en Direction Artistique et Graphisme à la LISAA Paris.', 'British-born and based in Paris, I bring a dual background — a BA in French and Political Science, followed by a Bachelor\'s in Art Direction and Graphic Design at LISAA Paris.')}</p>
        <p>${t('Mon travail puise dans les voyages, la musique électronique, le cinéma et l\'architecture du quotidien. Le dessin reste au cœur de toute ma pratique.', 'My work draws from travel, electronic music, cinema and everyday architecture. Drawing remains at the heart of everything I do.')}</p>
        <p>${t('Ouverte aux collaborations freelance et aux opportunités en direction artistique, motion design et identité visuelle.', 'Open to freelance collaborations and opportunities in art direction, motion design and visual identity.')}</p>
        <div class="about-refs">
          <span class="about-refs-lbl">${t('Références', 'References')}</span>
          Lanthimos · Coppola · Tillmans · Hewlett · Valley
        </div>
      </div>
    </div>
  `,

  // ── CONTACT ──────────────────────────────────────────────────────────────
  contact: () => `
    <div class="page page-inner page-contact">
      <div class="contact-split">
        <div class="contact-left">
          <h1 class="contact-heading">${t('Travaillons<br>ensemble', 'Let\'s work<br>together')}</h1>
          <p class="contact-intro">${t('Écrivez-moi un message et je vous répondrai.<br>Disponible pour du travail freelance en français et en anglais.', 'Send me a message and I\'ll get back to you.<br>Available for freelance work in French and English.')}</p>
          <div class="contact-details">
            <h3 class="contact-details-title">${t('Coordonnées', 'Contact details')}</h3>
            <ul class="contact-details-list">
              <li><span class="contact-detail-label">Email</span><a href="mailto:sofiahelenelucas@gmail.com" class="contact-detail-link">sofiahelenelucas@gmail.com</a></li>
              <li><span class="contact-detail-label">${t('Localisation', 'Location')}</span><span>Paris, France</span></li>
            </ul>
          </div>
          <div class="contact-socials">
            <a href="https://www.instagram.com/ssofialucas" target="_blank" rel="noopener" class="contact-soc">INSTAGRAM</a>
            <a href="https://www.linkedin.com/in/sofiahelenelucas" target="_blank" rel="noopener" class="contact-soc">LINKEDIN</a>
          </div>
        </div>
        <div class="contact-right">
          <form class="contact-form" id="contact-form" action="https://formsubmit.co/sofiahelenelucas@gmail.com" method="POST">
            <input type="hidden" name="_subject" value="${t('Nouveau message — Portfolio Sofia Lucas', 'New message — Sofia Lucas Portfolio')}">
            <input type="hidden" name="_captcha" value="false">
            <input type="hidden" name="_next" value="about:blank">
            <input type="hidden" name="_template" value="table">
            <div class="contact-form-row">
              <div class="contact-field">
                <label for="cf-prenom">${t('Prénom', 'First name')}</label>
                <input type="text" id="cf-prenom" name="prenom" placeholder="${t('Prénom', 'First name')}" required>
              </div>
              <div class="contact-field">
                <label for="cf-nom">${t('Nom', 'Last name')}</label>
                <input type="text" id="cf-nom" name="nom" placeholder="${t('Nom', 'Last name')}" required>
              </div>
            </div>
            <div class="contact-field">
              <label for="cf-email">Email</label>
              <input type="email" id="cf-email" name="email" placeholder="${t('votre@email.com', 'your@email.com')}" required>
            </div>
            <div class="contact-field">
              <label for="cf-sujet">${t('Sujet', 'Subject')}</label>
              <input type="text" id="cf-sujet" name="sujet" placeholder="${t('Sujet', 'Subject')}">
            </div>
            <div class="contact-field">
              <label for="cf-message">Message</label>
              <textarea id="cf-message" name="message" rows="5" placeholder="${t('Votre message…', 'Your message…')}" required></textarea>
            </div>
            <button type="submit" class="contact-submit" id="contact-submit">${t('Envoyer', 'Send')}</button>
            <p class="contact-success" id="contact-success" style="display:none;">${t('Message envoyé — merci !', 'Message sent — thank you!')}</p>
          </form>
        </div>
      </div>
      <div class="contact-ribbon-single" id="contact-ribbons">
        <div class="ribbon-track">
          ${(() => {
            const item = `<span class="ribbon-item">Vous cherchez une directrice artistique&nbsp;? Ne cherchez plus&nbsp;! Je suis en recherche d'une alternance, 1/2 semaines.</span>`;
            const base = Array(8).fill(item).join('');
            return base + base;
          })()}
        </div>
      </div>
    </div>
  `,
};

// ── Carousel tiles ──────────────────────────────────────────────────────────
