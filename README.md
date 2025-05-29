# Calculadora de Gráficas

## 📚 Introducción

La **Calculadora de Gráficas** es una aplicación web que permite a los usuarios dibujar y analizar gráficas dirigidas y no dirigidas. Los usuarios pueden ingresar vértices y aristas a través de un formulario, y la aplicación genera una representación gráfica usando Canvas HTML5, mostrando nodos, aristas, bucles y líneas paralelas. También calcula propiedades como matrices de incidencia, adyacencia, accesibilidad y detecta vértices desconectados y aristas paralelas.

El proyecto está diseñado para estudiantes, profesores y entusiastas de la teoría de grafos, proporcionando una herramienta interactiva para explorar conceptos matemáticos de manera visual.

## 🔍 Objetivos

- Crear una interfaz web intuitiva para definir grafos mediante vértices y aristas.
- Visualizar grafos dirigidos y no dirigidos con nodos en disposición circular, incluyendo bucles y líneas paralelas.
- Implementar cálculos de matrices (incidencia, adyacencia, accesibilidad) y propiedades como vértices desconectados.
- Proporcionar una experiencia fluida en navegadores modernos sin dependencias externas.

## 🌐 Lenguajes Utilizados

En la carpeta `Pagina` podrá encontrar todos los archivos utlizados y minimamente necesarios para hacer funcionar el programa.
- **HTML**: Define la estructura de la página web, incluyendo el formulario para entrada de datos (número de vértices, aristas, tipo de grafo) y el elemento `<canvas>` para la visualización y descarga del grafo si es necesario.
- **CSS**: Estiliza la interfaz, asegurando que el lienzo Canvas, matrices y secciones de información (como líneas paralelas) sean visualmente claras y responsivas.
- **JavaScript**: Maneja la lógica principal:
  - **Procesamiento de datos**: Parsea las aristas ingresadas (formato `A-B, B-A`) y calcula vértices desconectados.
  - **Visualización**: Usa Canvas para dibujar nodos (círculos), aristas (líneas), bucles (arcos) y flechas en digrafos.
  - **Cálculos de grafos**: Genera matrices y detecta propiedades como aristas paralelas.
- **Markdown** (este archivo): Documenta el proyecto para usuarios y desarrolladores.
- **Imágenes** (carpeta): Muestra las imagenes del programa tal como el icono web.
- **Python**: Primer boceto del programa y que mostró la lógica inicial, luego sustituido a JS para mejorar la velocidad de respuesta.
- **Bases-Templates** (carpeta): Se almacenan todos los archivos prueba para realizar el proyecto, siempre es bueno tener los orígenes de todo, además de algunas funciones extras que no se agregaron al programa final.


## 🤖 Uso de la Inteligencia Artificial

La IA (Grok 3, BlackBox, ChatGPT, GitHub Copilot) se utilizó para:

- **Transformación de código**: Ayudó a desarrollar y depurar funciones de nuestro archivo primario en Python a JavaScript, como `MIncidenciaD` y `graficarRelaciones`, ya que al ser este un lenguaje nuevo y poco tiempo para terminar el proyecto, fungió como un fuerte apoyo para desarrollar el programa a tiempo.
- **Optimización**: Sugirió mejoras en la lógica de Canvas para evitar superposiciones (por ejemplo, en bucles) y optimizar el cálculo de offsets para aristas paralelas.
- **Documentación**: Generó este archivo `README.md`, estructurando la información de manera clara y profesional basada en los requisitos proporcionados.

La IA aceleró el desarrollo, pero el código fue revisado y adaptado manualmente para cumplir con las necesidades específicas del proyecto.

## 🖥️ Enlace a la Página Web

La aplicación está disponible en: [https://sinr0str0.github.io/TeoriaGraficas/Pagina/](https://sinr0str0.github.io/TeoriaGraficas/Pagina/ "Programa Gráficas").

## ⬇️ Instalación y Uso

1. Clona el repositorio: `git clone https://github.com/SinR0str0/TeoriaGraficas.git`.
2. Abre `index.html` en un navegador moderno (Chrome, Firefox, Edge).
3. Ingresa los datos del grafo:
   - **Número de vértices (n)**: Por ejemplo, 4.
   - **Número de aristas (e)**: Por ejemplo, 2.
   - **Tipo de grafo**: Gráfica (1) o Digráfica (2).
   - **Aristas**: Formato `A-B, B-A`.
4. Haz clic en "Generar Grafo" para ver la visualización y las matrices.

* Como opción alternativa, puede consultar el sitio oficial del proyecto (mientrasesté disponible) en: [https://sinr0str0.github.io/TeoriaGraficas/Pagina/](https://sinr0str0.github.io/TeoriaGraficas/Pagina/ "Programa Gráficas").


## 🧬 Estructura del Proyecto

- `index.html`: Página principal con formulario y lienzo Canvas.
- `styles.css`: Estilos para la interfaz.
- `main.js`: Lógica principal del formulario, funciones para matrices, cálculos de grafos y más.
- `README.md`: Este archivo de documentación.

## 💬 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un *issue* o envía un *pull request* en el repositorio.

En su defecto, si este archivo fue compartido directamente por alguno de los autores del proyecto, puede contactarlos para hacer sus contribuciones.


- - -
## 👨‍👧 Autores
Proyecto elaborado por [Sin_R0str0](https://github.com/SinR0str0) & [JazGil](https://github.com/JazGil).

Última actualización: 28 de mayo de 2025.
