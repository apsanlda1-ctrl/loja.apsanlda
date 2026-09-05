/* APSAN — navegação robusta de Turmas e Aulas + Materiais.
   Mantém as funções originais do dashboard e apenas garante a entrada da nova área.
*/
(function(){
'use strict';
const role=()=>{try{return onRole||window.onRole||''}catch(e){return window.onRole||''}};
function liveOpen(){
  try{
    const h=document.getElementById('apsanLivePageHost');
    if(h)h.style.display='block';
    if(typeof window.apsanRenderLiveClasses==='function'){window.apsanRenderLiveClasses();return true}
    if(typeof window.renderClasses==='function'){window.renderClasses();return true}
  }catch(e){console.error('APSAN Turmas:',e)}
  return false;
}
function isNavCandidate(el){if(!el||el===document.body)return false;const buttons=el.querySelectorAll?.('button,a')||[];if(buttons.length<3)return false;const txt=(el.textContent||'').toLowerCase();return txt.includes('materiais')&&(txt.includes('alunos')||txt.includes('horários')||txt.includes('minhas aulas')||txt.includes('financeiro'))}
function findNav(r){const direct=document.getElementById(r==='teacher'?'onTeacherNav':'onStudentNav');if(direct)return direct;return [...document.querySelectorAll('nav,aside,[role="navigation"],.sidebar,.on-sidebar,.on-nav')].find(isNavCandidate)||null}
function ensure(){
 const r=role();if(r!=='teacher'&&r!=='student')return;const nav=findNav(r);if(!nav)return;
 let b=nav.querySelector('#apsanLiveNavBtn');
 if(!b){b=document.createElement('button');b.id='apsanLiveNavBtn';b.type='button';b.className='on-nav-item apsan-live-nav';b.innerHTML='<i class="fa-solid fa-chalkboard-user"></i><span>Turmas e aulas</span>';const material=[...nav.querySelectorAll('button,a')].find(x=>(x.textContent||'').toLowerCase().includes('material'));if(material)material.parentElement?.insertBefore(b,material);else nav.appendChild(b)}
 if(!b.dataset.apsanBound){b.dataset.apsanBound='1';b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();liveOpen()},true)}
}
function boot(){ensure();setTimeout(ensure,300);setTimeout(ensure,1000);setTimeout(ensure,2500);new MutationObserver(ensure).observe(document.body,{childList:true,subtree:true});setInterval(ensure,3000);document.addEventListener('click',e=>{const b=e.target.closest?.('#apsanLiveNavBtn');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();liveOpen()},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
