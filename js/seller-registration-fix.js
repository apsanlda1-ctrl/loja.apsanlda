/* ACE APSAN — correção exclusiva da criação de conta de vendedor. */
(function(){
  'use strict';
  function install(){
    const form=document.getElementById('sellerForm');
    if(!form||form.dataset.sellerFixInstalled==='1') return;
    form.dataset.sellerFixInstalled='1';
    form.noValidate=true;
    const phone=document.getElementById('sellerPhone');
    const nif=document.getElementById('sellerNif');
    if(phone) phone.removeAttribute('pattern');
    if(nif) nif.removeAttribute('pattern');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      const name=(document.getElementById('sellerName')?.value||'').trim();
      const p=(phone?.value||'').trim();
      const n=(nif?.value||'').trim().toUpperCase();
      const password=document.getElementById('sellerPassword')?.value||'';
      if(name.length<3){alert('Introduza o nome completo do vendedor.');return false;}
      if(p.replace(/\D/g,'').length<7){alert('Introduza um número de telefone válido.');return false;}
      if(n.length<3){alert('Introduza o NIF.');return false;}
      if(password.length<6){alert('A palavra-passe deve ter pelo menos 6 caracteres.');return false;}
      if(typeof window.registerSeller==='function'){
        const original=window.registerSeller;
        window.registerSeller=function(){};
        Promise.resolve(original.call(form,e)).finally(function(){window.registerSeller=original;});
      }
      return false;
    },true);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true}); else install();
  new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
})();
