
const listaEl = document.getElementById('lista');
const tituloIn = document.getElementById('novo-titulo');
const textoIn = document.getElementById('novo-texto');
const btnAdd = document.getElementById('adicionar');
const btnReset = document.getElementById('resetar');

function load(){ try{ return JSON.parse(localStorage.getItem('modelos_pwa')) || {}; } catch(e){ return {}; } }
function save(m){ localStorage.setItem('modelos_pwa', JSON.stringify(m)); }

let modelos = load();

function render(){
  listaEl.innerHTML='';
  Object.keys(modelos).forEach(key=>{
    const box = document.createElement('div'); box.className='modelo-item';
    const h = document.createElement('h4'); h.textContent=key;
    const ta = document.createElement('textarea'); ta.value = modelos[key];
    ta.addEventListener('input', ()=>{ modelos[key]=ta.value; save(modelos); });
    const del = document.createElement('button'); del.textContent='Excluir'; del.className='small-btn';
    del.addEventListener('click', ()=>{ if(confirm('Excluir esse modelo?')){ delete modelos[key]; save(modelos); render(); alert('Modelo excluído'); } });
    box.appendChild(h); box.appendChild(ta); box.appendChild(del);
    listaEl.appendChild(box);
  });
  if(Object.keys(modelos).length===0){ listaEl.innerHTML = '<p>Nenhum modelo. Adicione um novo abaixo.</p>'; }
}

btnAdd.addEventListener('click', ()=>{
  const t = (tituloIn.value||'').trim();
  const tx = (textoIn.value||'').trim();
  if(!t || !tx){ alert('Informe título e texto do modelo.'); return; }
  if(modelos[t]){ if(!confirm('Já existe um modelo com esse título. Substituir?')) return; }
  modelos[t]=tx; save(modelos); tituloIn.value=''; textoIn.value=''; render(); alert('Modelo adicionado/atualizado'); 
});

btnReset.addEventListener('click', ()=>{
  if(!confirm('Restaurar modelos padrão? Isso substituirá os modelos atuais.')) return;
  const defaults = {
    "Art 303 - Lesão Corporal": "TRATA-SE DO ART 303 DO CTB - PRATICAR LESÃO...",
    "Art 310 - Direção Não Habilitada": "TRATA-SE DO ART 310 DO CTB - PERMITIR...",
    "Histórico BOAT": "No dia {data}, por volta das {hora}, no km {km}...",
    "Release Padrão": "FATO: {descricao}\nData/Hora: {data} – {hora}\nLocal: {local}"
  };
  modelos = defaults; save(modelos); render(); alert('Modelos restaurados para o padrão.');
});

if(Object.keys(modelos).length===0){
  modelos = {
    "Art 303 - Lesão Corporal": "TRATA-SE DO ART 303 DO CTB - PRATICAR LESÃO...",
    "Art 310 - Direção Não Habilitada": "TRATA-SE DO ART 310 DO CTB - PERMITIR...",
    "Histórico BOAT": "No dia {data}, por volta das {hora}, no km {km}...",
    "Release Padrão": "FATO: {descricao}\nData/Hora: {data} – {hora}\nLocal: {local}"
  };
  save(modelos);
}

render();
