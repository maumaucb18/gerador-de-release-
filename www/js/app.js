
const DEFAULT_MODELOS = {
  "Art 303 - Lesão Corporal": `TRATA-SE DO ART 303 DO CTB - PRATICAR LESÃO CORPORAL CULPOSA NA DIREÇÃO DE VEÍCULO AUTOMOTOR:\n\nNO DIA {data} NO KM {km} DA {via}, OCORREU UM SINISTRO DE TRANSITO COM LESÕES CORPORAIS, DO TIPO {tipo}. OS VEICULOS ENVOLVIDOS FORAM MARCA/MODELO/PLACA CONDUZIDO POR {nome1}/RG: {rg1} E MARCA/MODELO/PLACA CONDUZIDO POR {nome2}/RG: {rg2}. COM BASE NA ANALISE E VESTIGIOS IDENTIFICADOS CONSTATOU-SE A SEGUINTE SEQUÊNCIA: O VEICULO MARCA/MODELO TRAFEGAVA SENTIDO {sentido1} A {sentido2} QUANDO TEVE SUA FRENTE OBSTRUIDA PELO VEICULO MARCA/MODELO QUE TRAFEGAVA NO MESMO SENTIDO E IA REALIZAR MANOBRA DE RETORNO, MAS NÃO PAROU A DIREITA CONFORME PREVÊ A LEGISLAÇÃO. RESTARAM LESIONADOS O CONDUTOR E PASSAGEIRO DO VEICULO MARCA/MODELO E FORAM SOCORRIDOS PELO SAMU PARA O HOSPITAL LOCAL. FORAM REALIZADOS OS TESTES DE ETILOMETRO NOS CONDUTORES RESTADO {etilometro} EM AMBOS. OS VEICULOS FORAM RESTITUIDOS. DEMAIS INFORMAÇÕES: {demais}`,
  "Art 310 - Direção Não Habilitada": `TRATA-SE DO ART 310 DO CTB - PERMITIR, CONFIAR OU ENTREGAR A DIREÇÃO A PESSOA NÃO HABILITADA...\n\nNO DIA {data}, NO KM {km} DA {via}, OCORREU UM SINISTRO DO TIPO {tipo}. OS VEICULOS ENVOLVIDOS FORAM: {veiculos}. RELATO: {relato}. MEDIDAS TOMADAS: {medidas}.`,
  "Histórico BOAT": `No dia {data}, no km {km} da {via}, em {municipio}-{uf}, ocorreu um sinistro do tipo {tipo}, com {vitimas} vitima(s). Os veículos envolvidos foram: {veiculos}. Com base na análise dos vestígios identificados e relatos, constatou-se: {conclusoes}.`,
  "Release Padrão": `FATO: {descricao}\nCRBM/3º BRBM/GRv TORRES\nData/Hora: {data} – \nLocal: {local}\nVeículo: \nVítima(s): {vitimas}\nResumo: {resumo}`
};

function loadModelos(){ 
  const raw = localStorage.getItem('modelos_pwa');
  if(!raw){ localStorage.setItem('modelos_pwa', JSON.stringify(DEFAULT_MODELOS)); return JSON.parse(JSON.stringify(DEFAULT_MODELOS)); }
  try{ return JSON.parse(raw); } catch(e){ localStorage.setItem('modelos_pwa', JSON.stringify(DEFAULT_MODELOS)); return JSON.parse(JSON.stringify(DEFAULT_MODELOS)); }
}
function saveModelos(m){ localStorage.setItem('modelos_pwa', JSON.stringify(m)); }

let modelos = loadModelos();

const sel = document.getElementById('modelo');
const campos = document.getElementById('campos');
const gerarBtn = document.getElementById('gerar');
const copiarBtn = document.getElementById('copiar');
const limparBtn = document.getElementById('limpar');
const textoArea = document.getElementById('texto-final');

function populateSelect(){
  sel.innerHTML = '';
  Object.keys(modelos).forEach(k => {
    const o = document.createElement('option'); o.value = k; o.textContent = k; sel.appendChild(o);
  });
}
populateSelect();

function buildFieldsForModelo(nome){
  campos.innerHTML = '';
  const texto = modelos[nome] || '';
  const matches = [...texto.matchAll(/\{(.*?)\}/g)].map(m=>m[1]);
  const uniq = [...new Set(matches)];
  if(uniq.length===0){
    const p = document.createElement('p'); p.textContent = 'Este modelo não requer campos adicionais.'; campos.appendChild(p); return;
  }
  uniq.forEach(key => {
    const lab = document.createElement('label'); lab.textContent = key;
    let inp;
    if(/data|hora|date|time/i.test(key)){
      inp = document.createElement('input'); inp.type = 'datetime-local'; inp.name = key; inp.placeholder = key;
    } else {
      inp = document.createElement('input'); inp.type = 'text'; inp.name = key; inp.placeholder = key;
    }
    campos.appendChild(lab); campos.appendChild(inp);
  });
}

sel.addEventListener('change', ()=> buildFieldsForModelo(sel.value));
buildFieldsForModelo(sel.value);

gerarBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  let texto = modelos[sel.value] || '';
  const inputs = campos.querySelectorAll('input');
  inputs.forEach(i=>{
    let val = i.value || `{${i.name}}`;
    if(i.type === 'datetime-local' && i.value){
      const dt = new Date(i.value);
      const day = String(dt.getDate()).padStart(2,'0');
      const month = String(dt.getMonth()+1).padStart(2,'0');
      const year = dt.getFullYear();
      const hours = String(dt.getHours()).padStart(2,'0');
      const mins = String(dt.getMinutes()).padStart(2,'0');
      val = `${day}/${month}/${year} ${hours}:${mins}`;
    }
    const re = new RegExp('\{' + i.name + '\}','g');
    texto = texto.replace(re, val);
  });
  textoArea.value = texto;
});

copiarBtn.addEventListener('click', async ()=>{
  const txt = textoArea.value;
  if(!txt){ alert('Gere o texto antes de copiar.'); return; }
  try{
    await navigator.clipboard.writeText(txt);
    alert('Texto copiado para a área de transferência.');
  }catch(e){
    const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); alert('Texto copiado (fallback).'); } catch(err){ alert('Não foi possível copiar automaticamente.'); }
    ta.remove();
  }
});

limparBtn.addEventListener('click', ()=>{ campos.querySelectorAll('input').forEach(i=>i.value=''); textoArea.value=''; });

window.addEventListener('storage', ()=>{
  modelos = loadModelos();
  populateSelect();
  buildFieldsForModelo(sel.value);
});
// Para cada placeholder detectado
placeholders.forEach(ph => {
    const nomeInput = config[ph]?.nome || ph;
    const tipoInput = config[ph]?.tipo || 'text';
    
    const inp = document.createElement('input');
    inp.name = nomeInput;
    inp.type = tipoInput;
    form.appendChild(inp);
});
