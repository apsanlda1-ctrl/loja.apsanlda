/* APSAN — CORREÇÃO ISOLADA DAS TURMAS
   Corrige SOMENTE o clique em Abrir turma / Entrar agora.
   Não altera login, perfil, financeiro ou materiais.
*/
(function(){
'use strict';
function callOpen(id,tries){
  if(!id)return false;
  try{
    const fn=window.apsanOpenLiveClass||window.openClass;
    if(typeof fn==='function'){fn(id);return true}
  }catch(e){console.error('APSAN: erro ao abrir turma',e)}
  if((tries||0)<8){setTimeout(()=>callOpen(id,(tries||0)+1),80)}
  return false;
}
function bind(){
  const host=document.getElementById('apsanLivePageHost');
  if(!host)return;
  host.querySelectorAll('[data-open]').forEach(btn=>{
    if(btn.dataset.apsanOpenFix==='2')return;
    btn.dataset.apsanOpenFix='2';
    btn.addEventListener('click',function(e){
      const id=this.getAttribute('data-open');
      if(!id)return;
      const fn=window.apsanOpenLiveClass||window.openClass;
      if(typeof fn==='function'){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        callOpen(id,0);
      }
      // Se a função ainda estiver a carregar, NÃO bloqueamos o onclick original.
    },true);
  });
}
function boot(){
  bind();
  new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
  setInterval(bind,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
