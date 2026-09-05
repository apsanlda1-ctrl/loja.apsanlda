/* APSAN — reforço da persistência da sessão/aba online */
(function(){
  'use strict';
  const KEY='apsan_current_view_v2';
  const save=s=>{try{sessionStorage.setItem(KEY,JSON.stringify(Object.assign({savedAt:Date.now()},s)))}catch(e){}};
  const u=()=>{try{return onUser||window.onUser||null}catch(e){return window.onUser||null}};
  const mark=(extra={})=>{const x=u();if(!x?.id)return;save(Object.assign({view:'online',role:window.__apsanRole||'teacher',institutionMode:window.__apsanInstitutionMode||'',accountId:x.id,tab:'home'},extra))};
  function wrap(name,after){const fn=window[name];if(typeof fn!=='function'||fn.__apsanPersistFix)return;const w=function(){const result=fn.apply(this,arguments);Promise.resolve(result).finally(()=>setTimeout(()=>after(arguments),20));return result};w.__apsanPersistFix=true;window[name]=w}
  wrap('loginOnline',()=>{mark({tab:'home'})});
  wrap('institutionEntry',args=>{window.__apsanInstitutionMode=args[0]||'';window.__apsanRole=args[0]==='admin'?'institution':args[0]||'teacher';const x=u();if(x)mark({tab:'home'})});
  wrap('openInstitutionPortal',()=>{window.__apsanRole='institution';window.__apsanInstitutionMode='admin';save({view:'online',role:'institution',institutionMode:'admin',tab:'home'})});
  wrap('onTab',args=>{const tab=args[0]||'home';mark({tab})});
  wrap('logoutOnline',()=>{try{sessionStorage.removeItem(KEY)}catch(e){}});
  window.addEventListener('beforeunload',()=>{const x=u();if(x?.id){const active=document.querySelector('#onDash .on-tab.active')?.id||'';const tab=active.startsWith('on')?active.slice(2):'home';mark({tab})}});
})();