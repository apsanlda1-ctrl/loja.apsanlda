/* APSAN — dados bancários completos no checkout de pagamento.
   Apenas acrescenta informação; não remove nem oculta os campos existentes. */
(function(){
  'use strict';

  const APSAN_ACCOUNT = {
    company: 'APSAN, LDA',
    bank: 'Banco de Fomento Angola (BFA)',
    account: '363503021 30 001',
    nib: '0006 0000 63503021301 57',
    iban: 'AO06 0006 0000 63503021301 57',
    swift: 'BFMXAOLU'
  };

  function renderAccountDetails(container, title){
    if(!container) return;
    if(container.querySelector('.apsan-account-details')) return;
    const box=document.createElement('div');
    box.className='apsan-account-details';
    box.style.cssText='margin-top:14px;padding:16px;border:1px solid rgba(15,23,42,.12);border-radius:14px;background:#f8fafc;color:#0f172a;line-height:1.55;';
    box.innerHTML=`
      <div style="font-weight:800;margin-bottom:10px;">${title||'Dados da conta para pagamento'}</div>
      <div><strong>Empresa:</strong> ${APSAN_ACCOUNT.company}</div>
      <div><strong>Banco:</strong> ${APSAN_ACCOUNT.bank}</div>
      <div><strong>Número de conta:</strong> ${APSAN_ACCOUNT.account}</div>
      <div><strong>NIB:</strong> ${APSAN_ACCOUNT.nib}</div>
      <div><strong>IBAN:</strong> ${APSAN_ACCOUNT.iban}</div>
      <div><strong>SWIFT/BIC:</strong> ${APSAN_ACCOUNT.swift}</div>`;
    container.appendChild(box);
  }

  function apply(){
    renderAccountDetails(document.getElementById('onlineBankDetails'),'Dados bancários da APSAN, LDA');
    renderAccountDetails(document.getElementById('onlineExpressDetails'),'Dados para pagamento por Express');
  }

  const original=window.selectOnlinePaymentMethod;
  window.selectOnlinePaymentMethod=function(method){
    if(typeof original==='function') original.apply(this,arguments);
    setTimeout(apply,0);
  };

  const observer=new MutationObserver(apply);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(apply,250);
})();
