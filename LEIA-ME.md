# Entrelinhas — leitor offline

Abra `index.html` com dois cliques e escolha seu navegador. Mantenha `index.html`, `styles.css`, `app.js` e `chapters.js` na mesma pasta. Não é necessário instalar programas, iniciar servidor ou acessar a internet.

Inclui 257 capítulos consecutivos, de 279 a 535. As fontes 497 e 498 foram reunidas integralmente no capítulo 480 por confirmação do usuário; consulte NUMERACAO-CAPITULOS.json para a correspondência com a fonte. “Uma jornada através do tempo” e “Os caminhos de Lu Li” são rótulos editoriais do leitor. As interpretações incertas continuam em itálico.

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

Versão atual: 192 capítulos, 279–320 e atuais 332–483, sem 461 e 470. Atualize index.html para acessar os 26 capítulos novos. Textos, notas autorais e itálicos correspondem aos TXT originais.

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


## Versão offline 290–371

Incluídos integralmente os onze TXT 361–371, preservando títulos, itálicos, separadores de cena e notas finais do autor. Índice com 82 capítulos consecutivos. Os capítulos 331–360 foram trazidos pelo usuário do Git e já estavam integrados; nenhum salto de numeração foi necessário. Cabeçalho compacto com engrenagem, controles, progresso e preferências preservados. Nesta máquina, a preparação foi realizada em C:/Users/robson.colaco/Documents/Kanban/Leitura; o caminho Curso/Leitura registrado em AGENTS.md refere-se ao outro computador.

Backup: backups/offline-361-371-20261022-080602/. Reversão seletiva: restaurar chapters.js, index.html e LEIA-ME.md dessa cópia, e reader.test.cjs em tests/; manter os TXT e registrar a reversão em REVISAO-OPERACIONAL.md. O backup também guarda a revisão anterior para consulta. Commit e push continuam manuais. Conferência visual real no navegador permanece pendente.


## Versão offline 290–383

Incluídos integralmente os doze TXT 372–383, preservando títulos, itálicos, separadores e notas autorais. Índice com 94 capítulos consecutivos. Cabeçalho, engrenagem, controles, progresso e preferências preservados. Backup: backups/offline-372-383-20261022-092852/. Reversão seletiva: restaurar chapters.js, index.html e LEIA-ME.md dessa cópia e reader.test.cjs em tests/; manter TXT e registrar a reversão na revisão operacional. O backup guarda também a revisão anterior para consulta. Commit e push manuais; conferência visual real no navegador pendente.


## Versão offline 290–400

Incluídos integralmente os dezessete TXT 384–400, com títulos, itálicos, separadores e notas finais preservados. Índice com 111 capítulos consecutivos. Capítulos 385, 386 e 388 exibem a saudação original de Ano-Novo no lugar do pedido de assinatura. Cabeçalho, controles, progresso e preferências preservados. Backup: backups/offline-384-400-20261022-162521/. Para reverter esta integração, restaurar chapters.js, index.html, app.js e LEIA-ME.md da cópia e reader.test.cjs em tests/; manter TXT e registrar a reversão na revisão operacional. Backup também contém revisão anterior para consulta. Commit e push manuais; conferência visual real pendente.


## Versão offline 290–410

Incluídos integralmente os dez TXT 401–410, preservando títulos, marcações de incerteza e separadores. Índice com 121 capítulos consecutivos. Aplicação, cabeçalho, controles, progresso e preferências preservados. Backup: backups/offline-401-410-20261022-173430/. Reversão seletiva: restaurar chapters.js, index.html e LEIA-ME.md da cópia e reader.test.cjs em tests/; preservar os TXT e registrar a reversão na revisão operacional. O backup também contém a revisão anterior para consulta. Commit e push manuais; conferência visual real no navegador não realizada nesta rodada.


## Versão offline 290–425

Incluídos integralmente os quinze TXT 411–425, preservando títulos, notas autorais, itálicos e separadores de cena. Índice com 136 capítulos. Aplicação, cabeçalho, controles, progresso e preferências preservados. Backup: backups/offline-411-425-20261022211923/, com manifesto. Reversão seletiva: restaurar chapters.js, index.html, LEIA-ME.md e tests/reader.test.cjs dessa cópia, preservar os TXT e registrar a reversão em REVISAO-OPERACIONAL.md. Commit e push manuais. Conferência visual real pendente.


## Versão offline 290–430

Incluídos integralmente os cinco TXT 426–430, preservando títulos, notas autorais, itálicos e separadores de cena. Índice com 141 capítulos. Aplicação, cabeçalho, controles, progresso e preferências preservados. Backup: backups/offline-426-430-20261022213104/, com manifesto. Reversão seletiva: restaurar chapters.js, index.html, LEIA-ME.md e tests/reader.test.cjs dessa cópia, preservar os TXT e registrar a reversão em REVISAO-OPERACIONAL.md. Commit e push manuais. Conferência visual real pendente.


## Versão offline 290–440

Incluídos integralmente os dez TXT 431–440, preservando títulos, notas autorais, itálicos e separadores de cena. Índice com 151 capítulos consecutivos. Aplicação, cabeçalho, controles, progresso e preferências preservados. Backup: backups/offline-431-440-20261022221637/, com manifesto SHA-256. Reversão seletiva: restaurar chapters.js, index.html, LEIA-ME.md e tests/reader.test.cjs dessa cópia, preservar os TXT e registrar a reversão em REVISAO-OPERACIONAL.md. A revisão anterior também está no backup para consulta. Commit e push manuais. Conferência visual real pendente.


## Versão offline 290–445 e auditoria 431–445

Conferidos os quinze capítulos 431–445 contra os originais enviados: narrativa e encerramentos presentes, sem lacunas na sequência. UTF-8 e marcações verificados; ambiguidades do original preservadas. Incluídos os cinco pendentes 441–445, com textos e notas integrais. Índice com 156 capítulos consecutivos. Backup: backups/offline-441-445-auditoria-431-445-20261023031658/, contendo os cinco arquivos de preparação, os quinze TXT auditados, relatório de auditoria com hashes dos originais e manifesto SHA-256. Reversão seletiva: restaurar chapters.js, index.html, LEIA-ME.md e tests/reader.test.cjs da cópia, preservar os TXT e registrar a reversão em REVISAO-OPERACIONAL.md. Aplicação, controles, progresso e preferências preservados. Commit e push manuais; conferência visual real pendente.


## Versão offline 290–455

Incluídos os dez TXT 446–455 integralmente, com títulos, incertezas e separadores preservados. Índice com 166 capítulos consecutivos. Capítulo 450 sem nota de assinatura, conforme original. Backup: backups/offline-446-455-20261023-081610/. Reversão seletiva: restaurar chapters.js, index.html, LEIA-ME.md e tests/reader.test.cjs da cópia; manter os TXT e registrar reversão. AGENTS.md anterior incluído para consulta. Controles, progresso e preferências preservados. Commit e push manuais; conferência visual real não realizada nesta rodada.


## Versão offline 290–483 — saltos autorizados

Incluídos integralmente 26 TXT: 456–460, 462–469 e 471–483. Usuário confirmou que 461 e 470 não existem e autorizou pular sem renumerar. Navegação segue os capítulos disponíveis; títulos, textos, notas e incertezas preservados. Capítulos 468, 479 e 481 sem nota de assinatura, conforme TXT; 463 traz apenas assinatura completa. Backup: backups/offline-456-483-20261023-162458/. Reversão seletiva: restaurar chapters.js, index.html, LEIA-ME.md e tests/reader.test.cjs da cópia, manter TXT e registrar reversão. AGENTS.md anterior guardado para consulta. Controles, progresso e preferências preservados. Commit e push manuais; conferência visual real não realizada nesta rodada.


## Índice por centenas — 23/10/2026

O índice reúne capítulos em grupos recolhíveis 201–300, 301–400, 401–500 e assim por diante, conforme houver conteúdo. Mesmo começando no capítulo 290, o primeiro rótulo permanece 201–300 para acomodar inclusões futuras. Ao abrir ou mudar de capítulo, somente sua centena fica expandida. Os botões permitem abrir e fechar outros grupos manualmente sem alterar a leitura. Números, títulos, progresso e preferências são preservados.

Backup: backups/indice-centenas-20261023-165054/. Para reverter somente este ajuste, restaurar app.js, styles.css e tests/reader.test.cjs da cópia; registrar a reversão na revisão operacional. A cópia anterior de LEIA-ME.md e REVISAO-OPERACIONAL.md está disponível para consulta. Commit e push continuam manuais.


## Numeração parcial confirmada — 23/10/2026

Confirmados e renumerados somente os antigos 290–311 para 279–300. Nomes/cabeçalhos dos quinze TXT existentes nesse intervalo ajustados; capítulos iniciais sem TXT próprio permanecem completos em chapters.js. Títulos e corpos preservados. Correspondência em NUMERACAO-CAPITULOS.json. Os atuais 312 em diante aguardam conferência: o salto temporário 300→312 não representa conteúdo removido.

O leitor migra uma única vez o capítulo e as posições salvos do esquema anterior, mantendo preferências; guarda a cópia local em entrelinhas.reading.v1.before-numbering-1. Links antigos do intervalo são convertidos ao carregar um navegador com estado antigo; em instalação nova ou estado já migrado, o link usa a numeração corrigida. Um link antigo isolado não permite distinguir, por exemplo, o antigo 290 do novo 290.

Backup: backups/renumeracao-279-300-20261023-171533/. Reversão exige restaurar chapters.js/app.js/testes e os nomes/cabeçalhos TXT segundo manifest.json da cópia, além de registrar reversão. Para progresso já migrado no navegador, a cópia before-numbering-1 preserva estado anterior; restaurá-la apenas junto da versão antiga do leitor. Commit e push manuais; revisão visual real não realizada.


## Segunda etapa de renumeração — 23/10/2026

Confirmado antigo 331 Sou apenas um júnior… como 320; renumerados antigos 312–331 para 301–320. Agora a faixa confirmada é 279–320, seguida dos atuais 332 em diante, ainda em conferência. Nenhum texto removido. Vinte TXT renomeados e cabeçalhos ajustados, com títulos/corpos preservados. Tabela NUMERACAO-CAPITULOS.json atualizada. Migração versão 2 atende navegadores originais ou já migrados na etapa 1, sem deslocar novamente IDs corrigidos. Snapshot local before-numbering-2 preserva estado anterior à segunda etapa.

Backup: backups/renumeracao-301-320-20261023-172212/. Para reverter apenas a segunda etapa, restaurar aplicação/conteúdo/testes/tabela e nomes/cabeçalhos TXT conforme manifesto; manter pendentes fora do intervalo e registrar reversão. Se o navegador já migrou, restaurar snapshot before-numbering-2 junto ao leitor da etapa 1. Commit e push manuais; conferência visual real não realizada.


## Terceira etapa: capítulos 321–344

Aplicados antigos 332–356: 332–354→321–343, 355 unido integralmente ao 343 e 356→344. Leitor com 191 capítulos; faixa corrigida 279–344, seguida temporariamente de 357 em diante. Conferência alcançou marco 357→345, cuja divisão com 358 segue pendente. Migração versão 3 guarda snapshot before-numbering-3 e estima proporcionalmente a posição nas partes unidas, preservando preferências.

Backup: backups/renumeracao-321-344-20261023T203143/. Reverter fontes e TXT pelo manifest.json, preservando pendentes fora do intervalo; para navegador migrado, restaurar snapshot before-numbering-3 junto à versão anterior. Testes automatizados aprovados; revisão visual real não realizada. Commit e push manuais.


## Quarta etapa: capítulos 345–346

Antigos 357/358 unidos integralmente no 345 — Eu sou Li Er; antigo 359 renumerado 346 — A abertura do palácio subterrâneo. Faixa corrigida 279–346, 190 capítulos offline. Segue temporariamente antigo 360 em diante, ainda em conferência. Migração versão 4 mantém preferências e estima posição por caracteres na união, guardando snapshot before-numbering-4.

Backup: backups/renumeracao-345-346-20261023T203520/. Reverter fontes e nomes/TXT conforme manifest.json e, para navegador migrado, restaurar snapshot before-numbering-4 junto ao leitor anterior. Testes automatizados aprovados; revisão visual real não realizada. Commit e push manuais.


## Quinta etapa: capítulos 347–356

Antigos 360–367→347–354; antigos 368/369 unidos integralmente no 355; antigo 370→356. Faixa corrigida 279–356, 189 capítulos offline. Antigos 371 em diante aguardam conferência. Migração versão 5 guarda snapshot before-numbering-5 e estima posição proporcional na união, preservando preferências.

Backup: backups/renumeracao-347-356-20261023T203805/. Reverter fontes e TXT pelo manifest.json; progresso já migrado requer snapshot before-numbering-5 junto ao leitor anterior. Testes automatizados aprovados, revisão visual real não realizada. Commit e push manuais.


## Sexta etapa: capítulos 357–402

Antigos 371–414→357–400; antigos 415/416 unidos integralmente no 401; antigo 417→402. Faixa corrigida 279–402, 188 capítulos offline. Antigos 418 em diante aguardam conferência. Migração versão 6 preserva preferências e estima posição na união, com snapshot before-numbering-6 para reversão.

Backup: backups/renumeracao-357-402-20261023T204041/. Reverter fontes e TXT pelo manifest.json, retirando destinos antes de restaurar origens por haver sobreposição de IDs. Navegador migrado requer snapshot before-numbering-6 junto ao leitor anterior. Testes automatizados aprovados; revisão visual real não realizada. Commit e push manuais.


## Sétima etapa: capítulos 403–446

Antigos 418–460→403–445; antigo 462→446. Sem conteúdo para antigo 461, a sequência corrigida segue contínua. Faixa corrigida 279–446, 188 capítulos offline no total. Antigos 463 em diante aguardam conferência. Migração versão 7 preserva posições e preferências, com snapshot before-numbering-7.

Backup: backups/renumeracao-403-446-20261023T204336/. Reverter fontes e TXT pelo manifest.json, retirando destinos antes de restaurar origens devido à sobreposição. Navegador migrado requer snapshot before-numbering-7 junto ao leitor anterior. Testes automatizados aprovados; revisão visual real não realizada. Commit e push manuais.


## Oitava etapa: capítulos 447–475

Antigos 463–469→447–453 e antigos 471–492→454–475, sem conteúdo para antigo 470. Numeração corrigida até 475. Leitor contém 279–466 (188 capítulos consecutivos); nove TXT 467–475 aguardam publique para inclusão. Textos preservados. Migração versão 8 mantém posições e preferências com snapshot before-numbering-8.

Backup: backups/renumeracao-447-475-20261023T204850/. Reverter fontes e TXT segundo manifest.json, retirando destinos antes de restaurar origens por sobreposição. Navegador migrado requer snapshot before-numbering-8 junto à versão anterior. Testes automatizados aprovados; revisão visual real não realizada. Commit e push manuais.


## Publicação offline anterior — 279–475

Incluídos os nove TXT 467–475. Leitor com 197 capítulos consecutivos, sem pendentes. Numeração corrigida conforme NUMERACAO-CAPITULOS.json; conteúdo e controles preservados, migração versão 8.

Backup: backups/offline-467-475-20261023T204958/. Para reverter apenas inclusão, restaurar chapters.js/index.html/testes/tabela do backup, preservar TXT e registrar reversão. Testes automatizados aprovados; revisão visual real não realizada. Arquivos prontos na pasta oficial para commit e push manuais.


## Publicação offline anterior — 279–487

Incluídos integralmente os doze TXT 476–487. Leitor com 209 capítulos consecutivos, sem TXT pendente. As fontes 497/498 permanecem juntas no 480, incluindo subtítulo, pedido autoral e separador. Aplicação e esquema de migração 8 preservados.

Backup: backups/offline-476-487-20261024T144804761/. Para reverter esta inclusão, restaurar chapters.js, index.html, testes e tabela do backup; preservar TXT e registrar reversão. Cópias dos documentos e manifesto SHA-256 também disponíveis. Validação automatizada descrita na revisão operacional; conferência visual real pendente. Commit e push manuais.


## Publicação offline anterior — 279–500

Incluídos integralmente os treze TXT 488–500. Leitor com 222 capítulos consecutivos, sem TXT pendente. Títulos, notas e interpretações incertas preservados. Aplicação e esquema de migração 8 mantidos. Próximo correto 501, fonte esperada 519, sujeita à conferência.

Backup: backups/offline-488-500-20261024T230409455/. Reversão desta inclusão: restaurar chapters.js, index.html, testes e tabela anteriores; preservar TXT e registrar reversão. Cópias dos documentos e manifesto SHA-256 disponíveis. Testes automatizados descritos na revisão operacional; conferência visual real pendente. Commit e push manuais.


## Publicação offline anterior — 279–516

Incluídos integralmente os dezesseis TXT 501–516. Leitor com 238 capítulos consecutivos, sem TXT pendente. Fontes 524/525 preservadas no único capítulo 506, com ambas as partes e subtítulo interno. Índice agora inclui 501–600. Aplicação e esquema de migração 8 mantidos. Próximo correto 517, fonte esperada 536, sujeito à conferência.

Backup: backups/offline-501-516-20261024T233420184/. Reversão desta inclusão: restaurar chapters.js, index.html, testes e tabela anteriores; preservar TXT e registrar reversão. Cópias dos documentos e manifesto SHA-256 disponíveis. Testes descritos na revisão operacional; conferência visual real pendente. Commit e push manuais.


## Publicação offline atual — 279–535

Incluídos integralmente os dezenove TXT 517–535. Leitor com 257 capítulos consecutivos, sem TXT pendente. Fonte 537→517 confirmada pelo usuário; fontes 538–555 seguem como 518–535. Sem criação de conteúdo para a fonte 536 ausente. Títulos, incertezas, controles, progresso, preferências e esquema de migração 8 preservados. Próximo correto 536, fonte esperada 556, sujeito à conferência.

Backup: backups/offline-517-535-20261025T113721888/. Para reverter esta inclusão, restaurar chapters.js, index.html, testes e tabela do backup; preservar TXT e registrar reversão. Documentos e manifesto SHA-256 também disponíveis. Validação automatizada descrita na revisão operacional; revisão visual real não realizada. Commit e push manuais.


## Publicação offline atual — 279–552

Dezessete TXT536–552 incluídos integralmente. Leitor com 274 capítulos consecutivos e nenhum TXT pendente; fontes556–572→536–552. Esquema de migração8 e controles preservados.

Backup: backups/offline-536-552-20261028T185513/. Para reverter inclusão, restaurar chapters.js/index.html/testes/tabela anteriores, preservar traduções e registrar reversão. Testes automatizados e sintaxe aprovados; revisão visual real não realizada. Arquivos locais prontos para commit e push manuais.


## Publicação offline atual — 279–564

Doze TXT553–564 incluídos integralmente. Leitor com286 capítulos consecutivos e nenhum pendente; fontes573–584→553–564. Esquema8/controles preservados.

Backup: backups/offline-553-564-20261028T191208/. Reverter inclusão restaurando chapters.js/index.html/testes/tabela anteriores, mantendo traduções e registrando reversão. Testes automatizados e sintaxe aprovados; revisão visual real não realizada. Arquivos na pasta oficial prontos para commit/push manuais.


## Publicação offline atual — 279–570

Seis TXT565–570 incluídos integralmente. Leitor com292 capítulos consecutivos e nenhum pendente; fontes585–590→565–570. Esquema8/controles preservados.

Backup: backups/offline-565-570-20261029T115453/. Para reverter inclusão, restaurar chapters.js/index.html/testes/tabela anteriores, manter traduções e registrar reversão. Testes automatizados e sintaxe aprovados; revisão visual real não realizada. Arquivos locais prontos para commit/push manuais.


## Publicação offline atual — 279–584

Quatorze TXT571–584 incluídos integralmente. Leitor com306 capítulos consecutivos, nenhum TXT pendente; fontes596/597 reunidas no576. Esquema8, controles, progresso e preferências preservados.

Backup: backups/offline-571-584-20261029T202950/. Para reverter inclusão, restaurar chapters.js/index.html/testes/tabela anteriores, preservar os TXT e registrar reversão; documentos anteriores e manifesto SHA-256 também estão no backup. Testes automatizados e sintaxe aprovados; revisão visual real não realizada. Arquivos locais na pasta oficial prontos para commit e push manuais.


## Publicação offline atual — 279–600

Dezesseis TXT585–600 incluídos integralmente. Leitor com322 capítulos consecutivos e nenhum TXT pendente; fontes606–621→585–600. Esquema8, controles, progresso e preferências preservados.

Backup: backups/offline-585-600-20261030T162327/. Para reverter inclusão, restaurar chapters.js/index.html/testes/tabela anteriores, preservar TXT e registrar reversão. Documentos anteriores e manifesto SHA-256 também disponíveis. Testes automatizados e sintaxe aprovados; revisão visual real não realizada. Arquivos locais na pasta oficial prontos para commit e push manuais.


## Publicação offline atual — 279–619

Dezenove TXT601–619 incluídos integralmente. Leitor com341 capítulos consecutivos, sem TXT pendente; fontes622–640→601–619. Novo grupo601–700 com comportamento automático do índice preservado. Esquema8, controles, progresso e preferências mantidos.

Backup: backups/offline-601-619-20261030T174338/. Reverter inclusão restaurando chapters.js/index.html/testes/tabela anteriores, preservar TXT e registrar reversão; documentos anteriores e manifesto SHA-256 também disponíveis. Testes automatizados e sintaxe aprovados; revisão visual real não realizada. Arquivos locais prontos para commit/push manuais.


## Publicação offline atual — 279–629

Dez TXT620–629 incluídos integralmente. Leitor com351 capítulos consecutivos, nenhum TXT pendente; fontes641–650→620–629. Esquema8, índice por centenas e preferências preservados.

Backup: backups/offline-620-629-20261030T202633/. Reverter inclusão restaurando chapters.js/index.html/testes/tabela anteriores, preservando TXT e registrando reversão; documentos e manifesto SHA-256 também disponíveis. Testes automatizados e sintaxe aprovados; revisão visual real não realizada. Arquivos locais prontos para commit/push manuais.
