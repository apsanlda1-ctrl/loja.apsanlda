/* APSAN — correção robusta do botão Publicar material */
(function(){
  'use strict';
  const KEY='apsan_materials_v2', NOTIFY='apsan_notifications_v1';
  const read=k=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const user=()=>{try{return onUser||window.onUser||null}catch(e){return window.onUser||null}};
  const oid=p=>(typeof window.oid==='function'?window.oid(p):p+Date.now()+Math.random().toString(36).slice(2,8));
  const toast=msg=>{const old=document.querySelector('.apsan-mat-toast');if(old)old.remove();const d=document.createElement('div');d.className='apsan-mat-toast';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2800)};
  const detect=f=>{const n=String(f?.name||'').toLowerCase(),m=String(f?.type||'').toLowerCase();if(m==='application/pdf'||n.endsWith('.pdf'))return'PDF';if(m.startsWith('video/')||/\.(mp4|webm|mov|m4v)$/.test(n))return'Vídeo';if(m.startsWith('audio/')||/\.(mp3|wav|ogg|m4a)$/.test(n))return'Áudio';if(m.startsWith('image/')||/\.(jpg|jpeg|png|webp|gif)$/.test(n))return'Imagem';if(/\.(doc|docx|xls|xlsx|ppt|pptx|txt)$/.test(n))return'Documento';return'Outro'};
  const fileRead=f=>new Promise((resolve,reject)=>{if(!f)return resolve(null);if(f.size>2.8*1024*1024)return reject(new Error('O ficheiro é maior que 2,8 MB. Para ficheiros maiores, use um link externo.'));const r=new FileReader();r.onload=()=>resolve({data:r.result,name:f.name,mime:f.type||'application/octet-stream',size:f.size,type:detect(f)});r.onerror=()=>reject(new Error('Não foi possível ler o ficheiro.'));r.readAsDataURL(f)});
  function classes(){const k=window.OK||{C:'apsan_classes_v2'};const id=String(user()?.id||'');return read(k.C||'apsan_classes_v2').filter(c=>String(c.teacher||'')===id)}
  function notify(m,c){const n=read(NOTIFY);if(c?.student)n.unshift({id:oid('notif'),student:c.student,type:'material',materialId:m.id,title:'Novo material disponível',message:m.title,createdAt:new Date().toISOString(),read:false});write(NOTIFY,n.slice(0,300))}
  async function save(form){
    const a=read(KEY), id=form.dataset.materialId||'';
    const title=document.getElementById('apsanMatTitle')?.value.trim(), classId=document.getElementById('apsanMatClass')?.value, type=document.getElementById('apsanMatType')?.value||'Outro', description=document.getElementById('apsanMatDescription')?.value.trim()||'', url=document.getElementById('apsanMatUrl')?.value.trim()||'', publishRaw=document.getElementById('apsanMatPublishAt')?.value||'', visibility=document.getElementById('apsanMatVisibility')?.value||'published', file=document.getElementById('apsanMatFile')?.files?.[0], mode=document.querySelector('input[name="apsanMatSource"]:checked')?.value||'link';
    if(!title||!classId)throw new Error('Preencha o título e selecione a aula/aluno.');
    const c=classes().find(x=>String(x.id)===String(classId));
    if(!c)throw new Error('A aula selecionada não pertence ao professor desta sessão.');
    if(mode==='link'&&!url&&!id)throw new Error('Informe o link do material.');
    if(mode==='file'&&!file&&!id)throw new Error('Escolha um ficheiro para publicar.');
    let m=id?a.find(x=>String(x.id)===String(id)):null;
    if(!m)m={id:oid('mat'),teacher:String(user()?.id||''),createdAt:new Date().toISOString(),views:0,downloads:0};
    m.title=title;m.classId=classId;m.offer=c.offer||m.offer||'';m.student=c.student||m.student||'';m.description=description;
    if(mode==='file'){if(file){const f=await fileRead(file);m.type=f.type;m.fileData=f.data;m.fileName=f.name;m.fileMime=f.mime;m.fileSize=f.size;m.url='';}}
    else{m.type=type;m.url=url;m.fileData='';m.fileName='';m.fileMime='';m.fileSize=0;}
    m.publishAt=publishRaw?new Date(publishRaw).toISOString():'';
    m.status=visibility==='draft'?'draft':m.publishAt&&new Date(m.publishAt)>new Date()?'scheduled':'published';m.updatedAt=new Date().toISOString();
    const idx=a.findIndex(x=>String(x.id)===String(m.id));if(idx<0)a.unshift(m);else a[idx]=m;
    try{write(KEY,a)}catch(e){if(e?.name==='QuotaExceededError')throw new Error('O armazenamento local do navegador está cheio. Remova materiais antigos ou publique este conteúdo através de um link externo.');throw e}
    if(!id&&m.status==='published')notify(m,c);return m;
  }
  function bind(){
    const form=document.getElementById('apsanMaterialsForm');if(!form||form.__apsanPublishFix)return;form.__apsanPublishFix=true;
    form.addEventListener('submit',async e=>{
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      const btn=document.getElementById('apsanMatSubmit');if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A publicar...'}
      try{const m=await save(form);toast(m.status==='scheduled'?'Material agendado com sucesso.':'Material publicado com sucesso e enviado ao aluno.');if(typeof window.renderTeacherMaterials==='function')window.renderTeacherMaterials();else if(typeof window.renderOn==='function')window.renderOn()}catch(err){alert(err.message||'Não foi possível publicar o material.');if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-cloud-arrow-up"></i> Publicar material'}}
    },true);
  }
  function boot(){bind();new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();