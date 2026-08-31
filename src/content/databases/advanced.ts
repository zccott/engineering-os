import type { Topic } from "../../types/content";

export const databasesAdvancedTopics: Topic[] = [
  {
    id: "database-migrations",
    title: "Database Migrations",
    level: "advanced",
    description: "Small, versioned scripts that change a database's schema over time, so every environment ends up with the same structure in the same order.",
    explanation: `
Once an application is live, its schema rarely stays frozen — you'll add
a column, create a new table, rename something. Doing that by hand
(logging into production and typing \`ALTER TABLE\` yourself) is risky:
it's easy to forget a step, apply changes in the wrong order, or have
your development database drift out of sync with what's actually running
in production.

A **migration** is a small script that describes one specific schema
change — "add a \`phone_number\` column to \`users\`" — saved as a file,
checked into version control alongside your application code, and
numbered or timestamped so migrations always run in a known, repeatable
order. A migration tool keeps track of which migrations have already
been applied to a given database, so running it again only applies the
new ones.
    `.trim(),
    analogy:
      "Manually editing a live schema is like renovating a house without ever writing down what you changed — nobody else can reliably reproduce it. Migrations are like a numbered set of renovation blueprints: blueprint 1 adds the garage, blueprint 2 adds a window, and any house (any environment — your laptop, staging, production) built by following the blueprints in order ends up identical.",
    examples: [
      {
        title: "A migration file adding a column",
        code: `-- migrations/0007_add_phone_number_to_users.sql

ALTER TABLE users
ADD COLUMN phone_number TEXT;`,
        language: "sql",
        explanation: "This one file describes exactly one schema change. Its filename encodes an order (0007), so a migration tool knows it should run after migration 0006 and before 0008.",
        walkthrough: [
          { code: "-- migrations/0007_add_phone_number_to_users.sql", explanation: "The filename itself records the migration's order and intent — this is migration number 7." },
          { code: "ALTER TABLE users", explanation: "Targets the existing users table rather than creating a new one." },
          { code: "ADD COLUMN phone_number TEXT;", explanation: "The single schema change this migration makes — adding one new column." },
        ],
      },
      {
        title: "A migration with an explicit rollback (using an ORM's migration tool, conceptually)",
        code: `// migrations/0008_create_reviews_table.js
exports.up = function (schema) {
  schema.createTable("reviews", (t) => {
    t.integer("id").primaryKey();
    t.integer("product_id").references("products.id");
    t.text("body");
  });
};

exports.down = function (schema) {
  schema.dropTable("reviews");
};`,
        explanation: "Many migration tools pair each change (up) with its exact opposite (down), so a migration can be undone cleanly if it needs to be rolled back.",
      },
      {
        title: "The same idea with Alembic (SQLAlchemy's migration tool)",
        code: `# migrations/versions/a1b2c3_add_phone_number.py

def upgrade():
    op.add_column("users", sa.Column("phone_number", sa.String()))

def downgrade():
    op.drop_column("users", "phone_number")`,
        language: "python",
        explanation: "Alembic is the migration tool most commonly paired with SQLAlchemy/FastAPI — upgrade() and downgrade() are exactly the up/down pair from the JavaScript example, just Python syntax; running `alembic upgrade head` applies every migration not yet recorded, in order.",
      },
    ],
    howItWorks: `
A migration tool keeps a small table inside the database itself (often
literally called \`schema_migrations\`) recording which migration files
have already been run. When you run the tool, it compares that record
against the migration files that exist, and applies only the ones not
yet marked as applied — in order.

Because migrations are just files, they travel with your codebase
through version control: every developer, and every environment
(development, staging, production), can run the exact same sequence of
migrations and end up with an identical schema, instead of drifting
apart from manual changes.
    `.trim(),
    whyItExists: `
Manual schema changes don't scale past a single person working on a
single database. The moment there's more than one developer, more than
one environment, or a need to deploy schema changes alongside code
changes in a repeatable way, you need changes to be recorded, ordered,
and re-runnable — which is exactly what migrations provide.
    `.trim(),
    whenToUse: `
Use migrations for essentially every schema change on any application
with more than one environment or more than one contributor — adding
columns, creating tables, changing constraints, backfilling data as part
of a schema change.
    `.trim(),
    whenNotToUse: `
For a true one-off, throwaway local prototype with a single developer
and no shared environments, the overhead of formal migration files may
not be worth it yet — though it's worth adopting them as soon as the
project is shared with anyone else or deployed anywhere.
    `.trim(),
    commonMistakes: [
      "Editing a migration file after it's already been applied elsewhere, instead of writing a new migration — this leaves environments that already ran the old version out of sync.",
      "Making a schema change directly against production to 'fix it quickly,' bypassing migrations entirely and causing drift from what the migration history says the schema should be.",
      "Writing a migration that changes both schema and large amounts of data in one long-running step, risking locking the table for a long time in production.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a migration that adds a boolean is_active column, defaulting to true, to a users table." },
      { difficulty: "Medium", prompt: "Write a migration that creates a new tags table and a join table linking tags to posts (a many-to-many relationship)." },
      { difficulty: "Hard", prompt: "Explain why editing an already-applied migration file, instead of writing a new one, can cause a team's databases to drift out of sync with each other." },
    ],
    interviewQuestions: [
      { question: "What is a database migration?", answer: "A versioned script describing one specific schema change, tracked in a known order so it can be applied consistently and repeatably across every environment." },
      { question: "How does a migration tool know which migrations still need to run?", answer: "It keeps a record (often a table inside the database itself) of which migration files have already been applied, and only runs the ones not yet recorded." },
      { question: "Why shouldn't you edit an already-applied migration file instead of writing a new one?", answer: "Environments that already ran the original version won't see the edit, causing their schema to drift out of sync with environments that run the edited version fresh." },
    ],
    prerequisites: ["orms"],
    relatedTopics: ["orms", "normalization"],
    keywords: ["migration", "schema change", "version control", "schema_migrations"],
  },
  {
    id: "query-optimization",
    title: "Query Optimization",
    level: "advanced",
    description: "Reading what a database actually plans to do to execute a query, and using that to figure out why it's slow and how to speed it up.",
    explanation: `
When a query is slow, guessing why rarely works well — you need to see
what the database is actually doing. Every database has a way to ask it
to explain its plan before (or while) running a query, usually via an
\`EXPLAIN\` command. This shows you things like whether it's scanning
every row in a table, whether it's using an index, and roughly how much
work each step is estimated to cost.

**Query optimization** is the practice of reading that plan, spotting
the expensive parts (often a full table scan where an index lookup
would help, or a poorly ordered join), and fixing them — usually by
adding an index, rewriting the query, or occasionally restructuring the
schema.
    `.trim(),
    analogy:
      "Running EXPLAIN on a slow query is like asking a delivery driver to describe their planned route before they leave. If they say 'I'll drive past every house in the city checking addresses one by one,' you immediately know why the delivery is slow, and you can fix it — hand them a map (an index) instead.",
    examples: [
      {
        title: "Reading a query plan",
        code: `EXPLAIN SELECT * FROM orders WHERE customer_email = 'amara@example.com';

-- Output might show:
-- Seq Scan on orders  (cost=0.00..18334.00 rows=1 width=72)
--   Filter: (customer_email = 'amara@example.com'::text)`,
        language: "sql",
        explanation: "'Seq Scan' means a sequential (full table) scan — the database is checking every row. On a large table, that's the expensive part to fix.",
        walkthrough: [
          { code: "EXPLAIN SELECT * FROM orders WHERE customer_email = 'amara@example.com';", explanation: "Asks the database to describe how it would execute this query, without necessarily running it." },
          { code: "Seq Scan on orders  (cost=0.00..18334.00 rows=1 width=72)", explanation: "Says the database plans to sequentially scan the whole orders table — the estimated cost (18334) is high for finding just one row." },
          { code: "Filter: (customer_email = 'amara@example.com'::text)", explanation: "Confirms it's checking this condition against every row it scans, one at a time." },
        ],
      },
      {
        title: "After adding an index",
        code: `CREATE INDEX idx_orders_customer_email ON orders (customer_email);

EXPLAIN SELECT * FROM orders WHERE customer_email = 'amara@example.com';

-- Output might now show:
-- Index Scan using idx_orders_customer_email on orders
--   (cost=0.42..8.44 rows=1 width=72)`,
        language: "sql",
        explanation: "After the index exists, the plan switches to an 'Index Scan' with a dramatically lower estimated cost — the database jumps to matching rows instead of checking every one.",
      },
    ],
    howItWorks: `
Before running a query, the database's query planner considers multiple
possible ways to execute it (scan the whole table, use this index, use
that index, join in this order versus that order), estimates the cost of
each, and picks the plan it believes will be cheapest, based on
statistics it keeps about the data (like how many rows a table has, or
how many distinct values a column contains).

\`EXPLAIN\` reveals that chosen plan (and often, with a variant like
\`EXPLAIN ANALYZE\`, the plan's actual measured cost after really running
it). Common fixes once you spot a problem: add a missing index, rewrite
a query to avoid an operation that blocks index use (like wrapping an
indexed column in a function), or restructure an inefficient join.
    `.trim(),
    whyItExists: `
Query optimization exists because a database's planner, while
sophisticated, works from statistics and heuristics — it can make a
poor choice, or a query can be written in a way that prevents it from
using an index it otherwise could. Being able to see and reason about
the actual execution plan is what turns "this query is slow" from a
guessing game into a solvable, evidence-based problem.
    `.trim(),
    whenToUse: `
Reach for query optimization whenever a specific query is measurably
slow, or before shipping a new query against a table you expect to grow
large — checking the plan early can catch a missing index before it
becomes a production problem.
    `.trim(),
    whenNotToUse: `
Don't spend time optimizing a query that already runs fast and only
touches a small amount of data — premature optimization adds complexity
for no real benefit. Focus effort on queries that are actually measured
to be slow or that run extremely often.
    `.trim(),
    commonMistakes: [
      "Adding an index without checking whether the query planner actually uses it — sometimes the fix requires rewriting the query, not just adding an index.",
      "Optimizing based on a guess instead of actually reading the EXPLAIN output, and fixing the wrong thing.",
      "Testing query performance only on a small local database, where a full table scan is fast enough to hide a problem that will appear at production scale.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain what a 'Seq Scan' in a query plan tells you about how the database is executing that query." },
      { difficulty: "Medium", prompt: "Given a slow query filtering on an unindexed column, describe the steps you'd take to diagnose and fix it." },
      { difficulty: "Hard", prompt: "Explain why wrapping an indexed column in a function inside a WHERE clause (e.g. LOWER(email) = ...) can prevent the database from using that column's index." },
    ],
    interviewQuestions: [
      { question: "What does the EXPLAIN command do?", answer: "It shows the execution plan the database intends to use (or used) for a query, including whether it scans the whole table or uses an index, and the estimated cost of each step." },
      { question: "What's the difference between EXPLAIN and EXPLAIN ANALYZE?", answer: "EXPLAIN shows the planned execution strategy and estimated costs without necessarily running the query; EXPLAIN ANALYZE actually runs it and reports the real measured costs and timings." },
      { question: "Name one common fix for a slow query that's doing a full table scan.", answer: "Adding an index on the column used in the WHERE clause (or join condition) so the database can look up matching rows directly instead of scanning every row." },
    ],
    prerequisites: ["indexes", "joins"],
    relatedTopics: ["indexes", "joins", "connection-pooling"],
    keywords: ["EXPLAIN", "query plan", "query optimization", "seq scan", "index scan"],
  },
  {
    id: "connection-pooling",
    title: "Connection Pooling",
    level: "advanced",
    description: "Keeping a small set of already-open database connections ready to reuse, instead of opening (and closing) a brand-new one for every request.",
    explanation: `
Opening a connection to a database isn't free — it involves a network
handshake, authentication, and setup work on both the application side
and the database side, taking real time (often tens of milliseconds).
If a web server opens a fresh connection for every single incoming
request and closes it when done, that overhead gets paid over and over,
and a sudden burst of traffic can open so many connections at once that
the database itself becomes overwhelmed (every database has a hard
limit on how many connections it can handle at once).

**Connection pooling** solves this by keeping a fixed-size set of
already-open connections — a **pool** — ready to go. When application
code needs to talk to the database, it borrows a connection from the
pool, uses it, and returns it to the pool when finished, rather than
opening and closing a new one each time.
    `.trim(),
    analogy:
      "Opening a new connection per request is like renting a brand-new car from scratch (paperwork and all) every time you need to run one errand, then scrapping it afterward. Connection pooling is like a car-sharing service with a small fleet of cars already fueled and ready — you check one out, use it, and return it for the next person, instead of building a new car every time.",
    examples: [
      {
        title: "Without pooling — a new connection per request",
        code: `// Conceptual, not real code:
app.get("/user/:id", async (req, res) => {
  const connection = await openNewDatabaseConnection(); // slow, every time
  const user = await connection.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  await connection.close();
  res.json(user);
});`,
        explanation: "Every single request pays the full cost of opening and later closing a connection, even under heavy, repeated traffic.",
      },
      {
        title: "With a connection pool",
        code: `const pool = createConnectionPool({ min: 2, max: 10 });

app.get("/user/:id", async (req, res) => {
  const connection = await pool.acquire(); // reuses an existing connection
  try {
    const user = await connection.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    res.json(user);
  } finally {
    pool.release(connection); // returns it for the next request to use
  }
});`,
        explanation: "The pool keeps between 2 and 10 connections open and ready. Each request borrows one, uses it, and gives it back — no repeated connection setup cost.",
        walkthrough: [
          { code: "const pool = createConnectionPool({ min: 2, max: 10 });", explanation: "Sets up a pool that keeps at least 2 connections open, and never opens more than 10 at once." },
          { code: "const connection = await pool.acquire();", explanation: "Borrows an already-open connection from the pool (or opens a new one if none are free and the pool hasn't hit its max)." },
          { code: "const user = await connection.query(...)", explanation: "Uses the borrowed connection to run the query, same as any direct connection would." },
          { code: "pool.release(connection);", explanation: "Returns the connection to the pool instead of closing it, so the next request can reuse it immediately." },
        ],
      },
    ],
    howItWorks: `
The pool maintains a set of open connections, somewhere between a
configured minimum and maximum count. When code asks to "borrow" a
connection, the pool hands over one that's currently idle (or opens a
new one if under the max and none are free); if the pool is already at
its max and all connections are busy, the request waits until one is
returned. When code finishes, it "releases" the connection back to the
pool rather than closing it, making it available for the next borrower.

This caps the total number of connections the database ever sees at
once (protecting it from being overwhelmed), while avoiding the repeated
setup cost of opening a brand-new connection for every single unit of
work.
    `.trim(),
    whyItExists: `
Databases have a hard limit on simultaneous connections, and opening a
connection is comparatively expensive. Without pooling, an application
under real traffic would either pay that connection-setup cost
constantly or risk exhausting the database's connection limit entirely
during a traffic spike, causing new requests to fail outright.
    `.trim(),
    whenToUse: `
Use connection pooling in essentially any application server that
talks to a database and handles more than one request at a time — it's
standard practice in production web applications, and most database
drivers and ORMs either build it in or support it directly.
    `.trim(),
    whenNotToUse: `
A short-lived script that opens one connection, does its work, and exits
doesn't need a pool — the overhead of one connection isn't worth
managing a whole pool for. Pooling earns its keep specifically under
repeated, concurrent access.
    `.trim(),
    commonMistakes: [
      "Forgetting to release a borrowed connection back to the pool, which eventually exhausts the pool and makes every subsequent request wait forever.",
      "Setting the pool's max size larger than the database's actual maximum connection limit, especially when running many application server instances that each have their own pool.",
      "Assuming pooling makes individual queries faster — it removes connection setup overhead, but a slow query is still just as slow.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, why opening a brand-new database connection for every single web request is wasteful." },
      { difficulty: "Medium", prompt: "Describe what would happen to a database if 500 application server instances each opened their own pool with a max of 20 connections." },
      { difficulty: "Hard", prompt: "Explain a bug scenario where forgetting to release a connection back to the pool would eventually cause every request to hang." },
    ],
    interviewQuestions: [
      { question: "What problem does connection pooling solve?", answer: "It avoids the repeated cost of opening and closing a database connection for every request, and caps the total number of simultaneous connections the database has to handle." },
      { question: "What happens when all connections in a pool are currently in use and a new request needs one?", answer: "The request waits until a connection is released back to the pool (or, if under the configured maximum, a new connection is opened)." },
      { question: "Why can't you just set a connection pool's maximum size arbitrarily high?", answer: "Because the database itself has a hard limit on how many simultaneous connections it can handle, and exceeding it (especially across many application instances) can overwhelm or reject connections entirely." },
    ],
    prerequisites: ["transactions-and-acid"],
    relatedTopics: ["transactions-and-acid", "query-optimization"],
    keywords: ["connection pool", "database connections", "concurrency", "resource limits"],
  },
  {
    id: "nosql-data-modeling",
    title: "NoSQL Data Modeling",
    level: "advanced",
    description: "Designing the shape of a document to match how it'll actually be read, often by embedding related data together instead of splitting it across normalized tables.",
    explanation: `
Relational design (as covered by normalization) starts from the data's
structure and works to eliminate duplication, trusting joins to
reassemble related pieces when needed. **Document databases** (like
MongoDB) flip that emphasis: since there's no cheap, universal join
across collections, you design a document's *shape* around how it will
actually be read, and it's normal — even encouraged — to **embed**
related data directly inside a single document rather than **reference**
it in a separate one.

The central design question in NoSQL modeling is: will this related
data usually be read together with its parent? If yes, embedding it
(nesting it directly inside the same document) avoids extra lookups. If
the related data is large, changes independently, or is shared across
many parents, referencing it (storing just an id, similar to a foreign
key) is usually the better call.
    `.trim(),
    analogy:
      "A normalized relational schema is like a well-organized filing cabinet where every fact lives in exactly one folder, and you cross-reference folders when you need the full picture. A document database is more like handing someone a single ready-made report that already has everything they'll need to read stapled together in one packet — faster to hand over, but if a stapled-in fact needs updating, you may have to redo several packets.",
    examples: [
      {
        title: "Embedding — a blog post with its comments",
        code: `// A single document in a "posts" collection
{
  "_id": "post_123",
  "title": "Why We Chose Postgres",
  "body": "...",
  "comments": [
    { "author": "Kenji", "text": "Great write-up!" },
    { "author": "Priya", "text": "Curious about your indexing strategy." }
  ]
}`,
        explanation: "Comments are almost always read alongside their post, and rarely need to be queried independently, so embedding them directly avoids a second lookup entirely.",
        walkthrough: [
          { code: '"_id": "post_123",', explanation: "The document's unique identifier, similar in role to a primary key." },
          { code: '"title": "Why We Chose Postgres",', explanation: "A regular top-level field on the document." },
          { code: '"comments": [', explanation: "Comments live nested directly inside the post document, as an array." },
          { code: '{ "author": "Kenji", "text": "Great write-up!" }', explanation: "Each comment is embedded inline, rather than stored in a separate collection referenced by an id." },
        ],
      },
      {
        title: "Referencing — a post and its author",
        code: `// posts collection
{ "_id": "post_123", "title": "Why We Chose Postgres", "author_id": "user_45" }

// users collection
{ "_id": "user_45", "name": "Amara Musa", "bio": "Backend engineer..." }`,
        explanation: "An author is shared across many posts and has a full independent profile that changes on its own schedule, so referencing them by id (rather than embedding the full user document into every post) avoids duplicating and re-syncing their profile everywhere they've posted.",
      },
    ],
    howItWorks: `
Because document databases typically don't support efficient joins
across collections the way relational databases do, a query for "this
document" only cheaply returns exactly that document's own fields —
anything embedded comes along for free, but anything referenced by id
requires a separate follow-up query (or, in some databases, a more
limited join-like operation) to resolve.

Modeling decisions come down to weighing that against the relational
downsides of duplication: embedding trades some duplicated or
harder-to-update data for fewer, faster reads; referencing trades an
extra lookup for a single source of truth, closer to how a normalized
relational table would represent the same relationship.
    `.trim(),
    whyItExists: `
Some access patterns are overwhelmingly "read this whole thing together
every time" (a post and its comments, a shopping cart and its line
items), and forcing that data through a strict, fully normalized,
multi-table design adds join overhead for a benefit (avoiding
duplication) that may barely matter if the embedded data rarely changes
independently. NoSQL document modeling exists to let the data's shape
follow its actual read pattern instead of a fixed normalization rule.
    `.trim(),
    whenToUse: `
Embed related data when it's almost always read together with its
parent, doesn't grow unbounded, and doesn't need to be queried or
updated independently very often — comments on a post, line items on an
order, an address on a user profile. Reference (by id) when the related
data is large, shared across many parents, updated independently, or
queried on its own frequently.
    `.trim(),
    whenNotToUse: `
Avoid embedding data that grows without bound (like an ever-growing
list of comments on a very popular post, which can make a single
document unwieldy or hit size limits) or that needs to be updated
independently of its parent across many documents at once — that's a
sign it should be a separate, referenced collection instead.
    `.trim(),
    commonMistakes: [
      "Embedding a list that can grow indefinitely (like comments on a viral post), eventually hitting a document size limit or making the document slow to load.",
      "Automatically applying relational-style normalization habits to a document database, ending up with excessive references and losing the performance benefit documents are meant to offer.",
      "Embedding data that's shared across many parent documents (like a product's details inside every order that contains it), then having to update it in many places when it changes.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "For a shopping cart with line items, decide whether you'd embed the line items directly in the cart document or reference them separately, and explain why." },
      { difficulty: "Medium", prompt: "Design a document shape for a 'product review' in an e-commerce app, deciding whether the reviewer's profile info should be embedded or referenced." },
      { difficulty: "Hard", prompt: "Describe a realistic scenario where embedding data seemed convenient at first but caused problems as the app grew, and explain how you'd redesign it." },
    ],
    interviewQuestions: [
      { question: "What's the difference between embedding and referencing in document database design?", answer: "Embedding nests related data directly inside a parent document so it's fetched together in one read; referencing stores just an id pointing to a separate document, requiring an extra lookup to retrieve the related data." },
      { question: "Why is NoSQL document modeling often described as designing around access patterns rather than around normalization?", answer: "Because without cheap universal joins, the right document shape depends on how the data will actually be read together, not on eliminating all duplication the way relational normalization does." },
      { question: "What's a risk of embedding an unbounded list inside a document?", answer: "The document can keep growing indefinitely, eventually becoming slow to load or hitting the database's maximum document size limit." },
    ],
    prerequisites: ["normalization"],
    relatedTopics: ["normalization", "joins"],
    keywords: ["NoSQL", "document database", "embedding", "referencing", "MongoDB", "denormalization"],
  },
  {
    id: "window-functions",
    title: "Window Functions",
    level: "advanced",
    description: "Calculations across a set of related rows — like a running total or a rank — without collapsing them into a single row the way GROUP BY does.",
    explanation: `
Aggregation answers "one summary value per group" by collapsing rows
together — one row per customer, one row per category. But sometimes
you want a per-row value that's still calculated *using* its group as
context, while keeping every original row: "each order, plus that
customer's running total so far," or "each product's price, plus its
rank within its category."

A **window function** does exactly this, using \`OVER (...)\`, optionally
with \`PARTITION BY\` (which rows count as a group) and \`ORDER BY\` (their
order within that group). Unlike \`GROUP BY\`, it doesn't merge rows —
every original row stays in the output, just with an extra computed
column alongside it.
    `.trim(),
    analogy:
      "GROUP BY is like handing a customer one combined receipt total. A window function is like handing back every individual line item, but with a running total (or a rank against everything else they bought) printed on each line — nothing gets merged away, each line just gets extra context.",
    examples: [
      {
        title: "Ranking within a partition",
        code: `SELECT name, category, price,
  RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
FROM products;`,
        language: "sql",
        explanation: "Every product row is kept, but each one now also shows where its price ranks within its own category, highest first.",
        walkthrough: [
          { code: "PARTITION BY category", explanation: "Defines the 'window' of rows each ranking is computed within — restarting the count for every new category, instead of ranking across the whole table." },
          { code: "ORDER BY price DESC", explanation: "Decides the order within each partition that RANK() counts through." },
          { code: "RANK() OVER (...)", explanation: "Computes the rank for the current row using that partition and order, while still returning every row from products, not just the top one per category." },
        ],
      },
      {
        title: "A running total",
        code: `SELECT id, amount,
  SUM(amount) OVER (ORDER BY id) AS running_total
FROM payments;`,
        language: "sql",
        explanation: "Each row shows its own amount plus the cumulative sum of every row up to and including it, ordered by id — no GROUP BY, and no rows merged together.",
      },
    ],
    howItWorks: `
For each output row, the database determines its "window" — the other
rows that belong with it, from \`PARTITION BY\`, in the order given by
\`ORDER BY\` — and computes the function (\`RANK\`, \`SUM\`, \`ROW_NUMBER\`,
\`LAG\`/\`LEAD\`, and others) over that window. Critically, the original
row is still returned as-is; the window function's result is just an
extra column added alongside it, which is the core difference from
\`GROUP BY\`, which discards the individual rows entirely in favor of one
row per group.
    `.trim(),
    whyItExists: `
Without window functions, something like "rank within category" or "a
running total" required a self-join or a correlated subquery per row —
verbose to write and slow at scale, since the database effectively has
to reprocess related rows for every single output row by hand instead
of computing it in one pass.
    `.trim(),
    whenToUse: `
Reach for a window function for leaderboards and rankings, running
totals or moving averages, comparing a row to the previous or next one
(\`LAG\`/\`LEAD\`), or "top N rows per group" queries.
    `.trim(),
    whenNotToUse: `
If you genuinely want one summarized row per group, with the individual
rows discarded, plain \`GROUP BY\` aggregation is simpler and says exactly
that — a window function that keeps every row is the wrong tool when you
don't actually need every row.
    `.trim(),
    commonMistakes: [
      "Forgetting PARTITION BY entirely, which computes the ranking or total across the whole table instead of restarting it per group.",
      "Confusing RANK (leaves gaps in the numbering after ties), DENSE_RANK (no gaps after ties), and ROW_NUMBER (always a unique sequential number, ties broken arbitrarily).",
      "Trying to filter directly on a window function's result in a WHERE clause, which isn't allowed — WHERE is evaluated before window functions are computed.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a query using ROW_NUMBER() to number each customer's orders in the order they were placed." },
      { difficulty: "Medium", prompt: "Write a query that shows each employee's salary along with their salary rank within their own department." },
      { difficulty: "Hard", prompt: "Explain why WHERE price_rank = 1 fails directly after a window function that computes price_rank, and rewrite the query using a CTE so it works." },
    ],
    interviewQuestions: [
      { question: "What's the difference between GROUP BY and a window function?", answer: "GROUP BY collapses rows into a single summary row per group; a window function keeps every original row while still computing a value using that row's group as context." },
      { question: "What's the difference between RANK, DENSE_RANK, and ROW_NUMBER?", answer: "RANK leaves gaps in the numbering after a tie, DENSE_RANK doesn't leave gaps, and ROW_NUMBER always assigns a unique sequential number regardless of ties." },
      { question: "Why can't you filter on a window function's result directly in a WHERE clause?", answer: "WHERE is evaluated before window functions are computed, so the value doesn't exist yet at that stage — you need to wrap the query in a subquery or CTE and filter in the outer query instead." },
    ],
    prerequisites: ["aggregation", "subqueries-and-ctes"],
    relatedTopics: ["aggregation", "subqueries-and-ctes", "joins"],
    keywords: ["window function", "OVER", "PARTITION BY", "RANK", "ROW_NUMBER", "running total", "LAG", "LEAD"],
  },
  {
    id: "upsert-and-conflicts",
    title: "Upsert & Conflict Handling",
    level: "advanced",
    description: "Inserting a row, or updating it instead if it already exists, in a single atomic statement.",
    explanation: `
Sometimes you don't know in advance whether a row already exists — like
syncing a record from an external system, or incrementing a page-view
counter that may or may not have started yet. Doing a \`SELECT\` to check,
then an \`INSERT\` or \`UPDATE\` depending on the result, isn't safe: two
requests running at the same time could both see "it doesn't exist yet"
and both try to insert, causing a duplicate-key error or one update
silently overwriting the other.

An **upsert** (\`INSERT ... ON CONFLICT\` in Postgres, \`MERGE\` in
standard SQL and SQL Server) does the check-and-write as a single
atomic database operation, removing that race condition entirely.
    `.trim(),
    analogy:
      "It's like a hotel front desk that either creates a new reservation or updates the existing one for that guest in one motion — rather than an agent looking the guest up, stepping away, and someone else double-booking the same room in the gap before the agent comes back to act on what they saw.",
    examples: [
      {
        title: "Insert, or update the existing row on conflict",
        code: `INSERT INTO page_views (page_id, views)
VALUES ('home', 1)
ON CONFLICT (page_id)
DO UPDATE SET views = page_views.views + 1;`,
        language: "sql",
        explanation: "If no row exists for 'home' yet, it's inserted with 1 view; if one already exists, its views column is incremented instead — atomically, with no gap for a race condition.",
        walkthrough: [
          { code: "INSERT INTO page_views (page_id, views) VALUES ('home', 1)", explanation: "Attempts a normal insert, as if no row for this page_id existed yet." },
          { code: "ON CONFLICT (page_id)", explanation: "Names the unique constraint (here, on page_id) to watch for — if the insert would violate it, run the fallback instead of raising an error." },
          { code: "DO UPDATE SET views = page_views.views + 1", explanation: "Runs against the existing row instead — page_views.views here refers to the value already in the table, not the attempted new row." },
        ],
      },
      {
        title: "Ignore instead of update",
        code: `INSERT INTO users (email, name)
VALUES ('a@example.com', 'Alice')
ON CONFLICT (email) DO NOTHING;`,
        language: "sql",
        explanation: "If a user with this email already exists, the statement simply does nothing instead of erroring or overwriting the existing row — useful for safe, repeatable deduplication.",
      },
    ],
    howItWorks: `
The database attempts the insert as normal. If it would violate a
unique constraint or primary key named in \`ON CONFLICT\`, instead of
raising an error, it runs the specified fallback (\`DO UPDATE\` or
\`DO NOTHING\`) against the conflicting existing row — all as one atomic
operation. Because it's atomic, no other transaction can slip a
conflicting write in between "checking" and "writing," which is exactly
what a separate SELECT-then-INSERT in application code can't guarantee.
    `.trim(),
    whyItExists: `
It exists to remove the race condition inherent in "check, then act"
logic written in application code, and to avoid the extra round trip of
a separate SELECT before deciding whether to INSERT or UPDATE.
    `.trim(),
    whenToUse: `
Reach for an upsert when syncing external data that may or may not
already exist, maintaining counters, building "create or update
settings" endpoints, or deduplicating on a unique column like an email
address.
    `.trim(),
    whenNotToUse: `
When insert and update should trigger genuinely different application
behavior — like sending a "welcome" email only on true creation — an
upsert makes it harder to tell which branch actually happened unless you
inspect what the statement returned; explicit, separate insert and
update logic can be clearer there.
    `.trim(),
    commonMistakes: [
      "Naming a column in ON CONFLICT that isn't backed by an actual unique constraint or primary key — Postgres requires a real constraint to detect the conflict against.",
      "Forgetting that DO UPDATE must reference the table name (like page_views.views) to mean 'the existing row's value,' not the newly attempted one.",
      "Continuing to use separate SELECT-then-INSERT/UPDATE application logic in a case with real concurrency, and hitting rare but genuine race conditions an upsert would have avoided.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write an upsert that inserts a product by sku, or increments its stock count if that sku already exists." },
      { difficulty: "Medium", prompt: "Write an upsert using ON CONFLICT DO NOTHING to safely deduplicate email signups." },
      { difficulty: "Hard", prompt: "Walk through, step by step, how two simultaneous requests using separate SELECT-then-INSERT logic (without an upsert) could both succeed and create two rows despite an intended uniqueness rule." },
    ],
    interviewQuestions: [
      { question: "What problem does an upsert solve that a SELECT followed by INSERT or UPDATE doesn't?", answer: "It removes the race condition between checking whether a row exists and writing to it, by making the whole check-and-write a single atomic database operation." },
      { question: "What must the column(s) named in ON CONFLICT correspond to?", answer: "An actual unique constraint or primary key on the target table — not just any column." },
      { question: "What's the difference between ON CONFLICT DO NOTHING and DO UPDATE?", answer: "DO NOTHING silently skips the write when a conflict occurs; DO UPDATE overwrites fields on the existing conflicting row instead." },
    ],
    prerequisites: ["transactions-and-acid"],
    relatedTopics: ["transactions-and-acid", "basic-sql-queries"],
    keywords: ["upsert", "ON CONFLICT", "MERGE", "race condition", "atomic", "idempotent write"],
  },
];
