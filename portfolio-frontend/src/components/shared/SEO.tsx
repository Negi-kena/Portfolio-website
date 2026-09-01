import { useEffect } from "react";
import { resolveAssetUrl } from "../../api/client";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  tags?: string[];
  canonicalUrl?: string;
}

const DEFAULT_TITLE = "Negaso Kena — Full-Stack Developer";
const DEFAULT_DESCRIPTION =
  "Full-Stack Developer portfolio showcasing modern web applications, scalable APIs, and technical writing.";
const DEFAULT_IMAGE = "/favicon.svg";
const TWITTER_HANDLE = "@nagaaofficial";

function setMetaTag(attrName: "name" | "property", attrValue: string, content: string | undefined | null) {
  if (!content) return;
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  type = "website",
  publishedTime,
  tags,
  canonicalUrl,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title ? (title.includes("Negaso Kena") ? title : `${title} — Negaso Kena`) : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Resolve image absolute URL
    let imageUrl = DEFAULT_IMAGE;
    if (image) {
      const resolved = resolveAssetUrl(image);
      if (resolved) {
        imageUrl = /^https?:\/\//i.test(resolved) ? resolved : `${window.location.origin}${resolved.startsWith("/") ? resolved : `/${resolved}`}`;
      }
    } else {
      imageUrl = `${window.location.origin}${DEFAULT_IMAGE}`;
    }

    const currentUrl = canonicalUrl || window.location.href;

    // 3. Set standard meta tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "author", "Negaso Kena");

    // 4. Open Graph tags (Facebook, LinkedIn, Telegram)
    setMetaTag("property", "og:site_name", "Negaso Kena");
    setMetaTag("property", "og:title", formattedTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", imageUrl);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:type", type);

    if (type === "article" && publishedTime) {
      setMetaTag("property", "article:published_time", publishedTime);
      setMetaTag("property", "article:author", "Negaso Kena");
      if (tags && tags.length > 0) {
        tags.forEach((tag) => setMetaTag("property", "article:tag", tag));
      }
    }

    // 5. Twitter / X Card tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:site", TWITTER_HANDLE);
    setMetaTag("name", "twitter:creator", TWITTER_HANDLE);
    setMetaTag("name", "twitter:title", formattedTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", imageUrl);
  }, [title, description, image, type, publishedTime, tags, canonicalUrl]);

  return null;
}
