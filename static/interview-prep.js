// Interview Preparation Module
const InterviewPrep = {
    commonQuestions: [
        {
            category: "Basic Concepts",
            questions: [
                {
                    q: "What is a linked list and how does it differ from an array?",
                    a: "A linked list is a linear data structure where elements are stored in nodes, each containing data and a pointer to the next node. Unlike arrays, linked lists don't store elements in contiguous memory locations and don't support random access.",
                    difficulty: "Easy",
                    tags: ["fundamentals", "comparison"]
                },
                {
                    q: "What are the advantages and disadvantages of linked lists?",
                    a: "Advantages: Dynamic size, efficient insertion/deletion at head (O(1)), no memory waste. Disadvantages: No random access, extra memory for pointers, poor cache performance.",
                    difficulty: "Easy",
                    tags: ["fundamentals", "trade-offs"]
                }
            ]
        },
        {
            category: "Implementation",
            questions: [
                {
                    q: "How do you reverse a linked list iteratively?",
                    a: "Use three pointers: prev (initially null), current (head), and next. Iterate through the list, storing next, reversing current's pointer to prev, then advancing all pointers.",
                    difficulty: "Medium",
                    tags: ["algorithms", "pointers"],
                    code: `def reverse_list(head):
    prev = None
    current = head
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    return prev`
                },
                {
                    q: "How do you detect a cycle in a linked list?",
                    a: "Use Floyd's Cycle Detection Algorithm (tortoise and hare). Use two pointers: slow moves 1 step, fast moves 2 steps. If there's a cycle, they'll eventually meet.",
                    difficulty: "Medium",
                    tags: ["algorithms", "two-pointers"],
                    code: `def has_cycle(head):
    if not head or not head.next:
        return False
    slow = head
    fast = head.next
    while slow != fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
    return True`
                }
            ]
        },
        {
            category: "Advanced",
            questions: [
                {
                    q: "How would you implement an LRU Cache?",
                    a: "Use a combination of doubly linked list and hash map. Hash map provides O(1) access, doubly linked list enables O(1) insertion/deletion. Head represents most recently used, tail represents least recently used.",
                    difficulty: "Hard",
                    tags: ["design", "optimization"],
                    code: `class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.head = DoublyNode(0, 0)
        self.tail = DoublyNode(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head`
                }
            ]
        }
    ],

    codingPatterns: [
        {
            name: "Two Pointers",
            description: "Use two pointers moving at different speeds or positions",
            applications: ["Cycle detection", "Finding middle", "Remove nth from end"],
            template: `def two_pointer_technique(head):
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        # Check condition
        if slow == fast:
            return True  # Cycle detected
    
    return False`
        },
        {
            name: "Dummy Node",
            description: "Use a dummy node to simplify edge cases",
            applications: ["Merging lists", "Removing nodes", "Building result lists"],
            template: `def dummy_node_pattern(head):
    dummy = ListNode(0)
    current = dummy
    
    # Process original list
    while head:
        # Your logic here
        current.next = head
        current = current.next
        head = head.next
    
    return dummy.next  # Skip dummy`
        },
        {
            name: "Runner Technique",
            description: "Use multiple pointers with different starting positions",
            applications: ["Palindrome check", "Intersection detection", "Reordering"],
            template: `def runner_technique(head):
    # Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # Process second half
    second_half = slow
    # Your logic here
    
    return result`
        }
    ],

    generateMockInterview() {
        const categories = this.commonQuestions;
        const selectedQuestions = [];
        
        // Select questions from each category
        categories.forEach(category => {
            const randomQ = category.questions[Math.floor(Math.random() * category.questions.length)];
            selectedQuestions.push({
                ...randomQ,
                category: category.category
            });
        });
        
        return selectedQuestions;
    },

    getHint(questionId) {
        const hints = {
            "reverse": "Think about what you need to keep track of: the previous node, current node, and next node.",
            "cycle": "What happens when a fast pointer and slow pointer both traverse a circular path?",
            "middle": "If one pointer moves twice as fast as another, where will the slow pointer be when the fast one reaches the end?",
            "lru": "What data structures give you O(1) access and O(1) insertion/deletion?"
        };
        
        return hints[questionId] || "Think about the problem step by step. What are the constraints and requirements?";
    },

    timeComplexityQuiz: [
        {
            operation: "Insert at head of singly linked list",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correct: 0,
            explanation: "Only need to update head pointer and new node's next pointer"
        },
        {
            operation: "Delete a node with given reference in doubly linked list",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correct: 0,
            explanation: "Can directly update prev and next pointers without traversal"
        },
        {
            operation: "Find middle element using two pointers",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correct: 1,
            explanation: "Need to traverse half the list with slow pointer"
        }
    ],

    practiceProblems: [
        {
            title: "Merge k Sorted Lists",
            difficulty: "Hard",
            description: "Merge k sorted linked lists and return it as one sorted list.",
            hints: ["Use divide and conquer", "Merge pairs of lists", "Priority queue approach"],
            timeComplexity: "O(n log k)",
            spaceComplexity: "O(log k)"
        },
        {
            title: "Copy List with Random Pointer",
            difficulty: "Medium", 
            description: "Deep copy a linked list where each node has a random pointer.",
            hints: ["Use hash map", "Interweave approach", "Three pass solution"],
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)"
        },
        {
            title: "Add Two Numbers",
            difficulty: "Medium",
            description: "Add two numbers represented as linked lists.",
            hints: ["Handle carry", "Different lengths", "Dummy node"],
            timeComplexity: "O(max(m,n))",
            spaceComplexity: "O(max(m,n))"
        }
    ]
};

// Export for use in main application
window.InterviewPrep = InterviewPrep;