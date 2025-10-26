import tkinter as tk
from tkinter import ttk, messagebox
import random

class QuizSystem:
    def __init__(self, parent, progress_callback):
        self.parent = parent
        self.progress_callback = progress_callback
        self.current_question = 0
        self.score = 0
        self.questions = self.load_questions()
        
        self.setup_ui()
        
    def load_questions(self):
        return [
            {
                "question": "What is the time complexity of inserting at the head of a singly linked list?",
                "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
                "correct": 0,
                "explanation": "Inserting at the head requires only updating the head pointer, which is constant time."
            },
            {
                "question": "Which operation is more efficient in a doubly linked list compared to singly linked list?",
                "options": ["Insert at head", "Search", "Delete with node reference", "Traverse forward"],
                "correct": 2,
                "explanation": "Deleting a node when you have its reference is O(1) in doubly linked list because you can access both neighbors directly."
            },
            {
                "question": "What is the main advantage of a circular linked list?",
                "options": ["Faster search", "Less memory usage", "No null pointers", "Better cache performance"],
                "correct": 2,
                "explanation": "Circular linked lists eliminate null pointers as the last node points back to the first node."
            },
            {
                "question": "In which scenario would you prefer a linked list over an array?",
                "options": ["Random access needed", "Frequent insertions/deletions", "Cache performance critical", "Memory is limited"],
                "correct": 1,
                "explanation": "Linked lists excel at frequent insertions and deletions, especially at arbitrary positions."
            },
            {
                "question": "What is the space complexity of a singly linked list with n elements?",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                "correct": 2,
                "explanation": "Each node requires space for data and a pointer, so total space is proportional to n."
            },
            {
                "question": "Which traversal is NOT possible in a singly linked list?",
                "options": ["Forward traversal", "Backward traversal", "Recursive traversal", "Iterative traversal"],
                "correct": 1,
                "explanation": "Singly linked lists only have forward pointers, making backward traversal impossible without additional data structures."
            },
            {
                "question": "What happens if you lose the reference to the head of a linked list?",
                "options": ["Memory leak", "Segmentation fault", "List becomes inaccessible", "Automatic garbage collection"],
                "correct": 2,
                "explanation": "Without the head reference, you cannot access any nodes in the list, making it effectively lost."
            },
            {
                "question": "In a circular linked list, how do you detect the end of traversal?",
                "options": ["Check for null", "Count nodes", "Compare with starting node", "Use a flag"],
                "correct": 2,
                "explanation": "Since there's no null pointer, you must compare the current node with your starting point to detect completion."
            }
        ]
        
    def setup_ui(self):
        # Quiz header
        header_frame = ttk.Frame(self.parent)
        header_frame.pack(fill=tk.X, padx=20, pady=10)
        
        self.title_label = ttk.Label(header_frame, text="Linked List Quiz", 
                                    font=('Arial', 16, 'bold'))
        self.title_label.pack()
        
        self.progress_label = ttk.Label(header_frame, text="Question 1 of 8")
        self.progress_label.pack()
        
        # Question frame
        self.question_frame = ttk.LabelFrame(self.parent, text="Question", padding=20)
        self.question_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        self.question_label = ttk.Label(self.question_frame, text="", 
                                       wraplength=600, font=('Arial', 12))
        self.question_label.pack(pady=10)
        
        # Options frame
        self.options_frame = ttk.Frame(self.question_frame)
        self.options_frame.pack(fill=tk.X, pady=10)
        
        self.selected_option = tk.IntVar()
        self.option_buttons = []
        
        for i in range(4):
            btn = ttk.Radiobutton(self.options_frame, text="", 
                                 variable=self.selected_option, value=i)
            btn.pack(anchor=tk.W, pady=5)
            self.option_buttons.append(btn)
            
        # Control buttons
        button_frame = ttk.Frame(self.parent)
        button_frame.pack(fill=tk.X, padx=20, pady=10)
        
        ttk.Button(button_frame, text="Submit Answer", 
                  command=self.submit_answer).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Next Question", 
                  command=self.next_question).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Restart Quiz", 
                  command=self.restart_quiz).pack(side=tk.LEFT, padx=5)
        
        # Results frame
        self.results_frame = ttk.LabelFrame(self.parent, text="Results", padding=10)
        self.results_frame.pack(fill=tk.X, padx=20, pady=10)
        
        self.score_label = ttk.Label(self.results_frame, text="Score: 0/0")
        self.score_label.pack()
        
        self.explanation_text = tk.Text(self.results_frame, height=4, wrap=tk.WORD,
                                       bg='#f0f0f0', font=('Arial', 10))
        self.explanation_text.pack(fill=tk.X, pady=5)
        
        # Load first question
        self.load_question()
        
    def load_question(self):
        if self.current_question < len(self.questions):
            q = self.questions[self.current_question]
            
            self.progress_label.config(text=f"Question {self.current_question + 1} of {len(self.questions)}")
            self.question_label.config(text=q["question"])
            
            for i, option in enumerate(q["options"]):
                self.option_buttons[i].config(text=f"{chr(65+i)}. {option}")
                
            self.selected_option.set(-1)
            self.explanation_text.delete(1.0, tk.END)
        else:
            self.show_final_results()
            
    def submit_answer(self):
        if self.selected_option.get() == -1:
            messagebox.showwarning("Warning", "Please select an answer!")
            return
            
        q = self.questions[self.current_question]
        is_correct = self.selected_option.get() == q["correct"]
        
        if is_correct:
            self.score += 1
            self.progress_callback(10, None)  # 10 points per correct answer
            
        self.score_label.config(text=f"Score: {self.score}/{self.current_question + 1}")
        
        # Show explanation
        result_text = "✓ Correct!" if is_correct else "✗ Incorrect"
        explanation = f"{result_text}\n\n{q['explanation']}"
        self.explanation_text.delete(1.0, tk.END)
        self.explanation_text.insert(1.0, explanation)
        
    def next_question(self):
        self.current_question += 1
        self.load_question()
        
    def restart_quiz(self):
        self.current_question = 0
        self.score = 0
        random.shuffle(self.questions)
        self.load_question()
        self.score_label.config(text="Score: 0/0")
        
    def show_final_results(self):
        percentage = (self.score / len(self.questions)) * 100
        
        if percentage >= 80:
            achievement = "Quiz Master"
            self.progress_callback(50, achievement)
        elif percentage >= 60:
            achievement = "Good Student"
            self.progress_callback(25, achievement)
            
        result_message = f"""
Quiz Completed!

Final Score: {self.score}/{len(self.questions)} ({percentage:.1f}%)

Performance:
{'Excellent!' if percentage >= 80 else 'Good job!' if percentage >= 60 else 'Keep studying!'}

{f'Achievement unlocked: {achievement}!' if percentage >= 60 else ''}
        """
        
        messagebox.showinfo("Quiz Results", result_message)