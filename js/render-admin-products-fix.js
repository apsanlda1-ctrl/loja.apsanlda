/* APSAN-render-admin-products-v1 */
function renderAdminProducts(){
  const tab=document.getElementById('adminProductsTab');
  if(!tab)return;
  const ps=getData(PRODUCTS_KEY)||[];
  const list=ps.filter(p=>!p.deleted);
  const pending=list.filter(p=>p.status==='pending');
  const esc=typeof escapeHtml==='function'?escapeHtml:(v)=>String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const money=v=>typeof formatKz==='function'?formatKz(v):Number(v||0).toLocaleString('pt-AO')+' Kz';
  const price=p=>p.promoPrice!==null&&p.promoPrice!==undefined&&p.promoPrice!==''?p.promoPrice:p.realPrice;
  const type=p=>(p.contentType==='physical'||p.productType==='physical')?'Produto físico':(p.contentTypeLabel||'Infoproduto');
  const state=p=>p.status==='pending'?'Aguardando aprovação':p.status==='approved'?'Aprovado':p.status==='rejected'?'Rejeitado':(p.status||'Sem estado');
  const cards=list.slice().reverse().map(p=>{
    const physical=p.contentType==='physical'||p.productType==='physical';
    const loc=[p.province,p.municipality,p.location].filter(Boolean).join(' · ');
    const buttons=p.status==='pending'
      ? `<button class="admin-action approve" onclick="approveAdminProduct('${esc(p.id)}')">Aprovar</button><button class="admin-action reject" onclick="rejectAdminProduct('${esc(p.id)}')">Rejeitar</button>`
      : p.status==='approved'
        ? `<button class="admin-action reject" onclick="rejectAdminProduct('${esc(p.id)}')">Suspender</button>`
        : `<button class="admin-action approve" onclick="approveAdminProduct('${esc(p.id)}')">Aprovar novamente</button>`;
    return `<article class="admin-notification" style="margin-bottom:14px"><div style="display:flex;gap:14px;align-items:flex-start">${p.coverImage?`<img src="${esc(p.coverImage)}" style="width:82px;height:82px;object-fit:cover;border-radius:12px">`:''}<div style="flex:1"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><strong>${esc(p.name||'Produto sem nome')}</strong><span class="status ${esc(p.status||'pending')}">${state(p)}</span></div><p>${esc(type(p))} · ${esc(p.category||'Sem categoria')} · <strong>${money(price(p))}</strong></p><p>Vendedor: <strong>${esc(p.sellerName||p.sellerId||'—')}</strong></p>${physical&&loc?`<p><i class="fa-solid fa-location-dot"></i> ${esc(loc)}</p>`:''}${p.rejectionReason?`<p style="color:#b91c1c"><strong>Motivo:</strong> ${esc(p.rejectionReason)}</p>`:''}</div></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">${buttons}<button class="admin-action delete" onclick="deleteAdminProduct('${esc(p.id)}')">Eliminar</button></div></article>`;
  }).join('');
  tab.innerHTML=`<div class="admin-pro-section-head"><div><span class="eyebrow">CATÁLOGO</span><h2>Produtos</h2><p>${list.length} produto(s) · ${pending.length} aguardam aprovação.</p></div></div>${cards||'<div class="locked-note">Nenhum produto registado.</div>'}`;
}
function adminProductChange(id,fn){
  const ps=getData(PRODUCTS_KEY)||[];
  const p=ps.find(x=>String(x.id)===String(id));
  if(!p)return null;
  fn(p); p.updatedAt=new Date().toISOString(); setData(PRODUCTS_KEY,ps); return p;
}
function approveAdminProduct(id){
  const p=adminProductChange(id,x=>{x.status='approved';x.approved=true;x.deleted=false;x.rejectionReason='';x.approvedAt=new Date().toISOString()});
  if(!p)return alert('Produto não encontrado.');
  if(typeof renderPublicProducts==='function')renderPublicProducts();
  renderAdminProducts(); alert('Produto aprovado e colocado à venda.');
}
function rejectAdminProduct(id){
  const reason=prompt('Indique o motivo da rejeição/suspensão:'); if(reason===null)return;
  const p=adminProductChange(id,x=>{x.status='rejected';x.approved=false;x.rejectionReason=String(reason||'Sem motivo informado').trim()||'Sem motivo informado';x.rejectedAt=new Date().toISOString()});
  if(!p)return alert('Produto não encontrado.');
  if(typeof renderPublicProducts==='function')renderPublicProducts();
  renderAdminProducts(); alert('Produto rejeitado/suspenso.');
}
function deleteAdminProduct(id){
  if(!confirm('Eliminar este produto do catálogo?'))return;
  const p=adminProductChange(id,x=>{x.deleted=true;x.status='deleted';x.deletedAt=new Date().toISOString()});
  if(!p)return alert('Produto não encontrado.');
  if(typeof renderPublicProducts==='function')renderPublicProducts();
  renderAdminProducts(); alert('Produto eliminado.');
}
window.renderAdminProducts=renderAdminProducts;
window.approveAdminProduct=approveAdminProduct;
window.rejectAdminProduct=rejectAdminProduct;
window.deleteAdminProduct=deleteAdminProduct;
