'use strict';
const invite = document.querySelector('#invite-view');
const success = document.querySelector('#success-view');
const no = document.querySelector('#no-button');
const yes = document.querySelector('#yes-button');
const speech = document.querySelector('#speech');
const tease = document.querySelector('#tease');
const zone = document.querySelector('#answer-zone');
const reply = '我同意啦！本周六（10月24日）一起去珠海约会，约好了 ♡';
const lines = [
  ['诶？没点到吧', '“不去”突然想散个步。'],
  ['再考虑一下嘛 ♡', '你看，“好呀”一直乖乖在等你。'],
  ['可是我想见你诶', '这个按钮，好像比我还害羞。'],
  ['那……请你吃好吃的？', '已开启：撒娇模式。'],
  ['海风也在等你', '珠海 + 周六 + 你，刚刚好。'],
  ['真的不再想一下嘛', '它跑它的，我们约我们的。'],
  ['好啦，被你发现了 ♡', '这是一份有点调皮、但很认真的邀请。']
];
const noLabels = ['诶嘿？','再想想','点不到～','抓不到我','溜了溜了','别追啦 ♡','我会躲哦'];
let attempts = 0;
let accepted = false;
let lastEscape = -Infinity;
let resetTimer;
let resizeFrame;

function overlaps(a,b,pad=12){return a.x < b.x+b.width+pad && a.x+a.width+pad > b.x && a.y < b.y+b.height+pad && a.y+a.height+pad > b.y;}

function placeNo(pointer){
  const viewport = window.visualViewport;
  const width = viewport?.width || window.innerWidth;
  const height = viewport?.height || window.innerHeight;
  const offsetX = viewport?.offsetLeft || 0;
  const offsetY = viewport?.offsetTop || 0;
  const bounds = no.getBoundingClientRect();
  const pad = 14;
  const maxX = Math.max(pad,width-bounds.width-pad);
  const maxY = Math.max(pad,height-bounds.height-pad);
  const zoneRect = zone.getBoundingClientRect();
  const blocked = {x:zoneRect.x-offsetX,y:zoneRect.y-offsetY,width:zoneRect.width,height:Math.max(zoneRect.height,80)};
  const previous = {x:bounds.x-offsetX+bounds.width/2,y:bounds.y-offsetY+bounds.height/2};
  let target = {x:pad,y:pad};
  let best = -Infinity;
  for(let i=0;i<60;i++){
    const x=pad+Math.random()*(maxX-pad);
    const y=pad+Math.random()*(maxY-pad);
    const candidate={x,y,width:bounds.width,height:bounds.height};
    if(overlaps(candidate,blocked,20))continue;
    const center={x:x+bounds.width/2,y:y+bounds.height/2};
    const distance=Math.hypot(center.x-previous.x,center.y-previous.y);
    const fromPointer=pointer?Math.hypot(center.x-(pointer.x-offsetX),center.y-(pointer.y-offsetY)):distance;
    const score=Math.min(distance,fromPointer)+Math.random()*25;
    if(score>best){best=score;target={x,y};}
  }
  no.style.left=`${Math.round(target.x+offsetX)}px`;
  no.style.top=`${Math.round(target.y+offsetY)}px`;
  no.style.setProperty('--tilt',`${attempts%2? -5:5}deg`);
}

function escapeNo(event){
  if(accepted)return;
  event?.preventDefault();
  if(performance.now()-lastEscape<220)return;
  lastEscape=performance.now();
  const index=Math.min(attempts,lines.length-1);
  attempts++;
  speech.textContent=lines[index][0];
  tease.textContent=lines[index][1];
  no.textContent=noLabels[index];
  if(!no.classList.contains('is-running')){
    no.classList.add('is-running');
    document.body.append(no);
  }
  const stage=Math.min(attempts,5);
  const emphasis=[
    ['55%','56px','#fff4e6','#6d5949','#cbbfac','14px'],
    ['68%','61px','#fff4e6','#6d5949','#cbbfac','15px'],
    ['80%','66px','#fff4e6','#6d5949','#cbbfac','16px'],
    ['91%','71px','#fff4e6','#6d5949','#cbbfac','17px'],
    ['100%','77px','#fff4e6','#6d5949','#cbbfac','18px']
  ][stage-1];
  ['--yes-width','--yes-height','--yes-background','--yes-color','--yes-border','--yes-size'].forEach((key,i)=>zone.style.setProperty(key,emphasis[i]));
  zone.style.setProperty('--yes-shadow',stage>=3?'0 5px 0 #e4d4bf':'0 3px 0 #eadfcc');
  no.style.fontSize=`${Math.max(12,16-stage)}px`;
  no.style.setProperty('--no-scale',String(Math.max(.84,1-stage*.03)));
  yes.innerHTML=stage>=3?'好嘛，陪你去 <span aria-hidden="true">♡</span>':'好呀，约好了 <span aria-hidden="true">♡</span>';
  placeNo(event&&Number.isFinite(event.clientX)?{x:event.clientX,y:event.clientY}:null);
}

no.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')escapeNo(event);});
no.addEventListener('pointerdown',escapeNo);
no.addEventListener('click',escapeNo);
no.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){escapeNo(event);yes.focus();}});
function reflow(){
  cancelAnimationFrame(resizeFrame);
  resizeFrame=requestAnimationFrame(()=>{if(!accepted&&no.classList.contains('is-running'))placeNo();});
}
window.addEventListener('resize',reflow);
window.visualViewport?.addEventListener('resize',reflow);

function celebrate(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const container=document.querySelector('#confetti');
  container.replaceChildren();
  const colors=['#d26c74','#b5c19b','#dec18c','#ead1c4','#7f8b67'];
  for(let i=0;i<50;i++){
    const piece=document.createElement('i');
    piece.className='confetti-piece';
    piece.style.cssText=`--x:${Math.random()*100}%;--size:${5+Math.random()*6}px;--color:${colors[i%colors.length]};--duration:${2+Math.random()*1.8}s;--delay:${Math.random()*.55}s;--spin:${Math.random()*720-360}deg`;
    container.append(piece);
  }
  clearTimeout(resetTimer);
  resetTimer=setTimeout(()=>container.replaceChildren(),5000);
}

yes.addEventListener('click',()=>{
  if(accepted)return;
  accepted=true;
  no.hidden=true;
  invite.hidden=true;
  success.hidden=false;
  document.querySelector('#success-title').focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'instant'});
  celebrate();
});

document.querySelector('#copy-button').addEventListener('click',async()=>{
  const status=document.querySelector('#copy-status');
  try{
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(reply);
    status.textContent='复制好了，去聊天里把好消息告诉我吧 ♡';
  }catch{
    const text=document.querySelector('#reply-text');
    text.hidden=false;
    text.value=reply;
    text.focus();
    text.select();
    status.textContent='长按下方文字复制，再发给我就好。';
  }
});

document.querySelector('#replay').addEventListener('click',()=>{
  accepted=false;
  attempts=0;
  lastEscape=-Infinity;
  no.hidden=false;
  no.classList.remove('is-running');
  no.removeAttribute('style');
  no.textContent='不去';
  zone.append(no);
  zone.removeAttribute('style');
  yes.textContent='好呀';
  speech.textContent='我连期待都准备好了';
  tease.textContent='请认真选择，我有一点点期待。';
  success.hidden=true;
  invite.hidden=false;
  document.querySelector('#copy-status').textContent='';
  document.querySelector('#reply-text').hidden=true;
  document.querySelector('#confetti').replaceChildren();
  clearTimeout(resetTimer);
  window.scrollTo({top:0,behavior:'instant'});
  yes.focus({preventScroll:true});
});
