(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const books = window.READING_BOOKS;
  const selected = new URLSearchParams(location.search).get('obra');
  // Links antigos #capitulo-N continuam abrindo a obra original, no mesmo index.html.
  const legacy = !selected && /^#capitulo-\d+$/.test(location.hash);
  const book = books.find(item => item.id === selected) || (legacy ? books[0] : null);
  window.READING_BOOK = book;
  window.READING_CATALOG_ACTIVE = true;
  let preference = {};
  try { preference = JSON.parse(localStorage.getItem('entrelinhas.reading.v1') || '{}') || {}; } catch {}
  const theme = preference.settings?.theme;
  if (['light','sepia','dark'].includes(theme)) document.body.dataset.theme = theme;
  $('reader-shell').hidden = !book || !book.chapters.length;
  $('catalog').hidden = Boolean(book);
  $('empty-book').hidden = !book || Boolean(book.chapters.length);
  if (book) {
    document.title = book.title + ' | Leitura';
    $('book-title').textContent = book.title;
    $('book-description').textContent = book.description;
    $('book-subtitle').textContent = book.subtitle;
    $('book-count').textContent = book.chapters.length + ' capítulos disponíveis';
    if (!book.chapters.length) {
      $('empty-title').textContent = book.title;
      $('empty-description').textContent = 'Aguardando os primeiros capítulos traduzidos.';
    }
    return;
  }
  document.title = 'Leitura · Catálogo de histórias';
  for (const item of books) {
    const card = document.createElement('a');
    card.className = 'book-card';
    card.href = '?obra=' + item.id;
    const symbol = document.createElement('span'); symbol.className = 'book-symbol';
    symbol.setAttribute('aria-hidden','true'); symbol.textContent = item.symbol;
    const title = document.createElement('h2'); title.textContent = item.title;
    const description = document.createElement('p'); description.textContent = item.description;
    const count = document.createElement('p'); count.className = 'book-availability';
    count.textContent = item.chapters.length ? item.chapters.length + ' capítulos disponíveis' : 'Aguardando capítulos';
    const action = document.createElement('span'); action.className = 'book-action';
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(item.storageKey) || '{}') || {}; } catch {}
    const chapter = item.chapters.find(c => c.id === Number(saved.chapter));
    action.textContent = !item.chapters.length ? 'Ver obra →' : chapter ? 'Continuar no capítulo ' + chapter.id + ' →' : 'Começar a leitura →';
    // O leitor restaura e, se necessário, migra o progresso ao abrir a obra.
    card.append(symbol,title,description,count,action);
    $('book-cards').append(card);
  }
})();
