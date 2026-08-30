import { useEffect } from "react";

const SITE_NAME = "Engineering OS";
const SITE_URL = "https://engineeringwiki.vercel.app";

export interface DocumentMeta {
  /** Page title, without the site name suffix — that's added automatically. */
  title: string;
  /** One or two sentence summary used for the meta description and social previews. */
  description: string;
  /** Route path, e.g. "/javascript/closures". Used to build the canonical URL. */
  path: string;
  /** Set true for pages with no unique/shareable content (e.g. personal, localStorage-only views). */
  noindex?: boolean;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets document.title, the meta description, canonical link, and
 * Open Graph / Twitter card tags for the current page. Call once per page
 * component (Home, Subject, Topic, ...) — this is a hand-rolled stand-in
 * for react-helmet, kept dependency-free since it only needs to run on
 * mount/update, not during SSR.
 */
export function useDocumentMeta({ title, description, path, noindex }: DocumentMeta) {
  useEffect(() => {
    const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    upsertLink("canonical", url);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);

    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
  }, [title, description, path, noindex]);
}
