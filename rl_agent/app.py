from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow JavaScript requests

# Global variable to store game state
game_state = {}

@app.route('/state', methods=['POST'])
def receive_state():
    global game_state
    game_state = request.json
    return jsonify({"message": "State received"}), 200

@app.route('/action', methods=['POST'])
def receive_action():
    action = request.json.get("action")  # Action sent by the RL agent
    print(f"Received action: {action}")
    return jsonify({"message": "Action received"}), 200

@app.route('/get_state', methods=['GET'])
def get_state():
    return jsonify(game_state)

if __name__ == '__main__':
    app.run(debug=True)