/* APSAN — correção definitiva do botão de publicação física.
   Não altera nem oculta campos. Remove apenas o listener físico defeituoso,
   mantém todos os campos e liga o botão a uma publicação imediata no marketplace.
*/
(function(){
'use strict';
const KEY='apsan_produtos';
const SESSION='apsan_current_seller';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function seller(){
  try{if(typeof currentSeller!=='undefined'&&currentSeller?.id)return currentSeller}catch(e){}
  try{if(window.currentSeller?.id)return window.currentSeller}catch(e){}
  try{if(typeof currentSalesSeller!=='undefined'&&currentSalesSeller?.id)return currentSalesSeller}catch(e){}
  return read(SESSION);
}
function fileData(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
function id(){return `PROD-${Date.now()}-${Math.random().toString(36).slice(2,8)}`}
async function publish(e){
  e.preventDefault();
  e.stopImmediatePropagation();
  const form=e.currentTarget,s=seller();
  if(!s?.id){alert('Inicie a sessão do vendedor primeiro.');return}
  if(!form.checkValidity()){form.reportValidity();return}
  const cover=document.getElementById('physicalCover')?.files?.[0];
  if(!cover){alert('A fotografia do produto é obrigatória.');return}
  if(cover.size>5*1024*1024){alert('A fotografia deve ter no máximo 5 MB.');return}
  const price=Number(document.getElementById('physicalPrice')?.value),quantity=Number(document.getElementById('physicalQuantity')?.value);
  if(!Number.isFinite(price)||price<0){alert('Introduza um preço válido.');return}
  if(!Number.isInteger(quantity)||quantity<1){alert('A quantidade deve ser pelo menos 1.');return}
  const btn=form.querySelector('button[type="submit"]');
  if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A publicar...'}
  try{
    const products=Array.isArray(read(KEY))?read(KEY):[];
    const coverImage=await fileData(cover);
    const now=new Date().toISOString();
    const product={
      id:id(),sellerId:s.id,sellerName:s.name||s.nome||'Vendedor',
      name:document.getElementById('physicalName').value.trim(),
      category:document.getElementById('physicalCategory').value,
      contentType:'physical',productType:'physical',contentTypeLabel:'Produto físico',
      realPrice:price,promoPrice:null,coverImage,productFileName:'',productFileType:'',productFileSize:0,productFileData:'',productFileStorageId:'localStorage',productFileUrl:'',
      publishedAt:now,status:'approved',approved:true,approvedAt:now,uploadStatus:'ready',uploadProgress:100,rejectionReason:'',deleted:false,salesCount:0,totalSold:0,
      quantity,stock:quantity,origin:document.getElementById('physicalOrigin').value.trim(),province:document.getElementById('physicalProvince').value,location:document.getElementById('physicalLocation').value.trim(),deliveryProvinces:document.getElementById('physicalDelivery').value.trim(),description:document.getElementById('physicalDescription').value.trim(),deliveryType:'Entrega nacional'
    };
    save(KEY,[...products,product]);
    if(typeof window.renderPublicProducts==='function')window.renderPublicProducts();
    if(typeof window.renderAdmin==='function')window.renderAdmin();
    if(typeof window.updateSellerFinance==='function')window.updateSellerFinance();
    form.reset();
    const note=document.querySelector('#apsanPhysicalForm .apsan-physical-note');
    if(note)note.innerHTML='<i class="fa-solid fa-circle-check"></i> Publicação concluída. O produto já está disponível no marketplace do site.';
    alert('Produto publicado com sucesso! Já está disponível no marketplace.');
  }catch(err){console.error('APSAN physical publish fix',err);alert('Não foi possível publicar o produto. Tente novamente.');}
  finally{if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-store"></i> Vender produto físico';}}
}
function bind(){
  let form=document.getElementById('apsanPhysicalInnerForm');
  if(!form)return;
  if(form.dataset.apsanPublishFixed==='1')return;
  /* Substitui o formulário recém-criado antes da interação do vendedor.
     Isso remove o listener antigo que tinha um selector inválido no botão. */
  const clean=form.cloneNode(true);
  clean.dataset.apsanPublishFixed='1';
  form.replaceWith(clean);
  form=clean;
  form.addEventListener('submit',publish,false);
  const cover=form.querySelector('#physicalCover');
  if(cover){cover.addEventListener('change',function(){
    const f=this.files?.[0],zone=document.getElementById('physicalCoverZone');
    if(!f)return;
    if(f.size>5*1024*1024){this.value='';alert('A fotografia deve ter no máximo 5 MB.');return}
    if(zone){zone.classList.add('has-file');zone.querySelector('strong')?.replaceChildren(document.createTextNode(f.name));}
  })}
}
function boot(){
  bind();
  new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
