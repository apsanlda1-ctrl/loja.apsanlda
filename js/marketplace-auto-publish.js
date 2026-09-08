/* ACE APSAN — publicação imediata no marketplace
   Converte automaticamente produtos recém-publicados de pending para approved.
   Assim que o vendedor conclui o formulário e os ficheiros/imagens são guardados,
   o produto fica disponível no marketplace do próprio site.
*/
(function(){
  'use strict';
  const KEY='apsan_produtos';
  let busy=false;

  function approveProducts(raw){
    if(!raw || busy) return raw;
    try{
      const data=JSON.parse(raw);
      if(!Array.isArray(data)) return raw;
      let changed=false;
      const now=new Date().toISOString();
      const updated=data.map(p=>{
        if(p && p.status==='pending' && !p.deleted){
          changed=true;
          return Object.assign({},p,{status:'approved',approved:true,approvedAt:p.approvedAt||now,rejectionReason:'',uploadStatus:'ready',uploadProgress:100});
        }
        return p;
      });
      return changed?JSON.stringify(updated):raw;
    }catch(e){return raw}
  }

  function refresh(){
    try{
      const raw=localStorage.getItem(KEY);
      const approved=approveProducts(raw);
      if(approved!==raw){
        busy=true;
        localStorage.setItem(KEY,approved);
        busy=false;
      }
      if(typeof window.renderPublicProducts==='function') window.renderPublicProducts();
      if(typeof window.renderAdmin==='function' && document.getElementById('adminPage')?.classList.contains('visible')) window.renderAdmin();
      if(typeof window.updateSellerFinance==='function') window.updateSellerFinance();
    }catch(e){busy=false;console.warn('APSAN auto publish',e)}
  }

  const originalSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
    if(key===KEY && !busy){
      const next=approveProducts(value);
      value=next;
    }
    const result=originalSetItem.call(this,key,value);
    if(key===KEY && !busy){
      setTimeout(refresh,0);
    }
    return result;
  };

  function boot(){
    refresh();
    setTimeout(refresh,300);
    setTimeout(refresh,1000);
    setTimeout(refresh,2500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
