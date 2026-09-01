const SITE_NAME = "Negaso Kena";
const DEFAULT_TITLE = "Negaso Kena — Full-Stack Developer";

interface SEOProps {
  /** Page-specific title. Rendered as "{title} — Negaso Kena". Omit for the site default. */
  title?: string;
  description?: string;
  /** Absolute URL to an image for social previews. Falls back to the site default in index.html if omitted. */
  image?: string;
  /** Absolute canonical URL for this page. */
  url?: string;
}

/**
 * Sets the document title and per-page meta description/OG/Twitter tags.
 *
 * IMPORTANT: React 19 hoists <title>/<meta>/<link> rendered anywhere in the
 * tree into <head> automatically — but only *after* the JS bundle has run.
 * That's fine for the browser tab title and for crawlers that execute JS
 * (Googlebot). It does NOT help link-unfurling bots that fetch raw HTML
 * only (Telegram, WhatsApp, older LinkedIn/Slack scrapers) — those only
 * ever see the static tags baked into index.html. Keep index.html's
 * defaults accurate; treat this component as a progressive enhancement
 * on top of that, not a replacement for it.
 */
export function SEO({ title, description, image, url }: SEOProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}
