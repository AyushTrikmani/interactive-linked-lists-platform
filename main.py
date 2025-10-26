import tkinter as tk
from tkinter import ttk, messagebox
import json
from linked_list_types import SinglyLinkedList, DoublyLinkedList, CircularLinkedList
from visualizer import LinkedListVisualizer
from quiz_system import QuizSystem
from practice_problems import PracticeProblems

class LinkedListLearningPlatform:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Interactive Linked Lists Learning Platform")
        self.root.geometry("1200x800")
        self.root.configure(bg='#2b2b2b')
        
        self.current_list = None
        self.list_type = "singly"
        self.user_progress = {"score": 0, "completed_lessons": [], "achievements": []}
        
        self.setup_ui()
        self.load_progress()
        
    def setup_ui(self):
        # Main notebook for tabs
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Tutorial tab
        self.tutorial_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.tutorial_frame, text="📚 Tutorials")
        self.setup_tutorial_tab()
        
        # Playground tab
        self.playground_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.playground_frame, text="🎮 Playground")
        self.setup_playground_tab()
        
        # Quiz tab
        self.quiz_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.quiz_frame, text="🧠 Quiz")
        self.setup_quiz_tab()
        
        # Practice tab
        self.practice_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.practice_frame, text="💻 Practice")
        self.setup_practice_tab()
        
        # Progress tab
        self.progress_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.progress_frame, text="📊 Progress")
        self.setup_progress_tab()
        
    def setup_tutorial_tab(self):
        # Tutorial content
        tutorial_text = tk.Text(self.tutorial_frame, wrap=tk.WORD, bg='#3c3c3c', fg='white', font=('Arial', 11))
        tutorial_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        tutorials = {
            "Singly Linked List": """
SINGLY LINKED LIST

A singly linked list is a linear data structure where each element (node) contains:
• Data: The actual value stored
• Next: Reference to the next node

Key Operations:
1. Insertion: O(1) at head, O(n) at tail
2. Deletion: O(1) at head, O(n) at tail
3. Search: O(n)
4. Traversal: O(n)

Advantages:
• Dynamic size
• Efficient insertion/deletion at beginning
• Memory efficient (no wasted space)

Disadvantages:
• No random access
• Extra memory for pointers
• Not cache friendly
            """,
            "Doubly Linked List": """
DOUBLY LINKED LIST

A doubly linked list has nodes with:
• Data: The actual value
• Next: Reference to next node
• Prev: Reference to previous node

Key Operations:
1. Insertion: O(1) at both ends
2. Deletion: O(1) if node reference available
3. Search: O(n)
4. Bidirectional traversal: O(n)

Advantages:
• Bidirectional traversal
• Efficient deletion with node reference
• Better for certain algorithms

Disadvantages:
• Extra memory for prev pointers
• More complex implementation
            """,
            "Circular Linked List": """
CIRCULAR LINKED LIST

A circular linked list where the last node points back to the first node.

Types:
• Singly Circular: Last node points to first
• Doubly Circular: Bidirectional with circular connections

Key Operations:
1. Insertion: O(1) with tail reference
2. Deletion: O(1) with proper references
3. Traversal: Must track starting point

Advantages:
• Useful for round-robin scheduling
• No null pointers
• Efficient for cyclic operations

Disadvantages:
• Risk of infinite loops
• More complex termination conditions
            """
        }
        
        # Tutorial selection
        tutorial_frame = ttk.Frame(self.tutorial_frame)
        tutorial_frame.pack(fill=tk.X, padx=10, pady=5)
        
        ttk.Label(tutorial_frame, text="Select Tutorial:").pack(side=tk.LEFT)
        tutorial_var = tk.StringVar(value="Singly Linked List")
        tutorial_combo = ttk.Combobox(tutorial_frame, textvariable=tutorial_var, values=list(tutorials.keys()))
        tutorial_combo.pack(side=tk.LEFT, padx=10)
        
        def load_tutorial():
            tutorial_text.delete(1.0, tk.END)
            tutorial_text.insert(1.0, tutorials[tutorial_var.get()])
            
        tutorial_combo.bind('<<ComboboxSelected>>', lambda e: load_tutorial())
        load_tutorial()
        
    def setup_playground_tab(self):
        # Control panel
        control_frame = ttk.Frame(self.playground_frame)
        control_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # List type selection
        ttk.Label(control_frame, text="List Type:").pack(side=tk.LEFT)
        type_var = tk.StringVar(value="singly")
        type_combo = ttk.Combobox(control_frame, textvariable=type_var, 
                                 values=["singly", "doubly", "circular"])
        type_combo.pack(side=tk.LEFT, padx=5)
        
        def change_list_type():
            self.list_type = type_var.get()
            if self.list_type == "singly":
                self.current_list = SinglyLinkedList()
            elif self.list_type == "doubly":
                self.current_list = DoublyLinkedList()
            else:
                self.current_list = CircularLinkedList()
            self.update_visualization()
            
        type_combo.bind('<<ComboboxSelected>>', lambda e: change_list_type())
        
        # Operations
        ttk.Button(control_frame, text="Insert Head", 
                  command=self.insert_head).pack(side=tk.LEFT, padx=5)
        ttk.Button(control_frame, text="Insert Tail", 
                  command=self.insert_tail).pack(side=tk.LEFT, padx=5)
        ttk.Button(control_frame, text="Delete Head", 
                  command=self.delete_head).pack(side=tk.LEFT, padx=5)
        ttk.Button(control_frame, text="Delete Tail", 
                  command=self.delete_tail).pack(side=tk.LEFT, padx=5)
        ttk.Button(control_frame, text="Clear", 
                  command=self.clear_list).pack(side=tk.LEFT, padx=5)
        
        # Visualization area
        self.visualizer = LinkedListVisualizer(self.playground_frame)
        
        # Initialize with singly linked list
        self.current_list = SinglyLinkedList()
        
    def setup_quiz_tab(self):
        self.quiz_system = QuizSystem(self.quiz_frame, self.update_progress)
        
    def setup_practice_tab(self):
        self.practice_problems = PracticeProblems(self.practice_frame, self.update_progress)
        
    def setup_progress_tab(self):
        # Progress display
        progress_text = tk.Text(self.progress_frame, wrap=tk.WORD, bg='#3c3c3c', fg='white')
        progress_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        def update_progress_display():
            progress_text.delete(1.0, tk.END)
            progress_info = f"""
LEARNING PROGRESS

Score: {self.user_progress['score']} points
Completed Lessons: {len(self.user_progress['completed_lessons'])}
Achievements: {len(self.user_progress['achievements'])}

Achievements Unlocked:
{chr(10).join('• ' + achievement for achievement in self.user_progress['achievements'])}

Performance Analysis:
• Time Complexity Understanding: {'✓' if 'complexity_master' in self.user_progress['achievements'] else '○'}
• Implementation Skills: {'✓' if 'implementation_expert' in self.user_progress['achievements'] else '○'}
• Problem Solving: {'✓' if 'problem_solver' in self.user_progress['achievements'] else '○'}
            """
            progress_text.insert(1.0, progress_info)
            
        self.update_progress_display = update_progress_display
        update_progress_display()
        
    def insert_head(self):
        value = self.get_input_value("Enter value to insert at head:")
        if value is not None:
            self.current_list.insert_head(value)
            self.update_visualization()
            
    def insert_tail(self):
        value = self.get_input_value("Enter value to insert at tail:")
        if value is not None:
            self.current_list.insert_tail(value)
            self.update_visualization()
            
    def delete_head(self):
        if self.current_list.delete_head():
            self.update_visualization()
        else:
            messagebox.showwarning("Warning", "List is empty!")
            
    def delete_tail(self):
        if self.current_list.delete_tail():
            self.update_visualization()
        else:
            messagebox.showwarning("Warning", "List is empty!")
            
    def clear_list(self):
        self.current_list.clear()
        self.update_visualization()
        
    def get_input_value(self, prompt):
        dialog = tk.Toplevel(self.root)
        dialog.title("Input")
        dialog.geometry("300x100")
        dialog.configure(bg='#2b2b2b')
        
        ttk.Label(dialog, text=prompt).pack(pady=10)
        entry = ttk.Entry(dialog)
        entry.pack(pady=5)
        entry.focus()
        
        result = [None]
        
        def ok_clicked():
            try:
                result[0] = int(entry.get())
                dialog.destroy()
            except ValueError:
                messagebox.showerror("Error", "Please enter a valid integer")
                
        def cancel_clicked():
            dialog.destroy()
            
        button_frame = ttk.Frame(dialog)
        button_frame.pack(pady=10)
        ttk.Button(button_frame, text="OK", command=ok_clicked).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Cancel", command=cancel_clicked).pack(side=tk.LEFT, padx=5)
        
        dialog.transient(self.root)
        dialog.grab_set()
        self.root.wait_window(dialog)
        
        return result[0]
        
    def update_visualization(self):
        self.visualizer.draw_list(self.current_list, self.list_type)
        
    def update_progress(self, points=0, achievement=None):
        self.user_progress['score'] += points
        if achievement and achievement not in self.user_progress['achievements']:
            self.user_progress['achievements'].append(achievement)
            messagebox.showinfo("Achievement Unlocked!", f"🏆 {achievement}")
        self.save_progress()
        if hasattr(self, 'update_progress_display'):
            self.update_progress_display()
            
    def save_progress(self):
        try:
            with open('progress.json', 'w') as f:
                json.dump(self.user_progress, f)
        except:
            pass
            
    def load_progress(self):
        try:
            with open('progress.json', 'r') as f:
                self.user_progress = json.load(f)
        except:
            pass
            
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = LinkedListLearningPlatform()
    app.run()