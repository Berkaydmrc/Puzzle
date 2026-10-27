// BIZIM SINEMA v6 — tek dosya. Cloudflare > Workers > Edit code'a komple yapistir.
const HTML = "<!DOCTYPE html><html lang=\"tr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\"><meta name=\"theme-color\" content=\"#120d18\"><title>Bizim Sinema</title>\n<style>\n:root{--ac:#ff5d8f;--ac2:#ff8fb1;--bg:#120d18;--cd:#1c1526;--bd:#2c2238;--mu:#9a8aa8;--tx:#f5eef9}*{box-sizing:border-box;margin:0;-webkit-tap-highlight-color:transparent}\nbody{font:500 15px/1.4 -apple-system,system-ui,sans-serif;background:radial-gradient(700px 400px at 10% -5%,#3a1730,transparent),radial-gradient(600px 400px at 100% 100%,#241a4a,transparent),var(--bg);color:var(--tx);min-height:100dvh;display:flex;justify-content:center;padding:max(18px,env(safe-area-inset-top)) 16px max(18px,env(safe-area-inset-bottom))}\nmain{width:min(560px,100%);display:grid;gap:14px;align-content:start;margin:auto 0}\n.c{background:var(--cd);border:1px solid var(--bd);border-radius:22px;padding:18px;display:grid;gap:12px;box-shadow:0 18px 40px #0006}\n.logo{width:54px;height:54px;border-radius:17px;background:linear-gradient(135deg,var(--ac2),var(--ac));display:grid;place-items:center;font-size:26px;box-shadow:0 10px 24px #ff5d8f55}\nh1{font-size:1.55rem;font-weight:800}h2{font-size:1.1rem;font-weight:700}small,.mu{color:var(--mu);font-size:.8rem}\ninput,button{font:inherit;padding:14px;border-radius:14px;border:1px solid var(--bd);width:100%;color:var(--tx);background:#150f1d;outline:0}\ninput:focus{border-color:var(--ac)}input::placeholder{color:#6d5f7a}\nbutton{background:linear-gradient(135deg,var(--ac2),var(--ac));border:0;font-weight:700;color:#fff;cursor:pointer;box-shadow:0 8px 20px #ff5d8f40}button:active{transform:scale(.98)}\nbutton.s{background:#2a2036;box-shadow:none;color:var(--ac2)}button.d{background:#3a1c28;color:#ff7b8f;box-shadow:none}\n.r{display:flex;gap:8px;align-items:center}.r>input{flex:1}.r>button{width:auto;flex:none;padding:12px 16px}\nvideo{width:100%;aspect-ratio:16/9;background:#000;border-radius:16px}\n.pill{display:flex;gap:8px;align-items:center;background:#150f1d;border:1px solid var(--bd);border-radius:999px;padding:8px 14px;font-size:.82rem;color:var(--mu)}\n.dot{width:9px;height:9px;border-radius:50%;background:#555;flex:none}.on{background:#35d07f;box-shadow:0 0 8px #35d07f}\n.u{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--bd)}.u:last-child{border:0}\n.tag{font-size:.7rem;background:#2a2036;color:var(--ac2);padding:2px 8px;border-radius:99px;margin-left:6px}\ndetails summary{color:var(--mu);font-size:.82rem;cursor:pointer}details input{margin-top:8px}\n#ov{position:fixed;inset:0;background:#000c;display:none;place-items:center;font-size:1.3rem;font-weight:700;z-index:9}\n#tt{position:fixed;left:50%;top:max(14px,env(safe-area-inset-top));transform:translate(-50%,-90px);background:#fff;color:#222;padding:11px 18px;border-radius:14px;font-weight:600;transition:.3s;z-index:10;max-width:90vw;text-align:center}#tt.v{transform:translate(-50%,0)}\n</style></head><body><main id=\"app\"></main><div id=\"ov\">\u25b6 Dokun ve ba\u015flat</div><div id=\"tt\"></div>\n<script src=\"https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js\"></script>\n<script>\nconst $=s=>document.querySelector(s),A=$('#app');let T=localStorage.t,ME=JSON.parse(localStorage.me||'null'),V,ws,off=0,st=null,lock=0,hls,RM='';\nconst toast=m=>{const t=$('#tt');t.textContent=m;t.classList.add('v');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('v'),2800)};\nconst out=()=>{localStorage.clear();T=ME=null;st=null;login()};\nasync function api(p,m='GET',b){let r;try{r=await fetch('/api/'+p,{method:m,headers:{authorization:'Bearer '+T,'content-type':'application/json'},body:b&&JSON.stringify(b)})}catch{throw 'Sunucuya ula\u015f\u0131lamad\u0131. Siteyi dosya olarak de\u011fil, workers.dev adresinden a\u00e7.'}\nlet j={};try{j=await r.json()}catch{}if(r.status==401&&p!='login'){out();throw 'Oturum bitti, tekrar giri\u015f yap'}if(!r.ok)throw j.error||'Hata';return j}\nfunction login(e=''){A.innerHTML=`<div class=\"c\"><div class=\"logo\">\ud83c\udfac</div><h1>Bizim Sinema</h1><small>Birlikte izle, tam senkron.</small><input id=n placeholder=\"Kullan\u0131c\u0131 ad\u0131\" autocapitalize=off autocomplete=username><input id=p type=password placeholder=\"\u015eifre\" autocomplete=current-password><button id=g>Giri\u015f yap</button>${e?`<small style=\"color:#ff7b8f\">${e}</small>`:''}</div>`;\nconst go=async()=>{try{$('#g').textContent='\u2026';const j=await api('login','POST',{name:$('#n').value.trim(),pass:$('#p').value});T=j.token;ME=j;localStorage.t=T;localStorage.me=JSON.stringify(j);lobby()}catch(x){login(x)}};$('#g').onclick=go;$('#p').onkeydown=e=>e.key=='Enter'&&go()}\nfunction lobby(){RM='';st=null;const q=(new URLSearchParams(location.search).get('oda')||localStorage.rm||'').toUpperCase().replace(/[^A-Z0-9]/g,'');\nA.innerHTML=`<div class=\"c\"><div class=\"r\"><div class=\"logo\">\ud83c\udfac</div><div><h2>Merhaba ${ME.name}</h2><small>Ayn\u0131 oda kodunu yazan herkes ayn\u0131 filmi izler</small></div></div><input id=k placeholder=\"ODA KODU\" maxlength=8 value=\"${q}\" style=\"text-transform:uppercase;text-align:center;letter-spacing:.35em;font-weight:800;font-size:1.1rem\"><button id=go>Odaya gir</button></div>\n<div class=\"c\">${ME.role=='admin'?'<button class=s id=ad>\u2699\ufe0f Admin paneli</button>':''}<button class=s id=out>\u00c7\u0131k\u0131\u015f yap</button></div>`;\nconst g=()=>{const k=$('#k').value.trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(k)room(k);else toast('Bir oda kodu yaz')};$('#go').onclick=g;$('#k').onkeydown=e=>e.key=='Enter'&&g();$('#out').onclick=out;if($('#ad'))$('#ad').onclick=()=>admin()}\nasync function admin(){let us=[];try{us=await api('users')}catch(x){return toast(x)}\nA.innerHTML=`<div class=\"c\"><h2>\u2699\ufe0f Hesaplar</h2>${us.map(u=>`<div class=u><span>${u.name}<span class=tag>${u.role}</span></span>${u.name!='admin'?`<button class=d style=\"width:auto;padding:8px 14px\" data-d=\"${u.name}\">Sil</button>`:''}</div>`).join('')}</div>\n<div class=\"c\"><h2>Yeni hesap a\u00e7</h2><input id=an placeholder=\"kullan\u0131c\u0131 ad\u0131 (a-z, 0-9, _)\" autocapitalize=off><input id=ap placeholder=\"\u015fifre (en az 4 karakter)\"><label class=mu><input type=checkbox id=ar style=\"width:auto;margin-right:8px\">Admin yetkisi ver</label><button id=aa>Hesab\u0131 olu\u015ftur</button><button class=s id=ab>\u2190 Geri</button></div>`;\ndocument.querySelectorAll('[data-d]').forEach(b=>b.onclick=async()=>{if(!confirm(b.dataset.d+' silinsin mi?'))return;await api('users','DELETE',{name:b.dataset.d}).catch(toast);admin()});\n$('#aa').onclick=async()=>{try{await api('users','POST',{name:$('#an').value,pass:$('#ap').value,role:$('#ar').checked?'admin':'user'});toast('Hesap a\u00e7\u0131ld\u0131 \u2713');admin()}catch(x){toast(x)}};$('#ab').onclick=lobby}\nfunction room(k){RM=k;localStorage.rm=k;A.innerHTML=`<div class=\"c\"><div class=r><h2 style=\"flex:1\">\ud83c\udfac Oda ${k}</h2><button class=s onclick=\"cp()\">Davet</button><button class=s id=bk>\u00c7\u0131k</button></div>\n<video id=v playsinline controls></video><div class=pill><span class=dot id=dt></span><span id=s>Ba\u011flan\u0131yor\u2026</span></div>\n<input id=u placeholder=\"Film linki (.m3u8 veya .mp4)\" inputmode=url><details><summary>Link a\u00e7\u0131lm\u0131yorsa: Referer ekle</summary><input id=rf placeholder=\"https://kaynak-site.com/\"></details>\n<button id=ld>\u25b6 Filmi y\u00fckle (ikimizde de a\u00e7\u0131l\u0131r)</button></div>`;\nV=$('#v');$('#bk').onclick=()=>{RM='';ws.onclose=null;clearInterval(ws.p);ws.close();lobby()};\n$('#ld').onclick=()=>{const u=$('#u').value.trim();if(!/^https?:\\/\\//i.test(u))return toast('Link http veya https ile ba\u015flamal\u0131');send({t:'set',url:u,ref:$('#rf').value.trim()});toast('Film y\u00fckleniyor\u2026')};\nfor(const [ev,t] of [['play','play'],['pause','pause'],['seeked','seek']])V.addEventListener(ev,()=>{if(Date.now()>lock)send({t,pos:V.currentTime})});\n$('#ov').onclick=function(){this.style.display='none';V.play().catch(()=>{})};connect(k);if(!window.tk)window.tk=setInterval(tick,1000)}\nwindow.cp=async()=>{const u=location.origin+'/?oda='+RM;try{navigator.share?await navigator.share({title:'Bizim Sinema',text:'Odaya gel: '+RM,url:u}):(await navigator.clipboard.writeText(u),toast('Davet linki kopyaland\u0131'))}catch{}};\nconst send=m=>ws&&ws.readyState==1&&ws.send(JSON.stringify(m));\nfunction connect(k){connect.r=0;ws=new WebSocket((location.protocol=='https:'?'wss://':'ws://')+location.host+'/ws?room='+k+'&t='+T);const me=ws;let sent=Date.now();\nws.onopen=()=>{const p=()=>{sent=Date.now();send({t:'ping'})};p();ws.p=setInterval(p,4000)};\nws.onmessage=e=>{const m=JSON.parse(e.data);if(m.t!='st'||!$('#s'))return;const rtt=Date.now()-sent;if(!connect.r||rtt<=connect.r+30){connect.r=rtt;off=m.now+rtt/2-Date.now()}\n$('#dt').className='dot on';const w=[...new Set(m.who)];$('#s').textContent=w.join(' & ')+(w.length<2?' \u00b7 di\u011fer ki\u015fi bekleniyor':' \u00b7 birlikte');const nu=!st||st.url!=m.st.url;st=m.st;if(nu)load(st)};\nws.onclose=()=>{clearInterval(me.p);if(RM){if($('#dt'))$('#dt').className='dot';if($('#s'))$('#s').textContent='Ba\u011flant\u0131 koptu, yeniden ba\u011flan\u0131yor\u2026';setTimeout(()=>RM&&connect(RM),1500)}}}\nfunction load(s){if(hls){hls.destroy();hls=null}if(!s.url){V.removeAttribute('src');return}lock=Date.now()+1500;\nconst px=u=>'/proxy?u='+encodeURIComponent(u)+'&t='+T+(s.ref?'&r='+encodeURIComponent(s.ref):''),bad=m=>{$('#s').textContent='Video a\u00e7\u0131lamad\u0131: '+m;toast('Video a\u00e7\u0131lamad\u0131')};\nif(/\\.m3u8/i.test(s.url)){if(window.Hls&&Hls.isSupported()){hls=new Hls({maxBufferLength:40});hls.loadSource(px(s.url));hls.attachMedia(V);hls.on(Hls.Events.ERROR,(_,d)=>d.fatal&&bad(d.details))}else{V.src=px(s.url);V.onerror=()=>bad('format')}}\nelse{V.src=s.url;V.onerror=()=>{V.onerror=()=>bad('kaynak');V.src=px(s.url)}}}\nfunction tick(){if(!RM||!st||!st.url||!V)return;const exp=st.pos+(st.playing?(Date.now()+off-st.at)/1e3:0),d=V.currentTime-exp;\nif(!st.playing){if(!V.paused){lock=Date.now()+800;V.pause()}if(Math.abs(d)>.5){lock=Date.now()+800;V.currentTime=exp}return}\nif(V.paused&&V.readyState>0){lock=Date.now()+800;V.play().catch(()=>$('#ov').style.display='grid')}\nif(Math.abs(d)>1.5){lock=Date.now()+800;V.currentTime=Math.max(0,exp)}else V.playbackRate=d>.3?.94:d<-.3?1.06:1}\nME&&T?lobby():login();\n</script></body></html>\n";
// Bizim Puzzle v6 — Cloudflare Worker: giriş, admin, HLS proxy, senkron odalar
const enc = new TextEncoder(), b64 = b => btoa(String.fromCharCode(...new Uint8Array(b)));
const hmac = async (k, d) => b64(await crypto.subtle.sign('HMAC', await crypto.subtle.importKey('raw', enc.encode(k), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']), enc.encode(d)));
const hash = async (pw, salt) => b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' }, await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']), 256));
const sign = async (env, u) => { const p = btoa(JSON.stringify({ n: u.name, r: u.role, e: Date.now() + 30 * 864e5 })); return p + '.' + await hmac((env.SECRET||'bizim-sinema-gizli-anahtar-2026-x9Qp'), p) };
async function verify(env, t) { try { const [p, s] = (t || '').split('.'); if (!p || s !== await hmac((env.SECRET||'bizim-sinema-gizli-anahtar-2026-x9Qp'), p)) return; const o = JSON.parse(atob(p)); if (o.e > Date.now()) return o } catch { } }

export default {
  async fetch(req, env) {
    const u = new URL(req.url), p = u.pathname, J = (o, s = 200) => Response.json(o, { status: s });
    if (!/^\/(api|ws|proxy)/.test(p)) return new Response(HTML,{headers:{'content-type':'text/html;charset=utf-8','cache-control':'no-store'}});
    const db = (path, body) => env.DO.get(env.DO.idFromName('db')).fetch('https://do' + path, { method: 'POST', body: JSON.stringify(body || {}) });
    if (p == '/api/login') {
      const r = await (await db('/login', await req.json().catch(() => ({})))).json();
      return r.ok ? J({ token: await sign(env, r), name: r.name, role: r.role }) : J({ error: 'Kullanıcı adı veya şifre hatalı' }, 401);
    }
    const me = await verify(env, (req.headers.get('authorization') || '').slice(7) || u.searchParams.get('t'));
    if (!me) return J({ error: 'Giriş gerekli' }, 401);
    if (p == '/proxy') return proxy(req, u);
    if (p == '/ws') {
      const room = (u.searchParams.get('room') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
      if (!room) return J({ error: 'oda' }, 400);
      return env.DO.get(env.DO.idFromName('room:' + room)).fetch('https://do/ws?n=' + me.n, req);
    }
    if (p.startsWith('/api/users')) {
      if (me.r != 'admin') return J({ error: 'Yetkisiz' }, 403);
      if (req.method == 'GET') return db('/list');
      const b = await req.json().catch(() => ({}));
      return db(req.method == 'DELETE' ? '/del' : '/add', b);
    }
    return J({ error: 'yok' }, 404);
  }
};

async function proxy(req, u) {
  let target; try { target = new URL(u.searchParams.get('u')) } catch { return new Response('bad url', { status: 400 }) }
  const h = new Headers({ 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36' });
  const rg = req.headers.get('range'), ref = u.searchParams.get('r'), tok = u.searchParams.get('t');
  if (rg) h.set('range', rg);
  if (ref) try { h.set('referer', ref); h.set('origin', new URL(ref).origin) } catch { }
  const up = await fetch(target, { headers: h, redirect: 'follow' }).catch(() => null);
  if (!up) return new Response('kaynak açılamadı', { status: 502, headers: { 'access-control-allow-origin': '*' } });
  const oh = new Headers({ 'access-control-allow-origin': '*', 'access-control-expose-headers': '*' });
  for (const k of ['content-type', 'content-range', 'accept-ranges', 'content-length']) if (up.headers.get(k)) oh.set(k, up.headers.get(k));
  if (/mpegurl/i.test(up.headers.get('content-type') || '') || /\.m3u8/i.test(target.pathname)) {
    const wrap = x => { try { return `/proxy?u=${encodeURIComponent(new URL(x, up.url))}&t=${tok}` + (ref ? `&r=${encodeURIComponent(ref)}` : '') } catch { return x } };
    const out = (await up.text()).split('\n').map(l => { l = l.trim(); return !l ? l : l[0] == '#' ? l.replace(/URI="([^"]+)"/g, (_, x) => `URI="${wrap(x)}"`) : wrap(l) }).join('\n');
    oh.delete('content-length'); oh.set('content-type', 'application/vnd.apple.mpegurl');
    return new Response(out, { status: up.status, headers: oh });
  }
  return new Response(up.body, { status: up.status, headers: oh });
}

// Tek sınıf: "db" adıyla kullanıcı veritabanı, "room:KOD" adıyla film odası
export class Do {
  constructor(s, env) { this.s = s; this.env = env; s.blockConcurrencyWhile(async () => { this.st = await s.storage.get('st') || { url: '', ref: '', playing: false, pos: 0, at: Date.now(), by: '' } }) }
  async fetch(req) {
    const u = new URL(req.url), p = u.pathname, S = this.s.storage;
    if (p == '/ws') {
      const [c, sv] = Object.values(new WebSocketPair()); this.s.acceptWebSocket(sv);
      sv.serializeAttachment({ n: u.searchParams.get('n') }); this.bcast(); return new Response(null, { status: 101, webSocket: c });
    }
    const b = await req.json().catch(() => ({}));
    const AP = this.env.ADMIN_PASS || 'admin123', ad = await S.get('u:admin');
    if (!ad || ad.pw !== AP) { const salt = crypto.randomUUID(); await S.put('u:admin', { name: 'admin', role: 'admin', salt, h: await hash(AP, salt), pw: AP }) }
    if (p == '/login') { const x = await S.get('u:' + String(b.name || '').toLowerCase()); return Response.json(x && x.h == await hash(String(b.pass || ''), x.salt) ? { ok: 1, name: x.name, role: x.role } : { ok: 0 }) }
    if (p == '/list') return Response.json([...(await S.list({ prefix: 'u:' })).values()].map(x => ({ name: x.name, role: x.role })));
    if (p == '/add') {
      const name = String(b.name || '').toLowerCase();
      if (!/^[a-z0-9_]{3,16}$/.test(name) || String(b.pass || '').length < 4) return Response.json({ error: 'Ad 3-16 harf/rakam, şifre en az 4 karakter' }, { status: 400 });
      const salt = crypto.randomUUID(); await S.put('u:' + name, { name, role: b.role == 'admin' ? 'admin' : 'user', salt, h: await hash(b.pass, salt) }); return Response.json({ ok: 1 });
    }
    if (p == '/del') { if (b.name != 'admin') await S.delete('u:' + String(b.name).toLowerCase()); return Response.json({ ok: 1 }) }
    return new Response('?', { status: 404 });
  }
  msg() { return JSON.stringify({ t: 'st', st: this.st, now: Date.now(), who: this.s.getWebSockets().map(w => w.deserializeAttachment()?.n) }) }
  bcast() { const m = this.msg(); this.s.getWebSockets().forEach(w => { try { w.send(m) } catch { } }) }
  async webSocketMessage(ws, raw) {
    let m; try { m = JSON.parse(raw) } catch { return }
    if (m.t == 'ping') return ws.send(this.msg());
    const n = ws.deserializeAttachment()?.n, now = Date.now(), pos = Math.max(0, +m.pos || 0), st = this.st;
    if (m.t == 'set') this.st = { url: String(m.url || '').slice(0, 2000), ref: String(m.ref || '').slice(0, 500), playing: false, pos: 0, at: now, by: n };
    else if (m.t == 'play') this.st = { ...st, playing: true, pos, at: now, by: n };
    else if (m.t == 'pause') this.st = { ...st, playing: false, pos, at: now, by: n };
    else if (m.t == 'seek') this.st = { ...st, pos, at: now, by: n };
    else return;
    await this.s.storage.put('st', this.st); this.bcast();
  }
  webSocketClose(ws) { ws.close(); this.bcast() }
}
