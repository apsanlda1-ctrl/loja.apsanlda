/* APSAN — restauração de compatibilidade do catálogo existente.
   Não remove produtos nem altera pedidos pendentes/rejeitados.
   Apenas recupera publicações antigas que não tinham o novo campo status.
*/
(function(){
'use strict';
const KEY='apsan_produtos';
const BLOCKED=new Set(['pending','rejected','denied','draft','blocked','deleted','archived']);
function read(){try{return typeof getData==='function'?(getData(KEY)||[]):JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function write(v){try{if(typeof setData==='function')setData(KEY,v);else localStorage.setItem(KEY,JSON.stringify(v))}catch(e){console.error('APSAN restauração do catálogo',e)}}
function restore(){
  const list=read();
  if(!Array.isArray(list)||!list.length)return;
  let changed=false;
  const next=list.map(p=>{
    if(!p||p.deleted)return p;
    const status=String(p.status||'').trim().toLowerCase();
    const legacyPublished=p.isPublished===true||p.published===true||p.public===true||p.visible===true||p.active===true;
    if(BLOCKED.has(status))return p;
    // Publicações antigas sem status continuam públicas.
    if(!status){p.status='approved';p.approved=true;p.isPublished=true;changed=true;return p}
    // Estados legados que significavam publicação pública são compatibilizados.
    if(['published','public','active','available','live'].includes(status)){p.status='approved';p.approved=true;p.isPublished=true;changed=true;return p}
    if(legacyPublished&&status!=='approved'){p.status='approved';p.approved=true;p.isPublished=true;changed=true}
    return p;
  });
  if(changed)write(next);
}
function boot(){restore();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.apsanRestoreExistingCatalog=restore;
})();
