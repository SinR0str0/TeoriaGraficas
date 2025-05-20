const form = document.getElementById('dataForm');
const lineas = document.getElementById('lineas');
const vertices = document.getElementById('vertices');
const relaciones = document.getElementById('relaciones');

const lineasError = document.getElementById('lineasError');
const verticesError = document.getElementById('verticesError');
const relacionesErrores = document.getElementById('relacionesErrores');

const dropdownsSection = document.getElementById('dropdowns');

function enviarDatos() {
    const datos = { n: vertices, e: lineas };

    fetch("http://localhost:5000/procesar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(resultado => {
        document.getElementById("resultado").innerText = JSON.stringify(resultado);
    })
    .catch(error => console.error("Error:", error));
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
    relacionesErrores.textContent = 'Las relaciones no pueden estar vacias.';
    valid = false;
  } else {
    relacionesErrores.textContent = '';
  }

  if (valid) {
    form.style.display = 'none';
    dropdownsSection.style.display = 'flex';
    dropdownsSection.querySelector('select').focus();
    enviarDatos();
  }
});
