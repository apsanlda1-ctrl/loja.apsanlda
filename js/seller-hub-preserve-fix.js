/* APSAN — proteção da Central do Vendedor
   A Central deve aparecer PRIMEIRO depois da criação/login.
   O formulário de infoproduto só aparece quando o vendedor escolhe essa opção. */
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
  if(mode==='hub'){
    if(!h&&typeof window.apsanShowSellerHub==='function'){window.apsanShowSellerHub();return}
    const hub=document.getElementById(HUB);
    if(hub){hub.style.display='block';hub.style.visibility='visible';hub.style.position='relative';hub.style.zIndex='10';if(hub.parentElement===d&&d.firstElementChild!==hub)d.insertBefore(hub,d.firstElementChild)}
    const f=document.getElementById(FORM);
    if(f){f.style.display='none';f.style.visibility='hidden'}
  }
}
function boot(){
  protect();
  new MutationObserver(protect).observe(document.body,{childList:true,subtree:true});
  setInterval(protect,250);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();