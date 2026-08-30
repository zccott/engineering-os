import type { Topic } from "../../types/content";

export const databasesBeginnerTopics: Topic[] = [
  {
    id: "what-is-a-database",
    title: "What is a Database?",
    level: "beginner",
    description: "A system that stores your data in an organized shape you can search, filter, and change directly — not just a file you save data into.",
    explanation: `
Imagine you kept all your app's data in a giant text file — every user on
one line, every order on another. To find "all orders placed by Amara
last week," you'd have to open the file and read through every single
line yourself, by hand, every time.

A **database** is software built specifically to avoid that. It stores
your data broken up into organized, labeled structures (most commonly
**tables**, which look a lot like spreadsheets), and it comes with its
own language for asking questions of that data — "give me every order
from Amara, sorted by date" — without you ever having to manually scan
anything. The database does the searching, and it does it fast, even
across millions of records.

This is the hands-on side of databases: you don't just store data
somewhere for safekeeping, you *query* it directly, using a language
built for exactly that purpose.
    `.trim(),
    analogy:
      "A pile of receipts shoved in a shoebox technically 'stores' your spending data, but finding anything means digging through the whole box. A database is like a well-organized filing cabinet with labeled folders, an index at the front, and a clerk who can hand you exactly the folder you ask for in seconds.",
    examples: [
      {
        title: "Asking a database a question directly",
        code: `SELECT name, email
FROM users
WHERE signed_up_at > '2026-01-01';`,
        explanation: "This is a real query, not pseudocode. It asks the database directly for every user who signed up after a certain date — the database handles the searching.",
        walkthrough: [
          { code: "SELECT name, email", explanation: "Says which pieces of information you want back — just the name and email, not everything." },
          { code: "FROM users", explanation: "Tells the database which table to look in." },
          { code: "WHERE signed_up_at > '2026-01-01';", explanation: "Narrows the results down to only the rows that match this condition." },
        ],
      },
      {
        title: "A database holds many related tables",
        code: `-- A single small database might contain:
users        (people who use the app)
orders       (purchases people have made)
products     (items available to buy)
reviews      (feedback people left on products)`,
        explanation: "A real database usually isn't just one table — it's a whole collection of related tables that together represent your application's data.",
      },
    ],
    howItWorks: `
A database runs as its own piece of software (like PostgreSQL, MySQL, or
SQLite), usually separate from your application code. Your application
connects to it over a connection, sends it a query written in **SQL**
(Structured Query Language), and the database figures out the fastest
way to find and return exactly the data that was asked for.

Because the database itself understands the structure of the data (which
columns exist, what type each one is, how tables relate to each other),
it can search, filter, sort, and combine data far more efficiently than
your own application code scanning through everything manually.
    `.trim(),
    whyItExists: `
Applications need to store data that outlives a single run of the
program, that many users can read and write at once, and that can be
searched in flexible ways nobody fully predicted up front. Plain files
struggle with all three: they're slow to search, they get corrupted
easily under concurrent writes, and answering a new kind of question
usually means writing brand-new, one-off code. Databases exist to solve
storage, search, and safe concurrent access all at once, with a standard
query language instead of custom code for every question.
    `.trim(),
    whenToUse: `
Reach for a database as soon as your application has data that needs to
persist between runs, that multiple people or processes might read or
write at the same time, or that you'll need to search and filter in
ways you can't fully predict today.
    `.trim(),
    whenNotToUse: `
For truly tiny, single-user, throwaway scripts — a quick one-off
calculation, a config file that never changes — a plain file or an
in-memory variable is simpler and a database is unnecessary overhead.
    `.trim(),
    commonMistakes: [
      "Thinking a database is just 'a place files are stored' rather than a system you actively query.",
      "Assuming you need to write custom search code, when the database can already do filtering and sorting for you.",
      "Confusing a spreadsheet file with a database — a spreadsheet has no query language and no safe way for multiple people to write at once.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "List three questions you might want to ask about data in a to-do list app (e.g. 'show me all incomplete tasks'). For each, name which pieces of data you'd need." },
      { difficulty: "Medium", prompt: "Explain, in your own words, why searching a large text file by hand is slower than asking a database the same question." },
      { difficulty: "Hard", prompt: "Sketch (in words) what tables a simple blog application would need, and what kind of question you'd ask each one." },
    ],
    interviewQuestions: [
      { question: "What is a database, in plain terms?", answer: "Software that stores data in an organized, structured way and provides a query language to search, filter, and modify that data directly, rather than requiring you to scan through it manually." },
      { question: "Why not just store application data in a plain text file?", answer: "Plain files don't offer fast searching, don't safely handle multiple simultaneous writers, and require custom code for every new kind of question — a database solves all three." },
      { question: "What language do most relational databases use to ask questions of the data?", answer: "SQL (Structured Query Language)." },
    ],
    relatedTopics: ["tables-rows-columns", "basic-sql-queries"],
    keywords: ["database", "SQL", "data storage", "query"],
  },
  {
    id: "tables-rows-columns",
    title: "Tables, Rows & Columns",
    level: "beginner",
    description: "The basic grid shape — like a spreadsheet — that relational databases use to organize data.",
    explanation: `
Once you know a database stores organized data, the next question is:
organized *how*? In a **relational database**, data is organized into
**tables**, and each table looks a lot like a spreadsheet.

Each table has **columns**, which define what pieces of information are
tracked (like \`name\`, \`email\`, \`age\`) and what type of data each one
holds. Each table also has **rows**, where every row is one individual
record — one specific user, one specific order, one specific product.
Every row in a table has a value for every column (or is explicitly left
empty).

A table named \`users\` with columns \`id\`, \`name\`, and \`email\` might have
one row per actual person who signed up.
    `.trim(),
    analogy:
      "Think of a table like a class attendance sheet. The columns are the headers across the top — name, student ID, grade — and each row underneath is one specific student's information filled into those same columns.",
    examples: [
      {
        title: "A users table",
        code: `CREATE TABLE users (
  id INTEGER,
  name TEXT,
  email TEXT,
  age INTEGER
);`,
        explanation: "This defines the shape of the table: every row stored here will have exactly these four columns, each holding a specific kind of value.",
        walkthrough: [
          { code: "CREATE TABLE users (", explanation: "Starts the definition of a new table named users." },
          { code: "id INTEGER,", explanation: "A column named id that will always hold a whole number." },
          { code: "name TEXT,", explanation: "A column named name that will hold text." },
          { code: "email TEXT,", explanation: "A column named email, also text." },
          { code: "age INTEGER", explanation: "A column named age, another whole number." },
          { code: ");", explanation: "Closes the table definition." },
        ],
      },
      {
        title: "What the data actually looks like",
        code: `id | name    | email               | age
---+---------+---------------------+----
1  | Amara   | amara@example.com   | 29
2  | Kenji   | kenji@example.com   | 34
3  | Priya   | priya@example.com   | 41`,
        explanation: "Each row is one complete record, and every row lines up under the same set of columns defined by the table.",
      },
    ],
    howItWorks: `
When a table is created, you (or whoever designed the schema) decide its
columns up front: their names and the type of value each will hold (text,
integer, date, and so on). From then on, every row added to that table
must fit that same shape — one value per column, of the right type.

The database stores rows efficiently on disk and keeps track of the
table's structure (called its **schema**) so it always knows what a row
is supposed to look like.
    `.trim(),
    whyItExists: `
Giving every row in a table the exact same shape is what lets the
database reason about the data reliably — it always knows, for the
\`users\` table, that column 3 is an email and should be treated as text,
without checking each row individually. That consistency is also what
makes fast searching and predictable querying possible.
    `.trim(),
    whenToUse: `
Reach for the rows-and-columns model whenever your data is naturally
made of many similar records that share the same fields — users, orders,
products, log entries. That covers the vast majority of application
data.
    `.trim(),
    whenNotToUse: `
If your data is wildly irregular — every record has a completely
different, unpredictable set of fields — forcing it into fixed columns
can be awkward, and a more flexible, document-style structure (as used
in some NoSQL databases) may fit better.
    `.trim(),
    commonMistakes: [
      "Confusing a column with a row — a column is a field shared across all records, a row is one specific record.",
      "Trying to store multiple unrelated pieces of information crammed into a single column instead of splitting them into their own columns.",
      "Assuming every row must physically look identical in the raw file — the database, not the disk layout, guarantees the row shape.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Design the columns for a 'books' table in a personal library app. List each column name and what kind of value it holds." },
      { difficulty: "Medium", prompt: "Write out (as a small text table) three example rows that would fit your 'books' table from the previous exercise." },
      { difficulty: "Hard", prompt: "Explain why storing 'first name and last name' as one combined column is usually a worse design than two separate columns." },
    ],
    interviewQuestions: [
      { question: "What is the difference between a row and a column in a database table?", answer: "A column defines one field shared by every record in the table (like email); a row is one individual record with a value for each column." },
      { question: "What is a table's schema?", answer: "The definition of a table's structure — its columns, and the type of data each column holds." },
      { question: "Why does every row in a table need to follow the same set of columns?", answer: "So the database can reliably interpret and search every row the same way, which is what makes fast, predictable queries possible." },
    ],
    prerequisites: ["what-is-a-database"],
    relatedTopics: ["what-is-a-database", "primary-and-foreign-keys", "basic-sql-queries"],
    keywords: ["table", "row", "column", "schema", "relational database"],
  },
  {
    id: "primary-and-foreign-keys",
    title: "Primary Keys & Foreign Keys",
    level: "beginner",
    description: "How a database uniquely identifies one specific row, and how rows in different tables point to each other.",
    explanation: `
If a table has two customers both named "Sam Lee," how does the database
tell them apart? It needs some column whose value is guaranteed to be
unique for every single row — no two rows ever share it. That column is
the table's **primary key**, most commonly an auto-generated \`id\` number.

Once every row can be uniquely identified, tables can *reference* each
other. Say an \`orders\` table needs to record which user placed each
order. Instead of copying that user's whole name and email into every
order row, the \`orders\` table just stores the user's \`id\` in a column
like \`user_id\`. That column is called a **foreign key** — it "points to"
a primary key in another table, linking the two rows together without
duplicating data.
    `.trim(),
    analogy:
      "A primary key is like a person's unique student ID number — no two students share one, even if their names are identical. A foreign key is like writing that student ID on a library book's checkout card instead of writing out the student's full name and address every time — it just points back to the one record that already has all the details.",
    examples: [
      {
        title: "A primary key",
        code: `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT
);`,
        explanation: "Marking id as the PRIMARY KEY tells the database this column uniquely identifies each row, and it will enforce that no two rows share the same id.",
        walkthrough: [
          { code: "CREATE TABLE users (", explanation: "Begins the users table definition." },
          { code: "id INTEGER PRIMARY KEY,", explanation: "This column uniquely identifies each row; the database rejects any attempt to insert a duplicate id." },
          { code: "name TEXT,", explanation: "A regular column, not required to be unique." },
          { code: "email TEXT", explanation: "Another regular column." },
          { code: ");", explanation: "Closes the definition." },
        ],
      },
      {
        title: "A foreign key linking two tables",
        code: `CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_cents INTEGER
);

-- orders table:
-- id | user_id | total_cents
-- 1  | 2       | 4599
-- 2  | 2       | 1200
-- 3  | 3       | 800`,
        explanation: "Each order row stores just the id of the user who placed it. Orders 1 and 2 both belong to the user with id 2, without repeating that user's name or email in every row.",
      },
    ],
    howItWorks: `
A primary key is enforced by the database itself: it refuses to let you
insert (or update) a row that would create a duplicate value in that
column. Most tables use a simple auto-incrementing integer id for this,
since it's guaranteed unique and never changes.

A foreign key is just a regular column whose values are expected to
match a primary key value in another table. Many databases can enforce
this too — refusing to insert an order with a user_id that doesn't
actually exist in the users table — which keeps the two tables
consistent with each other.
    `.trim(),
    whyItExists: `
Without a reliable way to uniquely identify a row, you couldn't safely
update or delete "this one specific record" — you'd risk accidentally
matching several rows that look similar. And without foreign keys,
you'd be forced to copy full details (name, email, address) into every
related table, which wastes space and creates a mess the moment any of
that copied data changes.
    `.trim(),
    whenToUse: `
Give every table a primary key, essentially always — it's the foundation
for updating, deleting, and linking specific rows. Use a foreign key any
time one table's rows naturally "belong to" or reference a row in
another table, like an order belonging to a user.
    `.trim(),
    whenNotToUse: `
There's rarely a reason to skip a primary key on a real table. Foreign
keys can be left out for small, throwaway, or purely denormalized
datasets where you've deliberately decided the tables don't need to stay
in sync with each other.
    `.trim(),
    commonMistakes: [
      "Using a naturally occurring value like an email address as the primary key, then having it break when a user changes their email.",
      "Forgetting to add a foreign key column, and instead duplicating a related row's full details everywhere it's needed.",
      "Assuming a foreign key column automatically keeps data in sync on its own — it only links rows; your queries still have to join them together to see combined data.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain why an auto-incrementing id is usually a better primary key choice than a person's name." },
      { difficulty: "Medium", prompt: "Design a 'comments' table that belongs to both a 'posts' table and a 'users' table (who wrote the comment, and on which post). Name the foreign key columns you'd add." },
      { difficulty: "Hard", prompt: "Describe what could go wrong in your database if you inserted a comment with a user_id that doesn't correspond to any real user." },
    ],
    interviewQuestions: [
      { question: "What is a primary key?", answer: "A column (or set of columns) whose value uniquely identifies each row in a table, enforced by the database to never have duplicates." },
      { question: "What is a foreign key?", answer: "A column in one table that stores the primary key value of a row in another table, creating a link between the two without duplicating data." },
      { question: "Why use a generated id instead of a real-world value like an email as a primary key?", answer: "Real-world values can change over time (like an email being updated), which breaks anything referencing it; a generated id never changes." },
    ],
    prerequisites: ["tables-rows-columns"],
    relatedTopics: ["tables-rows-columns", "basic-sql-queries", "joins", "normalization"],
    keywords: ["primary key", "foreign key", "unique identifier", "relationships"],
  },
  {
    id: "basic-sql-queries",
    title: "Basic SQL Queries",
    level: "beginner",
    description: "The four core commands — SELECT, INSERT, UPDATE, DELETE — used to read and change data in a database.",
    explanation: `
Once data lives in tables, you need a way to actually read it and change
it. **SQL** (Structured Query Language) is the language almost every
relational database understands, and it's built around four core
operations, often remembered by the acronym **CRUD** (Create, Read,
Update, Delete):

- \`SELECT\` — read existing rows
- \`INSERT\` — add a new row
- \`UPDATE\` — change values in existing rows
- \`DELETE\` — remove rows

These four commands, combined with ways to filter which rows they apply
to, cover the overwhelming majority of everyday database work.
    `.trim(),
    analogy:
      "Think of a table as a shared notebook. SELECT is reading a page without touching it. INSERT is writing a brand-new entry on a fresh line. UPDATE is crossing out part of an existing entry and writing a correction. DELETE is tearing an entry out entirely.",
    examples: [
      {
        title: "All four operations on a users table",
        code: `-- Read every user
SELECT * FROM users;

-- Add a new user
INSERT INTO users (name, email) VALUES ('Amara', 'amara@example.com');

-- Change an existing user's email
UPDATE users SET email = 'amara@newmail.com' WHERE id = 1;

-- Remove a user
DELETE FROM users WHERE id = 1;`,
        explanation: "Each statement is a complete command on its own — SQL statements are typically written one operation at a time, ending in a semicolon.",
        walkthrough: [
          { code: "SELECT * FROM users;", explanation: "Asks for every column of every row in the users table. The * means 'all columns'." },
          { code: "INSERT INTO users (name, email) VALUES ('Amara', 'amara@example.com');", explanation: "Adds one new row, setting the name and email columns to the given values." },
          { code: "UPDATE users SET email = 'amara@newmail.com' WHERE id = 1;", explanation: "Finds the row where id equals 1, and changes only its email column." },
          { code: "DELETE FROM users WHERE id = 1;", explanation: "Removes the row where id equals 1 entirely." },
        ],
      },
      {
        title: "Selecting specific columns",
        code: `SELECT name, email FROM users;

UPDATE users SET age = age + 1 WHERE id = 3;`,
        explanation: "SELECT doesn't have to grab every column — you can list exactly the ones you need. UPDATE can also compute a new value based on the current one, like incrementing age by 1.",
      },
    ],
    howItWorks: `
When you send a SQL statement to the database, it gets parsed and turned
into a plan for how to carry it out: which table to touch, which rows
match any given condition, and what to do with them. \`SELECT\` never
changes data — it only reads and returns it. \`INSERT\`, \`UPDATE\`, and
\`DELETE\` all modify the table's actual contents, and each one, without a
\`WHERE\` clause narrowing things down, applies to *every* row in the
table — which is why forgetting a WHERE clause on UPDATE or DELETE is one
of the most dangerous mistakes in SQL.
    `.trim(),
    whyItExists: `
SQL exists so that reading and changing data doesn't require custom
code for every situation. Instead of writing a program to loop through
files searching for matches, you describe *what* you want ("all users
older than 30") and the database figures out *how* to get it, using one
shared, standardized language across virtually every relational
database.
    `.trim(),
    whenToUse: `
Use SELECT any time you need to read data. Use INSERT when new data is
created (a new signup, a new order). Use UPDATE when existing data
changes (an address update, a status change). Use DELETE when data
should be permanently removed.
    `.trim(),
    whenNotToUse: `
For truly bulk, one-time data loads (millions of rows at once) many
databases offer faster specialized bulk-loading tools instead of
individual INSERT statements. And for data you might need to recover
later, consider a "soft delete" (marking a row as inactive) instead of
an actual DELETE.
    `.trim(),
    commonMistakes: [
      "Running an UPDATE or DELETE without a WHERE clause, which applies the change to every single row in the table.",
      "Forgetting that SELECT * pulls every column, even ones you don't need, which wastes bandwidth on large tables.",
      "Assuming INSERT requires listing every column — columns with defaults or that allow empty values can often be omitted.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a SELECT statement that retrieves the name and email of every row in a users table." },
      { difficulty: "Medium", prompt: "Write an INSERT statement adding a new product with a name and a price to a products table, and an UPDATE statement that changes that product's price." },
      { difficulty: "Hard", prompt: "Explain, step by step, what would happen if you ran `DELETE FROM users;` with no WHERE clause, and why that's dangerous." },
    ],
    interviewQuestions: [
      { question: "What do the four basic SQL commands SELECT, INSERT, UPDATE, and DELETE each do?", answer: "SELECT reads rows, INSERT adds a new row, UPDATE modifies values in existing rows, and DELETE removes rows." },
      { question: "What happens if you run an UPDATE statement with no WHERE clause?", answer: "It applies the change to every row in the table, not just one — which is a common and dangerous mistake." },
      { question: "Does SELECT ever modify the underlying data?", answer: "No — SELECT only reads and returns data; it never changes what's stored." },
    ],
    prerequisites: ["tables-rows-columns"],
    relatedTopics: ["tables-rows-columns", "filtering-and-sorting", "transactions-and-acid"],
    keywords: ["SQL", "SELECT", "INSERT", "UPDATE", "DELETE", "CRUD"],
  },
  {
    id: "filtering-and-sorting",
    title: "Filtering & Sorting",
    level: "beginner",
    description: "Narrowing a query down to the rows you actually want with WHERE, and controlling the order results come back in with ORDER BY.",
    explanation: `
\`SELECT * FROM orders\` gives you every single order — but most of the
time you want something more specific: only orders from this month,
only the five most expensive ones, only users whose name starts with
"A." That's what filtering and sorting are for.

The \`WHERE\` clause narrows a query down to only the rows that match a
condition you specify. The \`ORDER BY\` clause controls what order the
matching rows come back in — ascending or descending, by any column you
choose. They're often used together: filter down to the rows you care
about, then sort them in a useful order.
    `.trim(),
    analogy:
      "WHERE is like sifting a basket of laundry down to just the socks. ORDER BY is then lining those socks up from smallest to biggest before you look at them. You can do either alone, or both together.",
    examples: [
      {
        title: "Filtering with WHERE",
        code: `SELECT name, total_cents
FROM orders
WHERE total_cents > 5000;`,
        explanation: "Only returns orders whose total is more than 5000 cents ($50) — every other row is left out entirely.",
        walkthrough: [
          { code: "SELECT name, total_cents", explanation: "Choose which columns to return." },
          { code: "FROM orders", explanation: "Choose which table to read from." },
          { code: "WHERE total_cents > 5000;", explanation: "Keep only the rows where this condition is true; every non-matching row is excluded from the results." },
        ],
      },
      {
        title: "Combining filtering, sorting, and limiting",
        code: `SELECT name, total_cents
FROM orders
WHERE total_cents > 5000
ORDER BY total_cents DESC
LIMIT 3;`,
        explanation: "Finds orders over $50, sorts the matching ones from highest total to lowest (DESC means descending), then keeps only the top 3.",
      },
    ],
    howItWorks: `
The database evaluates the \`WHERE\` condition against every row's actual
values, keeping only the rows where it comes out true. Conditions can be
combined with \`AND\` and \`OR\` for more complex logic. \`ORDER BY\` then
takes the surviving rows and sorts them by one or more columns —
\`ASC\` (ascending, the default) or \`DESC\` (descending). \`LIMIT\` can cap
how many of the sorted results actually get returned.

Under the hood, without help from an index (a topic on its own), the
database typically has to look at every row in the table to check the
WHERE condition — how that lookup can be sped up is exactly what indexes
are for.
    `.trim(),
    whyItExists: `
Real applications almost never want "everything, in whatever order the
database happens to store it in." Filtering and sorting exist so that
the database itself can do the narrowing and ordering work, instead of
your application code fetching every row and doing that filtering and
sorting itself in memory — which would be both slower and far more code
to write.
    `.trim(),
    whenToUse: `
Use WHERE any time you only want a subset of a table's rows. Use ORDER
BY whenever the order results are presented in matters — recent-first
activity feeds, cheapest-first product listings, alphabetical name
lists.
    `.trim(),
    whenNotToUse: `
If you genuinely need every row and the order truly doesn't matter (for
instance, feeding all rows into a batch job that processes them in any
order), skipping WHERE and ORDER BY avoids unnecessary work for the
database.
    `.trim(),
    commonMistakes: [
      "Forgetting that ORDER BY without DESC defaults to ascending order, which can look 'backwards' for things like dates when you want most-recent-first.",
      "Filtering in application code after fetching all rows, instead of letting WHERE do it inside the database — much slower on large tables.",
      "Assuming rows come back in a particular order automatically — without ORDER BY, the order isn't guaranteed at all.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a query that selects all products from a products table with a price less than 20." },
      { difficulty: "Medium", prompt: "Write a query that returns the 5 most recently created rows from an orders table, assuming it has a created_at column." },
      { difficulty: "Hard", prompt: "Write a query combining WHERE and ORDER BY to find the 3 cheapest in-stock products, assuming a products table with price and in_stock columns." },
    ],
    interviewQuestions: [
      { question: "What does the WHERE clause do?", answer: "It filters which rows a query applies to, keeping only rows where the given condition evaluates to true." },
      { question: "What does ORDER BY control, and what's the default direction?", answer: "It controls the order results are returned in, by one or more columns; the default direction is ascending (ASC) unless DESC is specified." },
      { question: "If you don't use ORDER BY, is the order of returned rows guaranteed?", answer: "No — without an explicit ORDER BY, the database doesn't guarantee any particular row order." },
    ],
    prerequisites: ["basic-sql-queries"],
    relatedTopics: ["basic-sql-queries", "indexes", "aggregation"],
    keywords: ["WHERE", "ORDER BY", "filtering", "sorting", "LIMIT"],
  },
];
