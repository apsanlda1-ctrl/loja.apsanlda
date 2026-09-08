/* APSAN — proteção da Central do Vendedor
   NÃO elimina nem oculta o conteúdo existente do painel.
   Apenas garante que a Central aparece primeiro e que os formulários existentes
   continuam disponíveis quando a modalidade correspondente é escolhida. */
(function(){
'use strict';
const DASH='sellerDashboardPage', HUB='apsanSellerSalesHub', FORM='productForm';
function visible(el){return !!el&&getComputedStyle(el).display!=='none'&&(el.classList.contains('visible')||el.classList.contains('show')||el.offsetParent!==null)}
function hasSeller(){try{return !!JSON.parse(localStorage.getItem('apsan_current_seller')||'null')}catch(e){return false}}
function protect(){
  const d=document.getElementById(DASH);
  if(!visible(d))return;
  const h=document.getElementById(HUB);
  if(!h){if(typeof window.apsanShowSellerHub==='function')window.apsanShowSellerHub();return}
  h.style.display='block';
  h.style.visibility='visible';
  h.style.position='relative';
  h.style.zIndex='10';
  if(h.parentElement===d && d.firstElementChild!==h)d.insertBefore(h,d.firstElementChild);
  const f=document.getElementById(FORM);
  if(f){f.style.removeProperty('display');f.style.visibility='visible';}
}
function style(){
  if(document.getElementById('apsanSellerPreserveStyle'))return;
  const s=document.createElement('style');s.id='apsanSellerPreserveStyle';
  s.textContent='#apsanSellerSalesHub{display:block!important;visibility:visible!important;position:relative!important;z-index:20!important}.apsan-seller-hub{display:block!important;visibility:visible!important}';
  document.head.appendChild(s);
}
function boot(){
  style();
  const run=()=>{if(hasSeller())protect()};
  run();
  new MutationObserver(run).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  setInterval(run,500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
