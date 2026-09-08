/* ACE APSAN — acesso ao Mercado Nacional sem poluir a página inicial. */
(function(){
'use strict';
function wire(){
  const open=()=>{if(typeof window.openMercadoNacionalAngola==='function')window.openMercadoNacionalAngola();};
  document.querySelectorAll('[data-apsan-mercado-link]').forEach(el=>{if(el.dataset.mnaWired)return;el.dataset.mnaWired='1';el.addEventListener('click',e=>{e.preventDefault();open();});});
  const nav=document.querySelector('.nav-links');
  if(nav&&!nav.querySelector('[data-apsan-mercado-link]')){const a=document.createElement('a');a.href='#mercado-nacional-angola';a.dataset.apsanMercadoLink='1';a.innerHTML='<i class="fa-solid fa-store"></i> Mercado Nacional de Angola';nav.insertBefore(a,nav.lastElementChild||null);}
  const hero=document.querySelector('.hero-actions');
  if(hero&&!hero.querySelector('[data-apsan-mercado-link]')){const b=document.createElement('button');b.type='button';b.className='btn-outline-lp mna-home-button';b.dataset.apsanMercadoLink='1';b.innerHTML='<i class="fa-solid fa-store"></i> Mercado Nacional de Angola';hero.appendChild(b);}
  document.querySelectorAll('#landingMobileMenu .lp-menu-grid').forEach(g=>{if(!g.querySelector('[data-apsan-mercado-link]')){const a=document.createElement('a');a.href='#mercado-nacional-angola';a.dataset.apsanMercadoLink='1';a.innerHTML='<i class="fa-solid fa-store"></i><span>Mercado Nacional</span>';g.appendChild(a);}});
  const sec=document.getElementById('mercadoNacionalAngola');
  if(sec&&!sec.querySelector('.mna-close')){const btn=document.createElement('button');btn.type='button';btn.className='mna-close';btn.innerHTML='<i class="fa-solid fa-xmark"></i><span>Fechar</span>';btn.addEventListener('click',()=>{sec.classList.remove('mna-open');history.pushState({},'',location.pathname+location.search);});const shell=sec.querySelector('.mna-shell');if(shell)shell.prepend(btn);sec.classList.add('mna-panel');}
  document.querySelectorAll('#products').forEach(x=>{x.style.display='none';});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
setTimeout(wire,500);setTimeout(wire,1500);
})();
