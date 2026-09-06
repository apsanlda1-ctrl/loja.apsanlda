/* APSAN — CORREÇÃO ISOLADA DAS TURMAS
   Só trata o clique em "Abrir turma" / "Entrar agora".
   Não altera login, perfil, financeiro, materiais ou outras áreas.
*/
(function(){
'use strict';
function openClass(id){
  if(!id)return false;
  try{
    if(typeof window.apsanOpenLiveClass==='function'){
      window.apsanOpenLiveClass(id);
      return true;
    }
    if(typeof window.openClass==='function'){
      window.openClass(id);
      return true;
    }
  }catch(e){console.error('APSAN: erro ao abrir turma',e)}
  return false;
}
function bind(){
  const host=document.getElementById('apsanLivePageHost');
  if(!host)return;
  host.querySelectorAll('[data-open]').forEach(btn=>{
    if(btn.dataset.apsanOpenFix==='1')return;
    btn.dataset.apsanOpenFix='1';
    btn.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      openClass(this.getAttribute('data-open'));
    },true);
  });
}
function boot(){
  bind();
  new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
  setInterval(bind,1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
