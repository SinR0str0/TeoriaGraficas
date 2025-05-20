const form = document.getElementById('dataForm');
const lineas = document.getElementById('lineas');
const vertices = document.getElementById('vertices');
const relaciones = document.getElementById('relaciones');

const lineasError = document.getElementById('lineasError');
const verticesError = document.getElementById('verticesError');
const relacionesErrores = document.getElementById('relacionesErrores');

const matSection = document.getElementById('matrizOutput');
const dropdownsSection = document.getElementById('dropdowns');

async function main(verticesValue, relacionesValue) {
    let pyodide = await loadPyodide();
    
    try {
        const brainPyUrl = new URL('./brain.py', window.location.origin).href;
        let response = await fetch('./brain.py');
        if (!response.ok) {
            throw new Error(`No se pudo cargar brain.py desde ${brainPyUrl}: ${response.status} ${response.statusText}`);
        }
        let pythonCode = `
${await response.text()}
result = Mat(${verticesValue}, ${relacionesValue})
`;
        let matrix = await pyodide.runPythonAsync(pythonCode);
        matrix = matrix.toJs();
        
        let outputDiv = document.getElementById('matrizOutput');
        let output = '<table>';
        for (let row of matrix) {
            output += '<tr>';
            for (let cell of row) {
                output += `<td>${cell}</td>`;
            }
            output += '</tr>';
        }
        output += '</table>';
        outputDiv.innerHTML = output;
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
        relacionesErrores.textContent = 'Las relaciones deben ser una lista de pares de números naturales, ej: [[1,2],[2,3]].';
        valid = false;
    } else {
        relacionesErrores.textContent = '';
    }

    // Validar que el número de líneas coincida con las relaciones
    try {
        const parsedRelaciones = JSON.parse(relacion);
        if (parsedRelaciones.length !== linea) {
            lineasError.textContent = 'El número de líneas debe coincidir con la cantidad de relaciones.';
            valid = false;
        }
    } catch {
        // Error ya manejado por validaRelacion
    }

    if (valid) {
        form.style.display = 'none';
        dropdownsSection.style.display = 'flex';
        dropdownsSection.querySelector('select')?.focus();
        matSection.style.display = 'flex';
        matSection.querySelector('select')?.focus();
        main(vertice, relacion).catch(console.error);
    }
});

