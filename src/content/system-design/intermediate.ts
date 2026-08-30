import type { Topic } from "../../types/content";

export const systemDesignIntermediateTopics: Topic[] = [
  {
    id: "databases",
    title: "Databases",
    level: "intermediate",
    description: "Where an application's data actually lives, safely, between requests.",
    explanation: `
A running program keeps its variables in memory, but memory disappears the
moment the program stops or restarts — not great for a user's account,
posts, or orders. A **database** is software specifically designed to
store data reliably on disk, retrieve it quickly, and keep it consistent
even when many things are reading and writing at once.

Almost every real application has a database sitting behind its server,
holding the actual persistent data the app depends on.
    `.trim(),
    analogy:
      "If a server is the chef preparing your order, the database is the pantry and fridge — a well-organized place where ingredients (data) are stored so the chef can reliably find and use them, even after the kitchen closes and reopens the next day.",
    examples: [
      {
        title: "A server reading from a database",
        code: `// Simplified example
async function getUser(id) {
  const user = await database.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  return user;
}`,
        explanation:
          "The server doesn't store user data itself — it asks the database, which is responsible for storing and retrieving it reliably.",
        walkthrough: [
          { code: "async function getUser(id) {", explanation: "Defines a function that will fetch one user from the database." },
          { code: 'database.query("SELECT * FROM users WHERE id = ?", [id])', explanation: "Asks the database for the row matching this id, waiting for the (possibly slow) answer." },
          { code: "return user;", explanation: "Sends the result back to whoever called getUser." },
        ],
      },
    ],
    howItWorks: `
A database organizes data (often into tables, or collections of
documents), and provides a query language or API to read and write that
data. It also manages tricky details automatically — like making sure two
simultaneous writes don't corrupt each other, and that data survives a
crash or restart.
    `.trim(),
    whyItExists: `
Applications need data to persist reliably — surviving crashes, restarts,
and simultaneous use by many users at once. Building that reliability from
scratch for every app would be enormously wasteful; databases exist so
every application can rely on the same well-tested foundation.
    `.trim(),
    whenToUse: `
Use a database anytime data needs to survive beyond a single request or
process — user accounts, orders, posts, anything that must still be there
tomorrow, or on a different server entirely.
    `.trim(),
    whenNotToUse: `
For data that's only ever needed for the lifetime of a single request — a
temporary calculation, a value passed between two functions — a database
is unnecessary overhead. Keep that in memory instead.
    `.trim(),
    commonMistakes: [
      "Storing important data only in server memory, losing it whenever the server restarts.",
      "Not thinking about how a database will scale as data grows into the millions of records.",
      "Trusting user input directly in a database query, which can lead to serious security issues (like SQL injection).",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, why a to-do list app needs a database instead of just keeping tasks in the browser's memory." },
      { difficulty: "Medium", prompt: "Describe what data you'd store for a simple blog (e.g. posts, authors, comments) and how those pieces might relate to each other." },
      { difficulty: "Hard", prompt: "Explain what could go wrong if two users tried to buy the last item in stock at the exact same moment, and how a database might prevent it." },
    ],
    interviewQuestions: [
      { question: "Why can't an application just keep all its data in server memory?", answer: "Memory is wiped when a process restarts or crashes, and it doesn't scale across multiple servers — a database provides durable, shared storage instead." },
      { question: "What's the difference between reading and writing data in terms of design concerns?", answer: "Reads are typically far more frequent and easier to scale (e.g. via caching or replicas); writes need stronger guarantees around consistency and conflict handling." },
      { question: "What is data persistence?", answer: "The property of data surviving beyond the lifetime of the process that created it — e.g. still being there after a server restarts." },
    ],
    prerequisites: ["rest-apis"],
    relatedTopics: ["sql-vs-nosql", "caching", "rest-apis", "database-replication"],
    keywords: ["database", "persistence", "query", "storage"],
  },
  {
    id: "sql-vs-nosql",
    title: "SQL vs NoSQL",
    level: "intermediate",
    description: "Two different philosophies for organizing and storing data, each suited to different problems.",
    explanation: `
Not all databases organize data the same way. **SQL** (Structured Query
Language — the language used to ask these databases for data, and the name
that stuck to the whole category) databases are **relational**: they store
data in strict tables with predefined columns, and are very good at
representing relationships between different kinds of data consistently.
**NoSQL** ("not only SQL") databases take a more flexible approach —
storing data as loose documents, key-value pairs, or other shapes — trading
some structure and consistency guarantees for flexibility and easier
scaling across many machines. Despite the name, most NoSQL databases still
support some form of querying — they just don't use SQL to do it.

Neither is universally "better" — the right choice depends on how
structured your data is and how it needs to scale.
    `.trim(),
    analogy:
      "A SQL database is like a set of strict spreadsheets, each with fixed columns everyone must follow — great for consistency. A NoSQL database is more like a stack of index cards, where each card can have whatever fields make sense for it — great for flexibility.",
    examples: [
      {
        title: "The same data, two different shapes",
        code: `-- SQL: fixed columns, a strict table
-- users(id, name, email)
SELECT * FROM users WHERE id = 1;

// NoSQL (document-style): flexible shape per document
{
  "id": 1,
  "name": "Amara",
  "email": "amara@example.com",
  "preferences": { "theme": "dark" } // easy to add, no schema change needed
}`,
        walkthrough: [
          { code: "-- users(id, name, email)", explanation: "Defines a strict table shape — every row must have exactly these columns." },
          { code: "SELECT * FROM users WHERE id = 1;", explanation: "Reads the row matching id 1 from that fixed table." },
          { code: '{ "id": 1, "name": ..., "preferences": {...} }', explanation: "The same kind of data, stored as a flexible document — new fields can be added without changing every other record." },
        ],
      },
    ],
    howItWorks: `
SQL databases enforce a schema — every row in a table must have the same
columns — and are built around relationships between tables (a user has
many orders, an order has many items). NoSQL databases typically don't
enforce a fixed schema, letting each record's shape vary, and often
sacrifice some cross-record consistency guarantees in exchange for being
easier to spread across many servers.
    `.trim(),
    whyItExists: `
Some data is naturally tabular and relationship-heavy (financial records,
inventory) — a great fit for SQL's structure and guarantees. Other data is
less structured or needs to scale to enormous volume across many servers
(logs, user activity feeds) — where NoSQL's flexibility and scalability
are a better fit.
    `.trim(),
    whenToUse: `
Reach for SQL when your data is naturally tabular and relationships
between records matter a lot (orders belonging to users, items belonging
to orders) and you want strong consistency guarantees. Reach for NoSQL
when your data's shape varies a lot, changes frequently, or needs to
scale out across many machines more easily than a single relational
database can.
    `.trim(),
    whenNotToUse: `
Don't pick NoSQL just because it feels more modern — if your data is
genuinely relational, fighting that in a document store often means
reinventing SQL's features yourself. And don't force rigid SQL tables onto
data that changes shape constantly; frequent schema migrations become
their own maintenance burden.
    `.trim(),
    commonMistakes: [
      "Assuming NoSQL is always 'faster' or 'more modern' — it's a different trade-off, not a strict upgrade.",
      "Using a rigid SQL schema for data that changes shape constantly, causing painful migrations.",
      "Using a NoSQL database for data with many strict relationships, and then re-implementing relational logic manually in application code.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "List two examples of data that fit naturally into SQL tables, and two that fit better as flexible NoSQL documents." },
      { difficulty: "Medium", prompt: "Explain, in your own words, what a 'schema' is and why enforcing one has both benefits and costs." },
      { difficulty: "Hard", prompt: "Describe a scenario where you might use both a SQL and a NoSQL database in the same application, and why." },
    ],
    interviewQuestions: [
      { question: "What's the main structural difference between SQL and NoSQL databases?", answer: "SQL databases enforce a fixed schema and organize data into related tables; NoSQL databases typically allow flexible, schema-less structures like documents or key-value pairs." },
      { question: "When would you choose NoSQL over SQL?", answer: "When your data doesn't fit neatly into fixed tables, needs to scale horizontally across many servers, or its structure changes frequently." },
      { question: "Does choosing NoSQL mean giving up data consistency entirely?", answer: "Not entirely — but many NoSQL systems trade some strong consistency guarantees for availability and scalability, following what's sometimes called 'eventual consistency'." },
    ],
    prerequisites: ["databases"],
    relatedTopics: ["databases", "scalability"],
    keywords: ["SQL", "NoSQL", "relational", "schema", "document database"],
  },
  {
    id: "caching",
    title: "Caching",
    level: "intermediate",
    description: "Keeping a copy of frequently-needed data somewhere much faster to access, so you don't redo expensive work every time.",
    explanation: `
Some operations are expensive — a complex database query, a slow
calculation, a request to another service far away. If the same result is
needed again and again, redoing that expensive work every single time is
wasteful. **Caching** means storing a copy of the result somewhere fast
(often in memory) so future requests can just reuse it instead of
recomputing it.
    `.trim(),
    analogy:
      "It's like keeping a jar of pre-made coffee in the fridge instead of brewing a fresh pot every single time someone wants a cup. It's faster to grab an existing cup — you just have to remember to refill the jar occasionally.",
    examples: [
      {
        title: "A simple cache in front of a slow lookup",
        code: `const cache = new Map();

async function getUser(id) {
  if (cache.has(id)) {
    return cache.get(id); // fast — no database call
  }

  const user = await database.query("SELECT * FROM users WHERE id = ?", [id]);
  cache.set(id, user);
  return user;
}`,
        walkthrough: [
          { code: "const cache = new Map();", explanation: "A simple in-memory cache, empty to start." },
          { code: "if (cache.has(id)) { return cache.get(id); }", explanation: "If this id's result is already cached, return it immediately — no database call." },
          { code: 'const user = await database.query(...);', explanation: "Only runs on a cache miss — the expensive lookup." },
          { code: "cache.set(id, user);", explanation: "Stores the result for next time, before returning it." },
        ],
      },
    ],
    howItWorks: `
Before doing expensive work, the system checks the cache first. If the
data is there (a "cache hit"), it's returned immediately. If not (a "cache
miss"), the expensive work runs, and the result is stored in the cache for
next time. Cached data is usually also given an expiration time, so it
doesn't become permanently stale.
    `.trim(),
    diagram: `
Request comes in
       ↓
 Is it in the cache?
   ↓yes            ↓no
return cached    do expensive work
  value             ↓
                store result in cache
                     ↓
                return result
    `.trim(),
    whyItExists: `
Caching dramatically reduces load on slow or expensive resources (like
databases) and makes responses feel instant to users, at the cost of
occasionally serving slightly outdated data — a trade-off that's usually
well worth it for data that doesn't change every second.
    `.trim(),
    whenToUse: `
Reach for caching when the same expensive result is requested repeatedly
and doesn't need to be perfectly fresh every single time — a product
page, a popular search result, a computed report.
    `.trim(),
    whenNotToUse: `
Don't cache data that must always be perfectly up to date and changes
constantly — a live account balance mid-transaction, for instance — or
if you do, keep the cache lifetime extremely short and invalidate it
deliberately whenever the underlying data changes.
    `.trim(),
    commonMistakes: [
      "Caching data that changes frequently without a short enough expiration, leading to users seeing stale information.",
      "Forgetting to invalidate (clear) a cached value when the underlying data changes.",
      "Caching sensitive or user-specific data in a shared cache without properly separating it per user.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, the difference between a 'cache hit' and a 'cache miss'." },
      { difficulty: "Medium", prompt: "Add an expiration time to the cache example above, so cached values are only reused for 60 seconds." },
      { difficulty: "Hard", prompt: "Describe a real scenario where caching stale data could cause a real user-facing problem, and how you'd mitigate it." },
    ],
    interviewQuestions: [
      { question: "What is caching, in simple terms?", answer: "Storing a copy of a result somewhere fast to access, so repeated requests for the same thing don't redo expensive work." },
      { question: "What is cache invalidation, and why is it considered hard?", answer: "It's the process of removing or updating cached data once it's no longer accurate — hard because you must reliably track every place a cached value could become stale." },
      { question: "What's a trade-off caching introduces?", answer: "It can serve slightly outdated ('stale') data for a period of time, in exchange for much faster responses and less load on the underlying system." },
    ],
    prerequisites: ["databases"],
    relatedTopics: ["databases", "load-balancing", "cdn"],
    keywords: ["cache", "cache hit", "cache miss", "invalidation", "TTL"],
  },
  {
    id: "database-replication",
    title: "Database Replication",
    level: "intermediate",
    description: "Keeping multiple copies of the same database in sync, so no single database is a single point of failure.",
    explanation: `
A single database server is a risk: if it goes down, the whole
application loses access to its data. **Replication** means continuously
copying data from one database (the **primary**) to one or more
additional databases (**replicas**), so there's always more than one copy
of the data available.

Replicas are also useful even when nothing has failed — since reads
(fetching data) usually vastly outnumber writes (changing data),
spreading reads across several replicas can handle far more traffic than
one database ever could alone.
    `.trim(),
    analogy:
      "It's like a company keeping backup copies of an important physical ledger in multiple offices, updated continuously as changes come in. If the main office burns down, another office already has an up-to-date copy — and in the meantime, staff in every office can read from their local copy instead of everyone calling the main office.",
    examples: [
      {
        title: "Reads from a replica, writes to the primary",
        code: `// Simplified pattern
async function getUser(id) {
  return replicaDb.query("SELECT * FROM users WHERE id = ?", [id]);
}

async function createUser(data) {
  return primaryDb.query("INSERT INTO users ...", [data]);
  // this change then gets replicated to replicaDb automatically
}`,
        walkthrough: [
          { code: "replicaDb.query(...) inside getUser", explanation: "Reads are sent to a replica, spreading read traffic away from the primary." },
          { code: "primaryDb.query(...) inside createUser", explanation: "Writes must go to the primary, since replicas are read-only copies." },
          { code: "this change then gets replicated", explanation: "The primary pushes the change out to every replica, usually within a short delay." },
        ],
      },
    ],
    howItWorks: `
The primary database records every change it makes (often in a log), and
continuously streams that log of changes to each replica, which applies
the same changes in the same order to stay in sync. Because this
streaming takes a small amount of time, a replica's data is typically
slightly behind the primary's — this delay is called **replication lag**.
    `.trim(),
    whyItExists: `
Replication protects against losing a single database entirely (a
replica can be promoted to take over), and lets read-heavy applications
scale far past what one database server could handle alone by spreading
reads across many replicas.
    `.trim(),
    whenToUse: `
Add replication once a single database is either a reliability risk you
can't accept, or a read bottleneck — most real production databases run
with at least one replica for exactly these reasons.
    `.trim(),
    whenNotToUse: `
For a small, early-stage application with low traffic and where brief
downtime is acceptable, a single database is simpler to operate and
reason about — replication adds real operational complexity (replication
lag, failover logic) that isn't worth it until the risk or the read load
actually justifies it.
    `.trim(),
    commonMistakes: [
      "Reading data immediately after writing it from a replica, and being surprised the just-written data isn't there yet — that's replication lag.",
      "Forgetting that replicas are (usually) read-only, and mistakenly sending writes to one.",
      "Assuming replication alone is a backup strategy — a mistaken delete on the primary replicates to every replica too, just as fast as a legitimate change.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, why spreading reads across replicas helps an application handle more traffic." },
      { difficulty: "Medium", prompt: "Describe what 'replication lag' is and a real scenario where it could cause a confusing bug." },
      { difficulty: "Hard", prompt: "Explain why replication is not a substitute for backups, even though both involve keeping copies of your data." },
    ],
    interviewQuestions: [
      { question: "What is database replication?", answer: "Continuously copying data from a primary database to one or more replica databases, so there's more than one up-to-date copy available." },
      { question: "Why do replicas help with read scalability?", answer: "Because read traffic can be spread across many replicas instead of all hitting a single database, while writes still go to the primary." },
      { question: "What is replication lag?", answer: "The small delay between a change being made on the primary and that same change appearing on a replica, since replication isn't instantaneous." },
    ],
    prerequisites: ["databases"],
    relatedTopics: ["databases", "sharding", "consistency-models"],
    keywords: ["replication", "primary", "replica", "replication lag", "read scaling"],
  },
  {
    id: "sharding",
    title: "Database Sharding",
    level: "intermediate",
    description: "Splitting one huge dataset across multiple databases, so no single database has to hold all of it.",
    explanation: `
Replication solves reliability and read scaling by copying the same data
multiple times. But eventually a dataset can grow so large that even
writes — or just the storage itself — outgrow what a single database
server can hold, no matter how good its hardware is. **Sharding** solves
this differently: instead of copying everything, it splits the data
itself into pieces (**shards**), each stored on a separate database,
based on some rule — commonly a **shard key**, like a user id.
    `.trim(),
    analogy:
      "It's like a massive filing system split across multiple filing cabinets by last name — A-M in one cabinet, N-Z in another. Neither cabinet holds everything, but together they hold it all, and each one only has to be big enough for its own share.",
    examples: [
      {
        title: "Routing to the right shard by user id",
        code: `function getShardForUser(userId) {
  const shardCount = 4;
  return userId % shardCount; // simple hash-based routing
}

async function getUser(userId) {
  const shard = getShardForUser(userId);
  return databases[shard].query("SELECT * FROM users WHERE id = ?", [userId]);
}`,
        walkthrough: [
          { code: "userId % shardCount", explanation: "A simple way to consistently map any user id to one of the available shards." },
          { code: "databases[shard].query(...)", explanation: "Only the one database holding this user's data is ever queried." },
        ],
      },
    ],
    howItWorks: `
A shard key determines which shard a given piece of data belongs to —
often computed with a hash function so data spreads out roughly evenly.
Every read or write for a given piece of data goes to exactly the one
shard responsible for it, so each individual database only ever holds
and processes a fraction of the total dataset.
    `.trim(),
    whyItExists: `
Some datasets are simply too large — in size or in write traffic — for
any single database server to handle, no matter how powerful. Sharding
is the way to scale a database horizontally (more machines) rather than
vertically (a bigger machine), the same underlying idea as scalability
generally.
    `.trim(),
    whenToUse: `
Reach for sharding once a dataset's size or write throughput has
genuinely outgrown what a single (even well-replicated) database can
handle — this is usually a late-stage scaling decision, not an early one.
    `.trim(),
    whenNotToUse: `
Don't shard prematurely — it adds real complexity (queries that need
data from multiple shards become much harder, and re-sharding later is
painful) for a scale most applications never actually reach. Exhaust
simpler options first: a bigger server, replication, and caching.
    `.trim(),
    commonMistakes: [
      "Choosing a shard key that leads to uneven distribution — e.g. sharding by signup date when most users signed up recently, overloading one shard.",
      "Writing queries that need to join or aggregate data across multiple shards, which sharding makes much more expensive or awkward.",
      "Sharding before it's actually necessary, taking on real operational complexity for a scale that hasn't been reached yet.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, the difference between sharding and replication." },
      { difficulty: "Medium", prompt: "Describe a bad shard key choice for a table of orders, and why it would cause uneven load." },
      { difficulty: "Hard", prompt: "Explain why a query that needs to count all rows across every shard is more expensive than the same query on an unsharded database." },
    ],
    interviewQuestions: [
      { question: "What is database sharding?", answer: "Splitting a dataset into pieces, each stored on a separate database, based on a shard key, so no single database has to hold all the data." },
      { question: "What's the difference between sharding and replication?", answer: "Replication copies the same data to multiple databases; sharding splits different pieces of data across multiple databases — they solve different scaling problems and are often used together." },
      { question: "What makes a good shard key?", answer: "One that distributes data (and load) roughly evenly across all shards, and that most queries can use directly to route to the right shard without needing data from others." },
    ],
    prerequisites: ["databases", "database-replication"],
    relatedTopics: ["database-replication", "consistent-hashing", "scalability"],
    keywords: ["sharding", "shard key", "partitioning", "horizontal scaling"],
  },
  {
    id: "consistency-models",
    title: "Consistency Models",
    level: "intermediate",
    description: "How quickly, and how strictly, every copy of your data has to agree with every other copy.",
    explanation: `
Once data is copied across multiple databases (via replication) or split
across regions, a natural question comes up: if you write a change to
one copy, when — and how reliably — will every other copy reflect that
change? Different systems answer this differently, and that answer is
called their **consistency model**.

**Strong consistency** means every read, everywhere, always sees the
latest write — as if there were really only one copy. **Eventual
consistency** relaxes that: a write might take a moment to reach every
copy, but given enough time (and no new writes), every copy will
eventually agree.
    `.trim(),
    analogy:
      "Strong consistency is like a single shared whiteboard everyone reads from directly — the moment someone writes on it, everyone sees the update immediately. Eventual consistency is like several people taking their own photo of the whiteboard and syncing it later — for a little while, some people's photos might be a version behind, but eventually everyone's photo matches.",
    examples: [
      {
        title: "The same read, two different consistency guarantees",
        code: `// Strong consistency: guaranteed to see the write immediately
await write(userId, { balance: 100 });
const balance1 = await strictRead(userId); // always 100

// Eventual consistency: might briefly see a stale value
await write(userId, { balance: 100 });
const balance2 = await eventualRead(userId); // could still be the old value, briefly`,
        walkthrough: [
          { code: "await write(userId, ...)", explanation: "A change is made to one copy of the data." },
          { code: "strictRead(userId)", explanation: "Guaranteed to reflect that write immediately, no matter which copy answers." },
          { code: "eventualRead(userId)", explanation: "Might be answered by a copy that hasn't received the update yet." },
        ],
      },
    ],
    howItWorks: `
Strong consistency is usually achieved by routing every read through a
single source of truth (or requiring multiple copies to confirm a write
before it's considered done), which costs latency and availability
during network problems. Eventual consistency instead lets a write
settle in on each copy independently, at its own pace, which is faster
and more resilient to failures, at the cost of a short window where
reads can return stale data.
    `.trim(),
    whyItExists: `
There's a real, unavoidable tradeoff between how fast/reliable a system
stays under failures and how strictly up-to-date every read is
guaranteed to be — different applications land in different places on
that tradeoff depending on how much staleness they can tolerate.
    `.trim(),
    whenToUse: `
Choose strong consistency for data where staleness would cause real
harm — an account balance being checked before a withdrawal, an
inventory count during checkout. Choose eventual consistency for data
where a brief delay doesn't matter much — a like count, a follower
count, a search index.
    `.trim(),
    whenNotToUse: `
Don't default to strong consistency everywhere out of caution — it costs
real latency and availability, and most data in most applications
(activity feeds, view counts, recommendations) doesn't actually need it.
    `.trim(),
    commonMistakes: [
      "Assuming all databases are strongly consistent by default — many popular distributed databases default to eventual consistency for performance.",
      "Using eventually-consistent reads for something that genuinely needs strong consistency, like a payment balance.",
      "Treating 'eventual' as if it means 'never' — in a healthy system, eventual consistency typically resolves in milliseconds to seconds, not indefinitely.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Give one example of data where eventual consistency would be perfectly fine, and one where it wouldn't." },
      { difficulty: "Medium", prompt: "Explain, in your own words, why strong consistency tends to cost more latency than eventual consistency." },
      { difficulty: "Hard", prompt: "Describe a real bug that could occur if a signup flow read a user's data eventually-consistently right after writing it." },
    ],
    interviewQuestions: [
      { question: "What's the difference between strong and eventual consistency?", answer: "Strong consistency guarantees every read reflects the latest write immediately; eventual consistency allows a brief delay before all copies agree, trading immediacy for speed and resilience." },
      { question: "Why would a system choose eventual consistency over strong consistency?", answer: "Eventually consistent systems are typically faster and more available, especially during network issues, since they don't need every copy to confirm before a write is considered complete." },
      { question: "Give an example where eventual consistency would be an acceptable trade-off.", answer: "A social media like count or view count — being off by a few for a moment causes no real harm." },
    ],
    prerequisites: ["database-replication"],
    relatedTopics: ["cap-theorem", "database-replication", "sharding"],
    keywords: ["consistency", "strong consistency", "eventual consistency", "staleness"],
  },
  {
    id: "rate-limiting",
    title: "Rate Limiting",
    level: "intermediate",
    description: "Deliberately capping how many requests a client can make in a given time window.",
    explanation: `
Without any limit, a single client — whether malicious, buggy, or just
very active — could send an overwhelming number of requests and degrade
the service for everyone else. **Rate limiting** is a deliberate rule
that caps how many requests a given client (by user, API key, or IP
address) can make within a certain time window, rejecting or delaying
requests beyond that.
    `.trim(),
    analogy:
      "It's like a nightclub bouncer who only lets in a certain number of people per minute, no matter how many are waiting outside — not because the club dislikes visitors, but because letting everyone in at once would be a disaster for everyone already inside.",
    examples: [
      {
        title: "A simple fixed-window rate limiter",
        code: `const requestCounts = new Map(); // key: userId, value: { count, windowStart }

function isAllowed(userId, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const entry = requestCounts.get(userId);

  if (!entry || now - entry.windowStart > windowMs) {
    requestCounts.set(userId, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= limit) return false; // over the limit
  entry.count++;
  return true;
}`,
        walkthrough: [
          { code: "!entry || now - entry.windowStart > windowMs", explanation: "Starts a fresh counting window if none exists yet, or the previous window has expired." },
          { code: "entry.count >= limit", explanation: "Rejects the request if this window's limit has already been reached." },
          { code: "entry.count++", explanation: "Otherwise, counts this request and allows it through." },
        ],
      },
    ],
    howItWorks: `
Each incoming request is checked against a counter tied to that specific
client, tracked over a time window (fixed windows, like "per minute", or
smoother sliding windows). If the client is under their limit, the
counter increments and the request proceeds; if they're at or over it,
the request is rejected — commonly with an HTTP 429 "Too Many Requests"
response — until the window resets.
    `.trim(),
    whyItExists: `
Rate limiting protects a service from being overwhelmed — whether by a
genuine traffic spike, a buggy client stuck in a retry loop, or a
deliberate abuse attempt — and ensures one client's excessive usage
can't degrade the experience for everyone else.
    `.trim(),
    whenToUse: `
Add rate limiting to any public-facing API, especially ones with
expensive operations (search, sending emails, calling a paid third-party
service) or ones that could be abused (login attempts, password resets).
    `.trim(),
    whenNotToUse: `
Don't rate-limit so aggressively that legitimate, normal usage gets
rejected — limits should be set based on real usage patterns, and it's
often worth returning clear information (like how long until the limit
resets) so well-behaved clients can adapt.
    `.trim(),
    commonMistakes: [
      "Setting limits so low that normal, legitimate usage gets rejected, frustrating real users.",
      "Rate limiting only by IP address, which breaks down for many users sharing one IP (like an office) and is easy to evade with many IPs.",
      "Forgetting to tell the client why their request was rejected and when they can try again, making the limit feel arbitrary and confusing.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, why an API without any rate limit is vulnerable to a single misbehaving client." },
      { difficulty: "Medium", prompt: "Describe the difference between rate-limiting by IP address versus by an authenticated user id, and a downside of each." },
      { difficulty: "Hard", prompt: "Explain why a 'fixed window' rate limiter can allow twice the intended limit right at the boundary between two windows, and how a 'sliding window' avoids that." },
    ],
    interviewQuestions: [
      { question: "What problem does rate limiting solve?", answer: "It prevents a single client from overwhelming a service with too many requests, whether from abuse, bugs, or unexpectedly high legitimate usage." },
      { question: "What HTTP status code typically indicates a rate limit was hit?", answer: "429 Too Many Requests." },
      { question: "What's a weakness of rate limiting purely by IP address?", answer: "Multiple legitimate users can share one IP address (like an office network), and it's relatively easy for an attacker to spread requests across many IPs to evade the limit." },
    ],
    prerequisites: ["rest-apis"],
    relatedTopics: ["api-gateway", "load-balancing"],
    keywords: ["rate limiting", "throttling", "429", "abuse prevention"],
  },
  {
    id: "microservices-vs-monolith",
    title: "Microservices vs Monolith",
    level: "intermediate",
    description: "Two different ways to structure an application's codebase and deployment — as one unit, or as many independent pieces.",
    explanation: `
Early in a project, it's simplest to build everything — the user system,
the payments, the notifications — as one single application, deployed
and scaled as a single unit. This is a **monolith**. As a system and its
team grow, some organizations split that single application into many
smaller, independently deployable services, each responsible for one
part of the system, communicating over the network — this is a
**microservices** architecture.

Neither is universally correct: a monolith is simpler to build, test,
and deploy; microservices offer independent scaling and deployment, at
the cost of real operational complexity.
    `.trim(),
    analogy:
      "A monolith is like one large, all-purpose kitchen where every dish is prepared by the same staff in the same space. Microservices are like a food court, where each stall specializes in one thing and operates independently — more flexible and easier to scale one popular stall without touching the others, but now you need to coordinate delivery and communication between many separate operations instead of one.",
    examples: [
      {
        title: "The same feature, two different structures",
        code: `// Monolith: one codebase, one deployment
function handleOrder(order) {
  chargePayment(order);   // same process
  updateInventory(order); // same process
  sendConfirmationEmail(order); // same process
}

// Microservices: separate services, communicating over the network
async function handleOrderMicroservices(order) {
  await paymentService.charge(order);       // a network call
  await inventoryService.update(order);     // another service
  await notificationService.notify(order);  // yet another
}`,
        walkthrough: [
          { code: "chargePayment(order); (monolith)", explanation: "A regular function call within the same running process — fast, but tightly coupled." },
          { code: "await paymentService.charge(order); (microservices)", explanation: "A network call to a completely separate, independently deployed service." },
        ],
      },
    ],
    howItWorks: `
In a monolith, every part of the application runs as one process,
sharing memory and typically one database, so calling between parts is
just a regular function call. In microservices, each service is its own
separate process (often with its own database), communicating with
other services over the network — usually via HTTP APIs or message
queues — which introduces network latency, partial failure (one service
can be down while others work), and the need for careful API contracts
between services.
    `.trim(),
    whyItExists: `
As a codebase and a team both grow large, a monolith can become hard to
work on — every change risks affecting unrelated parts, and the whole
thing must be deployed together. Microservices let different teams own,
deploy, and scale their own piece of the system independently, at the
cost of significant added operational complexity.
    `.trim(),
    whenToUse: `
Start with a monolith for most new projects — it's simpler to build,
easier to reason about, and faster to change early on. Consider
splitting into microservices once a team has genuinely grown large
enough that independent teams need to deploy independently, or specific
parts of the system have wildly different scaling needs.
    `.trim(),
    whenNotToUse: `
Don't reach for microservices just because large companies use them —
for a small team or an early-stage product, the operational overhead
(network calls, service discovery, distributed debugging) usually costs
far more than it's worth. Many successful products run as a monolith for
years.
    `.trim(),
    commonMistakes: [
      "Adopting microservices prematurely, taking on distributed-systems complexity before the team or product actually needs it.",
      "Splitting services along lines that don't match how the team is organized, so every feature still requires coordinating across many services anyway.",
      "Forgetting that a network call between microservices can fail in ways a normal function call never could, and not handling those failures.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, the main tradeoff between a monolith and microservices." },
      { difficulty: "Medium", prompt: "Describe a warning sign that a monolith might be becoming difficult for a growing team to work in." },
      { difficulty: "Hard", prompt: "Explain why a single feature (like placing an order) becomes harder to reason about when it's split across three separate microservices instead of one monolith." },
    ],
    interviewQuestions: [
      { question: "What is the main difference between a monolith and microservices?", answer: "A monolith is one deployable application containing all functionality; microservices split functionality into many independently deployable services that communicate over the network." },
      { question: "What's a real cost of microservices that a monolith doesn't have?", answer: "Network calls between services can fail independently, add latency, and require careful handling of partial failures — problems a single in-process monolith never encounters." },
      { question: "Why might a company choose microservices despite the added complexity?", answer: "To let independent teams deploy and scale their own services without coordinating with every other team, and to scale only the specific parts of the system that need it." },
    ],
    prerequisites: ["scalability"],
    relatedTopics: ["api-gateway", "circuit-breaker", "scalability"],
    keywords: ["microservices", "monolith", "architecture", "distributed systems"],
  },
  {
    id: "pub-sub",
    title: "Publish/Subscribe (Pub/Sub)",
    level: "intermediate",
    description: "Letting one event be broadcast to many interested listeners, without the sender needing to know who they are.",
    explanation: `
A queue is great when exactly one worker should handle each piece of
work. But sometimes an event needs to be delivered to every interested
party, not just one — a new order might need to trigger an email, an
inventory update, and an analytics event, all at once.
**Publish/Subscribe** (pub/sub) solves this: a publisher sends a message
to a named **topic**, and every subscriber currently listening to that
topic receives its own copy.
    `.trim(),
    analogy:
      "It's like a radio broadcast. The radio station (publisher) doesn't know or care who's listening — it just broadcasts on its frequency (the topic). Anyone with a radio tuned to that frequency (a subscriber) hears the exact same broadcast, independently of everyone else.",
    examples: [
      {
        title: "One event, multiple independent subscribers",
        code: `// Publisher
eventBus.publish("order.created", { orderId: 42 });

// Subscriber 1
eventBus.subscribe("order.created", (event) => {
  sendConfirmationEmail(event.orderId);
});

// Subscriber 2 — completely independent of subscriber 1
eventBus.subscribe("order.created", (event) => {
  updateAnalytics(event.orderId);
});`,
        walkthrough: [
          { code: 'eventBus.publish("order.created", ...)', explanation: "Announces an event on a named topic, with no idea who (if anyone) is listening." },
          { code: 'eventBus.subscribe("order.created", ...) (first)', explanation: "Registers interest in that topic; runs independently whenever it fires." },
          { code: 'eventBus.subscribe("order.created", ...) (second)', explanation: "A completely separate subscriber, also notified of the exact same event, with no coordination with the first." },
        ],
      },
    ],
    howItWorks: `
A pub/sub system maintains a set of topics, each with zero or more
subscribers. When a publisher sends a message to a topic, the system
delivers a copy of that message to every current subscriber of that
topic, independently — publishers and subscribers never talk to each
other directly, and neither needs to know the other exists.
    `.trim(),
    whyItExists: `
Pub/sub lets you add a brand-new reaction to an existing event (like a
new notification type, or a new analytics hook) without touching the
code that publishes the event at all — the publisher and every
subscriber can be developed, deployed, and scaled completely
independently of each other.
    `.trim(),
    whenToUse: `
Reach for pub/sub whenever one event genuinely needs to trigger multiple
independent reactions, especially across different services or teams,
and especially when new subscribers might be added later without
changing the publisher.
    `.trim(),
    whenNotToUse: `
If exactly one worker should handle each message (like processing a
payment exactly once), a queue is the right tool, not pub/sub, which is
designed for broadcasting to many listeners rather than distributing
work to exactly one.
    `.trim(),
    commonMistakes: [
      "Confusing pub/sub (every subscriber gets every message) with a queue (exactly one worker gets each message) — they solve different problems.",
      "Assuming a subscriber that's offline when a message is published will still receive it later — depending on the system, that message may simply be missed unless durability/replay is explicitly configured.",
      "Publishing overly specific, tightly-coupled event data that assumes exactly which subscribers exist, defeating the purpose of the publisher not needing to know who's listening.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, the difference between a queue and pub/sub." },
      { difficulty: "Medium", prompt: "Describe a real feature (e.g. a new order) and list three independent subscribers that might react to it via pub/sub." },
      { difficulty: "Hard", prompt: "Explain what could go wrong if a subscriber is temporarily down when an important event is published, and how a system might guard against losing that event." },
    ],
    interviewQuestions: [
      { question: "What is publish/subscribe (pub/sub)?", answer: "A messaging pattern where a publisher sends messages to a named topic, and every current subscriber of that topic receives an independent copy, without publisher and subscriber knowing about each other." },
      { question: "What's the key difference between pub/sub and a message queue?", answer: "A queue delivers each message to exactly one consumer; pub/sub delivers each message to every subscriber of that topic." },
      { question: "Why is pub/sub useful for adding new features?", answer: "A new subscriber can be added to react to an existing event without any change to the code that publishes it." },
    ],
    prerequisites: ["queues"],
    relatedTopics: ["queues", "microservices-vs-monolith"],
    keywords: ["pub/sub", "publish subscribe", "topic", "event-driven", "broadcast"],
  },
];
