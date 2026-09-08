/* APSAN — carregador das funcionalidades do vendedor */
(function(){
'use strict';
function load(id,src,onload){if(document.getElementById(id)){if(onload)onload();return}const s=document.createElement('script');s.id=id;s.src=src;s.defer=false;if(onload)s.onload=onload;document.head.appendChild(s)}
function background(){if(document.getElementById('ace-apsan-background-runtime'))return;const s=document.createElement('style');s.id='ace-apsan-background-runtime';s.textContent=".hero{background-image:url('../assets/ace-apsan-background.jpg')!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important}.hero::before{display:none!important}.hero-graphic{background:transparent!important}.wave-shape-1,.wave-shape-2{display:none!important}";document.head.appendChild(s)}
function hideLegacyPhysicalOption(){
  const form=document.getElementById('productForm');
  if(!form)return;
  form.querySelectorAll('label').forEach(label=>{
    if(label.dataset.apsanLegacyHidden)return;
    const text=(label.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(!text.includes('produto físico / entrega nacional'))return;
    const checkbox=label.querySelector('input[type="checkbox"]');
    if(!checkbox)return;
    let target=label;
    if(label.parentElement && label.parentElement.querySelector('input[type="checkbox"]')) target=label.parentElement;
    target.style.display='none';
    target.dataset.apsanLegacyHidden='1';
  });
}
function loadSellerFeatures(){
  load('apsanAccountRegistrationFix','js/account-registration-fix.js?v=20260908b');
  load('apsanPhysicalProductScript','js/physical-product-flow.js?v=20260908e');
  load('apsanSellerSalesHubScript','js/seller-sales-hub.js?v=20260908e');
  load('apsanSellerRuntimeFix','js/seller-hub-runtime-fix.js?v=20260908f');
  load('apsanSellerPreserveFix','js/seller-hub-preserve-fix.js?v=20260908b');
  load('apsanSellerAccountPanel','js/seller-account-panel.js?v=20260908a');
  load('apsanProductTypeFlowScript','js/seller-product-type-flow.js?v=20260908c');
  load('apsanProductTypeRuntimeFix','js/seller-product-type-runtime-fix.js?v=20260908a');
  hideLegacyPhysicalOption();
  new MutationObserver(hideLegacyPhysicalOption).observe(document.body,{childList:true,subtree:true});
}
function boot(){
  background();
  load('apsanBrowserStorage','js/apsan-browser-storage.js?v=20260908c',loadSellerFeatures);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
