/* Homepage-only additive banner. Does not replace course HTML or its scripts. */
(() => {
 const insert=()=>{
  if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
  if(document.getElementById('sva-festival-promotion'))return;
  const host=document.createElement('section');host.id='sva-festival-promotion';host.setAttribute('aria-label','廣東歌文化節 2026');
  const shadow=host.attachShadow({mode:'open'});
  shadow.innerHTML=`<style>:host{display:block;background:#002d1d;color:#f8efdc}*{box-sizing:border-box}.banner{max-width:1500px;margin:auto;padding:24px 5%;font-family:system-ui,-apple-system,sans-serif}.art{width:100%;height:auto;display:block}.cta{display:inline-block;margin-top:16px;padding:13px 24px;background:#54f3cf;color:#002d1d;font-weight:800;border-radius:4px;text-decoration:none}a:focus-visible{outline:3px solid white;outline-offset:4px}@media(max-width:700px){.banner{padding:16px 4%}.cta{display:block;text-align:center}}</style><div class="banner"><a href="/festival/" aria-label="查看廣東歌文化節"><img class="art" src="/festival/assets/festival-banner-20261120.png" alt="CANTOPOP FEST 2026 廣東歌文化節，12月11至13日全民造歌及音樂會" width="2057" height="764" fetchpriority="high"></a><a class="cta" href="/festival/">查看活動及購票</a></div>`;
  const qs=new URLSearchParams(location.search),keep=new URLSearchParams();['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k=>{if(qs.has(k))keep.set(k,qs.get(k))});
  shadow.querySelectorAll('a').forEach(a=>a.href='/festival/'+(keep.size?'?'+keep.toString():''));
  const nav=document.querySelector('body > nav, body > div > nav, body > header');if(nav)nav.after(host);else document.body.prepend(host);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',insert,{once:true});else insert();
})();
