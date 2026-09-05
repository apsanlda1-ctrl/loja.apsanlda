/* APSAN — HOTFIX PUBLICAR MATERIAL */
(function(){
'use strict';
const KEY='apsan_materials_v2',NOTIFY='apsan_notifications_v1';
const read=k=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const user=()=>{try{return onUser||window.onUser||null}catch(e){return window.onUser||null}};
const uid=()=>`mat${Date.now()}${Math.random().toString(36).slice(2,8)}`;
function toast(msg){const d=document.createElement('div');d.textContent='✓ '+msg;d.style='position:fixed;right:22px;bottom:22px;z-index:99999;background:#111827;color:#fff;padding:14px 18px;border-radius:12px;font:700 13px Arial;box-shadow:0 15px 40px #0005';document.body.appendChild(d);setTimeout(()=>d.remove(),3000)}
function cleanButton(b){if(!b)return;const t=(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();if(t.includes('publicar material')||t.includes('publicar matéria')){b.querySelectorAll('i').forEach(i=>i.remove());b.textContent='Publicar material'}}
function val(id,names){const x=document.getElementById(id)||names.map(n=>document.querySelector(`[name="${n}"]`)).find(Boolean);return x?.value?.trim?.()||x?.value||''}
function source(){return document.querySelector('input[name="apsanMatSource"]:checked')?.value||''}
function typeOf(f){const n=String(f?.name||'').toLowerCase(),m=String(f?.type||'').toLowerCase();if(m==='application/pdf'||n.endsWith('.pdf'))return'PDF';if(m.startsWith('video/'))return'Vídeo';if(m.startsWith('audio/'))return'Áudio';if(m.startsWith('image/'))return'Imagem';return'Documento'}
function readFile(f){return new Promise((resolve,reject)=>{if(!f)return resolve(null);if(f.size>2.8*1024*1024)return reject(new Error('O ficheiro deve ter no máximo 2,8 MB.'));const r=new FileReader();r.onload=()=>resolve({data:r.result,name:f.name,mime:f.type,size:f.size,type:typeOf(f)});r.onerror=()=>reject(new Error('Não foi possível ler o ficheiro.'));r.readAsDataURL(f)})}
function notify(m){if(!m.classId)return;const c=read('apsan_classes_v2').find(x=>String(x.id)===String(m.classId));if(!c)return;let ids=[];if(Array.isArray(c.studentIds))ids.push(...c.studentIds);['student','studentId','aluno','alunoId'].forEach(k=>{if(c[k])ids.push(c[k])});if(Array.isArray(c.students))c.students.forEach(s=>ids.push(s?.id||s));const a=read(NOTIFY),t=new Date().toISOString();[...new Set(ids.map(String).filter(Boolean))].forEach(id=>a.unshift({id:'notif'+Date.now()+Math.random(),student:id,type:'material',materialId:m.id,title:'Novo material disponível',message:m.title,createdAt:t,read:false}));write(NOTIFY,a.slice(0,500))}
async function publish(btn){
 const u=user();if(!u?.id)throw new Error('Sessão do professor não encontrada.');
 const title=val('apsanMatTitle',['title','materialTitle']);
 const classId=String(val('apsanMatClass',['classId','aula','class'])||'');
 const description=val('apsanMatDescription',['description','descricao']);
 const url=val('apsanMatUrl',['url','link']);
 const file=document.getElementById('apsanMatFile')?.files?.[0]||null;
 const mode=source();
 if(!title)throw new Error('Digite o título do material.');
 if(mode==='file'){if(!file)throw new Error('Clique em Carregar ficheiro e escolha o ficheiro primeiro.');}
 else if(!url)throw new Error('Informe o link do material.');
 if(btn){btn.disabled=true;btn.textContent='A publicar...'}
 const m={id:uid(),teacher:String(u.id),teacherName:u.name||'',classId,title,description,type:mode==='file'?typeOf(file):(val('apsanMatType',['type','tipo'])||'Link'),url:'',fileData:'',fileName:'',fileMime:'',fileSize:0,views:0,downloads:0,status:'published',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
 if(mode==='file'){const f=await readFile(file);m.fileData=f.data;m.fileName=f.name;m.fileMime=f.mime;m.fileSize=f.size}else m.url=url;
 try{const a=read(KEY);a.unshift(m);write(KEY,a)}catch(e){throw new Error(e?.name==='QuotaExceededError'?'O armazenamento local está cheio. Apague materiais antigos ou use um link.':'Não foi possível guardar o material.')}
 notify(m);toast('Material publicado com sucesso.');
 try{window.dispatchEvent(new CustomEvent('apsan-materials-refresh'));window.renderOn?.()}catch(e){}
 if(btn){btn.disabled=false;btn.textContent='Publicar material'}
}
function isButton(b){if(!b)return false;const t=(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();return b.id==='apsanMatSubmit'||t.includes('publicar material')||t.includes('publicar matéria')}
function bind(){
 document.querySelectorAll('button').forEach(cleanButton);
 new MutationObserver(()=>document.querySelectorAll('button').forEach(cleanButton)).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('click',e=>{const b=e.target.closest?.('button');if(!isButton(b))return;const form=b.closest('form')||document.getElementById('apsanMaterialsForm');if(!form)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();publish(b).catch(err=>{alert(err.message||'Não foi possível publicar o material.');b.disabled=false;b.textContent='Publicar material'})},true);
 document.addEventListener('submit',e=>{const f=e.target,b=f?.querySelector?.('button');if(!isButton(b))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();publish(b).catch(err=>{alert(err.message||'Não foi possível publicar o material.');b.disabled=false;b.textContent='Publicar material'})},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
