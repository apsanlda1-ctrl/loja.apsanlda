/* APSAN — dados de pagamento da empresa
   Regra: transferência bancária mostra todos os dados bancários.
   Express mostra apenas o número Express já existente + nome da empresa.
   Não altera nem remove os demais campos do checkout.
*/
(function(){
  'use strict';

  const COMPANY='APSAN, LDA';
  const BANK='Banco de Fomento Angola (BFA)';
  const ACCOUNT='363503021 30 001';
  const NIB='0006 0000 63503021301 57';
  const IBAN='AO06 0006 0000 63503021301 57';
  const SWIFT='BFMXAOLU';

  function boxStyle(){
    return 'margin-top:14px;padding:14px 16px;border:1px solid rgba(37,99,235,.18);border-radius:12px;background:#f8fafc;color:#1e293b;line-height:1.55;font-size:.94rem';
  }
  function render(){
    const ex=document.getElementById('onlineExpressDetails');
    const bk=document.getElementById('onlineBankDetails');
    if(!ex&&!bk)return false;

    if(ex && !ex.querySelector('[data-apsan-express-company]')){
      const wrap=document.createElement('div');
      wrap.setAttribute('data-apsan-express-company','1');
      wrap.style.cssText=boxStyle();
      wrap.innerHTML='<strong>Beneficiário: '+COMPANY+'</strong><br><span style="color:#475569">Número Express: </span><span data-apsan-express-number>Consulte o número Express já apresentado nesta opção.</span>';
      ex.appendChild(wrap);

      // Mantém o número Express que o formulário já tinha, caso exista.
      const existing=(ex.textContent||'').match(/(?:Express\s*(?:n[ºo°.]*)?\s*[:\-]?\s*)([0-9][0-9\s]{7,})/i);
      if(existing && existing[1]){
        const n=wrap.querySelector('[data-apsan-express-number]');
        if(n)n.textContent=existing[1].trim();
      }
    }

    if(bk && !bk.querySelector('[data-apsan-bank-full]')){
      const wrap=document.createElement('div');
      wrap.setAttribute('data-apsan-bank-full','1');
      wrap.style.cssText=boxStyle();
      wrap.innerHTML='<div style="font-weight:800;font-size:1rem;margin-bottom:8px">Dados bancários para pagamento</div>'+
        '<div><strong>Empresa:</strong> '+COMPANY+'</div>'+
        '<div><strong>Banco:</strong> '+BANK+'</div>'+
        '<div><strong>Número de conta:</strong> '+ACCOUNT+'</div>'+
        '<div><strong>NIB:</strong> '+NIB+'</div>'+
        '<div><strong>IBAN:</strong> '+IBAN+'</div>'+
        '<div><strong>SWIFT/BIC:</strong> '+SWIFT+'</div>';
      bk.appendChild(wrap);
    }
    return true;
  }

  function boot(){
    render();
    [100,500,1200,2500].forEach(ms=>setTimeout(render,ms));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  // O checkout é construído dinamicamente; reaplica sem interferir nos outros elementos.
  const old=window.selectOnlinePaymentMethod;
  if(typeof old==='function' && !old.__apsanBankWrapped){
    const wrapped=function(method){
      const r=old.apply(this,arguments);
      setTimeout(render,0);
      return r;
    };
    wrapped.__apsanBankWrapped=true;
    window.selectOnlinePaymentMethod=wrapped;
  }
})();