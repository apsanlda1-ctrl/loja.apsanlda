/* APSAN — ligação FINAL professor -> material -> matrícula -> aluno
   Correção não destrutiva: mantém o módulo existente e torna a resolução
   da visibilidade tolerante às diferentes estruturas já usadas no LMS.
*/
(function(){
'use strict';
const MK='apsan_materials_v2', EK='apsan_enrollments_v2', CK='apsan_classes_v2', LK='apsan_live_classes_v1', OK='apsan_teacher_offers_v2';
const read=k=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}};
const uid=()=>{try{return String(window.onUser?.id||onUser?.id||'')}catch(e){return ''}};
const sid=uid;
const str=v=>String(v??'');
const ids=v=>Array.isArray(v)?v.map(x=>str(x?.id||x?.studentId||x?.enrollmentId||x)):[];
const vals=(o,keys)=>keys.flatMap(k=>{const v=o?.[k];return Array.isArray(v)?v.map(x=>str(x?.id||x)):v!=null&&v!==''?[str(v)]:[]});
function enrollments(){return read(EK).filter(e=>{
 const s=sid();return s&&[e.student,e.studentId,e.aluno,e.alunoId].some(v=>str(v)===s)&&['active','approved'].includes(str(e.status||'active').toLowerCase());
})}
function classes(){const a=[...read(CK),...read(LK)],seen=new Set();return a.filter(c=>c?.id&&!seen.has(str(c.id))&&(seen.add(str(c.id)),true))}
function classStudents(c){return vals(c,['student','studentId','aluno','alunoId','studentIds','students']);}
function related(){
 const ens=enrollments(), cls=classes(), s=sid();
 const enrollmentIds=new Set(ens.map(e=>str(e.id)));
 const offerIds=new Set(ens.flatMap(e=>vals(e,['offer','offerId','program','programId','course','courseId'])));
 const teacherIds=new Set(ens.flatMap(e=>vals(e,['teacher','teacherId','professor','professorId'])));
 const classIds=new Set();
 cls.forEach(c=>{
   const ce=vals(c,['enrollment','enrollmentId','matricula','matriculaId']);
   const co=vals(c,['offer','offerId','program','programId','course','courseId']);
   const ct=vals(c,['teacher','teacherId','professor','professorId']);
   if(ce.some(x=>enrollmentIds.has(x))||co.some(x=>offerIds.has(x))||ct.some(x=>teacherIds.has(x))&&classStudents(c).includes(s))classIds.add(str(c.id));
 });
 return {ens,cls,enrollmentIds,offerIds,teacherIds,classIds,s};
}
function materialMatches(m,r){
 if(!m||m.deleted||str(m.status).toLowerCase()==='draft')return false;
 if(m.publishAt&&new Date(m.publishAt).getTime()>Date.now())return false;
 const s=r.s;
 const explicitStudents=vals(m,['student','studentId','aluno','alunoId','studentIds','students']);
 if(explicitStudents.includes(s))return true;
 const me=vals(m,['enrollment','enrollmentId','matricula','matriculaId']);
 if(me.some(x=>r.enrollmentIds.has(x)))return true;
 const mc=vals(m,['classId','class','classroomId','classroom','turmaId','turma']);
 if(mc.some(x=>r.classIds.has(x)))return true;
 const mo=vals(m,['offer','offerId','program','programId','course','courseId','offerID']);
 if(mo.some(x=>r.offerIds.has(x)))return true;
 const mt=vals(m,['teacher','teacherId','professor','professorId']);
 if(mt.some(x=>r.teacherIds.has(x)))return true;
 return false;
}
function visible(){const r=related();return read(MK).filter(m=>materialMatches(m,r));}
function esc(v){return typeof window.esc==='function'?window.esc(v??''):str(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function card(m){
 const icon={PDF:'fa-file-pdf',Documento:'fa-file-lines',Vídeo:'fa-circle-play',Áudio:'fa-headphones',Imagem:'fa-image',Exercício:'fa-pen-to-square',Link:'fa-link',Outro:'fa-folder-open'}[m.type]||'fa-folder-open';
 const c=classes().find(x=>str(x.id)===str(m.classId)||str(x.id)===str(m.turmaId));
 return `<article class="apsan-mat-card"><div class="apsan-mat-card-head"><div class="apsan-mat-icon"><i class="fa-solid ${icon}"></i></div><div style="min-width:0;flex:1"><h4>${esc(m.title||'Material')}</h4><div class="apsan-mat-meta">${esc(m.type||'Material')}${c?' · '+esc(c.name||c.offerName||c.subject||'Aula'):''}</div></div></div><div class="apsan-mat-badges"><span class="apsan-mat-badge ok">Publicado</span><span class="apsan-mat-badge"><i class="fa-solid fa-eye"></i> ${Number(m.views||0)}</span></div>${m.description?`<p style="font-size:11px;color:#6f7d91;margin:0 0 10px">${esc(m.description)}</p>`:''}<div class="apsan-mat-actions">${(m.fileData||m.file||m.data||m.url)?`<button class="on-v2-btn" type="button" data-apsan-final-open="${esc(m.id)}"><i class="fa-solid fa-eye"></i> Visualizar</button>`:''}${(m.fileData||m.file||m.data)?`<button class="on-v2-btn alt" type="button" data-apsan-final-download="${esc(m.id)}"><i class="fa-solid fa-download"></i> Baixar</button>`:''}${m.url?`<a class="on-v2-btn alt" href="${esc(m.url)}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir link</a>`:''}</div></article>`;
}
function render(){
 if(str(window.onRole)!=='student')return;
 const box=document.getElementById('materialList');if(!box)return;
 const a=visible();
 const u=window.onUser||{};
 box.innerHTML=`<div class="apsan-mat-shell"><div class="apsan-mat-student-banner"><div class="apsan-mat-student-avatar">${u.photo?`<img src="${esc(u.photo)}" alt="Foto">`:'<i class="fa-solid fa-user-graduate"></i>'}</div><div><strong>Biblioteca de materiais</strong><span>${a.length} material(is) disponível(is) para as suas aulas.</span></div></div><div class="apsan-mat-list-card"><div class="apsan-mat-list-head"><div><h3>Materiais das minhas aulas</h3><small style="color:#8490a3">Conteúdos publicados pelos seus professores.</small></div></div><div class="apsan-mat-stats"><div class="apsan-mat-stat"><small>Disponíveis</small><strong>${a.length}</strong></div><div class="apsan-mat-stat"><small>PDF / Docs</small><strong>${a.filter(m=>['PDF','Documento'].includes(m.type)).length}</strong></div><div class="apsan-mat-stat"><small>Vídeo / Áudio</small><strong>${a.filter(m=>['Vídeo','Áudio'].includes(m.type)).length}</strong></div><div class="apsan-mat-stat"><small>Conteúdos</small><strong>${a.reduce((n,m)=>n+Number(m.views||0),0)}</strong></div></div><div id="apsanStudentMatGrid" class="apsan-mat-grid" style="margin-top:12px">${a.length?a.map(card).join(''):'<div class="apsan-mat-empty" style="grid-column:1/-1"><i class="fa-solid fa-book-open"></i>Nenhum material encontrado para as suas turmas.</div>'}</div></div></div>`;
 box.querySelectorAll('[data-apsan-final-open]').forEach(b=>b.onclick=()=>window.apsanMaterialOpen?.(b.dataset.apsanFinalOpen));
 box.querySelectorAll('[data-apsan-final-download]').forEach(b=>b.onclick=()=>window.apsanMaterialDownload?.(b.dataset.apsanFinalDownload));
}
function boot(){
 if(window.__apsanFinalMaterialsFix)return;window.__apsanFinalMaterialsFix=true;
 const rerender=()=>setTimeout(render,100);
 window.addEventListener('apsan-materials-refresh',rerender);
 window.addEventListener('hashchange',rerender);
 setInterval(()=>{if(str(window.onRole)==='student'&&document.getElementById('materialList'))render()},1800);
 setTimeout(render,250);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
