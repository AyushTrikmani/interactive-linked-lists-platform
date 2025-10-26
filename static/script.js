// Global variables
let currentList = [];
let listType = 'singly';
let currentQuizQuestion = 0;
let quizScore = 0;
let quizQuestions = [];
let userProgress = {};
let canvas, ctx;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUserProgress();
    setupEventListeners();
    initializeCanvas();
    loadQuizQuestions();
    loadPracticeProblems();
});

function initializeApp() {
    // Set up tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Initialize tutorial content
    loadTutorialContent();
    
    // Load leaderboard
    loadLeaderboard();
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to selected button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Special handling for certain tabs
    if (tabName === 'playground') {
        setTimeout(() => initializeCanvas(), 100);
    } else if (tabName === 'leaderboard') {
        loadLeaderboard();
    } else if (tabName === 'progress') {
        updateProgressDisplay();
    } else if (tabName === 'interview') {
        loadCodingPatterns();
        loadComplexityQuiz();
    } else if (tabName === 'performance') {
        setTimeout(() => initializePerformanceCharts(), 100);
    }
}

function setupEventListeners() {
    // Tutorial selector
    document.getElementById('tutorial-select').addEventListener('change', loadTutorialContent);
    
    // List type selector
    document.getElementById('list-type').addEventListener('change', function() {
        listType = this.value;
        drawList();
    });
    
    // Problem selector
    document.getElementById('problem-select').addEventListener('change', loadProblem);
}

// Linked List Operations
function insertHead() {
    const value = document.getElementById('node-value').value;
    if (!value) {
        alert('Please enter a value');
        return;
    }
    
    currentList.unshift(parseInt(value));
    document.getElementById('node-value').value = '';
    drawList();
    logOperation(`Inserted ${value} at head`);
    updateProgress(5);
}

function insertTail() {
    const value = document.getElementById('node-value').value;
    if (!value) {
        alert('Please enter a value');
        return;
    }
    
    currentList.push(parseInt(value));
    document.getElementById('node-value').value = '';
    drawList();
    logOperation(`Inserted ${value} at tail`);
    updateProgress(5);
}

function deleteHead() {
    if (currentList.length === 0) {
        alert('List is empty');
        return;
    }
    
    const deleted = currentList.shift();
    drawList();
    logOperation(`Deleted ${deleted} from head`);
    updateProgress(5);
}

function deleteTail() {
    if (currentList.length === 0) {
        alert('List is empty');
        return;
    }
    
    const deleted = currentList.pop();
    drawList();
    logOperation(`Deleted ${deleted} from tail`);
    updateProgress(5);
}

function clearList() {
    currentList = [];
    drawList();
    logOperation('Cleared list');
}

function animateTraversal() {
    if (currentList.length === 0) return;
    
    let index = 0;
    const interval = setInterval(() => {
        drawList(index);
        index++;
        if (index >= currentList.length) {
            clearInterval(interval);
            setTimeout(() => drawList(), 500);
        }
    }, 800);
}

// Canvas Drawing Functions
function initializeCanvas() {
    canvas = document.getElementById('list-canvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    drawList();
}

function drawList(highlightIndex = -1) {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentList.length === 0) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Empty List', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    const nodeWidth = 80;
    const nodeHeight = 50;
    const spacing = 120;
    const startX = (canvas.width - (currentList.length * spacing - (spacing - nodeWidth))) / 2;
    const y = canvas.height / 2;
    
    currentList.forEach((value, index) => {
        const x = startX + index * spacing;
        const isHighlighted = index === highlightIndex;
        
        // Draw node
        ctx.fillStyle = isHighlighted ? '#4CAF50' : '#2196F3';
        ctx.fillRect(x, y - nodeHeight/2, nodeWidth, nodeHeight);
        
        // Draw border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y - nodeHeight/2, nodeWidth, nodeHeight);
        
        // Draw value
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + nodeWidth/2, y + 5);
        
        // Draw arrows
        if (index < currentList.length - 1) {
            drawArrow(x + nodeWidth, y, x + spacing, y, '#4CAF50');
        }
        
        // Draw backward arrows for doubly linked list
        if (listType === 'doubly' && index > 0) {
            drawArrow(x, y + 20, x - spacing + nodeWidth, y + 20, '#FF5722');
        }
        
        // Draw circular connection
        if (listType === 'circular' && index === currentList.length - 1) {
            drawCurvedArrow(x + nodeWidth/2, y - nodeHeight/2, startX + nodeWidth/2, y - nodeHeight/2);
        }
    });
    
    // Update complexity info
    updateComplexityInfo();
}

function drawArrow(fromX, fromY, toX, toY, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Arrow head
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - 10 * Math.cos(angle - Math.PI/6), toY - 10 * Math.sin(angle - Math.PI/6));
    ctx.lineTo(toX - 10 * Math.cos(angle + Math.PI/6), toY - 10 * Math.sin(angle + Math.PI/6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawCurvedArrow(fromX, fromY, toX, toY) {
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(canvas.width/2, fromY - 50, toX, toY);
    ctx.stroke();
}

function logOperation(message) {
    const log = document.getElementById('operation-log');
    const timestamp = new Date().toLocaleTimeString();
    log.innerHTML = `<div>[${timestamp}] ${message}</div>` + log.innerHTML;
}

function updateComplexityInfo() {
    const info = document.getElementById('complexity-info');
    let complexity = '';
    
    switch(listType) {
        case 'singly':
            complexity = 'Insert/Delete Head: O(1), Tail: O(n), Search: O(n)';
            break;
        case 'doubly':
            complexity = 'Insert/Delete: O(1) with reference, Search: O(n)';
            break;
        case 'circular':
            complexity = 'Insert/Delete: O(1) with tail reference, Search: O(n)';
            break;
    }
    
    info.textContent = `Time Complexity: ${complexity}`;
}

// Quiz System
function loadQuizQuestions() {
    quizQuestions = [
        {
            question: "What is the time complexity of inserting at the head of a singly linked list?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correct: 0,
            explanation: "Inserting at the head requires only updating the head pointer, which is constant time."
        },
        {
            question: "Which operation is more efficient in a doubly linked list compared to singly linked list?",
            options: ["Insert at head", "Search", "Delete with node reference", "Traverse forward"],
            correct: 2,
            explanation: "Deleting a node when you have its reference is O(1) in doubly linked list because you can access both neighbors directly."
        },
        {
            question: "What is the main advantage of a circular linked list?",
            options: ["Faster search", "Less memory usage", "No null pointers", "Better cache performance"],
            correct: 2,
            explanation: "Circular linked lists eliminate null pointers as the last node points back to the first node."
        },
        {
            question: "In Floyd's cycle detection algorithm, what is the relationship between slow and fast pointers?",
            options: ["Fast moves 2 steps, slow moves 1", "Fast moves 3 steps, slow moves 1", "Both move 1 step", "Fast moves n steps, slow moves 1"],
            correct: 0,
            explanation: "Floyd's algorithm uses two pointers: slow moves 1 step and fast moves 2 steps per iteration."
        },
        {
            question: "What is the space complexity of reversing a linked list iteratively?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correct: 2,
            explanation: "Iterative reversal only uses a constant amount of extra space for pointer variables."
        },
        {
            question: "Which data structure combination is used in LRU Cache implementation?",
            options: ["Array + Stack", "Doubly Linked List + HashMap", "Binary Tree + Queue", "Singly Linked List + Array"],
            correct: 1,
            explanation: "LRU Cache uses doubly linked list for O(1) insertion/deletion and HashMap for O(1) lookup."
        },
        {
            question: "What happens when you try to access a node after the tail in a singly linked list?",
            options: ["Returns the head", "Throws an exception", "Returns null/undefined", "Creates a new node"],
            correct: 2,
            explanation: "The next pointer of the tail node is null, so accessing beyond tail returns null."
        },
        {
            question: "In a skip list, what determines the height of a node?",
            options: ["Node value", "Position in list", "Random probability", "User input"],
            correct: 2,
            explanation: "Skip list node heights are determined randomly using probability (typically 1/2 for each level)."
        },
        {
            question: "What is the worst-case time complexity for searching in a linked list?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correct: 2,
            explanation: "In worst case, the element might be at the end, requiring traversal of all n nodes."
        },
        {
            question: "Which operation is NOT possible in O(1) time for any type of linked list?",
            options: ["Insert at head", "Delete at head", "Access middle element", "Insert after given node"],
            correct: 2,
            explanation: "Accessing the middle element requires traversal from head, which takes O(n) time."
        },
        {
            question: "What is the key insight behind the 'two pointers' technique for finding the middle of a linked list?",
            options: ["One pointer moves backward", "Pointers move at different speeds", "Pointers start from different positions", "One pointer skips nodes"],
            correct: 1,
            explanation: "Fast pointer moves 2 steps while slow moves 1 step. When fast reaches end, slow is at middle."
        },
        {
            question: "In merge sort for linked lists, what is the main advantage over array-based merge sort?",
            options: ["Better time complexity", "No extra space needed", "Easier implementation", "Better cache performance"],
            correct: 1,
            explanation: "Linked list merge sort can be done in-place without extra space, unlike array merge sort."
        }
    ];
    
    shuffleArray(quizQuestions);
    loadQuestion();
}

function loadQuestion() {
    if (currentQuizQuestion >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = quizQuestions[currentQuizQuestion];
    document.getElementById('question-counter').textContent = `Question ${currentQuizQuestion + 1} of ${quizQuestions.length}`;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('question-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('submit-answer').style.display = 'inline-block';
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('quiz-feedback').innerHTML = '';
}

function selectOption(index) {
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.option-btn')[index].classList.add('selected');
    window.selectedOption = index;
}

function submitAnswer() {
    if (window.selectedOption === undefined) {
        alert('Please select an answer');
        return;
    }
    
    const question = quizQuestions[currentQuizQuestion];
    const isCorrect = window.selectedOption === question.correct;
    
    if (isCorrect) {
        quizScore++;
        updateProgress(10);
    }
    
    const feedback = document.getElementById('quiz-feedback');
    feedback.innerHTML = `
        <div style="padding: 1rem; background: ${isCorrect ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}; border-radius: 8px; margin-top: 1rem;">
            <h4>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h4>
            <p>${question.explanation}</p>
        </div>
    `;
    
    document.getElementById('submit-answer').style.display = 'none';
    document.getElementById('next-question').style.display = 'inline-block';
    
    // Disable option buttons
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
}

function nextQuestion() {
    currentQuizQuestion++;
    window.selectedOption = undefined;
    loadQuestion();
}

function restartQuiz() {
    currentQuizQuestion = 0;
    quizScore = 0;
    window.selectedOption = undefined;
    shuffleArray(quizQuestions);
    loadQuestion();
}

function showQuizResults() {
    const percentage = (quizScore / quizQuestions.length) * 100;
    let achievement = null;
    
    if (percentage >= 90) {
        achievement = 'Quiz Master';
    } else if (percentage >= 80) {
        achievement = 'Quiz Expert';
    } else if (percentage >= 70) {
        achievement = 'Good Student';
    }
    
    if (achievement) {
        updateProgress(50, achievement);
    }
    
    updateProgress(0, null, { quiz_score: percentage });
    
    alert(`Quiz Completed!\n\nScore: ${quizScore}/${quizQuestions.length} (${percentage.toFixed(1)}%)\n${achievement ? `Achievement: ${achievement}!` : ''}`);
}

// Practice Problems
function loadPracticeProblems() {
    const problems = [
        {
            title: "Reverse Linked List",
            difficulty: "easy",
            description: "Given the head of a singly linked list, reverse the list and return the reversed list.",
            template: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    # Your code here
    pass`,
            testCases: [
                "Input: [1,2,3,4,5] → Output: [5,4,3,2,1]",
                "Input: [1,2] → Output: [2,1]",
                "Input: [] → Output: []"
            ]
        },
        {
            title: "Linked List Cycle",
            difficulty: "easy",
            description: "Given head, determine if the linked list has a cycle using Floyd's algorithm.",
            template: `def hasCycle(head):
    # Your code here using two pointers
    pass`,
            testCases: [
                "Input: [3,2,0,-4] with cycle → Output: true",
                "Input: [1,2] with cycle → Output: true",
                "Input: [1] no cycle → Output: false"
            ]
        },
        {
            title: "Merge Two Sorted Lists",
            difficulty: "easy",
            description: "Merge two sorted linked lists and return it as a sorted list.",
            template: `def mergeTwoLists(list1, list2):
    # Your code here
    pass`,
            testCases: [
                "Input: [1,2,4], [1,3,4] → Output: [1,1,2,3,4,4]",
                "Input: [], [] → Output: []",
                "Input: [], [0] → Output: [0]"
            ]
        },
        {
            title: "Remove Nth Node From End",
            difficulty: "medium",
            description: "Remove the nth node from the end of the list and return its head.",
            template: `def removeNthFromEnd(head, n):
    # Your code here using two pointers
    pass`,
            testCases: [
                "Input: [1,2,3,4,5], n=2 → Output: [1,2,3,5]",
                "Input: [1], n=1 → Output: []",
                "Input: [1,2], n=1 → Output: [1]"
            ]
        },
        {
            title: "Middle of Linked List",
            difficulty: "easy",
            description: "Find the middle node of the linked list. If two middle nodes, return the second.",
            template: `def middleNode(head):
    # Your code here using slow and fast pointers
    pass`,
            testCases: [
                "Input: [1,2,3,4,5] → Output: [3,4,5]",
                "Input: [1,2,3,4,5,6] → Output: [4,5,6]"
            ]
        },
        {
            title: "Palindrome Linked List",
            difficulty: "easy",
            description: "Determine if a linked list is a palindrome.",
            template: `def isPalindrome(head):
    # Your code here
    pass`,
            testCases: [
                "Input: [1,2,2,1] → Output: true",
                "Input: [1,2] → Output: false"
            ]
        },
        {
            title: "Intersection of Two Linked Lists",
            difficulty: "easy",
            description: "Find the node at which the intersection of two singly linked lists begins.",
            template: `def getIntersectionNode(headA, headB):
    # Your code here
    pass`,
            testCases: [
                "Input: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5]",
                "Output: Reference of the node with value = 8"
            ]
        }
    ];
    
    window.practiceProblems = problems;
    loadProblem();
}

function loadProblem() {
    const index = document.getElementById('problem-select').value;
    const problem = window.practiceProblems[index];
    
    document.getElementById('problem-title').textContent = problem.title;
    document.getElementById('problem-desc').textContent = problem.description;
    document.getElementById('code-editor').value = problem.template;
    
    const badge = document.getElementById('difficulty-badge');
    badge.textContent = problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1);
    badge.className = `difficulty-badge ${problem.difficulty}`;
    
    const testCases = document.getElementById('test-cases');
    testCases.innerHTML = '<h4>Test Cases:</h4>' + 
        problem.testCases.map(test => `<div class="test-case">${test}</div>`).join('');
}

function runCode() {
    const code = document.getElementById('code-editor').value;
    
    // Simulate code execution
    fetch('/api/execute_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('code-output').textContent = data.output;
        if (data.success) {
            updateProgress(10);
        }
    });
}

function submitSolution() {
    const problemIndex = document.getElementById('problem-select').value;
    updateProgress(25, null, { problem_solved: window.practiceProblems[problemIndex].title });
    alert('Solution submitted successfully!');
}

function showHint() {
    alert('Hint: Consider using the two-pointer technique or think about the problem step by step.');
}

function showSolution() {
    updateProgress(0, 'Solution Seeker');
    alert('Solution will be shown in a separate window. Keep practicing!');
}

// Tutorial System
function loadTutorialContent() {
    const type = document.getElementById('tutorial-select').value;
    const tutorials = {
        singly: {
            title: "Singly Linked List",
            content: `
                <h3>🔗 Singly Linked List - Complete Guide</h3>
                
                <div class="tutorial-section">
                    <h4>📋 What is a Singly Linked List?</h4>
                    <p>A singly linked list is a fundamental linear data structure where elements (called nodes) are stored in sequence. Unlike arrays, linked list elements are not stored in contiguous memory locations. Instead, each node contains two parts:</p>
                    <ul>
                        <li><strong>Data Field:</strong> Stores the actual value (integer, string, object, etc.)</li>
                        <li><strong>Next Pointer:</strong> Contains the memory address of the next node in the sequence</li>
                    </ul>
                    
                    <div class="code-example">
                        <h5>Node Structure:</h5>
                        <pre><code>class Node:
    def __init__(self, data):
        self.data = data      # Store the value
        self.next = None      # Pointer to next node</code></pre>
                    </div>
                </div>
                
                <div class="tutorial-section">
                    <h4>⚡ Key Operations & Time Complexity</h4>
                    
                    <h5>1. Insertion Operations:</h5>
                    <ul>
                        <li><strong>Insert at Head:</strong> O(1) - Simply update head pointer</li>
                        <li><strong>Insert at Tail:</strong> O(n) - Must traverse to find last node</li>
                        <li><strong>Insert at Position:</strong> O(n) - Traverse to desired position</li>
                    </ul>
                    
                    <div class="code-example">
                        <h5>Insert at Head Example:</h5>
                        <pre><code>def insert_head(head, data):
    new_node = Node(data)
    new_node.next = head    # Point to current head
    return new_node         # New node becomes head</code></pre>
                    </div>
                    
                    <h5>2. Deletion Operations:</h5>
                    <ul>
                        <li><strong>Delete Head:</strong> O(1) - Update head to next node</li>
                        <li><strong>Delete Tail:</strong> O(n) - Find second-to-last node</li>
                        <li><strong>Delete by Value:</strong> O(n) - Search then delete</li>
                    </ul>
                    
                    <h5>3. Search & Access:</h5>
                    <ul>
                        <li><strong>Search by Value:</strong> O(n) - Linear search required</li>
                        <li><strong>Access by Index:</strong> O(n) - No random access</li>
                        <li><strong>Traversal:</strong> O(n) - Visit each node once</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>✅ Advantages</h4>
                    <ul>
                        <li><strong>Dynamic Size:</strong> Can grow/shrink during runtime</li>
                        <li><strong>Memory Efficient:</strong> Only allocates memory when needed</li>
                        <li><strong>Fast Insertion/Deletion:</strong> O(1) at head with pointer</li>
                        <li><strong>No Memory Waste:</strong> Unlike arrays, no unused allocated space</li>
                        <li><strong>Implementation Flexibility:</strong> Easy to implement stacks, queues</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>❌ Disadvantages</h4>
                    <ul>
                        <li><strong>No Random Access:</strong> Cannot directly access element at index i</li>
                        <li><strong>Extra Memory Overhead:</strong> Each node needs space for pointer</li>
                        <li><strong>Poor Cache Performance:</strong> Nodes scattered in memory</li>
                        <li><strong>Not Suitable for Binary Search:</strong> No O(log n) search possible</li>
                        <li><strong>Reverse Traversal Impossible:</strong> Can only move forward</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>🎯 Real-World Applications</h4>
                    <ul>
                        <li><strong>Music Playlist:</strong> Next song functionality</li>
                        <li><strong>Browser History:</strong> Forward navigation</li>
                        <li><strong>Undo Functionality:</strong> In text editors</li>
                        <li><strong>Memory Management:</strong> Free memory blocks</li>
                        <li><strong>Polynomial Representation:</strong> Mathematical computations</li>
                        <li><strong>Implementation of Stacks/Queues:</strong> Using linked lists</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>🆚 Array vs Singly Linked List</h4>
                    <table class="comparison-table">
                        <tr><th>Operation</th><th>Array</th><th>Singly Linked List</th></tr>
                        <tr><td>Access by Index</td><td>O(1)</td><td>O(n)</td></tr>
                        <tr><td>Insert at Beginning</td><td>O(n)</td><td>O(1)</td></tr>
                        <tr><td>Insert at End</td><td>O(1)*</td><td>O(n)</td></tr>
                        <tr><td>Delete at Beginning</td><td>O(n)</td><td>O(1)</td></tr>
                        <tr><td>Search</td><td>O(n)</td><td>O(n)</td></tr>
                        <tr><td>Memory Usage</td><td>Contiguous</td><td>Scattered</td></tr>
                        <tr><td>Cache Performance</td><td>Better</td><td>Worse</td></tr>
                    </table>
                    <small>*Assuming dynamic array with available space</small>
                </div>
                
                <div class="tutorial-section">
                    <h4>💡 Implementation Tips</h4>
                    <ul>
                        <li><strong>Always check for null pointers</strong> before dereferencing</li>
                        <li><strong>Keep track of head pointer</strong> - losing it means losing the entire list</li>
                        <li><strong>Use dummy nodes</strong> to simplify edge cases in complex operations</li>
                        <li><strong>Consider tail pointer</strong> for O(1) insertion at end</li>
                        <li><strong>Handle empty list cases</strong> separately in your functions</li>
                    </ul>
                </div>
            `
        },
        doubly: {
            title: "Doubly Linked List",
            content: `
                <h3>⇄ Doubly Linked List - Advanced Guide</h3>
                
                <div class="tutorial-section">
                    <h4>📋 What is a Doubly Linked List?</h4>
                    <p>A doubly linked list is an enhanced version of a linked list where each node contains <strong>three components</strong> instead of two. This bidirectional structure allows traversal in both forward and backward directions.</p>
                    
                    <h5>Node Structure:</h5>
                    <ul>
                        <li><strong>Data Field:</strong> Stores the actual value</li>
                        <li><strong>Next Pointer:</strong> Points to the next node in forward direction</li>
                        <li><strong>Previous Pointer:</strong> Points to the previous node in backward direction</li>
                    </ul>
                    
                    <div class="code-example">
                        <h5>Node Implementation:</h5>
                        <pre><code>class DoublyNode:
    def __init__(self, data):
        self.data = data      # Store the value
        self.next = None      # Pointer to next node
        self.prev = None      # Pointer to previous node</code></pre>
                    </div>
                </div>
                
                <div class="tutorial-section">
                    <h4>⚡ Key Operations & Complexity Analysis</h4>
                    
                    <h5>1. Insertion Operations:</h5>
                    <ul>
                        <li><strong>Insert at Head:</strong> O(1) - Update head and first node's prev</li>
                        <li><strong>Insert at Tail:</strong> O(1) - With tail pointer, direct insertion</li>
                        <li><strong>Insert After Node:</strong> O(1) - When you have node reference</li>
                        <li><strong>Insert Before Node:</strong> O(1) - Unique advantage over singly linked</li>
                    </ul>
                    
                    <div class="code-example">
                        <h5>Insert at Head Example:</h5>
                        <pre><code>def insert_head(head, tail, data):
    new_node = DoublyNode(data)
    if head is None:
        return new_node, new_node  # Both head and tail
    
    new_node.next = head
    head.prev = new_node
    return new_node, tail  # New head, same tail</code></pre>
                    </div>
                    
                    <h5>2. Deletion Operations:</h5>
                    <ul>
                        <li><strong>Delete Head:</strong> O(1) - Update head and second node's prev</li>
                        <li><strong>Delete Tail:</strong> O(1) - Direct access with tail pointer</li>
                        <li><strong>Delete Given Node:</strong> O(1) - Major advantage! No traversal needed</li>
                        <li><strong>Delete by Value:</strong> O(n) - Still need to search first</li>
                    </ul>
                    
                    <div class="code-example">
                        <h5>Delete Node Example (O(1)):</h5>
                        <pre><code>def delete_node(node):
    if node.prev:
        node.prev.next = node.next
    if node.next:
        node.next.prev = node.prev
    # No need to traverse - direct deletion!</code></pre>
                    </div>
                    
                    <h5>3. Traversal Operations:</h5>
                    <ul>
                        <li><strong>Forward Traversal:</strong> O(n) - Same as singly linked</li>
                        <li><strong>Backward Traversal:</strong> O(n) - Unique capability</li>
                        <li><strong>Search from Both Ends:</strong> O(n/2) average - Can start from closer end</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>✅ Advantages Over Singly Linked List</h4>
                    <ul>
                        <li><strong>Bidirectional Traversal:</strong> Can move forward and backward</li>
                        <li><strong>O(1) Deletion:</strong> Delete any node in constant time with reference</li>
                        <li><strong>Better for Algorithms:</strong> Many algorithms benefit from backward links</li>
                        <li><strong>Easier Implementation:</strong> Some operations are simpler to code</li>
                        <li><strong>Flexible Navigation:</strong> Can traverse from either end</li>
                        <li><strong>Undo Operations:</strong> Natural support for undo/redo functionality</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>❌ Disadvantages</h4>
                    <ul>
                        <li><strong>Extra Memory Overhead:</strong> Additional pointer per node (~33% more memory)</li>
                        <li><strong>Complex Implementation:</strong> More pointers to manage</li>
                        <li><strong>Higher Maintenance:</strong> More pointers can break</li>
                        <li><strong>Slower Insertion/Deletion:</strong> More pointer updates required</li>
                        <li><strong>Cache Performance:</strong> Larger nodes, worse cache locality</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>🎯 Real-World Applications</h4>
                    <ul>
                        <li><strong>Browser Navigation:</strong> Back and forward buttons</li>
                        <li><strong>Music Players:</strong> Previous/next song with history</li>
                        <li><strong>Text Editors:</strong> Cursor movement and undo/redo</li>
                        <li><strong>LRU Cache:</strong> Efficient least recently used implementation</li>
                        <li><strong>Game Development:</strong> Player movement history</li>
                        <li><strong>Database Systems:</strong> Buffer management</li>
                        <li><strong>Operating Systems:</strong> Process scheduling queues</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>🔄 LRU Cache Implementation</h4>
                    <p>One of the most famous applications of doubly linked lists:</p>
                    <div class="code-example">
                        <pre><code>class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}  # HashMap for O(1) access
        # Dummy head and tail for easier operations
        self.head = DoublyNode(0)
        self.tail = DoublyNode(0)
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def get(self, key):
        if key in self.cache:
            node = self.cache[key]
            self.move_to_head(node)  # Mark as recently used
            return node.data
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            node = self.cache[key]
            node.data = value
            self.move_to_head(node)
        else:
            if len(self.cache) >= self.capacity:
                self.remove_tail()  # Remove LRU
            new_node = DoublyNode(value)
            self.cache[key] = new_node
            self.add_to_head(new_node)</code></pre>
                    </div>
                </div>
                
                <div class="tutorial-section">
                    <h4>🆚 Comparison: Singly vs Doubly Linked List</h4>
                    <table class="comparison-table">
                        <tr><th>Aspect</th><th>Singly Linked</th><th>Doubly Linked</th></tr>
                        <tr><td>Memory per Node</td><td>Data + 1 Pointer</td><td>Data + 2 Pointers</td></tr>
                        <tr><td>Backward Traversal</td><td>Impossible</td><td>O(n)</td></tr>
                        <tr><td>Delete with Reference</td><td>O(n) - need previous</td><td>O(1)</td></tr>
                        <tr><td>Insert Before Node</td><td>O(n) - need previous</td><td>O(1)</td></tr>
                        <tr><td>Implementation Complexity</td><td>Simple</td><td>Complex</td></tr>
                        <tr><td>Use Case</td><td>Simple lists, stacks</td><td>Complex navigation, caches</td></tr>
                    </table>
                </div>
                
                <div class="tutorial-section">
                    <h4>💡 Implementation Best Practices</h4>
                    <ul>
                        <li><strong>Use Dummy Nodes:</strong> Simplify edge cases with sentinel head/tail</li>
                        <li><strong>Maintain Invariants:</strong> Always keep prev/next pointers consistent</li>
                        <li><strong>Check Both Directions:</strong> Validate both forward and backward links</li>
                        <li><strong>Handle Edge Cases:</strong> Empty list, single node, boundary conditions</li>
                        <li><strong>Consider Circular:</strong> Sometimes circular doubly linked lists are better</li>
                        <li><strong>Memory Management:</strong> Properly deallocate nodes to prevent leaks</li>
                    </ul>
                </div>
            `
        },
        circular: {
            title: "Circular Linked List",
            content: `
                <h3>🔄 Circular Linked List - Complete Guide</h3>
                
                <div class="tutorial-section">
                    <h4>📋 What is a Circular Linked List?</h4>
                    <p>A circular linked list is a variation of linked list where the <strong>last node points back to the first node</strong>, forming a circle. This eliminates the concept of NULL pointers at the end, creating a continuous loop structure.</p>
                    
                    <h5>Key Characteristic:</h5>
                    <p><strong>No NULL pointers!</strong> Every node points to another node, creating an endless cycle.</p>
                    
                    <div class="code-example">
                        <h5>Basic Structure:</h5>
                        <pre><code>class CircularNode:
    def __init__(self, data):
        self.data = data
        self.next = None  # Will point to head when it's the last node

# Creating a circular list: A -> B -> C -> A
node_a = CircularNode('A')
node_b = CircularNode('B')
node_c = CircularNode('C')

node_a.next = node_b
node_b.next = node_c
node_c.next = node_a  # Circular connection!</code></pre>
                    </div>
                </div>
                
                <div class="tutorial-section">
                    <h4>🔄 Types of Circular Linked Lists</h4>
                    
                    <h5>1. Singly Circular Linked List:</h5>
                    <ul>
                        <li>Each node has one pointer (next)</li>
                        <li>Last node points to first node</li>
                        <li>Traversal only in forward direction</li>
                        <li>Most common type</li>
                    </ul>
                    
                    <h5>2. Doubly Circular Linked List:</h5>
                    <ul>
                        <li>Each node has two pointers (next and prev)</li>
                        <li>Last node's next points to first node</li>
                        <li>First node's prev points to last node</li>
                        <li>Bidirectional traversal possible</li>
                    </ul>
                    
                    <div class="code-example">
                        <h5>Doubly Circular Structure:</h5>
                        <pre><code>class DoublyCircularNode:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

# A <-> B <-> C <-> A (both directions)</code></pre>
                    </div>
                </div>
                
                <div class="tutorial-section">
                    <h4>⚡ Key Operations & Complexity</h4>
                    
                    <h5>1. Insertion Operations:</h5>
                    <ul>
                        <li><strong>Insert at Beginning:</strong> O(1) with head pointer</li>
                        <li><strong>Insert at End:</strong> O(1) with tail pointer, O(n) without</li>
                        <li><strong>Insert After Node:</strong> O(1) with node reference</li>
                    </ul>
                    
                    <div class="code-example">
                        <h5>Insert at Beginning:</h5>
                        <pre><code>def insert_at_beginning(head, tail, data):
    new_node = CircularNode(data)
    
    if head is None:  # Empty list
        new_node.next = new_node  # Points to itself
        return new_node, new_node
    
    new_node.next = head
    tail.next = new_node  # Update tail's next
    return new_node, tail  # New head, same tail</code></pre>
                    </div>
                    
                    <h5>2. Deletion Operations:</h5>
                    <ul>
                        <li><strong>Delete Head:</strong> O(1) with tail pointer</li>
                        <li><strong>Delete Tail:</strong> O(n) - need to find second-to-last</li>
                        <li><strong>Delete by Value:</strong> O(n) - search then delete</li>
                    </ul>
                    
                    <h5>3. Traversal Operations:</h5>
                    <ul>
                        <li><strong>Complete Traversal:</strong> O(n) - must track starting point</li>
                        <li><strong>Search:</strong> O(n) - linear search with cycle detection</li>
                        <li><strong>Count Nodes:</strong> O(n) - traverse once completely</li>
                    </ul>
                    
                    <div class="code-example">
                        <h5>Safe Traversal (Avoiding Infinite Loop):</h5>
                        <pre><code>def traverse_circular_list(head):
    if head is None:
        return []
    
    result = []
    current = head
    
    # Visit first node
    result.append(current.data)
    current = current.next
    
    # Continue until we reach head again
    while current != head:
        result.append(current.data)
        current = current.next
    
    return result</code></pre>
                    </div>
                </div>
                
                <div class="tutorial-section">
                    <h4>✅ Advantages</h4>
                    <ul>
                        <li><strong>No NULL Pointers:</strong> Eliminates null pointer exceptions</li>
                        <li><strong>Continuous Traversal:</strong> Can traverse indefinitely</li>
                        <li><strong>Round-Robin Implementation:</strong> Perfect for scheduling algorithms</li>
                        <li><strong>Memory Efficiency:</strong> No wasted NULL references</li>
                        <li><strong>Cyclic Operations:</strong> Natural fit for cyclic processes</li>
                        <li><strong>Queue Implementation:</strong> Efficient circular queue</li>
                        <li><strong>Game Development:</strong> Turn-based games, circular menus</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>❌ Disadvantages</h4>
                    <ul>
                        <li><strong>Infinite Loop Risk:</strong> Easy to create accidental infinite loops</li>
                        <li><strong>Complex Termination:</strong> Must carefully track starting point</li>
                        <li><strong>Debugging Difficulty:</strong> Harder to debug circular references</li>
                        <li><strong>Memory Leaks:</strong> Circular references can prevent garbage collection</li>
                        <li><strong>Implementation Complexity:</strong> More complex than linear lists</li>
                        <li><strong>Edge Case Handling:</strong> More edge cases to consider</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>🎯 Real-World Applications</h4>
                    
                    <h5>1. Operating Systems:</h5>
                    <ul>
                        <li><strong>Round-Robin CPU Scheduling:</strong> Fair time allocation</li>
                        <li><strong>Process Queues:</strong> Circular process management</li>
                        <li><strong>Buffer Management:</strong> Circular buffers for I/O</li>
                    </ul>
                    
                    <h5>2. Gaming:</h5>
                    <ul>
                        <li><strong>Turn-Based Games:</strong> Player turn rotation</li>
                        <li><strong>Circular Menus:</strong> Game interface navigation</li>
                        <li><strong>Playlist Management:</strong> Continuous music/video loops</li>
                    </ul>
                    
                    <h5>3. Networking:</h5>
                    <ul>
                        <li><strong>Token Ring Networks:</strong> Data packet circulation</li>
                        <li><strong>Load Balancing:</strong> Server rotation</li>
                        <li><strong>Routing Algorithms:</strong> Circular routing tables</li>
                    </ul>
                    
                    <h5>4. Data Processing:</h5>
                    <ul>
                        <li><strong>Circular Buffers:</strong> Audio/video streaming</li>
                        <li><strong>Josephus Problem:</strong> Mathematical elimination games</li>
                        <li><strong>Carousel Data Structures:</strong> Rotating data displays</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>🔄 Josephus Problem - Classic Application</h4>
                    <p>A famous problem solved elegantly with circular linked lists:</p>
                    <div class="code-example">
                        <pre><code>def josephus_problem(n, k):
    # Create circular list of n people
    head = CircularNode(1)
    current = head
    
    for i in range(2, n + 1):
        current.next = CircularNode(i)
        current = current.next
    current.next = head  # Make it circular
    
    # Eliminate every k-th person
    current = head
    while current.next != current:  # Until one person remains
        # Move k-1 steps
        for _ in range(k - 2):
            current = current.next
        
        # Remove the k-th person
        current.next = current.next.next
        current = current.next
    
    return current.data  # Survivor</code></pre>
                    </div>
                </div>
                
                <div class="tutorial-section">
                    <h4>🆚 Comparison with Linear Lists</h4>
                    <table class="comparison-table">
                        <tr><th>Aspect</th><th>Linear List</th><th>Circular List</th></tr>
                        <tr><td>End Detection</td><td>NULL pointer</td><td>Back to start node</td></tr>
                        <tr><td>Traversal</td><td>Start to NULL</td><td>Must track starting point</td></tr>
                        <tr><td>Infinite Loop Risk</td><td>Low</td><td>High</td></tr>
                        <tr><td>Memory Usage</td><td>NULL references</td><td>All pointers used</td></tr>
                        <tr><td>Implementation</td><td>Simpler</td><td>More complex</td></tr>
                        <tr><td>Use Cases</td><td>General purpose</td><td>Cyclic operations</td></tr>
                        <tr><td>Queue Implementation</td><td>Need head/tail</td><td>Single pointer sufficient</td></tr>
                    </table>
                </div>
                
                <div class="tutorial-section">
                    <h4>💡 Implementation Best Practices</h4>
                    <ul>
                        <li><strong>Always Track Starting Point:</strong> Prevent infinite loops in traversal</li>
                        <li><strong>Use Tail Pointer:</strong> For O(1) insertion at end</li>
                        <li><strong>Handle Empty List:</strong> Special case when list is empty</li>
                        <li><strong>Single Node Case:</strong> Node points to itself</li>
                        <li><strong>Careful Deletion:</strong> Update circular connections properly</li>
                        <li><strong>Debug with Counters:</strong> Use counters to detect infinite loops</li>
                        <li><strong>Consider Doubly Circular:</strong> For bidirectional operations</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>⚠️ Common Pitfalls</h4>
                    <ul>
                        <li><strong>Infinite Loops:</strong> Forgetting to check for starting point</li>
                        <li><strong>Memory Leaks:</strong> Circular references preventing cleanup</li>
                        <li><strong>Wrong Termination:</strong> Using NULL check instead of start node</li>
                        <li><strong>Broken Circles:</strong> Forgetting to maintain circular property</li>
                        <li><strong>Edge Cases:</strong> Not handling single node or empty list</li>
                    </ul>
                </div>
            `
        },
        advanced: {
            title: "Advanced Operations",
            content: `
                <h3>🎆 Advanced Linked List Operations & Algorithms</h3>
                
                <div class="tutorial-section">
                    <h4>🔍 Floyd's Cycle Detection Algorithm (Tortoise & Hare)</h4>
                    <p>One of the most elegant algorithms for detecting cycles in linked lists using <strong>two pointers with different speeds</strong>.</p>
                    
                    <h5>How It Works:</h5>
                    <ol>
                        <li><strong>Initialize:</strong> Two pointers at head (slow and fast)</li>
                        <li><strong>Move:</strong> Slow moves 1 step, fast moves 2 steps</li>
                        <li><strong>Detect:</strong> If there's a cycle, they will eventually meet</li>
                        <li><strong>Terminate:</strong> If fast reaches NULL, no cycle exists</li>
                    </ol>
                    
                    <div class="code-example">
                        <h5>Implementation:</h5>
                        <pre><code>def has_cycle(head):
    if not head or not head.next:
        return False
    
    slow = head        # Tortoise: moves 1 step
    fast = head.next   # Hare: moves 2 steps
    
    while slow != fast:
        if not fast or not fast.next:
            return False  # Reached end, no cycle
        slow = slow.next
        fast = fast.next.next
    
    return True  # Pointers met, cycle detected

# Finding cycle start point
def find_cycle_start(head):
    # First, detect if cycle exists
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle
    
    # Find the start of cycle
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow  # Start of cycle</code></pre>
                    </div>
                    
                    <p><strong>Time Complexity:</strong> O(n) | <strong>Space Complexity:</strong> O(1)</p>
                    <p><strong>Why It Works:</strong> In a cycle, the fast pointer will eventually "lap" the slow pointer.</p>
                </div>
                
                <div class="tutorial-section">
                    <h4>🎯 Finding Middle Element (Two Pointer Technique)</h4>
                    <p>Find the middle node efficiently without knowing the list length.</p>
                    
                    <div class="code-example">
                        <h5>Implementation:</h5>
                        <pre><code>def find_middle(head):
    if not head:
        return None
    
    slow = head  # Moves 1 step
    fast = head  # Moves 2 steps
    
    # When fast reaches end, slow is at middle
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow  # Middle node

# For even length lists, returns second middle
def find_middle_first(head):
    if not head:
        return None
    
    slow = head
    fast = head.next  # Start fast one step ahead
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow  # First middle for even length</code></pre>
                    </div>
                    
                    <p><strong>Applications:</strong> Merge sort on linked lists, palindrome checking</p>
                </div>
                
                <div class="tutorial-section">
                    <h4>🔄 Reversing a Linked List</h4>
                    <p>Fundamental operation with multiple approaches.</p>
                    
                    <h5>1. Iterative Approach (Recommended):</h5>
                    <div class="code-example">
                        <pre><code>def reverse_iterative(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next  # Store next
        current.next = prev       # Reverse link
        prev = current           # Move prev forward
        current = next_temp      # Move current forward
    
    return prev  # New head

# Time: O(n), Space: O(1)</code></pre>
                    </div>
                    
                    <h5>2. Recursive Approach:</h5>
                    <div class="code-example">
                        <pre><code>def reverse_recursive(head):
    # Base case
    if not head or not head.next:
        return head
    
    # Recursively reverse rest of list
    new_head = reverse_recursive(head.next)
    
    # Reverse current connection
    head.next.next = head
    head.next = None
    
    return new_head

# Time: O(n), Space: O(n) due to recursion stack</code></pre>
                    </div>
                </div>
                
                <div class="tutorial-section">
                    <h4>🔀 Merging Two Sorted Lists</h4>
                    <p>Combine two sorted linked lists into one sorted list.</p>
                    
                    <div class="code-example">
                        <pre><code>def merge_sorted_lists(list1, list2):
    # Create dummy node to simplify logic
    dummy = ListNode(0)
    current = dummy
    
    # Compare and merge
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    # Attach remaining nodes
    current.next = list1 or list2
    
    return dummy.next  # Skip dummy node

# Recursive approach
def merge_recursive(list1, list2):
    if not list1:
        return list2
    if not list2:
        return list1
    
    if list1.val <= list2.val:
        list1.next = merge_recursive(list1.next, list2)
        return list1
    else:
        list2.next = merge_recursive(list1, list2.next)
        return list2</code></pre>
                    </div>
                </div>
                
                <div class="tutorial-section">
                    <h4>🚀 Skip List - Probabilistic Data Structure</h4>
                    <p>A probabilistic alternative to balanced trees with <strong>O(log n) expected performance</strong>.</p>
                    
                    <h5>Key Concepts:</h5>
                    <ul>
                        <li><strong>Multiple Levels:</strong> Each level is a subset of the level below</li>
                        <li><strong>Probabilistic Heights:</strong> Each level has ~50% of nodes from level below</li>
                        <li><strong>Express Lanes:</strong> Higher levels allow faster traversal</li>
                        <li><strong>No Rotations:</strong> Unlike balanced trees, no complex rebalancing</li>
                    </ul>
                    
                    <div class="code-example">
                        <h5>Skip List Node:</h5>
                        <pre><code>import random

class SkipListNode:
    def __init__(self, val, level):
        self.val = val
        self.forward = [None] * (level + 1)  # Array of forward pointers

class SkipList:
    def __init__(self, max_level=16):
        self.max_level = max_level
        self.header = SkipListNode(-1, max_level)
        self.level = 0
    
    def random_level(self):
        level = 0
        while random.random() < 0.5 and level < self.max_level:
            level += 1
        return level
    
    def search(self, target):
        current = self.header
        
        # Start from highest level, go down
        for i in range(self.level, -1, -1):
            while (current.forward[i] and 
                   current.forward[i].val < target):
                current = current.forward[i]
        
        current = current.forward[0]
        return current and current.val == target</code></pre>
                    </div>
                    
                    <p><strong>Advantages:</strong> Simple implementation, good performance, no rebalancing needed</p>
                </div>
                
                <div class="tutorial-section">
                    <h4>💾 LRU Cache Implementation</h4>
                    <p>Combine <strong>doubly linked list + hash map</strong> for O(1) operations.</p>
                    
                    <div class="code-example">
                        <pre><code>class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}  # key -> node mapping
        
        # Dummy head and tail for easier operations
        self.head = DoublyNode(0, 0)
        self.tail = DoublyNode(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def add_node(self, node):
        """Add node right after head"""
        node.prev = self.head
        node.next = self.head.next
        
        self.head.next.prev = node
        self.head.next = node
    
    def remove_node(self, node):
        """Remove an existing node"""
        prev_node = node.prev
        next_node = node.next
        
        prev_node.next = next_node
        next_node.prev = prev_node
    
    def move_to_head(self, node):
        """Move node to head (mark as recently used)"""
        self.remove_node(node)
        self.add_node(node)
    
    def pop_tail(self):
        """Remove last node (least recently used)"""
        last_node = self.tail.prev
        self.remove_node(last_node)
        return last_node
    
    def get(self, key):
        node = self.cache.get(key)
        if node:
            self.move_to_head(node)  # Mark as recently used
            return node.value
        return -1
    
    def put(self, key, value):
        node = self.cache.get(key)
        
        if node:
            # Update existing
            node.value = value
            self.move_to_head(node)
        else:
            # Add new
            new_node = DoublyNode(key, value)
            
            if len(self.cache) >= self.capacity:
                # Remove LRU
                tail = self.pop_tail()
                del self.cache[tail.key]
            
            self.cache[key] = new_node
            self.add_node(new_node)</code></pre>
                    </div>
                    
                    <p><strong>Why This Design:</strong></p>
                    <ul>
                        <li>Hash map provides O(1) key lookup</li>
                        <li>Doubly linked list enables O(1) insertion/deletion</li>
                        <li>Head = Most Recently Used, Tail = Least Recently Used</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>🧠 Advanced Problem-Solving Patterns</h4>
                    
                    <h5>1. Two Pointers Technique:</h5>
                    <ul>
                        <li><strong>Fast & Slow:</strong> Cycle detection, middle finding</li>
                        <li><strong>Distance Apart:</strong> Remove nth from end</li>
                        <li><strong>Different Speeds:</strong> Various mathematical relationships</li>
                    </ul>
                    
                    <h5>2. Dummy Node Pattern:</h5>
                    <ul>
                        <li><strong>Simplifies Edge Cases:</strong> No special handling for head</li>
                        <li><strong>Merge Operations:</strong> Easier to build result lists</li>
                        <li><strong>Deletion Operations:</strong> Uniform handling</li>
                    </ul>
                    
                    <h5>3. Runner Technique:</h5>
                    <ul>
                        <li><strong>Palindrome Check:</strong> Find middle, reverse, compare</li>
                        <li><strong>Intersection Detection:</strong> Different starting points</li>
                        <li><strong>Cycle Length:</strong> Count steps between meetings</li>
                    </ul>
                    
                    <h5>4. Recursive Patterns:</h5>
                    <ul>
                        <li><strong>Divide & Conquer:</strong> Merge sort on lists</li>
                        <li><strong>Backtracking:</strong> Generate all possible lists</li>
                        <li><strong>Tree-like Processing:</strong> Treat list as tree</li>
                    </ul>
                </div>
                
                <div class="tutorial-section">
                    <h4>💡 Performance Optimization Tips</h4>
                    <ul>
                        <li><strong>Maintain Tail Pointer:</strong> O(1) insertion at end</li>
                        <li><strong>Use Sentinel Nodes:</strong> Reduce edge case complexity</li>
                        <li><strong>Cache List Length:</strong> Avoid O(n) length calculations</li>
                        <li><strong>Batch Operations:</strong> Combine multiple operations</li>
                        <li><strong>Memory Pool:</strong> Pre-allocate nodes for better performance</li>
                        <li><strong>Lazy Deletion:</strong> Mark as deleted instead of actual removal</li>
                    </ul>
                </div>
            `
        }
    };
    
    const tutorial = tutorials[type];
    document.getElementById('tutorial-text').innerHTML = tutorial.content;
    updateProgress(5, null, { lesson: tutorial.title });
    
    // Add syntax highlighting to code blocks
    if (window.Prism) {
        Prism.highlightAll();
    }
}

// Algorithm Demonstrations
function showAlgorithm(algorithmType) {
    const algorithms = {
        floyd: {
            title: "Floyd's Cycle Detection Algorithm",
            content: `
                <h3>Floyd's Cycle Detection (Tortoise and Hare)</h3>
                <div class="algorithm-explanation">
                    <h4>How it works:</h4>
                    <ol>
                        <li>Use two pointers: slow (tortoise) and fast (hare)</li>
                        <li>Slow pointer moves 1 step, fast pointer moves 2 steps</li>
                        <li>If there's a cycle, they will eventually meet</li>
                        <li>If fast pointer reaches null, there's no cycle</li>
                    </ol>
                    
                    <h4>Code Implementation:</h4>
                    <pre><code>def hasCycle(head):
    if not head or not head.next:
        return False
    
    slow = head
    fast = head.next
    
    while slow != fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
    
    return True</code></pre>
                    
                    <h4>Time Complexity: O(n)</h4>
                    <h4>Space Complexity: O(1)</h4>
                </div>
            `
        },
        merge: {
            title: "Merge Sort on Linked Lists",
            content: `
                <h3>Merge Sort for Linked Lists</h3>
                <div class="algorithm-explanation">
                    <h4>Advantages over Array Merge Sort:</h4>
                    <ul>
                        <li>No extra space needed (in-place)</li>
                        <li>Stable sorting algorithm</li>
                        <li>Optimal for linked lists</li>
                    </ul>
                    
                    <h4>Algorithm Steps:</h4>
                    <ol>
                        <li>Find the middle of the linked list</li>
                        <li>Split the list into two halves</li>
                        <li>Recursively sort both halves</li>
                        <li>Merge the sorted halves</li>
                    </ol>
                    
                    <h4>Time Complexity: O(n log n)</h4>
                    <h4>Space Complexity: O(log n) for recursion stack</h4>
                </div>
            `
        },
        lru: {
            title: "LRU Cache Implementation",
            content: `
                <h3>LRU Cache using Doubly Linked List + HashMap</h3>
                <div class="algorithm-explanation">
                    <h4>Data Structures Used:</h4>
                    <ul>
                        <li><strong>Doubly Linked List:</strong> For O(1) insertion/deletion</li>
                        <li><strong>HashMap:</strong> For O(1) key lookup</li>
                    </ul>
                    
                    <h4>Operations:</h4>
                    <ul>
                        <li><strong>GET:</strong> Move accessed node to head</li>
                        <li><strong>PUT:</strong> Add to head, remove from tail if capacity exceeded</li>
                    </ul>
                    
                    <h4>Why This Design:</h4>
                    <ul>
                        <li>Head = Most Recently Used</li>
                        <li>Tail = Least Recently Used</li>
                        <li>HashMap provides O(1) access to any node</li>
                        <li>Doubly linked list allows O(1) removal</li>
                    </ul>
                    
                    <h4>Time Complexity: O(1) for all operations</h4>
                </div>
            `
        },
        skip: {
            title: "Skip List Data Structure",
            content: `
                <h3>Skip List - Probabilistic Data Structure</h3>
                <div class="algorithm-explanation">
                    <h4>Key Concepts:</h4>
                    <ul>
                        <li>Multiple levels of linked lists</li>
                        <li>Higher levels skip more elements</li>
                        <li>Probabilistic balancing (no rotations needed)</li>
                    </ul>
                    
                    <h4>Node Height Determination:</h4>
                    <ul>
                        <li>Each level has probability 1/2 of existing</li>
                        <li>Expected height: O(log n)</li>
                        <li>Maximum height: typically log₂(n)</li>
                    </ul>
                    
                    <h4>Operations:</h4>
                    <ul>
                        <li><strong>Search:</strong> Start from top level, go down when needed</li>
                        <li><strong>Insert:</strong> Find position, determine height randomly</li>
                        <li><strong>Delete:</strong> Remove from all levels where present</li>
                    </ul>
                    
                    <h4>Time Complexity: O(log n) expected for all operations</h4>
                    <h4>Space Complexity: O(n)</h4>
                </div>
            `
        }
    };
    
    const algorithm = algorithms[algorithmType];
    document.getElementById('algorithm-detail').innerHTML = algorithm.content;
    updateProgress(10, 'Algorithm Explorer');
}

// Progress and User Management
async function loadUserProgress() {
    try {
        const response = await fetch('/api/progress');
        userProgress = await response.json();
        updateProgressDisplay();
        updateNavStats();
    } catch (error) {
        console.error('Failed to load progress:', error);
    }
}

async function updateProgress(points = 0, achievement = null, extraData = {}) {
    try {
        const data = { points, achievement, ...extraData };
        const response = await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            await loadUserProgress();
            if (achievement) {
                showAchievement(achievement);
            }
        }
    } catch (error) {
        console.error('Failed to update progress:', error);
    }
}

function updateProgressDisplay() {
    // Update dashboard
    const totalLessons = 4; // Number of tutorial types
    const completedLessons = userProgress.completed_lessons?.length || 0;
    const progressPercentage = (completedLessons / totalLessons) * 100;
    
    document.getElementById('learning-progress').style.width = `${progressPercentage}%`;
    document.getElementById('progress-text').textContent = `${Math.round(progressPercentage)}% Complete`;
    document.getElementById('streak-days').textContent = userProgress.streak_days || 0;
    document.getElementById('time-spent').textContent = userProgress.total_time_spent || 0;
    
    // Update progress tab
    document.getElementById('total-score').textContent = userProgress.score || 0;
    document.getElementById('lessons-completed').textContent = completedLessons;
    document.getElementById('quiz-attempts').textContent = userProgress.quiz_attempts || 0;
    document.getElementById('problems-solved').textContent = userProgress.problems_solved?.length || 0;
    
    // Update achievements
    updateAchievementsDisplay();
}

function updateNavStats() {
    document.getElementById('user-score').textContent = `Score: ${userProgress.score || 0}`;
    document.getElementById('user-achievements').textContent = `🏆 ${userProgress.achievements?.length || 0}`;
}

function updateAchievementsDisplay() {
    const achievements = userProgress.achievements || [];
    const recentAchievements = document.getElementById('recent-achievements');
    const achievementsGrid = document.getElementById('achievements-grid');
    
    if (achievements.length === 0) {
        recentAchievements.innerHTML = '<p>No achievements yet. Start learning!</p>';
        achievementsGrid.innerHTML = '<p>No achievements unlocked yet.</p>';
        return;
    }
    
    // Show recent achievements in dashboard
    const recent = achievements.slice(-3).map(achievement => 
        `<div class="achievement-badge">🏆 ${achievement}</div>`
    ).join('');
    recentAchievements.innerHTML = recent;
    
    // Show all achievements in progress tab
    const allAchievements = achievements.map(achievement => 
        `<div class="achievement-badge">🏆 ${achievement}</div>`
    ).join('');
    achievementsGrid.innerHTML = allAchievements;
}

function showAchievement(achievement) {
    // Create achievement notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-popup">
            <h3>🏆 Achievement Unlocked!</h3>
            <p>${achievement}</p>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: linear-gradient(45deg, #FFD700, #FFA500);
        color: #000;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideIn 0.5s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Leaderboard
async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        const leaderboard = await response.json();
        
        const tbody = document.getElementById('leaderboard-body');
        tbody.innerHTML = leaderboard.map((user, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>User ${user.user_id}</td>
                <td>${user.score}</td>
                <td>${user.achievements}</td>
                <td>${user.problems_solved}</td>
                <td>${user.best_quiz_score}%</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
    }
}

// Utility Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Interview Prep Functions
function loadQuestions(category) {
    const questions = InterviewPrep.commonQuestions.find(cat => cat.category.toLowerCase().includes(category));
    const container = document.getElementById('interview-questions');
    
    if (questions) {
        container.innerHTML = questions.questions.map((q, index) => `
            <div class="question-card">
                <div class="question-header">
                    <span class="difficulty ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                    <span class="tags">${q.tags.join(', ')}</span>
                </div>
                <h4>${q.q}</h4>
                <div class="answer" id="answer-${index}" style="display:none;">
                    <p>${q.a}</p>
                    ${q.code ? `<pre><code>${q.code}</code></pre>` : ''}
                </div>
                <button onclick="toggleAnswer(${index})">Show Answer</button>
            </div>
        `).join('');
    }
}

function loadCodingPatterns() {
    const container = document.getElementById('coding-patterns');
    container.innerHTML = InterviewPrep.codingPatterns.map((pattern, index) => `
        <div class="pattern-card">
            <h4>${pattern.name}</h4>
            <p>${pattern.description}</p>
            <div class="pattern-applications">
                <strong>Applications:</strong> ${pattern.applications.join(', ')}
            </div>
            <div class="pattern-template" id="template-${index}" style="display:none;">
                <pre><code>${pattern.template}</code></pre>
            </div>
            <button onclick="toggleTemplate(${index})">Show Template</button>
        </div>
    `).join('');
}

function toggleTemplate(index) {
    const template = document.getElementById(`template-${index}`);
    const button = template.nextElementSibling;
    
    if (template.style.display === 'none') {
        template.style.display = 'block';
        button.textContent = 'Hide Template';
    } else {
        template.style.display = 'none';
        button.textContent = 'Show Template';
    }
}

function loadComplexityQuiz() {
    const container = document.getElementById('complexity-quiz');
    let currentQuestion = 0;
    let score = 0;
    
    function showQuestion(index) {
        const q = InterviewPrep.timeComplexityQuiz[index];
        container.innerHTML = `
            <div class="quiz-question">
                <h4>Question ${index + 1} of ${InterviewPrep.timeComplexityQuiz.length}</h4>
                <p><strong>Operation:</strong> ${q.operation}</p>
                <div class="quiz-options">
                    ${q.options.map((option, i) => `
                        <button class="quiz-option" onclick="selectComplexityAnswer(${i}, ${q.correct}, ${index})">${option}</button>
                    `).join('')}
                </div>
                <div id="quiz-feedback-${index}" class="quiz-feedback"></div>
            </div>
        `;
    }
    
    window.selectComplexityAnswer = function(selected, correct, questionIndex) {
        const feedback = document.getElementById(`quiz-feedback-${questionIndex}`);
        const isCorrect = selected === correct;
        
        if (isCorrect) score++;
        
        feedback.innerHTML = `
            <div class="${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '✓ Correct!' : '✗ Incorrect'}<br>
                <small>${InterviewPrep.timeComplexityQuiz[questionIndex].explanation}</small>
            </div>
        `;
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < InterviewPrep.timeComplexityQuiz.length) {
                showQuestion(currentQuestion);
            } else {
                container.innerHTML = `
                    <div class="quiz-complete">
                        <h3>Quiz Complete!</h3>
                        <p>Score: ${score}/${InterviewPrep.timeComplexityQuiz.length}</p>
                        <button onclick="loadComplexityQuiz()">Restart Quiz</button>
                    </div>
                `;
            }
        }, 2000);
    };
    
    showQuestion(0);
}

function toggleAnswer(index) {
    const answer = document.getElementById(`answer-${index}`);
    const button = answer.nextElementSibling;
    
    if (answer.style.display === 'none') {
        answer.style.display = 'block';
        button.textContent = 'Hide Answer';
    } else {
        answer.style.display = 'none';
        button.textContent = 'Show Answer';
    }
}

function generateMockInterview() {
    const questions = InterviewPrep.generateMockInterview();
    const container = document.getElementById('interview-questions');
    
    container.innerHTML = `
        <div class="mock-interview">
            <h3>🎯 Mock Interview Session</h3>
            <p>Practice these questions as if you're in a real interview:</p>
            ${questions.map((q, index) => `
                <div class="mock-question">
                    <h4>Question ${index + 1} (${q.category} - ${q.difficulty})</h4>
                    <p>${q.q}</p>
                    <button onclick="showHint('${q.category.toLowerCase()}')">Need a Hint?</button>
                </div>
            `).join('')}
        </div>
    `;
}

function showHint(category) {
    const hint = InterviewPrep.getHint(category);
    alert(`💡 Hint: ${hint}`);
}

// Performance Analysis Functions
function initializePerformanceCharts() {
    // Complexity Chart
    const ctx1 = document.getElementById('complexityChart');
    if (ctx1) {
        new Chart(ctx1.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['10', '100', '1K', '10K', '100K'],
                datasets: [{
                    label: 'O(1) - Constant',
                    data: [1, 1, 1, 1, 1],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.1
                }, {
                    label: 'O(n) - Linear',
                    data: [10, 100, 1000, 10000, 100000],
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.1
                }, {
                    label: 'O(n²) - Quadratic',
                    data: [100, 10000, 1000000, 100000000, 10000000000],
                    borderColor: '#F44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Time Complexity Comparison',
                        color: '#fff',
                        font: { size: 16 }
                    },
                    legend: {
                        labels: { color: '#fff' }
                    }
                },
                scales: {
                    y: {
                        type: 'logarithmic',
                        title: {
                            display: true,
                            text: 'Operations (log scale)',
                            color: '#fff'
                        },
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Input Size',
                            color: '#fff'
                        },
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });
    }
    
    // Array vs Linked List Chart
    const ctx2 = document.getElementById('arrayVsLinkedChart');
    if (ctx2) {
        new Chart(ctx2.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Access', 'Insert Head', 'Insert Tail', 'Delete Head', 'Search'],
                datasets: [{
                    label: 'Array',
                    data: [1, 100, 1, 100, 50],
                    backgroundColor: 'rgba(33, 150, 243, 0.7)'
                }, {
                    label: 'Linked List',
                    data: [100, 1, 100, 1, 100],
                    backgroundColor: 'rgba(76, 175, 80, 0.7)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Performance Comparison (Lower is Better)',
                        color: '#fff',
                        font: { size: 14 }
                    },
                    legend: {
                        labels: { color: '#fff' }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Relative Time',
                            color: '#fff'
                        },
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });
    }
    
    // Memory Usage Chart
    const ctx3 = document.getElementById('memoryChart');
    if (ctx3) {
        new Chart(ctx3.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Data', 'Pointers', 'Overhead'],
                datasets: [{
                    label: 'Memory Usage',
                    data: [60, 30, 10],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.8)',
                        'rgba(255, 152, 0, 0.8)',
                        'rgba(244, 67, 54, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Linked List Memory Distribution',
                        color: '#fff',
                        font: { size: 14 }
                    },
                    legend: {
                        labels: { color: '#fff' }
                    }
                }
            }
        });
    }
}

function runBenchmark(type) {
    const sizes = [100, 500, 1000, 5000, 10000];
    const results = {
        array: [],
        linkedList: [],
        doublyLinked: []
    };

    sizes.forEach(size => {
        switch(type) {
            case 'insertion':
                results.array.push(size * 0.1);
                results.linkedList.push(1);
                results.doublyLinked.push(1.2);
                break;
            case 'deletion':
                results.array.push(size * 0.15);
                results.linkedList.push(1);
                results.doublyLinked.push(0.8);
                break;
            case 'search':
                results.array.push(size * 0.5);
                results.linkedList.push(size * 0.8);
                results.doublyLinked.push(size * 0.9);
                break;
            case 'all':
                // Run all benchmarks
                runBenchmark('insertion');
                setTimeout(() => runBenchmark('deletion'), 1000);
                setTimeout(() => runBenchmark('search'), 2000);
                return;
        }
    });

    displayBenchmarkResults({ sizes, results, type });
}

function displayBenchmarkResults(data) {
    const resultsDiv = document.getElementById('benchmark-results');
    resultsDiv.innerHTML = `
        <h4>${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Benchmark Results</h4>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Size</th>
                    <th>Array (ms)</th>
                    <th>Linked List (ms)</th>
                    <th>Doubly Linked (ms)</th>
                </tr>
            </thead>
            <tbody>
                ${data.sizes.map((size, i) => `
                    <tr>
                        <td>${size}</td>
                        <td>${data.results.array[i].toFixed(2)}</td>
                        <td>${data.results.linkedList[i].toFixed(2)}</td>
                        <td>${data.results.doublyLinked[i].toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Code Generator Functions
function generateCode() {
    const language = document.getElementById('language-select').value;
    const type = document.getElementById('code-type-select').value;
    const algorithm = document.getElementById('algorithm-select').value;
    
    let code;
    if (type === 'data_structure') {
        code = CodeGenerator.generateCode('data_structure', null, language);
    } else {
        code = CodeGenerator.generateCode('algorithm', algorithm, language);
    }
    
    document.getElementById('generated-code-content').textContent = code;
    document.getElementById('code-title').textContent = `${language} - ${type === 'data_structure' ? 'Singly Linked List' : algorithm.replace('_', ' ')}`;
    
    // Update language info
    const info = CodeGenerator.getLanguageInfo(language);
    document.getElementById('language-info').innerHTML = `
        <div class="language-details">
            <h4>${language} Details</h4>
            <p><strong>File Extension:</strong> ${info.extension}</p>
            <p><strong>Key Features:</strong> ${info.features?.join(', ')}</p>
            <p><strong>Pros:</strong> ${info.pros?.join(', ')}</p>
            <p><strong>Cons:</strong> ${info.cons?.join(', ')}</p>
        </div>
    `;
    
    if (window.Prism) {
        Prism.highlightAll();
    }
}

function copyCode() {
    const code = document.getElementById('generated-code-content').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
    });
}

function downloadCode() {
    const language = document.getElementById('language-select').value;
    const code = document.getElementById('generated-code-content').textContent;
    const info = CodeGenerator.getLanguageInfo(language);
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linked_list${info.extension}`;
    a.click();
    URL.revokeObjectURL(url);
}

// Event listeners for code generator
document.addEventListener('DOMContentLoaded', function() {
    const codeTypeSelect = document.getElementById('code-type-select');
    const algorithmGroup = document.getElementById('algorithm-group');
    
    if (codeTypeSelect) {
        codeTypeSelect.addEventListener('change', function() {
            if (this.value === 'algorithm') {
                algorithmGroup.style.display = 'block';
            } else {
                algorithmGroup.style.display = 'none';
            }
        });
    }
});

// Add CSS animation for achievement notification and tutorial styling
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .tutorial-section {
        margin: 2rem 0;
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border-left: 4px solid #4CAF50;
    }
    
    .tutorial-section h4 {
        color: #4CAF50;
        margin-bottom: 1rem;
    }
    
    .tutorial-section h5 {
        color: #81C784;
        margin: 1rem 0 0.5rem 0;
    }
    
    .code-example {
        margin: 1rem 0;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        overflow: hidden;
    }
    
    .code-example h5 {
        background: rgba(0, 0, 0, 0.5);
        padding: 0.5rem 1rem;
        margin: 0;
        font-size: 0.9rem;
    }
    
    .code-example pre {
        margin: 0;
        padding: 1rem;
        overflow-x: auto;
    }
    
    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        overflow: hidden;
    }
    
    .comparison-table th,
    .comparison-table td {
        padding: 0.8rem;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .comparison-table th {
        background: rgba(76, 175, 80, 0.2);
        font-weight: 600;
    }
    
    .comparison-table tr:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .interview-sections {
        display: grid;
        gap: 2rem;
    }
    
    .interview-section {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 12px;
    }
    
    .question-categories {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    
    .question-categories button {
        background: #4CAF50;
        border: none;
        color: white;
        padding: 0.8rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .question-categories button:hover {
        background: #45a049;
    }
    
    .question-card {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border-left: 4px solid #4CAF50;
    }
    
    .question-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    
    .difficulty {
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    
    .difficulty.easy { background: #4CAF50; }
    .difficulty.medium { background: #FF9800; }
    .difficulty.hard { background: #F44336; }
    
    .tags {
        color: #81C784;
        font-size: 0.9rem;
    }
    
    .performance-dashboard {
        display: grid;
        gap: 2rem;
    }
    
    .benchmark-section, .comparison-section {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 12px;
    }
    
    .benchmark-controls {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .benchmark-controls button {
        background: #2196F3;
        border: none;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .benchmark-controls button:hover {
        background: #1976D2;
    }
    
    .results-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        overflow: hidden;
    }
    
    .results-table th, .results-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .results-table th {
        background: rgba(33, 150, 243, 0.2);
    }
    
    .code-generator {
        display: grid;
        gap: 2rem;
    }
    
    .generator-controls {
        display: flex;
        gap: 2rem;
        align-items: end;
        flex-wrap: wrap;
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 12px;
    }
    
    .control-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .control-group label {
        font-weight: 600;
        color: #81C784;
    }
    
    .control-group select {
        padding: 0.8rem;
        border: none;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        min-width: 150px;
    }
    
    .generator-controls button {
        background: #4CAF50;
        border: none;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .generator-controls button:hover {
        background: #45a049;
    }
    
    .generated-code {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        overflow: hidden;
    }
    
    .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .code-header button {
        background: #2196F3;
        border: none;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .generated-code pre {
        margin: 0;
        padding: 2rem;
        overflow-x: auto;
        max-height: 500px;
        overflow-y: auto;
    }
    
    .language-comparison {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 12px;
    }
    
    .language-details {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 8px;
    }
    
    .mock-interview {
        background: rgba(255, 193, 7, 0.1);
        padding: 2rem;
        border-radius: 12px;
        border-left: 4px solid #FFC107;
    }
    
    .mock-question {
        background: rgba(255, 255, 255, 0.05);
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .mock-question button {
        background: #FF9800;
        border: none;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1rem;
    }
    
    .pattern-card {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border-left: 4px solid #2196F3;
    }
    
    .pattern-applications {
        color: #81C784;
        margin: 1rem 0;
        font-size: 0.9rem;
    }
    
    .quiz-question {
        background: rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
    }
    
    .quiz-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
    }
    
    .quiz-option {
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid transparent;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.1rem;
        font-weight: bold;
    }
    
    .quiz-option:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: #4CAF50;
    }
    
    .quiz-feedback {
        margin-top: 2rem;
        padding: 1rem;
        border-radius: 8px;
        font-weight: bold;
    }
    
    .quiz-feedback .correct {
        background: rgba(76, 175, 80, 0.2);
        color: #4CAF50;
    }
    
    .quiz-feedback .incorrect {
        background: rgba(244, 67, 54, 0.2);
        color: #F44336;
    }
    
    .chart-container {
        position: relative;
        height: 400px;
        margin: 1rem 0;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 1rem;
    }
    
    .comparison-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin: 2rem 0;
    }
    
    .comparison-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .comparison-card h4 {
        color: #4CAF50;
        margin-bottom: 1rem;
        text-align: center;
    }
    
    .comparison-card .chart-container {
        height: 300px;
    }
    
    .benchmark-section {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .benchmark-section h3 {
        color: #2196F3;
        text-align: center;
        margin-bottom: 2rem;
    }
`;
document.head.appendChild(style);