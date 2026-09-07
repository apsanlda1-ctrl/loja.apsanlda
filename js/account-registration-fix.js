/* APSAN — correção isolada da criação de contas.
   Não altera pagamentos, marketplace, produtos ou administração. */
(function(){
'use strict';
function fixSellerForm(){
  const form=document.getElementById('sellerForm');
  if(!form||form.dataset.accountFix==='1')return;
  form.dataset.accountFix='1';
  const phone=document.getElementById('sellerPhone');
  const nif=document.getElementById('sellerNif');
  /* Os padrões antigos eram demasiado rígidos e faziam o navegador rejeitar
     números/NIF válidos antes de registerSeller sequer ser executado. */
  if(phone){phone.removeAttribute('pattern');phone.setAttribute('inputmode','tel');}
  if(nif){nif.removeAttribute('pattern');nif.setAttribute('inputmode','text');}
  form.addEventListener('submit',function(){
    if(phone)phone.value=String(phone.value||'').trim();
    if(nif)nif.value=String(nif.value||'').trim().toUpperCase();
  },true);
}
function scan(){fixSellerForm();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});
else scan();
new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
})();
