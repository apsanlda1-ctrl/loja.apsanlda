/* APSAN — armazenamento de ficheiros fora do localStorage
   Os ficheiros grandes NÃO devem ser guardados em localStorage.
   Usa Cache Storage sem Content-Length manual, evitando o erro
   "Failed to execute 'put' on 'Cache': network error" em navegadores móveis.
*/
(function(){
'use strict';
const CACHE_NAME='apsan-files-v2';
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
        const reg=await navigator.serviceWorker.register('/sw.js?v=20260908-storage3',{scope:'/'});
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

function makeStoredUrl(key){
  return new URL(PREFIX+encodeURIComponent(key||'arquivo')+'-'+safeId(),location.origin).href;
}

async function putFile(file,key,onProgress){
  if(!file)throw new Error('FILE_REQUIRED');
  await storageReady();
  if(typeof caches==='undefined'){
    const err=new Error('CACHE_STORAGE_UNAVAILABLE');err.code='storage/unavailable';throw err;
  }
  if(typeof onProgress==='function')onProgress(20);
  const cache=await caches.open(CACHE_NAME);
  const url=makeStoredUrl(key);
  // Não definir Content-Length manualmente: alguns navegadores Android
  // rejeitam Cache.put() com erro de rede quando esse header é forçado.
  const response=new Response(file,{status:200,headers:{'Content-Type':file.type||'application/octet-stream','Cache-Control':'public, max-age=31536000, immutable'}});
  await cache.put(new Request(url),response);
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

async function migrateValue(value,state){
  if(typeof value==='string'){
    if(value.startsWith('data:') && value.length>2048){
      const response=await fetch(value);
      const blob=await response.blob();
      const cacheStore=await caches.open(CACHE_NAME);
      const url=makeStoredUrl('migrated');
      const storedResponse=new Response(blob,{status:200,headers:{'Content-Type':blob.type||'application/octet-stream','Cache-Control':'public, max-age=31536000, immutable'}});
      await cacheStore.put(new Request(url),storedResponse);
      state.changed=true;state.moved=(state.moved||0)+blob.size;
      return url;
    }
    return value;
  }
  if(Array.isArray(value)){
    for(let i=0;i<value.length;i++)value[i]=await migrateValue(value[i],state);
    return value;
  }
  if(value&&typeof value==='object'){
    for(const k of Object.keys(value))value[k]=await migrateValue(value[k],state);
  }
  return value;
}

async function migrateLocalData(){
  try{
    await storageReady();
    if(typeof caches==='undefined')return;
    const keys=['apsan_produtos','apsan_compras','apsan_notificacoes'];
    const marker='apsan_cache_storage_migrated_v3';
    if(sessionStorage.getItem(marker)==='1')return;
    for(const key of keys){
      const raw=localStorage.getItem(key);
      if(!raw||raw.length<2048)continue;
      let data;
      try{data=JSON.parse(raw)}catch(e){continue}
      const state={changed:false,moved:0};
      const migrated=await migrateValue(data,state);
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

function boot(){storageReady().then(()=>migrateLocalData());}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
