/* APSAN — payment.js
   Código extraído do index.html original.
   Ordem das dependências preservada pelo carregamento modular no index.html.
*/

/* ===== Código original: linhas 3881-4041 ===== */
(function(){
  'use strict';
  const V4={payment:null,timer:null,deadline:0};
  const esc4=v=>typeof esc==='function'?esc(v??''):String(v??'');
  const fmt4=v=>typeof fmt==='function'?fmt(v):((Number(v)||0).toLocaleString('pt-PT')+' Kz');
  const date4=v=>typeof datePT==='function'?datePT(v):(v?new Date(v).toLocaleDateString('pt-PT'):'-');

  function stopTimer(){if(V4.timer){clearInterval(V4.timer);V4.timer=null}V4.deadline=0}
  function modal(){let m=document.getElementById('onlinePaymentModal');if(m)return m;m=document.createElement('div');m.id='onlinePaymentModal';document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m)closeOnlinePayment()});return m}
  function clonePurchaseCheckout(){
    const source=document.querySelector('#purchasePage .purchase-shell');
    if(!source)return null;
    const root=source.cloneNode(true);
    const map={
      purchaseProductCard:'onlinePaymentProductCard',purchaseSummary:'onlinePaymentSummary',paymentTimer:'onlinePaymentTimer',timerMessage:'onlinePaymentTimerMessage',paymentCountdown:'onlinePaymentCountdown',
      methodExpress:'onlineMethodExpress',methodBank:'onlineMethodBank',paymentMethod:'onlinePaymentMethod',expressDetails:'onlineExpressDetails',bankDetails:'onlineBankDetails',
      buyerName:'onlineBuyerName',buyerPhone:'onlineBuyerPhone',paymentProof:'onlinePaymentProof',proofName:'onlineProofName',purchaseSubmitBtn:'onlinePaymentSubmitBtn',purchaseForm:'onlinePaymentForm',purchaseProductId:'onlinePaymentContextId'
    };
    root.querySelectorAll('[id]').forEach(el=>{if(map[el.id])el.id=map[el.id]});
    root.querySelectorAll('[for]').forEach(el=>{if(map[el.getAttribute('for')])el.setAttribute('for',map[el.getAttribute('for')])});
    const back=root.querySelector('.back-button');if(back){back.classList.add('online-payment-close');back.setAttribute('onclick','closeOnlinePayment()');back.innerHTML='<i class="fa-solid fa-arrow-left"></i> Voltar';}
    const form=root.querySelector('#onlinePaymentForm');
    if(form){form.setAttribute('onsubmit','submitOnlinePayment(event)')}
    const ex=root.querySelector('#onlineMethodExpress');if(ex){ex.setAttribute('onclick','selectOnlinePaymentMethod(\'Express\')')}
    const bk=root.querySelector('#onlineMethodBank');if(bk){bk.setAttribute('onclick','selectOnlinePaymentMethod(\'Transferência bancária\')')}
    const product=root.querySelector('#onlinePaymentProductCard');
    const oldContext=root.querySelector('#onlinePaymentContextId');
    if(oldContext)oldContext.remove();
    if(product){product.insertAdjacentHTML('beforebegin','<div id="onlinePaymentContext" class="online-payment-context"></div>')}
    const submit=root.querySelector('#onlinePaymentSubmitBtn');if(submit){submit.disabled=true;submit.style.marginTop='18px'}
    return root;
  }
  function buildPaymentModal(){
    const m=modal();
    const shell=clonePurchaseCheckout();
    if(!shell)return null;
    m.innerHTML='';
    const wrap=document.createElement('div');wrap.className='online-payment-shell';wrap.appendChild(shell);m.appendChild(wrap);
    return m;
  }
  function resetOnlinePayment(){
    stopTimer();
    const ids=['onlinePaymentTimer','onlinePaymentCountdown','onlinePaymentTimerMessage','onlinePaymentMethod','onlineMethodExpress','onlineMethodBank','onlineExpressDetails','onlineBankDetails','onlinePaymentSubmitBtn','onlineProofName'];
    const q=id=>document.getElementById(id);
    q('onlinePaymentTimer')?.classList.remove('visible','expired');
    if(q('onlinePaymentCountdown'))q('onlinePaymentCountdown').textContent='45:00';
    q('onlinePaymentTimerMessage')?.classList.remove('visible');
    if(q('onlinePaymentMethod'))q('onlinePaymentMethod').value='';
    q('onlineMethodExpress')?.classList.remove('active');q('onlineMethodBank')?.classList.remove('active');
    q('onlineExpressDetails')?.classList.remove('visible');q('onlineBankDetails')?.classList.remove('visible');
    if(q('onlinePaymentSubmitBtn'))q('onlinePaymentSubmitBtn').disabled=true;
    if(q('onlineProofName'))q('onlineProofName').textContent='';
  }
  function validateOnlinePayment(){
    const method=document.getElementById('onlinePaymentMethod')?.value||'',proof=document.getElementById('onlinePaymentProof')?.files?.[0],name=(document.getElementById('onlineBuyerName')?.value||'').trim(),phone=(document.getElementById('onlineBuyerPhone')?.value||'').trim();
    const valid=!!method&&!!proof&&name.length>=3&&/^\+?[0-9\s()-]{9,20}$/.test(phone)&&V4.deadline>Date.now();
    const b=document.getElementById('onlinePaymentSubmitBtn');if(b)b.disabled=!valid;return valid;
  }
  function updateTimer(){
    const left=Math.max(0,V4.deadline-Date.now()),sec=Math.floor(left/1000),mm=String(Math.floor(sec/60)).padStart(2,'0'),ss=String(sec%60).padStart(2,'0');
    const count=document.getElementById('onlinePaymentCountdown');if(count)count.textContent=mm+':'+ss;
    if(left<=0){stopTimer();document.getElementById('onlinePaymentTimer')?.classList.add('expired');document.getElementById('onlinePaymentTimerMessage')?.classList.add('visible');const b=document.getElementById('onlinePaymentSubmitBtn');if(b)b.disabled=true}
  }
  window.selectOnlinePaymentMethod=function(method){
    const m=document.getElementById('onlinePaymentMethod');if(m)m.value=method;
    document.getElementById('onlineMethodExpress')?.classList.toggle('active',method==='Express');
    document.getElementById('onlineMethodBank')?.classList.toggle('active',method==='Transferência bancária');
    document.getElementById('onlineExpressDetails')?.classList.toggle('visible',method==='Express');
    document.getElementById('onlineBankDetails')?.classList.toggle('visible',method==='Transferência bancária');
    if(!V4.deadline){V4.deadline=Date.now()+45*60*1000;document.getElementById('onlinePaymentTimer')?.classList.add('visible');V4.timer=setInterval(updateTimer,1000);}
    updateTimer();validateOnlinePayment();
  };
  window.showOnlinePaymentProof=function(e){const f=e.target.files?.[0],n=document.getElementById('onlineProofName');if(n)n.textContent=f?'Ficheiro selecionado: '+f.name:'';validateOnlinePayment()};

  window.openOnlinePaymentCheckout=function(kind,data){
    const m=buildPaymentModal();if(!m)return alert('Não foi possível abrir o formulário de pagamento.');
    V4.payment={kind,...data};resetOnlinePayment();
    const amount=Number(data.amount)||0;
    const context=document.getElementById('onlinePaymentContext');
    if(context)context.innerHTML=`<strong>${esc4(data.title||'Pagamento APSAN')}</strong> · ${esc4(data.subtitle||'')} · <strong>${fmt4(amount)}</strong>`;
    const card=document.getElementById('onlinePaymentProductCard');
    if(card)card.innerHTML=`${data.image?`<img src="${data.image}" alt="" style="width:100%;height:250px;object-fit:cover;border-radius:14px;margin-bottom:18px">`:''}<span class="product-category">AULAS ONLINE</span><h2>${esc4(data.title||'Pagamento')}</h2><p class="checkout-subtitle">${esc4(data.description||'Pagamento através do checkout seguro APSAN.')}</p><div class="checkout-summary"><small>Valor a pagar</small><strong>${fmt4(amount)}</strong>${data.kind==='enrollment'?'<small style="display:block;margin-top:7px;color:#94a3b8">Inclui inscrição + 1ª mensalidade.</small>':''}</div><div class="locked-note"><i class="fa-solid fa-lock"></i> O acesso será atualizado depois da confirmação administrativa do pagamento.</div>`;
    const summary=document.getElementById('onlinePaymentSummary');if(summary)summary.innerHTML=`<small>Total a pagar agora</small><strong>${fmt4(amount)}</strong>`;
    const name=document.getElementById('onlineBuyerName'),phone=document.getElementById('onlineBuyerPhone');if(name)name.value=onUser?.name||'';if(phone)phone.value=onUser?.phone||'';
    const proof=document.getElementById('onlinePaymentProof');if(proof)proof.setAttribute('onchange','showOnlinePaymentProof(event)');
    m.classList.add('show');document.body.classList.add('page-open');document.body.style.overflow='hidden';
  };
  window.closeOnlinePayment=function(){stopTimer();const m=document.getElementById('onlinePaymentModal');if(m)m.classList.remove('show');document.body.classList.remove('page-open');document.body.style.overflow='';V4.payment=null};

  window.submitOnlinePayment=async function(e){
    e.preventDefault();if(!V4.payment)return;
    if(!validateOnlinePayment())return alert('Escolha o método, carregue o comprovativo e confirme os seus dados antes de enviar.');
    if(V4.deadline<=Date.now())return alert('O prazo de 45 minutos terminou.');
    const f=id=>document.getElementById(id),proof=f('onlinePaymentProof')?.files?.[0],method=f('onlinePaymentMethod')?.value,name=f('onlineBuyerName')?.value.trim(),phone=f('onlineBuyerPhone')?.value.trim();
    try{
      const proofData=await saveBase64File(proof?f('onlinePaymentProof'):null,2);
      const d=V4.payment;
      if(d.kind==='enrollment'){
        const o=og(OK.O).find(x=>x.id===d.offerId),t=og(OK.T).find(x=>x.id===o?.teacher),inst=og(OK.IN).find(x=>x.id===o?.institution);if(!o)return alert('Programa indisponível.');
        let pay={id:oid('pay'),type:'enrollment',student:onUser.id,studentName:name,studentPhone:phone,teacher:o.teacher,teacherName:t?.name||'',institution:o.institution||'',institutionName:inst?.name||o.institutionName||'',offer:o.id,offerName:o.name,amount:Number(o.enrollmentFee)+Number(o.monthlyFee),method,proof:proofData,proofName:proof.name,note:f('onlinePaymentForm')?.querySelector('[name="enrollNote"]')?.value?.trim()||'',status:'under_review',createdAt:new Date().toISOString(),paymentDeadline:new Date(V4.deadline).toISOString()};
        let pa=og(OK.P);pa.push(pay);os(OK.P,pa);let ea=og(OK.E);ea.push({id:oid('enroll'),student:onUser.id,studentName:name,teacher:o.teacher,teacherName:t?.name||'',institution:o.institution||'',institutionName:inst?.name||o.institutionName||'',offer:o.id,offerName:o.name,enrollmentFee:o.enrollmentFee,monthlyFee:o.monthlyFee,paymentId:pay.id,status:'under_review',createdAt:new Date().toISOString()});os(OK.E,ea);
        closeOnlinePayment();renderOn();alert('Pagamento enviado. Aguarde a confirmação do administrador. Até lá não terá acesso às aulas/materiais.');
      }else if(d.kind==='monthly'){
        const i=og(OK.I).find(x=>x.id===d.invoiceId);if(!i)return alert('Fatura indisponível.');
        let p={id:oid('pay'),type:'monthly',invoice:i.id,enrollment:i.enrollment,student:onUser.id,studentName:name,studentPhone:phone,teacher:i.teacher,teacherName:i.teacherName,offer:i.offer,offerName:i.offerName,amount:Number(i.amount),method,proof:proofData,proofName:proof.name,status:'under_review',createdAt:new Date().toISOString(),paymentDeadline:new Date(V4.deadline).toISOString()};let pa=og(OK.P);pa.push(p);os(OK.P,pa);i.paymentId=p.id;i.status='under_review';os(OK.I,og(OK.I));closeOnlinePayment();renderOn();alert('Comprovativo enviado para análise. O acesso será regularizado após a confirmação do administrador.');
      }
    }catch(err){alert(err.message||'Não foi possível enviar o pagamento.')}
  };

  /* Substitui os formulários curtos por este checkout único, sem alterar o ciclo financeiro existente. */
  window.startEnrollmentV2=function(id){
    const o=og(OK.O).find(x=>x.id===id);if(!o)return;const t=og(OK.T).find(x=>x.id===o.teacher);openOnlinePaymentCheckout('enrollment',{offerId:o.id,title:'Inscrição em '+o.name,subtitle:t?.name||'Professor particular',description:o.description||'Primeiro pagamento para iniciar a matrícula.',amount:Number(o.enrollmentFee)+Number(o.monthlyFee),image:o.cover||''});
  };
  window.payMonthlyV2=function(id){
    const i=og(OK.I).find(x=>x.id===id);if(!i)return;openOnlinePaymentCheckout('monthly',{invoiceId:i.id,title:'Pagamento mensal · '+i.offerName,subtitle:'Vencimento '+date4(i.dueDate),description:'Regularização da mensalidade através do checkout seguro APSAN.',amount:Number(i.amount),image:(og(OK.O).find(x=>x.id===i.offer)?.cover)||''});
  };

  /* Modal do professor/programa dividido em etapas para não ficar comprido. */
  window.openOfferV2=function(id){
    const o=og(OK.O).find(x=>x.id===id),t=og(OK.T).find(x=>x.id===o?.teacher),inst=og(OK.IN).find(x=>x.id===o?.institution);if(!o||(!t&&!inst))return;
    const already=og(OK.E).some(e=>e.student===onUser.id&&e.offer===id&&['pending_payment','payment_submitted','under_review','active'].includes(e.status));
    const personName=o.ownerType==='institution'?(inst?.name||o.institutionName||'Instituição'):(t?.name||'Professor');
    const photo=t?.photo||'';const cover=o.cover||'';
    onModalBody.innerHTML=`
      <div class="on-offer-tabs">
        <button class="on-offer-tab active" onclick="switchOfferPane('profile',this)">1 · Professor</button>
        <button class="on-offer-tab" onclick="switchOfferPane('program',this)">2 · Programa</button>
        <button class="on-offer-tab" onclick="switchOfferPane('payment',this)">3 · Inscrição</button>
      </div>
      <section id="offerPaneProfile" class="on-offer-pane active">
        <div class="on-v2-card"><div class="on-offer-hero"><div class="on-offer-photo">${photo?`<img src="${photo}" alt="Foto do professor">`:'<i class="fa-solid fa-user-tie"></i>'}</div><div><span class="on-v2-tag info">${o.ownerType==='institution'?'Instituição':'Professor particular'}</span><h2 style="margin:8px 0 5px">${esc4(personName)}</h2><p style="margin:0;color:#64748b">${esc4(t?.sub||'Professor')}</p><p style="color:#475569;line-height:1.55">${esc4(t?.bio||'Sem biografia profissional informada.')}</p></div></div><div class="on-offer-section"><h4>Qualificações / experiência</h4><p>${esc4(t?.qualifications||'Não informado.')}</p></div></div>
        <div class="on-offer-actions"><button class="on-v2-btn" onclick="switchOfferPane('program',document.querySelectorAll('.on-offer-tab')[1])">Continuar para o programa <i class="fa-solid fa-arrow-right"></i></button></div>
      </section>
      <section id="offerPaneProgram" class="on-offer-pane">
        <div class="on-v2-card">${cover?`<div class="on-offer-cover"><img src="${cover}" alt="Capa do programa"></div>`:''}<h2 style="margin-top:0">${esc4(o.name)}</h2><p style="color:#475569;line-height:1.6">${esc4(o.description||'Sem descrição.')}</p><div class="on-offer-price-grid"><div class="on-offer-price-box"><small>Nível</small><strong>${esc4(o.level||'-')}</strong></div><div class="on-offer-price-box"><small>Modalidade</small><strong>${esc4(o.mode||'-')}</strong></div><div class="on-offer-price-box"><small>Aulas/mês</small><strong>${Number(o.monthClasses)||0}</strong></div></div><div class="on-offer-section"><h4>Organização</h4><p>Duração por aula: <strong>${Number(o.duration)||60} min</strong><br>Máximo de alunos: <strong>${Number(o.maxStudents)||'-'}</strong></p></div><div class="on-offer-section"><h4>Regras da turma</h4><div class="on-offer-scroll">${esc4(o.rules||'Sem regras informadas.').replace(/\n/g,'<br>')}</div></div><div class="on-offer-section"><h4>Materiais / recursos</h4><div class="on-offer-scroll">${esc4(o.materials||'Sem materiais descritos.').replace(/\n/g,'<br>')}</div></div></div>
        <div class="on-offer-actions"><button class="on-v2-btn alt" onclick="switchOfferPane('profile',document.querySelectorAll('.on-offer-tab')[0])">Voltar</button><button class="on-v2-btn" onclick="switchOfferPane('payment',document.querySelectorAll('.on-offer-tab')[2])">Ver inscrição e pagamento <i class="fa-solid fa-arrow-right"></i></button></div>
      </section>
      <section id="offerPanePayment" class="on-offer-pane">
        <div class="on-v2-card"><h2>Inscrição e primeiro pagamento</h2><p>O primeiro pagamento é composto por <strong>${fmt4(o.enrollmentFee)}</strong> de inscrição + <strong>${fmt4(o.monthlyFee)}</strong> de 1ª mensalidade.</p><div class="on-offer-price-grid"><div class="on-offer-price-box"><small>Inscrição</small><strong>${fmt4(o.enrollmentFee)}</strong></div><div class="on-offer-price-box"><small>1ª mensalidade</small><strong>${fmt4(o.monthlyFee)}</strong></div><div class="on-offer-price-box"><small>Total agora</small><strong>${fmt4(Number(o.enrollmentFee)+Number(o.monthlyFee))}</strong></div></div>${already?'<div class="on-v2-alert warn">Já existe uma matrícula sua neste programa em análise ou ativa.</div>':'<div class="on-v2-note">Ao clicar em <strong>Inscrever-me</strong>, será aberto o mesmo checkout utilizado no pagamento dos infoprodutos, com Express, transferência bancária, comprovativo e contagem regressiva.</div><button class="on-v2-btn" onclick="startEnrollmentV2(\''+o.id+'\')">Inscrever-me e pagar <i class="fa-solid fa-credit-card"></i></button>'}</div>
        <div class="on-offer-actions"><button class="on-v2-btn alt" onclick="switchOfferPane('program',document.querySelectorAll('.on-offer-tab')[1])">Voltar ao programa</button></div>
      </section>`;
    onModal.classList.add('show');
  };
  window.switchOfferPane=function(name,btn){document.querySelectorAll('.on-offer-pane').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.on-offer-tab').forEach(x=>x.classList.remove('active'));const p=document.getElementById('offerPane'+name.charAt(0).toUpperCase()+name.slice(1));if(p)p.classList.add('active');if(btn)btn.classList.add('active');document.getElementById('onModalBody')?.scrollTo({top:0,behavior:'smooth'});};

  /* Central de administração: imagens e documentos passam a ser visualizáveis no próprio portal. */
  function mediaBlock(label,url,type='image'){if(!url)return '';if(type==='image')return `<div class="ao-field ao-media-field"><small>${esc4(label)}</small><div><img src="${esc4(url)}" alt="${esc4(label)}" style="display:block;max-width:100%;max-height:360px;object-fit:contain;border-radius:14px;border:1px solid #e5e7eb;background:#f8fafc;padding:6px"><a class="on-v2-btn alt" style="display:inline-block;margin-top:8px" href="${esc4(url)}" target="_blank" rel="noopener">Abrir em nova janela</a></div></div>`;return `<div class="ao-field ao-media-field"><small>${esc4(label)}</small><div><a class="on-v2-btn alt" href="${esc4(url)}" target="_blank" rel="noopener">Abrir ficheiro</a></div></div>`}
  window.adminOnlineView=function(type,id){
    const x=findAO(type,id);if(!x)return;let body=aoFields(x,['pass','photo','cover','documents','proof','paymentProofData','releaseFileData']);
    if(x.photo)body+=mediaBlock('Foto de perfil do professor',x.photo,'image');
    if(x.cover)body+=mediaBlock('Capa do programa / curso',x.cover,'image');
    if(x.documents){body+=`<div class="ao-field" style="margin-top:16px"><small>Documentação</small><div>${x.documents.legal?'✓ Documento legal enviado':'— Documento legal'} · ${x.documents.license?'✓ Licença enviada':'— Licença'} · ${x.documents.other?'✓ Documento adicional':'— Adicional'}</div></div>`;body+=mediaBlock('Documento legal',x.documents.legal,'file');body+=mediaBlock('Licença / autorização',x.documents.license,'file');body+=mediaBlock('Documento adicional',x.documents.other,'file')}
    if(x.proof)body+=mediaBlock('Comprovativo de pagamento',x.proof,x.proof.startsWith('data:image')?'image':'file');
    if(x.paymentProofData)body+=mediaBlock('Comprovativo de pagamento',x.paymentProofData,x.paymentProofData.startsWith('data:image')?'image':'file');
    if(x.releaseFileData)body+=mediaBlock('Ficheiro liberado',x.releaseFileData,'file');
    if(type==='teachers'&&x.id){const offers=og(OK.O).filter(o=>o.teacher===x.id);if(offers.length)body+=`<div class="ao-field" style="margin-top:16px"><small>Programas publicados pelo professor</small><div>${offers.map(o=>`<div style="padding:8px 0;border-bottom:1px solid #e5e7eb"><strong>${esc4(o.name)}</strong> · ${statusTag(o.status)}</div>`).join('')}</div></div>`}
    if(type==='students'&&x.photo)body+=mediaBlock('Foto do aluno',x.photo,'image');
    openAOAdminModal('Ficha completa · '+(x.name||x.studentName||x.teacherName||x.offerName||'Registo'),'Dados e conteúdos visuais disponíveis para análise administrativa',body,`<button class="ao-secondary" onclick="closeAOAdminModal()">Fechar</button><button class="ao-primary" onclick="closeAOAdminModal();adminOnlineEdit('${type}','${id}')">Editar dados</button>`);
  };
})();


/* ===== Código original: linhas 4045-4174 ===== */
/* ===== APSAN V5 · PERFIS COM FOTO + ARMAZENAMENTO LOCAL =====
   Todos os ficheiros de perfil/comprovativos continuam a ser convertidos para Data URL
   e gravados no Local Storage. Nenhum upload para servidor externo é usado nesta fase. */
(function(){
  'use strict';
  function byId(id){return document.getElementById(id)}
  function escP(v){return typeof window.esc==='function'?window.esc(v):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function localImage(input,maxMB=2){
    return new Promise((resolve,reject)=>{
      const file=input?.files?.[0];
      if(!file)return resolve('');
      if(!/^image\/(png|jpe?g|webp)$/i.test(file.type))return reject(new Error('A foto deve estar em PNG, JPG/JPEG ou WEBP.'));
      if(file.size>maxMB*1024*1024)return reject(new Error(`A foto deve ter no máximo ${maxMB} MB.`));
      const r=new FileReader();
      r.onload=()=>resolve(r.result);
      r.onerror=()=>reject(new Error('Não foi possível ler a foto.'));
      r.readAsDataURL(file);
    });
  }
  function profilePhotoBlock(photo,label,id){
    return `<div class="apsan-profile-photo-editor on-full">
      <div class="apsan-photo-preview" id="${id}Preview">${photo?`<img src="${escP(photo)}" alt="${escP(label)}">`:'<i class="fa-solid fa-user"></i>'}</div>
      <div class="apsan-photo-copy"><strong>${escP(label)}</strong><small>PNG, JPG/JPEG ou WEBP · máximo 2 MB · guardada localmente no navegador.</small>
      <input id="${id}" type="file" accept="image/png,image/jpeg,image/webp" onchange="apsanPreviewLocalPhoto(event,'${id}Preview')">
      ${photo?`<button type="button" class="on-v2-btn alt apsan-remove-photo" onclick="apsanRemoveLocalPhoto('${id}Preview','${id}')">Remover foto</button>`:''}</div>
    </div>`;
  }
  window.apsanPreviewLocalPhoto=function(e,previewId){
    const f=e?.target?.files?.[0],p=byId(previewId);if(!f||!p)return;
    if(!/^image\/(png|jpe?g|webp)$/i.test(f.type)||f.size>2*1024*1024){alert('Escolha uma imagem PNG, JPG/JPEG ou WEBP de até 2 MB.');e.target.value='';return;}
    const r=new FileReader();r.onload=()=>{p.innerHTML=`<img src="${escP(r.result)}" alt="Pré-visualização">`};r.readAsDataURL(f);
  };
  window.apsanRemoveLocalPhoto=function(previewId,inputId){
    const p=byId(previewId),i=byId(inputId);if(p)p.innerHTML='<i class="fa-solid fa-user"></i>';if(i)i.value='';p?.setAttribute('data-remove','1');
  };

  /* Professor particular */
  window.renderTeacherProfile=function(){
    const b=window.profileBox||byId('profileBox');if(!b||!window.onUser)return;
    const u=window.onUser;
    b.innerHTML=`<div class="on-v2-card"><h3>Perfil profissional</h3><form class="on-form" onsubmit="saveProfileV2(event)">
      ${profilePhotoBlock(u.photo||'','Foto de perfil','pPhoto')}
      <div><label>Nome completo</label><input id="pName" required value="${escP(u.name)}"></div>
      <div><label>Telefone</label><input id="pPhone" required value="${escP(u.phone)}"></div>
      <div><label>E-mail</label><input id="pEmail" type="email" value="${escP(u.email||'')}"></div>
      <div><label>Especialidade</label><input id="pSub" value="${escP(u.sub||'')}"></div>
      <div class="on-full"><label>Biografia profissional</label><textarea id="pBio">${escP(u.bio||'')}</textarea></div>
      <div class="on-full"><label>Qualificações / experiência</label><textarea id="pQual">${escP(u.qualifications||'')}</textarea></div>
      <button class="on-btn on-full">Guardar perfil</button></form></div>`;
  };
  window.saveProfileV2=async function(e){
    e.preventDefault();const a=typeof og==='function'?og(OK.T):[];const u=a.find(x=>x.id===window.onUser.id);if(!u)return;
    Object.assign(u,{name:byId('pName').value.trim(),phone:byId('pPhone').value.trim(),email:byId('pEmail').value.trim(),sub:byId('pSub').value.trim(),bio:byId('pBio').value.trim(),qualifications:byId('pQual').value.trim()});
    try{if(byId('pPhoto')?.files?.[0])u.photo=await localImage(byId('pPhoto'));else if(byId('pPhoto')?.closest('.apsan-profile-photo-editor')?.querySelector('.apsan-photo-preview')?.dataset.remove==='1')u.photo='';}
    catch(err){return alert(err.message)}
    os(OK.T,a);window.onUser=u;if(byId('onUser'))byId('onUser').textContent=u.name;alert('Perfil atualizado e foto guardada no Local Storage.');renderOn();
  };

  /* Aluno particular + aluno institucional */
  window.renderStudentProfile=function(){
    const b=window.profileBox||byId('profileBox');if(!b||!window.onUser)return;
    const u=window.onUser;
    b.innerHTML=`<div class="on-v2-card"><h3>Meu perfil</h3><form class="on-form" onsubmit="saveStudentProfile(event)">
      ${profilePhotoBlock(u.photo||'','Foto de perfil','pPhoto')}
      <div><label>Nome</label><input id="pName" required value="${escP(u.name)}"></div>
      <div><label>Telefone</label><input id="pPhone" required value="${escP(u.phone)}"></div>
      <div><label>E-mail</label><input id="pEmail" type="email" value="${escP(u.email||'')}"></div>
      <div class="on-full"><label>Objetivos de aprendizagem</label><textarea id="pBio">${escP(u.bio||'')}</textarea></div>
      <button class="on-btn on-full">Guardar perfil</button></form></div>`;
  };
  window.saveStudentProfile=function(e){
    e.preventDefault();const a=typeof og==='function'?og(OK.S):[];const u=a.find(x=>x.id===window.onUser.id);if(!u)return;
    const finish=()=>{Object.assign(u,{name:byId('pName').value.trim(),phone:byId('pPhone').value.trim(),email:byId('pEmail').value.trim(),bio:byId('pBio').value.trim()});os(OK.S,a);window.onUser=u;if(byId('onUser'))byId('onUser').textContent=u.name;alert('Perfil atualizado e foto guardada no Local Storage.');renderOn()};
    if(byId('pPhoto')?.files?.[0])localImage(byId('pPhoto')).then(img=>{u.photo=img;finish()}).catch(err=>alert(err.message));
    else {const pv=byId('pPhoto')?.closest('.apsan-profile-photo-editor')?.querySelector('.apsan-photo-preview');if(pv?.dataset.remove==='1')u.photo='';finish();}
  };

  /* Professor institucional */
  window.renderInstitutionTeacherProfile=function(){
    const b=byId('profileBox');if(!b||!window.onUser)return;const u=window.onUser;
    b.innerHTML=`<div class="on-v2-card"><h3>Perfil do professor institucional</h3><form class="on-form" onsubmit="saveInstitutionTeacherProfile(event)">
      ${profilePhotoBlock(u.photo||'','Foto de perfil','itpPhoto')}
      <div><label>Nome</label><input id="itpName" required value="${escP(u.name)}"></div><div><label>Telefone</label><input id="itpPhone" required value="${escP(u.phone)}"></div>
      <div><label>E-mail</label><input id="itpEmail" type="email" value="${escP(u.email||'')}"></div><div><label>Disciplina / especialidade</label><input id="itpSub" value="${escP(u.sub||'')}"></div>
      <div class="on-full"><label>Biografia / experiência</label><textarea id="itpBio">${escP(u.bio||'')}</textarea></div><div class="on-full"><label>Qualificações</label><textarea id="itpQual">${escP(u.qualifications||'')}</textarea></div>
      <button class="on-btn on-full">Guardar perfil</button></form></div>`;
  };
  window.saveInstitutionTeacherProfile=async function(e){
    e.preventDefault();const a=og(OK.T),u=a.find(x=>x.id===window.onUser.id);if(!u)return;
    Object.assign(u,{name:byId('itpName').value.trim(),phone:byId('itpPhone').value.trim(),email:byId('itpEmail').value.trim(),sub:byId('itpSub').value.trim(),bio:byId('itpBio').value.trim(),qualifications:byId('itpQual').value.trim()});
    try{if(byId('itpPhoto')?.files?.[0])u.photo=await localImage(byId('itpPhoto'));else if(byId('itpPhoto')?.closest('.apsan-profile-photo-editor')?.querySelector('.apsan-photo-preview')?.dataset.remove==='1')u.photo='';}catch(err){return alert(err.message)}
    os(OK.T,a);window.onUser=u;if(byId('onUser'))byId('onUser').textContent=u.name;alert('Perfil atualizado e foto guardada no Local Storage.');renderOn();
  };

  /* Direção da instituição — foto institucional */
  window.renderInstitutionProfile=function(){
    const b=byId('institutionProfileBox');if(!b||!window.onUser)return;const u=window.onUser,d=u.documents||{};
    b.innerHTML=`<div class="on-v2-card"><h3>Perfil e documentação da instituição</h3><form class="on-form" onsubmit="apsanSaveInstitutionProfile(event)">
      ${profilePhotoBlock(u.photo||'','Foto de perfil / logótipo da instituição','instPhoto')}
      <div><label>Nome público</label><input id="instProfileName" value="${escP(u.name||'')}" required></div><div><label>Telefone</label><input id="instProfilePhone" value="${escP(u.phone||'')}" required></div>
      <div><label>E-mail</label><input id="instProfileEmail" type="email" value="${escP(u.email||'')}"></div><div><label>Representante legal</label><input id="instProfileRep" value="${escP(u.representative||'')}"></div>
      <div class="on-full"><label>Morada / endereço</label><input id="instProfileAddress" value="${escP(u.address||'')}"></div>
      <div class="on-full"><label>Descrição da instituição</label><textarea id="instProfileBio">${escP(u.bio||u.description||'')}</textarea></div>
      <div class="on-full"><div class="on-v2-note"><strong>Estado:</strong> ${typeof statusTag==='function'?statusTag(u.status):escP(u.status||'-')} · <strong>NIF:</strong> ${escP(u.nif||'-')} · <strong>Tipo:</strong> ${escP(u.type||'-')} · <strong>Regime:</strong> ${escP(u.regime||'-')}</div></div>
      <button class="on-btn on-full">Guardar perfil da instituição</button></form>
      <div class="on-v2-card" style="margin-top:14px"><h4>Documentação</h4><p>Documento legal: ${d.legal?'Enviado':'Não enviado'} · Licença: ${d.license?'Enviada':'Não enviada'} · Adicional: ${d.other?'Enviado':'Não enviado'}</p><p><strong>Recebimentos:</strong> ${escP(u.bank||'-')} · ${escP(u.iban||u.express||'-')} · ${escP(u.holder||'-')}</p></div></div>`;
  };
  window.apsanSaveInstitutionProfile=async function(e){
    e.preventDefault();const a=og(OK.IN),u=a.find(x=>x.id===window.onUser.id);if(!u)return;
    Object.assign(u,{name:byId('instProfileName').value.trim(),phone:byId('instProfilePhone').value.trim(),email:byId('instProfileEmail').value.trim(),representative:byId('instProfileRep').value.trim(),address:byId('instProfileAddress').value.trim(),bio:byId('instProfileBio').value.trim()});
    try{if(byId('instPhoto')?.files?.[0])u.photo=await localImage(byId('instPhoto'));else if(byId('instPhoto')?.closest('.apsan-profile-photo-editor')?.querySelector('.apsan-photo-preview')?.dataset.remove==='1')u.photo='';}catch(err){return alert(err.message)}
    os(OK.IN,a);window.onUser=u;alert('Perfil da instituição atualizado e foto guardada no Local Storage.');renderOn();
  };

  /* Pré-visualização das fotos na administração e edição administrativa */
  function addAdminVisualThumbs(){
    const box=byId('adminOnlineTab');if(!box)return;
    box.querySelectorAll('tbody tr').forEach(tr=>{
      const first=tr.querySelector('td');if(!first||first.querySelector('.apsan-admin-thumb'))return;
      const txt=first.textContent||'';const idm=txt.match(/ID:\s*([^\s]+)/);if(!idm)return;const id=idm[1];
      let type='';const headers=[...box.querySelectorAll('table')];
      const table=tr.closest('table');const head=table?.querySelector('thead');const title=head?.closest('.admin-card')?.querySelector('h3')?.textContent||'';
      if(/Professores/i.test(title))type='teachers';else if(/Alunos/i.test(title))type='students';else if(/Institui/i.test(title))type='institutions';else return;
      const arr=type==='teachers'?og(OK.T):type==='students'?og(OK.S):og(OK.IN);const x=arr.find(v=>v.id===id);if(!x?.photo)return;
      const img=document.createElement('img');img.className='apsan-admin-thumb';img.src=x.photo;img.alt='Foto';first.prepend(img);
    });
  }
  setInterval(addAdminVisualThumbs,1200);
})();

/* ===== Código original: linhas 4186-4318 ===== */
/* APSAN V6 — PERFIS LIGADOS À CONTA + COMPROVATIVOS LOCAIS
   Nesta fase experimental, os ficheiros são lidos pelo navegador como Data URL
   e gravados nos registos do Local Storage. Não existe upload para Firebase. */
(function(){
  'use strict';
  const byId=id=>document.getElementById(id);
  const escV=v=>typeof window.esc==='function'?window.esc(v??''):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const arrV=k=>typeof og==='function'?og(k):[];
  const putV=(k,v)=>typeof os==='function'?os(k,v):null;
  const localFile=input=>new Promise((resolve,reject)=>{
    const f=input?.files?.[0]; if(!f)return resolve('');
    if(f.size>2*1024*1024)return reject(new Error('O ficheiro deve ter no máximo 2 MB.'));
    const r=new FileReader(); r.onload=()=>resolve(r.result); r.onerror=()=>reject(new Error('Não foi possível ler o ficheiro no navegador.')); r.readAsDataURL(f);
  });
  function photoBlock(photo,label,id){
    return `<div class="apsan-profile-photo-editor on-full">
      <div class="apsan-photo-preview" id="${id}Preview">${photo?`<img src="${escV(photo)}" alt="${escV(label)}">`:'<i class="fa-solid fa-user"></i>'}</div>
      <div class="apsan-photo-copy"><strong>${escV(label)}</strong><small>PNG, JPG/JPEG ou WEBP · máximo 2 MB · guardada no Local Storage deste navegador.</small>
      <label class="on-v2-btn alt" style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;width:max-content;margin-top:4px"><i class="fa-solid fa-image"></i> Escolher foto<input id="${id}" type="file" accept="image/png,image/jpeg,image/webp" style="display:none" onchange="apsanV6Preview(event,'${id}Preview')"></label>
      ${photo?`<button type="button" class="on-v2-btn alt apsan-remove-photo" onclick="apsanV6Remove('${id}Preview','${id}')">Remover foto</button>`:''}</div>
    </div>`;
  }
  window.apsanV6Preview=function(e,pid){
    const f=e?.target?.files?.[0],p=byId(pid); if(!f||!p)return;
    if(!/^image\/(png|jpe?g|webp)$/i.test(f.type)||f.size>2*1024*1024){alert('Escolha uma imagem PNG, JPG/JPEG ou WEBP de até 2 MB.');e.target.value='';return;}
    const r=new FileReader();r.onload=()=>{p.innerHTML=`<img src="${escV(r.result)}" alt="Pré-visualização">`;p.dataset.remove='0'};r.readAsDataURL(f);
  };
  window.apsanV6Remove=function(pid,iid){const p=byId(pid),i=byId(iid);if(p){p.innerHTML='<i class="fa-solid fa-user"></i>';p.dataset.remove='1'}if(i)i.value='';};
  function localProofBlock(){
    return `<div class="v6-local-proof-note"><i class="fa-solid fa-hard-drive"></i><span><strong>Armazenamento local</strong><small>O comprovativo é guardado diretamente no Local Storage deste navegador nesta fase de testes. Nenhum envio para Firebase é feito.</small></span></div>`;
  }
  function savePhoto(a,u,inputId){return localFile(byId(inputId)).then(v=>{if(v)u.photo=v;else {const p=byId(inputId)?.closest('.apsan-profile-photo-editor')?.querySelector('.apsan-photo-preview');if(p?.dataset.remove==='1')u.photo='';}return u});}

  /* =========================================================
     SINCRONIZAÇÃO DO PERFIL COM A CONTA REAL
     ========================================================= */
  function findStoredAccount(){
    if(!window.onUser)return null;
    const current=window.onUser;
    const identifiers=[current.id,current.email,current.phone].filter(Boolean).map(v=>String(v).trim().toLowerCase());
    for(const key of [OK.S,OK.T,OK.IN]){
      const list=arrV(key);
      const found=list.find(x=>identifiers.some(id=>[x.id,x.email,x.phone].filter(Boolean).some(v=>String(v).trim().toLowerCase()===id)));
      if(found)return {key,list,user:found};
    }
    return null;
  }
  function syncCurrentAccountV7(){
    if(!window.onUser)return null;
    const found=findStoredAccount();
    if(!found)return window.onUser;
    window.onUser=found.user;
    const label=byId('onUser');
    if(label)label.textContent=window.onUser.legalName||window.onUser.name||'';
    return window.onUser;
  }
  window.syncCurrentAccountV7=syncCurrentAccountV7;
  function storedUser(){return syncCurrentAccountV7()||window.onUser||{}}

  /* =========================================================
     ALUNO PARTICULAR / INSTITUCIONAL
     ========================================================= */
  function renderPrivateStudentProfile(){
    const b=byId('profileBox');
    if(!b||!window.onUser)return;
    const u=storedUser();
    const institution=u.studentType==='institution';
    const inst=institution?arrV(OK.IN).find(x=>x.id===u.institution):null;
    b.innerHTML=`<div class="on-v2-card"><h3>${institution?'Meu perfil institucional':'Meu perfil'}</h3><p class="on-v2-note">Estes dados são os mesmos da sua conta. Ao abrir este perfil, os dados usados na criação da conta são carregados automaticamente. Pode alterar apenas o que quiser e guardar as alterações.</p>
      ${photoBlock(u.photo||'','Foto de perfil','v6StudentPhoto')}
      <form class="on-form" onsubmit="apsanV6SaveStudent(event)">
      <div><label>Nome completo</label><input id="v6StudentName" required autocomplete="name" value="${escV(u.name||'')}"></div>
      <div><label>Telefone</label><input id="v6StudentPhone" required autocomplete="tel" value="${escV(u.phone||'')}"></div>
      <div><label>E-mail</label><input id="v6StudentEmail" type="email" autocomplete="email" value="${escV(u.email||'')}"></div>
      ${institution?`<div class="on-full"><label>Instituição associada</label><input value="${escV(inst?.legalName||inst?.name||u.institutionName||'-')}" readonly></div><div><label>Código da instituição</label><input value="${escV(u.institutionCode||'-')}" readonly></div>`:''}
      <div class="on-full"><label>${institution?'Objetivos / observações':'Objetivos de aprendizagem'}</label><textarea id="v6StudentBio">${escV(u.bio||'')}</textarea></div>
      <button class="on-btn on-full" type="submit"><i class="fa-solid fa-floppy-disk"></i> Guardar perfil</button></form>${institution?'':localProofBlock()}</div>`;
  }
  window.apsanV6SaveStudent=function(e){
    e.preventDefault();
    const u=storedUser();
    if(!u?.id)return alert('Não foi possível identificar a conta do aluno.');
    const list=arrV(OK.S),index=list.findIndex(x=>x.id===u.id);
    if(index<0)return alert('A conta do aluno não foi encontrada no armazenamento local.');
    Object.assign(list[index],{name:byId('v6StudentName')?.value.trim()||'',phone:byId('v6StudentPhone')?.value.trim()||'',email:byId('v6StudentEmail')?.value.trim()||'',bio:byId('v6StudentBio')?.value.trim()||''});
    if(!list[index].name||!list[index].phone)return alert('Nome e telefone são obrigatórios.');
    savePhoto(list[index],list[index],'v6StudentPhoto').then(()=>{putV(OK.S,list);window.onUser=list[index];if(byId('onUser'))byId('onUser').textContent=list[index].name||'';alert('Perfil atualizado com sucesso. Os dados foram guardados na conta e a foto permanece no Local Storage.');if(typeof renderOn==='function')renderOn();}).catch(err=>alert(err.message));
  };

  /* =========================================================
     PROFESSOR PARTICULAR / INSTITUCIONAL
     ========================================================= */
  function renderTeacherProfileV6(){
    const b=byId('profileBox');if(!b||!window.onUser)return;
    const u=storedUser();
    b.innerHTML=`<div class="on-v2-card"><h3>Perfil profissional</h3><p class="on-v2-note">Os dados usados na criação da conta são carregados automaticamente. Edite apenas o que precisar e guarde.</p>${photoBlock(u.photo||'','Foto de perfil','v6TeacherPhoto')}<form class="on-form" onsubmit="apsanV6SaveTeacher(event)">
      <div><label>Nome completo</label><input id="v6TeacherName" required autocomplete="name" value="${escV(u.name||'')}"></div><div><label>Telefone</label><input id="v6TeacherPhone" required autocomplete="tel" value="${escV(u.phone||'')}"></div><div><label>E-mail</label><input id="v6TeacherEmail" type="email" autocomplete="email" value="${escV(u.email||'')}"></div><div><label>Disciplina / especialidade</label><input id="v6TeacherSub" value="${escV(u.sub||'')}"></div><div class="on-full"><label>Biografia profissional</label><textarea id="v6TeacherBio">${escV(u.bio||'')}</textarea></div><div class="on-full"><label>Qualificações / experiência</label><textarea id="v6TeacherQual">${escV(u.qualifications||'')}</textarea></div>${u.teacherType==='institution'?`<div class="on-full"><label>Instituição associada</label><input value="${escV(u.institutionName||'-')}" readonly></div>`:''}<button class="on-btn on-full" type="submit"><i class="fa-solid fa-floppy-disk"></i> Guardar perfil</button></form></div>`;
  }
  window.apsanV6SaveTeacher=function(e){
    e.preventDefault();const u=storedUser();if(!u?.id)return alert('Não foi possível identificar a conta do professor.');
    const list=arrV(OK.T),index=list.findIndex(x=>x.id===u.id);if(index<0)return alert('A conta do professor não foi encontrada no armazenamento local.');
    Object.assign(list[index],{name:byId('v6TeacherName')?.value.trim()||'',phone:byId('v6TeacherPhone')?.value.trim()||'',email:byId('v6TeacherEmail')?.value.trim()||'',sub:byId('v6TeacherSub')?.value.trim()||'',bio:byId('v6TeacherBio')?.value.trim()||'',qualifications:byId('v6TeacherQual')?.value.trim()||''});
    if(!list[index].name||!list[index].phone)return alert('Nome e telefone são obrigatórios.');
    savePhoto(list[index],list[index],'v6TeacherPhoto').then(()=>{putV(OK.T,list);window.onUser=list[index];if(byId('onUser'))byId('onUser').textContent=list[index].name||'';alert('Perfil do professor atualizado com sucesso.');if(typeof renderOn==='function')renderOn();}).catch(err=>alert(err.message));
  };
  window.renderTeacherProfile=renderTeacherProfileV6;

  function renderInstitutionTeacherProfileV6(){
    const b=byId('ontprofile2')||byId('profileBox');if(!b||!window.onUser)return;const u=storedUser(),inst=arrV(OK.IN).find(x=>x.id===u.institution);
    b.innerHTML=`<div class="on-v2-card"><h3>Perfil do professor institucional</h3><p class="on-v2-note">Os dados apresentados são os mesmos da conta criada. Pode atualizar o perfil sem perder o vínculo institucional.</p>${photoBlock(u.photo||'','Foto de perfil','v6ITPhoto')}<form class="on-form" onsubmit="apsanV6SaveInstitutionTeacher(event)">
      <div><label>Nome completo</label><input id="v6ITName" required autocomplete="name" value="${escV(u.name||'')}"></div><div><label>Telefone</label><input id="v6ITPhone" required autocomplete="tel" value="${escV(u.phone||'')}"></div><div><label>E-mail</label><input id="v6ITEmail" type="email" autocomplete="email" value="${escV(u.email||'')}"></div><div><label>Disciplina / especialidade</label><input id="v6ITSub" value="${escV(u.sub||'')}"></div><div class="on-full"><label>Instituição associada</label><input value="${escV(inst?.legalName||inst?.name||u.institutionName||'-')}" readonly></div><div class="on-full"><label>Biografia / experiência</label><textarea id="v6ITBio">${escV(u.bio||'')}</textarea></div><div class="on-full"><label>Qualificações</label><textarea id="v6ITQual">${escV(u.qualifications||'')}</textarea></div><button class="on-btn on-full" type="submit"><i class="fa-solid fa-floppy-disk"></i> Guardar perfil</button></form></div>`;
  }
  window.apsanV6SaveInstitutionTeacher=function(e){
    e.preventDefault();const u=storedUser();if(!u?.id)return alert('Não foi possível identificar a conta do professor.');const list=arrV(OK.T),index=list.findIndex(x=>x.id===u.id);if(index<0)return alert('A conta do professor não foi encontrada.');
    Object.assign(list[index],{name:byId('v6ITName')?.value.trim()||'',phone:byId('v6ITPhone')?.value.trim()||'',email:byId('v6ITEmail')?.value.trim()||'',sub:byId('v6ITSub')?.value.trim()||'',bio:byId('v6ITBio')?.value.trim()||'',qualifications:byId('v6ITQual')?.value.trim()||''});
    if(!list[index].name||!list[index].phone)return alert('Nome e telefone são obrigatórios.');
    savePhoto(list[index],list[index],'v6ITPhoto').then(()=>{putV(OK.T,list);window.onUser=list[index];if(byId('onUser'))byId('onUser').textContent=list[index].name||'';alert('Perfil atualizado com sucesso.');if(typeof renderOn==='function')renderOn();}).catch(err=>alert(err.message));
  };

  /* =========================================================
     INSTITUIÇÃO
     ========================================================= */
  function renderInstitutionProfileV6(){
    const b=byId('institutionProfileBox');if(!b||!window.onUser)return;const u=storedUser(),d=u.documents||{};
    b.innerHTML=`<div class="on-v2-card"><h3>Perfil da instituição</h3><p class="on-v2-note">Estes são os dados usados na criação da conta da instituição. Os campos editáveis são preenchidos automaticamente.</p>${photoBlock(u.photo||'','Foto de perfil / logótipo','v6InstPhoto')}<form class="on-form" onsubmit="apsanV6SaveInstitution(event)">
      <div><label>Nome legal</label><input id="v6InstLegalName" value="${escV(u.legalName||u.name||'')}" required></div><div><label>Nome público</label><input id="v6InstName" value="${escV(u.name||u.legalName||'')}" required></div><div><label>NIF</label><input id="v6InstNif" value="${escV(u.nif||'')}" readonly></div><div><label>Tipo</label><input id="v6InstType" value="${escV(u.type||'')}" readonly></div><div><label>Regime</label><input id="v6InstRegime" value="${escV(u.regime||'')}" readonly></div><div><label>Telefone</label><input id="v6InstPhone" value="${escV(u.phone||'')}" required></div><div><label>E-mail</label><input id="v6InstEmail" type="email" value="${escV(u.email||'')}"></div><div><label>Representante legal</label><input id="v6InstRep" value="${escV(u.representative||'')}" required></div><div class="on-full"><label>Morada / localização</label><input id="v6InstAddress" value="${escV(u.address||'')}" required></div><div class="on-full"><label>Descrição</label><textarea id="v6InstBio">${escV(u.bio||u.description||'')}</textarea></div><div class="on-full"><div class="on-v2-note"><strong>Estado:</strong> ${typeof statusTag==='function'?statusTag(u.status):escV(u.status||'-')} · NIF e dados de classificação permanecem vinculados ao registo.</div></div><button class="on-btn on-full" type="submit"><i class="fa-solid fa-floppy-disk"></i> Guardar perfil da instituição</button></form><div class="on-v2-card" style="margin-top:14px"><h4>Documentação já registada</h4><p>Documento legal: ${d.legal?'Enviado':'Não enviado'} · Licença: ${d.license?'Enviada':'Não enviada'} · Adicional: ${d.other?'Enviado':'Não enviado'}</p><p><strong>Recebimentos:</strong> ${escV(u.bank||'-')} · ${escV(u.iban||u.express||'-')} · ${escV(u.holder||'-')}</p></div></div>`;
  }
  window.apsanV6SaveInstitution=function(e){
    e.preventDefault();const u=storedUser();if(!u?.id)return alert('Não foi possível identificar a instituição.');const list=arrV(OK.IN),index=list.findIndex(x=>x.id===u.id);if(index<0)return alert('A conta da instituição não foi encontrada.');
    Object.assign(list[index],{legalName:byId('v6InstLegalName')?.value.trim()||'',name:byId('v6InstName')?.value.trim()||'',phone:byId('v6InstPhone')?.value.trim()||'',email:byId('v6InstEmail')?.value.trim()||'',representative:byId('v6InstRep')?.value.trim()||'',address:byId('v6InstAddress')?.value.trim()||'',bio:byId('v6InstBio')?.value.trim()||''});
    if(!list[index].name||!list[index].phone||!list[index].representative)return alert('Nome, telefone e representante legal são obrigatórios.');
    savePhoto(list[index],list[index],'v6InstPhoto').then(()=>{putV(OK.IN,list);window.onUser=list[index];if(byId('onUser'))byId('onUser').textContent=list[index].legalName||list[index].name||'';alert('Perfil da instituição atualizado com sucesso.');if(typeof renderOn==='function')renderOn();}).catch(err=>alert(err.message));
  };

  /* Liga o editor ao perfil real da conta em todos os portais. */
  const oldTab=window.onTab;
  window.onTab=function(t,b){
    if(typeof oldTab==='function')oldTab(t,b);
    if(!window.onUser)return;
    setTimeout(()=>{
      if(onRole==='student' && onInstitutionMode==='student' && t==='profile')renderInstitutionStudentProfile();
      else if(onRole==='teacher' && onInstitutionMode==='teacher' && t==='tprofile2')renderInstitutionTeacherProfileV6();
      else if(onRole==='institution' && t==='instprofile')renderInstitutionProfileV6();
      else if(onRole==='student' && t==='profile')renderPrivateStudentProfile();
    },0);
  };

  /* Reaplica os perfis certos também depois de renderOn(). */
  const oldRenderOn=window.renderOn;
  window.renderOn=function(){
    if(typeof oldRenderOn==='function')oldRenderOn();
    if(!window.onUser)return;
    setTimeout(()=>{
      if(onRole==='student' && onInstitutionMode==='student')renderInstitutionStudentProfile();
      else if(onRole==='teacher' && onInstitutionMode==='teacher')renderInstitutionTeacherProfileV6();
      else if(onRole==='institution')renderInstitutionProfileV6();
      else if(onRole==='student')renderPrivateStudentProfile();
    },0);
  };

  /* Garante que o checkout local continue a mostrar explicitamente o armazenamento local. */
  const oldShowProof=window.showOnlinePaymentProof;
  window.showOnlinePaymentProof=function(e){
    if(typeof oldShowProof==='function')oldShowProof(e);
    const f=e?.target?.files?.[0],n=byId('onlineProofName');
    if(n&&f)n.innerHTML=`<span><i class="fa-solid fa-file-circle-check"></i> ${escV(f.name)} · será guardado no Local Storage</span>`;
  };
  const oldShowPurchaseProof=window.showPaymentProof;
  window.showPaymentProof=function(e){
    if(typeof oldShowPurchaseProof==='function')oldShowPurchaseProof(e);
    const f=e?.target?.files?.[0],n=byId('proofName'),title=byId('paymentProofTitle'),zone=byId('paymentProofZone');
    if(n&&f)n.innerHTML=`<span><i class="fa-solid fa-file-circle-check"></i> ${escV(f.name)} · pronto para enviar</span>`;
    if(title&&f)title.textContent='Comprovativo selecionado';
    if(zone&&f){zone.classList.remove('file-error');zone.classList.add('has-file');}
    if(typeof window.validatePurchaseForm==='function')window.validatePurchaseForm();
  };
})();


/* ===== Código original: linhas 4390-4471 ===== */
(function(){
  'use strict';
  const ADMIN_PROFILE_PHOTO_KEY='apsan_admin_profile_photo';

  function byId(id){return document.getElementById(id)}

  function renderAdminProfilePhoto(){
    const avatar=byId('adminProfileAvatarBtn');
    const img=byId('adminProfileAvatarImg');
    const icon=byId('adminProfileAvatarIcon');
    if(!avatar||!img||!icon)return;
    let photo='';
    try{photo=localStorage.getItem(ADMIN_PROFILE_PHOTO_KEY)||''}catch(e){}
    if(photo){
      img.src=photo;
      img.style.display='block';
      avatar.classList.add('has-photo');
      icon.style.display='none';
    }else{
      img.removeAttribute('src');
      img.style.display='none';
      avatar.classList.remove('has-photo');
      icon.style.display='block';
    }
  }

  window.apsanAdminProfilePhotoChange=function(event){
    const input=event?.target;
    const file=input?.files?.[0];
    if(!file)return;

    if(!/^image\/(png|jpe?g|webp)$/i.test(file.type)){
      alert('Escolha uma imagem PNG, JPG/JPEG ou WEBP.');
      input.value='';
      return;
    }
    if(file.size>2*1024*1024){
      alert('A foto do administrador deve ter no máximo 2 MB.');
      input.value='';
      return;
    }

    const reader=new FileReader();
    reader.onload=function(){
      try{
        localStorage.setItem(ADMIN_PROFILE_PHOTO_KEY,String(reader.result||''));
        renderAdminProfilePhoto();
      }catch(err){
        alert('Não foi possível guardar a foto do administrador neste navegador.');
      }
      input.value='';
    };
    reader.onerror=function(){
      alert('Não foi possível ler a foto.');
      input.value='';
    };
    reader.readAsDataURL(file);
  };

  function bind(){
    renderAdminProfilePhoto();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',bind);
  }else{
    bind();
  }

  /* O avatar pode ser recriado/atualizado quando o painel é renderizado. */
  const oldRenderAdmin=window.renderAdmin;
  if(typeof oldRenderAdmin==='function'){
    window.renderAdmin=function(){
      const result=oldRenderAdmin.apply(this,arguments);
      setTimeout(renderAdminProfilePhoto,0);
      return result;
    };
  }

  window.apsanRenderAdminProfilePhoto=renderAdminProfilePhoto;
})();



/* =========================================================
   APSAN PERFIS — CORREÇÃO DEFINITIVA V8
   O editor de perfil usa a mesma conta que iniciou a sessão.
   A procura é feita por ID, e-mail ou telefone e nunca apenas
   pelo ID, evitando o erro de "conta não encontrada".
   ========================================================= */
(function(){
  'use strict';

  const normP=v=>String(v??'').trim().toLowerCase();
  const phoneP=v=>String(v??'').replace(/\D/g,'');

  function listP(key){
    try{
      const raw=localStorage.getItem(key);
      const data=raw?JSON.parse(raw):[];
      return Array.isArray(data)?data:[];
    }catch(e){return []}
  }
  function writeP(key,list){localStorage.setItem(key,JSON.stringify(list));}

  function matchAccountP(item,current){
    if(!item||!current)return false;
    if(current.id&&item.id&&String(item.id)===String(current.id))return true;
    if(current.email&&item.email&&normP(item.email)===normP(current.email))return true;
    if(current.phone&&item.phone&&phoneP(item.phone)===phoneP(current.phone))return true;
    return false;
  }

  /* Procura primeiro no armazenamento correspondente ao papel.
     Só usa os outros armazenamentos como fallback de recuperação. */
  function resolveProfileP(role){
    const current=window.onUser||{};
    if(!current)return null;

    let keys=[];
    if(role==='teacher')keys=[OK.T];
    else if(role==='student')keys=[OK.S];
    else if(role==='institution')keys=[OK.IN];
    else keys=[OK.T,OK.S,OK.IN];

    for(const key of keys){
      const list=listP(key);
      const index=list.findIndex(x=>matchAccountP(x,current));
      if(index>=0)return {key,list,index,user:list[index]};
    }

    /* Fallback: algumas contas antigas podem ter ficado com o registo
       numa chave diferente. Procuramos pela mesma identidade antes de
       considerar a recuperação da sessão. */
    for(const key of [OK.T,OK.S,OK.IN]){
      if(keys.includes(key))continue;
      const list=listP(key);
      const index=list.findIndex(x=>matchAccountP(x,current));
      if(index>=0)return {key,list,index,user:list[index],fallback:true};
    }

    /* Se a sessão contém uma conta válida, recupera-a no armazenamento
       correto. Isto evita perder o perfil só porque uma versão antiga
       gravou a sessão mas não sincronizou a lista. */
    const target=role==='teacher'?OK.T:role==='student'?OK.S:role==='institution'?OK.IN:null;
    if(!target)return null;
    const list=listP(target);
    const recovered=Object.assign({},current);
    if(!recovered.id){
      recovered.id='recover_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
    }
    list.push(recovered);
    return {key:target,list,index:list.length-1,user:recovered,recovered:true};
  }

  function syncHeaderP(u){
    window.onUser=u;
    const label=document.getElementById('onUser');
    if(label)label.textContent=u?.legalName||u?.name||'';
    if(typeof updateOnlineHeaderUser==='function')updateOnlineHeaderUser(u);
  }

  async function savePhotoP(inputId,currentPhoto){
    const input=document.getElementById(inputId);
    const file=input?.files?.[0];
    if(!file)return currentPhoto||'';
    if(!/^image\/(png|jpe?g|webp)$/i.test(file.type))throw new Error('Escolha uma imagem PNG, JPG/JPEG ou WEBP.');
    if(file.size>2*1024*1024)throw new Error('A fotografia deve ter no máximo 2 MB.');
    if(typeof localFile==='function'){
      const value=await localFile(input);
      if(value)return value;
    }
    return await new Promise((resolve,reject)=>{
      const r=new FileReader();
      r.onload=()=>resolve(r.result);
      r.onerror=()=>reject(new Error('Não foi possível guardar a fotografia.'));
      r.readAsDataURL(file);
    });
  }

  async function saveCommonP(e,role,ids,photoId,buttonId){
    e.preventDefault();
    const record=resolveProfileP(role);
    if(!record){
      const label=role==='student'?'aluno':role==='institution'?'instituição':'professor';
      return alert('Não foi possível localizar a conta de '+label+' desta sessão.');
    }

    const btn=document.getElementById(buttonId);
    if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A guardar...';}

    try{
      const u=record.user;
      for(const [field,id] of Object.entries(ids)){
        const el=document.getElementById(id);
        if(el)u[field]=(el.value||'').trim();
      }
      if(!u.name||!u.phone)throw new Error('Nome e telefone são obrigatórios.');
      u.photo=await savePhotoP(photoId,u.photo);
      record.list[record.index]=u;
      writeP(record.key,record.list);
      syncHeaderP(u);
      if(typeof renderOn==='function')renderOn();
      alert('Perfil atualizado com sucesso. Os dados e a fotografia foram guardados.');
    }catch(err){
      alert(err?.message||'Não foi possível guardar o perfil.');
      if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Guardar perfil';}
    }
  }

  /* Professor particular */
  window.apsanV6SaveTeacher=function(e){
    return saveCommonP(e,'teacher',{
      name:'v6TeacherName',phone:'v6TeacherPhone',email:'v6TeacherEmail',
      sub:'v6TeacherSub',bio:'v6TeacherBio',qualifications:'v6TeacherQual'
    },'v6TeacherPhoto','v6TeacherSaveBtn');
  };

  /* O botão V6 antigo não tinha ID fixo. Aceita também a pesquisa pelo
     primeiro botão de submit do formulário para manter compatibilidade. */
  const originalTeacherSave=window.apsanV6SaveTeacher;
  window.apsanV6SaveTeacher=async function(e){
    e.preventDefault();
    const record=resolveProfileP('teacher');
    if(!record)return alert('Não foi possível localizar a conta de professor desta sessão.');
    const form=e?.target;
    const btn=form?.querySelector('button[type="submit"]')||document.querySelector('#v6TeacherSaveBtn');
    if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A guardar...';}
    try{
      const u=record.user;
      u.name=(document.getElementById('v6TeacherName')?.value||'').trim();
      u.phone=(document.getElementById('v6TeacherPhone')?.value||'').trim();
      u.email=(document.getElementById('v6TeacherEmail')?.value||'').trim();
      u.sub=(document.getElementById('v6TeacherSub')?.value||'').trim();
      u.bio=(document.getElementById('v6TeacherBio')?.value||'').trim();
      u.qualifications=(document.getElementById('v6TeacherQual')?.value||'').trim();
      if(!u.name||!u.phone)throw new Error('Nome e telefone são obrigatórios.');
      u.photo=await savePhotoP('v6TeacherPhoto',u.photo);
      record.list[record.index]=u;writeP(record.key,record.list);syncHeaderP(u);
      if(typeof renderOn==='function')renderOn();
      alert('Perfil do professor atualizado com sucesso. Os dados e a fotografia foram guardados.');
    }catch(err){
      alert(err?.message||'Não foi possível guardar o perfil.');
      if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Guardar perfil';}
    }
  };

  /* Aluno particular / institucional */
  window.apsanV6SaveStudent=async function(e){
    e.preventDefault();
    const record=resolveProfileP('student');
    if(!record)return alert('Não foi possível localizar a conta de aluno desta sessão.');
    const form=e?.target,btn=form?.querySelector('button[type="submit"]');
    if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A guardar...';}
    try{
      const u=record.user;
      u.name=(document.getElementById('v6StudentName')?.value||'').trim();
      u.phone=(document.getElementById('v6StudentPhone')?.value||'').trim();
      u.email=(document.getElementById('v6StudentEmail')?.value||'').trim();
      u.bio=(document.getElementById('v6StudentBio')?.value||'').trim();
      if(!u.name||!u.phone)throw new Error('Nome e telefone são obrigatórios.');
      u.photo=await savePhotoP('v6StudentPhoto',u.photo);
      record.list[record.index]=u;writeP(record.key,record.list);syncHeaderP(u);
      if(typeof renderOn==='function')renderOn();
      alert('Perfil do aluno atualizado com sucesso. Os dados e a fotografia foram guardados.');
    }catch(err){
      alert(err?.message||'Não foi possível guardar o perfil.');
      if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Guardar perfil';}
    }
  };

  /* Professor institucional */
  window.apsanV6SaveInstitutionTeacher=async function(e){
    e.preventDefault();
    const record=resolveProfileP('teacher');
    if(!record)return alert('Não foi possível localizar a conta do professor institucional desta sessão.');
    const form=e?.target,btn=form?.querySelector('button[type="submit"]');
    if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A guardar...';}
    try{
      const u=record.user;
      u.name=(document.getElementById('v6ITName')?.value||'').trim();
      u.phone=(document.getElementById('v6ITPhone')?.value||'').trim();
      u.email=(document.getElementById('v6ITEmail')?.value||'').trim();
      u.sub=(document.getElementById('v6ITSub')?.value||'').trim();
      u.bio=(document.getElementById('v6ITBio')?.value||'').trim();
      u.qualifications=(document.getElementById('v6ITQual')?.value||'').trim();
      if(!u.name||!u.phone)throw new Error('Nome e telefone são obrigatórios.');
      u.photo=await savePhotoP('v6ITPhoto',u.photo);
      record.list[record.index]=u;writeP(record.key,record.list);syncHeaderP(u);
      if(typeof renderOn==='function')renderOn();
      alert('Perfil do professor institucional atualizado com sucesso. Os dados e a fotografia foram guardados.');
    }catch(err){
      alert(err?.message||'Não foi possível guardar o perfil.');
      if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Guardar perfil';}
    }
  };

  /* Instituição */
  window.apsanV6SaveInstitution=async function(e){
    e.preventDefault();
    const record=resolveProfileP('institution');
    if(!record)return alert('Não foi possível localizar a conta da instituição desta sessão.');
    const form=e?.target,btn=form?.querySelector('button[type="submit"]');
    if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A guardar...';}
    try{
      const u=record.user;
      const fields={legalName:'v6InstLegalName',name:'v6InstName',phone:'v6InstPhone',email:'v6InstEmail',representative:'v6InstRep',address:'v6InstAddress',bio:'v6InstBio'};
      Object.entries(fields).forEach(([field,id])=>{const el=document.getElementById(id);if(el)u[field]=(el.value||'').trim();});
      if(!u.name||!u.phone||!u.representative)throw new Error('Nome, telefone e representante legal são obrigatórios.');
      u.photo=await savePhotoP('v6InstPhoto',u.photo);
      record.list[record.index]=u;writeP(record.key,record.list);syncHeaderP(u);
      if(typeof renderOn==='function')renderOn();
      alert('Perfil da instituição atualizado com sucesso. Os dados e a fotografia foram guardados.');
    }catch(err){
      alert(err?.message||'Não foi possível guardar o perfil.');
      if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Guardar perfil da instituição';}
    }
  };
})();
