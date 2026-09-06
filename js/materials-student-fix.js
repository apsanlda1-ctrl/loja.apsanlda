/* APSAN — CORREÇÃO ISOLADA DA BIBLIOTECA DO ALUNO
   Mantém o módulo original e apenas amplia a ligação material -> turma -> aluno.
   Compatível com apsan_classes_v2 e apsan_live_classes_v1.
*/
(function(){
'use strict';
const MK='apsan_materials_v2', CK='apsan_classes_v2', LK='apsan_live_classes_v1';
const read=k=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}};
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const user=()=>{try{return onUser||window.onUser||null}catch(e){return window.onUser||null}};
const studentId=()=>String(user()?.id||'');
const allClasses=()=>[...read(CK),...read(LK)].filter((c,i,a)=>c?.id&&a.findIndex(x=>String(x.id)===String(c.id))===i);
function classStudentIds(c){
 const out=[];
 if(Array.isArray(c.studentIds))out.push(...c.studentIds);
 if(Array.isArray(c.students))c.students.forEach(s=>out.push(s?.id||s?.studentId||s));
 ['student','studentId','aluno','alunoId'].forEach(k=>{if(c[k])out.push(c[k])});
 return [...new Set(out.map(String).filter(Boolean))];
}
function studentClassIds(){
 const id=studentId(); if(!id)return new Set();
 const ids=new Set();
 allClasses().forEach(c=>{if(classStudentIds(c).includes(id))ids.add(String(c.id));});
 const en=read('apsan_enrollments_v2').filter(x=>String(x.student||x.studentId||x.aluno||'')===id&&['active','approved'].includes(String(x.status||'active')));
 en.forEach(e=>{[e.id,e.classId,e.enrollment,e.turmaId].filter(Boolean).forEach(x=>ids.add(String(x)))});
 return ids;
}
function visibleMaterials(){
 const ids=studentClassIds(),now=Date.now();
 return read(MK).filter(m=>{
   if(m?.deleted||m?.status==='draft')return false;
   if(m?.publishAt&&new Date(m.publishAt).getTime()>now)return false;
   if(ids.has(String(m.classId)))return true;
   const explicit=Array.isArray(m.studentIds)?m.studentIds.map(String):[];
   return studentId()&&explicit.includes(studentId());
 });
}
function card(m){
 const icon={PDF:'fa-file-pdf',Documento:'fa-file-lines',Vídeo:'fa-circle-play',Áudio:'fa-headphones',Imagem:'fa-image',Exercício:'fa-pen-to-square',Link:'fa-link',Outro:'fa-folder-open'}[m.type]||'fa-folder-open';
 const size=Number(m.fileSize||0);const human=size?(size<1048576?(size/1024).toFixed(0)+' KB':(size/1048576).toFixed(1)+' MB'):'';
 const c=allClasses().find(x=>String(x.id)===String(m.classId));
 return `<article class="apsan-mat-card"><div class="apsan-mat-card-head"><div class="apsan-mat-icon"><i class="fa-solid ${icon}"></i></div><div style="min-width:0;flex:1"><h4>${esc(m.title||'Material')}</h4><div class="apsan-mat-meta">${esc(m.type||'Material')}${human?' · '+human:''}${c?' · '+esc(c.name||c.offerName||c.subject||'Aula'):''}</div></div></div><div class="apsan-mat-badges"><span class="apsan-mat-badge ok">Publicado</span><span class="apsan-mat-badge"><i class="fa-solid fa-eye"></i> ${Number(m.views||0)}</span></div>${m.description?`<p style="font-size:11px;color:#6f7d91;margin:0 0 10px">${esc(m.description)}</p>`:''}<div class="apsan-mat-actions">${(m.fileData||m.url)?`<button class="on-v2-btn" type="button" data-apsan-student-open="${esc(m.id)}"><i class="fa-solid fa-eye"></i> Visualizar</button>`:''}${m.fileData?`<button class="on-v2-btn alt" type="button" data-apsan-student-download="${esc(m.id)}"><i class="fa-solid fa-download"></i> Baixar</button>`:''}${m.url?`<a class="on-v2-btn alt" href="${esc(m.url)}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir link</a>`:''}</div></article>`;
}
function render(){
 if(String(window.onRole||'')!=='student')return;
 const box=document.getElementById('materialList');if(!box)return;
 const a=visibleMaterials(),u=user();
 box.innerHTML=`<div class="apsan-mat-shell"><div class="apsan-mat-student-banner"><div class="apsan-mat-student-avatar">${u?.photo?`<img src="${esc(u.photo)}" alt="Foto">`:'<i class="fa-solid fa-user-graduate"></i>'}</div><div><strong>Biblioteca de materiais</strong><span>${a.length} material(is) disponível(is) para as suas aulas.</span></div></div><div class="apsan-mat-list-card"><div class="apsan-mat-list-head"><div><h3>Materiais das minhas aulas</h3><small style="color:#8490a3">Conteúdos publicados pelos seus professores.</small></div></div><div class="apsan-mat-stats"><div class="apsan-mat-stat"><small>Disponíveis</small><strong>${a.length}</strong></div><div class="apsan-mat-stat"><small>PDF / Docs</small><strong>${a.filter(m=>['PDF','Documento'].includes(m.type)).length}</strong></div><div class="apsan-mat-stat"><small>Vídeo / Áudio</small><strong>${a.filter(m=>['Vídeo','Áudio'].includes(m.type)).length}</strong></div><div class="apsan-mat-stat"><small>Conteúdos</small><strong>${a.reduce((n,m)=>n+Number(m.views||0),0)}</strong></div></div><div id="apsanStudentMatGrid" class="apsan-mat-grid" style="margin-top:12px">${a.length?a.map(card).join(''):'<div class="apsan-mat-empty" style="grid-column:1/-1"><i class="fa-solid fa-book-open"></i>Nenhum material encontrado para as suas turmas.</div>'}</div></div></div>`;
 box.querySelectorAll('[data-apsan-student-open]').forEach(b=>b.onclick=()=>window.apsanMaterialOpen?.(b.dataset.apsanStudentOpen));
 box.querySelectorAll('[data-apsan-student-download]').forEach(b=>b.onclick=()=>window.apsanMaterialDownload?.(b.dataset.apsanStudentDownload));
}
function start(){
 if(!window.__apsanStudentMaterialsFix){
   window.__apsanStudentMaterialsFix=true;
   window.addEventListener('apsan-materials-refresh',()=>setTimeout(render,80));
   setInterval(()=>{if(document.getElementById('materialList')&&String(window.onRole||'')==='student'){
     const box=document.getElementById('materialList');if(box&&!box.querySelector('#apsanStudentMatGrid'))render();
   }},1200);
 }
 setTimeout(render,120);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
/* Carrega a camada final de ligação material -> matrícula -> aluno. */
(function(){
 function load(){if(document.getElementById('apsanMaterialsStudentFinalFix'))return;const s=document.createElement('script');s.id='apsanMaterialsStudentFinalFix';s.src='js/materials-student-final-fix.js?v=20260906a';s.async=false;document.head.appendChild(s)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else setTimeout(load,80);
})();
