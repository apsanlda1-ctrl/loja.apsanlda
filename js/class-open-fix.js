/* APSAN — CORREÇÃO ISOLADA DAS TURMAS */
(function(){
'use strict';
function callOpen(id,tries){if(!id)return false;try{const fn=window.apsanOpenLiveClass||window.openClass;if(typeof fn==='function'){fn(id);return true}}catch(e){console.error('APSAN: erro ao abrir turma',e)}if((tries||0)<8)setTimeout(()=>callOpen(id,(tries||0)+1),80);return false}
function bind(){const host=document.getElementById('apsanLivePageHost');if(!host)return;host.querySelectorAll('[data-open]').forEach(btn=>{if(btn.dataset.apsanOpenFix==='2')return;btn.dataset.apsanOpenFix='2';btn.addEventListener('click',function(e){const id=this.getAttribute('data-open');if(!id)return;const fn=window.apsanOpenLiveClass||window.openClass;if(typeof fn==='function'){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();callOpen(id,0)}},true)})}
function loadEnhancements(){if(document.getElementById('apsanPhysicalProductScript'))return;const s=document.createElement('script');s.id='apsanPhysicalProductScript';s.src='js/physical-product-flow.js?v=20260908';s.defer=false;document.head.appendChild(s)}
function background(){if(document.getElementById('apsanBgFix'))return;const s=document.createElement('style');s.id='apsanBgFix';s.textContent="body{background:#07101c url('assets/ace-apsan-background.jpg') center center/cover fixed no-repeat!important}.hero{background:transparent!important}";document.head.appendChild(s)}
function boot(){background();loadEnhancements();bind();new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});setInterval(bind,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();