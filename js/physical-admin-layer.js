/* ACE APSAN — Segunda camada administrativa do Marketplace físico.
   Complementa o marketplace existente sem substituir o pagamento atual.
*/
(function(){
'use strict';
const KEY='apsan_physical_admin_orders';
const PROV=["Luanda","Benguela","Bié","Cabinda","Cuando Cubango","Cuanza Norte","Cuanza Sul","Cunene","Huambo","Huíla","Icolo e Bengo","Malanje","Moxico","Namibe","Uíge","Zaire","Lunda Norte","Lunda Sul","Bengo"];
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fmt=v=>typeof formatKz==='function'?formatKz(v):Number(v||0).toLocaleString('pt-AO')+' Kz';
function ensureOrderRecords(){
 const orders=read(typeof ORDERS_KEY!=='undefined'?ORDERS_KEY:'apsan_orders');
 const products=read(typeof PRODUCTS_KEY!=='undefined'?PRODUCTS_KEY:'apsan_products');
 const records=read(KEY); const known=new Set(records.map(x=>x.orderId)); let changed=false;
 orders.forEach(o=>{
  const p=products.find(x=>x.id===o.productId); if(!p||(p.productType||'digital')!=='physical'||known.has(o.id))return;
  records.push({orderId:o.id,productId:o.productId,productName:o.productName||p.name,sellerId:o.sellerId,sellerName:o.sellerName,buyerName:o.buyerName,buyerPhone:o.buyerPhone,amount:Number(o.amount||0),paymentMethod:o.paymentMethod,status:o.status==='paid'||o.released?'payment_confirmed':'payment_pending',originProvince:p.originProvince||'',destinationProvince:'',destinationCity:'',agency:'',shippingCost:0,carrier:'',tracking:'',adminNote:'',createdAt:o.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()}); known.add(o.id); changed=true;
 }); if(changed)write(KEY,records); return records;
}
function inject(){
 const tabs=document.querySelector('.admin-pro-nav'); if(!tabs||tabs.querySelector('[data-physical-admin]'))return;
 const b=document.createElement('button'); b.type='button'; b.className='admin-pro-nav-btn'; b.dataset.physicalAdmin='1'; b.innerHTML='<i class="fa-solid fa-truck-fast"></i><span>Marketplace físico</span><span class="admin-nav-count" id="adminPhysicalCount">0</span>'; b.onclick=()=>openPhysicalAdmin(); tabs.appendChild(b);
}
function openPhysicalAdmin(){
 let page=document.getElementById('physicalAdminPage'); if(page)page.remove(); page=document.createElement('section'); page.id='physicalAdminPage'; page.className='admin-tab'; page.style.cssText='display:block;padding:20px;position:relative;z-index:2';
 page.innerHTML='<div class="admin-pro-section-head"><div><span class="eyebrow">LOGÍSTICA NACIONAL</span><h2>Marketplace físico</h2><p>Gerencie destino, frete, transportadora, rastreio e estado da entrega sem alterar o formulário de pagamento existente.</p></div></div><div id="physicalAdminSummary"></div><div id="physicalAdminList"></div>';
 const host=document.getElementById('adminPage'); if(host)host.appendChild(page); render();
}
function render(){
 const rs=ensureOrderRecords(), confirmed=rs.filter(x=>['payment_confirmed','preparing','shipped','delivered'].includes(x.status)),pending=rs.filter(x=>x.status==='payment_pending'),shipped=rs.filter(x=>['shipped','delivered'].includes(x.status)),delivered=rs.filter(x=>x.status==='delivered');
 const s=document.getElementById('physicalAdminSummary'),g=document.getElementById('physicalAdminList'),c=document.getElementById('adminPhysicalCount'); if(c)c.textContent=rs.filter(x=>x.status!=='delivered').length;
 if(s)s.innerHTML=`<div class="seller-stat-grid"><div class="seller-stat"><small>Pedidos físicos</small><strong>${rs.length}</strong></div><div class="seller-stat"><small>Aguardam pagamento</small><strong>${pending.length}</strong></div><div class="seller-stat"><small>Confirmados</small><strong>${confirmed.length}</strong></div><div class="seller-stat"><small>Em entrega</small><strong>${shipped.length}</strong></div><div class="seller-stat"><small>Entregues</small><strong>${delivered.length}</strong></div></div>`;
 if(!g)return; if(!rs.length){g.innerHTML='<div class="locked-note">Ainda não existem pedidos de produtos físicos.</div>';return;}
 g.innerHTML=rs.slice().reverse().map(r=>`<article class="seller-sales-card" style="margin-top:15px"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><span class="eyebrow">${esc(r.orderId)}</span><h3>${esc(r.productName)}</h3><p>Vendedor: <strong>${esc(r.sellerName||'-')}</strong> · Cliente: <strong>${esc(r.buyerName||'-')}</strong> · ${fmt(r.amount)}</p></div><span class="status ${esc(r.status)}">${label(r.status)}</span></div><div class="ace-physical-box"><div class="seller-stat-grid"><div><small>Província destino</small><strong>${esc(r.destinationProvince||'Não definida')}</strong></div><div><small>Município / cidade</small><strong>${esc(r.destinationCity||'Não definido')}</strong></div><div><small>Frete</small><strong>${fmt(r.shippingCost)}</strong></div><div><small>Transportadora</small><strong>${esc(r.carrier||'Não definida')}</strong></div></div><p><strong>Agência:</strong> ${esc(r.agency||'—')} · <strong>Rastreio:</strong> ${esc(r.tracking||'—')}</p></div><div class="ace-market-actions"><button class="ace-market-btn primary" onclick="editPhysicalOrder('${esc(r.orderId)}')"><i class="fa-solid fa-pen"></i> Gerir logística</button>${r.status==='payment_confirmed'?`<button class="ace-market-btn secondary" onclick="setPhysicalStatus('${esc(r.orderId)}','preparing')">Preparar encomenda</button>`:''}${r.status==='preparing'?`<button class="ace-market-btn secondary" onclick="setPhysicalStatus('${esc(r.orderId)}','shipped')">Marcar despachado</button>`:''}${r.status==='shipped'?`<button class="ace-market-btn secondary" onclick="setPhysicalStatus('${esc(r.orderId)}','delivered')">Confirmar entrega</button>`:''}</div></article>`).join('');
}
function label(s){return ({payment_pending:'Pagamento pendente',payment_confirmed:'Pagamento confirmado',preparing:'Em preparação',shipped:'Despachado',delivered:'Entregue'})[s]||s}
function editPhysicalOrder(id){const rs=ensureOrderRecords(),r=rs.find(x=>x.orderId===id);if(!r)return;
 const p=prompt('Província de destino:\n'+PROV.join(', '),r.destinationProvince||'');if(p===null)return;r.destinationProvince=p.trim();
 const city=prompt('Município / cidade:',r.destinationCity||'');if(city===null)return;r.destinationCity=city.trim();
 const agency=prompt('Agência / ponto de levantamento (opcional):',r.agency||'');if(agency===null)return;r.agency=agency.trim();
 const freight=prompt('Custo do frete em Kz:',String(r.shippingCost||0));if(freight===null)return;r.shippingCost=Math.max(0,Number(freight)||0);
 const carrier=prompt('Transportadora:',r.carrier||'');if(carrier===null)return;r.carrier=carrier.trim();
 const tracking=prompt('Código de rastreio:',r.tracking||'');if(tracking===null)return;r.tracking=tracking.trim();
 const note=prompt('Nota administrativa:',r.adminNote||'');if(note===null)return;r.adminNote=note.trim();r.updatedAt=new Date().toISOString();write(KEY,rs);notifySeller(r,'Logística atualizada',`Destino: ${r.destinationProvince} / ${r.destinationCity}. Frete: ${fmt(r.shippingCost)}. Transportadora: ${r.carrier||'a definir'}. Rastreio: ${r.tracking||'a definir'}.`);render();}
function setPhysicalStatus(id,status){const rs=ensureOrderRecords(),r=rs.find(x=>x.orderId===id);if(!r)return;if(status==='preparing'&&r.status!=='payment_confirmed')return alert('O pagamento deve estar confirmado antes da preparação.');if(status==='shipped'&&r.status!=='preparing')return alert('Primeiro marque a encomenda como preparada.');if(status==='delivered'&&r.status!=='shipped')return alert('Primeiro marque a encomenda como despachada.');r.status=status;r.updatedAt=new Date().toISOString();write(KEY,rs);notifySeller(r,'Estado da encomenda atualizado',`A encomenda ${r.orderId} está agora em: ${label(status)}.`);render();}
function notifySeller(r,title,message){try{const key=typeof NOTIFY_KEY!=='undefined'?NOTIFY_KEY:'apsan_notifications',ns=read(key);ns.push({sellerId:r.sellerId,title,message,createdAt:new Date().toISOString()});write(key,ns)}catch(e){}}
window.openPhysicalAdmin=openPhysicalAdmin;window.editPhysicalOrder=editPhysicalOrder;window.setPhysicalStatus=setPhysicalStatus;
function scan(){inject();ensureOrderRecords();const c=document.getElementById('adminPhysicalCount');if(c)c.textContent=ensureOrderRecords().filter(x=>x.status!=='delivered').length;}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();setInterval(scan,1500);
})();