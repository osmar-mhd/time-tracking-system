from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        with open('./resources/Data.json', 'r') as file:
            data = json.load(file)
        # Solo devolver los registros
        return jsonify(data['data']['records'])
    except Exception as e:
        return jsonify({'error': 'Error al leer el archivo'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
