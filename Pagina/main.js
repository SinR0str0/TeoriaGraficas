const form = document.getElementById('dataForm');
const lineas = document.getElementById('lineas');
const vertices = document.getElementById('vertices');
const relaciones = document.getElementById('relaciones');

const lineasError = document.getElementById('lineasError');
const verticesError = document.getElementById('verticesError');
const relacionesErrores = document.getElementById('relacionesErrores');

const dropdownsSection = document.getElementById('dropdowns');

const tipoGrafo = document.getElementById("tipoGrafo").value;


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
});

