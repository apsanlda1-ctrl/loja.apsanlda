/* APSAN — carregador das funcionalidades do vendedor */
(function(){
'use strict';
function load(id,src){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src;s.defer=false;document.head.appendChild(s)}
function background(){if(document.getElementById('ace-apsan-background-runtime'))return;const s=document.createElement('style');s.id='ace-apsan-background-runtime';s.textContent=".hero{background-image:url('../assets/ace-apsan-background.jpg')!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important}.hero::before{display:none!important}.hero-graphic{background:transparent!important}.wave-shape-1,.wave-shape-2{display:none!important}";document.head.appendChild(s)}
function boot(){
  background();
  load('apsanBrowserStorage','js/apsan-browser-storage.js?v=20260908c');
  load('apsanAccountRegistrationFix','js/account-registration-fix.js?v=20260908b');
  load('apsanPhysicalProductScript','js/physical-product-flow.js?v=20260908e');
  load('apsanSellerSalesHubScript','js/seller-sales-hub.js?v=20260908e');
  load('apsanSellerRuntimeFix','js/seller-hub-runtime-fix.js?v=20260908f');
  load('apsanSellerPreserveFix','js/seller-hub-preserve-fix.js?v=20260908b');
  load('apsanSellerAccountPanel','js/seller-account-panel.js?v=20260908a');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
