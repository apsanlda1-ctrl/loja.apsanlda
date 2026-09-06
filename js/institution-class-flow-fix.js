/* APSAN — fluxo inteligente de turmas institucionais
   Liga automaticamente Curso -> Professor -> dados da turma.
   Não substitui o módulo principal: apenas melhora a experiência do formulário.
*/
(function(){
'use strict';
const K={O:'apsan_teacher_offers_v2',T:'apsan_teachers_v2',S:'apsan_students_v2'};
const read=k=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}};
const esc=v=>typeof window.esc==='function'?window.esc(v??''):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const uid=()=>{try{return String(window.onUser?.id||'')}catch(e){return ''}};
const norm=v=>String(v??'').trim().toLowerCase();
function institution(){return uid()}
function courses(){const id=institution();return read(K.O).filter(x=>x.ownerType==='institution'&&x.institution===id&&x.status==='approved')}
function teachers(){const id=institution();return read(K.T).filter(x=>x.institution===id&&x.status==='approved')}
function students(){const id=institution();return read(K.S).filter(x=>x.institution===id&&x.status==='approved')}
function setOptions(el,items,label){if(!el)return;const current=el.value;el.innerHTML='<option value="">Selecione '+label.toLowerCase()+'</option>'+items.map(x=>`<option value="${esc(x.id)}">${esc(x.name||x.legalName||'Sem nome')}</option>`).join('');if(items.some(x=>String(x.id)===String(current)))el.value=current}
function ensureHint(form){if(!form||form.querySelector('.apsan-class-flow-note'))return;const n=document.createElement('div');n.className='apsan-class-flow-note on-full';n.style.cssText='margin:0 0 10px;padding:10px 12px;border-radius:10px;background:#f5f3ff;color:#5b21b6;font-size:12px;display:flex;gap:8px;align-items:center';n.innerHTML='<i class="fa-solid fa-wand-magic-sparkles"></i><span>Os cursos e professores são carregados automaticamente dos registos da instituição. Ao escolher um curso, alguns dados da turma são preenchidos por si.</span>';form.insertBefore(n,form.firstChild)}
function update(){
 if(String(window.onRole||'')!=='institution')return;
 const course=document.getElementById('v3clCourse'),teacher=document.getElementById('v3clTeacher');
 if(!course||!teacher)return;
 const form=course.closest('form');ensureHint(form);
 const cs=courses(),ts=teachers();
 setOptions(course,cs,'um curso');
 setOptions(teacher,ts,'um professor');
 const emptyC=!cs.length,emptyT=!ts.length;
 course.disabled=emptyC;
 teacher.disabled=emptyT;
 course.title=emptyC?'Ainda não existem cursos aprovados nesta instituição.':'Cursos aprovados da instituição';
 teacher.title=emptyT?'Ainda não existem professores aprovados nesta instituição.':'Professores aprovados da instituição';
 let note=form?.querySelector('.apsan-class-flow-empty');
 if((emptyC||emptyT)&&form){
   if(!note){note=document.createElement('div');note.className='apsan-class-flow-empty on-full';note.style.cssText='margin:0 0 10px;padding:10px 12px;border-radius:10px;background:#fff7ed;color:#9a3412;font-size:12px';form.insertBefore(note,form.querySelector('button'))}
   note.innerHTML=(emptyC?'<div><i class="fa-solid fa-book"></i> Registe e aprove pelo menos um curso em <strong>Cursos</strong>.</div>':'')+(emptyT?'<div style="margin-top:4px"><i class="fa-solid fa-chalkboard-user"></i> Associe e aprove pelo menos um professor em <strong>Professores</strong>.</div>':'');
 }else if(note)note.remove();
 bind(course,teacher,cs,ts);
}
function bind(course,teacher,cs,ts){
 if(course.dataset.apsanFlowBound==='1')return;
 course.dataset.apsanFlowBound='1';
 course.addEventListener('change',()=>{
   const c=cs.find(x=>String(x.id)===String(course.value));
   if(!c)return;
   const dur=document.getElementById('v3clDur'),max=document.getElementById('v3clMax'),name=document.getElementById('v3clName');
   if(dur&&Number(c.duration)>0)dur.value=Number(c.duration);
   if(max&&Number(c.maxStudents)>0)max.value=Number(c.maxStudents);
   if(name&&!name.value.trim())name.value=(c.name||'')+' · Turma A';
   teacher.focus();
 });
 teacher.addEventListener('change',()=>{
   const t=ts.find(x=>String(x.id)===String(teacher.value));
   if(!t)return;
   const name=document.getElementById('v3clName');
   if(name&&!name.value.trim()&&t.sub)name.value=t.sub+' · Turma A';
 });
}
function boot(){
 if(window.__apsanInstitutionClassFlowFix)return;window.__apsanInstitutionClassFlowFix=true;
 const run=()=>setTimeout(update,80);
 window.addEventListener('hashchange',run);
 window.addEventListener('apsan-online-refresh',run);
 const mo=new MutationObserver(run);mo.observe(document.body,{childList:true,subtree:true});
 setInterval(update,1800);setTimeout(update,500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();