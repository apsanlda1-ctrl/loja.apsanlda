/* APSAN — reforço da persistência da sessão/aba online e da página pública */
(function(){
  'use strict';
  const KEY='apsan_current_view_v2';
  const LANDING_KEY='apsan_public_page_v1';
  const save=s=>{try{sessionStorage.setItem(KEY,JSON.stringify(Object.assign({savedAt:Date.now()},s)))}catch(e){}};
  const saveLanding=()=>{try{sessionStorage.setItem(LANDING_KEY,JSON.stringify({hash:location.hash||'#home',scrollY:window.scrollY||0,savedAt:Date.now()}));sessionStorage.removeItem(KEY)}catch(e){}};
  const u=()=>{try{return onUser||window.onUser||null}catch(e){return window.onUser||null}};
  const mark=(extra={})=>{const x=u();if(!x?.id)return;save(Object.assign({view:'online',role:window.__apsanRole||'teacher',institutionMode:window.__apsanInstitutionMode||'',accountId:x.id,tab:'home'},extra))};
  function isLanding(){
    const home=document.getElementById('home');
    if(!home)return false;
    const candidates=document.querySelectorAll('.app-page.visible,.page.visible,[data-app-page].visible');
    return !Array.from(candidates).some(el=>{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'});
  }
  function wrap(name,after){const fn=window[name];if(typeof fn!=='function'||fn.__apsanPersistFix)return;const w=function(){const result=fn.apply(this,arguments);Promise.resolve(result).finally(()=>setTimeout(()=>after(arguments),20));return result};w.__apsanPersistFix=true;window[name]=w}
  wrap('loginOnline',()=>{mark({tab:'home'})});
  wrap('institutionEntry',args=>{window.__apsanInstitutionMode=args[0]||'';window.__apsanRole=args[0]==='admin'?'institution':args[0]||'teacher';const x=u();if(x)mark({tab:'home'})});
  wrap('openInstitutionPortal',()=>{window.__apsanRole='institution';window.__apsanInstitutionMode='admin';save({view:'online',role:'institution',institutionMode:'admin',tab:'home'})});
  wrap('onTab',args=>{const tab=args[0]||'home';mark({tab})});
  wrap('logoutOnline',()=>{try{sessionStorage.removeItem(KEY)}catch(e){}});
  ['openAdminPage','openCustomerPortal','openSellerSales','openSellerRegistration'].forEach(name=>{
    wrap(name,()=>{try{save({view:name==='openAdminPage'?'admin':name==='openCustomerPortal'?'customer':name==='openSellerSales'?'seller-sales':'seller-registration'})}catch(e){}});
  });
  function bindPublicNavigation(){
    document.addEventListener('click',function(e){
      const a=e.target.closest('a[href^="#"]');
      if(a){setTimeout(()=>{if(isLanding())saveLanding()},30);return;}
      const btn=e.target.closest('button');
      if(btn)setTimeout(()=>{if(isLanding())saveLanding()},60);
    },true);
    window.addEventListener('hashchange',()=>{if(isLanding())saveLanding()});
    let timer=0;
    window.addEventListener('scroll',()=>{if(!isLanding())return;clearTimeout(timer);timer=setTimeout(saveLanding,150)},{passive:true});
  }
  window.addEventListener('beforeunload',()=>{
    if(isLanding()){
      saveLanding();
      return;
    }
    const x=u();
    if(x?.id){
      const active=document.querySelector('#onDash .on-tab.active')?.id||'';
      const tab=active.startsWith('on')?active.slice(2):'home';
      mark({tab});
    }
  });
  function restoreLanding(){
    let st=null;try{st=JSON.parse(sessionStorage.getItem(LANDING_KEY)||'null')}catch(e){}
    if(!st)return false;
    try{
      sessionStorage.removeItem(KEY);
      if(st.hash&&st.hash!=='#home')history.replaceState(null,'',st.hash);
      setTimeout(()=>window.scrollTo({top:Number(st.scrollY)||0,behavior:'auto'}),120);
      return true;
    }catch(e){return false}
  }

  /* ===== APSAN: correção definitiva da publicação de infoprodutos =====
     O código anterior gravava o mesmo ficheiro duas vezes no produto
     (productFileData + productFileUrl). Em localStorage isso duplicava o
     tamanho do payload e fazia a publicação falhar/quota excedida.
     Aqui mantemos uma única cópia, estado pending e notificação administrativa.
  */
  function installProductPublicationFix(){
    const original=window.publishProduct;
    if(typeof original!=='function'||original.__apsanProductPublicationFix)return;
    const fixed=async function(e){
      if(e&&typeof e.preventDefault==='function')e.preventDefault();
      const btn=document.querySelector('#productForm button[type=submit]');
      const busy=()=>btn?.dataset.busy==='1';
      if(busy())return;
      const reset=()=>{if(btn){btn.dataset.busy='0';btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-shop"></i> Vender';btn.title=''}};
      const setBusy=t=>{if(btn){btn.dataset.busy='1';btn.disabled=true;btn.innerHTML=`<span style="display:inline-flex;align-items:center;gap:8px;justify-content:center;width:100%"><i class="fa-solid fa-spinner fa-spin"></i> ${t}</span>`}};
      setBusy('A preparar publicação...');
      try{
        const seller=window.currentSeller;
        if(!seller?.id)throw new Error('Inicie a sessão do vendedor primeiro.');
        const form=document.getElementById('productForm');
        if(!form)throw new Error('Formulário de produto não encontrado.');
        const cover=document.getElementById('coverImage')?.files?.[0];
        const file=document.getElementById('productFile')?.files?.[0];
        const contentType=document.getElementById('contentType')?.value;
        if(!form.checkValidity()){form.reportValidity();return;}
        if(!cover||!file)throw new Error('A foto de capa e o conteúdo do produto são obrigatórios.');
        if(!contentType)throw new Error('Selecione o tipo de conteúdo.');
        if(contentType==='video'&&window.videoValidationPromise){if(!(await window.videoValidationPromise))return;}
        const real=parseFloat(document.getElementById('realPrice')?.value);
        const promoValue=document.getElementById('promoPrice')?.value||'';
        const promo=promoValue===''?null:parseFloat(promoValue);
        if(!Number.isFinite(real)||real<0)throw new Error('Introduza um preço real válido.');
        if(promo!==null&&(!Number.isFinite(promo)||promo<0))throw new Error('Introduza um preço promocional válido.');
        if(promo!==null&&promo>real)throw new Error('O preço promocional não pode ser maior que o preço real.');

        let draft=window.pendingProductUpload;
        if(!draft||draft.file!==file||draft.cover!==cover){
          if(typeof window.ensureProductUploadDraft==='function')draft=window.ensureProductUploadDraft();
          if(typeof window.startImmediateProductUpload==='function'){
            if(!draft.filePromise)window.startImmediateProductUpload(file,'file');
            if(!draft.coverPromise)window.startImmediateProductUpload(cover,'cover');
          }
        }
        draft=window.pendingProductUpload;
        if(!draft)throw new Error('O envio dos ficheiros não foi inicializado.');
        setBusy('A confirmar ficheiros...');
        const productFileData=draft.fileUrl?draft.fileUrl:await draft.filePromise;
        const coverImage=draft.coverUrl?draft.coverUrl:await draft.coverPromise;
        if(!productFileData||!coverImage)throw new Error('LOCAL_FILE_DATA_MISSING');

        /* Evita a duplicação que causava QuotaExceededError. */
        const labels={ebook:'E-book / Livro digital',video:'Curso / Formação em vídeo',audio:'Áudio / Música / Podcast',document:'Documento / Material digital'};
        const product={
          id:'PROD-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
          sellerId:seller.id,sellerName:seller.name,
          name:document.getElementById('productName').value.trim(),
          category:document.getElementById('productCategory').value,
          contentType,contentTypeLabel:labels[contentType],realPrice:real,promoPrice:promo,
          coverImage,productFileName:file.name,productFileType:file.type||'application/octet-stream',productFileSize:file.size||0,
          productFileData,productFileStorageId:'localStorage',
          publishedAt:new Date().toISOString(),status:'pending',approved:false,uploadStatus:'ready',uploadProgress:100,
          rejectionReason:'',approvedAt:null,deleted:false,salesCount:0,totalSold:0
        };

        setBusy('A enviar para aprovação...');
        const products=typeof window.getData==='function'?window.getData('apsan_produtos'):JSON.parse(localStorage.getItem('apsan_produtos')||'[]');
        products.push(product);
        if(typeof window.setData==='function'){
          if(!window.setData('apsan_produtos',products))throw new Error('Não foi possível guardar o produto neste dispositivo.');
        }else localStorage.setItem('apsan_produtos',JSON.stringify(products));

        const notices=typeof window.getData==='function'?window.getData('apsan_notificacoes'):JSON.parse(localStorage.getItem('apsan_notificacoes')||'[]');
        notices.push({id:'ADMIN-PROD-'+Date.now(),audience:'admin',type:'product_approval',productId:product.id,sellerId:product.sellerId,sellerName:product.sellerName,productName:product.name,title:'Novo produto aguardando aprovação',message:`${product.sellerName} enviou o produto "${product.name}" para aprovação.`,createdAt:new Date().toISOString(),read:false});
        if(typeof window.setData==='function')window.setData('apsan_notificacoes',notices);else localStorage.setItem('apsan_notificacoes',JSON.stringify(notices));

        if(typeof window.renderAdmin==='function')window.renderAdmin();
        if(typeof window.renderPublicProducts==='function')window.renderPublicProducts();
        form.reset();
        window.pendingProductUpload=null;
        document.getElementById('coverPreview')?.replaceChildren();
        const n=document.getElementById('productFileName');if(n)n.innerHTML='';
        const m=document.getElementById('mediaPreview');if(m){m.innerHTML='';m.style.display='none'}
        if(typeof window.cleanupProductUploadPreview==='function')window.cleanupProductUploadPreview();
        if(typeof window.updateProductUpload==='function')window.updateProductUpload();
        if(typeof window.updatePricePreview==='function')window.updatePricePreview();
        const modal=document.getElementById('successModal');if(modal)modal.classList.add('visible');
        const msg=modal?.querySelector('p');if(msg)msg.textContent='Produto enviado com sucesso. Está agora em análise no painel do administrador e só ficará disponível no marketplace depois da aprovação.';
      }catch(err){
        console.error('APSAN product publication fix',err);
        let msg=err?.message||'Não foi possível concluir a publicação.';
        if(err?.name==='QuotaExceededError'||/quota|storage.*cheio/i.test(msg))msg='O armazenamento deste navegador está cheio. Remova produtos antigos ou ficheiros desnecessários e tente novamente.';
        alert(msg);
      }finally{reset();}
    };
    fixed.__apsanProductPublicationFix=true;
    window.publishProduct=fixed;
  }

  function init(){
    bindPublicNavigation();
    if(restoreLanding())return;
    patchOnlinePersistence();
    restoreExisting();
    installProductPublicationFix();
  }
  function patchOnlinePersistence(){/* wrappers are installed by the existing persistence scripts when available */}
  function restoreExisting(){
    const st=(()=>{try{return JSON.parse(sessionStorage.getItem(KEY)||'null')}catch(e){return null}})();
    if(!st)return;
    setTimeout(()=>{
      try{
        if(st.view==='online'){
          const accountKey=st.role==='teacher'?'apsan_teachers_v2':st.role==='student'?'apsan_students_v2':'apsan_institutions_v2';
          const list=(()=>{try{return JSON.parse(localStorage.getItem(accountKey)||'[]')}catch(e){return[]}})();
          const acc=list.find(x=>String(x.id)===String(st.accountId));
          if(acc&&typeof window.openOnline==='function'){
            window.openOnline(st.role||'teacher');
            const id=document.getElementById('onLoginIdentifier'),pass=document.getElementById('onPass');
            if(id)id.value=acc.email||acc.phone||'';
            if(pass)pass.value=acc.pass||'';
            if(typeof window.loginOnline==='function')window.loginOnline({preventDefault:function(){}});
            setTimeout(()=>{if(window.onTab)window.onTab(st.tab||'home',document.querySelector('#onTeacherNav button,#onStudentNav button'))},350);
          }
          return;
        }
        if(st.view==='admin'&&window.openAdminPage){window.openAdminPage();return}
        if(st.view==='customer'&&window.openCustomerPortal){window.openCustomerPortal();return}
        if(st.view==='seller-sales'&&window.openSellerSales){window.openSellerSales();return}
        if(st.view==='seller-registration'&&window.openSellerRegistration){window.openSellerRegistration();return}
        if(st.view==='purchase'&&st.id&&window.openPurchasePage){window.openPurchasePage(st.id);return}
      }catch(e){console.warn('APSAN restore:',e)}
    },450);
  }
  window.apsanClearSavedView=function(){try{sessionStorage.removeItem(KEY);sessionStorage.removeItem(LANDING_KEY)}catch(e){}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();