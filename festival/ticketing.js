(() => {
 const config=window.FESTIVAL_CONFIG || {}, form=document.getElementById('order-form'), box=document.getElementById('order-box'), message=document.getElementById('order-message');
 const query=new URLSearchParams(location.search), keys=['utm_source','utm_medium','utm_campaign'];
 try { keys.forEach(k=>{ if(query.has(k)) sessionStorage.setItem('festival_'+k,query.get(k).slice(0,120)); }); } catch (_) {}
 if(!config.salesEnabled || !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(config.endpoint || '')) return;
 box.hidden=false; document.querySelectorAll('.sales-notice').forEach(e=>e.hidden=true);
 const pass=document.getElementById('pass'), classes=[...document.querySelectorAll('.class-choice')];
 pass.addEventListener('change',()=>{if(pass.checked) classes.forEach(c=>c.checked=false)}); classes.forEach(c=>c.addEventListener('change',()=>{if(c.checked) pass.checked=false}));
 let orderId='';
 form.addEventListener('submit',async e=>{
  e.preventDefault(); const products=pass.checked?['CREATOR_PASS']:classes.filter(c=>c.checked).map(c=>c.value); if(!products.length){message.textContent='請選擇門票或公開課。';return}
  if(!window.crypto || !crypto.randomUUID){message.textContent='請使用較新的瀏覽器報名。';return}
  if(!orderId) orderId='LMC-'+crypto.randomUUID();
  const data={orderId,products,buyerName:form.buyerName.value,email:form.email.value,phone:form.phone.value,participant:form.participant.value};
  keys.forEach(k=>{try{data[k]=sessionStorage.getItem('festival_'+k)||''}catch(_){data[k]=query.get(k)||''}});
  const btn=form.querySelector('button'); btn.disabled=true; message.textContent='正在提交…';
  try {const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data)}); const result=await response.json(); if(!result.ok) throw Error(result.error||'提交失敗'); form.hidden=true; message.replaceChildren(); const heading=document.createElement('strong'); heading.textContent='已收到報名申請，付款及名額仍待確認。'; const p=document.createElement('p'); p.textContent='訂單編號：'+result.orderId+' · HK$'+result.amount+' · 狀態：'+result.status; const instructions=document.createElement('p'); instructions.textContent=result.instructions; message.append(heading,p,instructions); }
  catch(err){message.textContent='未能確認提交結果。請保留此頁並重試，或聯絡 SVA。訂單編號：'+orderId+'。 '+err.message;btn.disabled=false;}
 });
})();
