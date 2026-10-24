// Verificações sem dependências. O DOM simulado não substitui uma revisão visual.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname,'..');
const chapterSource = fs.readFileSync(path.join(root,'chapters.js'),'utf8');
const appSource = fs.readFileSync(path.join(root,'app.js'),'utf8');
function boot(saved, failStorage = false, hash = '', width = 1280) {
  const nodes = new Map(), listeners = {}, documentListeners = {}, frames = [];
  class Element {
    constructor(tag = 'div') { this.tagName = tag; this.children=[]; this.attributes={}; this.dataset={}; this.handlers={}; this.hidden=false; this.style={setProperty(name,value){this[name]=value;}}; this.classes=new Set(); this.classList={add: name=>this.classes.add(name),toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name),contains:name=>this.classes.has(name)}; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children=children; }
    setAttribute(name,value) { this.attributes[name]=value; }
    removeAttribute(name) { delete this.attributes[name]; }
    addEventListener(name,handler) { this.handlers[name]=handler; }
    focus() { this.focused=true; }
    getBoundingClientRect() { return {top: 200-browser.scrollY,bottom: 8200-browser.scrollY}; }
    click() { this.handlers.click?.({preventDefault(){}}); }
  }
  const descendants = node => node.children.flatMap(child => [child,...(child.children ? descendants(child) : [])]);
  const get = id => { if(!nodes.has(id)) nodes.set(id,new Element()); return nodes.get(id); };
  const themes = ['light','sepia','dark'].map(theme=>{const e=new Element('button');e.dataset.themeChoice=theme;return e;});
  let persisted = saved;
  const browser = {scrollY:0,innerWidth:width,innerHeight:900,scrollCalls:0,scrollTo(x,y){this.scrollCalls++;this.scrollY=y;},addEventListener(name,fn){listeners[name]=fn;}};
  const location={hash};
  const context = {
    window:browser,location,
    document:{getElementById:get,createElement:tag=>new Element(tag),createDocumentFragment:()=>new Element('fragment'),createTextNode:text=>({textContent:text}),body:get('body'),documentElement:get('html'),querySelectorAll:selector=>selector==='[data-theme-choice]'?themes:descendants(get('chapter-list')).filter(node=>node.className==='chapter-link'),addEventListener(name,fn){documentListeners[name]=fn;}},
    localStorage:{getItem(){if(failStorage)throw Error('blocked');return persisted||null;},setItem(key,value){if(failStorage)throw Error('blocked');persisted=value;}},
    requestAnimationFrame:fn=>frames.push(fn),setTimeout:fn=>{context.timer=fn;return 1;},clearTimeout(){context.timer=null;}
  };
  vm.createContext(context); vm.runInContext(chapterSource,context);vm.runInContext(appSource,context);
  const flush=()=>{while(frames.length)frames.shift()();};flush();
  return {get,themes,browser,location,listeners,documentListeners,context,flush,saved:()=>JSON.parse(persisted),changeHash(value){location.hash=value;listeners.hashchange();flush();}};
}
const app=boot();
const expectedIds=Array.from({length:203},(_,i)=>290+i).filter(id=>![355,358,369,416,461,470].includes(id)).map(id=>id<=354?id-11:id===356?344:id===357?345:id===359?346:id>=360&&id<=368?id-13:id===370?356:id>=371&&id<=415?id-14:id===417?402:id>=418&&id<=460?id-15:id===462?446:id>=463&&id<=469?id-16:id>=471?id-17:id).concat(Array.from({length:12},(_,i)=>476+i));
assert.deepEqual(Array.from(app.browser.READING_CHAPTERS,c=>c.id),expectedIds);
for(const c of app.browser.READING_CHAPTERS){assert(c.body.length>4000,`Capítulo ${c.id} vazio ou truncado`);assert.equal((c.body.replace(/^\*\*\*$/gm,'').match(/\*/g)||[]).length%2,0);}
assert.equal(app.get('chapter-list').children.length,3);
assert.equal(app.context.document.querySelectorAll('.chapter-link').length,209);
assert.equal(app.get('chapter-title').textContent,'Encontro com Li Shimin');
assert.equal(app.get('previous').disabled,true);
assert.equal(app.get('next').disabled,false);
app.browser.scrollTo(0,3500);app.listeners.scroll();app.context.timer();
const middle=app.saved().positions[279];assert(middle>.4&&middle<.6);
app.get('next').click();assert.equal(app.location.hash,'capitulo-280');app.changeHash('#capitulo-280');
assert.equal(app.get('chapter-number').textContent,'CAPÍTULO 280');
app.changeHash('#capitulo-279');assert(Math.abs(app.browser.scrollY-3500)<1);
app.get('theme').value='dark';app.get('theme').handlers.change();app.flush();assert.equal(app.get('body').dataset.theme,'dark');
for(let i=0;i<6;i++){app.get('font-increase').click();app.flush();}
assert.equal(app.saved().settings.fontSize,26);
assert.equal(app.saved().settings.theme,'dark');
const resumed=boot(JSON.stringify(app.saved()));assert.equal(resumed.get('body').dataset.theme,'dark');assert.equal(resumed.browser.scrollY,3500);
app.changeHash('#capitulo-285');assert.equal(app.get('next').disabled,false);
app.get('next').click();app.changeHash('#capitulo-286');assert.equal(app.get('chapter-title').textContent,'A carta de Lu Li');
for (const id of expectedIds.filter(id=>id>=286)) {
 app.changeHash('#capitulo-'+id);
 const filename=fs.readdirSync(path.join(root,'capitulos')).find(name=>name.startsWith(id+' - '));
 assert(filename,'TXT ausente: '+id);
 const txt=fs.readFileSync(path.join(root,'capitulos',filename),'utf8');
 const lines=txt.replace(/\r\n/g,'\n').split('\n');
 const body=lines.slice(/^(Pedido do autor:|Nota do título original:)/.test(lines[1]) ? 3 : 2).join('\n').trim();
 assert.equal(app.browser.READING_CHAPTERS.find(c=>c.id===id).body,body);
 assert(!txt.includes('�'));
}
assert.equal(app.get('next').disabled,true);assert.equal(app.get('previous').disabled,false);
app.changeHash('#capitulo-288');assert.equal(app.get('next').disabled,false);
for(const id of expectedIds.filter(id=>id>=289)) {
 app.get('next').click();assert.equal(app.location.hash,'capitulo-'+id);
 app.changeHash('#capitulo-'+id);assert.equal(app.get('chapter-number').textContent,'CAPÍTULO '+id);
}
assert.equal(app.get('next').disabled,true);
assert.equal(app.get('chapter-content').children.some(node=>node.className==='author-note'),true);
app.changeHash('#capitulo-309');
assert.equal(app.get('chapter-content').children.some(node=>node.className==='author-note'),false);
assert(app.browser.READING_CHAPTERS.find(c=>c.id===309).body.startsWith('Em uma cafeteria'));
app.changeHash('#capitulo-466');
app.get('previous').click();assert.equal(app.location.hash,'capitulo-465');app.changeHash('#capitulo-465');


for(const id of Array.from({length:35},(_,i)=>411+i).filter(n=>n!==416).map(n=>n<=415?n-14:n===417?402:n-15)) {
 const file=fs.readdirSync(path.join(root,'capitulos')).find(name=>name.startsWith(id+' - '));
 const note=fs.readFileSync(path.join(root,'capitulos',file),'utf8').replace(/\r\n/g,'\n').split('\n')[1];
 app.changeHash('#capitulo-'+id);
 assert.equal(app.get('chapter-content').children.find(node=>node.className==='author-note').textContent,note);
}
for (const id of [371,372,374]) {
 app.changeHash('#capitulo-'+id);
 const note=app.get('chapter-content').children.find(node=>node.className==='author-note');
 assert.equal(note.textContent,'Nota do título original: Feliz Ano-Novo!');
 assert(!app.browser.READING_CHAPTERS.find(c=>c.id===id).body.startsWith('Nota do título original:'));
}
app.changeHash('#capitulo-999');assert.equal(app.get('chapter-number').textContent,'CAPÍTULO 279');
app.get('reset-settings').click();app.flush();assert.equal(app.get('body').dataset.theme,'sepia');assert.equal(app.saved().settings.fontSize,20);
for(let i=0;i<30;i++){app.get('font-increase').click();app.flush();}assert.equal(app.saved().settings.fontSize,30);assert.equal(app.get('font-increase').disabled,true);
for(let i=0;i<30;i++){app.get('font-decrease').click();app.flush();}assert.equal(app.saved().settings.fontSize,16);assert.equal(app.get('font-decrease').disabled,true);
app.get('line-height').value='2.2';app.get('line-height').handlers.change();app.flush();assert.equal(app.saved().settings.lineHeight,2.2);
app.get('text-width').value='880';app.get('text-width').handlers.change();app.flush();assert.equal(app.saved().settings.width,880);
assert.equal(app.get('reading-progress').attributes['aria-valuenow'],String(Math.round(app.saved().positions[279]*100)));
assert.match(app.get('header-title').textContent,/279/);
assert.equal(app.get('index-toggle').attributes['aria-expanded'],'true');
const beforeToggle=app.browser.scrollY;
app.get('index-toggle').click();app.flush();assert.equal(app.get('body').classList.contains('sidebar-hidden'),true);assert.equal(app.saved().sidebarVisible,false);assert.equal(app.browser.scrollY,beforeToggle);
const hiddenResume=boot(JSON.stringify(app.saved()));assert.equal(hiddenResume.get('index-toggle').attributes['aria-expanded'],'false');assert.equal(hiddenResume.get('body').classList.contains('sidebar-hidden'),true);
hiddenResume.changeHash('#capitulo-280');assert.equal(hiddenResume.saved().sidebarVisible,false);
app.get('index-toggle').click();app.flush();assert.equal(app.saved().sidebarVisible,true);assert.equal(app.get('index-toggle').attributes['aria-expanded'],'true');
const mobile=boot(JSON.stringify(app.saved()),false,'',390);assert.equal(mobile.get('index-toggle').attributes['aria-expanded'],'false');
mobile.get('index-toggle').click();mobile.flush();assert.equal(mobile.get('library').classList.contains('open'),true);assert.equal(mobile.saved().sidebarVisible,true);
mobile.changeHash('#capitulo-280');assert.equal(mobile.get('library').classList.contains('open'),false);assert.equal(mobile.saved().sidebarVisible,true);
mobile.get('index-toggle').click();mobile.flush();mobile.get('index-close').click();mobile.flush();assert.equal(mobile.get('library').classList.contains('open'),false);
mobile.browser.innerWidth=1280;mobile.listeners.resize();assert.equal(mobile.get('index-toggle').attributes['aria-expanded'],'true');
// Abrir/cancelar seletores e repetir o mesmo valor não deve solicitar rolagem.
const stationary=boot();stationary.browser.scrollTo(0,3500);stationary.listeners.scroll();stationary.context.timer();
const stationaryCalls=stationary.browser.scrollCalls;
for(let i=0;i<12;i++) {
 for(const id of ['line-height','text-width','theme']) {
  stationary.get(id).click();
  stationary.get(id).handlers.change(); // Valor atual reapresentado pelo controle.
  stationary.documentListeners.click({target:{closest:()=>false}});
  stationary.documentListeners.keydown({key:'Escape'});
  stationary.flush();
 }
}
assert.equal(stationary.browser.scrollCalls,stationaryCalls);
assert.equal(stationary.browser.scrollY,3500);
assert.equal(stationary.saved().sidebarVisible,true);
stationary.get('index-toggle').click();stationary.flush();
const closedCalls=stationary.browser.scrollCalls;
stationary.documentListeners.keydown({key:'Escape'});stationary.flush();
assert.equal(stationary.browser.scrollCalls,closedCalls);
const mobileEscape=boot(null,false,'',390);
mobileEscape.documentListeners.keydown({key:'Escape'});mobileEscape.flush();
const mobileClosedCalls=mobileEscape.browser.scrollCalls;
mobileEscape.documentListeners.keydown({key:'Escape'});mobileEscape.flush();assert.equal(mobileEscape.browser.scrollCalls,mobileClosedCalls);
mobileEscape.get('index-toggle').click();mobileEscape.flush();
mobileEscape.documentListeners.keydown({key:'Escape'});mobileEscape.flush();assert.equal(mobileEscape.get('library').classList.contains('open'),false);
assert(!/scroll-padding(?:-top)?\s*:/.test(fs.readFileSync(path.join(root,'styles.css'),'utf8')));
const blocked=boot(null,true);assert.equal(blocked.get('chapter-number').textContent,'CAPÍTULO 279');assert.match(blocked.get('save-status').textContent,/indisponível/);
assert.equal(boot('{broken').get('chapter-number').textContent,'CAPÍTULO 279');
const invalid=boot(JSON.stringify({settings:{fontSize:999,theme:'invalid',width:5},positions:{279:-20}}));assert.equal(invalid.saved().settings.fontSize,20);assert.equal(invalid.browser.scrollY,0);
// O painel começa recolhido e preserva a posição e preferências ao alternar.
const appearance=boot(null,false,'',390);
assert.equal(appearance.get('appearance-panel').hidden,true);
const appearanceHeight=()=>appearance.get('appearance-panel').hidden?56:160;
appearance.get('topbar').getBoundingClientRect=()=>({height:appearanceHeight()});
appearance.get('reader').getBoundingClientRect=()=>({top:200+appearanceHeight()-56-appearance.browser.scrollY,bottom:8200+appearanceHeight()-56-appearance.browser.scrollY});
appearance.browser.scrollTo(0,3500);appearance.listeners.scroll();appearance.context.timer();
const appearanceRatio=appearance.saved().positions[279];
for(let i=0;i<3;i++) {
 appearance.get('appearance-toggle').click();appearance.flush();
 assert.equal(appearance.get('appearance-panel').hidden,false);
 assert.equal(appearance.get('appearance-toggle').attributes['aria-expanded'],'true');
 assert.equal(appearance.context.document.documentElement.style['--header-height'],'160px');
 assert(Math.abs(appearance.saved().positions[279]-appearanceRatio)<0.00001);
 appearance.get('appearance-toggle').click();appearance.flush();
 assert.equal(appearance.get('appearance-panel').hidden,true);
 assert.equal(appearance.get('appearance-toggle').attributes['aria-expanded'],'false');
 assert.equal(appearance.context.document.documentElement.style['--header-height'],'56px');
 assert(Math.abs(appearance.browser.scrollY-3500)<1);
}
appearance.get('appearance-toggle').click();appearance.flush();
appearance.get('theme').value='dark';appearance.get('theme').handlers.change();appearance.flush();
assert.equal(appearance.saved().settings.theme,'dark');
assert.equal(boot(JSON.stringify(appearance.saved())).get('appearance-panel').hidden,true);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('209 capítulos disponíveis'));
assert.equal((html.match(/id="index-toggle"/g)||[]).length,1);
assert(html.indexOf('id="index-toggle"')<html.indexOf('id="header-title"'));
assert(html.indexOf('id="header-title"')<html.indexOf('id="appearance-toggle"'));
const header=html.slice(html.indexOf('<header'),html.indexOf('</header>'));
for(const id of ['font-decrease','font-increase','theme','line-height','text-width','reset-settings','reading-progress']) assert(header.includes('id="'+id+'"'),id+' deve estar no cabeçalho');
assert(!html.includes('id="settings"'));assert(!html.includes('class="reading-bar"'));
for(const match of appSource.matchAll(/\$\('([^']+)'\)/g)) assert(html.includes('id="'+match[1]+'"'),'ID ausente: '+match[1]);
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){assert(!/^(https?:)?\/\//.test(match[1]),'Recurso externo');assert(fs.existsSync(path.join(root,match[1])));}
assert(!/\bfetch\s*\(|XMLHttpRequest|@import|https?:\/\//.test(appSource+chapterSource+fs.readFileSync(path.join(root,'styles.css'),'utf8')));


for(let id=431;id<=440;id++){
 app.changeHash("#capitulo-"+id);
 const chapter=app.browser.READING_CHAPTERS.find(c=>c.id===id);
 const file=fs.readdirSync(path.join(root,"capitulos")).find(n=>n.startsWith(id+" - "));
 const lines=fs.readFileSync(path.join(root,"capitulos",file),"utf8").replace(/\r\n/g,"\n").split("\n");
 assert.equal(chapter.title,lines[0].replace(/^Capítulo \d+ — /,""));
 const note=app.get("chapter-content").children.find(n=>n.className==="author-note");
 if(id===435){assert.equal(chapter.authorNote,false);assert.equal(note,undefined);}
 else assert.equal(note.textContent,lines[1]);
}

for(const id of expectedIds.filter(id=>id>=441)){
 app.changeHash("#capitulo-"+id);
 const chapter=app.browser.READING_CHAPTERS.find(c=>c.id===id);
 const file=fs.readdirSync(path.join(root,"capitulos")).find(n=>n.startsWith(id+" - "));
 const lines=fs.readFileSync(path.join(root,"capitulos",file),"utf8").replace(/\r\n/g,"\n").split("\n");
 assert.equal(chapter.title,lines[0].replace(/^Capítulo \d+ — /,""));
 const note=app.get("chapter-content").children.find(n=>n.className==="author-note");
 if(/^(Pedido do autor:|Nota do título original:)/.test(lines[1]))assert.equal(note.textContent,lines[1]);
 else {assert.equal(chapter.authorNote,false);assert.equal(note,undefined);}
}
for(const [left,right] of [[445,446],[453,454]]){
 app.changeHash("#capitulo-"+left);app.get("next").click();assert.equal(app.location.hash,"capitulo-"+right);
 app.changeHash("#capitulo-"+right);assert.equal(app.get("chapter-number").textContent,"CAPÍTULO "+right);
 app.get("previous").click();assert.equal(app.location.hash,"capitulo-"+left);
}
const lastResume=boot(JSON.stringify({numberingVersion:8,chapter:466,positions:{466:.5},settings:{theme:"dark",fontSize:22}}));
assert.equal(lastResume.get("chapter-number").textContent,"CAPÍTULO 466");
assert.equal(lastResume.get("body").dataset.theme,"dark");
assert(lastResume.browser.scrollY>0);
console.log("OK: 209 capítulos, TXT disponíveis 286–487 idênticos; títulos e notas; navegação 445↔446 e 453↔454; retomada 466; controles, preferências e recursos locais.");

// Centenas, limites, abertura manual e preservação da posição.
const grouped=boot();
const groups=grouped.get("chapter-list").children;
assert.deepEqual(groups.map(g=>g.children[0].textContent),["201–300","301–400","401–500"]);
const openGroups=()=>groups.filter(g=>!g.children[1].hidden).map(g=>g.children[0].textContent);
assert.deepEqual(openGroups(),["201–300"]);
for(const [id,label] of [[300,"201–300"],[301,"301–400"],[400,"301–400"],[401,"401–500"],[466,"401–500"]]){
 grouped.changeHash("#capitulo-"+id);assert.deepEqual(openGroups(),[label]);
 const active=grouped.context.document.querySelectorAll(".chapter-link").filter(link=>link.attributes["aria-current"]==="page");
 assert.equal(active.length,1);assert.equal(Number(active[0].dataset.chapter),id);
}
grouped.browser.scrollTo(0,3500);grouped.listeners.scroll();grouped.context.timer();
const beforeGroupClick=grouped.browser.scrollCalls;const savedGroupPosition=grouped.saved().positions[466];
groups[0].children[0].click();assert.equal(groups[0].children[1].hidden,false);assert.equal(groups[0].children[0].attributes["aria-expanded"],"true");
groups[0].children[0].click();assert.equal(groups[0].children[1].hidden,true);
assert.equal(grouped.browser.scrollCalls,beforeGroupClick);assert.equal(grouped.browser.scrollY,3500);assert.equal(grouped.saved().positions[466],savedGroupPosition);
const groupedResume=boot(JSON.stringify(grouped.saved()));
assert.deepEqual(groupedResume.get("chapter-list").children.filter(g=>!g.children[1].hidden).map(g=>g.children[0].textContent),["401–500"]);
assert.equal(groupedResume.browser.scrollY,3500);
const mobileGrouped=boot(null,false,"#capitulo-340",390);
assert.deepEqual(mobileGrouped.get("chapter-list").children.filter(g=>!g.children[1].hidden).map(g=>g.children[0].textContent),["301–400"]);
mobileGrouped.get("index-toggle").click();mobileGrouped.flush();
mobileGrouped.context.document.querySelectorAll(".chapter-link").find(link=>Number(link.dataset.chapter)===401).click();
mobileGrouped.changeHash("#capitulo-401");assert.equal(mobileGrouped.get("library").classList.contains("open"),false);
assert.equal(mobileGrouped.get("chapter-list").children[2].children[1].hidden,false);
console.log("OK: índice por centenas, limites 300/301/400/401, abertura manual sem rolagem, retomada e seleção móvel.");

const legacyState={chapter:301,positions:{290:.2,301:.5,311:.7,312:.3,320:.4,331:.6,332:.8},settings:{theme:"dark",fontSize:24},sidebarVisible:false};
const migrated=boot(JSON.stringify(legacyState));
assert.equal(migrated.get("chapter-number").textContent,"CAPÍTULO 290");
for(const [id,value] of [[279,.2],[300,.7],[301,.3],[309,.4],[320,.6],[321,.8]])assert.equal(migrated.saved().positions[id],value);
assert.equal(migrated.saved().numberingVersion,8);assert.equal(migrated.saved().settings.theme,"dark");assert.equal(migrated.saved().sidebarVisible,false);
const migrationResume=boot(JSON.stringify(migrated.saved()));assert.equal(migrationResume.get("chapter-number").textContent,"CAPÍTULO 290");assert.equal(migrationResume.browser.scrollY,migrated.browser.scrollY);
const oldLink=boot(JSON.stringify(legacyState),false,"#capitulo-331");assert.equal(oldLink.get("chapter-number").textContent,"CAPÍTULO 320");
const stageOneState={numberingVersion:1,chapter:320,positions:{279:.1,290:.2,300:.3,312:.4,320:.5,331:.6,332:.7},settings:{theme:"sepia",fontSize:22},sidebarVisible:true};
const stageTwo=boot(JSON.stringify(stageOneState));assert.equal(stageTwo.get("chapter-number").textContent,"CAPÍTULO 309");
for(const [id,value] of [[279,.1],[290,.2],[300,.3],[301,.4],[320,.6],[321,.7]])assert.equal(stageTwo.saved().positions[id],value);
const stageTwoResume=boot(JSON.stringify(stageTwo.saved()));assert.equal(stageTwoResume.get("chapter-number").textContent,"CAPÍTULO 309");assert.equal(stageTwoResume.browser.scrollY,stageTwo.browser.scrollY);
const stageOneLink=boot(JSON.stringify(stageOneState),false,"#capitulo-312");assert.equal(stageOneLink.get("chapter-number").textContent,"CAPÍTULO 301");
const freshLink=boot(null,false,"#capitulo-312");assert.equal(freshLink.get("chapter-title").textContent,"Ele… morreu!");
const deniedMigration=boot(JSON.stringify(legacyState),true);assert.equal(deniedMigration.get("chapter-number").textContent,"CAPÍTULO 279");
app.changeHash("#capitulo-446");app.get("next").click();assert.equal(app.location.hash,"capitulo-447");app.changeHash("#capitulo-447");app.get("previous").click();assert.equal(app.location.hash,"capitulo-446");
console.log("OK: migração direta e incremental, IDs sobrepostos, segunda abertura e sequência 446↔447.");

// União 354/355: retomada de cada parte, colisões, navegação e migração única.
const split = 0.5011705685618729;
for(const old of [354,355]) {
 const state={numberingVersion:2,chapter:old,positions:{343:.2,344:.3,354:.4,355:.6,356:.7,357:.8},settings:{theme:'dark'},sidebarVisible:false};
 const merged=boot(JSON.stringify(state),false,'#capitulo-'+old);
 assert.equal(merged.get('chapter-number').textContent,'CAPÍTULO 343');
 assert.equal(merged.saved().positions[332],.2);assert.equal(merged.saved().positions[333],.3);
 assert.equal(merged.saved().positions[344],.7);assert.equal(merged.saved().positions[345],0.5259412780656304*.8);
 assert(Math.abs(merged.saved().positions[343]-(old===354?split*.4:split+(1-split)*.6))<1e-10);
 assert.equal(merged.saved().numberingVersion,8);
 const again=boot(JSON.stringify(merged.saved()));assert.equal(again.browser.scrollY,merged.browser.scrollY);
 merged.get('previous').click();assert.equal(merged.location.hash,'capitulo-342');
 merged.changeHash('#capitulo-343');merged.get('next').click();assert.equal(merged.location.hash,'capitulo-344');
}
const third=boot(JSON.stringify({numberingVersion:2,chapter:356,positions:{356:.5}}));assert.equal(third.get('chapter-number').textContent,'CAPÍTULO 344');
assert.equal(third.saved().positions[344],.5);
console.log('OK: união integral, migração versão 3 e retomada das duas partes.');

// Segunda união: esquema 3→4, links e retomada sem reaplicar.
for(const id of [357,358]) {
 const state={numberingVersion:3,chapter:id,positions:{343:.2,344:.3,357:.4,358:.6,359:.7,360:.8},settings:{theme:'dark'},sidebarVisible:false};
 const result=boot(JSON.stringify(state),false,'#capitulo-'+id);
 assert.equal(result.get('chapter-number').textContent,'CAPÍTULO 345');
 assert.equal(result.saved().positions[343],.2);assert.equal(result.saved().positions[344],.3);
 assert.equal(result.saved().positions[346],.7);assert.equal(result.saved().positions[347],.8);
 assert(Math.abs(result.saved().positions[345]-(id===357?0.5259412780656304*.4:0.5259412780656304+(1-0.5259412780656304)*.6))<1e-10);
 assert.equal(result.saved().settings.theme,'dark');assert.equal(result.saved().sidebarVisible,false);
 const again=boot(JSON.stringify(result.saved()));assert.equal(again.browser.scrollY,result.browser.scrollY);
 result.get('previous').click();assert.equal(result.location.hash,'capitulo-344');
 result.changeHash('#capitulo-345');result.get('next').click();assert.equal(result.location.hash,'capitulo-346');
}
const fourth=boot(JSON.stringify({numberingVersion:3,chapter:359,positions:{359:.5}}),false,'#capitulo-359');assert.equal(fourth.get('chapter-number').textContent,'CAPÍTULO 346');assert.equal(fourth.saved().positions[346],.5);
console.log('OK: união 357/358→345, renumeração 359→346, migração versão 4.');

// Terceira união e migração incremental.
for(const id of [368,369]) {
 const state={numberingVersion:4,chapter:id,positions:{343:.2,345:.3,360:.1,367:.2,368:.4,369:.6,370:.7,371:.8},settings:{theme:'dark'},sidebarVisible:false};
 const result=boot(JSON.stringify(state),false,'#capitulo-'+id);
 assert.equal(result.get('chapter-number').textContent,'CAPÍTULO 355');
 for(const [n,p] of [[343,.2],[345,.3],[347,.1],[354,.2],[356,.7],[357,.8]])assert.equal(result.saved().positions[n],p);
 assert(Math.abs(result.saved().positions[355]-(id===368?0.4893842887473461*.4:0.4893842887473461+(1-0.4893842887473461)*.6))<1e-10);
 assert.equal(result.saved().numberingVersion,8);assert.equal(result.saved().settings.theme,'dark');assert.equal(result.saved().sidebarVisible,false);
 const again=boot(JSON.stringify(result.saved()));assert.equal(again.browser.scrollY,result.browser.scrollY);
 result.get('previous').click();assert.equal(result.location.hash,'capitulo-354');
 result.changeHash('#capitulo-355');result.get('next').click();assert.equal(result.location.hash,'capitulo-356');
}
for(const [source,target] of [[360,347],[367,354],[370,356]]) {
 const result=boot(JSON.stringify({numberingVersion:4,chapter:source,positions:{[source]:.5}}),false,'#capitulo-'+source);
 assert.equal(result.get('chapter-number').textContent,'CAPÍTULO '+target);assert.equal(result.saved().positions[target],.5);
}
app.changeHash('#capitulo-346');app.get('next').click();assert.equal(app.location.hash,'capitulo-347');
console.log('OK: união 368/369→355, faixa 360–370→347–356, migração versão 5.');

// União 415/416 e faixa sobreposta: migração 5→6 e retomada única.
for(const id of [415,416]) {
 const state={numberingVersion:5,chapter:id,positions:{343:.2,356:.3,371:.1,400:.2,401:.3,414:.4,415:.4,416:.6,417:.7,418:.8},settings:{theme:'dark'},sidebarVisible:false};
 const result=boot(JSON.stringify(state),false,'#capitulo-'+id);
 assert.equal(result.get('chapter-number').textContent,'CAPÍTULO 401');
 for(const [n,p] of [[343,.2],[356,.3],[357,.1],[386,.2],[387,.3],[400,.4],[402,.7],[403,.8]])assert.equal(result.saved().positions[n],p);
 assert(Math.abs(result.saved().positions[401]-(id===415?0.511680550525172*.4:0.511680550525172+(1-0.511680550525172)*.6))<1e-10);
 assert.equal(result.saved().numberingVersion,8);assert.equal(result.saved().settings.theme,'dark');assert.equal(result.saved().sidebarVisible,false);
 const again=boot(JSON.stringify(result.saved()));assert.equal(again.browser.scrollY,result.browser.scrollY);
 result.get('previous').click();assert.equal(result.location.hash,'capitulo-400');
 result.changeHash('#capitulo-401');result.get('next').click();assert.equal(result.location.hash,'capitulo-402');
}
for(const [source,target] of [[371,357],[414,400],[417,402]]) {
 const result=boot(JSON.stringify({numberingVersion:5,chapter:source,positions:{[source]:.5}}),false,'#capitulo-'+source);
 assert.equal(result.get('chapter-number').textContent,'CAPÍTULO '+target);assert.equal(result.saved().positions[target],.5);
}
app.changeHash('#capitulo-356');app.get('next').click();assert.equal(app.location.hash,'capitulo-357');
console.log('OK: união 415/416→401, faixa 371–417→357–402, migração versão 6.');

// Faixa 418–462: remapeamento simultâneo sem colisão e sem perda de posição.
const stateSeven={numberingVersion:6,chapter:462,positions:{401:.1,402:.2,418:.3,430:.4,445:.5,446:.6,460:.7,462:.8,463:.9},settings:{theme:'dark'},sidebarVisible:false};
const seven=boot(JSON.stringify(stateSeven),false,'#capitulo-462');
assert.equal(seven.get('chapter-number').textContent,'CAPÍTULO 446');
for(const [id,p] of [[401,.1],[402,.2],[403,.3],[415,.4],[430,.5],[431,.6],[445,.7],[446,.8],[447,.9]])assert.equal(seven.saved().positions[id],p);
assert.equal(seven.saved().numberingVersion,8);assert.equal(seven.saved().settings.theme,'dark');assert.equal(seven.saved().sidebarVisible,false);
const sevenAgain=boot(JSON.stringify(seven.saved()));assert.equal(sevenAgain.browser.scrollY,seven.browser.scrollY);
for(const [source,target] of [[418,403],[460,445],[462,446]]){
 const result=boot(JSON.stringify({...stateSeven,chapter:source}),false,'#capitulo-'+source);
 assert.equal(result.get('chapter-number').textContent,'CAPÍTULO '+target);
}
app.changeHash('#capitulo-402');app.get('next').click();assert.equal(app.location.hash,'capitulo-403');
app.changeHash('#capitulo-445');app.get('next').click();assert.equal(app.location.hash,'capitulo-446');
console.log('OK: 418–460→403–445 e 462→446, migração versão 7 e sequência contínua.');

// Etapa 7→8: lacuna da fonte 470 e preservação simultânea das posições.
const stateEight={numberingVersion:7,chapter:471,positions:{445:.1,446:.2,463:.3,469:.4,471:.5,475:.6,483:.7},settings:{theme:'dark'},sidebarVisible:false};
const eight=boot(JSON.stringify(stateEight),false,'#capitulo-471');assert.equal(eight.get('chapter-number').textContent,'CAPÍTULO 454');
for(const [id,p] of [[445,.1],[446,.2],[447,.3],[453,.4],[454,.5],[458,.6],[466,.7]])assert.equal(eight.saved().positions[id],p);
assert.equal(eight.saved().numberingVersion,8);assert.equal(eight.saved().settings.theme,'dark');assert.equal(eight.saved().sidebarVisible,false);
const eightAgain=boot(JSON.stringify(eight.saved()));assert.equal(eightAgain.browser.scrollY,eight.browser.scrollY);
for(const [source,target] of [[463,447],[469,453],[471,454],[483,466]]){
 const result=boot(JSON.stringify({...stateEight,chapter:source}),false,'#capitulo-'+source);assert.equal(result.get('chapter-number').textContent,'CAPÍTULO '+target);
}
assert.deepEqual(Array.from(app.browser.READING_CHAPTERS,c=>c.id),Array.from({length:209},(_,i)=>279+i));
for(let id=467;id<=487;id++)assert(fs.readdirSync(path.join(root,'capitulos')).some(f=>f.startsWith(id+' - ')));
assert.equal(app.browser.READING_CHAPTERS.filter(c=>c.id>=467).length,21);
console.log('OK: numeração contínua 279–487 no leitor; TXT 467–475 integrados; migração versão 8.');

// Publicação offline: último capítulo e retomada com número corrigido.
const finalResume=boot(JSON.stringify({numberingVersion:8,chapter:487,positions:{487:.55},settings:{theme:'dark'}}));
assert.equal(finalResume.get('chapter-title').textContent,'Um pequeno experimento de modificação de armas');assert.equal(finalResume.get('next').disabled,true);assert(finalResume.browser.scrollY>0);
app.changeHash('#capitulo-466');app.get('next').click();assert.equal(app.location.hash,'capitulo-467');
for(let id=467;id<=487;id++){
 app.changeHash('#capitulo-'+id);app.get('previous').click();assert.equal(app.location.hash,'capitulo-'+(id-1));
}
console.log('OK: publicação offline 279–487 completa, navegação e retomada do último capítulo.');

// Novos capítulos e união confirmada das fontes 497/498 no 480.
app.changeHash('#capitulo-475');app.get('next').click();assert.equal(app.location.hash,'capitulo-476');
const merged480=app.browser.READING_CHAPTERS.find(c=>c.id===480);assert(merged480.body.includes('Aqueles que me desafiam perecerão'));assert(merged480.body.includes('Ter armas, porém, poderia aliviar aquela situação.'));
for(let id=476;id<=487;id++){const c=app.browser.READING_CHAPTERS.find(c=>c.id===id);app.changeHash('#capitulo-'+id);const note=app.get('chapter-content').children.find(n=>n.className==='author-note');assert.equal(note?.textContent,c.authorNote===false?undefined:c.authorNote);}
const numbering=JSON.parse(fs.readFileSync(path.join(root,'NUMERACAO-CAPITULOS.json'),'utf8'));assert(!numbering.confirmed.some(c=>c.offlinePending));for(const source of [497,498])assert.equal(numbering.confirmed.find(c=>c.old===source).new,480);
console.log('OK: 476–487 completos, notas e duas partes do 480 preservadas; sem TXT pendente.');
