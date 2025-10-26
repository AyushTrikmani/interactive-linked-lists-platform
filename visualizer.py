import tkinter as tk
from tkinter import ttk
import math

class LinkedListVisualizer:
    def __init__(self, parent):
        self.canvas = tk.Canvas(parent, bg='#1e1e1e', height=400)
        self.canvas.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
    def draw_list(self, linked_list, list_type):
        self.canvas.delete("all")
        
        if not linked_list.head:
            self.canvas.create_text(400, 200, text="Empty List", 
                                  fill='white', font=('Arial', 16))
            return
            
        nodes = linked_list.to_list()
        if not nodes:
            return
            
        # Calculate positions
        canvas_width = self.canvas.winfo_width() or 800
        canvas_height = self.canvas.winfo_height() or 400
        
        if list_type == "circular":
            self.draw_circular_list(nodes, canvas_width, canvas_height)
        else:
            self.draw_linear_list(nodes, list_type, canvas_width, canvas_height)
            
    def draw_linear_list(self, nodes, list_type, width, height):
        node_count = len(nodes)
        if node_count == 0:
            return
            
        # Node dimensions
        node_width = 60
        node_height = 40
        spacing = 100
        
        # Calculate starting position
        total_width = node_count * node_width + (node_count - 1) * (spacing - node_width)
        start_x = max(50, (width - total_width) // 2)
        y = height // 2
        
        # Draw nodes and connections
        for i, data in enumerate(nodes):
            x = start_x + i * spacing
            
            # Draw node
            self.canvas.create_rectangle(x, y - node_height//2, 
                                       x + node_width, y + node_height//2,
                                       fill='#4a90e2', outline='white', width=2)
            
            # Draw data
            self.canvas.create_text(x + node_width//2, y, text=str(data),
                                  fill='white', font=('Arial', 12, 'bold'))
            
            # Draw forward arrow
            if i < node_count - 1:
                arrow_start_x = x + node_width
                arrow_end_x = start_x + (i + 1) * spacing
                self.canvas.create_line(arrow_start_x, y, arrow_end_x, y,
                                      fill='#50c878', width=3, arrow=tk.LAST)
                
            # Draw backward arrow for doubly linked list
            if list_type == "doubly" and i > 0:
                arrow_start_x = x
                arrow_end_x = start_x + (i - 1) * spacing + node_width
                self.canvas.create_line(arrow_start_x, y + 15, arrow_end_x, y + 15,
                                      fill='#ff6b6b', width=2, arrow=tk.LAST)
                
        # Add labels
        self.canvas.create_text(20, 30, text=f"{list_type.title()} Linked List",
                              fill='white', font=('Arial', 14, 'bold'), anchor='w')
        
        # Add complexity info
        complexity_text = "Insert/Delete Head: O(1), Tail: O(n), Search: O(n)"
        if list_type == "doubly":
            complexity_text = "Insert/Delete: O(1) with reference, Search: O(n)"
            
        self.canvas.create_text(20, height - 30, text=complexity_text,
                              fill='#cccccc', font=('Arial', 10), anchor='w')
                              
    def draw_circular_list(self, nodes, width, height):
        node_count = len(nodes)
        if node_count == 0:
            return
            
        # Circle parameters
        center_x = width // 2
        center_y = height // 2
        radius = min(width, height) // 3
        node_radius = 25
        
        # Draw nodes in circle
        for i, data in enumerate(nodes):
            angle = 2 * math.pi * i / node_count - math.pi / 2
            x = center_x + radius * math.cos(angle)
            y = center_y + radius * math.sin(angle)
            
            # Draw node
            self.canvas.create_oval(x - node_radius, y - node_radius,
                                  x + node_radius, y + node_radius,
                                  fill='#4a90e2', outline='white', width=2)
            
            # Draw data
            self.canvas.create_text(x, y, text=str(data),
                                  fill='white', font=('Arial', 12, 'bold'))
            
            # Draw arrow to next node
            next_i = (i + 1) % node_count
            next_angle = 2 * math.pi * next_i / node_count - math.pi / 2
            next_x = center_x + radius * math.cos(next_angle)
            next_y = center_y + radius * math.sin(next_angle)
            
            # Calculate arrow positions
            arrow_start_x = x + node_radius * math.cos(angle + math.pi/6)
            arrow_start_y = y + node_radius * math.sin(angle + math.pi/6)
            arrow_end_x = next_x - node_radius * math.cos(next_angle - math.pi/6)
            arrow_end_y = next_y - node_radius * math.sin(next_angle - math.pi/6)
            
            # Draw curved arrow
            mid_x = (arrow_start_x + arrow_end_x) / 2
            mid_y = (arrow_start_y + arrow_end_y) / 2
            
            # Adjust mid point for curve
            curve_factor = 0.3
            mid_x += curve_factor * (center_x - mid_x)
            mid_y += curve_factor * (center_y - mid_y)
            
            self.canvas.create_line(arrow_start_x, arrow_start_y, 
                                  mid_x, mid_y,
                                  arrow_end_x, arrow_end_y,
                                  fill='#50c878', width=2, smooth=True,
                                  arrow=tk.LAST)
                                  
        # Add label
        self.canvas.create_text(20, 30, text="Circular Linked List",
                              fill='white', font=('Arial', 14, 'bold'), anchor='w')
        
        # Add complexity info
        self.canvas.create_text(20, height - 30, 
                              text="Insert/Delete: O(1) with tail reference, Search: O(n)",
                              fill='#cccccc', font=('Arial', 10), anchor='w')