from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route("/procesar", methods=["POST"])
def procesar_datos():
    datos = request.json 
    resultado = {key: value * 4 for key, value in datos.items()} 
    print("Resultado en consola:", resultado) 

    return True

if __name__ == "__main__":
    app.run()
