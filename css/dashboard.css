/* APSAN — app.js
   Código extraído do index.html original.
   Ordem das dependências preservada pelo carregamento modular no index.html.
*/

/* ===== Código original: linhas 1818-1847 ===== */
/* Validação de vídeo: nunca bloqueia o botão Vender por erro técnico do navegador. */
window.videoValidationPromise = Promise.resolve(true);
window.validateVideoDuration = function(file){
  if(!file || !String(file.type||'').startsWith('video/')) return Promise.resolve(true);
  return new Promise(function(resolve){
    var video=document.createElement('video');
    var url=''; var done=false;
    function finish(ok){
      if(done)return; done=true;
      try{if(url)URL.revokeObjectURL(url)}catch(e){}
      try{video.removeAttribute('src');video.load()}catch(e){}
      resolve(ok);
    }
    try{
      url=URL.createObjectURL(file);
      video.preload='metadata';
      video.onloadedmetadata=function(){
        var duration=Number(video.duration);
        if(Number.isFinite(duration) && duration>360){
          alert('O vídeo não pode ter mais de 6 minutos. Escolha um vídeo com duração máxima de 6 minutos.');
          finish(false);
        }else finish(true);
      };
      /* Se o browser não conseguir ler a duração, não transforma isso num erro de publicação. */
      video.onerror=function(){finish(true)};
      video.src=url;
    }catch(e){finish(true)}
  });
}


/* ===== Código original: linhas 1849-2079 ===== */
const STORAGE_KEY="apsan_vendedores", PRODUCTS_KEY="apsan_produtos", ORDERS_KEY="apsan_compras", WITHDRAWALS_KEY="apsan_saques", NOTIFY_KEY="apsan_notificacoes";
const LOCAL_ADMIN_EMAIL="suporte@apsanlda.com";
const LOCAL_ADMIN_HASH_KEY="apsan_admin_password_hash";
function normalizeIdentity(v){return String(v||"").trim().toLowerCase().replace(/\s+/g," ")}
function getData(key){try{return JSON.parse(localStorage.getItem(key)||"[]")}catch(e){return[]}}
function setData(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch(e){console.error("APSAN localStorage",e);if(e?.name==="QuotaExceededError")alert("O armazenamento local do navegador está cheio. Reduza o tamanho dos ficheiros ou limpe dados antigos.");else alert("Não foi possível guardar os dados neste navegador.");return false}}
function refreshRealtimeUI(key){try{if(key===PRODUCTS_KEY){renderPublicProducts();if(document.getElementById("adminPage")?.classList.contains("visible"))renderAdmin()}if(key===ORDERS_KEY&&document.getElementById("adminPage")?.classList.contains("visible"))renderAdmin();if(key===STORAGE_KEY){if(currentSalesSeller){currentSalesSeller=getData(STORAGE_KEY).find(s=>s.id===currentSalesSeller.id)||currentSalesSeller;renderSellerSales(currentSalesSeller)}if(currentSeller){currentSeller=getData(STORAGE_KEY).find(s=>s.id===currentSeller.id)||currentSeller;updateSellerFinance()}if(document.getElementById("adminPage")?.classList.contains("visible"))renderAdmin()}if(key===WITHDRAWALS_KEY||key===NOTIFY_KEY){if(currentSalesSeller)renderSellerSales(currentSalesSeller);if(document.getElementById("adminPage")?.classList.contains("visible"))renderAdmin()}}catch(err){console.warn("APSAN local UI",err)}}

function sellerFinancials(seller){
 const products=getData(PRODUCTS_KEY),purchases=getData(ORDERS_KEY),withdrawals=getData(WITHDRAWALS_KEY);
 const sellerProducts=products.filter(p=>p.sellerId===seller.id&&!p.deleted),productIds=new Set(sellerProducts.map(p=>p.id));
 const approvedPurchases=purchases.filter(x=>productIds.has(x.productId)&&(x.status==="paid"||x.status==="released"||x.paymentStatus==="approved"||x.approved===true));
 const approvedTotal=approvedPurchases.reduce((sum,x)=>{const p=sellerProducts.find(y=>y.id===x.productId);return sum+(Number(x.amount)||Number(x.paidAmount)||Number(x.price)||Number(p?.promoPrice??p?.realPrice)||0)},0);
 const withdrawn=withdrawals.filter(x=>x.sellerId===seller.id&&["pending","requested","approved","processing","paid","completed","transferido"].includes(x.status)).reduce((sum,x)=>sum+(Number(x.grossAmount??x.amount)||0),0);
 return {approvedTotal,withdrawn,balance:Math.max(0,approvedTotal-withdrawn)};
}
function updateSellerFinance(){if(!currentSeller)return;const f=sellerFinancials(currentSeller);["sellerBalance","sellerCurrentBalance"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=formatKz(f.balance)});const approved=document.getElementById("sellerApprovedTotal"),withdrawn=document.getElementById("sellerWithdrawnTotal");if(approved)approved.textContent=formatKz(f.approvedTotal);if(withdrawn)withdrawn.textContent=formatKz(f.withdrawn)}



let currentSeller=null,currentCoverData="",currentCoverFile=null,currentProductFileData="",currentProductFile=null,currentSalesSeller=null,adminAuthenticated=false;

function previewCover(e){
  const f=e.target.files?.[0];
  currentCoverFile=f||null;
  if(currentCoverData){try{URL.revokeObjectURL(currentCoverData)}catch(_){}}
  currentCoverData="";
  if(!f)return;
  const url=URL.createObjectURL(f);
  currentCoverData=url;
  document.getElementById("coverPreview").innerHTML=`<img src="${url}" alt="Capa do produto">`;
}
function updateProductUpload(){const type=document.getElementById("contentType")?.value,input=document.getElementById("productFile");if(!input)return;const cfg={ebook:{accept:".pdf,application/pdf",title:"Carregar e-book",help:"PDF — ideal para livros, apostilas e manuais digitais. Envio direto e seguro.",icon:"fa-book"},video:{accept:"video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov",title:"Carregar vídeo do curso",help:"MP4, WebM ou MOV — para cursos, aulas e formações. Duração máxima: 6 minutos.",icon:"fa-video"},audio:{accept:"audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/ogg,.mp3,.wav,.m4a,.ogg",title:"Carregar áudio",help:"MP3, WAV, M4A ou OGG — para músicas, aulas, podcasts e outros áudios. Envio direto e seguro.",icon:"fa-music"},document:{accept:".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,application/pdf",title:"Carregar material digital",help:"PDF, imagem, DOC ou DOCX.",icon:"fa-file-arrow-up"}}[type];input.value="";input.accept=cfg?cfg.accept:"";document.getElementById("productFileTitle").textContent=cfg?cfg.title:"Carregar conteúdo";document.getElementById("productFileHelp").textContent=cfg?cfg.help:"Escolha primeiro o tipo de conteúdo.";document.getElementById("productFileIcon").className="fa-solid "+(cfg?cfg.icon:"fa-file-arrow-up");document.getElementById("productFileName").innerHTML="";document.getElementById("mediaPreview").style.display="none";document.getElementById("mediaPreview").innerHTML="";currentProductFileData="";currentProductFile=null}
let pendingProductUpload=null;

function ensureProductUploadDraft(){
  if(!pendingProductUpload || pendingProductUpload.sellerId!==currentSeller?.id){
    pendingProductUpload={
      id:'DRAFT-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
      sellerId:currentSeller?.id||'',
      file:null,cover:null,
      fileUrl:'',coverUrl:'',
      filePromise:null,coverPromise:null,
      fileProgress:0,coverProgress:0,
      fileError:null,coverError:null
    };
  }
  return pendingProductUpload;
}

function updatePreUploadUI(){
  const d=pendingProductUpload;if(!d)return;
  const pct=Math.round((d.fileProgress*0.85)+(d.coverProgress*0.15));
  const el=document.getElementById('productFileName');
  if(el && d.file){
    const state=d.fileError?'Falhou':(d.fileUrl?'Guardado neste dispositivo':`A guardar neste dispositivo ${d.fileProgress}%`);
    el.innerHTML=`<i class="fa-solid ${d.fileUrl?'fa-circle-check':'fa-file-arrow-up'}"></i> ${escapeHtml(d.file.name)} <small>(${(d.file.size/1024/1024).toFixed(2)} MB) • ${state}</small>`;
  }
  const btn=document.querySelector('#productForm button[type=submit]');
  if(btn && (d.filePromise||d.coverPromise)){
    if(d.fileUrl && (!d.cover || d.coverUrl)){
      btn.title='Os ficheiros já estão guardados neste dispositivo. Ao clicar em Vender, o produto será enviado para aprovação.';
    }
  }
}

async function startImmediateProductUpload(file,type){
  if(!file||!currentSeller)return;
  const d=ensureProductUploadDraft();
  const safeName=(file.name||'arquivo').replace(/[^\w.\-]+/g,'_').slice(-180);
  const path=`apsan/produtos/${currentSeller.id}/${d.id}/${type==='cover'?'capa':'conteudo'}-${safeName}`;
  const progress=(pct)=>{if(type==='cover')d.coverProgress=pct;else d.fileProgress=pct;updatePreUploadUI()};
  if(type==='cover'){
    d.cover=file;d.coverUrl='';d.coverError=null;
    d.coverPromise=uploadFileToLocalStorage(file,path,progress).then(url=>{d.coverUrl=url;d.coverProgress=100;updatePreUploadUI();return url}).catch(err=>{d.coverError=err;throw err});
    return d.coverPromise;
  }
  d.file=file;d.fileUrl='';d.fileError=null;
  d.filePromise=uploadFileToLocalStorage(file,path,progress).then(url=>{d.fileUrl=url;d.fileProgress=100;updatePreUploadUI();return url}).catch(err=>{d.fileError=err;throw err});
  return d.filePromise;
}

function previewCover(e){
  const f=e.target.files?.[0];
  currentCoverFile=f||null;
  if(currentCoverData){try{URL.revokeObjectURL(currentCoverData)}catch(_){} }
  currentCoverData="";
  if(!f)return;
  const url=URL.createObjectURL(f);
  currentCoverData=url;
  document.getElementById("coverPreview").innerHTML=`<img src="${url}" alt="Capa do produto">`;
  // A capa também começa a ser enviada imediatamente, sem esperar pelo botão Vender.
  if(currentSeller){
    startImmediateProductUpload(f,'cover').catch(err=>console.error('APSAN upload capa',err));
  }
}
function updateProductUpload(){const type=document.getElementById("contentType")?.value,input=document.getElementById("productFile");if(!input)return;const cfg={ebook:{accept:".pdf,application/pdf",title:"Carregar e-book",help:"PDF — ideal para livros, apostilas e manuais digitais. Envio direto e seguro.",icon:"fa-book"},video:{accept:"video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov",title:"Carregar vídeo do curso",help:"MP4, WebM ou MOV — para cursos, aulas e formações. Duração máxima: 6 minutos.",icon:"fa-video"},audio:{accept:"audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/ogg,.mp3,.wav,.m4a,.ogg",title:"Carregar áudio",help:"MP3, WAV, M4A ou OGG — para músicas, aulas, podcasts e outros áudios. Envio direto e seguro.",icon:"fa-music"},document:{accept:".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,application/pdf",title:"Carregar material digital",help:"PDF, imagem, DOC ou DOCX.",icon:"fa-file-arrow-up"}}[type];input.value="";input.accept=cfg?cfg.accept:"";document.getElementById("productFileTitle").textContent=cfg?cfg.title:"Carregar conteúdo";document.getElementById("productFileHelp").textContent=cfg?cfg.help:"Escolha primeiro o tipo de conteúdo.";document.getElementById("productFileIcon").className="fa-solid "+(cfg?cfg.icon:"fa-file-arrow-up");document.getElementById("productFileName").innerHTML="";document.getElementById("mediaPreview").style.display="none";document.getElementById("mediaPreview").innerHTML="";currentProductFileData="";currentProductFile=null;pendingProductUpload=null}
function showProductFile(e){
  const f=e.target.files?.[0],type=document.getElementById("contentType").value;
  currentProductFile=f||null;
  currentProductFileData="";
  if(type==="video"){
    window.videoValidationPromise=window.validateVideoDuration(f).then(function(ok){
      if(!ok){
        e.target.value="";currentProductFile=null;pendingProductUpload=null;
        document.getElementById("productFileName").innerHTML="";document.getElementById("mediaPreview").innerHTML="";document.getElementById("mediaPreview").style.display="none";
      }
      return ok;
    }).catch(function(){ return true; });
  }else window.videoValidationPromise=Promise.resolve(true);
  if(!f)return;
  const allowed={ebook:["application/pdf"],video:["video/mp4","video/webm","video/quicktime"],audio:["audio/mpeg","audio/wav","audio/x-wav","audio/mp4","audio/ogg"],document:["application/pdf","image/png","image/jpeg","image/webp","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}[type]||[];
  if(allowed.length && f.type && !allowed.includes(f.type)){e.target.value="";currentProductFile=null;return alert("O arquivo não corresponde ao formato escolhido.")}
  const d=ensureProductUploadDraft();
  d.file=f;
  document.getElementById("productFileName").innerHTML=`<i class="fa-solid fa-file-arrow-up"></i> ${escapeHtml(f.name)} <small>(${(f.size/1024/1024).toFixed(2)} MB) • A guardar neste dispositivo 0%</small>`;
  const box=document.getElementById("mediaPreview");
  if(type==="video"){
    if(box.dataset.objectUrl){try{URL.revokeObjectURL(box.dataset.objectUrl)}catch(_){} }
    const url=URL.createObjectURL(f);box.dataset.objectUrl=url;box.style.display="block";box.innerHTML=`<video controls preload="metadata" src="${url}"></video>`;
  }else if(type==="audio"){
    if(box.dataset.objectUrl){try{URL.revokeObjectURL(box.dataset.objectUrl)}catch(_){} }
    const url=URL.createObjectURL(f);box.dataset.objectUrl=url;box.style.display="block";box.innerHTML=`<audio controls src="${url}"></audio>`;
  }
  // UPLOAD IMEDIATO: o ficheiro vai neste dispositivo assim que é escolhido.
  if(currentSeller){
    startImmediateProductUpload(f,'file').catch(err=>{
      console.error('APSAN upload produto',err);
      const msg=err?.code==='storage/unauthorized'?'O navegador não conseguiu guardar o ficheiro neste dispositivo. Tente novamente com um ficheiro menor.':'Não foi possível guardar o ficheiro neste dispositivo.';
      document.getElementById("productFileName").innerHTML+=`<small style="display:block;color:#dc2626">${msg}</small>`;
    });
  }else{
    document.getElementById("productFileName").innerHTML+=`<small style="display:block;color:#b45309">Inicie a sessão do vendedor para começar o envio neste dispositivo.</small>`;
  }
}
function updatePricePreview(){const real=parseFloat(document.getElementById("realPrice").value),promo=parseFloat(document.getElementById("promoPrice").value),t=document.getElementById("pricePreview");if(!isNaN(promo)&&promo>=0&&!isNaN(real))t.innerHTML=`<del>${formatKz(real)}</del> <strong>${formatKz(promo)}</strong>`;else if(!isNaN(real))t.textContent=formatKz(real);else t.textContent="—"}
function formatKz(v){return new Intl.NumberFormat("pt-AO",{style:"currency",currency:"AOA",maximumFractionDigits:2}).format(v)}

async function uploadFileToLocalStorage(file,path,onProgress){if(!file)throw new Error("FILE_REQUIRED");if(typeof onProgress==="function")onProgress(10);const data=await fileToDataURL(file);if(typeof onProgress==="function")onProgress(100);return data;}
async function saveProductsLocalNow(products){if(!setData(PRODUCTS_KEY,products))throw new Error("LOCAL_STORAGE_SAVE_FAILED");}
async function saveNotificationsLocalNow(notices){if(!setData(NOTIFY_KEY,notices))throw new Error("LOCAL_STORAGE_SAVE_FAILED");}

function setUploadButton(btn,text,percent,subtext){
  if(!btn)return;
  const pct=Math.max(0,Math.min(100,Number(percent)||0));
  btn.innerHTML=`<span style="display:inline-flex;align-items:center;gap:8px;justify-content:center;width:100%"><i class="fa-solid ${pct>=100?'fa-check':'fa-file-arrow-up'}"></i> ${escapeHtml(text)} ${pct<100?`<strong>${Math.round(pct)}%</strong>`:''}</span>`;
  btn.title=subtext||'';
}

async function publishProduct(e){
  e.preventDefault();
  const submitBtn=document.querySelector('#productForm button[type=submit]');
  if(submitBtn?.dataset.busy==='1')return;
  const resetButton=()=>{if(submitBtn){submitBtn.dataset.busy='0';submitBtn.disabled=false;submitBtn.innerHTML='<i class="fa-solid fa-shop"></i> Vender';submitBtn.title='';}};
  const setBtn=(text)=>{if(submitBtn){submitBtn.dataset.busy='1';submitBtn.disabled=true;submitBtn.innerHTML=`<span style="display:inline-flex;align-items:center;gap:8px;justify-content:center;width:100%"><i class="fa-solid fa-spinner fa-spin"></i> ${text}</span>`;}};
  setBtn('A finalizar publicação...');
  try{
    if(!currentSeller){alert('Inicie a sessão do vendedor primeiro.');return}
    const form=document.getElementById('productForm');
    const cover=document.getElementById('coverImage')?.files?.[0];
    const file=document.getElementById('productFile')?.files?.[0];
    const contentType=document.getElementById('contentType')?.value;
    if(!form.checkValidity()){form.reportValidity();return}
    if(!cover||!file){alert('A foto de capa e o conteúdo do produto são obrigatórios.');return}
    if(!contentType){alert('Selecione o tipo de conteúdo.');return}
    if(contentType==='video'){
      const videoOK=await (window.videoValidationPromise||Promise.resolve(true));
      if(!videoOK)return;
    }
    const real=parseFloat(document.getElementById('realPrice').value),pv=document.getElementById('promoPrice').value,promo=pv===''?null:parseFloat(pv);
    if(!Number.isFinite(real)||real<0){alert('Introduza um preço real válido.');return}
    if(promo!==null&&(!Number.isFinite(promo)||promo<0)){alert('Introduza um preço promocional válido.');return}
    if(promo!==null&&promo>real){alert('O preço promocional não pode ser maior que o preço real.');return}

    const d=pendingProductUpload;
    if(!d || d.file!==file || d.cover!==cover){
      // Caso o navegador tenha disparado o formulário antes dos eventos de seleção terminarem.
      ensureProductUploadDraft();
      if(!pendingProductUpload.filePromise)startImmediateProductUpload(file,'file');
      if(!pendingProductUpload.coverPromise)startImmediateProductUpload(cover,'cover');
    }
    const draft=pendingProductUpload;
    setBtn('A confirmar ficheiros neste dispositivo...');
    const [productFileUrl,coverImageUrl]=await Promise.all([draft.fileUrl?Promise.resolve(draft.fileUrl):draft.filePromise,draft.coverUrl?Promise.resolve(draft.coverUrl):draft.coverPromise]);
    if(!productFileUrl||!coverImageUrl)throw new Error('LOCAL_FILE_DATA_MISSING');

    const labels={ebook:'E-book / Livro digital',video:'Curso / Formação em vídeo',audio:'Áudio / Música / Podcast',document:'Documento / Material digital'};
    const id='PROD-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
    const product={
      id,sellerId:currentSeller.id,sellerName:currentSeller.name,
      name:document.getElementById('productName').value.trim(),category:document.getElementById('productCategory').value,
      contentType,contentTypeLabel:labels[contentType],realPrice:real,promoPrice:promo,
      coverImage:coverImageUrl,productFileName:file.name,productFileType:file.type||'application/octet-stream',productFileSize:file.size||0,
      productFileData:productFileUrl,productFileStorageId:'localStorage',productFileUrl:productFileUrl,
      publishedAt:new Date().toISOString(),status:'pending',uploadStatus:'ready',uploadProgress:100,
      rejectionReason:'',approvedAt:null,deleted:false,salesCount:0,totalSold:0
    };
    setBtn('A enviar para aprovação...');
    const products=getData(PRODUCTS_KEY);products.push(product);
    await saveProductsLocalNow(products);

    const adminNotice={id:'ADMIN-PROD-'+Date.now(),audience:'admin',type:'product_approval',productId:product.id,sellerId:product.sellerId,sellerName:product.sellerName,productName:product.name,title:'Novo produto aguardando aprovação',message:`${product.sellerName} enviou o produto "${product.name}" para aprovação.`,createdAt:new Date().toISOString(),read:false};
    const notices=getData(NOTIFY_KEY);notices.push(adminNotice);await saveNotificationsLocalNow(notices);
    renderAdmin();renderPublicProducts();
    form.reset();pendingProductUpload=null;
    document.getElementById('coverPreview').innerHTML='';document.getElementById('productFileName').innerHTML='';document.getElementById('mediaPreview').innerHTML='';document.getElementById('mediaPreview').style.display='none';cleanupProductUploadPreview();updateProductUpload();updatePricePreview();
    document.getElementById('successModal').classList.add('visible');
    document.querySelector('#successModal p').textContent='Produto enviado com sucesso. Os ficheiros já estavam guardados neste dispositivo e o produto foi encaminhado para aprovação do administrador.';
  }catch(err){
    console.error('publishProduct',err);
    let message='Não foi possível concluir a publicação.';
    if(err?.code==='storage/unauthorized')message='O navegador não conseguiu guardar o ficheiro neste dispositivo. Tente novamente com um ficheiro menor.';
    else if(err?.code==='storage/quota-exceeded')message='A quota de armazenamento do armazenamento local foi atingida.';
    else if(err?.code==='storage/canceled')message='O envio do ficheiro foi cancelado.';
    else if(err?.message==='LOCAL_FILE_DATA_MISSING')message='O ficheiro ainda não ficou disponível neste dispositivo. Aguarde o fim do upload e tente novamente.';
    else if(err?.message)message+=' '+err.message;
    alert(message);
  }finally{resetButton();}
}

function renderPublicProducts(){
    updateSellerFinance();
 const grid=document.getElementById("publicProductGrid"),products=getData(PRODUCTS_KEY).filter(p=>p.status==="approved"&&!p.deleted);
 if(!products.length){grid.innerHTML=`<div class="product-card"><i class="fa-solid fa-hourglass-half"></i><h3>Aguardando novos produtos</h3><p>Os produtos enviados pelos vendedores aparecem aqui depois de serem aprovados pelos administradores.</p></div>`;return}
 grid.innerHTML=products.map(p=>{const price=p.promoPrice!==null?`<span class="old-price">${formatKz(p.realPrice)}</span><strong class="sale-price">${formatKz(p.promoPrice)}</strong>`:`<strong class="sale-price">${formatKz(p.realPrice)}</strong>`;return `<div class="product-card published-product"><div class="published-cover">${p.coverImage?`<img src="${p.coverImage}" alt="${escapeHtml(p.name)}">`:`<i class="fa-solid fa-box-open"></i>`}</div><div class="published-content"><span class="market-status"><i class="fa-solid fa-circle"></i> À venda</span><span class="product-category">${escapeHtml(p.category)}</span>${p.contentTypeLabel?`<span class="content-badge"><i class="fa-solid ${p.contentType==="video"?"fa-video":p.contentType==="audio"?"fa-music":p.contentType==="ebook"?"fa-book":"fa-file-lines"}"></i> ${escapeHtml(p.contentTypeLabel)}</span>`:""}<h3>${escapeHtml(p.name)}</h3><p>Vendido por <strong>${escapeHtml(p.sellerName)}</strong></p><div class="published-price">${price}</div><button class="buy-btn" onclick="openPurchasePage('${p.id}')"><i class="fa-solid fa-cart-shopping"></i> Comprar</button></div></div>`}).join("")
}
updateSellerFinance();
function closeSuccessModal(){document.getElementById("successModal").classList.remove("visible");document.getElementById("sellerDashboardPage").classList.remove("visible");document.body.classList.remove("page-open");scrollToSection("products")}
function goHome(){document.getElementById("sellerRegistrationPage").classList.remove("visible");document.getElementById("sellerDashboardPage").classList.remove("visible");document.body.classList.remove("page-open")}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}


