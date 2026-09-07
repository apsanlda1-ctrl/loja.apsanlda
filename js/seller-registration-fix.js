/* ACE APSAN — correção EXCLUSIVA da criação de conta de vendedor. */
(function(){
  'use strict';
  function install(){
    const form=document.getElementById('sellerForm');
    if(!form)return;
    form.noValidate=true;
    const phone=document.getElementById('sellerPhone'), nif=document.getElementById('sellerNif');
    if(phone)phone.removeAttribute('pattern');
    if(nif)nif.removeAttribute('pattern');
    if(form.dataset.sellerSubmitFixed!=='1'){
      form.dataset.sellerSubmitFixed='1';
      form.addEventListener('submit',function(e){registerSellerFixed(e)},true);
    }
  }
  function registerSellerFixed(e){
    if(e&&e.preventDefault)e.preventDefault();
    const form=document.getElementById('sellerForm');
    const btn=document.getElementById('sellerCreateBtn')||form?.querySelector('button[type="submit"]');
    if(!form){alert('Formulário de criação de conta não encontrado.');return false;}
    const name=(document.getElementById('sellerName')?.value||'').trim();
    const phone=(document.getElementById('sellerPhone')?.value||'').trim();
    const nif=(document.getElementById('sellerNif')?.value||'').trim().toUpperCase();
    const password=document.getElementById('sellerPassword')?.value||'';
    if(name.length<3){alert('Introduza o nome completo do vendedor.');return false;}
    if(phone.replace(/\D/g,'').length<7){alert('Introduza um número de telefone válido.');return false;}
    if(nif.length<3){alert('Introduza o NIF.');return false;}
    if(password.length<6){alert('A palavra-passe deve ter pelo menos 6 caracteres.');return false;}
    if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A criar...';}
    try{
      const sellers=typeof getData==='function'?(getData(STORAGE_KEY)||[]):JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      const phoneKey=phone.replace(/\D/g,'');
      const duplicate=sellers.find(s=>String(s.nif||'').trim().toUpperCase()===nif||String(s.phone||'').replace(/\D/g,'')===phoneKey);
      if(duplicate){alert('Já existe um vendedor com este número de telefone ou NIF.');if(btn){btn.disabled=false;btn.innerHTML='Criar conta e avançar <i class="fa-solid fa-arrow-right"></i>';}return false;}
      const now=Date.now();
      const seller={id:'SELLER-'+now,uid:'SELLER-'+now,name,phone,nif,registeredAt:new Date().toISOString(),balance:0,notifications:[],approved:true,password,passwordHash:null,authMethod:'phone_name_nif_password',role:'seller'};
      sellers.push(seller);
      if(typeof setData==='function')setData(STORAGE_KEY,sellers);else localStorage.setItem(STORAGE_KEY,JSON.stringify(sellers));
      currentSeller=seller;
      currentSalesSeller=seller;
      localStorage.setItem('apsan_current_seller',JSON.stringify(seller));
      localStorage.setItem('apsan_current_sales_seller',JSON.stringify(seller));
      const reg=document.getElementById('sellerRegistrationPage'),dash=document.getElementById('sellerDashboardPage');
      if(reg)reg.classList.remove('visible');
      if(dash)dash.classList.add('visible');
      document.body.classList.add('page-open');
      const n=document.getElementById('dashboardSellerName');if(n)n.textContent=name;
      if(typeof updateProductUpload==='function')updateProductUpload();
      if(typeof updatePricePreview==='function')updatePricePreview();
      if(typeof updateSellerFinance==='function')updateSellerFinance();
      if(btn){btn.disabled=false;btn.innerHTML='Criar conta e avançar <i class="fa-solid fa-arrow-right"></i>'}
      alert('Conta de vendedor criada com sucesso. Pode começar a publicar o seu produto.');
    }catch(err){
      console.error('ACE APSAN seller registration',err);
      if(btn){btn.disabled=false;btn.innerHTML='Criar conta e avançar <i class="fa-solid fa-arrow-right"></i>'}
      alert('Não foi possível criar a conta. Tente novamente.');
    }
    return false;
  }
  function hook(){
    install();
    if(typeof window.registerSeller==='function')window.registerSeller=registerSellerFixed;
    applyAceBackground();
  }
  function applyAceBackground(){
    if(document.getElementById('ace-apsan-background-runtime'))return;
    const style=document.createElement('style');
    style.id='ace-apsan-background-runtime';
    style.textContent=`
      .hero{
        background-image:url('../assets/ace-apsan-background.jpg') !important;
        background-size:cover !important;
        background-position:center center !important;
        background-repeat:no-repeat !important;
      }
      .hero::before{display:none !important}
      .hero-graphic{background:transparent !important}
      .wave-shape-1,.wave-shape-2{display:none !important}
      @media(max-width:800px){
        .hero{background-position:center center !important;background-attachment:scroll !important}
      }
    `;
    (document.head||document.documentElement).appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook,{once:true});else hook();
  new MutationObserver(hook).observe(document.documentElement,{childList:true,subtree:true});
})();
