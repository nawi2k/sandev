const BADGES = [
  { nombre: 'Clown', dias: 0, img: '../assets/clown.png', fallback: 'https://i.ibb.co/3kW2T3p/clown.png' },
  { nombre: 'Noob', dias: 1, img: '../assets/noob.png', fallback: 'https://i.ibb.co/vH1j3lW/noob.png' },
  { nombre: 'Novice', dias: 3, img: '../assets/novice.png', fallback: 'https://i.ibb.co/vH1j3lW/noob.png' },
  { nombre: 'Average', dias: 7, img: '../assets/average.png', fallback: 'https://i.ibb.co/65x323/average.png' },
  { nombre: 'Sigma', dias: 15, img: '../assets/sigma.png', fallback: 'https://i.ibb.co/uR3CjTf/sigma.png' },
  { nombre: 'Chad', dias: 30, img: '../assets/chad.png', fallback: 'https://i.ibb.co/7123928/chad.png' },
  { nombre: 'Giga Chad', dias: 120, img: '../assets/gigachad.png', fallback: 'https://i.ibb.co/8321019/gigachad.png' }
];

function getDiaActual() {
  return new Date().getDate();
}

function obtenerDatosBase() {
  const guardado = localStorage.getItem('SANDEV_OCTUBRE_2026_V6');
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
  arrayInicial[16] = { diaNum: 17, fecha: '17/10', estado: 'RECAIDA', horaInicio: '14:40', horaFin: '15:50', duracionMin: 70, disparador: 'Instagram', notas: 'Recaída 17/10', numRecaida: 4 };

  const resetFixed = new Date(2026, 9, 17, 15, 50, 0).getTime();
  localStorage.setItem('SANDEV_LAST_RESET_TIME', resetFixed);
  localStorage.setItem('SANDEV_OCTUBRE_2026_V6', JSON.stringify(arrayInicial));
  return arrayInicial;
}

let diasDelMes = obtenerDatosBase();
let userXP = parseInt(localStorage.getItem('SANDEV_USER_XP')) || 120;
let listaDiario = JSON.parse(localStorage.getItem('SANDEV_DIARIO_LOGS')) || [
  { fecha: '16/10', texto: 'Me acosté tarde y estuve sobrepensando.', tags: ['sobrepensar', 'desvelo'] },
  { fecha: '17/10', texto: 'Tuve ganas de ver un poco por aburrimiento.', tags: ['ganas de ver un poco', 'aburrimiento'] }
];
let selectedTags = [];

function guardarEnLocalStorage() {
  localStorage.setItem('SANDEV_OCTUBRE_2026_V6', JSON.stringify(diasDelMes));
  localStorage.setItem('SANDEV_USER_XP', userXP);
  localStorage.setItem('SANDEV_DIARIO_LOGS', JSON.stringify(listaDiario));
}

function toggleSideMenu() {
  document.getElementById('sideMenu').classList.toggle('active');
  document.getElementById('overlayMenu').classList.toggle('active');
}

function irAInicio() {
  ocultarTodasLasVistas();
  document.getElementById('viewHome').classList.add('active');
  setTimeout(scrollToHoy, 100);
}

function abrirHistorial() {
  ocultarTodasLasVistas();
  document.getElementById('viewHistorial').classList.add('active');
  cargarMesHistorial();
}

function abrirMeditacion() {
  ocultarTodasLasVistas();
  document.getElementById('viewMeditacion').classList.add('active');
}

function abrirDiario() {
  ocultarTodasLasVistas();
  document.getElementById('viewDiario').classList.add('active');
  renderizarPatronesDiario();
}

function ocultarTodasLasVistas() {
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
}

// CÁLCULO DE RACHA Y XP
function calcularRacha() {
  const diaHoy = getDiaActual();
  let contador = 0;
  for (let i = diaHoy - 1; i >= 0; i--) {
    if (diasDelMes[i].estado === 'LIMPIO' || diasDelMes[i].estado === 'PEEKING') {
      contador++;
    } else if (diasDelMes[i].estado === 'RECAIDA') {
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

  // Barra de XP
  const targetXP = 300;
  const pct = Math.min(100, (userXP / targetXP) * 100);
  document.getElementById('xpBarFill').style.width = `${pct}%`;
  document.getElementById('xpText').innerText = `${userXP} / ${targetXP} XP`;

  renderizarListaInsignias(currentBadge.nombre);
}

function sumarXP(puntos) {
  userXP += puntos;
  if (userXP < 0) userXP = 0;
  guardarEnLocalStorage();
  calcularRacha();
}

function cargarGrilla() {
  const container = document.getElementById('gridDiaria');
  container.innerHTML = '';
  const diaHoy = getDiaActual();

  diasDelMes.forEach(item => {
    const row = document.createElement('div');
    const esHoy = item.diaNum === diaHoy;
    
    row.className = `row-dia ${item.estado.toLowerCase()} ${esHoy ? 'hoy' : ''}`;
    if (esHoy) row.id = 'rowHoyTarget';

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

  setTimeout(scrollToHoy, 150);
}

function scrollToHoy() {
  const target = document.getElementById('rowHoyTarget');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// MODAL Y LÓGICA DE RESPIRACIÓN SOS (BOX BREATHING)
let sosInterval = null;
let sosStep = 0; // 0: inhala, 1: aguanta, 2: exhala, 3: pausa
let sosCount = 4;

function abrirModalSOS() {
  document.getElementById('modalSOS').style.display = 'flex';
  iniciarBoxBreathing();
}

function cerrarModalSOS() {
  document.getElementById('modalSOS').style.display = 'none';
  if(sosInterval) clearInterval(sosInterval);
  sumarXP(30);
}

function iniciarBoxBreathing() {
  sosStep = 0; sosCount = 4;
  actualizarUIBreathing();

  if(sosInterval) clearInterval(sosInterval);
  sosInterval = setInterval(() => {
    sosCount--;
    if(sosCount <= 0) {
      sosStep = (sosStep + 1) % 4;
      sosCount = 4;
    }
    actualizarUIBreathing();
  }, 1000);
}

function actualizarUIBreathing() {
  const circle = document.getElementById('sosCircle');
  const actionTxt = document.getElementById('breathActionText');
  const timerTxt = document.getElementById('breathTimerText');

  circle.className = 'breath-circle';
  timerTxt.innerText = sosCount;

  if(sosStep === 0) {
    circle.classList.add('inhala');
    actionTxt.innerText = 'INHALA 🩵';
  } else if(sosStep === 1) {
    circle.classList.add('aguanta');
    actionTxt.innerText = 'AGUANTA 💛';
  } else if(sosStep === 2) {
    circle.classList.add('exhala');
    actionTxt.innerText = 'EXHALA 💜';
  } else if(sosStep === 3) {
    circle.classList.add('pausa');
    actionTxt.innerText = 'PAUSA 💚';
  }
}

// DIARIO INTELIGENTE
function toggleTag(tagName) {
  const idx = selectedTags.indexOf(tagName);
  if(idx > -1) selectedTags.splice(idx, 1);
  else selectedTags.push(tagName);

  document.querySelectorAll('.tag-chip').forEach(chip => {
    if(selectedTags.includes(chip.innerText.replace('#', ''))) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

function guardarEntradaDiario() {
  const txt = document.getElementById('textoDiario').value.trim();
  if(!txt && selectedTags.length === 0) return alert('Por favor escribe algo o selecciona una etiqueta.');

  const diaHoy = getDiaActual();
  listaDiario.push({ fecha: `${String(diaHoy).padStart(2,'0')}/10`, texto: txt, tags: [...selectedTags] });
  
  document.getElementById('textoDiario').value = '';
  selectedTags = [];
  document.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('active'));

  sumarXP(30);
  guardarEnLocalStorage();
  renderizarPatronesDiario();
  alert('Reflexión guardada (+30 XP)');
}

function renderizarPatronesDiario() {
  const container = document.getElementById('listaPatronesRepetidos');
  container.innerHTML = '';

  let conteo = {};
  listaDiario.forEach(log => {
    if(log.tags) {
      log.tags.forEach(t => {
        conteo[t] = (conteo[t] || 0) + 1;
      });
    }
  });

  const keys = Object.keys(conteo);
  if(keys.length === 0) {
    container.innerHTML = '<p style="color:#64748b;">No hay etiquetas suficientes aún.</p>';
    return;
  }

  keys.forEach(k => {
    const item = document.createElement('div');
    item.className = 'patron-item';
    item.innerHTML = `<span>#${k}</span> <strong>${conteo[k]} veces repetido</strong>`;
    container.appendChild(item);
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

  const diaHoy = getDiaActual();
  const hoyObj = diasDelMes[diaHoy - 1];
  hoyObj.estado = tipo;
  hoyObj.horaInicio = hInicio;
  hoyObj.horaFin = hFin;
  hoyObj.duracionMin = duracion;
  hoyObj.disparador = disparador;
  hoyObj.notas = notas;

  if (tipo === 'RECAIDA') {
    hoyObj.numRecaida = totalEyac;
    const ahora = new Date();
    const resetDate = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), h2, m2, 0).getTime();
    localStorage.setItem('SANDEV_LAST_RESET_TIME', resetDate);
    sumarXP(-100);
  } else {
    sumarXP(-20);
  }

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

// TEMPORIZADOR DE RACHA
setInterval(() => {
  let lastReset = localStorage.getItem('SANDEV_LAST_RESET_TIME');
  if (!lastReset) {
    lastReset = new Date(2026, 9, 17, 15, 50, 0).getTime();
    localStorage.setItem('SANDEV_LAST_RESET_TIME', lastReset);
  }

  const ahora = Date.now();
  let difSegundos = Math.floor((ahora - parseInt(lastReset)) / 1000);
  if (difSegundos < 0) difSegundos = 0;

  const hrs = String(Math.floor(difSegundos / 3600)).padStart(2, '0');
  const mins = String(Math.floor((difSegundos % 3600) / 60)).padStart(2, '0');
  const secs = String(difSegundos % 60).padStart(2, '0');
  document.getElementById('streakTimer').innerText = `${hrs}:${mins}:${secs}`;
}, 1000);

// MÓDULO DE MEDITACIÓN
let medInterval = null;
let medSegundosRestantes = 0;

function iniciarMeditacion() {
  const mins = parseInt(document.getElementById('medTiempo').value) || 5;
  medSegundosRestantes = mins * 60;
  
  document.getElementById('btnStartMed').style.display = 'none';
  document.getElementById('btnStopMed').style.display = 'block';
  
  actualizarDisplayMeditacion();

  if(medInterval) clearInterval(medInterval);

  medInterval = setInterval(() => {
    medSegundosRestantes--;
    actualizarDisplayMeditacion();

    if (medSegundosRestantes <= 0) {
      clearInterval(medInterval);
      reproducirSonidoFinal();
      sumarXP(50);
      setTimeout(() => {
        alert('🧘‍♂️ ¡Meditación completada! (+50 XP)');
        detenerMeditacion();
      }, 300);
    }
  }, 1000);
}

function detenerMeditacion() {
  if(medInterval) clearInterval(medInterval);
  document.getElementById('btnStartMed').style.display = 'block';
  document.getElementById('btnStopMed').style.display = 'none';
  document.getElementById('medTimerDisplay').innerText = '00:00';
}

function actualizarDisplayMeditacion() {
  const m = String(Math.floor(medSegundosRestantes / 60)).padStart(2, '0');
  const s = String(medSegundosRestantes % 60).padStart(2, '0');
  document.getElementById('medTimerDisplay').innerText = `${m}:${s}`;
}

function reproducirSonidoFinal() {
  const sonidoSel = document.getElementById('medSonido').value;
  let audioUrl = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

  if(sonidoSel === 'campana') {
    audioUrl = 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3';
  } else if(sonidoSel === 'naturaleza') {
    audioUrl = 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3';
  }

  const audio = new Audio(audioUrl);
  audio.play();
}

// INICIALIZACIÓN
calcularRacha();
cargarGrilla();