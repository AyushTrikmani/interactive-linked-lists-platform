import tkinter as tk
from tkinter import ttk, messagebox
import subprocess
import tempfile
import os

class PracticeProblems:
    def __init__(self, parent, progress_callback):
        self.parent = parent
        self.progress_callback = progress_callback
        self.current_problem = 0
        self.problems = self.load_problems()
        
        self.setup_ui()
        
    def load_problems(self):
        return [
            {
                "title": "Reverse a Linked List",
                "description": """
Implement a function to reverse a singly linked list.

Example:
Input: 1 -> 2 -> 3 -> 4 -> 5
Output: 5 -> 4 -> 3 -> 2 -> 1

Time Complexity: O(n)
Space Complexity: O(1)
                """,
                "template": """
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    # Your code here
    pass

# Test your solution
def print_list(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result

# Test case
head = ListNode(1)
head.next = ListNode(2)
head.next.next = ListNode(3)
head.next.next.next = ListNode(4)
head.next.next.next.next = ListNode(5)

print("Original:", print_list(head))
reversed_head = reverse_list(head)
print("Reversed:", print_list(reversed_head))
                """,
                "solution": """
def reverse_list(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev
                """
            },
            {
                "title": "Detect Cycle in Linked List",
                "description": """
Determine if a linked list has a cycle using Floyd's Cycle Detection Algorithm.

Example:
Input: 3 -> 2 -> 0 -> -4 -> (back to 2)
Output: True

Time Complexity: O(n)
Space Complexity: O(1)
                """,
                "template": """
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(head):
    # Your code here using Floyd's algorithm
    pass

# Test your solution
head = ListNode(3)
head.next = ListNode(2)
head.next.next = ListNode(0)
head.next.next.next = ListNode(-4)
head.next.next.next.next = head.next  # Create cycle

print("Has cycle:", has_cycle(head))
                """,
                "solution": """
def has_cycle(head):
    if not head or not head.next:
        return False
    
    slow = head
    fast = head.next
    
    while slow != fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
    
    return True
                """
            },
            {
                "title": "Merge Two Sorted Lists",
                "description": """
Merge two sorted linked lists into one sorted list.

Example:
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

Time Complexity: O(n + m)
Space Complexity: O(1)
                """,
                "template": """
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    # Your code here
    pass

# Test your solution
def create_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    for val in values[1:]:
        current.next = ListNode(val)
        current = current.next
    return head

def print_list(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result

list1 = create_list([1, 2, 4])
list2 = create_list([1, 3, 4])
merged = merge_two_lists(list1, list2)
print("Merged:", print_list(merged))
                """,
                "solution": """
def merge_two_lists(list1, list2):
    dummy = ListNode(0)
    current = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    current.next = list1 or list2
    return dummy.next
                """
            },
            {
                "title": "Remove Nth Node From End",
                "description": """
Remove the nth node from the end of a linked list.

Example:
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]

Time Complexity: O(n)
Space Complexity: O(1)
                """,
                "template": """
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def remove_nth_from_end(head, n):
    # Your code here using two pointers
    pass

# Test your solution
def create_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    for val in values[1:]:
        current.next = ListNode(val)
        current = current.next
    return head

def print_list(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result

head = create_list([1, 2, 3, 4, 5])
result = remove_nth_from_end(head, 2)
print("Result:", print_list(result))
                """,
                "solution": """
def remove_nth_from_end(head, n):
    dummy = ListNode(0)
    dummy.next = head
    first = dummy
    second = dummy
    
    # Move first n+1 steps ahead
    for _ in range(n + 1):
        first = first.next
    
    # Move both pointers until first reaches end
    while first:
        first = first.next
        second = second.next
    
    # Remove the nth node
    second.next = second.next.next
    return dummy.next
                """
            },
            {
                "title": "Find Middle of Linked List",
                "description": """
Find the middle node of a linked list. If there are two middle nodes, return the second one.

Example:
Input: [1,2,3,4,5]
Output: 3

Time Complexity: O(n)
Space Complexity: O(1)
                """,
                "template": """
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def find_middle(head):
    # Your code here using slow and fast pointers
    pass

# Test your solution
def create_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    for val in values[1:]:
        current.next = ListNode(val)
        current = current.next
    return head

head = create_list([1, 2, 3, 4, 5])
middle = find_middle(head)
print("Middle value:", middle.val if middle else None)
                """,
                "solution": """
def find_middle(head):
    if not head:
        return None
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
                """
            }
        ]
        
    def setup_ui(self):
        # Problem selection
        selection_frame = ttk.Frame(self.parent)
        selection_frame.pack(fill=tk.X, padx=10, pady=5)
        
        ttk.Label(selection_frame, text="Select Problem:").pack(side=tk.LEFT)
        
        self.problem_var = tk.StringVar()
        problem_names = [f"{i+1}. {p['title']}" for i, p in enumerate(self.problems)]
        self.problem_combo = ttk.Combobox(selection_frame, textvariable=self.problem_var,
                                         values=problem_names, state="readonly")
        self.problem_combo.pack(side=tk.LEFT, padx=10, fill=tk.X, expand=True)
        self.problem_combo.bind('<<ComboboxSelected>>', self.load_problem)
        
        # Problem description
        desc_frame = ttk.LabelFrame(self.parent, text="Problem Description", padding=10)
        desc_frame.pack(fill=tk.X, padx=10, pady=5)
        
        self.desc_text = tk.Text(desc_frame, height=8, wrap=tk.WORD, bg='#f8f8f8',
                                font=('Consolas', 10))
        self.desc_text.pack(fill=tk.X)
        
        # Code editor
        editor_frame = ttk.LabelFrame(self.parent, text="Code Editor", padding=10)
        editor_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        self.code_text = tk.Text(editor_frame, wrap=tk.NONE, bg='#1e1e1e', fg='white',
                                font=('Consolas', 11), insertbackground='white')
        self.code_text.pack(fill=tk.BOTH, expand=True)
        
        # Control buttons
        button_frame = ttk.Frame(self.parent)
        button_frame.pack(fill=tk.X, padx=10, pady=5)
        
        ttk.Button(button_frame, text="Run Code", command=self.run_code).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Show Solution", command=self.show_solution).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Reset", command=self.reset_code).pack(side=tk.LEFT, padx=5)
        
        # Output area
        output_frame = ttk.LabelFrame(self.parent, text="Output", padding=10)
        output_frame.pack(fill=tk.X, padx=10, pady=5)
        
        self.output_text = tk.Text(output_frame, height=6, wrap=tk.WORD, bg='#000000', fg='#00ff00',
                                  font=('Consolas', 10))
        self.output_text.pack(fill=tk.X)
        
        # Load first problem
        self.problem_combo.current(0)
        self.load_problem()
        
    def load_problem(self, event=None):
        index = self.problem_combo.current()
        if index >= 0:
            problem = self.problems[index]
            
            # Load description
            self.desc_text.delete(1.0, tk.END)
            self.desc_text.insert(1.0, problem['description'])
            
            # Load template code
            self.code_text.delete(1.0, tk.END)
            self.code_text.insert(1.0, problem['template'])
            
            # Clear output
            self.output_text.delete(1.0, tk.END)
            
    def run_code(self):
        code = self.code_text.get(1.0, tk.END)
        
        try:
            # Create temporary file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(code)
                temp_file = f.name
            
            # Run the code
            result = subprocess.run(['python', temp_file], 
                                  capture_output=True, text=True, timeout=10)
            
            # Display output
            self.output_text.delete(1.0, tk.END)
            if result.stdout:
                self.output_text.insert(tk.END, "Output:\n" + result.stdout)
            if result.stderr:
                self.output_text.insert(tk.END, "\nErrors:\n" + result.stderr)
                
            # Clean up
            os.unlink(temp_file)
            
            # Award points for running code
            self.progress_callback(5, None)
            
        except subprocess.TimeoutExpired:
            self.output_text.delete(1.0, tk.END)
            self.output_text.insert(tk.END, "Error: Code execution timed out")
        except Exception as e:
            self.output_text.delete(1.0, tk.END)
            self.output_text.insert(tk.END, f"Error: {str(e)}")
            
    def show_solution(self):
        index = self.problem_combo.current()
        if index >= 0:
            problem = self.problems[index]
            
            # Show solution in a popup
            solution_window = tk.Toplevel(self.parent)
            solution_window.title(f"Solution: {problem['title']}")
            solution_window.geometry("600x400")
            solution_window.configure(bg='#2b2b2b')
            
            solution_text = tk.Text(solution_window, wrap=tk.WORD, bg='#1e1e1e', fg='white',
                                   font=('Consolas', 11))
            solution_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
            solution_text.insert(1.0, problem['solution'])
            
            # Award achievement for viewing solution
            self.progress_callback(0, "Solution Seeker")
            
    def reset_code(self):
        self.load_problem()