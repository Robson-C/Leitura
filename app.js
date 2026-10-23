(() => {
  'use strict';
  const chapters = window.READING_CHAPTERS;
  const $ = id => document.getElementById(id);
  const key = 'entrelinhas.reading.v1';
  const defaults = { theme: 'sepia', fontSize: 20, lineHeight: 1.9, width: 720 };
  let stored = {}, storageAvailable = true;
  try { stored = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { storageAvailable = false; }
  // Cada etapa migra apenas os IDs ainda pertencentes ao esquema anterior.
  const numberingSteps = [
    {version:1,min:290,max:311},
    {version:2,min:312,max:331},
    {version:3,min:332,max:356},
    {version:4,min:357,max:359},
    {version:5,min:360,max:370},
    {version:6,min:371,max:417},
    {version:7,min:418,max:462},
    {version:8,min:463,max:492}
  ];
  if (stored.chapter != null) {
    for (const step of numberingSteps) {
      if ((Number(stored.numberingVersion) || 0) >= step.version) continue;
      try { localStorage.setItem(key + '.before-numbering-' + step.version,JSON.stringify(stored)); } catch {}
      const correct = id => step.version===8 && Number(id)>=463 && Number(id)<=469 ? Number(id)-16 : step.version===8 && Number(id)>=471 && Number(id)<=492 ? Number(id)-17 : step.version===8 ? Number(id) : step.version===7 && Number(id)===462 ? 446 : step.version===7 && Number(id)>=418 && Number(id)<=460 ? Number(id)-15 : step.version===7 ? Number(id) : step.version===6 && Number(id)===416 ? 401 : step.version===6 && Number(id)===417 ? 402 : step.version===6 && Number(id)>=371 && Number(id)<=415 ? Number(id)-14 : step.version===5 && Number(id)===369 ? 355 : step.version===5 && Number(id)===370 ? 356 : step.version===5 && Number(id)>=360 && Number(id)<=368 ? Number(id)-13 : step.version===4 && (Number(id)===357 || Number(id)===358) ? 345 : step.version===4 && Number(id)===359 ? 346 : step.version===3 && Number(id)===355 ? 343 : step.version===3 && Number(id)===356 ? 344 : Number(id)>=step.min && Number(id)<=step.max ? Number(id)-11 : Number(id);
      // A união usa proporção de caracteres; o snapshot preserva o estado exato anterior.
      let mergedPosition;
      if (step.version===3) {
        const split = 0.5011705685618729;
        const oldPositions = stored.positions || {};
        const first = split * Math.max(0,Math.min(1,Number(oldPositions[354]) || 0));
        const second = split + (1-split) * Math.max(0,Math.min(1,Number(oldPositions[355]) || 0));
        mergedPosition = Number(stored.chapter)===354 ? first : Number(stored.chapter)===355 ? second : oldPositions[355]!=null ? second : first;
      }
      if (step.version===4) {
        const split = 0.5259412780656304;
        const oldPositions = stored.positions || {};
        const first = split * Math.max(0,Math.min(1,Number(oldPositions[357]) || 0));
        const second = split + (1-split) * Math.max(0,Math.min(1,Number(oldPositions[358]) || 0));
        mergedPosition = Number(stored.chapter)===357 ? first : Number(stored.chapter)===358 ? second : oldPositions[358]!=null ? second : first;
      }
      if (step.version===5) {
        const split = 0.4893842887473461;
        const oldPositions = stored.positions || {};
        const first = split * Math.max(0,Math.min(1,Number(oldPositions[368]) || 0));
        const second = split + (1-split) * Math.max(0,Math.min(1,Number(oldPositions[369]) || 0));
        mergedPosition = Number(stored.chapter)===368 ? first : Number(stored.chapter)===369 ? second : oldPositions[369]!=null ? second : first;
      }
      if (step.version===6) {
        const split = 0.511680550525172;
        const oldPositions = stored.positions || {};
        const first = split * Math.max(0,Math.min(1,Number(oldPositions[415]) || 0));
        const second = split + (1-split) * Math.max(0,Math.min(1,Number(oldPositions[416]) || 0));
        mergedPosition = Number(stored.chapter)===415 ? first : Number(stored.chapter)===416 ? second : oldPositions[416]!=null ? second : first;
      }
      stored = {...stored,numberingVersion:step.version,chapter:correct(stored.chapter),positions:Object.fromEntries(
        Object.entries(stored.positions || {}).map(([id,position]) => [correct(id),position]))};
      if (step.version===3) stored.positions[343] = mergedPosition;
      if (step.version===4) stored.positions[345] = mergedPosition;
      if (step.version===5) stored.positions[355] = mergedPosition;
      if (step.version===6) stored.positions[401] = mergedPosition;
      const oldHash = location.hash.match(/^#capitulo-(\d+)$/);
      if (oldHash && Number(oldHash[1])>=step.min && Number(oldHash[1])<=step.max) location.hash = '#capitulo-' + correct(oldHash[1]);
    }
  }
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
  const chapterGroups = new Map();
  const groupStart = id => Math.floor((id-1)/100)*100+1;
  function setGroupOpen(group, open) {
    group.list.hidden = !open;
    group.button.setAttribute('aria-expanded',String(open));
  }
  function persist() {
    try {
      localStorage.setItem(key, JSON.stringify({ numberingVersion:8, settings, positions, chapter: current.id, sidebarVisible }));
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
  function syncHeaderHeight() {
    const height = $('topbar').getBoundingClientRect().height;
    if (height) document.documentElement.style.setProperty('--header-height',height + 'px');
  }
  function toggleAppearance() {
    const ratio = getProgress();
    const panel = $('appearance-panel');
    panel.hidden = !panel.hidden;
    $('appearance-toggle').setAttribute('aria-expanded',String(!panel.hidden));
    $('appearance-toggle').setAttribute('aria-label',panel.hidden ? 'Mostrar opções de aparência' : 'Esconder opções de aparência');
    syncHeaderHeight();
    rendering = true;
    requestAnimationFrame(() => { restore(ratio); rendering = false; updateProgress(); persist(); });
  }
  function headerOffset() { return ($('topbar').getBoundingClientRect().height || 60) + 12; }
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
    if (open === (isMobile() ? mobileLibraryOpen : sidebarVisible)) return;
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
    note.textContent = typeof chapter.authorNote === 'string' ? chapter.authorNote : 'Pedido do autor: assinatura completa e assinatura automática.';
    if (chapter.authorNote !== false) $('chapter-content').append(note);
    $('chapter-content').append(content(chapter.body));
    $('previous').disabled = index === 0; $('next').disabled = index === chapters.length-1;
    document.querySelectorAll('.chapter-link').forEach(link => {
      if (Number(link.dataset.chapter) === chapter.id) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    for (const [start, group] of chapterGroups) setGroupOpen(group,start === groupStart(chapter.id));
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
    const start = groupStart(chapter.id);
    if (!chapterGroups.has(start)) {
      const section = document.createElement('div'); section.className = 'chapter-group';
      const button = document.createElement('button'); button.className = 'chapter-group-toggle';
      button.type = 'button'; button.textContent = start + '–' + (start+99);
      const list = document.createElement('div'); list.className = 'chapter-group-list';
      list.id = 'chapter-group-' + start;
      button.setAttribute('aria-controls',list.id);
      const group = {button,list};
      setGroupOpen(group,false);
      button.addEventListener('click',() => setGroupOpen(group,list.hidden));
      section.append(button,list);
      $('chapter-list').append(section);
      chapterGroups.set(start,group);
    }
    const link = document.createElement('a'); link.className = 'chapter-link';
    link.href = '#capitulo-' + chapter.id; link.dataset.chapter = chapter.id;
    const number = document.createElement('span'); number.className = 'number'; number.textContent = chapter.id;
    const name = document.createElement('span'); name.className = 'name'; name.textContent = chapter.title;
    link.append(number,name);
    link.addEventListener('click',event => { event.preventDefault(); navigate(chapter.id); });
    chapterGroups.get(start).list.append(link);
  }
  $('previous').addEventListener('click',() => { const index = chapters.indexOf(current); if(index>0) navigate(chapters[index-1].id); });
  $('next').addEventListener('click',() => { const index = chapters.indexOf(current); if(index<chapters.length-1) navigate(chapters[index+1].id); });
  $('brand').addEventListener('click',event => { event.preventDefault(); window.scrollTo(0,0); });
  $('appearance-panel').hidden = true;
  $('appearance-toggle').addEventListener('click',toggleAppearance);
  $('index-toggle').addEventListener('click',() => toggleLibrary(!(isMobile() ? mobileLibraryOpen : sidebarVisible)));
  $('index-close').addEventListener('click',() => { toggleLibrary(false); $('index-toggle').focus(); });
  $('font-decrease').addEventListener('click',() => { settings.fontSize = Math.max(16,settings.fontSize-1); applySettings(); });
  $('font-increase').addEventListener('click',() => { settings.fontSize = Math.min(30,settings.fontSize+1); applySettings(); });
  $('theme').addEventListener('change',() => {
    const value = $('theme').value;
    if (value === settings.theme) return;
    settings.theme = value; applySettings();
  });
  for (const [id,property] of [['line-height','lineHeight'],['text-width','width']]) {
    $(id).addEventListener('change',() => {
      const value = Number($(id).value);
      if (value === settings[property]) return;
      settings[property] = value; applySettings();
    });
  }
  $('reset-settings').addEventListener('click',() => { Object.assign(settings,defaults); applySettings(); });
  document.addEventListener('keydown',event => {
    // Esc dos seletores nativos não deve fechar a lateral nem reposicionar o texto.
    if (event.key === 'Escape' && isMobile() && mobileLibraryOpen) {
      toggleLibrary(false);
      $('index-toggle').focus({preventScroll:true});
    }
  });
  document.addEventListener('click',event => {
    if (isMobile() && mobileLibraryOpen && !event.target.closest('#library, #index-toggle')) toggleLibrary(false);
  });
  window.addEventListener('resize',() => { syncHeaderHeight(); syncLibrary(); updateProgress(); });
  window.addEventListener('hashchange',() => { updateProgress(); persist(); render(hashChapter(),true); });
  window.addEventListener('scroll',() => { if(rendering) return; updateProgress(); clearTimeout(saveTimer); saveTimer = setTimeout(persist,180); },{passive:true});
  window.addEventListener('pagehide',() => { if(!rendering) updateProgress(); persist(); });
  syncHeaderHeight();
  applySettings(false);
  render(hashChapter() || stored.chapter || chapters[0].id);
})();
