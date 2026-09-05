/* APSAN — Visual Premium da Biblioteca de Materiais
   Apenas camada visual: não substitui nem altera a lógica de materiais.
*/
(function(){
  'use strict';
  if(typeof window==='undefined')return;
  function css(){
    if(document.getElementById('apsanMaterialsVisualV4'))return;
    const s=document.createElement('style');s.id='apsanMaterialsVisualV4';s.textContent=`
      .apsan-mat-hero{min-height:214px!important;padding:0!important;border-radius:24px!important;background:linear-gradient(115deg,#17163d 0%,#30206c 48%,#6b28b8 100%)!important;box-shadow:0 20px 50px rgba(55,30,115,.24)!important}
      .apsan-mat-hero:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 78% 30%,rgba(255,255,255,.16),transparent 25%),radial-gradient(circle at 95% 110%,rgba(190,130,255,.28),transparent 36%);pointer-events:none}
      .apsan-mat-hero:after{width:300px!important;height:300px!important;right:-115px!important;top:-160px!important;background:rgba(255,255,255,.07)!important;border:1px solid rgba(255,255,255,.08)}
      .apsan-mat-hero-inner{min-height:214px!important;padding:25px 27px!important;align-items:center!important;gap:25px!important}
      .apsan-mat-hero-copy{position:relative;z-index:3;max-width:650px}
      .apsan-mat-hero h3{font-size:29px!important;line-height:1.08!important;letter-spacing:-.02em!important;margin:7px 0 9px!important}
      .apsan-mat-hero p{font-size:13px!important;line-height:1.55!important;color:#ece8ff!important;max-width:610px!important}
      .apsan-mat-kicker{letter-spacing:.16em!important;font-size:10px!important;color:#cfc6ff!important}
      .apsan-mat-hero-visual{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;min-width:285px;min-height:170px;margin-left:auto}
      .apsan-mat-orb{position:absolute;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);box-shadow:inset 0 0 35px rgba(255,255,255,.06)}
      .apsan-mat-book{position:relative;width:138px;height:105px;transform:rotate(-7deg);filter:drop-shadow(0 18px 18px rgba(0,0,0,.24))}
      .apsan-mat-book .cover{position:absolute;inset:10px 4px 7px;border-radius:12px 15px 15px 12px;background:linear-gradient(145deg,#fff,#e8e1ff);box-shadow:inset -7px 0 rgba(104,70,190,.12),0 0 0 1px rgba(255,255,255,.35)}
      .apsan-mat-book .page{position:absolute;left:19px;right:16px;top:27px;height:4px;border-radius:5px;background:#9b7be8;box-shadow:0 12px #c2b3f5,0 24px #d7cff9}
      .apsan-mat-book .mark{position:absolute;left:19px;bottom:13px;width:35px;height:5px;border-radius:5px;background:#6d28d9}
      .apsan-mat-file-float{position:absolute;width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.95);color:#673ab7;box-shadow:0 12px 24px rgba(0,0,0,.18);font-size:19px}
      .apsan-mat-file-float.pdf{top:9px;right:20px;transform:rotate(9deg)}
      .apsan-mat-file-float.video{bottom:10px;left:18px;transform:rotate(-9deg)}
      .apsan-mat-file-float.exercise{bottom:2px;right:39px;transform:rotate(7deg);font-size:16px}
      .apsan-mat-hero-stat{position:relative!important;z-index:4!important;min-width:154px!important;padding:15px 16px!important;border-radius:18px!important;background:rgba(255,255,255,.10)!important;border:1px solid rgba(255,255,255,.2)!important;box-shadow:inset 0 1px rgba(255,255,255,.12),0 12px 28px rgba(19,8,55,.13)!important}
      .apsan-mat-hero-stat strong{font-size:30px!important;line-height:1!important}
      .apsan-mat-hero-stat span{font-size:10px!important;color:#eeeaff!important}
      .apsan-mat-hero-stat small{display:block;margin-top:8px;color:#d5ceff;font-size:9px;font-weight:800}
      .apsan-mat-hero-cta{display:inline-flex!important;align-items:center;gap:7px;margin-top:15px;padding:9px 13px;border-radius:11px;background:#fff;color:#5421a7!important;text-decoration:none;font-size:11px;font-weight:900;box-shadow:0 8px 18px rgba(0,0,0,.16);cursor:pointer}
      .apsan-mat-hero-cta:hover{transform:translateY(-1px);box-shadow:0 11px 22px rgba(0,0,0,.2)}
      @media(max-width:900px){.apsan-mat-hero-visual{min-width:220px}.apsan-mat-hero-stat{min-width:130px!important}}
      @media(max-width:700px){.apsan-mat-hero{min-height:0!important}.apsan-mat-hero-inner{min-height:0!important;padding:21px!important}.apsan-mat-hero-visual{display:none}.apsan-mat-hero h3{font-size:24px!important}.apsan-mat-hero-stat{width:100%!important}.apsan-mat-hero-cta{margin-top:12px}}
    `;document.head.appendChild(s)
  }
  function enhance(){
    css();
    const hero=document.querySelector('.apsan-mat-hero');if(!hero||hero.dataset.visualV4)return;
    const inner=hero.querySelector('.apsan-mat-hero-inner');if(!inner)return;
    const copy=inner.querySelector('div:first-child');const stat=inner.querySelector('.apsan-mat-hero-stat');if(!copy||!stat)return;
    hero.dataset.visualV4='1';copy.classList.add('apsan-mat-hero-copy');
    const h=copy.querySelector('h3');if(h)h.textContent='A sua biblioteca de aprendizagem';
    const p=copy.querySelector('p');if(p)p.textContent='Publique, organize e partilhe materiais diretamente com os seus alunos — tudo num só lugar.';
    if(!copy.querySelector('.apsan-mat-hero-cta')){const b=document.createElement('a');b.href='#';b.className='apsan-mat-hero-cta';b.innerHTML='<i class="fa-solid fa-plus"></i> Adicionar material';b.onclick=e=>{e.preventDefault();document.getElementById('apsanMatTitle')?.focus()};copy.appendChild(b)}
    stat.innerHTML='<strong>'+stat.querySelector('strong')?.textContent+'</strong><span>materiais publicados</span><small><i class="fa-solid fa-layer-group"></i> PDF · Vídeo · Exercícios</small>';
    const visual=document.createElement('div');visual.className='apsan-mat-hero-visual';visual.innerHTML='<div class="apsan-mat-orb"></div><div class="apsan-mat-book"><div class="cover"></div><div class="page"></div><div class="mark"></div></div><div class="apsan-mat-file-float pdf"><i class="fa-solid fa-file-pdf"></i></div><div class="apsan-mat-file-float video"><i class="fa-solid fa-circle-play"></i></div><div class="apsan-mat-file-float exercise"><i class="fa-solid fa-pen-to-square"></i></div>';
    inner.insertBefore(visual,stat)
  }
  function boot(){enhance();new MutationObserver(()=>enhance()).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();