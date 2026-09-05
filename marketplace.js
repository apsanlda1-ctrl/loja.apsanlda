/* APSAN — marketplace.js
   Código extraído do index.html original.
   Ordem das dependências preservada pelo carregamento modular no index.html.
*/

/* ===== Código original: linhas 2080-2642 ===== */
function openPurchasePage(id){closeLandingMenu();document.querySelectorAll(".purchase-page,.customer-page,.admin-login-page,.admin-page,.app-page,.seller-sales-page").forEach(x=>x.classList.remove("visible"));const p=getData(PRODUCTS_KEY).find(x=>x.id===id&&x.status==="approved"&&!x.deleted);if(!p)return alert("Este produto não está disponível para venda.");resetPaymentCheckout();document.getElementById("purchaseProductId").value=p.id;const price=p.promoPrice!==null?p.promoPrice:p.realPrice;document.getElementById("purchaseSummary").innerHTML=`<small>Total da compra</small><strong>${formatKz(price)}</strong>`;document.getElementById("purchaseProductCard").innerHTML=`${p.coverImage?`<img src="${p.coverImage}" style="width:100%;height:250px;object-fit:cover;border-radius:14px;margin-bottom:18px">`:``}<span class="product-category">${escapeHtml(p.category)}</span><h2>${escapeHtml(p.name)}</h2><p class="checkout-subtitle">Vendido por <strong>${escapeHtml(p.sellerName)}</strong></p><div class="checkout-summary"><small>Valor a pagar</small><strong>${formatKz(price)}</strong><small class="fee-free" style="display:block;margin-top:6px">Taxa da plataforma: 0 Kz · Compra totalmente gratuita de comissão</small></div><div class="locked-note"><i class="fa-solid fa-lock"></i> O produto será liberado depois da confirmação administrativa.</div>`;document.getElementById("purchasePage").classList.add("visible");document.body.classList.add("page-open")}
function closePurchasePage(){document.getElementById("purchasePage").classList.remove("visible");document.body.classList.remove("page-open")}
let paymentDeadline=0,paymentTimer=null;
function resetPaymentCheckout(){if(paymentTimer){clearInterval(paymentTimer);paymentTimer=null}paymentDeadline=0;document.getElementById("paymentTimer").classList.remove("visible","expired");document.getElementById("paymentCountdown").textContent="45:00";document.getElementById("timerMessage").classList.remove("visible");document.getElementById("paymentMethod").value="";document.querySelectorAll(".payment-method-card").forEach(x=>x.classList.remove("active"));document.getElementById("expressDetails").classList.remove("visible");document.getElementById("bankDetails").classList.remove("visible");const btn=document.getElementById("purchaseSubmitBtn");if(btn){btn.disabled=true;btn.setAttribute("aria-disabled","true")}const proof=document.getElementById("paymentProof"),nameEl=document.getElementById("proofName"),titleEl=document.getElementById("paymentProofTitle");if(proof)proof.value="";if(nameEl)nameEl.textContent="";if(titleEl)titleEl.textContent="Selecionar comprovativo"}
function startPaymentCountdown(){if(paymentDeadline)return;paymentDeadline=Date.now()+45*60*1000;document.getElementById("paymentTimer").classList.add("visible");paymentTimer=setInterval(updatePaymentCountdown,1000);updatePaymentCountdown()}
function updatePaymentCountdown(){const left=Math.max(0,paymentDeadline-Date.now()),sec=Math.floor(left/1000),m=String(Math.floor(sec/60)).padStart(2,"0"),s=String(sec%60).padStart(2,"0");document.getElementById("paymentCountdown").textContent=m+":"+s;if(left<=0){clearInterval(paymentTimer);paymentTimer=null;document.getElementById("paymentTimer").classList.add("expired");document.getElementById("timerMessage").classList.add("visible");document.getElementById("purchaseSubmitBtn").disabled=true}}
function selectPaymentMethod(method){document.getElementById("paymentMethod").value=method;document.getElementById("methodExpress").classList.toggle("active",method==="Express");document.getElementById("methodBank").classList.toggle("active",method==="Transferência bancária");document.getElementById("expressDetails").classList.toggle("visible",method==="Express");document.getElementById("bankDetails").classList.toggle("visible",method==="Transferência bancária");startPaymentCountdown();validatePurchaseForm()}
function showPaymentProof(e){const input=e?.target||document.getElementById("paymentProof"),f=input?.files?.[0],nameEl=document.getElementById("proofName"),titleEl=document.getElementById("paymentProofTitle"),zone=document.getElementById("paymentProofZone");if(!f){if(nameEl)nameEl.textContent="";if(titleEl)titleEl.textContent="Selecionar comprovativo";if(zone)zone.classList.remove("has-file","file-error");validatePurchaseForm();return}const allowed=["image/png","image/jpeg","image/webp","application/pdf"];if(!allowed.includes(f.type)){if(input)input.value="";if(nameEl)nameEl.textContent="Formato não suportado. Escolha PNG, JPG, WEBP ou PDF.";if(titleEl)titleEl.textContent="Selecionar comprovativo";if(zone)zone.classList.add("file-error");validatePurchaseForm();return}if(f.size>2*1024*1024){if(input)input.value="";if(nameEl)nameEl.textContent="Ficheiro demasiado grande. O limite é 2 MB.";if(titleEl)titleEl.textContent="Selecionar comprovativo";if(zone)zone.classList.add("file-error");validatePurchaseForm();return}if(nameEl)nameEl.innerHTML='<i class="fa-solid fa-circle-check"></i> '+escFileName(f.name)+' · pronto para enviar';if(titleEl)titleEl.textContent="Comprovativo selecionado";if(zone)zone.classList.remove("file-error"),zone.classList.add("has-file");validatePurchaseForm()}
function escFileName(v){return String(v||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function validatePurchaseForm(){const method=document.getElementById("paymentMethod")?.value||"",proof=document.getElementById("paymentProof")?.files?.[0],name=(document.getElementById("buyerName")?.value||"").trim(),phone=(document.getElementById("buyerPhone")?.value||"").trim();const phoneOk=/^\+?[0-9\s()-]{9,20}$/.test(phone),fileOk=!!proof&&["image/png","image/jpeg","image/webp","application/pdf"].includes(proof.type)&&proof.size<=2*1024*1024;const valid=!!method&&fileOk&&name.length>=3&&phoneOk&&paymentDeadline>Date.now();const btn=document.getElementById("purchaseSubmitBtn");if(btn){btn.disabled=!valid;btn.setAttribute("aria-disabled",valid?"false":"true");btn.classList.toggle("ready",valid)}return valid}
function copyPaymentNumber(value,btn){navigator.clipboard?.writeText(value).then(()=>{const old=btn.innerHTML;btn.innerHTML='<i class="fa-solid fa-check"></i> Copiado';setTimeout(()=>btn.innerHTML=old,1500)}).catch(()=>alert("Número: "+value))}
async function submitPurchase(e){e.preventDefault();if(!validatePurchaseForm())return alert("Escolha o método, carregue um comprovativo válido e confirme os seus dados antes de enviar.");const id=document.getElementById("purchaseProductId").value,p=getData(PRODUCTS_KEY).find(x=>x.id===id&&x.status==="approved"&&!x.deleted);if(!p)return alert("Produto indisponível.");const proof=document.getElementById("paymentProof")?.files?.[0],method=document.getElementById("paymentMethod")?.value||"";if(paymentDeadline<=Date.now())return alert("O prazo de 45 minutos terminou.");if(!method)return alert("Escolha um método de pagamento.");if(!proof)return alert("O comprovativo de pagamento é obrigatório.");const name=document.getElementById("buyerName").value.trim(),phone=document.getElementById("buyerPhone").value.trim();if(name.length<3)return alert("Introduza o seu nome completo.");if(!/^\+?[0-9\s()-]{9,20}$/.test(phone))return alert("Introduza um número de telefone válido.");const btn=document.getElementById("purchaseSubmitBtn");if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A guardar comprovativo...'}try{const amount=p.promoPrice!==null?p.promoPrice:p.realPrice,proofData=await fileToDataURL(proof);const order={id:"COMPRA-"+Date.now(),contentType:p.contentType||"document",contentTypeLabel:p.contentTypeLabel||"Produto digital",productId:p.id,productName:p.name,sellerId:p.sellerId,sellerName:p.sellerName,buyerName:name,buyerPhone:phone,paymentMethod:method,amount,createdAt:new Date().toISOString(),paymentDeadline:new Date(paymentDeadline).toISOString(),status:"payment_pending",paymentProofData:proofData,paymentProofName:proof.name,paymentProofType:proof.type,paymentDetectedAmount:null,released:false,releaseFileData:null,releaseFileName:null};let orders=getData(ORDERS_KEY);orders.push(order);setData(ORDERS_KEY,orders);alert(`Compra registada. Guarde o código: ${order.id}`);document.getElementById("purchaseForm").reset();resetPaymentCheckout();closePurchasePage();openCustomerPortal();document.getElementById("lookupOrderId").value=order.id;document.getElementById("lookupPhone").value=order.buyerPhone;lookupOrder(new Event("submit"));}catch(err){console.error(err);if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Enviar para confirmação'}alert("Não foi possível guardar o comprovativo. Verifique se o ficheiro tem até 2 MB e tente novamente." )}}
function fileToDataURL(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}


function scrollToSection(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"})}
function toggleLandingMenu(){const m=document.getElementById("landingMobileMenu"),b=document.querySelector(".lp-menu");if(!m)return;const open=m.style.display==="block";m.style.display=open?"none":"block";if(b)b.setAttribute("aria-expanded",open?"false":"true")}
function closeLandingMenu(){const m=document.getElementById("landingMobileMenu"),b=document.querySelector(".lp-menu");if(m)m.style.display="none";if(b)b.setAttribute("aria-expanded","false")}
function openSellerRegistration(){closeLandingMenu();document.querySelectorAll(".purchase-page,.customer-page,.admin-login-page,.admin-page,.seller-sales-page").forEach(x=>x.classList.remove("visible"));
 const page=document.getElementById("sellerRegistrationPage");if(!page)return;
 page.classList.add("visible");document.body.classList.add("page-open");
 showSellerAccessChoice();closeLandingMenu();
}
function showSellerAccessChoice(){
 const choice=document.getElementById("sellerAccessChoice"),form=document.getElementById("sellerCreateFormBox");
 if(choice)choice.style.display="block";if(form)form.style.display="none";
}
function showSellerCreateForm(){
 const choice=document.getElementById("sellerAccessChoice"),form=document.getElementById("sellerCreateFormBox");
 if(choice)choice.style.display="none";if(form)form.style.display="block";
}
function openExistingSellerLogin(){
 const page=document.getElementById("sellerRegistrationPage");if(page)page.classList.remove("visible");
 openSellerSales();
}
function apsanAuthTimeout(promise, ms=15000){
  return Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject({code:"apsan-timeout"}),ms))]);
}

async function hashSellerPassword(password){
  const data=new TextEncoder().encode(password);
  const hash=await crypto.subtle.digest("SHA-256",data);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
function sellerMatches(s,name,phone,nif){
  const normalizedPhone=String(phone||'').replace(/\D/g,'');
  const normalizedName=String(name||'').replace(/\s+/g,' ').trim().toLowerCase();
  return String(s?.nif||'').trim().toUpperCase()===String(nif||'').trim().toUpperCase()
    && String(s?.phone||'').replace(/\D/g,'')===normalizedPhone
    && String(s?.name||'').replace(/\s+/g,' ').trim().toLowerCase()===normalizedName;
}
function getLocalSellers(){return getData(STORAGE_KEY)||[];}
function getSellersFromLocalStorage(){return getLocalSellers();}

async function registerSeller(e){
  if(e&&typeof e.preventDefault==='function')e.preventDefault();
  const form=document.getElementById('sellerForm');
  const btn=document.getElementById('sellerCreateBtn')||form?.querySelector('button[type="submit"]');
  const setBusy=(busy)=>{if(btn){btn.disabled=busy;btn.innerHTML=busy?'<i class="fa-solid fa-spinner fa-spin"></i> A criar...':'Criar conta e avançar <i class="fa-solid fa-arrow-right"></i>'}};
  if(!form){alert('Formulário de criação de conta não encontrado.');return false;}
  if(!form.checkValidity()){form.reportValidity();return false;}
  const name=(document.getElementById('sellerName')?.value||'').trim();
  const phone=(document.getElementById('sellerPhone')?.value||'').trim();
  const nif=(document.getElementById('sellerNif')?.value||'').trim().toUpperCase();
  const password=document.getElementById('sellerPassword')?.value||'';
  if(name.length<3||password.length<6)return false;
  setBusy(true);
  try{
    const sellers=getLocalSellers();
    const duplicate=sellers.find(s=>String(s.nif||'').trim().toUpperCase()===nif||String(s.phone||'').replace(/\D/g,'')===phone.replace(/\D/g,''));
    if(duplicate){alert('Já existe um vendedor com este número de telefone ou NIF. Se já possui conta, escolha “Entrar com conta existente”.');setBusy(false);return false;}
    const now=Date.now();
    const passwordHash=await hashSellerPassword(password);
    const seller={id:'SELLER-'+now,uid:'SELLER-'+now,name,phone,nif,registeredAt:new Date().toISOString(),balance:0,notifications:[],approved:true,passwordHash,authMethod:'phone_name_nif_password',role:'seller'};
    const updated=[...sellers,seller];
    // Guarda localmente primeiro: o vendedor não fica preso no “A processar”.
    localStorage.setItem(STORAGE_KEY,JSON.stringify(updated));
    currentSeller=seller;currentSalesSeller=seller;
    localStorage.setItem('apsan_current_seller',JSON.stringify(seller));
    localStorage.setItem('apsan_current_sales_seller',JSON.stringify(seller));
    const reg=document.getElementById('sellerRegistrationPage'),dash=document.getElementById('sellerDashboardPage');
    if(reg)reg.classList.remove('visible');if(dash)dash.classList.add('visible');document.body.classList.add('page-open');
    const n=document.getElementById('dashboardSellerName');if(n)n.textContent=name;
    updateProductUpload();updatePricePreview();updateSellerFinance();setBusy(false);
    alert('Conta de vendedor criada com sucesso. Pode começar a publicar o seu produto.');
    return false;
  }catch(err){
    console.error('APSAN seller registration',err);setBusy(false);alert('Não foi possível criar a conta. Tente novamente.');return false;
  }
}
function openCustomerPortal(){closeLandingMenu();document.querySelectorAll(".purchase-page,.customer-page,.admin-login-page,.admin-page,.app-page,.seller-sales-page").forEach(x=>x.classList.remove("visible"));document.getElementById("customerPage").classList.add("visible");document.body.classList.add("page-open")}
function closeCustomerPortal(){document.getElementById("customerPage").classList.remove("visible");document.body.classList.remove("page-open")}
function lookupOrder(e){if(e&&e.preventDefault)e.preventDefault();const id=document.getElementById("lookupOrderId").value.trim(),phone=document.getElementById("lookupPhone").value.trim(),o=getData(ORDERS_KEY).find(x=>x.id===id&&x.buyerPhone===phone);const box=document.getElementById("portalResult");if(!o){box.innerHTML=`<div class="locked-note">Compra não encontrada. Confirme o código e o telefone usados no pedido.</div>`;return}const p=getData(PRODUCTS_KEY).find(x=>x.id===o.productId),type=o.contentType||p?.contentType||"document",label=o.contentTypeLabel||p?.contentTypeLabel||"Produto digital";let content=`<div class="order-card"><div class="order-product"><div class="no-image"><i class="fa-solid ${type==="video"?"fa-video":type==="audio"?"fa-music":type==="ebook"?"fa-book":"fa-file"}"></i></div><div><h3>${escapeHtml(o.productName)}</h3><p>Compra: <strong>${escapeHtml(o.id)}</strong></p><p>Pagamento: ${escapeHtml(o.paymentMethod)} · ${formatKz(o.amount)}</p><p><span class="content-badge">${escapeHtml(label)}</span></p></div></div><div style="margin-top:16px"><span class="status ${o.released?"released":o.status==="paid"?"paid":"pending"}">${o.released?"Produto liberado":o.status==="paid"?"Pagamento confirmado":o.status==="rejected_payment"?"Comprovativo rejeitado":"Pagamento pendente de confirmação"}</span></div>`;if(o.released&&(o.releaseFileUrl||o.releaseFileData)){const releaseSrc=o.releaseFileUrl||o.releaseFileData;if(type==="video")content+=`<div class="media-preview" style="display:block"><video controls src="${releaseSrc}"></video></div>`;if(type==="audio")content+=`<div class="media-preview" style="display:block"><audio controls src="${releaseSrc}"></audio></div>`;content+=`<a class="download-product" href="${releaseSrc}" target="_blank" rel="noopener" download="${escapeHtml(o.releaseFileName||o.productName)}"><i class="fa-solid fa-download"></i> ${type==="video"?"Receber vídeo":type==="audio"?"Receber áudio":type==="ebook"?"Receber e-book":"Receber produto"}</a>`}else content+=`<div class="locked-note"><i class="fa-solid fa-lock"></i> O conteúdo ainda não foi liberado. O administrador deverá confirmar o pagamento e liberar o ficheiro no seu portal.</div>`;box.innerHTML=content+`</div>`}
function openSellerSales(){closeLandingMenu();document.querySelectorAll(".purchase-page,.customer-page,.admin-login-page,.admin-page,.app-page").forEach(x=>x.classList.remove("visible"));
  document.getElementById("sellerSalesPage").classList.add("visible");
  document.body.classList.add("page-open");
  const login=document.getElementById("sellerSalesLogin"),dash=document.getElementById("sellerSalesDashboard")||document.getElementById("sellerSalesPanel");
  if(login)login.style.display="block";
  if(dash)dash.style.display="none";
  const msg=document.getElementById("salesLoginMsg");if(msg)msg.innerHTML="";
}
function closeSellerSales(){
  document.getElementById("sellerSalesPage").classList.remove("visible");
  document.body.classList.remove("page-open");
}
function logoutSellerLocal(){
  currentSalesSeller=null;
  currentSeller=null;
  const login=document.getElementById("sellerSalesLogin"),dash=document.getElementById("sellerSalesDashboard")||document.getElementById("sellerSalesPanel");
  if(login)login.style.display="block";
  if(dash)dash.style.display="none";
  const msg=document.getElementById("salesLoginMsg");if(msg)msg.innerHTML="";
  const pass=document.getElementById("salesPassword");if(pass)pass.value="";
}
function togglePasswordVisibility(inputId,button){const input=document.getElementById(inputId);if(!input)return;const show=input.type==='password';input.type=show?'text':'password';if(button){button.innerHTML=show?'<i class="fa-solid fa-eye-slash"></i>':'<i class="fa-solid fa-eye"></i>';button.setAttribute('aria-label',show?'Ocultar palavra-passe':'Mostrar palavra-passe');}}
async function sellerSalesLogin(e){
  if(e&&e.preventDefault)e.preventDefault();
  const name=(document.getElementById('salesName')?.value||'').trim();
  const phone=(document.getElementById('salesPhone')?.value||'').trim();
  const nif=(document.getElementById('salesNif')?.value||'').trim().toUpperCase();
  const password=document.getElementById('salesPassword')?.value||'';
  const msg=document.getElementById('salesLoginMsg'),btn=document.getElementById('salesLoginBtn');
  if(!name||!phone||!nif||!password)return;
  if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A verificar...';}
  if(msg)msg.innerHTML='<div class="auth-message loading"><i class="fa-solid fa-spinner fa-spin"></i> A verificar...</div>';
  try{
    let sellers=getLocalSellers();
    let seller=sellers.find(s=>sellerMatches(s,name,phone,nif));
    // Se a conta já está no dispositivo, autentica imediatamente sem esperar o armazenamento local.
    if(!seller){
      sellers=await getSellersFromLocalStorage();
      seller=sellers.find(s=>sellerMatches(s,name,phone,nif));
    }
    if(!seller)throw {code:'seller-not-found'};
    if(!seller.passwordHash)throw {code:'seller-no-password'};
    const passwordHash=await hashSellerPassword(password);
    if(passwordHash!==seller.passwordHash)throw {code:'seller-wrong-password'};
    currentSeller=seller;currentSalesSeller=seller;
    localStorage.setItem('apsan_current_seller',JSON.stringify(seller));localStorage.setItem('apsan_current_sales_seller',JSON.stringify(seller));
    const login=document.getElementById('sellerSalesLogin'),dash=document.getElementById('sellerSalesPanel');
    if(login)login.style.display='none';if(dash)dash.style.display='none';
    document.getElementById('sellerSalesPage')?.classList.remove('visible');document.getElementById('sellerDashboardPage')?.classList.add('visible');document.body.classList.add('page-open');
    const dashboardName=document.getElementById('dashboardSellerName');if(dashboardName)dashboardName.textContent=seller.name||'Vendedor';
    updateProductUpload();updatePricePreview();updateSellerFinance();
    if(msg)msg.innerHTML='<div class="locked-note"><i class="fa-solid fa-circle-check"></i> Sessão iniciada. A abrir o formulário para publicar...</div>';
  }catch(err){
    console.error('APSAN seller login',err);
    const messages={'seller-not-found':'Os dados não correspondem a uma conta de vendedor. Confirme nome, telefone e NIF.','seller-wrong-password':'A palavra-passe está incorreta.','seller-no-password':'Esta conta antiga não possui uma palavra-passe deste sistema. Crie uma nova conta.'};
    if(msg)msg.innerHTML='<div class="locked-note"><i class="fa-solid fa-triangle-exclamation"></i> '+(messages[err?.code]||'Não foi possível iniciar sessão. Tente novamente.')+'</div>';
  }finally{if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-right-to-bracket"></i> Iniciar sessão';}}
}
function sellerProducts(sellerId){return getData(PRODUCTS_KEY).filter(p=>p.sellerId===sellerId&&!p.deleted)}
function sellerOrders(sellerId){const ids=new Set(sellerProducts(sellerId).map(p=>p.id));return getData(ORDERS_KEY).filter(o=>ids.has(o.productId))}
function renderSellerSales(seller){
 const products=sellerProducts(seller.id),orders=sellerOrders(seller.id),paid=orders.filter(o=>o.status==="paid"||o.status==="released"),balance=Number(seller.balance||0),dash=document.getElementById("sellerSalesPanel");
 let saleHtml="";
 products.forEach(p=>{const os=orders.filter(o=>o.productId===p.id),latest=os[os.length-1];let state;if(p.status==="pending")state="Aguardando aprovação";else if(p.status==="rejected")state="Rejeitado pelo administrador";else if(latest&&latest.released)state="Vendido • Produto liberado";else if(latest&&latest.status==="paid")state="Pagamento confirmado • aguardando liberação";else if(latest)state="Aguardando confirmação do pagamento";else state="Aprovado • À venda";saleHtml+=`<div class="seller-sale-item"><div class="seller-sale-row"><strong>${escapeHtml(p.name)}</strong><span class="status ${p.status}">${escapeHtml(state)}</span></div><p>Preço: ${formatKz(p.promoPrice!==null?p.promoPrice:p.realPrice)}${p.rejectionReason?" • Motivo: "+escapeHtml(p.rejectionReason):""}</p></div>`});
 if(!saleHtml)saleHtml="<p style='color:#94a3b8'>Ainda não existem produtos registados.</p>";
 let notificationsHtml="";const notes=seller.notifications||[];if(notes.length){notes.slice().reverse().forEach(n=>notificationsHtml+=`<div class="notification-item">${escapeHtml(n.message)}<small>${new Date(n.date).toLocaleString("pt-AO")}</small></div>`)}else notificationsHtml="<p style='color:#94a3b8'>Nenhuma notificação.</p>";
 dash.innerHTML=`<div class="seller-account-card"><span class="eyebrow">PAINEL DE VENDAS</span><h2>${escapeHtml(seller.name)}</h2><p>Identidade confirmada com correspondência exata.</p><div class="virtual-card"><div class="virtual-card-brand">APSAN, LDA.</div><div class="virtual-card-number">**** **** ${String(seller.id).slice(-4).padStart(4,"0")}</div><div class="virtual-card-bottom"><div><small>Vendedor</small><strong>${escapeHtml(seller.name)}</strong></div><div><small>Saldo disponível</small><strong class="balance-amount">${formatKz(balance)}</strong></div></div></div><div class="seller-stat-grid"><div class="seller-stat"><small>Produtos</small><strong>${products.length}</strong></div><div class="seller-stat"><small>Vendas pagas</small><strong>${paid.length}</strong></div><div class="seller-stat"><small>Valor vendido</small><strong>${formatKz(paid.reduce((a,o)=>a+Number(o.amount||0),0))}</strong></div></div></div><div class="seller-sales-card" style="margin-top:20px"><h3><i class="fa-solid fa-wallet"></i> Saldo e saques</h3><p style="color:#94a3b8">Saldo disponível: <strong style="color:#67e8f9">${formatKz(balance)}</strong></p><button class="withdraw-btn" onclick="openWithdrawForm()"><i class="fa-solid fa-money-bill-transfer"></i> Sacar valor</button><div class="seller-notice">O pedido de saque será enviado ao administrador.</div><div id="withdrawArea"></div></div><div class="seller-sales-card" style="margin-top:20px"><h3><i class="fa-solid fa-list-check"></i> Estado das vendas</h3>${saleHtml}</div><div class="seller-sales-card" style="margin-top:20px"><h3><i class="fa-solid fa-bell"></i> Notificações</h3>${notificationsHtml}</div>`;
 document.getElementById("sellerSalesLogin").style.display="none";dash.style.display="block";
}
function openWithdrawForm(){const area=document.getElementById("withdrawArea");area.innerHTML=`<div class="modal-lite-card" style="margin-top:15px;padding:15px"><h3>Solicitar saque</h3><form onsubmit="submitWithdraw(event)" style="display:flex;flex-direction:column;gap:9px"><label>Tipo de saque <span>*</span></label><div class="withdraw-options"><button type="button" class="withdraw-method active" onclick="selectWithdrawMethod('Express',this)">Express</button><button type="button" class="withdraw-method" onclick="selectWithdrawMethod('Transferência bancária',this)">Transferência bancária</button></div><input type="hidden" id="withdrawMethod" value="Express"><label>Montante <span>*</span></label><input id="withdrawAmount" type="number" min="0.01" step="0.01" required><label>Escolha do valor</label><select id="withdrawScope"><option value="partial">Apenas este montante</option><option value="all">Todo o saldo</option></select><div id="withdrawFields"><label>Número Express <span>*</span></label><input id="withdrawExpress" required placeholder="Número do Express"></div><button class="btn-submit" type="submit">Solicitar saque</button></form></div>`}
function selectWithdrawMethod(method,btn){document.getElementById("withdrawMethod").value=method;document.querySelectorAll(".withdraw-method").forEach(b=>b.classList.remove("active"));btn.classList.add("active");document.getElementById("withdrawFields").innerHTML=method==="Express"?`<label>Número Express <span>*</span></label><input id="withdrawExpress" required placeholder="Número do Express">`:`<label>IBAN completo <span>*</span></label><input id="withdrawIban" required placeholder="IBAN"><label>Nome do banco <span>*</span></label><input id="withdrawBank" required placeholder="Nome do banco"><label>Nome completo do titular <span>*</span></label><input id="withdrawHolder" required placeholder="Nome completo">`}
function submitWithdraw(e){e.preventDefault();if(!currentSalesSeller)return;let amount=parseFloat(document.getElementById("withdrawAmount").value),balance=Number(currentSalesSeller.balance||0);if(document.getElementById("withdrawScope").value==="all")amount=balance;if(!amount||amount<=0||amount>balance)return alert("O montante solicitado não pode ser superior ao saldo disponível.");const method=document.getElementById("withdrawMethod").value,req={id:"SAQUE-"+Date.now(),sellerId:currentSalesSeller.id,sellerName:currentSalesSeller.name,amount,method,details:method==="Express"?{express:document.getElementById("withdrawExpress").value.trim()}:{iban:document.getElementById("withdrawIban").value.trim(),bank:document.getElementById("withdrawBank").value.trim(),holder:document.getElementById("withdrawHolder").value.trim()},status:"pending",createdAt:new Date().toISOString()};let reqs=getData("apsan_saques");reqs.push(req);setData("apsan_saques",reqs);alert("Pedido de saque enviado ao administrador.");renderSellerSales(currentSalesSeller)}

const ADMIN_SUPPORT_EMAIL="suporte@apsanlda.com";

function openAdminLogin(){
  try{
    if(typeof closeLandingMenu==="function") closeLandingMenu();
  }catch(e){}
  if(typeof openAdminPage==="function"){
    openAdminPage();
  }else{
    const page=document.getElementById("adminPage");
    if(page){
      page.classList.add("visible");
      document.body.classList.add("page-open");
    }
  }
}
function openAdminPage(){
  document.getElementById("adminPage").classList.add("visible");
  document.body.classList.add("page-open");
  renderAdmin();
  if(typeof apsanAdminRefreshCounts==="function")apsanAdminRefreshCounts();
  const overviewBtn=document.querySelector(".admin-pro-nav-btn[data-admin-tab='overview']");
  showAdminTab("overview",overviewBtn);
}
function closeAdminPage(){document.getElementById("adminPage").classList.remove("visible");adminAuthenticated=false;document.body.classList.remove("page-open");}
function showAdminTab(tab,btn){
  document.querySelectorAll(".admin-pro-nav-btn").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".admin-tab").forEach(x=>x.classList.remove("active"));
  if(btn)btn.classList.add("active");
  const ids={
    overview:"adminOverviewTab",products:"adminProductsTab",orders:"adminOrdersTab",
    withdrawals:"adminWithdrawalsTab",sellers:"adminSellersTab",online:"adminOnlineTab",
    approvals:"adminApprovalsTab",users:"adminUsersTab",finance:"adminFinanceTab",
    audit:"adminAuditTab",settings:"adminSettingsTab",tools:"adminToolsTab"
  };
  Object.keys(ids).forEach(k=>{
    const el=document.getElementById(ids[k]);
    if(el)el.style.display=tab===k?"block":"none";
  });
  if(tab==="overview")renderAdminOverview();
  if(tab==="products")renderAdminProducts();
  if(tab==="orders")renderAdminOrders();
  if(tab==="withdrawals")renderAdminWithdrawals();
  if(tab==="sellers")renderAdminSellers();
  if(tab==="online")renderAdminOnline();
  if(tab==="approvals")apsanAdminRenderApprovals();
  if(tab==="users")apsanAdminRenderUsers();
  if(tab==="finance")apsanAdminRenderFinance();
  if(tab==="audit")apsanAdminRenderAudit();
  if(tab==="settings")apsanAdminRenderSettings();
  if(tab==="tools")apsanAdminRenderTools();
  if(typeof apsanAdminRefreshCounts==="function")apsanAdminRefreshCounts();
}
function renderAdmin(){
  renderAdminStats();
  renderAdminProducts();
  renderAdminOrders();
  renderAdminWithdrawals();
  renderAdminSellers();
  renderAdminApprovalNotice();
}
function renderAdminApprovalNotice(){
  const tab=document.getElementById('adminProductsTab');
  if(!tab)return;
  const pending=getData(PRODUCTS_KEY).filter(p=>p.status==='pending'&&!p.deleted);
  const old=document.getElementById('adminApprovalNotice');
  if(old)old.remove();
  if(!pending.length)return;
  const box=document.createElement('div');
  box.id='adminApprovalNotice';
  box.style.cssText='margin:0 0 18px;padding:16px 18px;border-radius:14px;background:linear-gradient(135deg,#0f766e,#047857);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:14px;box-shadow:0 10px 25px rgba(0,0,0,.12);';
  box.innerHTML=`<div><strong style="font-size:16px"><i class="fa-solid fa-bell"></i> ${pending.length} produto(s) aguardam aprovação</strong><div style="margin-top:4px;opacity:.9;font-size:13px">Os produtos enviados pelos vendedores aparecem aqui imediatamente para análise.</div></div><button class="admin-action approve" style="background:#fff;color:#047857;border:0" onclick="document.getElementById('adminProductsTab').scrollIntoView({behavior:'smooth',block:'start'})">Ver produtos</button>`;
  tab.prepend(box);
}

function renderAdminOverview(){
  const p=getData(PRODUCTS_KEY).filter(x=>!x.deleted);
  const o=getData(ORDERS_KEY);
  const s=getData(STORAGE_KEY);
  const w=getData(WITHDRAWALS_KEY);
  const teachers=typeof og==="function"?og(OK.T):[];
  const students=typeof og==="function"?og(OK.S):[];
  const institutions=typeof og==="function"?og(OK.IN):[];
  const enrollments=typeof og==="function"?og(OK.E):[];
  const pendingOnline=(teachers.filter(x=>x.status==="pending").length)+(institutions.filter(x=>x.status==="pending").length)+(enrollments.filter(x=>["under_review","payment_submitted"].includes(x.status)).length);
  const np=document.getElementById("adminNavProductsCount"),no=document.getElementById("adminNavOrdersCount"),ns=document.getElementById("adminNavSellersCount"),nw=document.getElementById("adminNavWithdrawalsCount"),non=document.getElementById("adminNavOnlineCount");
  if(np)np.textContent=p.filter(x=>x.status==="pending").length;
  if(no)no.textContent=o.length;
  if(ns)ns.textContent=s.length;
  if(nw)nw.textContent=w.filter(x=>["requested","pending","approved","processing"].includes(x.status)).length;
  if(non)non.textContent=pendingOnline;

  const summary=document.getElementById("adminOnlineSummary");
  if(summary)summary.innerHTML=
    '<div class="admin-pro-online-mini"><small>Professores</small><strong>'+teachers.length+'</strong></div>'+
    '<div class="admin-pro-online-mini"><small>Alunos</small><strong>'+students.length+'</strong></div>'+
    '<div class="admin-pro-online-mini"><small>Instituições</small><strong>'+institutions.length+'</strong></div>'+
    '<div class="admin-pro-online-mini"><small>Pendentes</small><strong>'+pendingOnline+'</strong></div>';

  renderAdminStats();
}
function renderAdminStats(){
  const p=getData(PRODUCTS_KEY),o=getData(ORDERS_KEY),s=getData(STORAGE_KEY),w=getData(WITHDRAWALS_KEY);
  const values=[
    ["Produtos",p.filter(x=>!x.deleted).length,"fa-box-open"],
    ["Aprovações pendentes",p.filter(x=>x.status==="pending"&&!x.deleted).length,"fa-hourglass-half"],
    ["Compras",o.length,"fa-cart-shopping"],
    ["Vendedores",s.length,"fa-store"],
    ["Saques pendentes",w.filter(x=>["requested","pending","approved","processing"].includes(x.status)).length,"fa-money-bill-transfer"]
  ];
  const el=document.getElementById("adminStats");
  if(!el)return;
  el.innerHTML=values.map(v=>'<div class="admin-pro-kpi"><span class="kpi-icon"><i class="fa-solid '+v[2]+'"></i></span><small>'+v[0]+'</small><strong>'+v[1]+'</strong></div>').join("");
}

function renderAdminWithdrawals(){const ws=getData(WITHDRAWALS_KEY),tab=document.getElementById("adminWithdrawalsTab");if(!ws.length){tab.innerHTML='<p>Nenhum pedido de saque.</p>';return}tab.innerHTML=ws.slice().reverse().map(w=>`<div class="admin-notification"><div class="sale-row-top"><strong>${escapeHtml(w.sellerName)} quer sacar ${formatKz(w.amount)}</strong><span class="status ${w.status==="completed"?"paid":"pending"}">${w.status==="requested"?"Aguardando transferência":w.status==="completed"?"Transferido":"Cancelado"}</span></div><p>Método: ${escapeHtml(w.method)}</p>${w.method==="Express"?`<p>Número Express: <strong>${escapeHtml(w.expressNumber)}</strong></p>`:`<p>IBAN: <strong>${escapeHtml(w.iban)}</strong><br>Banco: ${escapeHtml(w.bank)}<br>Titular: ${escapeHtml(w.holder)}</p>`}${w.status==="requested"?`<button class="admin-action approve" onclick="completeWithdrawal('${w.id}')">Marcar como transferido</button><button class="admin-action reject" onclick="cancelWithdrawal('${w.id}')">Cancelar e devolver saldo</button>`:""}</div>`).join("")}
function completeWithdrawal(id){const ws=getData(WITHDRAWALS_KEY),w=ws.find(x=>x.id===id);if(!w)return;w.status="completed";w.completedAt=new Date().toISOString();setData(WITHDRAWALS_KEY,ws);const ns=getData(NOTIFY_KEY);ns.push({sellerId:w.sellerId,title:"Saque concluído",message:`O seu saque de ${formatKz(w.amount)} foi marcado como transferido com sucesso pelo administrador.`,createdAt:new Date().toISOString()});setData(NOTIFY_KEY,ns);renderAdminStats();renderAdminWithdrawals()}
function cancelWithdrawal(id){const ws=getData(WITHDRAWALS_KEY),w=ws.find(x=>x.id===id);if(!w)return;if(!confirm("Cancelar este saque e devolver o valor ao saldo do vendedor?"))return;w.status="cancelled";const sellers=getData(STORAGE_KEY),s=sellers.find(x=>x.id===w.sellerId);if(s)s.balance=Number(s.balance||0)+Number(w.amount||0);setData(STORAGE_KEY,sellers);setData(WITHDRAWALS_KEY,ws);const ns=getData(NOTIFY_KEY);ns.push({sellerId:w.sellerId,title:"Saque cancelado",message:`O pedido de saque de ${formatKz(w.amount)} foi cancelado e o valor devolvido ao seu saldo.`,createdAt:new Date().toISOString()});setData(NOTIFY_KEY,ns);renderAdminStats();renderAdminWithdrawals()}

function renderAdminWithdrawals(){
  const reqs=getData(WITHDRAWALS_KEY);
  const tab=document.getElementById("adminWithdrawalsTab");
  if(!reqs.length){tab.innerHTML="<p>Nenhum pedido de saque.</p>";return}

  tab.innerHTML=`<div class="admin-table-wrap"><table class="admin-table">
    <thead><tr><th>Pedido</th><th>Vendedor</th><th>Valor</th><th>Transferência</th><th>Estado</th><th>Ações</th></tr></thead>
    <tbody>${reqs.slice().reverse().map(r=>{
      const state=r.status==="requested"||r.status==="pending"?"Pendente":
        r.status==="approved"?"Aprovado":
        r.status==="processing"?"Em processamento":
        r.status==="completed"?"Transferido":
        r.status==="rejected"?"Rejeitado":"Eliminado";
      return `<tr>
        <td>${escapeHtml(r.id)}<br><small>${new Date(r.createdAt).toLocaleString("pt-AO")}</small></td>
        <td><strong>${escapeHtml(r.sellerName)}</strong></td>
        <td>${formatKz(r.amount)}</td>
        <td>${escapeHtml(r.bank||"Transferência bancária")}<br><small>IBAN: ${escapeHtml(r.iban||"")}<br>Titular: ${escapeHtml(r.holder||"")}</small><br><small>${escapeHtml(r.processingTime||"")}</small></td>
        <td><span class="status ${r.status}">${state}</span>${r.adminReason?`<br><small>${escapeHtml(r.adminReason)}</small>`:""}</td>
        <td><div class="actions">
          ${["requested","pending"].includes(r.status)?`<button class="admin-action approve" onclick="approveWithdrawal('${r.id}')">Aprovar</button><button class="admin-action reject" onclick="rejectWithdrawal('${r.id}')">Rejeitar</button>`:""}
          ${["approved","processing"].includes(r.status)?`<button class="admin-action release" onclick="completeWithdrawal('${r.id}')">Marcar transferido</button>`:""}
          ${["requested","pending","approved","processing"].includes(r.status)?`<button class="admin-action edit" onclick="editWithdrawal('${r.id}')">Editar</button>`:""}
          ${!["completed","deleted"].includes(r.status)?`<button class="admin-action delete" onclick="deleteWithdrawal('${r.id}')">Eliminar</button>`:""}
        </div></td>
      </tr>`;
    }).join("")}</tbody></table></div>`;
}
function completeWithdrawal(id){
  const reqs=getData(WITHDRAWALS_KEY),r=reqs.find(x=>x.id===id);
  if(!r)return;
  if(r.status!=="approved"&&r.status!=="processing")return alert("Primeiro aprove o pedido de saque.");

  r.status="completed";
  r.completedAt=new Date().toISOString();

  const bankNorm=String(r.bank||"").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const isBfa=bankNorm.includes("BFA");
  const ns=getData(NOTIFY_KEY);
  ns.push({
    sellerId:r.sellerId,title:"Saque aprovado e processado",
    message:`O seu saque de ${formatKz(r.amount)} foi aprovado e enviado para processamento. ${isBfa?"Para BFA, o processamento ocorre em até 24 horas úteis.":"Para BAI ou outro banco, o valor poderá refletir na conta em 4 a 5 dias úteis."}`,
    createdAt:new Date().toISOString()
  });

  setData(WITHDRAWALS_KEY,reqs);
  setData(NOTIFY_KEY,ns);
  renderAdmin();
}

function approveWithdrawal(id){
  const reqs=getData(WITHDRAWALS_KEY),r=reqs.find(x=>x.id===id);
  if(!r)return;
  if(!["requested","pending"].includes(r.status))return alert("Este pedido já não está pendente.");

  const bankNorm=String(r.bank||"").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const isBfa=bankNorm.includes("BFA");
  r.status="approved";
  r.approvedAt=new Date().toISOString();
  r.processingTime=isBfa
    ?"Saque aprovado. Processamento em até 24 horas úteis (BFA)."
    :"Saque aprovado. O valor poderá refletir na conta em 4 a 5 dias úteis após o processamento.";

  const ns=getData(NOTIFY_KEY);
  ns.push({
    sellerId:r.sellerId,title:"Saque aprovado",
    message:`O seu saque de ${formatKz(r.amount)} foi aprovado pelo administrador. ${r.processingTime}`,
    createdAt:new Date().toISOString()
  });
  setData(WITHDRAWALS_KEY,reqs);
  setData(NOTIFY_KEY,ns);
  renderAdmin();
}

function rejectWithdrawal(id){
  const reason=prompt("Explique o motivo da rejeição deste saque:");
  if(!reason||!reason.trim())return alert("A rejeição precisa de uma explicação.");

  const reqs=getData(WITHDRAWALS_KEY),r=reqs.find(x=>x.id===id);
  if(!r)return;
  if(!["requested","pending","approved","processing"].includes(r.status))return alert("Este pedido já não pode ser rejeitado.");

  r.status="rejected";
  r.adminReason=reason.trim();
  r.rejectedAt=new Date().toISOString();

  const sellers=getData(STORAGE_KEY),seller=sellers.find(s=>s.id===r.sellerId);
  if(seller)seller.balance=Number(seller.balance||0)+Number(r.amount||0);

  const ns=getData(NOTIFY_KEY);
  ns.push({
    sellerId:r.sellerId,title:"Saque rejeitado",
    message:`O seu pedido de saque de ${formatKz(r.amount)} foi rejeitado. Motivo: ${r.adminReason}. O valor foi devolvido ao seu saldo.`,
    createdAt:new Date().toISOString()
  });

  setData(STORAGE_KEY,sellers);
  setData(WITHDRAWALS_KEY,reqs);
  setData(NOTIFY_KEY,ns);
  renderAdmin();
}

function editWithdrawal(id){
  const reqs=getData(WITHDRAWALS_KEY),r=reqs.find(x=>x.id===id);
  if(!r)return;

  const newAmount=prompt("Novo valor do saque (mínimo 10.000 Kz):",String(r.amount));
  if(newAmount===null)return;
  const amount=Number(newAmount);
  if(!Number.isFinite(amount)||amount<10000)return alert("O valor mínimo do saque é de 10.000 Kz.");

  const newBank=prompt("Novo nome do banco:",r.bank||"");
  if(newBank===null||!newBank.trim())return alert("O nome do banco é obrigatório.");
  const newIban=prompt("Novo IBAN:",r.iban||"");
  if(newIban===null||!newIban.trim())return alert("O IBAN é obrigatório.");
  const newHolder=prompt("Novo titular:",r.holder||"");
  if(newHolder===null||!newHolder.trim())return alert("O titular é obrigatório.");

  const sellers=getData(STORAGE_KEY),seller=sellers.find(s=>s.id===r.sellerId);
  const delta=amount-Number(r.amount||0);
  if(seller && delta>0 && Number(seller.balance||0)<delta)
    return alert("O vendedor não possui saldo disponível suficiente para aumentar este saque.");
  if(seller)seller.balance=Number(seller.balance||0)-delta;

  r.amount=amount;
  r.bank=newBank.trim();
  r.iban=newIban.trim();
  r.holder=newHolder.trim();
  r.adminEditedAt=new Date().toISOString();

  const bankNorm=r.bank.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  r.processingTime=bankNorm.includes("BFA")
    ?"Processamento em até 24 horas úteis (BFA)."
    :"Crédito previsto em 4 a 5 dias úteis após o processamento (BAI ou outro banco).";

  setData(STORAGE_KEY,sellers);
  setData(WITHDRAWALS_KEY,reqs);
  renderAdmin();
}

function deleteWithdrawal(id){
  if(!confirm("Eliminar este pedido de saque? Se ainda estiver reservado, o valor será devolvido ao saldo do vendedor."))return;

  const reqs=getData(WITHDRAWALS_KEY),r=reqs.find(x=>x.id===id);
  if(!r)return;

  const wasReserved=["requested","pending","approved","processing"].includes(r.status);
  if(wasReserved){
    const sellers=getData(STORAGE_KEY),seller=sellers.find(s=>s.id===r.sellerId);
    if(seller)seller.balance=Number(seller.balance||0)+Number(r.amount||0);
    setData(STORAGE_KEY,sellers);
  }

  r.status="deleted";
  r.deletedAt=new Date().toISOString();

  const ns=getData(NOTIFY_KEY);
  ns.push({
    sellerId:r.sellerId,title:"Pedido de saque eliminado",
    message:`O pedido de saque ${r.id} foi eliminado pelo administrador.${wasReserved?" O valor foi devolvido ao saldo.":""}`,
    createdAt:new Date().toISOString()
  });

  setData(WITHDRAWALS_KEY,reqs);
  setData(NOTIFY_KEY,ns);
  renderAdmin();
}

function renderAdminSellers(){const sellers=getData(STORAGE_KEY),tab=document.getElementById("adminSellersTab");if(!sellers.length){tab.innerHTML="<p>Nenhum vendedor registado.</p>";return}tab.innerHTML=`<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Nome</th><th>Telefone</th><th>NIF</th><th>Registo</th></tr></thead><tbody>${sellers.map(s=>`<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.phone)}</td><td>${escapeHtml(s.nif)}</td><td>${new Date(s.registeredAt).toLocaleString("pt-AO")}</td></tr>`).join("")}</tbody></table></div>`}

// ===== POLÍTICA FINANCEIRA APSAN: compras 0% / saques 10% =====
const WITHDRAWAL_FEE_RATE = 0.10;
function withdrawalFinancials(amount){
  const gross=Math.max(0,Number(amount)||0);
  const fee=Math.round(gross*WITHDRAWAL_FEE_RATE*100)/100;
  return {gross,fee,net:Math.max(0,gross-fee)};
}
function moneyFeePreview(){
  const mode=document.getElementById("withdrawAmount")?.value;
  const input=document.getElementById("partialAmount");
  const available=Number(currentSalesSeller?.balance||sellerSalesCurrent?.balance||0);
  const gross=mode==="all"?available:Number(input?.value||0);
  const f=withdrawalFinancials(gross);
  const box=document.getElementById("withdrawFeePreview");
  if(!box)return;
  box.innerHTML=`<div class="fee-breakdown"><div class="fee-line"><span>Valor bruto a sacar</span><strong>${formatKz(f.gross)}</strong></div><div class="fee-line"><span>Comissão da plataforma (10%)</span><strong>${formatKz(f.fee)}</strong></div><div class="fee-line total"><span>Valor líquido que receberá</span><strong>${formatKz(f.net)}</strong></div></div>`;
}
function openWithdrawForm(){
  const b=document.getElementById("withdrawBox"); if(!b)return;
  b.style.display="block";
  b.innerHTML=`<h3>Solicitar saque</h3>
  <form class="withdraw-form" onsubmit="requestWithdrawal(event)">
    <div class="field full"><label>Método de saque</label><input value="Transferência bancária" readonly><small class="muted">Os saques são processados exclusivamente por transferência bancária.</small></div>
    <div class="field"><label>Montante <span>*</span></label><select id="withdrawAmount" required><option value="all">Todo o saldo</option><option value="partial">Uma parte</option></select></div>
    <div id="partialAmountWrap" class="field" style="display:none"><label>Valor a sacar (Kz) <span>*</span></label><input id="partialAmount" type="number" min="10000" step="0.01" placeholder="Mínimo 10.000 Kz"></div>
    <div class="withdraw-fee-box full"><strong>Política de taxas</strong><div style="margin-top:5px;color:#cbd5e1">A compra do cliente é <strong class="fee-free">100% gratuita de comissão</strong>. A plataforma cobra <strong>10%</strong> somente quando o vendedor faz um saque.</div><div id="withdrawFeePreview"></div></div>
    <div id="bankData" class="field full"><label>IBAN completo <span>*</span></label><input id="withdrawIban" required placeholder="IBAN"><label>Nome do banco <span>*</span></label><input id="withdrawBank" required placeholder="Ex.: BFA ou BAI"><label>Nome completo do titular <span>*</span></label><input id="withdrawHolder" required placeholder="Nome completo"></div>
    <div class="notice"><strong>Saque mínimo: 10.000 Kz.</strong><br>BFA: processamento em até 24 horas úteis.<br>BAI ou outro banco: o valor poderá refletir na conta em 4 a 5 dias úteis após o processamento.</div>
    <button class="btn-submit full" type="submit">Confirmar saque</button>
  </form>`;
  const sel=document.getElementById("withdrawAmount"), part=document.getElementById("partialAmount");
  sel.addEventListener("change",()=>{document.getElementById("partialAmountWrap").style.display=sel.value==="partial"?"block":"none";moneyFeePreview()});
  part.addEventListener("input",moneyFeePreview); moneyFeePreview();
}
function requestWithdrawal(e){
  e.preventDefault();
  if(!currentSalesSeller)return alert("Abra o painel de vendas e entre com os dados do vendedor antes de solicitar o saque.");
  const sellers=getData(STORAGE_KEY),seller=sellers.find(s=>s.id===currentSalesSeller.id);
  if(!seller)return alert("Vendedor não encontrado.");
  const available=Number(seller.balance||0),mode=document.getElementById("withdrawAmount").value;
  const amount=mode==="all"?available:Number(document.getElementById("partialAmount").value);
  if(!Number.isFinite(amount)||amount<10000)return alert("O saque mínimo é de 10.000 Kz.");
  if(amount>available)return alert("O montante solicitado não pode ser superior ao saldo disponível.");
  const iban=document.getElementById("withdrawIban").value.trim(),bank=document.getElementById("withdrawBank").value.trim(),holder=document.getElementById("withdrawHolder").value.trim();
  if(!iban||!bank||!holder)return alert("Preencha o IBAN, o nome do banco e o nome completo do titular.");
  const f=withdrawalFinancials(amount);
  if(!confirm(`Confirmar saque?\n\nValor bruto: ${formatKz(f.gross)}\nComissão da plataforma (10%): ${formatKz(f.fee)}\nValor líquido a receber: ${formatKz(f.net)}\n\nA compra do cliente não tem comissão.`))return;
  const bankNorm=bank.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const isBfa=bankNorm.includes("BFA");
  const processingTime=isBfa?"Processamento em até 24 horas úteis (BFA).":"Crédito previsto em 4 a 5 dias úteis após o processamento (BAI ou outro banco).";
  const w={id:"SAQUE-"+Date.now(),sellerId:seller.id,sellerName:seller.name,amount:f.gross,grossAmount:f.gross,feeRate:WITHDRAWAL_FEE_RATE,feeAmount:f.fee,netAmount:f.net,platformRevenue:f.fee,purchaseFee:0,method:"Transferência bancária",iban,bank,holder,status:"requested",processingTime,createdAt:new Date().toISOString()};
  const ws=getData(WITHDRAWALS_KEY);ws.push(w);setData(WITHDRAWALS_KEY,ws);
  seller.balance=available-f.gross;setData(STORAGE_KEY,sellers);
  const ns=getData(NOTIFY_KEY);ns.push({sellerId:seller.id,title:"Pedido de saque recebido",message:`Pedido de saque recebido. Valor bruto: ${formatKz(f.gross)}. Comissão da plataforma (10%): ${formatKz(f.fee)}. Valor líquido a receber: ${formatKz(f.net)}. Compras realizadas pelos clientes não têm comissão. ${processingTime}`,createdAt:new Date().toISOString()});setData(NOTIFY_KEY,ns);
  document.getElementById("withdrawBox").style.display="none";document.getElementById("withdrawBox").innerHTML="";alert(`Pedido enviado.\n\nBruto: ${formatKz(f.gross)}\nComissão 10%: ${formatKz(f.fee)}\nLíquido: ${formatKz(f.net)}`);renderSellerSales(seller);
}
function renderAdminStats(){
  const p=getData(PRODUCTS_KEY),o=getData(ORDERS_KEY),s=getData(STORAGE_KEY),w=getData(WITHDRAWALS_KEY);
  const pending=w.filter(x=>["requested","pending","approved","processing"].includes(x.status));
  const realized=w.filter(x=>["completed","paid","transferido"].includes(x.status)).reduce((a,x)=>a+Number(x.feeAmount??withdrawalFinancials(x.grossAmount??x.amount).fee),0);
  const expected=pending.reduce((a,x)=>a+Number(x.feeAmount??withdrawalFinancials(x.grossAmount??x.amount).fee),0);
  document.getElementById("adminStats").innerHTML=`<div class="admin-stat"><small>Total de produtos</small><strong>${p.filter(x=>!x.deleted).length}</strong></div><div class="admin-stat"><small>Aguardando aprovação</small><strong>${p.filter(x=>x.status==="pending"&&!x.deleted).length}</strong></div><div class="admin-stat"><small>Compras</small><strong>${o.length}</strong><small class="fee-free">Comissão na compra: 0 Kz</small></div><div class="admin-stat"><small>Vendedores</small><strong>${s.length}</strong></div><div class="admin-stat"><small>Saques pendentes</small><strong>${pending.length}</strong></div><div class="admin-stat"><small>Receita de saques</small><strong>${formatKz(realized)}</strong><small>10% já realizados</small></div><div class="admin-stat"><small>Comissão pendente</small><strong>${formatKz(expected)}</strong><small>10% dos saques em aberto</small></div>`;
}
function renderAdminWithdrawals(){
  const reqs=getData(WITHDRAWALS_KEY),tab=document.getElementById("adminWithdrawalsTab");
  const realized=reqs.filter(x=>["completed","paid","transferido"].includes(x.status)).reduce((a,x)=>a+Number(x.feeAmount??withdrawalFinancials(x.grossAmount??x.amount).fee),0);
  const expected=reqs.filter(x=>["requested","pending","approved","processing"].includes(x.status)).reduce((a,x)=>a+Number(x.feeAmount??withdrawalFinancials(x.grossAmount??x.amount).fee),0);
  const header=`<div class="admin-revenue-box"><strong>Receita da plataforma — comissão de saque 10%</strong><div class="admin-mini-grid"><div class="admin-mini"><small>Receita realizada</small><strong>${formatKz(realized)}</strong></div><div class="admin-mini"><small>Comissão pendente</small><strong>${formatKz(expected)}</strong></div><div class="admin-mini"><small>Comissão na compra</small><strong class="fee-free">0 Kz</strong></div></div></div>`;
  if(!reqs.length){tab.innerHTML=header+"<p>Nenhum pedido de saque.</p>";return}
  tab.innerHTML=header+`<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Pedido</th><th>Vendedor</th><th>Bruto</th><th>Comissão 10%</th><th>Líquido</th><th>Transferência</th><th>Estado</th><th>Ações</th></tr></thead><tbody>${reqs.slice().reverse().map(r=>{const f=withdrawalFinancials(r.grossAmount??r.amount);const state=r.status==="requested"||r.status==="pending"?"Pendente":r.status==="approved"?"Aprovado":r.status==="processing"?"Em processamento":r.status==="completed"?"Transferido":r.status==="rejected"?"Rejeitado":"Eliminado";return `<tr><td>${escapeHtml(r.id)}<br><small>${new Date(r.createdAt).toLocaleString("pt-AO")}</small></td><td><strong>${escapeHtml(r.sellerName)}</strong></td><td>${formatKz(f.gross)}</td><td>${formatKz(f.fee)}</td><td><strong>${formatKz(f.net)}</strong></td><td>${escapeHtml(r.bank||"Transferência bancária")}<br><small>IBAN: ${escapeHtml(r.iban||"")}<br>Titular: ${escapeHtml(r.holder||"")}</small><br><small>${escapeHtml(r.processingTime||"")}</small></td><td><span class="status ${r.status}">${state}</span>${r.adminReason?`<br><small>${escapeHtml(r.adminReason)}</small>`:""}</td><td><div class="actions">${["requested","pending"].includes(r.status)?`<button class="admin-action approve" onclick="approveWithdrawal('${r.id}')">Aprovar</button><button class="admin-action reject" onclick="rejectWithdrawal('${r.id}')">Rejeitar</button>`:""}${["approved","processing"].includes(r.status)?`<button class="admin-action release" onclick="completeWithdrawal('${r.id}')">Marcar transferido</button>`:""}${["requested","pending","approved","processing"].includes(r.status)?`<button class="admin-action edit" onclick="editWithdrawal('${r.id}')">Editar</button>`:""}${!["completed","deleted"].includes(r.status)?`<button class="admin-action delete" onclick="deleteWithdrawal('${r.id}')">Eliminar</button>`:""}</div></td></tr>`}).join("")}</tbody></table></div>`;
}
function approveWithdrawal(id){
  const reqs=getData(WITHDRAWALS_KEY),r=reqs.find(x=>x.id===id);if(!r||!["requested","pending"].includes(r.status))return alert("Este pedido já não está pendente.");
  const f=withdrawalFinancials(r.grossAmount??r.amount),bankNorm=String(r.bank||"").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  r.grossAmount=f.gross;r.amount=f.gross;r.feeRate=WITHDRAWAL_FEE_RATE;r.feeAmount=f.fee;r.netAmount=f.net;r.platformRevenue=f.fee;r.status="approved";r.approvedAt=new Date().toISOString();r.processingTime=bankNorm.includes("BFA")?"Saque aprovado. Processamento em até 24 horas úteis (BFA).":"Saque aprovado. Crédito previsto em 4 a 5 dias úteis após o processamento (BAI ou outro banco).";
  const ns=getData(NOTIFY_KEY);ns.push({sellerId:r.sellerId,title:"Saque aprovado — comissão de 10%",message:`O administrador aprovou o seu saque. Valor bruto: ${formatKz(f.gross)}. Comissão da plataforma (10%): ${formatKz(f.fee)}. Valor líquido que será transferido: ${formatKz(f.net)}. ${r.processingTime}`,createdAt:new Date().toISOString()});setData(WITHDRAWALS_KEY,reqs);setData(NOTIFY_KEY,ns);renderAdmin();
}
function completeWithdrawal(id){
  const reqs=getData(WITHDRAWALS_KEY),r=reqs.find(x=>x.id===id);if(!r||!["approved","processing"].includes(r.status))return alert("Primeiro aprove o pedido de saque.");
  const f=withdrawalFinancials(r.grossAmount??r.amount);r.grossAmount=f.gross;r.amount=f.gross;r.feeRate=WITHDRAWAL_FEE_RATE;r.feeAmount=f.fee;r.netAmount=f.net;r.platformRevenue=f.fee;r.status="completed";r.completedAt=new Date().toISOString();
  const ns=getData(NOTIFY_KEY);ns.push({sellerId:r.sellerId,title:"Saque transferido",message:`A transferência foi concluída. Bruto: ${formatKz(f.gross)}. Comissão da plataforma (10%): ${formatKz(f.fee)}. Valor líquido transferido: ${formatKz(f.net)}.`,createdAt:new Date().toISOString()});setData(WITHDRAWALS_KEY,reqs);setData(NOTIFY_KEY,ns);renderAdmin();
}
function rejectWithdrawal(id){
  const reason=prompt("Explique o motivo da rejeição deste saque:");if(!reason||!reason.trim())return alert("A rejeição precisa de uma explicação.");
  const reqs=getData(WITHDRAWALS_KEY),r=reqs.find(x=>x.id===id);if(!r||!["requested","pending","approved","processing"].includes(r.status))return alert("Este pedido já não pode ser rejeitado.");
  const f=withdrawalFinancials(r.grossAmount??r.amount);r.grossAmount=f.gross;r.amount=f.gross;r.feeAmount=f.fee;r.netAmount=f.net;r.platformRevenue=0;r.status="rejected";r.adminReason=reason.trim();r.rejectedAt=new Date().toISOString();
  const sellers=getData(STORAGE_KEY),seller=sellers.find(s=>s.id===r.sellerId);if(seller)seller.balance=Number(seller.balance||0)+f.gross;
  const ns=getData(NOTIFY_KEY);ns.push({sellerId:r.sellerId,title:"Saque rejeitado",message:`O seu pedido de saque de ${formatKz(f.gross)} foi rejeitado. Motivo: ${r.adminReason}. O valor bruto foi devolvido ao seu saldo e não foi cobrada comissão.`,createdAt:new Date().toISOString()});setData(STORAGE_KEY,sellers);setData(WITHDRAWALS_KEY,reqs);setData(NOTIFY_KEY,ns);renderAdmin();
}
function editWithdrawal(id){
  const reqs=getData(WITHDRAWALS_KEY),r=reqs.find(x=>x.id===id);if(!r)return;
  const old=Number(r.grossAmount??r.amount),newAmount=prompt("Novo valor bruto do saque (mínimo 10.000 Kz):",String(old));if(newAmount===null)return;const amount=Number(newAmount);if(!Number.isFinite(amount)||amount<10000)return alert("O valor mínimo do saque é de 10.000 Kz.");
  const newBank=prompt("Novo nome do banco:",r.bank||"");if(newBank===null||!newBank.trim())return alert("O nome do banco é obrigatório.");const newIban=prompt("Novo IBAN:",r.iban||"");if(newIban===null||!newIban.trim())return alert("O IBAN é obrigatório.");const newHolder=prompt("Novo titular:",r.holder||"");if(newHolder===null||!newHolder.trim())return alert("O titular é obrigatório.");
  const sellers=getData(STORAGE_KEY),seller=sellers.find(s=>s.id===r.sellerId),delta=amount-old;if(seller&&delta>0&&Number(seller.balance||0)<delta)return alert("O vendedor não possui saldo disponível suficiente para aumentar este saque.");if(seller)seller.balance=Number(seller.balance||0)-delta;
  const f=withdrawalFinancials(amount);r.amount=f.gross;r.grossAmount=f.gross;r.feeRate=WITHDRAWAL_FEE_RATE;r.feeAmount=f.fee;r.netAmount=f.net;r.platformRevenue=f.fee;r.bank=newBank.trim();r.iban=newIban.trim();r.holder=newHolder.trim();r.adminEditedAt=new Date().toISOString();const bn=r.bank.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");r.processingTime=bn.includes("BFA")?"Processamento em até 24 horas úteis (BFA).":"Crédito previsto em 4 a 5 dias úteis após o processamento (BAI ou outro banco).";
  setData(STORAGE_KEY,sellers);setData(WITHDRAWALS_KEY,reqs);renderAdmin();
}
function deleteWithdrawal(id){
  if(!confirm("Eliminar este pedido de saque? Se ainda estiver reservado, o valor bruto será devolvido ao saldo do vendedor."))return;const reqs=getData(WITHDRAWALS_KEY),r=reqs.find(x=>x.id===id);if(!r)return;const wasReserved=["requested","pending","approved","processing"].includes(r.status),f=withdrawalFinancials(r.grossAmount??r.amount);if(wasReserved){const sellers=getData(STORAGE_KEY),seller=sellers.find(s=>s.id===r.sellerId);if(seller)seller.balance=Number(seller.balance||0)+f.gross;setData(STORAGE_KEY,sellers)}r.status="deleted";r.platformRevenue=0;r.deletedAt=new Date().toISOString();const ns=getData(NOTIFY_KEY);ns.push({sellerId:r.sellerId,title:"Pedido de saque eliminado",message:`O pedido ${r.id} foi eliminado pelo administrador.${wasReserved?` O valor bruto de ${formatKz(f.gross)} foi devolvido ao saldo e a comissão não foi cobrada.`:""}`,createdAt:new Date().toISOString()});setData(WITHDRAWALS_KEY,reqs);setData(NOTIFY_KEY,ns);renderAdmin();
}

document.getElementById("realPrice").addEventListener("input",updatePricePreview);document.getElementById("promoPrice").addEventListener("input",updatePricePreview);document.getElementById("buyerName").addEventListener("input",validatePurchaseForm);document.getElementById("buyerPhone").addEventListener("input",validatePurchaseForm);document.getElementById("paymentProof").addEventListener("change",showPaymentProof);window.addEventListener("DOMContentLoaded",()=>{migrateData();renderPublicProducts();});
setInterval(()=>{
  if(currentSalesSeller) renderSellerSales();
  if(currentSeller) updateSellerFinance();
},2000);



