/* APSAN — proteção da Central do Vendedor
   NÃO elimina nem oculta o conteúdo existente do painel.
   Apenas garante que a Central aparece primeiro no modo hub. */
(function(){
'use strict';
const DASH='sellerDashboardPage', HUB='apsanSellerSalesHub', FORM='productForm';
function visible(el){return !!el&&getComputedStyle(el).display!=='none'&&(el.classList.contains('visible')||el.classList.contains('show')||el.offsetParent!==null)}
function hasSeller(){try{return !!JSON.parse(localStorage.getItem('apsan_current_seller')||'null')}catch(e){return false}}
function protect(){
  const d=document.getElementById(DASH);
  if(!visible(d)||!hasSeller())return;
  const mode=window.__apsanSellerMode||'hub';
  const h=document.getElementById(HUB);
  if(!h){if(mode==='hub'&&typeof window.apsanShowSellerHub==='function')window.apsanShowSellerHub();return}
  if(mode==='hub'){
    h.style.display='block';h.style.visibility='visible';h.style.position='relative';h.style.zIndex='10';
    if(h.parentElement===d&&d.firstElementChild!==h)d.insertBefore(h,d.firstElementChild);
    const f=document.getElementById(FORM);
    if(f){f.style.removeProperty('display');f.style.visibility='visible'}
  }
}
function boot(){
  protect();
  new MutationObserver(protect).observe(document.body,{childList:true,subtree:true});
  setInterval(protect,500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
