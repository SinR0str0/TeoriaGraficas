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

async function prueba(verticesValue) {
  try {
    if (!pyodide) {
      await setupPyodide();
    }

    // Ejecutar la función Mat desde brain.py con el parámetro dado
    let matrix = await pyodide.runPythonAsync(`Mat(${verticesValue})`);
    if (!matrix) {
      throw new Error(`La ejecución de Mat(${verticesValue}) falló.`);
    }

    matrix = matrix.toJs();

    console.print(matrix)

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('matrizOutput').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}


function validaNumero(value) {
  return Number.isInteger(value) && value >= 0 && !value.toString().includes(".");
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

  if (!validaNumero(linea)) {
    lineasError.textContent = 'Ingrese un número natural para las líneas.';
    valid = false;
  } else {
    lineasError.textContent = '';
  }

  if (!validaNumero(vertice)) {
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

  if (tipoGrafoOp.value==='') {
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

      main(vertice).catch(console.error);
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
      text = `Del vértice <strong>${v1}</strong> al vértice <strong>${v2}</strong>`;
    } else if (opActual === "2") {
      text = `Sale del vértice <strong>${v1}</strong> y llega al vértice <strong>${v2}</strong>`;
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

(function() {
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
      if(targetSection) {
        targetSection.style.display = 'block';
      }
    });
  });
})();