// Verificações sem dependências. O DOM simulado não substitui uma revisão visual.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname,'..');
const chapterSource = fs.readFileSync(path.join(root,'chapters.js'),'utf8');
const appSource = fs.readFileSync(path.join(root,'app.js'),'utf8');
function boot(saved, failStorage = false, hash = '', width = 1280) {
  const nodes = new Map(), listeners = {}, frames = [];
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
  const browser = {scrollY:0,innerWidth:width,innerHeight:900,scrollTo(x,y){this.scrollY=y;},addEventListener(name,fn){listeners[name]=fn;}};
  const location={hash};
  const context = {
    window:browser,location,
    document:{getElementById:get,createElement:tag=>new Element(tag),createDocumentFragment:()=>new Element('fragment'),createTextNode:text=>({textContent:text}),body:get('body'),documentElement:get('html'),querySelectorAll:selector=>selector==='[data-theme-choice]'?themes:get('chapter-list').children,addEventListener(){}},
    localStorage:{getItem(){if(failStorage)throw Error('blocked');return persisted||null;},setItem(key,value){if(failStorage)throw Error('blocked');persisted=value;}},
    requestAnimationFrame:fn=>frames.push(fn),setTimeout:fn=>{context.timer=fn;return 1;},clearTimeout(){context.timer=null;}
  };
  vm.createContext(context); vm.runInContext(chapterSource,context);vm.runInContext(appSource,context);
  const flush=()=>{while(frames.length)frames.shift()();};flush();
  return {get,themes,browser,location,listeners,context,flush,saved:()=>JSON.parse(persisted),changeHash(value){location.hash=value;listeners.hashchange();flush();}};
}
const app=boot();
assert.deepEqual(Array.from(app.browser.READING_CHAPTERS,c=>c.id),[290,291,292,293,294,295,296]);
for(const c of app.browser.READING_CHAPTERS){assert(c.body.length>4000,`Capítulo ${c.id} vazio ou truncado`);assert.equal((c.body.replace(/^\*\*\*$/gm,'').match(/\*/g)||[]).length%2,0);}
assert.equal(app.get('chapter-list').children.length,7);
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
app.changeHash('#capitulo-296');assert.equal(app.get('next').disabled,true);assert.equal(app.get('previous').disabled,false);
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
const blocked=boot(null,true);assert.equal(blocked.get('chapter-number').textContent,'CAPÍTULO 290');assert.match(blocked.get('save-status').textContent,/indisponível/);
assert.equal(boot('{broken').get('chapter-number').textContent,'CAPÍTULO 290');
const invalid=boot(JSON.stringify({settings:{fontSize:999,theme:'invalid',width:5},positions:{290:-20}}));assert.equal(invalid.saved().settings.fontSize,20);assert.equal(invalid.browser.scrollY,0);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const header=html.slice(html.indexOf('<header'),html.indexOf('</header>'));
for(const id of ['font-decrease','font-increase','theme','line-height','text-width','reset-settings','reading-progress']) assert(header.includes('id="'+id+'"'),id+' deve estar no cabeçalho');
assert(!html.includes('id="settings"'));assert(!html.includes('class="reading-bar"'));
for(const match of appSource.matchAll(/\$\('([^']+)'\)/g)) assert(html.includes('id="'+match[1]+'"'),'ID ausente: '+match[1]);
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){assert(!/^(https?:)?\/\//.test(match[1]),'Recurso externo');assert(fs.existsSync(path.join(root,match[1])));}
assert(!/\bfetch\s*\(|XMLHttpRequest|@import|https?:\/\//.test(appSource+chapterSource+fs.readFileSync(path.join(root,'styles.css'),'utf8')));
console.log('OK: 7 capítulos; navegação e extremos; retomada e preferências; controles; dados inválidos; armazenamento bloqueado; recursos locais.');
