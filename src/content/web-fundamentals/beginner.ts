import type { Topic } from "../../types/content";

export const webFundamentalsBeginnerTopics: Topic[] = [
  {
    id: "how-the-web-works",
    title: "How the Web Works",
    level: "beginner",
    description:
      "What actually happens, step by step, between typing a web address and seeing a page appear on screen.",
    explanation: `
Type an address into a browser and press enter, and a page shows up a
moment later. That moment feels instant, but it's actually a whole chain
of hand-offs happening across machines you'll never see.

First, your browser needs to figure out *which computer* on the internet
is responsible for that address — the address you typed is a
human-friendly name, not a location a computer can dial directly. So
there's a lookup step that turns the name into a numeric address for a
specific machine somewhere in the world.

Once your browser knows which machine to talk to, it sends that machine a
request — basically a structured message saying "please send me the page
at this address." That machine (a **server**) is a computer that sits
listening for exactly these kinds of requests, all day, from anyone who
asks.

The server figures out what to send back — it might be a file sitting on
disk, or it might build the response fresh by pulling data from a
database — and sends a response back across the same connection. That
response usually contains a document, written in a language browsers
understand, describing the content and structure of the page.

Finally, your browser takes that document and turns it into the visual
page you actually see: it reads through the document, fetches any extra
files it references (images, styling, additional code), and paints
everything onto the screen in the right positions with the right colors
and fonts.

All of this — the lookup, the request, the response, the rendering — is
what people mean when they say "the web works." Later topics give names
to each of these pieces individually.
  `.trim(),
    analogy:
      "It's like mailing a letter to a company using only their name — a directory first looks up their street address, the letter travels there, an employee reads it and writes a reply, and that reply travels all the way back to your mailbox.",
    examples: [
      {
        title: "The trip a request takes",
        code: `1. You type: example.com
2. Browser looks up which server "example.com" points to
3. Browser sends: "GET / please"
4. Server sends back: an HTML document
5. Browser reads the document and displays it`,
        explanation:
          "This is the whole round trip in plain steps — no protocol names needed yet, just the shape of the conversation.",
        walkthrough: [
          { code: "You type: example.com", explanation: "You give the browser a human-readable name, not a machine address." },
          { code: "Browser looks up which server...", explanation: "A lookup step translates the name into the actual location of a server." },
          { code: 'Browser sends: "GET / please"', explanation: "The browser asks that server for a specific page — here, the homepage." },
          { code: "Server sends back: an HTML document", explanation: "The server responds with the content and structure of the page." },
          { code: "Browser reads the document and displays it", explanation: "The browser turns that document into the visual page you see." },
        ],
      },
      {
        title: "A page is rarely just one file",
        code: `index.html          <- the page structure
  ├── styles.css     <- fetched separately, for appearance
  ├── logo.png       <- fetched separately, an image
  └── app.js         <- fetched separately, for behavior`,
        explanation:
          "The first document the browser gets almost always references more files. The browser reads it, notices those references, and goes and fetches each one — often several requests, not just one.",
      },
    ],
    howItWorks: `
Under the hood, this whole process rests on a few cooperating systems: a
naming system that maps human-readable addresses to machine locations, a
network that can carry messages between any two connected computers, and
an agreed-upon format both browser and server understand for asking for
and describing a page.

None of these steps require you to think about wires or cables directly —
your operating system and browser handle the actual networking. What
matters at this level is the sequence: look up, request, respond, render.
  `.trim(),
    diagram: `
[ You ]  --type address-->  [ Browser ]
                                 |
                          1. look up server
                                 |
                                 v
                          [ Naming lookup ]
                                 |
                          2. send request
                                 v
                            [  Server  ]
                                 |
                          3. send response
                                 v
                          [ Browser renders ]
                                 |
                                 v
                          [   Page shown   ]
  `.trim(),
    whyItExists: `
This layered process exists because the web was designed to connect
*any* browser to *any* server, run by different people, on different
machines, anywhere in the world. Breaking the problem into separate
steps — naming, requesting, responding, rendering — meant each piece
could be built, understood, and improved independently, and it's the
reason typing an address into any browser reliably works no matter who
built that browser or who runs that server.
  `.trim(),
    whenToUse: `
Understanding this flow matters any time something on a website is slow
or broken and you need to reason about *where* the problem is — is the
lookup failing, is the server not responding, or is the page failing to
render once it arrives? Every deeper web topic (HTTP, DNS, rendering,
caching) is really just a closer look at one step of this same journey.
  `.trim(),
    whenNotToUse: `
You don't need to think about this whole chain for everyday tasks like
writing HTML or styling a button — those live entirely inside the
"render" step. This mental model is most useful when something crosses
the boundary between browser and server, or when things go wrong.
  `.trim(),
    commonMistakes: [
      "Thinking the address you type is the server's actual location, rather than a name that gets looked up.",
      "Assuming a webpage is a single file, when it's usually a document plus many separately fetched files.",
      "Believing the page 'just appears' rather than being built by the browser step by step after the response arrives.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "In your own words, list the four major steps that happen between typing an address and seeing a page." },
      { difficulty: "Medium", prompt: "Open your browser's developer tools, go to the Network panel, and reload a page. Count how many separate files were fetched to build that one page." },
      { difficulty: "Hard", prompt: "Explain what might go wrong at each of the four steps (lookup, request, response, render) and how the symptom would look different to a user in each case." },
    ],
    interviewQuestions: [
      { question: "At a high level, what happens between typing a URL and seeing a page?", answer: "The browser looks up which server the address belongs to, sends that server a request, receives a response containing the page's content, and then renders that content on screen." },
      { question: "Is a webpage usually a single file?", answer: "No. The initial document typically references additional files — stylesheets, images, scripts — that the browser fetches separately." },
      { question: "Why does the web need a naming lookup step at all?", answer: "Because humans use readable names for websites, but computers need a specific machine address to actually connect to; the lookup step translates between the two." },
    ],
    relatedTopics: ["html-basics", "browser-rendering"],
    keywords: ["web", "internet", "request", "response", "server", "browser", "how the web works"],
  },
  {
    id: "html-basics",
    title: "HTML Basics",
    level: "beginner",
    description:
      "The language used to describe what's on a page and how it's structured — not what it looks like.",
    explanation: `
Before a page can be styled or made interactive, something has to say
*what's actually on it*: here's a heading, here's a paragraph, here's a
picture, here's a link. That description of content and structure is
written in a language called **HTML** (HyperText Markup Language).

HTML doesn't care about colors, fonts, or spacing — that's a separate
job, handled by CSS. HTML's only job is to say what each piece of
content *is* and how the pieces relate to each other: this text is the
main heading, this block is a list, this image belongs here, this text
is a link to another page.

You write HTML using **tags** — short instructions wrapped in angle
brackets, like \`<p>\` for a paragraph. Most tags come in a pair: an
opening tag and a matching closing tag, with content in between. An
opening tag, its closing tag, and everything between them together form
an **element**. Tags can also carry extra information called
**attributes** — for example, an image tag needs an attribute telling
the browser which image file to show.

Using tags that describe the actual *meaning* of content — a heading tag
for a heading, a button tag for a button — rather than generic
tags for everything, is called **semantic HTML**, and it matters more
than it might seem: it's what lets screen readers, search engines, and
other tools understand your page, not just display it.
  `.trim(),
    analogy:
      "HTML is like the labeled outline of a document — 'this is the title,' 'this is a bullet list,' 'this is a footnote' — written before anyone has decided what font or color anything will be.",
    examples: [
      {
        title: "A minimal page",
        code: `<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Welcome</h1>
    <p>This is a paragraph of text.</p>
  </body>
</html>`,
        explanation:
          "Every HTML page has this same basic shape: a declaration of what kind of document it is, then a head with page metadata, then a body with the visible content.",
        walkthrough: [
          { code: "<!DOCTYPE html>", explanation: "Tells the browser this document is written in modern HTML, so it renders it accordingly." },
          { code: "<html> ... </html>", explanation: "Wraps the entire page — everything belongs inside this one element." },
          { code: "<head> <title>My Page</title> </head>", explanation: "Holds information about the page itself, like the title shown in the browser tab, rather than visible content." },
          { code: "<body> ... </body>", explanation: "Contains everything the user actually sees rendered on the page." },
          { code: "<h1>Welcome</h1>", explanation: "A heading element — this text is marked as the page's main heading, not just large text." },
          { code: "<p>This is a paragraph of text.</p>", explanation: "A paragraph element, wrapping a block of body text." },
        ],
      },
      {
        title: "Attributes and semantic elements",
        code: `<img src="cat.jpg" alt="A sleeping orange cat">

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

<button type="submit">Send</button>`,
        explanation:
          "src and alt are attributes on the image tag, providing extra detail the tag alone doesn't carry. nav and button are semantic elements — they tell the browser and assistive tools what role this content plays, not just how it looks.",
      },
    ],
    howItWorks: `
When a browser receives an HTML document, it reads through the tags from
top to bottom and builds an internal tree structure out of them — each
element becomes a node, nested inside whichever element contains it.
That internal tree is what the browser actually uses to render and later
lets JavaScript modify; the original HTML text is just the starting
blueprint for building it.
  `.trim(),
    whyItExists: `
HTML exists to separate *what content is* from *how it looks* and *how it
behaves*. By having one dedicated, simple language just for structure and
meaning, browsers, search engines, screen readers, and countless other
tools can all agree on how to interpret any page on the web, regardless
of who built it or what it's styled to look like.
  `.trim(),
    whenToUse: `
Every webpage needs HTML — it's the one layer that's never optional.
Reach for the semantically correct tag whenever one exists: a button for
something clickable that performs an action, a heading tag for a real
heading, a list for a genuine list — rather than styling a generic
element to merely look the part.
  `.trim(),
    whenNotToUse: `
HTML isn't the place to control appearance (that's CSS) or behavior
(that's JavaScript). Reaching for extra HTML tags purely to force a
visual effect, instead of using CSS for that job, tends to produce
confusing, hard-to-maintain markup.
  `.trim(),
    commonMistakes: [
      "Using a generic element styled to look like a button instead of an actual button element, which breaks keyboard and screen-reader support.",
      "Forgetting to close tags, which can cause the browser to misinterpret how content is nested.",
      "Treating an image's alt attribute as optional decoration text rather than a real description used by screen readers.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a minimal HTML page with a title, one heading, and one paragraph." },
      { difficulty: "Medium", prompt: "Build a simple page with a navigation bar (nav), a list of three items, and an image with meaningful alt text." },
      { difficulty: "Hard", prompt: "Take a page built with only generic div elements and rewrite it using semantic tags (header, nav, main, button, footer) where appropriate, and explain each change." },
    ],
    interviewQuestions: [
      { question: "What is HTML responsible for, and what is it not responsible for?", answer: "HTML describes the structure and meaning of content on a page. It is not responsible for visual styling (CSS) or interactive behavior (JavaScript)." },
      { question: "What's the difference between a tag, an element, and an attribute?", answer: "A tag is the bracketed instruction like <p>. An element is the opening tag, its content, and its closing tag together. An attribute is extra information placed inside an opening tag, like src or href." },
      { question: "What is semantic HTML and why does it matter?", answer: "Using tags that describe the actual meaning of content, like nav or button, instead of generic tags for everything. It matters because screen readers, search engines, and browsers rely on that meaning, not just visual appearance." },
    ],
    relatedTopics: ["how-the-web-works", "css-basics", "the-dom"],
    keywords: ["html", "tags", "elements", "attributes", "semantic html", "markup"],
  },
  {
    id: "css-basics",
    title: "CSS Basics",
    level: "beginner",
    description:
      "The language used to control how a page looks, kept deliberately separate from what the page contains.",
    explanation: `
HTML says what's on a page — a heading, a paragraph, an image. But it
says nothing about what color that heading should be, how big the text
is, or how much space sits around the image. That's an entirely separate
job, handled by a language called **CSS** (Cascading Style Sheets).

Keeping style separate from structure means the same HTML content can
look completely different depending on which styles are applied to it —
and it means one set of style rules can be reused across many pages,
instead of having to redefine "make this text blue" everywhere blue text
appears.

CSS works by writing **rules**: a **selector** that says *which*
elements the rule applies to, followed by one or more **properties** and
values that say *what* to change about them. A property might be
\`color\`, \`font-size\`, or \`margin\`; the value is the specific setting,
like \`blue\` or \`16px\`.

It's common for more than one rule to apply to the same element at once —
maybe a general rule styles all paragraphs, while a more specific rule
targets just one particular paragraph. The set of rules the browser
follows to decide which value wins when rules conflict is called the
**cascade**, and it's where CSS gets its name.
  `.trim(),
    analogy:
      "If HTML is a document's labeled outline, CSS is the style guide applied on top of it afterward — 'make all headings blue, add spacing between paragraphs' — without changing a word of the actual content.",
    examples: [
      {
        title: "A basic rule",
        code: `p {
  color: darkslategray;
  font-size: 16px;
  line-height: 1.5;
}`,
        explanation:
          "This rule targets every paragraph element on the page and sets its text color, font size, and line spacing.",
        walkthrough: [
          { code: "p {", explanation: "The selector — this rule applies to every <p> element in the document." },
          { code: "color: darkslategray;", explanation: "A property (color) and a value (darkslategray) — sets the text color." },
          { code: "font-size: 16px;", explanation: "Sets how large the text renders." },
          { code: "line-height: 1.5;", explanation: "Sets the vertical spacing between lines of text within the paragraph." },
        ],
      },
      {
        title: "The cascade in action",
        code: `p { color: black; }
.highlight { color: orange; }
#intro { color: red; }`,
        explanation:
          "If one paragraph has both class=\"highlight\" and id=\"intro\", all three rules could apply to it. CSS resolves the conflict using specificity and order — here, the id selector wins, so that paragraph renders red, not orange or black.",
      },
    ],
    howItWorks: `
When a browser renders a page, it reads all the CSS that applies —
whether from a separate stylesheet file, a style tag, or inline on an
element — and matches each rule's selector against the elements in the
page. For every element, it collects every rule that could apply, then
uses a set of tie-breaking rules (roughly: more specific selectors win,
and later rules win over earlier ones when specificity ties) to decide
the final value for each property.
  `.trim(),
    whyItExists: `
CSS exists so that appearance doesn't have to be tangled up inside
content. Before this separation existed, changing a site's look meant
editing styling scattered across every single page. With CSS, one
stylesheet can restyle an entire site, and the same content can be
presented differently for different contexts, like print versus screen.
  `.trim(),
    whenToUse: `
Reach for CSS for anything about *how* a page looks or is arranged:
colors, spacing, fonts, sizing, positioning, and layout. Prefer a shared
stylesheet over one-off inline styles whenever a look needs to be
consistent across multiple elements or pages.
  `.trim(),
    whenNotToUse: `
CSS isn't the tool for describing what content actually is (that's
HTML's job) or for making a page react to user actions with new
behavior beyond simple visual states (that's JavaScript's job, though
CSS alone can handle small interactive touches like hover effects).
  `.trim(),
    commonMistakes: [
      "Being surprised a style 'isn't applying' without realizing a more specific rule elsewhere is overriding it.",
      "Overusing inline styles instead of a shared stylesheet, making the same visual change hard to apply consistently.",
      "Forgetting that rule order matters when specificity is equal — a later rule with the same specificity wins.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a CSS rule that makes all h1 elements on a page green and centered." },
      { difficulty: "Medium", prompt: "Create three rules that could all apply to the same element (by tag, class, and id) and predict which value wins for a shared property." },
      { difficulty: "Hard", prompt: "Given a small HTML page with existing conflicting styles, trace through the cascade by hand to determine the final rendered color of a specific element." },
    ],
    interviewQuestions: [
      { question: "What problem does CSS solve that HTML alone doesn't?", answer: "HTML describes structure and content, but not appearance. CSS controls how that content looks, kept separate so styling can be reused and changed independently of content." },
      { question: "What is a CSS selector?", answer: "The part of a CSS rule that determines which elements the rule's properties apply to, such as a tag name, class, or id." },
      { question: "What is 'the cascade' in CSS?", answer: "The set of rules the browser uses to decide which value wins when multiple CSS rules apply to the same element and property, based on specificity and order." },
    ],
    relatedTopics: ["html-basics", "browser-rendering", "css-layout"],
    keywords: ["css", "styling", "selectors", "properties", "cascade", "specificity"],
  },
  {
    id: "the-dom",
    title: "The DOM",
    level: "beginner",
    description:
      "The live, in-memory version of a page's structure that a browser builds and that JavaScript can read and change.",
    explanation: `
The HTML you write is just text in a file — it's the *starting
instructions* for a page, not the page itself while it's running. The
moment a browser loads that HTML, it reads through it and builds a
completely separate, living representation of the page in memory: a tree
of objects, one for each element, each one knowing its content,
attributes, and which elements are nested inside which.

That in-memory tree is called the **DOM** — the Document Object Model.
It's what the browser actually uses to draw the page on screen, and
crucially, it's what JavaScript reaches into when it wants to change
something after the page has loaded: add a new item to a list, change a
heading's text, remove an element entirely.

This distinction matters: editing the original HTML file does nothing to
a page that's already open in a browser. But changing the DOM does —
because the DOM, not the original file, is the thing currently being
rendered. Open a browser's developer tools and inspect an element, and
you're looking at the live DOM, which may no longer match the HTML that
was first sent down.
  `.trim(),
    analogy:
      "The original HTML file is like a printed recipe. The DOM is the actual dish being cooked in the kitchen right now — you can still add a pinch of salt or swap an ingredient mid-cook, and none of that touches the printed recipe sitting on the counter.",
    examples: [
      {
        title: "HTML source vs. the live DOM",
        code: `<!-- original HTML file -->
<ul id="list">
  <li>Apples</li>
</ul>

// JavaScript, run after the page loads
document.getElementById("list").innerHTML += "<li>Bananas</li>";`,
        explanation:
          "The HTML file only ever had one list item. After this script runs, the live DOM has two — but if you viewed the file's raw source again, it would still only show one, because the file itself never changed.",
        walkthrough: [
          { code: '<ul id="list"> <li>Apples</li> </ul>', explanation: "The original HTML — one list with one item, as written in the file." },
          { code: 'document.getElementById("list")', explanation: "Finds the corresponding live element in the DOM tree, not in the file." },
          { code: '.innerHTML += "<li>Bananas</li>"', explanation: "Adds a new list item to that live element. This changes what's on screen immediately." },
        ],
      },
      {
        title: "Reading and changing an element",
        code: `const heading = document.querySelector("h1");
console.log(heading.textContent); // reads the current text
heading.textContent = "New Title"; // changes it live`,
        explanation:
          "querySelector finds a node in the DOM tree. From there, JavaScript can both read its current state and assign new values, and the visible page updates right away.",
      },
    ],
    howItWorks: `
As the browser parses HTML, for every tag it encounters it creates a
corresponding node object and attaches it to a tree, nested according to
how the tags were nested in the source. Each node has properties (its
tag name, attributes, text, children) and methods JavaScript can call to
read or change them. Because the DOM is just a set of objects in memory,
any change to it — adding a node, deleting one, changing text — is
reflected on screen essentially immediately, without needing to reload
anything.
  `.trim(),
    diagram: `
HTML source (text)
      |
      | browser parses it
      v
   DOM tree (live objects in memory)
      |
      |<--- JavaScript reads/writes here
      v
  Rendered page on screen
  `.trim(),
    whyItExists: `
The DOM exists because pages needed a way to change *after* they finish
loading, without the browser having to re-fetch and re-parse the whole
HTML file from scratch for every small update. Representing the page as
a tree of live, addressable objects gives JavaScript a structured,
efficient way to inspect and modify exactly the parts of a page that
need to change.
  `.trim(),
    whenToUse: `
Any time JavaScript needs to read what's currently on a page or change it
— show a new element, hide something, update text after fetching data —
it does so through the DOM, not by editing HTML files.
  `.trim(),
    whenNotToUse: `
For content that never needs to change after the page loads, there's no
need to manipulate the DOM with JavaScript at all — plain HTML and CSS
are simpler and faster. Heavy, frequent DOM manipulation for large,
fast-changing interfaces is also often better handled through a framework
that manages DOM updates efficiently, rather than doing it all by hand.
  `.trim(),
    commonMistakes: [
      "Confusing 'view page source' (the original HTML sent by the server) with the live DOM shown in developer tools inspector — they can differ after scripts run.",
      "Assuming editing the HTML file will change a page that's already open in a browser tab.",
      "Repeatedly querying the DOM for the same element inside a loop instead of looking it up once and reusing the reference.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use document.querySelector to select an element on a page and log its text content to the console." },
      { difficulty: "Medium", prompt: "Write a script that adds a new paragraph element to the page after it has already loaded, then explain why 'view page source' wouldn't show it." },
      { difficulty: "Hard", prompt: "Explain, in your own words, the difference between the DOM and HTML, and describe one situation where confusing the two would cause a debugging mistake." },
    ],
    interviewQuestions: [
      { question: "What is the DOM?", answer: "The Document Object Model — a live, in-memory tree of objects representing a page's current structure, built by the browser from the HTML and used for both rendering and JavaScript manipulation." },
      { question: "How is the DOM different from the original HTML source?", answer: "The HTML source is static text describing the page's starting state. The DOM is a live representation that can change after the page loads, through JavaScript, without the underlying HTML file ever changing." },
      { question: "Why can JavaScript change what's on screen without reloading the page?", answer: "Because it modifies the live DOM tree directly, and the browser re-renders based on the current DOM, not by re-reading the original HTML file." },
    ],
    prerequisites: ["html-basics"],
    relatedTopics: ["html-basics", "browser-rendering"],
    keywords: ["dom", "document object model", "javascript", "tree", "nodes"],
  },
  {
    id: "browser-rendering",
    title: "Browser Rendering",
    level: "beginner",
    description:
      "The step-by-step process a browser follows to turn HTML and CSS into the pixels you actually see on screen.",
    explanation: `
Once a browser has an HTML document and its associated CSS, it still
has real work to do before anything appears on screen. It has to figure
out what each element is, what it should look like, where exactly it
belongs, and finally draw all of that in the right place. This whole
sequence is called **rendering**.

It roughly happens in four stages. First, the browser reads through the
HTML and builds that live tree of elements — the DOM. At the same time,
it reads through the CSS and figures out which style rules apply to
which elements. Combining those two produces a tree of exactly which
elements will actually be visible and what styles apply to each — this
combined structure is often called the **render tree**.

Next, the browser works out **layout**: the exact size and position of
every visible element on the page, in pixels — how wide is this box, how
tall, where does it sit relative to everything around it. Finally comes
**paint**: the browser actually fills in pixels — colors, text, images,
borders — according to the layout it just calculated, and the picture
appears on screen.

Any time something changes later — new content arrives, CSS is
modified, the window is resized — the browser may need to redo some or
all of these steps to keep the screen accurate.
  `.trim(),
    analogy:
      "It's like building a stage set: first you decide which props are actually going to be used (render tree), then you measure exactly where each one goes on the floor (layout), then stagehands actually place and paint everything into position (paint) so the audience sees the finished scene.",
    examples: [
      {
        title: "The stages, named",
        code: `HTML  ──┐
        ├──> Render Tree ──> Layout ──> Paint ──> Pixels on screen
CSS   ──┘`,
        explanation:
          "HTML and CSS are combined into a render tree of visible elements and their styles, then the browser computes sizes and positions (layout), then it fills in the actual pixels (paint).",
        walkthrough: [
          { code: "HTML + CSS", explanation: "The two starting inputs — structure/content and appearance rules." },
          { code: "Render Tree", explanation: "Only the elements that will actually be visible, combined with the styles that apply to each." },
          { code: "Layout", explanation: "The browser calculates the exact size and position, in pixels, of every visible element." },
          { code: "Paint", explanation: "The browser draws colors, text, images, and borders according to that layout." },
          { code: "Pixels on screen", explanation: "The final, visible result the user actually sees." },
        ],
      },
      {
        title: "A change that triggers re-rendering",
        code: `// This changes an element's width — the browser
// must recalculate layout for anything nearby,
// then repaint the affected area.
box.style.width = "400px";`,
        explanation:
          "Not every change is equally expensive. Changing something that affects size or position (like width) forces the browser to redo layout, while changing something purely visual (like color) can sometimes skip straight to repainting.",
      },
    ],
    howItWorks: `
The browser doesn't wait for the entire HTML file to download before it
starts working — it begins parsing HTML as it streams in, building the
DOM incrementally. CSS is parsed similarly, and once enough of both is
available, the browser can start constructing the render tree and
calculating layout. Elements that CSS explicitly hides (like
\`display: none\`) are excluded from the render tree entirely, since they
never need a layout or paint step at all.
  `.trim(),
    diagram: `
Parse HTML  --> DOM tree      \\
                                >--> Render Tree --> Layout --> Paint
Parse CSS   --> Style rules   /
  `.trim(),
    whyItExists: `
Splitting rendering into distinct stages lets the browser be efficient
about what it redoes when something changes. If only colors change,
there's no need to recompute every element's size and position; if only
one element's size changes, there's no need to repaint the entire
screen. This staged pipeline is what keeps pages feeling responsive
even as content updates constantly.
  `.trim(),
    whenToUse: `
Understanding this pipeline matters once you start caring about *why* a
page feels slow or janky, especially when animating or updating the page
frequently — knowing that some changes are cheap (paint-only) and others
are expensive (trigger layout) shapes how you write both CSS and
JavaScript for a smooth experience.
  `.trim(),
    whenNotToUse: `
For basic page-building — writing HTML and CSS for a mostly static page —
you don't need to think about the rendering pipeline directly; the
browser handles it automatically. This mental model earns its keep
mainly during performance work.
  `.trim(),
    commonMistakes: [
      "Assuming every CSS change is equally cheap, when changes affecting size or position force a more expensive layout recalculation.",
      "Thinking the whole page re-renders from scratch on every small update, rather than the browser recomputing only what actually changed.",
      "Forgetting that elements hidden with display: none are skipped entirely during rendering, unlike elements merely made invisible in other ways.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "List the four main stages of the rendering pipeline in order, in your own words." },
      { difficulty: "Medium", prompt: "Explain why changing an element's color is typically cheaper for the browser than changing its width." },
      { difficulty: "Hard", prompt: "Using your browser's developer tools performance panel, record a page interaction and identify a 'layout' or 'paint' step in the recorded timeline." },
    ],
    interviewQuestions: [
      { question: "What are the main stages of browser rendering?", answer: "Parsing HTML and CSS to build a render tree of visible elements and their styles, computing layout (size and position), and then painting the actual pixels on screen." },
      { question: "What is the render tree?", answer: "A tree combining the DOM with matched CSS styles, containing only the elements that will actually be visible on the page." },
      { question: "Why does changing an element's width potentially cost more than changing its color?", answer: "Width affects layout — the size and position of that element and potentially others around it — requiring a layout recalculation, while color only affects the paint step." },
    ],
    prerequisites: ["html-basics", "css-basics", "the-dom"],
    relatedTopics: ["the-dom", "css-basics", "web-performance-basics"],
    keywords: ["rendering", "render tree", "layout", "paint", "reflow", "rendering pipeline"],
  },
];
