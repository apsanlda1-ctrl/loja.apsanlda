/* APSAN — PUBLICAÇÃO DE MATERIAIS: CORREÇÃO DEFINITIVA
   Não depende de um ID específico do botão nem de uma única estrutura de turma.
   Compatível com as turmas antigas e com as novas Turmas e Aulas Online.
*/
(function(){
'use strict';
const KEY='apsan_materials_v2', NOTIFY='apsan_notifications_v1';
const read=k=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const U=()=>{try{return onUser||window.onUser||null}catch(e){return window.onUser||null}};
const uid=()=>`mat${Date.now()}${Math.random().toString(36).slice(2,9)}`;
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const toast=m=>{const d=document.createElement('div');d.style='position:fixed;right:22px;bottom:22px;z-index:99999;background:#111827;color:#fff;padding:14px 18px;border-radius:14px;box-shadow:0 18px 50px #0005;font:700 13px Arial';d.innerHTML='✓ '+esc(m);document.body.appendChild(d);setTimeout(()=>d.remove(),3500)};
function allClasses(){
 const a=[...read('apsan_classes_v2'),...read('apsan_live_classes_v1')], seen=new Set(),u=U(),uidu=String(u?.id||'');
 return a.filter(c=>{const id=String(c.id||'');if(!id||seen.has(id))return false;const owner=[c.teacher,c.teacherId,c.teacherID,c.instructorId,c.professorId,c.ownerId].map(String);const own=!uidu||owner.includes(uidu)||String(c.teacherName||'').trim().toLowerCase()===String(u?.name||'').trim().toLowerCase();if(!own)return false;seen.add(id);return true});
}
function studentsOf(c){
 const ids=[];if(Array.isArray(c.studentIds))ids.push(...c.studentIds);['student','studentId','aluno','alunoId'].forEach(k=>{if(c[k])ids.push(c[k])});if(Array.isArray(c.students))c.students.forEach(s=>ids.push(s?.id||s));return [...new Set(ids.map(String).filter(Boolean))];
}
function populateClassSelect(){
 const sel=document.getElementById('apsanMatClass')||document.querySelector('select[name*="class" i],select[name*="aula" i]');if(!sel)return;
 const cs=allClasses(),current=sel.value;const first=sel.querySelector('option[value=""]');sel.innerHTML='';if(first)sel.appendChild(first);else{const o=document.createElement('option');o.value='';o.textContent='Selecione uma aula (opcional)';sel.appendChild(o)}
 cs.forEach(c=>{const o=document.createElement('option');o.value=String(c.id);o.textContent=(c.name||c.offerName||'Turma')+' · '+(c.subject||c.studentName||'Aula');sel.appendChild(o)});if(current)sel.value=current;
}
function getVal(id,names=[]){const x=document.getElementById(id)||names.map(n=>document.querySelector(`[name="${n}"]`)).find(Boolean);return x?.value?.trim?.()||x?.value||''}
function typeOf(f){const n=String(f?.name||'').toLowerCase(),m=String(f?.type||'').toLowerCase();if(m==='application/pdf'||n.endsWith('.pdf'))return'PDF';if(m.startsWith('video/')||/\.(mp4|webm|mov|m4v)$/.test(n))return'Vídeo';if(m.startsWith('audio/')||/\.(mp3|wav|ogg|m4a)$/.test(n))return'Áudio';if(m.startsWith('image/')||/\.(jpg|jpeg|png|webp|gif)$/.test(n))return'Imagem';if(/\.(doc|docx|xls|xlsx|ppt|pptx|txt)$/.test(n))return'Documento';return'Outro'}
function readFile(file){return new Promise((resolve,reject)=>{if(!file)return resolve(null);if(file.size>2.8*1024*1024)return reject(new Error('O ficheiro deve ter no máximo 2,8 MB. Para ficheiros maiores, use um link externo.'));const r=new FileReader();r.onload=()=>resolve({data:r.result,name:file.name,mime:file.type||'application/octet-stream',size:file.size,type:typeOf(file)});r.onerror=()=>reject(new Error('Não foi possível ler o ficheiro.'));r.readAsDataURL(file)})}
function notify(m,c){const ids=studentsOf(c);if(!ids.length)return;const a=read(NOTIFY),t=new Date().toISOString();ids.forEach(student=>a.unshift({id:`notif${Date.now()}${Math.random()}`,student,type:'material',materialId:m.id,title:'Novo material disponível',message:m.title,createdAt:t,read:false}));write(NOTIFY,a.slice(0,500))}
function sourceMode(){return document.querySelector('input[name="apsanMatSource"]:checked')?.value|| (document.getElementById('apsanMatFile')?'file':'link')}
async function publish(btn){
 const u=U();if(!u?.id)throw new Error('Sessão do professor não encontrada. Saia e entre novamente na conta.');
 const title=getVal('apsanMatTitle',['title','materialTitle']);
 const classId=String(getVal('apsanMatClass',['classId','aula','class'])||'');
 const description=getVal('apsanMatDescription',['description','descricao']);
 const url=getVal('apsanMatUrl',['url','link']);
 const file=(document.getElementById('apsanMatFile')||document.querySelector('input[type="file"]'))?.files?.[0]||null;
 const type=getVal('apsanMatType',['type','tipo'])||typeOf(file);
 const mode=sourceMode();
 if(!title)throw new Error('Digite o título do material.');
 if(mode==='file'&&!file)throw new Error('Escolha o ficheiro antes de publicar.');
 if(mode!=='file'&&!url)throw new Error('Informe o link do material.');
 const c=allClasses().find(x=>String(x.id)===classId)||null;
 if(classId&&!c)throw new Error('A turma selecionada já não está disponível. Atualize a página e selecione novamente.');
 if(btn){btn.disabled=true;btn.dataset.old=btn.innerHTML;btn.innerHTML='⏳ A publicar...'}
 const m={id:uid(),teacher:String(u.id),teacherName:u.name||'',classId:classId||'',className:c?.name||c?.offerName||'',offer:c?.offer||'',offerName:c?.offerName||'',student:c?.student||'',studentName:c?.studentName||'',title,description,type:mode==='file'?typeOf(file):type,url:'',fileData:'',fileName:'',fileMime:'',fileSize:0,views:0,downloads:0,status:'published',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
 if(mode==='file'){const f=await readFile(file);m.fileData=f.data;m.fileName=f.name;m.fileMime=f.mime;m.fileSize=f.size}else m.url=url;
 try{const a=read(KEY);a.unshift(m);write(KEY,a)}catch(e){throw new Error(e?.name==='QuotaExceededError'?'O armazenamento local está cheio. Elimine materiais antigos ou publique por link.':'Não foi possível guardar o material.')}
 notify(m,c||{});
 toast(c?'Material publicado e associado à turma.':'Material publicado na biblioteca do professor.');
 try{window.dispatchEvent(new CustomEvent('apsan-materials-refresh'));window.renderOn?.()}catch(e){}
 if(btn){btn.disabled=false;btn.innerHTML=btn.dataset.old||'Publicar material'}
}
function isPublishButton(el){if(!el)return false;const t=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();return el.id==='apsanMatSubmit'||el.matches?.('#apsanMaterialsForm button[type="submit"]')||/publicar material|publicar matéria|publicar matéria/.test(t)}
function bind(){
 populateClassSelect();
 document.addEventListener('click',e=>{const b=e.target.closest?.('button,input[type="submit"]');if(!isPublishButton(b))return;const form=b.closest('form')||document.getElementById('apsanMaterialsForm');if(!form)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();publish(b).catch(err=>{alert(err?.message||'Não foi possível publicar o material.');b.disabled=false;b.innerHTML=b.dataset.old||'Publicar material'})},true);
 document.addEventListener('submit',e=>{const form=e.target.closest?.('form');if(!form)return;const b=form.querySelector('button[type="submit"]');if(!isPublishButton(b))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();publish(b).catch(err=>{alert(err?.message||'Não foi possível publicar o material.');b.disabled=false;b.innerHTML=b.dataset.old||'Publicar material'})},true);
 setInterval(populateClassSelect,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
