const form = document.getElementById('dataForm');
const lineas = document.getElementById('lineas');
const vertices = document.getElementById('vertices');
const relaciones = document.getElementById('relaciones');

const lineasError = document.getElementById('lineasError');
const verticesError = document.getElementById('verticesError');
<<<<<<< HEAD
const relacionesErrores = document.getElementById('relacionError');
const tipoError = document.getElementById('tipoGrafoError');
=======
const relacionesErrores = document.getElementById('relacionesErrores');
>>>>>>> parent of 0a117ba (Pruebas más)

const dropdownsSection = document.getElementById('dropdowns');

const tipoGrafo = document.getElementById("tipoGrafo").value;

const opcionesSelect = document.getElementById('opciones');
const resultadosDiv = document.getElementById('result');
const guardadosDiv = document.getElementById('savedTexts');

let pyodide;
let opActual = '';
const savedData = [];

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
  return Number.isInteger(value) && value > 0 && !value.toString().includes(".");
}

function validaRelacion(text) {
  return text.trim().length > 0;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;

  const linea = Number(lineas.value);
  const vertice = Number(vertices.value);
  const relacion = relaciones.value;

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

<<<<<<< HEAD
  if (opActual == "") {
    tipoError.textContent = 'Seleccione un tipo de gráfica.';
    valid = false;
  } else {
    tipoError.textContent = '';
  }
  if (savedData.length !== linea) {
    relacionesErrores.textContent = 'Deben haber al menos ${linea} líneas.';
    valid = false;
  } else {
    relacionesErrores.textContent = '';
  }

  if (valid) {
    form.style.display = 'none';
    dropdownsSection.style.display = 'flex';
    dropdownsSection.querySelector('select')?.focus();

    main(vertice).catch(console.error);
  }
=======
    if (!validaRelacion(relacion)) {
        relacionesErrores.textContent = 'Relaciones inválidas.';
        valid = false;
    } else {
        relacionesErrores.textContent = '';
    }

    if (valid && (tipoGrafo=="1"||tipoGrafo=="0")) {
        form.style.display = 'none';
        dropdownsSection.style.display = 'flex';
        dropdownsSection.querySelector('select')?.focus();
        
        main(vertice).catch(console.error);
    }
>>>>>>> parent of 0a117ba (Pruebas más)
});

opcionesSelect.addEventListener('change', function (event) {
  const valorElegido = event.target.value;

  if (opActual && opActual !== valorElegido) {
    const confirmed = confirm("Al cambiar de opción, los mensajes cambian. Al aceptar, los textos que se han guardado cambiarán a su contraparte.");
    if (confirmed) {
      opActual = valorElegido;
      actuResultadoDiv(opActual);
      renderGuardados();
    } else {
      event.target.value = opActual;
    }
  } else {
    opActual = valorElegido;
    actuResultadoDiv(opActual);
  }
});

function actuResultadoDiv(option) {
  resultDiv.innerHTML = '';
  if (option === "1") {
    resultDiv.innerHTML = `
                    Del vértice <input type="text" id="vertex1" placeholder="Vértice 1" />
                    al vértice <input type="text" id="vertex2" placeholder="Vértice 2" />
                    <button id="saveBtn">Guardar</button>
                `;
    document.getElementById('saveBtn').addEventListener('click', function (e) {
      e.preventDefault();
      saveText(1);
    });
  } else if (option === "2") {
    resultDiv.innerHTML = `
                    Sale del vértice <input type="text" id="vertex3" placeholder="Vértice 3" />
                    y llega al vértice <input type="text" id="vertex4" placeholder="Vértice 4" />
                    <button id="saveBtn">Guardar</button>
                `;
    document.getElementById('saveBtn').addEventListener('click', function (e) {
      e.preventDefault();
      saveText(2);
    });
  }
}

function saveText(option) {
  if (option === 1) {
    const v1 = document.getElementById('vertex1').value.trim();
    const v2 = document.getElementById('vertex2').value.trim();
    if (v1 && v2) {
      savedData.push({ v1, v2 });
      renderGuardados();
      // limpiar inputs
      document.getElementById('vertex1').value = '';
      document.getElementById('vertex2').value = '';
      document.getElementById('vertex3').value = '';
      document.getElementById('vertex4').value = '';
    } else {
      alert("Por favor, completa ambos campos.");
    }
  } else if (option === 2) {
    const v1 = document.getElementById('vertex3').value.trim();
    const v2 = document.getElementById('vertex4').value.trim();
    if (v1 && v2) {
      savedData.push({ v1, v2 });
      renderGuardados();
      // limpiar inputs
      document.getElementById('vertex1').value = '';
      document.getElementById('vertex2').value = '';
      document.getElementById('vertex3').value = '';
      document.getElementById('vertex4').value = '';
    } else {
      alert("Por favor, completa ambos campos.");
    }
  }
}

// Renderiza los textos guardados según opción con el patrón correcto
function renderGuardados() {
  textosDiv.innerHTML = '';
  if (!opActual) return;

  savedData.forEach(({ v1, v2 }, index) => {
    let text = '';
    if (opActual === "1") {
      text = `Del vértice ${v1} al vértice ${v2}`;
    } else if (opActual === "2") {
      text = `Sale del vértice ${v1} y llega al vértice ${v2}`;
    }
    const p = document.createElement('p');
    p.textContent = text;
    textosDiv.appendChild(p);
  });
}