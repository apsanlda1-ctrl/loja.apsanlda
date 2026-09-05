/* APSAN — PUBLICAÇÃO DE MATERIAIS: FINAL
   O envio é tratado diretamente no clique do botão para não depender de handlers
   substituídos quando o painel SPA é reconstruído.
*/
(function(){
  'use strict';
  const KEY='apsan_materials_v2', NOTIFY='apsan_notifications_v1', CLASSKEY='apsan_classes_v2';
  const read=k=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const user=()=>{try{return onUser||window.onUser||null}catch(e){return window.onUser||null}};
  const esc=v=>typeof window.esc==='function'?window.esc(v??''):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const id=()=> 'mat'+Date.now()+Math.random().toString(36).slice(2,8);
  const toast=msg=>{const old=document.querySelector('.apsan-mat-final-toast');if(old)old.remove();const d=document.createElement('div');d.className='apsan-mat-final-toast';d.innerHTML='<i class="fa-solid fa-circle-check"></i> '+esc(msg);document.body.appendChild(d);setTimeout(()=>d.remove(),3000)};
  function typeOf(f){const n=String(f?.name||'').toLowerCase(),m=String(f?.type||'').toLowerCase();if(m==='application/pdf'||n.endsWith('.pdf'))return'PDF';if(m.startsWith('video/')||/\.(mp4|webm|mov|m4v)$/.test(n))return'Vídeo';if(m.startsWith('audio/')||/\.(mp3|wav|ogg|m4a)$/.test(n))return'Áudio';if(m.startsWith('image/')||/\.(jpg|jpeg|png|webp|gif)$/.test(n))return'Imagem';if(/\.(doc|docx|xls|xlsx|ppt|pptx|txt)$/.test(n))return'Documento';return'Outro'}
  function fileData(file){return new Promise((resolve,reject)=>{if(!file)return resolve(null);if(file.size>2.8*1024*1024)return reject(new Error('O ficheiro ultrapassa o limite de 2,8 MB. Para ficheiros maiores, use um link externo.'));const r=new FileReader();r.onload=()=>resolve({data:r.result,name:file.name,mime:file.type||'application/octet-stream',size:file.size,type:typeOf(file)});r.onerror=()=>reject(new Error('Não foi possível ler o ficheiro selecionado.'));r.readAsDataURL(file)})}
  function classes(){const uid=String(user()?.id||'');return read(CLASSKEY).filter(c=>String(c.teacher||'')===uid)}
  function notify(m,c){if(!c?.student)return;const a=read(NOTIFY);a.unshift({id:'notif'+Date.now()+Math.random().toString(36).slice(2,6),student:c.student,type:'material',materialId:m.id,title:'Novo material disponível',message:m.title,createdAt:new Date().toISOString(),read:false});write(NOTIFY,a.slice(0,300))}
  async function publish(form,btn){
    const title=document.getElementById('apsanMatTitle')?.value.trim()||'';
    const classId=document.getElementById('apsanMatClass')?.value||'';
    const type=document.getElementById('apsanMatType')?.value||'Outro';
    const description=document.getElementById('apsanMatDescription')?.value.trim()||'';
    const url=document.getElementById('apsanMatUrl')?.value.trim()||'';
    const publishAt=document.getElementById('apsanMatPublishAt')?.value||'';
    const visibility=document.getElementById('apsanMatVisibility')?.value||'published';
    const file=document.getElementById('apsanMatFile')?.files?.[0]||null;
    const mode=document.querySelector('input[name="apsanMatSource"]:checked')?.value||'link';
    if(!user()?.id)throw new Error('A sessão do professor não foi encontrada. Saia e entre novamente na conta.');
    if(!title)throw new Error('Digite o título do material.');
    if(!classId)throw new Error('Selecione a aula / aluno antes de publicar.');
    const c=classes().find(x=>String(x.id)===String(classId));
    if(!c)throw new Error('A aula selecionada não pertence ao professor desta conta. Atualize a página e selecione novamente a aula.');
    if(mode==='link'&&!url)throw new Error('Informe o link do material.');
    if(mode==='file'&&!file)throw new Error('Escolha um ficheiro antes de publicar.');
    if(btn){btn.disabled=true;btn.dataset.original=btn.innerHTML;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A publicar...'}
    const a=read(KEY),m={id:id(),teacher:String(user().id),teacherName:user().name||'',classId:String(classId),offer:c.offer||'',offerName:c.offerName||'',student:c.student||'',studentName:c.studentName||'',title,description,type:mode==='file'?typeOf(file):type,url:'',fileData:'',fileName:'',fileMime:'',fileSize:0,views:0,downloads:0,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),publishAt:publishAt?new Date(publishAt).toISOString():'',status:'published'};
    if(m.publishAt&&new Date(m.publishAt)>new Date())m.status='scheduled';
    if(visibility==='draft')m.status='draft';
    if(mode==='file'){const f=await fileData(file);m.fileData=f.data;m.fileName=f.name;m.fileMime=f.mime;m.fileSize=f.size}else m.url=url;
    try{a.unshift(m);write(KEY,a)}catch(e){throw new Error(e?.name==='QuotaExceededError'?'O armazenamento local está cheio. Apague materiais antigos ou use um link externo.':'Não foi possível guardar o material no navegador.')}
    if(m.status==='published')notify(m,c);
    toast(m.status==='scheduled'?'Material agendado com sucesso.':'Material publicado com sucesso. O aluno já poderá recebê-lo.');
    setTimeout(()=>{if(typeof window.renderTeacherMaterials==='function')window.renderTeacherMaterials();else if(typeof window.renderOn==='function')window.renderOn()},0);
  }
  function bind(){
    if(window.__apsanFinalMaterialPublishBound)return;
    window.__apsanFinalMaterialPublishBound=true;
    document.addEventListener('click',function(ev){
      const btn=ev.target.closest?.('#apsanMatSubmit, #apsanMaterialsForm button[type="submit"]');
      if(!btn)return;
      const form=btn.closest('#apsanMaterialsForm');if(!form)return;
      ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();
      publish(form,btn).catch(err=>{alert(err?.message||'Não foi possível publicar o material.');btn.disabled=false;btn.innerHTML=btn.dataset.original||'<i class="fa-solid fa-cloud-arrow-up"></i> Publicar material'});
    },true);
    document.addEventListener('submit',function(ev){
      const form=ev.target.closest?.('#apsanMaterialsForm');if(!form)return;
      ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();
      const btn=form.querySelector('button[type="submit"]');publish(form,btn).catch(err=>{alert(err?.message||'Não foi possível publicar o material.');if(btn){btn.disabled=false;btn.innerHTML=btn.dataset.original||'<i class="fa-solid fa-cloud-arrow-up"></i> Publicar material'}});
    },true);
  }
  const s=document.createElement('style');s.textContent='.apsan-mat-final-toast{position:fixed;right:22px;bottom:22px;z-index:99999;padding:13px 17px;border-radius:14px;background:#111827;color:#fff;box-shadow:0 15px 40px #0005;font:700 12px Arial}.apsan-mat-final-toast i{color:#a78bfa;margin-right:6px}';document.head.appendChild(s);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();