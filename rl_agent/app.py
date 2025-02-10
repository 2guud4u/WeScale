from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS with additional options
CORS(app, resources={
    r"/*": {
        "origins": ["null", "http://localhost", "http://127.0.0.1"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Global variable to store game state
game_state = {}

@app.route('/state', methods=['POST', 'OPTIONS'])
def receive_state():
    print("Received request with clearmethod:", request.method)  # Log the request method
    
    if request.method == 'OPTIONS':
        print("Handling OPTIONS request")
        return build_preflight_response()
    
    print("Received data:", request.json)  # Log the received data
    global game_state
    game_state = request.json
    return jsonify({"message": "State received"}), 200

# @app.route('/state', methods=['POST', 'OPTIONS'])
# def receive_state():
#     # Handle OPTIONS request for preflight
#     if request.method == 'OPTIONS':
#         return build_preflight_response()
    
#     # Handle actual POST request
#     global game_state
#     game_state = request.json
#     return build_actual_response(jsonify({"message": "State received"}))

@app.route('/action', methods=['POST', 'OPTIONS'])
def receive_action():
    if request.method == 'OPTIONS':
        return build_preflight_response()
    
    action = request.json.get("action")
    print(f"Received action: {action}")
    return build_actual_response(jsonify({"message": "Action received"}))


@app.route('/get_state', methods=['GET', 'OPTIONS'])
def get_state():
    if request.method == 'OPTIONS':
        return build_preflight_response()
    
    return build_actual_response(jsonify(game_state))

def build_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    return response

def build_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run(debug=True)