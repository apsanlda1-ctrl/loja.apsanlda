/* APSAN — navegação robusta de Turmas e Aulas + Materiais.
   Mantém as funções originais do dashboard e apenas garante que
   a entrada da nova área de Turmas e Aulas fique visível.
*/
(function(){
'use strict';
const role=()=>{try{return onRole||window.onRole||''}catch(e){return window.onRole||''}};
function liveOpen(){
  if(typeof window.apsanRenderLiveClasses==='function'){
    window.apsanRenderLiveClasses();
    return;
  }
  const h=document.getElementById('apsanLivePageHost');
  if(h) h.style.display='block';
}
function isNavCandidate(el){
  if(!el||el===document.body)return false;
  const buttons=el.querySelectorAll?.('button,a')||[];
  if(buttons.length<3)return false;
  const txt=(el.textContent||'').toLowerCase();
  return txt.includes('materiais') && (txt.includes('alunos')||txt.includes('horários')||txt.includes('minhas aulas')||txt.includes('financeiro'));
}
function findNav(r){
  const direct=document.getElementById(r==='teacher'?'onTeacherNav':'onStudentNav');
  if(direct)return direct;
  const all=[...document.querySelectorAll('nav,aside,[role="navigation"],.sidebar,.on-sidebar,.on-nav')];
  return all.find(isNavCandidate)||null;
}
function ensure(){
  const r=role();
  if(r!=='teacher'&&r!=='student')return;
  const nav=findNav(r);
  if(!nav)return;
  let b=nav.querySelector('#apsanLiveNavBtn');
  if(!b){
    b=document.createElement('button');
    b.id='apsanLiveNavBtn';
    b.type='button';
    b.className='on-nav-item apsan-live-nav';
    b.innerHTML='<i class="fa-solid fa-chalkboard-user"></i><span>Turmas e aulas</span>';
    const material=[...nav.querySelectorAll('button,a')].find(x=>(x.textContent||'').toLowerCase().includes('material'));
    if(material) material.parentElement?.insertBefore(b,material); else nav.appendChild(b);
  }
  if(!b.dataset.apsanBound){
    b.dataset.apsanBound='1';
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();liveOpen();});
  }
}
function boot(){
  ensure();
  setTimeout(ensure,300);
  setTimeout(ensure,1000);
  setTimeout(ensure,2500);
  const mo=new MutationObserver(ensure);
  mo.observe(document.body,{childList:true,subtree:true});
  setInterval(ensure,4000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
