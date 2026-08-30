import type { Topic } from "../../types/content";

export const dsaAdvancedTopics: Topic[] = [
  {
    id: "sorting",
    title: "Sorting",
    level: "advanced",
    description: "Arranging a list of items into order — and why different approaches to it matter a lot at scale.",
    explanation: `
Putting a list into order (numbers ascending, names alphabetical) seems
simple, but there are many different ways to do it — and they don't all
scale the same way. Some simple approaches are easy to understand but slow
down badly on large lists (O(n²)); smarter approaches stay efficient even
with huge amounts of data (O(n log n)).

Understanding a few core sorting strategies teaches patterns — comparing,
swapping, dividing problems into smaller pieces — that show up constantly
elsewhere in programming.
    `.trim(),
    analogy:
      "Imagine sorting a messy hand of playing cards. You could repeatedly compare each pair of neighboring cards and swap them if they're out of order, making pass after pass until nothing needs swapping (simple, but slow with many cards — like bubble sort), or split the hand in half, sort each half, and merge them back together in order (more clever, and much faster for a big hand — like merge sort).",
    examples: [
      {
        title: "Bubble sort (simple, but O(n²))",
        code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // swap
      }
    }
  }
  return arr;
}`,
        explanation:
          "Bubble sort repeatedly swaps adjacent out-of-order items. It's easy to understand, but the nested loops make it O(n²) — slow for large arrays.",
        walkthrough: [
          { code: "for (let i = 0; i < arr.length; i++) {", explanation: "Runs one full pass over the array for every item — part of what makes this O(n²)." },
          { code: "for (let j = 0; j < arr.length - i - 1; j++) {", explanation: "Within each pass, compares every pair of neighbors, shrinking slightly as sorted items settle at the end." },
          { code: "if (arr[j] > arr[j + 1]) {", explanation: "Checks whether two neighbors are out of order." },
          { code: "[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];", explanation: "Swaps them so the larger value moves one step closer to the end." },
        ],
      },
      {
        title: "Using the built-in sort",
        code: `const numbers = [5, 2, 9, 1];
numbers.sort((a, b) => a - b); // [1, 2, 5, 9]`,
        explanation:
          "In real code, you'd almost always use the built-in `.sort()`, which uses an efficient algorithm internally (commonly a variant of merge sort or timsort).",
      },
    ],
    howItWorks: `
Most simple sorting algorithms (like bubble sort) repeatedly compare
neighboring items and swap them if they're in the wrong order, needing
many passes over the data — O(n²). Faster algorithms (like merge sort) use
a "divide and conquer" strategy: split the list in half, sort each half
recursively, then merge the two sorted halves back together.

The \`log n\` in O(n log n) comes from the same halving idea used in binary
search: splitting a list of size n in half, then in half again, and so on,
only takes about log₂(n) rounds before you're down to single items. Merge
sort does that splitting (log n levels), and then spends O(n) work merging
everything back together at each level — giving O(n log n) overall.
    `.trim(),
    diagram: `
Merge sort:
[5, 2, 9, 1]
   ↓ split
[5, 2]     [9, 1]
   ↓ split     ↓ split
[5] [2]     [9] [1]
   ↓ merge     ↓ merge
 [2, 5]     [1, 9]
        ↓ merge
   [1, 2, 5, 9]
    `.trim(),
    whyItExists: `
Sorted data unlocks faster algorithms elsewhere — like binary search — and
many real systems (search results, leaderboards, logs) need to display
data in order. Studying sorting algorithms also teaches transferable
techniques: comparison, swapping, and divide-and-conquer thinking.
    `.trim(),
    whenToUse: `
Reach for sorting whenever the order you present data in matters —
leaderboards, search results, alphabetized lists — or as groundwork for a
faster algorithm downstream, like binary search, which needs sorted data
to work at all.
    `.trim(),
    whenNotToUse: `
Don't sort data you're only going to scan once looking for a single
value — a plain linear search is cheaper in that case. And in production
code, don't hand-write a sort algorithm at all; the built-in \`.sort()\` is
well-tested and normally faster than anything you'd write by hand.
    `.trim(),
    commonMistakes: [
      "Reimplementing your own sort in production code instead of using the built-in, well-tested `.sort()`.",
      "Forgetting that JavaScript's default `.sort()` compares items as strings unless you provide a comparator function — `[10, 2, 1].sort()` gives `[1, 10, 2]` without one.",
      "Assuming all sorting algorithms perform the same — an O(n²) algorithm can be dramatically slower once data grows past a few thousand items.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Implement bubble sort and test it on a small array of numbers." },
      { difficulty: "Medium", prompt: "Implement merge sort using recursion, splitting an array in half and merging sorted halves." },
      { difficulty: "Hard", prompt: "Implement quicksort, and explain in your own words how it picks a 'pivot' to divide the array." },
    ],
    interviewQuestions: [
      { question: "What is the time complexity of bubble sort, and why?", answer: "O(n²) — it uses nested loops, comparing and swapping pairs of elements repeatedly across multiple full passes over the array." },
      { question: "How does merge sort achieve O(n log n)?", answer: "By recursively splitting the array in half (log n levels of splitting) and merging sorted halves in linear time at each level." },
      { question: "Why would you use the built-in `.sort()` instead of writing your own?", answer: "Built-in implementations are heavily optimized and tested; writing your own is mainly useful for learning the underlying algorithms, not for production use." },
    ],
    prerequisites: ["recursion", "arrays", "binary-search"],
    relatedTopics: ["big-o", "arrays", "recursion", "binary-search"],
    keywords: ["sorting", "bubble sort", "merge sort", "quicksort", "divide and conquer"],
  },
];
