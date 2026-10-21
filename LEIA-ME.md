# Entrelinhas — leitor offline

Abra `index.html` com dois cliques e escolha seu navegador. Mantenha `index.html`, `styles.css`, `app.js` e `chapters.js` na mesma pasta. Não é necessário instalar programas, iniciar servidor ou acessar a internet.

Inclui os capítulos 290 a 296 traduzidos nesta conversa. “Uma jornada através do tempo” e “Os caminhos de Lu Li” são rótulos editoriais do leitor; não representam o título oficial da obra. As passagens de interpretação incerta continuam em itálico.

## Leitura

- Escolha o capítulo no índice. O botão **Índice**, no cabeçalho, mostra ou esconde a barra de capítulos também no computador. Sua escolha no computador fica salva; ao esconder a barra, o texto ocupa o espaço disponível respeitando a largura escolhida. No celular, o índice abre sobre a página e fecha ao selecionar um capítulo.
- Use **Anterior** e **Próximo capítulo** ao final do texto.
- No cabeçalho fixo, use **A− / A+** para ajustar a fonte. Os seletores **Tema**, **Espaço** e **Largura** ficam ao lado. **↺** restaura a aparência padrão.
- O cabeçalho mostra o capítulo atual e a porcentagem lida; a barra fina logo abaixo acompanha o progresso. Em telas estreitas, os controles se distribuem em linhas.
- O capítulo, a posição e as preferências são guardados automaticamente no armazenamento local do navegador. Use o mesmo navegador e o mesmo caminho do arquivo ao retornar.
- A mensagem no rodapé informa se o salvamento está disponível. Limpar os dados do navegador, mudar de navegador/perfil, mover a pasta ou certas restrições a arquivos locais pode impedir a retomada. A leitura funciona mesmo quando o salvamento é bloqueado.

Não há requisições de rede, fontes remotas, conta, sincronização ou tradução automática. O layout é responsivo, mas a visualização real no navegador ainda precisa da conferência descrita em `REVISAO-OPERACIONAL.md`.

## Manutenção

O conteúdo está em `chapters.js`: cada capítulo tem `id`, `title` e `body`. Asteriscos simples marcam itálico, asteriscos duplos marcam negrito, uma linha `***` separa cenas e linhas iniciadas por `> ` formam citações. Depois de acrescentar capítulos, atualize a contagem exibida em `index.html`.

Validação sem dependências: `node tests/reader.test.cjs`. O teste simula o DOM; não é um teste visual nem comprova compatibilidade real de navegadores.

Para reverter esta primeira versão, remova somente os arquivos criados por ela: `index.html`, `styles.css`, `app.js`, `chapters.js`, `LEIA-ME.md`, `REVISAO-OPERACIONAL.md` e `tests/reader.test.cjs`. Preserve `.git` e quaisquer arquivos futuros. Nenhum arquivo anterior foi sobrescrito.

## Reversão do ajuste de cabeçalho

O estado anterior está em `backups/cabecalho-20261021-101025/`. Para reverter apenas esse ajuste, restaure index.html, styles.css, app.js, LEIA-ME.md e REVISAO-OPERACIONAL.md na raiz, e reader.test.cjs em tests/. Os capítulos não foram alterados.

## Reversão do índice recolhível

Backup anterior em `backups/indice-20261021-102904/`. Restaure app.js, styles.css, LEIA-ME.md e REVISAO-OPERACIONAL.md na raiz, e reader.test.cjs em tests/. Para restaurar também o estado da preferência, pode remover somente o campo sidebarVisible da chave entrelinhas.reading.v1; não é necessário apagar o progresso.


## GitHub Pages (preparação local)

O destino autorizado é Robson-C/leitura, público. O origin local aponta para esse endereço, mas a criação e a publicação ainda dependem de autenticação e validação final. O workflow .github/workflows/pages.yml publica somente os quatro arquivos do leitor após os testes passarem, a partir de master, quando Pages estiver habilitado com GitHub Actions. Backups ficam fora do Git. Não há publicação confirmada neste estado.

O uso offline continua pela abertura de index.html na pasta local. A página hospedada precisa de rede para carregar; não há cache offline do endereço publicado. O progresso do endereço hospedado é separado do progresso do arquivo local.
