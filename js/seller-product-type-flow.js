/* APSAN — escolha inicial do tipo de produto no painel do vendedor.
   Mantém o formulário digital existente e acrescenta um fluxo físico separado,
   com o mesmo visual do painel atual.
*/
(function(){
  'use strict';

  const PRODUCTS_KEY='apsan_produtos';
  const STORAGE_KEY='apsan_vendedores';
  const esc=v=>typeof window.escapeHtml==='function'?window.escapeHtml(v):String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const money=v=>typeof window.formatKz==='function'?window.formatKz(v):new Intl.NumberFormat('pt-AO',{style:'currency',currency:'AOA',maximumFractionDigits:2}).format(Number(v)||0);
  const data=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const id=()=>`PROD-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

  function injectStyle(){
    if(document.getElementById('apsan-product-type-flow-style'))return;
    const s=document.createElement('style');s.id='apsan-product-type-flow-style';
    s.textContent=`
      .apsan-product-type-choice{margin:0 0 22px;padding:20px;border-radius:18px;background:linear-gradient(145deg,#f7fbff,#eef6ff);border:1px solid #dbeafe;box-shadow:0 8px 24px rgba(15,23,42,.06)}
      .apsan-product-type-choice .apsan-choice-head{display:flex;gap:13px;align-items:flex-start;margin-bottom:16px}
      .apsan-product-type-choice .apsan-choice-icon{width:44px;height:44px;border-radius:14px;background:#2563eb;color:#fff;display:flex;align-items:center;justify-content:center;font-size:19px;flex:none}
      .apsan-product-type-choice h3{margin:0;color:#0f172a;font-size:20px}.apsan-product-type-choice p{margin:5px 0 0;color:#64748b;font-size:13px;line-height:1.5}
      .apsan-type-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .apsan-type-card{appearance:none;border:1px solid #dbe3ef;background:#fff;border-radius:16px;padding:17px;text-align:left;cursor:pointer;transition:.18s;display:flex;gap:13px;align-items:center;color:#0f172a}
      .apsan-type-card:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(15,23,42,.08);border-color:#93c5fd}
      .apsan-type-card .type-icon{width:43px;height:43px;border-radius:13px;display:flex;align-items:center;justify-content:center;background:#eff6ff;color:#2563eb;font-size:19px;flex:none}
      .apsan-type-card.physical .type-icon{background:#ecfdf5;color:#059669}.apsan-type-card strong{display:block;font-size:15px}.apsan-type-card small{display:block;color:#64748b;margin-top:3px;line-height:1.35;font-size:12px}
      .apsan-type-card.active{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.10);background:#f8fbff}.apsan-type-card.physical.active{border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.10);background:#f7fffb}
      .apsan-selected-type{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;border-radius:14px;background:#f8fafc;border:1px solid #e2e8f0;margin-bottom:18px}
      .apsan-selected-type .selected-left{display:flex;align-items:center;gap:10px}.apsan-selected-type .selected-left i{color:#2563eb}.apsan-selected-type.physical .selected-left i{color:#059669}.apsan-change-type{border:0;background:transparent;color:#2563eb;font-weight:700;cursor:pointer;font-size:12px}
      .apsan-physical-form{display:none}.apsan-physical-form.show{display:block}.apsan-digital-form.hidden-by-type{display:none!important}
      .apsan-physical-form .physical-card{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:18px;box-shadow:0 7px 22px rgba(15,23,42,.05)}
      .apsan-physical-form .physical-title{display:flex;align-items:center;gap:10px;margin-bottom:15px}.apsan-physical-form .physical-title i{color:#059669}.apsan-physical-form h3{margin:0;color:#0f172a}.apsan-physical-form .physical-help{color:#64748b;font-size:12px;margin:4px 0 18px}
      .apsan-physical-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.apsan-physical-grid .full{grid-column:1/-1}.apsan-physical-form label{display:block;font-size:12px;font-weight:700;color:#334155;margin-bottom:6px}.apsan-physical-form input,.apsan-physical-form textarea,.apsan-physical-form select{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:11px;padding:11px 12px;background:#fff;color:#0f172a;outline:none}.apsan-physical-form textarea{min-height:95px;resize:vertical}.apsan-physical-form input:focus,.apsan-physical-form textarea:focus,.apsan-physical-form select:focus{border-color:#60a5fa;box-shadow:0 0 0 3px rgba(37,99,235,.08)}
      .apsan-physical-cover{border:2px dashed #cbd5e1;border-radius:14px;padding:20px;text-align:center;cursor:pointer;background:#fafcff}.apsan-physical-cover i{font-size:25px;color:#8b5cf6}.apsan-physical-cover strong{display:block;margin-top:7px;color:#334155}.apsan-physical-cover small{color:#64748b}.apsan-physical-cover.has-file{border-color:#10b981;background:#f0fdf4}.apsan-physical-cover img{max-width:100%;height:150px;object-fit:cover;border-radius:12px;margin-bottom:8px}
      .apsan-physical-submit{width:100%;border:0;border-radius:12px;padding:13px 16px;background:#16a34a;color:#fff;font-weight:800;font-size:15px;cursor:pointer;margin-top:4px}.apsan-physical-submit:disabled{opacity:.55;cursor:not-allowed}
      .apsan-physical-note{margin-top:13px;padding:11px 12px;border-radius:11px;background:#eff6ff;color:#475569;font-size:12px;line-height:1.45}.apsan-physical-note i{color:#2563eb;margin-right:5px}
      @media(max-width:620px){.apsan-type-grid,.apsan-physical-grid{grid-template-columns:1fr}.apsan-physical-grid .full{grid-column:auto}.apsan-product-type-choice{padding:15px}.apsan-type-card{padding:14px}.apsan-selected-type{align-items:flex-start}}
    `;
    document.head.appendChild(s);
  }

  function currentSeller(){
    try{
      if(window.currentSeller?.id)return window.currentSeller;
    }catch(e){}
    try{return JSON.parse(localStorage.getItem('apsan_current_seller')||'null')}catch(e){return null}
  }

  function makeChoice(){
    const form=document.getElementById('productForm');
    if(!form||document.getElementById('apsanProductTypeChoice'))return;
    const choice=document.createElement('div');choice.id='apsanProductTypeChoice';choice.className='apsan-product-type-choice';
    choice.innerHTML=`<div class="apsan-choice-head"><div class="apsan-choice-icon"><i class="fa-solid fa-store"></i></div><div><h3>O que deseja vender?</h3><p>Escolha primeiro o tipo de produto. O formulário será ajustado automaticamente.</p></div></div><div class="apsan-type-grid"><button type="button" class="apsan-type-card" data-type="digital"><span class="type-icon"><i class="fa-solid fa-display"></i></span><span><strong>Produto Digital / Infoproduto</strong><small>E-books, cursos, vídeos, áudios, documentos e outros conteúdos digitais.</small></span><i class="fa-solid fa-chevron-right" style="margin-left:auto;color:#94a3b8"></i></button><button type="button" class="apsan-type-card physical" data-type="physical"><span class="type-icon"><i class="fa-solid fa-box"></i></span><span><strong>Produto Físico</strong><small>Produtos com entrega física, como roupas, eletrónicos, livros e outros.</small></span><i class="fa-solid fa-chevron-right" style="margin-left:auto;color:#94a3b8"></i></button></div>`;
    form.parentNode.insertBefore(choice,form);
    choice.querySelectorAll('[data-type]').forEach(btn=>btn.addEventListener('click',()=>selectType(btn.dataset.type)));

    const digital=document.createElement('div');digital.id='apsanDigitalSelected';digital.className='apsan-selected-type';digital.style.display='none';
    digital.innerHTML='<div class="selected-left"><i class="fa-solid fa-display"></i><strong>Produto Digital / Infoproduto</strong></div><button type="button" class="apsan-change-type">Alterar tipo</button>';
    const physical=document.createElement('div');physical.id='apsanPhysicalSelected';physical.className='apsan-selected-type physical';physical.style.display='none';
    physical.innerHTML='<div class="selected-left"><i class="fa-solid fa-box"></i><strong>Produto Físico</strong></div><button type="button" class="apsan-change-type">Alterar tipo</button>';
    form.parentNode.insertBefore(digital,form);form.parentNode.insertBefore(physical,form);
    digital.querySelector('button').addEventListener('click',resetType);physical.querySelector('button').addEventListener('click',resetType);

    const physicalBox=document.createElement('div');physicalBox.id='apsanPhysicalForm';physicalBox.className='apsan-physical-form';physicalBox.innerHTML=`<div class="physical-card"><div class="physical-title"><i class="fa-solid fa-box-open"></i><div><h3>Dados do produto físico</h3><p class="physical-help">Preencha os dados para que o cliente saiba onde o produto se encontra e como será entregue.</p></div></div><form id="apsanPhysicalInnerForm"><div class="apsan-physical-grid"><div class="full"><label>Nome do produto *</label><input id="physicalName" required placeholder="Ex.: Telefone Samsung A55"></div><div><label>Categoria *</label><select id="physicalCategory" required><option value="">Selecione a categoria</option><option>Eletrónicos</option><option>Roupas e moda</option><option>Calçados</option><option>Livros</option><option>Casa e decoração</option><option>Material escolar</option><option>Alimentos</option><option>Outros</option></select></div><div><label>Preço (Kz) *</label><input id="physicalPrice" type="number" min="0" step="0.01" required placeholder="Ex.: 150.000"></div><div><label>Quantidade disponível *</label><input id="physicalQuantity" type="number" min="1" step="1" required placeholder="Ex.: 5"></div><div><label>Origem do produto *</label><input id="physicalOrigin" required placeholder="Ex.: Angola, Namíbia, China"></div><div><label>Província onde se encontra *</label><select id="physicalProvince" required><option value="">Selecione a província</option><option>Bengo</option><option>Benguela</option><option>Bié</option><option>Cabinda</option><option>Cuando</option><option>Cuanza Norte</option><option>Cuanza Sul</option><option>Cunene</option><option>Huambo</option><option>Huíla</option><option>Icolo e Bengo</option><option>Luanda</option><option>Lunda Norte</option><option>Lunda Sul</option><option>Malanje</option><option>Moxico</option><option>Moxico Leste</option><option>Namibe</option><option>Uíge</option><option>Zaire</option></select></div><div><label>Município / local onde se encontra *</label><input id="physicalLocation" required placeholder="Ex.: Lubango, Bairro da Mitcha"></div><div><label>Províncias de entrega *</label><input id="physicalDelivery" required placeholder="Ex.: Cunene, Huíla, Namibe"></div><div class="full"><label>Descrição do produto *</label><textarea id="physicalDescription" required placeholder="Descreva o estado, características, tamanho, cor, marca, etc."></textarea></div><div class="full"><label>Fotografia de capa *</label><label class="apsan-physical-cover" id="physicalCoverZone" for="physicalCover"><i class="fa-solid fa-image"></i><strong id="physicalCoverTitle">Carregar foto do produto</strong><small id="physicalCoverName">PNG, JPG ou WEBP</small></label><input id="physicalCover" type="file" accept="image/png,image/jpeg,image/webp" hidden required></div><div class="full"><button class="apsan-physical-submit" type="submit"><i class="fa-solid fa-store"></i> Vender produto físico</button></div></div></form><div class="apsan-physical-note"><i class="fa-solid fa-circle-info"></i> Depois da publicação, o produto seguirá para aprovação administrativa. O cliente verá a localização e as províncias de entrega informadas.</div></div>`;
    form.parentNode.insertBefore(physicalBox,form);
    physicalBox.querySelector('#apsanPhysicalInnerForm').addEventListener('submit',publishPhysical);
    physicalBox.querySelector('#physicalCover').addEventListener('change',previewPhysicalCover);

    form.classList.add('apsan-digital-form');
    resetType();
  }

  function selectType(type){
    const form=document.getElementById('productForm'),choice=document.getElementById('apsanProductTypeChoice'),physical=document.getElementById('apsanPhysicalForm'),digital=document.getElementById('apsanDigitalSelected'),physicalSelected=document.getElementById('apsanPhysicalSelected');
    if(!form||!choice)return;
    choice.style.display='none';
    if(type==='physical'){
      form.classList.add('hidden-by-type');physical.classList.add('show');digital.style.display='none';physicalSelected.style.display='flex';
    }else{
      form.classList.remove('hidden-by-type');physical.classList.remove('show');digital.style.display='flex';physicalSelected.style.display='none';
    }
  }
  function resetType(){
    const form=document.getElementById('productForm'),choice=document.getElementById('apsanProductTypeChoice'),physical=document.getElementById('apsanPhysicalForm'),digital=document.getElementById('apsanDigitalSelected'),physicalSelected=document.getElementById('apsanPhysicalSelected');
    if(form)form.classList.remove('hidden-by-type');if(physical)physical.classList.remove('show');if(digital)digital.style.display='none';if(physicalSelected)physicalSelected.style.display='none';if(choice)choice.style.display='block';
  }

  function previewPhysicalCover(e){
    const f=e.target.files?.[0],zone=document.getElementById('physicalCoverZone'),name=document.getElementById('physicalCoverName'),title=document.getElementById('physicalCoverTitle');
    if(!f){zone?.classList.remove('has-file');if(title)title.textContent='Carregar foto do produto';if(name)name.textContent='PNG, JPG ou WEBP';return}
    if(f.size>5*1024*1024){e.target.value='';return alert('A fotografia deve ter no máximo 5 MB.');}
    if(!['image/png','image/jpeg','image/webp'].includes(f.type)){e.target.value='';return alert('Escolha uma imagem PNG, JPG ou WEBP.');}
    const url=URL.createObjectURL(f);if(zone){zone.classList.add('has-file');zone.innerHTML=`<img src="${url}" alt="Capa do produto físico"><strong>${esc(f.name)}</strong><small>Fotografia selecionada</small>`;}
  }

  function fileData(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}

  async function publishPhysical(e){
    e.preventDefault();
    const seller=currentSeller();if(!seller)return alert('Inicie a sessão do vendedor primeiro.');
    const form=e.currentTarget;if(!form.checkValidity()){form.reportValidity();return}
    const cover=document.getElementById('physicalCover')?.files?.[0];if(!cover)return alert('A fotografia do produto é obrigatória.');
    const price=Number(document.getElementById('physicalPrice').value),quantity=Number(document.getElementById('physicalQuantity').value);
    if(!Number.isFinite(price)||price<0)return alert('Introduza um preço válido.');if(!Number.isInteger(quantity)||quantity<1)return alert('A quantidade deve ser pelo menos 1.');
    const btn=form.querySelector('button[type=submit');if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> A publicar...'}
    try{
      const coverData=await fileData(cover);
      const products=data(PRODUCTS_KEY);
      const product={id:id(),sellerId:seller.id,sellerName:seller.name,name:document.getElementById('physicalName').value.trim(),category:document.getElementById('physicalCategory').value,contentType:'physical',productType:'physical',contentTypeLabel:'Produto físico',realPrice:price,promoPrice:null,coverImage:coverData,productFileName:'',productFileType:'',productFileSize:0,productFileData:'',productFileStorageId:'localStorage',productFileUrl:'',publishedAt:new Date().toISOString(),status:'pending',uploadStatus:'ready',uploadProgress:100,rejectionReason:'',approvedAt:null,deleted:false,salesCount:0,totalSold:0,quantity,stock:quantity,origin:document.getElementById('physicalOrigin').value.trim(),province:document.getElementById('physicalProvince').value,location:document.getElementById('physicalLocation').value.trim(),deliveryProvinces:document.getElementById('physicalDelivery').value.trim(),description:document.getElementById('physicalDescription').value.trim(),deliveryType:'Entrega nacional'};
      const notices=data('apsan_notificacoes');notices.push({id:'ADMIN-PHYSICAL-'+Date.now(),audience:'admin',type:'product_approval',productId:product.id,sellerId:seller.id,sellerName:seller.name,productName:product.name,title:'Novo produto físico aguardando aprovação',message:`${seller.name} enviou o produto físico "${product.name}" para aprovação.`,createdAt:new Date().toISOString(),read:false});
      save(PRODUCTS_KEY,[...products,product]);save('apsan_notificacoes',notices);
      form.reset();resetType();
      if(typeof window.renderAdmin==='function')window.renderAdmin();if(typeof window.renderPublicProducts==='function')window.renderPublicProducts();
      alert('Produto físico enviado com sucesso. Aguarda aprovação do administrador.');
    }catch(err){console.error('APSAN physical product',err);alert('Não foi possível publicar o produto físico. Tente novamente.');}
    finally{if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-store"></i> Vender produto físico';}}
  }

  function init(){injectStyle();makeChoice();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',()=>setTimeout(init,250));
  const observer=new MutationObserver(()=>{if(document.getElementById('productForm')&&!document.getElementById('apsanProductTypeChoice'))makeChoice()});
  observer.observe(document.body,{childList:true,subtree:true});
})();
