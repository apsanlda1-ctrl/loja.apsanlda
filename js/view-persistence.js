/* APSAN — Persistência da página atual após refresh
   Guarda a vista/aba ativa e restaura a sessão online a partir do ID da conta.
   Não altera o layout nem o dashboard financeiro.
*/
(function(){
  'use strict';
  if(typeof window==='undefined')return;
  const KEY='apsan_current_view_v2';
  const saveState=s=>{try{sessionStorage.setItem(KEY,JSON.stringify(Object.assign({savedAt:Date.now()},s)))}catch(e){}};
  const readState=()=>{try{return JSON.parse(sessionStorage.getItem(KEY)||'null')}catch(e){return null}};
  const clearState=()=>{try{sessionStorage.removeItem(KEY)}catch(e){}};
  const arr=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}};
  const account=(role,id)=>{const key=role==='teacher'?'apsan_teachers_v2':role==='student'?'apsan_students_v2':'apsan_institutions_v2';return arr(key).find(x=>String(x.id)===String(id))||null};
  function currentOnline(){try{return onUser||window.onUser||null}catch(e){return window.onUser||null}}
  function saveOnlineTab(tab){const u=currentOnline();if(!u?.id)return;saveState({view:'online',role:window.__apsanRole||'teacher',institutionMode:window.__apsanInstitutionMode||'',accountId:u.id,tab:tab||'home'});}
  function patchNavigation(){
    const original=window.onTab;
    if(typeof original==='function'&&!original.__apsanPersist){
      const wrapped=function(tab,btn){const r=original.apply(this,arguments);setTimeout(()=>{saveOnlineTab(tab)},0);return r};wrapped.__apsanPersist=true;window.onTab=wrapped;
    }
    const originalShow=window.showAdminTab;
    if(typeof originalShow==='function'&&!originalShow.__apsanPersist){
      const wrapped=function(tab,btn){const r=originalShow.apply(this,arguments);saveState({view:'admin',adminTab:tab||'overview'});return r};wrapped.__apsanPersist=true;window.showAdminTab=wrapped;
    }
    ['openAdminPage','openCustomerPortal','openSellerSales','openSellerRegistration'].forEach(name=>{
      const fn=window[name];if(typeof fn!=='function'||fn.__apsanPersist)return;
      const view=name==='openAdminPage'?'admin':name==='openCustomerPortal'?'customer':name==='openSellerSales'?'seller-sales':'seller-registration';
      const wrapped=function(){const r=fn.apply(this,arguments);saveState({view});return r};wrapped.__apsanPersist=true;window[name]=wrapped;
    });
    const oo=window.openOnline;
    if(typeof oo==='function'&&!oo.__apsanPersist){
      const wrapped=function(role){const r=oo.apply(this,arguments);window.__apsanRole=role||'teacher';setTimeout(()=>{const u=currentOnline();if(u)saveState({view:'online',role:window.__apsanRole,institutionMode:window.__apsanInstitutionMode||'',accountId:u.id,tab:'home'});else saveState({view:'online',role:window.__apsanRole,institutionMode:window.__apsanInstitutionMode||'',tab:'home'});},0);return r};wrapped.__apsanPersist=true;window.openOnline=wrapped;
    }
  }
  function restoreOnline(st){
    const u=account(st.role,st.accountId);if(!u||typeof window.openOnline!=='function')return false;
    try{
      if(st.role==='institution'){
        if(typeof window.institutionEntry==='function')window.institutionEntry('admin');
        else window.openInstitutionPortal?.();
      }else{
        window.openOnline(st.role);
        if(typeof window.setOnlineAuthMode==='function')window.setOnlineAuthMode('login');
        const id=document.getElementById('onLoginIdentifier'),pass=document.getElementById('onPass');
        if(id)id.value=u.email||u.phone||'';
        if(pass)pass.value=u.pass||'';
        if(typeof window.loginOnline==='function')window.loginOnline({preventDefault:function(){}});
      }
      setTimeout(()=>{
        const tab=st.tab||'home';
        if(typeof window.onTab==='function')window.onTab(tab,document.querySelector('#onTeacherNav button, #onStudentNav button'));
      },350);
      return true;
    }catch(e){console.warn('APSAN restore online:',e);return false}
  }
  function restore(){
    const st=readState();if(!st)return;
    setTimeout(()=>{
      try{
        if(st.view==='online'){
          if(restoreOnline(st))return;
        }
        if(st.view==='admin'&&typeof window.openAdminPage==='function'){window.openAdminPage();setTimeout(()=>{if(st.adminTab&&window.showAdminTab)window.showAdminTab(st.adminTab,document.querySelector('[data-admin-tab="'+st.adminTab+'"]'))},200);return}
        if(st.view==='customer'&&window.openCustomerPortal){window.openCustomerPortal();return}
        if(st.view==='seller-sales'&&window.openSellerSales){window.openSellerSales();return}
        if(st.view==='seller-registration'&&window.openSellerRegistration){window.openSellerRegistration();return}
        if(st.view==='purchase'&&st.id&&window.openPurchasePage){window.openPurchasePage(st.id);return}
      }catch(e){console.warn('APSAN restore:',e)}
    },450);
  }
  window.apsanClearSavedView=clearState;
  function init(){patchNavigation();restore()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();