// Code Generator for Multiple Languages
const CodeGenerator = {
    languages: ['Python', 'Java', 'C++', 'JavaScript', 'C#'],
    
    templates: {
        singly_linked_list: {
            Python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.size = 0
    
    def insert_head(self, val):
        new_node = ListNode(val)
        new_node.next = self.head
        self.head = new_node
        self.size += 1
    
    def insert_tail(self, val):
        new_node = ListNode(val)
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        self.size += 1
    
    def delete_head(self):
        if self.head:
            self.head = self.head.next
            self.size -= 1
            return True
        return False
    
    def display(self):
        result = []
        current = self.head
        while current:
            result.append(current.val)
            current = current.next
        return result`,

            Java: `class ListNode {
    int val;
    ListNode next;
    
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class SinglyLinkedList {
    private ListNode head;
    private int size;
    
    public SinglyLinkedList() {
        this.head = null;
        this.size = 0;
    }
    
    public void insertHead(int val) {
        ListNode newNode = new ListNode(val);
        newNode.next = head;
        head = newNode;
        size++;
    }
    
    public void insertTail(int val) {
        ListNode newNode = new ListNode(val);
        if (head == null) {
            head = newNode;
        } else {
            ListNode current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
        size++;
    }
    
    public boolean deleteHead() {
        if (head != null) {
            head = head.next;
            size--;
            return true;
        }
        return false;
    }
    
    public void display() {
        ListNode current = head;
        while (current != null) {
            System.out.print(current.val + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}`,

            'C++': `#include <iostream>
#include <vector>

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class SinglyLinkedList {
private:
    ListNode* head;
    int size;
    
public:
    SinglyLinkedList() : head(nullptr), size(0) {}
    
    ~SinglyLinkedList() {
        while (head) {
            ListNode* temp = head;
            head = head->next;
            delete temp;
        }
    }
    
    void insertHead(int val) {
        ListNode* newNode = new ListNode(val);
        newNode->next = head;
        head = newNode;
        size++;
    }
    
    void insertTail(int val) {
        ListNode* newNode = new ListNode(val);
        if (!head) {
            head = newNode;
        } else {
            ListNode* current = head;
            while (current->next) {
                current = current->next;
            }
            current->next = newNode;
        }
        size++;
    }
    
    bool deleteHead() {
        if (head) {
            ListNode* temp = head;
            head = head->next;
            delete temp;
            size--;
            return true;
        }
        return false;
    }
    
    void display() {
        ListNode* current = head;
        while (current) {
            std::cout << current->val << " -> ";
            current = current->next;
        }
        std::cout << "null" << std::endl;
    }
    
    int getSize() const { return size; }
};`,

            JavaScript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    insertHead(val) {
        const newNode = new ListNode(val);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }
    
    insertTail(val) {
        const newNode = new ListNode(val);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
    
    deleteHead() {
        if (this.head) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        return false;
    }
    
    display() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.val);
            current = current.next;
        }
        return result;
    }
    
    getSize() {
        return this.size;
    }
}`,

            'C#': `using System;
using System.Collections.Generic;

public class ListNode {
    public int val;
    public ListNode next;
    
    public ListNode(int val = 0, ListNode next = null) {
        this.val = val;
        this.next = next;
    }
}

public class SinglyLinkedList {
    private ListNode head;
    private int size;
    
    public SinglyLinkedList() {
        head = null;
        size = 0;
    }
    
    public void InsertHead(int val) {
        ListNode newNode = new ListNode(val);
        newNode.next = head;
        head = newNode;
        size++;
    }
    
    public void InsertTail(int val) {
        ListNode newNode = new ListNode(val);
        if (head == null) {
            head = newNode;
        } else {
            ListNode current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
        size++;
    }
    
    public bool DeleteHead() {
        if (head != null) {
            head = head.next;
            size--;
            return true;
        }
        return false;
    }
    
    public List<int> Display() {
        List<int> result = new List<int>();
        ListNode current = head;
        while (current != null) {
            result.Add(current.val);
            current = current.next;
        }
        return result;
    }
    
    public int Size => size;
}`
        },
        
        common_algorithms: {
            reverse_list: {
                Python: `def reverse_list(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev`,
                
                Java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        ListNode nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}`,
                
                'C++': `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    
    while (current) {
        ListNode* nextTemp = current->next;
        current->next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}`,
                
                JavaScript: `function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current) {
        const nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}`,
                
                'C#': `public ListNode ReverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        ListNode nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}`
            },
            
            detect_cycle: {
                Python: `def has_cycle(head):
    if not head or not head.next:
        return False
    
    slow = head
    fast = head.next
    
    while slow != fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
    
    return True`,
                
                Java: `public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) {
        return false;
    }
    
    ListNode slow = head;
    ListNode fast = head.next;
    
    while (slow != fast) {
        if (fast == null || fast.next == null) {
            return false;
        }
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return true;
}`,
                
                'C++': `bool hasCycle(ListNode* head) {
    if (!head || !head->next) {
        return false;
    }
    
    ListNode* slow = head;
    ListNode* fast = head->next;
    
    while (slow != fast) {
        if (!fast || !fast->next) {
            return false;
        }
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return true;
}`,
                
                JavaScript: `function hasCycle(head) {
    if (!head || !head.next) {
        return false;
    }
    
    let slow = head;
    let fast = head.next;
    
    while (slow !== fast) {
        if (!fast || !fast.next) {
            return false;
        }
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return true;
}`,
                
                'C#': `public bool HasCycle(ListNode head) {
    if (head == null || head.next == null) {
        return false;
    }
    
    ListNode slow = head;
    ListNode fast = head.next;
    
    while (slow != fast) {
        if (fast == null || fast.next == null) {
            return false;
        }
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return true;
}`
            }
        }
    },
    
    generateCode(type, algorithm, language) {
        if (type === 'data_structure') {
            return this.templates.singly_linked_list[language] || 'Language not supported';
        } else if (type === 'algorithm') {
            return this.templates.common_algorithms[algorithm]?.[language] || 'Algorithm/Language combination not supported';
        }
        return 'Invalid type';
    },
    
    getLanguageInfo(language) {
        const info = {
            Python: {
                extension: '.py',
                features: ['Dynamic typing', 'Garbage collection', 'Simple syntax'],
                pros: ['Easy to learn', 'Readable code', 'Rich libraries'],
                cons: ['Slower execution', 'GIL limitations']
            },
            Java: {
                extension: '.java',
                features: ['Static typing', 'Automatic memory management', 'Platform independent'],
                pros: ['Strong type system', 'Large ecosystem', 'Performance'],
                cons: ['Verbose syntax', 'Slower startup']
            },
            'C++': {
                extension: '.cpp',
                features: ['Manual memory management', 'Low-level control', 'High performance'],
                pros: ['Very fast', 'System programming', 'Control over memory'],
                cons: ['Complex syntax', 'Memory management complexity']
            },
            JavaScript: {
                extension: '.js',
                features: ['Dynamic typing', 'Prototype-based OOP', 'Event-driven'],
                pros: ['Ubiquitous', 'Flexible', 'Large community'],
                cons: ['Type coercion issues', 'Callback complexity']
            },
            'C#': {
                extension: '.cs',
                features: ['Static typing', 'Garbage collection', '.NET ecosystem'],
                pros: ['Strong tooling', 'Good performance', 'Rich framework'],
                cons: ['Microsoft ecosystem dependency', 'Learning curve']
            }
        };
        
        return info[language] || {};
    },
    
    compareLanguages(languages) {
        return languages.map(lang => ({
            language: lang,
            ...this.getLanguageInfo(lang)
        }));
    }
};

// Export for use in main application
window.CodeGenerator = CodeGenerator;