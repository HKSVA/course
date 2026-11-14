/* Wing checkout presentation; uses the existing ticketing.js/Apps Script contract. */
(() => {
 'use strict';
 const $=s=>document.querySelector(s), modal=$('#purchase'), form=$('#order-form');
 if(!modal||!form)return;
 const submit=form.querySelector('button[type="submit"]'), next=$('#wizard-next'), back=$('#wizard-back');
 const titles=['選擇你的參與方式','揀好場次，一起參與。','填寫參加者資料','核對你的訂單','付款及上載單據'];
 const labels=['選擇體驗','場次及數量','參加者','核對訂單','付款單據'];
 const images={CREATOR_PASS:'hero-20261114.jpg',D1_VOCAL:'Guddy.png',D1_SONGWRITING:'02_J-Arie.png',D1_LYRIC:'Oscar.png',D2_VOCAL_SCIENCE:'Guddy.png',D2_PERFORMANCE:'Manson.png',D2_HARMONY:'Ah-Lee.png',LIVE_D1:'live-1.jpg',LIVE_D2:'live-2.jpg'};
 let step=0,returnFocus=null,completed=false;
 const selected=()=>$('#pass').checked?['CREATOR_PASS']:[...document.querySelectorAll('.class-choice:checked')].map(x=>x.value);
 const quantity=sku=>Number(document.querySelector('[data-quantity="'+sku+'"]').value);
 const input=sku=>sku==='CREATOR_PASS'?$('#pass'):document.querySelector('.class-choice[value="'+sku+'"]');
 const money=n=>'HK$'+Number(n).toLocaleString('en-HK');
 function summary(){
  const list=$('#review-tickets');list.replaceChildren();
  for(const sku of selected()){
   const label=input(sku).closest('label'),row=document.createElement('div');row.className='review-ticket';
   const img=document.createElement('img');img.src='assets/'+images[sku];img.alt='';
   const text=document.createElement('div'),name=document.createElement('strong'),date=document.createElement('small'),names=document.createElement('small'),price=document.createElement('b');
   name.textContent=label.querySelector('.option-name').textContent;date.textContent=label.querySelector('.option-date').textContent;
   const attendeeInputs=[...document.querySelectorAll('[data-participant-sku="'+sku+'"]')];
   const attendees=$('#same-participant').checked?Array(quantity(sku)).fill(form.buyerName.value.trim()):attendeeInputs.map(x=>x.value.trim());
   names.textContent=quantity(sku)+' 份 · 參加者：'+attendees.join('、');price.textContent=money(quantity(sku)*(sku==='CREATOR_PASS'?2772:sku.startsWith('LIVE_')?180:400));
   text.append(name,date,names);row.append(img,text,price);list.append(row);
  }
  const dl=$('#review-details');dl.replaceChildren();
  [['購買人',form.buyerName.value],['電郵',form.email.value],['電話',form.phone.value]].forEach(([k,v])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;dl.append(dt,dd)});
 }
 function go(n){
  step=n;document.querySelectorAll('[data-step]').forEach(x=>x.hidden=Number(x.dataset.step)!==n);
  $('#purchase-title').textContent=completed?'訂票狀態':titles[n];$('#kicker').textContent=completed?'CANTOPOP FEST 2026':'STEP '+(n+1)+' / 5';
  const progress=$('#progress');progress.replaceChildren();labels.forEach((label,i)=>{const x=document.createElement('span');x.textContent=String(i+1).padStart(2,'0')+' '+label;x.classList.toggle('active',i<=n);if(i===n)x.setAttribute('aria-current','step');progress.append(x)});
  next.hidden=n===0||n>=3||completed;submit.hidden=n<3||completed;back.hidden=n===0||completed;
  if(n===3)summary();$('#checkout-scroll').scrollTop=0;
  if(modal.open)$('#purchase-title').focus();
 }
 function choose(sku){
  if(sku==='classes'||sku==='live'){if(!$('#pass').disabled&&$('#pass').checked){$('#pass').checked=false;$('#pass').dispatchEvent(new Event('change',{bubbles:true}))}$('#checkout-poster').src='assets/'+(sku==='classes'?'02_J-Arie.png':'live-1.jpg');return}
  const c=input(sku);if(c&&!c.disabled){c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}));$('#checkout-poster').src='assets/'+images[sku]}
 }
 function open(sku,origin){
  returnFocus=origin;modal.showModal();$('#order-box').hidden=false;
  const cfg=window.FESTIVAL_CONFIG||{},ready=cfg.salesEnabled&&/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(cfg.endpoint||'');
  $('#checkout-unavailable').hidden=!!ready;
  if(completed){go(5);return}
  if(!$('#checkout-payment').hidden){go(4);return}
  // An existing draft/hold belongs to this customer: don't replace its choice through an entry CTA.
  let saved;try{saved=JSON.parse(sessionStorage.getItem('festival_reservation_v1')||'null')}catch(_){}
  if(saved){go(saved.editing?1:step);return}
  if(sku){choose(sku);go(1)}else go(0);
 }
 function close(){modal.close();returnFocus?.focus()}
 document.querySelectorAll('[data-entry]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();open(b.dataset.entry,b)}));
 document.querySelectorAll('[data-experience]').forEach(b=>b.addEventListener('click',()=>{choose(b.dataset.experience);go(1)}));
 $('#close-modal').addEventListener('click',close);modal.addEventListener('cancel',e=>{e.preventDefault();close()});
 next.addEventListener('click',()=>{
  if(step===1){if(!selected().length){$('#order-message').textContent='請先選擇門票或課堂。';return}$('#order-message').textContent='';go(2)}
  else if(step===2){const invalid=[...document.querySelectorAll('[data-step="2"] input')].find(x=>!x.disabled&&!x.checkValidity());if(invalid){invalid.reportValidity();return}$('#order-message').textContent='';go(3)}
 });
 back.addEventListener('click',()=>{if(step===4){$('#back-to-selection').click();return}go(Math.max(0,step-1))});
 // Enter must advance a visible step instead of prematurely creating a reservation.
 form.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.type!=='file'&&step<3){e.preventDefault();next.click()}});
 form.addEventListener('submit',e=>{if(step<3){e.preventDefault();e.stopImmediatePropagation()}},true);
 document.querySelectorAll('.class-choice,#pass,[data-quantity]').forEach(c=>c.addEventListener('change',()=>{const sku=c.id==='pass'?'CREATOR_PASS':c.dataset.quantity||c.value;if(images[sku])$('#checkout-poster').src='assets/'+images[sku]}));
 window.addEventListener('festival:hold',()=>go(4));window.addEventListener('festival:edit',()=>go(1));window.addEventListener('festival:complete',()=>{completed=true;go(5)});
 go($('#checkout-payment').hidden?0:4);
})();
