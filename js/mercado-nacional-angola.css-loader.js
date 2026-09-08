/* Compatibility loader for Mercado Nacional visual template */
(function(){
  if(document.querySelector('link[data-apsan-mna-css]')) return;
  const l=document.createElement('link'); l.rel='stylesheet'; l.href='css/mercado-nacional-angola.css'; l.dataset.apsanMnaCss='1'; document.head.appendChild(l);
})();
