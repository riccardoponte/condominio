from flask import Flask, jsonify, request
import uuid # For generating unique IDs

app = Flask(__name__)

# In-memory database for announcements
announcements_db = []

@app.route('/')
def home():
    return "Backend is running"

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    return jsonify(announcements_db)

@app.route('/api/announcements', methods=['POST'])
def create_announcement():
    data = request.get_json()
    if not data or not 'title' in data or not 'content' in data:
        return jsonify({'error': 'Missing title or content'}), 400

    new_announcement = {
        'id': str(uuid.uuid4()), # Generate a unique ID
        'title': data['title'],
        'content': data['content']
    }
    announcements_db.append(new_announcement)
    return jsonify(new_announcement), 201

if __name__ == '__main__':
    # Note: Changed port to 5001 to avoid potential conflicts if frontend is served by another process on 5000
    app.run(host='0.0.0.0', port=5001, debug=True)
