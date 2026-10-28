// BIZIM SINEMA v12 — Cloudflare Worker + Durable Object (tek dosya)
// Gerekli ayar (wrangler.toml): DO bağlaması (sınıf: Do). Başka bir şey gerekmez.
// İsteğe bağlı Cloudflare değişkenleri (hepsini "Secret" olarak ekle):
//   SECRET (oturum anahtarı), ADMIN_PASS (yönetici şifresi / kurtarma)
//   SPOTIFY_CLIENT_ID  -> Spotify bağlama için
//   APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY -> Apple Music bağlama için
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
.in{width:100%;min-width:0;min-height:46px;padding:0 14px;border-radius:12px;border:1px solid var(--bd);background:var(--s2);color:var(--tx);caret-color:var(--ac);font:inherit;font-size:16px;outline:0;-webkit-user-select:text;user-select:text;pointer-events:auto}
input,textarea{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}
.in:focus{border-color:var(--ac);box-shadow:0 0 0 3px #6d7cff30}
.in::placeholder{color:#677089;opacity:1}
.in:-webkit-autofill,.in:-webkit-autofill:focus{-webkit-text-fill-color:var(--tx);box-shadow:0 0 0 40px var(--s2) inset}
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
.seg button{min-height:38px;padding:0 4px;font-size:.88rem;border:0;border-radius:10px;background:transparent;color:var(--mu);font:inherit;font-weight:650;cursor:pointer;display:flex;gap:8px;align-items:center;justify-content:center}
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
#pcv{width:100%;height:60dvh;border-radius:14px;background:#0d0f16;border:1px solid var(--bd);touch-action:none;display:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;cursor:grab}
.zb{display:flex;gap:6px;flex-wrap:wrap}
.prog{height:6px;border-radius:9px;background:var(--s3);overflow:hidden}.prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--ac),var(--ac2));transition:width .3s}
.ov{position:fixed;inset:0;background:#000c;display:none;place-content:center;justify-items:center;gap:10px;font-size:1.15rem;font-weight:700;z-index:50;cursor:pointer}.ov.on{display:grid}
.mo{position:fixed;inset:0;background:#000b;display:grid;place-items:center;padding:16px;z-index:70;overflow:auto}.md{width:min(440px,100%)}
#tt{position:fixed;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translate(-50%,30px);opacity:0;pointer-events:none;background:#232838;border:1px solid var(--bd);color:var(--tx);padding:11px 18px;border-radius:14px;font-weight:600;font-size:.9rem;z-index:90;max-width:92vw;text-align:center;transition:.25s;box-shadow:0 10px 30px #000a}
#tt.on{opacity:1;transform:translate(-50%,0)}#tt.bad{background:#3a1b22;border-color:#7a2a38}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:12px}.tile{background:var(--s1);border:1px solid var(--bd);border-radius:16px;padding:14px}.tile b{display:block;font-size:1.8rem;letter-spacing:-.02em}
.urow{display:grid;gap:10px;padding:12px 0;border-bottom:1px solid var(--bd)}.urow:last-child{border:0;padding-bottom:0}
.help li{margin:0 0 8px 18px;color:var(--mu);font-size:.88rem}.help li b{color:var(--tx)}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
.seg button .lkm{font-size:.7rem;opacity:.9}
.lockc{display:grid;gap:8px;justify-items:center;text-align:center;padding:26px 14px;color:var(--mu)}
.lockc .logo{background:linear-gradient(135deg,#59506b,#3a3550);box-shadow:none}
.lv{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:4px;background:var(--s1);border:1px solid var(--bd);border-radius:12px;padding:3px}
.lv button{min-height:36px;border:0;border-radius:9px;background:transparent;color:var(--mu);font:inherit;font-size:.82rem;font-weight:650;cursor:pointer}
.lv button.on{background:var(--ac);color:#fff}.lv button.on.l1{background:var(--wa);color:#1a1405}.lv button.on.l2{background:var(--er);color:#fff}
.mu-now{display:flex;gap:12px;align-items:center}
.mu-art{width:58px;height:58px;border-radius:12px;object-fit:cover;background:var(--s3);flex:none;display:grid;place-items:center;font-size:1.6rem}
.mu-t{font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mu-res{display:grid;gap:6px}
.mu-r{display:flex;gap:10px;align-items:center;background:var(--s2);border:1px solid var(--bd);border-radius:12px;padding:6px;cursor:pointer;text-align:left;color:var(--tx);font:inherit;width:100%}
.mu-r img{width:40px;height:40px;border-radius:8px;object-fit:cover;flex:none}
.mu-r div{min-width:0}.mu-r b,.mu-r small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mu-yt{width:100%;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000;display:none}.mu-yt.tap{outline:3px solid var(--wa);outline-offset:2px;animation:mupulse 1.4s ease-in-out infinite}@keyframes mupulse{50%{outline-color:transparent}}
.mu-hint{background:#f0b4291f;border:1px solid var(--wa);border-radius:12px;padding:10px 12px;text-align:center;font-weight:650;font-size:.9rem}
.mu-ls{display:flex;flex-wrap:wrap;gap:6px}.mu-ls span{background:var(--s2);border:1px solid var(--bd);border-radius:999px;padding:3px 10px;font-size:.78rem;color:var(--mu)}.mu-ls span.ok{border-color:var(--ok);color:var(--ok)}.mu-ls span.need{border-color:var(--wa);color:var(--wa)}.mu-yt iframe{width:100%;height:100%;border:0}
.wsc{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.wpl{background:var(--s2);border:1px solid var(--bd);border-radius:12px;padding:8px 10px;display:grid;gap:2px}
.wpl.on{border-color:var(--ac);box-shadow:0 0 0 2px #6d7cff30}.wpl b{font-size:1.4rem;letter-spacing:-.02em}
.wb{display:grid;grid-template-columns:repeat(15,minmax(0,1fr));gap:1px;background:#06070b;border:1px solid var(--bd);border-radius:10px;padding:2px;-webkit-user-select:none;user-select:none;touch-action:manipulation}
.wc{aspect-ratio:1;border-radius:3px;background:#1a1d28;position:relative;display:grid;place-items:center;font-weight:800;font-size:clamp(9px,3.3vw,17px);line-height:1;color:#0a0b10;cursor:pointer;min-width:0;overflow:hidden}
.wc.p1{background:#27406b}.wc.p2{background:#1f66b0}.wc.p3{background:#6e3553}.wc.p4{background:#a33430}
.wc i{font-style:normal;font-size:.5em;font-weight:700;color:#ffffffb0;letter-spacing:0}
.wc.t{background:#f0d9a8;color:#2a1c05;box-shadow:inset 0 -2px 0 #b99a5a}.wc.t.j{color:#b3261e}
.wc.t.n{outline:2px solid var(--ac);outline-offset:-2px}.wc.t.pd{background:#ffe9a8;outline:2px dashed var(--ac2);outline-offset:-2px}
.wc small.v{position:absolute;right:2px;bottom:1px;font-size:.52em;font-weight:700;color:inherit;opacity:.8}
.rk{display:flex;gap:6px;justify-content:center;min-height:50px}
.rt{width:12vw;max-width:48px;aspect-ratio:1;border-radius:8px;border:0;background:#f0d9a8;color:#2a1c05;font:inherit;font-weight:800;font-size:1.25rem;box-shadow:inset 0 -3px 0 #b99a5a;position:relative;cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.rt small{position:absolute;right:4px;bottom:2px;font-size:.5em;font-weight:700}.rt.sel{outline:3px solid var(--ac);transform:translateY(-4px)}
.wprv{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;font-size:.85rem;min-height:26px}.wprv span{background:var(--s2);border:1px solid var(--bd);border-radius:8px;padding:2px 8px;font-weight:700}.wprv .ok{border-color:var(--ok);color:var(--ok)}.wprv .unk{border-color:var(--wa);color:var(--wa)}.wprv .bad{border-color:var(--er);color:var(--er)}
.un{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}.un div{background:#f0d9a8;color:#2a1c05;border-radius:8px;padding:4px 0;text-align:center;font-weight:800}.un div small{display:block;font-size:.7rem;font-weight:700;opacity:.75}.un div.z{opacity:.3}
.wlog{display:grid;gap:3px;max-height:120px;overflow:auto;font-size:.78rem;color:var(--mu)}
.wc.po{background:#f0d9a855;color:#fff;outline:2px dashed var(--ac2);outline-offset:-2px;pointer-events:none}.wc.pd{touch-action:none;cursor:grab}.wc.dt{outline:3px solid var(--ac2);outline-offset:-3px;filter:brightness(1.25)}.wc:focus-visible,.rt:focus-visible{outline:3px solid var(--ac);outline-offset:1px}
.dgh{position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-70%) scale(1.15);box-shadow:0 8px 20px #0008;width:44px;display:grid;place-items:center}body.dragging{user-select:none;-webkit-user-select:none;cursor:grabbing}
.az{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.az button{min-height:40px;border-radius:9px;border:1px solid var(--bd);background:var(--s2);color:var(--tx);font:inherit;font-weight:700;cursor:pointer}
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
I.word='<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 16l2.5-8 2.5 8M8 13.5h3M15 8v8M15 12h3"/>';I.music='<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>';I.plus='<path d="M12 5v14M5 12h14"/>';I.minus='<path d="M5 12h14"/>';I.fit='<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>';I.pause='<path d="M8 5v14M16 5v14"/>';I.back10='<path d="M11 5 4 12l7 7M20 5l-7 7 7 7"/>';I.fwd10='<path d="M13 5l7 7-7 7M4 5l7 7-7 7"/>';
const ic=(n,s)=>h('span',{class:'ic',html:'<svg viewBox="0 0 24 24" width="'+(s||18)+'" height="'+(s||18)+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+I[n]+'</svg>'});
const pad=n=>(n<10?'0':'')+n,hm=t=>{const d=new Date(t);return pad(d.getHours())+':'+pad(d.getMinutes())};
const ago=t=>{if(!t)return 'hiç';const s=(Date.now()-t)/1e3;return s<60?'az önce':s<3600?Math.floor(s/60)+' dk önce':s<86400?Math.floor(s/3600)+' sa önce':Math.floor(s/86400)+' gün önce'};
const cleanCode=v=>String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
let TH=0;const toast=(m,bad)=>{const t=$('#tt');t.textContent=m;t.className='on'+(bad?' bad':'');clearTimeout(TH);TH=setTimeout(()=>t.className='',3400)};
// ---------- durum ----------
let T=localStorage.t||sessionStorage.t||'',ME=null,PT='',PTe=0,PEND=cleanCode(new URLSearchParams(location.search).get('oda'));
try{ME=JSON.parse(localStorage.me||sessionStorage.me||'null')}catch(e){}
let LK={film:0,puzzle:0,music:0,word:2},PM=0,MS=null,WG=null,CFG=null,WP=new Map(),WS=-1,WU={};
let ws=null,RM='',V=null,yw=null,EMPTY=null,holdEl=null,syncEl=null,Y=null,yr=0,lt=0,hls=null,hp=null,st=null,off=0,hb=[],bs=0,bufT=0,lock=0,uact=0,tk=0,prevWho=null,loadedKey=null,seen=new Set(),touched=0,lws=null,LT=0,ROOM_MODE=1,ROOM_NEW=0,AUTO=0,WPO=null,PSL='',PST=0,MSH={},WPQ={mv:0,s:0},WQ=null,WQT=0,PSEQ=0,WPV=null,WBZ=0,WBT=0;
const ov=h('div',{class:'ov',onclick:()=>{ov.classList.remove('on');if(st&&st.url)pl.play()}},ic('play',34),h('span',{text:'Dokun ve başlat'}));document.body.append(ov);
const mount=(...n)=>{A.replaceChildren(...n);window.scrollTo(0,0)};
async function api(p,m,b){let r;try{r=await fetch('/api/'+p,{method:m||'GET',headers:{authorization:'Bearer '+T,'content-type':'application/json'},body:b?JSON.stringify(b):undefined})}catch(e){throw 'Sunucuya ulaşılamadı. Bağlantını kontrol et.'}
let j={};try{j=await r.json()}catch(e){}
if(r.status==401&&p!='login'){logout(true);throw 'Oturum sona erdi, tekrar giriş yap'}
if(!r.ok)throw j.error||'Bir hata oluştu';return j}
const getPT=async()=>{if(!PT||PTe<Date.now()){const j=await api('ptoken');PT=j.t;PTe=Date.now()+11*36e5}return PT};
const saveSess=()=>{const S=localStorage.t?localStorage:sessionStorage;S.t=T;S.me=JSON.stringify(ME)};
function logout(soft){PEND='';PM=0;AUTO=0;leaveRoom();closeLive();for(const k of ['t','me']){localStorage.removeItem(k);sessionStorage.removeItem(k)}T='';ME=null;PT='';viewLogin(soft===true?'Oturum sona erdi, tekrar giriş yap':'')}
const enter=()=>{if(SPC){const c=SPC;SPC='';spExchange(c)}if(PEND&&AUTO){const k=PEND;PEND='';PM=0;AUTO=0;viewLobby().then(()=>joinByCode(k))}else viewLobby()};
const canUse=a=>{const v=LK[a]|0;return v==0||(v==1&&ME&&ME.role=='admin')};
const LVN=['Açık','Yöneticiler','Kilitli'];
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
h('div',{class:'logo lg'},ic('film',24)),h('div',{},h('h1',{text:'Bizim Sinema'}),h('small',{text:PEND?'Davet kodu '+PEND+' hazır. Giriş yapınca ana menüden katılabilirsin.':'Birlikte izle, birlikte yapboz çöz.'})),
h('label',{class:'lbl',text:'Kullanıcı adı'}),n,h('label',{class:'lbl',text:'Şifre'}),h('div',{class:'row'},p,eye),
h('label',{class:'chk'},rm,h('span',{text:'Bu cihazda beni hatırla'})),go,err);
mount(h('div',{class:'narrow stack',style:'margin-top:6vh'},f))}
// ---------- ana ekran ----------
const newCode=()=>Array.from({length:5},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join('');
const modeOk=m=>m==1?canUse('film'):m==2?(canUse('puzzle')||canUse('music')):canUse('word');
const MODEN={1:'Film',2:'Yapboz / Müzik',3:'Kelimelik'};
async function joinByCode(raw){const v=cleanCode(raw);if(!v)return toast('Önce oda kodunu yaz',1);
let r;try{r=await api('roomq?code='+encodeURIComponent(v))}catch(e){return toast(String(e),1)}
if(!r.exists)return toast('Bu kodla açık bir oda bulunamadı. Kodu kontrol et.',1);
if(!modeOk(r.mode))return toast(MODEN[r.mode]+' odaları şu an kilitli',1);
viewRoom(v,r.mode,false)}
async function createRoom(mode){for(let n=0;n<6;n++){const c=newCode();let r;try{r=await api('roomq?code='+c)}catch(e){return toast(String(e),1)}if(!r.exists)return viewRoom(c,mode,true)}toast('Oda kodu üretilemedi, tekrar dene',1)}
async function viewLobby(){leaveRoom();closeLive();try{LK=await api('locks')}catch(e){}
const k=h('input',{class:'in code',placeholder:'KOD',maxlength:8,autocapitalize:'characters',autocomplete:'off',autocorrect:'off',spellcheck:'false','aria-label':'Oda kodu'});
const join=()=>joinByCode(k.value);k.onkeydown=e=>{if(e.key=='Enter')join()};
const feat=(i,t,d,b,fn,lkd)=>h('div',{class:'card feat'},h('div',{class:'row'},h('div',{class:'logo lg'},ic(i,22)),h('div',{},h('h2',{text:t}),h('small',{text:d}))),h('button',{class:'btn full',disabled:!!lkd,onclick:fn},lkd?'🔒 Kilitli':b));
const last=localStorage.rm;
mount(h('div',{class:'narrow stack'},brand(userChip()),
h('div',{},h('h1',{text:'Merhaba, '+ME.name}),h('small',{text:'Ne yapmak istersin?'})),
PEND?h('div',{class:'card'},h('h2',{text:'Davet var: '+PEND}),h('small',{text:'Biri seni bu odaya çağırdı. Oda türü sunucudan otomatik alınır.'}),h('div',{class:'row wrap'},h('button',{class:'btn',onclick:()=>{const c=PEND;PEND='';joinByCode(c)}},'Odaya katıl'),h('button',{class:'btn sec',onclick:()=>{PEND='';viewLobby()}},'Şimdilik değil'))):null,
ME.def?h('div',{class:'card warn'},h('div',{class:'row'},ic('lock'),h('b',{text:'Varsayılan şifre kullanılıyor'})),h('small',{text:'Güvenlik için şifreni hemen değiştir.'}),h('button',{class:'btn sm',onclick:passModal},'Şifreyi değiştir')):null,
h('div',{class:'grid2'},feat('film','Film odası','Aynı videoyu tam senkron izleyin','Film odası aç',()=>createRoom(1),!canUse('film')),feat('puzzle','Yapboz ve müzik','Birlikte yapboz çözün, birlikte müzik dinleyin','Yapboz odası aç',()=>createRoom(2),!canUse('puzzle')&&!canUse('music'))),
feat('word','Kelimelik','İki kişilik Türkçe kelime oyunu'+(LK.word==1?' (şimdilik yöneticilere açık)':''),'Kelimelik odası aç',()=>createRoom(3),!canUse('word')),
h('div',{class:'card'},h('h2',{text:'Odaya katıl'}),h('small',{text:'Oda kodunu yaz. Odanın türü (Film, Yapboz, Kelimelik) otomatik bulunur.'}),k,h('button',{class:'btn sec full',onclick:join},'Katıl'),last?h('button',{class:'btn sec full',onclick:()=>joinByCode(last)},'Son oda: '+last+' · tekrar gir'):null),
h('div',{class:'card'},ME.role=='admin'?h('button',{class:'btn sec full',onclick:()=>viewAdmin('live')},ic('shield'),'Yönetim paneli'):null,h('button',{class:'btn sec full',onclick:passModal},ic('key'),'Şifremi değiştir'),h('button',{class:'btn sec full',onclick:()=>logout()},ic('out'),'Çıkış yap'))));
LT=setInterval(async()=>{try{const n=await api('locks');if(JSON.stringify(n)!=JSON.stringify(LK)){LK=n;const v=k.value;await viewLobby();const k2=$('.in.code');if(k2)k2.value=v}}catch(e){}},4000)}
function passModal(){const o=h('input',{class:'in',type:'password',placeholder:'Mevcut şifre',autocomplete:'current-password'}),a=h('input',{class:'in',type:'password',placeholder:'Yeni şifre (en az 6 karakter)',autocomplete:'new-password'}),b=h('input',{class:'in',type:'password',placeholder:'Yeni şifre (tekrar)',autocomplete:'new-password'}),er=h('div',{class:'err'});
const m=modal('Şifreyi değiştir',h('div',{class:'stack'},o,a,b,er),[h('button',{class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),h('button',{class:'btn',onclick:async()=>{if(a.value!=b.value){er.textContent='Yeni şifreler aynı değil';return}try{const j=await api('me/pass','POST',{old:o.value,pass:a.value});T=j.token;ME.def=false;saveSess();m.remove();toast('Şifre değişti ✓');if(!RM)viewLobby()}catch(x){er.textContent=String(x)}}},'Kaydet')])}
// ---------- yönetim ----------
const closeLive=()=>{if(lws){const w=lws;lws=null;try{w.close()}catch(e){}}};
async function viewAdmin(tab){leaveRoom();closeLive();tab=tab||'live';
const seg=h('div',{class:'seg'},[['live','Canlı'],['users','Hesaplar'],['locks','Kilitler'],['sec','Güvenlik']].map(([k,l])=>h('button',{class:tab==k?'on':'',onclick:()=>viewAdmin(k)},l)));
const body=h('div',{class:'stack'});
mount(h('div',{class:'narrow stack'},h('div',{class:'row'},h('button',{class:'btn sec sq','aria-label':'Geri',onclick:()=>viewLobby()},ic('back')),h('div',{class:'grow'},h('h2',{text:'Yönetim paneli'}),h('small',{text:'Hesaplar ve canlı odalar'}))),seg,body));
if(tab=='live')adminLive(body);else if(tab=='users')await adminUsers(body);else if(tab=='locks')await adminLocks(body);else adminSec(body)}
async function adminLocks(body){try{LK=await api('locks')}catch(x){toast(x,1)}
const A=[['film','Film izleme','Film odası ve video senkronu'],['puzzle','Yapboz','Yapboz tahtası'],['music','Müzik','Birlikte müzik dinleme (yapboz sekmesinin içinde)'],['word','Kelimelik','İki kişilik kelime oyunu']];
const set=async(k,v)=>{try{LK=await api('locks','POST',{k,v});toast('Kaydedildi ✓');viewAdmin('locks')}catch(x){toast(x,1)}};
body.append(h('div',{class:'card'},h('h2',{text:'Alan kilitleri'}),h('small',{text:'Açık: herkes kullanır. Yöneticiler: yalnızca yönetici hesapları (siz ve yönetici yaptığınız kişiler) girer. Kilitli: kimse giremez. Değişiklik odalardaki herkese anında yansır.'})),
...A.map(([k,t,d])=>h('div',{class:'card'},h('div',{class:'row'},h('div',{class:'grow'},h('b',{text:t}),h('div',{class:'mu',text:d})),h('span',{class:'tag'+(LK[k]==0?' ok':LK[k]==1?' wa':''),text:LVN[LK[k]|0]})),h('div',{class:'lv'},[0,1,2].map(v=>h('button',{class:(LK[k]==v?'on l'+v:''),onclick:()=>set(k,v)},LVN[v]))))))}
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
function dictCard(){
const info=h('div',{class:'stack',style:'gap:6px'}),accBox=h('div',{class:'stack',style:'gap:6px'}),tdkc=h('input',{type:'checkbox'}),fi=h('input',{type:'file',accept:'.dic,.txt,text/plain',style:'display:none'}),
url=h('input',{class:'in',value:'https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/tr/index.dic',autocapitalize:'none',autocorrect:'off',spellcheck:'false'});
const showTest=r=>modal('Sözlük sınaması'+(r.full?'':' (tam sözlük kurulu değil)'),h('div',{class:'stack',style:'gap:4px'},...r.r.map(x=>h('div',{class:'row'},h('b',{text:(x.e==x.g?'✓ ':'✗ ')+x.w}),h('small',{text:x.e?'geçerli olmalı':'geçersiz olmalı'})))),[h('button',{class:'btn sec',onclick:e=>e.target.closest('.mo').remove()},'Kapat')]);
const run=async(fn,ok)=>{try{const r=await fn();if(ok)toast(ok);await load();return r}catch(x){toast(x,1)}};
async function load(){const s=await api('dict');tdkc.checked=!!s.tdk;
info.replaceChildren(h('small',{text:'Yerleşik çekirdek: '+s.seed+' kelime. '+(s.meta?'Kurulu sözlük: '+s.meta.n+' kök ('+s.v+' fiil kökü), '+new Date(s.meta.ts).toLocaleString('tr-TR')+' – '+s.meta.src+'.':'Tam sözlük kurulu DEĞİL: yalnız yerleşik çekirdek var, bilinmeyen kelimeler rakip onayına gider.')+(s.extra?' Elle eklenen: '+s.extra+'.':'')}));
accBox.replaceChildren(...(s.acc.length?[h('small',{text:'Oyuncuların kabul ettiği ama sözlükte olmayan kelimeler:'}),...s.acc.map(x=>h('div',{class:'row'},h('b',{text:x.w}),h('small',{text:x.c+'×'}),h('button',{type:'button',class:'btn sec sm',onclick:()=>run(()=>api('dict','POST',{a:'add',w:[x.w]}),'Sözlüğe eklendi ✓')},'Sözlüğe ekle'),h('button',{type:'button',class:'btn sec sm',onclick:()=>run(()=>api('dict','POST',{a:'rm',w:[x.w]}))},'Yoksay')))]:[h('small',{text:'Kabul edilmiş yeni kelime yok.'})]))}
tdkc.onchange=()=>run(()=>api('dict','POST',{a:'cfg',tdk:tdkc.checked?1:0}),'Kaydedildi ✓');
fi.onchange=async()=>{const f=fi.files[0];fi.value='';if(!f)return;
if(!/\.(dic|txt)$/i.test(f.name))return toast('Bu bir sözlük dosyası değil. .dic ya da .txt uzantılı sözlük dosyasını seç.',1);
const b=await f.arrayBuffer();let t;try{t=new TextDecoder('utf-8',{fatal:true}).decode(b)}catch(e){t=new TextDecoder('windows-1254').decode(b)}
const seen=new Set();for(const l of t.split(/\r?\n/)){const w=l.split('/')[0].split('\t')[0].trim();if(w&&!/\s/.test(w))seen.add(w)}t=[...seen].join('\n');
toast('Yükleniyor…');const r=await run(()=>api('dict','POST',{a:'install',text:t}),'Sözlük kuruldu ✓');if(r)showTest(await api('dict','POST',{a:'test'}))};
load().catch(x=>toast(x,1));
return h('div',{class:'card'},h('h2',{text:'Kelimelik sözlüğü'}),info,
h('small',{text:'Sözlük adresi (Hunspell .dic ya da her satırda bir kelime olan metin dosyası). Lisansını kullanmadan önce kontrol et.'}),url,
h('button',{type:'button',class:'btn full',onclick:async()=>{toast('İndiriliyor ve kuruluyor…');const r=await run(()=>api('dict','POST',{a:'install',url:url.value.trim()}),'Sözlük kuruldu ✓');if(r)showTest(await api('dict','POST',{a:'test'}))}},'Sözlüğü internetten kur'),
h('button',{type:'button',class:'btn sec full',onclick:()=>fi.click()},'Sözlüğü dosyadan yükle'),fi,
h('button',{type:'button',class:'btn sec full',onclick:async()=>{try{showTest(await api('dict','POST',{a:'test'}))}catch(x){toast(x,1)}}},'Sözlüğü sına'),
h('label',{class:'chk'},tdkc,h('span',{text:'Bilinmeyen kelimeler için TDK’ye de sor (isteğe bağlı, yavaş ve güvenilmez olabilir)'})),accBox)}
function adminSec(body){body.append(dictCard());body.append(h('div',{class:'card'},h('h2',{text:'Hesabım'}),ME.def?h('div',{class:'tag wa',text:'Varsayılan şifre kullanılıyor'}):null,h('button',{class:'btn full',onclick:passModal},ic('key'),'Şifremi değiştir'),
h('button',{class:'btn sec full',onclick:async()=>{try{const r=await api('tdktest?w=av');modal('TDK bağlantı testi',h('pre',{style:'white-space:pre-wrap;word-break:break-all;font-size:.8rem',text:JSON.stringify(r,null,1)}),[h('button',{class:'btn sec',onclick:e=>e.target.closest('.mo').remove()},'Kapat')])}catch(x){toast(x,1)}}},'TDK sözlük bağlantısını sına'),
h('button',{class:'btn sec full',onclick:async()=>{if(!confirm('Tüm cihazlardaki oturumların kapatılsın mı?'))return;try{await api('me/revoke','POST');logout()}catch(x){toast(x,1)}}},'Tüm cihazlarda oturumu kapat')),
h('div',{class:'card'},h('h3',{text:'Güvenlik notları'}),h('small',{text:'Oturum anahtarı sunucuda otomatik üretilip saklanır. İstersen Cloudflare > Settings > Variables bölümünden SECRET ve ADMIN_PASS değişkenlerini kendin de tanımlayabilirsin. ADMIN_PASS değiştirilirse yönetici şifresi bir kez o değere sıfırlanır (şifreni unutursan kurtarma yolu budur).'})))}
// ---------- oda ----------
function leaveRoom(){clearInterval(LT);LT=0;RM='';clearTimeout(wsTm);wsTm=0;wsq=[];wsTry=0;if(ws){const w=ws;ws=null;w.onclose=null;clearInterval(w.p);try{w.close()}catch(e){}}teardown();mstop();MS=null;WG=null;WP=new Map();WS=-1;st=null;PZ=null;IM=null;PC=[];PP=[];PU=0;clearInterval(tk);tk=0;hb=[];V=null;yw=null;ov.classList.remove('on')}
let wsq=[],wsTry=0,wsTm=0,wsLast=0;
const send=m=>{const s=JSON.stringify(m);if(ws&&ws.readyState==1){try{ws.send(s);return}catch(e){}}if(m.t!='ping'&&m.t!='pzm'&&wsq.length<30)wsq.push(s);if(RM&&(!ws||ws.readyState>1))reconnectNow()};
function reconnectNow(){if(!RM)return;clearTimeout(wsTm);wsTm=0;if(ws&&ws.readyState==1&&Date.now()-wsLast<12000){try{ws.send(JSON.stringify({t:'ping',i:Date.now()}));return}catch(e){}}if(ws){const old=ws;ws=null;old.onclose=null;clearInterval(old.p);try{old.close()}catch(e){}}connect(RM)}
if(!window._netBind){window._netBind=1;document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='visible'&&RM)reconnectNow()});window.addEventListener('pageshow',()=>{if(RM)reconnectNow()});window.addEventListener('online',()=>{if(RM){wsTry=0;reconnectNow()}})}
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
function onState(m){st=m.st;hb=m.hb||[];const who=m.who||[];MSH=m.mh||{};musicState(m.ms||null);
if(prevWho){for(const x of who)if(!prevWho.includes(x)&&x!=ME.name)toast(x+' odaya katıldı');for(const x of prevWho)if(!who.includes(x))toast(x+' ayrıldı')}prevWho=who;setPres(who);
const key=st.url+'|'+st.ref;if(canUse('film')&&key!=loadedKey){loadedKey=key;load(st);const u=$('#vu');if(u&&document.activeElement!==u)u.value=st.url}
holdUI();tick()}
function connect(k,mode){clearTimeout(wsTm);wsTm=0;const w=new WebSocket((location.protocol=='https:'?'wss://':'ws://')+location.host+'/ws?room='+encodeURIComponent(k)+'&mode='+encodeURIComponent(mode||ROOM_MODE||1)+(ROOM_NEW?'&new=1':'')+'&t='+encodeURIComponent(T));ws=w;wsLast=Date.now();const smp=[];
w.onopen=()=>{PSL='';wsTry=0;wsLast=Date.now();const d=$('#dot');if(d)d.className='dot on';const p=()=>{if(w.readyState!=1)return;if(Date.now()-wsLast>15000){reconnectNow();return}try{w.send(JSON.stringify({t:'ping',i:Date.now()}))}catch(e){}};p();setTimeout(p,600);setTimeout(p,1500);w.p=setInterval(p,5000);while(wsq.length&&w.readyState==1){try{w.send(wsq.shift())}catch(e){break}}};
w.onmessage=e=>{wsLast=Date.now();let m;try{m=JSON.parse(e.data)}catch(x){return}
if(m.t=='roomMode'){ROOM_NEW=0;const nm=[1,2,3].includes(+m.mode)?+m.mode:ROOM_MODE;if(nm!==ROOM_MODE){viewRoom(RM,nm,false);return}}
else if(m.t=='st'){if(m.i){const rtt=Date.now()-m.i;smp.push([rtt,m.now+rtt/2-Date.now()]);if(smp.length>8)smp.shift();off=smp.reduce((a,b)=>b[0]<a[0]?b:a)[1]}else if(!smp.length)off=m.now-Date.now();onState(m)}
else if(m.t=='pz')pzSet(m.pz);else if(m.t=='pzm')pzMove(m);else if(m.t=='chat')chatAdd(m);else if(m.t=='hist')m.c.forEach(chatAdd);
else if(m.t=='sys'){chatSys(m.x);toast(m.x)}else if(m.t=='react')fly(m.e,m.n);
else if(m.t=='locks'){LK=m.lk;lockUI()}else if(m.t=='wpend'){if(wpSeq(m)){WPO=m.p&&m.p.length&&m.by!=ME.name?{mv:m.mv,p:new Map(m.p.map(x=>[x.i,x]))}:null;wgRender()}}else if(m.t=='wq')wqSet(m);else if(m.t=='wrej')wrej(m);else if(m.t=='wg')wgSet(m.g);else if(m.t=='werr'){wbusy(0);toast(m.e,1)}else if(m.t=='wprev')wprevSet(m);else if(m.t=='wchk')wgChk(m)};
w.onerror=()=>{if(ws===w){const p=$('#pres');if(p)p.textContent='WebSocket bağlantı hatası; yeniden deneniyor…'}};
w.onclose=ev=>{clearInterval(w.p);if(ws!==w)return;const d=$('#dot');if(d)d.className='dot';
if(ev.code==4000){toast('Oda yönetici tarafından kapatıldı',1);return viewLobby()}
if(ev.code==4404){toast('Bu kodla açık bir oda yok',1);return viewLobby()}
if(ev.code==4409){toast('Bu oda kodu başka türde bir odada kullanılıyor, yeniden dene',1);return viewLobby()}
const s=$('#pres');if(ev.code==4001){if(s)s.textContent='Bu cihazın eski bağlantısı kapatıldı; yeniden bağlanılıyor…'}else if(s)s.textContent='Bağlantı koptu ('+ev.code+'); yeniden bağlanılıyor…';api('me').catch(()=>{});const dl=Math.min(6000,800+wsTry*700);wsTry++;wsTm=setTimeout(()=>{if(ws===w&&RM)connect(RM,ROOM_MODE)},dl)}}
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
function viewRoom(k,mode,isNew){leaveRoom();closeLive();RM=k;ROOM_MODE=([1,2,3].includes(+mode)?+mode:1);ROOM_NEW=isNew?1:0;localStorage.rm=k;st=null;loadedKey=null;seen=new Set();touched=0;done=0;Z={};
V=h('video',{playsinline:'',controls:'',preload:'auto'});yw=h('div',{class:'yt'});EMPTY=h('div',{class:'empty'},ic('film',32),h('span',{text:'Bir video linki yükle'}));
holdEl=h('div',{class:'hold'},h('i',{class:'sp'}),h('span'));syncEl=h('div',{class:'sync'});
for(const [ev,t] of [['play','play'],['pause','pause']])V.addEventListener(ev,()=>{if(Date.now()<lock||!st||!st.url||V.ended)return;uact=Date.now();if(t=='play'&&!st.playing)send({t:'play',pos:V.currentTime});if(t=='pause'&&st.playing)send({t:'pause',pos:V.currentTime})});
V.addEventListener('seeked',()=>{if(Date.now()<lock||!st||!st.url)return;if(Math.abs(V.currentTime-exp())>1){uact=Date.now();send({t:'seek',pos:V.currentTime})}});
V.addEventListener('ended',()=>{if(st&&st.playing)send({t:'pause',pos:V.currentTime})});
V.addEventListener('waiting',bufStart);V.addEventListener('playing',bufEnd);V.addEventListener('canplay',bufEnd);V.addEventListener('loadedmetadata',tick);
const dot=h('i',{class:'dot',id:'dot'}),pres=h('span',{id:'pres',text:'Bağlanıyor…'});
const mk=(n,i,t)=>h('button',{class:n==mode?'on':'',id:'t'+n,onclick:()=>{touched=1;tab(n)}},ic(i,16),t,h('span',{class:'lkm'}));
const seg=h('div',{class:'seg'},mk(1,'film','Film'),mk(2,'puzzle','Yapboz'),mk(3,'word','Kelimelik'));
const head=h('div',{class:'card'},h('div',{class:'row'},h('button',{class:'btn sec sq','aria-label':'Çık',onclick:()=>viewLobby()},ic('back')),h('div',{class:'grow'},h('b',{text:'Oda '+k}),h('div',{class:'pill'},dot,pres)),h('button',{class:'btn sec sq','aria-label':'Davet et',onclick:invite},ic('link')),h('button',{class:'btn sec sq','aria-label':'Yardım',onclick:helpModal},ic('help'))),seg);
const u=h('input',{class:'in',id:'vu',type:'url',placeholder:'YouTube, .mp4 veya .m3u8 linki',inputmode:'url',autocapitalize:'none',autocorrect:'off',spellcheck:'false',enterkeyhint:'go'});
const rf=h('input',{class:'in',type:'url',placeholder:'https://kaynak-site.com/',inputmode:'url',autocapitalize:'none',autocorrect:'off'});
const ld=()=>{const v=u.value.trim();if(!/^https?:\/\//i.test(v))return toast('Link http:// veya https:// ile başlamalı',1);send({t:'set',url:v,ref:rf.value.trim()});toast('Yükleniyor…')};u.onkeydown=e=>{if(e.key=='Enter')ld()};
const fp=h('div',{class:'card',id:'fp'},h('div',{class:'stage'},V,yw,EMPTY,syncEl,holdEl),h('div',{class:'row'},u,h('button',{class:'btn',onclick:ld},ic('play',16),'Yükle')),h('details',{},h('summary',{text:'Gelişmiş: Referer (link açılmazsa)'}),rf),h('small',{text:'Oynat, durdur ve ileri sarma ikinizde de anında uygulanır. Biri takılırsa diğeri bekler.'}));
const cnt=h('div',{class:'chips'},[100,250,500,1000].map(n=>h('button',{class:n==PN?'on':'','data-n':n,onclick:e=>{PN=n;cnt.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==e.currentTarget))}},n+' parça')));
const pf=h('input',{type:'file',accept:'image/*',style:'display:none',onchange:e=>{if(e.target.files[0])pnew(e.target.files[0]);e.target.value=''}});
const cv=h('canvas',{id:'pcv'});
const zbtn=(i,t,fn)=>h('button',{class:'btn sec sm',type:'button',onclick:fn},ic(i,15),t);
const pp=h('div',{class:'card',id:'pp',style:'display:none'},h('small',{text:'Parça sayısını seç, fotoğraf yükle. İkiniz de aynı anda parça taşıyabilirsiniz.'}),cnt,h('button',{class:'btn full',onclick:()=>pf.click()},ic('img'),'Fotoğraf seç ve başlat'),pf,h('div',{class:'prog'},h('i',{id:'pgb'})),h('small',{id:'pgt'}),
h('div',{class:'zb'},zbtn('plus','Yakınlaş',()=>zoomBy(1.3)),zbtn('minus','Uzaklaş',()=>zoomBy(1/1.3)),zbtn('fit','Hepsini göster',()=>camFit()),zbtn('puzzle','Tahtaya odaklan',()=>camBoard())),cv,
h('small',{text:'Parçayı sürükle. Boş yeri sürükleyerek tahtayı kaydır, iki parmakla yakınlaştır.'}));
const cb=h('div',{class:'msgs',id:'cb'}),ci=h('input',{class:'in',placeholder:'Mesaj yaz…',maxlength:500,enterkeyhint:'send',autocomplete:'off'});
const chat=h('div',{class:'card chat'},h('div',{class:'row'},ic('users',16),h('b',{text:'Sohbet'})),cb,h('div',{class:'react'},['❤️','😂','😮','👏','🔥','😢'].map(e=>h('button',{type:'button',onclick:()=>send({t:'react',e}),text:e}))),
h('form',{class:'row',onsubmit:e=>{e.preventDefault();const x=ci.value.trim();if(x){send({t:'chat',x});ci.value=''}}},ci,h('button',{class:'btn sq',type:'submit','aria-label':'Gönder'},ic('send'))));
RP={fp,pp,fpL:h('div',{style:'display:none'}),ppL:h('div',{style:'display:none'}),mp:musicCard(),mpL:h('div',{style:'display:none'}),wp:wordCard(),wpL:h('div',{style:'display:none'})};
function tab(n){TAB=n;for(let i=1;i<4;i++){const b=$('#t'+i);if(b)b.classList.toggle('on',i==n)}lockUI()}
mount(h('div',{class:'stack'},head,h('div',{class:'room'},h('div',{class:'stack'},fp,RP.fpL,pp,RP.ppL,RP.mp,RP.mpL,RP.wp,RP.wpL),chat)));
tab(ROOM_MODE);pbind();connect(k,ROOM_MODE);getPT().catch(()=>{});
tk=setInterval(()=>{tick();ytPoll();mtick()},500);if(!window.rz){window.rz=1;let rt=0;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(!RM||!PZ)return;const c=$('#pcv'),w=c?c.getBoundingClientRect().width:0;if(w&&Math.abs(w-LW)>3)pfit()},250)})}}
let RP={},TAB=1,LW=0;
const AN={film:'Film izleme',puzzle:'Yapboz',music:'Müzik',word:'Kelimelik'};
function lockUI(){if(!RM||!RP.fp)return;
for(const [a,c,l,t] of [['film',RP.fp,RP.fpL,1],['puzzle',RP.pp,RP.ppL,2],['music',RP.mp,RP.mpL,2],['word',RP.wp,RP.wpL,3]]){const ok=canUse(a),on=TAB==t;c.style.display=on&&ok?'':'none';l.style.display=on&&!ok?'':'none';
if(!ok)l.replaceChildren(h('div',{class:'card lockc'},h('div',{class:'logo lg'},ic('lock',22)),h('h2',{text:AN[a]+' kilitli'}),h('small',{text:LK[a]==1?'Şu an yalnızca yöneticilere açık.':'Yönetici kilidi açınca buradan kullanabilirsiniz.'})))}
for(const [a,t] of [['film',1],['puzzle',2],['word',3]]){const b=$('#t'+t+' .lkm');if(b)b.textContent=canUse(a)?'':'🔒'}
if(!canUse('film')&&loadedKey){teardown();loadedKey=null;if(EMPTY)EMPTY.style.display=''}
if(!canUse('music'))mstop();else if(MS)mapply();
if(TAB==2&&canUse('puzzle'))pfit();if(TAB==3&&canUse('word'))wgRender()}
// ---------- yapboz ----------
const PO=.03,BW=.94;let PZ=null,IM=null,PN=100,Z={},zc=0,drag=null,done=0,plt=0,PC=[],PP=[],ED=null,PU=0,CAM={x:0,y:0,z:1},QK=1,VH=1.4,camSet=0,pts=new Map(),pin=null,pan=null;
function mb32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function edges(c,r,seed){const R=mb32(seed),hz=[],vt=[];for(let y=0;y<=r;y++){hz[y]=[];for(let x=0;x<c;x++)hz[y][x]=(y==0||y==r)?0:(R()<.5?1:-1)}for(let y=0;y<r;y++){vt[y]=[];for(let x=0;x<=c;x++)vt[y][x]=(x==0||x==c)?0:(R()<.5?1:-1)}return{hz,vt}}
function side(p,x0,y0,x1,y1,nx,ny,e,L,m){if(!e){p.lineTo(x1,y1);return}const dx=(x1-x0)/L,dy=(y1-y0)/L,k=m/L;
const P=(a,b)=>{const q=.5+(a-.5)*k;return[x0+dx*L*q+nx*e*m*b,y0+dy*L*q+ny*e*m*b]};
p.lineTo(...P(.38,0));p.bezierCurveTo(...P(.42,.01),...P(.425,.04),...P(.42,.07));p.bezierCurveTo(...P(.34,.10),...P(.40,.25),...P(.5,.25));p.bezierCurveTo(...P(.60,.25),...P(.66,.10),...P(.58,.07));p.bezierCurveTo(...P(.575,.04),...P(.58,.01),...P(.62,0));p.lineTo(x1,y1)}
function ppath(i,w,hh,m){const c=PZ.c,x=i%c,y=(i/c)|0,E=ED,p=new Path2D();p.moveTo(0,0);
side(p,0,0,w,0,0,-1,E.hz[y][x],w,m);side(p,w,0,w,hh,1,0,-E.vt[y][x+1],hh,m);side(p,w,hh,0,hh,0,1,-E.hz[y+1][x],w,m);side(p,0,hh,0,0,-1,0,E.vt[y][x],hh,m);p.closePath();return p}
function pnew(f){const i=new Image;i.onload=()=>{const MD={100:900,250:1200,500:1500,1000:1800}[PN]||900,c=document.createElement('canvas');let d='';
for(let k=1;k>.35;k-=.15){const s=Math.min(1,MD*k/Math.max(i.width,i.height));c.width=Math.round(i.width*s);c.height=Math.round(i.height*s);c.getContext('2d').drawImage(i,0,0,c.width,c.height);
for(let q=.8;q>=.45;q-=.1){d=c.toDataURL('image/jpeg',q);if(d.length<800000)break}if(d.length<800000)break}
if(d.length>=800000){toast('Fotoğraf çok büyük, daha küçük bir fotoğraf dene',1);URL.revokeObjectURL(i.src);return}
const ar=c.height/c.width,cols=Math.max(2,Math.round(Math.sqrt(PN/ar))),rows=Math.max(2,Math.round(PN/cols)),w=BW/cols,hh=BW*ar/rows,p=[],BH=BW*ar,x0=-.5,y0=-.2,x1=1.5,y1=Math.min(3.9,PO+BH+.7);
for(let k=0;k<cols*rows;k++){let x,y,t=0;do{x=x0+Math.random()*(x1-x0-w);y=y0+Math.random()*(y1-y0-hh);t++}while(t<40&&x+w>PO-.01&&x<PO+BW+.01&&y+hh>PO-.01&&y<PO+BH+.01);p.push([x,y,0])}
send({t:'pzn',pz:{img:d,c:cols,r:rows,ar,seed:Math.floor(Math.random()*2147483647),id:Date.now().toString(36),p}});toast('Yapboz hazırlanıyor…');URL.revokeObjectURL(i.src)};i.onerror=()=>toast('Fotoğraf açılamadı',1);i.src=URL.createObjectURL(f)}
function pzSet(pz){const nw=!PZ||PZ.id!=pz.id;PZ=pz;if(nw){done=0;Z={};camSet=0}ED=edges(pz.c,pz.r,pz.seed);const i=new Image;i.onload=()=>{IM=i;pfit()};i.src=pz.img;if(!touched&&st&&!st.url){touched=1;const b=$('#t2');if(b)b.click()}}
function WB(){return[-.5,-.2,1.5,Math.min(3.9,PO+BW*PZ.ar+.7)]}
function clampCam(){if(!PZ)return;const [x0,y0,x1,y1]=WB(),vw=1/CAM.z,vh=VH/CAM.z;CAM.x=(x1-x0+.4<=vw)?(x0+x1)/2-vw/2:Math.max(x0-.2,Math.min(CAM.x,x1+.2-vw));CAM.y=(y1-y0+.4<=vh)?(y0+y1)/2-vh/2:Math.max(y0-.2,Math.min(CAM.y,y1+.2-vh))}
function camFit(){if(!PZ)return;const [x0,y0,x1,y1]=WB();CAM.z=Math.max(.3,Math.min(1/(x1-x0),VH/(y1-y0)));CAM.x=(x0+x1)/2-1/(2*CAM.z);CAM.y=(y0+y1)/2-VH/(2*CAM.z);clampCam();pdraw()}
function camBoard(){if(!PZ)return;const BH=BW*PZ.ar;CAM.z=Math.max(.3,Math.min(6,1/(BW+.1),VH/(BH+.1)));CAM.x=PO+BW/2-1/(2*CAM.z);CAM.y=PO+BH/2-VH/(2*CAM.z);clampCam();pdraw()}
function zoomAt(sx,sy,f){if(!PZ)return;const wx=CAM.x+sx/CAM.z,wy=CAM.y+sy/CAM.z;CAM.z=Math.max(.3,Math.min(6,CAM.z*f));CAM.x=wx-sx/CAM.z;CAM.y=wy-sy/CAM.z;clampCam();pdraw()}
function zoomBy(f){zoomAt(.5,VH/2,f)}
function pfit(){const cv=$('#pcv');if(!cv||!PZ||!IM)return;cv.style.display='block';const cw=cv.getBoundingClientRect().width;if(!cw)return;LW=cw;
const ch=Math.max(260,Math.min(Math.round(window.innerHeight*.6),Math.round(cw*1.7)));cv.style.height=ch+'px';
const np=PZ.c*PZ.r;QK=np>=1000?2.2:np>=500?2:np>=250?1.6:1;cv.width=Math.min(1600,Math.round(cw*2));cv.height=Math.round(cv.width*ch/cw);PU=Math.round(cv.width*QK);VH=ch/cw;
const U=PU,ww=BW/PZ.c*U,hh=BW*PZ.ar/PZ.r*U,m=Math.min(ww,hh);PC=[];PP=[];for(let i=0;i<PZ.c*PZ.r;i++)PP[i]=ppath(i,ww,hh,m);
if(!camSet){camSet=1;camFit()}else{clampCam();pdraw()}}
const pord=()=>[...PZ.p.keys()].sort((a,b)=>(PZ.p[b][2]-PZ.p[a][2])||((Z[a]||0)-(Z[b]||0)));
function pcache(i,lk2){const k=lk2?1:0;PC[i]=PC[i]||[];if(PC[i][k])return PC[i][k];const U=PU,c=PZ.c,w=BW/c*U,hh=BW*PZ.ar/PZ.r*U,m=Math.min(w,hh),mg=Math.ceil(.3*m),cx=i%c,cy=(i/c)|0;
const o=document.createElement('canvas');o.width=Math.ceil(w+2*mg);o.height=Math.ceil(hh+2*mg);const g=o.getContext('2d');g.translate(mg,mg);g.save();g.clip(PP[i]);g.drawImage(IM,-cx*w,-cy*hh,BW*U,BW*PZ.ar*U);g.restore();
if(!lk2){g.lineWidth=Math.max(1.5,U/450);g.strokeStyle='rgba(255,255,255,.75)';g.stroke(PP[i])}return PC[i][k]=o}
function pdraw(){const cv=$('#pcv');if(!cv||!PZ||!IM||!PU||!PP.length)return;const g=cv.getContext('2d'),U=PU,{c,r,ar,p}=PZ,mg=Math.ceil(.3*Math.min(BW/c,BW*ar/r)*U),z=CAM.z;
g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);g.imageSmoothingQuality='high';
const zq=z/QK;g.setTransform(zq,0,0,zq,-CAM.x*U*zq,-CAM.y*U*zq);
const [x0,y0,x1,y1]=WB();g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=2/zq;g.strokeRect(x0*U,y0*U,(x1-x0)*U,(y1-y0)*U);
g.globalAlpha=.14;g.drawImage(IM,PO*U,PO*U,BW*U,BW*ar*U);g.globalAlpha=1;g.strokeStyle='rgba(255,255,255,.2)';g.lineWidth=2/zq;g.strokeRect(PO*U,PO*U,BW*U,BW*ar*U);
let n=0;for(const i of pord()){const q=p[i];if(q[2])n++;g.drawImage(pcache(i,q[2]),Math.round(q[0]*U-mg),Math.round(q[1]*U-mg))}
g.setTransform(1,0,0,1,0,0);prog(n)}
function prog(n){const t=PZ.p.length,b=$('#pgb'),x=$('#pgt');if(b)b.style.width=(n/t*100)+'%';if(x)x.textContent=n+' / '+t+' parça yerinde';if(n==t&&!done){done=1;toast('🎉 Yapboz tamamlandı!');chatSys('🎉 Yapboz tamamlandı!')}}
function pbind(){const cv=$('#pcv'),xy=e=>{const b=cv.getBoundingClientRect();return[(e.clientX-b.left)/b.width,(e.clientY-b.top)/b.width]},wp=(sx,sy)=>[CAM.x+sx/CAM.z,CAM.y+sy/CAM.z];
const drop=()=>{if(!drag)return;const i=drag.i,q=PZ.p[i],W=BW/PZ.c,H=BW*PZ.ar/PZ.r,tx=PO+(i%PZ.c)*W,ty=PO+((i/PZ.c)|0)*H;drag=null;if(Math.hypot(q[0]-tx,q[1]-ty)<Math.min(W,H)*.35){q[0]=tx;q[1]=ty;q[2]=1;if(navigator.vibrate)navigator.vibrate(20)}send({t:'pzm',i,x:q[0],y:q[1],l:q[2]});pdraw()};
cv.onpointerdown=e=>{if(!PZ||!PU||!PP.length)return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(x){}pts.set(e.pointerId,[e.clientX,e.clientY]);
if(pts.size==2){drop();pan=null;const a=[...pts.values()],b=cv.getBoundingClientRect(),mx=((a[0][0]+a[1][0])/2-b.left)/b.width,my=((a[0][1]+a[1][1])/2-b.top)/b.width,w0=wp(mx,my);pin={d:Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1,z:CAM.z,wx:w0[0],wy:w0[1]};return}
if(pts.size>2)return;
const [sx,sy]=xy(e),[mx,my]=wp(sx,sy),g=cv.getContext('2d'),U=PU;g.setTransform(1,0,0,1,0,0);
for(const i of pord().reverse()){const q=PZ.p[i];if(q[2])continue;if(g.isPointInPath(PP[i],(mx-q[0])*U,(my-q[1])*U)){drag={i,dx:mx-q[0],dy:my-q[1],id:e.pointerId};Z[i]=++zc;pdraw();return}}
pan={sx:e.clientX,sy:e.clientY,cx:CAM.x,cy:CAM.y,id:e.pointerId};cv.style.cursor='grabbing'};
cv.onpointermove=e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);e.preventDefault();const b=cv.getBoundingClientRect();
if(pin&&pts.size>=2){const a=[...pts.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1,mx=((a[0][0]+a[1][0])/2-b.left)/b.width,my=((a[0][1]+a[1][1])/2-b.top)/b.width;CAM.z=Math.max(.3,Math.min(6,pin.z*d/pin.d));CAM.x=pin.wx-mx/CAM.z;CAM.y=pin.wy-my/CAM.z;clampCam();pdraw();return}
if(drag&&drag.id==e.pointerId){const [sx,sy]=xy(e),[mx,my]=wp(sx,sy),q=PZ.p[drag.i],[x0,y0,x1,y1]=WB(),W=BW/PZ.c,H=BW*PZ.ar/PZ.r;q[0]=Math.max(x0,Math.min(x1-W,mx-drag.dx));q[1]=Math.max(y0,Math.min(y1-H,my-drag.dy));pdraw();if(Date.now()-plt>60){plt=Date.now();send({t:'pzm',i:drag.i,x:q[0],y:q[1],l:0,live:1})}return}
if(pan&&pan.id==e.pointerId){CAM.x=pan.cx-(e.clientX-pan.sx)/b.width/CAM.z;CAM.y=pan.cy-(e.clientY-pan.sy)/b.width/CAM.z;clampCam();pdraw()}};
const up=e=>{pts.delete(e.pointerId);if(drag&&drag.id==e.pointerId)drop();if(pan&&pan.id==e.pointerId){pan=null;cv.style.cursor=''}if(pin&&pts.size<2){pin=null;const r=[...pts.entries()][0];if(r)pan={sx:r[1][0],sy:r[1][1],cx:CAM.x,cy:CAM.y,id:r[0]}}};
cv.onpointerup=cv.onpointercancel=up;
cv.addEventListener('wheel',e=>{e.preventDefault();const [sx,sy]=xy(e);zoomAt(sx,sy,e.deltaY<0?1.12:1/1.12)},{passive:false})}
function pzMove(m){if(!PZ||!PZ.p[m.i]||(drag&&drag.i==m.i))return;PZ.p[m.i]=[m.x,m.y,m.l];Z[m.i]=++zc;pdraw()}
// ---------- müzik ----------
const MU={prov:localStorage.mp||'yt',rev:-1,lp:'',loaded:'',seq:0,msg:'',need:0,dev:'',on:0,optT:0,optP:null,endSent:0,amid:''},RES={},PNM={yt:'YouTube (Ücretsiz)',au:'Önizleme (30sn)',sp:'Spotify',am:'Apple Music'};
let AM=null,YM=null,YMr=0,YMid='',MA=null,MUI={},SPC='';
const loadCfg=async()=>{if(!CFG){try{CFG=await api('music/cfg')}catch(e){CFG={sp:'',am:false}}}return CFG};
const expOf=ms=>ms&&ms.tr?Math.max(0,ms.pos+(ms.playing?(Date.now()+off-ms.at)/1e3:0)):0;
const mexp=()=>expOf(MS);
const fmt=s=>{s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+pad(s%60)};
const b64u=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
function getMA(){if(!MA){MA=new Audio();MA.playsInline=true;MA.preload='auto';MA.onended=()=>{if(MS&&MS.playing&&(MU.prov=='au'||(MS.tr&&MS.tr.ids&&MS.tr.ids.au==MS.tr.ids[MU.prov])))send({t:'mpause',pos:0})}}return MA}
function mpauseAll(){try{if(YM&&YMr)YM.pauseVideo()}catch(e){}try{if(MA&&!MA.paused)MA.pause()}catch(e){}try{if(AM&&AM.isPlaying)AM.pause()}catch(e){}if(MU.on&&MU.prov=='sp')spApi('me/player/pause','PUT');MU.on=0}
function mstop(){MU.seq++;MU.loaded='';MU.rev=-1;MU.lp='';mpauseAll();if(MUI.yt)MUI.yt.style.display='none';mui()}
function musicState(ms){MS=ms;if(!ms||!ms.tr){if(MU.loaded)mstop();mui();return}
if(!canUse('music')){mui();return}
if(MU.optP!==null&&MU.optP===ms.playing&&Date.now()-MU.optT<4000&&MU.loaded){MU.optP=null;MU.rev=ms.rev;MU.lp=MU.prov;mui();return}
if(MU.rev!=ms.rev||MU.lp!=MU.prov){MU.endSent=0;mapply()}mui()}
async function ytSearch(q,n){const j=await api('music/search?q='+encodeURIComponent(q)+'&n='+(n||8));return j.items||[]}
async function resolveId(tr,pv){const ids=tr.ids||{};if(ids[pv])return ids[pv];if(pv=='au'&&ids.au)return ids.au;
const key=pv+':'+tr.title+'|'+(tr.artist||'');if(RES[key]!=null)return RES[key];
const q=(tr.title+' '+(tr.artist||'')).trim();if(!q)return '';
let r=[];try{r=(pv=='yt'||pv=='au')?await ytSearch(q,1):pv=='sp'?await spSearch(q,1):await amSearch(q,1)}catch(e){}
if(r.length&&r[0].ids){for(const k of ['yt','au','sp','am'])if(r[0].ids[k]&&!ids[k])ids[k]=r[0].ids[k];if(!tr.dur&&r[0].dur)tr.dur=r[0].dur;if(!tr.art&&r[0].art)tr.art=r[0].art}
RES[key]=ids[pv]||(pv=='yt'&&ids.au?ids.au:'')||'';return RES[key]}
async function mapply(o){const ms=o||MS;if(!ms||!ms.tr||!canUse('music'))return;
if(!MU.prov){MU.prov='yt';localStorage.mp='yt'}
const my=++MU.seq,pv=(ms.tr.ids&&ms.tr.ids.au&&!ms.tr.ids.yt&&MU.prov=='yt')?'au':MU.prov;MU.rev=ms.rev;MU.lp=MU.prov;MU.msg='';
try{let id=await resolveId(ms.tr,pv);if(my!=MU.seq)return;
let usePv=pv;if(!id&&pv=='yt'&&ms.tr.ids&&ms.tr.ids.au){id=ms.tr.ids.au;usePv='au'}
if(!id){MU.msg='Bu şarkı '+PNM[MU.prov]+' içinde bulunamadı. Başka bir arama yap veya link yapıştır.';mui();return}
if(usePv!='yt'&&YM&&YMr){try{YM.pauseVideo()}catch(e){}if(MUI.yt)MUI.yt.style.display='none'}
if(usePv!='au'&&MA&&!MA.paused){try{MA.pause()}catch(e){}}
const pos=expOf(ms),key=usePv+':'+id;await AD[usePv].sync(id,ms.playing,pos,MU.loaded!=key);if(my!=MU.seq)return;MU.loaded=key;MU.on=ms.playing?1:0;MU.need=0}
catch(e){if(my!=MU.seq)return;if(e&&e.name=='NotAllowedError')MU.need=1;else if(pv=='yt'&&ms.tr&&ms.tr.ids&&ms.tr.ids.au){try{const pos=expOf(ms);await AD.au.sync(ms.tr.ids.au,ms.playing,Math.min(pos,28),true);MU.loaded='au:'+ms.tr.ids.au;MU.on=ms.playing?1:0;MU.msg='YouTube gömülemedi, 30sn ses önizlemesi çalınıyor.'}catch(e2){MU.need=1}}else MU.msg=String((e&&e.message)||e).slice(0,160)}
mui()}
// YouTube oynatıcıları kendi başına drift yapabildiğinden, ortak zamanla periyodik düzelt.
if(!window.__bsMusicSyncTimer){window.__bsMusicSyncTimer=setInterval(()=>{try{
if(MS&&MS.tr&&MU.prov==='yt'&&YM&&YMr&&YM.getPlayerState&&canUse('music')){const ps=YM.getPlayerState();
if(MS.playing){
 if(ps===1){if(MU.need||MU.fail){MU.need=0;MU.fail=0;mui()}const target=expOf(MS),actual=YM.getCurrentTime();if(Number.isFinite(target)&&Number.isFinite(actual)&&Math.abs(actual-target)>1.5)YM.seekTo(target,true)}
 else if(ps===3){/* yükleniyor, bekle */}
 else{MU.fail=(MU.fail||0)+1;try{YM.seekTo(expOf(MS),true);YM.playVideo()}catch(e){}if(MU.fail>=2&&!MU.need){MU.need=1;mui()}}
}else if(ps===1){try{YM.pauseVideo()}catch(e){}}}
mrep()}catch(_){ }},1500)}
if(!window._muBind){window._muBind=1;document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='visible'&&MS&&MS.tr&&MS.playing)setTimeout(()=>{try{mapply()}catch(e){}},300)})}
const AD={
yt:{async sync(id,pl,pos){const box=MUI.yt;if(box)box.style.display='block';
if(!YM){await new Promise((ok,no)=>{let dn=0;const t=setTimeout(()=>{if(!dn){dn=1;no(new Error('YouTube oynatıcı zaman aşımına uğradı'))}},9000);box.replaceChildren(h('div',{id:'ymp'}));withYT(()=>{if(dn)return;YM=new YT.Player('ymp',{videoId:id,width:'100%',height:'100%',playerVars:{playsinline:1,rel:0,modestbranding:1,origin:location.origin},events:{onReady:()=>{if(dn)return;dn=1;clearTimeout(t);YMr=1;YMid=id;ok()},onStateChange:e=>{if(e.data==1&&MU.need){MU.need=0;mui()}if(e.data==0&&MS&&MS.playing&&MU.prov=='yt')send({t:'mpause',pos:0})},onError:()=>{if(!dn){dn=1;clearTimeout(t);no(new Error('YouTube: bu şarkı gömülemiyor'))}else if(MS&&MS.tr&&MS.tr.ids&&MS.tr.ids.au){AD.au.sync(MS.tr.ids.au,MS.playing,0,true).catch(()=>{})}}}})})});YM.seekTo(pos,true)}
if(YMid!=id){YMid=id;YM.loadVideoById({videoId:id,startSeconds:pos})}else if(Math.abs((YM.getCurrentTime&&YM.getCurrentTime()||0)-pos)>1.8)YM.seekTo(pos,true);
if(pl){YM.playVideo();setTimeout(()=>{if(MS&&MS.playing&&YM&&MU.prov=='yt'&&[1,3].indexOf(YM.getPlayerState&&YM.getPlayerState())<0){MU.need=1;mui()}},1800)}else YM.pauseVideo()}},
au:{async sync(url,pl,pos,ch){const a=getMA();if(ch||a.src!=url){a.src=url;a.load()}const target=pos>29?0:pos;if(Math.abs((a.currentTime||0)-target)>1.5){try{a.currentTime=target}catch(e){}}if(pl){const p=a.play();if(p&&p.catch)await p}else a.pause()}},
sp:{async sync(id,pl,pos,ch){if(pl)await spPlay(id,pos+.5);else if(MU.on||!ch)await spApi('me/player/pause','PUT')}},
am:{async sync(id,pl,pos,ch){const m=await amInit();if(!m.isAuthorized)throw new Error('Önce Apple Music hesabını bağla.');
if(ch||MU.amid!=id){await m.setQueue({song:id});MU.amid=id}
if(pl){await m.play()}else{await m.pause()}
if(Math.abs((m.currentPlaybackTime||0)-pos)>1.5)await m.seekToTime(pos)}}};
// Spotify (uygulamayı uzaktan kumanda eder; Premium gerekir)
async function spTok(){let s=null;try{s=JSON.parse(localStorage.sp||'null')}catch(e){}if(!s)return '';
if(s.exp>Date.now()+30000)return s.at;const c=await loadCfg();if(!s.rt||!c.sp)return '';
let r;try{r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'refresh_token',refresh_token:s.rt,client_id:c.sp})})}catch(e){return ''}
if(!r.ok){if(r.status==400||r.status==401)localStorage.removeItem('sp');return ''}
const j=await r.json();s={at:j.access_token,rt:j.refresh_token||s.rt,exp:Date.now()+j.expires_in*1000};localStorage.sp=JSON.stringify(s);return s.at}
async function spApi(path,method,body){const t=await spTok();if(!t)return{ok:false,status:401,j:null};let r;
try{r=await fetch('https://api.spotify.com/v1/'+path,{method:method||'GET',headers:{authorization:'Bearer '+t,'content-type':'application/json'},body:body?JSON.stringify(body):undefined})}catch(e){return{ok:false,status:0,j:null}}
let j=null;if(r.status!=204){try{j=await r.json()}catch(e){}}return{ok:r.ok,status:r.status,j}}
async function spPlay(id,pos){const body={uris:['spotify:track:'+id],position_ms:Math.max(0,Math.round(pos*1000))};
let r=await spApi('me/player/play'+(MU.dev?'?device_id='+encodeURIComponent(MU.dev):''),'PUT',body);
if(r.status==404||(MU.dev&&r.status>=400&&r.status!=403&&r.status!=429&&r.status!=401)){MU.dev='';const d=await spApi('me/player/devices'),L=(d.j&&d.j.devices)||[],dv=L.find(x=>x.is_active)||L[0];
if(!dv)throw new Error('Spotify uygulaması açık değil. Spotify uygulamasını aç, herhangi bir şarkıyı bir an çalıp durdur, sonra tekrar dene.');
MU.dev=dv.id;r=await spApi('me/player/play?device_id='+encodeURIComponent(dv.id),'PUT',body)}
if(r.status==403)throw new Error('Spotify Premium gerekli.');if(r.status==401)throw new Error('Spotify bağlantısı bitti, tekrar bağla.');if(!r.ok)throw new Error('Spotify hatası ('+r.status+')')}
const spTr=t=>({title:t.name,artist:(t.artists||[]).map(a=>a.name).join(', '),art:((t.album&&t.album.images||[])[1]||(t.album&&t.album.images||[])[0]||{}).url||'',dur:Math.round((t.duration_ms||0)/1000),ids:{sp:t.id}});
async function spSearch(q,n){const r=await spApi('search?type=track&limit='+(n||8)+'&q='+encodeURIComponent(q));if(!r.ok)throw new Error(r.status==401?'Önce Spotify hesabını bağla.':'Spotify arama hatası ('+r.status+')');return(((r.j||{}).tracks||{}).items||[]).map(spTr)}
async function spConnect(){const c=await loadCfg();if(!c.sp){toast('Sunucuda SPOTIFY_CLIENT_ID tanımlı değil. YouTube (Ücretsiz) modunu kullanabilirsin.',1);return}
const v=Array.from(crypto.getRandomValues(new Uint8Array(48)),b=>'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[b%62]).join('');localStorage.spv=v;
const ch=b64u(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)));
location.href='https://accounts.spotify.com/authorize?'+new URLSearchParams({client_id:c.sp,response_type:'code',redirect_uri:location.origin+'/',code_challenge_method:'S256',code_challenge:ch,scope:'user-read-playback-state user-modify-playback-state',state:'m'+(RM||'')})}
async function spExchange(code){try{const c=await loadCfg();const r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'authorization_code',code,redirect_uri:location.origin+'/',client_id:c.sp,code_verifier:localStorage.spv||''})});const j=await r.json();
if(!r.ok)throw new Error(j.error_description||'Spotify bağlanamadı');localStorage.sp=JSON.stringify({at:j.access_token,rt:j.refresh_token,exp:Date.now()+j.expires_in*1000});localStorage.removeItem('spv');MU.prov='sp';localStorage.mp='sp';toast('Spotify bağlandı ✓');mui();if(MS)mapply()}catch(e){toast(String((e&&e.message)||e),1)}}
// Apple Music (MusicKit JS)
async function amInit(){if(AM)return AM;
if(!window.MusicKit){await new Promise((ok,no)=>{document.addEventListener('musickitloaded',ok,{once:true});const s=document.createElement('script');s.src='https://js-cdn.music.apple.com/musickit/v3/musickit.js';s.async=true;s.onerror=()=>no(new Error('Apple Music kütüphanesi yüklenemedi'));document.head.append(s);setTimeout(()=>{if(window.MusicKit)ok()},8000)})}
const t=(await api('music/atoken')).t;await MusicKit.configure({developerToken:t,app:{name:'Bizim Sinema',build:'1.0'}});AM=MusicKit.getInstance();return AM}
const amTr=a=>{const x=a.attributes||{};return{title:x.name||'Şarkı',artist:x.artistName||'',art:x.artwork&&x.artwork.url?x.artwork.url.replace('{w}','120').replace('{h}','120'):'',dur:Math.round((x.durationInMillis||0)/1000),ids:{am:String(a.id)}}};
async function amSearch(q,n){const m=await amInit(),r=await m.api.music('v1/catalog/'+(m.storefrontCountryCode||m.storefrontId||'tr')+'/search',{term:q,types:'songs',limit:n||8}),j=r.data||r;return((((j.results||{}).songs||{}).data)||[]).map(amTr)}
// bağlantı yapıştırma
function parseLink(v){let m;const y=ytId(v);if(y)return{ids:{yt:y}};
if(/^https?:\/\/[^\s]+\.(mp3|m4a|aac|ogg|wav|flac)(\?[^\s]*)?$/i.test(v))return{ids:{au:v}};
if(m=v.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?track\/([A-Za-z0-9]{22})/))return{ids:{sp:m[1]}};
if(m=v.match(/music\.apple\.com\/[^\s]*[?&]i=(\d+)/)||v.match(/music\.apple\.com\/[^\s]*\/song\/[^\/\s]*\/(\d+)/))return{ids:{am:m[1]}};return null}
async function fillMeta(tr){const i=tr.ids;try{
if(i.yt){const r=await fetch('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent('https://www.youtube.com/watch?v='+i.yt));if(r.ok){const j=await r.json();tr.title=j.title||tr.title;tr.artist=j.author_name||'';tr.art=j.thumbnail_url||''}}
else if(i.sp&&localStorage.sp){const r=await spApi('tracks/'+i.sp);if(r.ok)Object.assign(tr,spTr(r.j))}
else if(i.am&&AM&&AM.isAuthorized){const r=await AM.api.music('v1/catalog/'+(AM.storefrontCountryCode||AM.storefrontId||'tr')+'/songs/'+i.am),j=r.data||r;if(j.data&&j.data[0])Object.assign(tr,amTr(j.data[0]))}
else if(i.au){const u=new URL(i.au);tr.title=decodeURIComponent(u.pathname.split('/').pop()||'Ses Dosyası').replace(/\.[a-z0-9]+$/i,'')}}catch(e){}
if(!tr.title)tr.title='Şarkı';return tr}
async function pickTrack(tr){if(!canUse('music'))return;MU.endSent=0;
if(!MU.prov){MU.prov='yt';localStorage.mp='yt'}
if(tr.ids&&!tr.ids.yt&&(MU.prov=='yt'||!tr.ids[MU.prov])){try{toast('Şarkı hazırlanıyor…');const r=await ytSearch((tr.title+' '+(tr.artist||'')).trim(),1);if(r.length&&r[0].ids){if(r[0].ids.yt)tr.ids.yt=r[0].ids.yt;if(r[0].ids.au&&!tr.ids.au)tr.ids.au=r[0].ids.au;if(!tr.dur&&r[0].dur)tr.dur=r[0].dur;if(!tr.art&&r[0].art)tr.art=r[0].art}}catch(e){}}
send({t:'mset',tr});const ms={tr,playing:true,pos:0,at:Date.now()+off,by:ME.name,rev:-1};MU.optT=Date.now();MU.optP=true;mapply(ms);MUI.res.replaceChildren();MUI.q.value=''}
async function msearch(){const v=MUI.q.value.trim();if(!v)return;
if(!MU.prov){MU.prov='yt';localStorage.mp='yt';mui()}
const lk=parseLink(v);if(lk){const tr=await fillMeta({title:'',artist:'',art:'',dur:0,ids:lk.ids});return pickTrack(tr)}
try{MUI.res.replaceChildren(h('small',{class:'mu',text:'Aranıyor…'}));
let L=[];if(MU.prov=='sp'&&localStorage.sp)L=await spSearch(v,8);else if(MU.prov=='am'&&AM&&AM.isAuthorized)L=await amSearch(v,8);else L=await ytSearch(v,8);
MUI.res.replaceChildren(...(L.length?L.map(t=>h('button',{type:'button',class:'mu-r',onclick:()=>pickTrack(t)},t.art?h('img',{src:t.art,alt:''}):h('span',{class:'mu-art',text:'🎵',style:'width:40px;height:40px;font-size:1.1rem'}),h('div',{},h('b',{text:t.title}),h('small',{text:t.artist+(t.dur?' · '+fmt(t.dur):'')})))):[h('small',{class:'mu',text:'Sonuç bulunamadı'})]))}catch(e){MUI.res.replaceChildren();toast(String((e&&e.message)||e),1)}}
function setProv(p){if(MU.prov==p)return;mpauseAll();if(MUI.yt&&p!='yt')MUI.yt.style.display='none';MU.prov=p;localStorage.mp=p;MU.loaded='';MU.rev=-1;MU.msg='';MU.need=0;
loadCfg().then(()=>p=='am'?amInit().catch(e=>{MU.msg=String((e&&e.message)||e)}):0).then(()=>{mui();if(MS&&MS.tr)mapply()});mui()}
function musicCard(){
const chips=h('div',{class:'chips'},['yt','au','sp','am'].map(p=>h('button',{type:'button','data-p':p,onclick:()=>setProv(p)},PNM[p]))),
st=h('small',{class:'mu'}),
cb=h('button',{type:'button',class:'btn sec sm',style:'display:none',onclick:async()=>{try{if(MU.prov=='sp')await spConnect();else if(MU.prov=='am'){const m=await amInit();await m.authorize();mui();if(MS&&MS.tr)mapply()}}catch(e){toast(String((e&&e.message)||e),1)}}}),
q=h('input',{class:'in',placeholder:'Şarkı / sanatçı adı yaz veya YouTube/MP3 linki yapıştır',autocapitalize:'none',autocorrect:'off',spellcheck:'false',enterkeyhint:'search'}),
res=h('div',{class:'mu-res'}),art=h('div',{class:'mu-art',text:'🎵'}),tt=h('div',{class:'mu-t',text:'Henüz şarkı seçilmedi'}),ar=h('small',{class:'mu',style:'display:block'}),tm=h('small',{class:'mu',style:'display:block'}),
act=(i,fn,sec,l)=>h('button',{type:'button',class:'btn sq'+(sec?' sec':''),'aria-label':l,onclick:fn},ic(i,18)),
bp=act('play',()=>{if(!MS||!MS.tr)return toast('Önce bir şarkı ara ve seç');const p=mexp(),pl=!MS.playing;MU.endSent=0;send({t:pl?'mplay':'mpause',pos:p});MU.optT=Date.now();MU.optP=pl;mapply({...MS,playing:pl,pos:p,at:Date.now()+off})},0,'Çal veya durdur'),
b1=act('back10',()=>{if(MS&&MS.tr)send({t:'mseek',pos:Math.max(0,mexp()-10)})},1,'10 saniye geri'),
b2=act('fwd10',()=>{if(MS&&MS.tr)send({t:'mseek',pos:mexp()+10})},1,'10 saniye ileri'),
rg=h('input',{type:'range',min:0,max:100,value:0,style:'width:100%;display:none;accent-color:var(--ac)',onchange:e=>send({t:'mseek',pos:+e.target.value})}),
msg=h('small',{class:'err'}),need=h('button',{type:'button',class:'btn full',style:'display:none',onclick:()=>mjoin()},'▶ Dinlemeye katıl'),hint=h('div',{class:'mu-hint',style:'display:none'}),ls=h('div',{class:'mu-ls'}),yt=h('div',{class:'mu-yt'});
q.onkeydown=e=>{if(e.key=='Enter'){e.preventDefault();msearch()}};
const root=h('div',{class:'card',id:'mp'},h('div',{class:'row'},ic('music',18),h('h3',{text:'Birlikte müzik'})),
h('small',{text:'Hesap bağlamadan doğrudan şarkı arayıp tam senkron dinleyebilirsiniz. İsterseniz Spotify veya Apple Music de seçebilirsiniz.'}),
h('div',{class:'lbl',text:'Dinleme modu'}),chips,st,cb,
h('div',{class:'row'},q,h('button',{type:'button',class:'btn sq','aria-label':'Ara',onclick:msearch},ic('eye',18))),res,
h('div',{class:'mu-now'},art,h('div',{class:'grow'},tt,ar,tm)),ls,rg,h('div',{class:'row'},b1,bp,b2),msg,need,hint,yt);
MUI={root,chips,st,cb,q,res,art,tt,ar,tm,bp,rg,msg,need,hint,ls,yt,lastArt:null,lastP:null};mui();return root}
function mui(){const U=MUI;if(!U.root)return;
if(!MU.prov){MU.prov='yt';localStorage.mp='yt'}
U.chips.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.p==MU.prov));
let sx='',cbt='';
if(MU.prov=='yt')sx='YouTube (Ücretsiz): Hesap gerekmez. Şarkı adını yazıp arayabilir veya YouTube linki yapıştırabilirsin.';
else if(MU.prov=='au')sx='Önizleme Modu: Hesap gerekmez, iPhone arka planda bile sorunsuz 30sn yüksek kaliteli kesit veya doğrudan .mp3 linki çalar.';
else if(MU.prov=='sp'){const on=!!localStorage.sp;sx=on?'Spotify bağlı ✓ (Premium gerekir, Spotify uygulaması açık olmalı)':'Spotify bağlı değil (Ücretsiz dinlemek için YouTube modunu seçebilirsin).';cbt=on?'':'Spotify’ı bağla'}
else{const on=AM&&AM.isAuthorized;sx=on?'Apple Music bağlı ✓':(AM?'Apple Music bağlı değil.':'Apple Music (Ücretsiz dinlemek için YouTube modunu seçebilirsin).');cbt=(!on&&AM)?'Apple Music’i bağla':''}
U.st.textContent=sx;U.cb.style.display=cbt?'':'none';U.cb.textContent=cbt;
const tr=MS&&MS.tr;U.tt.textContent=tr?tr.title:'Henüz şarkı seçilmedi';U.ar.textContent=tr?((tr.artist||'')+(MS.by?(tr.artist?' · ':'')+MS.by+' seçti':'')):'Birlikte dinlemek için yukarıdan şarkı ara';
const ua=tr&&tr.art||'';if(U.lastArt!==ua){U.lastArt=ua;U.art.replaceChildren(ua?h('img',{src:ua,alt:'',style:'width:100%;height:100%;object-fit:cover;border-radius:12px'}):'🎵')}
const pl=!!(MS&&MS.playing);if(U.lastP!==pl){U.lastP=pl;U.bp.replaceChildren(ic(pl?'pause':'play',18))}
U.msg.textContent=MU.msg||'';const nd=!!(MU.need&&MS&&MS.tr&&MS.playing),ytn=nd&&MU.prov=='yt'&&YM;
U.need.style.display=nd&&!ytn?'':'none';
U.hint.style.display=ytn?'':'none';U.hint.textContent='👇 Telefonun sesi otomatik başlatmana izin vermiyor. Aşağıdaki videonun ortasındaki ▶ düğmesine bir kez dokun; sonraki şarkılar kendiliğinden çalar.';
if(U.yt){U.yt.classList.toggle('tap',!!ytn);if(ytn)U.yt.style.display='block'}
mlsRender();
if(U.yt&&!(MU.prov=='yt'&&YM))U.yt.style.display='none'}
const MLS={ok:['🔊 duyuyor','ok'],buf:['⏳ yükleniyor',''],need:['👆 dokunması gerekiyor','need'],pause:['⏸ durdu',''],off:['— kapalı','']};
function mlsRender(){const U=MUI;if(!U.ls)return;const on=MS&&MS.tr,who=(prevWho||[ME.name]);if(!on){U.ls.replaceChildren();return}
U.ls.replaceChildren(...who.map(n=>{const s=MSH[n]||'off',d=MLS[s]||MLS.off;return h('span',{class:d[1],text:(n==ME.name?'sen':n)+' '+d[0]})}))}
// Sesli dinlemeye katıl: kullanıcı dokunuşu içinde doğrudan çal (YouTube dışı sağlayıcılar için yeterli)
function mjoin(){MU.need=0;MU.fail=0;try{if(MA&&MU.prov=='au')MA.play()}catch(e){}try{if(YM&&YMr&&MU.prov=='yt'){YM.unMute();YM.playVideo()}}catch(e){}if(MS&&MS.tr)mapply();mui();if(MUI.yt)MUI.yt.scrollIntoView({block:'center',behavior:'smooth'})}
// Oynatıcının gerçek durumu -> sunucuya bildir (yalnız değişince)
function mrep(){let s='off';try{if(MS&&MS.tr&&canUse('music')){if(!MS.playing)s='pause';else if(MU.prov=='yt'&&YM&&YMr&&YM.getPlayerState){const p=YM.getPlayerState();s=p==1?'ok':MU.need?'need':'buf'}else if(MU.prov=='au'&&MA)s=!MA.paused?'ok':MU.need?'need':'buf';else s=MU.on?'ok':MU.need?'need':'buf'}}catch(e){}
if(s!==MU.rs){MU.rs=s;send({t:'mst',s})}}
function mtick(){if(!MUI.root||!MS||!MS.tr)return;const p=mexp(),d=MS.tr.dur||0;MUI.tm.textContent=fmt(p)+(d?' / '+fmt(d):'');
if(d){MUI.rg.style.display='';if(document.activeElement!==MUI.rg){MUI.rg.max=d;MUI.rg.value=Math.min(p,d)}if(MS.playing&&p>d+1&&!MU.endSent){MU.endSent=1;send({t:'mpause',pos:d})}}
if(!MS.playing||!canUse('music'))return;
try{if(MU.prov=='yt'&&YM&&YMr&&YM.getPlayerState&&YM.getPlayerState()==1&&Math.abs(YM.getCurrentTime()-p)>2.5)YM.seekTo(p,true);else if(MU.prov=='au'&&MA&&!MA.paused&&p<29&&Math.abs(MA.currentTime-p)>2)MA.currentTime=p;else if(MU.prov=='am'&&AM&&AM.isPlaying&&Math.abs((AM.currentPlaybackTime||0)-p)>2.5)AM.seekToTime(p)}catch(e){}}

// ---------- kelimelik ----------
const WAL='ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
const WLV={A:1,B:3,C:4,Ç:4,D:3,E:1,F:7,G:5,Ğ:8,H:5,I:2,İ:1,J:10,K:1,L:1,M:2,N:1,O:2,Ö:7,P:5,R:1,S:2,Ş:4,T:1,U:2,Ü:3,V:7,Y:3,Z:4,'*':0};
const WPRE=(()=>{const a=Array(225).fill('.'),M=(t,L)=>L.forEach(([r,c])=>{for(const [x,y] of [[r,c],[r,14-c],[14-r,c],[14-r,14-c]])a[x*15+y]=t});
M('1',[[0,3],[3,0],[2,6],[6,2],[6,6],[7,3],[3,7]]);M('2',[[1,5],[5,1],[5,5]]);M('3',[[1,1],[2,2],[3,3],[4,4],[7,7]]);M('4',[[0,0],[0,7],[7,0]]);return a})();
const WPL={'1':'H2','2':'H3','3':'K2','4':'K3'};
const myTurn=()=>!!(WG&&!WG.over&&WG.pl[WG.tn]==ME.name);
function wordCard(){
WU={};PSL='';WPO=null;const cells=[];
const wb=h('div',{class:'wb'});
for(let i=0;i<225;i++){const c=h('div',{class:'wc',role:'button',tabindex:i==112?'0':'-1','aria-label':'Satır '+((i/15|0)+1)+', sütun '+(i%15+1),onclick:()=>wcell(i),onkeydown:e=>wkey(e,i),onpointerdown:e=>{if(WP.has(i))dgStart(e,WP.get(i).ri,i)}});cells.push(c);wb.append(c)}
const sc=h('div',{class:'wsc'}),stx=h('div',{class:'lbl',style:'margin:0;font-size:.85rem'}),rk=h('div',{class:'rk'}),prv=h('div',{class:'wprv'}),bun=h('button',{type:'button',class:'btn sec sm',onclick:()=>wunseen()},'Kalan harfler'),last=h('div',{class:'stack',style:'gap:6px'}),log=h('div',{class:'wlog'});
const bt=(t,fn,cls)=>h('button',{type:'button',class:'btn sm '+(cls||'sec'),onclick:fn},t);
const bplay=bt('Oyna',()=>wplay(),''),brec=bt('Harfleri geri al',()=>{WP=new Map();WS=-1;wgRender()}),bshuf=bt('Karıştır',()=>{if(!WG||!WG.rk)return;const n=WG.rk.length,o=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.random()*(i+1)|0;[o[i],o[j]]=[o[j],o[i]]}const inv={};o.forEach((x,k)=>inv[x]=k);WG.rk=o.map(x=>WG.rk[x]);for(const v of WP.values())v.ri=inv[v.ri];if(WS>=0)WS=inv[WS];wgRender()});
const bpass=bt('Pas',()=>{if(confirm('Bu turu pas geçmek istiyor musun?'))send({t:'wpass'})}),bex=bt('Harf değiştir',()=>wex()),bres=bt('Teslim ol',()=>{if(confirm('Oyunu teslim etmek istiyor musun?'))send({t:'wres'})},'dng');
const bnew=h('button',{type:'button',class:'btn full',onclick:()=>send({t:'wnew'})},'Yeni oyun başlat');
const acts=h('div',{class:'stack',style:'gap:8px'},h('div',{class:'row wrap'},bplay,brec,bshuf),h('div',{class:'row wrap'},bpass,bex,bres));
const root=h('div',{class:'card',id:'wp'},h('div',{class:'row'},ic('word',18),h('h3',{text:'Kelimelik'})),sc,h('div',{class:'row',style:'justify-content:space-between;align-items:center;gap:8px'},stx,bun),wb,rk,prv,acts,bnew,last,log,
h('small',{text:'Harfi parmağınla veya fareyle sürükleyip boş bir kareye bırak; ya da harfe dokun, sonra karaya dokun. Yerleştirdiğin harfe dokunursan ya da tahta dışına sürüklersen geri döner. Yıldızlı taş (joker) istediğin harf olabilir. Kelimeler önce yerleşik Türkçe sözlükte (çekimli biçimler dahil) denetlenir. Sözlükte bulunamayan bir kelime olursa rakibine “Kabul ediyor musun?” diye sorulur: kabul ederse hamle işlenir, etmezse hamle iptal olur ve harfler sende kalır.'}));
WU={root,cells,sc,stx,rk,prv,bun,last,log,bplay,brec,bshuf,bpass,bex,bres,bnew,acts};wgRender();return root}
let DG=null,DGT=0,WRQ=0;
function wput(i,ri,from){const g=WG;if(!myTurn()||!g||g.bd[i])return;
if(from!=null){const p=WP.get(from);if(!p)return;WP.delete(from);WP.set(i,p);WS=-1;wgRender();return}
const l=g.rk&&g.rk[ri];if(l==null)return;for(const [k,v] of [...WP])if(v.ri===ri)WP.delete(k);
if(l=='*'){jokerPick(ch=>{if(WG&&!WG.bd[i]&&!WP.has(i)){WP.set(i,{ri,l:ch,j:1});WS=-1;wgRender()}});return}
WP.set(i,{ri,l,j:0});WS=-1;wgRender()}
function wcell(i){const g=WG;if(!g||g.over||g.bd[i])return;if(Date.now()-DGT<350)return;if(WP.has(i)){WP.delete(i);wgRender();return}
if(!myTurn())return toast('Sıra sende değil');if(WS<0)return toast('Önce alttan bir harf seç');wput(i,WS,null)}
function wkey(e,i){if(e.key=='Enter'||e.key==' '){e.preventDefault();wcell(i);return}
const d={ArrowLeft:-1,ArrowRight:1,ArrowUp:-15,ArrowDown:15}[e.key];if(!d)return;e.preventDefault();
if((d==-1&&i%15==0)||(d==1&&i%15==14))return;const n=i+d;if(n<0||n>224)return;WU.cells[i].tabIndex=-1;WU.cells[n].tabIndex=0;WU.cells[n].focus()}
// --- Pointer Events ile sürükle-bırak (fare, dokunmatik ve kalem) ---
function dgCell(x,y){const el=document.elementFromPoint(x,y),c=el&&el.closest?el.closest('.wc'):null;return c&&WU.cells?WU.cells.indexOf(c):-1}
function dgOk(i){const g=WG;if(!g||g.over||i<0||g.bd[i])return false;return !WP.has(i)||i===DG.from}
function dgStart(e,ri,from){if(!myTurn()||(e.pointerType=='mouse'&&e.button!==0))return;if(DG)dgEnd();
DG={ri,from,sx:e.clientX,sy:e.clientY,id:e.pointerId,mv:0,gh:null,hi:-1};
window.addEventListener('pointermove',dgMove,{passive:false});window.addEventListener('pointerup',dgUp);window.addEventListener('pointercancel',dgEnd)}
function dgMove(e){const d=DG;if(!d||e.pointerId!==d.id)return;
if(!d.mv){if(Math.hypot(e.clientX-d.sx,e.clientY-d.sy)<8)return;d.mv=1;const l=d.from!=null?(WP.get(d.from)||{}).l:((WG&&WG.rk)||[])[d.ri];
d.gh=h('div',{class:'rt dgh'},l=='*'?'★':(l||''));document.body.append(d.gh);document.body.classList.add('dragging')}
if(e.cancelable)e.preventDefault();d.gh.style.left=e.clientX+'px';d.gh.style.top=e.clientY+'px';
const i=dgCell(e.clientX,e.clientY),ok=i>=0&&dgOk(i);
if((ok?i:-1)!==d.hi){if(d.hi>=0)WU.cells[d.hi].classList.remove('dt');d.hi=ok?i:-1;if(ok)WU.cells[i].classList.add('dt')}}
function dgUp(e){const d=DG;if(!d||e.pointerId!==d.id)return;const moved=d.mv,i=d.hi,el=moved?document.elementFromPoint(e.clientX,e.clientY):null;dgEnd();if(!moved)return;DGT=Date.now();
if(i>=0)wput(i,d.ri,d.from);
else if(d.from!=null&&!(el&&el.closest&&el.closest('.wb'))){WP.delete(d.from);wgRender()}}
function dgEnd(){const d=DG;DG=null;window.removeEventListener('pointermove',dgMove);window.removeEventListener('pointerup',dgUp);window.removeEventListener('pointercancel',dgEnd);
if(d){if(d.gh)d.gh.remove();if(d.hi>=0&&WU.cells&&WU.cells[d.hi])WU.cells[d.hi].classList.remove('dt');document.body.classList.remove('dragging')}
if(WRQ){WRQ=0;setTimeout(wgRender,0)}}
function jokerPick(fn){const m=modal('Joker hangi harf olsun?',h('div',{class:'az'},[...WAL].map(c=>h('button',{type:'button',onclick:()=>{m.remove();fn(c)}},c))),[h('button',{class:'btn sec',onclick:()=>m.remove()},'Vazgeç')])}
function wplay(){if(WBZ)return;if(!myTurn())return toast('Sıra sende değil',1);if(!WP.size)return toast('Önce tahtaya harf koy',1);
const v=WPV;if(v&&v.s===PSEQ&&v.mv===WG.mv&&v.e)return toast(v.e,1);
wbusy(1,'Kontrol ediliyor…');send({t:'wplay',p:[...WP.entries()].map(([i,x])=>({i,l:x.l,j:x.j}))})}
function wbusy(on,txt){WBZ=on?1:0;clearTimeout(WBT);const b=WU.bplay;if(b){b.disabled=!!on;if(on)b.textContent=txt||'Kontrol ediliyor…'}if(on)WBT=setTimeout(()=>{wbusy(0);wprevRender()},10000);else wprevRender()}
function wprevSet(m){if(m.s&&m.s<PSEQ)return;WPV=m;wprevRender()}
function wprevRender(){const U=WU;if(!U.prv)return;const show=myTurn()&&WP.size>0&&!WQ;U.prv.style.display=show?'':'none';let lbl='Oyna';
if(show){const v=WPV;
if(!v||v.s!==PSEQ||!WG||v.mv!==WG.mv)U.prv.replaceChildren(h('small',{class:'mu',text:'Hesaplanıyor…'}));
else if(v.none)U.prv.replaceChildren();
else if(v.e)U.prv.replaceChildren(h('small',{class:'err',text:v.e}));
else{const kids=v.words.map(x=>h('span',{class:x.st=='ok'||x.st=='acc'?'ok':x.st=='unk'?'unk':'bad',text:x.w+' '+x.p+(x.st=='unk'?' ?':x.st=='bad'?' ✗':' ✓')}));
kids.push(h('b',{text:'= '+v.pts+' puan'+(v.bingo?' (7 harf bonusu +50 dahil)':'')}));
if(v.words.some(x=>x.st=='unk'))kids.push(h('small',{class:'mu',style:'width:100%;text-align:center',text:'? işaretli kelime sözlükte yok: oynarsan rakibinin onayı istenir.'}));
if(v.words.some(x=>x.st=='bad'))kids.push(h('small',{class:'err',style:'width:100%;text-align:center',text:'✗ işaretli dizi geçerli bir kelime olamaz.'}));
U.prv.replaceChildren(...kids);lbl='Oyna · +'+v.pts}}
if(U.bplay&&!WBZ){U.bplay.textContent=lbl;U.bplay.disabled=false}}
function wunseen(){const g=WG;if(!g)return;const u=g.un||{},tot=Object.values(u).reduce((a,b)=>a+b,0);
modal('Kalan harfler ('+tot+')',h('div',{class:'stack',style:'gap:10px'},h('small',{class:'mu',text:g.rk?'Torbadaki ve rakibinin elindeki harfler (senin elindekiler hariç). Rakibinde '+(g.rkN[g.pl.find(x=>x!=ME.name)]||0)+' harf, torbada '+g.bagN+' harf var.':'Torbadaki ve oyuncuların elindeki harfler.'}),
h('div',{class:'un'},[...WAL,'*'].map(l=>h('div',{class:u[l]?'':'z'},l=='*'?'★':l,h('small',{text:'×'+(u[l]||0)}))))),[h('button',{class:'btn sec',onclick:e=>e.target.closest('.mo').remove()},'Kapat')])}
function wex(){if(WBZ)return;if(!myTurn())return toast('Sıra sende değil',1);const g=WG,pick=new Set();
if(g.bagN<7)return toast('Torbada '+g.bagN+' harf kaldı. Harf değiştirmek için torbada en az 7 harf olmalı.',1);
const info=h('small',{class:'mu'}),go=h('button',{type:'button',class:'btn'},'Değiştir'),tiles=[];
const upd=()=>{tiles.forEach((b,ri)=>b.classList.toggle('sel',pick.has(ri)));go.disabled=!pick.size;info.textContent=pick.size?pick.size+' harf seçildi. Yerine torbadan yenileri gelir; bu tur pas sayılır ve puan alamazsın.':'Değiştirmek istediğin harflere dokun.'};
g.rk.forEach((l,ri)=>tiles.push(h('button',{type:'button',class:'rt',onclick:()=>{pick.has(ri)?pick.delete(ri):pick.add(ri);upd()}},l=='*'?'★':l,l=='*'?null:h('small',{class:'v',text:WLV[l]}))));
const box=h('div',{class:'stack',style:'gap:10px'},h('div',{class:'rk',style:'flex-wrap:wrap'},tiles),h('div',{class:'row wrap'},h('button',{type:'button',class:'btn sec sm',onclick:()=>{g.rk.forEach((_,ri)=>pick.add(ri));upd()}},'Hepsini seç'),h('button',{type:'button',class:'btn sec sm',onclick:()=>{pick.clear();upd()}},'Seçimi temizle')),info);
const m=modal('Harf değiştir',box,[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),go]);
go.onclick=()=>{if(!pick.size||WBZ)return;const ls=[...pick].map(ri=>g.rk[ri]);m.remove();if(DG)dgEnd();WP=new Map();WS=-1;wgRender();wbusy(1,'Değiştiriliyor…');send({t:'wex',ls})};upd()}
function rkSame(a,b){return (a||[]).slice().sort().join()==(b||[]).slice().sort().join()}
function wgSet(g){const p=WG;wbusy(0);
if(p&&g&&p.rk&&g.rk){if(rkSame(p.rk,g.rk))g.rk=p.rk.slice();else{const pool=g.rk.slice(),o=[];for(const l of p.rk){const k=pool.indexOf(l);if(k>=0){o.push(l);pool.splice(k,1)}}g.rk=o.concat(pool)}}
WG=g;
if(!p||p.mv!=g.mv||!rkSame(p.rk,g.rk)){if(DG)dgEnd();WP=new Map();WS=-1;PSL='';if(!p||p.mv!=g.mv)WPO=null}else{for(const i of [...WP.keys()])if(g&&g.bd[i])WP.delete(i)}wgRender()}
function wgChk(m){if(WG&&WG.mv==m.mv&&WG.last){for(const r of m.r){const w=WG.last.words.find(x=>x.w==r.w);if(w)w.ok=r.ok}wgRender()}}
function wgRender(){const U=WU;if(!U.root||TAB!=3||!canUse('word'))return;if(DG&&DG.mv){WRQ=1;return}const g=WG;
const used=new Set([...WP.values()].map(x=>x.ri)),po=(WPO&&g&&WPO.mv==g.mv&&!myTurn())?WPO.p:null;
U.cells.forEach((c,i)=>{const t=g&&g.bd[i],pd=WP.get(i),pq=po&&po.get(i);let cls='wc',kids=[];
if(t){cls+=' t'+(g.bj[i]?' j':'')+(g.last&&g.last.cells&&g.last.cells.indexOf(i)>=0?' n':'');kids=[t];if(!g.bj[i])kids.push(h('small',{class:'v',text:WLV[t]}))}
else if(pd){cls+=' t pd'+(pd.j?' j':'');kids=[pd.l];if(!pd.j)kids.push(h('small',{class:'v',text:WLV[pd.l]}))}
else if(pq){cls+=' po';kids=[pq.l]}
else{const p=WPRE[i];if(p!='.')cls+=' p'+p;kids=i==112?['★']:p!='.'?[h('i',{text:WPL[p]})]:[]}
c.className=cls;c.replaceChildren(...kids)});
const has=!!g;U.bnew.style.display=(!g||g.over)?'':'none';U.bun.style.display=g&&!g.over?'':'none';U.acts.style.display=(g&&!g.over&&g.rk)?'':'none';U.rk.style.display=(g&&g.rk&&!g.over)?'':'none';
if(!g){U.sc.replaceChildren();U.stx.textContent='Henüz oyun yok. İkiniz de odadayken “Yeni oyun başlat”a bas.';U.last.replaceChildren();U.log.replaceChildren();return}
U.sc.replaceChildren(...g.pl.map((n,i)=>h('div',{class:'wpl'+(!g.over&&g.tn==i?' on':'')},h('small',{text:n+(n==ME.name?' (sen)':'')}),h('b',{text:g.sc[n]}))));
U.stx.textContent=g.over?(g.win=='='?'Oyun bitti: berabere':g.win?'Oyun bitti. Kazanan: '+g.win:'Oyun bitti'):(myTurn()?'Sıra sende':g.pl[g.tn]+' oynuyor')+' · torbada '+g.bagN+' harf'+(g.rk?'':' · izleyicisin')+(!g.over&&g.ps>=3?' · art arda '+g.ps+' puansız tur (6 olunca oyun biter)':'');
U.rk.replaceChildren(...(g.rk||[]).map((l,ri)=>used.has(ri)?null:h('button',{type:'button',class:'rt'+(WS==ri?' sel':''),'aria-label':(l=='*'?'Joker':l+' harfi')+', seçmek için Enter',onclick:()=>{if(Date.now()-DGT<350)return;WS=WS==ri?-1:ri;wgRender()},onpointerdown:e=>dgStart(e,ri,null),oncontextmenu:e=>e.preventDefault()},l=='*'?'★':l,l=='*'?null:h('small',{class:'v',text:WLV[l]}))).filter(Boolean));
const L=g.last,items=[];
if(L){items.push(h('div',{class:'mu',text:L.by+(L.kind=='move'?' oynadı: ':' ')+(L.kind=='move'?L.words.map(w=>w.w+' ('+w.p+')').join(', ')+(L.bingo?' · +50 bonus':'')+' = '+L.pts+' puan':L.txt)}));
if(L.kind=='move'){const acc=L.words.filter(w=>w.ok===2);if(acc.length)items.push(h('small',{class:'mu',text:'Rakip onayıyla kabul edildi: '+acc.map(w=>w.w).join(', ')}));
const row=[];if(g.canUndo&&!g.over)row.push(h('button',{type:'button',class:'btn sec sm',onclick:()=>send({t:'wundo'})},'Hamleyi geri al'));
if(L.by!=ME.name&&g.rk&&!g.over&&!g.ob)row.push(h('button',{type:'button',class:'btn dng sm',onclick:()=>send({t:'wobj'})},'İtiraz et'));
if(g.ob)items.push(h('small',{class:'err',text:'İtiraz edildi. '+L.by+' isterse hamleyi geri alabilir.'}));
if(row.length)items.push(h('div',{class:'row wrap'},row))}}
U.last.replaceChildren(...items);U.log.replaceChildren(...g.log.slice().reverse().map(x=>h('div',{text:x})));wprevRender();pendSync()}
function pendSync(){if(!myTurn()||WQ)return;const p=[...WP.entries()].map(([i,x])=>({i,l:x.l,j:x.j})),sj=JSON.stringify(p);if(sj==PSL)return;PSL=sj;PSEQ=Math.max(PSEQ+1,Date.now());send({t:'wpend',p,s:PSEQ});wprevRender()}
function wpSeq(m){if(!m.s)return true;if(WPQ.mv===m.mv&&m.s<WPQ.s)return false;WPQ={mv:m.mv,s:m.s};return true}
if(!window._pendBind){window._pendBind=1;document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='visible'&&typeof myTurn=='function'&&myTurn()){PSL='';pendSync()}})}
function wqGone(){const o=document.getElementById('wqm');if(o)o.remove();clearInterval(WQT);WQT=0}
function wqSet(m){wbusy(0);if(m.id===null||!WG||WG.over||WG.pl.indexOf(ME.name)<0){const was=WQ;WQ=null;wqGone();if(was&&WU.root)wgRender();return}
const same=WQ&&WQ.mv===m.mv&&WQ.by===m.by&&WQ.words.join()===m.words.join();WQ={id:m.id||(same?WQ.id:''),by:m.by,mv:m.mv,words:m.words,end:Date.now()+m.left,done:same?WQ.done:0};
if(WQ.by!==ME.name&&WQ.id&&!WQ.done){const o=document.getElementById('wqm');if(!o||o.dataset.id!==WQ.id){if(o)o.remove();
const t=h('div',{class:'mu',id:'wqt'}),mo=modal(WQ.by+' bir kelime oynadı',h('div',{class:'stack',style:'gap:8px'},h('div',{text:'“'+WQ.words.join(', ')+'” kelimesi sözlükte bulunamadı. Kabul ediyor musun?'}),t),[h('button',{type:'button',class:'btn dng',onclick:()=>wqAns(false)},'Reddet'),h('button',{type:'button',class:'btn',onclick:()=>wqAns(true)},'Kabul et')]);mo.id='wqm';mo.dataset.id=WQ.id}}
else if(WQ.done||WQ.by===ME.name){const o=document.getElementById('wqm');if(o)o.remove()}
clearInterval(WQT);WQT=setInterval(wqTick,500);wqTick()}
function wqTick(){if(!WQ){clearInterval(WQT);WQT=0;return}const s=Math.max(0,Math.ceil((WQ.end-Date.now())/1000));
const t=document.getElementById('wqt');if(t)t.textContent='Kalan süre: '+s+' sn';
if(WQ.by===ME.name&&WU.stx)WU.stx.textContent='Rakibin onayı bekleniyor: “'+WQ.words.join(', ')+'” sözlükte bulunamadı ('+s+' sn)'}
function wqAns(ok){if(!WQ||!WQ.id)return;WQ.done=1;send({t:'wans',id:WQ.id,ok:!!ok});const o=document.getElementById('wqm');if(o)o.remove()}
function wrej(m){wbusy(0);WQ=null;wqGone();WP=new Map();WS=-1;PSL='';toast(m.e,1);wgRender()}

// ---------- başlat ----------
{const qs=new URLSearchParams(location.search),oc=qs.get('code'),os=qs.get('state')||'';
if(qs.get('oda')){PEND=cleanCode(qs.get('oda'));PM=0}if(/^m/.test(os)&&(oc||qs.get('error'))){history.replaceState(null,'',location.pathname);const rr=cleanCode(os.slice(1));if(rr){PEND=rr;PM=0;AUTO=1}if(oc)SPC=oc;else setTimeout(()=>toast('Spotify bağlantısı iptal edildi',1),500)}}
if(PEND)history.replaceState(null,'',location.pathname);
if(T&&ME)enter();else viewLogin();
`;
const HTML = '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0a0b10"><meta name="color-scheme" content="dark"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Bizim Sinema"><title>Bizim Sinema</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E%F0%9F%8E%AC%3C/text%3E%3C/svg%3E"><style>' + CSS + '</style></head><body><div id="app"></div><div id="tt"></div><script>' + JS + '</script></body></html>';
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.youtube.com https://s.ytimg.com https://js-cdn.music.apple.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: http:; media-src * data: blob:; connect-src * wss: ws: data: blob:; frame-src https://www.youtube.com https://www.youtube-nocookie.com https://*.apple.com; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";
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
const getLocks = async env => await (await dbf(env, '/getlocks')).json();
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
        const lk = await getLocks(env);
        const mode = [1, 2, 3].includes(+u.searchParams.get('mode')) ? +u.searchParams.get('mode') : 1;
        return roomStub(env, room).fetch('https://do/ws?n=' + encodeURIComponent(me.n) + '&room=' + room + '&mode=' + mode + '&new=' + (u.searchParams.get('new') == '1' ? 1 : 0) + '&a=' + (adm ? 1 : 0) + '&lk=' + encodeURIComponent(JSON.stringify(lk)), req);
      }
      if (p == '/api/roomq') {
        const code = clean(u.searchParams.get('code')); if (!code) return J({ exists: false, mode: 0 });
        const r = await (await roomStub(env, code).fetch('https://do/info', { method: 'POST', body: '{}' })).json();
        return J({ exists: !!r.exists, mode: r.mode | 0 });
      }
      if (p == '/api/me') return J({ name: me.n, role: me.r });
      if (p == '/api/locks' && req.method == 'GET') return J(await getLocks(env));
      if (p == '/api/music/cfg') return J({ sp: env.SPOTIFY_CLIENT_ID || '', am: !!(env.APPLE_TEAM_ID && env.APPLE_KEY_ID && env.APPLE_PRIVATE_KEY) });
      if (p == '/api/music/search') return J({ items: await musicSearch(u.searchParams.get('q') || '', +u.searchParams.get('n') || 8) });
      if (p == '/api/music/atoken') { try { return J({ t: await appleToken(env) }) } catch (e) { return J({ error: 'Apple Music anahtarı geçersiz veya eksik (APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY)' }, 400) } }
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
      if (p == '/api/locks' && req.method == 'POST') {
        const b = await req.json().catch(() => ({})), r = await (await dbf(env, '/setlocks', { k: b.k, v: b.v })).json();
        if (r.error) return J(r, 400);
        const rs = await (await dbf(env, '/rooms')).json();
        await Promise.all(rs.slice(0, 50).map(x => roomStub(env, x.room).fetch('https://do/locks', { method: 'POST', body: JSON.stringify({ lk: r }) }).catch(() => { })));
        return J(r);
      }
      if (p == '/api/dict') {
        if (req.method == 'GET') return J(await (await dictf(env, '/dictstatus')).json());
        const b = await req.json().catch(() => ({})), path = { install: '/dictinstall', test: '/dicttest', cfg: '/dictcfg', add: '/dictadd', rm: '/dictrm' }[b.a];
        if (!path) return J({ error: 'Geçersiz işlem' }, 400);
        const r = await dictf(env, path, b); return J(await r.json(), r.status);
      }
      if (p == '/api/tdktest') {
        const w = trLower(u.searchParams.get('w') || 'av'), t0 = Date.now();
        try {
          const r = await fetch('https://sozluk.gov.tr/gts?ara=' + encodeURIComponent(w), { headers: { 'user-agent': UA, accept: 'application/json', referer: 'https://sozluk.gov.tr/', 'accept-language': 'tr-TR,tr;q=0.9' }, signal: AbortSignal.timeout(6000) });
          const tx = await r.text();
          return J({ kelime: w, status: r.status, ms: Date.now() - t0, tip: r.headers.get('content-type') || '', govde: tx.slice(0, 300) });
        } catch (e) { return J({ kelime: w, hata: String(e), ms: Date.now() - t0 }) }
      }
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

// ---------- Apple Music geliştirici anahtarı (ES256 JWT) ----------
let AT = { t: '', e: 0 };
async function appleToken(env) {
  if (AT.t && AT.e > Date.now()) return AT.t;
  const pem = String(env.APPLE_PRIVATE_KEY || '').replace(/\\n/g, '\n').replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), c => c.charCodeAt(0)), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const iat = Math.floor(Date.now() / 1000), hd = u64(btoa(JSON.stringify({ alg: 'ES256', kid: env.APPLE_KEY_ID }))), pl = u64(btoa(JSON.stringify({ iss: env.APPLE_TEAM_ID, iat, exp: iat + 86400 })));
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(hd + '.' + pl));
  AT = { t: hd + '.' + pl + '.' + u64(b64(sig)), e: Date.now() + 20 * 36e5 };
  return AT.t;
}

// ---------- Kilitler (0 = açık, 1 = yalnız yöneticiler, 2 = kilitli) ----------
const LKEYS = ['film', 'puzzle', 'music', 'word'];
const normLk = x => { x = x || {}; const nv = (v, d) => { v = +v; return v === 0 || v === 1 || v === 2 ? v : d }; return { film: nv(x.film, 0), puzzle: nv(x.puzzle, 0), music: nv(x.music, 0), word: nv(x.word, 2) } };

// ---------- Müzik (Ücretsiz Arama + Çoklu Kaynak) ----------
function cleanTr(t) {
  if (!t || typeof t != 'object') return null;
  const s = (v, n) => String(v || '').replace(/[\u0000-\u001f]/g, '').slice(0, n), I = t.ids || {};
  const au = String(I.au || '').slice(0, 500);
  const ids = {
    yt: /^[A-Za-z0-9_-]{11}$/.test(String(I.yt || '')) ? String(I.yt) : '',
    sp: /^[A-Za-z0-9]{22}$/.test(String(I.sp || '')) ? String(I.sp) : '',
    am: /^\d{4,20}$/.test(String(I.am || '')) ? String(I.am) : '',
    au: /^https?:\/\/[\w.\-\/?=&%:~+@,;]+$/i.test(au) ? au : ''
  };
  if (!ids.yt && !ids.sp && !ids.am && !ids.au && !s(t.title, 2)) return null;
  let art = s(t.art, 300); if (!/^https?:\/\/[\w.\-\/?=&%:~+@,;]+$/i.test(art)) art = '';
  return { title: s(t.title, 120) || 'Şarkı', artist: s(t.artist, 120), art, dur: Math.max(0, Math.min(36000, Math.round(+t.dur || 0))), ids };
}
async function ytSearchRaw(q, lim) {
  const instances = [
    'https://pipedapi.kavin.rocks/search?filter=music_songs&q=',
    'https://pipedapi.tokhmi.xyz/search?filter=music_songs&q=',
    'https://pipedapi.moomoo.me/search?filter=music_songs&q='
  ];
  for (const base of instances) {
    try {
      const r = await fetch(base + encodeURIComponent(q), { headers: { 'user-agent': UA, accept: 'application/json' }, signal: AbortSignal.timeout(2800) });
      if (r.ok) {
        const j = await r.json(), items = (j && j.items) || [];
        const out = [];
        for (const x of items) {
          const m = String(x.url || '').match(/v=([A-Za-z0-9_-]{11})/);
          if (m) out.push({ title: x.title || 'Şarkı', artist: x.uploaderName || '', art: x.thumbnail || ('https://i.ytimg.com/vi/' + m[1] + '/hqdefault.jpg'), dur: Math.max(0, +x.duration || 0), ids: { yt: m[1] } });
          if (out.length >= lim) break;
        }
        if (out.length) return out;
      }
    } catch (e) {}
  }
  try {
    const r = await fetch('https://www.youtube.com/results?hl=tr&gl=TR&search_query=' + encodeURIComponent(q), { headers: { 'user-agent': UA, 'accept-language': 'tr-TR,tr;q=0.9,en;q=0.8' }, signal: AbortSignal.timeout(3800) });
    if (r.ok) {
      const html = await r.text();
      const out = [], seen = new Set();
      const re = /"videoRenderer":\{"videoId":"([A-Za-z0-9_-]{11})"[\s\S]{1,1800}?"title":\{"runs":\[\{"text":"([^"\\]*(?:\\.[^"\\]*)*)"\}/g;
      let m;
      while ((m = re.exec(html)) && out.length < lim) {
        const id = m[1]; if (seen.has(id)) continue; seen.add(id);
        let title = m[2]; try { title = JSON.parse('"' + m[2] + '"') } catch (e) {}
        const sub = html.slice(m.index, m.index + 2800);
        const am = sub.match(/"ownerText":\{"runs":\[\{"text":"([^"\\]*(?:\\.[^"\\]*)*)"/);
        let artist = am ? am[1] : ''; if (artist) try { artist = JSON.parse('"' + artist + '"') } catch (e) {}
        const dm = sub.match(/"lengthText":\{[^}]*"simpleText":"(\d+):(\d{2})"/);
        const dur = dm ? (+dm[1] * 60 + +dm[2]) : 0;
        out.push({ title, artist, art: 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg', dur, ids: { yt: id } });
      }
      if (out.length) return out;
      const ids = [...new Set((html.match(/"videoId":"([A-Za-z0-9_-]{11})"/g) || []).map(x => x.slice(11, 22)))].slice(0, lim);
      return ids.map(id => ({ title: q, artist: 'YouTube', art: 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg', dur: 0, ids: { yt: id } }));
    }
  } catch (e) {}
  return [];
}
async function itunesSearch(q, lim) {
  try {
    const r = await fetch('https://itunes.apple.com/search?media=music&entity=song&country=TR&limit=' + lim + '&term=' + encodeURIComponent(q), { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(3000) });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.results || []).map(x => ({
      title: x.trackName || 'Şarkı',
      artist: x.artistName || '',
      art: String(x.artworkUrl100 || '').replace('100x100bb', '300x300bb'),
      dur: Math.round((x.trackTimeMillis || 0) / 1000),
      ids: { am: x.trackId ? String(x.trackId) : '', au: x.previewUrl || '' }
    }));
  } catch (e) { return [] }
}
async function musicSearch(q, lim) {
  q = String(q || '').trim().slice(0, 120); if (!q) return [];
  lim = Math.max(1, Math.min(12, lim || 8));
  const [yt, it] = await Promise.all([ytSearchRaw(q, lim), itunesSearch(q, lim)]);
  if (yt.length) {
    yt.forEach((y, i) => {
      const m = it[i] || it[0];
      if (m && m.ids) { if (m.ids.au && !y.ids.au) y.ids.au = m.ids.au; if (m.ids.am && !y.ids.am) y.ids.am = m.ids.am; if (!y.art && m.art) y.art = m.art; if (!y.dur && m.dur) y.dur = m.dur }
    });
    return yt;
  }
  return it;
}

// ---------- Kelimelik (Türkçe Scrabble) ----------
const WLET = { A: [12, 1], B: [2, 3], C: [2, 4], 'Ç': [2, 4], D: [2, 3], E: [8, 1], F: [1, 7], G: [1, 5], 'Ğ': [1, 8], H: [1, 5], I: [4, 2], 'İ': [7, 1], J: [1, 10], K: [7, 1], L: [7, 1], M: [4, 2], N: [5, 1], O: [3, 2], 'Ö': [1, 7], P: [1, 5], R: [6, 1], S: [3, 2], 'Ş': [2, 4], T: [5, 1], U: [3, 2], 'Ü': [2, 3], V: [1, 7], Y: [2, 3], Z: [2, 4], '*': [2, 0] };
const WPRE = (() => { const a = Array(225).fill('.'), M = (t, L) => L.forEach(([r, c]) => { for (const [x, y] of [[r, c], [r, 14 - c], [14 - r, c], [14 - r, 14 - c]]) a[x * 15 + y] = t }); M('1', [[0, 3], [3, 0], [2, 6], [6, 2], [6, 6], [7, 3], [3, 7]]); M('2', [[1, 5], [5, 1], [5, 5]]); M('3', [[1, 1], [2, 2], [3, 3], [4, 4], [7, 7]]); M('4', [[0, 0], [0, 7], [7, 0]]); return a })();
const rnd = n => { const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0] % n };
const shuf = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1);[a[i], a[j]] = [a[j], a[i]] } return a };
const rkVal = r => r.reduce((s, l) => s + WLET[l][1], 0);
function wgDraw(g, n) { const r = g.rk[n]; while (r.length < 7 && g.bag.length) r.push(g.bag.pop()) }
function wgNew(pl) {
  const bag = []; for (const l in WLET) for (let k = 0; k < WLET[l][0]; k++) bag.push(l); shuf(bag);
  const g = { pl, bd: Array(225).fill(''), bj: Array(225).fill(0), bag, rk: {}, sc: {}, tn: rnd(2), ps: 0, mv: 1, lm: '', last: null, over: 0, win: '', prev: '', ob: 0, log: [] };
  for (const n of pl) { g.rk[n] = []; g.sc[n] = 0; wgDraw(g, n) }
  g.log.push('Oyun başladı. İlk sıra: ' + pl[g.tn]); return g;
}
const wgSnap = g => JSON.stringify({ ...g, prev: '' });
const wgLog = (g, x) => { g.log.push(x); if (g.log.length > 40) g.log.splice(0, g.log.length - 40) };
function wgFinish(g, out) {
  const [a, b] = g.pl; const pa = rkVal(g.rk[a]), pb = rkVal(g.rk[b]);
  g.sc[a] -= pa; g.sc[b] -= pb; if (out === a) g.sc[a] += pb; else if (out === b) g.sc[b] += pa;
  g.over = 1; g.win = g.sc[a] > g.sc[b] ? a : g.sc[b] > g.sc[a] ? b : '='; wgLog(g, 'Oyun bitti: ' + a + ' ' + g.sc[a] + ' - ' + g.sc[b] + ' ' + b);
}
function wgNext(g, name) { g.tn = 1 - g.tn; g.mv++; g.ob = 0 }
function wgPlay(g, name, pl) {
  if (!g || g.over) return { e: 'Oyun bitti' };
  if (g.pl[g.tn] !== name) return { e: 'Sıra sende değil' };
  if (!Array.isArray(pl) || !pl.length || pl.length > 7) return { e: 'Geçersiz hamle' };
  const rack = g.rk[name].slice(), put = new Map();
  for (const q of pl) {
    const i = q && q.i | 0; if (!q || i < 0 || i > 224 || g.bd[i] || put.has(i)) return { e: 'Geçersiz kare' };
    const j = q.j ? 1 : 0, l = String(q.l || ''); if (!WLET[l] || l == '*') return { e: 'Geçersiz harf' };
    const k = rack.indexOf(j ? '*' : l); if (k < 0) return { e: 'Elinde olmayan bir harf kullandın' };
    rack.splice(k, 1); put.set(i, { l, j });
  }
  const get = i => put.has(i) ? put.get(i) : (g.bd[i] ? { l: g.bd[i], j: g.bj[i] } : null);
  const idx = [...put.keys()], rs = new Set(idx.map(i => i / 15 | 0)), cs = new Set(idx.map(i => i % 15));
  if (rs.size > 1 && cs.size > 1) return { e: 'Harfler tek satır veya tek sütunda olmalı' };
  const run = (i, dr, dc) => { let r = i / 15 | 0, c = i % 15; for (; ;) { const pr = r - dr, pc = c - dc; if (pr < 0 || pc < 0 || !get(pr * 15 + pc)) break; r = pr; c = pc } const cells = []; while (r < 15 && c < 15 && get(r * 15 + c)) { cells.push(r * 15 + c); r += dr; c += dc } return cells };
  const horiz = rs.size == 1 && cs.size > 1, vert = cs.size == 1 && rs.size > 1;
  if (horiz || vert) { const m = run(idx[0], horiz ? 0 : 1, horiz ? 1 : 0); if (!idx.every(i => m.indexOf(i) >= 0)) return { e: 'Harfler arasında boşluk var' } }
  const seen = new Set(), words = [];
  for (const i of idx) for (const [dr, dc] of [[0, 1], [1, 0]]) { const c = run(i, dr, dc); if (c.length < 2) continue; const k = c[0] + ':' + dr; if (seen.has(k)) continue; seen.add(k); words.push(c) }
  if (!words.length) return { e: 'En az iki harfli bir kelime oluşmalı' };
  const empty = !g.bd.some(x => x);
  if (empty) { if (!put.has(112)) return { e: 'İlk kelime ortadaki yıldızdan geçmeli' } }
  else if (!words.some(w => w.some(c => !put.has(c)))) return { e: 'Kelime tahtadaki harflere bağlanmalı' };
  let total = 0; const out = [];
  for (const cells of words) {
    let s = 0, wm = 1, w = '';
    for (const c of cells) { const t = get(c); w += t.l; const v = t.j ? 0 : WLET[t.l][1]; let lm = 1; if (put.has(c)) { const pr = WPRE[c]; if (pr == '1') lm = 2; else if (pr == '2') lm = 3; else if (pr == '3') wm *= 2; else if (pr == '4') wm *= 3 } s += v * lm }
    out.push({ w, p: s * wm, ok: null }); total += s * wm;
  }
  const bingo = put.size == 7; if (bingo) total += 50;
  for (const [i, t] of put) { g.bd[i] = t.l; g.bj[i] = t.j }
  g.rk[name] = rack; wgDraw(g, name); g.sc[name] += total; g.ps = 0; g.lm = name;
  g.last = { kind: 'move', by: name, pts: total, words: out, cells: idx, bingo: bingo ? 1 : 0 };
  wgLog(g, name + ': ' + out.map(x => x.w).join(', ') + ' (+' + total + ')');
  if (!g.rk[name].length && !g.bag.length) { g.mv++; wgFinish(g, name) } else wgNext(g, name);
  return { ok: 1, pts: total, words: out };
}
function wgPass(g, name) {
  if (!g || g.over) return { e: 'Oyun bitti' }; if (g.pl[g.tn] !== name) return { e: 'Sıra sende değil' };
  g.ps++; g.lm = ''; g.prev = ''; g.last = { kind: 'pass', by: name, txt: 'pas geçti', pts: 0 }; wgLog(g, name + ' pas geçti');
  if (g.ps >= 6) { g.mv++; wgFinish(g, null) } else wgNext(g, name); return { ok: 1 };
}
function wgEx(g, name, ix, ls) {
  if (!g || g.over) return { e: 'Oyun bitti' }; if (g.pl[g.tn] !== name) return { e: 'Sıra sende değil' };
  if (g.bag.length < 7) return { e: 'Torbada ' + g.bag.length + ' harf kaldı. Harf değiştirmek için torbada en az 7 harf olmalı.' };
  const r = g.rk[name], rest = r.slice(), old = [];
  if (Array.isArray(ls) && ls.length) {
    if (ls.length > r.length) return { e: 'Geçersiz harf' };
    for (const x of ls) { const k = rest.indexOf(String(x)); if (k < 0) return { e: 'Elinde olmayan bir harf seçtin. Sayfayı yenileyip tekrar dene.' }; old.push(rest.splice(k, 1)[0]) }
  } else if (Array.isArray(ix) && ix.length) { // eski istemciler için
    const u = [...new Set(ix.map(x => x | 0))]; if (u.some(i => i < 0 || i >= r.length)) return { e: 'Geçersiz harf' };
    for (const i of u.sort((p, q) => q - p)) old.push(rest.splice(i, 1)[0]);
  } else return { e: 'Harf seç' };
  // Kural: önce torbadan yeni harfler çekilir, sonra eskiler torbaya karıştırılır (aynı harfi geri çekemezsin)
  g.rk[name] = rest; wgDraw(g, name); g.bag.push(...old); shuf(g.bag);
  g.ps++; g.lm = ''; g.prev = ''; g.last = { kind: 'ex', by: name, txt: old.length + ' harf değiştirdi', pts: 0 }; wgLog(g, name + ' ' + old.length + ' harf değiştirdi');
  if (g.ps >= 6) { g.mv++; wgFinish(g, null) } else wgNext(g, name); return { ok: 1 };
}
function wgRes(g, name) {
  if (!g || g.over) return { e: 'Oyun bitti' }; g.over = 1; g.win = g.pl.find(n => n !== name) || ''; g.mv++; g.lm = ''; g.prev = ''; wgLog(g, name + ' teslim oldu'); g.last = { kind: 'res', by: name, txt: 'teslim oldu', pts: 0 }; return { ok: 1 };
}
function wgUndo(g, name) {
  if (!g || g.lm !== name || !g.prev) return { e: 'Geri alınamaz' };
  const mv = g.mv, p = JSON.parse(g.prev); for (const k of Object.keys(g)) delete g[k]; Object.assign(g, p); g.mv = mv + 1; g.prev = ''; g.ob = 0; wgLog(g, name + ' hamlesini geri aldı'); return { ok: 1 };
}
function wgView(g, n) {
  const rkN = {}; for (const k of g.pl) rkN[k] = g.rk[k].length;
  const un = {}; for (const l of g.bag) un[l] = (un[l] || 0) + 1; for (const k of g.pl) if (k !== n) for (const l of g.rk[k]) un[l] = (un[l] || 0) + 1;
  return { pl: g.pl, bd: g.bd, bj: g.bj, sc: g.sc, tn: g.tn, mv: g.mv, ps: g.ps | 0, un, bagN: g.bag.length, rk: g.pl.indexOf(n) >= 0 ? g.rk[n] : null, rkN, over: g.over, win: g.win, last: g.last, ob: g.ob, canUndo: !!(g.prev && g.lm == n), log: g.log.slice(-14) };
}
// ---------- Yerel sözlük: kelime geçerliliğinin ASIL otoritesi ----------
// Sıra: yerel sözlük (kök listesi + Türkçe ek çözümleyici) -> bulunamazsa "bilinmeyen" -> (isteğe bağlı) TDK -> yine yoksa RAKİP ONAYI.
// Yerel sözlük "sözlükte yok" diye hamleyi tek başına reddetmez; yalnızca anlamsız dizileri (wordShape) anında reddederiz.
const TRV = 'aeıioöuü', TRBACK = 'aıou', TRVL = 'çfhkpsşt';
const isV = c => TRV.indexOf(c) >= 0;
const TRFRONT = new Set(['saat', 'harf', 'kalp', 'hal', 'rol', 'gol', 'alkol', 'ihtimal', 'mahsul', 'usul', 'sual', 'meşgul', 'hakikat', 'kabil', 'meşhur', 'hayal', 'ahlak', 'meal', 'nüfus', 'ihmal', 'kemal', 'cemal', 'meal', 'şehir']);
const TRAORIR = new Set(['al', 'bil', 'bul', 'dur', 'gel', 'gör', 'kal', 'ol', 'öl', 'san', 'var', 'ver', 'vur']);
const TRDROP = new Set(['ağız', 'alın', 'ömür', 'burun', 'boyun', 'karın', 'omuz', 'gönül', 'oğul', 'şehir', 'resim', 'isim', 'akıl', 'fikir', 'vakit', 'kayıp', 'zihin', 'nehir', 'şükür', 'sabır', 'kabir', 'emir', 'hüküm', 'ilim', 'cisim', 'şekil', 'nakil', 'seyir', 'zulüm', 'kavim', 'kahır', 'vasıf', 'metin', 'uzuv']);
const TRDBL = new Set(['hak', 'his', 'af', 'zam', 'hat', 'sır', 'şık', 'hac', 'haz']);
const TRNOSOFT = new Set(['hukuk', 'ahlak', 'merak', 'ittifak', 'ihtiyat']);
const lastVowel = s => { for (let i = s.length - 1; i >= 0; i--) if (isV(s[i])) return s[i]; return 'e' };
const syl = s => { let n = 0; for (const c of s) if (isV(c)) n++; return n };
function vI(v) { return v == 'a' || v == 'ı' ? 'ı' : v == 'e' || v == 'i' ? 'i' : v == 'o' || v == 'u' ? 'u' : 'ü' }
// Şablon -> yüzey. A: a/e, I: ı/i/u/ü, D: d/t, C: c/ç; (y)(n)(s): ünlüyle biten bağlamda eklenir; (I): ünsüzle biten bağlamda eklenir
function realize(tpl, ctx, front) {
  let cur = ctx, out = ''; const add = ch => { out += ch; cur += ch };
  const lv = () => front && !/[aeıioöuü]/.test(out) ? 'e' : lastVowel(cur);
  for (let k = 0; k < tpl.length; k++) {
    const c = tpl[k];
    if (c == '(') { const g = tpl[k + 1]; k += 2; const ve = isV(cur[cur.length - 1]); if (g == 'I') { if (!ve) add(vI(lv())) } else if (ve) add(g) }
    else if (c == 'A') add(TRBACK.indexOf(lv()) >= 0 ? 'a' : 'e');
    else if (c == 'I') add(vI(lv()));
    else if (c == 'D') add(TRVL.indexOf(cur[cur.length - 1]) >= 0 ? 't' : 'd');
    else if (c == 'C') add(TRVL.indexOf(cur[cur.length - 1]) >= 0 ? 'ç' : 'c');
    else add(c);
  }
  return out;
}
const P1 = ['m', 'n', '', 'k', 'nIz', 'lAr'], P2 = ['(y)Im', 'sIn', '', '(y)Iz', 'sInIz', 'lAr'];
const mk = (a, nx) => a.map(t => [t, nx]);
const COPS = [['(y)DI', 'cp1'], ['(y)mIş', 'cp2'], ['(y)sA', 'cp1'], ['(y)ken', 'END']];
const CASES = [['(y)I', 'NCASE'], ['(y)A', 'NCASE'], ['DA', 'NLOC'], ['DAn', 'NCASE'], ['(n)In', 'NGEN'], ['(y)lA', 'NCASE']];
const CASES3 = [['nI', 'NCASE'], ['nA', 'NCASE'], ['ndA', 'NLOC'], ['ndAn', 'NCASE'], ['nIn', 'NGEN'], ['(y)lA', 'NCASE']];
const POSS = [['(I)m', 'NPOSS'], ['(I)n', 'NPOSS'], ['(s)I', 'NP3'], ['(I)mIz', 'NPOSS'], ['(I)nIz', 'NPOSS']];
const PERSN = mk(['(y)Im', 'sIn', '(y)Iz', 'sInIz'], 'END');
const VT = neg => {
  const a = [['DI', 'TNS1'], ['mIş', 'TNS2'], ['mIş', 'N'], ['(y)AcAk', 'TNS2'], ['(y)AcAk', 'N'], ['mAlI', 'TNS2'], ['(y)A', 'OPT'], ['sA', 'TNS1'],
    ['An', 'N'], ['DIk', 'N'], ['(y)Ip', 'END'], ['(y)ArAk', 'END'], ['(y)IncA', 'END'], ['(y)AlI', 'END'], ['DIkçA', 'END'], ['mAdAn', 'END'], ['(y)Iş', 'N'], ['mA', 'N'], ['mAk', 'N'],
    ['(y)In', 'END'], ['(y)InIz', 'END'], ['sIn', 'END'], ['sInlAr', 'END'], ['(y)AlIm', 'END'], ['', 'END']];
  if (neg) a.push(['z', 'NZ'], ['m', 'END'], ['(y)Iz', 'END']); else a.push(['mI', 'NEGY'], ['AOR', 'TNS2'], ['AOR', 'N'], ['(I)yor', 'TNS2']);
  return a;
};
const ST = {
  N: [['lAr', 'NP'], ...POSS, ...CASES, ['DIr', 'END'], ...COPS, ...PERSN],
  NP: [...POSS, ...CASES, ['DIr', 'END'], ...COPS, ...PERSN],
  NPOSS: [...CASES, ['DIr', 'END'], ...COPS],
  NP3: [...CASES3, ['DIr', 'END'], ...COPS],
  NCASE: [['DIr', 'END'], ...COPS], NLOC: [['ki', 'N'], ['DIr', 'END'], ...COPS, ...PERSN], NGEN: [['ki', 'N'], ['DIr', 'END'], ...COPS],
  cp1: mk(P1, 'END'), cp2: mk(P2, 'END'), END: [],
  V: [['mA', 'NEG'], ...VT(false)], NEG: VT(true), NEGY: [['yor', 'TNS2']], NZ: mk(['', 'sIn', 'sInIz', 'lAr', 'ken'], 'END'),
  TNS1: [...mk(P1, 'END'), ['(y)sA', 'cp1']], TNS2: [...mk(P2, 'END'), ...COPS],
  OPT: mk(['(y)Im', 'sIn', '', 'lIm', 'sInIz', 'lAr'], 'END')
};
const NOACC = new Set(['NEGY']);
function aorForms(cx, root) { if (isV(cx[cx.length - 1])) return ['r']; return syl(root) == 1 ? (TRAORIR.has(root) ? ['Ir'] : ['Ar']) : ['Ir'] }
function walk(state, ctx, rest, front, root) {
  const seen = new Set();
  const go = (st, cx, rs, fr, depth) => {
    if (!rs) return !NOACC.has(st);
    if (depth > 10) return false;
    const key = st + '|' + rs + '|' + cx.slice(-2) + fr; if (seen.has(key)) return false; seen.add(key);
    for (const [t0, nx] of ST[st] || []) {
      for (const t of t0 == 'AOR' ? aorForms(cx, root) : [t0]) {
        const s = realize(t, cx, fr), vars = [s];
        if (s.endsWith('k') && /(AcAk|DIk|mAk)$/.test(t)) vars.push(s.slice(0, -1) + 'ğ');
        for (const c of vars) {
          if (!rs.startsWith(c) || (c === '' && nx == st)) continue;
          if (c.endsWith('ğ') && !(rs.length > c.length && isV(rs[c.length]))) continue;
          const nrs = rs.slice(c.length);
          if (nx == 'END') { if (!nrs) return true; continue }
          if (go(nx, cx + c, nrs, false, depth + 1)) return true;
        }
      }
    }
    return false;
  };
  return go(state, ctx, rest, front, 0);
}
// word: küçük harfli kelime; has(kök, 'n'|'v'): kök sözlükte mi
function trAnalyze(word, has) {
  if (has(word, 'n') || has(word, 'v')) return true;
  for (let k = word.length - 1; k >= 1; k--) {
    const stem = word.slice(0, k), rest = word.slice(k), l = stem[stem.length - 1], vr = isV(rest[0]);
    const nouns = [stem], verbs = [stem];
    if (vr) {
      const p = stem[stem.length - 2];
      const m = { b: 'p', c: 'ç', ğ: 'k', d: 't' }[l];
      if (m && syl(stem) >= 2) { const r = stem.slice(0, -1) + m; if (m == 'p' || m == 'ç' ? !TRNOSOFT.has(r) : m == 'k' ? isV(p) && !TRNOSOFT.has(r) : true) nouns.push(r) }
      if (stem.endsWith('ng')) nouns.push(stem.slice(0, -2) + 'nk');
      if (TRDBL.has(stem.slice(0, -1)) && l == stem[stem.length - 2]) nouns.push(stem.slice(0, -1));
      if (stem == 'suy') nouns.push('su');
      if (!isV(l) && !isV(p)) for (const v of 'ıiuü') { const r = stem.slice(0, -1) + v + l; if (TRDROP.has(r)) nouns.push(r) }
      if (l == 'd' && (stem == 'gid' || stem.endsWith('ed'))) verbs.push(stem.slice(0, -1) + 't');
    }
    if (rest[0] == 'y') { if (stem == 'di') verbs.push('de'); if (stem == 'yi') verbs.push('ye') }
    if (rest.startsWith('yor') && stem.length > 1) { const b = stem.slice(0, -1); if (stem[stem.length - 1] === vI(lastVowel(b))) verbs.push(b + (TRBACK.indexOf(lastVowel(b)) >= 0 ? 'a' : 'e')) }
    for (const r of new Set(nouns)) {
      if (r === stem && vr && (TRDROP.has(r) || TRDBL.has(r) || (syl(r) >= 2 && !TRNOSOFT.has(r) && /([pç]|[aeıioöuü]k)$/.test(r)))) continue; // bu köklerde ünlüyle başlayan ek öncesi değişim zorunlu
      if (has(r, 'n') && walk('N', stem, rest, TRFRONT.has(r), r)) return true;
    }
    for (const r of new Set(verbs)) if (has(r, 'v') && walk('V', stem, rest, false, r)) return true;
  }
  return false;
}

const SEED = `ad af ağ ah ak al an ar as at av ay az bu da de do ek el en er es eş et ev ey fa ha he il in iz ki la mi ne ol on oy öd ön öz re si su şu un uç ün üs ya ye iç ip ok oh
ben sen biz siz onlar bana sana ona bize size onu bunu şunu buna şuna bunun şunun onun benim senin bizim sizin beni seni bizi sizi kim kime kimi kimin hangi ne nasıl neden niçin nerede nereye nereden
ve ile ama fakat çünkü gibi kadar daha çok en pek hiç her bazı bütün tüm hep hemen artık sadece yalnız belki evet hayır yok var değil için ise yani ancak ayrıca üzere sonra önce şimdi bugün yarın dün
ev el göz kitap araba çocuk kedi köpek ekmek yol gün gece sabah akşam kız oğlan erkek kadın adam insan baba anne kardeş abla abi dost arkadaş okul ders öğrenci öğretmen kalem defter masa sandalye kapı pencere oda bahçe ağaç çiçek yaprak dağ deniz göl nehir ırmak orman toprak taş kum hava yağmur kar rüzgar güneş yıldız gök bulut ateş ışık renk kırmızı mavi yeşil sarı siyah beyaz kara büyük küçük uzun kısa iyi kötü güzel çirkin yeni eski genç yaşlı sıcak soğuk tatlı acı ekşi tuz şeker süt peynir yağ et balık tavuk yumurta meyve elma armut üzüm portakal muz sebze domates biber soğan patates pirinç un çay kahve
baş yüz kulak burun ağız diş dil boyun omuz kol parmak tırnak sırt karın bacak diz ayak kalp kan kemik deri saç sakal kaş kirpik yanak çene
para pazar market dükkan fiyat hesap banka kart şehir köy ülke dünya yer yön sağ sol ileri geri üst alt iç dış yan ön arka orta başka diğer aynı farklı
zaman saat dakika saniye hafta ay yıl mevsim ilkbahar yaz sonbahar kış pazartesi salı çarşamba perşembe cuma cumartesi
bir iki üç dört beş altı yedi sekiz dokuz on yirmi otuz kırk elli altmış yetmiş seksen doksan yüz bin milyon
kuş at inek koyun keçi tavşan aslan kaplan kurt tilki ayı fare yılan balık arı kelebek sinek karınca kaz ördek horoz
ışık ses müzik şarkı film oyun spor top maç takım gol rol harf kelime cümle söz yazı mektup haber gazete dergi radyo telefon bilgisayar ekran tuş
ağabey kalabalık sokak cadde köprü bina duvar çatı zemin merdiven asansör koltuk yatak yastık battaniye halı perde lamba ayna saat tabak kaşık çatal bıçak bardak fincan tencere
mutlu üzgün yorgun aç tok hasta sağlıklı hızlı yavaş kolay zor önemli gerekli doğru yanlış tamam hazır boş dolu açık kapalı temiz kirli ağır hafif kalın ince geniş dar
sevgi aşk dostluk barış savaş hak adalet özgürlük umut korku merak heyecan öfke sevinç acı gülücük
iş çalışma görev sorun çözüm fikir düşünce bilgi haber cevap soru neden sonuç amaç plan proje takım
kıyı plaj ada körfez liman gemi uçak tren otobüs bisiklet motor
ağaç dal kök tohum çim ot bahçıvan
el eli ayak ayağı
gelmek gitmek yapmak almak vermek bakmak görmek bilmek olmak demek yemek içmek okumak yazmak başlamak bitirmek bitmek durmak kalmak çıkmak girmek koşmak yürümek oturmak kalkmak uyumak uyanmak gülmek ağlamak sevmek istemek beklemek aramak bulmak kaybetmek kazanmak oynamak çalışmak anlamak söylemek konuşmak sormak anlatmak dinlemek düşünmek unutmak hatırlamak taşımak götürmek getirmek göndermek açmak kapatmak koymak tutmak atmak çekmek itmek kesmek kırmak yıkamak pişirmek ölmek doğmak büyümek yaşamak öğrenmek öğretmek kullanmak denemek seçmek ödemek satmak
etmek ekmek`.split(/\s+/).filter(Boolean);
const trLower = w => String(w).replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
// Tek satırı (düz liste ya da Hunspell .dic) temizleyip kümeye ekler. Büyük harfle başlayanlar özel isimdir, alınmaz.
function lexAdd(set, line) {
  let w = String(line).split('/')[0].split('\t')[0].trim();
  if (!w || w[0] == '#' || /\s/.test(w) || /^\d+$/.test(w)) return;
  if (w[0] !== w[0].toLowerCase()) return;
  w = trLower(w.replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u'));
  if (w.length < 2 || w.length > 15 || !/^[a-zçğıiöşü]+$/.test(w)) return;
  set.add(w);
}
function lexParse(text, lx) { for (const l of String(text).replace(/^\uFEFF/, '').split(/\r?\n/)) lexAdd(lx, l); return lx }
const LEX_MAX = 2500000;
// Bellek dostu sözlük: kelimeler 4096 kovaya dağıtılır, her kova "\nkelime\nkelime\n" biçiminde TEK bir metin.
// 1,5 milyon kelime ~30 MB tutar (ayrı ayrı dizgi tutan Set'in üçte biri); arama birkaç mikrosaniye.
const LB = 4096;
function lexH(w) { let h = 2166136261; for (let i = 0; i < w.length; i++) { h ^= w.charCodeAt(i); h = Math.imul(h, 16777619) } return (h >>> 0) % LB }
class Lex {
  // vAll: bazı Hunspell sözlükleri fiilleri mastar (gelmek) yerine çıplak kök (gel) olarak tutar; o zaman her kök fiil adayı sayılır
  constructor(words, vAll) { this.b = new Array(LB).fill('\n'); this.cnt = 0; this.v = new Set(); this.vAll = !!vAll; for (const w of words || []) this.add(w); this.has = (w, k) => k == 'n' ? this.hasN(w) : (this.v.has(w) || (this.vAll && this.hasN(w))) }
  hasN(w) { return this.b[lexH(w)].indexOf('\n' + w + '\n') >= 0 }
  add(w) { const h = lexH(w), k = this.b[h]; if (k.indexOf('\n' + w + '\n') >= 0) return false; this.b[h] = k + w + '\n'; this.cnt++; if (w.length > 4 && /m[ae]k$/.test(w)) this.v.add(w.slice(0, -3)); return true }
  setBucket(i, t) { this.b[i] = t; let c = 0; for (let j = 1; j < t.length; j++) if (t.charCodeAt(j) === 10) { c++; } this.cnt += c; if (/m[ae]k\n/.test(t)) for (const m of t.matchAll(/\n([a-zçğıiöşü]{2,})m[ae]k(?=\n)/g)) this.v.add(m[1]) }
  ok(w) { return trAnalyze(w, this.has) }
}
const dictf = (env, path, body) => env.DO.get(env.DO.idFromName('dict')).fetch('https://do' + path, { method: 'POST', body: JSON.stringify(body || {}) });
const DICTC = new Map();
// Ağa gitmeden önce açıkça kelime olamayacak dizileri ele (ör. "ççççç", "qwx", ünlüsüz diziler).
function wordShape(w) {
  const s = trLower(w);
  if (s.length < 2 || s.length > 15 || !/^[a-zçğıiöşü]+$/.test(s)) return false;
  if (!/[aeıioöuü]/.test(s) || /(.)\1\1/.test(s) || /[^aeıioöuü]{5,}/.test(s)) return false;
  return true;
}
// İsteğe bağlı 3. adım. true = TDK'da var, false = yok, null = servise ulaşılamadı
async function tdkOne(q, tries = 2, ms = 4000) {
  for (let t = 0; t < tries; t++) {
    try {
      const r = await fetch('https://sozluk.gov.tr/gts?ara=' + encodeURIComponent(q), { headers: { 'user-agent': UA, accept: 'application/json', referer: 'https://sozluk.gov.tr/', 'accept-language': 'tr-TR,tr;q=0.9' }, signal: AbortSignal.timeout(ms) });
      if (!r.ok) continue;
      const j = await r.json();
      if (Array.isArray(j)) {
        if (!j.length) return false;
        const named = j.filter(x => x && typeof x.madde == 'string');
        if (!named.length) return true;
        return named.some(x => trLower(x.madde).replace(/\s*\(\d+\)\s*$/, '').trim() === q);
      }
      if (j && j.error) return false;
    } catch (e) { }
  }
  return null;
}
const WPM_MS = 60000;

// ---------- Durable Object: "db" = kullanıcılar + canlı panel, "room:KOD" = oda ----------
const fresh = () => ({ url: '', ref: '', playing: false, held: false, pos: 0, at: Date.now(), by: '', rev: 0 });
export class Do {
  constructor(s, env) {
    this.s = s; this.env = env; this.rl = new Map(); this.hb = []; this.pzi = null; this.ok = 0;
    s.blockConcurrencyWhile(async () => {
      const g = await s.storage.get(['st', 'pzp', 'chat', 'code', 'rooms', 'lk', 'ms', 'wg', 'roomMode', 'wpm', 'wacc']);
      this.st = g.get('st') || fresh(); this.pend = null; this.pzp = g.get('pzp') || null; this.chat = g.get('chat') || []; this.code = g.get('code') || ''; this.rooms = g.get('rooms') || {}; this.lk = normLk(g.get('lk')); this.ms = g.get('ms') || null; this.wg = g.get('wg') || null; this.roomMode = [1,2,3].includes(+g.get('roomMode')) ? +g.get('roomMode') : 1; this.roomModeSet = [1,2,3].includes(+g.get('roomMode'));
      this.wpm = g.get('wpm') || null; this.wacc = new Set(g.get('wacc') || []); this.pq = null; this.lex = null; this.dmeta = null; this.dcfg = { tdk: 0 }; this.dver = 0; if (this.wpm) this.wpmArm();
    });
  }
  socks() { return this.s.getWebSockets().filter(w => w.readyState === 1) }
  can(area, a) { const v = (this.lk && this.lk[area]) | 0; return v == 0 || (v == 1 && !!(a && a.a)) }
  async lkApply(nl) {
    nl = normLk(nl); if (JSON.stringify(nl) === JSON.stringify(this.lk)) return false;
    this.lk = nl; await this.s.storage.put('lk', nl); this.all(JSON.stringify({ t: 'locks', lk: nl }));
    let pzs = null;
    for (const w of this.socks()) {
      if (this.s.getTags(w).includes('admin')) continue;
      const a = w.deserializeAttachment() || {};
      try { if (this.pzp && this.can('puzzle', a)) { if (pzs == null) pzs = JSON.stringify({ t: 'pz', pz: { ...this.pzp, img: await this.img() } }); w.send(pzs) } } catch (e) { }
    }
    this.wsend(); this.bcast(); return true;
  }
  deny(ws) { try { ws.send(JSON.stringify({ t: 'locks', lk: this.lk })) } catch (e) { } }
  wsend() { for (const w of this.socks()) { if (this.s.getTags(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; try { w.send(JSON.stringify({ t: 'wg', g: this.wg && this.can('word', a) ? wgView(this.wg, a.n) : null })) } catch (e) { } } }
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
      const wantNew = u.searchParams.get('new') == '1';
      const reqMode = [1, 2, 3].includes(+u.searchParams.get('mode')) ? +u.searchParams.get('mode') : 1;
      const refuse = (c, why) => { const [cl, sv0] = Object.values(new WebSocketPair()); sv0.accept(); sv0.close(c, why); return new Response(null, { status: 101, webSocket: cl }) };
      if (!this.roomModeSet && !wantNew && !this.code) return refuse(4404, 'oda yok');
      if (this.roomModeSet && wantNew && reqMode !== this.roomMode) return refuse(4409, 'kod dolu');
      let ss = this.socks();
      if (ss.length >= 8) { ss.sort((x, y) => ((x.deserializeAttachment() || {}).ls || 0) - ((y.deserializeAttachment() || {}).ls || 0)); while (ss.length >= 8) { const o = ss.shift(); try { o.close(4001, 'eski') } catch (e) { } } }
      const code = clean(u.searchParams.get('room')); if (code && !this.code) { this.code = code; await S.put('code', code) }
      if (!this.roomModeSet) { this.roomMode = reqMode; this.roomModeSet = true; await S.put('roomMode', this.roomMode) }
      const [c, sv] = Object.values(new WebSocketPair()); let lkp = null; try { lkp = JSON.parse(u.searchParams.get('lk') || 'null') } catch (e) { }
      if (lkp) await this.lkApply(lkp);
      const att = { n: u.searchParams.get('n'), a: u.searchParams.get('a') == '1' ? 1 : 0, ls: Date.now() };
      this.s.acceptWebSocket(sv); sv.serializeAttachment(att);
      await S.deleteAlarm(); this.bcast();
      sv.send(JSON.stringify({ t: 'roomMode', mode: this.roomMode }));
      sv.send(JSON.stringify({ t: 'hist', c: this.chat.slice(-40) }));
      sv.send(JSON.stringify({ t: 'locks', lk: this.lk }));
      if (this.pzp && this.can('puzzle', att)) sv.send(JSON.stringify({ t: 'pz', pz: { ...this.pzp, img: await this.img() } }));
      if (this.wg && this.can('word', att)) { sv.send(JSON.stringify({ t: 'wg', g: wgView(this.wg, att.n) })); if (!this.wg.over) this.dwarm() }
      if (this.pend && this.pend.by !== att.n && this.can('word', att)) sv.send(this.pendMsg());
      if (this.wpm && this.can('word', att)) sv.send(this.wqMsg(att.n));
      await this.report(); return new Response(null, { status: 101, webSocket: c });
    }
    if (p == '/adminws') { const [c, sv] = Object.values(new WebSocketPair()); this.s.acceptWebSocket(sv, ['admin']); sv.send(this.snap()); return new Response(null, { status: 101, webSocket: c }) }
    if (p == '/kill') {
      this.socks().forEach(w => { try { w.close(4000, 'kapatildi') } catch (e) { } });
      await S.deleteAll(); this.st = fresh(); this.pzp = null; this.pzi = null; this.chat = []; this.code = ''; this.roomMode = 1; this.roomModeSet = false; this.ms = null; this.wg = null; this.wpm = null; this.wacc = new Set(); clearTimeout(this.wpmT); return Response.json({ ok: 1 });
    }
    const b = await req.json().catch(() => ({}));
    if (p.startsWith('/dict')) return this.dictRoute(p, b);
    if (p == '/info') return Response.json({ exists: this.roomModeSet, mode: this.roomModeSet ? this.roomMode : 0 });
    if (p == '/locks') { await this.lkApply(b.lk); return Response.json({ ok: 1 }) }
    if (p == '/getlocks') { const l = await S.get('locks'); return Response.json(normLk(l)) }
    if (p == '/setlocks') {
      if (LKEYS.indexOf(b.k) < 0 || ![0, 1, 2].includes(+b.v)) return Response.json({ error: 'Geçersiz kilit' }, { status: 400 });
      const l = normLk(await S.get('locks')); l[b.k] = +b.v; await S.put('locks', l); return Response.json(l);
    }
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
  msg(i) { return JSON.stringify({ t: 'st', st: this.st, now: Date.now(), who: [...new Set(this.socks().map(w => (w.deserializeAttachment() || {}).n))], hb: this.hb, ms: this.ms, mh: this.mhear(), i }) }
  // Müzik dinleme durumu (yalnız bellekte/soket ekinde, kalıcı yazılmaz): ok=duyuyor, buf=yükleniyor, need=dokunması gerekiyor, pause=durdu
  mhear() { const r = {}, rank = { ok: 4, buf: 3, pause: 2, need: 1 }; for (const w of this.socks()) { if (this.s.getTags(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (!a.n || !a.mu) continue; if (!r[a.n] || (rank[a.mu] || 0) > (rank[r[a.n]] || 0)) r[a.n] = a.mu } return r }
  bcast() { this.all(this.msg()) }
  async webSocketMessage(ws, raw) {
    if (typeof raw != 'string' || raw.length > 980000) return;
    if (this.s.getTags(ws).includes('admin')) return;
    let m; try { m = JSON.parse(raw) } catch (e) { return }
    if (!m || typeof m != 'object') return;
    const now = Date.now(), a = ws.deserializeAttachment() || {}, n = a.n, S = this.s.storage, T = m.t;
    const rl = this.rl.get(ws) || { t: now, c: 0 }; if (now - rl.t > 1000) { rl.t = now; rl.c = 0 } rl.c++; this.rl.set(ws, rl); if (rl.c > 40) return;
    if (T == 'ping') {
      if (this.wpm && now >= this.wpm.dl) await this.wpmCancel('Rakip ' + (WPM_MS / 1000) + ' saniye içinde yanıt vermedi. Hamle iptal edildi, harfler sende; tekrar deneyebilirsin.');
      if (this.pend && this.pend.by !== n && this.pend.p.length) { try { ws.send(this.pendMsg()) } catch (e) { } }
      if (this.wpm) { try { ws.send(this.wqMsg(n)) } catch (e) { } }
      if (this.hold(now)) { await S.put('st', this.st); this.bcast() } else ws.send(this.msg(+m.i || 0)); if (now - (this.lp || 0) > 30000) { this.lp = now; await this.report() }
      a.ls = now; try { ws.serializeAttachment(a) } catch (e) { }
      if (now - (this.lkAt || 0) > 4000) { this.lkAt = now; try { const r = await this.env.DO.get(this.env.DO.idFromName('db')).fetch('https://do/getlocks', { method: 'POST', body: '{}' }); await this.lkApply(await r.json()) } catch (e) { } }
      return }
    if (T == 'mst') { const v = ['ok', 'buf', 'need', 'pause', 'off'].includes(m.s) ? m.s : 'off'; if (a.mu === v) return; a.mu = v; ws.serializeAttachment(a); return this.bcast() }
    if (T == 'buf') { a.b = m.b ? 1 : 0; a.bt = now; ws.serializeAttachment(a); if (this.hold(now)) await S.put('st', this.st); return this.bcast() }
    if (T == 'chat') {
      const x = String(m.x || '').trim().slice(0, 500); if (!x) return;
      const c = { id: now.toString(36) + Math.random().toString(36).slice(2, 6), n, x, ts: now };
      this.chat.push(c); if (this.chat.length > 60) this.chat.splice(0, this.chat.length - 60); await S.put('chat', this.chat);
      return this.all(JSON.stringify({ t: 'chat', ...c }));
    }
    if (T == 'react') { const e = String(m.e || ''); if (!['❤️', '😂', '😮', '👏', '🔥', '😢'].includes(e)) return; return this.all(JSON.stringify({ t: 'react', e, n })) }
    if (T == 'pzn' || T == 'pzm') { if (!this.can('puzzle', a)) return this.deny(ws) }
    if (T == 'set' || T == 'play' || T == 'pause' || T == 'seek') { if (!this.can('film', a)) return this.deny(ws) }
    if (T == 'mset' || T == 'mplay' || T == 'mpause' || T == 'mseek') {
      if (!this.can('music', a)) return this.deny(ws);
      const ms = this.ms, p = Math.max(0, Math.min(36000, +m.pos || 0));
      if (T == 'mset') {
        const tr = cleanTr(m.tr); if (!tr) return;
        this.ms = { tr, playing: true, pos: 0, at: now, by: n, rev: (ms ? ms.rev : 0) + 1 };
        await S.put('ms', this.ms); this.all(JSON.stringify({ t: 'sys', x: '🎵 ' + n + ': ' + tr.title + (tr.artist ? ' – ' + tr.artist : '') })); return this.bcast();
      }
      if (!ms) return;
      if (T == 'mplay') { this.ms = { ...ms, playing: true, pos: p, at: now, by: n } }
      else if (T == 'mpause') { this.ms = { ...ms, playing: false, pos: p, at: now, by: n } }
      else this.ms = { ...ms, pos: p, at: now, by: n };
      this.ms.rev = ms.rev + 1; await S.put('ms', this.ms); return this.bcast();
    }
    if (T && T[0] == 'w') {
      if (!this.can('word', a)) return this.deny(ws);
      if (T == 'wpend') { this.pendSet(n, m.p, m.s); return this.wprev(ws, n, m.s) }
      if (T == 'wans') return this.wpmAnswer(n, m);
      if (this.wpm && (T == 'wplay' || T == 'wpass' || T == 'wex' || T == 'wundo' || T == 'wobj' || T == 'wnew')) return ws.send(JSON.stringify({ t: 'werr', e: 'Rakibin onayı bekleniyor, birkaç saniye bekle.' }));
      const g = this.wg; let r = null, chk = null;
      if (T == 'wnew') {
        if (g && !g.over) return ws.send(JSON.stringify({ t: 'werr', e: 'Önce mevcut oyunu bitir (teslim ol)' }));
        const names = [...new Set(this.socks().filter(w => !this.s.getTags(w).includes('admin') && this.can('word', w.deserializeAttachment() || {})).map(w => (w.deserializeAttachment() || {}).n))].filter(Boolean);
        if (names.length < 2 || names.indexOf(n) < 0) return ws.send(JSON.stringify({ t: 'werr', e: 'Oyun için iki kişi odada olmalı' }));
        this.wg = wgNew([n, names.find(x => x !== n)]); this.dwarm(); this.all(JSON.stringify({ t: 'sys', x: '🔤 Kelimelik başladı' })); r = { ok: 1 };
      } else if (g) {
        const snap = wgSnap(g);
        if (T == 'wplay') r = await this.wplay(g, n, m);
        else if (T == 'wpass') r = wgPass(g, n);
        else if (T == 'wex') r = wgEx(g, n, m.ix, m.ls);
        else if (T == 'wres') r = wgRes(g, n);
        else if (T == 'wundo') r = wgUndo(g, n);
        else if (T == 'wobj') { if (g.last && g.last.kind == 'move' && g.last.by !== n && g.pl.indexOf(n) >= 0 && !g.over) { g.ob = 1; wgLog(g, n + ' itiraz etti'); g.mv++; r = { ok: 1 } } else r = { e: 'İtiraz edilecek hamle yok' } }
      }
      if (!r) return;
      if (r.e) return ws.send(JSON.stringify({ t: 'werr', e: r.e }));
      await S.put('wg', this.wg); this.pendClear(); this.wsend();
      if (this.wpm && (!this.wg || this.wg.over)) await this.wpmCancel(null);
      return;
    }
    if (T == 'pzn') {
      const z = m.pz; if (!z || typeof z.img != 'string' || !/^data:image\/jpeg;base64,/.test(z.img) || z.img.length > 850000) return;
      const c = z.c | 0, r = z.r | 0; if (c < 2 || r < 2 || c > 60 || r > 60 || c * r > 1200 || !Array.isArray(z.p) || z.p.length != c * r) return;
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
    else if (T == 'play') { ns = { ...st, playing: true, pos, at: now, by: n } }
    else if (T == 'pause') { ns = { ...st, playing: false, held: false, pos, at: now, by: n } }
    else if (T == 'seek') ns = { ...st, pos, at: now, by: n };
    else return;
    ns.rev = (st.rev || 0) + 1; this.st = ns; this.hold(now);
    await S.put('st', this.st); this.bcast(); if (T == 'set') await this.report();
  }
  // ---------- Sözlük DO'su ('dict') ----------
  async dictLoad() {
    if (this.lex) return this.lex; const S = this.s.storage;
    const meta = (await S.get('dmeta')) || null, extra = (await S.get('dextra')) || [];
    const lex = new Lex([], meta && meta.vAll);
    if (meta && meta.parts && meta.fmt == 2) {
      const keys = []; for (let i = 0; i < meta.parts; i++) keys.push('dw:' + String(i).padStart(4, '0'));
      for (let i = 0; i < keys.length; i += 32) { const sl = keys.slice(i, i + 32), g = await S.get(sl); for (const k of sl) { const t = g.get(k); if (t) t.b.forEach((x, j) => lex.setBucket(t.s + j, x)) } }
    }
    for (const w of SEED) lex.add(w); for (const w of extra) lex.add(w);
    this.dmeta = meta && meta.fmt == 2 ? meta : null; this.dcfg = (await S.get('dcfg')) || { tdk: 0 }; this.dver = (meta ? meta.ts : 0) + extra.length;
    this.lex = lex; return lex;
  }
  async dictRoute(p, b) {
    const S = this.s.storage, err = (e, s = 400) => Response.json({ error: e }, { status: s }), lex = await this.dictLoad();
    if (p == '/dictcheck') {
      const r = {}; for (const w of (Array.isArray(b.w) ? b.w : []).slice(0, 20)) { const q = String(w); r[q] = wordShape(q) && lex.ok(q) ? 1 : 0 }
      return Response.json({ r, v: this.dver, full: !!this.dmeta, tdk: this.dcfg.tdk ? 1 : 0 });
    }
    if (p == '/dictstatus') {
      const acc = (await S.get('dacc')) || {};
      return Response.json({ n: lex.cnt, v: lex.v.size, seed: SEED.length, meta: this.dmeta, extra: ((await S.get('dextra')) || []).length, tdk: this.dcfg.tdk ? 1 : 0, acc: Object.entries(acc).map(([w, x]) => ({ w, c: x.c, ts: x.ts })).sort((a, c) => c.ts - a.ts).slice(0, 100) });
    }
    if (p == '/dictcfg') { this.dcfg = { tdk: b.tdk ? 1 : 0 }; await S.put('dcfg', this.dcfg); return Response.json({ ok: 1, tdk: this.dcfg.tdk }) }
    if (p == '/dictacc') {
      const acc = (await S.get('dacc')) || {};
      for (const w of (Array.isArray(b.words) ? b.words : []).slice(0, 10)) { const q = trLower(String(w)); if (!wordShape(q)) continue; const x = acc[q] || { c: 0 }; x.c++; x.ts = Date.now(); acc[q] = x }
      const ks = Object.keys(acc); if (ks.length > 400) ks.sort((x, y) => acc[x].ts - acc[y].ts).slice(0, ks.length - 400).forEach(k => delete acc[k]);
      await S.put('dacc', acc); return Response.json({ ok: 1 });
    }
    if (p == '/dictadd' || p == '/dictrm') {
      const ws = (Array.isArray(b.w) ? b.w : []).map(x => trLower(String(x))).filter(wordShape).slice(0, 200);
      const acc = (await S.get('dacc')) || {}; for (const w of ws) delete acc[w]; await S.put('dacc', acc);
      if (p == '/dictadd') { const ex = new Set((await S.get('dextra')) || []); for (const w of ws) ex.add(w); await S.put('dextra', [...ex].slice(0, 5000)); this.lex = null }
      return Response.json({ ok: 1, n: ws.length });
    }
    if (p == '/dicttest') {
      const T = [['eş', 1], ['av', 1], ['at', 1], ['el', 1], ['ay', 1], ['ev', 1], ['kitap', 1], ['kitabı', 1], ['kitaplar', 1], ['evlerimizde', 1], ['çocuğu', 1], ['geldim', 1], ['gidiyorum', 1], ['okuyacağız', 1], ['yaparsınız', 1], ['qxzvw', 0], ['ççççç', 0]];
      return Response.json({ full: !!this.dmeta, r: T.map(([w, e]) => { const g = wordShape(w) && lex.ok(w) ? 1 : 0; return { w, e, g } }) });
    }
    if (p == '/dictinstall') {
      // Dosya akış hâlinde, parça parça okunur; kelimeler doğrudan sıkışık kovalara yazılır (onlarca MB'lık sözlük belleği taşırmaz).
      let lx = new Lex([], false), src = '';
      if (b.url) {
        const u = String(b.url).trim(); if (!/^https:\/\//i.test(u)) return err('Adres https:// ile başlamalı');
        try {
          const r = await fetch(u, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(90000) }); if (!r.ok || !r.body) return err('İndirme başarısız: HTTP ' + r.status);
          const rd = r.body.getReader(), dec = new TextDecoder('utf-8'); let rest = '', bytes = 0, bad = 0;
          for (;;) {
            const { done, value } = await rd.read(); if (done) break;
            bytes += value.byteLength; if (bytes > 80e6) { try { rd.cancel() } catch (e) { } return err('Dosya çok büyük (80 MB üstü)') }
            const t = rest + dec.decode(value, { stream: true }), ls = t.split('\n'); rest = ls.pop();
            for (const l of ls) { if (l.indexOf('�') >= 0) bad++; lexAdd(lx, l) }
            if (lx.cnt > LEX_MAX) { try { rd.cancel() } catch (e) { } return err('Liste çok büyük (2,5 milyondan fazla kelime)') }
          }
          lexAdd(lx, rest + dec.decode());
          if (bad > 50 && lx.cnt < 1000) return err('Dosya UTF-8 değil. Lütfen UTF-8 kodlu bir sözlük kullan.');
          src = u;
        } catch (e) { return err('İndirme başarısız: ' + e) }
      } else if (typeof b.text == 'string') { if (b.text.length > 40e6) return err('Dosya çok büyük'); lexParse(b.text, lx); src = 'yüklenen dosya' }
      else return err('Adres ya da dosya gerekli');
      const n = lx.cnt;
      if (n > LEX_MAX) return err('Liste çok büyük (' + n + ' kelime).');
      if (n < 1000) return err('Listede yeterli kelime bulunamadı (' + n + '). Doğru dosyayı seçtiğinden emin ol: Hunspell .dic ya da her satırda bir kelime olan .txt.');
      this.lex = null;
      const old = [...(await S.list({ prefix: 'dw:' })).keys()]; for (let i = 0; i < old.length; i += 128) await S.delete(old.slice(i, i + 128));
      // Ardışık kovaları ~60 bin karakterlik parçalar hâlinde kaydet (her değer 128 KB sınırının altında)
      let pi = 0, batch = {}, bn = 0, cur = { s: 0, b: [] }, len = 0;
      const push = async () => { batch['dw:' + String(pi++).padStart(4, '0')] = cur; if (++bn >= 32) { await S.put(batch); batch = {}; bn = 0 } };
      for (let i = 0; i < LB; i++) { const t = lx.b[i]; if (cur.b.length && len + t.length > 60000) { await push(); cur = { s: i, b: [] }; len = 0 } cur.b.push(t); len += t.length }
      await push(); if (bn) await S.put(batch);
      const vAll = lx.v.size < n * 0.01 * 0.5;
      await S.put('dmeta', { n, parts: pi, ts: Date.now(), src, vAll, fmt: 2 });
      lx.vAll = vAll; for (const w of SEED) lx.add(w); for (const w of ((await S.get('dextra')) || [])) lx.add(w);
      this.lex = lx; this.dmeta = await S.get('dmeta'); this.dver = this.dmeta.ts;
      return Response.json({ ok: 1, n, v: lx.v.size, vAll });
    }
    return err('yok', 404);
  }
  // ---------- Kelimelik: doğrulama ve rakip onayı ----------
  // Döner: [{w, st}] st: 'ok' (sözlükte) | 'acc' (bu odada daha önce kabul edilmiş) | 'bad' (anlamsız dizi) | 'unk' (bilinmeyen -> rakip onayı)
  async wvalid(words, noTdk) {
    const res = [], need = [];
    for (const w of words) {
      const q = trLower(w);
      if (!wordShape(q)) res.push({ w, st: 'bad' });
      else if (this.wacc.has(q)) res.push({ w, st: 'acc' });
      else { const c = DICTC.get(q); if (c && c.ts > Date.now() - (c.ok ? 3e5 : 2e4)) res.push({ w, st: c.ok ? 'ok' : 'unk' }); else { res.push({ w, st: '?', q }); need.push(q) } }
    }
    if (need.length) {
      const uq = [...new Set(need)]; let r = {}, tdkOn = 0;
      try { const j = await (await dictf(this.env, '/dictcheck', { w: uq })).json(); r = j.r || {}; tdkOn = j.tdk } catch (e) { }
      const tk = {}; if (tdkOn && !noTdk) await Promise.all(uq.filter(q => !r[q]).map(async q => { tk[q] = (await tdkOne(q, 1, 2500)) === true }));
      for (const x of res) if (x.st == '?') { const ok = !!(r[x.q] || tk[x.q]); x.st = ok ? 'ok' : 'unk'; if (ok || !tdkOn || !noTdk) DICTC.set(x.q, { ok, ts: Date.now() }) }
      if (DICTC.size > 3000) DICTC.clear();
    }
    return res;
  }
  async wplay(g, n, m) {
    const mv0 = g.mv, test = JSON.parse(JSON.stringify(g)), trial = wgPlay(test, n, m.p);
    if (!trial.ok) return trial;
    const res = await this.wvalid(trial.words.map(x => x.w));
    if (this.wg !== g || g.mv !== mv0 || g.over || this.wpm) return null; // bu arada durum değişti
    const bad = res.filter(x => x.st == 'bad');
    if (bad.length) return { e: 'Geçersiz harf dizisi: ' + bad.map(x => x.w).join(', ') + '. Hamle kabul edilmedi.' };
    const unk = res.filter(x => x.st == 'unk').map(x => x.w);
    if (unk.length) return await this.wpmStart(g, n, m.p, unk);
    const snap = wgSnap(g), r = wgPlay(g, n, m.p);
    if (r.ok) { g.prev = snap; for (const x of r.words) { const y = res.find(z => z.w == x.w); x.ok = y && y.st == 'acc' ? 2 : true } }
    return r;
  }
  async wprev(ws, n, s) {
    const g = this.wg, sq = +s || 0, out = o => { try { ws.send(JSON.stringify({ t: 'wprev', s: sq, mv: g.mv, ...o })) } catch (e) { } };
    if (!g || g.over || g.pl[g.tn] !== n || this.wpm) return;
    if (sq && this.pq && this.pq.n === n && this.pq.mv === g.mv && sq < this.pq.s) return;
    this.dwarm();
    const p = this.pend && this.pend.by === n && this.pend.mv === g.mv ? this.pend.p : [];
    if (!p.length) return out({ none: 1 });
    const tr = wgPlay(JSON.parse(JSON.stringify(g)), n, p);
    if (!tr.ok) return out({ e: tr.e });
    const res = await this.wvalid(tr.words.map(x => x.w), true);
    if (this.wg !== g) return;
    out({ pts: tr.pts, bingo: p.length == 7 ? 1 : 0, words: tr.words.map((x, k) => ({ w: x.w, p: x.p, st: res[k].st })) });
  }
  // Sözlük nesnesini önceden uyandır: "Oyna"ya basıldığında sözlük zaten bellekte olsun
  dwarm() { const t = Date.now(); if (t - (this.dw || 0) < 60000) return; this.dw = t; this.s.waitUntil(dictf(this.env, '/dictcheck', { w: ['ev'] }).then(r => r.text()).catch(() => { })) }
  oppOf(g, n) { return g.pl.find(x => x !== n) || '' }
  hasSock(nm) { return this.socks().some(w => !this.s.getTags(w).includes('admin') && (w.deserializeAttachment() || {}).n === nm) }
  wqMsg(forName) {
    const q = this.wpm; if (!q) return JSON.stringify({ t: 'wq', id: null });
    const g = this.wg, opp = g ? this.oppOf(g, q.by) : '';
    return JSON.stringify({ t: 'wq', id: forName === opp ? q.id : '', by: q.by, mv: q.mv, words: q.words, left: Math.max(0, q.dl - Date.now()) });
  }
  wqSend() { for (const w of this.socks()) { if (this.s.getTags(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (!this.can('word', a)) continue; try { w.send(this.wqMsg(a.n)) } catch (e) { } } }
  wpmArm() { clearTimeout(this.wpmT); if (!this.wpm) return; this.wpmT = setTimeout(() => { this.wpmExpire().catch(() => { }) }, Math.max(0, this.wpm.dl - Date.now()) + 250) }
  async wpmExpire() { if (this.wpm && Date.now() >= this.wpm.dl) await this.wpmCancel('Rakip ' + (WPM_MS / 1000) + ' saniye içinde yanıt vermedi. Hamle iptal edildi, harfler sende; tekrar deneyebilirsin.') }
  async wpmCancel(reason) {
    const q = this.wpm; if (!q) return; this.wpm = null; clearTimeout(this.wpmT); await this.s.storage.delete('wpm'); this.wqSend();
    if (reason) for (const w of this.socks()) { if (this.s.getTags(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (a.n === q.by) try { w.send(JSON.stringify({ t: 'wrej', mv: q.mv, e: reason })) } catch (e) { } }
  }
  async wpmStart(g, n, p, unk) {
    const opp = this.oppOf(g, n);
    if (!opp || !this.hasSock(opp)) return { e: '“' + unk.join(', ') + '” sözlükte bulunamadı ve rakip odada olmadığı için onay alınamadı. Rakip gelince tekrar dene.' };
    const pl = p.map(q => ({ i: q.i | 0, l: String(q.l || ''), j: q.j ? 1 : 0 }));
    this.wpm = { id: crypto.randomUUID(), by: n, mv: g.mv, p: pl, words: unk, dl: Date.now() + WPM_MS };
    await this.s.storage.put('wpm', this.wpm); this.wpmArm(); this.wqSend(); return null;
  }
  async wpmAnswer(n, m) {
    const q = this.wpm, g = this.wg;
    // Sahte/yetkisiz onayları yok say: yalnız sırası olmayan RAKİP, doğru kimlik ve doğru hamle için cevap verebilir
    if (!q || !g || g.over || m.id !== q.id || n === q.by || g.pl.indexOf(n) < 0 || g.mv !== q.mv || g.pl[g.tn] !== q.by) return;
    if (m.ok !== true) return this.wpmCancel('Rakip “' + q.words.join(', ') + '” kelimesini kabul etmedi. Hamle iptal edildi; harfler sende, sıra sende.');
    const test = JSON.parse(JSON.stringify(g)), tr = wgPlay(test, q.by, q.p);
    if (!tr.ok) return this.wpmCancel('Hamle artık geçerli değil: ' + tr.e);
    this.wpm = null; clearTimeout(this.wpmT); await this.s.storage.delete('wpm');
    const snap = wgSnap(g), r = wgPlay(g, q.by, q.p); g.prev = snap;
    const un = new Set(q.words.map(trLower)); for (const x of r.words) x.ok = un.has(trLower(x.w)) ? 2 : true;
    for (const k of un) this.wacc.add(k); if (this.wacc.size > 300) this.wacc = new Set([...this.wacc].slice(-300));
    await this.s.storage.put('wacc', [...this.wacc]); await this.s.storage.put('wg', g);
    this.pendClear(); this.wsend(); this.wqSend();
    this.s.waitUntil(dictf(this.env, '/dictacc', { words: [...un] }).catch(() => { }));
  }
  // Sırası olan oyuncunun henüz oynanmamış taslak harfleri: yalnız bellekte, puana/tahtaya etkisi yok. Sıra numarası (s) eski taslağın yenisini ezmesini önler.
  pendMsg() { const p = this.pend; return JSON.stringify({ t: 'wpend', by: p ? p.by : '', mv: p ? p.mv : 0, p: p ? p.p : [], s: p && this.pq && this.pq.n === p.by && this.pq.mv === p.mv ? this.pq.s : 0 }) }
  pendSend(except) { const m = this.pendMsg(); for (const w of this.socks()) { if (this.s.getTags(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (except && a.n === except) continue; if (!this.can('word', a)) continue; try { w.send(m) } catch (e) { } } }
  pendClear() { if (!this.pend) return; this.pend = null; this.pendSend() }
  pendSet(n, raw, s) {
    const g = this.wg; if (!g || g.over || g.pl[g.tn] !== n || this.wpm) return;
    if (!Array.isArray(raw) || raw.length > 7) return;
    const sq = Number.isFinite(+s) ? +s : 0;
    if (sq && this.pq && this.pq.n === n && this.pq.mv === g.mv && sq <= this.pq.s) return;
    const seen = new Set(), p = [];
    for (const q of raw) {
      if (!q || typeof q != 'object') return;
      const i = q.i, l = String(q.l || ''); if (!Number.isInteger(i) || i < 0 || i > 224 || g.bd[i] || seen.has(i) || !WLET[l] || l == '*') return;
      seen.add(i); p.push({ i, l, j: q.j ? 1 : 0 });
    }
    if (sq) this.pq = { n, mv: g.mv, s: sq };
    this.pend = { by: n, mv: g.mv, p }; this.pendSend(n); if (!p.length) this.pend = null;
  }
  async gone(ws) {
    try { ws.close(1000) } catch (e) { } this.rl.delete(ws); if (this.s.getTags(ws).includes('admin')) return;
    if (this.pend && !this.socks().some(w => (w.deserializeAttachment() || {}).n === this.pend.by)) this.pendClear();
    if (this.wpm) { const q = this.wpm, g = this.wg, opp = g ? this.oppOf(g, q.by) : ''; if (!this.hasSock(q.by)) await this.wpmCancel(null); else if (!opp || !this.hasSock(opp)) await this.wpmCancel('Rakibin bağlantısı koptu. Hamle iptal edildi, harfler sende; tekrar deneyebilirsin.') }
    const now = Date.now(); if (this.hold(now)) await this.s.storage.put('st', this.st);
    this.bcast(); await this.report(); if (!this.socks().length) await this.s.storage.setAlarm(now + 6 * 36e5);
  }
  async webSocketClose(ws) { await this.gone(ws) }
  async webSocketError(ws) { await this.gone(ws) }
  async alarm() {
    if (this.socks().length) return;
    await this.s.storage.deleteAll(); this.st = fresh(); this.pzp = null; this.pzi = null; this.chat = []; this.code = ''; this.roomMode = 1; this.roomModeSet = false; this.ms = null; this.wg = null; this.wpm = null; this.wacc = new Set(); clearTimeout(this.wpmT);
  }
}
