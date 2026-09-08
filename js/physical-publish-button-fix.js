/* APSAN — correção definitiva do botão de publicação física. */
(function(){
'use strict';
const KEY='apsan_produtos',SESSION='apsan_current_seller';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function seller(){try{if(typeof currentSeller!=='undefined'&&currentSeller?.id)return currentSeller}catch(e){}try{if(typeof currentSalesSeller!=='undefined'&&currentSalesSeller?.id)return currentSalesSeller}catch(e){}try{if(window.currentSeller?.id)return window.currentSeller}catch(e){}return read(SESSION)}
function fileData(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
async function imageStorage(file){
  if(typeof window.uploadFileToLocalStorage==='function'){
    try{return {url:await window.uploadFileToLocalStorage(file,'apsan/produtos/fisicos/'+Date.now()+'-'+file.name),storage:'cache'}}catch(e){console.warn('APSAN cache storage indisponível',e)}
  }
  return {url:await fileData(file),storage:'localStorage'};
}
function id(){return 'PROD-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
async function publish(e){
 e.preventDefault();e.stopImmediatePropagation();
 const form=e.currentTarget,s=seller();
 if(!s?.id){alert('Inicie a sessão do vendedor primeiro.');return}
 if(!form.checkValidity()){form.reportValidity();return}
 const cover=form.querySelector('#physicalCover')?.files?.[0];
 if(!cover){alert('A fotografia do produto é obrigatória.');return}
 if(cover.size>5*1024*1024){alert('A fotografia deve ter no máximo 5 MB.');return}
 const price=Number(form.querySelector('#physicalPrice')?.value),quantity=Number(form.querySelector('#physicalQuantity')?.value);
 if(!Number.isFinite(price)||price<0){alert('Introduza um preço válido.');return}
 if(!Number.isInteger(quantity)||quantity<1){alert('A quantidade deve ser pelo menos 1.');return}
 const btn=form.querySelector('button[type="submit"]');if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A publicar...'}
 try{
   const products=Array.isArray(read(KEY))?read(KEY):[];
   const stored=await imageStorage(cover),now=new Date().toISOString();
   const product={id:id(),sellerId:s.id,sellerName:s.name||s.nome||'Vendedor',name:form.querySelector('#physicalName').value.trim(),category:form.querySelector('#physicalCategory').value,contentType:'physical',productType:'physical',contentTypeLabel:'Produto físico',realPrice:price,promoPrice:null,coverImage:stored.url,productFileName:'',productFileType:'',productFileSize:0,productFileData:'',productFileStorageId:stored.storage,productFileUrl:'',publishedAt:now,status:'approved',approved:true,approvedAt:now,uploadStatus:'ready',uploadProgress:100,rejectionReason:'',deleted:false,salesCount:0,totalSold:0,quantity,stock:quantity,origin:form.querySelector('#physicalOrigin').value.trim(),province:form.querySelector('#physicalProvince').value,location:form.querySelector('#physicalLocation').value.trim(),deliveryProvinces:form.querySelector('#physicalDelivery').value.trim(),description:form.querySelector('#physicalDescription').value.trim(),deliveryType:'Entrega nacional'};
   save(KEY,[...products,product]);
   if(typeof window.renderPublicProducts==='function')window.renderPublicProducts();
   if(typeof window.renderAdmin==='function')window.renderAdmin();
   if(typeof window.updateSellerFinance==='function')window.updateSellerFinance();
   form.reset();
   alert('Produto publicado com sucesso! Já está disponível no marketplace.');
 }catch(err){console.error('APSAN physical publish',err);alert('Não foi possível publicar o produto. Tente novamente.');}
 finally{if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-store"></i> Vender produto físico'}}
}
function bind(){let form=document.getElementById('apsanPhysicalInnerForm');if(!form||form.dataset.apsanPublishFixed==='1')return;const clean=form.cloneNode(true);clean.dataset.apsanPublishFixed='1';form.replaceWith(clean);clean.addEventListener('submit',publish,false)}
function boot(){bind();new MutationObserver(bind).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();