/* APSAN — dashboard.js
   Código extraído do index.html original.
   Ordem das dependências preservada pelo carregamento modular no index.html.
*/

/* ===== Código original: linhas 2644-3198 ===== */
const OK={T:'apsan_teachers_v2',S:'apsan_students_v2',IN:'apsan_institutions_v2',O:'apsan_teacher_offers_v2',E:'apsan_enrollments_v2',P:'apsan_payments_v2',I:'apsan_monthly_invoices_v2',SL:'apsan_slots_v2',C:'apsan_classes_v2',M:'apsan_materials_v2',TX:'apsan_teacher_transactions_v2',PO:'apsan_teacher_payouts_v2',CFG:'apsan_online_config_v2'};
let onRole='teacher',onUser=null,onStudentMode='private',onInstitutionMode='',onAuthMode='create';
const og=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}},os=(k,v)=>localStorage.setItem(k,JSON.stringify(v)),oid=p=>p+Date.now()+Math.random().toString(36).slice(2,7),esc=x=>String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const onlineCfg=()=>Object.assign({commissionRate:10,graceDays:3},og(OK.CFG)[0]||{});
function fmt(v){return Number(v||0).toLocaleString('pt-AO')+' Kz'}
function datePT(v){if(!v)return '-';try{return new Date(v).toLocaleDateString('pt-AO')}catch(e){return v}}
function statusTag(s){const map={pending:'Pendente',under_review:'Em análise',approved:'Aprovado',active:'Ativo',rejected:'Rejeitado',suspended:'Suspenso',draft:'Rascunho',paused:'Pausado',payment_submitted:'Comprovativo enviado',pending_payment:'A aguardar pagamento',paid:'Pago',overdue:'Em atraso',upcoming:'Próximo',requested:'Solicitado',processing:'Em processamento',completed:'Concluído',cancelled:'Cancelado'};let cls=['approved','active','paid','completed'].includes(s)?'ok':['rejected','suspended','overdue','cancelled'].includes(s)?'bad':['pending','under_review','payment_submitted','pending_payment','requested','processing','upcoming'].includes(s)?'warn':'info';return `<span class="on-v2-tag ${cls}">${esc(map[s]||s||'-')}</span>`}
function closeOnline(){
  const page=document.getElementById('onlinePage');
  if(page) page.classList.remove('show');
  document.body.classList.remove('page-open');
  onUser=null;
}
function showOnlineAuth(){
  const ch=document.getElementById('institutionPortalChoice'), a=document.getElementById('onAuth'), d=document.getElementById('onDash');
  if(ch) ch.style.display='none';
  if(a) a.style.display='block';
  if(d) d.style.display='none';
  const back=document.getElementById('onInstitutionBack');
  if(back) back.style.display=onInstitutionMode?'block':'none';
}
function openInstitutionPortal(){
  const page=document.getElementById('onlinePage');
  if(!page)return alert('Área de Aulas Online indisponível.');
  page.classList.add('show');
  document.body.classList.add('page-open');
  // Ao abrir o portal institucional, nenhum painel de utilizador particular
  // pode permanecer visível por baixo dele.
  const dash=document.getElementById('onDash'), auth=document.getElementById('onAuth');
  if(dash) dash.style.display='none';
  if(auth) auth.style.display='none';
  onRole='institution';
  onInstitutionMode='';
  const ch=document.getElementById('institutionPortalChoice'),a=document.getElementById('onAuth');
  if(ch)ch.style.display='block';
  if(a)a.style.display='none';
}
function institutionEntry(mode){
  onInstitutionMode=mode;
  onRole=mode==='admin'?'institution':mode;
  const ch=document.getElementById('institutionPortalChoice'),a=document.getElementById('onAuth'),d=document.getElementById('onDash');
  if(d)d.style.display='none';
  if(ch)ch.style.display='none';
  if(a)a.style.display='block';
  setOnlineAuthMode('create');
  setOnRole(onRole);
  populateInstitutionSelectors();
}
function openOnline(r){
  const page=document.getElementById('onlinePage');
  if(!page)return alert('A área de Aulas Online não foi encontrada nesta página.');
  const dash=document.getElementById('onDash');
  if(dash) dash.style.display='none';
  onRole=r||'teacher';
  onInstitutionMode='';
  page.classList.add('show');
  document.body.classList.add('page-open');
  showOnlineAuth();
  setOnlineAuthMode('create');
  setOnRole(onRole);
}
function openStudentAccess(mode){
  onStudentMode='private';
  onInstitutionMode='';
  openOnline('student');
}
function chooseStudentMode(mode){
  onStudentMode='private';
  onInstitutionMode='';
  setOnRole('student');
}
function setOnlineAuthMode(mode){
  onAuthMode=mode==='login'?'login':'create';
  const createBtn=document.getElementById('onCreateModeBtn'),loginBtn=document.getElementById('onLoginModeBtn');
  const createFields=document.getElementById('onCreateIdentityFields');
  const loginField=document.getElementById('onLoginIdentifierField');
  const loginHint=document.getElementById('onLoginHint');
  const subject=document.getElementById('onSubject');
  const inst=document.getElementById('onInstitutionFields');
  const teacherInst=document.getElementById('onTeacherInstitutionFields');
  const studentInst=document.getElementById('onStudentInstitutionFields');
  const adminBox=document.getElementById('onInstitutionAdminMode');
  const submit=document.getElementById('onAuthSubmit');
  const pass=document.getElementById('onPass');
  const name=document.getElementById('onName'),phone=document.getElementById('onPhone'),email=document.getElementById('onEmail'),identifier=document.getElementById('onLoginIdentifier');
  const isLogin=onAuthMode==='login';
  if(createBtn)createBtn.classList.toggle('active',!isLogin);
  if(loginBtn)loginBtn.classList.toggle('active',isLogin);
  if(createFields)createFields.style.display=isLogin?'none':'block';
  if(loginField)loginField.style.display=isLogin?'block':'none';
  if(loginHint)loginHint.style.display=isLogin?'block':'none';
  if(subject)subject.style.display=isLogin?'none':(onRole==='teacher'&&onInstitutionMode!=='teacher'?'block':'none');
  if(inst)inst.style.display=!isLogin&&onRole==='institution'&&onInstitutionMode==='admin'?'block':'none';
  if(teacherInst)teacherInst.style.display=!isLogin&&onRole==='teacher'&&onInstitutionMode==='teacher'?'block':'none';
  if(studentInst)studentInst.style.display=!isLogin&&onRole==='student'&&onInstitutionMode==='student'?'block':'none';
  if(adminBox)adminBox.style.display=!isLogin&&onRole==='institution'&&onInstitutionMode==='admin'?'block':'none';
  if(submit)submit.innerHTML=isLogin?'<i class="fa-solid fa-right-to-bracket"></i> Entrar na minha conta':'<i class="fa-solid fa-user-plus"></i> Criar conta';
  if(name)name.required=!isLogin;
  if(phone)phone.required=!isLogin;
  if(pass)pass.autocomplete=isLogin?'current-password':'new-password';
  if(identifier)identifier.required=isLogin;
}

function setOnRole(r){
  onRole=r||'teacher';
  const role=document.getElementById('onRole'), subject=document.getElementById('onSubject'),
        inst=document.getElementById('onInstitutionFields'),
        studentInst=document.getElementById('onStudentInstitutionFields'),
        teacherInst=document.getElementById('onTeacherInstitutionFields'),
        adminBox=document.getElementById('onInstitutionAdminMode'),
        title=document.getElementById('onAuthTitle'),desc=document.getElementById('onAuthDescription'),
        icon=document.getElementById('onAuthIcon'),nameLabel=document.getElementById('onNameLabel'),
        submit=document.getElementById('onAuthSubmit'),back=document.getElementById('onInstitutionBack');
  const isInstAdmin=r==='institution'&&onInstitutionMode==='admin';
  const isInstTeacher=r==='teacher'&&onInstitutionMode==='teacher';
  const isInstStudent=r==='student'&&onInstitutionMode==='student';

  if(role) role.textContent=isInstAdmin?'Direção da instituição':isInstTeacher?'Professor da instituição':isInstStudent?'Aluno da instituição':r==='teacher'?'Professor particular':'Aluno de aulas particulares';
  if(title) title.textContent=isInstAdmin?'Direção da instituição':isInstTeacher?'Professor da instituição':isInstStudent?'Aluno da instituição':r==='teacher'?'Professor particular':'Aluno particular';
  if(desc) desc.textContent=isInstAdmin?'Cadastre ou aceda à conta administrativa da instituição.':isInstTeacher?'Entre na sua instituição e aceda ao ambiente pedagógico.':isInstStudent?'Entre na sua instituição e aceda às suas disciplinas e turmas.':r==='teacher'?'Crie o seu perfil profissional e publique o seu programa de aulas particulares.':'Procure professores e faça matrículas em aulas particulares.';
  if(icon) icon.className=isInstAdmin?'fa-solid fa-landmark':isInstTeacher?'fa-solid fa-chalkboard-user':isInstStudent?'fa-solid fa-user-graduate':r==='teacher'?'fa-solid fa-chalkboard-user':'fa-solid fa-user-graduate';
  if(nameLabel) nameLabel.textContent=isInstAdmin?'Nome do responsável / diretor': 'Nome completo';
  if(subject) subject.style.display=r==='teacher'&&!isInstTeacher?'block':'none';
  if(inst) inst.style.display=isInstAdmin?'block':'none';
  if(adminBox) adminBox.style.display=isInstAdmin?'block':'none';
  if(studentInst) studentInst.style.display=isInstStudent?'block':'none';
  if(teacherInst) teacherInst.style.display=isInstTeacher?'block':'none';
  if(submit) submit.textContent=isInstAdmin?'Entrar / cadastrar instituição':isInstTeacher?'Entrar / criar conta de professor':isInstStudent?'Entrar / criar conta de aluno':'Entrar / criar conta';
  if(back) back.style.display=onInstitutionMode?'block':'none';
  if(isInstStudent) updateStudentModeUI();
  if(isInstTeacher) populateInstitutionSelectors();
}
function populateInstitutionSelectors(){
  const institutions=og(OK.IN).filter(x=>x.status==='approved');
  ['onStudentInstitutionSelect','onTeacherInstitutionSelect'].forEach(id=>{
    const el=document.getElementById(id); if(!el)return;
    const current=el.value;
    el.innerHTML='<option value="">Selecione a instituição</option>'+institutions.map(x=>`<option value="${esc(x.id)}">${esc(x.legalName||x.name)}${x.nif?' · NIF '+esc(x.nif):''}</option>`).join('');
    if(current)el.value=current;
  });
}
function updateStudentModeUI(){
  const code=document.getElementById('onStudentInstitutionCode');
  if(code)code.required=false;
}
function onlineInit(){if(localStorage.getItem('apsan_online_v2_clean')!=='1'){['apsan_teachers','apsan_students','apsan_slots','apsan_classes'].forEach(k=>localStorage.removeItem(k));localStorage.setItem('apsan_online_v2_clean','1')}[OK.T,OK.S,OK.IN,OK.O,OK.E,OK.P,OK.I,OK.SL,OK.C,OK.M,OK.TX,OK.PO].forEach(k=>{if(!localStorage.getItem(k))os(k,[])});if(!localStorage.getItem(OK.CFG))os(OK.CFG,[{commissionRate:10,graceDays:3}])}
async function loginOnline(e){
  e.preventDefault();
  onlineInit();
  const role=onRole;
  const key=role==='teacher'?OK.T:role==='student'?OK.S:OK.IN;
  const list=og(key);
  const isLogin=onAuthMode==='login';
  const name=(document.getElementById('onName')?.value||'').trim();
  const phone=(document.getElementById('onPhone')?.value||'').trim();
  const email=(document.getElementById('onEmail')?.value||'').trim();
  const identifier=(document.getElementById('onLoginIdentifier')?.value||'').trim();
  const pass=document.getElementById('onPass')?.value||'';

  if(isLogin){
    if(!identifier||!pass)return alert('Informe o telefone ou e-mail da conta e a palavra-passe.');
    const ident=identifier.toLowerCase();
    let u=list.find(x=>String(x.phone||'').trim()===identifier||String(x.email||'').trim().toLowerCase()===ident);
    if(!u)return alert('Não encontrámos uma conta com esse telefone/e-mail neste perfil. Se ainda não tem conta, selecione “Criar conta”.');
    if(u.pass!==pass)return alert('Palavra-passe incorreta.');
    if(role==='student'&&u.studentType&&u.studentType!==(onInstitutionMode==='student'?'institution':'private'))return alert(onInstitutionMode==='student'?'Esta conta é de aluno particular. Entre pela opção “Aluno particular”.':'Esta conta pertence a uma instituição. Entre pelo Portal da Instituição.');
    if(role==='teacher'&&u.teacherType&&u.teacherType!==(onInstitutionMode==='teacher'?'institution':'private'))return alert(onInstitutionMode==='teacher'?'Esta conta é de professor particular. Entre pela opção “Professor particular”.':'Esta conta pertence a uma instituição. Entre pelo Portal da Instituição.');
    if(role==='institution'&&onInstitutionMode==='admin'&&u.status==='rejected')return alert('A instituição foi rejeitada. Consulte o motivo no suporte da APSAN.');
    if(role==='institution'&&onInstitutionMode==='admin'&&u.status==='suspended')return alert('A conta da instituição está suspensa. Contacte a APSAN.');
    onUser=u;
    const auth=document.getElementById('onAuth'),portal=document.getElementById('institutionPortalChoice'),dash=document.getElementById('onDash');
    if(auth)auth.style.display='none'; if(portal)portal.style.display='none'; if(dash)dash.style.display='block';
    const label=document.getElementById('onUser'); if(label)label.textContent=u.legalName||u.name;
    const teacherNav=document.getElementById('onTeacherNav'),studentNav=document.getElementById('onStudentNav'),institutionNav=document.getElementById('onInstitutionNav');
    if(teacherNav)teacherNav.style.display=role==='teacher'?'block':'none';
    if(studentNav)studentNav.style.display=role==='student'?'block':'none';
    if(institutionNav)institutionNav.style.display=role==='institution'?'block':'none';
    renderOn();
    return;
  }

  if(!name||!phone||!pass)return alert('Preencha nome, telefone e palavra-passe.');
  let u=list.find(x=>x.phone===phone);
  if(u&&u.pass!==pass)return alert('Já existe uma conta com este telefone e a palavra-passe está incorreta. Se já possui conta, use “Já tenho conta · Entrar”.');

  if(u){
    return alert('Já existe uma conta com este telefone. Se já pertence à plataforma, selecione “Já tenho conta · Entrar” para entrar na sua conta.');
  }

  if(role==='institution'&&onInstitutionMode==='admin'){
    if(!u){
      const legalName=(document.getElementById('onInstLegal')?.value||'').trim();
      const nif=(document.getElementById('onInstNif')?.value||'').trim();
      const type=document.getElementById('onInstType')?.value||'';
      const regime=document.getElementById('onInstRegime')?.value||'';
      const representative=(document.getElementById('onInstRep')?.value||'').trim();
      const address=(document.getElementById('onInstAddress')?.value||'').trim();
      if(!legalName||!nif||!type||!representative||!address)return alert('Preencha todos os dados legais obrigatórios da instituição.');
      try{
        const docs={
          legal:await saveBase64File(document.getElementById('onInstDoc'),3),
          license:await saveBase64File(document.getElementById('onInstLicense'),3),
          other:await saveBase64File(document.getElementById('onInstOther'),3)
        };
        if(!docs.legal)return alert('Envie o documento legal/registo da instituição.');
        u={id:oid('institution'),name,phone,email,pass,legalName,nif,type,regime,representative,address,
          bank:(document.getElementById('onInstBank')?.value||'').trim(),
          iban:(document.getElementById('onInstIban')?.value||'').trim(),
          holder:(document.getElementById('onInstHolder')?.value||'').trim(),
          express:(document.getElementById('onInstExpress')?.value||'').trim(),
          status:'pending',documents:docs,createdAt:new Date().toISOString()};
        list.push(u);os(key,list);
        alert('Pedido enviado. A APSAN fará a avaliação documental antes da aprovação.');
      }catch(err){return alert(err.message);}
    }else{
      if(u.status==='rejected')alert('A instituição foi rejeitada. Consulte o motivo no suporte da APSAN.');
    }
  }else if(role==='teacher'&&onInstitutionMode==='teacher'){
    const instId=document.getElementById('onTeacherInstitutionSelect')?.value||'';
    if(!instId)return alert('Selecione uma instituição aprovada.');
    const inst=og(OK.IN).find(x=>x.id===instId&&x.status==='approved');
    if(!inst)return alert('Instituição não encontrada ou ainda não aprovada.');
    if(u&&u.institution&&u.institution!==instId)return alert('Esta conta de professor está ligada a outra instituição.');
    if(!u){
      u={id:oid('teacher'),name,phone,email,sub:(document.getElementById('onSub')?.value||'').trim(),bio:'',qualifications:'',photo:'',pass,
        teacherType:'institution',institution:instId,institutionName:inst.legalName||inst.name,
        institutionCode:(document.getElementById('onTeacherInstitutionCode')?.value||'').trim(),
        status:'pending',createdAt:new Date().toISOString()};
      list.push(u);os(key,list);
      alert('Conta de professor institucional criada. Aguarde a validação da instituição/APSAN.');
    }
  }else if(role==='student'&&onInstitutionMode==='student'){
    const instId=document.getElementById('onStudentInstitutionSelect')?.value||'';
    if(!instId)return alert('Selecione uma instituição aprovada.');
    const inst=og(OK.IN).find(x=>x.id===instId&&x.status==='approved');
    if(!inst)return alert('Instituição não encontrada ou ainda não aprovada.');
    if(u&&u.studentType&&u.studentType!=='institution')return alert('Esta conta é de aluno particular. Use a entrada de aluno particular.');
    if(u&&u.institution&&u.institution!==instId)return alert('Esta conta está ligada a outra instituição.');
    if(!u){
      u={id:oid('student'),name,phone,email,sub:'',bio:'',pass,studentType:'institution',institution:instId,
        institutionName:inst.legalName||inst.name,institutionCode:(document.getElementById('onStudentInstitutionCode')?.value||'').trim(),
        status:'active',createdAt:new Date().toISOString()};
      list.push(u);os(key,list);
      alert('Conta de aluno institucional criada. A direção poderá associá-lo às turmas.');
    }
  }else{
    if(u&&role==='student'&&u.studentType&&u.studentType!=='private')return alert('Esta conta pertence a uma instituição. Entre pelo Portal Institucional.');
    if(u&&role==='teacher'&&u.teacherType&&u.teacherType!=='private'&&u.institution)return alert('Esta conta pertence a uma instituição. Entre pelo Portal Institucional.');
    if(!u){
      u={id:oid(role),name,phone,email,sub:(document.getElementById('onSub')?.value||'').trim(),bio:'',qualifications:'',photo:'',pass,
        studentType:role==='student'?'private':undefined,teacherType:role==='teacher'?'private':undefined,
        createdAt:new Date().toISOString(),status:role==='teacher'?'pending':'active'};
      list.push(u);os(key,list);
      alert(role==='teacher'?'Conta criada. Complete o seu perfil e envie o programa para aprovação.':'Conta de aluno particular criada. Agora pode procurar professores particulares aprovados.');
    }
  }

  onUser=u;
  const auth=document.getElementById('onAuth'), portal=document.getElementById('institutionPortalChoice'),dash=document.getElementById('onDash');
  if(auth)auth.style.display='none';
  if(portal)portal.style.display='none';
  if(dash)dash.style.display='block';
  const label=document.getElementById('onUser');
  if(label)label.textContent=u.legalName||u.name;
  const teacherNav=document.getElementById('onTeacherNav'),studentNav=document.getElementById('onStudentNav'),institutionNav=document.getElementById('onInstitutionNav');
  if(teacherNav)teacherNav.style.display=role==='teacher'?'block':'none';
  if(studentNav)studentNav.style.display=role==='student'?'block':'none';
  if(institutionNav)institutionNav.style.display=role==='institution'?'block':'none';
  renderOn();
}
function logoutOnline(){onUser=null;document.getElementById('onDash').style.display='none';document.getElementById('onAuth').style.display='block';document.getElementById('onPass').value=''}
function onTab(t,b){document.querySelectorAll('.on-tab').forEach(x=>x.classList.remove('active'));let el=document.getElementById('on'+t);if(!el)return;el.classList.add('active');let nav=onRole==='teacher'?onTeacherNav:onRole==='institution'?onInstitutionNav:onStudentNav;nav.querySelectorAll('button').forEach(x=>x.classList.remove('active'));if(b)b.classList.add('active');renderOn()}
function saveBase64File(input,maxMB=2){return new Promise((resolve,reject)=>{const f=input?.files?.[0];if(!f)return resolve('');if(f.size>maxMB*1024*1024)return reject(new Error(`O ficheiro deve ter no máximo ${maxMB} MB.`));const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('Não foi possível ler o ficheiro.'));r.readAsDataURL(f)})}
function renderOn(){
  if(!onUser)return;
  onlineInit();
  if(onRole==='teacher'){
    if(onInstitutionMode==='teacher'||onUser.teacherType==='institution')renderInstitutionTeacherV2();
    else renderTeacherV2();
  }else if(onRole==='student'){
    if(onInstitutionMode==='student'||onUser.studentType==='institution')renderInstitutionStudentV2();
    else renderStudentV2();
  }else renderInstitutionV2();
}
function teacherOffer(){return og(OK.O).find(x=>x.teacher===onUser.id)}
function renderTeacherV2(){const offers=og(OK.O), enroll=og(OK.E), slots=og(OK.SL), classes=og(OK.C), tx=og(OK.TX);let myO=offers.find(x=>x.teacher===onUser.id), myE=enroll.filter(x=>x.teacher===onUser.id&&x.status==='active'), myS=slots.filter(x=>x.teacher===onUser.id), myC=classes.filter(x=>x.teacher===onUser.id), gross=tx.filter(x=>x.teacher===onUser.id).reduce((a,x)=>a+Number(x.gross||0),0), net=tx.filter(x=>x.teacher===onUser.id).reduce((a,x)=>a+Number(x.net||0),0), paid=og(OK.PO).filter(x=>x.teacher===onUser.id&&x.status==='completed').reduce((a,x)=>a+Number(x.amount||0),0);onStats.innerHTML=`<div class="on-v2-kpi"><small>Programa</small><strong>${myO?statusTag(myO.status):'Não criado'}</strong></div><div class="on-v2-kpi"><small>Alunos ativos</small><strong>${myE.length}</strong></div><div class="on-v2-kpi"><small>Aulas</small><strong>${myC.length}</strong></div><div class="on-v2-kpi"><small>Saldo líquido</small><strong>${fmt(net-paid)}</strong></div>`;onHomeBox.innerHTML=`<div class="on-v2-card"><h3>Olá, ${esc(onUser.name)}</h3><p>${onUser.status==='pending'?'A sua conta de professor está pendente de aprovação. Pode completar o perfil e preparar o programa.':onUser.status==='approved'?'A sua conta está aprovada. Publique ou mantenha o seu programa atualizado.':'Estado da conta: '+esc(onUser.status)}</p>${myO?`<p><strong>${esc(myO.name)}</strong> · ${statusTag(myO.status)}</p>`:'<p>Ainda não existe nenhum programa de aulas. Crie o primeiro para começar.</p>'}<div class="on-v2-actions"><button class="on-v2-btn" onclick="onTab('program',document.querySelector('#onTeacherNav button:nth-child(2)'))">Gerir programa</button><button class="on-v2-btn alt" onclick="onTab('finance',document.querySelector('#onTeacherNav button:nth-child(7)'))">Ver financeiro</button></div></div><div class="on-v2-card"><h3>Resumo financeiro</h3><p>Bruto recebido: <strong>${fmt(gross)}</strong> · Líquido: <strong>${fmt(net)}</strong> · Já pago ao professor: <strong>${fmt(paid)}</strong>.</p><small>A comissão é configurável pelo administrador.</small></div>`;renderTeacherProgram(myO);renderTeacherSchedule(myO);renderTeacherClasses(myC);renderTeacherStudents(myE);renderTeacherMaterials(myC);renderTeacherFinance();renderTeacherProfile()}
function renderTeacherProgram(o){const box=document.getElementById('teacherProgramBox');if(!o){box.innerHTML=`<div class="on-v2-card"><h3>Criar programa / oferta de aulas</h3><div class="on-v2-note">O programa ficará invisível para alunos até o administrador aprovar.</div><form class="on-form" onsubmit="saveTeacherOffer(event)"><div class="on-full"><label>Nome da disciplina / curso *</label><input id="ofName" required placeholder="Ex.: Inglês Britânico"></div><div class="on-full"><label>Descrição *</label><textarea id="ofDesc" required placeholder="Explique o que o aluno vai aprender."></textarea></div><div><label>Nível *</label><select id="ofLevel" required><option value="">Selecione</option><option>Iniciante</option><option>Intermédio</option><option>Avançado</option></select></div><div><label>Modalidade *</label><select id="ofMode" required><option>Online</option><option>Presencial</option><option>Online e presencial</option></select></div><div><label>Duração por aula (min) *</label><input id="ofDuration" type="number" min="15" required value="60"></div><div><label>Aulas por mês *</label><input id="ofMonthClasses" type="number" min="1" required value="4"></div><div><label>Taxa de inscrição (Kz)</label><input id="ofEnrollFee" type="number" min="0" value="0"></div><div><label>Mensalidade (Kz) *</label><input id="ofMonthly" type="number" min="0" required></div><div><label>Máximo de alunos</label><input id="ofMax" type="number" min="1" value="20"></div><div><label>Link / sala</label><input id="ofRoom" placeholder="Zoom, Meet, endereço, etc."></div><div class="on-full"><label>Regras da turma</label><textarea id="ofRules" placeholder="Pontualidade, faltas, comportamento, etc."></textarea></div><div class="on-full"><label>Materiais / recursos</label><textarea id="ofMaterials" placeholder="Descreva os materiais incluídos."></textarea></div><div class="on-full"><label>Foto de capa</label><input id="ofCover" type="file" accept="image/png,image/jpeg,image/webp"><small class="on-v2-form-help">Máximo recomendado: 2 MB.</small></div><button class="on-btn on-full">Enviar programa para aprovação</button></form></div>`;return}box.innerHTML=`<div class="on-v2-card"><h3>Meu programa</h3><div class="on-v2-note">Estado atual: ${statusTag(o.status)}${o.adminReason?`<br><strong>Observação do administrador:</strong> ${esc(o.adminReason)}`:''}</div><div class="on-v2-grid"><div><strong>${esc(o.name)}</strong><p>${esc(o.description)}</p></div><div><p>Nível: ${esc(o.level)}<br>Modalidade: ${esc(o.mode)}<br>Duração: ${o.duration} min · ${o.monthClasses} aulas/mês</p><p>Inscrição: <strong>${fmt(o.enrollmentFee)}</strong><br>Mensalidade: <strong>${fmt(o.monthlyFee)}</strong></p></div></div><div class="on-v2-actions"><button class="on-v2-btn" onclick="editTeacherOffer()">Editar programa</button>${o.status==='approved'?`<button class="on-v2-btn alt" onclick="toggleOffer('${o.id}')">${o.status==='paused'?'Reativar':'Pausar'} publicação</button>`:''}</div></div>`}
function editTeacherOffer(){let o=teacherOffer();if(!o)return;const box=document.getElementById('teacherProgramBox');box.innerHTML=`<div class="on-v2-card"><h3>Editar programa</h3><form class="on-form" onsubmit="updateTeacherOffer(event)"><div class="on-full"><label>Nome</label><input id="ofName" required value="${esc(o.name)}"></div><div class="on-full"><label>Descrição</label><textarea id="ofDesc" required>${esc(o.description)}</textarea></div><div><label>Nível</label><select id="ofLevel"><option ${o.level==='Iniciante'?'selected':''}>Iniciante</option><option ${o.level==='Intermédio'?'selected':''}>Intermédio</option><option ${o.level==='Avançado'?'selected':''}>Avançado</option></select></div><div><label>Modalidade</label><select id="ofMode"><option>Online</option><option>Presencial</option><option>Online e presencial</option></select></div><div><label>Duração (min)</label><input id="ofDuration" type="number" min="15" value="${o.duration}"></div><div><label>Aulas/mês</label><input id="ofMonthClasses" type="number" min="1" value="${o.monthClasses}"></div><div><label>Inscrição (Kz)</label><input id="ofEnrollFee" type="number" min="0" value="${o.enrollmentFee}"></div><div><label>Mensalidade (Kz)</label><input id="ofMonthly" type="number" min="0" value="${o.monthlyFee}"></div><div><label>Máx. alunos</label><input id="ofMax" type="number" min="1" value="${o.maxStudents}"></div><div><label>Link / sala</label><input id="ofRoom" value="${esc(o.room||'')}"></div><div class="on-full"><label>Regras</label><textarea id="ofRules">${esc(o.rules||'')}</textarea></div><div class="on-full"><label>Materiais</label><textarea id="ofMaterials">${esc(o.materials||'')}</textarea></div><div class="on-full"><label>Nova capa (opcional)</label><input id="ofCover" type="file" accept="image/png,image/jpeg,image/webp"></div><button class="on-btn on-full">Guardar alterações e reenviar para aprovação</button></form></div>`}
async function saveTeacherOffer(e){e.preventDefault();if(onUser.status==='suspended')return alert('A conta está suspensa.');try{let cover=await saveBase64File(document.getElementById('ofCover'),2),a=og(OK.O);if(a.some(x=>x.teacher===onUser.id))return alert('Já existe um programa. Use Editar programa.');let o={id:oid('offer'),teacher:onUser.id,name:ofName.value.trim(),description:ofDesc.value.trim(),level:ofLevel.value,mode:ofMode.value,duration:+ofDuration.value,monthClasses:+ofMonthClasses.value,enrollmentFee:+ofEnrollFee.value||0,monthlyFee:+ofMonthly.value||0,maxStudents:+ofMax.value||20,room:ofRoom.value.trim(),rules:ofRules.value.trim(),materials:ofMaterials.value.trim(),cover, status:'pending',createdAt:new Date().toISOString()};a.push(o);os(OK.O,a);alert('Programa enviado ao administrador para aprovação.');renderOn()}catch(err){alert(err.message)}}
async function updateTeacherOffer(e){e.preventDefault();let a=og(OK.O),o=a.find(x=>x.teacher===onUser.id);if(!o)return;try{let cover=await saveBase64File(document.getElementById('ofCover'),2);Object.assign(o,{name:ofName.value.trim(),description:ofDesc.value.trim(),level:ofLevel.value,mode:ofMode.value,duration:+ofDuration.value,monthClasses:+ofMonthClasses.value,enrollmentFee:+ofEnrollFee.value||0,monthlyFee:+ofMonthly.value||0,maxStudents:+ofMax.value||20,room:ofRoom.value.trim(),rules:ofRules.value.trim(),materials:ofMaterials.value.trim(),status:'pending',adminReason:'',updatedAt:new Date().toISOString()});if(cover)o.cover=cover;os(OK.O,a);alert('Alterações guardadas e reenviadas para aprovação.');renderOn()}catch(err){alert(err.message)}}
function toggleOffer(id){let a=og(OK.O),o=a.find(x=>x.id===id);if(!o)return;o.status=o.status==='paused'?'approved':'paused';os(OK.O,a);renderOn()}
function renderTeacherSchedule(o){const box=document.getElementById('teacherScheduleBox');box.innerHTML=`<div class="on-v2-card"><h3>Publicar horário</h3><div class="on-v2-note">Os horários pertencem ao seu programa aprovado. O aluno só poderá utilizá-los depois de ter uma matrícula ativa.</div><form class="on-form" onsubmit="addSlotV2(event)"><div><label>Data</label><input id="slotDate" type="date" required></div><div><label>Hora</label><input id="slotTime" type="time" required></div><div><label>Duração</label><input id="slotDuration" type="number" min="15" value="${o?.duration||60}" required></div><div><label>Preço avulso (Kz)</label><input id="slotPrice" type="number" min="0" value="0"></div><div class="on-full"><label>Observação</label><input id="slotNote"></div><button class="on-btn on-full" ${!o||o.status!=='approved'?'disabled':''}>Adicionar horário</button></form></div><div class="on-v2-card"><h3>Horários publicados</h3><div id="slotList"></div></div>`;let myS=og(OK.SL).filter(x=>x.teacher===onUser.id);slotList.innerHTML=myS.length?myS.map(x=>`<div class="on-v2-card"><strong>${esc(x.date)} · ${esc(x.time)}</strong><p>${x.duration} min · ${fmt(x.price)} · ${esc(x.note||'')}</p>${statusTag(x.status)} ${x.status==='free'?`<button class="on-v2-btn" onclick="assignSlotV2('${x.id}')">Atribuir aluno</button>`:''} <button class="on-v2-btn danger" onclick="deleteSlotV2('${x.id}')">Eliminar</button></div>`).join(''):'<div class="on-v2-empty">Nenhum horário publicado.</div>'}
function addSlotV2(e){e.preventDefault();let o=teacherOffer();if(!o||o.status!=='approved')return alert('O programa precisa de ser aprovado antes de publicar horários.');let a=og(OK.SL);a.push({id:oid('slot'),teacher:onUser.id,offer:o.id,date:slotDate.value,time:slotTime.value,duration:+slotDuration.value,price:+slotPrice.value||0,note:slotNote.value,status:'free',createdAt:new Date().toISOString()});os(OK.SL,a);e.target.reset();renderOn();alert('Horário publicado.')}
function assignSlotV2(id){let slot=og(OK.SL).find(x=>x.id===id),students=og(OK.E).filter(e=>e.teacher===onUser.id&&e.status==='active');if(!slot||slot.status!=='free')return alert('Este horário não está disponível.');if(!students.length)return alert('Ainda não existem alunos com matrícula ativa.');onModalBody.innerHTML=`<div class="on-v2-card"><h3>Atribuir aula</h3><p>${esc(slot.date)} · ${esc(slot.time)} · ${slot.duration} min</p><select id="assignEnrollment" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:10px">${students.map(e=>`<option value="${e.id}">${esc(e.studentName)} · ${esc(e.offerName)}</option>`).join('')}</select><div class="on-v2-actions"><button class="on-v2-btn" onclick="confirmAssignSlotV2('${id}')">Confirmar</button></div></div>`;onModal.classList.add('show')}
function confirmAssignSlotV2(id){let slots=og(OK.SL),slot=slots.find(x=>x.id===id),en=og(OK.E).find(x=>x.id===assignEnrollment.value);if(!slot||!en)return;let t=onUser,classes=og(OK.C);if(classes.some(c=>c.slotId===id))return alert('Este horário já foi atribuído.');classes.push({id:oid('class'),slotId:id,enrollment:en.id,teacher:onUser.id,teacherName:onUser.name,student:en.student,studentName:en.studentName,offer:en.offer,offerName:en.offerName,date:slot.date,time:slot.time,duration:slot.duration,price:slot.price,done:false,attendance:false,meeting:'https://meet.jit.si/APSAN-'+id});slot.status='assigned';os(OK.SL,slots);os(OK.C,classes);closeOnModal();renderOn();alert('Aula atribuída ao aluno.')}
function deleteSlotV2(id){let a=og(OK.SL),x=a.find(v=>v.id===id);if(x?.status!=='free')return alert('Este horário já está reservado e não pode ser eliminado.');os(OK.SL,a.filter(v=>v.id!==id));renderOn()}
function renderTeacherClasses(myC){classList.innerHTML=myC.length?myC.map(c=>`<div class="on-v2-card"><strong>${datePT(c.date)} · ${esc(c.time)}</strong><p>Aluno: ${esc(c.studentName)} · ${c.duration} min · ${fmt(c.price)}</p><p>${statusTag(c.attendance?'completed':'active')}</p><div class="on-v2-actions"><button class="on-v2-btn" onclick="meetingV2('${c.id}')">Sala online</button><button class="on-v2-btn alt" onclick="markAttendanceV2('${c.id}')">${c.attendance?'Presença registada':'Registar presença'}</button></div></div>`).join(''):'<div class="on-v2-empty">Nenhuma aula marcada por enquanto.</div>'}
function renderTeacherStudents(myE){studentList.innerHTML=myE.length?myE.map(e=>{let st=og(OK.S).find(x=>x.id===e.student);return `<div class="on-v2-card"><strong>${esc(st?.name||e.studentName)}</strong><p>${esc(e.offerName)} · Matrícula desde ${datePT(e.approvedAt)}</p><p>${statusTag(e.status)}</p></div>`}).join(''):'<div class="on-v2-empty">Os alunos só aparecem aqui depois de uma matrícula aprovada.</div>'}
function renderTeacherMaterials(myC){let a=og(OK.M).filter(x=>x.teacher===onUser.id);materialList.innerHTML=`<div class="on-v2-card"><h3>Adicionar material</h3><form class="on-form" onsubmit="addMaterialV2(event)"><div class="on-full"><label>Título</label><input id="matTitle" required></div><div><label>Link</label><input id="matUrl" type="url" placeholder="https://..." required></div><div><label>Aula</label><select id="matClass">${myC.map(c=>`<option value="${c.id}">${datePT(c.date)} · ${esc(c.studentName)}</option>`).join('')}</select></div><button class="on-btn on-full" ${!myC.length?'disabled':''}>Adicionar material</button></form></div><div class="on-v2-card"><h3>Materiais publicados</h3>${a.length?a.map(m=>`<p><strong>${esc(m.title)}</strong> · <a href="${esc(m.url)}" target="_blank" rel="noopener">Abrir</a></p>`).join(''):'<div class="on-v2-empty">Nenhum material publicado.</div>'}</div>`}
function addMaterialV2(e){e.preventDefault();let a=og(OK.M);a.push({id:oid('mat'),teacher:onUser.id,classId:matClass.value,title:matTitle.value.trim(),url:matUrl.value.trim(),createdAt:new Date().toISOString()});os(OK.M,a);e.target.reset();renderOn();alert('Material adicionado.')}
function renderTeacherFinance(){let tx=og(OK.TX).filter(x=>x.teacher===onUser.id),po=og(OK.PO).filter(x=>x.teacher===onUser.id),net=tx.reduce((a,x)=>a+Number(x.net||0),0),paid=po.filter(x=>x.status!=='rejected'&&x.status!=='cancelled').reduce((a,x)=>a+Number(x.amount||0),0),available=net-paid;teacherFinanceBox.innerHTML=`<div class="on-v2-card"><h3>Carteira do professor</h3><div class="on-v2-kpis"><div class="on-v2-kpi"><small>Bruto</small><strong>${fmt(tx.reduce((a,x)=>a+Number(x.gross||0),0))}</strong></div><div class="on-v2-kpi"><small>Comissões</small><strong>${fmt(tx.reduce((a,x)=>a+Number(x.fee||0),0))}</strong></div><div class="on-v2-kpi"><small>Líquido</small><strong>${fmt(net)}</strong></div><div class="on-v2-kpi"><small>Disponível</small><strong>${fmt(available)}</strong></div></div><p>Comissão atual da plataforma: <strong>${onlineCfg().commissionRate}%</strong>.</p></div><div class="on-v2-card"><h3>Dados para receber</h3><form class="on-form" onsubmit="saveTeacherBank(event)"><div><label>Titular</label><input id="bankHolder" required value="${esc(onUser.bank?.holder||'')}"></div><div><label>Banco</label><input id="bankName" required value="${esc(onUser.bank?.bank||'')}"></div><div><label>IBAN</label><input id="bankIban" required value="${esc(onUser.bank?.iban||'')}"></div><div><label>Express (opcional)</label><input id="bankExpress" value="${esc(onUser.bank?.express||'')}"></div><button class="on-btn on-full">Guardar dados</button></form><div class="on-v2-actions"><button class="on-v2-btn" onclick="requestTeacherPayout()" ${available<=0?'disabled':''}>Solicitar saque de ${fmt(available)}</button></div></div><div class="on-v2-card"><h3>Histórico</h3>${po.length?po.map(x=>`<p>${datePT(x.createdAt)} · ${fmt(x.amount)} · ${statusTag(x.status)}</p>`).join(''):'<div class="on-v2-empty">Nenhum saque solicitado.</div>'}</div>`}
function saveTeacherBank(e){e.preventDefault();let a=og(OK.T),u=a.find(x=>x.id===onUser.id);u.bank={holder:bankHolder.value.trim(),bank:bankName.value.trim(),iban:bankIban.value.trim(),express:bankExpress.value.trim()};os(OK.T,a);onUser=u;alert('Dados bancários guardados.');renderOn()}
function requestTeacherPayout(){let tx=og(OK.TX).filter(x=>x.teacher===onUser.id),po=og(OK.PO).filter(x=>x.teacher===onUser.id),net=tx.reduce((a,x)=>a+Number(x.net||0),0),paid=po.filter(x=>x.status!=='rejected'&&x.status!=='cancelled').reduce((a,x)=>a+Number(x.amount||0),0),available=net-paid;if(available<=0)return alert('Não existe saldo disponível.');if(!onUser.bank?.iban&&!onUser.bank?.express)return alert('Preencha primeiro os dados para receber.');let a=og(OK.PO);a.push({id:oid('payout'),teacher:onUser.id,teacherName:onUser.name,amount:available,details:onUser.bank,status:'requested',createdAt:new Date().toISOString()});os(OK.PO,a);alert('Pedido de saque enviado ao administrador.');renderOn()}
function renderTeacherProfile(){profileBox.innerHTML=`<div class="on-v2-card"><h3>Perfil profissional</h3><form class="on-form" onsubmit="saveProfileV2(event)"><div><label>Nome completo</label><input id="pName" required value="${esc(onUser.name)}"></div><div><label>Telefone</label><input id="pPhone" required value="${esc(onUser.phone)}"></div><div><label>E-mail</label><input id="pEmail" type="email" value="${esc(onUser.email||'')}"></div><div><label>Especialidade</label><input id="pSub" value="${esc(onUser.sub||'')}"></div><div class="on-full"><label>Biografia profissional</label><textarea id="pBio">${esc(onUser.bio||'')}</textarea></div><div class="on-full"><label>Qualificações / experiência</label><textarea id="pQual">${esc(onUser.qualifications||'')}</textarea></div><div class="on-full"><label>Foto de perfil</label><input id="pPhoto" type="file" accept="image/png,image/jpeg,image/webp"></div><button class="on-btn on-full">Guardar perfil</button></form></div>`}
async function saveProfileV2(e){e.preventDefault();let a=og(OK.T),u=a.find(x=>x.id===onUser.id);u.name=pName.value.trim();u.phone=pPhone.value.trim();u.email=pEmail.value.trim();u.sub=pSub.value.trim();u.bio=pBio.value.trim();u.qualifications=pQual.value.trim();try{let img=await saveBase64File(document.getElementById('pPhoto'),2);if(img)u.photo=img}catch(err){return alert(err.message)}os(OK.T,a);onUser=u;document.getElementById('onUser').textContent=u.name;alert('Perfil atualizado.');renderOn()}
function renderStudentV2(){let en=og(OK.E).filter(x=>x.student===onUser.id),pay=og(OK.P).filter(x=>x.student===onUser.id),invoices=og(OK.I).filter(x=>x.student===onUser.id);updateInvoiceStates(invoices);let overdueByEnrollment=new Set(invoices.filter(x=>x.status==='overdue').map(x=>x.enrollment)),active=en.filter(x=>x.status==='active'&&!overdueByEnrollment.has(x.id)),overdue=invoices.filter(x=>x.status==='overdue').length;onStats.innerHTML=`<div class="on-v2-kpi"><small>Matrículas</small><strong>${active.length}</strong></div><div class="on-v2-kpi"><small>Pagamentos</small><strong>${pay.filter(x=>x.status==='approved').length}</strong></div><div class="on-v2-kpi"><small>Em atraso</small><strong>${overdue}</strong></div><div class="on-v2-kpi"><small>Acesso</small><strong>${active.length&&!overdue?'Ativo':'Limitado'}</strong></div>`;onHomeBox.innerHTML=`<div class="on-v2-card"><h3>Olá, ${esc(onUser.name)}</h3><p>${active.length?'Tem acesso às suas matrículas ativas.':'Ainda não tem uma matrícula ativa.'}</p>${overdue?`<div class="on-v2-alert warn">Existe pelo menos uma mensalidade em atraso. Regularize o pagamento para evitar suspensão.</div>`:''}<div class="on-v2-actions"><button class="on-v2-btn" onclick="onTab('find',document.querySelector('#onStudentNav button:nth-child(2)'))">Procurar professores</button><button class="on-v2-btn alt" onclick="onTab('payments',document.querySelector('#onStudentNav button:nth-child(4)'))">Ver pagamentos</button></div></div>`;renderStudentFind();renderStudentClasses(active);renderStudentPayments();renderStudentMaterials(active);renderStudentProgress(active);renderStudentProfile()}
function renderStudentFind(){let offers=og(OK.O).filter(o=>o.status==='approved'&&o.ownerType!=='institution'),teachers=og(OK.T),institutions=og(OK.IN);teacherList.innerHTML=offers.length?offers.map(o=>{let t=teachers.find(x=>x.id===o.teacher),inst=institutions.find(x=>x.id===o.institution);let count=og(OK.E).filter(e=>e.offer===o.id&&e.status==='active').length;return `<div class="on-v2-offer"><div class="on-v2-cover">${o.cover?`<img src="${o.cover}" alt="">`:'<i class="fa-solid fa-chalkboard-user" style="font-size:3rem"></i>'}</div><div class="on-v2-offer-body"><h3>${esc(o.name)}</h3><p><strong>${o.ownerType==='institution'?'Instituição':'Professor'}:</strong> ${esc(o.ownerType==='institution'?(inst?.name||o.institutionName||''):(t?.name||''))}</p><p>${esc(o.description)}</p><p>${esc(o.level)} · ${esc(o.mode)} · ${o.duration} min · ${o.monthClasses} aulas/mês</p><p class="on-v2-price">Inscrição: ${fmt(o.enrollmentFee)} · Mensalidade: ${fmt(o.monthlyFee)}</p><p>${count} aluno(s) ativo(s)</p><button class="on-v2-btn" onclick="openOfferV2('${o.id}')">Ver programa / Inscrever-me</button></div></div>`}).join(''):'<div class="on-v2-empty">Ainda não existem professores/programas aprovados. Eles aparecerão aqui depois do registo e aprovação.</div>'}
function openOfferV2(id){let o=og(OK.O).find(x=>x.id===id),t=og(OK.T).find(x=>x.id===o?.teacher),inst=og(OK.IN).find(x=>x.id===o?.institution);if(!o||(!t&&!inst))return;let already=og(OK.E).some(e=>e.student===onUser.id&&e.offer===id&&['pending_payment','payment_submitted','under_review','active'].includes(e.status));onModalBody.innerHTML=`<div class="on-v2-card"><div class="on-v2-profile"><div class="on-v2-avatar">${t.photo?`<img src="${t.photo}" alt="">`:'<i class="fa-solid fa-user-tie"></i>'}</div><div><h2>${esc(o.ownerType==='institution'?(inst?.name||o.institutionName||'Instituição'):(t?.name||''))}</h2><p>${esc(t.sub||'Professor')}</p><p>${esc(t.bio||'')}</p><p><strong>Qualificações:</strong> ${esc(t.qualifications||'Não informado')}</p></div></div><hr><h3>${esc(o.name)}</h3><p>${esc(o.description)}</p><p>${esc(o.rules||'Sem regras informadas.')}</p><p><strong>Primeiro pagamento:</strong> ${fmt(Number(o.enrollmentFee)+Number(o.monthlyFee))} (inscrição + 1ª mensalidade).</p>${already?`<div class="on-v2-alert warn">Já existe uma matrícula sua neste programa em análise ou ativa.</div>`:`<button class="on-v2-btn" onclick="startEnrollmentV2('${o.id}')">Inscrever-me</button>`}</div>`;onModal.classList.add('show')}
function startEnrollmentV2(id){let o=og(OK.O).find(x=>x.id===id);if(!o)return;onModalBody.innerHTML=`<div class="on-v2-card"><h3>Inscrição em ${esc(o.name)}</h3><p>Valor da inscrição: <strong>${fmt(o.enrollmentFee)}</strong><br>1ª mensalidade: <strong>${fmt(o.monthlyFee)}</strong><br><strong>Total a pagar agora: ${fmt(Number(o.enrollmentFee)+Number(o.monthlyFee))}</strong></p><form class="on-form" onsubmit="submitEnrollmentPayment(event,'${o.id}')"><div><label>Método de pagamento *</label><select id="enrollMethod" required><option>Transferência bancária</option><option>Express</option></select></div><div class="on-full"><label>Comprovativo *</label><input id="enrollProof" type="file" accept="image/png,image/jpeg,application/pdf" required><small class="on-v2-form-help">Máximo 2 MB. O administrador irá verificar antes de ativar o acesso.</small></div><div class="on-full"><label>Observação</label><textarea id="enrollNote" placeholder="Opcional"></textarea></div><button class="on-btn on-full">Enviar pagamento para análise</button></form></div>`}
async function submitEnrollmentPayment(e,offerId){e.preventDefault();let o=og(OK.O).find(x=>x.id===offerId),t=og(OK.T).find(x=>x.id===o.teacher),inst=og(OK.IN).find(x=>x.id===o.institution),total=Number(o.enrollmentFee)+Number(o.monthlyFee);try{let proof=await saveBase64File(document.getElementById('enrollProof'),2);let pay={id:oid('pay'),type:'enrollment',student:onUser.id,studentName:onUser.name,teacher:o.teacher,teacherName:t?.name||'',institution:o.institution||'',institutionName:inst?.name||o.institutionName||'',offer:offerId,offerName:o.name,amount:total,method:enrollMethod.value,proof,note:enrollNote.value.trim(),status:'under_review',createdAt:new Date().toISOString()};let pa=og(OK.P);pa.push(pay);os(OK.P,pa);let ea=og(OK.E);ea.push({id:oid('enroll'),student:onUser.id,studentName:onUser.name,teacher:o.teacher,teacherName:t?.name||'',institution:o.institution||'',institutionName:inst?.name||o.institutionName||'',offer:offerId,offerName:o.name,enrollmentFee:o.enrollmentFee,monthlyFee:o.monthlyFee,paymentId:pay.id,status:'under_review',createdAt:new Date().toISOString()});os(OK.E,ea);closeOnModal();renderOn();alert('Pagamento enviado. Aguarde a confirmação do administrador. Até lá não terá acesso às aulas/materiais.')}catch(err){alert(err.message)}}
function renderStudentClasses(active){classList.innerHTML=active.length?active.map(e=>{let c=og(OK.C).filter(x=>x.enrollment===e.id);return `<div class="on-v2-card"><strong>${esc(e.offerName)}</strong><p>Professor: ${esc(e.teacherName)}</p>${c.length?c.map(x=>`<p>${datePT(x.date)} · ${esc(x.time)} · ${x.duration} min ${x.attendance?'· Presença registada':''} <button class="on-v2-btn" onclick="meetingV2('${x.id}')">Sala</button></p>`).join(''):'<p>O professor ainda não marcou aulas para esta matrícula.</p>'}</div>`}).join(''):'<div class="on-v2-empty">Sem aulas ativas. Primeiro é necessário ter um pagamento confirmado.</div>'}
function updateInvoiceStates(inv){let changed=false,now=Date.now(),grace=Number(onlineCfg().graceDays||3);inv.forEach(x=>{if(x.status==='pending'&&new Date(x.dueDate).getTime()+grace*86400000<now){x.status='overdue';changed=true}});if(changed)os(OK.I,inv)}
function renderStudentPayments(){let p=og(OK.P).filter(x=>x.student===onUser.id),i=og(OK.I).filter(x=>x.student===onUser.id);studentPayments.innerHTML=`<div class="on-v2-card"><h3>Histórico de pagamentos</h3>${p.length?p.map(x=>`<div class="on-v2-card"><strong>${esc(x.offerName)}</strong><p>${datePT(x.createdAt)} · ${fmt(x.amount)} · ${statusTag(x.status)}</p>${x.adminReason?`<p>Motivo: ${esc(x.adminReason)}</p>`:''}</div>`).join(''):'<div class="on-v2-empty">Nenhum pagamento registado.</div>'}</div><div class="on-v2-card"><h3>Mensalidades</h3>${i.length?i.map(x=>`<div class="on-v2-card"><strong>${esc(x.offerName)}</strong><p>Vencimento: ${datePT(x.dueDate)} · ${fmt(x.amount)} · ${statusTag(x.status)}</p>${x.status==='overdue'||x.status==='pending'?`<button class="on-v2-btn" onclick="payMonthlyV2('${x.id}')">Enviar comprovativo</button>`:''}</div>`).join(''):'<div class="on-v2-empty">As mensalidades futuras serão criadas após a primeira matrícula aprovada.</div>'}</div>`}
function payMonthlyV2(id){let i=og(OK.I).find(x=>x.id===id);if(!i)return;onModalBody.innerHTML=`<div class="on-v2-card"><h3>Pagamento mensal</h3><p>${esc(i.offerName)} · ${fmt(i.amount)} · vencimento ${datePT(i.dueDate)}</p><form class="on-form" onsubmit="submitMonthlyPayment(event,'${id}')"><div><label>Método</label><select id="monthlyMethod"><option>Transferência bancária</option><option>Express</option></select></div><div class="on-full"><label>Comprovativo *</label><input id="monthlyProof" type="file" accept="image/png,image/jpeg,application/pdf" required></div><button class="on-btn on-full">Enviar para análise</button></form></div>`}
async function submitMonthlyPayment(e,id){e.preventDefault();let i=og(OK.I).find(x=>x.id===id),en=og(OK.E).find(x=>x.id===i.enrollment);try{let proof=await saveBase64File(document.getElementById('monthlyProof'),2),p={id:oid('pay'),type:'monthly',invoice:id,enrollment:i.enrollment,student:onUser.id,studentName:onUser.name,teacher:i.teacher,teacherName:i.teacherName,offer:i.offer,offerName:i.offerName,amount:i.amount,method:monthlyMethod.value,proof,status:'under_review',createdAt:new Date().toISOString()};let pa=og(OK.P);pa.push(p);os(OK.P,pa);i.paymentId=p.id;i.status='under_review';os(OK.I,og(OK.I));closeOnModal();renderOn();alert('Comprovativo enviado para análise.')}catch(err){alert(err.message)}}
function renderStudentMaterials(active){let ids=active.map(x=>x.id),a=og(OK.M).filter(m=>{let c=og(OK.C).find(x=>x.id===m.classId);return c&&ids.includes(c.enrollment)});materialList.innerHTML=a.length?a.map(m=>`<div class="on-v2-card"><strong>${esc(m.title)}</strong><p><a href="${esc(m.url)}" target="_blank" rel="noopener">Abrir material</a></p></div>`).join(''):'<div class="on-v2-empty">Materiais disponíveis apenas para matrículas ativas.</div>'}
function renderStudentProgress(active){let c=og(OK.C).filter(x=>active.some(e=>e.id===x.enrollment)),done=c.filter(x=>x.attendance).length;progressBox.innerHTML=`<div class="on-v2-card"><h3>Resumo</h3><p>${done} de ${c.length} aulas com presença registada.</p><p>Taxa de presença: <strong>${c.length?Math.round(done/c.length*100):0}%</strong></p></div>`}
function renderStudentProfile(){profileBox.innerHTML=`<div class="on-v2-card"><h3>Meu perfil</h3><form class="on-form" onsubmit="saveStudentProfile(event)"><div><label>Nome</label><input id="pName" required value="${esc(onUser.name)}"></div><div><label>Telefone</label><input id="pPhone" required value="${esc(onUser.phone)}"></div><div><label>E-mail</label><input id="pEmail" type="email" value="${esc(onUser.email||'')}"></div><div class="on-full"><label>Objetivos de aprendizagem</label><textarea id="pBio">${esc(onUser.bio||'')}</textarea></div><button class="on-btn on-full">Guardar</button></form></div>`}
function saveStudentProfile(e){e.preventDefault();let a=og(OK.S),u=a.find(x=>x.id===onUser.id);Object.assign(u,{name:pName.value.trim(),phone:pPhone.value.trim(),email:pEmail.value.trim(),bio:pBio.value.trim()});os(OK.S,a);onUser=u;document.getElementById('onUser').textContent=u.name;alert('Perfil atualizado.');renderOn()}
function meetingV2(id){let c=og(OK.C).find(x=>x.id===id);if(!c)return;onModalBody.innerHTML=`<div class="on-v2-card"><h3>Sala online</h3><p>${datePT(c.date)} · ${esc(c.time)}</p><a class="on-v2-btn" href="${esc(c.meeting)}" target="_blank" rel="noopener">Entrar na sala</a></div>`;onModal.classList.add('show')}
function markAttendanceV2(id){let a=og(OK.C),c=a.find(x=>x.id===id);if(!c)return;c.attendance=true;c.attendanceAt=new Date().toISOString();os(OK.C,a);renderOn()}
function closeOnModal(){onModal.classList.remove('show')}

/* ===== INSTITUIÇÕES DE ENSINO ===== */
function institutionPrograms(){return og(OK.O).filter(x=>x.ownerType==='institution'&&x.institution===onUser.id)}
function renderInstitutionV2(){let inst=onUser, offers=institutionPrograms(), en=og(OK.E).filter(x=>x.institution===inst.id), teachers=og(OK.T).filter(x=>x.institution===inst.id), students=og(OK.S).filter(x=>x.institution===inst.id), classes=og(OK.C).filter(x=>x.institution===inst.id), tx=og(OK.TX).filter(x=>x.institution===inst.id), paid=og(OK.PO).filter(x=>x.institution===inst.id&&x.status==='completed').reduce((a,x)=>a+Number(x.amount||0),0), gross=tx.reduce((a,x)=>a+Number(x.gross||0),0), net=tx.reduce((a,x)=>a+Number(x.net||0),0);onStats.innerHTML=`<div class="on-v2-kpi"><small>Instituição</small><strong>${statusTag(inst.status)}</strong></div><div class="on-v2-kpi"><small>Cursos</small><strong>${offers.length}</strong></div><div class="on-v2-kpi"><small>Professores</small><strong>${teachers.length}</strong></div><div class="on-v2-kpi"><small>Alunos</small><strong>${students.length}</strong></div><div class="on-v2-kpi"><small>Saldo líquido</small><strong>${fmt(net-paid)}</strong></div>`;onHomeBox.innerHTML=`<div class="on-v2-card"><h3>Olá, ${esc(inst.name)}</h3><p>${inst.status==='pending'?'A documentação da instituição está em análise pela APSAN. Enquanto não for aprovada, os cursos não ficam públicos.':inst.status==='approved'?'Instituição aprovada. Pode gerir cursos, professores, turmas e alunos.':'Estado: '+esc(inst.status)}</p><div class="on-v2-actions"><button class="on-v2-btn" onclick="onTab('instprograms',document.querySelector('#onInstitutionNav button:nth-child(2)'))">Gerir cursos</button><button class="on-v2-btn alt" onclick="onTab('instprofile',document.querySelector('#onInstitutionNav button:nth-child(7)'))">Ver documentação</button></div></div>`;renderInstitutionPrograms();renderInstitutionTeachers();renderInstitutionStudents();renderInstitutionClasses();renderInstitutionFinance();renderInstitutionProfile()}
function renderInstitutionPrograms(){let box=document.getElementById('institutionProgramsBox'),a=institutionPrograms();box.innerHTML=`<div class="on-v2-card"><h3>Novo curso / programa</h3>${onUser.status!=='approved'?'<div class="on-v2-alert warn">A instituição precisa ser aprovada pela APSAN antes de publicar cursos.</div>':''}<form class="on-form" onsubmit="saveInstitutionProgram(event)"><div class="on-full"><label>Nome do curso</label><input id="ipName" required></div><div class="on-full"><label>Descrição</label><textarea id="ipDesc" required></textarea></div><div><label>Nível</label><select id="ipLevel"><option>Iniciante</option><option>Intermédio</option><option>Avançado</option></select></div><div><label>Modalidade</label><select id="ipMode"><option>Online</option><option>Presencial</option><option>Híbrido</option></select></div><div><label>Duração por aula (min)</label><input id="ipDuration" type="number" value="60" min="15"></div><div><label>Aulas por mês</label><input id="ipMonth" type="number" value="8" min="1"></div><div><label>Inscrição (Kz)</label><input id="ipEnroll" type="number" value="0" min="0"></div><div><label>Mensalidade (Kz)</label><input id="ipMonthly" type="number" value="0" min="0"></div><div><label>Máx. alunos</label><input id="ipMax" type="number" value="30" min="1"></div><div class="on-full"><label>Regras / observações</label><textarea id="ipRules"></textarea></div><button class="on-btn on-full" ${onUser.status!=='approved'?'disabled':''}>Enviar curso para aprovação</button></form></div><div class="on-v2-card"><h3>Meus cursos</h3>${a.length?a.map(o=>`<div class="on-v2-card"><strong>${esc(o.name)}</strong><p>${esc(o.description)}</p><p>${statusTag(o.status)} · ${fmt(o.monthlyFee)}/mês</p></div>`).join(''):'<div class="on-v2-empty">Nenhum curso criado.</div>'}</div>`}
function saveInstitutionProgram(e){e.preventDefault();if(onUser.status!=='approved')return alert('A instituição ainda não foi aprovada pela APSAN.');let a=og(OK.O);a.push({id:oid('offer'),ownerType:'institution',institution:onUser.id,institutionName:onUser.name,teacher:'',name:ipName.value.trim(),description:ipDesc.value.trim(),level:ipLevel.value,mode:ipMode.value,duration:+ipDuration.value||60,monthClasses:+ipMonth.value||1,enrollmentFee:+ipEnroll.value||0,monthlyFee:+ipMonthly.value||0,maxStudents:+ipMax.value||30,rules:ipRules.value.trim(),status:'pending',createdAt:new Date().toISOString()});os(OK.O,a);alert('Curso enviado para aprovação da APSAN.');renderOn()}
function renderInstitutionTeachers(){let b=document.getElementById('institutionTeachersBox'),a=og(OK.T).filter(x=>x.institution===onUser.id);b.innerHTML=`<div class="on-v2-card"><h3>Professores da instituição</h3><p>Professores podem ser associados à instituição para depois serem distribuídos pelas turmas.</p>${a.length?a.map(t=>`<div class="on-v2-card"><strong>${esc(t.name)}</strong><p>${esc(t.sub||'')}</p>${statusTag(t.status)}</div>`).join(''):'<div class="on-v2-empty">Ainda não existem professores associados.</div>'}</div>`}
function renderInstitutionStudents(){let b=document.getElementById('institutionStudentsBox'),a=og(OK.S).filter(x=>x.institution===onUser.id);b.innerHTML=`<div class="on-v2-card"><h3>Alunos da instituição</h3>${a.length?a.map(x=>`<div class="on-v2-card"><strong>${esc(x.name)}</strong><p>${esc(x.email||x.phone||'')}</p>${statusTag(x.status)}</div>`).join(''):'<div class="on-v2-empty">Os alunos aparecerão aqui quando forem associados a cursos/turmas da instituição.</div>'}</div>`}
function renderInstitutionClasses(){let b=document.getElementById('institutionClassesBox'),a=og(OK.C).filter(x=>x.institution===onUser.id);b.innerHTML=`<div class="on-v2-card"><h3>Turmas e aulas</h3>${a.length?a.map(x=>`<div class="on-v2-card"><strong>${datePT(x.date)} · ${esc(x.time)}</strong><p>${esc(x.offerName||'Curso')} · ${esc(x.studentName||'Aluno')}</p>${statusTag(x.attendance?'completed':'active')}</div>`).join(''):'<div class="on-v2-empty">As aulas institucionais aparecerão aqui quando existirem matrículas e horários.</div>'}</div>`}
function renderInstitutionFinance(){let b=document.getElementById('institutionFinanceBox'),tx=og(OK.TX).filter(x=>x.institution===onUser.id),po=og(OK.PO).filter(x=>x.institution===onUser.id),gross=tx.reduce((a,x)=>a+Number(x.gross||0),0),fee=tx.reduce((a,x)=>a+Number(x.fee||0),0),paid=po.filter(x=>x.status==='completed').reduce((a,x)=>a+Number(x.amount||0),0);b.innerHTML=`<div class="on-v2-card"><h3>Financeiro institucional</h3><div class="on-v2-kpis"><div class="on-v2-kpi"><small>Bruto</small><strong>${fmt(gross)}</strong></div><div class="on-v2-kpi"><small>Comissão APSAN</small><strong>${fmt(fee)}</strong></div><div class="on-v2-kpi"><small>Pago</small><strong>${fmt(paid)}</strong></div><div class="on-v2-kpi"><small>Disponível</small><strong>${fmt(gross-fee-paid)}</strong></div></div></div>`}
function renderInstitutionProfile(){let b=document.getElementById('institutionProfileBox'),d=onUser.documents||{};b.innerHTML=`<div class="on-v2-card"><h3>Dados e documentação</h3><p><strong>Nome legal:</strong> ${esc(onUser.legalName||'-')}</p><p><strong>NIF:</strong> ${esc(onUser.nif||'-')}</p><p><strong>Tipo:</strong> ${esc(onUser.type||'-')} · <strong>Regime:</strong> ${esc(onUser.regime||'-')}</p><p><strong>Representante:</strong> ${esc(onUser.representative||'-')}</p><p><strong>Morada:</strong> ${esc(onUser.address||'-')}</p><p><strong>Estado:</strong> ${statusTag(onUser.status)}</p><p>Documento legal: ${d.legal?'Enviado':'Não enviado'} · Licença: ${d.license?'Enviada':'Não enviada'} · Adicional: ${d.other?'Enviado':'Não enviado'}</p><p><strong>Recebimentos:</strong> ${esc(onUser.bank||'-')} · ${esc(onUser.iban||onUser.express||'-')} · ${esc(onUser.holder||'-')}</p></div>`}


function renderInstitutionTeacherV2(){
  const inst=og(OK.IN).find(x=>x.id===onUser.institution);
  const offers=og(OK.O).filter(x=>x.ownerType==='institution'&&x.institution===onUser.institution&&x.status==='approved');
  const classes=og(OK.C).filter(x=>x.teacher===onUser.id&&x.institution===onUser.institution);
  const students=og(OK.S).filter(x=>x.institution===onUser.institution);
  const materials=og(OK.M).filter(x=>x.teacher===onUser.id);
  onStats.innerHTML=`<div class="on-v2-kpi"><small>Instituição</small><strong>${esc(inst?.legalName||inst?.name||'')}</strong></div><div class="on-v2-kpi"><small>Cursos</small><strong>${offers.length}</strong></div><div class="on-v2-kpi"><small>Alunos</small><strong>${students.length}</strong></div><div class="on-v2-kpi"><small>Aulas</small><strong>${classes.length}</strong></div>`;
  onHomeBox.innerHTML=`<div class="on-v2-card"><h3>Olá, ${esc(onUser.name)}</h3><p>Professor da instituição <strong>${esc(inst?.legalName||inst?.name||'-')}</strong>.</p><div class="on-v2-note">O professor institucional não cria uma conta de professor particular. O acesso está ligado exclusivamente à instituição.</div></div><div class="on-v2-card"><h3>As suas responsabilidades</h3><p>Consultar turmas atribuídas, preparar materiais, marcar presenças, acompanhar alunos e entrar nas salas virtuais.</p></div>`;
  const pbox=document.getElementById('teacherProgramBox');
  if(pbox)pbox.innerHTML=`<div class="on-v2-card"><h3>Disciplinas / cursos da instituição</h3>${offers.length?offers.map(o=>`<div class="on-v2-card"><strong>${esc(o.name)}</strong><p>${esc(o.description||'')}</p><p>${esc(o.level||'')} · ${esc(o.mode||'')} · ${o.duration||60} min</p></div>`).join(''):'<div class="on-v2-empty">A direção ainda não publicou cursos aprovados.</div>'}`;
  const sb=document.getElementById('teacherScheduleBox');
  if(sb)sb.innerHTML=`<div class="on-v2-card"><h3>Horários atribuídos</h3>${classes.length?classes.map(c=>`<div class="on-v2-card"><strong>${datePT(c.date)} · ${esc(c.time)}</strong><p>${esc(c.offerName||'Disciplina')} · ${esc(c.studentName||'Aluno')}</p>${statusTag(c.attendance?'completed':'active')} <button class="on-v2-btn" onclick="meeting('${c.id}')">Sala virtual</button>${!c.attendance?` <button class="on-v2-btn alt" onclick="doneClass('${c.id}')">Marcar presença</button>`:''}</div>`).join(''):'<div class="on-v2-empty">Nenhum horário/aula atribuído.</div>'}`;
  const cl=document.getElementById('classList');if(cl)cl.innerHTML=classes.length?classes.map(c=>classHtml(c,true)).join(''):'<div class="on-v2-empty">Nenhuma aula atribuída.</div>';
  const st=document.getElementById('studentList');if(st)st.innerHTML=students.length?students.map(s=>`<div class="on-item"><strong>${esc(s.name)}</strong><p>${esc(s.email||s.phone||'')} · ${statusTag(s.status)}</p></div>`).join(''):'<div class="on-v2-empty">Nenhum aluno associado.</div>';
  const mat=document.getElementById('materialList');if(mat)mat.innerHTML=materials.length?materials.map(m=>`<div class="on-item"><strong>${esc(m.title||'Material')}</strong><p>${esc(m.description||'')}</p>${m.url?`<a class="on-v2-btn" href="${esc(m.url)}" target="_blank">Abrir material</a>`:''}</div>`).join(''):'<div class="on-v2-empty">Ainda não existem materiais seus.</div>';
  renderInstitutionTeacherProfile();
}
function renderInstitutionTeacherProfile(){
  const box=document.getElementById('profileBox');if(!box)return;
  box.innerHTML=`<div class="on-v2-card"><h3>Perfil do professor institucional</h3><form class="on-form" onsubmit="saveInstitutionTeacherProfile(event)"><div><label>Nome</label><input id="itpName" required value="${esc(onUser.name)}"></div><div><label>Telefone</label><input id="itpPhone" required value="${esc(onUser.phone)}"></div><div><label>E-mail</label><input id="itpEmail" type="email" value="${esc(onUser.email||'')}"></div><div><label>Disciplina / especialidade</label><input id="itpSub" value="${esc(onUser.sub||'')}"></div><div class="on-full"><label>Biografia / experiência</label><textarea id="itpBio">${esc(onUser.bio||'')}</textarea></div><div class="on-full"><label>Qualificações</label><textarea id="itpQual">${esc(onUser.qualifications||'')}</textarea></div><button class="on-btn on-full">Guardar perfil</button></form></div>`;
}
function saveInstitutionTeacherProfile(e){e.preventDefault();let a=og(OK.T),u=a.find(x=>x.id===onUser.id);if(!u)return;u.name=itpName.value.trim();u.phone=itpPhone.value.trim();u.email=itpEmail.value.trim();u.sub=itpSub.value.trim();u.bio=itpBio.value.trim();u.qualifications=itpQual.value.trim();os(OK.T,a);onUser=u;document.getElementById('onUser').textContent=u.name;alert('Perfil atualizado.');renderOn()}

function renderInstitutionStudentV2(){
  const inst=og(OK.IN).find(x=>x.id===onUser.institution);
  const offers=og(OK.O).filter(x=>x.ownerType==='institution'&&x.institution===onUser.institution&&x.status==='approved');
  const en=og(OK.E).filter(x=>x.student===onUser.id&&x.institution===onUser.institution&&x.status==='active');
  const classes=og(OK.C).filter(x=>x.student===onUser.id&&x.institution===onUser.institution);
  onStats.innerHTML=`<div class="on-v2-kpi"><small>Instituição</small><strong>${esc(inst?.legalName||inst?.name||'')}</strong></div><div class="on-v2-kpi"><small>Disciplinas</small><strong>${offers.length}</strong></div><div class="on-v2-kpi"><small>Turmas</small><strong>${en.length}</strong></div><div class="on-v2-kpi"><small>Aulas</small><strong>${classes.length}</strong></div>`;
  onHomeBox.innerHTML=`<div class="on-v2-card"><h3>Olá, ${esc(onUser.name)}</h3><p>Aluno da instituição <strong>${esc(inst?.legalName||inst?.name||'-')}</strong>.</p><div class="on-v2-note">Esta área é exclusiva do seu percurso institucional. As aulas particulares ficam noutra conta/entrada.</div></div>`;
  const find=document.getElementById('teacherList');
  if(find)find.innerHTML=offers.length?offers.map(o=>`<div class="on-v2-offer"><div class="on-v2-cover"><i class="fa-solid fa-book-open" style="font-size:3rem"></i></div><div class="on-v2-offer-body"><h3>${esc(o.name)}</h3><p>${esc(o.description||'')}</p><p>${esc(o.level||'')} · ${esc(o.mode||'')} · ${o.duration||60} min · ${o.monthClasses||1} aulas/mês</p><button class="on-v2-btn" onclick="viewInstitutionCourseV2('${o.id}')">Ver disciplina</button></div></div>`).join(''):'<div class="on-v2-empty">A direção ainda não publicou disciplinas/cursos aprovados.</div>';
  const cl=document.getElementById('classList');if(cl)cl.innerHTML=classes.length?classes.map(c=>classHtml(c,false)).join(''):'<div class="on-v2-empty">Nenhuma aula agendada.</div>';
  const mat=document.getElementById('materialList');if(mat)mat.innerHTML=classes.flatMap(c=>og(OK.M).filter(m=>m.classId===c.id||m.offer===c.offer)).length?'<div class="on-v2-note">Materiais das suas disciplinas aparecerão aqui quando os professores os publicarem.</div>':'<div class="on-v2-empty">Ainda não existem materiais.</div>';
  const prog=document.getElementById('progressBox');if(prog)prog.innerHTML=`<div class="on-v2-card"><h3>Progresso</h3><p>${classes.filter(c=>c.done||c.attendance).length} de ${classes.length} aulas registadas.</p></div>`;
  renderStudentProfile();
}
function viewInstitutionCourseV2(id){const o=og(OK.O).find(x=>x.id===id);if(!o)return;onModalBody.innerHTML=`<div class="on-v2-card"><h3>${esc(o.name)}</h3><p>${esc(o.description||'')}</p><p><strong>Nível:</strong> ${esc(o.level||'-')} · <strong>Modalidade:</strong> ${esc(o.mode||'-')}</p><p>Professor e turma serão definidos pela instituição.</p></div>`;onModal.classList.add('show')}

function renderInstitutionTeachers(){
  let b=document.getElementById('institutionTeachersBox'),a=og(OK.T).filter(x=>x.institution===onUser.id);
  b.innerHTML=`<div class="on-v2-card"><h3>Professores da instituição</h3>
  <p>Cadastre professores ou acompanhe os professores que entraram pelo convite institucional.</p>
  ${onUser.status!=='approved'?'<div class="on-v2-alert warn">A instituição precisa ser aprovada para cadastrar professores.</div>':''}
  <form class="on-form" onsubmit="saveInstitutionTeacher(event)">
    <div><label>Nome *</label><input id="ictName" required></div><div><label>Telefone *</label><input id="ictPhone" required></div>
    <div><label>E-mail</label><input id="ictEmail" type="email"></div><div><label>Disciplina</label><input id="ictSub"></div>
    <div><label>Palavra-passe inicial *</label><input id="ictPass" type="password" minlength="6" required></div>
    <button class="on-btn on-full" ${onUser.status!=='approved'?'disabled':''}>Cadastrar professor</button>
  </form>
  <hr>${a.length?a.map(t=>`<div class="on-v2-card"><strong>${esc(t.name)}</strong><p>${esc(t.sub||'')} · ${esc(t.phone||'')}</p>${statusTag(t.status)}</div>`).join(''):'<div class="on-v2-empty">Nenhum professor associado.</div>'}</div>`;
}
function saveInstitutionTeacher(e){
  e.preventDefault();if(onUser.status!=='approved')return alert('A instituição ainda não foi aprovada.');
  let a=og(OK.T);if(a.some(x=>x.phone===ictPhone.value.trim()))return alert('Já existe uma conta com este telefone.');
  const u={id:oid('teacher'),name:ictName.value.trim(),phone:ictPhone.value.trim(),email:ictEmail.value.trim(),sub:ictSub.value.trim(),bio:'',qualifications:'',photo:'',pass:ictPass.value,teacherType:'institution',institution:onUser.id,institutionName:onUser.legalName||onUser.name,status:'approved',createdAt:new Date().toISOString()};
  a.push(u);os(OK.T,a);alert('Professor cadastrado e associado à instituição.');renderOn();
}
function renderInstitutionStudents(){
  let b=document.getElementById('institutionStudentsBox'),a=og(OK.S).filter(x=>x.institution===onUser.id);
  b.innerHTML=`<div class="on-v2-card"><h3>Alunos da instituição</h3>
  <p>Cadastre alunos diretamente ou acompanhe alunos que entraram pelo código institucional.</p>
  ${onUser.status!=='approved'?'<div class="on-v2-alert warn">A instituição precisa ser aprovada para cadastrar alunos.</div>':''}
  <form class="on-form" onsubmit="saveInstitutionStudent(event)">
    <div><label>Nome *</label><input id="icsName" required></div><div><label>Telefone *</label><input id="icsPhone" required></div>
    <div><label>E-mail</label><input id="icsEmail" type="email"></div><div><label>Código do aluno</label><input id="icsCode" placeholder="Ex.: ALU-2026-001"></div>
    <div><label>Palavra-passe inicial *</label><input id="icsPass" type="password" minlength="6" required></div>
    <button class="on-btn on-full" ${onUser.status!=='approved'?'disabled':''}>Cadastrar aluno</button>
  </form>
  <hr>${a.length?a.map(s=>`<div class="on-v2-card"><strong>${esc(s.name)}</strong><p>${esc(s.email||s.phone||'')} · Código: ${esc(s.institutionCode||'-')}</p>${statusTag(s.status)}</div>`).join(''):'<div class="on-v2-empty">Nenhum aluno associado.</div>'}</div>`;
}
function saveInstitutionStudent(e){
  e.preventDefault();if(onUser.status!=='approved')return alert('A instituição ainda não foi aprovada.');
  let a=og(OK.S);if(a.some(x=>x.phone===icsPhone.value.trim()))return alert('Já existe uma conta com este telefone.');
  const u={id:oid('student'),name:icsName.value.trim(),phone:icsPhone.value.trim(),email:icsEmail.value.trim(),pass:icsPass.value,studentType:'institution',institution:onUser.id,institutionName:onUser.legalName||onUser.name,institutionCode:icsCode.value.trim(),status:'active',createdAt:new Date().toISOString()};
  a.push(u);os(OK.S,a);alert('Aluno cadastrado e associado à instituição.');renderOn();
}

/* ===== ADMIN: AULAS ONLINE ===== */
function renderAdminOnline(){
  const box=document.getElementById('adminOnlineTab');if(!box)return;
  let teachers=og(OK.T),students=og(OK.S),institutions=og(OK.IN),offers=og(OK.O),en=og(OK.E),pay=og(OK.P),inv=og(OK.I),po=og(OK.PO),cfg=onlineCfg();
  box.innerHTML=`
  <div class="admin-card">
    <h3>Gestão de Aulas Online</h3>
    <div class="on-v2-kpis">
      <div class="on-v2-kpi"><small>Professores</small><strong>${teachers.length}</strong></div>
      <div class="on-v2-kpi"><small>Alunos</small><strong>${students.length}</strong></div>
      <div class="on-v2-kpi"><small>Programas</small><strong>${offers.length}</strong></div>
      <div class="on-v2-kpi"><small>Instituições</small><strong>${institutions.length}</strong></div>
      <div class="on-v2-kpi"><small>Matrículas ativas</small><strong>${en.filter(x=>x.status==='active').length}</strong></div>
      <div class="on-v2-kpi"><small>Pagamentos pendentes</small><strong>${pay.filter(x=>['pending','submitted','under_review'].includes(x.status)).length}</strong></div>
    </div>
    <div class="on-v2-card">
      <h3>Configuração financeira</h3>
      <form class="on-form" onsubmit="saveOnlineConfig(event)">
        <div><label>Comissão da plataforma (%)</label><input id="adminOnlineCommission" type="number" min="0" max="100" step="0.1" value="${cfg.commissionRate}"></div>
        <div><label>Período de tolerância (dias)</label><input id="adminOnlineGrace" type="number" min="0" max="30" value="${cfg.graceDays}"></div>
        <button class="on-btn">Guardar configuração</button>
      </form>
    </div>
  </div>
  <div class="admin-card">
    <div class="admin-tabs admin-online-nav">
      <button class="admin-tab active" onclick="adminOnlineSection('enrollments',this)">📋 Matrículas</button>
      <button class="admin-tab" onclick="adminOnlineSection('students',this)">👨‍🎓 Alunos</button>
      <button class="admin-tab" onclick="adminOnlineSection('institutions',this)">🏫 Instituições</button>
      <button class="admin-tab" onclick="adminOnlineSection('teachers',this)">👨‍🏫 Professores</button>
      <button class="admin-tab" onclick="adminOnlineSection('offers',this)">📚 Programas</button>
      <button class="admin-tab" onclick="adminOnlineSection('payments',this)">💳 Pagamentos</button>
      <button class="admin-tab" onclick="adminOnlineSection('invoices',this)">🧾 Faturas</button>
      <button class="admin-tab" onclick="adminOnlineSection('payouts',this)">💰 Saques</button>
    </div>
    <div id="adminOnlineSub"></div>
  </div>`;
  renderAdminOnlineSub('enrollments');
}
function saveOnlineConfig(e){e.preventDefault();os(OK.CFG,[{commissionRate:+adminOnlineCommission.value||0,graceDays:+adminOnlineGrace.value||0}]);alert('Configuração guardada.');renderAdminOnline()}
function adminOnlineSection(s,b){document.querySelectorAll('#adminOnlineTab .admin-tab').forEach(x=>x.classList.remove('active'));if(b)b.classList.add('active');renderAdminOnlineSub(s)}

function aoEsc(v){return typeof esc==='function'?esc(v??''):String(v??'')}
function aoStatusButtons(type,x){
  const id=x.id,st=x.status;let h='';
  if(['pending','under_review','payment_submitted','submitted'].includes(st))h+=`<button class="a-approve" onclick="adminOnlineSetStatus('${type}','${id}','approved')">✓ Aprovar</button><button class="a-reject" onclick="adminOnlineSetStatus('${type}','${id}','rejected')">✕ Rejeitar</button>`;
  if(['approved','active'].includes(st))h+=`<button class="a-suspend" onclick="adminOnlineSetStatus('${type}','${id}','suspended')">⏸ Suspender</button>`;
  if(['suspended','rejected','paused'].includes(st))h+=`<button class="a-reactivate" onclick="adminOnlineSetStatus('${type}','${id}','approved')">↻ Reativar</button>`;
  if(['requested'].includes(st))h+=`<button class="a-process" onclick="processPayoutV2('${id}')">⚙ Processar</button>`;
  if(['processing'].includes(st))h+=`<button class="a-approve" onclick="completePayoutV2('${id}')">✓ Marcar pago</button>`;
  if(type==='offers'&&st==='approved')h+=`<button class="a-neutral" onclick="adminOnlineSetStatus('${type}','${id}','paused')">Pausar</button>`;
  if(type==='enrollments'&&['active','suspended','rejected'].includes(st))h+=`<button class="a-neutral" onclick="adminOnlineSetStatus('${type}','${id}','cancelled')">Cancelar</button>`;
  
  return h;
}
function aoActions(type,x){
  let h=`<div class="admin-online-actions"><button class="a-view" onclick="adminOnlineView('${type}','${x.id}')">👁 Ver</button><button class="a-edit" onclick="adminOnlineEdit('${type}','${x.id}')">✎ Editar</button><button class="a-adjust" onclick="adminOnlineAdjust('${type}','${x.id}')">↕ Ajustar</button>${aoStatusButtons(type,x)}<button class="a-delete" onclick="adminOnlineDelete('${type}','${x.id}')">🗑 Eliminar</button></div>`;
  return h;
}
function aoSection(title,desc,headers,rows,empty){return `<div class="admin-online-section"><div class="admin-online-section-head"><div><h3>${title}</h3><p>${desc}</p></div></div>${rows?`<div class="admin-online-table-wrap"><table class="admin-online-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`:`<div class="on-v2-empty">${empty}</div>`}</div>`}
function renderAdminOnlineSub(s){
  const box=document.getElementById('adminOnlineSub');if(!box)return;
  let en=og(OK.E),pay=og(OK.P),teachers=og(OK.T),students=og(OK.S),institutions=og(OK.IN),offers=og(OK.O),inv=og(OK.I),po=og(OK.PO);
  if(s==='students'){
    box.innerHTML=aoSection('Alunos','Consulte a ficha completa do aluno, edite dados, ajuste estado ou elimine o registo.',['Aluno','Contacto','Tipo','Instituição','Estado','Ações'],students.map(x=>`<tr><td><div class="admin-online-name">${aoEsc(x.name)}</div><div class="admin-online-muted">ID: ${aoEsc(x.id)}</div></td><td>${aoEsc(x.phone||'-')}<br>${aoEsc(x.email||'-')}</td><td>${x.studentType==='institution'?'Institucional':'Particular'}</td><td>${aoEsc(x.institutionName||'-')}</td><td>${statusTag(x.status)}</td><td>${aoActions('students',x)}</td></tr>`).join(''), 'Nenhum aluno registado.');
  }else if(s==='institutions'){
    box.innerHTML=aoSection('Instituições','Gestão documental e administrativa das instituições registadas.',['Instituição','Tipo / Regime','NIF','Documentação','Estado','Ações'],institutions.map(x=>`<tr><td><div class="admin-online-name">${aoEsc(x.name)}</div><div class="admin-online-muted">${aoEsc(x.representative||x.legalRepresentative||'-')}</div></td><td>${aoEsc(x.type||'-')}<br>${aoEsc(x.regime||'-')}</td><td>${aoEsc(x.nif||'-')}</td><td>${x.documents?.legal?'✓ Legal':'— Legal'} · ${x.documents?.license?'✓ Licença':'— Licença'} · ${x.documents?.other?'✓ Adicional':'— Adicional'}<br><button class="on-v2-btn alt" onclick="viewInstitutionDocsV2('${x.id}')">Ver documentos</button></td><td>${statusTag(x.status)}</td><td>${aoActions('institutions',x)}</td></tr>`).join(''), 'Nenhuma instituição registada.');
  }else if(s==='teachers'){
    box.innerHTML=aoSection('Professores','Controlo das contas de professores particulares e professores ligados a instituições.',['Professor','Contacto','Especialidade','Tipo','Estado','Ações'],teachers.map(x=>`<tr><td><div class="admin-online-name">${aoEsc(x.name)}</div><div class="admin-online-muted">ID: ${aoEsc(x.id)}</div></td><td>${aoEsc(x.phone||'-')}<br>${aoEsc(x.email||'-')}</td><td>${aoEsc(x.sub||'-')}</td><td>${x.teacherType==='institution'?'Institucional':'Particular'}</td><td>${statusTag(x.status)}</td><td>${aoActions('teachers',x)}</td></tr>`).join(''), 'Nenhum professor registado.');
  }else if(s==='offers'){
    box.innerHTML=aoSection('Programas / Ofertas','Aprove, rejeite, pause, edite ou elimine programas antes da publicação.',['Programa','Professor','Preço','Modalidade','Estado','Ações'],offers.map(x=>`<tr><td><div class="admin-online-name">${aoEsc(x.name)}</div><div class="admin-online-muted">${aoEsc(x.description||'')}</div></td><td>${aoEsc(teachers.find(t=>t.id===x.teacher)?.name||x.teacherName||'-')}</td><td>${fmt(x.enrollmentFee)} + ${fmt(x.monthlyFee)}/mês</td><td>${aoEsc(x.modality||'-')}</td><td>${statusTag(x.status)}</td><td>${aoActions('offers',x)}</td></tr>`).join(''), 'Nenhum programa registado.');
  }else if(s==='enrollments'){
    box.innerHTML=aoSection('Matrículas','A matrícula deve ser analisada com os dados do aluno, professor, programa e pagamento associados.',['Aluno','Professor','Programa','Valor inicial','Estado','Ações'],en.map(x=>`<tr><td><div class="admin-online-name">${aoEsc(x.studentName)}</div><div class="admin-online-muted">${aoEsc(x.student)}</div></td><td>${aoEsc(x.teacherName)}</td><td>${aoEsc(x.offerName)}</td><td>${fmt(Number(x.enrollmentFee)+Number(x.monthlyFee))}</td><td>${statusTag(x.status)}</td><td>${aoActions('enrollments',x)}</td></tr>`).join(''), 'Nenhuma matrícula registada.');
  }else if(s==='payments'){
    box.innerHTML=aoSection('Pagamentos','Confirme comprovativos, rejeite pagamentos, ajuste valores ou elimine registos quando necessário.',['Data','Aluno','Programa','Tipo','Valor','Estado','Ações'],pay.map(x=>`<tr><td>${datePT(x.createdAt)}</td><td>${aoEsc(x.studentName)}</td><td>${aoEsc(x.offerName)}</td><td>${aoEsc(x.type||'-')}</td><td>${fmt(x.amount)}</td><td>${statusTag(x.status)}</td><td><div class="admin-online-actions"><button class="a-view" onclick="adminOnlineView('payments','${x.id}')">👁 Ver</button>${x.proof?`<button class="a-neutral" onclick="viewProofV2('${x.id}')">📎 Comprovativo</button>`:''}<button class="a-edit" onclick="adminOnlineEdit('payments','${x.id}')">✎ Editar</button><button class="a-adjust" onclick="adminOnlineAdjust('payments','${x.id}')">↕ Ajustar</button>${aoStatusButtons('payments',x)}<button class="a-delete" onclick="adminOnlineDelete('payments','${x.id}')">🗑 Eliminar</button></div></td></tr>`).join(''), 'Nenhum pagamento registado.');
  }else if(s==='invoices'){
    box.innerHTML=aoSection('Faturas mensais','Acompanhe vencimentos, pagamentos e situações de atraso.',['Aluno','Programa','Valor','Vencimento','Estado','Ações'],inv.map(x=>`<tr><td>${aoEsc(x.studentName)}</td><td>${aoEsc(x.offerName)}</td><td>${fmt(x.amount)}</td><td>${datePT(x.dueDate)}</td><td>${statusTag(x.status)}</td><td>${aoActions('invoices',x)}</td></tr>`).join(''), 'Nenhuma fatura registada.');
  }else if(s==='payouts'){
    box.innerHTML=aoSection('Saques','Gestão dos pedidos de pagamento a professores/instituições.',['Beneficiário','Valor','Dados','Estado','Ações'],po.map(x=>`<tr><td><div class="admin-online-name">${aoEsc(x.teacherName||x.institutionName||x.name||'-')}</div></td><td>${fmt(x.amount)}</td><td>${aoEsc(x.details?.bank||'-')}<br>${aoEsc(x.details?.iban||x.details?.express||'-')}</td><td>${statusTag(x.status)}</td><td>${aoActions('payouts',x)}</td></tr>`).join(''), 'Nenhum saque solicitado.');
  }
}

function ensureAOModal(){
  let m=document.getElementById('apsanOnlineAdminModal');if(m)return m;
  m=document.createElement('div');m.id='apsanOnlineAdminModal';m.innerHTML=`<div class="ao-modal"><div class="ao-head"><div><h2 id="aoTitle"></h2><p id="aoSubtitle"></p></div><button class="ao-close" onclick="closeAOAdminModal()">×</button></div><div class="ao-body" id="aoBody"></div><div class="ao-foot" id="aoFoot"></div></div>`;document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m)closeAOAdminModal()});return m;
}
function openAOAdminModal(title,subtitle,body,foot=''){const m=ensureAOModal();document.getElementById('aoTitle').textContent=title;document.getElementById('aoSubtitle').textContent=subtitle||'';document.getElementById('aoBody').innerHTML=body;document.getElementById('aoFoot').innerHTML=foot;m.classList.add('show');document.body.style.overflow='hidden'}
function closeAOAdminModal(){const m=document.getElementById('apsanOnlineAdminModal');if(m)m.classList.remove('show');document.body.style.overflow=''}
function aoFields(obj,exclude=[]){return `<div class="ao-grid">${Object.entries(obj||{}).filter(([k])=>!exclude.includes(k)).map(([k,v])=>`<div class="ao-field"><small>${aoLabel(k)}</small><div>${aoEsc(typeof v==='object'?JSON.stringify(v,null,2):String(v??'-')).replace(/\n/g,'<br>')}</div></div>`).join('')}</div>`}
function aoLabel(k){const m={id:'ID',name:'Nome',legalName:'Nome legal',nif:'NIF',phone:'Telefone',email:'E-mail',representative:'Representante legal',legalRepresentative:'Representante legal',address:'Endereço',type:'Tipo',regime:'Regime',status:'Estado',createdAt:'Criado em',reviewedAt:'Revisto em',teacherType:'Tipo de professor',studentType:'Tipo de aluno',institutionName:'Instituição',institutionCode:'Código institucional',sub:'Especialidade / Disciplina',bio:'Biografia',qualifications:'Qualificações',modality:'Modalidade',description:'Descrição',enrollmentFee:'Taxa de matrícula',monthlyFee:'Mensalidade',maxStudents:'Máximo de alunos',duration:'Duração',classesPerMonth:'Aulas por mês',amount:'Valor',type:'Tipo',offerName:'Programa',teacherName:'Professor',studentName:'Aluno',dueDate:'Vencimento',paymentId:'Pagamento',adminReason:'Observação administrativa'};return m[k]||k}
function findAO(type,id){const map={students:OK.S,teachers:OK.T,institutions:OK.IN,offers:OK.O,enrollments:OK.E,payments:OK.P,invoices:OK.I,payouts:OK.PO};return og(map[type]).find(x=>x.id===id)}
function adminOnlineView(type,id){const x=findAO(type,id);if(!x)return;let body=aoFields(x,['pass','photo','documents','proof']);if(x.documents)body+=`<div class="ao-field" style="margin-top:16px"><small>Documentação</small><div>${x.documents.legal?'✓ Documento legal enviado':'— Documento legal'} · ${x.documents.license?'✓ Licença enviada':'— Licença'} · ${x.documents.other?'✓ Documento adicional':'— Adicional'}</div></div>`;if(x.proof)body+=`<div class="ao-field" style="margin-top:16px"><small>Comprovativo</small><div><button class="on-v2-btn alt" onclick="viewProofV2('${x.id}')">Abrir comprovativo</button></div></div>`;openAOAdminModal('Ficha completa · '+(x.name||x.studentName||x.teacherName||x.offerName||'Registo'),'Todos os dados disponíveis deste registo',body,`<button class="ao-secondary" onclick="closeAOAdminModal()">Fechar</button><button class="ao-primary" onclick="closeAOAdminModal();adminOnlineEdit('${type}','${id}')">Editar dados</button>`)}
function adminOnlineEdit(type,id){const x=findAO(type,id);if(!x)return;let fields=[];if(type==='students')fields=[['name','Nome','text'],['phone','Telefone','text'],['email','E-mail','email'],['institutionCode','Código institucional','text']];else if(type==='teachers')fields=[['name','Nome','text'],['phone','Telefone','text'],['email','E-mail','email'],['sub','Especialidade / Disciplina','text'],['bio','Biografia','textarea'],['qualifications','Qualificações','textarea']];else if(type==='institutions')fields=[['name','Nome','text'],['legalName','Nome legal','text'],['nif','NIF','text'],['phone','Telefone','text'],['email','E-mail','email'],['representative','Representante legal','text'],['address','Endereço','text'],['type','Tipo','text'],['regime','Regime','text']];else if(type==='offers')fields=[['name','Nome do programa','text'],['description','Descrição','textarea'],['enrollmentFee','Taxa de matrícula','number'],['monthlyFee','Mensalidade','number'],['modality','Modalidade','text'],['duration','Duração','text'],['classesPerMonth','Aulas por mês','number'],['maxStudents','Máximo de alunos','number']];else if(type==='enrollments')fields=[['studentName','Nome do aluno','text'],['teacherName','Nome do professor','text'],['offerName','Programa','text'],['enrollmentFee','Taxa de matrícula','number'],['monthlyFee','Mensalidade','number']];else if(type==='payments')fields=[['amount','Valor','number'],['type','Tipo de pagamento','text'],['studentName','Aluno','text'],['offerName','Programa','text']];else if(type==='invoices')fields=[['amount','Valor','number'],['dueDate','Data de vencimento','date'],['status','Estado','text']];else if(type==='payouts')fields=[['amount','Valor','number']];else return adminOnlineView(type,id);
  const form=`<form id="aoEditForm" class="ao-form">${fields.map(([k,l,t])=>`<div class="${t==='textarea'?'full':''}"><label>${l}</label>${t==='textarea'?`<textarea name="${k}">${aoEsc(x[k]??'')}</textarea>`:`<input name="${k}" type="${t}" value="${t==='date'&&x[k]?new Date(x[k]).toISOString().slice(0,10):aoEsc(x[k]??'')}">`}</div>`).join('')}</form>`;
  openAOAdminModal('Editar · '+(x.name||x.studentName||x.teacherName||x.offerName||'Registo'),'Altere os dados e guarde as mudanças.',form,`<button class="ao-secondary" onclick="closeAOAdminModal()">Cancelar</button><button class="ao-primary" onclick="adminOnlineSaveEdit('${type}','${id}')">Guardar alterações</button>`)}
function adminOnlineSaveEdit(type,id){const x=findAO(type,id),f=document.getElementById('aoEditForm');if(!x||!f)return;const data=new FormData(f);for(const [k,v] of data.entries())x[k]=['amount','enrollmentFee','monthlyFee','classesPerMonth','maxStudents'].includes(k)?(Number(v)||0):v;if(type==='invoices'&&x.dueDate)x.dueDate=new Date(x.dueDate).toISOString();const map={students:OK.S,teachers:OK.T,institutions:OK.IN,offers:OK.O,enrollments:OK.E,payments:OK.P,invoices:OK.I,payouts:OK.PO};let a=og(map[type]),i=a.findIndex(z=>z.id===id);if(i>=0)a[i]=x;os(map[type],a);closeAOAdminModal();renderAdminOnline();alert('Alterações guardadas com sucesso.')}
function adminOnlineAdjust(type,id){const x=findAO(type,id);if(!x)return;let field=['payments','payouts'].includes(type)?'amount':type==='offers'?'monthlyFee':type==='invoices'?'amount':'status';if(field==='status'){return openAOAdminModal('Ajustar estado','Escolha o novo estado administrativo.',`<div class="ao-form"><div class="full"><label>Novo estado</label><select id="aoAdjustStatus"><option value="pending">Pendente</option><option value="approved">Aprovado</option><option value="active">Ativo</option><option value="suspended">Suspenso</option><option value="rejected">Rejeitado</option><option value="cancelled">Cancelado</option></select></div><div class="full"><label>Observação</label><textarea id="aoAdjustReason" placeholder="Motivo ou nota administrativa"></textarea></div></div>`, `<button class="ao-secondary" onclick="closeAOAdminModal()">Cancelar</button><button class="ao-primary" onclick="adminOnlineApplyAdjust('${type}','${id}','status')">Aplicar ajuste</button>`)}
  openAOAdminModal('Reajuste administrativo','Altere o valor financeiro deste registo.',`<div class="ao-form"><div><label>Valor atual</label><input value="${Number(x[field]||0)}" disabled></div><div><label>Novo valor</label><input id="aoAdjustValue" type="number" min="0" step="0.01" value="${Number(x[field]||0)}"></div><div class="full"><label>Motivo do reajuste</label><textarea id="aoAdjustReason" placeholder="Explique o motivo deste ajuste"></textarea></div></div>`,`<button class="ao-secondary" onclick="closeAOAdminModal()">Cancelar</button><button class="ao-primary" onclick="adminOnlineApplyAdjust('${type}','${id}','${field}')">Guardar reajuste</button>`)}
function adminOnlineApplyAdjust(type,id,field){const x=findAO(type,id);if(!x)return;if(field==='status'){x.status=document.getElementById('aoAdjustStatus').value;x.adminReason=document.getElementById('aoAdjustReason').value.trim();}else{x[field]=Number(document.getElementById('aoAdjustValue').value)||0;x.adminAdjustmentReason=document.getElementById('aoAdjustReason').value.trim();x.adjustedAt=new Date().toISOString()}const map={students:OK.S,teachers:OK.T,institutions:OK.IN,offers:OK.O,enrollments:OK.E,payments:OK.P,invoices:OK.I,payouts:OK.PO};let a=og(map[type]),i=a.findIndex(z=>z.id===id);if(i>=0)a[i]=x;os(map[type],a);closeAOAdminModal();renderAdminOnline();alert('Ajuste aplicado.')}
function adminOnlineSetStatus(type,id,status){const x=findAO(type,id);if(!x)return;let reason='';if(status==='rejected'||status==='suspended'||status==='cancelled'){reason=prompt('Indique o motivo desta decisão administrativa:','Decisão administrativa da APSAN.');if(reason===null)return}if(type==='enrollments'&&status==='approved'){approveEnrollmentV2(id);return}if(type==='payments'&&status==='approved'){approvePaymentV2(id);return}if(type==='payments'&&status==='rejected'){rejectPaymentV2(id);return}if(type==='payouts'&&status==='approved'){completePayoutV2(id);return}x.status=status;if(reason)x.adminReason=reason;x.reviewedAt=new Date().toISOString();const map={students:OK.S,teachers:OK.T,institutions:OK.IN,offers:OK.O,enrollments:OK.E,payments:OK.P,invoices:OK.I,payouts:OK.PO};let a=og(map[type]),i=a.findIndex(z=>z.id===id);if(i>=0)a[i]=x;os(map[type],a);renderAdminOnline()}
function adminOnlineDelete(type,id){const x=findAO(type,id);if(!x)return;if(!confirm('Tem a certeza que deseja eliminar este registo? Esta ação não pode ser desfeita.'))return;const map={students:OK.S,teachers:OK.T,institutions:OK.IN,offers:OK.O,enrollments:OK.E,payments:OK.P,invoices:OK.I,payouts:OK.PO};let a=og(map[type]).filter(z=>z.id!==id);os(map[type],a);renderAdminOnline();alert('Registo eliminado.')}
function setInstitutionStatusV2(id,status){let a=og(OK.IN),x=a.find(v=>v.id===id);if(!x)return;if(status==='rejected'){let r=prompt('Motivo da rejeição documental:','Documentação insuficiente ou não validada.');if(r===null)return;x.adminReason=r}x.status=status;x.reviewedAt=new Date().toISOString();os(OK.IN,a);renderAdminOnline()}
function viewInstitutionDocsV2(id){let x=og(OK.IN).find(v=>v.id===id);if(!x)return;let d=x.documents||{};onModalBody.innerHTML=`<div class="on-v2-card"><h3>Documentação · ${esc(x.name)}</h3><p>NIF: ${esc(x.nif||'')} · Representante: ${esc(x.representative||'')}</p><p>Documento legal: ${d.legal?`<a class="on-v2-btn" href="${d.legal}" target="_blank">Abrir</a>`:'Não enviado'}</p><p>Licença: ${d.license?`<a class="on-v2-btn" href="${d.license}" target="_blank">Abrir</a>`:'Não enviada'}</p><p>Adicional: ${d.other?`<a class="on-v2-btn" href="${d.other}" target="_blank">Abrir</a>`:'Não enviado'}</p></div>`;onModal.classList.add('show')}
function setTeacherStatusV2(id,status){let a=og(OK.T),u=a.find(x=>x.id===id);if(!u)return;u.status=status;os(OK.T,a);renderAdminOnline()}
function setOfferStatusV2(id,status){let a=og(OK.O),o=a.find(x=>x.id===id);if(!o)return;o.status=status;o.adminReason=status==='rejected'?'Programa rejeitado pelo administrador.':'';os(OK.O,a);renderAdminOnline()}
function viewProofV2(id){let p=og(OK.P).find(x=>x.id===id);if(!p?.proof)return;onModalBody.innerHTML=`<div class="on-v2-card"><h3>Comprovativo</h3><p>${esc(p.studentName)} · ${fmt(p.amount)}</p>${p.proof.startsWith('data:image')?`<img src="${p.proof}" style="max-width:100%;border-radius:12px">`:`<a class="on-v2-btn" href="${p.proof}" target="_blank" rel="noopener">Abrir ficheiro</a>`}</div>`;onModal.classList.add('show')}
function approveEnrollmentV2(id){let ea=og(OK.E),e=ea.find(x=>x.id===id),pa=og(OK.P),p=pa.find(x=>x.id===e?.paymentId);if(!e||!p)return;approvePaymentCoreV2(p,e);renderAdminOnline()}
function rejectEnrollmentV2(id){let ea=og(OK.E),e=ea.find(x=>x.id===id);if(!e)return;let reason=prompt('Motivo da rejeição:','Comprovativo não validado.');if(reason===null)return;e.status='rejected';e.adminReason=reason;os(OK.E,ea);let pa=og(OK.P),p=pa.find(x=>x.id===e.paymentId);if(p){p.status='rejected';p.adminReason=reason;os(OK.P,pa)}renderAdminOnline()}
function approvePaymentV2(id){let pa=og(OK.P),p=pa.find(x=>x.id===id);if(!p)return;if(p.type==='enrollment'){let e=og(OK.E).find(x=>x.paymentId===id);if(!e)return approvePaymentCoreV2(p,null);approvePaymentCoreV2(p,e)}else{let ia=og(OK.I),i=ia.find(x=>x.paymentId===id);p.status='approved';if(i){i.status='paid';i.paidAt=new Date().toISOString();}os(OK.P,pa);if(i)createNextInvoiceV2(i);createTeacherTransactionV2(p)}renderAdminOnline()}
function rejectPaymentV2(id){let pa=og(OK.P),p=pa.find(x=>x.id===id);if(!p)return;let reason=prompt('Motivo da rejeição:','Comprovativo não validado.');if(reason===null)return;p.status='rejected';p.adminReason=reason;os(OK.P,pa);if(p.type==='monthly'){let ia=og(OK.I),i=ia.find(x=>x.paymentId===id);if(i){i.status='overdue';i.paymentId='';os(OK.I,ia)}}else{let ea=og(OK.E),e=ea.find(x=>x.paymentId===id);if(e){e.status='rejected';e.adminReason=reason;os(OK.E,ea)}}renderAdminOnline()}
function approvePaymentCoreV2(p,e){p.status='approved';p.approvedAt=new Date().toISOString();let pa=og(OK.P),idx=pa.findIndex(x=>x.id===p.id);if(idx>=0)pa[idx]=p;os(OK.P,pa);if(e){let ea=og(OK.E),en=ea.find(x=>x.id===e.id);en.status='active';en.approvedAt=new Date().toISOString();os(OK.E,ea);let ia=og(OK.I);ia.push({id:oid('inv'),enrollment:en.id,student:en.student,studentName:en.studentName,teacher:en.teacher,teacherName:en.teacherName,offer:en.offer,offerName:en.offerName,amount:Number(en.monthlyFee),dueDate:new Date(new Date().setMonth(new Date().getMonth()+1)).toISOString(),status:'pending',createdAt:new Date().toISOString()});os(OK.I,ia);createTeacherTransactionV2(p)}}
function createTeacherTransactionV2(p){let cfg=onlineCfg(),fee=Number(p.amount||0)*Number(cfg.commissionRate||0)/100,tx=og(OK.TX);tx.push({id:oid('tx'),paymentId:p.id,teacher:p.teacher,teacherName:p.teacherName,gross:Number(p.amount||0),fee,net:Number(p.amount||0)-fee,createdAt:new Date().toISOString()});os(OK.TX,tx)}
function createNextInvoiceV2(i){let ia=og(OK.I),exists=ia.some(x=>x.enrollment===i.enrollment&&x.id!==i.id&&new Date(x.dueDate)>new Date());if(exists)return;let d=new Date(i.dueDate);d.setMonth(d.getMonth()+1);ia.push({...i,id:oid('inv'),paymentId:'',dueDate:d.toISOString(),status:'pending',paidAt:''});os(OK.I,ia)}
function processPayoutV2(id){let a=og(OK.PO),x=a.find(v=>v.id===id);if(!x)return;x.status='processing';x.processedAt=new Date().toISOString();os(OK.PO,a);renderAdminOnline()}
function completePayoutV2(id){let a=og(OK.PO),x=a.find(v=>v.id===id);if(!x)return;x.status='completed';x.completedAt=new Date().toISOString();os(OK.PO,a);renderAdminOnline()}
onlineInit();

(function(){
  function bootOnlineAccess(){
    document.addEventListener('click', function(ev){
      const btn=ev.target.closest('[data-online-entry]');
      if(!btn) return;
      ev.preventDefault();
      const action=btn.getAttribute('data-online-entry');
      if(action==='teacher') openOnline('teacher');
      else if(action==='institution') openOnline('institution');
      else if(action==='student-private') openStudentAccess('private');
      else if(action==='student-institution') openStudentAccess('institution');
    }, true);

    document.querySelectorAll('.online-access-hub [onclick*="openOnline"], .online-access-hub [onclick*="openStudentAccess"]').forEach(function(btn){
      const text=(btn.textContent||'').toLowerCase();
      if(text.includes('professor')) btn.setAttribute('data-online-entry','teacher');
      else if(text.includes('instituição')) btn.setAttribute('data-online-entry','institution');
      else if(text.includes('particulares')) btn.setAttribute('data-online-entry','student-private');
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootOnlineAccess);
  else bootOnlineAccess();
})();



/* ===== Código original: linhas 3203-3419 ===== */
/* APSAN ONLINE V3 - camada completa de ensino institucional */
(function(){
  const V3={IC:'apsan_institution_courses',IT:'apsan_institution_classes',EV:'apsan_institution_evaluations',AT:'apsan_institution_attendance',CAL:'apsan_institution_calendar'};
  Object.values(V3).forEach(k=>{if(!localStorage.getItem(k))os(k,[])});
  const arr=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}};
  const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const by=(a,id)=>a.find(x=>x.id===id);
  const ensure=()=>{if(typeof onlineInit==='function')onlineInit();Object.values(V3).forEach(k=>{if(!localStorage.getItem(k))put(k,[])})};
  function card(title,body,cls=''){return `<div class="on-v2-card ${cls}"><h3>${title}</h3>${body}</div>`}
  function institution(){return onRole==='institution'?onUser:null}
  function instApproved(){return institution()?.status==='approved'}
  function institutionCourses(){return arr(OK.O).filter(x=>x.ownerType==='institution'&&x.institution===onUser?.id)}

  window.openStudentAccess=function(mode){onRole='student';onInstitutionMode='private';const p=document.getElementById('onlinePage');if(!p)return; p.classList.add('show');document.body.classList.add('page-open');showOnlineAuth();setOnRole('student');};
  window.chooseStudentMode=function(mode){onStudentMode='private';onInstitutionMode='private';setOnRole('student');};

  window.institutionEntry=function(mode){
    ensure(); onInstitutionMode=mode; onRole=mode==='admin'?'institution':mode;
    const ch=document.getElementById('institutionPortalChoice'), a=document.getElementById('onAuth');
    if(ch)ch.style.display='none'; if(a)a.style.display='block';
    const title=document.querySelector('#onAuth h3'); if(title)title.textContent=mode==='admin'?'Gestão da instituição':mode==='teacher'?'Professor da instituição':'Aluno da instituição';
    setOnRole(onRole); populateInstitutionSelectors();
    if(mode==='teacher'){const f=document.getElementById('onTeacherInstitutionFields');if(f)f.style.display='block'}
    if(mode==='student'){onStudentMode='institution';const f=document.getElementById('onStudentInstitutionFields');if(f)f.style.display='block'}
  };
  window.openInstitutionPortal=function(){
    ensure();const p=document.getElementById('onlinePage');if(!p)return; p.classList.add('show');document.body.classList.add('page-open');
    onRole='institution';onInstitutionMode='admin';const ch=document.getElementById('institutionPortalChoice'),a=document.getElementById('onAuth');
    if(ch)ch.style.display='block';if(a)a.style.display='none';
  };

  const baseLogin=window.loginOnline;

  // Login V3: reconhece a conta já criada usando telefone OU e-mail + palavra-passe.
  // A pesquisa é tolerante a espaços, pontuação e diferenças de maiúsculas/minúsculas.
  function normalizeLoginValue(value){
    return String(value||'').trim().toLowerCase();
  }
  function normalizePhoneValue(value){
    return String(value||'').replace(/[^0-9+]/g,'');
  }
  function findExistingAccount(list,identifier){
    const raw=String(identifier||'').trim();
    const low=normalizeLoginValue(raw);
    const phone=normalizePhoneValue(raw);
    return list.find(x=>{
      const xp=normalizePhoneValue(x.phone);
      const xe=normalizeLoginValue(x.email);
      return (phone && xp===phone) || (low && xe===low);
    });
  }

  window.loginOnline=async function(e){
    if(e)e.preventDefault();
    ensure();
    const role=onRole, mode=onInstitutionMode;
    const isLogin=typeof onAuthMode!=='undefined' && onAuthMode==='login';
    const identifier=(document.getElementById('onLoginIdentifier')?.value||'').trim();
    const phone=(document.getElementById('onPhone')?.value||'').trim();
    const pass=document.getElementById('onPass')?.value||'';
    const name=(document.getElementById('onName')?.value||'').trim();
    const email=(document.getElementById('onEmail')?.value||'').trim();

    // =========================
    // ENTRAR: conta já existente
    // =========================
    if(isLogin){
      if(!identifier||!pass)return alert('Informe o telefone ou e-mail associado à sua conta e a palavra-passe.');

      let key=role==='teacher'?OK.T:role==='student'?OK.S:OK.IN;
      let list=arr(key);
      let u=findExistingAccount(list,identifier);

      if(!u){
        return alert('Conta não encontrada. Verifique o telefone/e-mail e a palavra-passe ou confirme se está a entrar pelo perfil correto.');
      }
      if(String(u.pass||'')!==String(pass))return alert('Palavra-passe incorreta.');

      // Não permitir misturar contas particulares e institucionais.
      if(role==='student'){
        const expected=mode==='student'?'institution':'private';
        if(u.studentType && u.studentType!==expected){
          return alert(expected==='institution'
            ?'Esta conta é de aluno particular. Entre pela opção “Aluno particular”.'
            :'Esta conta pertence a uma instituição. Entre pelo Portal da Instituição.');
        }
        if(expected==='institution' && u.institution && mode==='student'){
          const inst=arr(OK.IN).find(x=>x.id===u.institution);
          if(!inst)return alert('A instituição associada a esta conta não foi encontrada. Contacte a APSAN.');
        }
      }
      if(role==='teacher'){
        const expected=mode==='teacher'?'institution':'private';
        if(u.teacherType && u.teacherType!==expected){
          return alert(expected==='institution'
            ?'Esta conta é de professor particular. Entre pela opção “Professor particular”.'
            :'Esta conta pertence a uma instituição. Entre pelo Portal da Instituição.');
        }
        if(expected==='institution' && !u.institution){
          return alert('Esta conta de professor institucional não está associada a uma instituição. Contacte a APSAN.');
        }
      }
      if(role==='institution' && mode==='admin'){
        if(u.status==='rejected')return alert('A instituição foi rejeitada. Consulte o motivo no suporte da APSAN.');
        if(u.status==='suspended')return alert('A conta da instituição está suspensa. Contacte a APSAN.');
      }

      onUser=u;
      showDash();
      return;
    }

    // =====================================
    // CRIAR CONTA: mantém o fluxo existente
    // =====================================
    // O fluxo original continua responsável por criar/registar as contas.
    return baseLogin(e);
  };
  function showDash(){const a=document.getElementById('onAuth'),d=document.getElementById('onDash');if(a)a.style.display='none';if(d)d.style.display='block';const u=document.getElementById('onUser');if(u)u.textContent=onUser.name;const tn=document.getElementById('onTeacherNav'),sn=document.getElementById('onStudentNav'),inn=document.getElementById('onInstitutionNav');if(tn)tn.style.display=onRole==='teacher'?'block':'none';if(sn)sn.style.display=onRole==='student'?'block':'none';if(inn)inn.style.display=onRole==='institution'?'block':'none';renderOn();}

  function injectSections(){
    const main=document.querySelector('#onDash main');if(!main)return;
    const defs={
      instcourses:['oninstcourses','Cursos'],instclasses2:['oninstclasses2','Turmas'],instteachers2:['oninstteachers2','Professores'],inststudents2:['oninststudents2','Alunos'],instcalendar:['oninstcalendar','Calendário'],insteval:['oninsteval','Avaliações'],instreports:['oninstreports','Relatórios'],instfinance2:['oninstfinance2','Financeiro'],
      tprofile2:['ontprofile2','Perfil profissional'],toffer2:['ontoffer2','Programa'],tclasses2:['ontclasses2','Turmas/Aulas'],tmaterials2:['ontmaterials2','Materiais'],tattendance2:['ontattendance2','Presenças'],tstudents2:['ontstudents2','Alunos'],tfinance2:['ontfinance2','Financeiro'],
      sclasses2:['onsclasses2','Minhas aulas'],smaterials2:['onsmaterials2','Materiais'],sprogress2:['onsprogress2','Progresso'],spayments2:['onspayments2','Pagamentos']
    };
    Object.values(defs).forEach(([id])=>{if(!document.getElementById(id)){const sec=document.createElement('section');sec.id=id;sec.className='on-tab';sec.innerHTML='<div class="on-v2-card"><div class="on-v2-empty">A carregar...</div></div>';main.appendChild(sec)}});
  }
  function navExtra(id,label,tab){const nav=document.getElementById(id);if(!nav||nav.querySelector('[data-v3="'+tab+'"]'))return;const b=document.createElement('button');b.dataset.v3=tab;b.textContent=label;b.onclick=function(){onTab(tab,b)};nav.appendChild(b)}

  function renderInstitutionV3(){
    injectSections();['instcourses','instclasses2','instteachers2','inststudents2','instcalendar','insteval','instreports','instfinance2'].forEach((x,i)=>navExtra('onInstitutionNav',['Cursos','Turmas','Professores','Alunos','Calendário','Avaliações','Relatórios','Financeiro'][i],x));
    const inst=onUser,courses=institutionCourses(),teachers=arr(OK.T).filter(x=>x.institution===inst.id),students=arr(OK.S).filter(x=>x.institution===inst.id),classes=arr(V3.IT).filter(x=>x.institution===inst.id),en=arr(OK.E).filter(x=>x.institution===inst.id),tx=arr(OK.TX).filter(x=>x.institution===inst.id);
    onStats.innerHTML=`<div class="on-v2-kpi"><small>Estado</small><strong>${statusTag(inst.status)}</strong></div><div class="on-v2-kpi"><small>Cursos</small><strong>${courses.length}</strong></div><div class="on-v2-kpi"><small>Professores</small><strong>${teachers.length}</strong></div><div class="on-v2-kpi"><small>Alunos</small><strong>${students.length}</strong></div><div class="on-v2-kpi"><small>Turmas</small><strong>${classes.length}</strong></div><div class="on-v2-kpi"><small>Receita</small><strong>${fmt(tx.reduce((a,x)=>a+Number(x.gross||0),0))}</strong></div>`;
    onHomeBox.innerHTML=card(`Olá, ${esc(inst.name)}`,`<p>${inst.status==='approved'?'A instituição está aprovada e pode gerir o ensino online.':'A documentação está em análise. As funções de publicação ficam bloqueadas até à aprovação.'}</p><div class="on-v2-actions"><button class="on-v2-btn" onclick="onTab('instcourses')">Gerir cursos</button><button class="on-v2-btn alt" onclick="onTab('instclasses2')">Gerir turmas</button><button class="on-v2-btn alt" onclick="onTab('instreports')">Ver relatórios</button></div>`);
    renderInstCourses();renderInstClasses();renderInstTeachers();renderInstStudents();renderInstCalendar();renderInstEval();renderInstReports();renderInstFinance();
  }
  function renderInstCourses(){const b=document.getElementById('oninstcourses');if(!b)return;let a=institutionCourses();b.innerHTML=card('Cursos e programas',`${!instApproved()?'<div class="on-v2-alert warn">A instituição precisa ser aprovada pela APSAN para criar/publicar cursos.</div>':''}<form class="on-form" onsubmit="saveInstCourseV3(event)"><div><label>Nome do curso</label><input id="v3cName" required></div><div><label>Área/disciplina</label><input id="v3cArea" required></div><div><label>Nível</label><select id="v3cLevel"><option>Iniciante</option><option>Intermédio</option><option>Avançado</option><option>Ensino básico</option><option>Ensino médio</option><option>Ensino superior</option></select></div><div><label>Modalidade</label><select id="v3cMode"><option>Online</option><option>Presencial</option><option>Híbrido</option></select></div><div><label>Duração/aula (min)</label><input id="v3cDur" type="number" min="15" value="60"></div><div><label>Aulas/mês</label><input id="v3cMonth" type="number" min="1" value="8"></div><div><label>Inscrição (Kz)</label><input id="v3cFee" type="number" min="0" value="0"></div><div><label>Mensalidade (Kz)</label><input id="v3cMonthly" type="number" min="0" value="0"></div><div><label>Máx. alunos/turma</label><input id="v3cMax" type="number" min="1" value="30"></div><div class="on-full"><label>Descrição</label><textarea id="v3cDesc" required></textarea></div><div class="on-full"><label>Regras</label><textarea id="v3cRules"></textarea></div><button class="on-btn on-full" ${!instApproved()?'disabled':''}>Enviar para aprovação</button></form><hr>${a.length?a.map(o=>`<div class="on-v2-card"><strong>${esc(o.name)}</strong><p>${esc(o.description)}</p><p>${statusTag(o.status)} · ${fmt(o.monthlyFee)}/mês · ${esc(o.level)} · ${esc(o.mode)}</p></div>`).join(''):'<div class="on-v2-empty">Nenhum curso criado.</div>'}`)}
  window.saveInstCourseV3=function(e){e.preventDefault();if(!instApproved())return alert('A instituição ainda não foi aprovada.');let a=arr(OK.O);a.push({id:oid('icourse'),ownerType:'institution',institution:onUser.id,institutionName:onUser.name,teacher:'',name:v3cName.value.trim(),area:v3cArea.value.trim(),level:v3cLevel.value,mode:v3cMode.value,duration:+v3cDur.value||60,monthClasses:+v3cMonth.value||8,enrollmentFee:+v3cFee.value||0,monthlyFee:+v3cMonthly.value||0,maxStudents:+v3cMax.value||30,description:v3cDesc.value.trim(),rules:v3cRules.value.trim(),status:'pending',createdAt:new Date().toISOString()});put(OK.O,a);alert('Curso enviado para aprovação da APSAN.');renderOn()};

  function renderInstTeachers(){const b=document.getElementById('oninstteachers2');if(!b)return;let a=arr(OK.T).filter(x=>x.institution===onUser.id);b.innerHTML=card('Professores',`<p>Professores institucionais aparecem aqui depois de selecionarem esta instituição.</p>${a.length?a.map(t=>`<div class="on-v2-card"><strong>${esc(t.name)}</strong><p>${esc(t.sub||'')} · ${esc(t.email||t.phone||'')}</p>${statusTag(t.status)} <button class="on-v2-btn" onclick="toggleTeacherInstitutionV3('${t.id}')">${t.status==='approved'?'Suspender':'Aprovar'}</button></div>`).join(''):'<div class="on-v2-empty">Nenhum professor associado.</div>'}`)}
  window.toggleTeacherInstitutionV3=function(id){let a=arr(OK.T),x=by(a,id);if(!x)return;x.status=x.status==='approved'?'suspended':'approved';put(OK.T,a);renderOn()};
  function renderInstStudents(){const b=document.getElementById('oninststudents2');if(!b)return;let a=arr(OK.S).filter(x=>x.institution===onUser.id);b.innerHTML=card('Alunos',`<p>Os alunos entram através do portal institucional e ficam associados à instituição.</p>${a.length?a.map(s=>`<div class="on-v2-card"><strong>${esc(s.name)}</strong><p>${esc(s.email||s.phone||'')} · ${statusTag(s.status)}</p><button class="on-v2-btn" onclick="approveInstitutionStudentV3('${s.id}')">${s.status==='approved'?'Ativo':'Ativar aluno'}</button></div>`).join(''):'<div class="on-v2-empty">Nenhum aluno associado.</div>'}`)}
  window.approveInstitutionStudentV3=function(id){let a=arr(OK.S),x=by(a,id);if(!x)return;x.status='approved';put(OK.S,a);renderOn()};

  function renderInstClasses(){const b=document.getElementById('oninstclasses2');if(!b)return;let courses=institutionCourses().filter(x=>x.status==='approved'),teachers=arr(OK.T).filter(x=>x.institution===onUser.id&&x.status==='approved'),classes=arr(V3.IT).filter(x=>x.institution===onUser.id);b.innerHTML=card('Turmas',`${!instApproved()?'<div class="on-v2-alert warn">Aprovação da instituição necessária.</div>':''}<form class="on-form" onsubmit="saveInstClassV3(event)"><div><label>Curso</label><select id="v3clCourse" required><option value="">Selecione</option>${courses.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div><div><label>Professor</label><select id="v3clTeacher" required><option value="">Selecione</option>${teachers.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join('')}</select></div><div><label>Nome da turma</label><input id="v3clName" placeholder="Ex.: 10ª Classe A" required></div><div><label>Dia</label><select id="v3clDay"><option>Segunda-feira</option><option>Terça-feira</option><option>Quarta-feira</option><option>Quinta-feira</option><option>Sexta-feira</option><option>Sábado</option></select></div><div><label>Hora</label><input id="v3clTime" type="time" required></div><div><label>Duração</label><input id="v3clDur" type="number" value="60" min="15"></div><div><label>Link da sala</label><input id="v3clRoom" placeholder="Meet / Zoom / outra sala"></div><div><label>Limite de alunos</label><input id="v3clMax" type="number" value="30" min="1"></div><button class="on-btn on-full" ${!instApproved()?'disabled':''}>Criar turma</button></form><hr>${classes.length?classes.map(c=>`<div class="on-v2-card"><strong>${esc(c.name)}</strong><p>${esc(c.courseName)} · ${esc(c.teacherName)} · ${esc(c.day)} ${esc(c.time)}</p><p>${c.students?.length||0}/${c.maxStudents} alunos · ${c.room?`<a href="${esc(c.room)}" target="_blank">Sala</a>`:'Sem sala'}</p><button class="on-v2-btn" onclick="manageClassStudentsV3('${c.id}')">Alunos</button></div>`).join(''):'<div class="on-v2-empty">Nenhuma turma criada.</div>'}`)}
  window.saveInstClassV3=function(e){e.preventDefault();if(!instApproved())return alert('Instituição não aprovada.');let courses=institutionCourses(),c=by(courses,v3clCourse.value),ts=arr(OK.T),t=by(ts,v3clTeacher.value),a=arr(V3.IT);if(!c||!t)return alert('Selecione curso e professor.');a.push({id:oid('iclass'),institution:onUser.id,name:v3clName.value.trim(),course:c.id,courseName:c.name,teacher:t.id,teacherName:t.name,day:v3clDay.value,time:v3clTime.value,duration:+v3clDur.value||60,room:v3clRoom.value.trim(),maxStudents:+v3clMax.value||30,students:[],createdAt:new Date().toISOString()});put(V3.IT,a);alert('Turma criada.');renderOn()};
  window.manageClassStudentsV3=function(id){let a=arr(V3.IT),c=by(a,id),students=arr(OK.S).filter(s=>s.institution===onUser.id&&s.status==='approved');if(!c)return;onModalBody.innerHTML=`<div class="on-v2-card"><h3>Alunos · ${esc(c.name)}</h3><select id="v3studentAdd" style="width:100%;padding:10px"><option value="">Selecionar aluno</option>${students.filter(s=>!(c.students||[]).includes(s.id)).map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select><button class="on-v2-btn" onclick="addStudentToClassV3('${id}')">Adicionar</button><hr>${(c.students||[]).map(id=>{let s=by(students,id);return s?`<p>• ${esc(s.name)}</p>`:''}).join('')||'<p>Nenhum aluno.</p>'}</div>`;onModal.classList.add('show')};
  window.addStudentToClassV3=function(id){let a=arr(V3.IT),c=by(a,id),sid=document.getElementById('v3studentAdd')?.value;if(!c||!sid)return;if((c.students||[]).length>=c.maxStudents)return alert('Limite da turma atingido.');c.students=c.students||[];if(!c.students.includes(sid))c.students.push(sid);put(V3.IT,a);closeOnModal();renderOn()};

  function renderInstCalendar(){const b=document.getElementById('oninstcalendar');if(!b)return;let a=arr(V3.CAL).filter(x=>x.institution===onUser.id);b.innerHTML=card('Calendário académico',`<form class="on-form" onsubmit="saveInstCalendarV3(event)"><div><label>Evento</label><input id="v3calTitle" required></div><div><label>Data</label><input id="v3calDate" type="date" required></div><div><label>Hora</label><input id="v3calTime" type="time"></div><div><label>Tipo</label><select id="v3calType"><option>Aula</option><option>Teste</option><option>Exame</option><option>Reunião</option><option>Evento</option><option>Feriado</option></select></div><button class="on-btn on-full">Adicionar ao calendário</button></form>${a.length?a.map(x=>`<div class="on-v2-card"><strong>${esc(x.date)} · ${esc(x.time||'')}</strong><p>${esc(x.title)} · ${esc(x.type)}</p></div>`).join(''):'<div class="on-v2-empty">Nenhum evento.</div>'}`)}
  window.saveInstCalendarV3=function(e){e.preventDefault();let a=arr(V3.CAL);a.push({id:oid('cal'),institution:onUser.id,title:v3calTitle.value.trim(),date:v3calDate.value,time:v3calTime.value,type:v3calType.value});put(V3.CAL,a);renderOn()};
  function renderInstEval(){const b=document.getElementById('oninsteval');if(!b)return;let ev=arr(V3.EV).filter(x=>x.institution===onUser.id),students=arr(OK.S).filter(x=>x.institution===onUser.id),classes=arr(V3.IT).filter(x=>x.institution===onUser.id);b.innerHTML=card('Avaliações e notas',`<form class="on-form" onsubmit="saveEvalV3(event)"><div><label>Turma</label><select id="v3evClass" required><option value="">Selecione</option>${classes.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div><div><label>Aluno</label><select id="v3evStudent" required><option value="">Selecione</option>${students.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></div><div><label>Avaliação</label><input id="v3evTitle" required placeholder="Teste 1"></div><div><label>Nota</label><input id="v3evGrade" type="number" min="0" max="20" step="0.1" required></div><button class="on-btn on-full">Registar nota</button></form>${ev.length?ev.map(x=>`<div class="on-v2-card"><strong>${esc(x.title)}</strong><p>${esc(x.studentName)} · ${esc(x.className)} · Nota: <strong>${x.grade}/20</strong></p></div>`).join(''):'<div class="on-v2-empty">Nenhuma avaliação registada.</div>'}`)}
  window.saveEvalV3=function(e){e.preventDefault();let c=by(arr(V3.IT),v3evClass.value),s=by(arr(OK.S),v3evStudent.value),a=arr(V3.EV);if(!c||!s)return;a.push({id:oid('ev'),institution:onUser.id,classId:c.id,className:c.name,student:s.id,studentName:s.name,title:v3evTitle.value.trim(),grade:+v3evGrade.value,createdAt:new Date().toISOString()});put(V3.EV,a);renderOn()};
  function renderInstReports(){const b=document.getElementById('oninstreports');if(!b)return;let students=arr(OK.S).filter(x=>x.institution===onUser.id),teachers=arr(OK.T).filter(x=>x.institution===onUser.id),classes=arr(V3.IT).filter(x=>x.institution===onUser.id),ev=arr(V3.EV).filter(x=>x.institution===onUser.id),att=arr(V3.AT).filter(x=>x.institution===onUser.id);b.innerHTML=card('Relatórios',`<div class="on-v2-kpis"><div class="on-v2-kpi"><small>Alunos</small><strong>${students.length}</strong></div><div class="on-v2-kpi"><small>Professores</small><strong>${teachers.length}</strong></div><div class="on-v2-kpi"><small>Turmas</small><strong>${classes.length}</strong></div><div class="on-v2-kpi"><small>Avaliações</small><strong>${ev.length}</strong></div><div class="on-v2-kpi"><small>Registos de presença</small><strong>${att.length}</strong></div></div><p>Os relatórios são calculados a partir dos dados reais da instituição.</p>`)}
  function renderInstFinance(){const b=document.getElementById('oninstfinance2');if(!b)return;let tx=arr(OK.TX).filter(x=>x.institution===onUser.id),po=arr(OK.PO).filter(x=>x.institution===onUser.id&&x.status==='completed'),gross=tx.reduce((a,x)=>a+Number(x.gross||0),0),fee=tx.reduce((a,x)=>a+Number(x.fee||0),0),paid=po.reduce((a,x)=>a+Number(x.amount||0),0);b.innerHTML=card('Financeiro institucional',`<div class="on-v2-kpis"><div class="on-v2-kpi"><small>Receita bruta</small><strong>${fmt(gross)}</strong></div><div class="on-v2-kpi"><small>Comissão APSAN</small><strong>${fmt(fee)}</strong></div><div class="on-v2-kpi"><small>Saques pagos</small><strong>${fmt(paid)}</strong></div><div class="on-v2-kpi"><small>Disponível</small><strong>${fmt(gross-fee-paid)}</strong></div></div><form class="on-form" onsubmit="requestInstitutionPayoutV3(event)"><div><label>Montante a levantar (Kz)</label><input id="v3payout" type="number" min="1" max="${Math.max(0,gross-fee-paid)}" required></div><div><label>IBAN</label><input id="v3iban" required></div><div><label>Banco</label><input id="v3bank" required></div><div><label>Titular</label><input id="v3holder" required></div><button class="on-btn">Solicitar saque</button></form>`)}
  window.requestInstitutionPayoutV3=function(e){e.preventDefault();let a=arr(OK.PO),amount=+v3payout.value||0;a.push({id:oid('ipayout'),institution:onUser.id,institutionName:onUser.name,amount,method:'Banco',details:{iban:v3iban.value,bank:v3bank.value,holder:v3holder.value},status:'pending',createdAt:new Date().toISOString()});put(OK.PO,a);alert('Pedido de saque enviado à APSAN.');renderOn()};

  function renderInstitutionTeacherV3(){
    injectSections();['tprofile2','toffer2','tclasses2','tmaterials2','tattendance2','tstudents2','tfinance2'].forEach((x,i)=>navExtra('onTeacherNav',['Perfil profissional','Programa institucional','Turmas/Aulas','Materiais','Presenças','Alunos','Financeiro'][i],x));
    const inst=by(arr(OK.IN),onUser.institution), classes=arr(V3.IT).filter(x=>x.institution===onUser.institution&&x.teacher===onUser.id), courses=institutionCourses().filter(x=>x.status==='approved'), tx=arr(OK.TX).filter(x=>x.teacher===onUser.id);
    onStats.innerHTML=`<div class="on-v2-kpi"><small>Instituição</small><strong>${esc(inst?.name||onUser.institutionName||'-')}</strong></div><div class="on-v2-kpi"><small>Turmas</small><strong>${classes.length}</strong></div><div class="on-v2-kpi"><small>Alunos</small><strong>${classes.reduce((n,c)=>n+(c.students?.length||0),0)}</strong></div><div class="on-v2-kpi"><small>Estado</small><strong>${statusTag(onUser.status)}</strong></div>`;
    onHomeBox.innerHTML=card(`Olá, ${esc(onUser.name)}`,`<p>Professor institucional · ${esc(inst?.name||onUser.institutionName||'')}</p><p>As turmas, alunos, materiais e presenças atribuídos pela instituição aparecem aqui.</p>`);
    renderTProfile(inst);renderTOffer(courses);renderTClasses(classes);renderTMaterials(classes);renderTAttendance(classes);renderTStudents(classes);renderTFinance(tx);
  }
  function renderTProfile(inst){const b=document.getElementById('ontprofile2');if(!b)return;b.innerHTML=card('Perfil profissional',`<form class="on-form" onsubmit="saveTProfileV3(event)"><div><label>Nome</label><input id="v3tpName" value="${esc(onUser.name)}" required></div><div><label>Especialidade</label><input id="v3tpSub" value="${esc(onUser.sub||'')}" required></div><div class="on-full"><label>Biografia</label><textarea id="v3tpBio">${esc(onUser.bio||'')}</textarea></div><div class="on-full"><label>Qualificações</label><textarea id="v3tpQual">${esc(onUser.qualifications||'')}</textarea></div><div class="on-full"><label>Foto profissional</label><input id="v3tpPhoto" type="file" accept="image/png,image/jpeg,image/webp"></div><button class="on-btn on-full">Guardar perfil</button></form><p>Instituição: <strong>${esc(inst?.name||onUser.institutionName||'-')}</strong></p>`)}
  window.saveTProfileV3=async function(e){e.preventDefault();let a=arr(OK.T),x=by(a,onUser.id);if(!x)return;x.name=v3tpName.value.trim();x.sub=v3tpSub.value.trim();x.bio=v3tpBio.value.trim();x.qualifications=v3tpQual.value.trim();try{let f=await saveBase64File(document.getElementById('v3tpPhoto'),2);if(f)x.photo=f}catch(err){return alert(err.message)}put(OK.T,a);onUser=x;alert('Perfil atualizado.');renderOn()};
  function renderTOffer(courses){const b=document.getElementById('ontoffer2');if(!b)return;let own=arr(OK.O).find(o=>o.teacher===onUser.id&&o.institution===onUser.institution);b.innerHTML=card('Programa institucional',`<p>O professor pode propor uma disciplina/programa. A publicação depende da aprovação da instituição/APSAN.</p><form class="on-form" onsubmit="saveTOfferV3(event)"><div><label>Curso</label><select id="v3toCourse"><option value="">Selecione</option>${courses.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div><div><label>Nome da disciplina</label><input id="v3toName" required value="${esc(own?.name||'')}"></div><div class="on-full"><label>Descrição</label><textarea id="v3toDesc" required>${esc(own?.description||'')}</textarea></div><div><label>Nível</label><input id="v3toLevel" value="${esc(own?.level||'')}"></div><div><label>Modalidade</label><select id="v3toMode"><option>Online</option><option>Híbrido</option><option>Presencial</option></select></div><button class="on-btn on-full">${own?'Atualizar':'Criar'} programa</button></form>${own?`<p>Estado: ${statusTag(own.status)}</p>`:''}`)}
  window.saveTOfferV3=function(e){e.preventDefault();let a=arr(OK.O),o=a.find(x=>x.teacher===onUser.id&&x.institution===onUser.institution);let c=by(institutionCourses(),v3toCourse.value);if(!o){o={id:oid('toffer'),ownerType:'institution',institution:onUser.institution,institutionName:onUser.institutionName,teacher:onUser.id,teacherName:onUser.name,name:v3toName.value.trim(),description:v3toDesc.value.trim(),level:v3toLevel.value,mode:v3toMode.value,duration:60,monthClasses:8,enrollmentFee:0,monthlyFee:0,maxStudents:30,status:'pending',createdAt:new Date().toISOString()};a.push(o)}else Object.assign(o,{course:c?.id||o.course,name:v3toName.value.trim(),description:v3toDesc.value.trim(),level:v3toLevel.value,mode:v3toMode.value,status:'pending'});if(c)o.course=c.id;put(OK.O,a);alert('Programa enviado para validação.');renderOn()};
  function renderTClasses(classes){const b=document.getElementById('ontclasses2');if(!b)return;b.innerHTML=card('Minhas turmas e aulas',classes.length?classes.map(c=>`<div class="on-v2-card"><strong>${esc(c.name)}</strong><p>${esc(c.courseName)} · ${esc(c.day)} ${esc(c.time)} · ${c.students?.length||0} alunos</p>${c.room?`<a class="on-v2-btn" href="${esc(c.room)}" target="_blank">Sala virtual</a>`:''}</div>`).join(''):'<div class="on-v2-empty">A instituição ainda não lhe atribuiu turmas.</div>')}
  function renderTMaterials(classes){const b=document.getElementById('ontmaterials2');if(!b)return;b.innerHTML=card('Materiais das turmas',`<form class="on-form" onsubmit="saveTMaterialV3(event)"><div><label>Turma</label><select id="v3matClass" required>${classes.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div><div><label>Título</label><input id="v3matTitle" required></div><div><label>Link</label><input id="v3matUrl" placeholder="https://..." required></div><div><label>Tipo</label><select id="v3matType"><option>PDF</option><option>Vídeo</option><option>Exercício</option><option>Link</option><option>Outro</option></select></div><button class="on-btn">Publicar material</button></form><div id="v3teacherMaterials"></div>`);let m=arr(OK.M).filter(x=>x.teacher===onUser.id);document.getElementById('v3teacherMaterials').innerHTML=m.map(x=>`<div class="on-v2-card"><strong>${esc(x.title)}</strong><p>${esc(x.type)} · <a href="${esc(x.url)}" target="_blank">Abrir</a></p></div>`).join('')||'<div class="on-v2-empty">Nenhum material.</div>'}
  window.saveTMaterialV3=function(e){e.preventDefault();let a=arr(OK.M);a.push({id:oid('mat'),teacher:onUser.id,institution:onUser.institution,classId:v3matClass.value,title:v3matTitle.value.trim(),url:v3matUrl.value.trim(),type:v3matType.value,createdAt:new Date().toISOString()});put(OK.M,a);renderOn()};
  function renderTAttendance(classes){
    const b=document.getElementById('ontattendance2'); if(!b)return;
    const students=arr(OK.S), a=arr(V3.AT).filter(x=>x.teacher===onUser.id);
    let body='';
    classes.forEach(c=>{
      body += '<div class="on-v2-card"><strong>'+esc(c.name)+'</strong>';
      const ids=c.students||[];
      if(!ids.length) body += '<p>Sem alunos.</p>';
      ids.forEach(sid=>{
        const s=by(students,sid); if(!s)return;
        body += '<div style="display:flex;gap:8px;align-items:center;margin:8px 0"><span style="flex:1">'+esc(s.name)+'</span><button class="on-v2-btn" onclick="markAttendanceV3(\''+c.id+'\',\''+sid+'\',\'present\')">Presente</button><button class="on-v2-btn alt" onclick="markAttendanceV3(\''+c.id+'\',\''+sid+'\',\'absent\')">Ausente</button></div>';
      });
      body += '</div>';
    });
    if(!body) body='<div class="on-v2-empty">Nenhuma turma.</div>';
    b.innerHTML=card('Presenças',body+'<p>Registos: '+a.length+'</p>');
  }
  window.markAttendanceV3=function(cid,sid,status){let a=arr(V3.AT);a.push({id:oid('att'),institution:onUser.institution,teacher:onUser.id,classId:cid,student:sid,status,date:new Date().toISOString()});put(V3.AT,a);alert('Presença registada.');renderOn()};
  function renderTStudents(classes){
    const b=document.getElementById('ontstudents2'); if(!b)return;
    const students=arr(OK.S); let body='';
    classes.forEach(c=>{ body+='<div class="on-v2-card"><strong>'+esc(c.name)+'</strong>'; const ids=c.students||[]; if(!ids.length) body+='<p>Nenhum aluno.</p>'; ids.forEach(id=>{const s=by(students,id);if(s) body+='<p>• '+esc(s.name)+' · '+esc(s.email||s.phone||'')+'</p>';}); body+='</div>'; });
    b.innerHTML=card('Alunos',body||'<div class="on-v2-empty">Nenhum aluno atribuído.</div>');
  }
  function renderTFinance(tx){const b=document.getElementById('ontfinance2');if(!b)return;let gross=tx.reduce((a,x)=>a+Number(x.gross||0),0),fee=tx.reduce((a,x)=>a+Number(x.fee||0),0);b.innerHTML=card('Financeiro',`<div class="on-v2-kpis"><div class="on-v2-kpi"><small>Bruto</small><strong>${fmt(gross)}</strong></div><div class="on-v2-kpi"><small>Comissão</small><strong>${fmt(fee)}</strong></div><div class="on-v2-kpi"><small>Líquido</small><strong>${fmt(gross-fee)}</strong></div></div><p>Os pagamentos são confirmados pela APSAN antes de entrarem no financeiro.</p>`) }

  function renderInstitutionStudentV3(){
    injectSections();['sclasses2','smaterials2','sprogress2','spayments2'].forEach((x,i)=>navExtra('onStudentNav',['Minhas aulas','Materiais','Progresso','Pagamentos'][i],x));
    const inst=by(arr(OK.IN),onUser.institution),classes=arr(V3.IT).filter(x=>x.institution===onUser.institution&&x.students?.includes(onUser.id)),att=arr(V3.AT).filter(x=>x.student===onUser.id),ev=arr(V3.EV).filter(x=>x.student===onUser.id),pay=arr(OK.P).filter(x=>x.student===onUser.id);
    onStats.innerHTML=`<div class="on-v2-kpi"><small>Instituição</small><strong>${esc(inst?.name||onUser.institutionName||'')}</strong></div><div class="on-v2-kpi"><small>Turmas</small><strong>${classes.length}</strong></div><div class="on-v2-kpi"><small>Presenças</small><strong>${att.filter(x=>x.status==='present').length}</strong></div><div class="on-v2-kpi"><small>Avaliações</small><strong>${ev.length}</strong></div>`;
    onHomeBox.innerHTML=card(`Olá, ${esc(onUser.name)}`,`<p>Aluno institucional · ${esc(inst?.name||onUser.institutionName||'')}</p><p>As disciplinas, turmas, materiais, presenças e avaliações aparecem nesta área.</p>`);renderSClasses(classes);renderSMaterials(classes);renderSProgress(att,ev);renderSPayments(pay);
  }
  function renderSClasses(classes){const b=document.getElementById('onsclasses2');if(!b)return;b.innerHTML=card('Minhas aulas',classes.length?classes.map(c=>`<div class="on-v2-card"><strong>${esc(c.name)}</strong><p>${esc(c.courseName)} · ${esc(c.day)} ${esc(c.time)}</p>${c.room?`<a class="on-v2-btn" href="${esc(c.room)}" target="_blank">Entrar na sala</a>`:''}</div>`).join(''):'<div class="on-v2-empty">Ainda não foi associado a nenhuma turma.</div>')}
  function renderSMaterials(classes){const b=document.getElementById('onsmaterials2');if(!b)return;let ids=new Set(classes.map(c=>c.id)),m=arr(OK.M).filter(x=>ids.has(x.classId));b.innerHTML=card('Materiais',m.length?m.map(x=>`<div class="on-v2-card"><strong>${esc(x.title)}</strong><p>${esc(x.type)} · <a href="${esc(x.url)}" target="_blank">Abrir material</a></p></div>`).join(''):'<div class="on-v2-empty">Nenhum material disponibilizado.</div>')}
  function renderSProgress(att,ev){const b=document.getElementById('onsprogress2');if(!b)return;let p=att.filter(x=>x.status==='present').length,total=att.length,avg=ev.length?ev.reduce((a,x)=>a+Number(x.grade||0),0)/ev.length:0;b.innerHTML=card('Progresso académico',`<div class="on-v2-kpis"><div class="on-v2-kpi"><small>Presença</small><strong>${total?Math.round(p/total*100):0}%</strong></div><div class="on-v2-kpi"><small>Avaliações</small><strong>${ev.length}</strong></div><div class="on-v2-kpi"><small>Média</small><strong>${avg.toFixed(1)}/20</strong></div></div>${ev.map(x=>`<div class="on-v2-card"><strong>${esc(x.title)}</strong><p>${esc(x.className)} · ${x.grade}/20</p></div>`).join('')}`)}
  function renderSPayments(pay){const b=document.getElementById('onspayments2');if(!b)return;b.innerHTML=card('Pagamentos',pay.length?pay.map(x=>`<div class="on-v2-card"><strong>${esc(x.type||'Pagamento')}</strong><p>${fmt(x.amount)} · ${statusTag(x.status)} · ${datePT(x.createdAt)}</p></div>`).join(''):'<div class="on-v2-empty">Nenhum pagamento.</div>')}

  const oldRenderOn=window.renderOn;
  window.renderOn=function(){ensure();injectSections();if(!onUser)return;if(onRole==='institution')renderInstitutionV3();else if(onRole==='teacher'&&onInstitutionMode==='teacher')renderInstitutionTeacherV3();else if(onRole==='student'&&onInstitutionMode==='student')renderInstitutionStudentV3();else oldRenderOn();};
  const oldOpenOnline=window.openOnline;
  window.openOnline=function(r){if(r==='institution')return openInstitutionPortal();onInstitutionMode=r==='teacher'?'private':'private';return oldOpenOnline(r)};
  ensure();
})();


/* ===== Código original: linhas 3423-3455 ===== */
(function(){
  function activateAdminTabFromButton(btn){
    if(!btn)return;
    const tab=btn.getAttribute('data-admin-tab');
    if(!tab)return;
    try{
      if(typeof window.showAdminTab==='function') window.showAdminTab(tab,btn);
      else {
        const ids={overview:'adminOverviewTab',products:'adminProductsTab',orders:'adminOrdersTab',withdrawals:'adminWithdrawalsTab',sellers:'adminSellersTab',online:'adminOnlineTab'};
        Object.keys(ids).forEach(k=>{const el=document.getElementById(ids[k]);if(el)el.style.display=k===tab?'block':'none';});
        document.querySelectorAll('.admin-pro-nav-btn').forEach(x=>x.classList.toggle('active',x===btn));
      }
    }catch(err){
      console.error('APSAN admin navigation:',err);
      // Even if a renderer has a problem, the selected section still opens.
      const ids={overview:'adminOverviewTab',products:'adminProductsTab',orders:'adminOrdersTab',withdrawals:'adminWithdrawalsTab',sellers:'adminSellersTab',online:'adminOnlineTab'};
      Object.keys(ids).forEach(k=>{const el=document.getElementById(ids[k]);if(el)el.style.display=k===tab?'block':'none';});
      document.querySelectorAll('.admin-pro-nav-btn').forEach(x=>x.classList.toggle('active',x===btn));
    }
  }
  function bind(){
    document.addEventListener('click',function(ev){
      const btn=ev.target.closest && ev.target.closest('.admin-pro-nav-btn[data-admin-tab]');
      if(!btn)return;
      ev.preventDefault();
      ev.stopPropagation();
      activateAdminTabFromButton(btn);
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);
  else bind();
})();


/* ===== Código original: linhas 3459-3765 ===== */
(function(){
  const KEY='apsan_current_view_v1';

  function save(view,extra){
    try{sessionStorage.setItem(KEY,JSON.stringify(Object.assign({view:view},extra||{})));}catch(e){}
  }
  function clear(){try{sessionStorage.removeItem(KEY);}catch(e){}}

  function hideAllAppPages(){
    document.querySelectorAll('.purchase-page,.customer-page,.admin-login-page,.admin-page,.app-page,.seller-sales-page,.seller-registration-page,.seller-dashboard-page').forEach(el=>{
      el.classList.remove('visible');
    });
    const online=document.getElementById('onlinePage');
    if(online)online.classList.remove('show');
  }

  function restore(){
    let state=null;
    try{state=JSON.parse(sessionStorage.getItem(KEY)||'null');}catch(e){}
    if(!state)return;
    setTimeout(function(){
      try{
        hideAllAppPages();
        if(state.view==='admin' && typeof window.openAdminPage==='function'){
          window.openAdminPage();
        }else if(state.view==='online' && typeof window.openOnline==='function'){
          window.onRole=state.role||'teacher';
          window.onInstitutionMode=state.institutionMode||'';
          window.onStudentMode='private';
          window.openOnline(state.role||'teacher');
        }else if(state.view==='customer' && typeof window.openCustomerPortal==='function'){
          window.openCustomerPortal();
        }else if(state.view==='seller-sales' && typeof window.openSellerSales==='function'){
          window.openSellerSales();
        }else if(state.view==='seller-registration' && typeof window.openSellerRegistration==='function'){
          window.openSellerRegistration();
        }else if(state.view==='purchase' && state.id && typeof window.openPurchasePage==='function'){
          window.openPurchasePage(state.id);
        }
      }catch(err){console.warn('APSAN restore view:',err);}
    },80);
  }

  function wrap(name,view,extraFn){
    const fn=window[name];
    if(typeof fn!=='function')return;
    if(fn.__apsanWrapped)return;
    function wrapped(){
      const result=fn.apply(this,arguments);
      try{
        const extra=extraFn?extraFn(arguments):{};
        save(view,extra);
      }catch(e){}
      return result;
    }
    wrapped.__apsanWrapped=true;
    window[name]=wrapped;
  }

  function bindWrappers(){
    wrap('openAdminPage','admin');
    wrap('openCustomerPortal','customer');
    wrap('openSellerSales','seller-sales');
    wrap('openSellerRegistration','seller-registration');
    wrap('openPurchasePage','purchase',args=>({id:args[0]}));
    wrap('openOnline','online',args=>({role:args[0]||window.onRole||'teacher',institutionMode:window.onInstitutionMode||''}));

    // Keep the current view updated when the user switches sections inside it.
    const originalShow=window.showAdminTab;
    if(typeof originalShow==='function' && !originalShow.__apsanWrapped){
      const wrappedShow=function(tab,btn){
        const result=originalShow.apply(this,arguments);
        if(tab==='overview'||tab==='products'||tab==='orders'||tab==='withdrawals'||tab==='sellers'||tab==='online')save('admin',{adminTab:tab});
        return result;
      };
      wrappedShow.__apsanWrapped=true;
      window.showAdminTab=wrappedShow;
    }
  }

  function bindClosePersistence(){
    ['closeAdminPage','closeCustomerPortal','closeSellerSales','closePurchasePage'].forEach(name=>{
      const fn=window[name];
      if(typeof fn!=='function'||fn.__apsanCloseWrapped)return;
      function wrappedClose(){
        const result=fn.apply(this,arguments);
        clear();
        return result;
      }
      wrappedClose.__apsanCloseWrapped=true;
      window[name]=wrappedClose;
    });
  }

  function init(){
    bindWrappers();
    bindClosePersistence();
    restore();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();

  window.addEventListener('beforeunload',function(){
    // The last saved SPA view remains in sessionStorage, so a normal browser
    // refresh returns to the same section.
  });
})();

/* ============================================================
   APSAN — CENTRO ADMINISTRATIVO GLOBAL
   Camada adicional: não substitui nem apaga os módulos existentes.
   ============================================================ */
const APSAN_ADMIN_AUDIT_KEY="apsan_admin_audit_v1";
const APSAN_ADMIN_SETTINGS_KEY="apsan_admin_settings_v1";
function apsanAdminAudit(action,details){
  const a=og(APSAN_ADMIN_AUDIT_KEY);
  a.unshift({id:oid("AUD-"),action:String(action||""),details:String(details||""),at:new Date().toISOString()});
  os(APSAN_ADMIN_AUDIT_KEY,a.slice(0,500));
}
function apsanAdminSettings(){
  return Object.assign({
    publicRegistrations:true,
    teacherApproval:true,
    institutionApproval:true,
    productApproval:true,
    onlinePayments:true,
    maintenanceMode:false
  },og(APSAN_ADMIN_SETTINGS_KEY)[0]||{});
}
function apsanAdminCountPending(){
  const products=getData(PRODUCTS_KEY), teachers=og(OK.T), institutions=og(OK.IN),
        offers=og(OK.O), enrollments=og(OK.E), payments=og(OK.P),
        withdrawals=getData(WITHDRAWALS_KEY);
  return products.filter(x=>x.status==="pending"&&!x.deleted).length+
    teachers.filter(x=>x.status==="pending").length+
    institutions.filter(x=>x.status==="pending").length+
    offers.filter(x=>x.status==="pending").length+
    enrollments.filter(x=>["under_review","payment_submitted"].includes(x.status)).length+
    payments.filter(x=>x.status==="under_review").length+
    withdrawals.filter(x=>["requested","pending","approved","processing"].includes(x.status)).length;
}
function apsanAdminRefreshCounts(){
  const map={
    adminNavApprovalsCount:apsanAdminCountPending(),
    adminNavProductsCount:getData(PRODUCTS_KEY).filter(x=>x.status==="pending"&&!x.deleted).length,
    adminNavOrdersCount:getData(ORDERS_KEY).length,
    adminNavSellersCount:getData(STORAGE_KEY).length,
    adminNavWithdrawalsCount:getData(WITHDRAWALS_KEY).filter(x=>["requested","pending","approved","processing"].includes(x.status)).length,
    adminNavOnlineCount:og(OK.T).filter(x=>x.status==="pending").length+og(OK.IN).filter(x=>x.status==="pending").length+og(OK.E).filter(x=>["under_review","payment_submitted"].includes(x.status)).length,
    adminNavUsersCount:og(OK.T).length+og(OK.S).length+og(OK.IN).length+getData(STORAGE_KEY).length
  };
  Object.keys(map).forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=map[id]});
}
function apsanAdminRenderApprovals(){
  const box=document.getElementById("adminApprovalsTab");if(!box)return;
  const products=getData(PRODUCTS_KEY).filter(x=>x.status==="pending"&&!x.deleted);
  const teachers=og(OK.T).filter(x=>x.status==="pending");
  const institutions=og(OK.IN).filter(x=>x.status==="pending");
  const offers=og(OK.O).filter(x=>x.status==="pending");
  const enrollments=og(OK.E).filter(x=>["under_review","payment_submitted"].includes(x.status));
  const payments=og(OK.P).filter(x=>x.status==="under_review");
  const withdrawals=getData(WITHDRAWALS_KEY).filter(x=>["requested","pending"].includes(x.status));
  const cards=[
    ["Produtos",products.length,"fa-box-open","products"],
    ["Professores",teachers.length,"fa-chalkboard-user","online"],
    ["Instituições",institutions.length,"fa-building-columns","online"],
    ["Programas",offers.length,"fa-book-open","online"],
    ["Matrículas",enrollments.length,"fa-user-check","online"],
    ["Pagamentos",payments.length,"fa-money-check-dollar","online"],
    ["Saques",withdrawals.length,"fa-money-bill-transfer","withdrawals"]
  ];
  box.innerHTML=`<div class="admin-pro-section-title"><div><span>WORKFLOW</span><h2>Central de aprovações</h2><p>Todas as pendências críticas do site num único lugar.</p></div></div>
  <div class="admin-global-grid">${cards.map(c=>`<div class="admin-global-card"><span class="admin-global-pill ${c[1]?'pending':'ok'}"><i class="fa-solid ${c[2]}"></i> ${c[0]}</span><div class="admin-global-number">${c[1]}</div><p>${c[1]?'Existem itens a aguardar decisão.':'Nenhuma pendência nesta área.'}</p><button class="admin-global-btn ${c[1]?'primary':''}" style="margin-top:10px" onclick="showAdminTab('${c[3]}',document.querySelector('[data-admin-tab=${c[3]}]'))">Abrir gestão</button></div>`).join("")}</div>
  <div class="admin-global-section"><div class="admin-global-section-head"><div><h2>Prioridades</h2><p>Comece pelas áreas com pendências.</p></div></div>
  <div class="admin-global-list">${cards.filter(c=>c[1]).map(c=>`<div class="admin-global-list-item"><div><strong>${c[0]} · ${c[1]} pendência(s)</strong><small>Ação administrativa disponível.</small></div><button class="admin-global-btn primary" onclick="showAdminTab('${c[3]}',document.querySelector('[data-admin-tab=${c[3]}]'))">Abrir</button></div>`).join("")||'<div class="admin-global-empty">Tudo limpo. Não existem aprovações pendentes.</div>'}</div></div>`;
  apsanAdminRefreshCounts();
}
function apsanAdminAllUsers(){
  const arr=[];
  og(OK.T).forEach(x=>arr.push({id:x.id,name:x.name||"—",type:"Professor",email:x.email||"—",status:x.status||"—",key:OK.T}));
  og(OK.S).forEach(x=>arr.push({id:x.id,name:x.name||"—",type:x.studentType==="institution"?"Aluno institucional":"Aluno particular",email:x.email||"—",status:x.status||"—",key:OK.S}));
  og(OK.IN).forEach(x=>arr.push({id:x.id,name:x.name||x.legalName||"—",type:"Instituição",email:x.email||"—",status:x.status||"—",key:OK.IN}));
  getData(STORAGE_KEY).forEach(x=>arr.push({id:x.id,name:x.name||"—",type:"Vendedor",email:x.email||"—",status:x.approved===false?"pending":"approved",key:STORAGE_KEY}));
  return arr;
}
function apsanAdminRenderUsers(filter){
  const box=document.getElementById("adminUsersTab");if(!box)return;
  const users=apsanAdminAllUsers(),q=String(filter??"").trim().toLowerCase();
  const shown=q?users.filter(u=>(u.name+" "+u.email+" "+u.type+" "+u.status).toLowerCase().includes(q)):users;
  box.innerHTML=`<div class="admin-pro-section-title"><div><span>UTILIZADORES</span><h2>Gestão global de utilizadores</h2><p>Edite, ajuste, suspenda, rejeite ou elimine contas conforme a necessidade administrativa.</p></div></div>
  <div class="admin-global-toolbar"><input class="admin-global-input" id="apsanAdminUserSearch" value="${esc(q)}" placeholder="Pesquisar por nome, e-mail, tipo ou estado"><button class="admin-global-btn primary" onclick="apsanAdminRenderUsers(document.getElementById('apsanAdminUserSearch').value)">Pesquisar</button><button class="admin-global-btn" onclick="apsanAdminRenderUsers('')">Limpar</button></div>
  <div class="admin-global-table-wrap"><table class="admin-global-table"><thead><tr><th>Utilizador</th><th>Tipo</th><th>Contacto</th><th>Estado</th><th>Ações administrativas</th></tr></thead><tbody>${shown.length?shown.map(u=>`<tr>
    <td><strong>${esc(u.name)}</strong><br><small>${esc(u.id)}</small></td>
    <td>${esc(u.type)}</td><td>${esc(u.email)}</td>
    <td><span class="admin-global-pill ${u.status==="approved"||u.status==="active"?"ok":u.status==="rejected"||u.status==="suspended"?"danger":"pending"}">${esc(u.status)}</span></td>
    <td><div class="admin-global-actions">
      <button class="admin-global-btn" onclick="apsanAdminOpenUserModal('${u.key}','${u.id}')"><i class="fa-solid fa-eye"></i> Ver</button>
      <button class="admin-global-btn" onclick="apsanAdminEditUser('${u.key}','${u.id}')"><i class="fa-solid fa-pen"></i> Editar</button>
      <button class="admin-global-btn" onclick="apsanAdminAdjustUser('${u.key}','${u.id}')"><i class="fa-solid fa-sliders"></i> Ajustar</button>
      ${!["rejected","suspended"].includes(u.status)?`<button class="admin-global-btn danger" onclick="apsanAdminSetUserStatus('${u.key}','${u.id}','suspended')"><i class="fa-solid fa-ban"></i> Suspender</button>`:""}
      ${u.status==="suspended"||u.status==="rejected"?`<button class="admin-global-btn success" onclick="apsanAdminSetUserStatus('${u.key}','${u.id}','approved')"><i class="fa-solid fa-rotate-left"></i> Reativar</button>`:""}
      <button class="admin-global-btn danger" onclick="apsanAdminDeleteUser('${u.key}','${u.id}')"><i class="fa-solid fa-trash"></i> Eliminar</button>
    </div></td>
  </tr>`).join(""):`<tr><td colspan="5"><div class="admin-global-empty">Nenhum utilizador encontrado.</div></td></tr>`}</tbody></table></div>`;
  apsanAdminRefreshCounts();
}
function apsanAdminInspectUser(key,id){
  const u=og(key).find(x=>x.id===id);if(!u)return;
  const safe=JSON.stringify(u,null,2);
  if(typeof onModalBody!=="undefined"&&typeof onModal!=="undefined"&&onModalBody&&onModal){
    onModalBody.innerHTML=`<div class="admin-global-section"><h2 style="margin:0 0 10px">Ficha administrativa</h2><div class="admin-global-code">${esc(safe)}</div></div>`;
    onModal.classList.add("show");
  }else alert(safe);
}
function apsanAdminToggleUser(key,id,status){
  const a=og(key),u=a.find(x=>x.id===id);if(!u)return;
  u.status=status;u.adminUpdatedAt=new Date().toISOString();os(key,a);
  apsanAdminAudit(status==="suspended"?"Utilizador suspenso":"Utilizador reativado",(u.name||id)+" · "+key);
  apsanAdminRenderUsers(document.getElementById("apsanAdminUserSearch")?.value||"");
  if(typeof renderAdminOnline==="function")renderAdminOnline();
}
function apsanAdminRenderFinance(){
  const box=document.getElementById("adminFinanceTab");if(!box)return;
  const products=getData(PRODUCTS_KEY),orders=getData(ORDERS_KEY),withdrawals=getData(WITHDRAWALS_KEY),sellers=getData(STORAGE_KEY);
  const payments=og(OK.P),enrollments=og(OK.E),tx=og(OK.TX),payouts=og(OK.PO);
  const marketplaceGross=orders.reduce((a,x)=>a+Number(x.total??x.amount??x.price??0),0);
  const onlineGross=payments.filter(x=>["approved","paid","completed"].includes(x.status)).reduce((a,x)=>a+Number(x.amount||0),0);
  const withdrawalFees=withdrawals.filter(x=>["completed","paid","transferido"].includes(x.status)).reduce((a,x)=>a+Number(x.feeAmount??withdrawalFinancials(x.grossAmount??x.amount).fee),0);
  const teacherFees=tx.filter(x=>["commission","fee"].includes(x.type)).reduce((a,x)=>a+Number(x.amount||0),0);
  const paidOut=payouts.filter(x=>["completed","paid"].includes(x.status)).reduce((a,x)=>a+Number(x.amount||0),0);
  const pendingPayouts=payouts.filter(x=>["requested","processing","approved"].includes(x.status)).reduce((a,x)=>a+Number(x.amount||0),0);
  box.innerHTML=`<div class="admin-pro-section-title"><div><span>FINANCEIRO</span><h2>Centro financeiro global</h2><p>Visão consolidada do marketplace e das Aulas Online.</p></div></div>
  <div class="admin-global-grid">
    <div class="admin-global-card"><span class="admin-global-pill info">Marketplace</span><div class="admin-global-number">${formatKz(marketplaceGross)}</div><p>Volume registado em compras.</p></div>
    <div class="admin-global-card"><span class="admin-global-pill info">Aulas Online</span><div class="admin-global-number">${formatKz(onlineGross)}</div><p>Pagamentos aprovados.</p></div>
    <div class="admin-global-card"><span class="admin-global-pill ok">Comissões</span><div class="admin-global-number">${formatKz(withdrawalFees+teacherFees)}</div><p>Receita de comissões registada.</p></div>
    <div class="admin-global-card"><span class="admin-global-pill pending">Saídas</span><div class="admin-global-number">${formatKz(paidOut+pendingPayouts)}</div><p>Pagamentos a professores/vendedores.</p></div>
  </div>
  <div class="admin-global-section"><div class="admin-global-section-head"><div><h2>Indicadores</h2><p>Dados atuais guardados no Local Storage.</p></div></div>
  <div class="admin-global-stat-row">
    <div class="admin-global-stat"><small>Pedidos de saque</small><strong>${withdrawals.length}</strong></div>
    <div class="admin-global-stat"><small>Transações de professores</small><strong>${tx.length}</strong></div>
    <div class="admin-global-stat"><small>Saldo estimado em carteiras</small><strong>${formatKz(sellers.reduce((a,x)=>a+Number(x.balance||0),0))}</strong></div>
  </div></div>
  <div class="admin-global-section"><div class="admin-global-section-head"><div><h2>Atalhos financeiros</h2><p>Abra a área operacional correspondente.</p></div></div><div class="admin-global-actions"><button class="admin-global-btn primary" onclick="showAdminTab('withdrawals',document.querySelector('[data-admin-tab=withdrawals]'))">Processar saques</button><button class="admin-global-btn" onclick="showAdminTab('online',document.querySelector('[data-admin-tab=online]'))">Aulas Online</button><button class="admin-global-btn" onclick="showAdminTab('orders',document.querySelector('[data-admin-tab=orders]'))">Compras</button></div></div>`;
}
function apsanAdminRenderAudit(){
  const box=document.getElementById("adminAuditTab");if(!box)return;
  const a=og(APSAN_ADMIN_AUDIT_KEY);
  box.innerHTML=`<div class="admin-pro-section-title"><div><span>AUDITORIA</span><h2>Registo de ações administrativas</h2><p>Histórico local das principais decisões tomadas no painel.</p></div><button class="admin-global-btn" onclick="apsanAdminClearAudit()">Limpar histórico</button></div>
  <div class="admin-global-section">${a.length?`<div class="admin-global-table-wrap"><table class="admin-global-table"><thead><tr><th>Data</th><th>Ação</th><th>Detalhes</th></tr></thead><tbody>${a.map(x=>`<tr><td>${new Date(x.at).toLocaleString("pt-AO")}</td><td><strong>${esc(x.action)}</strong></td><td>${esc(x.details)}</td></tr>`).join("")}</tbody></table></div>`:'<div class="admin-global-empty">Ainda não existem ações registadas.</div>'}</div>`;
}
function apsanAdminClearAudit(){if(!confirm("Limpar apenas o histórico de ações administrativas?"))return;os(APSAN_ADMIN_AUDIT_KEY,[]);apsanAdminRenderAudit()}
function apsanAdminRenderSettings(){
  const box=document.getElementById("adminSettingsTab");if(!box)return;const s=apsanAdminSettings();
  box.innerHTML=`<div class="admin-pro-section-title"><div><span>CONFIGURAÇÃO</span><h2>Definições globais</h2><p>Controlo administrativo da experiência da plataforma.</p></div></div>
  <div class="admin-global-section"><div class="admin-global-setting"><div><label>Permitir novos registos públicos</label><p>Controla a abertura de novas contas no ecossistema.</p></div><div class="admin-global-switch"><input id="apsSetPublic" type="checkbox" ${s.publicRegistrations?'checked':''}></div></div>
  <div class="admin-global-setting"><div><label>Aprovação de professores</label><p>Professores novos ficam sujeitos a análise antes de publicação.</p></div><div class="admin-global-switch"><input id="apsSetTeacher" type="checkbox" ${s.teacherApproval?'checked':''}></div></div>
  <div class="admin-global-setting"><div><label>Aprovação de instituições</label><p>Instituições devem passar pela avaliação documental da APSAN.</p></div><div class="admin-global-switch"><input id="apsSetInstitution" type="checkbox" ${s.institutionApproval?'checked':''}></div></div>
  <div class="admin-global-setting"><div><label>Aprovação de produtos</label><p>Produtos publicados por vendedores aguardam decisão administrativa.</p></div><div class="admin-global-switch"><input id="apsSetProduct" type="checkbox" ${s.productApproval?'checked':''}></div></div>
  <div class="admin-global-setting"><div><label>Pagamentos de Aulas Online</label><p>Permite o fluxo financeiro do módulo educacional.</p></div><div class="admin-global-switch"><input id="apsSetPayments" type="checkbox" ${s.onlinePayments?'checked':''}></div></div>
  <div class="admin-global-setting"><div><label>Modo de manutenção</label><p>Indicador de preparação para futura manutenção geral do site.</p></div><div class="admin-global-switch"><input id="apsSetMaintenance" type="checkbox" ${s.maintenanceMode?'checked':''}></div></div>
  </div>
  <div class="admin-global-section"><button class="admin-global-btn primary" onclick="apsanAdminSaveSettings()">Guardar definições</button></div>`;
}
function apsanAdminSaveSettings(){
  const s={publicRegistrations:!!document.getElementById("apsSetPublic")?.checked,teacherApproval:!!document.getElementById("apsSetTeacher")?.checked,institutionApproval:!!document.getElementById("apsSetInstitution")?.checked,productApproval:!!document.getElementById("apsSetProduct")?.checked,onlinePayments:!!document.getElementById("apsSetPayments")?.checked,maintenanceMode:!!document.getElementById("apsSetMaintenance")?.checked};
  os(APSAN_ADMIN_SETTINGS_KEY,[s]);apsanAdminAudit("Definições atualizadas","Configuração global da plataforma");alert("Definições guardadas.");apsanAdminRenderSettings();
}
function apsanAdminRenderTools(){
  const box=document.getElementById("adminToolsTab");if(!box)return;
  const keys=Object.keys(localStorage).filter(k=>k.toLowerCase().startsWith("apsan_"));
  let total=0;keys.forEach(k=>{try{total+=localStorage.getItem(k)?.length||0}catch(e){}});
  box.innerHTML=`<div class="admin-pro-section-title"><div><span>FERRAMENTAS</span><h2>Ferramentas administrativas</h2><p>Manutenção e segurança operacional do protótipo Local Storage.</p></div></div>
  <div class="admin-global-grid"><div class="admin-global-card"><span class="admin-global-pill info">Armazenamento</span><div class="admin-global-number">${keys.length}</div><p>Chaves APSAN no navegador.</p></div><div class="admin-global-card"><span class="admin-global-pill info">Dados</span><div class="admin-global-number">${Math.round(total/1024)} KB</div><p>Tamanho aproximado ocupado.</p></div><div class="admin-global-card"><span class="admin-global-pill ok">Backup</span><div class="admin-global-number">JSON</div><p>Exportação disponível.</p></div><div class="admin-global-card"><span class="admin-global-pill ok">Estado</span><div class="admin-global-number">Ativo</div><p>Ambiente de experimentação.</p></div></div>
  <div class="admin-global-section"><div class="admin-global-section-head"><div><h2>Backup e restauração</h2><p>Faça uma cópia de todos os dados APSAN antes de grandes testes.</p></div></div>
    <div class="admin-global-actions"><button class="admin-global-btn primary" onclick="apsanAdminExportBackup()">Exportar backup JSON</button><label class="admin-global-btn" style="cursor:pointer">Importar backup JSON<input id="apsanAdminImportFile" type="file" accept=".json,application/json" style="display:none" onchange="apsanAdminImportBackup(this.files[0])"></label></div>
  </div>
  <div class="admin-global-section"><div class="admin-global-section-head"><div><h2>Diagnóstico</h2><p>Lista das estruturas de dados atualmente existentes.</p></div></div>
    <div class="admin-global-table-wrap"><table class="admin-global-table"><thead><tr><th>Chave</th><th>Tamanho</th><th>Registos</th></tr></thead><tbody>${keys.sort().map(k=>{let raw=localStorage.getItem(k)||"",count="—";try{const v=JSON.parse(raw);if(Array.isArray(v))count=v.length;else if(v&&typeof v==="object")count=Object.keys(v).length}catch(e){}return `<tr><td>${esc(k)}</td><td>${Math.round(raw.length/1024*10)/10} KB</td><td>${count}</td></tr>`}).join("")}</tbody></table></div>
  </div>`;
}
function apsanAdminExportBackup(){
  const data={exportedAt:new Date().toISOString(),version:"APSAN-ADMIN-1",storage:{}};
  Object.keys(localStorage).filter(k=>k.toLowerCase().startsWith("apsan_")).forEach(k=>{data.storage[k]=localStorage.getItem(k)});
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="apsan-backup-"+new Date().toISOString().slice(0,10)+".json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  apsanAdminAudit("Backup exportado","Exportação local dos dados APSAN");
}
function apsanAdminImportBackup(file){
  if(!file)return;
  const r=new FileReader();
  r.onload=function(){
    try{
      const data=JSON.parse(r.result);
      if(!data.storage||typeof data.storage!=="object")throw new Error("Formato inválido");
      if(!confirm("Importar este backup irá substituir apenas as chaves APSAN presentes no ficheiro. Continuar?"))return;
      Object.keys(data.storage).filter(k=>k.toLowerCase().startsWith("apsan_")).forEach(k=>localStorage.setItem(k,String(data.storage[k])));
      apsanAdminAudit("Backup importado","Restauração local concluída");
      alert("Backup importado. O painel será atualizado.");
      renderAdmin();apsanAdminRenderTools();
    }catch(e){alert("Não foi possível importar o backup: "+e.message)}
  };
  r.readAsText(file);
}



/* ===== Código original: linhas 3769-3877 ===== */
(function(){
  function bind(){
    document.addEventListener("click",function(ev){
      const btn=ev.target.closest&&ev.target.closest(".admin-pro-nav-btn[data-admin-tab]");
      if(!btn)return;
      ev.preventDefault();ev.stopPropagation();
      const tab=btn.getAttribute("data-admin-tab");
      if(typeof window.showAdminTab==="function")window.showAdminTab(tab,btn);
    },true);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind);else bind();
})();

function apsanAdminDecisionModal(kind,id,decision){
  const labels={approve:"Aprovar",reject:"Rejeitar",delete:"Eliminar"};
  const label=labels[decision]||decision;
  apsanAdminModal(label+" · "+kind,"Decisão administrativa",`<p class="apsan-admin-confirm-text">Confirmar <strong>${label.toLowerCase()}</strong> para <b>${esc(id)}</b>?</p><label class="apsan-admin-field"><span>Motivo / observação</span><textarea id="apsDecisionReason" rows="4" placeholder="${decision==="reject"?"Indique o motivo da rejeição...":"Observação opcional..."}"></textarea></label>`,
    `<button class="admin-global-btn" onclick="apsanAdminCloseModal()">Cancelar</button><button class="admin-global-btn ${decision==="reject"||decision==="delete"?"danger":"success"}" onclick="apsanAdminApplyGenericDecision('${kind}','${id}','${decision}')">Confirmar</button>`);
}
function apsanAdminApplyGenericDecision(kind,id,decision){
  const maps={teacher:OK.T,institution:OK.IN,offer:OK.O,enrollment:OK.E,payment:OK.P};
  const key=maps[kind],a=key?og(key):null;
  if(!a)return;
  const u=a.find(x=>x.id===id);if(!u)return;
  if(decision==="delete"){os(key,a.filter(x=>x.id!==id))}
  else {u.status=decision==="approve"?"approved":"rejected";u.adminNote=document.getElementById("apsDecisionReason")?.value||"";u.adminUpdatedAt=new Date().toISOString();os(key,a)}
  apsanAdminAudit(labelDecision(decision)+" · "+kind,(u.name||u.id)+" "+(u.adminNote?"· "+u.adminNote:""));
  apsanAdminCloseModal();renderAdminOnline();apsanAdminRefreshCounts();
}
function labelDecision(d){return d==="approve"?"Aprovado":d==="reject"?"Rejeitado":"Eliminado"}


/* ============================================================
   MODAIS ADMINISTRATIVOS + AÇÕES CRUD
   ============================================================ */
function apsanAdminModal(title,subtitle,body,actions){
  let m=document.getElementById("apsanAdminActionModal");
  if(!m){
    m=document.createElement("div");m.id="apsanAdminActionModal";m.className="apsan-admin-modal";
    m.innerHTML='<div class="apsan-admin-modal-backdrop" onclick="apsanAdminCloseModal()"></div><div class="apsan-admin-modal-card"><button class="apsan-admin-modal-close" onclick="apsanAdminCloseModal()"><i class="fa-solid fa-xmark"></i></button><div class="apsan-admin-modal-head"><div class="apsan-admin-modal-icon"><i class="fa-solid fa-shield-halved"></i></div><div><span>ADMINISTRAÇÃO APSAN</span><h2 id="apsanAdminModalTitle"></h2><p id="apsanAdminModalSubtitle"></p></div></div><div id="apsanAdminModalBody" class="apsan-admin-modal-body"></div><div id="apsanAdminModalActions" class="apsan-admin-modal-actions"></div></div>';
    document.body.appendChild(m);
  }
  document.getElementById("apsanAdminModalTitle").textContent=title||"Ação administrativa";
  document.getElementById("apsanAdminModalSubtitle").textContent=subtitle||"";
  document.getElementById("apsanAdminModalBody").innerHTML=body||"";
  document.getElementById("apsanAdminModalActions").innerHTML=actions||'<button class="admin-global-btn" onclick="apsanAdminCloseModal()">Fechar</button>';
  m.classList.add("show");document.body.classList.add("apsan-modal-open");
}
function apsanAdminCloseModal(){
  const m=document.getElementById("apsanAdminActionModal");if(m)m.classList.remove("show");
  document.body.classList.remove("apsan-modal-open");
}
function apsanAdminOpenUserModal(key,id){
  const u=og(key).find(x=>x.id===id);if(!u)return;
  const entries=Object.entries(u).filter(([k])=>!["password","senha"].includes(k.toLowerCase()));
  const body='<div class="apsan-admin-detail-grid">'+entries.map(([k,v])=>`<div class="apsan-admin-detail"><small>${esc(k)}</small><strong>${esc(typeof v==="object"?JSON.stringify(v):String(v??"—"))}</strong></div>`).join("")+'</div>';
  apsanAdminModal(u.name||"Utilizador","Ficha administrativa · "+(u.email||u.id),body,`<button class="admin-global-btn" onclick="apsanAdminCloseModal()">Fechar</button><button class="admin-global-btn primary" onclick="apsanAdminCloseModal();apsanAdminEditUser('${key}','${id}')"><i class="fa-solid fa-pen"></i> Editar</button>`);
}
function apsanAdminEditUser(key,id){
  const a=og(key),u=a.find(x=>x.id===id);if(!u)return;
  const fields=["name","email","phone","bio","specialty","qualification"];
  const body=fields.map(k=>`<label class="apsan-admin-field"><span>${k}</span><input id="apsEdit_${k}" value="${esc(u[k]??"")}"></label>`).join("");
  apsanAdminModal("Editar utilizador","Altere os dados básicos da conta. Campos inexistentes serão criados quando usados.",body,`<button class="admin-global-btn" onclick="apsanAdminCloseModal()">Cancelar</button><button class="admin-global-btn primary" onclick="apsanAdminSaveUserEdit('${key}','${id}')"><i class="fa-solid fa-check"></i> Guardar alterações</button>`);
}
function apsanAdminSaveUserEdit(key,id){
  const a=og(key),u=a.find(x=>x.id===id);if(!u)return;
  ["name","email","phone","bio","specialty","qualification"].forEach(k=>{const e=document.getElementById("apsEdit_"+k);if(e)u[k]=e.value.trim()});
  u.adminUpdatedAt=new Date().toISOString();os(key,a);apsanAdminAudit("Utilizador editado",u.name||id);apsanAdminCloseModal();apsanAdminRenderUsers();renderAdminOnline();apsanAdminRefreshCounts();
}
function apsanAdminAdjustUser(key,id){
  const a=og(key),u=a.find(x=>x.id===id);if(!u)return;
  const body=`<div class="apsan-admin-adjust-grid">
    <label class="apsan-admin-field"><span>Estado</span><select id="apsAdjustStatus"><option value="active">Ativo</option><option value="approved">Aprovado</option><option value="pending">Pendente</option><option value="suspended">Suspenso</option><option value="rejected">Rejeitado</option></select></label>
    <label class="apsan-admin-field"><span>Observação administrativa</span><textarea id="apsAdjustNote" rows="4" placeholder="Motivo ou observação interna..."></textarea></label>
  </div>`;
  apsanAdminModal("Ajustar conta","Altere o estado administrativo e deixe uma observação.",body,`<button class="admin-global-btn" onclick="apsanAdminCloseModal()">Cancelar</button><button class="admin-global-btn primary" onclick="apsanAdminApplyAdjustment('${key}','${id}')">Aplicar ajuste</button>`);
  setTimeout(()=>{const s=document.getElementById("apsAdjustStatus");if(s)s.value=u.status||"pending"},0);
}
function apsanAdminApplyAdjustment(key,id){
  const a=og(key),u=a.find(x=>x.id===id);if(!u)return;
  u.status=document.getElementById("apsAdjustStatus")?.value||u.status;
  u.adminNote=document.getElementById("apsAdjustNote")?.value||u.adminNote||"";
  u.adminUpdatedAt=new Date().toISOString();os(key,a);
  apsanAdminAudit("Estado ajustado",(u.name||id)+" → "+u.status);apsanAdminCloseModal();apsanAdminRenderUsers();renderAdminOnline();apsanAdminRefreshCounts();
}
function apsanAdminSetUserStatus(key,id,status){
  const u=og(key).find(x=>x.id===id);if(!u)return;
  const action=status==="approved"?"reativar/aprovar":status==="rejected"?"rejeitar":"suspender";
  const body=`<p class="apsan-admin-confirm-text">Tem certeza que deseja <strong>${action}</strong> <b>${esc(u.name||id)}</b>?</p>
  <label class="apsan-admin-field"><span>Motivo / observação</span><textarea id="apsStatusReason" rows="4" placeholder="Escreva uma nota administrativa (opcional)"></textarea></label>`;
  apsanAdminModal("Confirmar alteração","Esta ação ficará registada no histórico administrativo.",body,`<button class="admin-global-btn" onclick="apsanAdminCloseModal()">Cancelar</button><button class="admin-global-btn ${status==="suspended"||status==="rejected"?"danger":"success"}" onclick="apsanAdminApplyStatus('${key}','${id}','${status}')">Confirmar</button>`);
}
function apsanAdminApplyStatus(key,id,status){
  const a=og(key),u=a.find(x=>x.id===id);if(!u)return;
  u.status=status;u.adminNote=document.getElementById("apsStatusReason")?.value||u.adminNote||"";u.adminUpdatedAt=new Date().toISOString();os(key,a);
  apsanAdminAudit(status==="approved"?"Utilizador aprovado":status==="rejected"?"Utilizador rejeitado":"Utilizador suspenso",(u.name||id)+(u.adminNote?" · "+u.adminNote:""));
  apsanAdminCloseModal();apsanAdminRenderUsers();renderAdminOnline();apsanAdminRefreshCounts();
}
function apsanAdminDeleteUser(key,id){
  const a=og(key),u=a.find(x=>x.id===id);if(!u)return;
  apsanAdminModal("Eliminar utilizador","Esta operação é destrutiva e não deve ser usada por engano.",`<div class="apsan-admin-danger-box"><i class="fa-solid fa-triangle-exclamation"></i><div><strong>Eliminar permanentemente?</strong><p>A conta <b>${esc(u.name||id)}</b> será removida dos dados locais desta área. Faça um backup antes, se necessário.</p></div></div>`, `<button class="admin-global-btn" onclick="apsanAdminCloseModal()">Cancelar</button><button class="admin-global-btn danger" onclick="apsanAdminConfirmDeleteUser('${key}','${id}')"><i class="fa-solid fa-trash"></i> Sim, eliminar</button>`);
}
function apsanAdminConfirmDeleteUser(key,id){
  const a=og(key),idx=a.findIndex(x=>x.id===id);if(idx<0)return;
  const name=a[idx].name||id;a.splice(idx,1);os(key,a);
  apsanAdminAudit("Utilizador eliminado",name+" · "+id);apsanAdminCloseModal();apsanAdminRenderUsers();renderAdminOnline();apsanAdminRefreshCounts();
}
