/* APSAN — correção definitiva da publicação de infoprodutos */
(function(){
'use strict';
const getLexical=name=>{try{return Function('return (typeof '+name+'!=="undefined")?'+name+':null')()}catch(e){return null}};
const setLexical=(name,value)=>{try{Function(name+'=arguments[0]')(value);return true}catch(e){return false}};
function install(){
 const original=window.publishProduct;
 if(typeof original!=='function'||original.__apsanProductPublicationFix)return false;
 const fixed=async function(e){
  e?.preventDefault?.();
  const btn=document.querySelector('#productForm button[type=submit]');
  if(btn?.dataset.busy==='1')return;
  const reset=()=>{if(btn){btn.dataset.busy='0';btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-shop"></i> Vender';btn.title=''}};
  const busy=t=>{if(btn){btn.dataset.busy='1';btn.disabled=true;btn.innerHTML=`<span style="display:inline-flex;align-items:center;gap:8px;justify-content:center;width:100%"><i class="fa-solid fa-spinner fa-spin"></i> ${t}</span>`}};
  busy('A preparar publicação...');
  try{
   const seller=getLexical('currentSeller');
   if(!seller?.id)throw new Error('Inicie a sessão do vendedor primeiro.');
   const form=document.getElementById('productForm');if(!form)throw new Error('Formulário de produto não encontrado.');
   const cover=document.getElementById('coverImage')?.files?.[0],file=document.getElementById('productFile')?.files?.[0],contentType=document.getElementById('contentType')?.value;
   if(!form.checkValidity()){form.reportValidity();return}
   if(!cover||!file)throw new Error('A foto de capa e o conteúdo do produto são obrigatórios.');
   if(!contentType)throw new Error('Selecione o tipo de conteúdo.');
   if(contentType==='video'&&window.videoValidationPromise&&!await window.videoValidationPromise)return;
   const real=parseFloat(document.getElementById('realPrice')?.value),pv=document.getElementById('promoPrice')?.value||'',promo=pv===''?null:parseFloat(pv);
   if(!Number.isFinite(real)||real<0)throw new Error('Introduza um preço real válido.');
   if(promo!==null&&(!Number.isFinite(promo)||promo<0))throw new Error('Introduza um preço promocional válido.');
   if(promo!==null&&promo>real)throw new Error('O preço promocional não pode ser maior que o preço real.');
   let draft=getLexical('pendingProductUpload');
   if(!draft||draft.file!==file||draft.cover!==cover){
    const ensure=getLexical('ensureProductUploadDraft');if(ensure)draft=ensure();
    const upload=getLexical('startImmediateProductUpload');
    if(upload){if(!draft.filePromise)upload(file,'file');if(!draft.coverPromise)upload(cover,'cover');}
   }
   draft=getLexical('pendingProductUpload');if(!draft)throw new Error('O envio dos ficheiros não foi inicializado.');
   busy('A confirmar ficheiros...');
   const productFileData=draft.fileUrl?draft.fileUrl:await draft.filePromise;
   const coverImage=draft.coverUrl?draft.coverUrl:await draft.coverPromise;
   if(!productFileData||!coverImage)throw new Error('LOCAL_FILE_DATA_MISSING');
   const labels={ebook:'E-book / Livro digital',video:'Curso / Formação em vídeo',audio:'Áudio / Música / Podcast',document:'Documento / Material digital'};
   const product={id:'PROD-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),sellerId:seller.id,sellerName:seller.name,name:document.getElementById('productName').value.trim(),category:document.getElementById('productCategory').value,contentType,contentTypeLabel:labels[contentType],realPrice:real,promoPrice:promo,coverImage,productFileName:file.name,productFileType:file.type||'application/octet-stream',productFileSize:file.size||0,productFileData,productFileStorageId:'localStorage',publishedAt:new Date().toISOString(),status:'pending',approved:false,uploadStatus:'ready',uploadProgress:100,rejectionReason:'',approvedAt:null,deleted:false,salesCount:0,totalSold:0};
   busy('A enviar para aprovação...');
   const getData=getLexical('getData'),setData=getLexical('setData');
   const products=getData?getData('apsan_produtos'):JSON.parse(localStorage.getItem('apsan_produtos')||'[]');products.push(product);
   if(setData){if(!setData('apsan_produtos',products))throw new Error('Não foi possível guardar o produto neste dispositivo.');}else localStorage.setItem('apsan_produtos',JSON.stringify(products));
   const notices=getData?getData('apsan_notificacoes'):JSON.parse(localStorage.getItem('apsan_notificacoes')||'[]');notices.push({id:'ADMIN-PROD-'+Date.now(),audience:'admin',type:'product_approval',productId:product.id,sellerId:product.sellerId,sellerName:product.sellerName,productName:product.name,title:'Novo produto aguardando aprovação',message:`${product.sellerName} enviou o produto "${product.name}" para aprovação.`,createdAt:new Date().toISOString(),read:false});if(setData)setData('apsan_notificacoes',notices);else localStorage.setItem('apsan_notificacoes',JSON.stringify(notices));
   window.renderAdmin?.();window.renderPublicProducts?.();
   form.reset();setLexical('pendingProductUpload',null);
   const pfn=document.getElementById('productFileName');if(pfn)pfn.innerHTML='';document.getElementById('coverPreview')?.replaceChildren();const mp=document.getElementById('mediaPreview');if(mp){mp.innerHTML='';mp.style.display='none'}
   window.cleanupProductUploadPreview?.();window.updateProductUpload?.();window.updatePricePreview?.();
   const modal=document.getElementById('successModal');modal?.classList.add('visible');const msg=modal?.querySelector('p');if(msg)msg.textContent='Produto enviado com sucesso. Está agora em análise no painel do administrador e só ficará disponível no marketplace depois da aprovação.';
  }catch(err){console.error('APSAN publication fix',err);let msg=err?.message||'Não foi possível concluir a publicação.';if(err?.name==='QuotaExceededError'||/quota|storage.*cheio/i.test(msg))msg='O armazenamento deste navegador está cheio. Remova ficheiros ou produtos antigos e tente novamente.';alert(msg)}finally{reset()}
 };
 fixed.__apsanProductPublicationFix=true;window.publishProduct=fixed;return true;
}
function boot(){if(install())return;setTimeout(install,100);setTimeout(install,500);setTimeout(install,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();