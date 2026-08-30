import type { Topic } from "../../types/content";

export const webFundamentalsIntermediateTopics: Topic[] = [
  {
    id: "css-layout",
    title: "CSS Layout (Flexbox & Grid)",
    level: "intermediate",
    description:
      "Two modern CSS tools for arranging elements on a page without relying on old workarounds like floats.",
    explanation: `
Arranging elements side by side, centering something both vertically and
horizontally, or making a set of boxes evenly sized used to be
genuinely difficult in CSS. Developers reached for tools that were never
actually designed for layout — most famously the \`float\` property,
originally meant for wrapping text around an image — and bent them into
shapes they weren't built for, with lots of fragile side effects.

CSS eventually got two tools actually designed for arranging elements.
**Flexbox** handles layout along a single direction — a row or a column
— and is great for things like navigation bars, toolbars, or centering
a handful of items. **Grid** handles two-dimensional layout — rows *and*
columns at once — and is great for things like a page's overall layout,
image galleries, or dashboards with defined regions.

Both work the same basic way: you turn on the layout mode on a
**container** element, and its direct children automatically become
items that get arranged according to rules you set — how they're
spaced, aligned, sized, and ordered — instead of you calculating pixel
positions by hand.
  `.trim(),
    analogy:
      "Flexbox is like arranging books along a single shelf — you can space them out or squeeze them together, but it's one line at a time. Grid is like arranging books in a bookcase with defined rows and columns, where you can also decide a single book spans multiple slots.",
    examples: [
      {
        title: "Flexbox: a simple row layout",
        code: `.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
        explanation:
          "Turning on flex layout makes the toolbar's children line up in a row automatically. justify-content spaces them across the main axis, and align-items centers them on the cross axis, with no manual positioning needed.",
        walkthrough: [
          { code: "display: flex;", explanation: "Turns this element into a flex container — its direct children become flex items, arranged in a row by default." },
          { code: "justify-content: space-between;", explanation: "Spreads the items so the first touches the left edge, the last touches the right edge, and space is distributed evenly between them." },
          { code: "align-items: center;", explanation: "Centers the items along the opposite axis — vertically, in a row layout — even if they have different heights." },
        ],
      },
      {
        title: "Grid: a two-dimensional layout",
        code: `.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
}

.sidebar { grid-column: 1; grid-row: 2; }
.content { grid-column: 2; grid-row: 2; }`,
        explanation:
          "This defines a page layout with a fixed-width sidebar column and a flexible content column, plus rows for a header, body, and footer, then places specific elements into specific cells of that grid.",
      },
    ],
    howItWorks: `
When you set \`display: flex\` or \`display: grid\` on an element, the
browser's layout engine switches from the normal block-by-block flow to
one of these specialized layout algorithms for that element's children.
Flexbox calculates how much space each item needs along a single axis
and distributes any remaining or missing space according to your rules.
Grid instead builds an explicit two-dimensional grid of rows and
columns first, then places each child into a cell (or a span of cells)
within it.
  `.trim(),
    whyItExists: `
Flexbox and Grid exist because older layout tools were never designed
for arranging general page content — they were repurposed for the job
and required workarounds (clearing floats, fixed pixel widths,
absolute positioning tricks) that broke easily as content changed.
These two systems were purpose-built for layout, making common patterns
like equal-height columns or centered content something you can express
directly, instead of hacking around.
  `.trim(),
    whenToUse: `
Reach for Flexbox when arranging items in a single row or column — a
nav bar, a button group, centering one thing inside another. Reach for
Grid when you need to control both rows and columns at once — an
overall page layout, a photo gallery, or any layout where content needs
to align across both dimensions.
  `.trim(),
    whenNotToUse: `
For simple in-line text flow — a paragraph, a sentence with a link in it
— you don't need either; normal document flow already handles that.
Overusing Grid for a layout that's really only ever one row or column
also adds unnecessary complexity where Flexbox would be simpler.
  `.trim(),
    commonMistakes: [
      "Reaching for float-based layout out of habit instead of Flexbox or Grid for new work.",
      "Confusing Flexbox's single-axis model with Grid's two-axis model and trying to force complex two-dimensional layouts out of Flexbox alone.",
      "Forgetting that flex/grid properties (like justify-content) go on the container, while sizing properties for individual items (like flex-grow) go on the children.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use Flexbox to horizontally center three boxes inside a container, with even spacing between them." },
      { difficulty: "Medium", prompt: "Build a page layout with a header, a fixed-width sidebar, and a flexible main content area using CSS Grid." },
      { difficulty: "Hard", prompt: "Recreate a layout that was originally built with floats using Flexbox or Grid instead, and explain what workaround(s) you were able to remove." },
    ],
    interviewQuestions: [
      { question: "What's the core difference between Flexbox and Grid?", answer: "Flexbox arranges items along a single axis (a row or a column). Grid arranges items across two axes (rows and columns) at once." },
      { question: "What CSS property turns an element into a flex or grid container?", answer: "display: flex for Flexbox, or display: grid for Grid, applied to the parent element whose children should be arranged." },
      { question: "Why were floats historically used for layout, and what was the problem?", answer: "Floats were originally designed for wrapping text around images, not for full-page layout, so using them for layout required extra workarounds like manually clearing floats to avoid broken, collapsing containers." },
    ],
    prerequisites: ["css-basics"],
    relatedTopics: ["css-basics", "responsive-design"],
    keywords: ["flexbox", "css grid", "layout", "css layout", "justify-content", "align-items"],
  },
  {
    id: "responsive-design",
    title: "Responsive Design",
    level: "intermediate",
    description:
      "Designing a single page so it still looks and works well on a huge range of screen sizes, from phones to large monitors.",
    explanation: `
A page built to look right on a large desktop monitor often looks
broken on a phone — text too small to read, content overflowing the
screen, layouts that assume far more horizontal space than actually
exists. Since the same page can be viewed on a huge range of screen
sizes, from a small phone to a wide desktop display, it needs a way to
adapt.

**Responsive design** is the practice of building a page so its layout
and styling adjust based on the size (and other characteristics) of the
screen viewing it, rather than assuming one fixed size. The main tool
for this in CSS is the **media query** — a rule that says "only apply
these styles when the screen matches some condition," most commonly a
minimum or maximum width.

A closely related idea is **mobile-first** design: writing your base
styles for the smallest, simplest screen first, then using media
queries to *add* complexity and rearrange things as more screen space
becomes available — rather than designing for desktop first and
patching things down for smaller screens as an afterthought. Starting
small tends to produce simpler, more resilient CSS.
  `.trim(),
    analogy:
      "It's like writing a letter that reformats itself depending on the size of paper it's printed on — one column and large text on a small card, multiple columns and smaller text on a full sheet — without changing a single word of the actual content.",
    examples: [
      {
        title: "A basic media query",
        code: `.container {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}`,
        explanation:
          "By default (small screens), items stack vertically. Once the screen is at least 768px wide, the media query kicks in and switches the layout to a horizontal row.",
        walkthrough: [
          { code: "flex-direction: column;", explanation: "The default, mobile-first layout: items stack in a single vertical column, which fits a narrow screen." },
          { code: "@media (min-width: 768px) {", explanation: "This block of styles only applies once the viewport is at least 768 pixels wide." },
          { code: "flex-direction: row;", explanation: "On wider screens, the same items now arrange in a horizontal row instead, taking advantage of the extra space." },
        ],
      },
      {
        title: "A responsive viewport setup",
        code: `<meta name="viewport" content="width=device-width, initial-scale=1">`,
        explanation:
          "Without this tag in the HTML head, mobile browsers often render the page at a wide desktop size and then shrink it to fit, making text tiny. This tag tells the browser to use the device's actual width as the page's width from the start.",
      },
    ],
    howItWorks: `
The browser continuously knows the current width (and other
characteristics) of its viewport — the visible area of the page. Media
queries are evaluated against that viewport, and any CSS rules inside a
matching media query are applied on top of (or in place of) the base
styles. As the browser window or device orientation changes, the
browser re-evaluates these queries and updates the applied styles
immediately, without a page reload.
  `.trim(),
    whyItExists: `
Responsive design became essential once people started browsing the web
on a huge variety of devices with wildly different screen sizes, rather
than mostly one kind of desktop monitor. Building and maintaining
entirely separate pages for "mobile" and "desktop" was expensive and
error-prone; a single page that adapts itself via CSS is far easier to
maintain and keeps content consistent everywhere.
  `.trim(),
    whenToUse: `
Use responsive techniques for essentially any public-facing page today,
since you rarely control what device or window size someone will use to
view it. Mobile-first is especially valuable when a page's content and
priorities genuinely differ by available space, not just its visual
size.
  `.trim(),
    whenNotToUse: `
An internal tool used exclusively on one known, fixed-size screen (like
a kiosk display) may not need full responsive treatment. Even then,
it's rarely harmful to have it, so responsive design is close to a
default best practice for anything reachable from a general web
browser.
  `.trim(),
    commonMistakes: [
      "Forgetting the viewport meta tag, which causes mobile browsers to render the page at a shrunk-down desktop width.",
      "Designing desktop-first and only reluctantly patching things for mobile, leading to bloated CSS with lots of overrides.",
      "Testing responsiveness only by resizing a desktop browser window instead of checking on actual or emulated mobile devices too.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Add a media query that changes a page's background color once the screen is narrower than 500px." },
      { difficulty: "Medium", prompt: "Build a mobile-first navigation bar that stacks links vertically by default and switches to a horizontal row above 768px." },
      { difficulty: "Hard", prompt: "Take an existing desktop-only layout and convert it to mobile-first responsive CSS, listing each media query you added and why." },
    ],
    interviewQuestions: [
      { question: "What is a media query?", answer: "A CSS rule that applies a block of styles only when the viewport matches some condition, most commonly a minimum or maximum width." },
      { question: "What does 'mobile-first' mean in responsive design?", answer: "Writing base CSS for the smallest screen first, then using media queries to add complexity and rearrange the layout as more screen space becomes available, rather than starting from a desktop layout and shrinking it down." },
      { question: "Why is the viewport meta tag important for responsive design?", answer: "Without it, many mobile browsers render the page at a wide, desktop-like width and scale it down, making text and layout appear too small; the tag makes the browser use the device's actual width." },
    ],
    prerequisites: ["css-basics", "css-layout"],
    relatedTopics: ["css-layout", "web-performance-basics"],
    keywords: ["responsive design", "media queries", "mobile-first", "viewport", "breakpoints"],
  },
  {
    id: "browser-storage",
    title: "Browser Storage",
    level: "intermediate",
    description:
      "Different ways a website can save small pieces of data directly in the user's browser, so it's still there the next time they visit.",
    explanation: `
Normally, everything a page knows about disappears the moment you
close the tab or navigate away — variables in JavaScript, form input
that hasn't been submitted, anything held only in memory. Sometimes a
site needs to remember something *across* visits or page loads: that
you're logged in, that you prefer dark mode, that you had three items
in a cart.

Browsers give websites a few different tools for this, and picking
between them comes down to how long the data should last and who needs
to see it. **Cookies** are small pieces of data that get automatically
sent along with every request to a server, which makes them the classic
way a server keeps track of a logged-in session. **localStorage** saves
data only in the browser, with no automatic connection to the server,
and it sticks around indefinitely until something explicitly clears it.
**sessionStorage** works just like localStorage, but it's wiped out as
soon as that specific browser tab is closed.

None of these are a full database — they're all meant for relatively
small amounts of data, stored on the one device and browser someone
happens to be using.
  `.trim(),
    analogy:
      "A cookie is like a stamped hand at a venue — you show it every time you walk up to a counter (the server) so they recognize you. localStorage is like a locker you keep at home that stays packed until you empty it yourself. sessionStorage is like a locker at the venue itself — once you leave for the night, it's cleared out.",
    examples: [
      {
        title: "localStorage vs. sessionStorage",
        code: `// Persists even after closing and reopening the browser
localStorage.setItem("theme", "dark");

// Cleared automatically once this tab is closed
sessionStorage.setItem("draftText", "Hello, world");

// Reading values back later
const theme = localStorage.getItem("theme");`,
        explanation:
          "Both use the same simple key-value API, but localStorage data survives closing the browser entirely, while sessionStorage data disappears once that tab is closed.",
        walkthrough: [
          { code: 'localStorage.setItem("theme", "dark");', explanation: "Saves a value under the key 'theme'. This will still be there tomorrow, even after the browser restarts." },
          { code: 'sessionStorage.setItem("draftText", "Hello, world");', explanation: "Saves a value scoped to this one tab's current session. Closing this tab erases it." },
          { code: 'localStorage.getItem("theme")', explanation: "Reads a previously stored value back out, returning null if that key was never set." },
        ],
      },
      {
        title: "A basic cookie",
        code: `document.cookie = "sessionId=abc123; max-age=3600";`,
        explanation:
          "Unlike localStorage or sessionStorage, this cookie is automatically attached to every future request this browser makes to the same site, which is what lets a server recognize a returning user without any extra JavaScript on the server's end.",
      },
    ],
    howItWorks: `
Cookies are stored by the browser and automatically included in the
headers of every request sent to the domain that set them, which is
exactly what lets a server recognize the same visitor across multiple
requests. localStorage and sessionStorage, by contrast, are pure
browser-side storage — nothing about them is sent to a server
automatically; JavaScript has to explicitly read them and send their
contents if a server needs to know about them. All three are scoped per
origin, meaning one website generally can't read another website's
stored data.
  `.trim(),
    whyItExists: `
These tools exist because different problems need different lifetimes
and different visibility. A login session needs the server to
recognize you on every request, which is exactly what cookies were
built for. A saved preference or draft only needs to live in the
browser and doesn't need to burden every single network request with
extra data, which is what localStorage and sessionStorage are for
instead.
  `.trim(),
    whenToUse: `
Use cookies when the server itself needs to know the stored value on
every request, like an authentication session. Use localStorage for
settings or data that should persist across visits but only matter to
the browser, like a saved theme preference. Use sessionStorage for
short-lived, per-tab data that shouldn't outlive the current visit,
like an in-progress multi-step form.
  `.trim(),
    whenNotToUse: `
None of these are appropriate for large amounts of data or anything
sensitive that truly needs strong protection — they're all readable
from the browser's storage/dev tools by anyone with access to that
device. For sensitive data or data that must be reliably shared across
devices, that belongs on the server, in an actual database.
  `.trim(),
    commonMistakes: [
      "Storing sensitive information like passwords directly in localStorage, where it's easily readable by anyone with device or script access.",
      "Expecting sessionStorage data to persist after closing the tab, when it's specifically designed not to.",
      "Overloading cookies with large amounts of data, which slows down every single request since cookies are sent with each one automatically.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use localStorage to save a user's chosen theme, and load it back when the page reopens." },
      { difficulty: "Medium", prompt: "Build a simple multi-step form that saves progress in sessionStorage, and confirm the progress disappears after closing the tab." },
      { difficulty: "Hard", prompt: "Explain, with a concrete scenario, why an authentication session is typically implemented using cookies rather than localStorage." },
    ],
    interviewQuestions: [
      { question: "What's the key difference between cookies and localStorage?", answer: "Cookies are automatically sent with every request to the server that set them, making them suited for server-side session tracking. localStorage stays entirely in the browser and is never sent automatically." },
      { question: "What's the difference between localStorage and sessionStorage?", answer: "They share the same API, but localStorage persists indefinitely until explicitly cleared, while sessionStorage is cleared automatically once its specific tab is closed." },
      { question: "Why shouldn't sensitive data be stored in localStorage?", answer: "localStorage is plain, unencrypted browser storage readable by any script running on that page or anyone with access to the browser's dev tools, so it offers no real protection for sensitive values." },
    ],
    relatedTopics: ["web-security-basics"],
    keywords: ["cookies", "localstorage", "sessionstorage", "browser storage", "web storage"],
  },
  {
    id: "web-accessibility",
    title: "Web Accessibility (a11y)",
    level: "intermediate",
    description:
      "Designing and building a site so people using assistive technology, like screen readers or keyboard-only navigation, can actually use it.",
    explanation: `
Not everyone browses the web the same way. Some people can't see a
screen at all and rely on software that reads the page aloud. Some
people can't use a mouse and navigate entirely with a keyboard. Some
people have low vision and need large, high-contrast text. A site that
only works if you can see a screen clearly and click precisely with a
mouse simply doesn't work for a meaningful number of people.

**Accessibility**, often abbreviated **a11y** (the 11 stands for the
number of letters skipped between the "a" and the "y"), is the practice
of building sites that work for people using assistive technology, not
just a typical mouse-and-monitor setup. This isn't a separate feature
bolted on afterward — it's mostly about doing the basics correctly: using
real, semantic HTML elements instead of generic ones styled to look the
part, giving every image a meaningful text description (**alt text**)
for people who can't see it, and making sure every interactive element
can be reached and operated using only a keyboard.

A big piece of this is **focus management** — making sure that as a
keyboard user tabs through a page, the currently focused element is
clearly visible, follows a sensible order, and that opening things like
a modal dialog moves focus into it (and traps it there) so a keyboard
user isn't left tabbing through content hidden behind it.
  `.trim(),
    analogy:
      "It's like designing a building with ramps and clear signage alongside stairs — most people might not notice they're there, but for someone using a wheelchair or who can't read small print, they're the difference between being able to get in the door at all.",
    examples: [
      {
        title: "Meaningful alt text",
        code: `<!-- Bad: unhelpful or missing -->
<img src="chart.png" alt="image">

<!-- Good: describes the actual content -->
<img src="chart.png" alt="Bar chart showing sales rising 20% from January to March">`,
        explanation:
          "A screen reader announces the alt text in place of the image. 'image' tells a blind user nothing useful, while a real description lets them understand what the chart actually shows.",
        walkthrough: [
          { code: 'alt="image"', explanation: "Technically present, but conveys no actual information — a screen reader user learns nothing about the chart's content." },
          { code: 'alt="Bar chart showing sales rising 20%..."', explanation: "Describes what the image actually communicates, giving a non-visual user equivalent information to a sighted user glancing at the chart." },
        ],
      },
      {
        title: "Keyboard-reachable custom controls",
        code: `<!-- Not focusable or announced as a button by default -->
<div onclick="submitForm()">Submit</div>

<!-- Reachable by keyboard, announced correctly by screen readers -->
<button onclick="submitForm()">Submit</button>`,
        explanation:
          "A div with a click handler is invisible to keyboard navigation and screen readers by default — it's just a generic block of text as far as assistive technology is concerned. A real button element is automatically focusable, triggerable with the keyboard, and announced as a button.",
      },
    ],
    howItWorks: `
Assistive technology, like a screen reader, doesn't see rendered pixels
— it reads the underlying HTML structure (often via the DOM) and uses
each element's role, name, and state to describe the page out loud or
via braille output. Semantic elements come with these roles already
built in (a button announces itself as "button" and responds to
keyboard activation automatically); generic elements styled to merely
look like a button carry none of that information unless it's added
back manually.
  `.trim(),
    whyItExists: `
Accessibility work exists because the web is meant to be usable by
everyone, not only people who can see a screen clearly and operate a
mouse precisely. Beyond that, in many places it's also a legal
requirement for certain kinds of sites. Practically, accessible
practices — clear structure, sufficient contrast, keyboard support —
also tend to make a site better for everyone, not just people using
assistive technology.
  `.trim(),
    whenToUse: `
Accessibility considerations belong in every project from the start,
not bolted on at the end — using semantic HTML, writing real alt text,
and testing keyboard navigation cost very little when done as you
build, and cost far more to retrofit later.
  `.trim(),
    whenNotToUse: `
There's essentially no valid case for skipping accessibility on a
public-facing site. The only reasonable trade-off is depth: a small
personal project might not warrant a full accessibility audit, but even
then, the basics (semantic tags, alt text, keyboard support) cost
little and help everyone.
  `.trim(),
    commonMistakes: [
      "Using generic elements styled to look interactive instead of real buttons or links, breaking keyboard and screen-reader support.",
      "Writing unhelpful alt text like 'image' or 'photo1.jpg' instead of describing what the image actually conveys.",
      "Trapping keyboard focus nowhere (or everywhere) — forgetting to move focus into a newly opened dialog, or forgetting to let focus escape it when it closes.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Add meaningful alt text to three images on a sample page, describing what each one actually conveys." },
      { difficulty: "Medium", prompt: "Take a page and try navigating it using only the Tab and Enter keys. Note every interactive element you couldn't reach or activate." },
      { difficulty: "Hard", prompt: "Rebuild a custom dropdown menu made of styled divs using proper semantic elements and keyboard support, and verify it works with Tab, Enter, and Escape." },
    ],
    interviewQuestions: [
      { question: "What does web accessibility mean?", answer: "Designing and building sites so people using assistive technology, such as screen readers or keyboard-only navigation, can perceive, understand, and use them." },
      { question: "Why does alt text matter, and what makes it good?", answer: "It's what a screen reader announces in place of an image, so it matters because it's often the only way a non-sighted user learns what the image conveys. Good alt text describes the actual content or purpose of the image rather than being generic or missing." },
      { question: "Why is using a real <button> element better than a styled <div> for something clickable?", answer: "A real button is automatically focusable, keyboard-activatable, and announced correctly by screen readers, while a div carries none of that behavior unless it's manually reimplemented." },
    ],
    prerequisites: ["html-basics"],
    relatedTopics: ["html-basics", "the-dom"],
    keywords: ["accessibility", "a11y", "screen readers", "alt text", "keyboard navigation", "focus management"],
  },
  {
    id: "web-performance-basics",
    title: "Web Performance Basics",
    level: "intermediate",
    description:
      "What actually makes a page feel slow to use, and the basic techniques for making it feel fast.",
    explanation: `
A page can feel slow for a few very concrete reasons, and most of them
come down to the browser being kept busy or waiting before it can show
or use something. A big stylesheet or script that has to fully download
and run *before* the browser can display anything is called
**render-blocking** — the page sits blank while the browser waits on
it. Large, unoptimized images can take a long time to download,
delaying everything on the page that depends on them. And a large
amount of JavaScript, even after it's downloaded, still takes time for
the browser to parse and run, which can leave a page looking finished
but unresponsive to clicks and taps.

There are a handful of well-established techniques for addressing
each of these. **Lazy loading** means not fetching something (like an
image far down the page) until it's actually about to be needed,
instead of loading everything up front. **Minification** strips
unnecessary characters (whitespace, long variable names) out of CSS and
JavaScript files before they're sent, so there's less data to transfer.
And **caching** lets a browser reuse a file it already downloaded on a
previous visit, instead of re-downloading something that hasn't
changed.
  `.trim(),
    analogy:
      "It's like being handed a phone book at the door before you're allowed into a restaurant, when all you needed was the menu. Render-blocking resources make you wait through unrelated work before you get the one thing you actually came for.",
    examples: [
      {
        title: "Avoiding render-blocking scripts",
        code: `<!-- Blocks rendering until fully downloaded and run -->
<script src="analytics.js"></script>

<!-- Downloads in the background, runs after parsing finishes -->
<script src="analytics.js" defer></script>`,
        explanation:
          "Without defer, the browser stops parsing the rest of the HTML to fetch and run the script immediately. With defer, the script downloads in parallel and only runs once the page has finished parsing, so it no longer delays the visible page.",
        walkthrough: [
          { code: '<script src="analytics.js"></script>', explanation: "The browser pauses HTML parsing here, fetches the script, and runs it before continuing — delaying everything after it on the page." },
          { code: "defer", explanation: "Tells the browser to fetch this script in the background without pausing parsing, and to run it only after the HTML is fully parsed." },
        ],
      },
      {
        title: "Lazy loading images",
        code: `<img src="hero.jpg" alt="Product hero image">
<img src="footer-banner.jpg" alt="Seasonal promotion" loading="lazy">`,
        explanation:
          "The hero image loads immediately since it's visible right away. The footer banner, likely far below the visible area when the page first loads, is marked loading=\"lazy\" so the browser only fetches it once the user scrolls close to it.",
      },
    ],
    howItWorks: `
The browser can only do so much at once: parsing HTML, downloading
files, parsing and running CSS and JavaScript, and rendering the result
all compete for its attention. Techniques like deferring scripts,
lazily loading offscreen images, and minifying files all work by
reducing or rescheduling that competing work — either by shrinking how
much data has to move over the network, or by making the browser wait
less before it can show something useful. Caching works differently: it
avoids the network entirely for files the browser recognizes it already
has an unchanged copy of.
  `.trim(),
    whyItExists: `
Performance work exists because a slow page directly costs user
attention and, for businesses, real measurable outcomes — people
abandon slow-loading pages far more readily than fast ones. As the
average webpage has grown heavier over time (more images, more
scripts, more third-party embeds), these techniques became necessary
just to keep pages usable rather than optional polish.
  `.trim(),
    whenToUse: `
Apply these techniques by default on any real-world website: defer
non-critical scripts, lazy-load offscreen images, minify production CSS
and JavaScript, and set caching headers on assets that don't change
often. Pay closer attention to performance whenever users report a page
feeling slow, or whenever measuring actual load times reveals a
problem.
  `.trim(),
    whenNotToUse: `
Extremely small or low-traffic internal tools may not need aggressive
performance tuning — the cost of, say, setting up a whole build
pipeline for minification might outweigh the benefit if load time is
already imperceptible. Optimizing prematurely, before knowing where
real time is actually being spent, can also waste effort on the wrong
thing.
  `.trim(),
    commonMistakes: [
      "Loading large, unoptimized images at full resolution when a much smaller version would look identical on screen.",
      "Marking a critical, above-the-fold image as lazy-loaded, delaying content the user sees immediately.",
      "Assuming minification alone fixes a performance problem caused by simply shipping too much JavaScript in the first place.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Add the loading=\"lazy\" attribute to images that appear below the visible area on a sample page." },
      { difficulty: "Medium", prompt: "Take a page with a blocking <script> tag in the head and change it to use defer, then explain the difference in page load behavior." },
      { difficulty: "Hard", prompt: "Using your browser's Network panel, measure a real page's load time, identify the largest resource slowing it down, and propose one concrete fix." },
    ],
    interviewQuestions: [
      { question: "What does 'render-blocking' mean?", answer: "A resource, like a script or stylesheet, that the browser must fully download (and sometimes run) before it can continue rendering the page, causing a visible delay." },
      { question: "What is lazy loading, and when is it appropriate?", answer: "Deferring the loading of a resource, commonly an image, until it's actually about to be needed, such as when it scrolls near the visible viewport. It's appropriate for offscreen content, but not for content visible immediately on page load." },
      { question: "How does caching improve web performance?", answer: "It lets a browser reuse a previously downloaded file instead of re-fetching it from the network, as long as the file hasn't changed, saving both time and bandwidth on repeat visits." },
    ],
    prerequisites: ["browser-rendering"],
    relatedTopics: ["browser-rendering", "responsive-design"],
    keywords: ["performance", "lazy loading", "minification", "caching", "render-blocking"],
  },
];
