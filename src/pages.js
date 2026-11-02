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

      <!-- Opening video (replaces name + role) -->
      <div class="home-name-group">
        <video class="home-opening-video" autoplay loop playsinline preload="auto" src="/videos/comp1_1.mp4"></video>
      </div>

    </div>
  `,

  // ── PROJETS ──────────────────────────────────────────────────────────────
  projets: () => {
    const rows = [
      { num: '01.', cat: t('Édition','Editorial'),                   title: 'Brume',                        page: 'proj_brume',         sid: 'proj-s-01' },
      { num: '02.', cat: t('Identité Visuelle','Visual Identity'),  title: 'Do It Again',                  page: 'proj_do_it_again',   sid: 'proj-s-02' },
      { num: '03.', cat: t('Identité Visuelle','Visual Identity'),   title: 'OTTO',                         page: 'proj_otto',          sid: 'proj-s-13' },
      { num: '04.', cat: t('Identité Visuelle','Visual Identity'),  title: 'Studio soie',                  page: 'proj_studio_soie',   sid: 'proj-s-14' },
      { num: '05.', cat: t('Identité Visuelle','Visual Identity'),  title: 'Seabreeze',                    page: 'proj_seabreeze',     sid: 'proj-s-11' },
      { num: '06.', cat: t('Identité Visuelle II','Visual Identity II'), title: 'Les Petits Frères des Pauvres', page: 'proj_petits_freres', sid: 'proj-s-03' },
      { num: '07.', cat: 'Motion',                                  title: 'Star Guitar',                  page: 'proj_star_guitar',   sid: 'proj-s-06' },
      { num: '08.', cat: t('Photographie','Photography'),           title: 'The Caymans',                  page: 'proj_caymans',       sid: 'proj-s-04' },
      { num: '09.', cat: t('Photographie','Photography'),           title: 'Un Monde en Partage',          page: 'proj_photographie',  sid: 'proj-s-08' },
    ];
    return `
    <div class="page proj-toc-page">

      <!-- ── Desktop sidebar (hidden on mobile) ── -->
      <nav class="proj-toc-sidebar" aria-label="${t('Navigation projets', 'Projects navigation')}">
        <div class="proj-cat-group">
          <h3 class="proj-cat-heading">Graphisme</h3>
          <ul class="proj-cat-list">
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-01" data-project-page="proj_brume" href="#">Brume</a></li>
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-02" data-project-page="proj_do_it_again" href="#">Do It Again</a></li>
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-13" data-project-page="proj_otto" href="#">OTTO</a></li>
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-14" data-project-page="proj_studio_soie" href="#">Studio soie</a></li>
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-11" data-project-page="proj_seabreeze" href="#">Seabreeze</a></li>
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-03" data-project-page="proj_petits_freres" href="#">Les Petits Frères</a></li>
          </ul>
        </div>

        <div class="proj-cat-group">
          <h3 class="proj-cat-heading">Motion</h3>
          <ul class="proj-cat-list">
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-02" data-project-page="proj_do_it_again" href="#">Do It Again</a></li>
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-03" data-project-page="proj_petits_freres" href="#">Les Petits Frères</a></li>
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-06" data-project-page="proj_star_guitar" href="#">Star Guitar</a></li>
          </ul>
        </div>

        <div class="proj-cat-group">
          <h3 class="proj-cat-heading">${t('Photographie', 'Photography')}</h3>
          <ul class="proj-cat-list">
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-04" data-project-page="proj_caymans" href="#">The Caymans</a></li>
            <li><a class="proj-cat-link" data-scroll-to="#proj-s-08" data-project-page="proj_photographie" href="#">Un Monde en Partage</a></li>
          </ul>
        </div>
      </nav>

      <!-- ── Mobile TOC (hidden on desktop) ── -->
      <div class="proj-toc-inner">
      <div class="proj-toc-spacer"></div>
      <div class="proj-logo-anim-wrap">
        <img src="/images/etoilebleu2.png" alt="" class="proj-logo-anim" aria-hidden="true">
      </div>
      <div class="proj-toc-wrap">
        <p class="proj-discover-heading">${t('Choisissez un projet ou faites défiler pour découvrir', 'Choose a project or scroll down to discover')}</p>
        <hr class="proj-toc-rule">
        <table class="proj-toc-table">
          <tbody>
            ${rows.map(r => `
            <tr class="proj-toc-row" data-scroll-to="#${r.sid}" data-project-page="${r.page}" role="button" tabindex="0">
              <td class="proj-toc-num">${r.num}</td>
              <td class="proj-toc-cat">${r.title}</td>
              <td class="proj-toc-title">${r.cat}</td>
            </tr>
            <tr class="proj-toc-divider"><td colspan="3"><hr class="proj-toc-rule"></td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      </div><!-- /proj-toc-inner -->

      <!-- ── Main content — project preview sections (hidden on mobile) ── -->
      <div class="proj-toc-main">
      <p class="proj-main-title">${t('Découvrir un projet', 'Discover a project')}</p>
      <div class="proj-inline-sections">

        <section class="proj-inline-section" id="proj-s-01">
          <div class="proj-inline-header">
            <h3 class="proj-inline-title">Brume</h3>
            <a class="proj-inline-link" data-page="proj_brume" href="#proj_brume">${t('Voir le projet →','View project →')}</a>
          </div>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container">
              ${['2.jpg','1.jpg','5.jpg','3.jpg','4.jpg'].map(f=>`<div class="sc-item"><img src="/images/Brume/Images/${f}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-02">
          <div class="proj-inline-header">
            <h3 class="proj-inline-title">Do It Again</h3>
            <a class="proj-inline-link" data-page="proj_do_it_again" href="#proj_do_it_again">${t('Voir le projet →','View project →')}</a>
          </div>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container" style="gap:0">
              ${['1.jpg','2.jpg','3.jpg','4.jpg'].map(f=>`<div class="sc-item"><img src="/DO%20IT%20AGAIN/SLIDES/${encodeURIComponent(f)}" alt="${f}" loading="lazy" style="object-fit:contain;background:#fff;"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-13">
          <div class="proj-inline-header">
            <h3 class="proj-inline-title">OTTO</h3>
            <a class="proj-inline-link" data-page="proj_otto" href="#proj_otto">${t('Voir le projet →','View project →')}</a>
          </div>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container" style="gap:0">
              ${['1.webp','2.webp','3.webp','4.webp','5.webp'].map(f=>`<div class="sc-item sc-item--fullh"><img src="/OTTO/${f}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-14">
          <div class="proj-inline-header">
            <h3 class="proj-inline-title">Studio soie</h3>
            <a class="proj-inline-link" data-page="proj_studio_soie" href="#proj_studio_soie">${t('Voir le projet →','View project →')}</a>
          </div>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container" style="gap:0">
              ${['1.jpg','2.jpg','3.jpg','4.png','5.jpg','6.jpg','7.jpg'].map(f=>`<div class="sc-item"><img src="${encodeURI('/Studio soie/' + f)}?v=2" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-11">
          <div class="proj-inline-header">
            <h3 class="proj-inline-title">Seabreeze</h3>
            <a class="proj-inline-link" data-page="proj_seabreeze" href="#proj_seabreeze">${t('Voir le projet →','View project →')}</a>
          </div>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container" style="gap:0">
              ${['1.webp','2.webp','3.webp','4.webp','5.webp'].map(f=>`<div class="sc-item"><img src="/Seabreeze/${f}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-03">
          <div class="proj-inline-header">
            <h3 class="proj-inline-title">Les Petits Frères des Pauvres</h3>
            <a class="proj-inline-link" data-page="proj_petits_freres" href="#proj_petits_freres">${t('Voir le projet →','View project →')}</a>
          </div>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container" style="gap:0">
              ${['poster.webp','mockup.webp','3.jpg','mockup2.webp','flyers.jpg','flyers.2.jpg','goodies-1.webp','goodies-2.webp'].map(f=>`<div class="sc-item"><img src="/images/petits-freres/${f}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-06">
          <div class="proj-inline-header">
            <h3 class="proj-inline-title">Star Guitar</h3>
            <a class="proj-inline-link" data-page="proj_star_guitar" href="#proj_star_guitar">${t('Voir le projet →','View project →')}</a>
          </div>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container">
              <div class="sc-item" style="width:calc(40vh * 16/9)"><video class="proj-inline-sc-video" autoplay muted loop playsinline preload="metadata" src="/videos/Trainanimation_1.MP4"></video></div>
              ${['Portfolio_elements_SG_1.jpg','Portfolio_elements_SG_2.jpg','Portfolio_elements_SG_3.jpg','Portfolio_elements_sg_4.jpg','Portfolio_elements_SG_5.jpg','Portfolio_elements_SG_6.jpg','Portfolio_elements_SG_7.jpg'].map(f=>`<div class="sc-item"><img src="/images/star-guitar/${f}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-04">
          <div class="proj-inline-header">
            <h3 class="proj-inline-title">The Caymans</h3>
            <a class="proj-inline-link" data-page="proj_caymans" href="#proj_caymans">${t('Voir le projet →','View project →')}</a>
          </div>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container">
              ${['1.jpg','2.jpg','3.jpg','5.jpg','7.jpg'].map(f=>`<div class="sc-item"><img src="${encodeURI('/The caymans/Photos/' + f)}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>

        <section class="proj-inline-section" id="proj-s-08">
          <div class="proj-inline-header">
            <h3 class="proj-inline-title">Un Monde en Partage</h3>
            <a class="proj-inline-link" data-page="proj_photographie" href="#proj_photographie">${t('Voir le projet →','View project →')}</a>
          </div>
          <div class="proj-story-strip">
            <div class="sc-viewport"><div class="sc-container" style="gap:0.5rem">
              ${['LUCAS-Sofia-001.jpg','LUCAS-Sofia-002.jpg','LUCAS-Sofia-003.jpg','LUCAS-Sofia-004.jpg','LUCAS-Sofia-006.jpg','LUCAS-Sofia-008.jpg','IMG_6833.jpg'].map(f=>`<div class="sc-item"><img src="/images/Photographie/${encodeURIComponent(f)}" alt="${f}" loading="lazy"></div>`).join('')}
            </div></div>
          </div>
        </section>


      </div>
      </div><!-- /proj-toc-main -->
    </div>`;
  },

  proj_otto: () => `
    <div class="page page-inner proj-detail">
      <div class="proj-nav-actions">
        <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
        <a class="proj-next" href="#proj_studio_soie" data-page="proj_studio_soie">${t('Prochain projet →', 'Next project →')}</a>
      </div>
      <div class="proj-detail-info">
        <h2 class="proj-name">OTTO</h2>
      </div>
      <div class="pf-controls">
        <button class="readme-btn" data-readme="otto">${t('Lisez-moi', 'Read me')}</button>
      </div>
      <div class="proj-story-strip proj-story-strip--fullh">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0">
            ${['1.webp','2.webp','3.webp','4.webp','5.webp'].map(f=>`<div class="sc-item sc-item--fullh"><img src="/OTTO/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  // ── PROJECT DETAIL PAGES ─────────────────────────────────────────────────
  proj_star_guitar: () => `
    <div class="page page-inner proj-detail">
      <div class="proj-nav-actions">
        <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
        <a class="proj-next" href="#proj_caymans" data-page="proj_caymans">${t('Prochain projet →', 'Next project →')}</a>
      </div>
      <div class="proj-detail-info">
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
          <video loop playsinline preload="metadata" src="/videos/Trainanimation_1.MP4" class="pf-motion-video"></video>
          <div class="motion-controls">
            <button class="motion-playpause" aria-label="Play/Pause">&#9654;</button>
            <button class="readme-btn motion-fullscreen-btn" aria-label="Full screen">${t('Plein écran', 'Full screen')}</button>
          </div>
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
      <div class="proj-nav-actions">
        <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
        <a class="proj-next" href="#proj_otto" data-page="proj_otto">${t('Prochain projet →', 'Next project →')}</a>
      </div>
      <div class="pf-controls">
        <div class="pf-toggle" id="pf-toggle">
          <button class="pf-toggle-btn active" data-view="identite">${t('Visuels', 'Visuals')}</button>
          <button class="pf-toggle-btn" data-view="edition">${t('Édition', 'Editorial')}</button>
          <button class="pf-toggle-btn" data-view="motion">Motion</button>
          <button class="pf-toggle-btn" data-view="uxui">UX/UI</button>
        </div>
        <button class="readme-btn" data-readme="do-it-again">${t('Lisez-moi', 'Read me')}</button>
        <span class="brume-note" id="dia-edition-note" style="display:none">${t('Do It Again Collectors Edition est imprimée sur papier brillant 180g et 300g', 'Do It Again Collectors Edition is printed on 180g and 300g gloss paper')}</span>
        <div class="book-controls" id="book-controls" style="display:none;">
          <button class="book-ctrl-btn" id="book-prev">← ${t('Préc.', 'Prev.')}</button>
          <span class="book-page-label" id="book-page-label"></span>
          <button class="book-ctrl-btn" id="book-next">${t('Suiv.', 'Next')} →</button>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-identite">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0">
            ${['1.jpg','2.jpg','3.jpg','4.jpg']
              .map(f => `<div class="sc-item"><img src="/DO%20IT%20AGAIN/SLIDES/${encodeURIComponent(f)}" alt="${f}" loading="lazy" style="object-fit:contain;background:#fff;"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-edition" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container">
            ${[
              'Cover.webp',
              'doublepage1.webp','doublespread2.webp',
              'double page 3.webp','double page4.webp','double page5.webp',
              'double page6.webp','double page7.webp','double page8.webp',
              'double page9.webp','double page10.webp','double page11.webp',
              'double page12.webp','double page13.webp','double page14.webp',
              'double page15.webp','double page16.webp','double page17.webp',
              'double page18.webp','double page19.webp','double page20.webp',
              'double page21.webp','back cover.webp'
            ].map(f => `<div class="sc-item"><img src="/images/mockup-do-it-again-edition/${encodeURIComponent(f)}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="pf-motion-panel" id="sc-motion" style="display:none;margin-top:1cm">
        <div class="motion-player">
          <video loop playsinline preload="none" src="/videos/FINALVIDEO.mp4" class="pf-motion-video"></video>
          <div class="motion-controls">
            <button class="motion-playpause" aria-label="Play/Pause">&#9654;</button>
            <button class="readme-btn motion-fullscreen-btn" aria-label="Full screen">${t('Plein écran', 'Full screen')}</button>
          </div>
        </div>
      </div>
      <div id="sc-uxui" style="display:none;" class="sc-uxui-panel">
        <span class="brume-note">Veuillez patienter quelques instants le temps que le contenu se charge</span>
        <iframe style="border:1px solid rgba(0,0,0,0.1);width:100%;height:80vh;" data-src="https://embed.figma.com/proto/Kr5ime3omFXrMqLmSK9myq/PCG?page-id=265%3A1455&node-id=6-370&viewport=-1193%2C334%2C0.15&scaling=scale-down&content-scaling=fixed&starting-point-node-id=6%3A370&embed-host=share" allowfullscreen></iframe>
      </div>
    </div>`,

  proj_studio_soie: () => `
    <div class="page page-inner proj-detail">
      <div class="proj-nav-actions">
        <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
        <a class="proj-next" href="#proj_seabreeze" data-page="proj_seabreeze">${t('Prochain projet →', 'Next project →')}</a>
      </div>
      <div class="proj-detail-info">
        <h2 class="proj-name">Studio soie</h2>
      </div>
      <div class="pf-controls">
        <button class="readme-btn" data-readme="studio-soie">${t('Lisez-moi', 'Read me')}</button>
      </div>
      <div class="proj-story-strip">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0">
            ${['1.jpg','2.jpg','3.jpg','4.png','5.jpg','6.jpg','7.jpg'].map(f=>`<div class="sc-item sc-item--fullh"><img src="${encodeURI('/Studio soie/' + f)}?v=2" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  proj_brume: () => `
    <div class="page page-inner proj-detail proj-brume">
      <div class="proj-nav-actions">
        <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
        <a class="proj-next" href="#proj_do_it_again" data-page="proj_do_it_again">${t('Prochain projet →', 'Next project →')}</a>
      </div>
      <div class="proj-detail-info">
        <h2 class="proj-name">Brume</h2>
      </div>
      <div class="pf-controls">
        <div class="pf-toggle" id="pf-toggle">
          <button class="pf-toggle-btn active" data-view="images">${t('Photos', 'Photos')}</button>
          <button class="pf-toggle-btn" data-view="livrables">${t('Édition', 'Edition')}</button>
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
            ${['1.webp','2.webp','3.webp','4.webp','5.webp','6.webp','7.webp','8.webp']
              .map(f => `<div class="sc-item"><img src="/images/Brume/${f}" alt="${f}" loading="lazy"></div>`).join('')}
            <div class="sc-item brume-livrables-video" style="height:85vh"><video autoplay muted loop playsinline preload="none" src="/videos/Brumejpeg.mp4" style="height:120%;width:auto;display:block;margin-top:calc(-10% - 2cm);margin-left:-3mm;"></video></div>
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
      <div class="proj-nav-actions">
        <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
        <a class="proj-next" href="#proj_star_guitar" data-page="proj_star_guitar">${t('Prochain projet →', 'Next project →')}</a>
      </div>
      <div class="proj-detail-info">
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
        <video muted loop playsinline preload="none" src="/videos/Take3_2.mp4" class="pf-motion-video"></video>
      </div>
      <div class="proj-story-strip" id="sc-contexte" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0">
            ${[
              'instagram-strips.png','typoetc.jpg','billboards.png','annie-leo.jpg','1.jpg',
            ].map(f => `<div class="sc-item"><img src="/images/petits-freres/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-livrables">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0">
            ${[
              'poster.webp','mockup.webp','3.jpg','mockup2.webp',
              'flyers.jpg','flyers.2.jpg','goodies-1.webp','goodies-2.webp',
            ].map(f => `<div class="sc-item"><img src="/images/petits-freres/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  proj_seabreeze: () => `
    <div class="page page-inner proj-detail">
      <div class="proj-nav-actions">
        <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
        <a class="proj-next" href="#proj_petits_freres" data-page="proj_petits_freres">${t('Prochain projet →', 'Next project →')}</a>
      </div>
      <div class="proj-detail-info">
        <h2 class="proj-name">Seabreeze</h2>
      </div>
      <div class="proj-story-strip">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0">
            ${['1.webp','2.webp','3.webp','4.webp','5.webp'].map(f=>`<div class="sc-item sc-item--fullh"><img src="/Seabreeze/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  proj_caymans: () => `
    <div class="page page-inner proj-detail">
      <div class="proj-nav-actions">
        <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
        <a class="proj-next" href="#proj_photographie" data-page="proj_photographie">${t('Prochain projet →', 'Next project →')}</a>
      </div>
      <div class="proj-detail-info">
        <h2 class="proj-name">The Caymans</h2>
      </div>
      <div class="pf-controls">
        <div class="pf-toggle" id="pf-toggle">
          <button class="pf-toggle-btn active" data-view="photos">Photos</button>
          <button class="pf-toggle-btn" data-view="pochettes">Pochettes</button>
        </div>
        <button class="readme-btn" data-readme="caymans">${t('Lisez-moi', 'Read me')}</button>
      </div>
      <div class="proj-story-strip" id="sc-photos">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0.5rem">
            ${['1.jpg','2.jpg','3.jpg','5.jpg','7.jpg']
              .map(f => `<div class="sc-item"><img src="${encodeURI('/The caymans/Photos/' + f)}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-pochettes" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0.5rem">
            ${['1.png','2.png','3.png']
              .map(f => `<div class="sc-item"><img src="${encodeURI('/The caymans/Pochettes/' + f)}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  proj_katerina: () => `
    <div class="page page-inner proj-detail">
      <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
      <div class="proj-detail-info">
        <h2 class="proj-name">Katerina</h2>
      </div>
      <div class="pf-controls">
        <div class="pf-toggle" id="pf-toggle">
          <button class="pf-toggle-btn active" data-view="photos">${t('Photos', 'Photos')}</button>
          <button class="pf-toggle-btn" data-view="pochettes">${t('Pochettes', 'Covers')}</button>
        </div>
        <button class="readme-btn" data-readme="katerina">${t('Lisez-moi', 'Read me')}</button>
      </div>
      <div class="proj-story-strip" id="sc-photos">
        <div class="sc-viewport">
          <div class="sc-container">
            ${['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg']
              .map(f => `<div class="sc-item"><img src="/Katerina/Photos/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="proj-story-strip" id="sc-pochettes" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container">
            ${['Cover1.jpg','Cover2.jpg']
              .map(f => `<div class="sc-item"><img src="/Katerina/Edits/${f}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,


  proj_do_it_again_edition: () => `
    <div class="page page-inner proj-detail">
      <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
      <div class="proj-detail-info">
        <h2 class="proj-name">Do It Again Édition</h2>
      </div>
      <button class="readme-btn readme-btn--spaced" data-readme="do-it-again-edition">${t('Lisez-moi', 'Read me')}</button>
      <div class="brume-note" style="margin-left:0;margin-bottom:0.5rem;white-space:normal">${t('Do It Again Collectors Edition est imprimée sur papier brillant 180g et 300g', 'Do It Again Collectors Edition is printed on 180g and 300g gloss paper')}</div>
      <div class="proj-story-strip">
        <div class="sc-viewport">
          <div class="sc-container">
            ${[
              'Cover.webp',
              'doublepage1.webp','doublespread2.webp',
              'double page 3.webp','double page4.webp','double page5.webp',
              'double page6.webp','double page7.webp','double page8.webp',
              'double page9.webp','double page10.webp','double page11.webp',
              'double page12.webp','double page13.webp','double page14.webp',
              'double page15.webp','double page16.webp','double page17.webp',
              'double page18.webp','double page19.webp','double page20.webp',
              'double page21.webp','back cover.webp'
            ].map(f => `<div class="sc-item"><img src="/images/mockup-do-it-again-edition/${encodeURIComponent(f)}" alt="${f}" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`,

  proj_photographie: () => `
    <div class="page page-inner proj-detail">
      <div class="proj-nav-actions">
        <a class="proj-back" href="#projets" data-page="projets">← ${t('Projets', 'Projects')}</a>
      </div>
      <div class="photo-toggle-row" style="display:flex;align-items:center;gap:0.75rem;margin-top:0.2rem">
        <div class="pf-toggle" id="pf-toggle">
          <button class="pf-toggle-btn active" data-view="paris">Paris</button>
          <button class="pf-toggle-btn" data-view="whitby">Whitby</button>
          <button class="pf-toggle-btn" data-view="athenes">Athènes</button>
          <button class="pf-toggle-btn" data-view="diptyques">${t('Diptyques', 'Diptychs')}</button>
        </div>
      </div>
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
      <div class="proj-story-strip" id="sc-athenes" style="display:none;">
        <div class="sc-viewport">
          <div class="sc-container" style="gap:0.5rem">
            ${['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg']
              .map(f => `<div class="sc-item"><img src="/images/Photographie/Athenes/${encodeURIComponent(f)}" alt="Athènes ${f}" loading="lazy"></div>`).join('')}
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
      <img src="/cv.jpg" alt="CV Sofia Lucas" class="cv-img">
      <div class="cv-logo-wrap">
        <img src="/images/etoilebleu2.png" alt="" class="proj-logo-anim" aria-hidden="true">
      </div>
    </div>
  `,

  // ── À PROPOS ─────────────────────────────────────────────────────────────
  apropos: () => `
    <div class="page page-inner page-about">
      <div class="aph-root">
        <div class="aph-sticky">
          <div class="aph-center"></div>
          <div class="aph-items">
            <div class="aph-item aph-item--1" style="background:transparent"></div>
            <div class="aph-item aph-item--3" style="background:transparent"></div>
            <div class="aph-group">
              <div class="aph-item aph-item--4" style="background:transparent"><img src="/IMG_0153%202.jpg" alt="Sofia Lucas" style="width:100%;height:100%;object-fit:contain;display:block;"></div>
              <div class="aph-item aph-item--2 aph-item--text" style="background:transparent">
                <span class="aph-title">${t('À PROPOS', 'ABOUT')}</span>
                <button class="aph-scroll-btn" id="aph-scroll-btn">${t('Défiler', 'Scroll')} <span class="aph-scroll-arrow">→</span></button>
              </div>
            </div>
          </div>
        </div>
        <div class="aph-fade"></div>
      </div>
      <div class="about-content">
        <div class="about-content-inner">
          <p class="about-lead">${t('Hello ! Moi, c\'est Sofia, directrice artistique britannique vivant en France.', 'Hey! I\'m Sofia, a British art director living in France.')}</p>
          <p>${t('Mon portfolio reflète un mélange d\'influences culturelles, façonné par les lieux que j\'ai traversés, mes passions et les études que j\'ai suivies.', 'My portfolio reflects a blend of cultural influences, shaped by the places I\'ve lived, my passions and the studies I\'ve pursued.')}</p>
          <p>${t('En dehors de mes études, je suis passionnée par la musique house et électronique, et j\'adore collaborer avec des musiciens en réalisant la photographie et les visuels de leurs projets. Sinon, vous me trouverez à la salle de sport, devant un film ou plongée dans un livre (bonus si c\'est un thriller !).', 'Outside of my studies, I\'m passionate about house and electronic music, and I love collaborating with musicians by creating photography and visuals for their projects. Otherwise, you\'ll find me at the gym, watching a film or reading a book (bonus if it\'s a thriller!).')}</p>
          <p>${t('Mes inspirations incluent Yorgos Lanthimos, Wolfgang Tillmans, Sofia Coppola, Jamie Hewlett et Robert Valley.', 'My inspirations include Yorgos Lanthimos, Wolfgang Tillmans, Sofia Coppola, Jamie Hewlett and Robert Valley.')}</p>
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
            <a href="https://www.instagram.com/sofialucasdesign/" target="_blank" rel="noopener" class="contact-soc">INSTAGRAM</a>
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
            const item = `<span class="ribbon-item">${t('Vous cherchez une directrice artistique&nbsp;? Ne cherchez plus&nbsp;! Je suis en recherche d\'une alternance, 1/2 semaines.', 'Looking for an art director&nbsp;? Look no further&nbsp;! I\'m seeking a work-study placement, 1/2 weeks.')}</span>`;
            const base = Array(8).fill(item).join('');
            return base + base;
          })()}
        </div>
      </div>
    </div>
  `,
};

// ── Carousel tiles ──────────────────────────────────────────────────────────
