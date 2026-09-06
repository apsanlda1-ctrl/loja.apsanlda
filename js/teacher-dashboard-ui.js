/* APSAN — melhoria visual não destrutiva do painel do professor */
(function(){
'use strict';
function inject(){
 if(document.getElementById('apsanTeacherDashboardUI'))return;
 const s=document.createElement('style');s.id='apsanTeacherDashboardUI';
 s.textContent=`
#onlinePage{background:linear-gradient(135deg,#f7fbff 0%,#eef5ff 48%,#f8f5ff 100%)}
#onlinePage .on-shell{max-width:1240px}
#onlinePage .on-head{padding:8px 4px 18px;border-bottom:1px solid #e5eaf2;margin-bottom:20px}
#onlinePage .on-head h2{font-size:24px;letter-spacing:-.45px;color:#0f1f35;margin-bottom:3px}
#onlinePage .on-head small{display:inline-flex;align-items:center;gap:6px;color:#64748b;font-size:12px;font-weight:700}
#onlinePage .on-head small:before{content:"";width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px #dcfce7}
#onlinePage .on-close{padding:9px 14px;border-radius:11px;font-weight:800;color:#334155;box-shadow:0 3px 12px rgba(15,23,42,.05)}
#onlinePage .on-dashboard{grid-template-columns:232px minmax(0,1fr);gap:18px;align-items:start}
#onlinePage .on-side{position:sticky;top:14px;border-radius:20px;padding:17px 13px;background:linear-gradient(180deg,#0b1d33,#0a1930);box-shadow:0 14px 32px rgba(11,29,51,.18);border:1px solid rgba(255,255,255,.06);min-height:calc(100vh - 150px)}
#onlinePage .on-side>strong{display:block;padding:3px 9px 13px;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#onlinePage .on-side>hr{border:0;border-top:1px solid rgba(255,255,255,.1);margin:0 5px 9px}
#onlinePage #onTeacherNav:before{content:"GESTÃO PEDAGÓGICA";display:block;padding:11px 10px 7px;color:#7186a6;font-size:9px;font-weight:900;letter-spacing:1.35px}
#onlinePage .on-side button{display:flex;align-items:center;gap:10px;min-height:40px;padding:9px 11px;margin:3px 0;border-radius:11px;color:#b9c7db;font-size:12px;transition:.18s ease}
#onlinePage .on-side button:hover{background:rgba(255,255,255,.07);color:#fff;transform:translateX(2px)}
#onlinePage .on-side button.active{background:linear-gradient(90deg,#6d28d9,#5b21b6);color:#fff;box-shadow:0 8px 18px rgba(109,40,217,.25)}
#onlinePage #onTeacherNav button:before{font-family:"Font Awesome 6 Free";font-weight:900;width:18px;text-align:center;color:#94a9c7}
#onlinePage #onTeacherNav button.active:before,#onlinePage #onTeacherNav button:hover:before{color:#fff}
#onlinePage #onTeacherNav button:nth-child(1):before{content:"\f015"}
#onlinePage #onTeacherNav button:nth-child(2):before{content:"\f02d"}
#onlinePage #onTeacherNav button:nth-child(3):before{content:"\f073"}
#onlinePage #onTeacherNav button:nth-child(4):before{content:"\f274"}
#onlinePage #onTeacherNav button:nth-child(5):before{content:"\f0c0"}
#onlinePage #onTeacherNav button:nth-child(6):before{content:"\f15c"}
#onlinePage #onTeacherNav button:nth-child(7):before{content:"\f53a"}
#onlinePage #onTeacherNav button:nth-child(8):before{content:"\f007"}
#onlinePage .on-side>button:last-child{margin-top:auto;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);justify-content:center}
#onlinePage #onDash main{min-width:0}
#onlinePage #onDash main:before{content:"PAINEL DO PROFESSOR";display:block;font-size:9px;font-weight:900;letter-spacing:1.45px;color:#8b5cf6;margin:0 0 7px 2px}
#onlinePage #onhome .on-v2-kpis{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}
#onlinePage #onhome .on-v2-kpi{position:relative;overflow:hidden;padding:16px 17px;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 6px 20px rgba(15,23,42,.045);min-height:91px}
#onlinePage #onhome .on-v2-kpi:after{content:"";position:absolute;right:-18px;top:-22px;width:68px;height:68px;border-radius:50%;background:#f3e8ff}
#onlinePage #onhome .on-v2-kpi:nth-child(2):after{background:#e0f2fe}
#onlinePage #onhome .on-v2-kpi:nth-child(3):after{background:#ecfdf5}
#onlinePage #onhome .on-v2-kpi:nth-child(4):after{background:#fff7ed}
#onlinePage #onhome .on-v2-kpi small{font-size:10px;font-weight:800;color:#64748b;position:relative;z-index:2}
#onlinePage #onhome .on-v2-kpi strong{font-size:20px;color:#172033;position:relative;z-index:2}
#onlinePage #onhome .on-v2-card{border-radius:18px;padding:21px;box-shadow:0 7px 22px rgba(15,23,42,.045)}
#onlinePage #onprogram .on-v2-card{position:relative;border-radius:20px;padding:24px;background:rgba(255,255,255,.98);border:1px solid #e1e7f0;box-shadow:0 12px 32px rgba(15,23,42,.065);overflow:hidden}
#onlinePage #onprogram .on-v2-card:before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,#075985,#6d28d9)}
#onlinePage #onprogram .on-v2-card>h3{font-size:21px;color:#111b30;margin:0 0 14px;letter-spacing:-.35px;display:flex;align-items:center;gap:9px}
#onlinePage #onprogram .on-v2-card>h3:before{content:"\f02d";font-family:"Font Awesome 6 Free";font-weight:900;color:#6d28d9;font-size:15px;width:32px;height:32px;border-radius:10px;background:#f3e8ff;display:grid;place-items:center}
#onlinePage #onprogram .on-v2-note{display:flex;align-items:center;gap:8px;padding:12px 14px;border-radius:12px;margin-bottom:18px;background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;font-size:11px;line-height:1.45}
#onlinePage #onprogram .on-v2-note:before{content:"\f058";font-family:"Font Awesome 6 Free";font-weight:900;color:#16a34a;font-size:15px}
#onlinePage #onprogram .on-v2-grid{grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr);gap:24px;margin-top:2px}
#onlinePage #onprogram .on-v2-grid>div:first-child{padding-right:20px;border-right:1px solid #edf0f5}
#onlinePage #onprogram .on-v2-grid>div:first-child strong{display:block;font-size:23px;line-height:1.2;color:#12213a;letter-spacing:-.5px;margin-bottom:9px}
#onlinePage #onprogram .on-v2-grid>div:first-child p{font-size:13px;line-height:1.7;color:#66758b;margin:0;max-width:700px}
#onlinePage #onprogram .on-v2-grid>div:last-child{background:#f8fafc;border:1px solid #e8edf3;border-radius:15px;padding:16px 17px}
#onlinePage #onprogram .on-v2-grid>div:last-child:before{content:"DADOS ESSENCIAIS";display:block;font-size:9px;font-weight:900;letter-spacing:1.25px;color:#8b5cf6;margin-bottom:8px}
#onlinePage #onprogram .on-v2-grid>div:last-child p{margin:0;color:#64748b;font-size:12px;line-height:2}
#onlinePage #onprogram .on-v2-grid>div:last-child p+p{border-top:1px solid #e6eaf0;margin-top:8px;padding-top:8px}
#onlinePage #onprogram .on-v2-actions{margin-top:21px;padding-top:17px;border-top:1px solid #edf0f5;display:flex;justify-content:flex-end;gap:9px}
#onlinePage #onprogram .on-v2-actions .on-v2-btn{min-height:40px;padding:10px 15px;border-radius:10px;font-size:11px;box-shadow:0 5px 14px rgba(7,89,133,.12)}
#onlinePage #onprogram .on-v2-actions .on-v2-btn.alt{box-shadow:none}
#onlinePage #onschedule .on-v2-card,#onlinePage #onclasses .on-v2-card,#onlinePage #onstudents .on-v2-card,#onlinePage #onmaterials .on-v2-card,#onlinePage #onfinance .on-v2-card,#onlinePage #onprofile .on-v2-card{border-radius:17px;box-shadow:0 7px 22px rgba(15,23,42,.045)}
#onlinePage .on-v2-card h3{color:#172033}
#onlinePage .on-v2-btn{border-radius:10px;font-size:11px}
@media(max-width:1000px){#onlinePage .on-dashboard{grid-template-columns:205px minmax(0,1fr)}#onlinePage #onprogram .on-v2-grid{grid-template-columns:1fr}#onlinePage #onprogram .on-v2-grid>div:first-child{border-right:0;border-bottom:1px solid #edf0f5;padding:0 0 17px}}
@media(max-width:760px){#onlinePage{padding:70px 10px 24px}#onlinePage .on-dashboard{display:block}#onlinePage .on-side{position:relative;top:auto;min-height:0;margin-bottom:14px;padding:12px;border-radius:16px}#onlinePage #onTeacherNav{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}#onlinePage #onTeacherNav:before{grid-column:1/-1}#onlinePage #onTeacherNav button{justify-content:center;flex-direction:column;gap:3px;padding:8px 3px;min-height:55px;text-align:center;font-size:9px}#onlinePage #onTeacherNav button:before{font-size:13px}#onlinePage #onhome .on-v2-kpis{grid-template-columns:1fr 1fr}#onlinePage #onprogram .on-v2-card{padding:18px}#onlinePage #onprogram .on-v2-actions{justify-content:stretch}#onlinePage #onprogram .on-v2-actions .on-v2-btn{flex:1}}
@media(max-width:430px){#onlinePage #onTeacherNav{grid-template-columns:repeat(2,1fr)}#onlinePage #onhome .on-v2-kpis{grid-template-columns:1fr}#onlinePage #onprogram .on-v2-actions{flex-direction:column}#onlinePage #onprogram .on-v2-actions .on-v2-btn{width:100%}}
`;
 document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();
