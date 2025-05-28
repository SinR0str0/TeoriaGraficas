const form = document.getElementById('dataForm');
const appDiv = document.getElementById('app');
const lineas = document.getElementById('lineas');
const vertices = document.getElementById('vertices');

const lineasError = document.getElementById('lineasError');
const verticesError = document.getElementById('verticesError');
const relacionesErrores = document.getElementById('relacionError');
const tipoError = document.getElementById('tipoGrafoError');

const nuevoDiv = document.getElementById('nuevoDiv');

const tipoGrafoOp = document.getElementById('tipoGrafo');
const resultadoDiv = document.getElementById('resultado');
const textosGDiv = document.getElementById('textosG');

let opActual = '';
const datosV = [];
let pyodide; // global

async function setupPyodide() {
  pyodide = await loadPyodide();

  const response = await fetch("brain.py");
  const code = await response.text();
  await pyodide.runPythonAsync(code);
}

function graficarRelaciones(canvasId, vertices) {
  const relaciones = [
  { from: 'A', to: 'B', type: 2 },
  { from: 'A', to: 'C', type: 2 },
  { from: 'B', to: 'D', type: 1 },
  { from: 'C', to: 'D', type: 2 },
  { from: 'D', to: 'E', type: 2 },
  { from: 'E', to: 'A', type: 1 },
  { from: 'A', to: 'B', type: 1 },  // Paralela a la primera A->B pero tipo 1 (sin cabeza)
  { from: 'B', to: 'B', type: 2 },  // Bucle en B
  { from: 'F', to: 'F', type: 2 }   // Vértice desconectado con bucle
];

// Todos los nodos posibles, incluyendo desconectados (los que no están en relaciones)
const verticesDesconectados = ['G']; // Ejemplo nodo desconectado sin aristas

  const canvas = document.getElementById(canvasId);
  if (!canvas.getContext) {
    alert("Tu navegador no soporta Canvas");
    return;
  }
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Extraer nodos únicos de relaciones y agregar desconectados
  const nodosSet = new Set();
  relaciones.forEach(rel => {
    nodosSet.add(rel.from);
    nodosSet.add(rel.to);
  });
  vertsDesconectados.forEach(v => nodosSet.add(v));
  const nodos = Array.from(nodosSet).sort();

  // Posicionar nodos en círculo
  const centroX = canvas.width / 2;
  const centroY = canvas.height / 2;
  const radio = Math.min(centroX, centroY) - 80;

  const posiciones = {};
  const anguloPaso = (2 * Math.PI) / nodos.length;

  nodos.forEach((nodo, i) => {
    const angulo = i * anguloPaso - Math.PI / 2;
    posiciones[nodo] = {
      x: centroX + radio * Math.cos(angulo),
      y: centroY + radio * Math.sin(angulo)
    };
  });

  // Función para dibujar flecha
  function dibujarFlecha(ctx, fromX, fromY, toX, toY) {
    const headlen = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Cabeza flecha
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(toX, toY);
    ctx.fill();
  }

  // Dibuja una línea paralela desplazando por "offset" perpendicularmente
  function dibujarLineaParalela(ctx, x1, y1, x2, y2, offset) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist === 0) return null; // evitar división por cero

    // Vector perpendicular unitario
    const ux = -dy / dist;
    const uy = dx / dist;

    const nx1 = x1 + ux * offset;
    const ny1 = y1 + uy * offset;
    const nx2 = x2 + ux * offset;
    const ny2 = y2 + uy * offset;

    ctx.moveTo(nx1, ny1);
    ctx.lineTo(nx2, ny2);
    return { startX: nx1, startY: ny1, endX: nx2, endY: ny2 };
  }

  // Dibuja bucle en un nodo en forma de arco ajustado
  function dibujarBucle(ctx, x, y, radio=20, type=2) {
    ctx.beginPath();
    const startAngle = Math.PI * 0.3;
    const endAngle = Math.PI * 2.3;
    // Círculo del bucle ligeramente desplazado arriba a la derecha
    ctx.arc(x + radio * 0.7, y - radio * 0.7, radio, startAngle, endAngle);
    ctx.stroke();

    if (type !== 1) {
      // Dibuja cabeza flecha en el punto correspondiente al endAngle
      const angle = endAngle;
      const headlen = 10;
      const arrowX = x + radio * 0.7 + radio * Math.cos(angle);
      const arrowY = y - radio * 0.7 + radio * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - headlen * Math.cos(angle - Math.PI / 6), arrowY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(arrowX - headlen * Math.cos(angle + Math.PI / 6), arrowY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.lineTo(arrowX, arrowY);
      ctx.fill();
    }
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Preparar datos para detectar líneas paralelas entre mismos nodos
  const mapaParejas = {};
  relaciones.forEach((rel, idx) => {
    // Clave ordenada para la pareja (from,to)
    let key = rel.from < rel.to ? rel.from + '-' + rel.to : rel.to + '-' + rel.from;
    if (!mapaParejas[key]) mapaParejas[key] = [];
    mapaParejas[key].push(idx);
  });

  // Dibujar aristas
  relaciones.forEach((rel, idx) => {
    const from = rel.from;
    const to = rel.to;
    const tipo = rel.type || 2;
    const pFrom = posiciones[from];
    const pTo = posiciones[to];

    if (!pFrom || !pTo) return;

    ctx.beginPath();

    if (from === to) {
      // Bucle en nodo
      dibujarBucle(ctx, pFrom.x, pFrom.y, 20, tipo);
    } else {
      // Líneas paralelas: offset según posición en grupo
      let key = from < to ? from + '-' + to : to + '-' + from;
      let indicesGrupo = mapaParejas[key];
      let idxEnGrupo = indicesGrupo.indexOf(idx);
      const separacionOffset = 8;
      const mitad = (indicesGrupo.length - 1) / 2;
      const offset = (idxEnGrupo - mitad) * separacionOffset;

      const puntos = dibujarLineaParalela(ctx, pFrom.x, pFrom.y, pTo.x, pTo.y, offset);
      if (!puntos) return;

      if (tipo === 1) {
        ctx.stroke();
      } else {
        ctx.stroke();
        dibujarFlecha(ctx, puntos.startX, puntos.startY, puntos.endX, puntos.endY);
      }
    }
  });

  // Dibujar nodos
  ctx.fillStyle = '#3498db';
  ctx.strokeStyle = '#2980b9';
  ctx.lineWidth = 3;

  nodos.forEach(nodo => {
    const p = posiciones[nodo];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.fillText(nodo, p.x, p.y);
    ctx.fillStyle = '#3498db';
  });
}


function main() {
  const sections = document.querySelectorAll('.section-content');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  const n = Number(vertices.value);
  const e = Number(lineas.value);
  const s = datosV.map(item => item.v1);
  const l = datosV.map(item => item.v2);

  const vertexLabelsSet = new Set([...s, ...l]);
  let vertexLabels = [...vertexLabelsSet];

  while (vertexLabels.length < n) {
    const newIndex = vertexLabels.length + 1;
    vertexLabels.push(`V${newIndex}`);
  }

  //graficarRelaciones('canvas', vertexLabels);

  const labelToIndex = new Map();
  vertexLabels.forEach((label, index) => labelToIndex.set(label, index));
  const sNumeric = s.map(label => labelToIndex.get(label) + 1);
  const lNumeric = l.map(label => labelToIndex.get(label) + 1);

  const vertexHeaders = vertexLabels;
  const lineHeaders = Array.from({ length: e }, (_, i) => `L${i + 1}`);

  let MIncide;
  let MAdya;
  let MAcceso;
  let GradoI;
  let GradoE;

  const graph = document.getElementById('grafica');

  if (n > 20) {
    graph.textContent = 'Es probable que la información no se muestre correctamente.';
  }

  if (opActual === "1") {
    //Gráfica

    MIncide = MIncidenciaG(n, e, sNumeric, lNumeric);
    MAdya = MAdyacenciaG(n, e, sNumeric, lNumeric);
    GradoI = Grado(MIncide, 1);
    GradoE = null;

    if (e === 0) {
      document.getElementById('matrizIncidencia').innerHTML = '<h2>Matriz de Incidencia</h2>  No existe matriz de incidencia.';
    }
    else {
      mostrarMatriz(cambiarM(MIncide), 'matrizIncidencia', 'Incidencia', lineHeaders, vertexHeaders);
    }
  }
  else if (opActual === "2") {
    //Digráfica
    MIncide = MIncidenciaD(n, e, sNumeric, lNumeric);
    MAdya = MAdyacenciaD(n, e, sNumeric, lNumeric);
    GradoI = Grado(MIncide, "-1");
    GradoE = Grado(MIncide, "+1");
    console.log(GradoI);
    if (e === 0) {
      document.getElementById('matrizIncidencia').innerHTML = '<h2>Matriz de Incidencia</h2>  No existe matriz de incidencia.';
    }
    else {
      mostrarMatriz(MIncide, 'matrizIncidencia', 'Incidencia', lineHeaders, vertexHeaders);
    }
  }
  MAcceso = MAccesibilidad(MAdya)
  mostrarMatriz(MAdya, 'matrizAdyacencia', 'Adyacencia', vertexHeaders, vertexHeaders);
  mostrarMatriz(MAcceso, 'matrizAccesibilidad', 'Accesibilidad', vertexHeaders, vertexHeaders);

  //Información de Gráfica:
  const infoG = document.getElementById('caracteristicasGrafica');
  let ht = '<h2> Información de la gráfica</h2>';
  ht+='<ul>';

  ht+=`<li> La gráfica es ${(isSimple(MIncide)) ? "simple":"general"}.</li>`;
  ht+=`<li> La gráfica ${(e===0) ? "es":"no es"} nula.</li>`;
  ht+=`<li> La gráfica está ${(isConnected(MAcceso)) ? "conectada":"desconectada"}.</li>`;
  ht+=`<li> La gráfica ${(isRegular(GradoI, GradoE)) ? "es":"no es"} regular.</li>`;
  ht+=`<li> La gráfica ${(isCompleted(GradoI,GradoE)) ? "es":"no es"} completa.</li>`;

  if(opActual==="1"){
    ht+=`<li> La gráfica ${(isTree(n,e,MIncide)) ? "es":"no es"} un árbol.</li>`;
  }
  else{
    ht+=`<li> La gráfica ${(isSimetric(MAdya)) ? "es":"no es"} simétrica.</li>`;
    ht+=`<li> La gráfica ${(isBalanced(GradoI,GradoE)) ? "es":"no es"} balanceada.</li>`;
  }

  ht+=`<li> La gráfica ${(isEuleriana(opActual,MAcceso,MIncide)) ? "es":"no es"} euleriana.</li>`;
  ht+=`<li> La gráfica ${(isUnicursal(opActual,MAcceso,MIncide)) ? "es":"no es"} unicursal.</li>`;

  ht+='</ul>';
  infoG.innerHTML = ht;

  //Información de vértices:
  const infoV = document.getElementById('caracteristicasLineas');
  let html = '<h2>Información de vértices</h2><h3>Grados:</h3>';
  if (opActual === "1") {
    html += '<ul>';
    for (let i = 0; i < n; i++) {
      html += `<li>Grado del vértice ${vertexHeaders[i]} = ${GradoI[i]}.</li>`;
    }
    html += '</ul>';
  }
  else {
    html += '<ul>';
    for (let i = 0; i < n; i++) {
      html += `<li>Vértice ${vertexHeaders[i]} - Grado interno:  ${GradoI[i]} | Grado externo = ${GradoE[i]}.</li>`;
    }
    html += '</ul>';
  }

  let v = Aislado(GradoI, GradoE);

  if (v.length > 0) {
    html += '<h3>Aislados:</h3>';
    html += 'Los vértices: ';
    for (let i = 0; i < v.length; i++) {
      html += `${vertexHeaders[v[i] - 1]} `;
    }
    html += 'son aislados.';
  }

  if (opActual === "1") {
    v = Colgante(GradoI);
    if (v.length > 0) {
      html += '<h3>Colgantes:</h3>';
      html += 'Los vértices: ';
      for (let i = 0; i < v.length; i++) {
        html += `${vertexHeaders[v[i] - 1]} `;
      }
      html += 'son colgantes.';
    }
  }
  else {
    v = Iniciales(GradoI, GradoE);
    if (v.length > 0) {
      html += '<h3>Iniciales:</h3>';
      html += 'Los vértices: ';
      for (let i = 0; i < v.length; i++) {
        html += `${vertexHeaders[v[i] - 1]} `;
      }
      html += 'son iniciales.';
    }
    v = Finales(GradoI, GradoE);
    if (v.length > 0) {
      html += '<h3>Finales:</h3>';
      html += 'Los vértices: ';
      for (let i = 0; i < v.length; i++) {
        html += `${vertexHeaders[v[i] - 1]} `;
      }
      html += 'son finales.';
    }
  }

  html += '<h2>Información de líneas</h2>';
  html += '<h3>Paralelas:</h3>';
  let p = false;
  v = Paralelas(MIncide);

  let x = '<ul>';
  for (let i = 0; i < v.length; i++) {
    if (v[i].length > 0) {
      x += `<li>Las líneas ${v[i].join(', ')} son paralelas.</li>`;
      p = true;
    }
  }
  x += '</ul>';
  if (!p) {
    html += 'No existen líneas paralelas en esta gráfica.';
  }
  else {
    html += x;
  }

  html += '<h3>Bucles:</h3>';
  p = false;
  v = Bucles(MIncide);

  x = '<ul>';
  if (v.length > 0) {
    x += `<li>Las líneas ${v.join(', ')} son bucles.</li>`;
    x += '</ul>';
    html += x;
  }
  else {
    html += 'No existen bucles en esta gráfica.';
  }

  if (opActual === "1") {
    v = Series(MIncide, GradoI);
    html += '<h3>Líneas en serie:</h3>';
    p = false;
    let x = '<ul>';
    for (let i = 0; i < v.length; i++) {
      if (v[i].length > 0) {
        x += `<li>Las líneas ${v[i].join(', ')} están en serie.</li>`;
        p = true;
      }
    }
    x += '</ul>';
    if (!p) {
      html += 'No hay líneas en serie en esta gráfica.';
    }
    else {
      html += x;
    }

  }
  infoV.innerHTML = html;
}

function validaNumero(value, max) {
  return Number.isInteger(value) && value >= max && !value.toString().includes(".");
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;

  const linea = Number(lineas.value);
  const vertice = Number(vertices.value);
  const valoresUnicos = new Set([
    ...datosV.map(item => item.v1),
    ...datosV.map(item => item.v2)
  ]);

  if (!validaNumero(linea, 0)) {
    lineasError.textContent = 'Ingrese un número natural para las líneas.';
    valid = false;
  } else {
    lineasError.textContent = '';
  }

  if (!validaNumero(vertice, 1)) {
    verticesError.textContent = 'Ingrese un número natural para los vértices.';
    valid = false;
  } else {
    verticesError.textContent = '';
  }

  if (valoresUnicos.size > vertice) {
    relacionesErrores.textContent = 'Haz superado tus vértices establecidos.';
    valid = false;
  }
  else if (datosV.length < linea) {
    relacionesErrores.textContent = 'Necesitas más relaciones para continuar.';
    valid = false;
  }
  else if (datosV.length > linea) {
    relacionesErrores.textContent = `Necesitas eliminar ${datosV.length - linea} línea(s) para continuar.`;
    valid = false;
  } else {
    relacionesErrores.textContent = '';
  }

  if (tipoGrafoOp.value === '') {
    tipoError.textContent = 'Seleccione una opción para continuar.';
    relacionesErrores.textContent = '';
    valid = false;
  } else {
    tipoError.textContent = '';
  }

  if (valid) {
    appDiv.classList.toggle('mover-izquierda');
    if (!appDiv.classList.contains('mover-izquierda')) {
      nuevoDiv.classList.remove('visible');
    }

    main(vertice);
  }
});

appDiv.addEventListener('transitionend', () => {
  if (appDiv.classList.contains('mover-izquierda')) {
    nuevoDiv.classList.add('visible');
  }
});

tipoGrafoOp.addEventListener('change', function (event) {
  const seleccionado = event.target.value;

  if (opActual && opActual !== seleccionado) {
    const si = confirm("Al cambiar de opción, las relaciones se ajustarán. Al aceptar, todos los datos guardados serán actualizados o reiniciados.");
    if (si) {
      opActual = seleccionado;
      if (seleccionado === "") { datosV = [] }
      cambiarResultadosDiv(opActual);
      rendertextosG();
    } else {
      event.target.value = opActual;
    }
  } else {
    opActual = seleccionado;
    cambiarResultadosDiv(opActual);
  }
});

function cambiarResultadosDiv(option) {
  resultadoDiv.innerHTML = '';
  if (option === "1") {
    resultadoDiv.innerHTML = `
                    Del vértice <input type="text" id="vertex1" placeholder="Inicio" style="width: 63px;"/>
                    al vértice <input type="text" id="vertex2" placeholder="Fin" style="width: 63px;"/>
                    <button id="saveBtn">Guardar</button>
                `;
    document.getElementById('saveBtn').addEventListener('click', function (e) {
      e.preventDefault();
      guardarTxt(1);
    });
  } else if (option === "2") {
    resultadoDiv.innerHTML = `
                    Sale del vértice <input type="text" id="vertex3" placeholder="Inicio" style="width: 63px;"/>
                    y llega al vértice <input type="text" id="vertex4" placeholder="Fin" style="width: 63px;"/>
                    <button id="saveBtn">Guardar</button>
                `;
    document.getElementById('saveBtn').addEventListener('click', function (e) {
      e.preventDefault();
      guardarTxt(2);
    });
  }
}

function guardarTxt(option) {
  const n = Number(vertices.value);

  if (option === 1) {
    const v1 = document.getElementById('vertex1').value.trim();
    const v2 = document.getElementById('vertex2').value.trim();

    if (v1 && v2) {
      datosV.push({ v1, v2 });

      const valoresUnicos = new Set([
        ...datosV.map(item => item.v1),
        ...datosV.map(item => item.v2)
      ]);
      if (valoresUnicos.size > n) {
        datosV.pop();
        if (n === 0) {
          relacionesErrores.textContent = `Favor de ingresar un valor de n.`;
        }
        else {
          relacionesErrores.textContent = `Has superado el número de vértices n = ${n}`;
        }
        return;
      }

      rendertextosG();
      document.getElementById('vertex1').value = '';
      document.getElementById('vertex2').value = '';
      relacionesErrores.textContent = '';
    } else {
      alert("Por favor, completa ambos campos.");
    }
  } else if (option === 2) {
    const v1 = document.getElementById('vertex3').value.trim();
    const v2 = document.getElementById('vertex4').value.trim();
    if (v1 && v2) {
      datosV.push({ v1, v2 });
      const valoresUnicos = new Set([
        ...datosV.map(item => item.v1),
        ...datosV.map(item => item.v2)
      ]);
      if (valoresUnicos.size > n) {
        datosV.pop();
        if (n === 0) {
          relacionesErrores.textContent = `Favor de ingresar un valor de n.`;
        }
        else {
          relacionesErrores.textContent = `Has superado el número de vértices n = ${n}`;
        }
        return;
      }
      rendertextosG();
      document.getElementById('vertex3').value = '';
      document.getElementById('vertex4').value = '';
    } else {
      alert("Por favor, completa ambos campos.");
    }
  }
}


function rendertextosG() {
  textosGDiv.innerHTML = '';
  if (!opActual) return;
  datosV.forEach(({ v1, v2 }, index) => {
    let text = '';
    if (opActual === "1") {
      text = `L${index + 1}: Del vértice <strong>${v1}</strong> al vértice <strong>${v2}</strong>`;
    } else if (opActual === "2") {
      text = `L${index + 1}: Sale del vértice <strong>${v1}</strong> y llega al vértice <strong>${v2}</strong>`;
    }
    const p = document.createElement('p');
    p.innerHTML = text;
    const borrarBtn = document.createElement('button');
    borrarBtn.textContent = 'X';
    borrarBtn.style.marginLeft = '10px';
    borrarBtn.onclick = function () {
      datosV.splice(index, 1);
      rendertextosG();
    };
    p.appendChild(borrarBtn);
    textosGDiv.appendChild(p);
  });
}



(function () {
  const buttons = document.querySelectorAll('#nuevoDiv button');
  const sections = document.querySelectorAll('.section-content');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-section');
      // Ocultar todas las secciones
      sections.forEach(section => {
        section.style.display = 'none';
      });
      // Mostrar la sección target
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = 'block';
      }
    });
  });
})();


function Mat(n) {
  n = parseInt(n);
  return Array(n).fill().map(() => Array(n).fill(1));
}

// Directed graph matrix functions
function MIncidenciaD(n, e, s, l) {
  n = parseInt(n);
  e = parseInt(e);
  let mat = Array(n).fill().map(() => Array(e).fill("0"));

  for (let x = 0; x < e; x++) {
    let s_val = parseInt(s[x]);
    let l_val = parseInt(l[x]);

    mat[s_val - 1][x] = "+1";
    if (mat[l_val - 1][x] === "+1" || mat[l_val - 1][x] === "-1") {
      mat[l_val - 1][x] = "±1";
    } else {
      mat[l_val - 1][x] = "-1";
    }
  }

  return mat;
}

function MAdyacenciaD(n, e, s, l) {
  n = parseInt(n);
  e = parseInt(e);
  let mat = Array(n).fill().map(() => Array(n).fill(0));

  for (let x = 0; x < e; x++) {
    let s_val = parseInt(s[x]);
    let l_val = parseInt(l[x]);
    mat[s_val - 1][l_val - 1] = 1;
  }

  return mat;
}


function MIncidenciaG(n, e, s, l) {
  n = parseInt(n);
  e = parseInt(e);
  let mat = Array(n).fill().map(() => Array(e).fill(0));

  for (let x = 0; x < e; x++) {
    let s_val = parseInt(s[x]);
    let l_val = parseInt(l[x]);

    mat[s_val - 1][x] += 1;
    mat[l_val - 1][x] += 1;
  }

  return mat;
}

function MAdyacenciaG(n, e, s, l) {
  n = parseInt(n);
  e = parseInt(e);
  let mat = Array(n).fill().map(() => Array(n).fill(0));

  for (let x = 0; x < e; x++) {
    let s_val = parseInt(s[x]);
    let l_val = parseInt(l[x]);
    mat[s_val - 1][l_val - 1] = 1;
    mat[l_val - 1][s_val - 1] = 1;
  }

  return mat;
}

function MAccesibilidad(MAdya) {
  let n = MAdya.length;
  let MatrizR = Array(n).fill().map(() => Array(n).fill(0));
  let MatrizC = MAdya.map(row => row.slice());

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      MatrizR[i][j] = MAdya[i][j];
    }
  }

  for (let t = 2; t <= Math.floor((n * n + n + 2) / 2); t++) {
    let MatrizTemp = Array(n).fill().map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let suma = 0;
        for (let k = 0; k < n; k++) {
          suma += MatrizC[i][k] * MAdya[k][j];
        }
        MatrizTemp[i][j] = suma;
      }
    }
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        MatrizR[i][j] += MatrizTemp[i][j];
      }
    }
    MatrizC = MatrizTemp.map(row => row.slice());
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (MatrizR[i][j] !== 0) {
        MatrizR[i][j] = "+";
      }
    }
  }

  return MatrizR;
}

function Paralelas(Mincide) {
  const n = Mincide.length;
  const m = Mincide[0].length;
  const paralelas = [];
  const visitadas = new Array(m).fill(false);

  for (let i = 0; i < m; i++) {
    if (visitadas[i]) continue;

    const grupo = [i + 1];
    visitadas[i] = true;

    for (let j = i + 1; j < m; j++) {
      if (visitadas[j]) continue;

      let iguales = true;
      for (let fila = 0; fila < n; fila++) {
        if (Mincide[fila][i] !== Mincide[fila][j]) {
          iguales = false;
          break;
        }
      }

      if (iguales) {
        grupo.push(j + 1);
        visitadas[j] = true;
      }
    }

    if (grupo.length > 1) {
      paralelas.push(grupo);
    }
  }

  return paralelas;
}

function Bucles(MIncide) {
  let n = MIncide.length;
  let m = MIncide[0].length;
  let arr = [];

  for (let i = 0; i < n; i++) {
    let suma = 0;
    for (let j = 0; j < m; j++) {
      if (MIncide[i][j] === 2 || MIncide[i][j] === "±1") {
        arr.push(j + 1);
      }
    }
  }

  return arr;
}

function Series(MIncide, Grados) {
  let n = Grados.length;
  let arr = Array(n).fill().map(() => []);

  for (let i = 0; i < n; i++) {
    if (Grados[i] === 2) {
      for (let j = 0; j < MIncide[0].length; j++) {
        if (MIncide[i][j] >= 1) {
          arr[i].push(j + 1);
        }
      }
    }
  }

  return arr;
}

function isSimple(MIncide) {
  let aParalelos = Paralelas(MIncide);
  let aBucles = Bucles(MIncide);

  for (let x of aParalelos) {
    if (x.length > 0) return 0;
  }

  if (aBucles.length > 0) return 0;

  return 1;
}

function isConnected(MAcceso) {
  let n = MAcceso.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (MAcceso[i][j] !== "+") return 0;
    }
  }

  return 1;
}

function Grado(MIncide, tipo) {
  let n = MIncide.length;
  let m = MIncide[0].length;
  let arr = [];

  for (let i = 0; i < n; i++) {
    let suma = 0;
    for (let j = 0; j < m; j++) {
      if (tipo === 1 && MIncide[i][j] >= tipo) {
        suma += parseInt(MIncide[i][j]);
      }
      else if ((tipo === "+1" || tipo === "-1") && (MIncide[i][j] === "±1" || MIncide[i][j] === tipo)) {
        suma += 1;
      }
    }
    arr.push(suma);
  }

  return arr;
}

function Aislado(GradoI, GradoE) {
  let n = GradoI.length;
  let arr = [];

  for (let i = 0; i < n; i++) {
    if (!GradoE && GradoI[i] === 0 || (GradoI[i] === 0 && GradoE[i] === 0)) {
      arr.push(i + 1);
    }
  }

  return arr;
}

function Colgante(AGrados) {
  let n = AGrados.length;
  let arr = [];

  for (let i = 0; i < n; i++) {
    if (AGrados[i] === 1) {
      arr.push(i + 1);
    }
  }

  return arr;
}

function Iniciales(GradoI, GradoE) {
  let n = GradoI.length;
  let arr = [];

  for (let i = 0; i < n; i++) {
    if (GradoI[i] === 0 && GradoE[i] !== 0) {
      arr.push(i + 1);
    }
  }

  return arr;
}

function Finales(GradoI, GradoE) {
  let n = GradoI.length;
  let arr = [];

  for (let i = 0; i < n; i++) {
    if (GradoI[i] !== 0 && GradoE[i] === 0) {
      arr.push(i + 1);
    }
  }

  return arr;
}

function isTree(n, e, MIncide) {
  if (e !== n - 1) return 0;

  if (Colgante(Grado(MIncide, 1)).length < 2) {
    return 0;
  }

  return 1;
}

function isSimetric(MAdya) {
  let n = MAdya.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (MAdya[i][j] !== MAdya[j][i]) {
        return 0;
      }
    }
  }

  return 1;
}

function isRegular(GradoI, GradoE) {
  let li = GradoI.length;
  let grado = GradoI[0];

  for (let i = 0; i < li; i++) {
    if (GradoI[i] !== grado) {
      return 0;
    }
  }

  if(!GradoE){
    return 1;
  }
  let le = GradoE.length; 
  for (let i = 0; i < le; i++) {
    if (GradoE[i] !== grado) {
      return 0;
    }
  }

  return 1;
}

function isBalanced(GradoI, GradoE) {
  let n = GradoI.length;
  for (let i = 0; i < n; i++) {
    if (GradoI[i] !== GradoE[i]) {
      return 0;
    }
  }

  return 1;
}

function isCompleted(GradoI, GradoE) {
  let li = GradoI.length;
  let grado = li - 1;

  for (let i = 0; i < li; i++) {
    if (GradoI[i] !== grado) {
      return 0;
    }
  }

  if(!GradoE){
    return 1;
  }
  let le = GradoE.length; 

  for (let i = 0; i < le; i++) {
    if (GradoE[i] !== grado) {
      return 0;
    }
  }

  return 1;
}

function isEuleriana(tipo, MAcceso, MIncide) {
  if (tipo === "1") {
    if (isConnected(MAcceso)) {
      let vertices = Grado(MIncide, 1);
      for (let x of vertices) {
        if (x % 2 !== 0) return 0;
      }
    } else {
      return 0;
    }
  } else {
    let gradoI = Grado(MIncide, "+1");
    let gradoE = Grado(MIncide, "-1");

    if (!(isBalanced(gradoI, gradoE) && isConnected(MAcceso))) {
      return 0;
    }
  }

  return 1;
}

function isUnicursal(tipo, MAcceso, MIncide) {
  if (tipo === "1") {
    if (isConnected(MAcceso)) {
      let vertices = Grado(MIncide, 1);
      let impar = 0;
      for (let x of vertices) {
        if (x % 2 !== 0) impar += 1;
      }

      if (impar !== 2) {
        return 0;
      }
    } else {
      return 0;
    }
  } else {
    let impar = 0;
    let gradoI = Grado(MIncide, "+1");
    let gradoE = Grado(MIncide, "-1");

    for (let x = 0; x < gradoI.length; x++) {
      if (gradoI[x] !== gradoE[x]) {
        impar += 1;
      }
    }

    if (impar !== 2) {
      return 0;
    }
  }

  return 1;
}

function mostrarMatriz(matriz, containerId, texto, h, f) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Contenedor no encontrado');
    return;
  }

  let html = `<h2>Matriz de ${texto}</h2>`;
  html += '<table>';

  html += '<tr><td></td>';
  for (const header of h) {
    html += `<td>${header}</td>`;
  }
  html += '</tr>';

  for (let i = 0; i < matriz.length; i++) {
    html += '<tr>';
    html += `<td>${f[i]}</td>`;
    for (let cell of matriz[i]) {
      html += `<td>${cell}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';

  container.innerHTML = html;
}

function cambiarM(matriz) {
  // Crear una copia de la matriz para no modificar la original
  const uM = matriz.map(row => row.slice());
  // Recorrer todos los índices
  for (let i = 0; i < uM.length; i++) {
    for (let j = 0; j < uM[i].length; j++) {
      if (uM[i][j] > 1) {
        uM[i][j] = 1;
      }
    }
  }
  return uM;
}