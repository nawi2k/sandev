const BADGES = [
  { nombre: 'Clown', dias: 0, img: '../assets/clown.png', fallback: 'https://i.ibb.co/3kW2T3p/clown.png' },
  { nombre: 'Noob', dias: 1, img: '../assets/noob.png', fallback: 'https://i.ibb.co/vH1j3lW/noob.png' },
  { nombre: 'Novice', dias: 3, img: '../assets/novice.png', fallback: 'https://i.ibb.co/vH1j3lW/noob.png' },
  { nombre: 'Average', dias: 7, img: '../assets/average.png', fallback: 'https://i.ibb.co/65x323/average.png' },
  { nombre: 'Sigma', dias: 15, img: '../assets/sigma.png', fallback: 'https://i.ibb.co/uR3CjTf/sigma.png' },
  { nombre: 'Chad', dias: 30, img: '../assets/chad.png', fallback: 'https://i.ibb.co/7123928/chad.png' },
  { nombre: 'Giga Chad', dias: 120, img: '../assets/gigachad.png', fallback: 'https://i.ibb.co/8321019/gigachad.png' }
];

const DIA_ACTUAL = 17;

function obtenerDatosBase() {
  const guardado = localStorage.getItem('SANDEV_OCTUBRE_2026_V3');
  if (guardado) return JSON.parse(guardado);

  let arrayInicial = Array.from({length: 31}, (_, i) => {
    const num = i + 1;
    const diaStr = String(num).padStart(2, '0');
    return { diaNum: num, fecha: `${diaStr}/10`, estado: 'LIMPIO', horaInicio: '', horaFin: '', duracionMin: 0, disparador: '', notas: '', numRecaida: null };
  });

  arrayInicial[0] = { diaNum: 1, fecha: '01/10', estado: 'RECAIDA', horaInicio: '15:00', horaFin: '16:00', duracionMin: 60, disparador: 'Instagram', notas: 'Recaída 01/10', numRecaida: 1 };
  arrayInicial[1] = { diaNum: 2, fecha: '02/10', estado: 'RECAIDA', horaInicio: '14:00', horaFin: '15:00', duracionMin: 60, disparador: 'Aburrimiento', notas: 'Recaída 02/10', numRecaida: 2 };
  arrayInicial[8] = { diaNum: 9, fecha: '09/10', estado: 'RECAIDA', horaInicio: '15:00', horaFin: '18:00', duracionMin: 180, disparador: 'Instagram', notas: 'Recaída 3 horas porno', numRecaida: 3 };
  arrayInicial[14] = { diaNum: 15, fecha: '15/10', estado: 'PEEKING', horaInicio: '22:00', horaFin: '22:30', duracionMin: 30, disparador: 'TikTok', notas: 'Peeking sin eyacular', numRecaida: null };
  arrayInicial[15] = { diaNum: 16, fecha: '16/10', estado: 'PEEKING', horaInicio: '23:00', horaFin: '23:45', duracionMin: 45, disparador: 'Instagram', notas: 'Peeking sin eyacular', numRecaida: null };
  arrayInicial[16] = { diaNum: 17, fecha: '17/10', estado: 'RECAIDA', horaInicio: '14:40', horaFin: '15:50', duracionMin: 70, disparador: 'Instagram', notas: 'Recaída hoy 17/10', numRecaida: 4 };

  localStorage.setItem('SANDEV_OCTUBRE_2026_V3', JSON.stringify(arrayInicial));
  return arrayInicial;
}

let diasDelMes = obtenerDatosBase();

function guardarEnLocalStorage() {
  localStorage.setItem('SANDEV_OCTUBRE_2026_V3', JSON.stringify(diasDelMes));
}

function toggleSideMenu() {
  document.getElementById('sideMenu').classList.toggle('active');
  document.getElementById('overlayMenu').classList.toggle('active');
}

function irAInicio() {
  document.getElementById('viewHome').classList.add('active');
  document.getElementById('viewHistorial').classList.remove('active');
}

function abrirHistorial() {
  document.getElementById('viewHome').classList.remove('active');
  document.getElementById('viewHistorial').classList.add('active');
  cargarMesHistorial();
}

function calcularRacha() {
  let contador = 0;
  for (let i = DIA_ACTUAL - 1; i >= 0; i--) {
    if (diasDelMes[i].estado === 'LIMPIO') {
      contador++;
    } else {
      break;
    }
  }
  actualizarUIInsignia(contador);
}

function actualizarUIInsignia(racha) {
  document.getElementById('streakDays').innerText = racha;
  
  let currentBadge = BADGES[0];
  BADGES.forEach(b => {
    if (racha >= b.dias) currentBadge = b;
  });

  document.getElementById('rankTitle').innerText = currentBadge.nombre;
  const imgElem = document.getElementById('avatarImg');
  imgElem.src = currentBadge.img;
  imgElem.onerror = () => imgElem.src = currentBadge.fallback;

  renderizarListaInsignias(currentBadge.nombre);
}

function cargarGrilla() {
  const container = document.getElementById('gridDiaria');
  container.innerHTML = '';

  diasDelMes.forEach(item => {
    const row = document.createElement('div');
    const esHoy = item.diaNum === DIA_ACTUAL;
    
    row.className = `row-dia ${item.estado.toLowerCase()} ${esHoy ? 'hoy' : ''}`;

    let tag = '🟢 Limpio';
    if(item.estado === 'RECAIDA') tag = `❌ Recaída (${item.horaInicio} - ${item.horaFin})`;
    if(item.estado === 'PEEKING') tag = `⚠️ Peeking (${item.horaInicio} - ${item.horaFin})`;

    row.innerHTML = `
      <div class="row-left-group">
        <strong>${item.fecha}</strong> ${esHoy ? '<small style="color:#00e5ff;">(HOY)</small>' : ''}
        ${item.numRecaida ? `<span class="num-badge">${item.numRecaida}</span>` : ''}
      </div>
      <span>${tag} ${item.disparador ? `<small>- ${item.disparador}</small>` : ''}</span>
    `;
    container.appendChild(row);
  });
}

function abrirSelectorRegistro() { document.getElementById('modalSelector').style.display = 'flex'; }
function cerrarSelector() { document.getElementById('modalSelector').style.display = 'none'; }

function prepararFormulario(tipo) {
  cerrarSelector();
  document.getElementById('tipoRegistro').value = tipo;
  document.getElementById('formTitle').innerText = tipo === 'RECAIDA' ? '❌ Registrar Recaída Completa' : '⚠️ Registrar Peeking (Porno)';
  document.getElementById('modalFormulario').style.display = 'flex';
}
function cerrarFormulario() { document.getElementById('modalFormulario').style.display = 'none'; }

function guardarRegistro(e) {
  e.preventDefault();
  const tipo = document.getElementById('tipoRegistro').value;
  const hInicio = document.getElementById('horaInicio').value;
  const hFin = document.getElementById('horaFin').value;
  const disparador = document.getElementById('disparadorInput').value;
  const notas = document.getElementById('notasInput').value;

  const [h1, m1] = hInicio.split(':').map(Number);
  const [h2, m2] = hFin.split(':').map(Number);
  let duracion = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (duracion < 0) duracion += 1440;

  let totalEyac = 1;
  diasDelMes.forEach(d => { if (d.estado === 'RECAIDA') totalEyac++; });

  const hoyObj = diasDelMes[DIA_ACTUAL - 1];
  hoyObj.estado = tipo;
  hoyObj.horaInicio = hInicio;
  hoyObj.horaFin = hFin;
  hoyObj.duracionMin = duracion;
  hoyObj.disparador = disparador;
  hoyObj.notas = notas;
  if (tipo === 'RECAIDA') hoyObj.numRecaida = totalEyac;

  const ahora = new Date();
  const resetDate = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), h2, m2, 0).getTime();
  localStorage.setItem('SANDEV_LAST_RESET_TIME', resetDate);

  guardarEnLocalStorage();
  calcularRacha();
  cargarGrilla();
  cerrarFormulario();
}

function abrirEstadisticasModal() {
  document.getElementById('modalStats').style.display = 'flex';
  renderizarGraficos();
}
function cerrarEstadisticasModal() { document.getElementById('modalStats').style.display = 'none'; }
function abrirModalInsignias() { document.getElementById('modalInsignias').style.display = 'flex'; }
function cerrarModalInsignias() { document.getElementById('modalInsignias').style.display = 'none'; }

let chartHorasInst = null, chartTriggersInst = null, chartHistTrigInst = null;

function renderizarGraficos() {
  let minPornoSemana = 0;
  let conteoTriggers = {};

  diasDelMes.forEach(d => {
    if(d.estado !== 'LIMPIO') {
      minPornoSemana += d.duracionMin || 60;
      if(d.disparador) conteoTriggers[d.disparador] = (conteoTriggers[d.disparador] || 0) + 1;
    }
  });

  const horasTotalesSemana = 168;
  const horasPorno = parseFloat((minPornoSemana / 60).toFixed(2));
  const horasLimpias = parseFloat((horasTotalesSemana - horasPorno).toFixed(2));
  const pctLimpio = ((horasLimpias / horasTotalesSemana) * 100).toFixed(1);

  document.getElementById('summaryHoras').innerHTML = 
    `🛡️ <strong>${pctLimpio}% Tiempo Limpio</strong> (${horasLimpias} hrs)<br>` +
    `⚠️ <strong>Porno/Recaídas:</strong> ${horasPorno} hrs`;

  const ctxH = document.getElementById('chartHoras').getContext('2d');
  if(chartHorasInst) chartHorasInst.destroy();
  chartHorasInst = new Chart(ctxH, {
    type: 'pie',
    data: {
      labels: [`Horas Limpias (${horasLimpias}h)`, `Horas en Porno (${horasPorno}h)`],
      datasets: [{ data: [horasLimpias, horasPorno], backgroundColor: ['#00e5ff', '#ff1744'] }]
    },
    options: {
      plugins: {
        legend: { labels: { color: '#ffffff', font: { size: 10 } } },
        tooltip: {
          callbacks: {
            label: function(context) {
              let total = context.dataset.data.reduce((a, b) => a + b, 0);
              let val = context.raw;
              let percentage = ((val / total) * 100).toFixed(1);
              return `${context.label}: ${percentage}%`;
            }
          }
        }
      }
    }
  });

  const ctxT = document.getElementById('chartTriggers').getContext('2d');
  if(chartTriggersInst) chartTriggersInst.destroy();
  
  const labelsTrig = Object.keys(conteoTriggers);
  const dataTrig = Object.values(conteoTriggers);

  chartTriggersInst = new Chart(ctxT, {
    type: 'pie',
    data: {
      labels: labelsTrig.length ? labelsTrig : ['Sin Recaídas'],
      datasets: [{ data: dataTrig.length ? dataTrig : [1], backgroundColor: ['#ff1744', '#ffc107', '#00e5ff', '#ab47bc', '#e040fb'] }]
    },
    options: {
      plugins: {
        legend: { labels: { color: '#ffffff', font: { size: 10 } } },
        tooltip: {
          callbacks: {
            label: function(context) {
              let total = context.dataset.data.reduce((a, b) => a + b, 0);
              let val = context.raw;
              let percentage = ((val / total) * 100).toFixed(1);
              return `${context.label}: ${percentage}% de culpa`;
            }
          }
        }
      }
    }
  });
}

function cargarMesHistorial() {
  let eyac = 0, peeking = 0, minPorno = 0;
  let triggers = {};

  const gridContainer = document.getElementById('heatmapGrid');
  gridContainer.innerHTML = '';

  diasDelMes.forEach(d => {
    const block = document.createElement('div');
    block.className = `block-day ${d.estado.toLowerCase()}`;
    block.innerText = d.diaNum;
    gridContainer.appendChild(block);

    if(d.estado === 'RECAIDA') eyac++;
    if(d.estado === 'PEEKING') peeking++;
    if(d.estado !== 'LIMPIO') {
      minPorno += d.duracionMin || 60;
      if(d.disparador) triggers[d.disparador] = (triggers[d.disparador] || 0) + 1;
    }
  });

  const hrsPorno = (minPorno / 60).toFixed(1);
  const hrsTotalesMes = 744;
  const pctLimpio = (((hrsTotalesMes - hrsPorno) / hrsTotalesMes) * 100).toFixed(1);

  document.getElementById('histTotalEyac').innerText = eyac;
  document.getElementById('histTotalPeeking').innerText = peeking;
  document.getElementById('histHorasPorno').innerText = `${hrsPorno} hrs`;
  document.getElementById('histPctLimpio').innerText = `${pctLimpio}%`;

  const ctxHT = document.getElementById('chartHistorialTriggers').getContext('2d');
  if(chartHistTrigInst) chartHistTrigInst.destroy();
  chartHistTrigInst = new Chart(ctxHT, {
    type: 'pie',
    data: {
      labels: Object.keys(triggers).length ? Object.keys(triggers) : ['100% Limpio'],
      datasets: [{ data: Object.keys(triggers).length ? Object.values(triggers) : [1], backgroundColor: ['#ff1744', '#ffc107', '#00e5ff', '#ab47bc'] }]
    },
    options: {
      plugins: {
        legend: { labels: { color: '#ffffff', font: { size: 10 } } },
        tooltip: {
          callbacks: {
            label: function(context) {
              let total = context.dataset.data.reduce((a, b) => a + b, 0);
              let val = context.raw;
              let percentage = ((val / total) * 100).toFixed(1);
              return `${context.label}: ${percentage}%`;
            }
          }
        }
      }
    }
  });
}

function renderizarListaInsignias(activeName) {
  const container = document.getElementById('badgesList');
  container.innerHTML = '';
  BADGES.forEach(b => {
    const item = document.createElement('div');
    item.className = `badge-item ${b.nombre === activeName ? 'active-badge' : ''}`;
    item.innerHTML = `<img src="${b.img}" onerror="this.src='${b.fallback}'"> <div><strong>${b.nombre}</strong><p>${b.dias}+ Días</p></div>`;
    container.appendChild(item);
  });
}

setInterval(() => {
  const lastReset = localStorage.getItem('SANDEV_LAST_RESET_TIME') || Date.now();
  const ahora = Date.now();
  let difSegundos = Math.floor((ahora - lastReset) / 1000);
  if (difSegundos < 0) difSegundos = 0;

  const hrs = String(Math.floor(difSegundos / 3600)).padStart(2, '0');
  const mins = String(Math.floor((difSegundos % 3600) / 60)).padStart(2, '0');
  const secs = String(difSegundos % 60).padStart(2, '0');
  document.getElementById('streakTimer').innerText = `${hrs}:${mins}:${secs}`;
}, 1000);

// INICIALIZACIÓN
calcularRacha();
cargarGrilla(); 