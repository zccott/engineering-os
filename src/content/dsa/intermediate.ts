import type { Topic } from "../../types/content";

export const dsaIntermediateTopics: Topic[] = [
  {
    id: "linked-lists",
    title: "Linked Lists",
    level: "intermediate",
    description: "A chain of items where each one points to the next, instead of sitting side by side in memory.",
    explanation: `
An array keeps its items packed tightly together in memory, which is fast
to read but expensive to insert into. A **linked list** takes a different
approach: each item (called a **node**) stores its value plus a pointer to
the *next* node. The items don't need to sit next to each other in memory
at all — they're connected purely through these pointers.

This trade-off is the opposite of an array's: inserting or removing a node
is fast (you just change a couple of pointers), but finding the 5th item
means walking through the first four nodes one by one — there's no
shortcut to "jump" straight to a position.
    `.trim(),
    analogy:
      "A linked list is like a scavenger hunt: each clue tells you where to find the next one. You can't jump straight to clue #5 — you have to follow the chain from the start. But inserting a brand-new clue into the middle is easy: just point the previous clue somewhere new.",
    examples: [
      {
        title: "A simple linked list in JavaScript",
        code: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

const first = new Node(10);
const second = new Node(20);
first.next = second; // 10 → 20

console.log(first.value);      // 10
console.log(first.next.value); // 20`,
        walkthrough: [
          { code: "class Node { constructor(value) {...} }", explanation: "Defines the basic building block: a value plus a pointer to the next node." },
          { code: "const first = new Node(10);", explanation: "Creates the first node, holding the value 10." },
          { code: "const second = new Node(20);", explanation: "Creates a second, separate node, holding 20." },
          { code: "first.next = second;", explanation: "Links them together — first now points to second." },
          { code: "first.next.value", explanation: "Follows the pointer from first to reach second's value." },
        ],
      },
    ],
    howItWorks: `
Each node holds a value and a reference to the next node (or \`null\` if
it's the last one). To read the item at position 5, you must start at the
first node and follow \`.next\` five times — there's no way to calculate its
memory location directly, unlike an array.
    `.trim(),
    diagram: `
[10] → [20] → [30] → null
 head

To reach 30: head → next → next
    `.trim(),
    whyItExists: `
Linked lists shine when your program does a lot of inserting and removing
(especially at the front or in the middle) and doesn't need fast random
access by position. They're also the foundation for other structures, like
stacks and queues.
    `.trim(),
    whenToUse: `
Reach for a linked list when your program does a lot of inserting and
removing — especially at the front or in the middle of a collection — and
doesn't need to jump to an arbitrary position by index.
    `.trim(),
    whenNotToUse: `
If you need frequent random access by index (get the 500th item), a
linked list is a poor fit — that's O(n) here, versus O(1) for an array. In
practice, plain arrays cover most everyday JavaScript needs; reach for a
linked list mainly when building another structure (a queue, a stack) or
solving a problem that specifically calls for one.
    `.trim(),
    commonMistakes: [
      "Forgetting to update the `next` pointer when inserting a node, accidentally breaking the chain.",
      "Losing the reference to the rest of the list by overwriting a `next` pointer before saving it elsewhere.",
      "Assuming linked lists have fast random access like arrays do — they don't.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Build a linked list of 3 nodes manually and print each value by following `.next`." },
      { difficulty: "Medium", prompt: "Write a function that returns the length of a linked list by traversing it." },
      { difficulty: "Hard", prompt: "Write a function that reverses a singly linked list in place, without creating a new list." },
    ],
    interviewQuestions: [
      { question: "What's the main trade-off between arrays and linked lists?", answer: "Arrays offer fast random access (O(1)) but slow insertion/removal in the middle (O(n)), since later elements must shift. Linked lists offer fast insertion/removal (O(1), given a reference to the node) but slow access by position (O(n)), since there's no way to jump directly to an index." },
      { question: "What is a node?", answer: "The basic unit of a linked list — an object holding a value and a pointer (or pointers) to neighboring nodes." },
      { question: "What's the difference between a singly and doubly linked list?", answer: "A singly linked list's nodes only point to the `next` node, so it can only be traversed forward. A doubly linked list's nodes also point to the `prev` node, allowing traversal in both directions at the cost of one extra pointer (and its upkeep) per node." },
      { question: "Why is inserting at the front of a linked list O(1), while inserting at the front of an array is O(n)?", answer: "Inserting at the front of a linked list just means creating a new node and pointing it at the old head — nothing else moves. Inserting at the front of an array requires shifting every existing element one slot to the right to make room, which touches all n elements." },
      { question: "Why is finding the nth element O(n) in a linked list but O(1) in an array?", answer: "An array can compute an element's memory address directly from its index (base address + index × element size). A linked list has no such formula — the only way to reach the nth node is to follow `next` pointers one at a time from the head." },
      { question: "What is a circular linked list, and what's it useful for?", answer: "A linked list where the last node's `next` points back to the first node instead of to `null`, forming a loop. It's useful for things that naturally cycle, like round-robin task scheduling or a repeating playlist, where you want to keep advancing without ever hitting an end." },
      { question: "What is Floyd's cycle detection algorithm, and how does it detect a cycle using O(1) extra space?", answer: "Also called the 'tortoise and hare': walk two pointers through the list, one (`slow`) moving one node at a time and the other (`fast`) moving two nodes at a time. If the list has a cycle, `fast` will eventually enter the loop and lap `slow`, and the two pointers will land on the same node. If the list has no cycle, `fast` simply reaches `null` first. Only two pointers are used, regardless of list length, so the space cost is O(1)." },
      { question: "Why must the fast and slow pointers eventually meet if there's a cycle, instead of just missing each other forever?", answer: "Once `slow` enters the cycle, both pointers are moving within a loop of fixed length. Each step, `fast` closes the distance to `slow` by exactly one node (it gains 2 but `slow` also advances 1). Since the gap shrinks by 1 every step and wraps around a finite loop, it must eventually hit 0 — they can't perpetually skip over each other." },
      { question: "Once Floyd's algorithm finds a meeting point, how do you find the exact node where the cycle begins?", answer: "Reset one pointer to the head of the list, leave the other at the meeting point, and advance both one node at a time. The two pointers will meet again exactly at the start of the cycle — this works because of the distance relationship between the head, the cycle's start, and the meeting point that falls out of the earlier steps." },
      { question: "Walk through reversing the list `1 -> 2 -> 3 -> null` iteratively using three pointers (`prev`, `current`, `next`).", answer: "Start with `prev = null`, `current = head` (node 1). Each iteration: save `next = current.next`, then point `current.next = prev` (reversing the link), then move both `prev = current` and `current = next` forward. After processing node 1: list is `1 -> null`, prev=1. After node 2: `2 -> 1 -> null`, prev=2. After node 3: `3 -> 2 -> 1 -> null`, prev=3, current=null — loop ends and `prev` is the new head." },
      { question: "How would you reverse a singly linked list recursively, and how does its complexity compare to the iterative version?", answer: "Recurse to the end of the list first, then, as each call returns, point the next node's `next` back at the current node and set the current node's `next` to `null`. Both approaches are O(n) time, but the recursive version uses O(n) extra space for the call stack, while the iterative version uses only O(1) extra space." },
      { question: "What's a common bug when reversing a linked list iteratively?", answer: "Overwriting `current.next` to point at `prev` before saving the original `current.next` somewhere first — once overwritten, there's no way to reach the rest of the original list, so the reversal silently truncates it." },
      { question: "What is a sentinel (dummy) head node, and why does it simplify list code?", answer: "A placeholder node kept permanently at the front of the list, before the real head, whose value is never used. It means the 'real' first node is always some node's `.next` rather than the list's own head reference, so inserting or removing at the front no longer needs special-cased logic separate from insertions/removals elsewhere in the list." },
      { question: "How would you find the middle node of a linked list in a single pass, without first counting its length?", answer: "Use slow and fast pointers starting at the head: advance `slow` one node per step and `fast` two nodes per step. When `fast` reaches the end (or `null`), `slow` is sitting on the middle node, because it has covered exactly half the distance `fast` has." },
      { question: "Why does a queue built on a singly linked list need both a `head` and a `tail` pointer to keep both operations O(1)?", answer: "Dequeuing from the front only ever needs `head`. But enqueuing at the back, without a `tail` pointer, would require traversing the entire list from `head` to find the last node — making enqueue O(n). Keeping a `tail` pointer lets a new node be attached directly, in O(1)." },
      { question: "What's a subtle bug when removing a node from the middle of a singly linked list?", answer: "You can't remove a node using only a reference to that node itself — you need a reference to the *previous* node, since removal means updating the previous node's `next` to skip over the one being removed. Forgetting to track the previous node while traversing is a common cause of broken removal logic." },
      { question: "There's a trick to 'delete' a node given only a reference to it (no access to the previous node): copy the next node's value into it, then skip over the next node. Why does this fail for the last node in the list?", answer: "The trick works by making the target node effectively become its successor, then removing the now-duplicated successor. But the last node has no successor to copy from or skip over — there's nothing after it to borrow a value from, so the trick has no next node to fall back on." },
      { question: "How would you find where two singly linked lists intersect (merge into a shared tail), in O(n + m) time and O(1) extra space?", answer: "Walk both lists to find their lengths, advance the pointer on the longer list by the length difference so both pointers have the same remaining distance to the end, then advance both together one node at a time — the node where they become equal (same reference) is the intersection point." },
      { question: "How would you remove the nth node from the end of a linked list in a single pass?", answer: "Advance a `fast` pointer n nodes ahead of a `slow` pointer (both starting at a dummy head before the real head), then move both forward together until `fast` reaches the end. At that point, `slow` is sitting right before the node to remove, so `slow.next = slow.next.next` removes it." },
      { question: "How would you merge two already-sorted linked lists into a single sorted list, and what's the time complexity?", answer: "Walk both lists with two pointers, repeatedly attaching whichever current node has the smaller value to the result and advancing that list's pointer; once one list runs out, attach the rest of the other directly. This is O(n + m) time, since each node from both lists is visited exactly once, and O(1) extra space if you re-link existing nodes rather than creating new ones." },
      { question: "How would you check whether a linked list is a palindrome, ideally using O(1) extra space?", answer: "Find the middle with slow/fast pointers, reverse the second half in place, then walk the first half and the reversed second half together comparing values. If they match all the way through, it's a palindrome. This avoids the O(n) space an array copy would cost, at the cost of temporarily mutating (and optionally restoring) the list." },
      { question: "What's the extra memory cost of a doubly linked list compared to a singly linked list, per node?", answer: "One additional pointer per node (`prev`), typically 8 bytes on a 64-bit system, plus the ongoing cost of keeping that pointer correctly updated on every insertion and removal." },
      { question: "Why do a doubly linked list and a hash map together form the backbone of a classic LRU cache implementation?", answer: "The hash map gives O(1) lookup from a key to its node. The doubly linked list keeps nodes ordered by recency and, because each node knows both its neighbors, supports O(1) removal from anywhere and O(1) re-insertion at the front — exactly what's needed to move a just-accessed item to the 'most recent' end without scanning the list." },
      { question: "Why does a linked list have worse cache locality than an array, even though both are O(n) to traverse?", answer: "Array elements sit in one contiguous block of memory, so reading them sequentially is cache-friendly — the CPU can prefetch ahead. Linked list nodes are typically scattered across separately-allocated heap memory, so following `next` pointers jumps unpredictably around memory, causing more cache misses despite the same Big-O traversal cost." },
      { question: "What memory overhead does a linked list carry per element compared to a plain array of the same values?", answer: "Each node needs at least one pointer (`next`, plus `prev` for doubly linked), on top of the value itself, and each node is typically its own separate heap allocation with its own allocator bookkeeping overhead — whereas an array stores values back-to-back with no per-element pointer cost." },
      { question: "What is a circular doubly linked list, and where is it used?", answer: "A doubly linked list where the last node's `next` points to the first node and the first node's `prev` points to the last, forming a loop traversable in either direction. It shows up in things like looping playlists and in some LRU cache implementations, where wrapping around without special-casing the ends simplifies the logic." },
      { question: "What happens if a traversal loop's condition is `while (node.next)` instead of `while (node)`?", answer: "The loop body runs for every node except the last one — it stops as soon as `node.next` is `null`, meaning the final node is checked as `node` but never processed as `node.next` inside the loop, so it gets skipped even though no null-pointer error occurs." },
      { question: "Scenario: you're designing an LRU cache needing O(1) `get` and O(1) `put`. Why is a hash map or array alone insufficient?", answer: "A hash map alone gives O(1) lookup but no way to track *order of recency* or cheaply evict the least-recently-used item without scanning. An array can track order but costs O(n) to move an accessed item to the front or to remove an arbitrary item. Combining a hash map (for O(1) key lookup) with a doubly linked list (for O(1) reordering and eviction at either end) gives both properties at once." },
      { question: "What's the time complexity of accessing the head, the tail, and an arbitrary middle element of a singly linked list with only a head pointer?", answer: "Head: O(1), since it's directly referenced. Tail: O(n), since you must walk the whole list without a separate tail pointer. Middle: O(n), since reaching any position requires following `next` pointers from the head." },
    ],
    prerequisites: ["arrays"],
    relatedTopics: ["arrays", "stack", "queue"],
    keywords: ["linked list", "node", "pointer", "traversal"],
  },
  {
    id: "stack",
    title: "Stack",
    level: "intermediate",
    description: "A structure where the last item added is always the first one removed.",
    explanation: `
Some problems naturally need to process things in reverse order of how
they arrived — undo history, nested function calls, matching brackets. A
**stack** is a structure built exactly for that: you can only add ("push")
or remove ("pop") from one end, called the top, and whatever was added
most recently is always the first thing to come back out.

This rule is called **LIFO** — Last In, First Out.
    `.trim(),
    analogy:
      "A stack is like a stack of plates. You add a new plate on top, and when you need one, you take the top plate off first — you'd never pull one from the bottom without disturbing everything above it.",
    examples: [
      {
        title: "Using an array as a stack",
        code: `const stack = [];

stack.push(1); // [1]
stack.push(2); // [1, 2]
stack.push(3); // [1, 2, 3]

console.log(stack.pop()); // 3 — removes and returns the top item
console.log(stack);       // [1, 2]`,
        explanation:
          "`push` and `pop` both operate on the end of the array, which is exactly how a stack behaves — no special data structure is required in JavaScript.",
        walkthrough: [
          { code: "const stack = [];", explanation: "An empty array, used here as a stack." },
          { code: "stack.push(1);", explanation: "Adds 1 to the top." },
          { code: "stack.push(2); stack.push(3);", explanation: "Adds 2, then 3 — 3 is now on top." },
          { code: "stack.pop();", explanation: "Removes and returns the top item, 3, leaving [1, 2]." },
        ],
      },
    ],
    howItWorks: `
A stack only exposes two main operations: \`push\` (add to the top) and
\`pop\` (remove from the top) — both O(1), since neither requires touching
any other item. There's no direct way to access an item in the middle
without first removing everything above it.
    `.trim(),
    diagram: `
push(1)   push(2)   push(3)     pop()
   ↓         ↓         ↓          ↓
  [1]      [1,2]    [1,2,3]    returns 3, leaves [1,2]
    `.trim(),
    whyItExists: `
Many real problems are naturally last-in-first-out: undo/redo history,
tracking function calls (the call stack!), and checking that brackets or
parentheses are balanced. A stack models that behavior directly and simply.
    `.trim(),
    whenToUse: `
Reach for a stack whenever the most recent thing needs to come out first
— undo history, matching brackets or parentheses, or tracking a path
while backtracking through a maze or a tree.
    `.trim(),
    whenNotToUse: `
If you need to process items in the order they arrived (not the
reverse), you want a queue, not a stack. And if you need to inspect or
remove an item from the middle regularly, a stack's "only touch the top"
rule will fight you.
    `.trim(),
    commonMistakes: [
      "Trying to access the middle of a stack directly instead of popping down to it.",
      "Popping from an empty stack without checking first, causing errors or `undefined`.",
      "Confusing a stack (LIFO) with a queue (FIFO) — they solve different problems.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Implement a `Stack` class with `push`, `pop`, and `peek` (view the top without removing it) methods." },
      { difficulty: "Medium", prompt: "Use a stack to check whether a string of parentheses like `\"(()())\"` is balanced." },
      { difficulty: "Hard", prompt: "Use a stack to reverse the words in a sentence without using built-in reverse methods." },
    ],
    interviewQuestions: [
      { question: "What does LIFO mean?", answer: "Last In, First Out — the most recently added item is always the first one removed." },
      { question: "What is a real-world use of a stack in programming?", answer: "The call stack itself, which tracks function calls; also undo/redo features, balanced-bracket checking, and browser back/forward-style history." },
      { question: "What's the time complexity of push and pop?", answer: "Both are O(1) — they only ever touch the top item, with no need to shift or scan anything else." },
      { question: "Compare an array-based stack to a linked-list-based one — what are the real tradeoffs?", answer: "An array-based stack stores elements contiguously, giving better cache locality, but a dynamic array occasionally needs to resize (an O(n) copy) as it grows. A linked-list-based stack gives a guaranteed O(1) per operation with no resizing, but pays extra memory for a pointer per node and has worse cache locality since nodes may be scattered across memory." },
      { question: "What does 'amortized O(1)' mean for pushing onto a dynamic array-based stack, given that resizing is O(n)?", answer: "When the backing array fills up, it's typically resized by doubling its capacity, which costs O(n) to copy existing elements. But doubling means that expensive resize happens exponentially less often as the stack grows — the total cost of all resizes across n pushes works out to O(n), which spreads to O(1) per push on average, even though any single resizing push briefly costs O(n)." },
      { question: "What happens if you try to push onto a fixed-capacity array-based stack that's already full?", answer: "In a truly fixed-size implementation, it overflows — typically by throwing an error or refusing the push. A dynamic implementation instead detects the full condition and triggers a resize to a larger backing array before completing the push." },
      { question: "Is a call stack overflow the same kind of thing as overflowing a fixed-size custom stack?", answer: "Conceptually yes — both mean exceeding the stack's available capacity. The call stack's limit comes from the fixed amount of memory the OS/engine reserves for stack frames (exceeded by recursing too deeply); a custom stack's limit is whatever capacity its backing storage was given." },
      { question: "How would you design a stack that supports `push`, `pop`, and `getMin()` (current minimum) all in O(1)?", answer: "Maintain a second, auxiliary stack alongside the main one that tracks the minimum at each point. On every push, also push the smaller of (new value, current auxiliary top) onto the auxiliary stack. On every pop, pop from both stacks together. `getMin()` just peeks the auxiliary stack's top — no scanning needed." },
      { question: "Trace a min-stack: push 5, push 3, push 7, push 3, pop, pop. What does `getMin()` return after each step?", answer: "push 5: main [5], min-stack [5], min=5. push 3: main [5,3], min-stack [5,3], min=3. push 7: main [5,3,7], min-stack [5,3,3] (7 isn't smaller than 3, so 3 repeats), min=3. push 3: main [5,3,7,3], min-stack [5,3,3,3], min=3. pop: removes 3 from both, main [5,3,7], min-stack [5,3,3], min=3. pop: removes 7 from both, main [5,3], min-stack [5,3], min=3. The repeated 3 in the min-stack is exactly what preserves the correct minimum after the top 3 was popped." },
      { question: "How would you evaluate the postfix expression `\"3 4 + 2 *\"` using a stack?", answer: "Scan left to right: push 3, push 4. On seeing `+`, pop two values (4, then 3), compute 3 + 4 = 7, push 7. On seeing 2, push 2. On seeing `*`, pop two values (2, then 7), compute 7 * 2 = 14, push 14. At the end, the stack holds only the result, 14." },
      { question: "Why does evaluating postfix notation require a stack instead of computing left to right immediately?", answer: "An operator can combine two operands that were themselves the results of earlier computations, not just the raw numbers seen so far. The stack holds every intermediate result until an operator arrives that needs it, so results computed several steps earlier remain available exactly when needed." },
      { question: "How would you check whether a string like `\"{[()]}\"` has properly balanced brackets, using a stack?", answer: "Scan the string; on an opening bracket, push it. On a closing bracket, pop the stack and check that it matches the corresponding opening bracket — if it doesn't match (or the stack is empty), the string is unbalanced. At the end, the string is balanced only if the stack is empty." },
      { question: "Why does checking `\"([)]\"` for balance require tracking order with a stack, rather than just counting each bracket type?", answer: "The counts of `(`, `)`, `[`, and `]` all match in `\"([)]\"`, but the nesting is invalid — the `)` closes before the `[` that opened after it has been closed. Only an order-sensitive structure like a stack catches this: when `)` arrives, the stack's top is `[`, which doesn't match, correctly flagging it as unbalanced." },
      { question: "How would you implement a queue using two stacks?", answer: "Keep an 'in' stack for enqueuing (just push) and an 'out' stack for dequeuing. To dequeue, if the 'out' stack is empty, pop everything off 'in' and push it onto 'out' — this reverses the order so the oldest enqueued item ends up on top of 'out' — then pop from 'out'. If 'out' isn't empty, just pop from it directly." },
      { question: "What's the amortized time complexity of dequeue in the two-stack queue, even though one dequeue can move every element between stacks?", answer: "Amortized O(1). Each element is pushed onto 'in' once and moved to 'out' at most once over its entire lifetime in the queue — so across any sequence of n operations, the total number of moves is bounded by roughly 2n, which averages out to O(1) work per operation even though a single dequeue can occasionally cost O(n)." },
      { question: "What is the 'next greater element' problem, and how does a stack solve it in O(n) instead of O(n²)?", answer: "For each element, find the first element to its right that's larger. The naive approach checks every pair, O(n²). A stack-based approach scans left to right, maintaining a stack of indices whose 'next greater' hasn't been found yet; whenever the current value is bigger than the stack's top, that top index's answer is the current value, so it's popped and resolved. Each index is pushed and popped at most once, making the total work O(n)." },
      { question: "How would you reverse a string (or a list's order) using a stack, and what's the space cost?", answer: "Push every character (or item) onto a stack, then pop them all off — since a stack reverses insertion order, popping everything back out yields the reverse. This costs O(n) extra space, since every element must be held on the stack simultaneously before any of them come back off." },
      { question: "Why should code check whether a stack is empty before calling `pop()` or `peek()`?", answer: "Popping or peeking an empty stack is undefined behavior in the sense that it has no top item to return — depending on the implementation, it may throw, return `undefined`, or (in a fixed-size array with an index counter) underflow the counter into an invalid state. Checking emptiness first avoids all of these failure modes." },
      { question: "How is the call stack itself an instance of the abstract stack data structure?", answer: "Each function call pushes a new stack frame holding that call's local variables, parameters, and a return address. When the function returns, its frame is popped and execution resumes in the caller at the saved return address — exactly LIFO behavior, since the most recently called (and not-yet-returned) function is always the next one to finish." },
      { question: "How would you convert a recursive function into an iterative one using an explicit stack, and why does this always work?", answer: "Maintain your own stack of 'pending work' (e.g. the arguments or state each recursive call would have used), and loop: pop a unit of work, process it, and push any further work it generates instead of recursing into it. This works in principle because recursion is itself implemented via the call stack — manually managing an equivalent stack lets you simulate the same call-and-return behavior without relying on the language's own call stack." },
      { question: "How does a browser's back/forward navigation map onto stack operations?", answer: "Visiting a new page pushes it onto a 'back' stack (and typically clears the 'forward' stack, since that history branch is no longer valid). Clicking back pops the current page off 'back' and pushes it onto 'forward'. Clicking forward does the reverse — pop from 'forward', push onto 'back'." },
      { question: "Why is peeking at a stack's top O(1), but checking whether a value exists anywhere in the stack O(n)?", answer: "Peek only ever reads the top element, a fixed single access regardless of size. Searching for an arbitrary value has no shortcut — since only the top is directly reachable, determining whether a value exists elsewhere requires inspecting (or popping) down through potentially every element." },
      { question: "What's the difference between a stack overflow and a stack underflow?", answer: "Overflow means exceeding capacity — pushing past a fixed-size stack's limit, or in the call stack, recursing so deeply that available stack memory runs out. Underflow means the opposite: attempting to pop or peek an already-empty stack, where there's nothing left to remove." },
      { question: "Scenario: you're building undo/redo. Why use two separate stacks instead of one?", answer: "Undoing an action needs to pop it off an undo stack, but that action must then be available to redo later — which means pushing it onto a *separate* redo stack. A single stack can't simultaneously represent 'actions waiting to be undone' and 'actions that were undone and could be reapplied' as two distinct, independently poppable sequences." },
      { question: "How would you sort a stack into ascending order using only one additional stack?", answer: "Repeatedly pop from the original stack; for each popped element, pop elements off the auxiliary (sorted) stack back onto the original stack until the auxiliary stack's top is not greater than the current element, then push the current element onto the auxiliary stack. Repeating until the original stack is empty leaves the auxiliary stack sorted, though at O(n²) time since each insertion can require re-shuffling much of the auxiliary stack." },
      { question: "Why is a stack the natural structure for validating that HTML/XML tags are properly nested and closed?", answer: "Each opening tag is pushed onto the stack. Each closing tag must match the most recently opened, still-unclosed tag — exactly the stack's top — so popping and comparing on every closing tag directly checks proper nesting, the same way bracket matching does." },
    ],
    prerequisites: ["linked-lists"],
    relatedTopics: ["queue", "recursion", "linked-lists"],
    keywords: ["stack", "LIFO", "push", "pop", "call stack"],
  },
  {
    id: "queue",
    title: "Queue",
    level: "intermediate",
    description: "A structure where the first item added is always the first one removed.",
    explanation: `
Some problems need to be processed in the exact order they arrived — a
printer processing print jobs, customer support tickets, tasks waiting to
run. A **queue** models this directly: items are added at the back and
removed from the front, so whatever arrived first leaves first.

This rule is called **FIFO** — First In, First Out.
    `.trim(),
    analogy:
      "A queue is like a line at a coffee shop. New people join at the back, and the person who's been waiting longest is always served next, from the front.",
    examples: [
      {
        title: "Using an array as a queue",
        code: `const queue = [];

queue.push("first");  // ["first"]
queue.push("second");  // ["first", "second"]

console.log(queue.shift()); // "first" — removes and returns the front item
console.log(queue);         // ["second"]`,
        explanation:
          "`push` adds to the back; `shift` removes from the front — together they behave like a queue. Note that `shift` is O(n) on a plain array since every remaining item shifts down.",
        walkthrough: [
          { code: "const queue = [];", explanation: "An empty array, used here as a queue." },
          { code: 'queue.push("first");', explanation: 'Adds "first" to the back.' },
          { code: 'queue.push("second");', explanation: 'Adds "second" to the back, behind "first".' },
          { code: "queue.shift();", explanation: 'Removes and returns the front item, "first", leaving ["second"].' },
        ],
      },
    ],
    howItWorks: `
A queue exposes two main operations: **enqueue** (add to the back) and
**dequeue** (remove from the front). Conceptually both should be O(1); in
JavaScript, using a plain array's \`.shift()\` is actually O(n) because
everything has to shift down, so real-world queues are often implemented
with a linked list to keep both ends O(1).
    `.trim(),
    diagram: `
enqueue("A")  enqueue("B")  dequeue()
     ↓             ↓            ↓
   [A]           [A,B]      returns "A", leaves [B]
    `.trim(),
    whyItExists: `
Queues naturally model anything processed in arrival order: task
scheduling, message processing, handling requests in the order they came
in, and breadth-first traversal of trees and graphs.
    `.trim(),
    whenToUse: `
Reach for a queue whenever things must be handled in the exact order
they arrived — a task queue, a message queue, print jobs, or breadth-first
traversal of a tree or graph.
    `.trim(),
    whenNotToUse: `
If the most recent item should be handled first instead of the oldest,
you want a stack, not a queue. And for a high-throughput queue in real
code, avoid a plain array's \`.shift()\` — reach for a linked-list-based
queue or a dedicated library instead.
    `.trim(),
    commonMistakes: [
      "Confusing a queue's FIFO order with a stack's LIFO order.",
      "Using `.shift()` on a large array in performance-sensitive code without realizing it's O(n), not O(1).",
      "Forgetting to check whether a queue is empty before dequeuing.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Implement a `Queue` class with `enqueue` and `dequeue` methods." },
      { difficulty: "Medium", prompt: "Use a queue to simulate people being served in a waiting line, printing the order they're served in." },
      { difficulty: "Hard", prompt: "Use a queue to implement a breadth-first traversal over a simple tree of nested objects." },
    ],
    interviewQuestions: [
      { question: "What does FIFO mean?", answer: "First In, First Out — the earliest added item is always the first one removed." },
      { question: "What's a real-world use of a queue in software?", answer: "Task/job scheduling, request handling, and breadth-first search over trees and graphs." },
      { question: "Why is `.shift()` on a JavaScript array not ideal for a high-performance queue?", answer: "Because it's O(n) — every remaining element has to move down by one index. A linked-list-based queue keeps both ends O(1)." },
    ],
    prerequisites: ["stack"],
    relatedTopics: ["stack", "linked-lists"],
    keywords: ["queue", "FIFO", "enqueue", "dequeue"],
  },
  {
    id: "hash-tables",
    title: "Hash Tables",
    level: "intermediate",
    description: "A structure that lets you look up a value almost instantly using a key, instead of searching through everything.",
    explanation: `
Searching an array for a value means checking items one at a time until
you find it — slow once there's a lot of data. A **hash table** solves
this by converting a key (like a name or an id) into a number using a
**hash function**, and using that number to jump directly to where the
value is stored. In JavaScript, plain objects and the \`Map\` class are both
backed by this idea.
    `.trim(),
    analogy:
      "A hash table is like a coat check at a theater. Instead of searching through every coat to find yours, you're handed a numbered ticket (the hash), and the attendant goes directly to that numbered spot to retrieve your coat.",
    examples: [
      {
        title: "Using an object (or Map) as a hash table",
        code: `const ages = {};

ages["amara"] = 28;
ages["diego"] = 34;

console.log(ages["amara"]); // 28 — near-instant lookup, not a search

const map = new Map();
map.set("amara", 28);
console.log(map.get("amara")); // 28`,
        walkthrough: [
          { code: "const ages = {};", explanation: "An empty object, used here as a hash table." },
          { code: 'ages["amara"] = 28;', explanation: 'Stores 28 under the key "amara".' },
          { code: 'ages["diego"] = 34;', explanation: "Stores 34 under a different key." },
          { code: 'ages["amara"]', explanation: 'Jumps directly to the slot for "amara" — no scanning required.' },
        ],
      },
    ],
    howItWorks: `
A hash function takes a key and converts it into a number (a "hash") that
maps to a specific storage slot. Looking up a key just means: hash the
key, jump to that slot, and read the value — no scanning required. When
two different keys happen to hash to the same slot (a "collision"), the
table has strategies (like storing a small list at that slot) to handle
it correctly.
    `.trim(),
    diagram: `
key "amara"
       ↓ hash function
    number: 42
       ↓
   slot 42 → 28
    `.trim(),
    whyItExists: `
Hash tables give near-instant lookups, insertions, and deletions on
average — O(1) — which makes them essential for counting frequencies,
caching results, deduplicating data, and implementing sets and dictionaries
efficiently.
    `.trim(),
    whenToUse: `
Reach for a hash table (object or Map) whenever you need to look
something up by a key quickly — counting occurrences, checking for
duplicates, caching results, or building a dictionary of any kind.
    `.trim(),
    whenNotToUse: `
If order matters and you need to process items in a specific sequence, a
hash table doesn't guarantee position the way an array does. And for a
small, fixed handful of values, just checking each one directly can beat
setting up a hash table at all.
    `.trim(),
    commonMistakes: [
      "Assuming object/array key order is always guaranteed in every situation — it mostly is in modern JavaScript for string keys, but it's a detail worth knowing rather than relying on blindly.",
      "Using an object when a `Map` would be safer, e.g. when keys aren't simple strings or when key order and size (`.size`) matter.",
      "Forgetting that average-case O(1) lookup can degrade if many keys collide (a rare but real edge case).",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use an object to count how many times each word appears in a sentence." },
      { difficulty: "Medium", prompt: "Write a function that returns `true` if an array contains any duplicate values, using a hash table for O(n) performance." },
      { difficulty: "Hard", prompt: "Solve the 'two sum' problem (find two numbers in an array that add up to a target) in O(n) time using a hash table." },
    ],
    interviewQuestions: [
      { question: "What is a hash function?", answer: "A function that converts a key into a number used to determine where its value is stored, ideally spreading keys evenly across storage slots." },
      { question: "What is the average time complexity of a hash table lookup?", answer: "O(1) on average, since the hash function typically jumps directly to the right slot." },
      { question: "What is a hash collision, and how is it handled?", answer: "A collision happens when two different keys hash to the same slot. It's commonly handled by storing multiple entries at that slot (e.g. in a small list) and checking each one." },
    ],
    prerequisites: ["arrays"],
    relatedTopics: ["arrays", "strings", "big-o"],
    keywords: ["hash table", "hash map", "hash function", "collision", "dictionary"],
  },
  {
    id: "recursion",
    title: "Recursion",
    level: "intermediate",
    description: "A function that solves a problem by calling itself on a smaller version of the same problem.",
    explanation: `
Some problems are naturally defined in terms of smaller versions of
themselves — finding the total of a list, exploring every folder inside a
folder, calculating a factorial. **Recursion** is when a function solves
such a problem by calling itself with a smaller input, until the input is
simple enough to answer directly (the **base case**).

Every recursive function needs two things: a base case that stops the
recursion, and a step that reduces the problem toward that base case.
    `.trim(),
    analogy:
      "Recursion is like a set of Russian nesting dolls. To find the smallest doll, you open one doll to reveal a smaller one inside, and repeat — until you reach the smallest doll that doesn't open any further. That smallest doll is the base case.",
    examples: [
      {
        title: "Factorial using recursion",
        code: `function factorial(n) {
  if (n <= 1) return 1;       // base case
  return n * factorial(n - 1); // recursive case
}

console.log(factorial(4)); // 4 * 3 * 2 * 1 = 24`,
        explanation:
          "Each call reduces `n` by 1 and calls itself again, until `n` reaches 1 — the base case — at which point the calls start returning back up the chain.",
        walkthrough: [
          { code: "function factorial(n) {", explanation: "Defines a function that will call itself." },
          { code: "if (n <= 1) return 1;", explanation: "The base case — stops the recursion once n is small enough." },
          { code: "return n * factorial(n - 1);", explanation: "The recursive case — multiplies n by the result of solving a smaller version of the same problem." },
        ],
      },
    ],
    howItWorks: `
Each call to a recursive function is placed on the call stack, waiting for
the call it made to finish and return a value. Once the base case is
reached, the calls resolve in reverse order — like unwinding a stack of
plates — each one multiplying or combining its result with what it gets
back, until the original call finally returns.
    `.trim(),
    diagram: `
factorial(4)
  → 4 * factorial(3)
       → 3 * factorial(2)
            → 2 * factorial(1)
                 → returns 1 (base case)
            → returns 2 * 1 = 2
       → returns 3 * 2 = 6
  → returns 4 * 6 = 24
    `.trim(),
    whyItExists: `
Some structures and problems (folders inside folders, trees, certain
mathematical definitions) are naturally recursive — describing them without
recursion often requires extra bookkeeping that a recursive function
handles automatically through the call stack.
    `.trim(),
    whenToUse: `
Reach for recursion when a problem is naturally defined in terms of a
smaller version of itself — traversing nested folders, walking a tree, or
classic divide-and-conquer algorithms like merge sort.
    `.trim(),
    whenNotToUse: `
For a problem that's really just "do this N times in a row" (like
summing a flat array), a loop is usually clearer and avoids the memory
cost of piling up function calls on the stack. Watch recursion depth on
very large inputs — too many nested calls can overflow the call stack.
    `.trim(),
    commonMistakes: [
      "Forgetting the base case, causing infinite recursion until the program crashes ('stack overflow').",
      "Writing a recursive case that doesn't actually move closer to the base case.",
      "Using recursion for a simple problem a loop would solve more efficiently and clearly.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a recursive function that sums all numbers from 1 to n." },
      { difficulty: "Medium", prompt: "Write a recursive function that reverses a string." },
      { difficulty: "Hard", prompt: "Write a recursive function that returns all subsets of a given array." },
    ],
    interviewQuestions: [
      { question: "What two things does every recursive function need?", answer: "A base case that stops the recursion, and a recursive step that moves the input closer to that base case." },
      { question: "What causes a 'stack overflow' in recursion?", answer: "Recursing too deeply (or infinitely, due to a missing/broken base case) fills up the call stack beyond its limit." },
      { question: "When would you prefer recursion over a loop?", answer: "When the problem is naturally recursive in structure — like traversing trees, nested data, or divide-and-conquer algorithms — where recursion reads more clearly than manual bookkeeping." },
    ],
    prerequisites: ["stack"],
    relatedTopics: ["stack", "binary-search"],
    keywords: ["recursion", "base case", "call stack", "stack overflow"],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    level: "intermediate",
    description: "A fast way to find a value in a sorted list by repeatedly cutting the search area in half.",
    explanation: `
If you search a list one item at a time, finding a value in a million-item
list could take up to a million checks. But if the list is **sorted**,
there's a much faster way: check the middle item. If it's too big, the
answer must be in the left half; if it's too small, it must be in the
right half. Repeating this — always looking at the middle of whatever's
left — is called **binary search**, and it can find a value in a
million-item list in about 20 checks instead of a million.
    `.trim(),
    analogy:
      "It's how you'd find a word in a paper dictionary: you don't start at page 1. You open to the middle, see you've gone too far or not far enough, and jump to the middle of the correct half — repeating until you land on the word.",
    examples: [
      {
        title: "Binary search implementation",
        code: `function binarySearch(sortedArray, target) {
  let low = 0;
  let high = sortedArray.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (sortedArray[mid] === target) return mid;
    if (sortedArray[mid] < target) {
      low = mid + 1; // search the right half
    } else {
      high = mid - 1; // search the left half
    }
  }

  return -1; // not found
}`,
        walkthrough: [
          { code: "let low = 0; let high = sortedArray.length - 1;", explanation: "Marks the current search range — the whole array, to start." },
          { code: "const mid = Math.floor((low + high) / 2);", explanation: "Picks the middle index of the current range." },
          { code: "if (sortedArray[mid] === target) return mid;", explanation: "Found it — return immediately." },
          { code: "low = mid + 1; / high = mid - 1;", explanation: "Narrows the range to whichever half could still contain the target." },
        ],
      },
    ],
    howItWorks: `
Each check eliminates half of the remaining possibilities. Starting with
\`n\` items, after one check there are \`n/2\` left to consider, then \`n/4\`,
then \`n/8\` — this halving is what makes binary search take only about
\`log2(n)\` steps, dramatically fewer than checking every item.
    `.trim(),
    diagram: `
[1,3,5,7,9,11,13] — looking for 11
        ↓ check middle (7) → too small → search right half
   [9,11,13]
        ↓ check middle (11) → found!
    `.trim(),
    whyItExists: `
Binary search is one of the clearest demonstrations of why algorithm
choice matters: the same problem, solved with a smarter approach on sorted
data, goes from O(n) to O(log n) — a difference that becomes enormous as
data grows.
    `.trim(),
    whenToUse: `
Reach for binary search whenever you're repeatedly searching a large,
sorted collection — it turns an O(n) scan into an O(log n) lookup, which
matters a lot once the data gets big.
    `.trim(),
    whenNotToUse: `
If your data isn't sorted and can't easily be kept sorted, binary search
doesn't apply — sorting it first costs more than a single linear search
would. And for a very small list, the overhead of tracking low/high/mid
isn't worth it over just checking each item.
    `.trim(),
    commonMistakes: [
      "Using binary search on data that isn't sorted — it silently gives wrong answers instead of erroring.",
      "Getting the `low`/`high` update backwards, causing an infinite loop or skipped elements.",
      "Off-by-one errors in the midpoint calculation or the boundary updates.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Implement binary search for a sorted array of numbers, returning the index of a target value." },
      { difficulty: "Medium", prompt: "Modify binary search to return the index where a value *should* be inserted to keep the array sorted, even if it isn't found." },
      { difficulty: "Hard", prompt: "Use binary search to find the smallest number in a sorted array that has been rotated (e.g. `[4,5,6,1,2,3]`)." },
    ],
    interviewQuestions: [
      { question: "What is required for binary search to work?", answer: "The data must be sorted — binary search relies on being able to rule out half the remaining data based on a single comparison." },
      { question: "What is the time complexity of binary search?", answer: "O(log n), since each step cuts the remaining search space in half." },
      { question: "Why is O(log n) so much better than O(n) for large inputs?", answer: "Because logarithmic growth is extremely slow — doubling the input only adds one more step, whereas linear growth doubles the work." },
    ],
    prerequisites: ["arrays", "recursion"],
    relatedTopics: ["big-o", "arrays", "recursion"],
    keywords: ["binary search", "sorted array", "log n", "divide and conquer"],
  },
];
