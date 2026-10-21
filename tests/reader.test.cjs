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
  const get = id => { if(!nodes.has(id)) nodes.set(id,new Element()); return nodes.get(id); };
  const themes = ['light','sepia','dark'].map(theme=>{const e=new Element('button');e.dataset.themeChoice=theme;return e;});
  let persisted = saved;
  const browser = {scrollY:0,innerWidth:width,innerHeight:900,scrollCalls:0,scrollTo(x,y){this.scrollCalls++;this.scrollY=y;},addEventListener(name,fn){listeners[name]=fn;}};
  const location={hash};
  const context = {
    window:browser,location,
    document:{getElementById:get,createElement:tag=>new Element(tag),createDocumentFragment:()=>new Element('fragment'),createTextNode:text=>({textContent:text}),body:get('body'),documentElement:get('html'),querySelectorAll:selector=>selector==='[data-theme-choice]'?themes:get('chapter-list').children,addEventListener(name,fn){documentListeners[name]=fn;}},
    localStorage:{getItem(){if(failStorage)throw Error('blocked');return persisted||null;},setItem(key,value){if(failStorage)throw Error('blocked');persisted=value;}},
    requestAnimationFrame:fn=>frames.push(fn),setTimeout:fn=>{context.timer=fn;return 1;},clearTimeout(){context.timer=null;}
  };
  vm.createContext(context); vm.runInContext(chapterSource,context);vm.runInContext(appSource,context);
  const flush=()=>{while(frames.length)frames.shift()();};flush();
  return {get,themes,browser,location,listeners,documentListeners,context,flush,saved:()=>JSON.parse(persisted),changeHash(value){location.hash=value;listeners.hashchange();flush();}};
}
const app=boot();
assert.deepEqual(Array.from(app.browser.READING_CHAPTERS,c=>c.id),[290,291,292,293,294,295,296,297,298,299,300,301,302,303,304]);
for(const c of app.browser.READING_CHAPTERS){assert(c.body.length>4000,`Capítulo ${c.id} vazio ou truncado`);assert.equal((c.body.replace(/^\*\*\*$/gm,'').match(/\*/g)||[]).length%2,0);}
assert.equal(app.get('chapter-list').children.length,15);
assert.equal(app.get('chapter-title').textContent,'Encontro com Li Shimin');
assert.equal(app.get('previous').disabled,true);
assert.equal(app.get('next').disabled,false);
app.browser.scrollTo(0,3500);app.listeners.scroll();app.context.timer();
const middle=app.saved().positions[290];assert(middle>.4&&middle<.6);
app.get('next').click();assert.equal(app.location.hash,'capitulo-291');app.changeHash('#capitulo-291');
assert.equal(app.get('chapter-number').textContent,'CAPÍTULO 291');
app.changeHash('#capitulo-290');assert(Math.abs(app.browser.scrollY-3500)<1);
app.get('theme').value='dark';app.get('theme').handlers.change();app.flush();assert.equal(app.get('body').dataset.theme,'dark');
for(let i=0;i<6;i++){app.get('font-increase').click();app.flush();}
assert.equal(app.saved().settings.fontSize,26);
assert.equal(app.saved().settings.theme,'dark');
const resumed=boot(JSON.stringify(app.saved()));assert.equal(resumed.get('body').dataset.theme,'dark');assert.equal(resumed.browser.scrollY,3500);
app.changeHash('#capitulo-296');assert.equal(app.get('next').disabled,false);
app.get('next').click();app.changeHash('#capitulo-297');assert.equal(app.get('chapter-title').textContent,'A carta de Lu Li');
for (const id of [297,298,299,300,301,302,303,304]) {
 app.changeHash('#capitulo-'+id);
 const filename=fs.readdirSync(path.join(root,'capitulos')).find(name=>name.startsWith(id+' - '));
 assert(filename,'TXT ausente: '+id);
 const txt=fs.readFileSync(path.join(root,'capitulos',filename),'utf8');
 const body=txt.split('\n').slice(3).join('\n').trim();
 assert.equal(app.browser.READING_CHAPTERS.find(c=>c.id===id).body,body);
 assert(!txt.includes('�'));
}
assert.equal(app.get('next').disabled,true);assert.equal(app.get('previous').disabled,false);
app.changeHash('#capitulo-299');assert.equal(app.get('next').disabled,false);
for(let id=300;id<=304;id++) {
 app.get('next').click();assert.equal(app.location.hash,'capitulo-'+id);
 app.changeHash('#capitulo-'+id);assert.equal(app.get('chapter-number').textContent,'CAPÍTULO '+id);
}
assert.equal(app.get('next').disabled,true);
app.get('previous').click();assert.equal(app.location.hash,'capitulo-303');app.changeHash('#capitulo-303');

app.changeHash('#capitulo-999');assert.equal(app.get('chapter-number').textContent,'CAPÍTULO 290');
app.get('reset-settings').click();app.flush();assert.equal(app.get('body').dataset.theme,'sepia');assert.equal(app.saved().settings.fontSize,20);
for(let i=0;i<30;i++){app.get('font-increase').click();app.flush();}assert.equal(app.saved().settings.fontSize,30);assert.equal(app.get('font-increase').disabled,true);
for(let i=0;i<30;i++){app.get('font-decrease').click();app.flush();}assert.equal(app.saved().settings.fontSize,16);assert.equal(app.get('font-decrease').disabled,true);
app.get('line-height').value='2.2';app.get('line-height').handlers.change();app.flush();assert.equal(app.saved().settings.lineHeight,2.2);
app.get('text-width').value='880';app.get('text-width').handlers.change();app.flush();assert.equal(app.saved().settings.width,880);
assert.equal(app.get('reading-progress').attributes['aria-valuenow'],String(Math.round(app.saved().positions[290]*100)));
assert.match(app.get('header-title').textContent,/290/);
assert.equal(app.get('index-toggle').attributes['aria-expanded'],'true');
const beforeToggle=app.browser.scrollY;
app.get('index-toggle').click();app.flush();assert.equal(app.get('body').classList.contains('sidebar-hidden'),true);assert.equal(app.saved().sidebarVisible,false);assert.equal(app.browser.scrollY,beforeToggle);
const hiddenResume=boot(JSON.stringify(app.saved()));assert.equal(hiddenResume.get('index-toggle').attributes['aria-expanded'],'false');assert.equal(hiddenResume.get('body').classList.contains('sidebar-hidden'),true);
hiddenResume.changeHash('#capitulo-291');assert.equal(hiddenResume.saved().sidebarVisible,false);
app.get('index-toggle').click();app.flush();assert.equal(app.saved().sidebarVisible,true);assert.equal(app.get('index-toggle').attributes['aria-expanded'],'true');
const mobile=boot(JSON.stringify(app.saved()),false,'',390);assert.equal(mobile.get('index-toggle').attributes['aria-expanded'],'false');
mobile.get('index-toggle').click();mobile.flush();assert.equal(mobile.get('library').classList.contains('open'),true);assert.equal(mobile.saved().sidebarVisible,true);
mobile.changeHash('#capitulo-291');assert.equal(mobile.get('library').classList.contains('open'),false);assert.equal(mobile.saved().sidebarVisible,true);
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
const blocked=boot(null,true);assert.equal(blocked.get('chapter-number').textContent,'CAPÍTULO 290');assert.match(blocked.get('save-status').textContent,/indisponível/);
assert.equal(boot('{broken').get('chapter-number').textContent,'CAPÍTULO 290');
const invalid=boot(JSON.stringify({settings:{fontSize:999,theme:'invalid',width:5},positions:{290:-20}}));assert.equal(invalid.saved().settings.fontSize,20);assert.equal(invalid.browser.scrollY,0);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('15 capítulos disponíveis'));
const header=html.slice(html.indexOf('<header'),html.indexOf('</header>'));
for(const id of ['font-decrease','font-increase','theme','line-height','text-width','reset-settings','reading-progress']) assert(header.includes('id="'+id+'"'),id+' deve estar no cabeçalho');
assert(!html.includes('id="settings"'));assert(!html.includes('class="reading-bar"'));
for(const match of appSource.matchAll(/\$\('([^']+)'\)/g)) assert(html.includes('id="'+match[1]+'"'),'ID ausente: '+match[1]);
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){assert(!/^(https?:)?\/\//.test(match[1]),'Recurso externo');assert(fs.existsSync(path.join(root,match[1])));}
assert(!/\bfetch\s*\(|XMLHttpRequest|@import|https?:\/\//.test(appSource+chapterSource+fs.readFileSync(path.join(root,'styles.css'),'utf8')));
console.log('OK: 15 capítulos, TXT 297–304 idênticos ao leitor; navegação e extremos; retomada e preferências; controles; dados inválidos; armazenamento bloqueado; recursos locais.');
