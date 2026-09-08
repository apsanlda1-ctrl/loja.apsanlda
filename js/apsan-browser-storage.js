/* APSAN — armazenamento de ficheiros do navegador
   Os ficheiros grandes NÃO devem ser guardados em localStorage.
   Este módulo usa Cache Storage + Service Worker, que tem uma quota muito
   superior à do localStorage, e deixa apenas URLs pequenos nos dados do site.
*/
(function(){
'use strict';
const CACHE_NAME='apsan-files-v1';
const PREFIX='/__apsan_storage/';
let readyPromise=null;

function storageReady(){
  if(readyPromise)return readyPromise;
  readyPromise=(async()=>{
    if('storage' in navigator && navigator.storage?.persist){
      try{await navigator.storage.persist()}catch(e){}
    }
    if('serviceWorker' in navigator){
      try{
        const reg=await navigator.serviceWorker.register('/sw.js?v=20260908-storage2',{scope:'/'});
        try{await navigator.serviceWorker.ready}catch(e){}
        return reg;
      }catch(e){
        console.warn('APSAN Service Worker de armazenamento',e);
      }
    }
    return null;
  })();
  return readyPromise;
}

function safeId(){
  try{if(crypto.randomUUID)return crypto.randomUUID()}catch(e){}
  return Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12);
}

async function putFile(file,key,onProgress){
  if(!file)throw new Error('FILE_REQUIRED');
  await storageReady();
  if(typeof caches==='undefined'){
    const err=new Error('CACHE_STORAGE_UNAVAILABLE');err.code='storage/unavailable';throw err;
  }
  if(typeof onProgress==='function')onProgress(20);
  const cache=await caches.open(CACHE_NAME);
  const url=new URL(PREFIX+encodeURIComponent(key)+'-'+safeId(),location.origin).href;
  const headers=new Headers();
  headers.set('Content-Type',file.type||'application/octet-stream');
  headers.set('Content-Length',String(file.size||0));
  headers.set('Cache-Control','public, max-age=31536000, immutable');
  await cache.put(new Request(url),new Response(file,{status:200,headers}));
  if(typeof onProgress==='function')onProgress(100);
  return url;
}

/* Substitui a implementação antiga que transformava cada ficheiro em base64
   e o colocava dentro de localStorage. */
window.uploadFileToLocalStorage=async function(file,path,onProgress){
  return putFile(file,path||'arquivo',onProgress);
};
window.apsanBrowserStorageReady=storageReady;
window.apsanBrowserStorageEstimate=async function(){
  try{return navigator.storage?.estimate?await navigator.storage.estimate():null}catch(e){return null}
};

async function migrateValue(value,cache,keyPath,state){
  if(typeof value==='string'){
    if(value.startsWith('data:') && value.length>2048){
      const response=await fetch(value);
      const blob=await response.blob();
      const cacheStore=await caches.open(CACHE_NAME);
      const url=new URL(PREFIX+'migrated-'+safeId(),location.origin).href;
      const headers=new Headers();
      headers.set('Content-Type',blob.type||'application/octet-stream');
      headers.set('Content-Length',String(blob.size||0));
      headers.set('Cache-Control','public, max-age=31536000, immutable');
      await cacheStore.put(new Request(url),new Response(blob,{status:200,headers}));
      state.changed=true;state.moved=(state.moved||0)+blob.size;
      return url;
    }
    return value;
  }
  if(Array.isArray(value)){
    for(let i=0;i<value.length;i++)value[i]=await migrateValue(value[i],cache,keyPath+'['+i+']',state);
    return value;
  }
  if(value&&typeof value==='object'){
    for(const k of Object.keys(value))value[k]=await migrateValue(value[k],cache,keyPath+'.'+k,state);
  }
  return value;
}

async function migrateLocalData(){
  try{
    await storageReady();
    if(typeof caches==='undefined')return;
    const keys=['apsan_produtos','apsan_compras','apsan_notificacoes'];
    const marker='apsan_cache_storage_migrated_v2';
    if(sessionStorage.getItem(marker)==='1')return;
    for(const key of keys){
      const raw=localStorage.getItem(key);
      if(!raw||raw.length<2048)continue;
      let data;
      try{data=JSON.parse(raw)}catch(e){continue}
      const state={changed:false,moved:0};
      const migrated=await migrateValue(data,await caches.open(CACHE_NAME),key,state);
      if(state.changed){
        try{
          localStorage.setItem(key,JSON.stringify(migrated));
          console.info('APSAN armazenamento migrado',key,Math.round(state.moved/1024/1024*100)/100+' MB');
        }catch(e){
          console.warn('APSAN não conseguiu compactar '+key,e);
        }
      }
    }
    try{sessionStorage.setItem(marker,'1')}catch(e){}
  }catch(e){console.warn('APSAN migração de armazenamento',e)}
}

function boot(){
  storageReady().then(()=>migrateLocalData());
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
