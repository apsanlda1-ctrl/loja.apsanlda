/* APSAN — correção do botão "Ver mais" / detalhes dos produtos.
   Funciona por delegação para cartões renderizados dinamicamente e não depende
   de onclick inline do cartão original.
*/
(function(){
  'use strict';
  const PRODUCTS_KEY='apsan_produtos';
  const MODAL_ID='apsanProductDetailsModal';
  const STYLE_ID='apsanProductDetailsFixStyle';

  function products(){
    try{
      if(typeof window.getData==='function') return window.getData(PRODUCTS_KEY)||[];
    }catch(e){}
    try{return JSON.parse(localStorage.getItem(PRODUCTS_KEY)||'[]')||[]}catch(e){return []}
  }
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function money(v){
    const n=Number(v);
    if(!Number.isFinite(n))return '—';
    try{return new Intl.NumberFormat('pt-AO',{style:'currency',currency:'AOA',maximumFractionDigits:2}).format(n)}catch(e){return n.toLocaleString('pt-AO')+' Kz'}
  }
  function getId(btn,card){
    const attrs=['data-product-id','data-product','data-id','data-productid'];
    for(const el of [btn,card]){
      if(!el)continue;
      for(const a of attrs){const v=el.getAttribute?.(a);if(v)return v}
    }
    const html=btn?.getAttribute?.('onclick')||'';
    let m=html.match(/(?:openPurchasePage|showProductDetails|openProductDetails|viewProductDetails)\s*\(\s*['"]([^'"]+)['"]/i);
    if(m)return m[1];
    const href=btn?.getAttribute?.('href')||'';
    m=href.match(/[?&#](?:productId|product|id)=([^&#]+)/i);if(m)return decodeURIComponent(m[1]);
    return '';
  }
  function findProduct(btn){
    const card=btn?.closest?.('[data-product-id],[data-product],.product-card,.product-item,.product,.marketplace-product,.product-box,.product-card-modern');
    const list=products().filter(p=>p && !p.deleted && (p.status==='approved'||p.isPublished===true));
    const id=getId(btn,card);
    if(id){const p=list.find(x=>String(x.id)===String(id));if(p)return p}
    if(card){
      const text=(card.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(text){
        let p=list.find(x=>String(x.name||'').trim().toLowerCase()===text);
        if(p)return p;
        p=list.find(x=>{const n=String(x.name||'').trim().toLowerCase();return n&&text.includes(n)});
        if(p)return p;
      }
    }
    return null;
  }
  function ensureStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #${MODAL_ID}{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(2,8,23,.72);backdrop-filter:blur(5px)}
      #${MODAL_ID}.open{display:flex}
      #${MODAL_ID} .apsan-pd-box{width:min(760px,100%);max-height:min(88vh,820px);overflow:auto;background:#fff;border-radius:22px;box-shadow:0 24px 70px rgba(0,0,0,.32);position:relative;color:#142033}
      #${MODAL_ID} .apsan-pd-close{position:absolute;right:14px;top:14px;width:40px;height:40px;border:0;border-radius:50%;background:rgba(0,0,0,.08);font-size:20px;cursor:pointer;z-index:2}
      #${MODAL_ID} .apsan-pd-cover{width:100%;height:290px;object-fit:cover;display:block;background:#eef2f7;border-radius:22px 22px 0 0}
      #${MODAL_ID} .apsan-pd-body{padding:24px}
      #${MODAL_ID} .apsan-pd-tag{display:inline-flex;padding:6px 10px;border-radius:999px;background:#eef4ff;color:#1d4ed8;font-size:12px;font-weight:700;margin-bottom:10px}
      #${MODAL_ID} h2{margin:0 0 8px;font-size:clamp(1.35rem,3vw,2rem)}
      #${MODAL_ID} .apsan-pd-seller{margin:0 0 16px;color:#64748b}
      #${MODAL_ID} .apsan-pd-desc{line-height:1.65;white-space:pre-wrap;color:#334155;margin:0 0 18px}
      #${MODAL_ID} .apsan-pd-price{font-size:1.5rem;font-weight:800;margin:12px 0 20px}
      #${MODAL_ID} .apsan-pd-actions{display:flex;gap:10px;flex-wrap:wrap}
      #${MODAL_ID} .apsan-pd-buy{border:0;border-radius:12px;padding:12px 18px;background:#0b315c;color:#fff;font-weight:800;cursor:pointer}
      #${MODAL_ID} .apsan-pd-secondary{border:1px solid #cbd5e1;border-radius:12px;padding:12px 18px;background:#fff;color:#0f172a;font-weight:700;cursor:pointer}
      @media(max-width:600px){#${MODAL_ID}{padding:10px}#${MODAL_ID} .apsan-pd-cover{height:210px}#${MODAL_ID} .apsan-pd-body{padding:18px}}
    `;document.head.appendChild(s);
  }
  function close(){const m=document.getElementById(MODAL_ID);if(m)m.classList.remove('open');document.body.classList.remove('apsan-product-details-open')}
  function open(p){
    if(!p)return false;
    ensureStyle();
    let m=document.getElementById(MODAL_ID);
    if(!m){m=document.createElement('div');m.id=MODAL_ID;m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m)close()})}
    const price=p.promoPrice!==null&&p.promoPrice!==undefined?p.promoPrice:p.realPrice;
    const oldPrice=p.promoPrice!==null&&p.promoPrice!==undefined&&Number(p.realPrice)>Number(p.promoPrice)?`<del style="color:#64748b;font-size:.95rem;margin-right:8px">${money(p.realPrice)}</del>`:'';
    const cover=p.coverImage?`<img class="apsan-pd-cover" src="${esc(p.coverImage)}" alt="${esc(p.name)}">`:`<div class="apsan-pd-cover"></div>`;
    m.innerHTML=`<div class="apsan-pd-box"><button class="apsan-pd-close" type="button" aria-label="Fechar">×</button>${cover}<div class="apsan-pd-body"><span class="apsan-pd-tag">${esc(p.category||p.contentTypeLabel||'Produto')}</span><h2>${esc(p.name||'Produto')}</h2><p class="apsan-pd-seller">Vendido por <strong>${esc(p.sellerName||'Vendedor')}</strong></p><p class="apsan-pd-desc">${esc(p.description||p.details||'Este produto está disponível no marketplace. Consulte os detalhes e avance para a compra.')}</p><div class="apsan-pd-price">${oldPrice}${money(price)}</div><div class="apsan-pd-actions"><button class="apsan-pd-buy" type="button" data-buy="${esc(p.id)}"><i class="fa-solid fa-cart-shopping"></i> Comprar agora</button><button class="apsan-pd-secondary" type="button" data-close="1">Fechar</button></div></div></div>`;
    m.querySelector('.apsan-pd-close').onclick=close;
    m.querySelector('[data-close]').onclick=close;
    m.querySelector('[data-buy]').onclick=function(){
      close();
      try{if(typeof window.openPurchasePage==='function'){window.openPurchasePage(p.id);return}}catch(e){console.error('APSAN abrir compra',e)}
      try{Function('id','return typeof openPurchasePage===\'function\' ? openPurchasePage(id) : null')(p.id)}catch(e){console.error('APSAN abrir compra',e)}
    };
    m.classList.add('open');document.body.classList.add('apsan-product-details-open');return true;
  }
  window.openProductDetails=function(id){const p=products().find(x=>String(x.id)===String(id)&&!x.deleted&&(x.status==='approved'||x.isPublished===true));return open(p)};
  window.showProductDetails=window.openProductDetails;
  window.closeProductDetails=close;

  function isDetailsButton(btn){
    const text=(btn.textContent||'').replace(/\s+/g,' ').trim();
    if(!/^(ver mais|ver detalhes|detalhes|ver produto|mais detalhes)$/i.test(text) && !/\b(ver mais|ver detalhes|mais detalhes)\b/i.test(text))return false;
    const card=btn.closest?.('[data-product-id],[data-product],.product-card,.product-item,.product,.marketplace-product,.product-box,.product-card-modern');
    return !!card;
  }
  function bind(){
    document.querySelectorAll('button,a,[role="button"]').forEach(btn=>{
      if(btn.dataset.apsanDetailsFix==='1')return;
      if(!isDetailsButton(btn))return;
      btn.dataset.apsanDetailsFix='1';
      btn.addEventListener('click',function(e){
        const p=findProduct(this);if(!p)return;
        e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();open(p);
      },true);
    });
  }
  function boot(){ensureStyle();bind();new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});setInterval(bind,1000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
