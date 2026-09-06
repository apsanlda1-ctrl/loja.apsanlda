/* APSAN — correções ISOLADAS de Turmas e Publicar material.
   NÃO intercepta login, perfis, voltar, financeiro ou outros botões.
   Usa os módulos originais já existentes para executar as ações.
*/
(function(){
  'use strict';

  function fixMaterialButton(){
    const b=document.getElementById('apsanMatSubmit');
    if(!b) return;
    // O módulo original já sabe publicar. Aqui apenas retiramos o bloqueio visual.
    b.disabled=false;
    b.removeAttribute('disabled');
  }

  function removeCloud(){
    if(document.getElementById('apsanButtonsFixStyle')) return;
    const s=document.createElement('style');
    s.id='apsanButtonsFixStyle';
    s.textContent='.apsan-mat-drop > i{display:none!important}.apsan-mat-drop .fa-cloud,.apsan-mat-drop .fa-cloud-arrow-up{display:none!important}';
    document.head.appendChild(s);
  }

  function fixTurmas(){
    const b=document.getElementById('apsanLiveNavBtn');
    if(!b || b.dataset.apsanSafeBound==='1') return;
    b.dataset.apsanSafeBound='1';
    b.type='button';
    b.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      try{
        if(typeof window.apsanRenderLiveClasses==='function'){
          window.apsanRenderLiveClasses();
          return;
        }
        if(typeof window.renderClasses==='function'){
          window.renderClasses();
          return;
        }
        // Último recurso: carregar apenas o módulo de Turmas.
        if(!document.getElementById('apsanLiveClassroomRecovery')){
          const s=document.createElement('script');
          s.id='apsanLiveClassroomRecovery';
          s.src='js/live-classroom.js?v=20260906c';
          s.async=false;
          s.onload=function(){
            try{window.apsanRenderLiveClasses?.()}catch(err){console.error(err)}
          };
          document.head.appendChild(s);
        }
      }catch(err){console.error('APSAN Turmas:',err)}
    },false);
  }

  function scan(){
    removeCloud();
    fixMaterialButton();
    fixTurmas();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',scan,{once:true});
  }else scan();
  new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
  setInterval(scan,800);
})();
