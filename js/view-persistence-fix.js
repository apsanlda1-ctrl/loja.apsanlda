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
  function init(){
    bindPublicNavigation();
    if(restoreLanding())return;
    patchOnlinePersistence();
    restoreExisting();
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