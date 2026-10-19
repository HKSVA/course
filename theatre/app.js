'use strict';
const ENDPOINT='https://script.google.com/macros/s/AKfycbylMatG6GUvgeEbx-i3Vr12ttMGMzqMNc_a1M5c57lUzC_-7ciu_L4irxKmNmCDgLMP/exec';
const COURSE='《我。們。之間的距離》廣東歌音樂劇場';
const $=id=>document.getElementById(id);
let submitting=false,submitted=false;
for(const id of ['regular','student'])for(let i=0;i<=9;i++)$(id).add(new Option(String(i),String(i)));
$('regular').value='1';
function selection(){const regular=Number($('regular').value),student=Number($('student').value);return {regular,student,count:regular+student,price:regular*250+student*200};}
function updateTotal(){const s=selection();$('count').textContent=s.count+' 張';$('total').textContent='HK$'+s.price;$('quantityError').textContent=s.count<1?'請選擇至少 1 張門票。':s.count>9?'每次最多購買 9 張；團體購票請 WhatsApp 查詢。':'';$('submitBtn').disabled=submitting||submitted||s.count<1||s.count>9;}
for(const id of ['regular','student'])$(id).addEventListener('change',updateTotal);
function setPay(mode){const fps=mode==='fps';$('payFps').hidden=!fps;$('payBank').hidden=fps;$('tabFps').setAttribute('aria-pressed',String(fps));$('tabBank').setAttribute('aria-pressed',String(!fps));}
$('tabFps').onclick=()=>setPay('fps');$('tabBank').onclick=()=>setPay('bank');
function buildPayload(){const s=selection();if(!Number.isInteger(s.regular)||!Number.isInteger(s.student)||s.regular<0||s.student<0||s.count<1||s.count>9)throw Error('每次請選購 1 至 9 張門票。');const name=$('fName').value.trim(),phone=$('fPhone').value.trim(),email=$('fEmail').value.trim();if(!name||!phone||!email)throw Error('請填寫姓名、電話及電郵。');const breakdown=`正價 ${s.regular} 張 × HK$250；中學生、大學生及 SVA 學員 ${s.student} 張 × HK$200；共 ${s.count} 張；總額 HK$${s.price}`;return {name,phone,email,course:COURSE,status:'General',enrolmentType:breakdown,session:'2026年10月19日 17:00｜19:00 演後藝人談',remarks:breakdown+($('fNote').value.trim()?'\n備註：'+$('fNote').value.trim():''),price:s.price,sheetTab:'Theatre - 距離 2026'};}
$('ticketForm').addEventListener('submit',async event=>{event.preventDefault();if(submitting||submitted)return;if(!$('ticketForm').reportValidity())return;let data;try{data=buildPayload();}catch(error){$('submitStatus').textContent=error.message;return;}submitting=true;updateTotal();$('submitBtn').textContent='提交中…';$('submitStatus').textContent='';try{await fetch(ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data)});submitted=true;$('submitStatus').textContent='購票申請已送出，請繼續付款及傳送單據，由 SVA 確認。若未收到電郵，請 WhatsApp 查詢，毋須重複提交。';$('submitBtn').textContent='申請已送出';for(const el of $('ticketForm').querySelectorAll('input,select,textarea'))el.disabled=true;}catch(error){$('submitStatus').textContent='暫時未能確認提交結果。如已付款或曾提交，請先 WhatsApp 查詢，避免重複報名。';$('submitBtn').textContent='重新提交購票申請';}finally{submitting=false;$('successWa').href='https://wa.me/85268984558?text='+encodeURIComponent('你好！我想確認《我。們。之間的距離》購票及付款詳情。姓名：'+data.name+'；電話：'+data.phone+'；'+data.enrolmentType);$('followup').hidden=false;updateTotal();}});
updateTotal();

const COURSE_2027='VOICES MEET THEATRE 音樂X劇場演員培訓 2027';
const COURSE_FEES={
  full:{General:14000,Student:12600,'SVA Student':12600,'Early Bird Theatre Audience':11600},
  part12:{General:4400,Student:3960,'SVA Student':3960,'Early Bird Theatre Audience':3800}
};
let courseSubmitting=false,courseSubmitted=false;
function courseSelection(){
  const packageKey=$('cPackage').value,status=$('cStatus').value;
  const packageName=packageKey==='full'?'全期課程（5個月）':'第一及第二部分（2個月／8課）';
  const statusName=status==='Early Bird Theatre Audience'?'今日劇場觀眾早鳥':status==='SVA Student'?'SVA學生':status==='Student'?'中學生／大學生':'一般報名';
  return {packageKey,packageName,status,statusName,price:COURSE_FEES[packageKey][status]};
}
function updateCourseTotal(){
  const c=courseSelection();
  $('courseFeeLabel').textContent=c.statusName;
  $('courseTotal').textContent='HK$'+c.price.toLocaleString('en-HK');
  $('courseSubmitBtn').disabled=courseSubmitting||courseSubmitted;
}
$('cPackage').addEventListener('change',updateCourseTotal);
$('cStatus').addEventListener('change',updateCourseTotal);
$('courseForm').addEventListener('submit',async event=>{
  event.preventDefault();
  if(courseSubmitting||courseSubmitted||!$('courseForm').reportValidity())return;
  const c=courseSelection(),name=$('cName').value.trim(),phone=$('cPhone').value.trim(),email=$('cEmail').value.trim();
  if(!name||!phone||!email){$('courseSubmitStatus').textContent='請填寫姓名、電話及電郵。';return;}
  const data={
    courseKey:'voicesMeetTheatre2027',pricingPackage:c.packageKey,name,phone,email,
    course:COURSE_2027,status:c.status,enrolmentType:c.packageName,
    session:'2027年1月開班',remarks:c.packageName+'；'+c.statusName+($('cNote').value.trim()?'\n備註：'+$('cNote').value.trim():''),
    price:c.price,sheetTab:'Voices Meet Theatre 2027'
  };
  courseSubmitting=true;updateCourseTotal();$('courseSubmitBtn').textContent='提交中…';$('courseSubmitStatus').textContent='';
  try{
    await fetch(ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data)});
    courseSubmitted=true;$('courseSubmitStatus').textContent='課程報名已送出。SVA 將聯絡你確認優惠資格及付款安排。';$('courseSubmitBtn').textContent='報名已送出';
    for(const el of $('courseForm').querySelectorAll('input,select,textarea'))el.disabled=true;
  }catch(error){
    $('courseSubmitStatus').textContent='暫時未能確認提交結果，請按 WhatsApp 與 SVA 聯絡，避免重複提交。';$('courseSubmitBtn').textContent='重新提交課程報名';
  }finally{
    courseSubmitting=false;
    $('courseSuccessWa').href='https://wa.me/85268984558?text='+encodeURIComponent('你好！我想確認 VOICES MEET THEATRE 2027 課程報名。姓名：'+name+'；電話：'+phone+'；'+c.packageName+'；'+c.statusName+'；HK$'+c.price.toLocaleString('en-HK'));
    $('courseFollowup').hidden=false;updateCourseTotal();
  }
});
updateCourseTotal();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_ticket_selection',description:'Read current ticket quantities and calculated total. Does not submit an order.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>selection()})).catch(()=>{});}catch{}}
