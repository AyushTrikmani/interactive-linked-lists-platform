from flask import Flask, render_template, request, jsonify, session
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = 'linked_list_learning_platform_2024'

# Initialize user data storage
USER_DATA_FILE = 'user_data.json'

def load_user_data():
    if os.path.exists(USER_DATA_FILE):
        with open(USER_DATA_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_user_data(data):
    with open(USER_DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    return render_template('index.html')

@app.route('/api/progress', methods=['GET', 'POST'])
def handle_progress():
    user_id = session.get('user_id')
    user_data = load_user_data()
    
    if request.method == 'GET':
        return jsonify(user_data.get(user_id, {
            'score': 0,
            'achievements': [],
            'completed_lessons': [],
            'quiz_attempts': 0,
            'best_quiz_score': 0,
            'problems_solved': [],
            'total_time_spent': 0,
            'streak_days': 0,
            'last_activity': None
        }))
    
    if request.method == 'POST':
        data = request.json
        if user_id not in user_data:
            user_data[user_id] = {
                'score': 0,
                'achievements': [],
                'completed_lessons': [],
                'quiz_attempts': 0,
                'best_quiz_score': 0,
                'problems_solved': [],
                'total_time_spent': 0,
                'streak_days': 0,
                'last_activity': None
            }
        
        user_progress = user_data[user_id]
        user_progress['score'] += data.get('points', 0)
        
        if data.get('achievement') and data['achievement'] not in user_progress['achievements']:
            user_progress['achievements'].append(data['achievement'])
        
        if data.get('lesson'):
            if data['lesson'] not in user_progress['completed_lessons']:
                user_progress['completed_lessons'].append(data['lesson'])
        
        if data.get('quiz_score') is not None:
            user_progress['quiz_attempts'] += 1
            user_progress['best_quiz_score'] = max(user_progress['best_quiz_score'], data['quiz_score'])
        
        if data.get('problem_solved'):
            if data['problem_solved'] not in user_progress['problems_solved']:
                user_progress['problems_solved'].append(data['problem_solved'])
        
        user_progress['last_activity'] = datetime.now().isoformat()
        
        save_user_data(user_data)
        return jsonify({'success': True})

@app.route('/api/leaderboard')
def leaderboard():
    user_data = load_user_data()
    leaderboard_data = []
    
    for user_id, data in user_data.items():
        leaderboard_data.append({
            'user_id': user_id[:8],  # Show only first 8 chars for privacy
            'score': data.get('score', 0),
            'achievements': len(data.get('achievements', [])),
            'problems_solved': len(data.get('problems_solved', [])),
            'best_quiz_score': data.get('best_quiz_score', 0)
        })
    
    leaderboard_data.sort(key=lambda x: x['score'], reverse=True)
    return jsonify(leaderboard_data[:10])  # Top 10

@app.route('/api/execute_code', methods=['POST'])
def execute_code():
    try:
        code = request.json.get('code', '')
        # Simple code execution simulation
        # In production, use a sandboxed environment
        result = {
            'output': 'Code executed successfully!\nOutput: [Simulated execution result]',
            'success': True
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({'output': f'Error: {str(e)}', 'success': False})

if __name__ == '__main__':
    app.run(debug=True, port=5000)