from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/procesar", methods=["POST"])
def procesar_datos():
    datos = request.json 
    resultado = {key: value * 4 for key, value in datos.items()} 
    print("Resultado en consola:", resultado) 

    return True

if __name__ == "__main__":
    app.run(port=5000)
