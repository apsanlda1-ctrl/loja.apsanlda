/* APSAN — ponte da sessão do vendedor para o fluxo de produto físico */
(function(){
  'use strict';
  function sync(){
    try{
      let seller=null;
      try{ if(typeof currentSeller!=='undefined' && currentSeller && currentSeller.id) seller=currentSeller; }catch(e){}
      if(!seller){
        try{ if(typeof currentSalesSeller!=='undefined' && currentSalesSeller && currentSalesSeller.id) seller=currentSalesSeller; }catch(e){}
      }
      if(seller) localStorage.setItem('apsan_current_seller',JSON.stringify(seller));
    }catch(e){}
  }
  sync();
  window.addEventListener('load',sync);
  setInterval(sync,800);
})();
