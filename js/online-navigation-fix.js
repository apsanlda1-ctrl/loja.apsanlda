/* APSAN — correção dos botões Turmas e Aulas / Materiais */
(function(){
'use strict';
const role=()=>{try{return onRole||window.onRole||''}catch(e){return window.onRole||''}};
const dash=()=>document.getElementById('onDash');
function hidePanels(){const d=dash();if(!d)return;['onHomeBox','onStats','teacherProgramBox','teacherScheduleBox','teacherClassesBox','teacherStudentsBox','teacherMaterialsBox','teacherFinanceBox','studentFindBox','studentClassesBox','studentPaymentsBox','studentMaterialsBox','studentProgressBox','profileBox','apsanLivePageHost'].forEach(id=>{const x=document.getElementById(id);if(x)x.style.display='none'});}
function show(id){const x=document.getElementById(id);if(x)x.style.display='block'}
function materials(){
 const r=role();
 if(r==='teacher'){
  hidePanels();show('teacherMaterialsBox');
  if(typeof window.renderTeacherMaterials==='function')window.renderTeacherMaterials((()=>{try{return JSON.parse(localStorage.getItem('apsan_classes_v2')||'[]')}catch(e){return[]}})().filter(c=>String(c.teacher||'')===String((()=>{try{return onUser?.id||window.onUser?.id}catch(e){return window.onUser?.id}})())));
 }else if(r==='student'){
  hidePanels();show('studentMaterialsBox');
  if(typeof window.renderStudentMaterials==='function')window.renderStudentMaterials([]);
 }
}
function live(){
 hidePanels();
 const h=document.getElementById('apsanLivePageHost');
 if(h)h.style.display='block';
 if(typeof window.apsanRenderLiveClasses==='function')window.apsanRenderLiveClasses();
 else if(typeof window.renderClasses==='function')window.renderClasses();
}
function wire(){
 const nav=document.getElementById(role()==='teacher'?'onTeacherNav':'onStudentNav');if(!nav)return;
 [...nav.querySelectorAll('button,a')].forEach(b=>{
  const text=(b.textContent||'').trim().toLowerCase();
  if(text.includes('turmas')||text.includes('turma e aulas')||text.includes('aulas')){b.onclick=e=>{e.preventDefault();e.stopPropagation();live()};b.setAttribute('data-apsan-action','live');}
  if(text.includes('material')){b.onclick=e=>{e.preventDefault();e.stopPropagation();materials()};b.setAttribute('data-apsan-action','materials');}
 });
}
function boot(){wire();setInterval(wire,500);window.addEventListener('apsan:live',wire);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
