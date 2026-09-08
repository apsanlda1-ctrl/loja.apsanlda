/* APSAN — dados de pagamento no checkout
   Transferência bancária: dados bancários completos.
   MULTICAIXA Express: somente número Express + nome da empresa.
   Não remove nem oculta os restantes campos do checkout.
*/
(function(){
  'use strict';
  const A={company:'APSAN, LDA.',bank:'Banco de Fomento Angola (BFA)',account:'363503021 30 001',nib:'0006 0000 63503021301 57',iban:'AO06 0000 63503021301 57',swift:'BFMXAOLU',express:'931 057 760'};
  const style='margin-top:14px;padding:16px;border:1px solid rgba(15,23,42,.12);border-radius:14px;background:#f8fafc;color:#0f172a;line-height:1.55;';
  function addBank(){const c=document.getElementById('onlineBankDetails');if(!c||c.querySelector('[data-apsan-bank-full]'))return;const box=document.createElement('div');box.setAttribute('data-apsan-bank-full','1');box.style.cssText=style;box.innerHTML='<div style="font-weight:800;margin-bottom:10px;">Dados bancários completos da APSAN, LDA.</div><div><strong>Nome da empresa:</strong> '+A.company+'</div><div><strong>Banco:</strong> '+A.bank+'</div><div><strong>Número de conta:</strong> '+A.account+'</div><div><strong>NIB:</strong> '+A.nib+'</div><div><strong>IBAN:</strong> '+A.iban+'</div><div><strong>SWIFT/BIC:</strong> '+A.swift+'</div>';c.appendChild(box)}
  function addExpress(){const c=document.getElementById('onlineExpressDetails');if(!c||c.querySelector('[data-apsan-express-full]'))return;const box=document.createElement('div');box.setAttribute('data-apsan-express-full','1');box.style.cssText=style;box.innerHTML='<div style="font-weight:800;margin-bottom:8px;">Pagamento por MULTICAIXA Express</div><div><strong>Empresa:</strong> '+A.company+'</div><div><strong>Número Express:</strong> '+A.express+'</div><small style="display:block;color:#64748b;margin-top:8px">Use este número no MULTICAIXA Express para concluir o pagamento.</small>';c.appendChild(box)}
  function apply(){addBank();addExpress()}
  function wrap(){const original=window.selectOnlinePaymentMethod;if(typeof original!=='function'||original.__apsanPaymentAccountWrapped)return;const wrapped=function(method){const r=original.apply(this,arguments);setTimeout(apply,0);return r};wrapped.__apsanPaymentAccountWrapped=true;window.selectOnlinePaymentMethod=wrapped}
  function boot(){apply();wrap();[100,500,1200,2500].forEach(ms=>setTimeout(function(){apply();wrap()},ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();