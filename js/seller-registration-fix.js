/* APSAN — carregador das funcionalidades do vendedor */
(function(){
'use strict';
function load(id,src,onload){if(document.getElementById(id)){if(onload)onload();return}const s=document.createElement('script');s.id=id;s.src=src;s.defer=false;if(onload)s.onload=onload;document.head.appendChild(s)}
function background(){if(document.getElementById('ace-apsan-background-runtime'))return;const s=document.createElement('style');s.id='ace-apsan-background-runtime';s.textContent=".hero{background-image:url('../assets/ace-apsan-background.jpg')!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important}.hero::before{display:none!important}.hero-graphic{background:transparent!important}.wave-shape-1,.wave-shape-2{display:none!important}";document.head.appendChild(s)}
function loadSellerFeatures(){
 load('apsanAccountRegistrationFix','js/account-registration-fix.js?v=20260908c');
 load('apsanPhysicalProductScript','js/physical-product-flow.js?v=20260908f');
 load('apsanSellerSalesHubScript','js/seller-sales-hub.js?v=20260908f');
 load('apsanSellerRuntimeFix','js/seller-hub-runtime-fix.js?v=20260908g');
 load('apsanSellerPreserveFix','js/seller-hub-preserve-fix.js?v=20260908c');
 load('apsanSellerAccountPanel','js/seller-account-panel.js?v=20260908b');
 load('apsanProductTypeFlowScript','js/seller-product-type-flow.js?v=20260908d');
 load('apsanProductTypeRuntimeFix','js/seller-product-type-runtime-fix.js?v=20260908b');
 load('apsanPhysicalPublishButtonFix','js/physical-publish-button-fix.js?v=20260908b');
 load('apsanMarketplaceAutoPublish','js/marketplace-auto-publish.js?v=20260908d');
}
function boot(){background();load('apsanBrowserStorage','js/apsan-browser-storage.js?v=20260908e',loadSellerFeatures)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();