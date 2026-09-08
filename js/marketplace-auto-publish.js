/* ACE APSAN — FLUXO DE PUBLICAÇÃO CONTROLADO
   Produtos enviados pelo vendedor ficam PENDENTES.
   Somente a administração pode aprovar e torná-los visíveis no marketplace.
*/
(function(){
  'use strict';
  const KEY='apsan_produtos';
  let busy=false;

  /* Compatibilidade: algumas versões do painel chamavam esta função durante
     a publicação. Se a implementação de pedidos não estiver carregada,
     a publicação de produtos não deve falhar por causa dela. */
  if(typeof window.renderAdminOrders!=='function'){
    window.renderAdminOrders=function(){
      try{
        if(typeof window.renderAdmin==='function') window.renderAdmin();
      }catch(e){console.warn('APSAN renderAdminOrders fallback:',e)}
    };
  }

  function refresh(){
    if(busy)return;
    try{
      if(typeof window.renderPublicProducts==='function') window.renderPublicProducts();
      if(typeof window.renderAdmin==='function' && document.getElementById('adminPage')?.classList.contains('visible')) window.renderAdmin();
      if(typeof window.updateSellerFinance==='function') window.updateSellerFinance();
    }catch(e){console.warn('APSAN marketplace refresh:',e)}
  }

  /* NÃO converter pending -> approved automaticamente.
     O estado pending é obrigatório até a decisão do administrador. */
  const originalSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
    const result=originalSetItem.call(this,key,value);
    if(key===KEY && !busy){
      setTimeout(refresh,0);
    }
    return result;
  };

  function boot(){
    refresh();
    setTimeout(refresh,300);
    setTimeout(refresh,1000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
