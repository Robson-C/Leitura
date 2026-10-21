(() => {
  'use strict';
  const chapters = window.READING_CHAPTERS;
  const $ = id => document.getElementById(id);
  const key = 'entrelinhas.reading.v1';
  const defaults = { theme: 'sepia', fontSize: 20, lineHeight: 1.9, width: 720 };
  let stored = {}, storageAvailable = true;
  try { stored = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { storageAvailable = false; }
  const bounded = (value, min, max, fallback) => Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max ? Number(value) : fallback;
  const settings = {
    theme: ['light','sepia','dark'].includes(stored.settings?.theme) ? stored.settings.theme : defaults.theme,
    fontSize: bounded(stored.settings?.fontSize,16,30,20),
    lineHeight: bounded(stored.settings?.lineHeight,1.4,2.4,1.9),
    width: [600,720,880].includes(stored.settings?.width) ? stored.settings.width : 720
  };
  let sidebarVisible = typeof stored.sidebarVisible === 'boolean' ? stored.sidebarVisible : true;
  let mobileLibraryOpen = false;
  const isMobile = () => window.innerWidth <= 760;
  const positions = {};
  for (const chapter of chapters) positions[chapter.id] = bounded(stored.positions?.[chapter.id],0,1,0);
  let current = chapters[0], rendering = false, saveTimer;
  function persist() {
    try {
      localStorage.setItem(key, JSON.stringify({ settings, positions, chapter: current.id, sidebarVisible }));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    $('save-status').textContent = storageAvailable ? 'Progresso salvo neste navegador' : 'Salvamento indisponível neste navegador';
  }
  function inline(text) {
    const fragment = document.createDocumentFragment();
    const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
    let offset = 0;
    for (const match of text.matchAll(pattern)) {
      fragment.append(document.createTextNode(text.slice(offset,match.index)));
      const element = document.createElement(match[2] ? 'strong' : 'em');
      element.textContent = match[2] || match[3];
      fragment.append(element); offset = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(text.slice(offset)));
    return fragment;
  }
  function content(body) {
    const fragment = document.createDocumentFragment();
    for (const block of body.trim().split(/\n\s*\n/)) {
      if (block.trim() === '***') { fragment.append(document.createElement('hr')); continue; }
      const quote = block.startsWith('> ');
      const node = document.createElement(quote ? 'blockquote' : 'p');
      const lines = block.split('\n');
      lines.forEach((line,i) => {
        if (i) node.append(document.createElement('br'));
        node.append(inline(quote ? line.replace(/^> ?/,'') : line));
      });
      if (block.startsWith('**Nome:**')) node.classList.add('stats');
      fragment.append(node);
    }
    return fragment;
  }
  function applySettings(keepPlace = true) {
    const ratio = getProgress();
    document.body.dataset.theme = settings.theme;
    const style = document.documentElement.style;
    style.setProperty('--font-size', settings.fontSize + 'px');
    style.setProperty('--line-height', settings.lineHeight);
    style.setProperty('--text-width', settings.width + 'px');
    $('font-value').textContent = settings.fontSize;
    $('font-decrease').disabled = settings.fontSize <= 16;
    $('font-increase').disabled = settings.fontSize >= 30;
    $('theme').value = settings.theme;
    $('line-height').value = settings.lineHeight;
    $('text-width').value = settings.width;
    if (keepPlace) { rendering = true; requestAnimationFrame(() => { restore(ratio); rendering = false; updateProgress(); persist(); }); }
  }
  function headerOffset() { return ($('topbar').getBoundingClientRect().height || 76) + 12; }
  function getProgress() {
    const article = $('reader');
    const start = article.getBoundingClientRect().top + window.scrollY - headerOffset();
    const end = article.getBoundingClientRect().bottom + window.scrollY - window.innerHeight + 24;
    return Math.max(0,Math.min(1,(window.scrollY - start) / Math.max(1,end-start)));
  }
  function restore(ratio) {
    if (ratio <= 0) { window.scrollTo(0,0); return; }
    const article = $('reader'), rect = article.getBoundingClientRect();
    const start = rect.top + window.scrollY - headerOffset();
    const end = rect.bottom + window.scrollY - window.innerHeight + 24;
    window.scrollTo(0,Math.max(0,start + ratio*Math.max(1,end-start)));
  }
  function updateProgress() {
    const ratio = getProgress();
    $('progress-value').textContent = Math.round(ratio*100) + '%';
    $('reading-progress').setAttribute('aria-valuenow', String(Math.round(ratio*100)));
    $('progress-fill').style.width = ratio*100 + '%';
    if (!rendering) positions[current.id] = ratio;
  }
  function syncLibrary() {
    document.body.classList.toggle('sidebar-hidden', !sidebarVisible);
    $('library').classList.toggle('open', mobileLibraryOpen);
    const visible = isMobile() ? mobileLibraryOpen : sidebarVisible;
    $('index-toggle').setAttribute('aria-expanded',String(visible));
    $('index-toggle').setAttribute('aria-label',visible ? 'Esconder índice de capítulos' : 'Mostrar índice de capítulos');
  }
  function toggleLibrary(open) {
    const ratio = getProgress();
    if (isMobile()) mobileLibraryOpen = open;
    else sidebarVisible = open;
    syncLibrary();
    rendering = true;
    requestAnimationFrame(() => { restore(ratio); rendering = false; updateProgress(); persist(); });
  }
  function render(id, focus = false) {
    const chapter = chapters.find(c => c.id === id) || chapters[0];
    rendering = true; current = chapter;
    const index = chapters.indexOf(chapter);
    $('chapter-number').textContent = 'CAPÍTULO ' + chapter.id;
    $('chapter-title').textContent = chapter.title;
    $('header-title').textContent = chapter.id + ' · ' + chapter.title;
    document.title = 'Capítulo ' + chapter.id + ' · ' + chapter.title + ' | Entrelinhas';
    $('chapter-position').textContent = 'CAPÍTULO ' + (index+1) + ' DE ' + chapters.length;
    $('reading-time').textContent = Math.max(1,Math.ceil(chapter.body.trim().split(/\s+/).length/200)) + ' min de leitura';
    $('chapter-content').replaceChildren();
    const note = document.createElement('p'); note.className = 'author-note';
    note.textContent = 'Pedido do autor: assinatura completa e assinatura automática.';
    $('chapter-content').append(note,content(chapter.body));
    $('previous').disabled = index === 0; $('next').disabled = index === chapters.length-1;
    document.querySelectorAll('.chapter-link').forEach(link => {
      if (Number(link.dataset.chapter) === chapter.id) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    mobileLibraryOpen = false;
    syncLibrary();
    requestAnimationFrame(() => {
      if (focus) $('reader').focus({preventScroll:true});
      restore(positions[chapter.id]); rendering = false; updateProgress(); persist();
    });
  }
  function navigate(id) {
    updateProgress(); persist();
    if (location.hash === '#capitulo-' + id) render(id,true);
    else location.hash = 'capitulo-' + id;
  }
  function hashChapter() { const match = location.hash.match(/^#capitulo-(\d+)$/); return match ? Number(match[1]) : null; }
  for (const chapter of chapters) {
    const link = document.createElement('a'); link.className = 'chapter-link';
    link.href = '#capitulo-' + chapter.id; link.dataset.chapter = chapter.id;
    const number = document.createElement('span'); number.className = 'number'; number.textContent = chapter.id;
    const name = document.createElement('span'); name.className = 'name'; name.textContent = chapter.title;
    link.append(number,name);
    link.addEventListener('click',event => { event.preventDefault(); navigate(chapter.id); });
    $('chapter-list').append(link);
  }
  $('previous').addEventListener('click',() => { const index = chapters.indexOf(current); if(index>0) navigate(chapters[index-1].id); });
  $('next').addEventListener('click',() => { const index = chapters.indexOf(current); if(index<chapters.length-1) navigate(chapters[index+1].id); });
  $('brand').addEventListener('click',event => { event.preventDefault(); window.scrollTo(0,0); });
  $('index-toggle').addEventListener('click',() => toggleLibrary(!(isMobile() ? mobileLibraryOpen : sidebarVisible)));
  $('index-close').addEventListener('click',() => { toggleLibrary(false); $('index-toggle').focus(); });
  $('font-decrease').addEventListener('click',() => { settings.fontSize = Math.max(16,settings.fontSize-1); applySettings(); });
  $('font-increase').addEventListener('click',() => { settings.fontSize = Math.min(30,settings.fontSize+1); applySettings(); });
  $('theme').addEventListener('change',() => { settings.theme = $('theme').value; applySettings(); });
  for (const [id,property] of [['line-height','lineHeight'],['text-width','width']]) {
    $(id).addEventListener('change',() => { settings[property] = Number($(id).value); applySettings(); });
  }
  $('reset-settings').addEventListener('click',() => { Object.assign(settings,defaults); applySettings(); });
  document.addEventListener('keydown',event => { if (event.key === 'Escape') toggleLibrary(false); });
  document.addEventListener('click',event => {
    if (isMobile() && mobileLibraryOpen && !event.target.closest('#library, #index-toggle')) toggleLibrary(false);
  });
  window.addEventListener('resize',() => { syncLibrary(); updateProgress(); });
  window.addEventListener('hashchange',() => { updateProgress(); persist(); render(hashChapter(),true); });
  window.addEventListener('scroll',() => { if(rendering) return; updateProgress(); clearTimeout(saveTimer); saveTimer = setTimeout(persist,180); },{passive:true});
  window.addEventListener('pagehide',() => { if(!rendering) updateProgress(); persist(); });
  applySettings(false);
  render(hashChapter() || stored.chapter || chapters[0].id);
})();
