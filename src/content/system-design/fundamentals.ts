import type { Topic } from "../../types/content";

export const systemDesignFundamentalsTopics: Topic[] = [
  {
    id: "what-is-system-design",
    title: "What is System Design?",
    level: "beginner",
    description: "Planning how the different parts of a real software system fit together and work at scale.",
    explanation: `
Writing a single function or a small app is one skill. Deciding how dozens
of services, databases, and servers should work *together* — so that
millions of people can use a product reliably, quickly, and without it
falling over — is a different skill entirely. That's **system design**.

It's less about writing code and more about making decisions: Where should
data live? How do different parts of the system talk to each other? What
happens when one part fails, or when ten times more people show up at
once?
    `.trim(),
    analogy:
      "If writing code is like building a single room, system design is like being the architect of an entire city — deciding where the roads, water pipes, and power lines go so that everything works together, even as the population grows.",
    examples: [
      {
        title: "Questions system design answers",
        code: `// Not code you'd run — these are the kinds of questions system design asks:

// - Should this data live in one database or be split across several?
// - What happens if this server crashes right now?
// - How do we serve 10 million users instead of 10 thousand?
// - Should two services talk directly, or through a queue?`,
      },
    ],
    howItWorks: `
System design usually starts with understanding requirements (how many
users, how much data, how fast does it need to respond), then breaks the
problem into components (servers, databases, caches, queues), and decides
how those components connect and what happens when something goes wrong.
It's an iterative process of trade-offs, not a single right answer.
    `.trim(),
    whyItExists: `
A system that works perfectly for 10 users can completely fall apart at 10
million — slow responses, crashes, lost data. System design exists to
think through those problems *before* they happen, and to make deliberate,
informed trade-offs instead of accidental ones.
    `.trim(),
    whenToUse: `
Reach for system-design thinking whenever you're planning something
bigger than a single script — choosing how services, data, and traffic
should be organized before (or while) you build, especially once more
than one person or more than a handful of users will depend on it.
    `.trim(),
    whenNotToUse: `
For a small script, a personal tool, or a prototype nobody else depends
on yet, heavy system design is overkill — you'd spend more time planning
for scale you don't have than actually building. Start simple, and bring
in system design as real constraints (more users, more data, more
reliability needs) show up.
    `.trim(),
    commonMistakes: [
      "Jumping straight to specific technologies before understanding the actual requirements and constraints.",
      "Designing only for the current scale and ignoring how the system would need to change if usage grew 100x.",
      "Assuming there's one 'correct' design instead of a best trade-off given the specific goals.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Pick an app you use daily (e.g. a messaging app) and list 3 questions you'd need to answer to design its backend." },
      { difficulty: "Medium", prompt: "Sketch (in words) the major components you'd expect behind a simple photo-sharing app: what stores the photos, what stores the metadata, what serves requests." },
      { difficulty: "Hard", prompt: "Describe what might break in your sketch above if the app suddenly went from 1,000 to 10,000,000 users." },
    ],
    interviewQuestions: [
      { question: "What is system design, in your own words?", answer: "The process of deciding how the components of a software system (servers, databases, caches, queues, etc.) fit together to meet requirements like scale, speed, and reliability." },
      { question: "Why can't you just 'add more servers' to fix every scaling problem?", answer: "Because bottlenecks often move to somewhere else — like a single database — that doesn't automatically scale just by adding more application servers." },
      { question: "What's the difference between a functional and a non-functional requirement in system design?", answer: "Functional requirements describe what the system does (e.g. 'users can post a photo'); non-functional requirements describe how well it does it (e.g. 'responses under 200ms', 'handles 1M users')." },
    ],
    relatedTopics: ["client-and-server", "scalability"],
    keywords: ["system design", "architecture", "scale", "trade-offs"],
  },
  {
    id: "client-and-server",
    title: "Client and Server",
    level: "beginner",
    description: "The basic relationship between the app you use and the machine that does the real work behind it.",
    explanation: `
When you open an app or website, the thing you're looking at — the
screen, the buttons — is called the **client**. It usually doesn't have
all the data or logic itself; instead, it sends a request over the
internet to a **server**: a computer somewhere else that has the actual
data and does the real processing, then sends a response back.

This split — client asks, server answers — is the foundation almost every
piece of software on the internet is built on.
    `.trim(),
    analogy:
      "It's like ordering food at a restaurant. You (the client) don't cook the meal yourself — you tell the waiter what you want, the kitchen (the server) prepares it, and the waiter brings it back to your table.",
    examples: [
      {
        title: "A basic client-server exchange",
        code: `// Client (browser) sends a request:
fetch("https://api.example.com/users/1")
  .then((response) => response.json())
  .then((user) => console.log(user));

// Server receives the request, looks up the data,
// and sends back something like:
// { "id": 1, "name": "Amara" }`,
        walkthrough: [
          { code: 'fetch("https://api.example.com/users/1")', explanation: "The client sends a request asking for user #1." },
          { code: ".then((response) => response.json())", explanation: "Once a response arrives, parses its body as JSON." },
          { code: ".then((user) => console.log(user));", explanation: "Uses the data the server sent back." },
          { code: "// Server receives the request...", explanation: "The server does its own work on its own machine, entirely out of the client's sight." },
        ],
      },
    ],
    howItWorks: `
The client sends a request over the network specifying what it wants. The
server receives that request, does whatever work is needed (looking up
data, running logic), and sends a response back. The client then updates
what the user sees, based on that response.
    `.trim(),
    diagram: `
Client (app/browser)
       │  sends a request
       ▼
     Server
       │  processes it, sends a response
       ▼
Client (app/browser) — updates the screen
    `.trim(),
    whyItExists: `
Splitting work this way lets many different clients (phones, browsers,
smart TVs) share the same server and data, without each device needing to
store and manage everything itself. It also lets the server be updated or
scaled independently of the apps that use it.
    `.trim(),
    whenToUse: `
This model applies to essentially any networked application — web apps,
mobile apps, games with online features — any time one program needs data
or processing that lives somewhere else.
    `.trim(),
    whenNotToUse: `
A fully offline tool that never talks to another machine doesn't need a
client-server split at all. And for something genuinely tiny and local,
introducing a whole separate server just adds operational complexity with
no real benefit.
    `.trim(),
    commonMistakes: [
      "Assuming the client can be trusted — a server should always re-check anything important, since clients can be modified by users.",
      "Forgetting that a request/response trip takes real time (network latency), which affects how responsive an app feels.",
      "Putting sensitive logic or secrets in client-side code, where anyone can inspect it.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Open your browser's Network tab and find one request your favorite website sends to its server." },
      { difficulty: "Medium", prompt: "Explain, in your own words, why a weather app needs a server instead of just knowing the weather itself." },
      { difficulty: "Hard", prompt: "Describe what could go wrong if a shopping app trusted the price sent from the client instead of verifying it on the server." },
    ],
    interviewQuestions: [
      { question: "What is the client-server model?", answer: "An architecture where a client sends requests to a server, which processes them and returns a response, rather than the client handling everything itself." },
      { question: "Why shouldn't a server trust data coming from the client?", answer: "Because client-side code and requests can be modified or forged by anyone, so the server must independently validate anything security- or business-critical." },
      { question: "What is latency, in the context of client-server communication?", answer: "The time it takes for a request to travel to the server and for the response to travel back — a key factor in how fast an app feels." },
    ],
    prerequisites: ["what-is-system-design"],
    relatedTopics: ["http", "rest-apis"],
    keywords: ["client", "server", "request", "response", "latency"],
  },
  {
    id: "http",
    title: "HTTP",
    level: "beginner",
    description: "The common language that lets clients and servers talk to each other over the web.",
    explanation: `
For a client and a server to communicate, they both need to agree on a
shared format for requests and responses — otherwise it's just noise
neither side understands. **HTTP** (HyperText Transfer Protocol) is that
shared language: a set of rules for how a request should be structured,
what kinds of requests exist, and how a server should respond.
    `.trim(),
    analogy:
      "HTTP is like the standard format for a letter: a return address, a recipient address, a subject, and a body. Because everyone agrees on that format, any recipient (server) can read a properly formatted letter (request) — and is expected to write back using that same standard format (a response), rather than replying however they feel like.",
    examples: [
      {
        title: "A basic HTTP request/response",
        code: `GET /users/1 HTTP/1.1
Host: api.example.com

// Server responds:
HTTP/1.1 200 OK
Content-Type: application/json

{ "id": 1, "name": "Amara" }`,
        explanation:
          "`GET /users/1` asks for user #1. The server replies with a status code (`200 OK` means success) and the requested data.",
        walkthrough: [
          { code: "GET /users/1 HTTP/1.1", explanation: "The method (GET) and path (/users/1) — this request asks to read user #1." },
          { code: "Host: api.example.com", explanation: "A header telling the server which website/host this request is meant for." },
          { code: "HTTP/1.1 200 OK", explanation: "The response's status line — 200 means the request succeeded." },
          { code: '{ "id": 1, "name": "Amara" }', explanation: "The response body — the actual data that was requested." },
        ],
      },
    ],
    howItWorks: `
Every HTTP request has a **method** (what kind of action, like GET or
POST), a **path** (what resource it's about), and optional **headers** and
a **body** (extra data). Every response has a **status code** (like 200
for success or 404 for not found) plus its own headers and body. Both
sides just follow this shared structure.
    `.trim(),
    whyItExists: `
Without a shared protocol, every client and server pair would need its own
custom way of communicating — nothing on the web would be interoperable.
HTTP gives every browser, app, and server a common language, which is why
the web works at all.
    `.trim(),
    whenToUse: `
You're using HTTP any time a browser, app, or script talks to a web
server — which is most of the time a client-server application
communicates at all.
    `.trim(),
    whenNotToUse: `
For very high-frequency, low-latency communication — real-time games,
some financial trading systems — raw HTTP's overhead can be too much;
protocols like WebSockets or dedicated binary protocols fit better there.
    `.trim(),
    commonMistakes: [
      "Confusing HTTP status code categories, e.g. thinking all 4xx codes mean 'server error' (they mean client error; 5xx means server error).",
      "Forgetting that HTTP is stateless by default — the server doesn't automatically remember previous requests unless something (like cookies or tokens) carries that state.",
      "Using the wrong method for the action, e.g. using GET for something that changes data on the server.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "List the HTTP methods GET, POST, PUT, and DELETE, and describe what each is typically used for." },
      { difficulty: "Medium", prompt: "Look up what HTTP status codes 200, 301, 404, and 500 mean." },
      { difficulty: "Hard", prompt: "Explain, in your own words, why HTTP being 'stateless' matters for how servers are designed to scale." },
    ],
    interviewQuestions: [
      { question: "What is HTTP?", answer: "A protocol (a set of rules) that defines how clients and servers structure requests and responses when communicating over the web." },
      { question: "What does it mean that HTTP is stateless?", answer: "Each request is handled independently — the server doesn't automatically remember anything about previous requests from the same client unless extra mechanisms (cookies, tokens, sessions) are used." },
      { question: "What's the difference between GET and POST?", answer: "GET requests data without changing anything on the server (and can be cached); POST typically sends data to create or change something on the server." },
    ],
    prerequisites: ["client-and-server"],
    relatedTopics: ["client-and-server", "rest-apis", "authentication-and-sessions", "websockets"],
    keywords: ["http", "protocol", "status code", "method", "stateless"],
  },
  {
    id: "rest-apis",
    title: "REST APIs",
    level: "beginner",
    description: "A common, predictable way to structure requests so different apps can talk to a server the same way.",
    explanation: `
An API (Application Programming Interface) is simply a way one piece of
software lets another piece of software ask it to do things. But an API
could be organized in a thousand different, inconsistent ways — which
makes it hard to learn and use. **REST** (Representational State Transfer)
is a popular, widely-agreed-upon style for designing APIs so that they're
consistent and predictable across countless different services.

The core idea: everything is a "resource" (like a user, a post, a
product), identified by a URL, and you use standard HTTP methods to act on
it — GET to read, POST to create, PUT/PATCH to update, DELETE to remove.
    `.trim(),
    analogy:
      "REST is like a well-labeled filing cabinet where every drawer follows the same layout convention, and every drawer lets you do the same standard set of things — look inside, add a paper, replace its contents, or remove it. Once you understand one drawer, you instantly know how to work with any other drawer in any cabinet built the same way.",
    examples: [
      {
        title: "REST-style endpoints for a 'posts' resource",
        code: `GET    /posts       // get all posts
GET    /posts/42    // get one specific post
POST   /posts       // create a new post
PUT    /posts/42    // replace post 42 entirely
PATCH  /posts/42    // partially update post 42
DELETE /posts/42    // delete post 42`,
        explanation:
          "Notice the URL identifies *what* you're acting on (a post, or a specific one), and the HTTP method identifies *what action* you're taking.",
        walkthrough: [
          { code: "GET /posts", explanation: "Reads the full list of posts." },
          { code: "GET /posts/42", explanation: "Reads one specific post, identified by its id in the URL." },
          { code: "POST /posts", explanation: "Creates a new post." },
          { code: "PUT /posts/42  /  PATCH /posts/42", explanation: "Replaces post 42 entirely, or partially updates just some of its fields." },
          { code: "DELETE /posts/42", explanation: "Removes post 42." },
        ],
      },
    ],
    howItWorks: `
A REST API exposes resources as URLs and relies on standard HTTP methods
and status codes rather than inventing custom verbs for every action. This
consistency means a developer who's used one REST API can usually guess
how another one works, without reading extensive documentation.
    `.trim(),
    whyItExists: `
Before conventions like REST became common, every API had its own bespoke
rules, making integration slow and error-prone. REST gives teams a shared
set of conventions, which speeds up building and consuming APIs across
completely different companies and codebases.
    `.trim(),
    whenToUse: `
Reach for REST conventions when you're designing a general-purpose API
for resources (users, posts, products) that other developers — possibly
outside your team — will need to learn and use.
    `.trim(),
    whenNotToUse: `
For very specific, action-oriented operations that don't map cleanly to
a resource (like "run this report" or "send this batch job"), forcing a
REST shape can feel awkward — an RPC-style or GraphQL API sometimes fits
better.
    `.trim(),
    commonMistakes: [
      "Using verbs in URLs (`/getUser`) instead of nouns with proper HTTP methods (`GET /user`).",
      "Returning 200 OK for every response, even for errors, instead of using proper status codes.",
      "Designing endpoints that don't map cleanly to a resource, making the API inconsistent and confusing.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Design REST-style endpoints for a 'comments' resource: list, get one, create, update, delete." },
      { difficulty: "Medium", prompt: "Explain why `POST /users/delete/42` is not a RESTful way to delete a user, and rewrite it properly." },
      { difficulty: "Hard", prompt: "Design a small REST API (endpoints + methods + expected status codes) for a simple to-do list app." },
    ],
    interviewQuestions: [
      { question: "What does REST stand for, and what's its core idea?", answer: "Representational State Transfer — the core idea is treating everything as a resource identified by a URL, manipulated using standard HTTP methods." },
      { question: "What makes an API 'RESTful'?", answer: "Using resource-based URLs, standard HTTP methods for actions, standard status codes for outcomes, and being stateless between requests." },
      { question: "What's the difference between PUT and PATCH?", answer: "PUT typically replaces an entire resource; PATCH applies a partial update, changing only the specified fields." },
    ],
    prerequisites: ["http"],
    relatedTopics: ["http", "client-and-server", "databases"],
    keywords: ["REST", "API", "endpoint", "resource", "CRUD"],
  },
  {
    id: "proxy-and-reverse-proxy",
    title: "Proxy & Reverse Proxy",
    level: "beginner",
    description: "A middle server that sits between a client and the real destination, on behalf of one side or the other.",
    explanation: `
Sometimes a request doesn't go directly from a client to the server that
will actually handle it — instead, it passes through a middle server
first. A **forward proxy** sits in front of clients, forwarding their
requests out on their behalf (often hiding who the client is, or
filtering what they can reach). A **reverse proxy** sits in front of
servers, forwarding incoming requests to whichever backend server should
actually handle them (often hiding how many servers there are, or what
they look like).

The two solve opposite problems, even though the underlying idea — a
middle server relaying requests — is the same.
    `.trim(),
    analogy:
      "A forward proxy is like an assistant who makes calls on your behalf so the person on the other end never sees your number. A reverse proxy is like a company's reception desk — every visitor talks to the same receptionist, who then directs them to whichever employee should actually help, without the visitor ever needing to know who works where.",
    examples: [
      {
        title: "A reverse proxy routing to different backends",
        code: `// Simplified reverse proxy config
routes: {
  "/api/*": "backend-server:4000",
  "/images/*": "image-server:5000",
  "/*": "web-server:3000",
}
// A request to /api/users is forwarded to backend-server,
// while a request to /home.html goes to web-server —
// the client only ever talks to one address.`,
        walkthrough: [
          { code: '"/api/*": "backend-server:4000"', explanation: "Any request whose path starts with /api goes to the backend server." },
          { code: '"/images/*": "image-server:5000"', explanation: "Image requests are routed to a separate server entirely." },
          { code: '"/*": "web-server:3000"', explanation: "Everything else falls through to the default web server." },
          { code: "the client only ever talks to one address", explanation: "The client has no idea multiple servers exist behind the scenes." },
        ],
      },
    ],
    howItWorks: `
A reverse proxy receives every incoming request first, inspects it
(usually just the path or domain), and forwards it to whichever backend
server is responsible for handling that kind of request — then relays
the response back to the client as if it had come from the proxy itself.
A forward proxy does the mirror image: it sits in front of clients,
receiving their outgoing requests and forwarding them onward, often
changing or hiding details about the original request.
    `.trim(),
    whyItExists: `
Without a reverse proxy, clients would need to know the exact address of
every individual backend service, and every one of those services would
need to be directly exposed to the internet. A reverse proxy gives
clients one single, stable address to talk to, while everything about how
many servers exist and what they do stays hidden and free to change.
    `.trim(),
    whenToUse: `
Reach for a reverse proxy anytime you have more than one backend service
(or more than one instance of the same service) and want clients to
interact with a single, stable entry point — this is also exactly what a
load balancer is, under the hood: a reverse proxy that distributes
traffic across many identical servers. Reach for a forward proxy when
clients need their outgoing requests filtered, cached, or have their
identity hidden.
    `.trim(),
    whenNotToUse: `
For a single, simple server with no need to route between multiple
backends, a reverse proxy adds an extra network hop with no real benefit
yet — you can always add one later as the system grows.
    `.trim(),
    commonMistakes: [
      "Confusing a forward proxy (works on behalf of clients) with a reverse proxy (works on behalf of servers) — they solve different problems.",
      "Forgetting that a reverse proxy is itself a piece of infrastructure that needs to stay up — if it goes down, so does access to everything behind it.",
      "Exposing internal backend addresses directly instead of routing everything through the proxy, defeating the purpose of hiding the internal architecture.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, the difference between a forward proxy and a reverse proxy." },
      { difficulty: "Medium", prompt: "Sketch (in words) a reverse proxy config that routes /api requests to one server and everything else to another." },
      { difficulty: "Hard", prompt: "Explain how a load balancer and a reverse proxy relate to each other — is a load balancer a kind of reverse proxy, or something separate?" },
    ],
    interviewQuestions: [
      { question: "What's the difference between a forward proxy and a reverse proxy?", answer: "A forward proxy sits in front of clients and forwards their outgoing requests on their behalf; a reverse proxy sits in front of servers and forwards incoming requests to whichever backend should handle them." },
      { question: "Why would you put a reverse proxy in front of multiple backend servers?", answer: "So clients only need to know one address, while the proxy handles routing requests to the correct backend — hiding the internal architecture and making it easier to change." },
      { question: "Is a load balancer a type of reverse proxy?", answer: "Effectively yes — a load balancer is a reverse proxy whose specific job is distributing traffic across multiple identical backend servers." },
    ],
    prerequisites: ["client-and-server"],
    relatedTopics: ["load-balancing", "api-gateway"],
    keywords: ["proxy", "reverse proxy", "forward proxy", "routing"],
  },
  {
    id: "authentication-and-sessions",
    title: "Authentication & Sessions",
    level: "beginner",
    description: "How a server remembers who you are across multiple requests, even though HTTP itself doesn't.",
    explanation: `
HTTP is stateless — the server doesn't automatically remember anything
about you between one request and the next. But most apps clearly do
remember you: you log in once and stay logged in as you click around.
That memory has to be built on top of HTTP deliberately, and there are
two common ways to do it: **sessions** (the server keeps track of who's
logged in, and gives your browser a small id to prove which session is
yours) and **tokens** (the server gives your browser a self-contained
piece of data that proves who you are, without the server needing to
store anything).
    `.trim(),
    analogy:
      "A session is like getting a wristband at a venue — the venue keeps a list of which wristband numbers were given to which paying customers, and checks your wristband against that list at each door. A token is more like getting a signed, tamper-proof ticket that itself already contains everything needed to prove it's valid — nobody needs to check a list, they just verify the ticket's signature.",
    examples: [
      {
        title: "A simple session-based login flow",
        code: `// 1. User logs in with correct credentials
POST /login  { username: "amara", password: "..." }

// 2. Server creates a session record and sends back a cookie
Set-Cookie: sessionId=abc123; HttpOnly

// 3. Every later request automatically includes that cookie
GET /dashboard
Cookie: sessionId=abc123

// 4. Server looks up "abc123" in its session store to know who's asking`,
        walkthrough: [
          { code: "POST /login { username, password }", explanation: "The client sends credentials once, to prove identity." },
          { code: "Set-Cookie: sessionId=abc123", explanation: "The server creates a session record and gives the browser a small id referencing it." },
          { code: "Cookie: sessionId=abc123", explanation: "The browser automatically resends that cookie on every later request." },
          { code: 'Server looks up "abc123"', explanation: "The server checks its own storage to find out which user this session id belongs to." },
        ],
      },
    ],
    howItWorks: `
With sessions, the server stores session data (who's logged in, since
when) in memory or a database, keyed by a random session id, and gives
that id to the browser as a cookie; every later request includes the
cookie, and the server looks up the matching session. With tokens
(commonly JWTs), the server instead signs a small piece of data
containing the user's identity, so it can be verified without a lookup —
the token itself is the proof, as long as its signature checks out.
    `.trim(),
    whyItExists: `
Without some form of authentication and a session/token mechanism, a
server would have no way to distinguish one visitor from another, or
remember that you already proved who you are — every request would need
to include your full credentials again, which is both impractical and
insecure.
    `.trim(),
    whenToUse: `
Use session-based authentication when you want the server to retain full
control — able to instantly revoke access by deleting a session record.
Use token-based authentication when you want to avoid a centralized
lookup on every request, especially across multiple independent
services, at the cost of tokens being harder to revoke early.
    `.trim(),
    whenNotToUse: `
Don't build authentication from scratch for anything beyond a learning
exercise — subtle mistakes here (like weak session ids, or improperly
verifying a token's signature) are a common source of serious security
vulnerabilities; use well-established, audited libraries and frameworks
instead.
    `.trim(),
    commonMistakes: [
      "Storing session ids or tokens somewhere JavaScript can read them (making them vulnerable to theft via XSS) instead of an HttpOnly cookie.",
      "Assuming a token can be instantly revoked the way a session can — a signed token generally stays valid until it expires, unless you build extra revocation logic.",
      "Sending credentials or session identifiers over plain HTTP instead of HTTPS, exposing them to anyone on the network.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, why HTTP being stateless means a server needs a separate mechanism to 'remember' a logged-in user." },
      { difficulty: "Medium", prompt: "Describe the difference between a session id and a token, and one advantage each has over the other." },
      { difficulty: "Hard", prompt: "Explain how a service could quickly revoke a compromised session versus a compromised token, and why one is harder." },
    ],
    interviewQuestions: [
      { question: "Why can't the server just 'remember' a user across requests using HTTP alone?", answer: "HTTP is stateless by design — each request is handled independently, so remembering a user requires an explicit mechanism like a session or token layered on top." },
      { question: "What's the difference between a session and a token?", answer: "A session stores the user's state on the server, identified by an id the client holds; a token holds the user's state itself (signed, so it can be verified), without the server needing to store anything." },
      { question: "Why is a token harder to revoke early than a session?", answer: "A session can be invalidated by simply deleting its record on the server; a signed token is self-contained and remains valid until it expires, unless additional revocation tracking is built." },
    ],
    prerequisites: ["http", "client-and-server"],
    relatedTopics: ["http", "rest-apis"],
    keywords: ["authentication", "session", "token", "JWT", "cookie", "login"],
  },
];
