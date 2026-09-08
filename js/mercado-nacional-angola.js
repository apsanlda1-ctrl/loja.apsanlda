/* ACE APSAN — Mercado Nacional de Angola
   Publica apenas produtos aprovados dentro do Mercado; não injeta produtos na home.
   A secção existente #products permanece para compatibilidade, mas o catálogo público é separado.
*/
(function(){
'use strict';
function init(){
  const old=document.getElementById('products');
  if(!old || document.getElementById('mercadoNacionalAngola')) return;
  const section=document.createElement('section');
  section.id='mercadoNacionalAngola';
  section.setAttribute('aria-label','Mercado Nacional de Angola');
  section.innerHTML=`
    <div class="mna-shell">
      <div class="mna-head">
        <div><div class="mna-kicker">ACE APSAN · Mercado Nacional</div><h2>Mercado Nacional de Angola</h2><p>Encontre produtos digitais e produtos físicos publicados por vendedores da plataforma.</p></div>
      </div>
      <div class="mna-tools">
        <input id="mnaSearch" type="search" placeholder="Pesquisar produtos..." aria-label="Pesquisar produtos">
        <select id="mnaCategory" aria-label="Categoria"><option value="">Todas as categorias</option><option>Educação</option><option>Cursos Online</option><option>E-books</option><option>Vídeos e Tutoriais</option><option>Música</option><option>Informática</option><option>Produtos Físicos</option><option>Outros</option></select>
        <select id="mnaSort" aria-label="Ordenar"><option value="recent">Mais recentes</option><option value="priceAsc">Menor preço</option><option value="priceDesc">Maior preço</option></select>
      </div>
      <div class="mna-tabs"><button class="mna-tab active" data-mna-type="all">Todos</button><button class="mna-tab" data-mna-type="digital">Infoprodutos</button><button class="mna-tab" data-mna-type="physical">Produtos Físicos</button></div>
      <div id="mnaDigitalSection" class="mna-section"><div class="mna-section-head"><h3>Infoprodutos</h3><a href="#" data-mna-see="digital">Ver todos</a></div><div id="mnaDigitalGrid" class="mna-grid"></div></div>
      <div id="mnaPhysicalSection" class="mna-section"><div class="mna-section-head"><h3>Produtos Físicos</h3><a href="#" data-mna-see="physical">Ver todos</a></div><div id="mnaPhysicalGrid" class="mna-grid"></div></div>
    </div>`;
  old.insertAdjacentElement('afterend',section);
  old.style.display='none';
  wire(); render();
}
function products(){
  let p=[];
  try{
    const sources=[window.products,window.allProducts,window.marketplaceProducts];
    for(const s of sources) if(Array.isArray(s)) p=p.concat(s);
  }catch(e){}
  const seen=new Set();
  return p.filter(x=>{if(!x||typeof x!=='object')return false; const id=x.id||x.productId||x.title||x.name; if(seen.has(id))return false;seen.add(id);return true;})
    .filter(x=>x.status==='approved' || x.approved===true)
    .filter(x=>!x.hidden && x.isPublished!==false);
}
function typeOf(p){
  const t=String(p.productType||p.type||p.kind||p.format||'').toLowerCase();
  return /fisic|physical|físic/.test(t)?'physical':'digital';
}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function price(p){const n=Number(p.price??p.preco??0);return isFinite(n)?n.toLocaleString('pt-AO')+' Kz':esc(p.price||'');}
function card(p){const title=esc(p.title||p.name||'Produto');const image=p.image||p.cover||p.thumbnail||p.photo||'';const type=typeOf(p)==='physical'?'Produto Físico':'Infoproduto';return `<article class="mna-card"><span class="mna-badge">${type}</span><div class="mna-cover">${image?`<img src="${esc(image)}" alt="${title}">`:'<i class="fa-solid fa-box-open" style="font-size:2rem"></i>'}</div><div class="mna-body"><div class="mna-type">${esc(p.category||type)}</div><div class="mna-title">${title}</div><div class="mna-seller">Por: ${esc(p.sellerName||p.seller||p.vendorName||'Vendedor APSAN')}</div><div class="mna-price">${price(p)}</div><div class="mna-rating"><span>★</span> ${esc(p.rating||'Novo')}</div><a href="#" class="mna-btn" data-mna-product="${esc(p.id||p.productId||title)}">Ver produto</a></div></article>`;}
function render(){const list=products();const q=(document.getElementById('mnaSearch')?.value||'').toLowerCase();const cat=document.getElementById('mnaCategory')?.value||'';const active=document.querySelector('.mna-tab.active')?.dataset.mnaType||'all';let f=list.filter(p=>{const hay=JSON.stringify(p).toLowerCase();return (!q||hay.includes(q))&&(!cat||String(p.category||'').toLowerCase()===cat.toLowerCase())&&(active==='all'||typeOf(p)===active);});const sort=document.getElementById('mnaSort')?.value;if(sort==='priceAsc')f.sort((a,b)=>Number(a.price||0)-Number(b.price||0));if(sort==='priceDesc')f.sort((a,b)=>Number(b.price||0)-Number(a.price||0));const d=f.filter(p=>typeOf(p)==='digital'), ph=f.filter(p=>typeOf(p)==='physical');const dg=document.getElementById('mnaDigitalGrid'),pg=document.getElementById('mnaPhysicalGrid');if(dg)dg.innerHTML=d.length?d.map(card).join(''):'<div class="mna-empty">Ainda não há infoprodutos aprovados para apresentar.</div>';if(pg)pg.innerHTML=ph.length?ph.map(card).join(''):'<div class="mna-empty">Ainda não há produtos físicos aprovados para apresentar.</div>';document.getElementById('mnaDigitalSection').style.display=active==='physical'?'none':'';document.getElementById('mnaPhysicalSection').style.display=active==='digital'?'none':'';}
function wire(){['mnaSearch','mnaCategory','mnaSort'].forEach(id=>document.getElementById(id)?.addEventListener('input',render));document.querySelectorAll('.mna-tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.mna-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');render();}));document.querySelectorAll('[data-mna-see]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(`.mna-tab[data-mna-type="${a.dataset.mnaSee}"]`)?.click();}));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.renderMercadoNacionalAngola=render;
})();
