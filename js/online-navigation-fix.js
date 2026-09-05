/* APSAN — correção robusta dos botões Turmas e Aulas / Materiais */
(function(){
'use strict';
const R=()=>{try{return onRole||window.onRole||''}catch(e){return window.onRole||''}};
const U=()=>{try{return onUser||window.onUser||null}catch(e){return window.onUser||null}};
function openMaterials(){
 const r=R(),id=r==='teacher'?'teacherMaterialsBox':'studentMaterialsBox',box=document.getElementById(id);
 if(!box)return;
 try{
  if(typeof window.onTab==='function'){const nav=document.getElementById(r==='teacher'?'onTeacherNav':'onStudentNav');const btn=[...(nav?.querySelectorAll('button,a')||[])].find(x=>(x.textContent||'').toLowerCase().includes('material'));if(btn){window.onTab('materials',btn);return;}}
 }catch(e){}
 box.style.display='block';
 if(r==='teacher'&&typeof window.renderTeacherMaterials==='function')window.renderTeacherMaterials();
 if(r==='student'&&typeof window.renderStudentMaterials==='function')window.renderStudentMaterials();
}
function openLive(){
 const b=document.getElementById('apsanLiveNavBtn');
 if(b){b.removeAttribute('data-apsan-bound');b.click();return;}
 const host=document.getElementById('apsanLivePageHost');if(host)host.style.display='block';
}
function handle(e){
 const r=R();if(r!=='teacher'&&r!=='student')return;
 const b=e.target?.closest?.('#onTeacherNav button,#onTeacherNav a,#onStudentNav button,#onStudentNav a');if(!b)return;
 if(b.id==='apsanLiveNavBtn'||b.getAttribute('data-apsan-action')==='live'){
  if(b.id==='apsanLiveNavBtn')return;
  e.preventDefault();e.stopImmediatePropagation();openLive();return;
 }
 const t=(b.textContent||'').trim().toLowerCase();
 if(t.includes('material')){e.preventDefault();e.stopImmediatePropagation();openMaterials();}
}
function boot(){document.addEventListener('click',handle,true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
