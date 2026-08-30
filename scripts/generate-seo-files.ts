// Generates public/sitemap.xml and public/llms.txt from the actual content
// data, so neither can drift from what routes really exist. Runs
// automatically before every `npm run build` (see the "prebuild" script in
// package.json).
import { writeFileSync } from "node:fs";
import { subjects } from "../src/content";
import { problemCategories, allProblems } from "../src/content/problems";
import { caseStudies } from "../src/content/case-studies";

const SITE_URL = "https://engineeringwiki.vercel.app";

// --- sitemap.xml -----------------------------------------------------------

interface UrlEntry {
  path: string;
  priority: string;
}

const urls: UrlEntry[] = [{ path: "/", priority: "1.0" }];

for (const subject of subjects) {
  urls.push({ path: `/${subject.id}`, priority: "0.8" });
  for (const topic of subject.topics) {
    urls.push({ path: `/${subject.id}/${topic.id}`, priority: "0.7" });
  }
}

urls.push({ path: "/problems", priority: "0.8" });
for (const category of problemCategories) {
  urls.push({ path: `/problems/${category.id}`, priority: "0.6" });
}
for (const problem of allProblems) {
  urls.push({ path: `/problems/${problem.category}/${problem.id}`, priority: "0.6" });
}

urls.push({ path: "/case-studies", priority: "0.8" });
for (const caseStudy of caseStudies) {
  urls.push({ path: `/case-studies/${caseStudy.id}`, priority: "0.7" });
}

const sitemapBody = urls
  .map(
    ({ path, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapBody}
</urlset>
`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), sitemapXml);
console.log(`sitemap.xml written with ${urls.length} URLs`);

// --- llms.txt ----------------------------------------------------------
// https://llmstxt.org — a plain-markdown index for LLMs/AI agents that
// don't want to (or can't) crawl the full rendered site.

const subjectSections = subjects
  .map((subject) => {
    const topicLinks = subject.topics
      .map((topic) => `  - [${topic.title}](${SITE_URL}/${subject.id}/${topic.id}): ${topic.description}`)
      .join("\n");
    return `## ${subject.title}\n\n${subject.description}\n\n${topicLinks}`;
  })
  .join("\n\n");

const caseStudyLinks = caseStudies
  .map((cs) => `- [${cs.title}](${SITE_URL}/case-studies/${cs.id}): ${cs.summary}`)
  .join("\n");

const problemCategoryLinks = problemCategories
  .map((c) => `- [${c.title}](${SITE_URL}/problems/${c.id}): ${c.description}`)
  .join("\n");

const llmsTxt = `# Engineering OS

> A free, open-source software-engineering knowledge base. Every topic
> follows the same structure: What is it? / Explain Like I'm 10 / Simple
> Example / How It Works / Why Does This Exist? / Common Mistakes /
> Practice / Interview Questions.

Full URL list: ${SITE_URL}/sitemap.xml
Source: https://github.com/rahul-aot/engineering-os

${subjectSections}

## Real System Designs

Full worked system design walkthroughs for real products (requirements,
capacity estimation, high-level design, deep dives, trade-offs).

${caseStudyLinks}

## DSA Practice Problems

Practice problems grouped by pattern, at ${SITE_URL}/problems.

${problemCategoryLinks}
`;

writeFileSync(new URL("../public/llms.txt", import.meta.url), llmsTxt);
console.log("llms.txt written");
