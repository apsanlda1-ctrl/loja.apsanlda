/* APSAN — ponte da sessão e publicação física sem bloqueio */
(function(){
'use strict';
const SESSION='apsan_current_seller',KEY='apsan_produtos';
function read(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function seller(){try{if(typeof currentSeller!=='undefined'&&currentSeller?.id)return currentSeller}catch(e){}try{if(typeof currentSalesSeller!=='undefined'&&currentSalesSeller?.id)return currentSalesSeller}catch(e){}return read(SESSION)}
function sync(){const s=seller();if(s)try{localStorage.setItem(SESSION,JSON.stringify(s))}catch(e){}}
async function fileUrl(file){
 if(typeof window.uploadFileToLocalStorage==='function')try{return {url:await window.uploadFileToLocalStorage(file,'apsan/produtos/fisicos/'+Date.now()+'-'+file.name),storage:'cache'}}catch(e){}
 return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve({url:r.result,storage:'localStorage'});r.onerror=reject;r.readAsDataURL(file)})
}
async function publish(e){
 e.preventDefault();e.stopImmediatePropagation();
 const form=e.currentTarget,s=seller();if(!s?.id){alert('Inicie a sessão do vendedor primeiro.');return}
 if(!form.checkValidity()){form.reportValidity();return}
 const cover=form.querySelector('#physicalCover')?.files?.[0];if(!cover){alert('A fotografia do produto é obrigatória.');return}
 const price=Number(form.querySelector('#physicalPrice')?.value),quantity=Number(form.querySelector('#physicalQuantity')?.value);if(!Number.isFinite(price)||price<0||!Number.isInteger(quantity)||quantity<1){alert('Verifique o preço e a quantidade.');return}
 const btn=form.querySelector('button[type="submit"]');if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A publicar...'}
 try{
  const stored=await fileUrl(cover),now=new Date().toISOString(),products=Array.isArray(read(KEY))?read(KEY):[];
  const p={id:'PROD-FIS-'+Date.now(),sellerId:s.id,sellerName:s.name||s.nome||'Vendedor',name:form.querySelector('#physicalName').value.trim(),category:form.querySelector('#physicalCategory').value,contentType:'physical',productType:'physical',contentTypeLabel:'Produto físico',realPrice:price,promoPrice:null,coverImage:stored.url,productFileStorageId:stored.storage,productFileUrl:'',publishedAt:now,status:'approved',approved:true,approvedAt:now,uploadStatus:'ready',uploadProgress:100,rejectionReason:'',deleted:false,salesCount:0,totalSold:0,quantity,stock:quantity,origin:form.querySelector('#physicalOrigin').value.trim(),province:form.querySelector('#physicalProvince').value,location:form.querySelector('#physicalLocation').value.trim(),deliveryProvinces:form.querySelector('#physicalDelivery').value.trim(),description:form.querySelector('#physicalDescription').value.trim(),deliveryType:'Entrega nacional'};
  localStorage.setItem(KEY,JSON.stringify([...products,p]));
  if(typeof window.renderPublicProducts==='function')window.renderPublicProducts();if(typeof window.renderAdmin==='function')window.renderAdmin();if(typeof window.updateSellerFinance==='function')window.updateSellerFinance();
  form.reset();alert('Produto publicado com sucesso! Já está disponível no marketplace.');
 }catch(err){console.error('APSAN publicação física',err);alert('Não foi possível publicar o produto. Verifique o armazenamento do navegador e tente novamente.')}finally{if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-store"></i> Vender produto físico'}}
}
function bind(){sync();const f=document.getElementById('apsanPhysicalInnerForm');if(f&&!f.dataset.apsanPhysicalCapture){f.dataset.apsanPhysicalCapture='1';f.addEventListener('submit',publish,true)}}
function boot(){bind();new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});setInterval(sync,800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();