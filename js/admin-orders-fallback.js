/* APSAN — implementação estável do painel de compras do administrador. */
(function(){
  'use strict';
  function esc(v){
    if(typeof window.escapeHtml==='function') return window.escapeHtml(v);
    return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function money(v){
    return typeof window.formatKz==='function' ? window.formatKz(v) : Number(v||0).toLocaleString('pt-AO')+' Kz';
  }
  function renderAdminOrders(){
    const tab=document.getElementById('adminOrdersTab');
    if(!tab)return;
    const get=typeof window.getData==='function' ? window.getData : function(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}};
    const orders=get('apsan_compras')||[];
    const products=get('apsan_produtos')||[];
    if(!orders.length){tab.innerHTML='<div class="locked-note">Nenhuma compra registada.</div>';return;}
    tab.innerHTML='<div class="admin-pro-section-head"><div><span class="eyebrow">MARKETPLACE</span><h2>Compras</h2><p>'+orders.length+' compra(s) registada(s).</p></div></div>'+orders.slice().reverse().map(o=>{
      const p=products.find(x=>x.id===o.productId);
      const state=o.status==='paid'||o.status==='released'?'Pagamento confirmado':o.status==='rejected_payment'?'Comprovativo rejeitado':'Aguardando confirmação';
      return '<article class="admin-notification" style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><strong>'+esc(o.productName||p?.name||'Produto')+'</strong><p>Compra: '+esc(o.id)+' · Cliente: '+esc(o.buyerName||'—')+' · Telefone: '+esc(o.buyerPhone||'—')+'</p><p>Vendedor: '+esc(o.sellerName||p?.sellerName||'—')+' · Valor: <strong>'+money(o.amount||p?.promoPrice||p?.realPrice||0)+'</strong></p><p>Método: '+esc(o.paymentMethod||'—')+'</p></div><span class="status '+esc(o.status||'pending')+'">'+state+'</span></div></article>';
    }).join('');
  }
  window.renderAdminOrders=renderAdminOrders;
  if(typeof window.renderAdmin==='function'){
    try{window.renderAdminOrders();}catch(e){}
  }
})();
