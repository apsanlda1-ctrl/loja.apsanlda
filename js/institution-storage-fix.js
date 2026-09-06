/* APSAN — proteção de quota para cadastro institucional
   Não altera os dados pedagógicos. Atua apenas quando o Local Storage
   rejeita a gravação de apsan_institutions_v2 por falta de espaço.
*/
(function(){
'use strict';
const INST='apsan_institutions_v2';
const original=Storage.prototype.setItem;
let handling=false;
function cleanup(){
  ['apsan_institutions','apsan_institution_drafts_v1','apsan_institution_uploads_v1','apsan_institution_cache_v1','apsan_online_temp','apsan_online_drafts_v1','apsan_product_upload_drafts_v1','apsan_product_upload_drafts_v2'].forEach(k=>{try{localStorage.removeItem(k)}catch(e){}});
}
function compact(raw){
  try{
    const arr=JSON.parse(raw); if(!Array.isArray(arr))return raw;
    return JSON.stringify(arr.map(x=>{
      const y=Object.assign({},x);
      // Documentos normais são preservados. Apenas referências de data URL
      // extremamente grandes e redundantes são reduzidas como último recurso.
      const docs=y.documents||y.docs;
      if(docs&&typeof docs==='object'){
        ['legal','license','other'].forEach(k=>{
          if(typeof docs[k]==='string'&&docs[k].length>1200000){
            docs[k]={stored:'local-storage-limit',name:'Documento anexado',size:docs[k].length};
          }
        });
      }
      return y;
    }));
  }catch(e){return raw}
}
Storage.prototype.setItem=function(key,value){
  try{return original.call(this,key,value)}catch(err){
    if(key!==INST||handling||!(err&&err.name==='QuotaExceededError'))throw err;
    handling=true;
    try{
      cleanup();
      try{return original.call(this,key,value)}catch(err2){return original.call(this,key,compact(value))}
    }finally{handling=false}
  }
};
})();
