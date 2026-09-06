/* APSAN Orchestra — Canção nº 5: Saudai Jesus */
(()=>{
  const SONG={number:'5',title:'Saudai Jesus',url:'orchestra/cancoes/5-saudai-jesus.svg'};
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const matches=q=>{q=norm(q);return q==='5'||q==='05'||q.includes('saudai jesus')||q.includes('saudai')};
  const isSearchInput=el=>el&&el.tagName==='INPUT'&&(['search','text'].includes(el.type)||/pesquis|search|numero|can[cç][aã]o|hino/i.test((el.placeholder||'')+' '+(el.getAttribute('aria-label')||'')));
  function resultBox(input){
    let box=input.parentElement?.querySelector('.apsan-orchestra-search-result');
    if(!box){box=document.createElement('div');box.className='apsan-orchestra-search-result';input.parentElement?.appendChild(box);}
    return box;
  }
  function render(input){
    const q=input.value;
    const box=resultBox(input); if(!box)return;
    if(!matches(q)){box.innerHTML='';box.style.display='none';return;}
    box.style.display='block';
    box.innerHTML='<a href="'+SONG.url+'" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;padding:12px 14px;text-decoration:none;color:inherit;border:1px solid #e5e7eb;border-radius:12px;background:#fff;box-shadow:0 5px 18px rgba(15,23,42,.08)"><span style="font-weight:800;font-size:18px">5</span><span><strong style="display:block">Saudai Jesus</strong><small style="opacity:.7">Canção nº 5 · Partitura</small></span></a>';
  }
  function scan(root=document){root.querySelectorAll('input').forEach(input=>{if(!isSearchInput(input)||input.dataset.apsanOrchestraFix)return;input.dataset.apsanOrchestraFix='1';['input','change','keyup'].forEach(ev=>input.addEventListener(ev,()=>render(input)));});}
  const style=document.createElement('style');style.textContent='.apsan-orchestra-search-result{display:none;margin-top:8px;z-index:9999;position:relative}.apsan-orchestra-search-result a:hover{transform:translateY(-1px)}';document.head.appendChild(style);
  scan();
  new MutationObserver(()=>scan()).observe(document.body,{childList:true,subtree:true});
})();
