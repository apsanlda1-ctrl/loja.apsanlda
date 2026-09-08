/* APSAN — carregador modular de correções */
(function(){
'use strict';
const load=src=>{const s=document.createElement('script');s.src=src+'?v=20260908-productfix';s.async=false;document.head.appendChild(s)};
load('js/view-persistence-core.js');
load('js/product-publication-fix.js');
})();