// BIZIM SINEMA v9 — Cloudflare Worker + Durable Object (tek dosya)
// Gerekli ayar (wrangler.toml): DO bağlaması (sınıf: Do). Başka bir şey gerekmez.
// İsteğe bağlı Cloudflare değişkenleri: SECRET (oturum anahtarı), ADMIN_PASS (yönetici şifresi / kurtarma)
const CSS = String.raw`:root{--bg:#0a0b10;--s1:#12141b;--s2:#181b24;--s3:#20242f;--bd:#272c3a;--tx:#eceef5;--mu:#8f96aa;--ac:#6d7cff;--ac2:#9a6bff;--ok:#31c48d;--er:#f2646f;--wa:#f0b429;color-scheme:dark}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{-webkit-text-size-adjust:100%}
body{font:500 15px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text","Inter","Segoe UI",system-ui,sans-serif;background:var(--bg);color:var(--tx);min-height:100dvh;-webkit-font-smoothing:antialiased}
body:before{content:"";position:fixed;inset:0;z-index:-1;background:radial-gradient(900px 480px at 10% -10%,#6d7cff26,transparent),radial-gradient(700px 420px at 100% 0,#9a6bff1c,transparent)}
#app{width:min(1120px,100%);margin:0 auto;padding:max(14px,env(safe-area-inset-top)) 14px max(22px,env(safe-area-inset-bottom));display:grid;gap:14px;align-content:start}
.narrow{width:min(580px,100%);margin:0 auto}.stack{display:grid;gap:14px}
h1{font-size:1.6rem;font-weight:800;letter-spacing:-.02em}h2{font-size:1.12rem;font-weight:700;letter-spacing:-.01em}h3{font-size:.98rem;font-weight:700}
small,.mu{color:var(--mu);font-size:.8rem}b{font-weight:650}
.card{background:linear-gradient(180deg,var(--s1),#0f1117);border:1px solid var(--bd);border-radius:18px;padding:16px;display:grid;gap:12px;box-shadow:0 14px 34px #0005}
.row{display:flex;gap:8px;align-items:center}.grow{flex:1;min-width:0}.wrap{flex-wrap:wrap}.end{justify-content:flex-end}
.bar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:2px 2px 4px}
.brand{display:flex;align-items:center;gap:10px;font-size:1.05rem;letter-spacing:-.01em}
.logo{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,var(--ac),var(--ac2));display:grid;place-items:center;color:#fff;box-shadow:0 8px 22px #6d7cff55;flex:none}
.logo.lg{width:46px;height:46px;border-radius:14px}
.chip{display:flex;align-items:center;gap:8px;background:var(--s2);border:1px solid var(--bd);border-radius:99px;padding:4px 12px 4px 4px;font-size:.85rem}
.av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--ac),var(--ac2));display:grid;place-items:center;font-weight:700;font-size:.8rem;color:#fff;flex:none}
.ic{display:inline-grid;place-items:center;flex:none}
.in{width:100%;min-width:0;min-height:46px;padding:0 14px;border-radius:12px;border:1px solid var(--bd);background:var(--s2);color:var(--tx);-webkit-text-fill-color:var(--tx);caret-color:var(--ac);font:inherit;font-size:16px;-webkit-appearance:none;appearance:none;outline:0;-webkit-user-select:text;user-select:text;touch-action:manipulation}
.in:focus{border-color:var(--ac);box-shadow:0 0 0 3px #6d7cff30}
.in::placeholder{color:#677089;-webkit-text-fill-color:#677089;opacity:1}
.in:-webkit-autofill,.in:-webkit-autofill:focus{-webkit-text-fill-color:var(--tx);box-shadow:0 0 0 40px var(--s2) inset;caret-color:var(--tx)}
.in.code{text-align:center;letter-spacing:.35em;font-weight:800;text-transform:uppercase}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 16px;border-radius:12px;border:1px solid transparent;font:inherit;font-weight:650;color:#fff;background:linear-gradient(135deg,var(--ac),var(--ac2));cursor:pointer;-webkit-appearance:none;appearance:none;white-space:nowrap;touch-action:manipulation;box-shadow:0 8px 20px #6d7cff3a}
.btn:active{transform:scale(.97)}.btn:disabled{opacity:.55}
.btn.big{min-height:48px;width:100%}.btn.sq{width:44px;padding:0;flex:none}.btn.sm{min-height:36px;padding:0 12px;font-size:.85rem}
.btn.sec{background:var(--s3);border-color:var(--bd);color:var(--tx);box-shadow:none}
.btn.dng{background:#2c151b;border-color:#5a2430;color:#ff8d98;box-shadow:none}
.btn.full{width:100%}
.err{color:#ff8d98;font-size:.85rem;min-height:0}.err:empty{display:none}
.lbl{color:var(--mu);font-size:.78rem;margin-bottom:-6px;font-weight:600}
.chk{display:flex;gap:10px;align-items:center;color:var(--mu);font-size:.88rem}.chk input{width:20px;height:20px;accent-color:var(--ac);flex:none}
.feat{display:grid;gap:12px}.grid2{display:grid;gap:14px}
@media(min-width:620px){.grid2{grid-template-columns:1fr 1fr}}
.tag{font-size:.7rem;background:var(--s3);color:var(--mu);padding:3px 9px;border-radius:99px;font-weight:650;white-space:nowrap}.tag.ok{background:#12301f;color:var(--ok)}.tag.wa{background:#352a0c;color:var(--wa)}
.warn{border-color:#5c4713;background:linear-gradient(180deg,#221c0c,#14110a)}
.seg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:4px;background:var(--s1);border:1px solid var(--bd);border-radius:14px;padding:4px}
.seg button{min-height:38px;border:0;border-radius:10px;background:transparent;color:var(--mu);font:inherit;font-weight:650;cursor:pointer;display:flex;gap:8px;align-items:center;justify-content:center}
.seg button.on{background:var(--s3);color:var(--tx);box-shadow:0 2px 8px #0006}
.pill{display:inline-flex;gap:8px;align-items:center;color:var(--mu);font-size:.8rem;max-width:100%}.pill span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dot{width:8px;height:8px;border-radius:50%;background:#555;flex:none}.dot.on{background:var(--ok);box-shadow:0 0 8px var(--ok)}
.room{display:grid;gap:14px;grid-template-columns:minmax(0,1fr);align-items:start}
@media(min-width:980px){.room{grid-template-columns:minmax(0,1fr) 340px}.chat{position:sticky;top:14px;height:calc(100dvh - 28px)!important}}
.stage{position:relative;aspect-ratio:16/9;background:#000;border-radius:16px;overflow:hidden;border:1px solid var(--bd)}
.stage video,.stage .yt,.stage iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#000}
.stage .yt{display:none}
.empty{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:8px;color:var(--mu);pointer-events:none}
.hold{position:absolute;left:12px;right:12px;bottom:56px;display:none;align-items:center;gap:10px;background:#000c;border:1px solid var(--bd);border-radius:12px;padding:8px 12px;font-size:.85rem;pointer-events:none}
.sync{position:absolute;left:10px;top:10px;font-size:.7rem;background:#000a;border-radius:99px;padding:3px 10px;color:var(--mu);pointer-events:none}.sync.ok{color:var(--ok)}
.sp{width:14px;height:14px;border-radius:50%;border:2px solid #fff4;border-top-color:#fff;animation:spin .8s linear infinite;flex:none}
@keyframes spin{to{transform:rotate(360deg)}}
.chips{display:flex;gap:6px;flex-wrap:wrap}.chips button{min-height:32px;padding:0 12px;border-radius:99px;border:1px solid var(--bd);background:var(--s2);color:var(--mu);font:inherit;font-size:.8rem;font-weight:600;cursor:pointer}
.chips button.on{background:var(--ac);border-color:var(--ac);color:#fff}
details summary{color:var(--mu);font-size:.82rem;cursor:pointer;margin-bottom:8px}
.chat{display:flex;flex-direction:column;height:430px;padding:12px;gap:10px}
.msgs{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:6px;-webkit-overflow-scrolling:touch}
.msg{max-width:84%;padding:7px 12px;border-radius:14px;background:var(--s3);align-self:flex-start;word-break:break-word}
.msg.me{align-self:flex-end;background:linear-gradient(135deg,var(--ac),var(--ac2))}
.msg b{display:block;font-size:.7rem;color:var(--mu);font-weight:600}.msg time{display:block;font-size:.62rem;opacity:.6;text-align:right}
.sys{align-self:center;font-size:.74rem;color:var(--mu);text-align:center;padding:2px 8px}
.react{display:flex;gap:6px}.react button{flex:1;min-height:36px;border-radius:10px;border:1px solid var(--bd);background:var(--s2);font-size:1.1rem;cursor:pointer}.react button:active{transform:scale(.9)}
.fl{position:fixed;bottom:16%;font-size:2.2rem;pointer-events:none;z-index:60;animation:rise 2.6s ease-out forwards;display:grid;justify-items:center}.fl small{font-size:.65rem;background:#000a;border-radius:9px;padding:0 6px}
@keyframes rise{from{transform:translateY(0) scale(.7);opacity:0}12%{opacity:1;transform:translateY(-20px) scale(1.1)}to{transform:translateY(-260px) scale(1.3);opacity:0}}
#pcv{width:100%;border-radius:14px;background:var(--s2);touch-action:none;display:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.prog{height:6px;border-radius:9px;background:var(--s3);overflow:hidden}.prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--ac),var(--ac2));transition:width .3s}
.ov{position:fixed;inset:0;background:#000c;display:none;place-content:center;justify-items:center;gap:10px;font-size:1.15rem;font-weight:700;z-index:50;cursor:pointer}.ov.on{display:grid}
.mo{position:fixed;inset:0;background:#000b;display:grid;place-items:center;padding:16px;z-index:70;overflow:auto}.md{width:min(440px,100%)}
#tt{position:fixed;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translate(-50%,30px);opacity:0;pointer-events:none;background:#232838;border:1px solid var(--bd);color:var(--tx);padding:11px 18px;border-radius:14px;font-weight:600;font-size:.9rem;z-index:90;max-width:92vw;text-align:center;transition:.25s;box-shadow:0 10px 30px #000a}
#tt.on{opacity:1;transform:translate(-50%,0)}#tt.bad{background:#3a1b22;border-color:#7a2a38}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:12px}.tile{background:var(--s1);border:1px solid var(--bd);border-radius:16px;padding:14px}.tile b{display:block;font-size:1.8rem;letter-spacing:-.02em}
.urow{display:grid;gap:10px;padding:12px 0;border-bottom:1px solid var(--bd)}.urow:last-child{border:0;padding-bottom:0}
.help li{margin:0 0 8px 18px;color:var(--mu);font-size:.88rem}.help li b{color:var(--tx)}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
`;
const JS = String.raw`'use strict';
const $=s=>document.querySelector(s),A=$('#app');
const h=(t,a,...k)=>{const e=document.createElement(t);for(const x in a||{}){const v=a[x];if(v==null||v===false)continue;if(x=='class')e.className=v;else if(x=='text')e.textContent=v;else if(x=='html')e.innerHTML=v;else if(x=='style')e.style.cssText=v;else if(x.slice(0,2)=='on')e[x]=v;else e.setAttribute(x,v===true?'':v)}for(const c of k.flat(9))if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(c));return e};
const I={film:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/>',
puzzle:'<path d="M12 3a2 2 0 0 1 2 2v1h4a1 1 0 0 1 1 1v4h-1a2 2 0 1 1 0 4h1v4a1 1 0 0 1-1 1h-4v-1a2 2 0 1 0-4 0v1H6a1 1 0 0 1-1-1v-4h1a2 2 0 1 0 0-4H5V7a1 1 0 0 1 1-1h4V5a2 2 0 0 1 2-2z"/>',
send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',play:'<path d="M6 4l14 8-14 8z" fill="currentColor"/>',
key:'<circle cx="8" cy="15" r="4"/><path d="M10.9 12.1 21 2M17 6l3 3"/>',trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
back:'<path d="M15 18l-6-6 6-6"/>',help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
img:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',live:'<path d="M3 12h4l3-9 4 18 3-9h4"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'};
const ic=(n,s)=>h('span',{class:'ic',html:'<svg viewBox="0 0 24 24" width="'+(s||18)+'" height="'+(s||18)+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+I[n]+'</svg>'});
const pad=n=>(n<10?'0':'')+n,hm=t=>{const d=new Date(t);return pad(d.getHours())+':'+pad(d.getMinutes())};
const ago=t=>{if(!t)return 'hiç';const s=(Date.now()-t)/1e3;return s<60?'az önce':s<3600?Math.floor(s/60)+' dk önce':s<86400?Math.floor(s/3600)+' sa önce':Math.floor(s/86400)+' gün önce'};
const cleanCode=v=>String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
let TH=0;const toast=(m,bad)=>{const t=$('#tt');t.textContent=m;t.className='on'+(bad?' bad':'');clearTimeout(TH);TH=setTimeout(()=>t.className='',3400)};
// ---------- durum ----------
let T=localStorage.t||sessionStorage.t||'',ME=null,PT='',PTe=0,PEND=cleanCode(new URLSearchParams(location.search).get('oda'));
try{ME=JSON.parse(localStorage.me||sessionStorage.me||'null')}catch(e){}
let ws=null,RM='',V=null,yw=null,EMPTY=null,holdEl=null,syncEl=null,Y=null,yr=0,lt=0,hls=null,hp=null,st=null,off=0,hb=[],bs=0,bufT=0,lock=0,uact=0,tk=0,prevWho=null,loadedKey=null,seen=new Set(),touched=0,lws=null;
const ov=h('div',{class:'ov',onclick:()=>{ov.classList.remove('on');if(st&&st.url)pl.play()}},ic('play',34),h('span',{text:'Dokun ve başlat'}));document.body.append(ov);
const mount=(...n)=>{A.replaceChildren(...n);window.scrollTo(0,0)};
async function api(p,m,b){let r;try{r=await fetch('/api/'+p,{method:m||'GET',headers:{authorization:'Bearer '+T,'content-type':'application/json'},body:b?JSON.stringify(b):undefined})}catch(e){throw 'Sunucuya ulaşılamadı. Bağlantını kontrol et.'}
let j={};try{j=await r.json()}catch(e){}
if(r.status==401&&p!='login'){logout(true);throw 'Oturum sona erdi, tekrar giriş yap'}
if(!r.ok)throw j.error||'Bir hata oluştu';return j}
const getPT=async()=>{if(!PT||PTe<Date.now()){const j=await api('ptoken');PT=j.t;PTe=Date.now()+11*36e5}return PT};
const saveSess=()=>{const S=localStorage.t?localStorage:sessionStorage;S.t=T;S.me=JSON.stringify(ME)};
function logout(soft){leaveRoom();closeLive();for(const k of ['t','me']){localStorage.removeItem(k);sessionStorage.removeItem(k)}T='';ME=null;PT='';viewLogin(soft===true?'Oturum sona erdi, tekrar giriş yap':'')}
const enter=()=>{if(PEND){const k=PEND;PEND='';viewRoom(k,1)}else viewLobby()};
function modal(title,body,acts){const m=h('div',{class:'mo',onclick:e=>{if(e.target==m)m.remove()}},h('div',{class:'card md'},h('h2',{text:title}),body,acts?h('div',{class:'row end'},acts):null));document.body.append(m);return m}
const userChip=()=>h('div',{class:'chip'},h('span',{class:'av',text:ME.name[0].toUpperCase()}),h('span',{text:ME.name}));
const brand=r=>h('header',{class:'bar'},h('div',{class:'brand'},h('div',{class:'logo'},ic('film',20)),h('b',{text:'Bizim Sinema'})),r||null);
// ---------- giriş ----------
function viewLogin(msg){leaveRoom();closeLive();
const err=h('div',{class:'err',role:'alert',text:msg||''});
const n=h('input',{class:'in',name:'username',type:'text',autocomplete:'username',autocapitalize:'none',autocorrect:'off',spellcheck:'false',placeholder:'Kullanıcı adı',enterkeyhint:'next','aria-label':'Kullanıcı adı'});
const p=h('input',{class:'in',name:'password',type:'password',autocomplete:'current-password',placeholder:'Şifre',enterkeyhint:'go','aria-label':'Şifre'});
const eye=h('button',{type:'button',class:'btn sec sq','aria-label':'Şifreyi göster veya gizle',onclick:()=>{p.type=p.type=='password'?'text':'password'}},ic('eye'));
const rm=h('input',{type:'checkbox',checked:true});
const go=h('button',{type:'submit',class:'btn big'},'Giriş yap');
const f=h('form',{class:'card',novalidate:true,onsubmit:async e=>{e.preventDefault();const nm=n.value.trim().toLowerCase();if(!nm||!p.value){err.textContent='Kullanıcı adını ve şifreyi yaz';return}
err.textContent='';go.disabled=true;go.textContent='Giriş yapılıyor…';
try{const j=await api('login','POST',{name:nm,pass:p.value});for(const k of ['t','me']){localStorage.removeItem(k);sessionStorage.removeItem(k)}const S=rm.checked?localStorage:sessionStorage;T=j.token;ME={name:j.name,role:j.role,def:!!j.def};S.t=T;S.me=JSON.stringify(ME);enter()}
catch(x){err.textContent=String(x);go.disabled=false;go.textContent='Giriş yap'}}},
h('div',{class:'logo lg'},ic('film',24)),h('div',{},h('h1',{text:'Bizim Sinema'}),h('small',{text:PEND?'Davet kodu '+PEND+' hazır. Giriş yapınca odaya geçeceksin.':'Birlikte izle, birlikte yapboz çöz.'})),
h('label',{class:'lbl',text:'Kullanıcı adı'}),n,h('label',{class:'lbl',text:'Şifre'}),h('div',{class:'row'},p,eye),
h('label',{class:'chk'},rm,h('span',{text:'Bu cihazda beni hatırla'})),go,err);
mount(h('div',{class:'narrow stack',style:'margin-top:6vh'},f))}
// ---------- ana ekran ----------
function viewLobby(){leaveRoom();closeLive();
const code=()=>Array.from({length:5},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join('');
const k=h('input',{class:'in code',placeholder:'KOD',maxlength:8,autocapitalize:'characters',autocomplete:'off',autocorrect:'off',spellcheck:'false','aria-label':'Oda kodu'});
const join=()=>{const v=cleanCode(k.value);v?viewRoom(v,1):toast('Önce oda kodunu yaz',1)};k.onkeydown=e=>e.key=='Enter'&&join();
const feat=(i,t,d,b,fn)=>h('div',{class:'card feat'},h('div',{class:'row'},h('div',{class:'logo lg'},ic(i,22)),h('div',{},h('h2',{text:t}),h('small',{text:d}))),h('button',{class:'btn full',onclick:fn},b));
const last=localStorage.rm;
mount(h('div',{class:'narrow stack'},brand(userChip()),
h('div',{},h('h1',{text:'Merhaba, '+ME.name}),h('small',{text:'Ne yapmak istersin?'})),
ME.def?h('div',{class:'card warn'},h('div',{class:'row'},ic('lock'),h('b',{text:'Varsayılan şifre kullanılıyor'})),h('small',{text:'Güvenlik için şifreni hemen değiştir.'}),h('button',{class:'btn sm',onclick:passModal},'Şifreyi değiştir')):null,
h('div',{class:'grid2'},feat('film','Film odası','Aynı videoyu tam senkron izleyin','Film odası aç',()=>viewRoom(code(),1)),feat('puzzle','Yapboz odası','Fotoğrafı birlikte tamamlayın','Yapboz odası aç',()=>viewRoom(code(),2))),
h('div',{class:'card'},h('h2',{text:'Odaya katıl'}),h('small',{text:'Sevgilinin verdiği kodu yaz'}),k,h('button',{class:'btn sec full',onclick:join},'Katıl'),last?h('button',{class:'btn sec full',onclick:()=>viewRoom(last,1)},'Son oda: '+last+' · tekrar gir'):null),
h('div',{class:'card'},ME.role=='admin'?h('button',{class:'btn sec full',onclick:()=>viewAdmin('live')},ic('shield'),'Yönetim paneli'):null,h('button',{class:'btn sec full',onclick:passModal},ic('key'),'Şifremi değiştir'),h('button',{class:'btn sec full',onclick:()=>logout()},ic('out'),'Çıkış yap'))));
if(PEND)toast('Davet kodu: '+PEND)}
function passModal(){const o=h('input',{class:'in',type:'password',placeholder:'Mevcut şifre',autocomplete:'current-password'}),a=h('input',{class:'in',type:'password',placeholder:'Yeni şifre (en az 6 karakter)',autocomplete:'new-password'}),b=h('input',{class:'in',type:'password',placeholder:'Yeni şifre (tekrar)',autocomplete:'new-password'}),er=h('div',{class:'err'});
const m=modal('Şifreyi değiştir',h('div',{class:'stack'},o,a,b,er),[h('button',{class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),h('button',{class:'btn',onclick:async()=>{if(a.value!=b.value){er.textContent='Yeni şifreler aynı değil';return}try{const j=await api('me/pass','POST',{old:o.value,pass:a.value});T=j.token;ME.def=false;saveSess();m.remove();toast('Şifre değişti ✓');if(!RM)viewLobby()}catch(x){er.textContent=String(x)}}},'Kaydet')])}
// ---------- yönetim ----------
const closeLive=()=>{if(lws){const w=lws;lws=null;try{w.close()}catch(e){}}};
async function viewAdmin(tab){leaveRoom();closeLive();tab=tab||'live';
const seg=h('div',{class:'seg'},[['live','Canlı'],['users','Hesaplar'],['sec','Güvenlik']].map(([k,l])=>h('button',{class:tab==k?'on':'',onclick:()=>viewAdmin(k)},l)));
const body=h('div',{class:'stack'});
mount(h('div',{class:'narrow stack'},h('div',{class:'row'},h('button',{class:'btn sec sq','aria-label':'Geri',onclick:()=>viewLobby()},ic('back')),h('div',{class:'grow'},h('h2',{text:'Yönetim paneli'}),h('small',{text:'Hesaplar ve canlı odalar'}))),seg,body));
if(tab=='live')adminLive(body);else if(tab=='users')await adminUsers(body);else adminSec(body)}
function adminLive(body){const tiles=h('div',{class:'tiles'}),list=h('div',{class:'stack'});
const tile=(n,l)=>h('div',{class:'tile'},h('b',{text:n}),h('small',{text:l}));
const an=h('input',{class:'in',placeholder:'Tüm odalara duyuru yaz…',maxlength:200});
const ann=h('form',{class:'card',onsubmit:async e=>{e.preventDefault();const x=an.value.trim();if(!x)return;try{await api('announce','POST',{x});an.value='';toast('Duyuru gönderildi ✓')}catch(z){toast(z,1)}}},h('h3',{text:'Duyuru gönder'}),h('div',{class:'row'},an,h('button',{class:'btn sq',type:'submit','aria-label':'Gönder'},ic('send'))));
const kill=async c=>{if(!confirm('Oda '+c+' kapatılsın mı? İçindekiler çıkarılır ve oda sıfırlanır.'))return;try{await api('room','DELETE',{room:c});toast('Oda kapatıldı')}catch(z){toast(z,1)}};
const draw=m=>{const rs=m.rooms||[],ppl=new Set(rs.flatMap(r=>r.who));tiles.replaceChildren(tile(rs.length,'Aktif oda'),tile(ppl.size,'Çevrimiçi kişi'));
list.replaceChildren(...(rs.length?rs.map(r=>h('div',{class:'card'},h('div',{class:'row'},h('div',{class:'grow'},h('b',{text:'Oda '+r.room}),h('div',{class:'mu',text:r.who.join(', ')})),h('span',{class:'tag'+(r.playing?' ok':''),text:r.playing?'Oynuyor':'Beklemede'}),h('button',{class:'btn dng sm',onclick:()=>kill(r.room)},'Kapat')),r.site?h('small',{text:'Kaynak: '+r.site+' · '+ago(r.ts)}):null)):[h('div',{class:'card'},h('small',{text:'Şu an aktif oda yok. Biri oda açınca burada anında görünür.'}))]))};
body.append(tiles,list,ann);draw({rooms:[]});
const con=()=>{const w=new WebSocket((location.protocol=='https:'?'wss://':'ws://')+location.host+'/api/live?t='+encodeURIComponent(T));lws=w;w.onmessage=e=>{try{const m=JSON.parse(e.data);if(m.t=='live')draw(m)}catch(x){}};w.onclose=()=>{if(lws===w)setTimeout(()=>{if(lws===w)con()},2000)}};con()}
async function adminUsers(body){let us=[];try{us=await api('users')}catch(x){toast(x,1);return}
const act=async(fn,ok)=>{try{await fn();toast(ok);viewAdmin('users')}catch(x){toast(x,1)}};
const reset=n=>{const p=h('input',{class:'in',placeholder:'Yeni şifre (en az 6 karakter)',autocomplete:'off'});const m=modal(n+' için yeni şifre',p,[h('button',{class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),h('button',{class:'btn',onclick:()=>{m.remove();act(()=>api('users','PATCH',{name:n,pass:p.value}),'Şifre güncellendi ✓')}},'Kaydet')])};
const rows=us.map(u=>h('div',{class:'urow'},h('div',{class:'row'},h('span',{class:'av',text:u.name[0].toUpperCase()}),h('div',{class:'grow'},h('b',{text:u.name}),h('div',{class:'mu',text:'Son giriş: '+ago(u.last)})),h('span',{class:'tag'+(u.role=='admin'?' wa':''),text:u.role=='admin'?'Yönetici':'Kullanıcı'})),
h('div',{class:'row wrap'},h('button',{class:'btn sec sm',onclick:()=>reset(u.name)},ic('key',15),'Şifre'),u.name!='admin'?h('button',{class:'btn sec sm',onclick:()=>act(()=>api('users','PATCH',{name:u.name,role:u.role=='admin'?'user':'admin'}),'Yetki güncellendi ✓')},u.role=='admin'?'Yetkiyi al':'Yönetici yap'):null,u.name!='admin'&&u.name!=ME.name?h('button',{class:'btn dng sm',onclick:()=>{if(confirm(u.name+' silinsin mi?'))act(()=>api('users','DELETE',{name:u.name}),'Hesap silindi')}},ic('trash',15),'Sil'):null)));
const nn=h('input',{class:'in',placeholder:'kullanıcı adı (a-z, 0-9, _)',autocapitalize:'none',autocorrect:'off',autocomplete:'off',spellcheck:'false'}),pp=h('input',{class:'in',placeholder:'şifre (en az 6 karakter)',autocomplete:'off',autocapitalize:'none'}),ad=h('input',{type:'checkbox'});
const rnd=h('button',{type:'button',class:'btn sec sm',onclick:()=>{pp.value=Array.from(crypto.getRandomValues(new Uint8Array(10)),b=>'abcdefghjkmnpqrstuvwxyz23456789'[b%31]).join('')}},'Rastgele şifre üret');
body.append(h('div',{class:'card'},h('h2',{text:'Hesaplar ('+us.length+')'}),h('div',{},rows)),
h('form',{class:'card',onsubmit:e=>{e.preventDefault();act(async()=>{await api('users','POST',{name:nn.value.trim(),pass:pp.value,role:ad.checked?'admin':'user'});nn.value=pp.value=''},'Hesap açıldı ✓')}},h('h2',{text:'Yeni hesap aç'}),nn,pp,rnd,h('label',{class:'chk'},ad,h('span',{text:'Yönetici yetkisi ver'})),h('button',{class:'btn full',type:'submit'},'Hesabı oluştur')))}
function adminSec(body){body.append(h('div',{class:'card'},h('h2',{text:'Hesabım'}),ME.def?h('div',{class:'tag wa',text:'Varsayılan şifre kullanılıyor'}):null,h('button',{class:'btn full',onclick:passModal},ic('key'),'Şifremi değiştir'),
h('button',{class:'btn sec full',onclick:async()=>{if(!confirm('Tüm cihazlardaki oturumların kapatılsın mı?'))return;try{await api('me/revoke','POST');logout()}catch(x){toast(x,1)}}},'Tüm cihazlarda oturumu kapat')),
h('div',{class:'card'},h('h3',{text:'Güvenlik notları'}),h('small',{text:'Oturum anahtarı sunucuda otomatik üretilip saklanır. İstersen Cloudflare > Settings > Variables bölümünden SECRET ve ADMIN_PASS değişkenlerini kendin de tanımlayabilirsin. ADMIN_PASS değiştirilirse yönetici şifresi bir kez o değere sıfırlanır (şifreni unutursan kurtarma yolu budur).'})))}
// ---------- oda ----------
function leaveRoom(){RM='';if(ws){const w=ws;ws=null;w.onclose=null;clearInterval(w.p);try{w.close()}catch(e){}}teardown();st=null;PZ=null;IM=null;PC=[];PP=[];PU=0;clearInterval(tk);tk=0;hb=[];V=null;yw=null;ov.classList.remove('on')}
const send=m=>{if(ws&&ws.readyState==1)ws.send(JSON.stringify(m))};
const lk=()=>{lock=Date.now()+900};
const exp=()=>st.pos+((st.playing&&!st.held)?(Date.now()+off-st.at)/1e3:0);
const ytId=u=>{const m=String(u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtube-nocookie\.com\/embed\/)([\w-]{11})/i);return m?m[1]:''};
const pl={ready(){return Y?!!yr:!!(V&&V.readyState>0)},time(){return Y?(yr?Y.getCurrentTime():0):V.currentTime},
paused(){if(Y){const s=Y.getPlayerState();return s!=1&&s!=3}return V.paused},busy(){return Y?false:V.seeking},
play(){lk();if(Y){Y.playVideo();setTimeout(()=>{if(Y&&st&&st.playing&&!st.held&&[1,3].indexOf(Y.getPlayerState())<0)ov.classList.add('on')},2000)}else{const p=V.play();if(p&&p.catch)p.catch(e=>{if(e&&e.name=='NotAllowedError')ov.classList.add('on')})}},
pause(){lk();Y?Y.pauseVideo():V.pause()},seek(t){lk();Y?Y.seekTo(t,true):(V.currentTime=t)},rate(r){if(!Y&&V.playbackRate!=r)V.playbackRate=r}};
const px=(u,r)=>'/proxy?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(PT)+(r?'&r='+encodeURIComponent(r):'');
const getHls=()=>hp||(hp=new Promise((ok,no)=>{if(window.Hls)return ok();const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';s.onload=ok;s.onerror=()=>{hp=null;no()};document.head.append(s)}));
function teardown(){lt++;if(hls){try{hls.destroy()}catch(e){}hls=null}if(Y){try{Y.destroy()}catch(e){}Y=null;yr=0}if(V){V.onerror=null;try{V.pause();V.removeAttribute('src');V.load()}catch(e){}V.style.display=''}if(yw)yw.style.display='none';clearTimeout(bufT);bufT=0;bs=0}
const bad=m=>{if(syncEl)syncEl.textContent='Açılamadı';toast('Video açılamadı ('+m+'). Başka link dene, Referer ekle veya YouTube/mp4 kullan.',1)};
function load(s){teardown();ov.classList.remove('on');if(EMPTY)EMPTY.style.display=s.url?'none':'';if(!s.url){if(syncEl)syncEl.textContent='';return}const id=ytId(s.url);if(id)return loadYT(id);loadVid(s,false)}
function loadVid(s,vp){const my=lt,isH=/\.m3u8/i.test(s.url),src=vp?px(s.url,s.ref):s.url;let nr=0;
const fail=w=>{if(my!=lt)return;if(vp)return bad(w);getPT().then(()=>{if(my!=lt)return;teardown();loadVid(s,true)}).catch(()=>bad(w))};
if(isH&&!V.canPlayType('application/vnd.apple.mpegurl')){getHls().then(()=>{if(my!=lt)return;if(!window.Hls||!Hls.isSupported())return bad('tarayıcı HLS desteklemiyor');
hls=new Hls({maxBufferLength:30,backBufferLength:30});hls.on(Hls.Events.ERROR,(_,d)=>{if(!d.fatal||my!=lt)return;if(!vp)return fail(d.details);if(d.type==Hls.ErrorTypes.NETWORK_ERROR&&nr++<3)hls.startLoad();else if(d.type==Hls.ErrorTypes.MEDIA_ERROR&&nr++<3)hls.recoverMediaError();else bad(d.details)});hls.loadSource(src);hls.attachMedia(V)}).catch(()=>bad('hls.js yüklenemedi'))}
else{V.onerror=()=>fail('erişim/format');V.src=src;V.load()}}
function withYT(cb){if(window.YT&&YT.Player)return cb();(window.ytq=window.ytq||[]).push(cb);if(!window.ytl){window.ytl=1;window.onYouTubeIframeAPIReady=()=>{(window.ytq||[]).forEach(f=>f());window.ytq=[]};const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.onerror=()=>{window.ytl=0;toast('YouTube yüklenemedi',1)};document.head.append(s)}}
function loadYT(id){const my=lt;V.style.display='none';yw.style.display='block';yw.replaceChildren(h('div',{id:'ytp'}));yr=0;
withYT(()=>{if(my!=lt)return;Y=new YT.Player('ytp',{videoId:id,width:'100%',height:'100%',playerVars:{playsinline:1,rel:0,modestbranding:1,origin:location.origin},events:{onReady:()=>{if(my==lt){yr=1;tick()}},onStateChange:ytState,onError:()=>toast('YouTube: bu video gömülemiyor, başka bir video dene',1)}})})}
function ytState(e){if(!st)return;const s=e.data,t=Y?Y.getCurrentTime():0;
if(s==1){bufEnd();if(Date.now()>=lock&&!st.playing){uact=Date.now();send({t:'play',pos:t})}}
else if(s==2){if(Date.now()>=lock&&st.playing){uact=Date.now();send({t:'pause',pos:t})}}
else if(s==3)bufStart();else if(s==0){if(st.playing)send({t:'pause',pos:t})}}
let ytLast=0;function ytPoll(){if(!Y||!yr||!st)return;const t=Y.getCurrentTime(),d=t-ytLast;ytLast=t;if(Date.now()<lock||Date.now()-uact<1500)return;if(Math.abs(d-(Y.getPlayerState()==1?.5:0))>1.6&&Math.abs(t-exp())>1.6){uact=Date.now();send({t:'seek',pos:t})}}
function bufStart(){if(!st||!st.playing||bufT||bs)return;bufT=setTimeout(()=>{bufT=0;if(!bs){bs=1;send({t:'buf',b:1})}},600)}
function bufEnd(){clearTimeout(bufT);bufT=0;if(bs){bs=0;send({t:'buf',b:0})}}
function tick(){if(!RM||!st||!st.url||!pl.ready())return;
if(syncEl&&st.playing&&!st.held&&!Y){const d=pl.time()-exp();syncEl.textContent=Math.abs(d)<.6?'● Senkron':'Eşitleniyor…';syncEl.className='sync'+(Math.abs(d)<.6?' ok':'')}else if(syncEl)syncEl.textContent='';
if(Date.now()-uact<1200||pl.busy())return;
const play=st.playing&&!st.held,e=exp(),d=pl.time()-e;
if(!play){if(!pl.paused()){pl.pause()}if(Math.abs(d)>.7)pl.seek(e);pl.rate(1);return}
if(Math.abs(d)>(Y?2.2:1.3))pl.seek(e+.25);else pl.rate(d>.3?.94:d<-.3?1.06:1);
if(pl.paused())pl.play()}
function holdUI(){if(!holdEl)return;const on=st&&st.held;holdEl.style.display=on?'flex':'none';if(on)holdEl.lastChild.textContent=(hb.length?hb.join(' & '):'Biri')+' yükleniyor, bekliyoruz…'}
function setPres(who){const s=$('#pres');if(s)s.textContent=who.join(' & ')+(who.length>1?' · birlikte':' · diğer kişi bekleniyor')}
function onState(m){st=m.st;hb=m.hb||[];const who=m.who||[];
if(prevWho){for(const x of who)if(!prevWho.includes(x)&&x!=ME.name)toast(x+' odaya katıldı');for(const x of prevWho)if(!who.includes(x))toast(x+' ayrıldı')}prevWho=who;setPres(who);
const key=st.url+'|'+st.ref;if(key!=loadedKey){loadedKey=key;load(st);const u=$('#vu');if(u&&document.activeElement!==u)u.value=st.url}
holdUI();tick()}
function connect(k){const w=new WebSocket((location.protocol=='https:'?'wss://':'ws://')+location.host+'/ws?room='+encodeURIComponent(k)+'&t='+encodeURIComponent(T));ws=w;prevWho=null;const smp=[];
w.onopen=()=>{const d=$('#dot');if(d)d.className='dot on';const p=()=>{if(w.readyState==1)w.send(JSON.stringify({t:'ping',i:Date.now()}))};p();setTimeout(p,700);setTimeout(p,1600);w.p=setInterval(p,6000)};
w.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(x){return}
if(m.t=='st'){if(m.i){const rtt=Date.now()-m.i;smp.push([rtt,m.now+rtt/2-Date.now()]);if(smp.length>8)smp.shift();off=smp.reduce((a,b)=>b[0]<a[0]?b:a)[1]}else if(!smp.length)off=m.now-Date.now();onState(m)}
else if(m.t=='pz')pzSet(m.pz);else if(m.t=='pzm')pzMove(m);else if(m.t=='chat')chatAdd(m);else if(m.t=='hist')m.c.forEach(chatAdd);
else if(m.t=='sys'){chatSys(m.x);toast(m.x)}else if(m.t=='react')fly(m.e,m.n)};
w.onclose=ev=>{clearInterval(w.p);if(ws!==w)return;const d=$('#dot');if(d)d.className='dot';
if(ev.code==4000){toast('Oda yönetici tarafından kapatıldı',1);return viewLobby()}
const s=$('#pres');if(s)s.textContent='Bağlantı koptu, yeniden bağlanılıyor…';api('me').catch(()=>{});setTimeout(()=>{if(ws===w&&RM)connect(RM)},1500)}}
// ---------- sohbet ----------
function chatAdd(m){const b=$('#cb');if(!b||(m.id&&seen.has(m.id)))return;if(m.id)seen.add(m.id);const me=m.n==ME.name;
b.append(h('div',{class:'msg'+(me?' me':'')},me?null:h('b',{text:m.n}),h('span',{text:m.x}),h('time',{text:hm(m.ts)})));b.scrollTop=b.scrollHeight}
function chatSys(x){const b=$('#cb');if(!b)return;b.append(h('div',{class:'sys',text:x}));b.scrollTop=b.scrollHeight}
function fly(e,n){document.body.append(h('div',{class:'fl',style:'left:'+(8+Math.random()*80)+'%'},h('span',{text:e}),h('small',{text:n})));setTimeout(()=>{const f=document.querySelector('.fl');if(f)f.remove()},2800)}
async function invite(){const u=location.origin+'/?oda='+RM;try{if(navigator.share)await navigator.share({title:'Bizim Sinema',text:'Odaya gel: '+RM,url:u});else{await navigator.clipboard.writeText(u);toast('Davet linki kopyalandı')}}catch(e){}}
function helpModal(){const fill=u=>{const i=$('#vu');if(i)i.value=u;m.remove();toast('Link yazıldı, Yükle\'ye bas')};
const demo=(t,u)=>h('button',{class:'btn sec sm',onclick:()=>fill(u)},t);
const m=modal('Hangi linki koyacağım?',h('div',{class:'stack'},h('ul',{class:'help'},
h('li',{},h('b',{text:'YouTube linki'}),' — en kolayı. Herhangi bir video, ikisi de tam senkron izler.'),
h('li',{},h('b',{text:'.mp4 linki'}),' — kendi videon bir yerde yüklüyse doğrudan dosya adresi. iPhone\'da en sorunsuz biçim budur.'),
h('li',{},h('b',{text:'.m3u8 linki'}),' — izleme hakkın olan bir yayının akış adresi. Çalışmazsa "Referer" kutusuna kaynak sitenin adresini yaz.')),
h('small',{text:'Telif hakkı olan içerikleri yetkisiz kaynaklardan eklemeyin. Denemek için aşağıdaki herkese açık test videolarını kullan:'}),
h('div',{class:'row wrap'},demo('YouTube','https://www.youtube.com/watch?v=aqz-KE-bpKQ'),demo('MP4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'),demo('M3U8','https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'))),[h('button',{class:'btn',onclick:()=>m.remove()},'Tamam')])}
function viewRoom(k,mode){leaveRoom();closeLive();RM=k;localStorage.rm=k;st=null;loadedKey=null;seen=new Set();touched=0;done=0;Z={};
V=h('video',{playsinline:'',controls:'',preload:'auto'});yw=h('div',{class:'yt'});EMPTY=h('div',{class:'empty'},ic('film',32),h('span',{text:'Bir video linki yükle'}));
holdEl=h('div',{class:'hold'},h('i',{class:'sp'}),h('span'));syncEl=h('div',{class:'sync'});
for(const [ev,t] of [['play','play'],['pause','pause']])V.addEventListener(ev,()=>{if(Date.now()<lock||!st||!st.url||V.ended)return;uact=Date.now();if(t=='play'&&!st.playing)send({t:'play',pos:V.currentTime});if(t=='pause'&&st.playing)send({t:'pause',pos:V.currentTime})});
V.addEventListener('seeked',()=>{if(Date.now()<lock||!st||!st.url)return;if(Math.abs(V.currentTime-exp())>1){uact=Date.now();send({t:'seek',pos:V.currentTime})}});
V.addEventListener('ended',()=>{if(st&&st.playing)send({t:'pause',pos:V.currentTime})});
V.addEventListener('waiting',bufStart);V.addEventListener('playing',bufEnd);V.addEventListener('canplay',bufEnd);V.addEventListener('loadedmetadata',tick);
const dot=h('i',{class:'dot',id:'dot'}),pres=h('span',{id:'pres',text:'Bağlanıyor…'});
const mk=(n,i,t)=>h('button',{class:n==mode?'on':'',id:'t'+n,onclick:()=>{touched=1;tab(n)}},ic(i,16),t);
const seg=h('div',{class:'seg'},mk(1,'film','Film'),mk(2,'puzzle','Yapboz'));
const head=h('div',{class:'card'},h('div',{class:'row'},h('button',{class:'btn sec sq','aria-label':'Çık',onclick:()=>viewLobby()},ic('back')),h('div',{class:'grow'},h('b',{text:'Oda '+k}),h('div',{class:'pill'},dot,pres)),h('button',{class:'btn sec sq','aria-label':'Davet et',onclick:invite},ic('link')),h('button',{class:'btn sec sq','aria-label':'Yardım',onclick:helpModal},ic('help'))),seg);
const u=h('input',{class:'in',id:'vu',type:'url',placeholder:'YouTube, .mp4 veya .m3u8 linki',inputmode:'url',autocapitalize:'none',autocorrect:'off',spellcheck:'false',enterkeyhint:'go'});
const rf=h('input',{class:'in',type:'url',placeholder:'https://kaynak-site.com/',inputmode:'url',autocapitalize:'none',autocorrect:'off'});
const ld=()=>{const v=u.value.trim();if(!/^https?:\/\//i.test(v))return toast('Link http:// veya https:// ile başlamalı',1);send({t:'set',url:v,ref:rf.value.trim()});toast('Yükleniyor…')};u.onkeydown=e=>e.key=='Enter'&&ld();
const fp=h('div',{class:'card',id:'fp'},h('div',{class:'stage'},V,yw,EMPTY,syncEl,holdEl),h('div',{class:'row'},u,h('button',{class:'btn',onclick:ld},ic('play',16),'Yükle')),h('details',{},h('summary',{text:'Gelişmiş: Referer (link açılmazsa)'}),rf),h('small',{text:'Oynat, durdur ve ileri sarma ikinizde de anında uygulanır. Biri takılırsa diğeri bekler.'}));
const cnt=h('div',{class:'chips'},[12,24,48,96].map(n=>h('button',{class:n==PN?'on':'','data-n':n,onclick:e=>{PN=n;cnt.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==e.currentTarget))}},n+' parça')));
const pf=h('input',{type:'file',accept:'image/*',style:'display:none',onchange:e=>{if(e.target.files[0])pnew(e.target.files[0]);e.target.value=''}});
const cv=h('canvas',{id:'pcv'});
const pp=h('div',{class:'card',id:'pp',style:'display:none'},h('small',{text:'Parça sayısını seç, fotoğraf yükle. İkiniz de aynı anda parça taşıyabilirsiniz.'}),cnt,h('button',{class:'btn full',onclick:()=>pf.click()},ic('img'),'Fotoğraf seç ve başlat'),pf,h('div',{class:'prog'},h('i',{id:'pgb'})),h('small',{id:'pgt'}),cv);
const cb=h('div',{class:'msgs',id:'cb'}),ci=h('input',{class:'in',placeholder:'Mesaj yaz…',maxlength:500,enterkeyhint:'send',autocomplete:'off'});
const chat=h('div',{class:'card chat'},h('div',{class:'row'},ic('users',16),h('b',{text:'Sohbet'})),cb,h('div',{class:'react'},['❤️','😂','😮','👏','🔥','😢'].map(e=>h('button',{type:'button',onclick:()=>send({t:'react',e}),text:e}))),
h('form',{class:'row',onsubmit:e=>{e.preventDefault();const x=ci.value.trim();if(x){send({t:'chat',x});ci.value=''}}},ci,h('button',{class:'btn sq',type:'submit','aria-label':'Gönder'},ic('send'))));
function tab(n){fp.style.display=n==1?'':'none';pp.style.display=n==2?'':'none';$('#t1').classList.toggle('on',n==1);$('#t2').classList.toggle('on',n==2);if(n==2)pfit()}
mount(h('div',{class:'stack'},head,h('div',{class:'room'},h('div',{class:'stack'},fp,pp),chat)));
tab(mode||1);pbind();connect(k);getPT().catch(()=>{});
tk=setInterval(()=>{tick();ytPoll()},500);if(!window.rz){window.rz=1;window.addEventListener('resize',()=>{if(RM)pfit()})}}
// ---------- yapboz ----------
const PO=.03,BW=.94;let PZ=null,IM=null,PN=24,Z={},zc=0,drag=null,done=0,plt=0,PC=[],PP=[],ED=null,PU=0;
function mb32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function edges(c,r,seed){const R=mb32(seed),hz=[],vt=[];for(let y=0;y<=r;y++){hz[y]=[];for(let x=0;x<c;x++)hz[y][x]=(y==0||y==r)?0:(R()<.5?1:-1)}for(let y=0;y<r;y++){vt[y]=[];for(let x=0;x<=c;x++)vt[y][x]=(x==0||x==c)?0:(R()<.5?1:-1)}return{hz,vt}}
function side(p,x0,y0,x1,y1,nx,ny,e,L,m){if(!e){p.lineTo(x1,y1);return}const dx=(x1-x0)/L,dy=(y1-y0)/L,k=m/L;
const P=(a,b)=>{const q=.5+(a-.5)*k;return[x0+dx*L*q+nx*e*m*b,y0+dy*L*q+ny*e*m*b]};
p.lineTo(...P(.38,0));p.bezierCurveTo(...P(.42,.01),...P(.425,.04),...P(.42,.07));p.bezierCurveTo(...P(.34,.10),...P(.40,.25),...P(.5,.25));p.bezierCurveTo(...P(.60,.25),...P(.66,.10),...P(.58,.07));p.bezierCurveTo(...P(.575,.04),...P(.58,.01),...P(.62,0));p.lineTo(x1,y1)}
function ppath(i,w,hh,m){const c=PZ.c,x=i%c,y=(i/c)|0,E=ED,p=new Path2D();p.moveTo(0,0);
side(p,0,0,w,0,0,-1,E.hz[y][x],w,m);side(p,w,0,w,hh,1,0,-E.vt[y][x+1],hh,m);side(p,w,hh,0,hh,0,1,-E.hz[y+1][x],w,m);side(p,0,hh,0,0,-1,0,E.vt[y][x],hh,m);p.closePath();return p}
function pnew(f){const i=new Image;i.onload=()=>{const s=Math.min(1,720/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*s);c.height=Math.round(i.height*s);c.getContext('2d').drawImage(i,0,0,c.width,c.height);
let d='';for(let q=.8;q>=.4;q-=.1){d=c.toDataURL('image/jpeg',q);if(d.length<420000)break}
const ar=c.height/c.width,cols=Math.max(2,Math.round(Math.sqrt(PN/ar))),rows=Math.max(2,Math.round(PN/cols)),w=BW/cols,hh=BW*ar/rows,top=BW*ar+.07,p=[];
for(let k=0;k<cols*rows;k++)p.push([.02+Math.random()*(1-w-.04),top+Math.random()*(.86-hh),0]);
send({t:'pzn',pz:{img:d,c:cols,r:rows,ar,seed:Math.floor(Math.random()*2147483647),id:Date.now().toString(36),p}});toast('Yapboz hazırlanıyor…');URL.revokeObjectURL(i.src)};i.onerror=()=>toast('Fotoğraf açılamadı',1);i.src=URL.createObjectURL(f)}
function pzSet(pz){const nw=!PZ||PZ.id!=pz.id;PZ=pz;if(nw){done=0;Z={}}ED=edges(pz.c,pz.r,pz.seed);const i=new Image;i.onload=()=>{IM=i;pfit()};i.src=pz.img;if(!touched&&st&&!st.url){touched=1;const b=$('#t2');if(b)b.click()}}
function pfit(){const cv=$('#pcv');if(!cv||!PZ||!IM)return;cv.style.display='block';const w=cv.getBoundingClientRect().width;if(!w)return;cv.width=Math.min(1600,Math.round(w*2));cv.height=Math.round((PZ.ar*BW+.96)*cv.width);PU=cv.width;
const U=PU,ww=BW/PZ.c*U,hh=BW*PZ.ar/PZ.r*U,m=Math.min(ww,hh);PC=[];PP=[];for(let i=0;i<PZ.c*PZ.r;i++)PP[i]=ppath(i,ww,hh,m);pdraw()}
const pord=()=>[...PZ.p.keys()].sort((a,b)=>(PZ.p[b][2]-PZ.p[a][2])||((Z[a]||0)-(Z[b]||0)));
function pcache(i,lk2){const k=lk2?1:0;PC[i]=PC[i]||[];if(PC[i][k])return PC[i][k];const U=PU,c=PZ.c,w=BW/c*U,hh=BW*PZ.ar/PZ.r*U,m=Math.min(w,hh),mg=Math.ceil(.3*m),cx=i%c,cy=(i/c)|0;
const o=document.createElement('canvas');o.width=Math.ceil(w+2*mg);o.height=Math.ceil(hh+2*mg);const g=o.getContext('2d');g.translate(mg,mg);g.save();g.clip(PP[i]);g.drawImage(IM,-cx*w,-cy*hh,BW*U,BW*PZ.ar*U);g.restore();
if(!lk2){g.lineWidth=Math.max(1.5,U/450);g.strokeStyle='rgba(255,255,255,.75)';g.stroke(PP[i])}return PC[i][k]=o}
function pdraw(){const cv=$('#pcv');if(!cv||!PZ||!IM||!PU||!PP.length)return;const g=cv.getContext('2d'),U=PU,{c,r,ar,p}=PZ,mg=Math.ceil(.3*Math.min(BW/c,BW*ar/r)*U);g.clearRect(0,0,U,cv.height);
g.globalAlpha=.14;g.drawImage(IM,PO*U,PO*U,BW*U,BW*ar*U);g.globalAlpha=1;g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=2;g.strokeRect(PO*U,PO*U,BW*U,BW*ar*U);
let n=0;for(const i of pord()){const q=p[i];if(q[2])n++;g.drawImage(pcache(i,q[2]),Math.round(q[0]*U-mg),Math.round(q[1]*U-mg))}prog(n)}
function prog(n){const t=PZ.p.length,b=$('#pgb'),x=$('#pgt');if(b)b.style.width=(n/t*100)+'%';if(x)x.textContent=n+' / '+t+' parça yerinde';if(n==t&&!done){done=1;toast('🎉 Yapboz tamamlandı!');chatSys('🎉 Yapboz tamamlandı!')}}
function pbind(){const cv=$('#pcv'),xy=e=>{const b=cv.getBoundingClientRect();return[(e.clientX-b.left)/b.width,(e.clientY-b.top)/b.width]};
cv.onpointerdown=e=>{if(!PZ||!PU||!PP.length)return;e.preventDefault();const [mx,my]=xy(e),g=cv.getContext('2d'),U=PU;for(const i of pord().reverse()){const q=PZ.p[i];if(q[2])continue;if(g.isPointInPath(PP[i],(mx-q[0])*U,(my-q[1])*U)){drag={i,dx:mx-q[0],dy:my-q[1]};Z[i]=++zc;try{cv.setPointerCapture(e.pointerId)}catch(x){}pdraw();return}}};
cv.onpointermove=e=>{if(!drag)return;e.preventDefault();const [mx,my]=xy(e),q=PZ.p[drag.i];q[0]=mx-drag.dx;q[1]=my-drag.dy;pdraw();if(Date.now()-plt>60){plt=Date.now();send({t:'pzm',i:drag.i,x:q[0],y:q[1],l:0,live:1})}};
cv.onpointerup=cv.onpointercancel=()=>{if(!drag)return;const i=drag.i,q=PZ.p[i],W=BW/PZ.c,H=BW*PZ.ar/PZ.r,tx=PO+(i%PZ.c)*W,ty=PO+((i/PZ.c)|0)*H;drag=null;
if(Math.hypot(q[0]-tx,q[1]-ty)<Math.min(W,H)*.35){q[0]=tx;q[1]=ty;q[2]=1;if(navigator.vibrate)navigator.vibrate(20)}send({t:'pzm',i,x:q[0],y:q[1],l:q[2]});pdraw()}}
function pzMove(m){if(!PZ||!PZ.p[m.i]||(drag&&drag.i==m.i))return;PZ.p[m.i]=[m.x,m.y,m.l];Z[m.i]=++zc;pdraw()}
// ---------- başlat ----------
if(PEND)history.replaceState(null,'',location.pathname);
if(T&&ME)enter();else viewLogin();
`;
const HTML = '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0a0b10"><meta name="color-scheme" content="dark"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Bizim Sinema"><title>Bizim Sinema</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E%F0%9F%8E%AC%3C/text%3E%3C/svg%3E"><style>' + CSS + '</style></head><body><div id="app"></div><div id="tt"></div><script>' + JS + '</script></body></html>';
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://i.ytimg.com; media-src * data: blob:; connect-src * wss: ws: data: blob:; frame-src https://www.youtube.com https://www.youtube-nocookie.com; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// ---------- kripto ----------
const enc = new TextEncoder();
const b64 = b => btoa(String.fromCharCode(...new Uint8Array(b)));
const u64 = s => s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const d64 = s => atob(s.replace(/-/g, '+').replace(/_/g, '/'));
const hmac = async (k, d) => u64(b64(await crypto.subtle.sign('HMAC', await crypto.subtle.importKey('raw', enc.encode(k), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']), enc.encode(d))));
const hash = async (pw, salt) => b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' }, await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']), 256));
const sha = async s => b64(await crypto.subtle.digest('SHA-256', enc.encode(s)));
const same = (a, b) => { a = String(a); b = String(b); if (a.length != b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return !r };
const dbf = (env, path, body) => env.DO.get(env.DO.idFromName('db')).fetch('https://do' + path, { method: 'POST', body: JSON.stringify(body || {}) });
let SEC = '';
async function secret(env) { if (env.SECRET) return env.SECRET; if (SEC) return SEC; SEC = (await (await dbf(env, '/secret')).json()).s; return SEC }
async function sign(env, o) { const p = u64(btoa(JSON.stringify(o))); return p + '.' + await hmac(await secret(env), p) }
async function verify(env, t) { try { const [p, s] = String(t || '').split('.'); if (!p || !s || !same(s, await hmac(await secret(env), p))) return null; const o = JSON.parse(d64(p)); return o.e > Date.now() ? o : null } catch (e) { return null } }
const UC = new Map();
async function ident(env, tok, scope) {
  const o = await verify(env, tok); if (!o) return null;
  if (scope == 'p' ? o.k != 'p' : o.k) return null;
  let c = UC.get(o.n);
  if (!c || c.ts < Date.now() - 20000) { const r = await (await dbf(env, '/who', { name: o.n })).json(); c = { ts: Date.now(), u: r.ok ? r : null }; UC.set(o.n, c); if (UC.size > 300) UC.clear() }
  if (!c.u || c.u.v !== o.v) return null;
  return { n: o.n, r: c.u.r, v: o.v };
}
const clean = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
const roomStub = (env, code) => env.DO.get(env.DO.idFromName('room:' + code));

// ---------- Worker ----------
export default {
  async fetch(req, env) {
    const u = new URL(req.url), p = u.pathname;
    const J = (o, s = 200) => Response.json(o, { status: s, headers: { 'cache-control': 'no-store' } });
    if (!/^\/(api|ws|proxy)(\/|$)/.test(p)) return new Response(HTML, { headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'no-store', 'content-security-policy': CSP, 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'referrer-policy': 'strict-origin-when-cross-origin' } });
    try {
      if (p == '/api/login' && req.method == 'POST') {
        const b = await req.json().catch(() => ({}));
        const r = await (await dbf(env, '/login', { name: b.name, pass: b.pass, ip: req.headers.get('cf-connecting-ip') || '' })).json();
        if (r.ok) return J({ token: await sign(env, { n: r.name, v: r.v, e: Date.now() + 30 * 864e5 }), name: r.name, role: r.role, def: r.def });
        return J({ error: r.lock ? 'Çok fazla hatalı deneme. ' + r.lock + ' sn sonra tekrar dene.' : 'Kullanıcı adı veya şifre hatalı' }, r.lock ? 429 : 401);
      }
      const tok = (req.headers.get('authorization') || '').slice(7) || u.searchParams.get('t') || '';
      if (p == '/proxy') { if (!await ident(env, tok, 'p')) return new Response('yetkisiz', { status: 401 }); return proxy(req, u) }
      const me = await ident(env, tok);
      if (!me) return J({ error: 'Giriş gerekli' }, 401);
      const adm = me.r == 'admin', up = (req.headers.get('upgrade') || '').toLowerCase() == 'websocket';
      if (p == '/ws') {
        if (!up) return J({ error: 'websocket gerekli' }, 426);
        const room = clean(u.searchParams.get('room')); if (!room) return J({ error: 'oda' }, 400);
        return roomStub(env, room).fetch('https://do/ws?n=' + encodeURIComponent(me.n) + '&room=' + room, req);
      }
      if (p == '/api/me') return J({ name: me.n, role: me.r });
      if (p == '/api/ptoken') return J({ t: await sign(env, { n: me.n, v: me.v, k: 'p', e: Date.now() + 12 * 36e5 }) });
      if (p == '/api/me/pass' && req.method == 'POST') {
        const b = await req.json().catch(() => ({}));
        const r = await (await dbf(env, '/setpass', { name: me.n, old: b.old, pass: b.pass })).json();
        if (r.error) return J(r, 400); UC.delete(me.n);
        return J({ token: await sign(env, { n: me.n, v: r.v, e: Date.now() + 30 * 864e5 }) });
      }
      if (p == '/api/me/revoke' && req.method == 'POST') { await dbf(env, '/bump', { name: me.n }); UC.delete(me.n); return J({ ok: 1 }) }
      if (!adm) return J({ error: 'Yetkisiz' }, 403);
      if (p == '/api/live') { if (!up) return J({ error: 'websocket gerekli' }, 426); return env.DO.get(env.DO.idFromName('db')).fetch('https://do/adminws', req) }
      if (p == '/api/users') {
        if (req.method == 'GET') return dbf(env, '/list');
        const b = await req.json().catch(() => ({})); b.by = me.n; if (b.name) UC.delete(String(b.name).toLowerCase());
        return dbf(env, req.method == 'DELETE' ? '/del' : req.method == 'PATCH' ? '/edit' : '/add', b);
      }
      if (p == '/api/room' && req.method == 'DELETE') {
        const b = await req.json().catch(() => ({})), code = clean(b.room); if (!code) return J({ error: 'oda' }, 400);
        await roomStub(env, code).fetch('https://do/kill', { method: 'POST' }); await dbf(env, '/presence', { room: code, who: [] }); return J({ ok: 1 });
      }
      if (p == '/api/announce' && req.method == 'POST') {
        const b = await req.json().catch(() => ({})), x = String(b.x || '').trim().slice(0, 200); if (!x) return J({ error: 'Mesaj boş' }, 400);
        const rs = await (await dbf(env, '/rooms')).json();
        await Promise.all(rs.slice(0, 50).map(r => roomStub(env, r.room).fetch('https://do/announce', { method: 'POST', body: JSON.stringify({ x }) }).catch(() => { })));
        return J({ ok: 1, rooms: rs.length });
      }
      return J({ error: 'yok' }, 404);
    } catch (e) { return J({ error: 'Sunucu hatası' }, 500) }
  }
};

// ---------- Proxy (CORS + Referer; SSRF ve kötüye kullanım korumalı) ----------
const PRIV = /^(0|10|127)\.|^169\.254\.|^172\.(1[6-9]|2\d|3[01])\.|^192\.168\.|^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.|^(22[4-9]|2[3-5]\d)\./;
function okTarget(t, self) {
  if (!/^https?:$/.test(t.protocol)) return false;
  const h = t.hostname.toLowerCase();
  if (h == self || h == 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal') || h.startsWith('[')) return false;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h) && PRIV.test(h)) return false;
  if (/^\d+$/.test(h) || /^0x/i.test(h)) return false;
  const pt = t.port; if (pt && !(pt == '80' || pt == '443' || /^8\d{3}$/.test(pt))) return false;
  return true;
}
async function proxy(req, u) {
  let t; try { t = new URL(u.searchParams.get('u')) } catch (e) { return new Response('bad url', { status: 400 }) }
  if (!okTarget(t, u.hostname)) return new Response('engellendi', { status: 403 });
  const hd = new Headers({ 'user-agent': UA }), rg = req.headers.get('range'), ref = u.searchParams.get('r') || '', tok = u.searchParams.get('t') || '';
  if (rg) hd.set('range', rg);
  if (ref) try { const ru = new URL(ref); hd.set('referer', ref); hd.set('origin', ru.origin) } catch (e) { }
  let up; try { up = await fetch(t, { headers: hd, redirect: 'follow' }) } catch (e) { return new Response('kaynak açılamadı', { status: 502 }) }
  let fu; try { fu = new URL(up.url) } catch (e) { fu = t }
  if (!okTarget(fu, u.hostname)) return new Response('engellendi', { status: 403 });
  const ct = (up.headers.get('content-type') || '').toLowerCase(), path = fu.pathname.toLowerCase();
  const isPl = /mpegurl/.test(ct) || /\.m3u8?$/.test(path);
  const okCt = isPl || /^(video|audio)\//.test(ct) || /(octet-stream|mp2t|mp4|mpeg|webm|ogg|aac|binary|vtt|image\/)/.test(ct) || !ct || /\.(ts|m4s|mp4|m4v|m4a|aac|vtt|webvtt|key|mkv|webm)$/.test(path);
  const oh = new Headers({ 'access-control-allow-origin': '*', 'access-control-expose-headers': '*', 'x-content-type-options': 'nosniff', 'content-security-policy': 'sandbox' });
  if (!up.ok && up.status != 206) return new Response(null, { status: up.status, headers: oh });
  if (!okCt) return new Response('desteklenmeyen içerik', { status: 415, headers: oh });
  if (isPl) {
    if (+up.headers.get('content-length') > 4e6) return new Response('çok büyük', { status: 413, headers: oh });
    const txt = await up.text();
    if (!txt.trimStart().startsWith('#EXTM3U')) return new Response('geçersiz liste', { status: 415, headers: oh });
    const wrap = x => { if (/^data:/i.test(x)) return x; try { return '/proxy?u=' + encodeURIComponent(new URL(x, fu).href) + '&t=' + encodeURIComponent(tok) + (ref ? '&r=' + encodeURIComponent(ref) : '') } catch (e) { return x } };
    const out = txt.split(/\r?\n/).map(l => { l = l.trim(); return !l ? l : l[0] == '#' ? l.replace(/URI="([^"]+)"/g, (_, x) => 'URI="' + wrap(x) + '"') : wrap(l) }).join('\n');
    oh.set('content-type', 'application/vnd.apple.mpegurl'); oh.set('cache-control', 'no-store');
    return new Response(out, { status: 200, headers: oh });
  }
  for (const k of ['content-type', 'content-range', 'accept-ranges', 'content-length', 'etag', 'last-modified']) if (up.headers.get(k)) oh.set(k, up.headers.get(k));
  oh.set('cache-control', 'private, max-age=3600');
  return new Response(up.body, { status: up.status, headers: oh });
}

// ---------- Durable Object: "db" = kullanıcılar + canlı panel, "room:KOD" = oda ----------
const fresh = () => ({ url: '', ref: '', playing: false, held: false, pos: 0, at: Date.now(), by: '', rev: 0 });
export class Do {
  constructor(s, env) {
    this.s = s; this.env = env; this.rl = new Map(); this.hb = []; this.pzi = null; this.ok = 0;
    s.blockConcurrencyWhile(async () => {
      const g = await s.storage.get(['st', 'pzp', 'chat', 'code', 'rooms']);
      this.st = g.get('st') || fresh(); this.pzp = g.get('pzp') || null; this.chat = g.get('chat') || []; this.code = g.get('code') || ''; this.rooms = g.get('rooms') || {};
    });
  }
  socks() { return this.s.getWebSockets().filter(w => w.readyState === 1) }
  all(str) { this.socks().forEach(w => { try { w.send(str) } catch (e) { } }) }
  async init() {
    if (this.ok) return; const S = this.s.storage, AP = this.env.ADMIN_PASS || '', ev = AP ? await sha(AP) : '';
    let ad = await S.get('u:admin');
    if (!ad) { const pw = AP || 'admin123', salt = crypto.randomUUID(); await S.put('u:admin', { name: 'admin', role: 'admin', salt, h: await hash(pw, salt), v: 1, ts: Date.now(), def: !AP, ev }) }
    else if (ad.pw !== undefined) { const def = ad.pw === 'admin123'; delete ad.pw; ad.def = def; ad.v = ad.v || 1; ad.ev = ev; await S.put('u:admin', ad) }
    else if (AP && ad.ev !== ev) { const salt = crypto.randomUUID(); await S.put('u:admin', { ...ad, salt, h: await hash(AP, salt), v: (ad.v || 1) + 1, def: false, ev }) }
    this.ok = 1;
  }
  async fetch(req) {
    const u = new URL(req.url), p = u.pathname, S = this.s.storage;
    if (p == '/ws') {
      if (this.socks().length >= 8) return new Response('oda dolu', { status: 429 });
      const code = clean(u.searchParams.get('room')); if (code && !this.code) { this.code = code; await S.put('code', code) }
      const [c, sv] = Object.values(new WebSocketPair()); this.s.acceptWebSocket(sv); sv.serializeAttachment({ n: u.searchParams.get('n') });
      await S.deleteAlarm(); this.bcast();
      sv.send(JSON.stringify({ t: 'hist', c: this.chat.slice(-40) }));
      if (this.pzp) sv.send(JSON.stringify({ t: 'pz', pz: { ...this.pzp, img: await this.img() } }));
      await this.report(); return new Response(null, { status: 101, webSocket: c });
    }
    if (p == '/adminws') { const [c, sv] = Object.values(new WebSocketPair()); this.s.acceptWebSocket(sv, ['admin']); sv.send(this.snap()); return new Response(null, { status: 101, webSocket: c }) }
    if (p == '/kill') {
      this.socks().forEach(w => { try { w.close(4000, 'kapatildi') } catch (e) { } });
      await S.deleteAll(); this.st = fresh(); this.pzp = null; this.pzi = null; this.chat = []; this.code = ''; return Response.json({ ok: 1 });
    }
    const b = await req.json().catch(() => ({}));
    if (p == '/announce') { this.all(JSON.stringify({ t: 'sys', x: '📢 ' + String(b.x || '').slice(0, 200) })); return Response.json({ ok: 1 }) }
    if (p == '/presence') return this.presence(b);
    if (p == '/rooms') return Response.json(this.fresh());
    if (p == '/secret') { let s = await S.get('secret'); if (!s) { s = b64(crypto.getRandomValues(new Uint8Array(32))); await S.put('secret', s) } return Response.json({ s }) }
    await this.init();
    const nm = String(b.name || '').toLowerCase().trim().slice(0, 32), pwOk = x => typeof x == 'string' && x.length >= 6 && x.length <= 100;
    const bad = (m, s = 400) => Response.json({ error: m }, { status: s });
    if (p == '/login') {
      const now = Date.now(), kn = 'f:' + nm, ki = 'f:ip:' + String(b.ip || '?'), fn = await S.get(kn), fi = await S.get(ki);
      const lu = Math.max((fn && fn.u) || 0, (fi && fi.u) || 0); if (lu > now) return Response.json({ ok: 0, lock: Math.ceil((lu - now) / 1000) });
      const x = await S.get('u:' + nm), hh = await hash(String(b.pass || '').slice(0, 200), x ? x.salt : 'x');
      if (x && same(x.h, hh)) { await S.delete([kn]); x.last = now; await S.put('u:' + nm, x); return Response.json({ ok: 1, name: x.name, role: x.role, v: x.v || 1, def: !!x.def }) }
      const bump = (r, lim, sec) => { r = r && r.t > now - 9e5 ? r : { n: 0 }; r.n++; r.t = now; if (r.n >= lim) { r.u = now + sec * 1000; r.n = 0 } return r };
      await S.put(kn, bump(fn, 15, 120)); await S.put(ki, bump(fi, 8, 300)); return Response.json({ ok: 0 });
    }
    if (p == '/who') { const x = await S.get('u:' + nm); return Response.json(x ? { ok: 1, r: x.role, v: x.v || 1 } : { ok: 0 }) }
    if (p == '/list') return Response.json([...(await S.list({ prefix: 'u:' })).values()].map(x => ({ name: x.name, role: x.role, ts: x.ts || 0, last: x.last || 0, def: !!x.def })));
    if (p == '/add') {
      if (!/^[a-z0-9_]{3,16}$/.test(nm)) return bad('Kullanıcı adı 3-16 karakter: a-z, 0-9, _');
      if (!pwOk(b.pass)) return bad('Şifre en az 6 karakter olmalı');
      if (await S.get('u:' + nm)) return bad('Bu kullanıcı zaten var', 409);
      const salt = crypto.randomUUID(); await S.put('u:' + nm, { name: nm, role: b.role == 'admin' ? 'admin' : 'user', salt, h: await hash(b.pass, salt), v: 1, ts: Date.now() }); return Response.json({ ok: 1 });
    }
    if (p == '/edit') {
      const x = await S.get('u:' + nm); if (!x) return bad('Kullanıcı yok', 404);
      if (b.pass !== undefined) { if (!pwOk(b.pass)) return bad('Şifre en az 6 karakter olmalı'); x.salt = crypto.randomUUID(); x.h = await hash(b.pass, x.salt); x.v = (x.v || 1) + 1; x.def = false }
      if (b.role && nm != 'admin') { x.role = b.role == 'admin' ? 'admin' : 'user'; x.v = (x.v || 1) + 1 }
      await S.put('u:' + nm, x); return Response.json({ ok: 1 });
    }
    if (p == '/del') { if (nm == 'admin' || nm == String(b.by || '').toLowerCase()) return bad('Bu hesap silinemez'); await S.delete('u:' + nm); return Response.json({ ok: 1 }) }
    if (p == '/setpass') {
      const x = await S.get('u:' + nm); if (!x || !same(x.h, await hash(String(b.old || '').slice(0, 200), x.salt))) return bad('Mevcut şifre yanlış');
      if (!pwOk(b.pass)) return bad('Yeni şifre en az 6 karakter olmalı'); if (b.pass == b.old) return bad('Yeni şifre eskisiyle aynı olamaz');
      x.salt = crypto.randomUUID(); x.h = await hash(b.pass, x.salt); x.v = (x.v || 1) + 1; x.def = false; await S.put('u:' + nm, x); return Response.json({ ok: 1, v: x.v });
    }
    if (p == '/bump') { const x = await S.get('u:' + nm); if (x) { x.v = (x.v || 1) + 1; await S.put('u:' + nm, x) } return Response.json({ ok: 1 }) }
    return new Response('?', { status: 404 });
  }
  // --- canlı panel ---
  fresh() { const n = Date.now(); return Object.values(this.rooms).filter(r => r.ts > n - 150000).sort((a, b) => b.ts - a.ts) }
  snap() { return JSON.stringify({ t: 'live', rooms: this.fresh(), now: Date.now() }) }
  async presence(b) {
    const n = Date.now(), room = clean(b.room); if (!room) return Response.json({ ok: 0 });
    if (!b.who || !b.who.length) delete this.rooms[room]; else this.rooms[room] = { room, who: b.who.slice(0, 8), site: String(b.site || '').slice(0, 60), playing: !!b.playing, ts: n };
    for (const k in this.rooms) if (this.rooms[k].ts < n - 150000) delete this.rooms[k];
    await this.s.storage.put('rooms', this.rooms); const m = this.snap(); this.s.getWebSockets('admin').forEach(w => { try { w.send(m) } catch (e) { } });
    return Response.json({ ok: 1 });
  }
  async report() {
    if (!this.code) return; const who = [...new Set(this.socks().map(w => (w.deserializeAttachment() || {}).n))]; let site = '';
    try { site = this.st.url ? (/youtu/i.test(this.st.url) ? 'YouTube' : new URL(this.st.url).hostname) : '' } catch (e) { }
    try { await this.env.DO.get(this.env.DO.idFromName('db')).fetch('https://do/presence', { method: 'POST', body: JSON.stringify({ room: this.code, who, site, playing: this.st.playing && !this.st.held }) }) } catch (e) { }
  }
  // --- oda ---
  async img() {
    if (this.pzi == null) { const m = await this.s.storage.list({ prefix: 'pzi:' }); this.pzi = [...m.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1).map(e => e[1]).join('') }
    return this.pzi;
  }
  exp(now) { return this.st.pos + (this.st.playing && !this.st.held ? (now - this.st.at) / 1000 : 0) }
  hold(now) {
    const hb = []; for (const w of this.socks()) { const a = w.deserializeAttachment() || {}; if (a.b) { if (now - a.bt > 20000) { a.b = 0; w.serializeAttachment(a) } else hb.push(a.n) } }
    this.hb = hb; const held = this.st.playing && hb.length > 0;
    if (held !== this.st.held) { this.st = { ...this.st, pos: this.exp(now), at: now, held, rev: (this.st.rev || 0) + 1 }; return true }
    return false;
  }
  msg(i) { return JSON.stringify({ t: 'st', st: this.st, now: Date.now(), who: [...new Set(this.socks().map(w => (w.deserializeAttachment() || {}).n))], hb: this.hb, i }) }
  bcast() { this.all(this.msg()) }
  async webSocketMessage(ws, raw) {
    if (typeof raw != 'string' || raw.length > 900000) return;
    if (this.s.getTags(ws).includes('admin')) return;
    let m; try { m = JSON.parse(raw) } catch (e) { return }
    if (!m || typeof m != 'object') return;
    const now = Date.now(), a = ws.deserializeAttachment() || {}, n = a.n, S = this.s.storage, T = m.t;
    const rl = this.rl.get(ws) || { t: now, c: 0 }; if (now - rl.t > 1000) { rl.t = now; rl.c = 0 } rl.c++; this.rl.set(ws, rl); if (rl.c > 40) return;
    if (T == 'ping') { if (this.hold(now)) { await S.put('st', this.st); this.bcast() } else ws.send(this.msg(+m.i || 0)); if (now - (this.lp || 0) > 30000) { this.lp = now; await this.report() } return }
    if (T == 'buf') { a.b = m.b ? 1 : 0; a.bt = now; ws.serializeAttachment(a); if (this.hold(now)) await S.put('st', this.st); return this.bcast() }
    if (T == 'chat') {
      const x = String(m.x || '').trim().slice(0, 500); if (!x) return;
      const c = { id: now.toString(36) + Math.random().toString(36).slice(2, 6), n, x, ts: now };
      this.chat.push(c); if (this.chat.length > 60) this.chat.splice(0, this.chat.length - 60); await S.put('chat', this.chat);
      return this.all(JSON.stringify({ t: 'chat', ...c }));
    }
    if (T == 'react') { const e = String(m.e || ''); if (!['❤️', '😂', '😮', '👏', '🔥', '😢'].includes(e)) return; return this.all(JSON.stringify({ t: 'react', e, n })) }
    if (T == 'pzn') {
      const z = m.pz; if (!z || typeof z.img != 'string' || !/^data:image\/jpeg;base64,/.test(z.img) || z.img.length > 800000) return;
      const c = z.c | 0, r = z.r | 0; if (c < 2 || r < 2 || c > 20 || r > 20 || c * r > 200 || !Array.isArray(z.p) || z.p.length != c * r) return;
      const p = z.p.map(q => Array.isArray(q) ? [Math.max(-1, Math.min(3, +q[0] || 0)), Math.max(-1, Math.min(4, +q[1] || 0)), 0] : [0, 0, 0]);
      const pz = { c, r, ar: Math.max(.2, Math.min(5, +z.ar || 1)), seed: z.seed | 0, id: String(z.id || now).slice(0, 20), p };
      const old = await S.list({ prefix: 'pzi:' }); if (old.size) await S.delete([...old.keys()]);
      const parts = {}; z.img.match(/[\s\S]{1,100000}/g).forEach((s, i) => parts['pzi:' + String(i).padStart(3, '0')] = s); await S.put(parts);
      this.pzi = z.img; this.pzp = pz; await S.put('pzp', pz);
      return this.all(JSON.stringify({ t: 'pz', pz: { ...pz, img: z.img } }));
    }
    if (T == 'pzm') {
      const i = m.i | 0; if (!this.pzp || i < 0 || i >= this.pzp.p.length || this.pzp.p[i][2]) return;
      const x = Math.max(-1, Math.min(3, +m.x || 0)), y = Math.max(-1, Math.min(4, +m.y || 0)), l = m.l ? 1 : 0;
      this.pzp.p[i] = [x, y, l]; if (!m.live) await S.put('pzp', this.pzp);
      const o = JSON.stringify({ t: 'pzm', i, x, y, l, live: m.live ? 1 : 0 }); return this.socks().forEach(w => { if (w !== ws) try { w.send(o) } catch (e) { } });
    }
    const st = this.st, pos = Math.max(0, Math.min(1e6, +m.pos || 0)); let ns;
    if (T == 'set') {
      const url = String(m.url || '').trim().slice(0, 2000); if (!/^https?:\/\//i.test(url)) return;
      let ref = String(m.ref || '').trim().slice(0, 500); if (ref && !/^https?:\/\//i.test(ref)) ref = '';
      ns = { url, ref, playing: false, held: false, pos: 0, at: now, by: n };
      this.socks().forEach(w => { const q = w.deserializeAttachment() || {}; q.b = 0; w.serializeAttachment(q) });
      this.all(JSON.stringify({ t: 'sys', x: n + ' yeni bir video yükledi' }));
    }
    else if (T == 'play') { if (st.playing) return; ns = { ...st, playing: true, pos, at: now, by: n } }
    else if (T == 'pause') { if (!st.playing) return; ns = { ...st, playing: false, held: false, pos, at: now, by: n } }
    else if (T == 'seek') ns = { ...st, pos, at: now, by: n };
    else return;
    ns.rev = (st.rev || 0) + 1; this.st = ns; this.hold(now);
    await S.put('st', this.st); this.bcast(); if (T == 'set') await this.report();
  }
  async gone(ws) {
    try { ws.close(1000) } catch (e) { } this.rl.delete(ws); if (this.s.getTags(ws).includes('admin')) return;
    const now = Date.now(); if (this.hold(now)) await this.s.storage.put('st', this.st);
    this.bcast(); await this.report(); if (!this.socks().length) await this.s.storage.setAlarm(now + 6 * 36e5);
  }
  async webSocketClose(ws) { await this.gone(ws) }
  async webSocketError(ws) { await this.gone(ws) }
  async alarm() {
    if (this.socks().length) return;
    await this.s.storage.deleteAll(); this.st = fresh(); this.pzp = null; this.pzi = null; this.chat = []; this.code = '';
  }
}
