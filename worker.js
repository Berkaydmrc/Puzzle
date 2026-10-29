// BIZIM SINEMA v12 — Cloudflare Worker + Durable Object (tek dosya)
// Gerekli ayar (wrangler.toml): DO bağlaması (sınıf: Do). Başka bir şey gerekmez.
// İsteğe bağlı Cloudflare değişkenleri (hepsini "Secret" olarak ekle):
//   SECRET (oturum anahtarı), ADMIN_PASS (yönetici şifresi / kurtarma)
//   SPOTIFY_CLIENT_ID  -> Spotify bağlama için
//   APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY -> Apple Music bağlama için
const CSS = String.raw`:root{--bg:#101521;--s1:#171d2b;--s2:#1d2434;--s3:#262f43;--bd:#2c354a;--tx:#f1eadb;--mu:#a29d93;--ac:#f0b33c;--ac2:#f0b33c;--ink:#1a1408;--ok:#6fbf8e;--er:#e2654f;--wa:#e9a23b;--film:#f0b33c;--pz:#5bb8ad;--game:#e2694f;color-scheme:dark}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{-webkit-text-size-adjust:100%}
body{font:500 15px/1.5 "Manrope",-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;background:var(--bg);color:var(--tx);min-height:100dvh;-webkit-font-smoothing:antialiased}

#app{width:min(1120px,100%);margin:0 auto;padding:max(14px,env(safe-area-inset-top)) 14px max(22px,env(safe-area-inset-bottom));display:grid;gap:14px;align-content:start}
.narrow{width:min(580px,100%);margin:0 auto}.stack{display:grid;gap:14px}
h1{font-size:1.6rem;font-weight:800;letter-spacing:-.02em}h2{font-size:1.12rem;font-weight:700;letter-spacing:-.01em}h3{font-size:.98rem;font-weight:700}
small,.mu{color:var(--mu);font-size:.8rem}b{font-weight:650}
.card{background:var(--s1);border:1px solid var(--bd);border-radius:16px;padding:16px;display:grid;gap:12px}
.row{display:flex;gap:8px;align-items:center}.grow{flex:1;min-width:0}.wrap{flex-wrap:wrap}.end{justify-content:flex-end}
.bar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:2px 2px 4px}
.brand{display:flex;align-items:center;gap:10px;font-size:1.05rem;letter-spacing:-.01em}
.logo{width:38px;height:38px;border-radius:12px;background:var(--ac);display:grid;place-items:center;color:#fff;box-shadow:none;flex:none}
.logo.lg{width:46px;height:46px;border-radius:14px}
.chip{display:flex;align-items:center;gap:8px;background:var(--s2);border:1px solid var(--bd);border-radius:99px;padding:4px 12px 4px 4px;font-size:.85rem;color:var(--tx);font:inherit;font-size:.85rem;cursor:pointer}button.chip:active{transform:scale(.97)}
.pf-av{width:76px;height:76px;border-radius:50%;background:var(--ac);display:grid;place-items:center;font-weight:800;font-size:2rem;color:#fff;margin:0 auto}
.pf-code{font:800 1.7rem/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.02em;text-align:center;background:var(--s2);border:1px dashed var(--ac);border-radius:14px;padding:14px 10px;user-select:all;-webkit-user-select:all;word-break:break-all}
.pf-st{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.pf-st div{background:var(--s2);border:1px solid var(--bd);border-radius:12px;padding:10px 6px;text-align:center}.pf-st b{display:block;font-size:1.3rem}.pf-st small{font-size:.72rem}
.av{width:28px;height:28px;border-radius:50%;background:var(--ac);display:grid;place-items:center;font-weight:700;font-size:.8rem;color:#fff;flex:none}
.ic{display:inline-grid;place-items:center;flex:none}
.in{width:100%;min-width:0;min-height:46px;padding:0 14px;border-radius:12px;border:1px solid var(--bd);background:var(--s2);color:var(--tx);caret-color:var(--ac);font:inherit;font-size:16px;outline:0;-webkit-user-select:text;user-select:text;pointer-events:auto}
input,textarea{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}
.in:focus{border-color:var(--ac);box-shadow:0 0 0 3px #f0b33c33}
.in::placeholder{color:#677089;opacity:1}
.in:-webkit-autofill,.in:-webkit-autofill:focus{-webkit-text-fill-color:var(--tx);box-shadow:0 0 0 40px var(--s2) inset}
.in.code{text-align:center;letter-spacing:.35em;font-weight:800;text-transform:uppercase}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 16px;border-radius:12px;border:1px solid transparent;font:inherit;font-weight:650;color:#fff;background:var(--ac);cursor:pointer;-webkit-appearance:none;appearance:none;white-space:nowrap;touch-action:manipulation;box-shadow:none}
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
.stage.tap{outline:3px solid var(--wa);outline-offset:2px;animation:mupulse 1.4s ease-in-out infinite}
.hold{pointer-events:none;position:absolute;left:12px;right:12px;bottom:56px;display:none;align-items:center;gap:10px;background:#000c;border:1px solid var(--bd);border-radius:12px;padding:8px 12px;font-size:.85rem;pointer-events:none}
.fls{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.fls span{background:var(--s2);border:1px solid var(--bd);border-radius:999px;padding:3px 10px;font-size:.78rem;color:var(--mu)}.fls span.ok{border-color:var(--ok);color:var(--ok)}.fls span.err{border-color:var(--er);color:var(--er)}.fls span.tap{border-color:var(--wa);color:var(--wa)}.fls .btn{min-height:28px}
.sync{position:absolute;left:10px;top:10px;font-size:.7rem;background:#000a;border-radius:99px;padding:3px 10px;color:var(--mu);pointer-events:none}.sync.ok{color:var(--ok)}
.sp{width:14px;height:14px;border-radius:50%;border:2px solid #fff4;border-top-color:#fff;animation:spin .8s linear infinite;flex:none}
@keyframes spin{to{transform:rotate(360deg)}}
.chips{display:flex;gap:6px;flex-wrap:wrap}.chips button{min-height:32px;padding:0 12px;border-radius:99px;border:1px solid var(--bd);background:var(--s2);color:var(--mu);font:inherit;font-size:.8rem;font-weight:600;cursor:pointer}
.chips button.on{background:var(--ac);border-color:var(--ac);color:#fff}
details summary{color:var(--mu);font-size:.82rem;cursor:pointer;margin-bottom:8px}
.chat{display:flex;flex-direction:column;height:430px;padding:12px;gap:10px}
.frr{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--bd)}.frr:last-child{border-bottom:0}.frr .grow{min-width:0}.frr b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.frr small{display:block}.frq{border-color:var(--ac)}
.vc{display:grid;gap:8px;background:var(--s2);border:1px solid var(--bd);border-radius:14px;padding:10px}.vc .row{gap:6px}.vcl{display:flex;flex-wrap:wrap;gap:6px}.vcl span{border:1px solid var(--bd);border-radius:999px;padding:3px 10px;font-size:.8rem;background:var(--s1);transition:box-shadow .12s,border-color .12s}.vcl span.spk{border-color:var(--ok);box-shadow:0 0 0 3px #31c48d40}.vcl span.mu{color:var(--mu)}.vcl span.bad{border-color:var(--er);color:var(--er)}
.msgs{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:6px;-webkit-overflow-scrolling:touch}
.msg{max-width:84%;padding:7px 12px;border-radius:14px;background:var(--s3);align-self:flex-start;word-break:break-word}
.msg.me{align-self:flex-end;background:var(--ac)}
.msg b{display:block;font-size:.7rem;color:var(--mu);font-weight:600}.msg time{display:block;font-size:.62rem;opacity:.6;text-align:right}
.sys{align-self:center;font-size:.74rem;color:var(--mu);text-align:center;padding:2px 8px}
.react{display:flex;gap:6px}.react button{flex:1;min-height:36px;border-radius:10px;border:1px solid var(--bd);background:var(--s2);font-size:1.1rem;cursor:pointer}.react button:active{transform:scale(.9)}
.fl{position:fixed;bottom:16%;font-size:2.2rem;pointer-events:none;z-index:60;animation:rise 2.6s ease-out forwards;display:grid;justify-items:center}.fl small{font-size:.65rem;background:#000a;border-radius:9px;padding:0 6px}
@keyframes rise{from{transform:translateY(0) scale(.7);opacity:0}12%{opacity:1;transform:translateY(-20px) scale(1.1)}to{transform:translateY(-260px) scale(1.3);opacity:0}}
#pcv{width:100%;height:60dvh;border-radius:14px;background:#0d0f16;border:1px solid var(--bd);touch-action:none;display:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;cursor:grab}
.zb{display:flex;gap:6px;flex-wrap:wrap}
.prog{height:6px;border-radius:9px;background:var(--s3);overflow:hidden}.prog i{display:block;height:100%;width:0;background:var(--ac);transition:width .3s}
.ov{position:fixed;inset:0;background:#000c;display:none;place-content:center;justify-items:center;gap:10px;font-size:1.15rem;font-weight:700;z-index:50;cursor:pointer}.ov.on{display:grid}
.mo{position:fixed;inset:0;background:#000b;display:grid;place-items:center;padding:16px;z-index:70;overflow:auto}.md{width:min(440px,100%);max-width:calc(100vw - 32px);min-width:0;grid-template-columns:minmax(0,1fr);overflow-wrap:anywhere;word-break:break-word}.md>*{min-width:0}.md h2{overflow-wrap:anywhere}.mo .row.end{flex-wrap:wrap}
.ftt{font-weight:700;font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dgrid{display:grid;gap:5px;justify-content:center}.drow{display:grid;grid-template-columns:repeat(5,min(14vw,52px));gap:5px}.dt{aspect-ratio:1;border:2px solid var(--bd);border-radius:8px;display:grid;place-items:center;font-weight:800;font-size:1.35rem;background:var(--s2);transition:background .25s,border-color .25s}.dt.f{border-color:var(--mu)}.dt.c0{background:#3a3f4b;border-color:#3a3f4b}.dt.c1{background:#c9a227;border-color:#c9a227;color:#111}.dt.c2{background:#2e9e5b;border-color:#2e9e5b;color:#fff}.drow.shake{animation:dshake .35s}@keyframes dshake{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}.dopp{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}.dmini{display:grid;gap:2px;justify-items:center}.dmini .drow{grid-template-columns:repeat(5,12px);gap:2px}.dmini i{width:12px;height:12px;border-radius:2px;background:var(--s3)}.dmini i.c0{background:#3a3f4b}.dmini i.c1{background:#c9a227}.dmini i.c2{background:#2e9e5b}.dkb{display:grid;gap:6px}.dkr{display:flex;gap:4px;justify-content:center}.dk{flex:1;max-width:40px;min-width:0;height:46px;border:0;border-radius:6px;background:#565b68;color:#fff;font:inherit;font-weight:700;font-size:.95rem;padding:0;cursor:pointer;touch-action:manipulation}.dk.wide{max-width:60px;flex:1.5}.dk.c0{background:#2a2e37;color:#7a7f8c}.dk.c1{background:#c9a227;color:#111}.dk.c2{background:#2e9e5b}
.bgrid{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:2px;width:100%;max-width:420px;margin:0 auto;background:#0b3550;padding:3px;border-radius:10px}.bgrid.sm{max-width:240px}.bc{aspect-ratio:1;border:0;border-radius:3px;background:#12507a;color:#fff;font:inherit;font-size:.75rem;font-weight:700;padding:0;display:grid;place-items:center;cursor:pointer;min-width:0;touch-action:manipulation}.bc:disabled{cursor:default;opacity:1}.bc.ship{background:#8b95a7}.bc.ship.sel{background:#d4dbe8;box-shadow:inset 0 0 0 2px #fff}.bc.miss{background:#0e3d5e;color:#9fc3dd}.bc.hit{background:#e0533d}.bc.sunk{background:#6b1a10;color:#ffb4a8}.bc.ghost{background:#5d6b82}.bgrid.tgt .bc:not(:disabled){background:#1667a0}.bgrid.tgt .bc:not(:disabled):active{background:#2a86c7}.tag.sunk{text-decoration:line-through;opacity:.5}
.cboard{display:grid;grid-template-columns:repeat(8,1fr);width:100%;max-width:460px;margin:0 auto;border-radius:8px;overflow:hidden;box-shadow:0 4px 18px #0006;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.csq{position:relative;border:0!important;padding:0!important;margin:0;display:flex;align-items:center;justify-content:center;aspect-ratio:1;cursor:pointer;font:inherit;min-width:0;min-height:0;border-radius:0!important;-webkit-tap-highlight-color:transparent}
.csq.l{background-color:#ebecd0}.csq.d{background-color:#779556}.csq.lm.l{background-color:#f5f682}.csq.lm.d{background-color:#b9ca43}.csq.sel{background-color:#f7dc6f!important}
.csq.ck{background-image:radial-gradient(circle,#ff2b1c 0,#e0261ab0 40%,transparent 72%)}
.csq.cdt::after{content:'';position:absolute;width:30%;height:30%;left:35%;top:35%;border-radius:50%;background:#0003}.csq.ccp::after{content:'';position:absolute;inset:3%;border-radius:50%;border:5px solid #0003}
.pc{font-size:min(9.4vw,46px);line-height:1;position:relative;z-index:1;font-family:"Segoe UI Symbol","Apple Symbols","DejaVu Sans","Noto Sans Symbols 2",serif;pointer-events:none}
.pc.w{color:#fff;-webkit-text-stroke:1.3px #1d1d1d;text-shadow:0 2px 2px #0006}.pc.b{color:#161616;text-shadow:0 1px 1px #fff5}
.csq .cf,.csq .cr{position:absolute;font-size:10px;font-weight:700;line-height:1;pointer-events:none}.csq .cf{right:3px;bottom:2px}.csq .cr{left:3px;top:2px}.csq.l .cf,.csq.l .cr{color:#779556}.csq.d .cf,.csq.d .cr{color:#ebecd0}
.cpl{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:10px;background:#ffffff0d;max-width:460px;width:100%;margin:0 auto;box-sizing:border-box}.cpl.on{box-shadow:0 0 0 2px var(--ac)}
.cpl .cn{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:45%}.cpl .ccap{flex:1;overflow:hidden;white-space:nowrap;display:flex;align-items:center}.cpl .ccap .pc{font-size:17px;margin-right:-3px;-webkit-text-stroke-width:.7px}
.cclk{font-variant-numeric:tabular-nums;font-weight:800;padding:4px 10px;border-radius:8px;background:#0005;min-width:58px;text-align:center}.cclk.run{background:#f4f4f4;color:#111}.cclk.low.run{background:#e0352b;color:#fff}
.chist{display:flex;flex-wrap:wrap;gap:4px 12px;max-height:96px;overflow:auto;font-size:.9rem}.chist:empty{display:none}.chist b{opacity:.55;font-weight:400;margin-right:3px}
.cpro{font-size:0;padding:6px 10px}.cpro .pc{font-size:40px}
.gprop{display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:#f0b33c14;border:1px solid var(--ac);border-radius:12px;padding:10px}.gprop .grow{min-width:140px}.gprop b,.gprop small{display:block}#gsw button.pend{border-color:var(--wa);color:var(--wa)}
.bgrid{background:repeating-linear-gradient(135deg,#0a3a5c 0 10px,#0c4269 10px 20px)!important;box-shadow:inset 0 0 24px #0008}.bc{position:relative;background:#13557f99!important;overflow:visible}.bc>span{position:relative;z-index:2;line-height:1}
.bc.miss{background:#0b324fcc!important;color:#bfe0f5}.bc.hit{background:#c2412d!important}.bc.ship,.bc.ship.sunk,.bc.ship.ghost{background:#13557f55!important}
.bc.ship::before{content:'';position:absolute;z-index:1;background:linear-gradient(180deg,#d5dce8,#8792a6 60%,#5d687c);box-shadow:inset 0 -2px 0 #4a5466}
.bc.ship.sh-h::before{top:18%;bottom:18%;left:-1px;right:-1px}.bc.ship.sh-v::before{left:18%;right:18%;top:-1px;bottom:-1px;background:linear-gradient(90deg,#d5dce8,#8792a6 60%,#5d687c)}
.bc.ship.sh-h.sh-s::before{left:6%;border-radius:70% 0 0 70%/50% 0 0 50%}.bc.ship.sh-h.sh-e::before{right:10%;border-radius:0 30% 30% 0}
.bc.ship.sh-v.sh-s::before{top:6%;border-radius:50% 50% 0 0/70% 70% 0 0}.bc.ship.sh-v.sh-e::before{bottom:10%;border-radius:0 0 30% 30%}
.bc.ship.sh-m::after{content:'';position:absolute;z-index:1;width:30%;height:30%;left:35%;top:35%;background:#4b5568;border-radius:3px;box-shadow:0 0 0 1px #2f3747}
.bc.ship.sel{box-shadow:none!important}.bc.ship.sel::before{filter:brightness(1.3) drop-shadow(0 0 4px #9fd3ff)}
.bc.ship.sunk::before{background:linear-gradient(180deg,#9a3a2a,#5a1a10)}.bc.ship.sunk::after{background:#2a0c07}.bc.ship.hitship::before{background:linear-gradient(180deg,#e7a092,#b2513f)}
.bc.ship.ghost::before{opacity:.45}

/* ---- Bizim Sinema teması: gece mavisi salon, fildişi yazı, ışıklı tabela sarısı ---- */
h1,.disp{font-family:"Unbounded","Manrope",sans-serif;font-weight:600;letter-spacing:-.01em}h1{font-size:1.45rem;line-height:1.2}
h2{font-size:1.06rem;font-weight:700;letter-spacing:0}h3{font-weight:700}
.btn{color:var(--ink);font-weight:700;border-radius:10px}.btn:not(.sec):not(.dng):hover{filter:brightness(1.06)}
.btn.sec{background:transparent;border-color:var(--bd);color:var(--tx)}.btn.sec:hover{border-color:#46516b;background:#ffffff06}
.btn.dng{background:transparent;border-color:#6b2f26;color:#f08a76}
.btn:focus-visible,.chip:focus-visible,.seg button:focus-visible,.tkt:focus-visible,.chips button:focus-visible{outline:2px solid var(--ac);outline-offset:2px}
.in{border-radius:10px;background:var(--bg)}.in:focus{box-shadow:0 0 0 3px #f0b33c26}.in::placeholder{color:#6f7486}
.chips button{border-radius:8px}.chips button.on{color:var(--ink);font-weight:700}
.seg{background:var(--bg);border-radius:12px}.seg button{border-radius:9px}.seg button.on{background:var(--tx);color:var(--bg);box-shadow:none}
.av,.pf-av{color:var(--ink)}.chip{background:transparent}
.tag{background:var(--s3);border-radius:6px}
.msg{border-radius:12px 12px 12px 4px;background:var(--s3)}.msg.me{background:#f0b33c24;border:1px solid #f0b33c40;border-radius:12px 12px 4px 12px}
.card .card{border-radius:12px}.warn{background:#2a2110;border-color:#5d4718}
.gprop{border-color:#f0b33c80}
/* bilet biçimli logo */
.logo{background:var(--ac);color:var(--ink);border-radius:6px;-webkit-mask:radial-gradient(circle 5px at 0 50%,#0000 96%,#000) left/51% 100% no-repeat,radial-gradient(circle 5px at 100% 50%,#0000 96%,#000) right/51% 100% no-repeat;mask:radial-gradient(circle 5px at 0 50%,#0000 96%,#000) left/51% 100% no-repeat,radial-gradient(circle 5px at 100% 50%,#0000 96%,#000) right/51% 100% no-repeat}
.logo.lg{border-radius:7px}
.brand b{font-family:"Unbounded","Manrope",sans-serif;font-weight:600;font-size:1rem;letter-spacing:-.01em}
.rcode{font-family:"Unbounded","Manrope",sans-serif;font-weight:600;letter-spacing:.02em}
/* ana ekran: salon biletleri */
.hello small{font-size:.9rem}
.tkts{display:grid;gap:10px}.tkts>small{margin:4px 2px -2px;font-weight:600}
.tkt{--c:var(--film);display:grid;grid-template-columns:62px minmax(0,1fr);text-align:left;width:100%;padding:0;border:0;background:none;color:var(--tx);font:inherit;cursor:pointer;-webkit-appearance:none;appearance:none;filter:drop-shadow(0 1px 0 #0003)}
.tkt.pz{--c:var(--pz)}.tkt.game{--c:var(--game)}
.tk-s{background:var(--c);color:var(--ink);display:grid;place-items:center;border-radius:12px 0 0 12px;-webkit-mask:radial-gradient(circle 7px at 100% 0,#0000 96%,#000) top/100% 51% no-repeat,radial-gradient(circle 7px at 100% 100%,#0000 96%,#000) bottom/100% 51% no-repeat;mask:radial-gradient(circle 7px at 100% 0,#0000 96%,#000) top/100% 51% no-repeat,radial-gradient(circle 7px at 100% 100%,#0000 96%,#000) bottom/100% 51% no-repeat}
.tk-b{display:grid;gap:3px;background:var(--s1);border:1px solid var(--bd);border-left:2px dashed #3a445c;border-radius:0 12px 12px 0;padding:13px 14px}
.tk-t{display:flex;align-items:baseline;justify-content:space-between;gap:10px}.tk-t b{font-size:1.02rem}.tk-t small{white-space:nowrap}
.tk-a{color:var(--c);font-weight:700;font-size:.88rem;margin-top:4px}
.tkt:hover .tk-b{border-color:#3d4862}.tkt:active{transform:scale(.99)}
.tkt:disabled{cursor:not-allowed;filter:grayscale(1);opacity:.55}
/* kenardan kaydırarak geri */
.edgeb{position:fixed;left:-46px;top:50%;width:44px;height:44px;border-radius:50%;background:var(--s3);color:var(--tx);display:grid;place-items:center;transform:translate(0,-50%);opacity:0;z-index:90;pointer-events:none;border:1px solid var(--bd)}.edgeb.go{background:var(--ac);color:var(--ink)}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
.bgrid.place.live{touch-action:none;user-select:none;-webkit-user-select:none}.bgrid.place .bc{cursor:pointer}.bgrid.place .bc.ship{cursor:grab}.bc.drag::before{opacity:.3}.bc.pv{background:#2fa66acc!important;box-shadow:inset 0 0 0 2px #9ff5c4}.bc.pvbad{background:#c0392bcc!important}
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
.wlb{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;border-top:1px solid var(--bd);padding-top:12px;min-width:0}.wll{display:grid;grid-template-columns:minmax(0,1fr);gap:6px;max-height:440px;overflow-y:auto;overflow-x:hidden;min-width:0}.wli,.mqi{min-width:0}.wli>button,.mqi>button{flex:none}.wli{display:flex;gap:10px;align-items:center;padding:8px;border-radius:12px;background:var(--s2);border:1px solid var(--bd)}.wli.on{border-color:var(--ac)}.wli img,.wlth{width:72px;height:40px;object-fit:cover;border-radius:8px;flex:none;background:#000;display:grid;place-items:center;color:var(--mu)}.wli .grow,.mqi .grow{min-width:0}.wli b,.mqi b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.85rem}.wli small,.mqi small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wlpb{height:4px;background:var(--bd);border-radius:2px;margin-top:5px;overflow:hidden}.wlpb i{display:block;height:100%;background:var(--ac)}
.mq{display:grid;grid-template-columns:minmax(0,1fr);gap:6px;border-top:1px solid var(--bd);padding-top:10px;min-width:0}.mqi{display:flex;gap:8px;align-items:center;padding:6px;border-radius:10px;background:var(--s2)}.mqi img,.mqi .mu-art{width:36px;height:36px;border-radius:6px;object-fit:cover;flex:none;font-size:1rem}.mu-rw{display:flex;gap:6px;align-items:stretch}.mu-rw .mu-r{flex:1;min-width:0}.mu-rw>button.btn{flex:none}
.mu-r{display:flex;gap:10px;align-items:center;background:var(--s2);border:1px solid var(--bd);border-radius:12px;padding:6px;cursor:pointer;text-align:left;color:var(--tx);font:inherit;width:100%}
.mu-r img{width:40px;height:40px;border-radius:8px;object-fit:cover;flex:none}
.mu-r div{min-width:0}.mu-r b,.mu-r small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mu-yt{width:100%;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000;display:none}.mu-yt.tap{outline:3px solid var(--wa);outline-offset:2px;animation:mupulse 1.4s ease-in-out infinite}@keyframes mupulse{50%{outline-color:transparent}}
.mu-hint{background:#f0b4291f;border:1px solid var(--wa);border-radius:12px;padding:10px 12px;text-align:center;font-weight:650;font-size:.9rem}
.mu-ls{display:flex;flex-wrap:wrap;gap:6px}.mu-ls span{background:var(--s2);border:1px solid var(--bd);border-radius:999px;padding:3px 10px;font-size:.78rem;color:var(--mu)}.mu-ls span.ok{border-color:var(--ok);color:var(--ok)}.mu-ls span.need{border-color:var(--wa);color:var(--wa)}.mu-yt iframe{width:100%;height:100%;border:0}
.wsc{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.wpl.out{opacity:.5}.wpl.out b{text-decoration:line-through}.wpl.win{border-color:var(--ok)!important}
.wpl{background:var(--s2);border:1px solid var(--bd);border-radius:12px;padding:8px 10px;display:grid;gap:2px}
.wpl.on{border-color:var(--ac);box-shadow:0 0 0 2px #f0b33c33}.wpl b{font-size:1.4rem;letter-spacing:-.02em}
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
const I={play:'<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>',film:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/>',
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
let T=localStorage.t||sessionStorage.t||'',ME=null,PT='',PTe=0,PEND=cleanCode(new URLSearchParams(location.search).get('oda')),PADD=(new URLSearchParams(location.search).get('ekle')||'').slice(0,30);
try{ME=JSON.parse(localStorage.me||sessionStorage.me||'null')}catch(e){}
let LK={film:0,puzzle:0,music:0,word:2,games:0},PM=0,MS=null,WG=null,CFG=null,WP=new Map(),WS=-1,WU={};
let ws=null,RM='',V=null,yw=null,EMPTY=null,holdEl=null,syncEl=null,Y=null,yr=0,lt=0,hls=null,hp=null,st=null,off=0,hb=[],bs=0,bufT=0,lock=0,uact=0,tk=0,prevWho=null,loadedKey=null,seen=new Set(),touched=0,lws=null,LT=0,ROOM_MODE=1,ROOM_NEW=0,AUTO=0,LASTM=null,FTT=null,YTH=null,YNEED=0,WPO=null,PSL='',PST=0,FSH={},FS={s:'',k:''},FRY=0,FLS=null,YLEAD=.6,YSK=null,MQ=[],MQS='',WL=null,WLU={},WLT=0,MSH={},WPQ={mv:0,s:0},WQ=null,WQT=0,PSEQ=0,WPV=null,WBZ=0,WBT=0;
const ov=h('div',{class:'ov',onclick:()=>{ov.classList.remove('on');if(st&&st.url){pl.play();if(FS.s=='tap')setTimeout(()=>fst('ok'),300)}}},ic('play',34),h('span',{text:'Dokun ve başlat'}));document.body.append(ov);
const mount=(...n)=>{A.replaceChildren(...n);window.scrollTo(0,0);setTimeout(navFix,0)};
async function api(p,m,b){let r;try{r=await fetch('/api/'+p,{method:m||'GET',headers:{authorization:'Bearer '+T,'content-type':'application/json'},body:b?JSON.stringify(b):undefined})}catch(e){throw 'Sunucuya ulaşılamadı. Bağlantını kontrol et.'}
let j={};try{j=await r.json()}catch(e){}
if(r.status==401&&p!='login'){logout(true);throw 'Oturum sona erdi, tekrar giriş yap'}
if(!r.ok)throw j.error||'Bir hata oluştu';return j}
const getPT=async()=>{if(!PT||PTe<Date.now()){const j=await api('ptoken');PT=j.t;PTe=Date.now()+11*36e5}return PT};
const saveSess=()=>{const S=localStorage.t?localStorage:sessionStorage;S.t=T;S.me=JSON.stringify(ME)};
function logout(soft){FR=null;if(T&&localStorage.pse){try{api('push/unsub','POST',{endpoint:localStorage.pse}).catch(()=>{})}catch(e){}localStorage.removeItem('psu')}PEND='';PM=0;AUTO=0;leaveRoom();closeLive();for(const k of ['t','me']){localStorage.removeItem(k);sessionStorage.removeItem(k)}T='';ME=null;PT='';viewLogin(soft===true?'Oturum sona erdi, tekrar giriş yap':'')}
const enter=()=>{if(SPC){const c=SPC;SPC='';spExchange(c)}let cur=null;try{cur=JSON.parse(localStorage.cur||'null')}catch(e){}
if(!PEND&&cur&&cur.k&&Date.now()-cur.ts<6*36e5){viewLobby().then(async()=>{try{const r=await api('roomq?code='+encodeURIComponent(cur.k));if(r.exists&&modeOk(r.mode)&&CURV=='lobby'){RESTAB=[1,2,3].includes(+cur.tab)?+cur.tab:0;viewRoom(cur.k,r.mode,false)}}catch(e){}});return}
if(PEND&&AUTO){const k=PEND;PEND='';PM=0;AUTO=0;viewLobby().then(()=>joinByCode(k))}else viewLobby()};
const canUse=a=>{const v=LK[a]|0;return v==0||(v==1&&ME&&ME.role=='admin')};
const LVN=['Açık','Yöneticiler','Kilitli'];
function modal(title,body,acts){const m=h('div',{class:'mo',onclick:e=>{if(e.target==m)m.remove()}},h('div',{class:'card md'},h('h2',{text:title}),body,acts?h('div',{class:'row end'},acts):null));document.body.append(m);const rm0=m.remove.bind(m);m.remove=()=>{rm0();setTimeout(navFix,0)};setTimeout(navFix,0);return m}

// ---------- gezinme: telefonun geri hareketi ve uygulamaya dönünce kaldığın yer ----------
let CURV='login',NIGN=0,RESTAB=0;
const navTop=()=>!!(RM||(CURV!='lobby'&&CURV!='login')||document.querySelector('.mo'));
function navFix(){try{const top=history.state&&history.state.t;if(navTop()&&!top)history.pushState({t:1},'');else if(!navTop()&&top&&!NIGN){NIGN++;history.back()}}catch(e){}}
function navBack(){const ms=document.querySelectorAll('.mo');if(ms.length){ms[ms.length-1].remove();return true}if(RM||CURV=='profile'||CURV=='admin'){viewLobby();return true}return false}
try{if(!history.state)history.replaceState({b:1},'')}catch(e){}
window.addEventListener('popstate',()=>{if(NIGN>0){NIGN--;setTimeout(navFix,0);return}navBack();setTimeout(navFix,0)});
// iPhone'da ana ekrandan açılan uygulamada tarayıcının kenardan geri kaydırması yok: aynısını biz yapıyoruz
if(navigator.standalone===true||window.FORCE_EDGE){let sx=0,sy=0,on=0,ind=null;
document.addEventListener('touchstart',e=>{on=0;const t=e.touches[0];if(e.touches.length!=1||t.clientX>24||!navTop())return;const g=e.target;if(g&&g.closest&&g.closest('#pcv,.bgrid.live,.cboard,.wc,.rk,canvas,input,textarea,video'))return;sx=t.clientX;sy=t.clientY;on=1;if(!ind){ind=h('div',{class:'edgeb'},ic('back',20));document.body.append(ind)}},{passive:true});
document.addEventListener('touchmove',e=>{if(!on)return;const t=e.touches[0],dx=t.clientX-sx,dy=Math.abs(t.clientY-sy);if(dy>50&&dy>dx){on=0;ind.style.cssText='';ind.classList.remove('go');return}const d=Math.max(0,Math.min(dx,96));ind.style.transform='translate('+d+'px,-50%)';ind.style.opacity=String(Math.min(1,d/70));ind.classList.toggle('go',dx>80)},{passive:true});
const end=()=>{if(!on)return;on=0;const go=ind.classList.contains('go');ind.style.cssText='';ind.classList.remove('go');if(go){if(navigator.vibrate)try{navigator.vibrate(8)}catch(x){}navBack();setTimeout(navFix,0)}};
document.addEventListener('touchend',end,{passive:true});document.addEventListener('touchcancel',()=>{on=0;if(ind){ind.style.cssText='';ind.classList.remove('go')}},{passive:true})}
function curSave(){try{if(RM)localStorage.cur=JSON.stringify({k:RM,m:ROOM_MODE,tab:TAB,ts:Date.now()})}catch(e){}}
function curClear(){try{localStorage.removeItem('cur')}catch(e){}}
setInterval(()=>{if(RM&&document.visibilityState=='visible')curSave()},20000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='hidden')curSave()});window.addEventListener('pagehide',curSave);
const userChip=()=>h('button',{type:'button',class:'chip','aria-label':'Profilim',onclick:()=>viewProfile()},h('span',{class:'av',text:ME.name[0].toUpperCase()}),h('span',{text:ME.name}),h('span',{class:'mu',style:'font-size:.7rem',text:'▾'}));
const brand=r=>h('header',{class:'bar'},h('div',{class:'brand'},h('div',{class:'logo'},ic('play',18)),h('b',{text:'Bizim Sinema'})),r||null);
// ---------- giriş ----------
function viewLogin(msg){leaveRoom();closeLive();CURV='login';curClear();
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
h('div',{class:'logo lg'},ic('play',22)),h('div',{},h('h1',{text:'Bizim Sinema'}),h('small',{text:PEND?'Davet kodu '+PEND+' hazır. Giriş yapınca ana menüden katılabilirsin.':'Arkadaşlarınla film, müzik ve oyun.'})),
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
async function viewLobby(){leaveRoom();closeLive();CURV='lobby';curClear();try{LK=await api('locks')}catch(e){}
const k=h('input',{class:'in code',placeholder:'KOD',maxlength:8,autocapitalize:'characters',autocomplete:'off',autocorrect:'off',spellcheck:'false','aria-label':'Oda kodu'});
const join=()=>joinByCode(k.value);k.onkeydown=e=>{if(e.key=='Enter')join()};
const feat=(c,i,t,d,cap,b,fn,lkd)=>h('button',{type:'button',class:'tkt '+c,disabled:!!lkd,onclick:fn},h('span',{class:'tk-s'},ic(i,24)),h('span',{class:'tk-b'},h('span',{class:'tk-t'},h('b',{text:t}),h('small',{text:cap})),h('small',{text:d}),h('span',{class:'tk-a',text:lkd?'Şu an kilitli':b})));
const last=localStorage.rm;
mount(h('div',{class:'narrow stack'},brand(userChip()),
h('div',{class:'hello'},h('h1',{text:'Merhaba, '+ME.name}),h('small',{text:'Bu akşam ne yapıyoruz?'})),
...frCards().slice(0,1),PEND?h('div',{class:'card'},h('h2',{text:'Davet var: '+PEND}),h('small',{text:'Biri seni bu odaya çağırdı. Oda türü sunucudan otomatik alınır.'}),h('div',{class:'row wrap'},h('button',{class:'btn',onclick:()=>{const c=PEND;PEND='';joinByCode(c)}},'Odaya katıl'),h('button',{class:'btn sec',onclick:()=>{PEND='';viewLobby()}},'Şimdilik değil'))):null,
ME.def?h('div',{class:'card warn'},h('div',{class:'row'},ic('lock'),h('b',{text:'Varsayılan şifre kullanılıyor'})),h('small',{text:'Güvenlik için şifreni hemen değiştir.'}),h('button',{class:'btn sm',onclick:passModal},'Şifreyi değiştir')):null,
h('div',{class:'tkts'},h('small',{text:'Yeni oda aç'}),feat('film','film','Film','Aynı videoyu aynı anda izleyin','6 kişi','Film odası aç',()=>createRoom(1),!canUse('film')),feat('pz','puzzle','Yapboz ve müzik','Birlikte yapboz çözün, aynı şarkıyı dinleyin','2 kişi','Yapboz odası aç',()=>createRoom(2),!canUse('puzzle')&&!canUse('music')),
feat('game','word','Oyunlar','Kelimelik, Kelime Düellosu, Amiral Battı, Satranç','4 kişi','Oyun odası aç',()=>createRoom(3),!canUse('word')&&!canUse('games'))),
frCards_c(),h('div',{class:'card'},h('h2',{text:'Odaya katıl'}),h('small',{text:'Oda kodunu yaz. Odanın türü (Film, Yapboz, Kelimelik) otomatik bulunur.'}),k,h('button',{class:'btn sec full',onclick:join},'Katıl'),last?h('button',{class:'btn sec full',onclick:()=>joinByCode(last)},'Son oda: '+last+' · tekrar gir'):null),
pwaCard(),h('div',{class:'card'},ME.role=='admin'?h('button',{class:'btn sec full',onclick:()=>viewAdmin('live')},ic('shield'),'Yönetim paneli'):null,h('button',{class:'btn sec full',onclick:passModal},ic('key'),'Şifremi değiştir'),h('button',{class:'btn sec full',onclick:()=>logout()},ic('out'),'Çıkış yap'))));
LT=setInterval(async()=>{try{const n=await api('locks');if(JSON.stringify(n)!=JSON.stringify(LK)){LK=n;const v=k.value;await viewLobby();const k2=$('.in.code');if(k2)k2.value=v}}catch(e){}},4000)}
function passModal(){const o=h('input',{class:'in',type:'password',placeholder:'Mevcut şifre',autocomplete:'current-password'}),a=h('input',{class:'in',type:'password',placeholder:'Yeni şifre (en az 6 karakter)',autocomplete:'new-password'}),b=h('input',{class:'in',type:'password',placeholder:'Yeni şifre (tekrar)',autocomplete:'new-password'}),er=h('div',{class:'err'});
const m=modal('Şifreyi değiştir',h('div',{class:'stack'},o,a,b,er),[h('button',{class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),h('button',{class:'btn',onclick:async()=>{if(a.value!=b.value){er.textContent='Yeni şifreler aynı değil';return}try{const j=await api('me/pass','POST',{old:o.value,pass:a.value});T=j.token;ME.def=false;saveSess();m.remove();toast('Şifre değişti ✓');if(!RM)viewLobby()}catch(x){er.textContent=String(x)}}},'Kaydet')])}
// ---------- yönetim ----------
const closeLive=()=>{if(lws){const w=lws;lws=null;try{w.close()}catch(e){}}};
async function viewAdmin(tab){leaveRoom();closeLive();CURV='admin';curClear();tab=tab||'live';
const seg=h('div',{class:'seg'},[['live','Canlı'],['users','Hesaplar'],['locks','Kilitler'],['sec','Güvenlik']].map(([k,l])=>h('button',{class:tab==k?'on':'',onclick:()=>viewAdmin(k)},l)));
const body=h('div',{class:'stack'});
mount(h('div',{class:'narrow stack'},h('div',{class:'row'},h('button',{class:'btn sec sq','aria-label':'Geri',onclick:()=>viewLobby()},ic('back')),h('div',{class:'grow'},h('h2',{text:'Yönetim paneli'}),h('small',{text:'Hesaplar ve canlı odalar'}))),seg,body));
if(tab=='live')adminLive(body);else if(tab=='users')await adminUsers(body);else if(tab=='locks')await adminLocks(body);else adminSec(body)}
async function adminLocks(body){try{LK=await api('locks')}catch(x){toast(x,1)}
const A=[['film','Film izleme','Film odası ve video senkronu'],['puzzle','Yapboz','Yapboz tahtası'],['music','Müzik','Birlikte müzik dinleme (yapboz sekmesinin içinde)'],['word','Kelimelik','2–4 kişilik kelime oyunu'],['games','Diğer oyunlar','Kelime Düellosu, Amiral Battı ve Satranç']];
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
h('button',{class:'btn sec full',onclick:async()=>{try{const r=await api('turn');modal('Sesli sohbet aktarması',h('div',{class:'stack',style:'gap:8px'},h('b',{text:r.relay?'✓ Cloudflare TURN çalışıyor: her ağda bağlanır.':'✗ TURN kurulu değil: yalnız doğrudan bağlantı (bazı mobil ağlarda ses gitmeyebilir).'}),r.error?h('small',{class:'err',text:r.error}):null,h('small',{class:'mu',text:'Sunucu adresleri: '+r.iceServers.map(s=>[].concat(s.urls).join(', ')).join(' | ')})),[h('button',{class:'btn sec',onclick:e=>e.target.closest('.mo').remove()},'Kapat')])}catch(x){toast(x,1)}}},'Sesli sohbet aktarmasını sına'),
h('button',{class:'btn sec full',onclick:async()=>{if(!confirm('Tüm cihazlardaki oturumların kapatılsın mı?'))return;try{await api('me/revoke','POST');logout()}catch(x){toast(x,1)}}},'Tüm cihazlarda oturumu kapat')),
h('div',{class:'card'},h('h3',{text:'Güvenlik notları'}),h('small',{text:'Oturum anahtarı sunucuda otomatik üretilip saklanır. İstersen Cloudflare > Settings > Variables bölümünden SECRET ve ADMIN_PASS değişkenlerini kendin de tanımlayabilirsin. ADMIN_PASS değiştirilirse yönetici şifresi bir kez o değere sıfırlanır (şifreni unutursan kurtarma yolu budur).'})))}
// ---------- oda ----------
// ---------- sesli sohbet (WebRTC, eşler arası; sinyal oda bağlantısından) ----------
const VC={on:0,busy:0,id:'',mu:0,stream:null,peers:new Map(),roster:[],ice:null,iceT:0,relay:false,ac:null,need:0,err:'',ui:{},miss:{}};
function voiceBox(){const st=h('small',{class:'mu'}),ls=h('div',{class:'vcl'}),
join=h('button',{type:'button',class:'btn full',onclick:()=>vJoin()},'🎙 Sesli sohbete katıl'),
mute=h('button',{type:'button',class:'btn sec sm',onclick:()=>vMute(!VC.mu)}),
tap=h('button',{type:'button',class:'btn sm',style:'display:none',onclick:()=>vTap()},'🔊 Sesi aç'),
leave=h('button',{type:'button',class:'btn dng sm',onclick:()=>vLeave()},'Ayrıl'),
ctl=h('div',{class:'row wrap'},mute,tap,leave);
VC.ui={st,ls,join,mute,tap,ctl};const box=h('div',{class:'vc'},h('div',{class:'row',style:'justify-content:space-between'},h('b',{text:'Sesli sohbet',style:'font-size:.9rem'}),st),ls,join,ctl);vui();return box}
function vui(){const U=VC.ui;if(!U.st)return;const r=VC.roster;
U.join.style.display=VC.on?'none':'';U.join.disabled=!!VC.busy;U.join.textContent=VC.busy?'Bağlanıyor…':'🎙 Sesli sohbete katıl';U.ctl.style.display=VC.on?'':'none';
U.mute.textContent=VC.mu?'🎙 Mikrofonu aç':'🔇 Sustur';U.tap.style.display=VC.need?'':'none';
U.st.textContent=VC.err||(r.length?r.length+' kişi':'kimse yok');U.st.className=VC.err?'err':'mu';
U.ls.replaceChildren(...r.map(x=>{const me=x.id===VC.id,P=VC.peers.get(x.id),cs=P&&P.pc.connectionState,bad=VC.on&&!me&&P&&(cs=='failed'||cs=='disconnected'),wait=VC.on&&!me&&P&&cs!='connected'&&!bad;
return h('span',{'data-v':x.id,class:(x.m?'mu':'')+(bad?' bad':''),text:(me?'sen':x.n)+(x.m?' 🔇':' 🎙')+(bad?' · bağlantı yok':wait?' · bağlanıyor…':'')})}))}
const vRid=()=>Array.from(crypto.getRandomValues(new Uint8Array(10)),b=>(b%36).toString(36)).join('');
async function vIce(){if(VC.ice&&Date.now()-VC.iceT<36e5*3)return VC.ice;try{const j=await api('turn');VC.ice=j.iceServers;VC.relay=!!j.relay}catch(e){VC.ice=[{urls:['stun:stun.cloudflare.com:3478']}];VC.relay=false}VC.iceT=Date.now();return VC.ice}
async function vJoin(){if(VC.on||VC.busy)return;if(!navigator.mediaDevices||!window.RTCPeerConnection){VC.err='Bu tarayıcı sesli sohbeti desteklemiyor';return vui()}
VC.busy=1;VC.err='';vui();
try{const AC=window.AudioContext||window.webkitAudioContext;if(AC){if(!VC.ac)VC.ac=new AC();VC.ac.resume&&VC.ac.resume()}}catch(e){}
try{VC.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false})}
catch(e){VC.busy=0;VC.err=e&&e.name=='NotAllowedError'?'Mikrofon izni verilmedi':'Mikrofon açılamadı';toast(VC.err+(e&&e.name=='NotAllowedError'?'. Tarayıcı ayarlarından bu siteye mikrofon izni ver.':''),1);return vui()}
await vIce();VC.id=vRid();VC.mu=0;VC.on=1;VC.busy=0;VC.miss={};vMeter('me',VC.stream);send({t:'vjoin',id:VC.id,m:0});vui();if(!VC.relay)console.info('Sesli sohbet: TURN yok, yalnız doğrudan bağlantı')}
function vLeave(silent){if(!VC.on&&!VC.busy)return;VC.on=0;VC.busy=0;for(const id of [...VC.peers.keys()])vDrop(id);
try{VC.stream&&VC.stream.getTracks().forEach(t=>t.stop())}catch(e){}VC.stream=null;delete VC.meters;if(!silent)send({t:'vleave'});VC.need=0;vui()}
function vMute(m){VC.mu=m?1:0;try{VC.stream&&VC.stream.getAudioTracks().forEach(t=>t.enabled=!VC.mu)}catch(e){}send({t:'vmute',m:VC.mu});vui()}
function vTap(){VC.need=0;for(const P of VC.peers.values())if(P.el)P.el.play().catch(()=>{VC.need=1});try{VC.ac&&VC.ac.resume()}catch(e){}vui()}
function vRoster(r){VC.roster=r||[];if(VC.on){const ids=new Set(VC.roster.map(x=>x.id));
if(!ids.has(VC.id)&&ws&&ws.readyState==1)send({t:'vjoin',id:VC.id,m:VC.mu});
for(const x of VC.roster)if(x.id!==VC.id&&!VC.peers.has(x.id))vPeer(x.id,x.n);
const now=Date.now();for(const id of VC.peers.keys()){if(ids.has(id))delete VC.miss[id];else if(!VC.miss[id])VC.miss[id]=now}}vui()}
// Kısa kopmalarda (yeniden bağlanma) eş hemen silinmez; 10 sn görünmezse kapatılır
setInterval(()=>{if(!VC.on)return;const now=Date.now();for(const id in VC.miss)if(now-VC.miss[id]>10000){delete VC.miss[id];vDrop(id);vui()}},2000);
function vDrop(id){const P=VC.peers.get(id);if(!P)return;VC.peers.delete(id);try{P.pc.close()}catch(e){}if(P.el){try{P.el.srcObject=null;P.el.remove()}catch(e){}}if(VC.meters)delete VC.meters[id]}
// Her ikilide yalnız kimliği küçük olan teklif başlatır (çakışma olmaz); karşı taraf sesini teklife yanıt verirken ekler.
function vAdd(P){if(P.added||!VC.stream)return;P.added=1;VC.stream.getTracks().forEach(t=>P.pc.addTrack(t,VC.stream))}
function vPeer(id,n){const pc=new RTCPeerConnection({iceServers:VC.ice||[]}),init=VC.id<id,P={pc,n,init,polite:!init,mo:false,ign:false,el:null,cq:[],added:0,dT:0};VC.peers.set(id,P);
pc.onnegotiationneeded=async()=>{try{P.mo=true;await pc.setLocalDescription();send({t:'vsig',to:id,d:{desc:pc.localDescription}})}catch(e){}finally{P.mo=false}};
pc.onicecandidate=e=>{if(e.candidate)send({t:'vsig',to:id,d:{cand:e.candidate}})};
pc.ontrack=e=>{const s=e.streams&&e.streams[0]||new MediaStream([e.track]);if(!P.el){P.el=h('audio',{autoplay:'',playsinline:''});P.el.style.display='none';document.body.append(P.el)}
P.el.srcObject=s;const pr=P.el.play();if(pr&&pr.catch)pr.catch(()=>{VC.need=1;vui()});vMeter(id,s)};
pc.onconnectionstatechange=()=>{const cs=pc.connectionState;if(cs=='connected')P.dT=0;else if(cs=='disconnected'&&!P.dT)P.dT=Date.now();if(cs=='failed'&&P.init){try{pc.restartIce()}catch(e){}}vui()};
if(init)vAdd(P);return P}
// Bağlantı 6 sn'den uzun "kopuk" kalırsa başlatan taraf yeniden dener
setInterval(()=>{if(!VC.on)return;for(const P of VC.peers.values())if(P.init&&P.dT&&Date.now()-P.dT>6000){P.dT=Date.now();try{P.pc.restartIce()}catch(e){}}},2000);
// Sinyaller eş başına SIRAYLA işlenir; uzak açıklama gelmeden ulaşan adresler sıraya alınır, sonra uygulanır
function vSig(m){if(!VC.on||!m||!m.d)return;let P=VC.peers.get(m.from);if(!P)P=vPeer(m.from,m.n);P.q=(P.q||Promise.resolve()).then(()=>vSigDo(P,m)).catch(()=>{})}
async function vSigDo(P,m){if(!VC.on||VC.peers.get(m.from)!==P)return;const pc=P.pc,d=m.d;
try{if(d.desc){const offer=d.desc.type=='offer',coll=offer&&(P.mo||pc.signalingState!='stable');P.ign=!P.polite&&coll;if(P.ign)return;
await pc.setRemoteDescription(d.desc);
for(const c of P.cq.splice(0)){try{await pc.addIceCandidate(c)}catch(e){}}
if(offer){vAdd(P);await pc.setLocalDescription();send({t:'vsig',to:m.from,d:{desc:pc.localDescription}})}}
else if(d.cand){if(!pc.remoteDescription){P.cq.push(d.cand);return}try{await pc.addIceCandidate(d.cand)}catch(e){if(!P.ign)console.warn(e)}}}catch(e){console.warn('vsig',e)}}
// Konuşan kişiyi vurgula (ses düzeyi ölçümü)
function vMeter(id,stream){try{if(!VC.ac)return;const src=VC.ac.createMediaStreamSource(stream),an=VC.ac.createAnalyser();an.fftSize=512;src.connect(an);(VC.meters=VC.meters||{})[id]={an,buf:new Uint8Array(an.fftSize)}}catch(e){}}
setInterval(()=>{if(!VC.on||!VC.meters||!VC.ui.ls)return;for(const id in VC.meters){const M=VC.meters[id];M.an.getByteTimeDomainData(M.buf);let s=0;for(const v of M.buf){const x=(v-128)/128;s+=x*x}const lv=Math.sqrt(s/M.buf.length);
if(lv>.035&&!(id=='me'&&VC.mu))M.last=Date.now();const key=id=='me'?VC.id:id,el=VC.ui.ls.querySelector('[data-v="'+key+'"]');if(el)el.classList.toggle('spk',Date.now()-(M.last||0)<400&&!(id=='me'&&VC.mu))}},120);

// ---------- uygulama (PWA) ve davet bildirimleri ----------
const isIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform=='MacIntel'&&navigator.maxTouchPoints>1);
const isApp=()=>{try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){return false}};
let BIP=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();BIP=e;pwaRender()});
if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
const pushOk=()=>'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
const pB64dec=s=>{s=String(s).replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return Uint8Array.from(atob(s),c=>c.charCodeAt(0))};
async function pushSub(){const reg=await navigator.serviceWorker.ready;return reg.pushManager.getSubscription()}
async function pushOn(){
if(!pushOk())return toast(isIOS()&&!isApp()?'Bildirimler için önce siteyi ana ekrana ekle ve oradan aç.':'Bu tarayıcı bildirimleri desteklemiyor.',1);
let p=Notification.permission;if(p=='default')p=await Notification.requestPermission();
if(p!='granted'){toast('Bildirim izni verilmedi. Telefonun ayarlarından açabilirsin.',1);return pwaRender()}
try{const reg=await navigator.serviceWorker.ready;let s=await reg.pushManager.getSubscription();
if(!s){const j=await api('push/key');s=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:pB64dec(j.k)})}
await api('push/sub','POST',{sub:s.toJSON()});localStorage.pse=s.endpoint;localStorage.psu=ME.name;toast('Bildirimler açıldı ✓')}
catch(e){toast('Bildirim açılamadı: '+String((e&&e.message)||e).slice(0,120),1)}pwaRender()}
async function pushOffNow(){try{const s=await pushSub();if(s){await api('push/unsub','POST',{endpoint:s.endpoint});await s.unsubscribe()}}catch(e){}localStorage.removeItem('pse');toast('Bildirimler kapatıldı');pwaRender()}
// Giriş yapan kişi değiştiyse ya da oturum açıldıysa cihazın aboneliğini sunucuyla eşitle
async function pushSync(){if(!pushOk()||!T||Notification.permission!='granted')return;try{const s=await pushSub();if(s&&(localStorage.psu!==ME.name||!window._psync)){window._psync=1;await api('push/sub','POST',{sub:s.toJSON()});localStorage.pse=s.endpoint;localStorage.psu=ME.name}}catch(e){}}
function pwaCard(){const box=h('div',{class:'card',id:'pwac'},h('h2',{text:'Uygulama ve bildirimler'}));setTimeout(pwaRender,0);pushSync();return box}
async function pwaRender(){const box=$('#pwac');if(!box)return;const kids=[h('h2',{text:'Uygulama ve bildirimler'})];
if(isApp())kids.push(h('small',{class:'mu',text:'Uygulama olarak açıksın ✓'}));
else if(isIOS())kids.push(h('small',{text:'Uygulama gibi kullanmak için: Safari’de alttaki Paylaş düğmesine (□↑) dokun → “Ana Ekrana Ekle” → Ekle. Sonra ana ekrandaki Bizim Sinema simgesinden aç.'}));
else if(BIP)kids.push(h('small',{text:'Siteyi telefonuna uygulama olarak ekleyebilirsin.'}),h('button',{type:'button',class:'btn sec full',onclick:async()=>{const e=BIP;if(!e)return;BIP=null;e.prompt();try{await e.userChoice}catch(x){}pwaRender()}},'📲 Uygulamayı yükle'));
else kids.push(h('small',{text:'Uygulama gibi kullanmak için tarayıcı menüsünden “Ana ekrana ekle” ya da “Uygulamayı yükle”yi seç.'}));
if(!pushOk())kids.push(h('small',{class:'mu',text:isIOS()&&!isApp()?'🔔 Davet bildirimleri, ana ekrandaki simgeden açınca kullanılabilir (iOS 16.4 ve üstü).':'🔔 Bu tarayıcı bildirimleri desteklemiyor.'}));
else if(Notification.permission=='denied')kids.push(h('small',{class:'err',text:'🔕 Bildirim izni kapalı. Telefonun ayarlarından bu uygulamaya bildirim izni ver.'}));
else{let s=null;try{if(Notification.permission=='granted')s=await pushSub()}catch(e){}
if(s)kids.push(h('small',{style:'color:var(--ok)',text:'🔔 Davet bildirimleri açık'}),h('div',{class:'row wrap'},h('button',{type:'button',class:'btn sec sm',onclick:async()=>{try{const r=await api('push/test','POST',{});toast(r.r=='ok'?'Deneme bildirimi gönderildi':'Bildirim gönderilemedi',r.r!='ok')}catch(x){toast(x,1)}}},'Deneme bildirimi gönder'),h('button',{type:'button',class:'btn sec sm',onclick:pushOffNow},'Kapat')));
else kids.push(h('small',{text:'Arkadaşın seni bir odaya çağırınca telefonuna bildirim gelsin.'}),h('button',{type:'button',class:'btn full',onclick:pushOn},'🔔 Bildirimleri aç'))}
if($('#pwac')===box)box.replaceChildren(...kids)}
async function inviteModal(){const pick=new Set(),list=h('div',{class:'stack',style:'gap:8px'},h('small',{class:'mu',text:'Kişiler yükleniyor…'})),go=h('button',{type:'button',class:'btn'},'🔔 Bildirimle çağır');go.disabled=true;
const m=modal('Odaya davet et',h('div',{class:'stack',style:'gap:10px'},h('button',{type:'button',class:'btn sec full',onclick:()=>{m.remove();invite()}},ic('link',16),'Davet linkini paylaş'),h('b',{text:'veya bildirim gönder:'}),list),[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Kapat'),go]);
go.onclick=async()=>{if(!pick.size)return;go.disabled=true;try{const r=await api('push/invite','POST',{room:RM,to:[...pick]}),E=Object.entries(r.r||{}),ok=E.filter(x=>x[1]=='ok').map(x=>x[0]),no=E.filter(x=>x[1]!='ok').map(x=>x[0]);
toast(ok.length?ok.join(', ')+' çağrıldı ✓'+(no.length?' · ulaşılamadı: '+no.join(', '):''):'Bildirim ulaştırılamadı: '+no.join(', '),!ok.length);if(ok.length)m.remove()}catch(x){toast(x,1)}go.disabled=!pick.size};
let L=[];try{L=(await api('friends')).f}catch(x){list.replaceChildren(h('small',{class:'err',text:String(x)}));return}
const here=new Set(prevWho||[]);
list.replaceChildren(...(L.length?L.map(x=>{const inR=here.has(x.n),dis=!x.push||inR;return h('label',{class:'chk',style:dis?'opacity:.55':''},h('input',{type:'checkbox',disabled:dis,onchange:e=>{e.target.checked?pick.add(x.n):pick.delete(x.n);go.disabled=!pick.size}}),h('span',{text:x.n+(inR?' · odada':x.push?'':' · bildirimleri kapalı')}))}):[h('small',{class:'mu',text:'Henüz arkadaşın yok. Lobideki “Arkadaşlar” kartından kullanıcı adıyla ekleyebilirsin.'})]))}

// ---------- film izleme listesi ----------
// Dropbox paylaşım linkini doğrudan oynatılabilir hâle getir
function fixLink(v){try{const x=new URL(v);if(/(^|\.)dropbox\.com$/i.test(x.hostname)&&/\/(s|scl)\//.test(x.pathname)){x.searchParams.delete('dl');x.searchParams.set('raw','1');return x.toString()}}catch(e){}return v}
function fdur(d){if(st&&st.url&&d>0&&isFinite(d))send({t:'fdur',u:st.url,d:Math.round(d)})}
function wlBox(){const inp=h('input',{class:'in',type:'url',placeholder:'Sonra izlemek için link yapıştır',inputmode:'url',autocapitalize:'none',autocorrect:'off',spellcheck:'false',enterkeyhint:'next'}),nm=h('input',{class:'in',placeholder:'Film adı (isteğe bağlı)',maxlength:100,enterkeyhint:'done'}),
addCur=h('button',{type:'button',class:'btn sec sm',style:'display:none',onclick:()=>wlAddCur()},'＋ Açık videoyu ekle'),list=h('div',{class:'wll'});
const addLink=async()=>{const v=inp.value.trim();if(!/^https?:\/\//i.test(v))return toast('Link http:// ya da https:// ile başlamalı',1);const r=await wlAct({a:'add',url:v,title:nm.value.trim()});if(r){inp.value='';nm.value='';toast('Listeye eklendi')}};nm.onkeydown=e=>{if(e.key=='Enter'){e.preventDefault();addLink()}};
inp.onkeydown=e=>{if(e.key=='Enter'){e.preventDefault();addLink()}};
WLU={list,addCur};WL=null;setTimeout(wlLoad,200);
if(!window._wlInt)window._wlInt=setInterval(()=>{if(RM&&WLU.list&&document.body.contains(WLU.list)&&document.visibilityState=='visible')wlLoad()},45000);
return h('div',{class:'wlb'},h('div',{class:'row',style:'justify-content:space-between;gap:8px'},h('b',{text:'İzleme listesi'}),addCur),inp,h('div',{class:'row'},nm,h('button',{type:'button',class:'btn sec',onclick:addLink},'Ekle')),list)}
async function wlLoad(){if(!RM||!WLU.list)return;try{WL=await api('wl?room='+encodeURIComponent(RM))}catch(e){return}wlRender()}
async function wlAct(b){try{const r=await api('wl','POST',{...b,room:RM});await wlLoad();return r||1}catch(x){toast(x,1)}}
function wlAddCur(){if(!st||!st.url)return toast('Önce bir video yükle',1);let t=st.title||'';if(!t)try{if(Y&&yr&&Y.getVideoData)t=Y.getVideoData().title||''}catch(e){}wlAct({a:'add',url:st.url,ref:st.ref,title:t}).then(r=>{if(r)toast('Listeye eklendi')})}
function wlRender(){const L=WLU.list;if(!L)return;const cur=st&&st.url;WLU.addCur.style.display=cur&&WL&&!WL.some(x=>x.u==cur)?'':'none';
if(!WL){L.replaceChildren(h('small',{class:'mu',text:'Yükleniyor…'}));return}
if(!WL.length){L.replaceChildren(h('small',{class:'mu',text:'Liste boş. İzlemek istediğiniz videoları ekleyin; birlikte izlerken kaldığınız yer otomatik kaydedilir.'}));return}
L.replaceChildren(...WL.map(x=>{const yid=ytId(x.u),on=x.u==cur,pct=x.d?Math.min(100,(x.p||0)/x.d*100):0,started=(x.p||0)>5&&!x.done;
const sub=x.done?'✓ İzlendi':started?('Kaldığınız yer: '+fmt(x.p)+(x.d?' / '+fmt(x.d):'')):'Henüz başlanmadı';
return h('div',{class:'wli'+(on?' on':'')},yid?h('img',{src:'https://i.ytimg.com/vi/'+yid+'/mqdefault.jpg',alt:'',loading:'lazy'}):h('div',{class:'wlth'},ic('film',18)),
h('div',{class:'grow'},h('b',{text:x.t||x.u}),h('small',{class:'mu',text:(on?'▶ Şu an açık · ':'')+sub}),h('small',{class:'mu',text:'ekleyen: '+x.by.join(', ')}),started&&x.d?h('div',{class:'wlpb'},h('i',{style:'width:'+pct.toFixed(1)+'%'})):null),
on?null:h('button',{type:'button',class:'btn sm',onclick:()=>wlPlay(x,false)},started?'▶ Devam et':'▶ Oynat'),
h('button',{type:'button',class:'btn sec sm','aria-label':'Diğer seçenekler',onclick:()=>wlMenu(x)},'⋯'))}))}
function wlPlay(x,fromStart){if(!canUse('film'))return toast('Film kilitli',1);const pos=fromStart||x.done?0:Math.max(0,(x.p||0)-3);send({t:'set',url:x.u,ref:x.r||'',pos,title:x.t||''});toast(pos>5?'Kaldığınız yerden ('+fmt(pos)+') açılıyor; oynat’a bas':'Video açılıyor');window.scrollTo({top:0,behavior:'smooth'})}
function wlRen(x){const i=h('input',{class:'in',value:x.t||'',maxlength:100,placeholder:'Film adı'}),go=async()=>{const t=i.value.trim();if(!t)return;m.remove();const r=await wlAct({a:'ren',url:x.u,title:t});if(r)toast('Ad değiştirildi')};i.onkeydown=e=>{if(e.key=='Enter')go()};
const m=modal('Adını değiştir',i,[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),h('button',{type:'button',class:'btn',onclick:go},'Kaydet')]);setTimeout(()=>{i.focus();i.select()},50)}
function wlMenu(x){const mine=x.by.includes(ME.name),tt=x.t||'Video';const m=modal(tt.length>60?tt.slice(0,60)+'…':tt,h('small',{class:'mu',style:'word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden',text:x.u}),[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Kapat'),
h('button',{type:'button',class:'btn sec',onclick:()=>{m.remove();wlPlay(x,true)}},'Baştan izle'),h('button',{type:'button',class:'btn sec',onclick:()=>{m.remove();wlRen(x)}},'Adını değiştir'),
mine?h('button',{type:'button',class:'btn sec',onclick:()=>{m.remove();wlAct({a:'done',url:x.u,v:x.done?0:1})}},x.done?'İzlenmedi yap':'İzlendi işaretle'):null,
mine?h('button',{type:'button',class:'btn dng',onclick:()=>{m.remove();wlAct({a:'rm',url:x.u})}},'Listemden çıkar'):null])}
// ---------- müzik: çalma sırası ve kayıtlı listeler ----------
async function resolveTr(tr){if(tr.ids&&!tr.ids.yt&&(MU.prov=='yt'||!tr.ids[MU.prov])){try{const r=await ytSearch((tr.title+' '+(tr.artist||'')).trim(),1);if(r.length&&r[0].ids){if(r[0].ids.yt)tr.ids.yt=r[0].ids.yt;if(r[0].ids.au&&!tr.ids.au)tr.ids.au=r[0].ids.au;if(!tr.dur&&r[0].dur)tr.dur=r[0].dur;if(!tr.art&&r[0].art)tr.art=r[0].art}}catch(e){}}return tr}
async function mqAdd(t){if(!canUse('music'))return;const tr=await resolveTr({...t,ids:{...(t.ids||{})}});send({t:'mqadd',tr});toast(MS&&MS.tr?'Sıraya eklendi: '+tr.title:'Çalıyor: '+tr.title)}
function mqSet(q){q=q||[];const s=JSON.stringify(q);if(s===MQS)return;MQS=s;MQ=q;mqRender()}
function mqRender(){const B=MUI.mq;if(!B)return;const q=MQ||[],bt=(t,fn,l)=>h('button',{type:'button',class:'btn sec sm','aria-label':l||t,onclick:fn},t);
const head=h('div',{class:'row',style:'justify-content:space-between;flex-wrap:wrap;gap:6px'},h('b',{text:'Sıradakiler'+(q.length?' ('+q.length+')':'')}),
h('div',{class:'row wrap',style:'gap:6px'},q.length?bt('Sonraki',()=>send({t:'mqnext'}),'Sonraki şarkı'):null,bt('Listelerim',plModal),(q.length||(MS&&MS.tr))?bt('Kaydet',plSave,'Listeyi kaydet'):null));
B.replaceChildren(head,...(q.length?q.map((x,i)=>h('div',{class:'mqi'},h('small',{class:'mu',style:'width:16px;text-align:center',text:String(i+1)}),x.tr.art?h('img',{src:x.tr.art,alt:''}):h('span',{class:'mu-art',text:'🎵'}),
h('div',{class:'grow'},h('b',{text:x.tr.title}),h('small',{class:'mu',text:(x.tr.artist?x.tr.artist+' · ':'')+x.by+' ekledi'})),i?bt('↑',()=>send({t:'mqup',id:x.id}),'Yukarı taşı'):null,bt('✕',()=>send({t:'mqrm',id:x.id}),'Sıradan çıkar'))):
[h('small',{class:'mu',text:'Sıra boş. Aramada şarkının yanındaki “＋ Sıra”ya bas; çalan şarkı bitince sıradaki herkeste otomatik başlar.'})]))}
function plSave(){const items=[...(MS&&MS.tr?[MS.tr]:[]),...(MQ||[]).map(x=>x.tr)];if(!items.length)return toast('Kaydedilecek şarkı yok',1);
const nm=h('input',{class:'in',placeholder:'Liste adı, örn. Yol şarkıları',maxlength:40,enterkeyhint:'done'}),er=h('div',{class:'err'});
const go=async()=>{const n=nm.value.trim();if(!n){er.textContent='Listeye bir ad ver';return}try{const r=await api('pl','POST',{a:'save',n,items});m.remove();toast((r.upd?'Liste güncellendi: ':'Liste kaydedildi: ')+n+' ('+items.length+' şarkı)')}catch(x){er.textContent=String(x)}};
nm.onkeydown=e=>{if(e.key=='Enter'){e.preventDefault();go()}};
const m=modal('Listeyi kaydet',h('div',{class:'stack'},h('small',{class:'mu',text:'Çalan şarkı ve sıradakiler ('+items.length+' şarkı) listelerine kaydedilir. Aynı adla kaydedersen eski liste güncellenir.'}),nm,er),[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),h('button',{type:'button',class:'btn',onclick:go},'Kaydet')]);setTimeout(()=>nm.focus(),50)}
async function plModal(){const box=h('div',{class:'stack',style:'gap:8px'},h('small',{class:'mu',text:'Yükleniyor…'}));const m=modal('📂 Listelerim',box,[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Kapat')]);
const draw=L=>box.replaceChildren(...(L.length?L.map(x=>h('div',{class:'frr'},h('div',{class:'grow'},h('b',{text:x.n}),h('small',{class:'mu',text:x.items.length+' şarkı'})),
h('button',{type:'button',class:'btn sm',onclick:()=>{send({t:'mqload',items:x.items,mode:'play'});m.remove();toast('Çalınıyor: '+x.n)}},'▶ Çal'),
h('button',{type:'button',class:'btn sec sm',onclick:()=>{send({t:'mqload',items:x.items,mode:'add'});m.remove();toast(x.n+' sıraya eklendi')}},'＋ Sıra'),
h('button',{type:'button',class:'btn sec sm','aria-label':'Listeyi sil',onclick:async()=>{if(!confirm('“'+x.n+'” silinsin mi?'))return;try{await api('pl','POST',{a:'rm',id:x.id});draw(await api('pl'))}catch(e){toast(e,1)}}},'🗑'))):
[h('small',{class:'mu',text:'Henüz kayıtlı listen yok. Sıraya şarkı ekleyip “💾 Kaydet”e bas.'})]));
try{draw(await api('pl'))}catch(e){box.replaceChildren(h('small',{class:'err',text:String(e)}))}}

// ---------- oyun seçici ----------
let GSEL='duel',GSW=null,GSP=null,GPB=null,GSPT=0;
const GNM={word:'Kelimelik',duel:'Kelime Düellosu',bs:'Amiral Battı',chess:'Satranç'};
function gameSwitch(){const c=h('div',{class:'chips',id:'gsw'});GPB=h('div',{class:'gprop',style:'display:none'});
GSW=()=>{c.replaceChildren(...[['word','Kelimelik'],['duel','Kelime Düellosu'],['bs','Amiral Battı'],['chess','Satranç']].map(([k,t])=>{const pend=GSP&&GSP.to==k;return h('button',{type:'button',class:(GSEL==k?'on':'')+(pend?' pend':''),onclick:()=>{if(k==GSEL)return;if(GSP){if(GSP.by==ME.name)return toast('Önce bekleyen isteğin yanıtlanmalı');return toast('Önce bekleyen isteği yanıtla',1)}send({t:'gsel',g:k})}},t+(pend?' ⏳':''))}));gpRender()};
GSW();return h('div',{class:'card',style:'padding:12px;gap:10px'},c,GPB)}
function gpRender(){const B=GPB;if(!B)return;const p=GSP;if(!p){B.style.display='none';B.replaceChildren();return}B.style.display='';
const mine=p.by==ME.name,iOk=p.ok.includes(ME.name),s=Math.ceil(p.end-Date.now())/1000|0;
if(mine||iOk)B.replaceChildren(h('div',{class:'grow'},h('b',{text:''+GNM[p.to]+' oyununa geçiş'}),h('small',{class:'mu',text:(p.need.length?p.need.join(', ')+' bekleniyor… ':'')+'('+Math.max(0,s)+' sn)'})),mine?h('button',{type:'button',class:'btn sec sm',onclick:()=>send({t:'gcancel'})},'İptal'):null);
else B.replaceChildren(h('div',{class:'grow'},h('b',{text:''+p.by+' '+GNM[p.to]+' oyununa geçmek istiyor'}),h('small',{class:'mu',text:'Kabul edersen oda o oyuna geçer ('+Math.max(0,s)+' sn)'})),
h('button',{type:'button',class:'btn sm',onclick:()=>send({t:'gvote',ok:true})},'Kabul'),h('button',{type:'button',class:'btn sec sm',onclick:()=>send({t:'gvote',ok:false})},'Hayır'))}
function gsState(gs){if(!gs)return;const ch=gs.g!==GSEL;GSEL=gs.g||'duel';const p=gs.p?{...gs.p,end:Date.now()+gs.p.left}:null;const pj=JSON.stringify(gs.p&&{to:gs.p.to,ok:gs.p.ok,need:gs.p.need});
if(pj!==GSPT||ch){GSPT=pj;GSP=p;if(GSW)GSW();if(ch)lockUI()}else if(p&&GSP)GSP.end=p.end}
if(!window._gpInt)window._gpInt=setInterval(()=>{if(GSP)gpRender()},1000);
// ---------- Kelime Düellosu ----------
let DLG=null,DLGI='',DLIN='',DLU={},DPOOL=(()=>{try{return localStorage.dpool||'common'}catch(e){return 'common'}})();
const DKEYS=[['E','R','T','Y','U','I','O','P','Ğ','Ü'],['A','S','D','F','G','H','J','K','L','Ş','İ'],['⏎','Z','C','V','B','N','M','Ö','Ç','⌫']];
const tU=s=>String(s).toLocaleUpperCase('tr-TR');
function duelCard(){const grid=h('div',{class:'dgrid'}),opp=h('div',{class:'dopp'}),kb=h('div',{class:'dkb'}),st=h('div',{class:'lbl',style:'margin:0;text-align:center'}),sc=h('div',{class:'chips'}),
bnew=h('button',{type:'button',class:'btn full',onclick:()=>{if(DLG&&!DLG.over&&!confirm('Devam eden oyun bitecek. Yeni oyun başlatılsın mı?'))return;send({t:'dnew',pool:DPOOL})}},'Yeni oyun başlat'),
pool=h('div',{class:'chips',style:'justify-content:center'});
kb.append(...DKEYS.map(r=>h('div',{class:'dkr'},r.map(k=>h('button',{type:'button',class:'dk'+(k=='⏎'||k=='⌫'?' wide':''),'data-k':k,'aria-label':k=='⏎'?'Gönder':k=='⌫'?'Sil':k,onclick:()=>dKey(k)},k)))));
const root=h('div',{class:'card',id:'dp'},h('div',{class:'row',style:'justify-content:space-between;flex-wrap:wrap'},h('h3',{text:'Kelime Düellosu'}),sc),st,grid,opp,kb,pool,bnew,
h('small',{class:'mu',text:'Gizli 5 harfli kelimeyi herkes aynı anda tahmin eder; 6 hakkın var. 🟩 doğru yerde, 🟨 kelimede var ama başka yerde, ⬛ kelimede yok. Rakiplerinin renklerini görürsün, harflerini görmezsin. İlk bilen kazanır.'}));
DLU={root,grid,opp,kb,st,sc,bnew,pool};dRender();return root}
const dMe=()=>DLG&&DLG.pl.find(p=>p.n==ME.name);
function dSet(g){const pm=dMe(),pr=pm?pm.rows.length:0;DLG=g;const nm=dMe();if(!g||g.id!==DLGI){DLIN='';DLGI=g?g.id:''}else if(nm&&nm.rows.length>pr)DLIN='';dRender()}
function dErr(e){toast(e,1);const r=DLU.grid&&DLU.grid.querySelector('.cur');if(r){r.classList.remove('shake');void r.offsetWidth;r.classList.add('shake')}}
function dKey(k){const me=dMe();if(!DLG||DLG.over||(me&&me.done))return;if(k=='⌫')DLIN=DLIN.slice(0,-1);else if(k=='⏎'){if([...DLIN].length<5)return dErr('Kelime 5 harf olmalı');send({t:'dguess',w:DLIN})}else if([...DLIN].length<5)DLIN+=k;dRender()}
if(!window._dkb){window._dkb=1;document.addEventListener('keydown',e=>{if(TAB!=3||GSEL!='duel'||!DLU.root||!document.body.contains(DLU.root)||e.metaKey||e.ctrlKey||e.altKey)return;const t=e.target;if(t&&t.matches&&t.matches('input,textarea,[contenteditable]'))return;
if(e.key=='Enter'){e.preventDefault();dKey('⏎')}else if(e.key=='Backspace'){e.preventDefault();dKey('⌫')}else if(e.key.length==1){const u=tU(e.key);if(DKEYS.flat().includes(u)){e.preventDefault();dKey(u)}}})}
function dRender(){const U=DLU;if(!U.root)return;const g=DLG,me=dMe(),rows=me?me.rows:[],act=g&&!g.over&&!(me&&me.done);
U.sc.replaceChildren(...(g?Object.entries(g.sc||{}).sort((a,b)=>b[1]-a[1]).map(([n,v])=>h('span',{class:'tag',text:(n==ME.name?'sen':n)+' '+v})):[]));
U.bnew.style.display=!g||g.over?'':'none';U.pool.style.display=!g||g.over?'':'none';
U.pool.replaceChildren(h('small',{class:'mu',style:'width:100%;text-align:center',text:'Kelime havuzu'}),...[['common','Yaygın kelimeler'],['all','Tüm sözlük (zor)']].map(([k,t])=>h('button',{type:'button',class:DPOOL==k?'on':'',onclick:()=>{DPOOL=k;try{localStorage.dpool=k}catch(e){}dRender()}},t)));U.kb.style.display=act?'':'none';
U.st.textContent=(g&&g.pool=='all'&&!g.over?'📚 Tüm sözlük · ':'')+(!g?'Henüz oyun yok. “Yeni oyun başlat”a bas; odadaki herkes aynı kelimeyi tahmin eder.':g.over?(g.win?(g.win==ME.name?'🏆 Tebrikler, buldun!':'🏆 '+g.win+' buldu.'):'Kimse bulamadı.')+' Kelime: '+tU(g.sec):me&&me.done?'Hakların bitti, diğerlerini bekliyorsun…':'Tahminini yaz ('+(rows.length+1)+'/'+g.mx+')');
const R=[];for(let r=0;r<(g?g.mx:6);r++){const x=rows[r],cur=act&&r==rows.length,L=x?[...tU(x.w)]:cur?[...DLIN]:[];
R.push(h('div',{class:'drow'+(cur?' cur':'')},[0,1,2,3,4].map(i=>h('div',{class:'dt'+(x?' c'+x.r[i]:L[i]?' f':'')},L[i]||''))))}U.grid.replaceChildren(...R);
U.opp.replaceChildren(...(g?g.pl.filter(p=>p.n!=ME.name).map(p=>{const won=p.rows.some(x=>x.r.every(v=>v==2));return h('div',{class:'dmini'},h('small',{class:'mu',text:p.n+(won?' 🏆':p.done?' ✗':' · '+p.rows.length+'/'+g.mx)}),...p.rows.map(x=>h('div',{class:'drow'},x.r.map(v=>h('i',{class:'c'+v})))))}):[]));
const best={};for(const x of rows)[...tU(x.w)].forEach((c,i)=>{best[c]=Math.max(best[c]==null?-1:best[c],x.r[i])});
U.kb.querySelectorAll('.dk').forEach(b=>{const k=b.dataset.k,v=best[k];b.className='dk'+(k=='⏎'||k=='⌫'?' wide':'')+(v!=null?' c'+v:'')})}
// ---------- Amiral Battı ----------
const BF=[5,4,3,3,2],BNM=['Uçak gemisi','Muharebe gemisi','Kruvazör','Denizaltı','Muhrip'];
let BS=null,BSI='',BL=null,BSEL=0,BV=0,BU={},BSHOT=-1,BRT=0,BDR=null;
function bCellsC(i,v,len){const r=i/10|0,c=i%10,o=[];for(let k=0;k<len;k++){const rr=r+(v?k:0),cc=c+(v?0:k);if(rr>9||cc>9)return null;o.push(rr*10+cc)}return o}
function bRandom(){const nb=x=>{const r=x/10|0,c=x%10,o=[];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const rr=r+a,cc=c+b;if(rr>=0&&rr<10&&cc>=0&&cc<10)o.push(rr*10+cc)}return o};
for(let t=0;t<300;t++){const used=new Set(),L=[];let ok=true;for(const len of BF){let p=false;for(let a=0;a<300&&!p;a++){const v=Math.random()<.5?1:0,i=Math.random()*100|0,c=bCellsC(i,v,len);if(!c||c.some(x=>nb(x).some(y=>used.has(y))))continue;c.forEach(x=>used.add(x));L.push({i,v});p=true}if(!p){ok=false;break}}if(ok)return L}return null}
const bOcc=(L,skip)=>{const m={};(L||[]).forEach((s,k)=>{if(!s||k===skip)return;const c=bCellsC(s.i,s.v,BF[k]);if(c)c.forEach(x=>m[x]=k)});return m};
function bsCard(){const st=h('div',{class:'lbl',style:'margin:0;text-align:center'}),sc=h('div',{class:'chips'}),area=h('div',{class:'stack',style:'gap:10px'}),acts=h('div',{class:'row wrap',style:'justify-content:center'}),log=h('div',{class:'wlog'});
const root=h('div',{class:'card',id:'bp'},h('div',{class:'row',style:'justify-content:space-between;flex-wrap:wrap'},h('h3',{text:'Amiral Battı'}),sc),st,area,acts,log,
h('small',{class:'mu',text:'Gemilerini yerleştir ve “Hazırım”a bas. Sırayla rakibin denizine ateş edin; vurursan bir kez daha atarsın. Rakibin bütün gemilerini ilk batıran kazanır.'}));
BU={root,st,sc,area,acts,log};bRender();return root}
function bSet(g){BS=g;BSHOT=-1;if(!g||g.id!==BSI){BSI=g?g.id:'';BL=null;BSEL=0}
// yerleştirme aşamasına girildiğinde (yeni oyun ya da rakip bekleme bitince) gemi düzenini hazırla
if(g&&g.me>=0&&g.ph=='place'&&!BL)BL=g.my?g.my.map(s=>({i:s.i,v:s.v})):bRandom();bRender()}
function bGrid(cls,cellFn,onTap){const g=h('div',{class:'bgrid '+cls});for(let i=0;i<100;i++){const [c,t,en]=cellFn(i);g.append(h('button',{type:'button',class:'bc '+c,disabled:!(onTap&&en),'aria-label':'ABCDEFGHIJ'[i/10|0]+(i%10+1),onclick:onTap&&en?()=>onTap(i):null},t?h('span',{text:t}):null))}return g}
// Gemi parçası sınıfları: yön (sh-h / sh-v) ve konum (baş sh-s / gövde sh-m / kıç sh-e)
function bSeg(list){const m={};for(const cells of list){if(!cells||!cells.length)continue;const v=cells.length>1&&cells[1]-cells[0]==10;cells.forEach((c,k)=>m[c]='ship '+(v?'sh-v':'sh-h')+' '+(k==0?'sh-s':k==cells.length-1?'sh-e':'sh-m'))}return m}
const bShipsL=L=>(L||[]).map((s,k)=>s?bCellsC(s.i,s.v,BF[k]):null);
// Gemiyi döndür: önce kendi başında, sonra dokunulan karede, gerekirse geriye kaydırarak yer arar
function bRot(k,pivot){const s=BL&&BL[k];if(!s)return false;const nv=1-s.v,len=BF[k],occ=bOcc(BL,k),st=nv?10:1,seen=new Set();
for(const base of [s.i,pivot==null?s.i:pivot])for(let dd=0;dd<len;dd++){const p0=base-dd*st;if(p0<0||(!nv&&(base%10)-dd<0)||seen.has(p0))continue;seen.add(p0);const c=bCellsC(p0,nv,len);if(c&&!c.some(x=>occ[x]!=null)){BL[k]={i:p0,v:nv};return true}}
toast('Bu gemiyi döndürmeye yer yok; önce biraz kenara sürükle',1);return false}
// Sürüklenen geminin yeni başlangıç karesi (tahtanın kenarına yaslanır)
function bDropAt(k,off,t){const s=BL[k],len=BF[k];let r=t/10|0,c=t%10;if(s.v)r=Math.max(0,Math.min(10-len,r-off));else c=Math.max(0,Math.min(10-len,c-off));const i=r*10+c,cells=bCellsC(i,s.v,len),occ=bOcc(BL,k);return {i,cells,ok:!!cells&&!cells.some(x=>occ[x]!=null)}}
function bPlaceGrid(rd){const occ=bOcc(BL),selC=BL&&BL[BSEL]?bCellsC(BL[BSEL].i,BL[BSEL].v,BF[BSEL]):[],seg=bSeg(bShipsL(BL)),g=h('div',{class:'bgrid place'+(rd?'':' live')});
for(let i=0;i<100;i++)g.append(h('button',{type:'button',class:'bc '+(occ[i]!=null?seg[i]+(selC&&selC.includes(i)&&!rd?' sel':''):''),'data-i':i,disabled:!!rd,'aria-label':'ABCDEFGHIJ'[i/10|0]+(i%10+1)}));
if(rd)return g;const cellAt=(x,y)=>{const e=document.elementFromPoint(x,y),b=e&&e.closest&&e.closest('.bc');return b&&g.contains(b)?+b.getAttribute('data-i'):-1};
const clr=()=>g.querySelectorAll('.pv,.pvbad,.drag').forEach(b=>b.classList.remove('pv','pvbad','drag'));
g.onpointerdown=e=>{const i=cellAt(e.clientX,e.clientY);if(i<0)return;e.preventDefault();const k=bOcc(BL)[i];
 BDR={i,k:k==null?-1:k,x:e.clientX,y:e.clientY,mv:0,off:k==null?0:bCellsC(BL[k].i,BL[k].v,BF[k]).indexOf(i),to:null};try{g.setPointerCapture(e.pointerId)}catch(x){}};
g.onpointermove=e=>{const D=BDR;if(!D||D.k<0)return;if(!D.mv&&Math.hypot(e.clientX-D.x,e.clientY-D.y)<7)return;e.preventDefault();
 if(!D.mv){D.mv=1;BSEL=D.k}const t=cellAt(e.clientX,e.clientY);if(t<0)return;const r=bDropAt(D.k,D.off,t);D.to=r;clr();
 bCellsC(BL[D.k].i,BL[D.k].v,BF[D.k]).forEach(x=>g.children[x].classList.add('drag'));(r.cells||[]).forEach(x=>g.children[x].classList.add(r.ok?'pv':'pvbad'))};
g.onpointerup=e=>{const D=BDR;BDR=null;if(!D)return;clr();
 if(D.k<0){bPlace(D.i);return}
 if(!D.mv){if(BSEL!==D.k){BSEL=D.k;bRender();return}if(bRot(D.k,D.i))bRender();return}
 if(D.to&&D.to.ok){BL[D.k]={i:D.to.i,v:BL[D.k].v};if(navigator.vibrate)try{navigator.vibrate(10)}catch(x){}}else if(D.to)toast('Oraya sığmıyor ya da başka bir gemiye değiyor',1);bRender()};
g.onpointercancel=()=>{BDR=null;clr()};return g}
function bPlace(i){if(!BL)return;const len=BF[BSEL],c=bCellsC(i,BV,len);if(!c)return toast('Gemi tahtadan taşıyor; yönü değiştir ya da başka kare seç',1);const occ=bOcc(BL,BSEL);if(c.some(x=>occ[x]!=null))return toast('Başka bir geminin üstüne gelemez',1);
BL[BSEL]={i,v:BV};const nx=BL.findIndex(s=>!s);if(nx>=0)BSEL=nx;bRender()}
function bRender(){const U=BU;if(!U.root)return;const g=BS,bt=(t,fn,c)=>h('button',{type:'button',class:'btn '+(c||'sec')+' sm',onclick:fn},t);
U.sc.replaceChildren(...(g?Object.entries(g.sc||{}).sort((a,b)=>b[1]-a[1]).map(([n,v])=>h('span',{class:'tag',text:(n==ME.name?'sen':n)+' '+v})):[]));
U.log.replaceChildren(...(g?g.log.slice().reverse().map(x=>h('div',{text:x})):[]));
const newBtn=()=>bt('Yeni oyun başlat',()=>{const others=(prevWho||[]).filter(x=>x!=ME.name);if(others.length<=1)return send({t:'bnew',vs:others[0]||'',force:1});
const m=modal('Kiminle oynayacaksın?',h('div',{class:'stack',style:'gap:8px'},...others.map(n=>h('button',{type:'button',class:'btn sec full',onclick:()=>{m.remove();send({t:'bnew',vs:n,force:1})}},n))),[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Vazgeç')])},' ');
if(!g){U.st.textContent='Henüz oyun yok. İki kişilik: başlat, sonra arkadaşını davet et ya da odadaki biriyle oyna.';U.area.replaceChildren();U.acts.replaceChildren(newBtn());return}
const me=g.me,opp=me>=0?g.pl[1-me]:null;
if(g.ph=='wait'){if(me>=0){U.st.textContent='⏳ Rakip bekleniyor';U.area.replaceChildren(h('div',{class:'mu-hint',text:'Arkadaşını davet et: odaya girdiği anda otomatik olarak rakibin olur ve oyun başlar.'}));U.acts.replaceChildren(bt('Arkadaşını davet et',()=>inviteModal(),' '),bt('Vazgeç',()=>send({t:'bquit'})))}
else{U.st.textContent=g.pl[0]+' rakip bekliyor';U.area.replaceChildren();U.acts.replaceChildren(bt('Rakip ol',()=>send({t:'bjoin'}),' '))}return}
if(g.ph=='place'){
 if(me<0){U.st.textContent=g.pl.join(' ve ')+' gemilerini yerleştiriyor…';U.area.replaceChildren();U.acts.replaceChildren();return}
 const rd=g.ready[me],ord=g.ready[1-me];U.st.textContent=rd?(ord?'Başlıyor…':opp+' gemilerini yerleştiriyor, bekleniyor…'):'Gemilerini yerleştir'+(ord?' · '+opp+' hazır ✓':'');
  const fleet=h('div',{class:'chips'},BF.map((len,k)=>h('button',{type:'button',class:(k==BSEL&&!rd?'on':''),disabled:!!rd,onclick:()=>{BSEL=k;bRender()}},BNM[k]+' ('+len+')'+(BL&&BL[k]?' ✓':''))));
 U.area.replaceChildren(rd?h('small',{class:'mu',text:'Hazırsın. Değiştirmek istersen “Değiştir”e bas.'}):h('small',{class:'mu',text:'Gemiyi parmağınla sürükleyip istediğin yere bırak. Döndürmek için gemiye dokun (seçiliyse bir dokunuş döndürür). Boş kareye dokunursan seçili gemi oraya gider.'}),fleet,
  bPlaceGrid(rd));
 U.acts.replaceChildren(...(rd?[bt('Değiştir',()=>send({t:'bready',v:0}))]:[bt('↻ Seçili gemiyi döndür',()=>{if(BL&&BL[BSEL]&&bRot(BSEL))bRender()}),bt('Rastgele diz',()=>{const t=Date.now();if(t-BRT<600)return;BRT=t;const L=bRandom();if(L){BL=L;bRender()}}),
  bt('✓ Hazırım',()=>{if(!BL||BL.some(s=>!s))return toast('Önce bütün gemileri yerleştir',1);send({t:'bready',v:1,L:BL})},' ')]));return}
if(me<0){U.st.textContent=g.ph=='over'?'🏆 '+g.win+' kazandı':'Sıra: '+g.pl[g.tn];
 U.area.replaceChildren(...g.boards.map(B=>{const sg=bSeg(B.sunk.map(s=>s.cells)),m={};B.shots.forEach(x=>m[x.i]=x.h);return h('div',{class:'stack',style:'gap:4px'},h('small',{class:'mu',text:B.n+' denizi'}),bGrid('sm',i=>[sg[i]?sg[i]+' sunk':m[i]===1?'hit':m[i]===0?'miss':'',sg[i]?'🔥':m[i]===0?'•':m[i]===1?'💥':''],null))}));
 U.acts.replaceChildren(g.ph=='over'?newBtn():'');return}
const my=g.tn==me&&g.ph=='play',onOp={},onMe={};g.onOp.forEach(x=>onOp[x.i]=x.h);g.onMe.forEach(x=>onMe[x.i]=x.h);
const opSeg=bSeg(g.opSunk.map(s=>s.cells)),mySeg=bSeg((g.my||[]).map(s=>s.cells)),revSeg=bSeg((g.opShips||[]).map(s=>s.cells)),mySunkC=new Set((g.my||[]).filter(s=>g.mySunk.includes(s.k)).flatMap(s=>s.cells));
U.st.textContent=g.ph=='over'?(g.win==ME.name?'🏆 Kazandın! Rakibin bütün gemilerini batırdın.':'💥 '+g.win+' kazandı.'):my?(BSHOT>=0?'🎯 Ateş edildi…':(x=>x.indexOf(ME.name+' ')==0&&/isabet|BATIRDI/.test(x))(g.log[g.log.length-1]||'')?'💥 İsabet! Bir atış hakkın daha var':'🎯 Sıra sende: rakibin denizine ateş et'):'⏳ Sıra: '+opp;
const left=BF.map((len,k)=>h('span',{class:'tag'+(g.opSunk.some(s=>s.k==k)?' sunk':''),text:BNM[k]+' '+len}));
U.area.replaceChildren(h('small',{class:'mu',text:opp+' denizi'+(my?' — bir kareye dokun':'')}),
 bGrid('tgt',i=>[opSeg[i]?opSeg[i]+' sunk':onOp[i]===1?'hit':onOp[i]===0?'miss':revSeg[i]?revSeg[i]+' ghost':'',opSeg[i]?'🔥':onOp[i]===0?'•':onOp[i]===1?'💥':'',my&&onOp[i]==null&&BSHOT<0],i=>{if(BSHOT>=0)return;BSHOT=i;setTimeout(()=>{if(BSHOT===i){BSHOT=-1;bRender()}},4000);if(navigator.vibrate)try{navigator.vibrate(15)}catch(e){}send({t:'bshot',i});bRender()}),
 h('div',{class:'chips',style:'justify-content:center'},left),
 h('small',{class:'mu',text:'Senin denizin'}),bGrid('sm',i=>[mySeg[i]?mySeg[i]+(mySunkC.has(i)?' sunk':onMe[i]===1?' hitship':''):onMe[i]===0?'miss':'',mySeg[i]&&onMe[i]===1?(mySunkC.has(i)?'🔥':'💥'):onMe[i]===0?'•':''],null));
U.acts.replaceChildren(g.ph=='over'?newBtn():bt('Teslim ol',()=>{if(confirm('Teslim olmak istiyor musun?'))send({t:'bquit'})},'dng'))}

// Bağlama göre yardım: hangi sekmedeysen onu anlatır
function helpModal(){if(TAB==1)return filmHelp();const li=(b,t)=>h('li',{},h('b',{text:b}),' — '+t);let title,items;
if(TAB==2){title='Yapboz ve müzik';items=[li('Yapboz','Parça sayısını seç, “Fotoğraf seç ve başlat”a bas. Parçaları sürükle; herkes aynı anda taşıyabilir. Boş yeri sürükleyerek tahtayı kaydır, iki parmakla yakınlaştır.'),
li('Müzik','Şarkı adını yaz ya da YouTube linki yapıştır. Herkes aynı anda duyar; telefonun izin vermezse videonun ▶ düğmesine bir kez dokun.'),
li('Sıra ve listeler','Aramada “＋ Sıra” ile sıraya ekle; çalan bitince sıradaki herkeste başlar. “💾 Kaydet” ile listeni sakla, “📂 Listelerim”den tekrar çal.')]}
else if(GSEL=='duel'){title='Kelime Düellosu';items=[li('Amaç','Gizli 5 harfli Türkçe kelimeyi rakiplerinden önce bul. 6 hakkın var.'),li('Renkler','🟩 harf doğru yerde · 🟨 kelimede var ama başka yerde · ⬛ kelimede yok.'),
li('Rakipler','Rakiplerinin renklerini canlı görürsün, harflerini görmezsin. İlk bilen kazanır; seri skoru tutulur.'),li('Kelime havuzu','“Yaygın kelimeler” herkesin bildiği kelimelerden seçer; “Tüm sözlük” on binlerce kelimeden seçer, daha zordur.'),
li('Yazma','Ekrandaki ya da bilgisayarındaki klavyeyi kullan; ⏎ gönderir, ⌫ siler. Tahminler sözlükten denetlenir.')]}
else if(GSEL=='bs'){title='Amiral Battı';items=[li('Kurulum','Gemiler otomatik dizilir. Değiştirmek için 🎲 Rastgele ya da gemiyi seç → yönü ayarla → başlayacağı kareye dokun. Sonra “Hazırım”.'),
li('Filo','Uçak gemisi 5 · Muharebe gemisi 4 · Kruvazör 3 · Denizaltı 3 · Muhrip 2 kare.'),li('Savaş','Sırası gelen, rakibin denizinde bir kareye dokunur: 💥 isabet, • ıska. Vurursan bir kez daha atarsın.'),
li('Kazanma','Rakibin bütün gemilerini ilk batıran kazanır; batan gemi 🔥 ile gösterilir.'),li('Rakip yoksa','Oyunu başlat ve 🔗 ile arkadaşını davet et; odaya girdiği anda rakibin olur.')]}
else if(GSEL=='chess'){title='Satranç';items=[li('Başlatma','“Yeni oyun başlat”a bas, süreyi seç (süresiz, 10 dk, 5 dk ya da 3+2). Renkler rastgele dağıtılır; odada kimse yoksa davet ettiğin kişi girdiği anda rakibin olur.'),
li('Hamle','Taşına dokun: gidebileceği kareler noktayla, alabileceği taşlar halkayla gösterilir. Hedef kareye dokun. Piyon son sıraya ulaşınca neye dönüşeceğini seçersin.'),
li('Kurallar','Rok, geçerken alma, şah, şah mat, pat, 50 hamle, üç kez aynı konum ve yetersiz malzeme otomatik uygulanır; kurala aykırı hamle yapılamaz.'),
li('Süre','Süreli oyunda sırası gelenin saati akar; süresi biten kaybeder. 3+2’de her hamlede 2 sn eklenir.'),
li('Beraberlik ve teslim','“Beraberlik teklif et” rakibine sorulur. “Teslim ol” oyunu bitirir. Skor: galibiyet 1, beraberlik ½.'),
li('İzleyiciler','Odadaki diğer kişiler oyunu canlı izler.')]}
else{title='Kelimelik';items=[li('Oyun','2–4 kişilik Türkçe kelime oyunu. Odadaki herkes (en fazla 4) oyuna katılır; sırayla oynanır. Harfleri sürükleyip tahtaya bırak, “Oyna”ya bas.'),li('Puan','Renkli kareler harf ya da kelime puanını katlar; 7 harfin hepsini kullanırsan +50 puan.'),li('Sözlük','Sözlükte olmayan kelime için rakiplerine onay sorulur; ilk yanıt veren karar verir.'),li('Teslim','3–4 kişilik oyunda teslim olan oyundan çekilir, diğerleri devam eder.')]}
if(TAB==3)items.push(li('Oyun değiştirme','Üstteki düğmelerden başka bir oyun seçince odadaki herkese sorulur; herkes kabul edince oda o oyuna geçer.'));
const m=modal(title+' – nasıl kullanılır?',h('ul',{class:'help'},items),[h('button',{class:'btn',onclick:()=>m.remove()},'Tamam')])}
// ---------- Satranç ----------
let CS=null,CSI='',CSEL=-1,CU={},CRT=0,CFL='',CFV=false,CTCN=(()=>{try{return localStorage.ctc||'10'}catch(e){return '10'}})();
const CGL={K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞',P:'♟'},CVAL={P:1,N:3,B:3,R:5,Q:9,K:0};
const cGlyph=p=>CGL[p[1]]+'︎';
const CTCL=[['none','Süresiz'],['10','10 dk'],['5','5 dk'],['3+2','3+2']];
function chessCard(){const st=h('div',{class:'lbl',style:'margin:0;text-align:center'}),sc=h('div',{class:'chips'}),top=h('div',{class:'cpl'}),bot=h('div',{class:'cpl'}),board=h('div',{class:'cboard'}),
bar=h('div',{class:'gprop',style:'display:none'}),acts=h('div',{class:'row wrap',style:'justify-content:center'}),hist=h('div',{class:'chist'}),area=h('div',{class:'stack',style:'gap:8px'},top,board,bot);
const root=h('div',{class:'card',id:'cp'},h('div',{class:'row',style:'justify-content:space-between;flex-wrap:wrap'},h('h3',{text:'Satranç'}),sc),st,area,bar,acts,hist,
h('small',{class:'mu',text:'Bir taşına dokun, gidebileceği kareler işaretlenir; sonra hedef kareye dokun. Siyahla oynarken tahta senin tarafına döner. Kurallar (rok, geçerken alma, terfi, şah mat, pat) otomatik uygulanır.'}));
CU={root,st,sc,top,bot,board,bar,acts,hist,area};cRender();return root}
function cSet(g){CS=g;CRT=Date.now();if(!g||g.id!==CSI){CSI=g?g.id:'';CSEL=-1;CFL=''}else if(g.ph!='play'||g.turn!==g.me)CSEL=-1;cRender()}
function cLeft(col){const k=CS&&CS.clk;if(!k)return null;let v=k[col];if(k.run==col)v-=Date.now()-CRT;return Math.max(0,v)}
const cFmt=ms=>ms<10000?(Math.floor(ms/100)/10).toFixed(1):(s=>(s/60|0)+':'+String(s%60).padStart(2,'0'))(Math.ceil(ms/1000));
const cHalf=v=>{const f=Math.floor(v);return v%1?(f?f+'½':'½'):String(v)};
function cPlName(col){return CS.pl[col=='w'?0:1]||'?'}
function cPanel(el,col){const g=CS,n=cPlName(col),cap=(g.cap&&g.cap[col])||[],oc=col=='w'?'b':'w',adv=cap.reduce((s,p)=>s+CVAL[p[1]],0)-((g.cap&&g.cap[oc])||[]).reduce((s,p)=>s+CVAL[p[1]],0);
const run=g.ph=='play'&&g.turn==col,left=cLeft(col);el.className='cpl'+(run?' on':'');
el.replaceChildren(h('span',{class:'cn',text:(col=='w'?'⚪ ':'⚫ ')+(n==ME.name?n+' (sen)':n)}),
h('span',{class:'ccap'},...cap.slice().sort((a,b)=>CVAL[b[1]]-CVAL[a[1]]).map(p=>h('span',{class:'pc '+p[0],text:cGlyph(p)})),adv>0?h('small',{class:'mu',text:' +'+adv}):null),
left==null?null:h('span',{class:'cclk'+(run?' run':'')+(left<20000&&g.ph=='play'?' low':''),'data-c':col,text:cFmt(left)}))}
function cTick(){if(!CS||CS.ph!='play'||!CS.clk||!CU.root)return;for(const el of CU.root.querySelectorAll('.cclk')){const col=el.getAttribute('data-c'),v=cLeft(col);el.textContent=cFmt(v);el.classList.toggle('low',v<20000)}
const r=CS.clk.run;if(r&&cLeft(r)<=0){const k=CS.id+':'+CS.hist.length;if(CFL!==k){CFL=k;send({t:'cflag'})}}}
if(!window._cInt)window._cInt=setInterval(()=>{if(TAB==3&&GSEL=='chess')cTick()},200);
function cTap(i){const g=CS;if(!g||g.ph!='play'||!g.me)return;if(g.turn!==g.me){if(g.b[i]&&g.b[i][0]==g.me)toast('Sıra rakibinde');return}
const L=g.moves||[];if(CSEL>=0){const m=L.find(x=>x[0]==CSEL&&x[1]==i);if(m){if(m[2])return cPromo(CSEL,i);return cGo(CSEL,i,'Q')}}
CSEL=L.some(x=>x[0]==i)&&CSEL!=i?i:-1;cRender()}
function cPromo(f,t){const col=CS.me,m=modal('Piyon neye dönüşsün?',h('div',{class:'row',style:'justify-content:center;gap:8px'},...['Q','R','B','N'].map(k=>h('button',{type:'button',class:'btn sec cpro','aria-label':{Q:'Vezir',R:'Kale',B:'Fil',N:'At'}[k],onclick:()=>{m.remove();cGo(f,t,k)}},h('span',{class:'pc '+col,text:cGlyph(col+k)})))),[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Vazgeç')])}
function cGo(f,t,p){const g=CS,b=g.b.slice(),pc=b[f],me=g.me,op=me=='w'?'b':'w';
// anında göster (sunucu birazdan kesin durumu gönderir)
if(pc[1]=='P'&&f%8!=t%8&&!b[t])b[t+(me=='w'?8:-8)]='';if(pc[1]=='K'&&Math.abs(t-f)==2){if(t>f){b[f+1]=b[f+3];b[f+3]=''}else{b[f-1]=b[f-4];b[f-4]=''}}
b[t]=pc[1]=='P'&&(t<8||t>55)?me+p:pc;b[f]='';const clk=g.clk?{...g.clk,[me]:cLeft(me),run:op}:null;
CS={...g,b,turn:op,moves:[],last:{f,t},chk:-1,clk,draw:''};CRT=Date.now();CSEL=-1;cRender();send({t:'cmove',f,to:t,p})}
function cNew(){const others=(prevWho||[]).filter(x=>x!=ME.name);let tc=CTCN,vs=others[0]||'';const box=h('div',{class:'stack',style:'gap:10px'});
const draw=()=>box.replaceChildren(h('small',{class:'mu',text:'Süre'}),h('div',{class:'chips'},...CTCL.map(([k,t])=>h('button',{type:'button',class:tc==k?'on':'',onclick:()=>{tc=k;draw()}},t))),
others.length>1?h('small',{class:'mu',text:'Rakip'}):null,others.length>1?h('div',{class:'chips'},...others.map(n=>h('button',{type:'button',class:vs==n?'on':'',onclick:()=>{vs=n;draw()}},n))):null,
h('small',{class:'mu',text:others.length?'Renkler rastgele dağıtılır.':'Odada başka kimse yok: oyunu başlat, sonra arkadaşını davet et; girdiği anda rakibin olur.'}));draw();
const m=modal('Yeni satranç oyunu',box,[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),h('button',{type:'button',class:'btn',onclick:()=>{m.remove();CTCN=tc;try{localStorage.ctc=tc}catch(e){}send({t:'cnew',tc,vs})}},'Başlat')])}
function cRender(){const U=CU;if(!U.root)return;const g=CS,bt=(t,fn,c,dis)=>h('button',{type:'button',class:'btn '+(c||'sec')+' sm',disabled:!!dis,onclick:fn},t);
U.sc.replaceChildren(...(g?Object.entries(g.sc||{}).sort((a,b)=>b[1]-a[1]).map(([n,v])=>h('span',{class:'tag',text:(n==ME.name?'sen':n)+' '+cHalf(v)})):[]));
U.bar.style.display='none';U.hist.replaceChildren();
if(!g||g.ph=='wait'){U.area.style.display='none';
 if(!g){U.st.textContent='Henüz oyun yok. İki kişilik: “Yeni oyun”a bas, süreyi seç.';U.acts.replaceChildren(bt('Yeni oyun başlat',cNew,' '));return}
 if(g.pl[0]==ME.name){U.st.textContent='⏳ Rakip bekleniyor';U.acts.replaceChildren(bt('Arkadaşını davet et',()=>inviteModal(),' '),bt('Vazgeç',()=>send({t:'cquit'})))}
 else{U.st.textContent=g.pl[0]+' rakip bekliyor';U.acts.replaceChildren(bt('Rakip ol',()=>send({t:'cjoin'}),' '))}return}
U.area.style.display='';const flip=(g.me=='b')!==CFV,L=g.moves||[],tg=CSEL>=0?L.filter(m=>m[0]==CSEL):[],my=g.ph=='play'&&g.me&&g.turn==g.me;
const sq=[];for(let k=0;k<64;k++){const i=flip?63-k:k,p=g.b[i],r=i/8|0,c=i%8,t=tg.find(m=>m[1]==i);
 let cls='csq '+((r+c)%2?'d':'l');if(g.last&&(g.last.f==i||g.last.t==i))cls+=' lm';if(g.chk==i)cls+=' ck';if(CSEL==i)cls+=' sel';if(t)cls+=p?' ccp':' cdt';if(my&&L.some(m=>m[0]==i))cls+=' mv';
 sq.push(h('button',{type:'button',class:cls,'aria-label':'abcdefgh'[c]+(8-r)+(p?' '+p:''),onclick:()=>cTap(i)},p?h('span',{class:'pc '+p[0],text:cGlyph(p)}):null,
  (flip?r==0:r==7)?h('span',{class:'cf',text:'abcdefgh'[c]}):null,(flip?c==7:c==0)?h('span',{class:'cr',text:String(8-r)}):null))}
U.board.replaceChildren(...sq);const topC=flip?'w':'b';cPanel(U.top,topC);cPanel(U.bot,topC=='w'?'b':'w');
const H=g.hist||[],rows=[];for(let k=0;k<H.length;k+=2)rows.push(h('span',{},h('b',{text:(k/2+1)+'.'}),H[k]+(H[k+1]?' '+H[k+1]:'')));U.hist.replaceChildren(...rows);U.hist.scrollTop=U.hist.scrollHeight;
const flipB=bt('Çevir',()=>{CFV=!CFV;cRender()});
if(g.ph=='over'){const r=g.res||{};U.st.textContent=r.name?(r.name==ME.name?'🏆 Kazandın! ':'🏆 '+r.name+' kazandı · ')+r.why:'🤝 Berabere · '+(r.why||'');
 U.acts.replaceChildren(bt('Yeni oyun başlat',cNew,' '),flipB);return}
const tn=cPlName(g.turn),chk=g.chk>=0;
U.st.textContent=g.me?(g.turn==g.me?'Sıra sende'+(chk?' — ŞAH!':''):tn+' düşünüyor…'+(chk?' (şah çekildi)':'')):(tn+' oynuyor'+(chk?' — şah!':'')+' · izliyorsun');
if(g.draw&&g.me){U.bar.style.display='';if(g.draw!==g.me)U.bar.replaceChildren(h('div',{class:'grow'},h('b',{text:''+cPlName(g.draw)+' beraberlik teklif ediyor'})),bt('Kabul',()=>send({t:'cdraw',a:'accept'}),' '),bt('Reddet',()=>send({t:'cdraw',a:'decline'})));
 else U.bar.replaceChildren(h('div',{class:'grow'},h('b',{text:'Beraberlik teklifin yanıt bekliyor…'})))}
U.acts.replaceChildren(...(g.me?[bt('Beraberlik teklif et',()=>send({t:'cdraw',a:'offer'}),'',!!g.draw),bt('Teslim ol',()=>{if(confirm('Teslim olmak istediğine emin misin?'))send({t:'cres'})})]:[]),flipB)}

// ---------- profil ----------
async function myCode(){if(FR&&FR.me&&FR.me.tag)return FR.me.n+'#'+FR.me.tag;try{const j=await api('me');if(j.tag){if(FR)FR.me={n:j.name,tag:j.tag};return j.name+'#'+j.tag}}catch(e){}return ''}
function codeBox(c){const url=location.origin+'/?ekle='+encodeURIComponent(c),txt='Bizim Sinema’da beni arkadaş olarak ekle: '+c;
const m=modal('Arkadaş kodun',h('div',{class:'stack',style:'gap:10px'},h('div',{class:'pf-code',text:c}),h('small',{class:'mu',text:'Arkadaşın bu kodu Arkadaşlar kartına yazarak seni ekleyebilir. Linki gönderirsen tek dokunuşla ekler.'})),
[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Kapat'),h('button',{type:'button',class:'btn sec',onclick:async()=>{try{await navigator.clipboard.writeText(c);toast('Kod kopyalandı: '+c)}catch(e){toast('Kodu basılı tutup kopyalayabilirsin',1)}}},'Kodu kopyala'),
h('button',{type:'button',class:'btn',onclick:async()=>{try{if(navigator.share){await navigator.share({title:'Bizim Sinema',text:txt,url});return}await navigator.clipboard.writeText(txt+'\n'+url);toast('Davet metni kopyalandı')}catch(e){if(!e||e.name!='AbortError')toast('Paylaşılamadı; kodu kopyalayıp gönderebilirsin',1)}}},'Paylaş')])}
async function viewProfile(){leaveRoom();closeLive();CURV='profile';curClear();clearInterval(LT);LT=0;
const code=h('div',{class:'pf-code',text:'…'}),st=h('div',{class:'pf-st'}),
cp=h('button',{type:'button',class:'btn sec'},'Kodu kopyala'),sh=h('button',{type:'button',class:'btn'},'Paylaş');
mount(h('div',{class:'narrow stack'},brand(h('button',{type:'button',class:'btn sec sm',onclick:()=>viewLobby()},ic('back',16),'Geri')),
h('div',{class:'card',style:'text-align:center'},h('div',{class:'pf-av',text:ME.name[0].toUpperCase()}),h('h1',{text:ME.name,style:'margin:6px 0 0'}),h('small',{class:'mu',text:ME.role=='admin'?'Yönetici':'Üye'})),
h('div',{class:'card'},h('h2',{text:'Arkadaş kodun'}),code,h('small',{class:'mu',text:'Bu kod sana otomatik verildi ve değişmez. Arkadaşların seni bu kodla ekler; kodu bilmeyen kimse sana istek gönderemez.'}),h('div',{class:'row'},cp,sh)),
st,pwaCard(),
h('div',{class:'card'},h('h2',{text:'Hesap'}),h('button',{class:'btn sec full',onclick:passModal},ic('key'),'Şifremi değiştir'),
h('button',{class:'btn sec full',onclick:async()=>{if(!confirm('Tüm cihazlardaki oturumların kapatılsın mı?'))return;try{await api('me/revoke','POST');logout()}catch(x){toast(x,1)}}},'Tüm cihazlarda oturumu kapat'),
h('button',{class:'btn sec full',onclick:()=>logout()},ic('out'),'Çıkış yap'),
ME.name!='admin'?h('button',{class:'btn dng full',onclick:delModal},'Hesabımı sil'):null)));
let c='';try{const j=await api('me');c=j.tag?j.name+'#'+j.tag:'';
st.replaceChildren(h('div',{},h('b',{text:String(j.fr||0)}),h('small',{class:'mu',text:'arkadaş'})),h('div',{},h('b',{text:FR?String(FR.f.filter(x=>x.on).length):'–'}),h('small',{class:'mu',text:'çevrimiçi'})),h('div',{},h('b',{text:j.ts?new Date(j.ts).toLocaleDateString('tr-TR',{month:'short',year:'numeric'}):'–'}),h('small',{class:'mu',text:'üyelik'})))}catch(e){}
code.textContent=c||'Kod alınamadı, sayfayı yenile';
cp.onclick=async()=>{if(!c)return;try{await navigator.clipboard.writeText(c);toast('Kod kopyalandı: '+c)}catch(e){toast('Kodu basılı tutup kopyalayabilirsin',1)}};
sh.onclick=async()=>{if(!c)return;const url=location.origin+'/?ekle='+encodeURIComponent(c),txt='Bizim Sinema’da beni arkadaş olarak ekle: '+c;try{if(navigator.share){await navigator.share({title:'Bizim Sinema',text:txt,url});return}await navigator.clipboard.writeText(txt+'\n'+url);toast('Davet metni kopyalandı')}catch(e){if(!e||e.name!='AbortError')codeBox(c)}}}
function delModal(){const pw=h('input',{class:'in',type:'password',placeholder:'Şifren',autocomplete:'current-password'}),er=h('div',{class:'err'});
const m=modal('Hesabını sil',h('div',{class:'stack'},h('small',{text:'Hesabın, arkadaş listen ve bildirim ayarların kalıcı olarak silinir. Bu işlem geri alınamaz.'}),pw,er),[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),
h('button',{type:'button',class:'btn dng',onclick:async()=>{if(!pw.value){er.textContent='Şifreni yaz';return}try{await api('me/delete','POST',{pass:pw.value});m.remove();toast('Hesabın silindi');logout()}catch(x){er.textContent=String(x)}}},'Kalıcı olarak sil')])}

// ---------- arkadaşlar ----------
let FR=null,FRT=0,FRBUSY=0,FRC=null;
function frCards(){const inp=h('input',{class:'in',placeholder:'kod, örn. ad#1234',maxlength:24,autocapitalize:'none',autocorrect:'off',autocomplete:'off',spellcheck:'false',enterkeyhint:'send','aria-label':'Eklenecek kullanıcı adı'});
const add=async()=>{const v=inp.value.trim().replace(/^@/,'');if(!v)return inp.focus();const r=await frAct('req',v);if(r)inp.value=''};inp.onkeydown=e=>{if(e.key=='Enter'){e.preventDefault();add()}};
const q=h('div',{id:'frq'}),c=h('div',{class:'card',id:'frc'},h('div',{class:'row',style:'justify-content:space-between'},h('h2',{text:'Arkadaşlar'}),h('small',{class:'mu',id:'frn'})),
h('div',{class:'row'},inp,h('button',{type:'button',class:'btn',onclick:add},'Ekle')),h('div',{class:'row',style:'justify-content:space-between;gap:8px'},h('small',{class:'mu',id:'frme',text:'Senin kodun: …'}),h('button',{type:'button',class:'btn sec sm',onclick:()=>frShare()},'Kodumu paylaş')),
h('div',{id:'frl'}),h('div',{id:'fro'}),h('div',{id:'frb'}));
clearInterval(FRT);FRT=setInterval(()=>{if(!$('#frc')){clearInterval(FRT);FRT=0;return}if(document.visibilityState=='visible')frLoad()},8000);
setTimeout(()=>{if(FR)frRender();frLoad()},0);FRC=c;return [q,c]}
function frCards_c(){return FRC}
async function frLoad(){try{FR=await api('friends')}catch(e){return}frRender()}
async function frAct(a,n){if(FRBUSY)return;FRBUSY=1;try{const r=await api('friends','POST',{a,n});if(r.msg)toast(r.msg);await frLoad();return r}catch(x){toast(x,1)}finally{FRBUSY=0}}
const frCode=()=>FR&&FR.me?FR.me.n+'#'+FR.me.tag:'';
async function frShare(){const now=frCode();if(!now){const c=await myCode();if(!c)return toast('Kodun alınamadı. İnternetini kontrol edip tekrar dene.',1);frRender();return codeBox(c)}
const url=location.origin+'/?ekle='+encodeURIComponent(now),txt='Bizim Sinema’da beni arkadaş olarak ekle: '+now;
try{if(navigator.share){await navigator.share({title:'Bizim Sinema',text:txt,url});return}}catch(e){if(e&&e.name=='AbortError')return}
codeBox(now)}
const frTagEl=t=>t?h('span',{class:'mu',style:'font-weight:500',text:'#'+t}):null;
function frAgo(t){if(!t)return 'henüz giriş yapmadı';const s=(Date.now()-t)/1000;return 'son görülme: '+(s<3600?Math.max(1,Math.round(s/60))+' dk önce':s<86400?Math.round(s/3600)+' saat önce':Math.round(s/86400)+' gün önce')}
function frMenu(n){const m=modal(n,h('small',{class:'mu',text:'Engellediğin kişi sana arkadaşlık isteği ve davet gönderemez; arkadaşlığınız da sona erer.'}),[
h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),
h('button',{type:'button',class:'btn sec',onclick:()=>{if(confirm(n+' arkadaşlarından çıkarılsın mı?')){m.remove();frAct('rm',n)}}},'Arkadaşlıktan çıkar'),
h('button',{type:'button',class:'btn dng',onclick:()=>{if(confirm(n+' engellensin mi?')){m.remove();frAct('block',n)}}},'Engelle')])}
function frRender(){const q=$('#frq'),l=$('#frl');if(!l||!FR)return;const bt=(t,fn,c)=>h('button',{type:'button',class:'btn sm '+(c||'sec'),onclick:fn},t);
q.replaceChildren(FR.in.length?h('div',{class:'card frq'},h('h2',{text:'Arkadaşlık isteği'+(FR.in.length>1?' ('+FR.in.length+')':'')}),
...FR.in.map(n=>h('div',{class:'frr'},h('div',{class:'grow'},h('b',{},n,frTagEl(FR.tags&&FR.tags[n])),h('small',{class:'mu',text:'seni arkadaş olarak eklemek istiyor'})),bt('Kabul et',()=>frAct('acc',n),' '),bt('Reddet',()=>frAct('dec',n)),bt('⋯',()=>{const m=modal(n,h('small',{class:'mu',text:'Bu kişiden istek almak istemiyorsan engelleyebilirsin.'}),[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),h('button',{type:'button',class:'btn dng',onclick:()=>{m.remove();frAct('block',n)}},'Engelle')])})))):'');
const me=$('#frme');if(me&&FR.me&&FR.me.tag)me.textContent='Senin kodun: '+frCode();else if(!window._frRetry){window._frRetry=1;setTimeout(async()=>{window._frRetry=0;await myCode();frRender()},2500)}
if(PADD&&FR.me){const c=PADD;PADD='';if(c.toLowerCase()!=frCode()){const m=modal('Arkadaş ekle',h('small',{text:c+' kişisine arkadaşlık isteği gönderilsin mi?'}),[h('button',{type:'button',class:'btn sec',onclick:()=>m.remove()},'Vazgeç'),h('button',{type:'button',class:'btn',onclick:()=>{m.remove();frAct('req',c)}},'İstek gönder')])}}
const on=FR.f.filter(x=>x.on).length;$('#frn').textContent=FR.f.length?on+' / '+FR.f.length+' çevrimiçi':'';
l.replaceChildren(...(FR.f.length?FR.f.map(x=>h('div',{class:'frr'},h('i',{class:'dot'+(x.on?' on':'')}),h('div',{class:'grow'},h('b',{},x.n,frTagEl(x.tag)),h('small',{class:'mu',text:x.room?'🎬 '+x.room+' odasında'+(x.room==RM?' (seninle)':''):x.on?'çevrimiçi':frAgo(x.last)})),
x.room&&x.room!=RM?bt('Katıl',()=>joinByCode(x.room),' '):null,bt('⋯',()=>frMenu(x.n)))):[h('small',{class:'mu',text:'Henüz arkadaşın yok. Arkadaşından kodunu iste (örn. fatma#4821), yukarıya yazıp “Ekle”ye bas.'})]));
$('#fro').replaceChildren(...(FR.out.length?[h('small',{class:'lbl',text:'Yanıt bekleyen istekler'}),...FR.out.map(n=>h('div',{class:'frr'},h('div',{class:'grow'},h('b',{},n,frTagEl(FR.tags&&FR.tags[n])),h('small',{class:'mu',text:'istek gönderildi'})),bt('İptal',()=>frAct('cancel',n))))]:[]));
$('#frb').replaceChildren(...(FR.bl.length?[h('details',{},h('summary',{text:'Engellenenler ('+FR.bl.length+')'}),...FR.bl.map(n=>h('div',{class:'frr'},h('div',{class:'grow'},h('b',{text:n})),bt('Engeli kaldır',()=>frAct('unblock',n)))))]:[]))}

function leaveRoom(){vLeave(1);clearInterval(LT);LT=0;RM='';clearTimeout(wsTm);wsTm=0;wsq=[];wsTry=0;if(ws){const w=ws;ws=null;w.onclose=null;clearInterval(w.p);try{w.close()}catch(e){}}teardown();mstop();MS=null;WG=null;WP=new Map();WS=-1;st=null;PZ=null;IM=null;PC=[];PP=[];PU=0;clearInterval(tk);tk=0;hb=[];V=null;yw=null;ov.classList.remove('on')}
let wsq=[],wsTry=0,wsTm=0,wsLast=0,wsFail=0,RTP=(()=>{try{return +localStorage.rtp>Date.now()}catch(e){return false}})();
// Yedek bağlantı: bazı ağlar/operatörler WebSocket'i engelliyor. O zaman aynı mesajlar normal HTTPS istekleriyle taşınır.
class PollSock{constructor(qs){this.readyState=0;this.sid='';this.qs=qs;this.oq=[];this.busy=0;this.fails=0;this.done=0;this.onopen=this.onmessage=this.onclose=this.onerror=null;this.go()}
async rq(path,body,ms){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch('/api/rt/'+path+'?'+this.qs,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+T},body:JSON.stringify(body),signal:c.signal,cache:'no-store'});if(r.status==401)return {close:[4401,'giriş']};if(!r.ok)throw new Error('http '+r.status);return await r.json()}finally{clearTimeout(t)}}
async go(){let r;try{r=await this.rq('join',{},15000)}catch(e){return this.fin(1006,'')}if(this.readyState==3)return;if(r.close)return this.fin(r.close[0],r.close[1]);this.sid=r.sid;this.readyState=1;if(this.onopen)this.onopen();this.emit(r.m);this.loop();this.flush()}
emit(L){for(const d of L||[]){if(this.readyState!=1)break;try{if(this.onmessage)this.onmessage({data:d})}catch(e){console.error(e)}}}
async loop(){while(this.readyState==1){let r;try{r=await this.rq('poll',{sid:this.sid},30000);this.fails=0}catch(e){if(this.readyState!=1)return;if(++this.fails>=3)return this.fin(1006,'');await new Promise(z=>setTimeout(z,700*this.fails));continue}
if(this.readyState!=1)return;if(r.gone)return this.fin(4002,'oturum bitti');this.emit(r.m);if(r.close)return this.fin(r.close[0],r.close[1])}}
send(s){if(this.readyState!=1)throw new Error('kapalı');this.oq.push(s);if(!this.busy)Promise.resolve().then(()=>this.flush())}
async flush(){if(this.busy||!this.oq.length||this.readyState!=1)return;this.busy=1;const m=this.oq.splice(0,60);let r;try{r=await this.rq('send',{sid:this.sid,m},15000)}catch(e){this.oq.unshift(...m);this.busy=0;if(++this.fails>=3)return this.fin(1006,'');setTimeout(()=>this.flush(),600);return}this.busy=0;if(r&&r.gone)return this.fin(4002,'oturum bitti');if(this.oq.length)this.flush()}
close(){if(this.readyState==3)return;const sid=this.sid;if(sid)this.rq('send',{sid,m:['{"t":"bye"}']},5000).catch(()=>{});this.fin(1000,'')}
fin(code,reason){if(this.done)return;this.done=1;this.readyState=3;if(this.onclose)setTimeout(()=>this.onclose({code,reason:reason||''}),0)}}
const send=m=>{const s=JSON.stringify(m);if(ws&&ws.readyState==1){try{ws.send(s);return}catch(e){}}if(m.t!='ping'&&m.t!='pzm'&&wsq.length<30)wsq.push(s);if(RM&&(!ws||ws.readyState>1))reconnectNow()};
function reconnectNow(){if(!RM)return;clearTimeout(wsTm);wsTm=0;if(ws&&ws.readyState==1&&Date.now()-wsLast<12000){try{ws.send(JSON.stringify({t:'ping',i:Date.now()}));return}catch(e){}}if(ws){const old=ws;ws=null;old.onclose=null;clearInterval(old.p);try{old.close()}catch(e){}}connect(RM)}
if(!window._netBind){window._netBind=1;document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='visible'&&RM)reconnectNow()});window.addEventListener('pageshow',()=>{if(RM)reconnectNow()});window.addEventListener('online',()=>{if(RM){wsTry=0;reconnectNow()}})}
const lk=()=>{lock=Date.now()+900};
const exp=()=>st.pos+((st.playing&&!st.held)?(Date.now()+off-st.at)/1e3:0);
const ytId=u=>{const m=String(u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtube-nocookie\.com\/embed\/)([\w-]{11})/i);return m?m[1]:''};
const pl={ready(){return Y?!!yr:!!(V&&V.readyState>0)},time(){return Y?(yr?Y.getCurrentTime():0):V.currentTime},
paused(){if(Y){const s=Y.getPlayerState();return s!=1&&s!=3}return V.paused},busy(){return Y?false:V.seeking},
play(){lk();if(Y){Y.playVideo();setTimeout(()=>{if(Y&&st&&st.playing&&!st.held&&[1,3].indexOf(Y.getPlayerState())<0){ytNeed(1)}},2000)}else{const p=V.play();if(p&&p.catch)p.catch(e=>{if(e&&e.name=='NotAllowedError'){ov.classList.add('on');fst('tap')}})}},
pause(){lk();Y?Y.pauseVideo():V.pause()},seek(t){lk();Y?Y.seekTo(t,true):(V.currentTime=t)},rate(r){if(!Y&&V.playbackRate!=r)V.playbackRate=r}};
const px=(u,r)=>'/proxy?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(PT)+(r?'&r='+encodeURIComponent(r):'');
const getHls=()=>hp||(hp=new Promise((ok,no)=>{if(window.Hls)return ok();const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';s.onload=ok;s.onerror=()=>{hp=null;no()};document.head.append(s)}));
function teardown(){lt++;if(hls){try{hls.destroy()}catch(e){}hls=null}if(Y){try{Y.destroy()}catch(e){}Y=null;yr=0}if(V){V.onerror=null;try{V.pause();V.removeAttribute('src');V.load()}catch(e){}V.style.display=''}if(yw)yw.style.display='none';clearTimeout(bufT);bufT=0;if(bs){try{send({t:'buf',b:0})}catch(e){}}bs=0}
function ytNeed(on){on=on?1:0;if(on===YNEED&&!(on&&FS.s!='tap'))return;YNEED=on;if(YTH)YTH.style.display=on?'':'none';const g=$('#stg');if(g)g.classList.toggle('tap',!!on);if(on){fst('tap');if(YTH)YTH.scrollIntoView({block:'nearest',behavior:'smooth'})}}
function fst(s,e){if(!st||!st.sid)return;if(FS.s===s&&FS.k===st.sid)return;FS={s,k:st.sid};send({t:'fst',s,k:st.sid,e:e||''});flsRender()}
const FLM={ok:['✓ hazır','ok'],load:['⏳ yükleniyor',''],err:['✗ açılamadı','err'],tap:['👆 dokunması gerekiyor','tap']};
function flsRender(){if(!FLS)return;const on=st&&st.url,who=prevWho||[ME.name];if(!on){FLS.replaceChildren();return}
const kids=who.map(n=>{const x=n==ME.name?(FS.k===st.sid&&FS.s?{s:FS.s}:FSH[n]):FSH[n],d=FLM[x&&x.s]||['… bekleniyor',''];return h('span',{class:d[1],title:x&&x.e?x.e:'',text:(n==ME.name?'sen':n)+' '+d[0]})});
if(FS.k===st.sid&&FS.s=='err')kids.push(h('button',{type:'button',class:'btn sec sm',onclick:()=>{FRY=0;loadedKey=null;onState({...LASTM})}},'↻ Yeniden dene'));
FLS.replaceChildren(...kids)}
const bad=m=>{const s=st;
if(!FRY&&s&&s.url){FRY=1;if(syncEl){syncEl.textContent='Yeniden deneniyor…';syncEl.className='sync'}fst('load');setTimeout(()=>{if(st===s||(st&&st.sid===s.sid)){teardown();loadVid(st,true)}},2500);return}
if(syncEl){syncEl.textContent='Açılamadı';syncEl.className='sync'}fst('err',m);toast('Video açılamadı ('+m+'). “Yeniden dene”ye bas; olmazsa başka link, Referer ya da YouTube/mp4 dene.',1)};
function load(s){teardown();ov.classList.remove('on');ytNeed(0);YSK=null;if(s.url&&s.sid){FS={s:'',k:''};fst('load')}if(EMPTY)EMPTY.style.display=s.url?'none':'';if(!s.url){if(syncEl)syncEl.textContent='';return}const id=ytId(s.url);if(id)return loadYT(id);loadVid(s,false)}
function loadVid(s,vp){const my=lt,isH=/\.m3u8/i.test(s.url),src=vp?px(s.url,s.ref):s.url;let nr=0;
const fail=w=>{if(my!=lt)return;if(vp)return bad(w);getPT().then(()=>{if(my!=lt)return;teardown();loadVid(s,true)}).catch(()=>bad(w))};
if(isH&&!V.canPlayType('application/vnd.apple.mpegurl')){getHls().then(()=>{if(my!=lt)return;if(!window.Hls||!Hls.isSupported())return bad('tarayıcı HLS desteklemiyor');
hls=new Hls({maxBufferLength:30,backBufferLength:30});hls.on(Hls.Events.ERROR,(_,d)=>{if(!d.fatal||my!=lt)return;if(!vp)return fail(d.details);if(d.type==Hls.ErrorTypes.NETWORK_ERROR&&nr++<3)hls.startLoad();else if(d.type==Hls.ErrorTypes.MEDIA_ERROR&&nr++<3)hls.recoverMediaError();else bad(d.details)});hls.loadSource(src);hls.attachMedia(V)}).catch(()=>bad('hls.js yüklenemedi'))}
else{V.onerror=()=>fail('erişim/format');V.src=src;V.load()}}
function withYT(cb){if(window.YT&&YT.Player)return cb();(window.ytq=window.ytq||[]).push(cb);if(!window.ytl){window.ytl=1;window.onYouTubeIframeAPIReady=()=>{(window.ytq||[]).forEach(f=>f());window.ytq=[]};const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.onerror=()=>{window.ytl=0;toast('YouTube yüklenemedi',1)};document.head.append(s)}}
function loadYT(id){const my=lt;V.style.display='none';yw.style.display='block';yw.replaceChildren(h('div',{id:'ytp'}));yr=0;
withYT(()=>{if(my!=lt)return;Y=new YT.Player('ytp',{videoId:id,width:'100%',height:'100%',playerVars:{playsinline:1,rel:0,modestbranding:1,origin:location.origin},events:{onReady:()=>{if(my==lt){yr=1;fst('ok');tick();try{fdur(Y.getDuration())}catch(e){}}},onStateChange:ytState,onError:()=>{fst('err','YouTube gömmeye izin vermiyor');toast('YouTube: bu video gömülemiyor, başka bir video dene',1)}}})})}
function ytState(e){if(!st)return;const s=e.data,t=Y?Y.getCurrentTime():0;
if(s==1){bufEnd();ytNeed(0);fst('ok');if(Date.now()>=lock&&!st.playing){uact=Date.now();send({t:'play',pos:t})}}
else if(s==2){if(Date.now()>=lock&&st.playing){uact=Date.now();send({t:'pause',pos:t})}}
else if(s==3){if(!(YSK&&Date.now()-YSK.t<3500))bufStart()}else if(s==0){if(st.playing)send({t:'pause',pos:t})}}
let ytLast=0;function ytPoll(){if(!Y||!yr||!st)return;const t=Y.getCurrentTime(),d=t-ytLast;ytLast=t;if(Date.now()<lock||Date.now()-uact<1500)return;if(Math.abs(d-(Y.getPlayerState()==1?.5:0))>1.6&&Math.abs(t-exp())>1.6){uact=Date.now();send({t:'seek',pos:t})}}
function bufStart(){if(!st||!st.playing||bufT||bs)return;bufT=setTimeout(()=>{bufT=0;if(!bs){bs=1;send({t:'buf',b:1})}},600)}
function bufEnd(){clearTimeout(bufT);bufT=0;if(bs){bs=0;send({t:'buf',b:0})}}
function tick(){if(!RM||!st||!st.url||!pl.ready())return;
if(syncEl&&st.playing&&!st.held){const d=pl.time()-exp(),ok=Math.abs(d)<(Y?.9:.6);syncEl.textContent=ok?'● Senkron':'Eşitleniyor…';syncEl.className='sync'+(ok?' ok':'')}else if(syncEl&&FS.s!='err')syncEl.textContent='';
if(Date.now()-uact<1200||pl.busy())return;
const play=st.playing&&!st.held,e=exp(),d=pl.time()-e;
if(!play){if(!pl.paused()){pl.pause()}if(Math.abs(d)>.7)pl.seek(e);pl.rate(1);return}
if(Y){const n=Date.now(),ps=Y.getPlayerState();if(YSK&&!YSK.m&&ps==1){if(!YSK.r)YSK.r=n;else if(n-YSK.r>700){YSK.m=1;YLEAD=Math.max(0,Math.min(3,(YLEAD+(YLEAD-d))/2))}}if(ps!=3&&Math.abs(d)>.9&&(!YSK||(YSK.m&&n-YSK.t>2000)||n-YSK.t>6000)){YSK={t:n,m:0,r:0};pl.seek(e+YLEAD)}}else if(Math.abs(d)>1.3)pl.seek(e+.25);else pl.rate(d>.3?.94:d<-.3?1.06:1);
if(pl.paused())pl.play()}
function holdUI(){if(!holdEl)return;const on=st&&st.held;holdEl.style.display=on?'flex':'none';if(on)holdEl.lastChild.textContent=(hb.length?hb.join(' & '):'Biri')+' yükleniyor, bekliyoruz…'}
function setPres(who){const s=$('#pres');if(s)s.textContent=(who.length>2?who.join(', '):who.join(' & '))+(who.length>1?' · '+(who.length>2?who.length+' kişi ':'')+'birlikte':' · diğer kişi bekleniyor')}
function onState(m){LASTM=m;gsState(m.gs);FSH=m.fh||{};const pu=st&&st.url;st=m.st;if(pu!==st.url&&WLU.list)setTimeout(wlRender,0);mqSet(m.mq);hb=m.hb||[];const who=m.who||[];MSH=m.mh||{};musicState(m.ms||null);
if(prevWho){for(const x of who)if(!prevWho.includes(x)&&x!=ME.name)toast(x+' odaya katıldı');for(const x of prevWho)if(!who.includes(x))toast(x+' ayrıldı')}prevWho=who;setPres(who);
const key=st.url+'|'+st.ref+'|'+(st.sid||'');if(canUse('film')&&key!=loadedKey){loadedKey=key;FRY=0;load(st);const u=$('#vu');if(u&&document.activeElement!==u)u.value=st.url;const t=$('#vt');if(t&&document.activeElement!==t)t.value=st.title||''}
if(FTT){FTT.style.display=st.url&&st.title?'':'none';FTT.textContent='🎬 '+(st.title||'')}
holdUI();flsRender();tick()}
function connect(k,mode){clearTimeout(wsTm);wsTm=0;const qs='room='+encodeURIComponent(k)+'&mode='+encodeURIComponent(mode||ROOM_MODE||1)+(ROOM_NEW?'&new=1':'');const w=RTP?new PollSock(qs):new WebSocket((location.protocol=='https:'?'wss://':'ws://')+location.host+'/ws?'+qs+'&t='+encodeURIComponent(T));ws=w;if(!RTP)w.tmo=setTimeout(()=>{if(w.readyState==0){w.tmoHit=1;try{w.close()}catch(e){}}},8000);wsLast=Date.now();const smp=[];
w.onopen=()=>{clearTimeout(w.tmo);w.opened=1;wsFail=0;PSL='';if(VC.on)setTimeout(()=>send({t:'vjoin',id:VC.id,m:VC.mu}),50);wsTry=0;wsLast=Date.now();const d=$('#dot');if(d)d.className='dot on';const p=()=>{if(w.readyState!=1)return;if(Date.now()-wsLast>15000){reconnectNow();return}try{w.send(JSON.stringify({t:'ping',i:Date.now()}))}catch(e){}};p();setTimeout(p,600);setTimeout(p,1500);w.p=setInterval(p,5000);while(wsq.length&&w.readyState==1){try{w.send(wsq.shift())}catch(e){break}}};
w.onmessage=e=>{wsLast=Date.now();let m;try{m=JSON.parse(e.data)}catch(x){return}
if(m.t=='roomMode'){ROOM_NEW=0;const nm=[1,2,3].includes(+m.mode)?+m.mode:ROOM_MODE;if(nm!==ROOM_MODE){viewRoom(RM,nm,false);return}}
else if(m.t=='st'){if(m.i){const rtt=Date.now()-m.i;smp.push([rtt,m.now+rtt/2-Date.now()]);if(smp.length>8)smp.shift();off=smp.reduce((a,b)=>b[0]<a[0]?b:a)[1]}else if(!smp.length)off=m.now-Date.now();onState(m)}
else if(m.t=='pz')pzSet(m.pz);else if(m.t=='pzm')pzMove(m);else if(m.t=='chat')chatAdd(m);else if(m.t=='hist')m.c.forEach(chatAdd);
else if(m.t=='sys'){chatSys(m.x);toast(m.x)}else if(m.t=='react')fly(m.e,m.n);else if(m.t=='wlchg'){clearTimeout(WLT);WLT=setTimeout(wlLoad,400)}else if(m.t=='vr')vRoster(m.r);else if(m.t=='vsig')vSig(m);else if(m.t=='vbye'){if(m.id!==VC.id){vDrop(m.id);vui()}}else if(m.t=='verr'){toast(m.e,1);vLeave(1)}
else if(m.t=='locks'){LK=m.lk;lockUI()}else if(m.t=='wpend'){if(wpSeq(m)){WPO=m.p&&m.p.length&&m.by!=ME.name?{mv:m.mv,p:new Map(m.p.map(x=>[x.i,x]))}:null;wgRender()}}else if(m.t=='wq')wqSet(m);else if(m.t=='wrej')wrej(m);else if(m.t=='wg')wgSet(m.g);else if(m.t=='dg')dSet(m.g);else if(m.t=='derr')dErr(m.e);else if(m.t=='bs')bSet(m.g);else if(m.t=='berr')toast(m.e,1);else if(m.t=='cs')cSet(m.g);else if(m.t=='cerr')toast(m.e,1);else if(m.t=='werr'){wbusy(0);toast(m.e,1)}else if(m.t=='wprev')wprevSet(m);else if(m.t=='wchk')wgChk(m)};
w.onerror=()=>{if(ws===w){const p=$('#pres');if(p)p.textContent='WebSocket bağlantı hatası; yeniden deneniyor…'}};
w.onclose=ev=>{clearInterval(w.p);clearTimeout(w.tmo);if(ws!==w)return;
if(!w.opened&&!RTP&&ev.code<4000&&(w.tmoHit||++wsFail>=2)){RTP=true;wsFail=0;try{localStorage.rtp=Date.now()+864e5}catch(e){}toast('Bu ağ doğrudan bağlantıyı engelliyor; yedek bağlantıya geçildi.');wsTry=0;wsTm=setTimeout(()=>{if(ws===w&&RM)connect(RM,ROOM_MODE)},200);return}const d=$('#dot');if(d)d.className='dot';
if(ev.code==4000){toast('Oda yönetici tarafından kapatıldı',1);return viewLobby()}
if(ev.code==4404){toast('Bu kodla açık bir oda yok',1);return viewLobby()}
if(ev.code==4401){toast('Oturumun sona ermiş, yeniden giriş yap',1);return viewLobby()}
if(ev.code==4429){toast(ev.reason||'Oda dolu',1);return viewLobby()}
if(ev.code==4409){toast('Bu oda kodu başka türde bir odada kullanılıyor, yeniden dene',1);return viewLobby()}
const s=$('#pres');if(ev.code==4001){if(s)s.textContent='Bu cihazın eski bağlantısı kapatıldı; yeniden bağlanılıyor…'}else if(s)s.textContent='Bağlantı koptu ('+ev.code+'); yeniden bağlanılıyor…';api('me').catch(()=>{});const dl=Math.min(6000,800+wsTry*700);wsTry++;wsTm=setTimeout(()=>{if(ws===w&&RM)connect(RM,ROOM_MODE)},dl)}}
// ---------- sohbet ----------
function chatAdd(m){const b=$('#cb');if(!b||(m.id&&seen.has(m.id)))return;if(m.id)seen.add(m.id);const me=m.n==ME.name;
b.append(h('div',{class:'msg'+(me?' me':'')},me?null:h('b',{text:m.n}),h('span',{text:m.x}),h('time',{text:hm(m.ts)})));b.scrollTop=b.scrollHeight}
function chatSys(x){const b=$('#cb');if(!b)return;b.append(h('div',{class:'sys',text:x}));b.scrollTop=b.scrollHeight}
function fly(e,n){document.body.append(h('div',{class:'fl',style:'left:'+(8+Math.random()*80)+'%'},h('span',{text:e}),h('small',{text:n})));setTimeout(()=>{const f=document.querySelector('.fl');if(f)f.remove()},2800)}
async function invite(){const u=location.origin+'/?oda='+RM;try{if(navigator.share)await navigator.share({title:'Bizim Sinema',text:'Odaya gel: '+RM,url:u});else{await navigator.clipboard.writeText(u);toast('Davet linki kopyalandı')}}catch(e){}}
function filmHelp(){const fill=u=>{const i=$('#vu');if(i)i.value=u;m.remove();toast('Link yazıldı, Yükle\'ye bas')};
const demo=(t,u)=>h('button',{class:'btn sec sm',onclick:()=>fill(u)},t);
const m=modal('Hangi linki koyacağım?',h('div',{class:'stack'},h('ul',{class:'help'},
h('li',{},h('b',{text:'YouTube linki'}),' — en kolayı. Herhangi bir video, ikisi de tam senkron izler.'),
h('li',{},h('b',{text:'.mp4 linki'}),' — kendi videon bir yerde yüklüyse doğrudan dosya adresi. iPhone\'da en sorunsuz biçim budur.'),
h('li',{},h('b',{text:'.m3u8 linki'}),' — bir yayının akış adresi. Çalışmazsa "Gelişmiş: Referer" kutusuna videonun açıldığı sayfanın adresini yaz.'),
h('li',{},h('b',{text:'m3u8 linkini nasıl bulurum?'}),' — telefonuna ',h('b',{text:'Aloha'}),' tarayıcısını indir (App Store / Google Play, ücretsiz). Videonun olduğu sayfayı Aloha’da açıp videoyu başlat; Aloha sayfadaki videoyu algılar. Çıkan video/indirme menüsünden linki kopyala (menünün adı sürüme göre değişebilir), buraya yapıştır ve Yükle’ye bas. Link açılmazsa sayfanın adresini Referer kutusuna da yaz.')),
h('small',{text:'Denemek için aşağıdaki herkese açık test videolarını kullanabilirsin:'}),
h('div',{class:'row wrap'},demo('YouTube','https://www.youtube.com/watch?v=aqz-KE-bpKQ'),demo('MP4','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'),demo('M3U8','https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'))),[h('button',{class:'btn',onclick:()=>m.remove()},'Tamam')])}
function viewRoom(k,mode,isNew){leaveRoom();closeLive();CURV='room';RM=k;ROOM_MODE=([1,2,3].includes(+mode)?+mode:1);ROOM_NEW=isNew?1:0;localStorage.rm=k;st=null;loadedKey=null;seen=new Set();touched=0;done=0;Z={};
V=h('video',{playsinline:'',controls:'',preload:'auto'});yw=h('div',{class:'yt'});EMPTY=h('div',{class:'empty'},ic('film',32),h('span',{text:'Bir video linki yükle'}));
holdEl=h('div',{class:'hold'},h('i',{class:'sp'}),h('span'));syncEl=h('div',{class:'sync'});FLS=h('div',{class:'fls'});YTH=h('div',{class:'mu-hint',style:'display:none',text:'👇 Telefonun videoyu kendiliğinden başlatmana izin vermiyor. Aşağıdaki videonun ortasındaki ▶ düğmesine bir kez dokun; sonra herkesle eşitlenir.'});YNEED=0;
for(const [ev,t] of [['play','play'],['pause','pause']])V.addEventListener(ev,()=>{if(Date.now()<lock||!st||!st.url||V.ended)return;uact=Date.now();if(t=='play'&&!st.playing)send({t:'play',pos:V.currentTime});if(t=='pause'&&st.playing)send({t:'pause',pos:V.currentTime})});
V.addEventListener('seeked',()=>{if(Date.now()<lock||!st||!st.url)return;if(Math.abs(V.currentTime-exp())>1){uact=Date.now();send({t:'seek',pos:V.currentTime})}});
V.addEventListener('ended',()=>{if(st&&st.playing)send({t:'pause',pos:V.currentTime})});
V.addEventListener('waiting',bufStart);V.addEventListener('playing',bufEnd);V.addEventListener('canplay',bufEnd);V.addEventListener('canplay',()=>fst('ok'));V.addEventListener('playing',()=>fst('ok'));V.addEventListener('loadedmetadata',tick);V.addEventListener('loadedmetadata',()=>fdur(V.duration));
const dot=h('i',{class:'dot',id:'dot'}),pres=h('span',{id:'pres',text:'Bağlanıyor…'});
const mk=(n,i,t)=>h('button',{class:n==mode?'on':'',id:'t'+n,onclick:()=>{touched=1;tab(n)}},ic(i,16),t,h('span',{class:'lkm'}));
const seg=h('div',{class:'seg'},mk(1,'film','Film'),mk(2,'puzzle','Yapboz'),mk(3,'word','Oyunlar'));
const head=h('div',{class:'card'},h('div',{class:'row'},h('button',{class:'btn sec sq','aria-label':'Çık',onclick:()=>viewLobby()},ic('back')),h('div',{class:'grow'},h('b',{class:'rcode',text:'Oda '+k}),h('div',{class:'pill'},dot,pres)),h('button',{class:'btn sec sq','aria-label':'Davet et',onclick:inviteModal},ic('link')),h('button',{class:'btn sec sq','aria-label':'Yardım',onclick:helpModal},ic('help'))),seg);
const u=h('input',{class:'in',id:'vu',type:'url',placeholder:'YouTube, .mp4 veya .m3u8 linki',inputmode:'url',autocapitalize:'none',autocorrect:'off',spellcheck:'false',enterkeyhint:'go'});
const rf=h('input',{class:'in',type:'url',placeholder:'https://kaynak-site.com/',inputmode:'url',autocapitalize:'none',autocorrect:'off'});
const vt=h('input',{class:'in',id:'vt',placeholder:'Film adı (isteğe bağlı), örn. Spider-Man',maxlength:100,enterkeyhint:'go'});vt.onkeydown=e=>{if(e.key=='Enter')ld()};FTT=h('div',{class:'ftt',style:'display:none'});
const ld=()=>{let v=fixLink(u.value.trim());if(v!==u.value.trim())u.value=v;if(!/^https?:\/\//i.test(v))return toast('Link http:// veya https:// ile başlamalı',1);send({t:'set',url:v,ref:rf.value.trim(),title:vt.value.trim()});toast('Yükleniyor…')};u.onkeydown=e=>{if(e.key=='Enter')ld()};
const fp=h('div',{class:'card',id:'fp'},FTT,YTH,h('div',{class:'stage',id:'stg'},V,yw,EMPTY,syncEl,holdEl),FLS,h('div',{class:'row'},u,h('button',{class:'btn',onclick:ld},ic('play',16),'Yükle')),vt,h('details',{},h('summary',{text:'Gelişmiş: Referer (link açılmazsa)'}),rf),h('small',{text:'Oynat, durdur ve ileri sarma ikinizde de anında uygulanır. Biri takılırsa diğeri bekler.'}),wlBox());
const cnt=h('div',{class:'chips'},[100,250,500,1000].map(n=>h('button',{class:n==PN?'on':'','data-n':n,onclick:e=>{PN=n;cnt.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==e.currentTarget))}},n+' parça')));
const pf=h('input',{type:'file',accept:'image/*',style:'display:none',onchange:e=>{if(e.target.files[0])pnew(e.target.files[0]);e.target.value=''}});
const cv=h('canvas',{id:'pcv'});
const zbtn=(i,t,fn)=>h('button',{class:'btn sec sm',type:'button',onclick:fn},ic(i,15),t);
const pp=h('div',{class:'card',id:'pp',style:'display:none'},h('small',{text:'Parça sayısını seç, fotoğraf yükle. İkiniz de aynı anda parça taşıyabilirsiniz (oda en fazla 2 kişi).'}),cnt,h('button',{class:'btn full',onclick:()=>pf.click()},ic('img'),'Fotoğraf seç ve başlat'),pf,h('div',{class:'prog'},h('i',{id:'pgb'})),h('small',{id:'pgt'}),
h('div',{class:'zb'},zbtn('plus','Yakınlaş',()=>zoomBy(1.3)),zbtn('minus','Uzaklaş',()=>zoomBy(1/1.3)),zbtn('fit','Hepsini göster',()=>camFit()),zbtn('puzzle','Tahtaya odaklan',()=>camBoard())),cv,
h('small',{text:'Parçayı sürükle. Boş yeri sürükleyerek tahtayı kaydır, iki parmakla yakınlaştır.'}));
const cb=h('div',{class:'msgs',id:'cb'}),ci=h('input',{class:'in',placeholder:'Mesaj yaz…',maxlength:500,enterkeyhint:'send',autocomplete:'off'});
const chat=h('div',{class:'card chat'},h('div',{class:'row'},ic('users',16),h('b',{text:'Sohbet'})),voiceBox(),cb,h('div',{class:'react'},['❤️','😂','😮','👏','🔥','😢'].map(e=>h('button',{type:'button',onclick:()=>send({t:'react',e}),text:e}))),
h('form',{class:'row',onsubmit:e=>{e.preventDefault();const x=ci.value.trim();if(x){send({t:'chat',x});ci.value=''}}},ci,h('button',{class:'btn sq',type:'submit','aria-label':'Gönder'},ic('send'))));
RP={fp,pp,fpL:h('div',{style:'display:none'}),ppL:h('div',{style:'display:none'}),mp:musicCard(),mpL:h('div',{style:'display:none'}),wp:wordCard(),wpL:h('div',{style:'display:none'}),gs:gameSwitch(),dp:duelCard(),dpL:h('div',{style:'display:none'}),bp:bsCard(),bpL:h('div',{style:'display:none'}),cp:chessCard(),cpL:h('div',{style:'display:none'})};
function tab(n){TAB=n;curSave();for(let i=1;i<4;i++){const b=$('#t'+i);if(b)b.classList.toggle('on',i==n)}lockUI()}
mount(h('div',{class:'stack'},head,h('div',{class:'room'},h('div',{class:'stack'},fp,RP.fpL,pp,RP.ppL,RP.mp,RP.mpL,RP.gs,RP.wp,RP.wpL,RP.dp,RP.dpL,RP.bp,RP.bpL,RP.cp,RP.cpL),chat)));
tab(RESTAB||ROOM_MODE);RESTAB=0;pbind();connect(k,ROOM_MODE);getPT().catch(()=>{});
tk=setInterval(()=>{tick();ytPoll();mtick()},500);if(!window.rz){window.rz=1;let rt=0;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(!RM||!PZ)return;const c=$('#pcv'),w=c?c.getBoundingClientRect().width:0;if(w&&Math.abs(w-LW)>3)pfit()},250)})}}
let RP={},TAB=1,LW=0;
const AN={film:'Film izleme',puzzle:'Yapboz',music:'Müzik',word:'Kelimelik',games:'Kelime Düellosu ve Amiral Battı'};
function lockUI(){if(!RM||!RP.fp)return;
if(RP.gs)RP.gs.style.display=TAB==3?'':'none';
for(const [a,c,l,t,gk] of [['film',RP.fp,RP.fpL,1],['puzzle',RP.pp,RP.ppL,2],['music',RP.mp,RP.mpL,2],['word',RP.wp,RP.wpL,3,'word'],['games',RP.dp,RP.dpL,3,'duel'],['games',RP.bp,RP.bpL,3,'bs'],['games',RP.cp,RP.cpL,3,'chess']]){if(!c)continue;const ok=canUse(a),on=TAB==t&&(!gk||GSEL==gk);c.style.display=on&&ok?'':'none';l.style.display=on&&!ok?'':'none';
if(!ok)l.replaceChildren(h('div',{class:'card lockc'},h('div',{class:'logo lg'},ic('lock',22)),h('h2',{text:AN[a]+' kilitli'}),h('small',{text:LK[a]==1?'Şu an yalnızca yöneticilere açık.':'Yönetici kilidi açınca buradan kullanabilirsiniz.'})))}
for(const [a,t] of [['film',1],['puzzle',2]]){const b=$('#t'+t+' .lkm');if(b)b.textContent=canUse(a)?'':'🔒'}{const b=$('#t3 .lkm');if(b)b.textContent=canUse('word')||canUse('games')?'':'🔒'}
if(!canUse('film')&&loadedKey){teardown();loadedKey=null;if(EMPTY)EMPTY.style.display=''}
if(!canUse('music'))mstop();else if(MS)mapply();
if(TAB==2&&canUse('puzzle'))pfit();if(TAB==3&&GSEL=='word'&&canUse('word'))wgRender();if(TAB==3&&GSEL=='duel')dRender();if(TAB==3&&GSEL=='bs')bRender()}
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
let AM=null,YM=null,YMr=0,YMid='',YMP=null,MA=null,MUI={},SPC='';
const loadCfg=async()=>{if(!CFG){try{CFG=await api('music/cfg')}catch(e){CFG={sp:'',am:false}}}return CFG};
const expOf=ms=>ms&&ms.tr?Math.max(0,ms.pos+(ms.playing?(Date.now()+off-ms.at)/1e3:0)):0;
const mexp=()=>expOf(MS);
const fmt=s=>{s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+pad(s%60)};
const b64u=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
function getMA(){if(!MA){MA=new Audio();MA.playsInline=true;MA.preload='auto';MA.onended=()=>{if(MS&&MS.playing&&(MU.prov=='au'||(MS.tr&&MS.tr.ids&&MS.tr.ids.au==MS.tr.ids[MU.prov])))send({t:'mend',rev:MS.rev})}}return MA}
function mpauseAll(){if(YM&&YMr)ymc(()=>YM.pauseVideo());try{if(MA&&!MA.paused)MA.pause()}catch(e){}try{if(AM&&AM.isPlaying)AM.pause()}catch(e){}if(MU.on&&MU.prov=='sp')spApi('me/player/pause','PUT');MU.on=0}
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
if(MS&&MS.tr&&MU.prov==='yt'&&YM&&YMr&&typeof YM.getPlayerState=='function'&&canUse('music')){const ps=YM.getPlayerState(),now=Date.now();
if(MS.playing){
 if(ps===1){if(MU.need||MU.fail){MU.need=0;MU.fail=0;mui()}
  const target=expOf(MS),actual=YM.getCurrentTime(),d=actual-target,L=MU.lead==null?.6:MU.lead;
  if(MU.sk&&!MU.sk.m&&now-MU.sk.t>1200){MU.sk.m=1;MU.lead=Math.max(0,Math.min(4,L-d))}
  if(Number.isFinite(d)&&Math.abs(d)>.8&&(!MU.sk||now-MU.sk.t>4000)){MU.sk={t:now,m:0};ymc(()=>YM.seekTo(target+(MU.lead==null?.6:MU.lead),true))}
 }else if(ps===3){}
 else{MU.fail=(MU.fail||0)+1;ymc(()=>{YM.seekTo(expOf(MS),true);YM.playVideo()});if(MU.fail>=2&&!MU.need){MU.need=1;mui()}}
}else if(ps===1)ymc(()=>YM.pauseVideo())}
mrep()}catch(_){ }},1000)}
if(!window._muBind){window._muBind=1;document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='visible'&&MS&&MS.tr&&MS.playing)setTimeout(()=>{try{mapply()}catch(e){}},300)})}
// Kod kaynaklı oynatıcı komutları işaretlenir; böylece kullanıcının videonun kendi düğmesine basması ayırt edilir
function ymc(fn){MU.selfT=Date.now();try{fn()}catch(e){}}
function ytReady(id,box){if(YM&&YMr)return Promise.resolve();if(YMP)return YMP;
YMP=new Promise(ok=>{const slow=setTimeout(()=>{MU.msg='YouTube oynatıcısı yavaş yükleniyor, bekleniyor…';mui()},9000);
box.replaceChildren(h('div',{id:'ymp'}));withYT(()=>{YM=new YT.Player('ymp',{videoId:id,width:'100%',height:'100%',playerVars:{playsinline:1,rel:0,modestbranding:1,origin:location.origin},
events:{onReady:()=>{clearTimeout(slow);YMr=1;YMid=id;if(String(MU.msg).indexOf('yavaş')>=0)MU.msg='';mui();ok()},onStateChange:mytState,onError:ytErr}})})});return YMP}
function ytErr(){if(MS&&MS.tr&&MS.tr.ids&&MS.tr.ids.au){AD.au.sync(MS.tr.ids.au,MS.playing,0,true).catch(()=>{});MU.msg='YouTube bu videoyu gömmeye izin vermiyor; 30 sn önizleme çalınıyor.'}else MU.msg='YouTube bu videoyu gömmeye izin vermiyor. Başka bir sürümünü seç.';mui()}
// Videonun kendi ▶/❚❚ düğmesi: herkese iletilir
function mytState(e){const d=e.data,prev=MU.lastPS;MU.lastPS=d;
if(d==1&&MU.need){MU.need=0;mui()}
if(d==0&&MS&&MS.playing&&MU.prov=='yt'){send({t:'mend',rev:MS.rev});return}
const mine=Date.now()-(MU.selfT||0)<2500||document.visibilityState!='visible';
if(mine||!MS||!MS.tr||MU.prov!='yt'||!canUse('music')||!YM||!YMr)return;
let p=0;try{p=YM.getCurrentTime()||0}catch(x){}
if(d==2&&prev==1&&MS.playing){MU.optT=Date.now();MU.optP=false;send({t:'mpause',pos:p});toast('Müzik herkes için durduruldu')}
else if(d==1&&!MS.playing){MU.optT=Date.now();MU.optP=true;send({t:'mplay',pos:p});toast('Müzik herkes için başlatıldı')}}
const AD={
yt:{async sync(id,pl,pos){const box=MUI.yt;if(box)box.style.display='block';await ytReady(id,box);if(!YM||!YMr)return;
if(YMid!=id){YMid=id;ymc(()=>YM.loadVideoById({videoId:id,startSeconds:pos}))}else if(Math.abs((YM.getCurrentTime()||0)-pos)>1.8)ymc(()=>YM.seekTo(pos,true));
if(pl)ymc(()=>YM.playVideo());else ymc(()=>YM.pauseVideo())}},
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
MUI.res.replaceChildren(...(L.length?L.map(t=>h('div',{class:'mu-rw'},h('button',{type:'button',class:'mu-r',onclick:()=>pickTrack(t)},t.art?h('img',{src:t.art,alt:''}):h('span',{class:'mu-art',text:'🎵',style:'width:40px;height:40px;font-size:1.1rem'}),h('div',{},h('b',{text:t.title}),h('small',{text:t.artist+(t.dur?' · '+fmt(t.dur):'')}))),h('button',{type:'button',class:'btn sec sm','aria-label':'Sıraya ekle',onclick:()=>mqAdd(t)},'＋ Sıra'))):[h('small',{class:'mu',text:'Sonuç bulunamadı'})]))}catch(e){MUI.res.replaceChildren();toast(String((e&&e.message)||e),1)}}
function setProv(p){if(MU.prov==p)return;mpauseAll();if(MUI.yt&&p!='yt')MUI.yt.style.display='none';MU.prov=p;localStorage.mp=p;MU.loaded='';MU.rev=-1;MU.msg='';MU.need=0;
loadCfg().then(()=>p=='am'?amInit().catch(e=>{MU.msg=String((e&&e.message)||e)}):0).then(()=>{mui();if(MS&&MS.tr)mapply()});mui()}
function musicCard(){
try{if(YM&&YM.destroy)YM.destroy()}catch(e){}YM=null;YMr=0;YMid='';YMP=null;MU.loaded='';MU.rev=-1;MU.sk=null;
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
msg=h('small',{class:'err'}),need=h('button',{type:'button',class:'btn full',style:'display:none',onclick:()=>mjoin()},'▶ Dinlemeye katıl'),hint=h('div',{class:'mu-hint',style:'display:none'}),ls=h('div',{class:'mu-ls'}),yt=h('div',{class:'mu-yt'}),mqb=h('div',{class:'mq'});
q.onkeydown=e=>{if(e.key=='Enter'){e.preventDefault();msearch()}};
const root=h('div',{class:'card',id:'mp'},h('div',{class:'row'},ic('music',18),h('h3',{text:'Birlikte müzik'})),
h('small',{text:'Hesap bağlamadan doğrudan şarkı arayıp tam senkron dinleyebilirsiniz. İsterseniz Spotify veya Apple Music de seçebilirsiniz.'}),
h('div',{class:'lbl',text:'Dinleme modu'}),chips,st,cb,
h('div',{class:'row'},q,h('button',{type:'button',class:'btn sq','aria-label':'Ara',onclick:msearch},ic('eye',18))),res,
h('div',{class:'mu-now'},art,h('div',{class:'grow'},tt,ar,tm)),ls,rg,h('div',{class:'row'},b1,bp,b2),mqb,msg,need,hint,yt);
MUI={root,chips,st,cb,q,res,art,tt,ar,tm,bp,rg,msg,need,hint,ls,yt,mq:mqb,lastArt:null,lastP:null};setTimeout(mqRender,0);mui();return root}
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
function mjoin(){MU.need=0;MU.fail=0;try{if(MA&&MU.prov=='au')MA.play()}catch(e){}if(YM&&YMr&&MU.prov=='yt')ymc(()=>{YM.unMute();YM.playVideo()});if(MS&&MS.tr)mapply();mui();if(MUI.yt)MUI.yt.scrollIntoView({block:'center',behavior:'smooth'})}
// Oynatıcının gerçek durumu -> sunucuya bildir (yalnız değişince)
function mrep(){let s='off';try{if(MS&&MS.tr&&canUse('music')){if(!MS.playing)s='pause';else if(MU.prov=='yt'&&YM&&YMr&&YM.getPlayerState){const p=YM.getPlayerState();s=p==1?'ok':MU.need?'need':'buf'}else if(MU.prov=='au'&&MA)s=!MA.paused?'ok':MU.need?'need':'buf';else s=MU.on?'ok':MU.need?'need':'buf'}}catch(e){}
if(s!==MU.rs){MU.rs=s;send({t:'mst',s})}}
function mtick(){if(!MUI.root||!MS||!MS.tr)return;const p=mexp(),d=MS.tr.dur||0;MUI.tm.textContent=fmt(p)+(d?' / '+fmt(d):'');
if(d){MUI.rg.style.display='';if(document.activeElement!==MUI.rg){MUI.rg.max=d;MUI.rg.value=Math.min(p,d)}if(MS.playing&&p>d+1&&!MU.endSent){MU.endSent=1;send({t:'mend',rev:MS.rev})}}
if(!MS.playing||!canUse('music'))return;
try{if(MU.prov=='au'&&MA&&!MA.paused&&p<29&&Math.abs(MA.currentTime-p)>2)MA.currentTime=p;else if(MU.prov=='am'&&AM&&AM.isPlaying&&Math.abs((AM.currentPlaybackTime||0)-p)>2.5)AM.seekToTime(p)}catch(e){}}

// ---------- kelimelik ----------
const WAL='ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
const WLV={A:1,B:3,C:4,Ç:4,D:3,E:1,F:7,G:5,Ğ:8,H:5,I:2,İ:1,J:10,K:1,L:1,M:2,N:1,O:2,Ö:7,P:5,R:1,S:2,Ş:4,T:1,U:2,Ü:3,V:7,Y:3,Z:4,'*':0};
const WPRE=(()=>{const a=Array(225).fill('.'),M=(t,L)=>L.forEach(([r,c])=>{for(const [x,y] of [[r,c],[r,14-c],[14-r,c],[14-r,14-c]])a[x*15+y]=t});
M('1',[[0,3],[3,0],[2,6],[6,2],[6,6],[7,3],[3,7]]);M('2',[[1,5],[5,1],[5,5]]);M('3',[[1,1],[2,2],[3,3],[4,4],[7,7]]);M('4',[[0,0],[0,7],[7,0]]);return a})();
const WPL={'1':'H2','2':'H3','3':'K2','4':'K3'};
const myTurn=()=>!!(WG&&!WG.over&&WG.pl[WG.tn]==ME.name);
const wOut=n=>!!(WG&&WG.out&&WG.out.includes(n));
function wordCard(){
WU={};PSL='';WPO=null;const cells=[];
const wb=h('div',{class:'wb'});
for(let i=0;i<225;i++){const c=h('div',{class:'wc',role:'button',tabindex:i==112?'0':'-1','aria-label':'Satır '+((i/15|0)+1)+', sütun '+(i%15+1),onclick:()=>wcell(i),onkeydown:e=>wkey(e,i),onpointerdown:e=>{if(WP.has(i))dgStart(e,WP.get(i).ri,i)}});cells.push(c);wb.append(c)}
const sc=h('div',{class:'wsc'}),stx=h('div',{class:'lbl',style:'margin:0;font-size:.85rem'}),rk=h('div',{class:'rk'}),prv=h('div',{class:'wprv'}),bun=h('button',{type:'button',class:'btn sec sm',onclick:()=>wunseen()},'Kalan harfler'),last=h('div',{class:'stack',style:'gap:6px'}),log=h('div',{class:'wlog'});
const bt=(t,fn,cls)=>h('button',{type:'button',class:'btn sm '+(cls||'sec'),onclick:fn},t);
const bplay=bt('Oyna',()=>wplay(),''),brec=bt('Harfleri geri al',()=>{WP=new Map();WS=-1;wgRender()}),bshuf=bt('Karıştır',()=>{if(!WG||!WG.rk)return;const n=WG.rk.length,o=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.random()*(i+1)|0;[o[i],o[j]]=[o[j],o[i]]}const inv={};o.forEach((x,k)=>inv[x]=k);WG.rk=o.map(x=>WG.rk[x]);for(const v of WP.values())v.ri=inv[v.ri];if(WS>=0)WS=inv[WS];wgRender()});
const bpass=bt('Pas',()=>{if(confirm('Bu turu pas geçmek istiyor musun?'))send({t:'wpass'})}),bex=bt('Harf değiştir',()=>wex()),bres=bt('Teslim ol',()=>{const many=WG&&WG.pl.length-(WG.out||[]).length>2;if(confirm(many?'Oyundan çekilmek istiyor musun? Diğerleri oynamaya devam eder.':'Oyunu teslim etmek istiyor musun?'))send({t:'wres'})},'dng');
const bnew=h('button',{type:'button',class:'btn full',onclick:()=>send({t:'wnew'})},'Yeni oyun başlat');
const acts=h('div',{class:'stack',style:'gap:8px'},h('div',{class:'row wrap'},bplay,brec,bshuf),h('div',{class:'row wrap'},bpass,bex,bres));
const root=h('div',{class:'card',id:'wp'},h('div',{class:'row'},ic('word',18),h('h3',{text:'Kelimelik'})),sc,h('div',{class:'row',style:'justify-content:space-between;align-items:center;gap:8px'},stx,bun),wb,rk,prv,acts,bnew,last,log,
h('small',{text:'Harfi parmağınla veya fareyle sürükleyip boş bir kareye bırak; ya da harfe dokun, sonra karaya dokun. Yerleştirdiğin harfe dokunursan ya da tahta dışına sürüklersen geri döner. Yıldızlı taş (joker) istediğin harf olabilir. Kelimeler önce yerleşik Türkçe sözlükte (çekimli biçimler dahil) denetlenir. Sözlükte bulunamayan bir kelime olursa rakiplerine “Kabul ediyor musun?” diye sorulur (ilk yanıt geçerli): kabul ederse hamle işlenir, etmezse hamle iptal olur ve harfler sende kalır.'}));
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
modal('Kalan harfler ('+tot+')',h('div',{class:'stack',style:'gap:10px'},h('small',{class:'mu',text:g.rk?(g.pl.length>2?'Torbadaki ve rakiplerinin elindeki harfler (senin elindekiler hariç). '+g.pl.filter(x=>x!=ME.name&&!wOut(x)).map(x=>x+': '+(g.rkN[x]||0)+' harf').join(', ')+'; torbada '+g.bagN+' harf var.':'Torbadaki ve rakibinin elindeki harfler (senin elindekiler hariç). Rakibinde '+(g.rkN[g.pl.find(x=>x!=ME.name)]||0)+' harf, torbada '+g.bagN+' harf var.'):'Torbadaki ve oyuncuların elindeki harfler.'}),
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
if(!g){U.sc.replaceChildren();U.stx.textContent='Henüz oyun yok. Odada 2–4 kişi varken “Yeni oyun başlat”a bas; odadaki herkes oyuna katılır.';U.last.replaceChildren();U.log.replaceChildren();return}
U.sc.replaceChildren(...g.pl.map((n,i)=>h('div',{class:'wpl'+(!g.over&&g.tn==i?' on':'')+(wOut(n)?' out':'')+(g.over&&g.win==n?' win':'')},h('small',{text:n+(n==ME.name?' (sen)':'')+(wOut(n)?' · çekildi':'')}),h('b',{text:g.sc[n]}))));
U.stx.textContent=g.over?(g.win=='='?'Oyun bitti: berabere':g.win?'Oyun bitti. Kazanan: '+g.win:'Oyun bitti'):(myTurn()?'Sıra sende':g.pl[g.tn]+' oynuyor')+' · torbada '+g.bagN+' harf'+(g.rk&&!wOut(ME.name)?'':wOut(ME.name)?' · oyundan çekildin, izliyorsun':' · izleyicisin')+(!g.over&&g.ps>=Math.ceil((g.psMax||6)/2)?' · art arda '+g.ps+' puansız tur ('+(g.psMax||6)+' olunca oyun biter)':'');
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
function wqSet(m){wbusy(0);if(m.id===null||!WG||WG.over||WG.pl.indexOf(ME.name)<0||wOut(ME.name)){const was=WQ;WQ=null;wqGone();if(was&&WU.root)wgRender();return}
const same=WQ&&WQ.mv===m.mv&&WQ.by===m.by&&WQ.words.join()===m.words.join();WQ={id:m.id||(same?WQ.id:''),by:m.by,mv:m.mv,words:m.words,end:Date.now()+m.left,done:same?WQ.done:0};
if(WQ.by!==ME.name&&WQ.id&&!WQ.done){const o=document.getElementById('wqm');if(!o||o.dataset.id!==WQ.id){if(o)o.remove();
const t=h('div',{class:'mu',id:'wqt'}),mo=modal(WQ.by+' bir kelime oynadı',h('div',{class:'stack',style:'gap:8px'},h('div',{text:'“'+WQ.words.join(', ')+'” kelimesi sözlükte bulunamadı. Kabul ediyor musun?'}),m.n>1?h('small',{class:'mu',text:'Diğer oyunculara da soruldu; ilk verilen yanıt geçerli olur.'}):null,t),[h('button',{type:'button',class:'btn dng',onclick:()=>wqAns(false)},'Reddet'),h('button',{type:'button',class:'btn',onclick:()=>wqAns(true)},'Kabul et')]);mo.id='wqm';mo.dataset.id=WQ.id}}
else if(WQ.done||WQ.by===ME.name){const o=document.getElementById('wqm');if(o)o.remove()}
clearInterval(WQT);WQT=setInterval(wqTick,500);wqTick()}
function wqTick(){if(!WQ){clearInterval(WQT);WQT=0;return}const s=Math.max(0,Math.ceil((WQ.end-Date.now())/1000));
const t=document.getElementById('wqt');if(t)t.textContent='Kalan süre: '+s+' sn';
if(WQ.by===ME.name&&WU.stx)WU.stx.textContent=(WG&&WG.pl.length>2?'Rakiplerin onayı':'Rakibin onayı')+' bekleniyor: “'+WQ.words.join(', ')+'” sözlükte bulunamadı ('+s+' sn)'}
function wqAns(ok){if(!WQ||!WQ.id)return;WQ.done=1;send({t:'wans',id:WQ.id,ok:!!ok});const o=document.getElementById('wqm');if(o)o.remove()}
function wrej(m){wbusy(0);WQ=null;wqGone();WP=new Map();WS=-1;PSL='';toast(m.e,1);wgRender()}

// ---------- başlat ----------
{const qs=new URLSearchParams(location.search),oc=qs.get('code'),os=qs.get('state')||'';
if(qs.get('oda')){PEND=cleanCode(qs.get('oda'));PM=0}if(qs.get('ekle'))history.replaceState(null,'',location.pathname);if(/^m/.test(os)&&(oc||qs.get('error'))){history.replaceState(null,'',location.pathname);const rr=cleanCode(os.slice(1));if(rr){PEND=rr;PM=0;AUTO=1}if(oc)SPC=oc;else setTimeout(()=>toast('Spotify bağlantısı iptal edildi',1),500)}}
if(PEND)history.replaceState(null,'',location.pathname);
if(T&&ME)enter();else viewLogin();
`;
const HTML = '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#101521"><meta name="color-scheme" content="dark"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Bizim Sinema"><link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/icon-180.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Unbounded:wght@500;600&display=swap"><title>Bizim Sinema</title><link rel="icon" href="/icon-192.png"><style>' + CSS + '</style></head><body><div id="app"></div><div id="tt"></div><script>' + JS + '</script></body></html>';
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.youtube.com https://s.ytimg.com https://js-cdn.music.apple.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https: http:; media-src * data: blob:; connect-src * wss: ws: data: blob:; frame-src https://www.youtube.com https://www.youtube-nocookie.com https://*.apple.com; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";
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


// ---------- Uygulama (PWA) dosyaları ----------
const ICONS = { 180: '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', 192: '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', 512: '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' };
const MANIFEST = JSON.stringify({ name: 'Bizim Sinema', short_name: 'Bizim Sinema', description: 'Birlikte film, müzik, yapboz ve oyunlar', lang: 'tr', start_url: '/', scope: '/', display: 'standalone', orientation: 'portrait', background_color: '#101521', theme_color: '#101521', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }] });
const SW = String.raw`self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data?e.data.text():''}}
e.waitUntil(self.registration.showNotification(d.title||'Bizim Sinema',{body:d.body||'',tag:d.tag||'bs',renotify:true,icon:'/icon-192.png',badge:'/icon-192.png',data:{url:d.url||'/'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=new URL((e.notification.data&&e.notification.data.url)||'/',self.location.origin).href;
e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if('focus' in c&&'navigate' in c)return c.focus().then(w=>(w||c).navigate(url)).catch(()=>self.clients.openWindow(url))}return self.clients.openWindow(url)}))});`;
function pwaAsset(p) {
  if (p == '/manifest.webmanifest') return new Response(MANIFEST, { headers: { 'content-type': 'application/manifest+json', 'cache-control': 'public, max-age=3600' } });
  if (p == '/sw.js') return new Response(SW, { headers: { 'content-type': 'application/javascript; charset=utf-8', 'cache-control': 'no-cache' } });
  const m = p.match(/^\/icon-(180|192|512)\.png$/); if (m) return new Response(Uint8Array.from(atob(ICONS[m[1]]), c => c.charCodeAt(0)), { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=604800' } });
  return null;
}

// ---------- Web Push: VAPID (RFC 8292) + şifreleme (RFC 8291, aes128gcm); harici kütüphane ve servis yok ----------
const pB64e = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const pB64d = s => { s = String(s || '').replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), c => c.charCodeAt(0)) };
const pCat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of a) { o.set(x, i); i += x.length } return o };
const pTxt = s => new TextEncoder().encode(s);
// Yalnız bilinen tarayıcı bildirim servislerine istek atılır (sunucunun başka adreslere istek atması engellenir)
const PUSH_HOST = /^https:\/\/([a-z0-9-]+\.)*(fcm\.googleapis\.com|android\.googleapis\.com|push\.services\.mozilla\.com|push\.apple\.com|notify\.windows\.com)(:443)?\//i;
function pushSubOk(s) {
  try { const p = pB64d(s.keys.p256dh), a = pB64d(s.keys.auth); return typeof s.endpoint == 'string' && s.endpoint.length < 1000 && PUSH_HOST.test(s.endpoint) && p.length == 65 && p[0] == 4 && a.length == 16 } catch (e) { return false }
}
let VAPID = null;
async function vapid(env) { if (VAPID) return VAPID; const v = await (await dbf(env, '/vapid')).json(); VAPID = { pub: v.pub, key: await crypto.subtle.importKey('jwk', v.jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']) }; return VAPID }
async function vapidAuth(env, endpoint, origin) {
  const v = await vapid(env), aud = new URL(endpoint).origin;
  const head = pB64e(pTxt(JSON.stringify({ typ: 'JWT', alg: 'ES256' }))), body = pB64e(pTxt(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: origin && /^https:/.test(origin) ? origin : 'mailto:bildirim@bizimsinema.app' })));
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, v.key, pTxt(head + '.' + body));
  return 'vapid t=' + head + '.' + body + '.' + pB64e(sig) + ', k=' + v.pub;
}
async function pushEncrypt(sub, text) {
  const ua = pB64d(sub.keys.p256dh), auth = pB64d(sub.keys.auth);
  const eph = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', eph.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', ua, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, eph.privateKey, 256));
  const hkdf = async (salt, ikm, info, len) => new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']), len * 8));
  const ikm = await hkdf(auth, ecdh, pCat(pTxt('WebPush: info\0'), ua, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, pTxt('Content-Encoding: aes128gcm\0'), 16), nonce = await hkdf(salt, ikm, pTxt('Content-Encoding: nonce\0'), 12);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']), pCat(pTxt(text), new Uint8Array([2]))));
  const hdr = new Uint8Array(21); hdr.set(salt, 0); new DataView(hdr.buffer).setUint32(16, 4096); hdr[20] = 65;
  return pCat(hdr, asPub, ct);
}
// Döner: 'ok' | 'gone' (abonelik geçersiz, silinmeli) | 'err'
async function pushSend(env, sub, msg, origin) {
  if (!pushSubOk(sub)) return 'gone';
  try {
    const r = await fetch(sub.endpoint, { method: 'POST', headers: { authorization: await vapidAuth(env, sub.endpoint, origin), 'content-encoding': 'aes128gcm', 'content-type': 'application/octet-stream', ttl: '86400', urgency: 'high' }, body: await pushEncrypt(sub, JSON.stringify(msg)), signal: AbortSignal.timeout(8000) });
    return r.status == 404 || r.status == 410 ? 'gone' : r.ok ? 'ok' : 'err';
  } catch (e) { return 'err' }
}
const PRL = new Map(); // davet hız sınırı (bellekte)
async function pushTo(env, names, msg, origin) {
  const subs = await (await dbf(env, '/pget', { names })).json(), res = {};
  await Promise.all(names.map(async n => {
    const L = subs[n] || []; let ok = 0;
    await Promise.all(L.map(async s => { const r = await pushSend(env, s, msg, origin); if (r == 'ok') ok++; else if (r == 'gone') await dbf(env, '/punsub', { name: n, endpoint: s.endpoint }) }));
    res[n] = L.length ? (ok ? 'ok' : 'err') : 'none';
  }));
  return res;
}


// ---------- Kelime Düellosu (Wordle tarzı yarış) ----------
const DWORDS = 'acele adres ahşap akıcı akşam alkış altın alçak ambar anlam anons antik araba arama arazi armut aroma arıza asker aslan avize aydın ayran ayrım aşama aşure bacak badem bahar bahçe bakım bakır balta balık banka banyo barış basit basın bavul bayan bayat başka bebek bekçi belge benek beyaz beyin biber bilet bilgi bilim bitki bomba borsa boyun boyut bozuk boğaz bronz bucak bugün bulut burun buzul böcek bölge börek bütün büyük bıyık bıçak cadde cahil camlı canlı cazip ceket cesur cevap ceviz cisim ciğer coşku cumba cümle dahil daire dalga damar damla davet davul dekor demet demir deney deniz dergi derin derya devam devre deyim değer değil dikiş dilek dilim direk dolap dolar dolma donuk doğal doğru doğum dudak duman durak durum duvar duygu dümen dünya düzen düğme düğüm düğün düşük ekmek ekran eksik elbet elmas emlak emsal enfes engel enkaz erkek erken esnaf esnek etken etkin evlat evrak evren eylem ezber eşarp eşkal fakir fayda fener fidan fikir filiz final firma fiyat fizik fular fırça fırın gamze garaj gazel gazoz gelin genel geniş geyik gidon giriş gitar gölge gönül görev görüş gövde gözlü gübre gülüş gümüş güneş güven güzel güçlü hafif hafta hakem hakim halat halka hamak hamur hapis harap hasat hasta hatır havlu havuz havuç hayal hayat hayır hazne hazır hedef helva hesap heves hilal hisse horoz hukuk hurma huzur hücre hızlı ifade ihlal ikili ilham imkan inanç incir insan irade isyan itaat işlem jeton jilet kabak kablo kabuk kadeh kader kadın kafes kahve kalem kalın kalıp kamış kanal kanat kanun kapak kapan karar karga kargo karın kasap kaset kasım katır kavak kavga kavun kayık kayın kayıt kazak kazan kaşık kebap kekik keman kemer kemik kenar kepçe keten keşif kiler kilim kilit kimse kiraz kirli kitap koala kolay kolon kolye komşu konak konuk konum kopya korku kovan koyun koçan kredi krema kukla kulak kulüp kumaş kumru kupon kural kutup kuzen kuzey köfte kömür köpek köprü körük külah kürek kütük küçük kılıç kırık kısım kıyas kıyma kızak lamba leğen liman limon lisan liste lokum lüfer maden makam makas mango mantı marka marul masal masum mayıs mekan melek melez merak mesaj metin metro meyve mezar mezun mimar misal mizah model modem moral motor mucit mutlu mühür müzik mısır nadir nakil namus narin nasıl nazar nefes nehir nemli nesil nimet nisan nişan nohut nokta nüfus oktav olgun omlet orman ortak otlak paket palto pamuk panda panik parti parça pasta patik pazar pelüş pembe pençe perde peron pilav pilot plaka polen polis posta poşet prens pudra radar radyo rakam rakip ralli rampa rapor refah resim reçel roket rozet sabah sabun sabır sahne sakal sakin salep salon salça sanat saray sargı satır satış savaş sayfa saygı sebep sebze sefer seher sehpa sekiz selam sepet sergi serin serçe sesli sevgi silgi simit sinek sirke siyah sokak somun sonuç sorun sosis soyut soğan soğuk sucuk sulak sözcü söğüt süngü sürat sürgü sütun sıcak sıfır sınav sınıf sınır sırma tabak tabur tahta takas taksi takım talep tamir tanık tarak tarif tarih tarla tasma tatil tatlı tavan tavuk tavus tekne telaş temiz teras terzi testi teyze tilki tohum topuk torba torun tozlu tulum turna turşu tutku tuval tuzlu tuğla tünel türkü tütün uygun uzman uğraş vagon vakit vakıf valiz vapur varış vatan vergi villa viraj vites vişne yakın yakıt yalan yamaç yanak yapım yarış yatak yavaş yavru yayla yazar yazın yağlı yağış yaşam yaşlı yedek yemek yetki yeşil yokuş yolcu yosun yudum yunus yüzme yüzük yılan zafer zaman zarar zarif zebra zemin zirve zurna çadır çakıl çalgı çamur çanak çanta çarşı çatal çağrı çekiç çelik çevik çevre çeşme çilek çimen çizgi çizim çiçek çoban çocuk çorap çorba çubuk çukur çökme çözüm ödeme öksüz ölçek ölçüm önlem ördek örnek özgür özlem öğlen ücret ünite ünlem ürkek üstün üzgün ılgın ılıca ırmak ıslak ısrar şahin şahıs şakak şapka şarkı şehir şeker şeref şerit şimdi şoför şubat şükür'.split(' ');
const DMAX = 6;
function dScore(g, s) { const G = [...g], S = [...s], r = [0, 0, 0, 0, 0], left = {}; for (let i = 0; i < 5; i++) { if (G[i] === S[i]) r[i] = 2; else left[S[i]] = (left[S[i]] || 0) + 1 } for (let i = 0; i < 5; i++) if (r[i] !== 2 && left[G[i]] > 0) { r[i] = 1; left[G[i]]-- } return r }
const dSolved = rows => rows.some(x => x.r.every(v => v === 2));
const dDone = (d, p) => { const rows = d.g[p] || []; return rows.length >= DMAX || dSolved(rows) };
function dView(d, n) {
  if (!d) return null;
  return { id: d.id, pool: d.pool || 'common', mx: DMAX, over: d.over, win: d.win, sec: d.over ? d.sec : '', sc: d.sc, by: d.by,
    pl: d.pl.map(p => ({ n: p, done: dDone(d, p) ? 1 : 0, rows: (d.g[p] || []).map(x => p === n ? { w: x.w, r: x.r } : { r: x.r }) })) };
}
// ---------- Amiral Battı ----------
const BFLEET = [5, 4, 3, 3, 2], BN = ['Uçak gemisi', 'Muharebe gemisi', 'Kruvazör', 'Denizaltı', 'Muhrip'];
function bCells(st, v, len) { const r = st / 10 | 0, c = st % 10, out = []; for (let k = 0; k < len; k++) { const rr = r + (v ? k : 0), cc = c + (v ? 0 : k); if (rr > 9 || cc > 9) return null; out.push(rr * 10 + cc) } return out }
function bLayout(L) {
  if (!Array.isArray(L) || L.length !== BFLEET.length) return null; const used = new Set(), ships = [];
  for (let k = 0; k < BFLEET.length; k++) { const x = L[k] || {}, st = x.i | 0, cells = st >= 0 && st < 100 ? bCells(st, x.v ? 1 : 0, BFLEET[k]) : null; if (!cells) return null;
    for (const c of cells) { if (used.has(c)) return null; used.add(c) } ships.push({ k, i: st, v: x.v ? 1 : 0, cells }) }
  return ships;
}
function bView(b, n) {
  if (!b) return null; const me = b.pl.indexOf(n), opp = me >= 0 ? b.pl[1 - me] : null;
  const shotsOn = p => { const sh = b.shots[b.pl[1 - b.pl.indexOf(p)]] || [], sh2 = b.ships[p] || []; return sh.map(i => ({ i, h: sh2.some(s => s.cells.includes(i)) ? 1 : 0 })) };
  const sunk = p => (b.ships[p] || []).filter(s => s.cells.every(c => (b.shots[b.pl[1 - b.pl.indexOf(p)]] || []).includes(c))).map(s => ({ k: s.k, cells: s.cells }));
  const v = { id: b.id, pl: b.pl, ph: b.ph, wait: b.ph == 'wait' ? 1 : 0, tn: b.tn, win: b.win, sc: b.sc, ready: b.pl.map(p => b.ready[p] ? 1 : 0), me, log: b.log.slice(-6) };
  if (me >= 0 && b.ph != 'wait') { v.my = b.ships[n] || null; v.onMe = shotsOn(n); v.onOp = opp ? shotsOn(opp) : []; v.opSunk = opp ? sunk(opp) : []; v.mySunk = sunk(n).map(s => s.k);
    if (b.ph == 'over' && opp) v.opShips = b.ships[opp] || [] }
  else if (me < 0) { v.boards = b.pl.map(p => ({ n: p, shots: shotsOn(p), sunk: sunk(p) })) }
  return v;
}

// WebSocket'in engellendiği ağlar için sanal soket: mesajlar kuyrukta bekler, istemci HTTPS ile çeker
class VSock {
  constructor(sid) { this.vs = 1; this.sid = sid; this.readyState = 1; this.att = null; this.q = []; this.w = null; this.last = Date.now(); this.cl = null }
  send(d) { if (this.readyState !== 1) throw new Error('kapalı'); this.q.push(String(d)); if (this.q.length > 1000) this.q.splice(0, this.q.length - 1000); this.wake() }
  close(c, r) { if (this.readyState === 3) return; this.readyState = 3; this.cl = [c || 1000, r || '']; this.wake() }
  wake() { const w = this.w; if (w) { this.w = null; w() } }
  serializeAttachment(a) { this.att = JSON.parse(JSON.stringify(a)) }
  deserializeAttachment() { return this.att == null ? null : JSON.parse(JSON.stringify(this.att)) }
}
const ROOM_CAP = { 1: 6, 2: 2, 3: 4 };
const GNAME = { word: 'Kelimelik', duel: 'Kelime Düellosu', bs: 'Amiral Battı', chess: 'Satranç' };

// ---------- Satranç kural motoru (sunucu tarafı doğrulama) ----------
// Kare: 0 = a8 ... 7 = h8, 56 = a1 ... 63 = h1. Taş: 'wP','bK' ... ya da ''.
const CFILES = 'abcdefgh';
const csq = i => CFILES[i % 8] + (8 - (i / 8 | 0));
function chNew() {
  const back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'], b = Array(64).fill('');
  for (let c = 0; c < 8; c++) { b[c] = 'b' + back[c]; b[8 + c] = 'bP'; b[48 + c] = 'wP'; b[56 + c] = 'w' + back[c] }
  return { b, turn: 'w', cas: 'KQkq', ep: -1, half: 0, full: 1 };
}
const CN = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]], CK = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const CBD = [[-1, -1], [-1, 1], [1, -1], [1, 1]], CRD = [[-1, 0], [1, 0], [0, -1], [0, 1]];
function chAttacked(b, sq, by) {
  const r = sq / 8 | 0, c = sq % 8, at = (rr, cc) => rr >= 0 && rr < 8 && cc >= 0 && cc < 8 ? b[rr * 8 + cc] : null;
  const pr = by == 'w' ? r + 1 : r - 1; if (at(pr, c - 1) === by + 'P' || at(pr, c + 1) === by + 'P') return true;
  for (const [dr, dc] of CN) if (at(r + dr, c + dc) === by + 'N') return true;
  for (const [dr, dc] of CK) if (at(r + dr, c + dc) === by + 'K') return true;
  for (const [dirs, ps] of [[CBD, 'BQ'], [CRD, 'RQ']]) for (const [dr, dc] of dirs) {
    let rr = r + dr, cc = c + dc; while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) { const p = b[rr * 8 + cc]; if (p) { if (p[0] === by && ps.includes(p[1])) return true; break } rr += dr; cc += dc }
  }
  return false;
}
const chKing = (b, col) => b.indexOf(col + 'K');
function chPseudo(s) {
  const b = s.b, me = s.turn, op = me == 'w' ? 'b' : 'w', out = [], add = (f, t, x) => out.push(x ? { f, t, ...x } : { f, t });
  for (let f = 0; f < 64; f++) {
    const p = b[f]; if (!p || p[0] !== me) continue; const r = f / 8 | 0, c = f % 8, k = p[1];
    if (k == 'P') {
      const d = me == 'w' ? -1 : 1, r1 = r + d, start = me == 'w' ? 6 : 1, last = me == 'w' ? 0 : 7;
      const push = (t, x) => { if ((t / 8 | 0) === last) for (const q of 'QRBN') add(f, t, { ...x, p: q }); else add(f, t, x) };
      if (r1 >= 0 && r1 < 8 && !b[r1 * 8 + c]) { push(r1 * 8 + c); if (r == start && !b[(r + 2 * d) * 8 + c]) add(f, (r + 2 * d) * 8 + c, { dbl: 1 }) }
      for (const dc of [-1, 1]) { const cc = c + dc; if (cc < 0 || cc > 7 || r1 < 0 || r1 > 7) continue; const t = r1 * 8 + cc;
        if (b[t] && b[t][0] === op) push(t); else if (t === s.ep) add(f, t, { ep: 1 }) }
    } else if (k == 'N' || k == 'K') {
      for (const [dr, dc] of k == 'N' ? CN : CK) { const rr = r + dr, cc = c + dc; if (rr < 0 || rr > 7 || cc < 0 || cc > 7) continue; const t = rr * 8 + cc; if (!b[t] || b[t][0] === op) add(f, t) }
      if (k == 'K') {
        const home = me == 'w' ? 60 : 4, KS = me == 'w' ? 'K' : 'k', QS = me == 'w' ? 'Q' : 'q';
        if (f === home && !chAttacked(b, f, op)) {
          if (s.cas.includes(KS) && b[f + 3] === me + 'R' && !b[f + 1] && !b[f + 2] && !chAttacked(b, f + 1, op) && !chAttacked(b, f + 2, op)) add(f, f + 2, { cs: 1 });
          if (s.cas.includes(QS) && b[f - 4] === me + 'R' && !b[f - 1] && !b[f - 2] && !b[f - 3] && !chAttacked(b, f - 1, op) && !chAttacked(b, f - 2, op)) add(f, f - 2, { cs: 1 });
        }
      }
    } else {
      const dirs = k == 'B' ? CBD : k == 'R' ? CRD : CBD.concat(CRD);
      for (const [dr, dc] of dirs) { let rr = r + dr, cc = c + dc; while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) { const t = rr * 8 + cc; if (b[t]) { if (b[t][0] === op) add(f, t); break } add(f, t); rr += dr; cc += dc } }
    }
  }
  return out;
}
function chApply(s, m) {
  const b = s.b.slice(), me = s.turn, p = b[m.f], cap = m.ep ? b[m.t + (me == 'w' ? 8 : -8)] : b[m.t];
  b[m.t] = m.p ? me + m.p : p; b[m.f] = '';
  if (m.ep) b[m.t + (me == 'w' ? 8 : -8)] = '';
  if (m.cs) { if (m.t > m.f) { b[m.f + 1] = b[m.f + 3]; b[m.f + 3] = '' } else { b[m.f - 1] = b[m.f - 4]; b[m.f - 4] = '' } }
  let cas = s.cas; const strip = x => { cas = cas.replace(x, '') };
  if (p[1] == 'K') { if (me == 'w') { strip('K'); strip('Q') } else { strip('k'); strip('q') } }
  for (const sq of [m.f, m.t]) { if (sq === 63) strip('K'); if (sq === 56) strip('Q'); if (sq === 7) strip('k'); if (sq === 0) strip('q') }
  return { b, turn: me == 'w' ? 'b' : 'w', cas, ep: m.dbl ? (m.f + m.t) / 2 : -1, half: p[1] == 'P' || cap ? 0 : s.half + 1, full: s.full + (me == 'b' ? 1 : 0), cap: cap || '' };
}
function chLegal(s) { const me = s.turn, op = me == 'w' ? 'b' : 'w'; return chPseudo(s).filter(m => { const n = chApply(s, m); return !chAttacked(n.b, chKing(n.b, me), op) }) }
const chInCheck = s => chAttacked(s.b, chKing(s.b, s.turn), s.turn == 'w' ? 'b' : 'w');
const chKey = s => s.b.map(p => p || '.').join('') + s.turn + s.cas + s.ep;
function chInsufficient(b) {
  const ps = b.filter(p => p && p[1] !== 'K'); if (!ps.length) return true;
  if (ps.length === 1 && (ps[0][1] === 'B' || ps[0][1] === 'N')) return true;
  if (ps.every(p => p[1] === 'B')) { const col = i => ((i / 8 | 0) + i % 8) % 2, sq = b.map((p, i) => p && p[1] === 'B' ? col(i) : -1).filter(x => x >= 0); return sq.every(x => x === sq[0]) }
  return false;
}
const CSYM = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘' };
function chSan(s, m, legal) {
  const p = s.b[m.f], k = p[1]; let san;
  if (m.cs) san = m.t > m.f ? 'O-O' : 'O-O-O';
  else {
    const cap = !!s.b[m.t] || m.ep;
    if (k == 'P') san = (cap ? CFILES[m.f % 8] + 'x' : '') + csq(m.t) + (m.p ? '=' + CSYM[m.p] : '');
    else {
      const amb = legal.filter(o => o.t === m.t && o.f !== m.f && s.b[o.f] === p); let dis = '';
      if (amb.length) { const sf = amb.some(o => o.f % 8 === m.f % 8), sr = amb.some(o => (o.f / 8 | 0) === (m.f / 8 | 0)); dis = !sf ? CFILES[m.f % 8] : !sr ? String(8 - (m.f / 8 | 0)) : csq(m.f) }
      san = CSYM[k] + dis + (cap ? 'x' : '') + csq(m.t);
    }
  }
  const n = chApply(s, m), nl = chLegal(n); if (chInCheck(n)) san += nl.length ? '+' : '#';
  return san;
}
// Hamle uygula ve oyunun sonucunu belirle. Döner: { s, san, res } ya da { e }
function chMove(s, f, t, promo, keys) {
  const legal = chLegal(s), cand = legal.filter(m => m.f === f && m.t === t);
  if (!cand.length) return { e: 'Bu hamle kurallara uygun değil' };
  const m = cand.length > 1 ? cand.find(x => x.p === (promo || 'Q')) : cand[0]; if (!m) return { e: 'Geçersiz terfi' };
  const san = chSan(s, m, legal), n = chApply(s, m), nl = chLegal(n), key = chKey(n);
  let res = null;
  if (!nl.length) res = chInCheck(n) ? { w: s.turn, why: 'Şah mat' } : { w: '', why: 'Pat' };
  else if (n.half >= 100) res = { w: '', why: '50 hamle kuralı' };
  else if (keys && keys.filter(k => k === key).length >= 2) res = { w: '', why: 'Üç kez aynı konum' };
  else if (chInsufficient(n.b)) res = { w: '', why: 'Yetersiz malzeme' };
  return { s: n, m, san, res, key, cap: n.cap };
}
function chPerft(s, d) { if (d === 0) return 1; let n = 0; for (const m of chLegal(s)) n += d === 1 ? 1 : chPerft(chApply(s, m), d - 1); return n }
function chFromFen(fen) {
  const [pl, turn, cas, ep, half, full] = fen.split(' '), b = []; for (const ch of pl) { if (ch === '/') continue; if (/\d/.test(ch)) for (let k = 0; k < +ch; k++) b.push(''); else b.push((ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase()) }
  return { b, turn, cas: cas === '-' ? '' : cas, ep: ep === '-' ? -1 : CFILES.indexOf(ep[0]) + (8 - +ep[1]) * 8, half: +half || 0, full: +full || 1 };
}

const CTC = { none: null, '10': { base: 600000, inc: 0 }, '5': { base: 300000, inc: 0 }, '3+2': { base: 180000, inc: 2000 } };
function cClk(c, now) { if (!c.tc || !c.clk) return null; const o = { w: c.clk.w, b: c.clk.b, run: c.ph == 'play' ? c.s.turn : '' }; if (o.run) o[o.run] = Math.max(0, o[o.run] - (now - c.ts)); return o }
function cView(c, n) {
  if (!c) return null; const now = Date.now(), mi = c.pl.indexOf(n), me = mi === 0 ? 'w' : mi === 1 ? 'b' : '';
  const v = { id: c.id, pl: c.pl, ph: c.ph, me, sc: c.sc, tc: c.tcn || 'none', by: c.by };
  if (c.ph == 'wait') return v;
  const s = c.s, kk = chKing(s.b, s.turn);
  Object.assign(v, { b: s.b, turn: s.turn, last: c.last, chk: chInCheck(s) ? kk : -1, hist: c.hist, cap: c.cap, res: c.res, draw: c.draw || '', clk: cClk(c, now) });
  if (c.ph == 'play' && me === s.turn) { const L = chLegal(s), seen = new Set(); v.moves = []; for (const m of L) { const k = m.f + ':' + m.t; if (seen.has(k)) continue; seen.add(k); v.moves.push(m.p ? [m.f, m.t, 1] : [m.f, m.t]) } }
  return v;
}

// ---------- Sesli sohbet: ICE/TURN sunucuları ----------
// Cloudflare Realtime TURN anahtarı (TURN_KEY_ID + TURN_KEY_API_TOKEN gizli değişkenleri) varsa kısa ömürlü kimlik üretilir;
// anahtar asla tarayıcıya gönderilmez. Yoksa yalnız STUN (doğrudan bağlantı) kullanılır.
let ICEC = null;
async function iceServers(env) {
  const stun = { urls: ['stun:stun.cloudflare.com:3478', 'stun:stun.l.google.com:19302'] };
  if (!env.TURN_KEY_ID || !env.TURN_KEY_API_TOKEN) return { iceServers: [stun], relay: false };
  if (ICEC && ICEC.exp > Date.now()) return ICEC.v;
  try {
    const r = await fetch('https://rtc.live.cloudflare.com/v1/turn/keys/' + encodeURIComponent(env.TURN_KEY_ID) + '/credentials/generate-ice-servers', { method: 'POST', headers: { authorization: 'Bearer ' + env.TURN_KEY_API_TOKEN, 'content-type': 'application/json' }, body: JSON.stringify({ ttl: 86400 }), signal: AbortSignal.timeout(6000) });
    if (!r.ok) return { iceServers: [stun], relay: false, error: 'TURN anahtarı reddedildi (HTTP ' + r.status + ')' };
    const j = await r.json(), list = (j.iceServers || []).map(s => ({ ...s, urls: [].concat(s.urls || []).filter(u => !/:53(\?|$)/.test(u)) })).filter(s => s.urls.length);
    const v = { iceServers: list.length ? list : [stun], relay: list.some(s => s.urls.some(u => /^turns?:/.test(u))) };
    ICEC = { v, exp: Date.now() + 6 * 36e5 }; return v;
  } catch (e) { return { iceServers: [stun], relay: false, error: 'TURN sunucusuna ulaşılamadı' } }
}

// ---------- Worker ----------
export default {
  async fetch(req, env, ctx) {
    const u = new URL(req.url), p = u.pathname;
    const later = pr => { if (ctx && ctx.waitUntil) ctx.waitUntil(pr.catch(() => { })); else return pr.catch(() => { }) };
    const J = (o, s = 200) => Response.json(o, { status: s, headers: { 'cache-control': 'no-store' } });
    const pa = pwaAsset(p); if (pa) return pa;
    if (!/^\/(api|ws|proxy)(\/|$)/.test(p)) return new Response(HTML, { headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'no-store', 'content-security-policy': CSP, 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'referrer-policy': 'strict-origin-when-cross-origin' } });
    try {
      if (p == '/api/login' && req.method == 'POST') {
        const b = await req.json().catch(() => ({}));
        const r = await (await dbf(env, '/login', { name: b.name, pass: b.pass, ip: req.headers.get('cf-connecting-ip') || '' })).json();
        if (r.ok) return J({ token: await sign(env, { n: r.name, v: r.v, e: Date.now() + 30 * 864e5 }), name: r.name, role: r.role, def: r.def });
        return J({ error: r.lock ? 'Çok fazla hatalı deneme. ' + r.lock + ' sn sonra tekrar dene.' : 'Kullanıcı adı veya şifre hatalı' }, r.lock ? 429 : 401);
      }
      if (p == '/api/rt/send' || p == '/api/rt/poll') {
        const room = clean(u.searchParams.get('room')); if (!room) return J({ gone: 1 });
        const r = await roomStub(env, room).fetch('https://do/' + (p == '/api/rt/send' ? 'psend' : 'ppoll'), { method: 'POST', body: await req.text() });
        return new Response(r.body, { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
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
      if (p == '/api/rt/join') {
        const room = clean(u.searchParams.get('room')); if (!room) return J({ error: 'oda' }, 400);
        const lk = await getLocks(env), mode = [1, 2, 3].includes(+u.searchParams.get('mode')) ? +u.searchParams.get('mode') : 1;
        const r = await roomStub(env, room).fetch('https://do/ws?poll=1&n=' + encodeURIComponent(me.n) + '&room=' + room + '&mode=' + mode + '&new=' + (u.searchParams.get('new') == '1' ? 1 : 0) + '&a=' + (adm ? 1 : 0) + '&lk=' + encodeURIComponent(JSON.stringify(lk)), { method: 'POST' });
        return new Response(r.body, { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
      }
      if (p == '/api/roomq') {
        const code = clean(u.searchParams.get('code')); if (!code) return J({ exists: false, mode: 0 });
        const r = await (await roomStub(env, code).fetch('https://do/info', { method: 'POST', body: '{}' })).json();
        return J({ exists: !!r.exists, mode: r.mode | 0 });
      }
      if (p == '/api/me') { const x = await (await dbf(env, '/meinfo', { name: me.n })).json(); return J({ name: me.n, role: me.r, tag: x.tag || '', ts: x.ts || 0, fr: x.fr || 0 }) }
      if (p == '/api/me/delete' && req.method == 'POST') {
        const b = await req.json().catch(() => ({})), r = await dbf(env, '/selfdel', { name: me.n, pass: String(b.pass || '').slice(0, 200) }), j = await r.json();
        if (r.ok) UC.delete(me.n); return J(j, r.status);
      }
      if (p == '/api/turn') return J(await iceServers(env));
      // ---- bildirimler ----
      if (p == '/api/push/key') return J({ k: (await vapid(env)).pub });
      // ---- izleme listesi (film) ----
      if (p == '/api/wl') {
        if (req.method == 'GET') {
          const code = clean(u.searchParams.get('room')); let names = [me.n];
          if (code) { try { const w = await (await roomStub(env, code).fetch('https://do/rwho', { method: 'POST', body: '{}' })).json(); if (Array.isArray(w) && w.includes(me.n)) names = [...new Set([me.n, ...w])].slice(0, 8) } catch (e) { } }
          return J(await (await dbf(env, '/wlget', { names })).json());
        }
        const b = await req.json().catch(() => ({})), a = String(b.a || ''), url = String(b.url || '').trim().slice(0, 2000); let r;
        if (!/^https?:\/\//i.test(url)) return J({ error: 'Link http:// ya da https:// ile başlamalı' }, 400);
        if (a == 'add') {
          let ref = String(b.ref || '').trim().slice(0, 500); if (ref && !/^https?:\/\//i.test(ref)) ref = '';
          let title = String(b.title || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 150);
          if (!title) { const y = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/i);
            if (y) { try { const o = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + y[1]), { signal: AbortSignal.timeout(4000) }); if (o.ok) title = String((await o.json()).title || '').slice(0, 150) } catch (e) { } }
            if (!title) { try { const x = new URL(url); title = decodeURIComponent(x.pathname.split('/').filter(Boolean).pop() || x.hostname).replace(/\.(mp4|m3u8|webm|mkv|mov)$/i, '').replace(/[_+.-]+/g, ' ').slice(0, 150) || x.hostname } catch (e) { title = 'Video' } } }
          r = await dbf(env, '/wladd', { name: me.n, it: { u: url, r: ref, t: title } });
        } else if (a == 'rm') r = await dbf(env, '/wlrm', { name: me.n, u: url });
        else if (a == 'done') r = await dbf(env, '/wldone', { name: me.n, u: url, v: b.v ? 1 : 0 });
        else if (a == 'ren') { const t = String(b.title || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 150); if (!t) return J({ error: 'Bir ad yaz' }, 400); r = await dbf(env, '/wlren', { name: me.n, u: url, t }) }
        else return J({ error: 'Geçersiz işlem' }, 400);
        const code = clean(b.room); if (code) await later(roomStub(env, code).fetch('https://do/wlchg', { method: 'POST', body: '{}' }));
        return J(await r.json(), r.status);
      }
      // ---- kayıtlı şarkı listeleri ----
      if (p == '/api/pl') {
        if (req.method == 'GET') return J(await (await dbf(env, '/plget', { name: me.n })).json());
        const b = await req.json().catch(() => ({})); let r;
        if (b.a == 'save') { const items = (Array.isArray(b.items) ? b.items : []).slice(0, 100).map(cleanTr).filter(Boolean), n = String(b.n || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 40);
          if (!n) return J({ error: 'Listeye bir ad ver' }, 400); if (!items.length) return J({ error: 'Listede şarkı yok' }, 400);
          r = await dbf(env, '/plsave', { name: me.n, n, items }) }
        else if (b.a == 'rm') r = await dbf(env, '/plrm', { name: me.n, id: String(b.id || '') });
        else return J({ error: 'Geçersiz işlem' }, 400);
        return J(await r.json(), r.status);
      }
      // ---- arkadaşlar ----
      if (p == '/api/friends') {
        if (req.method == 'GET') return J(await (await dbf(env, '/fr', { name: me.n })).json());
        const b = await req.json().catch(() => ({})), r = await dbf(env, '/fract', { name: me.n, a: String(b.a || ''), n: String(b.n || '') }), j = await r.json();
        if (j.notify) await later(pushTo(env, [j.notify.to], { title: j.notify.title, body: j.notify.body, url: '/', tag: 'arkadas-' + me.n }, u.origin)); delete j.notify;
        return J(j, r.status);
      }
      if (p.startsWith('/api/push/') && req.method == 'POST') {
        const b = await req.json().catch(() => ({}));
        if (p == '/api/push/sub') { if (!b.sub || !pushSubOk(b.sub)) return J({ error: 'Bu cihazın bildirim adresi desteklenmiyor' }, 400); return J(await (await dbf(env, '/psub', { name: me.n, sub: b.sub })).json()) }
        if (p == '/api/push/unsub') return J(await (await dbf(env, '/punsub', { name: me.n, endpoint: String(b.endpoint || '') })).json());
        if (p == '/api/push/test') { const r = await pushTo(env, [me.n], { title: 'Bizim Sinema', body: 'Bildirimler çalışıyor ✓', url: '/', tag: 'test' }, u.origin); return J({ r: r[me.n] }) }
        if (p == '/api/push/invite') {
          const code = clean(b.room); if (!code) return J({ error: 'Oda kodu yok' }, 400);
          const to = [...new Set((Array.isArray(b.to) ? b.to : []).map(x => String(x).slice(0, 40)))].filter(x => x && x !== me.n).slice(0, 8);
          if (!to.length) return J({ error: 'Kimseyi seçmedin' }, 400);
          const frs = new Set(await (await dbf(env, '/frof', { name: me.n })).json()); if (to.some(n => !frs.has(n))) return J({ error: 'Yalnız arkadaşlarını çağırabilirsin' }, 403);
          const now = Date.now(), rl = (PRL.get(me.n) || []).filter(t => now - t < 60000);
          if (rl.length >= 6) return J({ error: 'Çok sık davet gönderdin, biraz bekle.' }, 429);
          const fresh = to.filter(n => now - (PRL.get(me.n + '>' + n) || 0) > 20000);
          if (!fresh.length) return J({ error: 'Bu kişilere az önce davet gönderdin, 20 sn bekle.' }, 429);
          const info = await (await roomStub(env, code).fetch('https://do/info', { method: 'POST', body: '{}' })).json();
          if (!info.exists) return J({ error: 'Bu oda artık açık değil' }, 404);
          rl.push(now); PRL.set(me.n, rl); fresh.forEach(n => PRL.set(me.n + '>' + n, now)); if (PRL.size > 2000) PRL.clear();
          const kind = info.mode == 3 ? 'Oyun · ' + (GNAME[info.game] || 'Oyunlar') : ({ 1: 'Film', 2: 'Yapboz ve müzik' }[info.mode] || '');
          return J({ r: await pushTo(env, fresh, { title: me.n + ' seni çağırıyor', body: (kind ? kind + (info.mode == 3 ? '' : ' odası') : 'Oda') + ' · ' + code + ' · Katılmak için dokun', url: '/?oda=' + code, tag: 'davet-' + code }, u.origin) });
        }
      }
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
const LKEYS = ['film', 'puzzle', 'music', 'word', 'games'];
const newTag = () => String(1000 + crypto.getRandomValues(new Uint32Array(1))[0] % 9000);
const normLk = x => { x = x || {}; const nv = (v, d) => { v = +v; return v === 0 || v === 1 || v === 2 ? v : d }; return { film: nv(x.film, 0), puzzle: nv(x.puzzle, 0), music: nv(x.music, 0), word: nv(x.word, 2), games: nv(x.games, 0) } };

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
  const g = { pl, bd: Array(225).fill(''), bj: Array(225).fill(0), bag, rk: {}, sc: {}, tn: rnd(pl.length), ps: 0, mv: 1, out: [], lm: '', last: null, over: 0, win: '', prev: '', ob: 0, log: [] };
  for (const n of pl) { g.rk[n] = []; g.sc[n] = 0; wgDraw(g, n) }
  g.log.push('Oyun başladı. İlk sıra: ' + pl[g.tn]); return g;
}
const wgSnap = g => JSON.stringify({ ...g, prev: '' });
const wgLog = (g, x) => { g.log.push(x); if (g.log.length > 40) g.log.splice(0, g.log.length - 40) };
// Oyunda kalan (çekilmemiş) oyuncular
const wgAct = g => g.pl.filter(x => !(g.out || []).includes(x));
const wgPsMax = g => 3 * Math.max(2, wgAct(g).length);
function wgFinish(g, out) {
  // Herkes elinde kalan harflerin değerini kaybeder; eli bitiren diğerlerinin toplamını kazanır
  const act = wgAct(g); let tot = 0;
  for (const n of act) { const v = rkVal(g.rk[n]); g.sc[n] -= v; tot += v }
  if (out && act.includes(out)) g.sc[out] += tot;
  g.over = 1; const best = Math.max(...act.map(n => g.sc[n])), top = act.filter(n => g.sc[n] === best);
  g.win = top.length == 1 ? top[0] : '=';
  wgLog(g, 'Oyun bitti: ' + (g.pl.length == 2 ? g.pl[0] + ' ' + g.sc[g.pl[0]] + ' - ' + g.sc[g.pl[1]] + ' ' + g.pl[1] : act.map(n => n + ' ' + g.sc[n]).join(', ')));
}
function wgNext(g, name) { const N = g.pl.length; for (let k = 0; k < N; k++) { g.tn = (g.tn + 1) % N; if (!(g.out || []).includes(g.pl[g.tn])) break } g.mv++; g.ob = 0 }
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
  if (g.ps >= wgPsMax(g)) { g.mv++; wgFinish(g, null) } else wgNext(g, name); return { ok: 1 };
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
  if (g.ps >= wgPsMax(g)) { g.mv++; wgFinish(g, null) } else wgNext(g, name); return { ok: 1 };
}
function wgRes(g, name) {
  if (!g || g.over) return { e: 'Oyun bitti' }; g.out = g.out || [];
  if (g.pl.indexOf(name) < 0 || g.out.includes(name)) return { e: 'Bu oyunda değilsin' };
  const rest = wgAct(g).filter(n => n !== name); g.lm = ''; g.prev = '';
  if (rest.length <= 1) { g.over = 1; g.win = rest[0] || ''; g.mv++; wgLog(g, name + ' teslim oldu'); g.last = { kind: 'res', by: name, txt: 'teslim oldu', pts: 0 }; return { ok: 1 } }
  // 3–4 kişilik oyunda: oyuncu çekilir, harfleri torbaya döner, diğerleri devam eder
  const turn = g.pl[g.tn] === name; g.out.push(name); g.bag.push(...g.rk[name]); g.rk[name] = []; shuf(g.bag);
  wgLog(g, name + ' oyundan çekildi'); g.last = { kind: 'res', by: name, txt: 'oyundan çekildi', pts: 0 };
  if (g.ps >= wgPsMax(g)) { g.mv++; wgFinish(g, null) } else if (turn) wgNext(g, name); return { ok: 1 };
}
function wgUndo(g, name) {
  if (!g || g.lm !== name || !g.prev) return { e: 'Geri alınamaz' };
  const mv = g.mv, p = JSON.parse(g.prev); for (const k of Object.keys(g)) delete g[k]; Object.assign(g, p); g.mv = mv + 1; g.prev = ''; g.ob = 0; wgLog(g, name + ' hamlesini geri aldı'); return { ok: 1 };
}
function wgView(g, n) {
  const rkN = {}; for (const k of g.pl) rkN[k] = g.rk[k].length;
  const un = {}; for (const l of g.bag) un[l] = (un[l] || 0) + 1; for (const k of g.pl) if (k !== n) for (const l of g.rk[k]) un[l] = (un[l] || 0) + 1;
  return { pl: g.pl, bd: g.bd, bj: g.bj, sc: g.sc, tn: g.tn, mv: g.mv, ps: g.ps | 0, psMax: wgPsMax(g), out: g.out || [], un, bagN: g.bag.length, rk: g.pl.indexOf(n) >= 0 && !(g.out || []).includes(n) ? g.rk[n] : null, rkN, over: g.over, win: g.win, last: g.last, ob: g.ob, canUndo: !!(g.prev && g.lm == n), log: g.log.slice(-14) };
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
      const g = await s.storage.get(['st', 'pzp', 'chat', 'code', 'rooms', 'lk', 'ms', 'wg', 'roomMode', 'wpm', 'wacc', 'mq', 'dg', 'bs', 'gsel', 'cs']);
      this.st = g.get('st') || fresh(); this.pend = null; this.pzp = g.get('pzp') || null; this.chat = g.get('chat') || []; this.code = g.get('code') || ''; this.rooms = g.get('rooms') || {}; this.lk = normLk(g.get('lk')); this.ms = g.get('ms') || null; this.wg = g.get('wg') || null; this.roomMode = [1,2,3].includes(+g.get('roomMode')) ? +g.get('roomMode') : 1; this.roomModeSet = [1,2,3].includes(+g.get('roomMode'));
      this.mq = g.get('mq') || []; this.dg = g.get('dg') || null; this.bs = g.get('bs') || null; this.cs = g.get('cs') || null; this.gsel = GNAME[g.get('gsel')] ? g.get('gsel') : 'duel'; this.gprop = null; this.fd = null; this.wlT = 0; this.wpm = g.get('wpm') || null; this.wacc = new Set(g.get('wacc') || []); this.pq = null; this.lex = null; this.dmeta = null; this.dcfg = { tdk: 0 }; this.dver = 0; if (this.wpm) this.wpmArm();
    });
  }
  socks() { return this.s.getWebSockets().filter(w => w.readyState === 1).concat([...this.vmap().values()].filter(v => v.readyState === 1)) }
  vmap() { return this.vs || (this.vs = new Map()) }
  tg(w) { return w && w.vs ? [] : this.s.getTags(w) }
  // 40 sn'dir sorgu yapmayan yedek bağlantıları kapat
  async vsweep() { const now = Date.now(); for (const [k, v] of [...this.vmap()]) { if (v.w) continue; if (v.readyState === 3) { if (now - v.last > 60000) this.vmap().delete(k); continue } if (now - v.last > 40000) { this.vmap().delete(k); await this.gone(v) } } }
  can(area, a) { const v = (this.lk && this.lk[area]) | 0; return v == 0 || (v == 1 && !!(a && a.a)) }
  async lkApply(nl) {
    nl = normLk(nl); if (JSON.stringify(nl) === JSON.stringify(this.lk)) return false;
    this.lk = nl; await this.s.storage.put('lk', nl); this.all(JSON.stringify({ t: 'locks', lk: nl }));
    let pzs = null;
    for (const w of this.socks()) {
      if (this.tg(w).includes('admin')) continue;
      const a = w.deserializeAttachment() || {};
      try { if (this.pzp && this.can('puzzle', a)) { if (pzs == null) pzs = JSON.stringify({ t: 'pz', pz: { ...this.pzp, img: await this.img() } }); w.send(pzs) } } catch (e) { }
    }
    this.wsend(); this.dSend(); this.bSend(); this.bcast(); return true;
  }
  deny(ws) { try { ws.send(JSON.stringify({ t: 'locks', lk: this.lk })) } catch (e) { } }
  wsend() { for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; try { w.send(JSON.stringify({ t: 'wg', g: this.wg && this.can('word', a) ? wgView(this.wg, a.n) : null })) } catch (e) { } } }
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
      const poll = u.searchParams.get('poll') == '1';
      const refuse = (c, why) => { if (poll) return Response.json({ close: [c, why] }); const [cl, sv0] = Object.values(new WebSocketPair()); sv0.accept(); sv0.close(c, why); return new Response(null, { status: 101, webSocket: cl }) };
      if (!this.roomModeSet && !wantNew && !this.code) return refuse(4404, 'oda yok');
      if (this.roomModeSet && wantNew && reqMode !== this.roomMode) return refuse(4409, 'kod dolu');
      const CAP = ROOM_CAP[this.roomModeSet ? this.roomMode : reqMode] || 6, nm = u.searchParams.get('n') || '';
      if (nm && !this.names().includes(nm) && this.names().length >= CAP) {
        // dolu görünüyorsa önce 90 sn'dir ses vermeyen (uykudaki/kopmuş) bağlantıları kapat, sonra yeniden say
        const now0 = Date.now(); for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; if (now0 - ((w.deserializeAttachment() || {}).ls || 0) > 90000) { try { w.close(4001, 'eski') } catch (e) { } } }
        if (this.names().length >= CAP) return refuse(4429, 'Oda dolu (en fazla ' + CAP + ' kişi)');
      }
      let ss = this.socks();
      if (ss.length >= 8) { ss.sort((x, y) => ((x.deserializeAttachment() || {}).ls || 0) - ((y.deserializeAttachment() || {}).ls || 0)); while (ss.length >= 8) { const o = ss.shift(); try { o.close(4001, 'eski') } catch (e) { } } }
      const code = clean(u.searchParams.get('room')); if (code && !this.code) { this.code = code; await S.put('code', code) }
      if (!this.roomModeSet) { this.roomMode = reqMode; this.roomModeSet = true; await S.put('roomMode', this.roomMode) }
      const [c, sv] = poll ? [null, new VSock(crypto.randomUUID())] : Object.values(new WebSocketPair()); let lkp = null; try { lkp = JSON.parse(u.searchParams.get('lk') || 'null') } catch (e) { }
      if (lkp) await this.lkApply(lkp);
      const att = { n: u.searchParams.get('n'), a: u.searchParams.get('a') == '1' ? 1 : 0, ls: Date.now() };
      if (poll) this.vmap().set(sv.sid, sv); else this.s.acceptWebSocket(sv); sv.serializeAttachment(att);
      await S.deleteAlarm(); this.bcast();
      sv.send(JSON.stringify({ t: 'roomMode', mode: this.roomMode }));
      sv.send(JSON.stringify({ t: 'hist', c: this.chat.slice(-40) }));
      sv.send(JSON.stringify({ t: 'vr', r: this.vroster() }));
      sv.send(JSON.stringify({ t: 'locks', lk: this.lk }));
      if (this.pzp && this.can('puzzle', att)) sv.send(JSON.stringify({ t: 'pz', pz: { ...this.pzp, img: await this.img() } }));
      if (this.can('games', att)) await this.gameJoin(att.n);
      if (this.can('games', att)) { if (this.dg) sv.send(JSON.stringify({ t: 'dg', g: dView(this.dg, att.n) })); if (this.bs) sv.send(JSON.stringify({ t: 'bs', g: bView(this.bs, att.n) })); if (this.cs) sv.send(JSON.stringify({ t: 'cs', g: cView(this.cs, att.n) })) }
      if (this.wg && this.can('word', att)) { sv.send(JSON.stringify({ t: 'wg', g: wgView(this.wg, att.n) })); if (!this.wg.over) this.dwarm() }
      if (this.pend && this.pend.by !== att.n && this.can('word', att)) sv.send(this.pendMsg());
      if (this.wpm && this.can('word', att)) sv.send(this.wqMsg(att.n));
      await this.report(); return poll ? Response.json({ sid: sv.sid, m: sv.q.splice(0) }) : new Response(null, { status: 101, webSocket: c });
    }
    if (p == '/ppoll' || p == '/psend') {
      const b = await req.json().catch(() => ({})), v = this.vmap().get(String(b.sid || ''));
      if (!v) return Response.json({ gone: 1 });
      v.last = Date.now();
      if (p == '/psend') {
        for (const x of (Array.isArray(b.m) ? b.m.slice(0, 80) : [])) { if (v.readyState !== 1) break; if (x === '{"t":"bye"}') { this.vmap().delete(v.sid); await this.gone(v); break } await this.webSocketMessage(v, String(x)) }
        await this.vsweep(); return Response.json({ ok: 1 });
      }
      if (!v.q.length && v.readyState === 1) { v.wake(); let mine; await new Promise(r => { const t = setTimeout(r, 20000); mine = () => { clearTimeout(t); r() }; v.w = mine }); if (v.w === mine) v.w = null; if (v.q.length) await new Promise(r => setTimeout(r, 30)) }
      v.last = Date.now(); const out = { m: v.q.splice(0) }; if (v.readyState === 3) { out.close = v.cl || [1000, '']; this.vmap().delete(v.sid) }
      return Response.json(out);
    }
    if (p == '/adminws') { const [c, sv] = Object.values(new WebSocketPair()); this.s.acceptWebSocket(sv, ['admin']); sv.send(this.snap()); return new Response(null, { status: 101, webSocket: c }) }
    if (p == '/kill') {
      this.socks().forEach(w => { try { w.close(4000, 'kapatildi') } catch (e) { } });
      await S.deleteAll(); this.st = fresh(); this.pzp = null; this.pzi = null; this.chat = []; this.code = ''; this.roomMode = 1; this.roomModeSet = false; this.ms = null; this.mq = []; this.dg = null; this.bs = null; this.cs = null; this.gsel = 'duel'; this.gprop = null; this.wg = null; this.wpm = null; this.wacc = new Set(); clearTimeout(this.wpmT); return Response.json({ ok: 1 });
    }
    const b = await req.json().catch(() => ({}));
    if (p.startsWith('/dict')) return this.dictRoute(p, b);
    if (p == '/rwho') return Response.json(this.names());
    if (p == '/wlchg') { this.all(JSON.stringify({ t: 'wlchg' })); return Response.json({ ok: 1 }) }
    if (p == '/info') return Response.json({ exists: this.roomModeSet, mode: this.roomModeSet ? this.roomMode : 0, game: this.roomMode == 3 ? this.gsel : '' });
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
      if (x && same(x.h, hh)) { await S.delete([kn]); x.last = now; if (!x.tag) x.tag = newTag(); await S.put('u:' + nm, x); return Response.json({ ok: 1, name: x.name, role: x.role, v: x.v || 1, def: !!x.def }) }
      const bump = (r, lim, sec) => { r = r && r.t > now - 9e5 ? r : { n: 0 }; r.n++; r.t = now; if (r.n >= lim) { r.u = now + sec * 1000; r.n = 0 } return r };
      await S.put(kn, bump(fn, 15, 120)); await S.put(ki, bump(fi, 8, 300)); return Response.json({ ok: 0 });
    }
    if (p == '/who') { const x = await S.get('u:' + nm); return Response.json(x ? { ok: 1, r: x.role, v: x.v || 1 } : { ok: 0 }) }
    if (p == '/list') return Response.json([...(await S.list({ prefix: 'u:' })).values()].map(x => ({ name: x.name, role: x.role, ts: x.ts || 0, last: x.last || 0, def: !!x.def })));
    if (p == '/add') {
      if (!/^[a-z0-9_]{3,16}$/.test(nm)) return bad('Kullanıcı adı 3-16 karakter: a-z, 0-9, _');
      if (!pwOk(b.pass)) return bad('Şifre en az 6 karakter olmalı');
      if (await S.get('u:' + nm)) return bad('Bu kullanıcı zaten var', 409);
      const salt = crypto.randomUUID(); await S.put('u:' + nm, { tag: newTag(), name: nm, role: b.role == 'admin' ? 'admin' : 'user', salt, h: await hash(b.pass, salt), v: 1, ts: Date.now() }); return Response.json({ ok: 1 });
    }
    if (p == '/edit') {
      const x = await S.get('u:' + nm); if (!x) return bad('Kullanıcı yok', 404);
      if (b.pass !== undefined) { if (!pwOk(b.pass)) return bad('Şifre en az 6 karakter olmalı'); x.salt = crypto.randomUUID(); x.h = await hash(b.pass, x.salt); x.v = (x.v || 1) + 1; x.def = false }
      if (b.role && nm != 'admin') { x.role = b.role == 'admin' ? 'admin' : 'user'; x.v = (x.v || 1) + 1 }
      await S.put('u:' + nm, x); return Response.json({ ok: 1 });
    }
    if (p == '/del') { if (nm == 'admin' || nm == String(b.by || '').toLowerCase()) return bad('Bu hesap silinemez'); await S.delete(['u:' + nm, 'ps:' + nm, 'fr:' + nm, 'wl:' + nm, 'pl:' + nm]); return Response.json({ ok: 1 }) }
    // ---- izleme listesi: wl:<ad> = [{ u, r, t, p (konum sn), d (süre), ts (eklenme), w (son izleme), done }] ----
    if (p.startsWith('/wl')) {
      const now = Date.now();
      if (p == '/wlprog') {
        const url = String(b.u || ''), pp = Math.max(0, +b.p || 0), d = Math.max(0, Math.round(+b.d || 0)); let ch = 0;
        for (const n of (Array.isArray(b.names) ? b.names : []).slice(0, 10)) { const k = 'wl:' + String(n).toLowerCase(), L = await S.get(k); if (!L) continue; const it = L.find(x => x.u === url); if (!it) continue;
          it.p = Math.round(pp); if (d) it.d = d; it.w = now; const D = it.d || 0; if (D && pp >= D - 90) it.done = 1; else if (pp > 60) it.done = 0; await S.put(k, L); ch = 1 }
        return Response.json({ ch });
      }
      if (p == '/wlget') {
        const M = new Map();
        for (const n of (Array.isArray(b.names) ? b.names : []).slice(0, 8)) { const L = (await S.get('wl:' + String(n).toLowerCase())) || [];
          for (const it of L) { const x = M.get(it.u); if (!x) M.set(it.u, { ...it, by: [n] }); else { x.by.push(n); if ((it.w || 0) > (x.w || 0)) Object.assign(x, { p: it.p, d: it.d || x.d, w: it.w, done: it.done }); if (!x.t && it.t) x.t = it.t } } }
        const rank = x => x.done ? 2 : (x.p || 0) > 5 ? 0 : 1;
        return Response.json([...M.values()].sort((x, y) => rank(x) - rank(y) || (rank(x) == 0 ? (y.w || 0) - (x.w || 0) : (y.ts || 0) - (x.ts || 0))).slice(0, 150));
      }
      const k = 'wl:' + nm, L = (await S.get(k)) || [];
      if (p == '/wladd') { const it = b.it || {}, i = L.findIndex(x => x.u === it.u); if (i >= 0) { const [x] = L.splice(i, 1); x.ts = now; if (it.t && !x.t) x.t = it.t; L.unshift(x) } else { if (L.length >= 100) return bad('Listende en fazla 100 video olabilir. Bazılarını çıkar.'); L.unshift({ u: it.u, r: it.r || '', t: it.t || '', p: 0, d: 0, ts: now, w: 0, done: 0 }) } await S.put(k, L); return Response.json({ ok: 1 }) }
      if (p == '/wlren') { const it = L.find(x => x.u === b.u); if (!it) { L.unshift({ u: b.u, r: '', t: b.t, p: 0, d: 0, ts: now, w: 0, done: 0 }) } else it.t = b.t; await S.put(k, L); return Response.json({ ok: 1 }) }
      if (p == '/wlrm') { await S.put(k, L.filter(x => x.u !== b.u)); return Response.json({ ok: 1 }) }
      if (p == '/wldone') { const it = L.find(x => x.u === b.u); if (!it) return bad('Bu video senin listende değil', 404); it.done = b.v ? 1 : 0; if (!b.v && it.d && it.p >= it.d - 90) it.p = 0; await S.put(k, L); return Response.json({ ok: 1 }) }
      return bad('yok', 404);
    }
    // ---- kayıtlı şarkı listeleri: pl:<ad> = [{ id, n, items, ts }] ----
    if (p == '/plget') return Response.json((await S.get('pl:' + nm)) || []);
    if (p == '/plsave') { const L = (await S.get('pl:' + nm)) || [], i = L.findIndex(x => trLower(x.n) === trLower(b.n));
      if (i >= 0) { L[i].items = b.items; L[i].ts = Date.now(); L[i].n = b.n } else { if (L.length >= 30) return bad('En fazla 30 liste kaydedebilirsin'); L.unshift({ id: crypto.randomUUID().slice(0, 8), n: b.n, items: b.items, ts: Date.now() }) }
      await S.put('pl:' + nm, L); return Response.json({ ok: 1, upd: i >= 0 }) }
    if (p == '/plrm') { await S.put('pl:' + nm, ((await S.get('pl:' + nm)) || []).filter(x => x.id !== b.id)); return Response.json({ ok: 1 }) }
    if (p == '/meinfo') { const x = await S.get('u:' + nm); if (!x) return bad('Kullanıcı yok', 404); if (!x.tag) { x.tag = newTag(); await S.put('u:' + nm, x) } const fr = await S.get('fr:' + nm); return Response.json({ tag: x.tag, ts: x.ts || 0, fr: fr && fr.f ? fr.f.length : 0 }) }
    if (p == '/selfdel') {
      const x = await S.get('u:' + nm); if (!x) return bad('Kullanıcı yok', 404);
      if (nm == 'admin') return bad('Ana yönetici hesabı silinemez');
      if (!same(x.h, await hash(String(b.pass || ''), x.salt))) return bad('Şifre yanlış', 403);
      const fr = await S.get('fr:' + nm);
      if (fr) for (const o of new Set([...(fr.f || []), ...(fr.in || []), ...(fr.out || [])])) { const y = await S.get('fr:' + o); if (!y) continue; for (const k of ['f', 'in', 'out']) y[k] = (y[k] || []).filter(z => z !== nm); await S.put('fr:' + o, y) }
      await S.delete(['u:' + nm, 'ps:' + nm, 'fr:' + nm, 'wl:' + nm, 'pl:' + nm]); return Response.json({ ok: 1 });
    }
    if (p == '/setpass') {
      const x = await S.get('u:' + nm); if (!x || !same(x.h, await hash(String(b.old || '').slice(0, 200), x.salt))) return bad('Mevcut şifre yanlış');
      if (!pwOk(b.pass)) return bad('Yeni şifre en az 6 karakter olmalı'); if (b.pass == b.old) return bad('Yeni şifre eskisiyle aynı olamaz');
      x.salt = crypto.randomUUID(); x.h = await hash(b.pass, x.salt); x.v = (x.v || 1) + 1; x.def = false; await S.put('u:' + nm, x); return Response.json({ ok: 1, v: x.v });
    }
    if (p == '/vapid') { let v = await S.get('vapid'); if (!v) { const k = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']); v = { pub: pB64e(await crypto.subtle.exportKey('raw', k.publicKey)), jwk: await crypto.subtle.exportKey('jwk', k.privateKey) }; await S.put('vapid', v) } return Response.json(v) }
    if (p == '/psub') {
      const s = b.sub; if (!nm || !s || !pushSubOk(s)) return bad('Geçersiz abonelik');
      for (const [k, L] of await S.list({ prefix: 'ps:' })) { if (k === 'ps:' + nm) continue; const f = L.filter(x => x.endpoint !== s.endpoint); if (f.length !== L.length) { if (f.length) await S.put(k, f); else await S.delete(k) } }
      let L = ((await S.get('ps:' + nm)) || []).filter(x => x.endpoint !== s.endpoint); L.push({ endpoint: s.endpoint, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth }, ts: Date.now() }); if (L.length > 6) L = L.slice(-6);
      await S.put('ps:' + nm, L); return Response.json({ ok: 1, n: L.length });
    }
    if (p == '/punsub') { const L = (await S.get('ps:' + nm)) || [], f = L.filter(x => x.endpoint !== b.endpoint); if (f.length) await S.put('ps:' + nm, f); else await S.delete('ps:' + nm); return Response.json({ ok: 1 }) }
    if (p == '/pget') { const o = {}; for (const n of (Array.isArray(b.names) ? b.names : []).slice(0, 20)) o[n] = (await S.get('ps:' + String(n).toLowerCase())) || []; return Response.json(o) }
    if (p == '/people') { const ps = new Set([...(await S.list({ prefix: 'ps:' })).keys()].map(k => k.slice(3))); return Response.json([...(await S.list({ prefix: 'u:' })).values()].map(x => ({ n: x.name, push: ps.has(String(x.name).toLowerCase()) }))) }
    // ---- arkadaşlık: fr:<ad> = { f: arkadaşlar, in: gelen istekler, out: gönderilen istekler, bl: engellenenler } ----
    if (p == '/fr' || p == '/fract' || p == '/frof') {
      const F = async n => ({ f: [], in: [], out: [], bl: [], ...((await S.get('fr:' + n)) || {}) }), put = (n, x) => S.put('fr:' + n, x), del = (a, v) => a.filter(z => z !== v);
      const seen = this.seen || (this.seen = new Map()), now = Date.now();
      if (!nm || !(await S.get('u:' + nm))) return bad('Kullanıcı yok', 404);
      if (p == '/frof') return Response.json((await F(nm)).f);
      if (p == '/fract') {
        const a = String(b.a || ''), raw = String(b.n || '').toLowerCase().replace(/\s+/g, '').replace(/^@/, '');
        if (!['req', 'acc', 'dec', 'cancel', 'rm', 'block', 'unblock'].includes(a)) return bad('Geçersiz işlem');
        let t = raw, code = '';
        if (a == 'req') { const mm = raw.match(/^([a-z0-9_]{3,16})#(\d{4})$/); if (!mm) return bad('Arkadaşının kodunu tam yaz, örnek: fatma#4821'); t = mm[1]; code = mm[2] }
        else if (!/^[a-z0-9_]{3,16}$/.test(t)) return bad('Geçersiz kullanıcı');
        const me = await F(nm);
        if (a == 'unblock') { me.bl = del(me.bl, t); await put(nm, me); return Response.json({ ok: 1, msg: 'Engel kaldırıldı' }) }
        const tu = await S.get('u:' + t), exists = !!tu;
        if (a == 'req') {
          const fl = this.frf || (this.frf = new Map()), FL = (fl.get(nm) || []).filter(x => now - x < 6e5);
          if (FL.length >= 15) return bad('Çok fazla hatalı kod denedin. 10 dakika sonra tekrar dene.', 429);
          if (!exists || !tu.tag || tu.tag !== code) { FL.push(now); fl.set(nm, FL); if (fl.size > 500) fl.clear(); return bad('Bu kodla bir kullanıcı bulunamadı. # işaretinden sonraki 4 rakamı kontrol et.', 404) }
          if (t === nm) return bad('Bu senin kendi kodun 🙂');
        }
        if (!exists && a == 'acc') return bad('Bu kullanıcı artık yok', 404);
        const o = await F(t); let notify = null, msg = '';
        const link = () => { me.in = del(me.in, t); me.out = del(me.out, t); o.in = del(o.in, nm); o.out = del(o.out, nm); if (!me.f.includes(t)) me.f.push(t); if (!o.f.includes(nm)) o.f.push(nm) };
        if (a == 'req') {
          if (me.bl.includes(t)) return bad('Bu kişiyi engellemişsin. Önce engeli kaldır.');
          if (me.f.includes(t)) return bad('Zaten arkadaşsınız');
          if (me.f.length >= 300) return bad('Arkadaş sınırına (300) ulaştın');
          if (me.in.includes(t) && !o.bl.includes(nm)) { link(); msg = t + ' ile artık arkadaşsınız ✓'; notify = { to: t, title: nm + ' arkadaşlık isteğini kabul etti', body: 'Artık birbirinizi odaya çağırabilirsiniz' } }
          else {
            if (me.out.includes(t)) return bad('İstek zaten gönderildi, yanıt bekleniyor');
            if (me.out.length >= 50) return bad('Çok fazla bekleyen isteğin var. Bazılarını iptal et.');
            const rl = this.frl || (this.frl = new Map()), L = (rl.get(nm) || []).filter(x => now - x < 60000); if (L.length >= 10) return bad('Çok hızlı istek gönderiyorsun, biraz bekle.', 429); L.push(now); rl.set(nm, L); if (rl.size > 500) rl.clear();
            me.out.push(t); msg = 'İstek gönderildi';
            // Engellendiysen karşı tarafa hiçbir şey ulaşmaz (ve bunu sana belli etmeyiz)
            if (!o.bl.includes(nm) && o.in.length < 200 && !o.in.includes(nm)) { o.in.push(nm); notify = { to: t, title: nm + ' seni arkadaş olarak eklemek istiyor', body: 'Kabul etmek için uygulamayı aç' } }
          }
        } else if (a == 'acc') { if (!me.in.includes(t)) return bad('Bu kişiden bekleyen istek yok'); link(); msg = t + ' ile artık arkadaşsınız ✓'; if (!o.bl.includes(nm)) notify = { to: t, title: nm + ' arkadaşlık isteğini kabul etti', body: 'Artık birbirinizi odaya çağırabilirsiniz' } }
        else if (a == 'dec') { me.in = del(me.in, t); o.out = del(o.out, nm); msg = 'İstek reddedildi' }
        else if (a == 'cancel') { me.out = del(me.out, t); o.in = del(o.in, nm); msg = 'İstek iptal edildi' }
        else if (a == 'rm') { me.f = del(me.f, t); o.f = del(o.f, nm); msg = t + ' arkadaşlarından çıkarıldı' }
        else if (a == 'block') { for (const k of ['f', 'in', 'out']) { me[k] = del(me[k], t); o[k] = del(o[k], nm) } if (!me.bl.includes(t)) me.bl.push(t); if (me.bl.length > 500) me.bl = me.bl.slice(-500); msg = t + ' engellendi' }
        await put(nm, me); if (exists) await put(t, o);
        return Response.json({ ok: 1, msg, notify });
      }
      // Liste + çevrimiçi durumu (silinmiş hesaplar ayıklanır)
      const me = await F(nm); seen.set(nm, now); const self = await S.get('u:' + nm); if (!self.tag) { self.tag = newTag(); await S.put('u:' + nm, self) }
      const inRoom = {}; for (const r of this.fresh()) for (const w of r.who) if (!inRoom[w]) inRoom[w] = r.room;
      const names = [...new Set([...me.f, ...me.in, ...me.out])], U = new Map();
      for (let i = 0; i < names.length; i += 100) { const g = await S.get(names.slice(i, i + 100).map(n => 'u:' + n)); for (const [k, v] of g) U.set(k.slice(2), v) }
      for (const [n, x] of U) if (!x.tag) { x.tag = newTag(); await S.put('u:' + n, x) }
      const live = n => U.has(n), before = JSON.stringify([me.f, me.in, me.out]);
      me.f = me.f.filter(live); me.in = me.in.filter(live); me.out = me.out.filter(live); if (JSON.stringify([me.f, me.in, me.out]) !== before) await put(nm, me);
      const subs = new Set(); const pg = await S.get(me.f.map(n => 'ps:' + n)); for (const [k, v] of pg) if (v && v.length) subs.add(k.slice(3));
      const tags = {}; for (const [n, x] of U) tags[n] = x.tag;
      const f = me.f.map(n => ({ n, tag: tags[n], room: inRoom[n] || '', on: !!inRoom[n] || now - (seen.get(n) || 0) < 45000, last: Math.max(U.get(n).last || 0, seen.get(n) || 0), push: subs.has(n) }))
        .sort((x, y) => (y.room ? 2 : y.on ? 1 : 0) - (x.room ? 2 : x.on ? 1 : 0) || y.last - x.last || (x.n < y.n ? -1 : 1));
      return Response.json({ me: { n: nm, tag: self.tag }, f, in: me.in, out: me.out, bl: me.bl, tags });
    }
    if (p == '/bump') { const x = await S.get('u:' + nm); if (x) { x.v = (x.v || 1) + 1; await S.put('u:' + nm, x) } return Response.json({ ok: 1 }) }
    return new Response('?', { status: 404 });
  }
  // --- canlı panel ---
  fresh() { const n = Date.now(); return Object.values(this.rooms).filter(r => r.ts > n - 150000).sort((a, b) => b.ts - a.ts) }
  snap() { return JSON.stringify({ t: 'live', rooms: this.fresh(), now: Date.now() }) }
  async presence(b) {
    const n = Date.now(), room = clean(b.room); if (!room) return Response.json({ ok: 0 });
    const sn = this.seen || (this.seen = new Map()); for (const w of (b.who || []).slice(0, 8)) sn.set(String(w), n);
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
    const hb = [], sid = this.st && this.st.sid; for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {};
      const loading = a.fs && a.fs.k === sid && a.fs.s === 'load' && now - a.fs.t < 20000, failed = a.fs && a.fs.k === sid && a.fs.s === 'err';
      if (a.b && !failed) { if (now - a.bt > 20000) { a.b = 0; w.serializeAttachment(a) } else hb.push(a.n) } else if (loading && !hb.includes(a.n)) hb.push(a.n) }
    this.hb = hb; const held = this.st.playing && hb.length > 0;
    if (held !== this.st.held) { this.st = { ...this.st, pos: this.exp(now), at: now, held, rev: (this.st.rev || 0) + 1 }; return true }
    return false;
  }
  msg(i) { return JSON.stringify({ t: 'st', st: this.st, now: Date.now(), who: [...new Set(this.socks().map(w => (w.deserializeAttachment() || {}).n))], hb: this.hb, gs: this.gsView(), fh: this.fhear(), ms: this.ms, mq: this.mq, mh: this.mhear(), i }) }
  // Müzik dinleme durumu (yalnız bellekte/soket ekinde, kalıcı yazılmaz): ok=duyuyor, buf=yükleniyor, need=dokunması gerekiyor, pause=durdu
  names(extra) { return [...new Set([...this.socks().filter(w => !this.tg(w).includes('admin')).map(w => (w.deserializeAttachment() || {}).n), ...(extra || [])].filter(Boolean))] }
  // Birlikte izlenen videonun konumunu, odadakilerin izleme listelerine kaydet (kalıcı: kaldığınız yer)
  async wlSave(extra) {
    const st = this.st; if (!st || !st.url) return; const now = Date.now(); this.wlT = now;
    const names = this.names(extra); if (!names.length) return;
    const fd = this.fd && this.fd.u === st.url ? this.fd.d : 0;
    try { const r = await (await this.env.DO.get(this.env.DO.idFromName('db')).fetch('https://do/wlprog', { method: 'POST', body: JSON.stringify({ names, u: st.url, p: this.exp(now), d: fd }) })).json(); if (r.ch) this.all(JSON.stringify({ t: 'wlchg' })) } catch (e) { }
  }
  // Çalma sırasındaki bir sonraki şarkıya geç
  async mqNext() {
    const it = this.mq.shift(); if (!it) return false; const ms = this.ms;
    this.ms = { tr: it.tr, playing: true, pos: 0, at: Date.now(), by: it.by, rev: (ms ? ms.rev : 0) + 1 };
    await this.s.storage.put({ ms: this.ms, mq: this.mq }); this.all(JSON.stringify({ t: 'sys', x: '🎵 Sıradaki: ' + it.tr.title + (it.tr.artist ? ' – ' + it.tr.artist : '') })); this.bcast(); return true;
  }

  // ---------- oyunlar: Kelime Düellosu ----------
  dSend() { for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (!this.can('games', a)) continue; try { w.send(JSON.stringify({ t: 'dg', g: dView(this.dg, a.n) })) } catch (e) { } } }
  async dMsg(ws, a, n, T, m) {
    const S = this.s.storage, err = e => ws.send(JSON.stringify({ t: 'derr', e }));
    if (T == 'dnew') {
      if (this.gsel !== 'duel') return err('Oda şu an ' + (GNAME[this.gsel] || 'başka bir oyun') + ' oyununda. Önce oyunu değiştirin.');
      const old = this.dg, hist = (old && old.hist) || [], pool = m.pool == 'all' ? 'all' : 'common'; let sec = '';
      if (pool == 'all') { try { const j = await (await dictf(this.env, '/dictrand', { n: 5 })).json(); if (j.w && /^[a-zçğıiöşü]{5}$/.test(j.w) && !hist.includes(j.w)) sec = j.w } catch (e) { } }
      if (!sec) { const L = DWORDS.filter(w => !hist.includes(w)); sec = L[rnd(L.length)] }
      const names = this.names().filter(x => x).slice(0, 8);
      this.dg = { id: crypto.randomUUID().slice(0, 8), sec, pool, pl: names.includes(n) ? names : [n, ...names], g: {}, over: 0, win: '', by: n, sc: (old && old.sc) || {}, hist: [...hist, sec].slice(-120), ts: Date.now() };
      await S.put('dg', this.dg); this.all(JSON.stringify({ t: 'sys', x: '🟩 ' + n + ' Kelime Düellosu başlattı' + (pool == 'all' ? ' (tüm sözlük)' : '') })); return this.dSend();
    }
    if (T == 'dguess') {
      const d = this.dg; if (!d || d.over) return err('Önce yeni oyun başlat');
      if (!d.pl.includes(n)) d.pl.push(n);
      if (dDone(d, n)) return err('Senin hakların bitti, diğerlerini bekle');
      const w = trLower(String(m.w || '')).trim(); if (!/^[a-zçğıiöşü]{5}$/.test(w)) return err('5 harfli bir kelime yaz');
      const rows = d.g[n] || (d.g[n] = []); if (rows.some(x => x.w === w)) return err('Bu kelimeyi zaten denedin');
      if (!DWORDS.includes(w)) { let ok = false; try { const j = await (await dictf(this.env, '/dictcheck', { w: [w] })).json(); ok = j.r && j.r[w] === 1 || (!j.full && wordShape(w)) } catch (e) { ok = wordShape(w) } if (!ok) return err('“' + w.toLocaleUpperCase('tr-TR') + '” sözlükte yok') }
      if (this.dg !== d || d.over) return;
      rows.push({ w, r: dScore(w, d.sec) });
      if (rows[rows.length - 1].r.every(v => v === 2)) { d.over = 1; d.win = n; d.sc[n] = (d.sc[n] || 0) + 1; this.all(JSON.stringify({ t: 'sys', x: '🏆 ' + n + ' kelimeyi ' + rows.length + '. denemede buldu: ' + d.sec.toLocaleUpperCase('tr-TR') })) }
      else if (d.pl.every(p => dDone(d, p))) { d.over = 1; d.win = ''; this.all(JSON.stringify({ t: 'sys', x: '🟩 Kimse bulamadı. Kelime: ' + d.sec.toLocaleUpperCase('tr-TR') })) }
      await S.put('dg', d); return this.dSend();
    }
  }
  // ---------- oyunlar: Amiral Battı ----------
  bSend() { for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (!this.can('games', a)) continue; try { w.send(JSON.stringify({ t: 'bs', g: bView(this.bs, a.n) })) } catch (e) { } } }
  async bMsg(ws, a, n, T, m) {
    const S = this.s.storage, err = e => ws.send(JSON.stringify({ t: 'berr', e })), b = this.bs, log = x => { b.log.push(x); if (b.log.length > 30) b.log.splice(0, b.log.length - 30) };
    if (T == 'bnew') {
      if (this.gsel !== 'bs') return err('Oda şu an ' + (GNAME[this.gsel] || 'başka bir oyun') + ' oyununda. Önce oyunu değiştirin.');
      if (b && b.ph == 'play' && b.pl.includes(n) && !m.force) return err('Devam eden bir oyun var');
      const others = this.names().filter(x => x !== n), opp = m.vs && others.includes(m.vs) ? m.vs : others[0];
      if (!opp) { this.bs = { id: crypto.randomUUID().slice(0, 8), pl: [n], ph: 'wait', ships: {}, ready: {}, shots: { [n]: [] }, tn: 0, win: '', sc: (b && b.sc) || {}, log: [] };
        await S.put('bs', this.bs); return this.bSend() }
      this.bs = { id: crypto.randomUUID().slice(0, 8), pl: [n, opp], ph: 'place', ships: {}, ready: {}, shots: { [n]: [], [opp]: [] }, tn: rnd(2), win: '', sc: (b && b.sc) || {}, log: [] };
      await S.put('bs', this.bs); this.all(JSON.stringify({ t: 'sys', x: '🚢 ' + n + ' Amiral Battı başlattı: ' + n + ' – ' + opp })); return this.bSend();
    }
    if (!b) return err('Önce yeni oyun başlat');
    if (T == 'bjoin') { if (b.ph == 'wait' && !b.pl.includes(n)) { await this.bJoin(n); } return }
    if (!b.pl.includes(n)) return err('Bu oyunda izleyicisin');
    if (b.ph == 'wait') return err('Rakip bekleniyor');
    if (T == 'bready') {
      if (b.ph != 'place') return;
      if (m.v) { const L = bLayout(m.L); if (!L) return err('Gemi yerleşimi geçersiz: gemiler tahtadan taşmamalı ve üst üste gelmemeli'); b.ships[n] = L; b.ready[n] = 1 } else b.ready[n] = 0;
      if (b.pl.every(p => b.ready[p])) { b.ph = 'play'; log('Savaş başladı! İlk atış: ' + b.pl[b.tn]); this.all(JSON.stringify({ t: 'sys', x: '🚢 Savaş başladı! İlk atış: ' + b.pl[b.tn] })) }
      await S.put('bs', b); return this.bSend();
    }
    if (T == 'bshot') {
      if (b.ph != 'play') return; if (b.pl[b.tn] !== n) return err('Sıra sende değil');
      const i = m.i | 0, opp = b.pl[1 - b.tn], mine = b.shots[n]; if (i < 0 || i > 99 || mine.includes(i)) return err('Buraya zaten ateş ettin');
      mine.push(i); const ship = b.ships[opp].find(s => s.cells.includes(i)), coord = 'ABCDEFGHIJ'[i / 10 | 0] + (i % 10 + 1);
      if (ship) {
        const sunk = ship.cells.every(c => mine.includes(c)); log(n + ' ' + coord + ': ' + (sunk ? 'BATIRDI! (' + BN[ship.k] + ')' : 'isabet'));
        if (b.ships[opp].every(s => s.cells.every(c => mine.includes(c)))) { b.ph = 'over'; b.win = n; b.sc[n] = (b.sc[n] || 0) + 1; log('🏆 ' + n + ' kazandı!'); this.all(JSON.stringify({ t: 'sys', x: '🏆 ' + n + ' Amiral Battı\'yı kazandı!' })) }
      } else { log(n + ' ' + coord + ': ıska'); b.tn = 1 - b.tn }
      await S.put('bs', b); return this.bSend();
    }
    if (T == 'bquit' && b.ph == 'wait') { this.bs = null; await S.delete('bs'); return this.bSend() }
    if (T == 'bquit') { if (b.ph == 'over') return; const opp = b.pl.find(p => p !== n); b.ph = 'over'; b.win = opp; if (opp) b.sc[opp] = (b.sc[opp] || 0) + 1; log(n + ' teslim oldu'); await S.put('bs', b); return this.bSend() }
  }

  // Bekleyen Amiral Battı'ya ikinci oyuncuyu al
  async bJoin(n) { const b = this.bs; if (!b || b.ph != 'wait' || b.pl.includes(n)) return; b.pl.push(n); b.shots[n] = []; b.ph = 'place'; b.tn = rnd(2);
    await this.s.storage.put('bs', b); this.all(JSON.stringify({ t: 'sys', x: '🚢 ' + n + ' Amiral Battı\'ya katıldı: ' + b.pl[0] + ' – ' + n })); this.bSend() }
  // Odaya giren kişi açık oyuna otomatik katılır
  async gameJoin(n) { if (!n) return; if (this.gsel == 'bs' && this.bs && this.bs.ph == 'wait') await this.bJoin(n);
    if (this.gsel == 'chess' && this.cs && this.cs.ph == 'wait') await this.cJoin(n);
    if (this.gsel == 'duel' && this.dg && !this.dg.over && !this.dg.pl.includes(n)) { this.dg.pl.push(n); await this.s.storage.put('dg', this.dg); this.dSend() } }
  // ---------- ortak oyun seçimi (değiştirmek için herkesin onayı) ----------
  gsView() { const p = this.gprop; return { g: this.gsel, p: p ? { to: p.to, by: p.by, ok: p.ok, need: this.names().filter(x => !p.ok.includes(x)), left: Math.max(0, p.dl - Date.now()) } : null } }
  async gsApply(g, by) { this.gsel = g; this.gprop = null; await this.s.storage.put('gsel', g); this.all(JSON.stringify({ t: 'sys', x: '🎮 Oyun değişti: ' + GNAME[g] })); this.bcast(); this.gameJoinAll() }
  gameJoinAll() { for (const n of this.names()) this.gameJoin(n) }
  async gsCheck() { const p = this.gprop; if (!p) return; if (Date.now() > p.dl) { this.gprop = null; this.all(JSON.stringify({ t: 'sys', x: '🎮 Oyun değiştirme isteği zaman aşımına uğradı' })); return this.bcast() }
    if (this.names().every(x => p.ok.includes(x))) return this.gsApply(p.to, p.by); this.bcast() }
  async gsMsg(ws, a, n, T, m) {
    if (T == 'gsel') { const g = String(m.g || ''); if (!GNAME[g] || g === this.gsel) return; if (!this.can(g == 'word' ? 'word' : 'games', a)) return this.deny(ws);
      if (this.names().filter(x => x !== n).length == 0) return this.gsApply(g, n);
      this.gprop = { to: g, by: n, ok: [n], dl: Date.now() + 60000 }; this.all(JSON.stringify({ t: 'sys', x: '🎮 ' + n + ' ' + GNAME[g] + ' oyununa geçmek istiyor' })); return this.gsCheck() }
    const p = this.gprop; if (!p) return;
    if (T == 'gvote') { if (m.ok) { if (!p.ok.includes(n)) p.ok.push(n); return this.gsCheck() } this.gprop = null; this.all(JSON.stringify({ t: 'sys', x: '🎮 ' + n + ' oyun değiştirmeyi kabul etmedi' })); return this.bcast() }
    if (T == 'gcancel' && p.by === n) { this.gprop = null; return this.bcast() }
  }

  // ---------- oyunlar: Satranç ----------
  cSend() { for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (!this.can('games', a)) continue; try { w.send(JSON.stringify({ t: 'cs', g: cView(this.cs, a.n) })) } catch (e) { } } }
  async cStart(c) { c.ph = 'play'; c.s = chNew(); c.keys = [chKey(c.s)]; c.hist = []; c.last = null; c.cap = { w: [], b: [] }; c.res = null; c.draw = ''; c.ts = Date.now();
    const tc = CTC[c.tcn]; c.tc = tc; c.clk = tc ? { w: tc.base, b: tc.base } : null;
    await this.s.storage.put('cs', c); this.all(JSON.stringify({ t: 'sys', x: '♟ Satranç başladı: ' + c.pl[0] + ' (beyaz) – ' + c.pl[1] + ' (siyah)' })); this.cSend() }
  async cEnd(c, w, why) { c.ph = 'over'; const name = w ? c.pl[w == 'w' ? 0 : 1] : ''; c.res = { w, name, why };
    if (name) c.sc[name] = (c.sc[name] || 0) + 1; else for (const p of c.pl) c.sc[p] = (c.sc[p] || 0) + 0.5;
    this.all(JSON.stringify({ t: 'sys', x: '♟ ' + (name ? name + ' kazandı' : 'Berabere') + ' (' + why + ')' })) }
  async cFlagCheck() { const c = this.cs; if (!c || c.ph != 'play' || !c.tc) return false; const k = cClk(c, Date.now()); if (k[c.s.turn] > 0) return false;
    c.clk[c.s.turn] = 0; await this.cEnd(c, c.s.turn == 'w' ? 'b' : 'w', 'Süre bitti'); await this.s.storage.put('cs', c); this.cSend(); return true }
  async cJoin(n) { const c = this.cs; if (!c || c.ph != 'wait' || c.pl.includes(n)) return; c.pl.push(n); if (rnd(2)) c.pl.reverse(); return this.cStart(c) }
  async cMsg(ws, a, n, T, m) {
    const S = this.s.storage, c = this.cs, err = e => { ws.send(JSON.stringify({ t: 'cerr', e })); if (this.cs) ws.send(JSON.stringify({ t: 'cs', g: cView(this.cs, n) })) };
    if (T == 'cnew') {
      if (this.gsel !== 'chess') return err('Oda şu an ' + (GNAME[this.gsel] || 'başka bir oyun') + ' oyununda. Önce oyunu değiştirin.');
      if (c && c.ph == 'play' && c.pl.includes(n)) return err('Devam eden bir oyun var; önce teslim ol ya da beraberlik teklif et');
      if (c && c.ph == 'play' && c.pl.some(x => this.names().includes(x))) return err('Odada süren bir satranç oyunu var; bitince yenisini başlatabilirsin');
      const others = this.names().filter(x => x !== n), opp = m.vs && others.includes(m.vs) ? m.vs : others[0], tcn = CTC.hasOwnProperty(m.tc) ? m.tc : 'none';
      this.cs = { id: crypto.randomUUID().slice(0, 8), pl: [n], ph: 'wait', tcn, sc: (c && c.sc) || {}, by: n };
      if (opp) { this.cs.pl.push(opp); if (rnd(2)) this.cs.pl.reverse(); return this.cStart(this.cs) }
      await S.put('cs', this.cs); return this.cSend();
    }
    if (!c) return err('Önce yeni oyun başlat');
    if (T == 'cjoin') return this.cJoin(n);
    if (T == 'cquit' && c.ph == 'wait') { this.cs = null; await S.delete('cs'); return this.cSend() }
    if (T == 'cflag') { if (await this.cFlagCheck()) return; return }
    const col = c.pl[0] === n ? 'w' : c.pl[1] === n ? 'b' : ''; if (!col) return err('Bu oyunda izleyicisin');
    if (c.ph != 'play') return;
    if (T == 'cmove') {
      if (await this.cFlagCheck()) return;
      if (c.s.turn !== col) return err('Sıra sende değil');
      const r = chMove(c.s, m.f | 0, m.to | 0, ['Q', 'R', 'B', 'N'].includes(m.p) ? m.p : 'Q', c.keys); if (r.e) return err(r.e);
      const now = Date.now(); if (c.tc) { c.clk[col] = Math.max(0, c.clk[col] - (now - c.ts)) + c.tc.inc } c.ts = now;
      c.s = { b: r.s.b, turn: r.s.turn, cas: r.s.cas, ep: r.s.ep, half: r.s.half, full: r.s.full }; c.keys.push(r.key); if (c.keys.length > 300) c.keys.splice(0, c.keys.length - 300);
      c.hist.push(r.san); c.last = { f: r.m.f, t: r.m.t }; if (r.cap) c.cap[col].push(r.cap); c.draw = '';
      if (r.res) await this.cEnd(c, r.res.w, r.res.why);
      await S.put('cs', c); return this.cSend();
    }
    if (T == 'cres') { await this.cEnd(c, col == 'w' ? 'b' : 'w', c.pl[col == 'w' ? 0 : 1] + ' teslim oldu'); await S.put('cs', c); return this.cSend() }
    if (T == 'cdraw') {
      if (m.a == 'offer') { if (c.draw) return; c.draw = col; this.all(JSON.stringify({ t: 'sys', x: '♟ ' + n + ' beraberlik teklif etti' })) }
      else if (m.a == 'accept' && c.draw && c.draw !== col) await this.cEnd(c, '', 'Anlaşmalı beraberlik');
      else if (m.a == 'decline' && c.draw && c.draw !== col) { c.draw = ''; this.all(JSON.stringify({ t: 'sys', x: '♟ ' + n + ' beraberliği kabul etmedi' })) }
      else return;
      await S.put('cs', c); return this.cSend();
    }
  }
  vroster() { const r = []; for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (a.v) r.push({ id: a.v, n: a.n, m: a.vm ? 1 : 0 }) } return r }
  vrSend() { this.all(JSON.stringify({ t: 'vr', r: this.vroster() })) }
  fhear() { const r = {}, sid = this.st && this.st.sid; if (!sid) return r; for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (a.n && a.fs && a.fs.k === sid) r[a.n] = { s: a.fs.s, e: a.fs.e } } return r }
  mhear() { const r = {}, rank = { ok: 4, buf: 3, pause: 2, need: 1 }; for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (!a.n || !a.mu) continue; if (!r[a.n] || (rank[a.mu] || 0) > (rank[r[a.n]] || 0)) r[a.n] = a.mu } return r }
  bcast() { this.all(this.msg()) }
  async webSocketMessage(ws, raw) {
    if (typeof raw != 'string' || raw.length > 980000) return;
    if (this.tg(ws).includes('admin')) return;
    let m; try { m = JSON.parse(raw) } catch (e) { return }
    if (!m || typeof m != 'object') return;
    const now = Date.now(), a = ws.deserializeAttachment() || {}, n = a.n, S = this.s.storage, T = m.t;
    const rl = this.rl.get(ws) || { t: now, c: 0 }; if (now - rl.t > 1000) { rl.t = now; rl.c = 0 } rl.c++; this.rl.set(ws, rl); if (rl.c > 40) return;
    if (T == 'ping') {
      if (this.wpm && now >= this.wpm.dl) await this.wpmCancel('Rakip ' + (WPM_MS / 1000) + ' saniye içinde yanıt vermedi. Hamle iptal edildi, harfler sende; tekrar deneyebilirsin.');
      if (this.pend && this.pend.by !== n && this.pend.p.length) { try { ws.send(this.pendMsg()) } catch (e) { } }
      if (this.st && this.st.url && this.st.playing && !this.st.held && now - (this.wlT || 0) > 30000) await this.wlSave();
      if (this.gprop && now > this.gprop.dl) await this.gsCheck();
      await this.cFlagCheck();
      if (this.wpm) { try { ws.send(this.wqMsg(n)) } catch (e) { } }
      if (this.hold(now)) { await S.put('st', this.st); this.bcast() } else ws.send(this.msg(+m.i || 0)); if (now - (this.lp || 0) > 30000) { this.lp = now; await this.report() }
      a.ls = now; try { ws.serializeAttachment(a) } catch (e) { }
      if (now - (this.lkAt || 0) > 4000) { this.lkAt = now; try { const r = await this.env.DO.get(this.env.DO.idFromName('db')).fetch('https://do/getlocks', { method: 'POST', body: '{}' }); await this.lkApply(await r.json()) } catch (e) { } }
      return }
    if (T == 'vjoin' || T == 'vleave' || T == 'vmute') {
      if (T == 'vjoin') {
        const id = String(m.id || ''); if (!/^[a-z0-9]{8,32}$/.test(id)) return;
        const cur = this.vroster(); if (!cur.some(x => x.id === id) && cur.length >= 8) return ws.send(JSON.stringify({ t: 'verr', e: 'Sesli sohbet dolu (en fazla 8 kişi).' }));
        for (const w of this.socks()) { if (w === ws) continue; const b = w.deserializeAttachment() || {}; if (b.v === id) { delete b.v; w.serializeAttachment(b) } }
        a.v = id; a.vm = m.m ? 1 : 0;
      } else if (T == 'vleave') { const old = a.v; delete a.v; delete a.vm; ws.serializeAttachment(a); if (old) this.all(JSON.stringify({ t: 'vbye', id: old })) } else { if (!a.v) return; a.vm = m.m ? 1 : 0 }
      ws.serializeAttachment(a); return this.vrSend();
    }
    if (T == 'vsig') {
      if (!a.v || typeof m.to != 'string' || !m.d || typeof m.d != 'object') return;
      const d = JSON.stringify(m.d); if (d.length > 60000) return;
      const out = JSON.stringify({ t: 'vsig', from: a.v, n, d: m.d });
      for (const w of this.socks()) { const b = w.deserializeAttachment() || {}; if (b.v === m.to) { try { w.send(out) } catch (e) { } break } }
      return;
    }
    if (T == 'mst') { const v = ['ok', 'buf', 'need', 'pause', 'off'].includes(m.s) ? m.s : 'off'; if (a.mu === v) return; a.mu = v; ws.serializeAttachment(a); return this.bcast() }
    if (T == 'fst') {
      const s = ['ok', 'load', 'err', 'tap'].includes(m.s) ? m.s : null; if (!s || !this.st || m.k !== this.st.sid) return;
      const prev = a.fs || {}; if (prev.s === s && prev.k === m.k) return;
      a.fs = { s, k: m.k, e: String(m.e || '').slice(0, 60), t: now }; if (s != 'load') a.b = 0; ws.serializeAttachment(a);
      if (this.hold(now)) await S.put('st', this.st); return this.bcast();
    }
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
    if (T == 'mqadd' || T == 'mqrm' || T == 'mqup' || T == 'mqnext' || T == 'mqload' || T == 'mqclr' || T == 'mend') {
      if (!this.can('music', a)) return this.deny(ws);
      const q = this.mq, nid = () => crypto.randomUUID().slice(0, 8);
      if (T == 'mqadd') { const tr = cleanTr(m.tr); if (!tr) return; if (q.length >= 50) return ws.send(JSON.stringify({ t: 'sys', x: 'Sıra dolu (en fazla 50 şarkı)' })); q.push({ id: nid(), tr, by: n }); if (!this.ms || !this.ms.tr) return this.mqNext() }
      else if (T == 'mqload') { const items = (Array.isArray(m.items) ? m.items : []).slice(0, 100).map(cleanTr).filter(Boolean).map(tr => ({ id: nid(), tr, by: n })); if (!items.length) return;
        if (m.mode == 'play') { this.mq = items.slice(0, 50); return this.mqNext() } this.mq = q.concat(items).slice(0, 50); if (!this.ms || !this.ms.tr) return this.mqNext() }
      else if (T == 'mqrm') this.mq = q.filter(x => x.id !== m.id);
      else if (T == 'mqup') { const i = q.findIndex(x => x.id === m.id); if (i > 0) [q[i - 1], q[i]] = [q[i], q[i - 1]]; else return }
      else if (T == 'mqclr') this.mq = [];
      else if (T == 'mqnext') { if (!q.length) return; return this.mqNext() }
      else if (T == 'mend') { const ms = this.ms; if (!ms || !ms.playing || +m.rev !== ms.rev) return; if (q.length) return this.mqNext();
        this.ms = { ...ms, playing: false, pos: 0, at: now, rev: ms.rev + 1 }; await S.put('ms', this.ms); return this.bcast() }
      await S.put('mq', this.mq); return this.bcast();
    }
    if (T == 'fdur') { if (this.st && m.u === this.st.url) this.fd = { u: m.u, d: Math.max(0, Math.min(1e6, Math.round(+m.d || 0))) }; return }
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
    if (T == 'cnew' || T == 'cmove' || T == 'cres' || T == 'cdraw' || T == 'cjoin' || T == 'cquit' || T == 'cflag') { if (!this.can('games', a)) return this.deny(ws); return this.cMsg(ws, a, n, T, m) }
    if (T == 'dnew' || T == 'dguess') { if (!this.can('games', a)) return this.deny(ws); return this.dMsg(ws, a, n, T, m) }
    if (T == 'gsel' || T == 'gvote' || T == 'gcancel') return this.gsMsg(ws, a, n, T, m);
    if (T == 'bnew' || T == 'bready' || T == 'bshot' || T == 'bquit' || T == 'bjoin') { if (!this.can('games', a)) return this.deny(ws); return this.bMsg(ws, a, n, T, m) }
    if (T && T[0] == 'w') {
      if (!this.can('word', a)) return this.deny(ws);
      if (T == 'wpend') { this.pendSet(n, m.p, m.s); return this.wprev(ws, n, m.s) }
      if (T == 'wans') return this.wpmAnswer(n, m);
      if (this.wpm && (T == 'wplay' || T == 'wpass' || T == 'wex' || T == 'wundo' || T == 'wobj' || T == 'wnew')) return ws.send(JSON.stringify({ t: 'werr', e: 'Rakibin onayı bekleniyor, birkaç saniye bekle.' }));
      const g = this.wg; let r = null, chk = null;
      if (T == 'wnew') {
        if (this.gsel !== 'word') return ws.send(JSON.stringify({ t: 'werr', e: 'Oda şu an ' + (GNAME[this.gsel] || 'başka bir oyun') + ' oyununda. Önce oyunu değiştirin.' }));
        if (g && !g.over) return ws.send(JSON.stringify({ t: 'werr', e: 'Önce mevcut oyunu bitir (teslim ol)' }));
        const names = [...new Set(this.socks().filter(w => !this.tg(w).includes('admin') && this.can('word', w.deserializeAttachment() || {})).map(w => (w.deserializeAttachment() || {}).n))].filter(Boolean);
        if (names.length < 2 || names.indexOf(n) < 0) return ws.send(JSON.stringify({ t: 'werr', e: 'Oyun için odada en az iki kişi olmalı' }));
        const pls = [n, ...shuf(names.filter(x => x !== n))].slice(0, 4);
        this.wg = wgNew(pls); this.dwarm(); this.all(JSON.stringify({ t: 'sys', x: '🔤 Kelimelik başladı: ' + this.wg.pl.join(', ') })); r = { ok: 1 };
      } else if (g) {
        const snap = wgSnap(g);
        if (T == 'wplay') r = await this.wplay(g, n, m);
        else if (T == 'wpass') r = wgPass(g, n);
        else if (T == 'wex') r = wgEx(g, n, m.ix, m.ls);
        else if (T == 'wres') { r = wgRes(g, n); if (r.ok && this.wpm && (this.wpm.by === n || g.over)) await this.wpmCancel(null) }
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
      await this.wlSave(); this.fd = null;
      const title = String(m.title || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 100);
      ns = { url, ref, title, playing: false, held: false, pos: Math.max(0, Math.min(1e6, +m.pos || 0)), at: now, by: n };
      this.socks().forEach(w => { const q = w.deserializeAttachment() || {}; q.b = 0; delete q.fs; w.serializeAttachment(q) });
      ns.sid = now.toString(36) + Math.random().toString(36).slice(2, 6);
      this.all(JSON.stringify({ t: 'sys', x: n + ' ' + (title ? '“' + title + '” filmini' : 'yeni bir video') + ' yükledi' }));
    }
    else if (T == 'play') { ns = { ...st, playing: true, pos, at: now, by: n } }
    else if (T == 'pause') { ns = { ...st, playing: false, held: false, pos, at: now, by: n } }
    else if (T == 'seek') ns = { ...st, pos, at: now, by: n };
    else return;
    ns.rev = (st.rev || 0) + 1; this.st = ns; this.hold(now);
    await S.put('st', this.st); this.bcast(); if (T == 'set') await this.report(); if (T == 'pause') await this.wlSave();
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
    if (p == '/dictrand') {
      const N = Math.max(4, Math.min(7, b.n | 0 || 5)), re = new RegExp('^[a-zçğıiöşü]{' + N + '}$');
      for (let t = 0; t < 400; t++) { const k = lex.b[Math.random() * lex.b.length | 0]; if (!k || k.length < 3) continue; const L = k.split('\n').filter(w => re.test(w) && wordShape(w)); if (L.length) return Response.json({ w: L[Math.random() * L.length | 0] }) }
      return Response.json({ w: '' });
    }
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
  approvers(g, by) { return g ? wgAct(g).filter(x => x !== by && this.hasSock(x)) : [] }
  hasSock(nm) { return this.socks().some(w => !this.tg(w).includes('admin') && (w.deserializeAttachment() || {}).n === nm) }
  wqMsg(forName) {
    const q = this.wpm; if (!q) return JSON.stringify({ t: 'wq', id: null });
    const g = this.wg, ok = g ? this.approvers(g, q.by).includes(forName) : false;
    return JSON.stringify({ t: 'wq', id: ok ? q.id : '', n: g ? this.approvers(g, q.by).length : 0, by: q.by, mv: q.mv, words: q.words, left: Math.max(0, q.dl - Date.now()) });
  }
  wqSend() { for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (!this.can('word', a)) continue; try { w.send(this.wqMsg(a.n)) } catch (e) { } } }
  wpmArm() { clearTimeout(this.wpmT); if (!this.wpm) return; this.wpmT = setTimeout(() => { this.wpmExpire().catch(() => { }) }, Math.max(0, this.wpm.dl - Date.now()) + 250) }
  async wpmExpire() { if (this.wpm && Date.now() >= this.wpm.dl) await this.wpmCancel((this.wg && wgAct(this.wg).length > 2 ? 'Rakiplerden hiçbiri ' : 'Rakip ') + (WPM_MS / 1000) + ' saniye içinde yanıt vermedi. Hamle iptal edildi, harfler sende; tekrar deneyebilirsin.') }
  async wpmCancel(reason) {
    const q = this.wpm; if (!q) return; this.wpm = null; clearTimeout(this.wpmT); await this.s.storage.delete('wpm'); this.wqSend();
    if (reason) for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (a.n === q.by) try { w.send(JSON.stringify({ t: 'wrej', mv: q.mv, e: reason })) } catch (e) { } }
  }
  async wpmStart(g, n, p, unk) {
    if (!this.approvers(g, n).length) return { e: '“' + unk.join(', ') + '” sözlükte bulunamadı ve ' + (wgAct(g).length > 2 ? 'rakiplerin' : 'rakip') + ' odada olmadığı için onay alınamadı. Rakip gelince tekrar dene.' };
    const pl = p.map(q => ({ i: q.i | 0, l: String(q.l || ''), j: q.j ? 1 : 0 }));
    this.wpm = { id: crypto.randomUUID(), by: n, mv: g.mv, p: pl, words: unk, dl: Date.now() + WPM_MS };
    await this.s.storage.put('wpm', this.wpm); this.wpmArm(); this.wqSend(); return null;
  }
  async wpmAnswer(n, m) {
    const q = this.wpm, g = this.wg;
    // Sahte/yetkisiz onayları yok say: yalnız sırası olmayan RAKİP, doğru kimlik ve doğru hamle için cevap verebilir
    if (!q || !g || g.over || m.id !== q.id || n === q.by || g.pl.indexOf(n) < 0 || (g.out || []).includes(n) || g.mv !== q.mv || g.pl[g.tn] !== q.by) return;
    if (m.ok !== true) return this.wpmCancel((wgAct(g).length > 2 ? n : 'Rakip') + ' “' + q.words.join(', ') + '” kelimesini kabul etmedi. Hamle iptal edildi; harfler sende, sıra sende.');
    const test = JSON.parse(JSON.stringify(g)), tr = wgPlay(test, q.by, q.p);
    if (!tr.ok) return this.wpmCancel('Hamle artık geçerli değil: ' + tr.e);
    this.wpm = null; clearTimeout(this.wpmT); await this.s.storage.delete('wpm');
    const snap = wgSnap(g), r = wgPlay(g, q.by, q.p); g.prev = snap;
    const un = new Set(q.words.map(trLower)); for (const x of r.words) x.ok = un.has(trLower(x.w)) ? 2 : true;
    for (const k of un) this.wacc.add(k); if (this.wacc.size > 300) this.wacc = new Set([...this.wacc].slice(-300));
    await this.s.storage.put('wacc', [...this.wacc]); await this.s.storage.put('wg', g);
    this.pendClear(); this.wsend(); this.wqSend();
    if (wgAct(g).length > 2) this.all(JSON.stringify({ t: 'sys', x: '✅ ' + n + ' “' + q.words.join(', ') + '” kelimesini onayladı' }));
    this.s.waitUntil(dictf(this.env, '/dictacc', { words: [...un] }).catch(() => { }));
  }
  // Sırası olan oyuncunun henüz oynanmamış taslak harfleri: yalnız bellekte, puana/tahtaya etkisi yok. Sıra numarası (s) eski taslağın yenisini ezmesini önler.
  pendMsg() { const p = this.pend; return JSON.stringify({ t: 'wpend', by: p ? p.by : '', mv: p ? p.mv : 0, p: p ? p.p : [], s: p && this.pq && this.pq.n === p.by && this.pq.mv === p.mv ? this.pq.s : 0 }) }
  pendSend(except) { const m = this.pendMsg(); for (const w of this.socks()) { if (this.tg(w).includes('admin')) continue; const a = w.deserializeAttachment() || {}; if (except && a.n === except) continue; if (!this.can('word', a)) continue; try { w.send(m) } catch (e) { } } }
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
    const leaver = (ws.deserializeAttachment() || {}).n;
    try { ws.close(1000) } catch (e) { } this.rl.delete(ws); if (this.tg(ws).includes('admin')) return;
    if (this.pend && !this.socks().some(w => (w.deserializeAttachment() || {}).n === this.pend.by)) this.pendClear();
    if (this.st && this.st.url && leaver) await this.wlSave([leaver]);
    if (this.gprop) { if (this.gprop.by === leaver) { this.gprop = null } else await this.gsCheck() }
    if (this.wpm) { const q = this.wpm, g = this.wg; if (!this.hasSock(q.by)) await this.wpmCancel(null); else if (!this.approvers(g, q.by).length) await this.wpmCancel('Rakibin bağlantısı koptu. Hamle iptal edildi, harfler sende; tekrar deneyebilirsin.') }
    const now = Date.now(); if (this.hold(now)) await this.s.storage.put('st', this.st);
    this.bcast(); this.vrSend(); await this.report(); if (!this.socks().length) await this.s.storage.setAlarm(now + 6 * 36e5);
  }
  async webSocketClose(ws) { await this.gone(ws) }
  async webSocketError(ws) { await this.gone(ws) }
  async alarm() {
    await this.vsweep(); if (this.socks().length) return;
    await this.s.storage.deleteAll(); this.st = fresh(); this.pzp = null; this.pzi = null; this.chat = []; this.code = ''; this.roomMode = 1; this.roomModeSet = false; this.ms = null; this.mq = []; this.dg = null; this.bs = null; this.cs = null; this.gsel = 'duel'; this.gprop = null; this.wg = null; this.wpm = null; this.wacc = new Set(); clearTimeout(this.wpmT);
  }
}
