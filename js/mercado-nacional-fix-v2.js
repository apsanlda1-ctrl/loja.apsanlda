/* APSAN — correção segura do Mercado Nacional v4
   - Mantém um único botão Mercado Nacional na landing page.
   - Mostra produtos aprovados, sem exigir isPublished=true.
   - Mantém separados infoprodutos e produtos físicos.
   - Não altera o fluxo de publicação/aprovação.
*/
(function(){
  'use strict';

  function approvedProducts(){
    try{
      let list=[];
      if(typeof getData==='function' && typeof PRODUCTS_KEY!=='undefined') list=getData(PRODUCTS_KEY);
      if(!Array.isArray(list)) list=JSON.parse(localStorage.getItem('apsan_produtos')||'[]');
      return (Array.isArray(list)?list:[]).filter(p=>{
        if(!p || p.deleted || p.hidden===true) return false;
        const status=String(p.status||'').toLowerCase();
        return status==='approved' || p.approved===true || p.isApproved===true;
      });
    }catch(e){
      console.warn('APSAN Mercado Nacional: não foi possível ler produtos aprovados.',e);
      return [];
    }
  }

  function typeOf(p){
    const t=String(p.productType||p.product_type||p.type||p.kind||p.format||p.contentType||'').toLowerCase();
    return /fisic|physical|físic/.test(t) ? 'physical' : 'digital';
  }
  function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
  function price(p){
    const n=Number(p.promoPrice!=null?p.promoPrice:(p.realPrice!=null?p.realPrice:p.price));
    return Number.isFinite(n)?n.toLocaleString('pt-AO')+' Kz':'Preço sob consulta';
  }

  function renderCards(){
    const dg=document.getElementById('mnaDigitalGrid'),pg=document.getElementById('mnaPhysicalGrid');
    if(!dg||!pg)return;
    const q=(document.getElementById('mnaSearch')?.value||'').trim().toLowerCase();
    const cat=(document.getElementById('mnaCategory')?.value||'').trim().toLowerCase();
    const active=document.querySelector('.mna-tab.active')?.dataset.mnaType||'all';
    let items=approvedProducts().filter(p=>{
      const blob=JSON.stringify(p).toLowerCase();
      const category=String(p.category||'').toLowerCase();
      const type=typeOf(p);
      return (!q||blob.includes(q))&&(!cat||category===cat)&&(active==='all'||type===active);
    });
    const sort=document.getElementById('mnaSort')?.value;
    if(sort==='priceAsc')items.sort((a,b)=>Number(a.promoPrice??a.realPrice??a.price??0)-Number(b.promoPrice??b.realPrice??b.price??0));
    if(sort==='priceDesc')items.sort((a,b)=>Number(b.promoPrice??b.realPrice??b.price??0)-Number(a.promoPrice??a.realPrice??a.price??0));
    const card=p=>{
      const id=esc(p.id||p.productId||'');
      const title=esc(p.name||p.title||'Produto');
      const image=p.coverImage||p.image||p.cover||p.thumbnail||p.photo||'';
      const type=typeOf(p)==='physical'?'Produto Físico':'Infoproduto';
      return `<article class="mna-card"><span class="mna-badge">${type}</span><div class="mna-cover">${image?`<img src="${esc(image)}" alt="${title}">`:'<i class="fa-solid fa-box-open" style="font-size:2rem"></i>'}</div><div class="mna-body"><div class="mna-type">${esc(p.category||type)}</div><div class="mna-title">${title}</div><div class="mna-seller">Por: ${esc(p.sellerName||p.seller||p.vendorName||'Vendedor APSAN')}</div><div class="mna-price">${price(p)}</div><div class="mna-rating"><span>★</span> ${esc(p.rating||'Novo')}</div><button type="button" class="mna-btn" data-mna-fix-product="${id}">Ver produto</button></div></article>`;
    };
    const di=items.filter(p=>typeOf(p)==='digital'),ph=items.filter(p=>typeOf(p)==='physical');
    dg.innerHTML=di.length?di.map(card).join(''):'<div class="mna-empty">Ainda não há infoprodutos aprovados para apresentar.</div>';
    pg.innerHTML=ph.length?ph.map(card).join(''):'<div class="mna-empty">Ainda não há produtos físicos aprovados para apresentar.</div>';
    const ds=document.getElementById('mnaDigitalSection'),ps=document.getElementById('mnaPhysicalSection');
    if(ds)ds.style.display=active==='physical'?'none':'';
    if(ps)ps.style.display=active==='digital'?'none':'';
    document.querySelectorAll('[data-mna-fix-product]').forEach(btn=>btn.onclick=()=>{
      const p=approvedProducts().find(x=>String(x.id||x.productId)===String(btn.dataset.mnaFixProduct));
      if(!p)return;
      if(typeof window.openPurchasePage==='function')window.openPurchasePage(p.id||p.productId);
      else if(typeof window.openProductDetails==='function')window.openProductDetails(p);
    });
  }

  function dedupeHeroButton(){
    const matches=Array.from(document.querySelectorAll('button,a,[role="button"]')).filter(el=>/^\s*Mercado Nacional de Angola\s*$/i.test((el.textContent||'').replace(/\s+/g,' ').trim()));
    // O primeiro é o botão amarelo já existente. Remover apenas duplicados posteriores.
    matches.forEach((el,i)=>{if(i>0)el.remove();});
  }

  function wire(){
    dedupeHeroButton();
    renderCards();
    const open=window.openMercadoNacionalAngola;
    if(typeof open==='function'&&!open.__apsanFixWrapped){
      function wrapped(){const r=open.apply(this,arguments);setTimeout(renderCards,0);setTimeout(renderCards,150);return r;}
      wrapped.__apsanFixWrapped=true;window.openMercadoNacionalAngola=wrapped;
    }
    ['mnaSearch','mnaCategory','mnaSort'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>setTimeout(renderCards,0)));
    document.querySelectorAll('.mna-tab').forEach(b=>b.addEventListener('click',()=>setTimeout(renderCards,0)));
    setInterval(()=>{dedupeHeroButton();if(document.getElementById('mercadoNacionalAngola')?.classList.contains('mna-open'))renderCards();},1200);
    if(!window.__apsanMnaObserver){
      const observer=new MutationObserver(()=>dedupeHeroButton());
      observer.observe(document.body,{childList:true,subtree:true});
      window.__apsanMnaObserver=observer;
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(wire,50));else setTimeout(wire,50);
})();
