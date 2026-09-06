/* APSAN — fluxo de saques V8
   Saldo disponível = rendimentos líquidos aprovados - valores de saques já
   confirmados ou atualmente reservados. Rendimentos NÃO são saques.
   Esta camada corrige o legado e mantém o dashboard principal intacto.
*/
(function(){
  'use strict';
  if(typeof og!=='function'||typeof os!=='function')return;
  const PO='apsan_teacher_payouts_v2',TX='apsan_teacher_transactions_v2',T='apsan_teachers_v2';
  const RESET='apsan_payout_legacy_reset_v8';
  const escV=v=>typeof esc==='function'?esc(v??''):String(v??'');
  const num=v=>Number.isFinite(Number(v))?Number(v):0;
  const fmtV=v=>typeof fmt==='function'?fmt(v):num(v).toLocaleString('pt-AO')+' Kz';
  const read=k=>og(k),write=(k,v)=>os(k,v);
  const currentUser=()=>typeof onUser!=='undefined'?onUser:null;
  const teacherId=()=>currentUser()?.id||'';

  /* Limpeza única do histórico de saques legado. Mantém os rendimentos TX intactos,
     para que o saldo líquido de 28.780,2 Kz continue disponível para novo pedido. */
  function resetLegacyPayouts(){
    if(localStorage.getItem(RESET)==='1')return;
    write(PO,[]);
    localStorage.setItem(RESET,'1');
  }
  resetLegacyPayouts();

  const getTx=()=>read(TX).filter(x=>String(x.teacher||'')===String(teacherId()));
  const getPo=()=>read(PO).filter(x=>String(x.teacher||'')===String(teacherId()));
  function state(){
    const tx=getTx(),po=getPo();
    const net=tx.reduce((a,x)=>a+num(x.net??(num(x.gross)-num(x.fee))),0);
    const completed=po.filter(x=>['completed','paid'].includes(x.status)).reduce((a,x)=>a+num(x.amount),0);
    const reserved=po.filter(x=>['requested','approved','processing'].includes(x.status)).reduce((a,x)=>a+num(x.amount),0);
    return {net,completed,reserved,available:Math.max(0,net-completed-reserved)};
  }
  function bank(){const u=read(T).find(x=>String(x.id)===String(teacherId()))||currentUser()||{};return u.bank||{}}
  function render(){if(typeof renderOn==='function')renderOn()}

  function openTeacherPayoutModal(){
    const s=state(),b=bank();
    if(s.available<=0)return alert('Não existe saldo disponível para levantamento.');
    if(!b.iban&&!b.express)return alert('Preencha primeiro os dados para receber.');
    const max=s.available;
    const body=`<div class="apsan-payout-request-v7"><div class="apsan-payout-available-v7"><span>Saldo disponível para saque</span><strong>${fmtV(max)}</strong><small>Este valor vem dos seus rendimentos líquidos e ainda não foi levantado.</small></div><form id="apsanPayoutRequestFormV7" class="on-form"><div class="on-full"><label>Quanto pretende levantar? *</label><input id="apsanPayoutAmountV7" type="number" min="1" max="${max}" step="0.01" value="${max}" required><small class="on-v2-form-help">Pode solicitar qualquer montante até ${fmtV(max)}.</small></div><div><label>Destino</label><input value="${escV(b.bank||'Transferência bancária')}" readonly></div><div><label>Conta</label><input value="${escV(b.iban||b.express||'')}" readonly></div><div class="on-full"><div class="apsan-payout-flow-note-v7"><i class="fa-solid fa-circle-info"></i><span>O pedido será enviado à <strong>Administração APSAN</strong>. Enquanto estiver em análise, o montante solicitado fica reservado e não pode ser solicitado novamente.</span></div></div></form></div>`;
    if(typeof onModalBody!=='undefined'&&onModalBody&&typeof onModal!=='undefined'&&onModal){onModalBody.innerHTML=body;onModal.classList.add('show');}else alert('Não foi possível abrir o formulário de saque.');
  }
  window.requestTeacherPayout=openTeacherPayoutModal;

  window.submitTeacherPayoutV7=function(){
    const s=state(),amount=num(document.getElementById('apsanPayoutAmountV7')?.value);
    if(amount<=0)return alert('Informe um valor válido.');
    if(amount>s.available+0.0001)return alert('O valor solicitado ultrapassa o saldo disponível.');
    const b=bank();if(!b.iban&&!b.express)return alert('Preencha primeiro os dados para receber.');
    const list=read(PO);
    list.push({id:typeof oid==='function'?oid('payout'):('payout'+Date.now()),teacher:teacherId(),teacherName:currentUser()?.name||'',amount,details:Object.assign({},b),status:'requested',createdAt:new Date().toISOString(),approvedAt:'',processedAt:'',completedAt:'',adminReason:''});
    write(PO,list);
    if(typeof closeOnModal==='function')closeOnModal();
    render();
    alert('Pedido de saque enviado à administração. O valor foi reservado enquanto aguarda análise.');
  };

  window.approvePayoutV7=function(id){
    const a=read(PO),x=a.find(v=>String(v.id)===String(id));if(!x)return;
    if(x.status!=='requested')return;
    x.status='processing';x.approvedAt=new Date().toISOString();x.processedAt=x.processedAt||new Date().toISOString();x.adminReason='';x.adminUpdatedAt=new Date().toISOString();
    write(PO,a);
    if(typeof apsanAdminAudit==='function')apsanAdminAudit('Saque aprovado para processamento',(x.teacherName||x.teacher||id)+' · '+fmtV(x.amount));
    if(typeof renderAdminOnline==='function')renderAdminOnline();
  };

  window.rejectPayoutV7=function(id){
    const a=read(PO),x=a.find(v=>String(v.id)===String(id));if(!x)return;
    const reason=prompt('Motivo da rejeição do saque:','Pedido não aprovado pela administração.');if(reason===null)return;
    x.status='rejected';x.adminReason=reason;x.rejectedAt=new Date().toISOString();x.adminUpdatedAt=new Date().toISOString();
    write(PO,a);
    if(typeof apsanAdminAudit==='function')apsanAdminAudit('Saque rejeitado',(x.teacherName||x.teacher||id)+' · '+reason);
    if(typeof renderAdminOnline==='function')renderAdminOnline();
  };

  window.completePayoutV7=function(id){
    const a=read(PO),x=a.find(v=>String(v.id)===String(id));if(!x)return;
    if(!['processing','approved'].includes(x.status))return;
    x.status='completed';x.completedAt=new Date().toISOString();x.transferredAmount=num(x.amount);x.transferStatus='completed';x.adminUpdatedAt=new Date().toISOString();
    write(PO,a);
    if(typeof apsanAdminAudit==='function')apsanAdminAudit('Transferência de saque confirmada',(x.teacherName||x.teacher||id)+' · '+fmtV(x.amount));
    if(typeof renderAdminOnline==='function')renderAdminOnline();
  };

  const oldProcess=typeof window.processPayoutV2==='function'?window.processPayoutV2:null;
  window.completePayoutV2=window.completePayoutV7;
  window.processPayoutV2=function(id){const x=read(PO).find(v=>String(v.id)===String(id));if(x&&x.status==='requested')return window.approvePayoutV7(id);return oldProcess?oldProcess.apply(this,arguments):undefined};

  const oldButtons=typeof window.aoStatusButtons==='function'?window.aoStatusButtons:null;
  if(oldButtons&&!oldButtons.__apsanPayoutV8){
    const wrapped=function(type,x){
      if(type==='payouts'){
        let h='<button class="a-view" onclick="adminOnlineView(\'payouts\',\''+escV(x.id)+'\')">👁 Ver</button><button class="a-edit" onclick="adminOnlineEdit(\'payouts\',\''+escV(x.id)+'\')">✎ Editar</button><button class="a-adjust" onclick="adminOnlineAdjust(\'payouts\',\''+escV(x.id)+'\')">↕ Ajustar</button>';
        if(x.status==='requested')h+='<button class="a-approve" onclick="approvePayoutV7(\''+escV(x.id)+'\')">✓ Aprovar saque</button><button class="a-reject" onclick="rejectPayoutV7(\''+escV(x.id)+'\')">✕ Rejeitar</button>';
        else if(x.status==='processing')h+='<button class="a-approve" onclick="completePayoutV7(\''+escV(x.id)+'\')">✓ Confirmar transferência</button>';
        h+='<button class="a-delete" onclick="adminOnlineDelete(\'payouts\',\''+escV(x.id)+'\')">🗑 Eliminar</button>';
        return'<div class="admin-online-actions">'+h+'</div>';
      }
      return oldButtons.apply(this,arguments);
    };
    wrapped.__apsanPayoutV8=true;window.aoStatusButtons=wrapped;
  }

  /* Corrige o cartão financeiro sem substituir o dashboard.js. O rendimento líquido
     é saldo disponível; apenas pedidos de saque reservados/concluídos reduzem o saldo. */
  const oldFinance=typeof window.renderTeacherFinance==='function'?window.renderTeacherFinance:null;
  if(oldFinance&&!oldFinance.__apsanPayoutV8){
    const wrappedFinance=function(){
      oldFinance.apply(this,arguments);
      try{
        const s=state(),box=document.getElementById('onfinance');if(!box)return;
        const balance=box.querySelector('.balance-value');if(balance)balance.textContent=fmtV(s.available);
        const top=box.querySelector('.apsan-withdraw-btn');if(top){top.disabled=s.available<=0;top.innerHTML=s.available>0?'<i class="fa-solid fa-money-bill-transfer"></i> Solicitar saque':'<i class="fa-solid fa-lock"></i> Saldo não disponível'};
        const mini=box.querySelectorAll('.balance-mini-grid>div');
        if(mini[0]?.querySelector('strong'))mini[0].querySelector('strong').textContent=fmtV(s.net);
        if(mini[1]?.querySelector('strong'))mini[1].querySelector('strong').textContent=fmtV(s.reserved);
        if(mini[2]?.querySelector('strong'))mini[2].querySelector('strong').textContent=fmtV(s.completed);
        const totals=box.querySelectorAll('.payout-total strong');if(totals.length>=4){totals[2].textContent=fmtV(s.completed);totals[3].textContent=fmtV(s.available)}
      }catch(e){console.warn('APSAN payout UI:',e)}
    };
    wrapped.__apsanPayoutV8=true;window.renderTeacherFinance=wrapped;
  }

  function injectStyle(){if(document.getElementById('apsanPayoutFlowV8Style'))return;const s=document.createElement('style');s.id='apsanPayoutFlowV8Style';s.textContent='.apsan-payout-request-v7{display:grid;gap:16px}.apsan-payout-available-v7{padding:18px;border:1px solid #dbeafe;border-radius:16px;background:#eff6ff}.apsan-payout-available-v7 span,.apsan-payout-available-v7 small{display:block;color:#64748b}.apsan-payout-available-v7 strong{display:block;font-size:28px;color:#075985;margin:4px 0}.apsan-payout-flow-note-v7{display:flex;gap:9px;padding:12px 14px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;color:#475569;font-size:12px;line-height:1.55}.apsan-payout-flow-note-v7 i{color:#2563eb;margin-top:2px}.apsan-payout-request-v7 input[readonly]{background:#f8fafc}.apsan-withdraw-btn:not(:disabled){cursor:pointer}';document.head.appendChild(s)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectStyle,{once:true});else injectStyle();
})();
