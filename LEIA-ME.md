# Entrelinhas — leitor offline

Abra `index.html` com dois cliques e escolha seu navegador. Mantenha `index.html`, `styles.css`, `app.js` e `chapters.js` na mesma pasta. Não é necessário instalar programas, iniciar servidor ou acessar a internet.

Inclui os capítulos 290 a 360 traduzidos nesta conversa. “Uma jornada através do tempo” e “Os caminhos de Lu Li” são rótulos editoriais do leitor; não representam o título oficial da obra. As passagens de interpretação incerta continuam em itálico.

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


## Traduções e arquivos TXT

Regra permanente em AGENTS.md: cada capítulo recebido é traduzido e gera automaticamente pelo menos um TXT em UTF-8 na pasta capitulos/. Interpretações incertas ficam entre asteriscos no TXT e em itálico no leitor. Inclusão no leitor e publicação online seguem suas autorizações próprias.

Os TXT 297, 298 e 299 foram incluídos no leitor offline nesta entrega. Atualize index.html e escolha o capítulo no índice. A atualização offline não corresponde a publicação no GitHub.

Backup desta inclusão: backups/capitulos-297-299-20261021-131943/. Para reverter o conteúdo do leitor, restaure chapters.js e index.html da cópia e reader.test.cjs em tests/. Os TXT podem ser conservados independentemente da reversão. A regra em AGENTS.md é uma preferência permanente do usuário.


## Pasta oficial e entrega

Use C:/Users/robson.colaco/Documents/Kanban/Leitura. Commit, push e publicação são feitos manualmente pelo usuário. A cópia antiga em Documents/ChatGPT/Leitura não deve ser usada para novas edições. Consulte a última seção da revisão operacional para backup e reversão da migração.


## Ajuste dos seletores de aparência

Removido o scroll-padding global que podia deslocar o foco no cabeçalho sticky. Cancelar um seletor com Esc não recolhe a barra no computador; o Esc continua fechando o índice sobreposto no celular. Repetir o mesmo valor não recalcula a posição. Validação real do salto no navegador ainda pendente. Backup em backups/foco-seletores-20261021-133008/; consulte a revisão operacional para reversão e roteiro de conferência.


## Inclusão offline dos capítulos 300–304

O leitor agora contém quinze capítulos, de 290 a 304. Conteúdo integral e marcações de incerteza importados dos TXT correspondentes, sem alterar os capítulos anteriores ou controles. Atualize index.html para vê-los no índice.

Backup anterior: backups/offline-300-304-20261021-140610/. Para reverter somente esta inclusão, restaure chapters.js, index.html, LEIA-ME.md e REVISAO-OPERACIONAL.md da cópia, e reader.test.cjs em tests/. Os TXT originais permanecem disponíveis. Commit, push e implantação online continuam manuais pelo usuário.


## Fluxo “publique” e versão atual

O comando “publique” autoriza preparar integralmente a versão offline com os TXT traduzidos pendentes, índice, testes, documentação e backup, sem pedir a mesma confirmação novamente. Não executa commit/push nem implantação online.

Versão atual: 71 capítulos, de 290 a 360. Atualize index.html para acessar os novos capítulos 351–360. Seus textos e itálicos correspondem aos TXT originais.

Backup desta preparação: backups/offline-305-310-20261021-161031/. Reversão seletiva: restaurar chapters.js, index.html, LEIA-ME.md e REVISAO-OPERACIONAL.md da cópia e reader.test.cjs em tests/. Os TXT e a nova autorização permanente em AGENTS.md podem ser mantidos independentemente da reversão do conteúdo. Commit e push manuais pelo usuário.


## Versão offline 290–320

Incluídos os dez capítulos 311–320, integralmente a partir dos TXT, com itálicos. O capítulo 320 não tem nota de assinatura porque ela está ausente no original. Índice com 31 capítulos. Backup desta rodada: backups/offline-311-320-20261021-164949. Para reverter a integração, restaure chapters.js, index.html, app.js e documentação dessa cópia; reader.test.cjs deve voltar para tests/. Preserve os TXT. Commit e push continuam manuais.


## Versão offline 290–330

Incluídos os dez capítulos 321–330 integralmente a partir dos TXT, preservando os itálicos. Índice com 41 capítulos. Aplicação, controles, preferências e capítulos anteriores preservados. Backup desta rodada: backups/offline-321-330-20261021-171947/. Para reverter somente esta integração, restaure chapters.js, index.html e LEIA-ME.md da cópia, e reader.test.cjs em tests/; preserve os TXT e registre a reversão na revisão operacional. O backup também guarda a revisão anterior para consulta. Commit e push continuam manuais pelo usuário.


## Versão offline 290–333

Incluídos integralmente os TXT 331–333, preservando títulos, itálicos e separadores de cena. Índice com 44 capítulos. Backup: backups/offline-331-333-20261021205838/. Para reverter apenas esta integração, restaure chapters.js, index.html, LEIA-ME.md e tests/reader.test.cjs a partir dessa cópia, preservando os TXT, e registre a reversão em REVISAO-OPERACIONAL.md. Commit e push continuam manuais. Conferência visual real permanece pendente.


## Cabeçalho compacto e painel de aparência — 21/10/2026

O topo agora tem uma linha: botão de três barras à esquerda, número e título do capítulo centralizados e engrenagem à direita. O índice mantém o comportamento anterior. A engrenagem abre e fecha a faixa de aparência abaixo do título e antes do conteúdo, com fonte, tema, espaçamento, largura, restaurar padrão e porcentagem. O painel começa recolhido a cada abertura; as preferências de leitura continuam salvas. A barra fina de progresso permanece na base do cabeçalho.

Backup: backups/cabecalho-compacto-20261022T001206/. Reversão seletiva: restaurar index.html, styles.css, app.js e tests/reader.test.cjs; consultar a documentação anterior no backup e registrar eventual reversão. Capítulos e TXT não foram alterados. Testes automatizados aprovados; conferência visual no navegador local pendente porque a política do navegador da ferramenta bloqueia file://. Abra index.html no seu navegador para conferir o resultado.


## Versão offline 290–340

Incluídos integralmente os sete TXT 334–340, preservando títulos, itálicos e separadores de cena. Índice com 51 capítulos. Cabeçalho compacto com engrenagem preservado. Backup: backups/offline-334-340-20261021211404/. Reversão seletiva: restaurar chapters.js, index.html, LEIA-ME.md e tests/reader.test.cjs dessa cópia, preservando os TXT, e registrar a reversão em REVISAO-OPERACIONAL.md. Commit e push manuais. Revisão visual real pendente.


## Versão offline 290–350

Incluídos integralmente os dez TXT 341–350, preservando títulos, itálicos e separadores de cena. Índice com 61 capítulos. Cabeçalho compacto com engrenagem preservado. Backup: backups/offline-341-350-20261021213439/. Reversão seletiva: restaurar chapters.js, index.html, LEIA-ME.md e tests/reader.test.cjs dessa cópia, preservando os TXT, e registrar a reversão em REVISAO-OPERACIONAL.md. Commit e push manuais. Revisão visual real pendente.


## Versão offline 290–360

Incluídos integralmente os dez TXT 351–360, preservando títulos, itálicos e separadores de cena. Índice com 71 capítulos. Cabeçalho compacto com engrenagem preservado. Backup: backups/offline-351-360-20261021215113/. Reversão seletiva: restaurar chapters.js, index.html, LEIA-ME.md e tests/reader.test.cjs dessa cópia, preservando os TXT, e registrar a reversão em REVISAO-OPERACIONAL.md. Commit e push manuais. Revisão visual real pendente.
