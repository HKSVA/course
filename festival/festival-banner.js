/* Homepage-only additive banner. Does not replace course HTML or its scripts. */
(() => {
 const insert=()=>{
  if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
  if(document.getElementById('sva-festival-promotion'))return;
  const host=document.createElement('section');host.id='sva-festival-promotion';host.setAttribute('aria-label','廣東歌文化節 2026');
  const shadow=host.attachShadow({mode:'open'});
  shadow.innerHTML=`<style>:host{display:block;background:#002d1d;color:#f8efdc}*{box-sizing:border-box}.banner{max-width:1200px;margin:auto;display:grid;grid-template-columns:1.1fr 1fr;align-items:center;gap:36px;padding:32px 5%;font-family:system-ui,-apple-system,sans-serif;line-height:1.6}.art{width:100%;max-height:440px;object-fit:contain;display:block}.eyebrow{color:#54f3cf;font-size:13px;letter-spacing:.1em;font-weight:800}h2{font-size:clamp(30px,4vw,58px);line-height:1.08;margin:12px 0}p{font-size:16px;margin:14px 0}.cta{display:inline-block;padding:13px 24px;background:#54f3cf;color:#002d1d;font-weight:800;border-radius:4px;text-decoration:none}.cta:focus-visible{outline:3px solid white;outline-offset:4px}@media(max-width:700px){.banner{grid-template-columns:1fr;gap:12px;padding:24px 6%}.art{max-height:310px}.text{order:2}h2{font-size:34px}}</style><div class="banner"><div class="text"><div class="eyebrow">11–12 DEC 2026 · PARSONS HALL</div><h2>CANTOPOP FEST 2026<br>廣東歌文化節</h2><p>兩日，參與一首廣東歌的誕生。<br>星級公開課・全民造歌・MUSIC LIVE</p><p>創作人 PASS HK$2,772<br>公開課每堂 HK$400 · MUSIC LIVE 每場 HK$180</p><a class="cta" href="/festival/">查看活動及購票 →</a></div><a href="/festival/" aria-label="查看廣東歌文化節"><img class="art" src="/festival/assets/hero.jpg" alt="CANTOPOP FEST 2026 全民造歌官方海報" width="1080" height="1350" fetchpriority="high"></a></div>`;
  const qs=new URLSearchParams(location.search),keep=new URLSearchParams();['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k=>{if(qs.has(k))keep.set(k,qs.get(k))});
  shadow.querySelectorAll('a').forEach(a=>a.href='/festival/'+(keep.size?'?'+keep.toString():''));
  const nav=document.querySelector('body > nav, body > div > nav, body > header');if(nav)nav.after(host);else document.body.prepend(host);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',insert,{once:true});else insert();
})();
