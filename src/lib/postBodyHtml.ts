import createDOMPurify from "dompurify";

const DOMPurify = createDOMPurify(typeof window !== "undefined" ? window : undefined);

const SAFE_HTML_TAGS = [
  "a",
  "br",
  "em",
  "h2",
  "h3",
  "li",
  "ol",
  "p",
  "section",
  "strong",
  "ul",
] as const;

const SAFE_HTML_ATTRS = ["href", "target", "rel"] as const;

const SAFE_URI_PATTERN = /^(?:(?:https?:|mailto:|tel:)|\/|#)/i;

export function sanitizePostBodyHtml(input: string) {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [...SAFE_HTML_TAGS],
    ALLOWED_ATTR: [...SAFE_HTML_ATTRS],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "style"],
    ALLOWED_URI_REGEXP: SAFE_URI_PATTERN,
  });
}

export function normalizeSanitizedPostBody(input: string) {
  if (!input.trim()) return "";

  const trimmedInput = input.trim();
  const decodedInput = decodeHtmlEntities(trimmedInput);
  const source = looksLikeHtml(trimmedInput) || looksLikeEncodedHtml(trimmedInput)
    ? decodedInput
    : trimmedInput;
  const sanitized = sanitizePostBodyHtml(source).trim();

  if (looksLikeHtml(source) || sanitized !== source) {
    return enforceAccessibleLinks(sanitized);
  }

  return trimmedInput
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function enforceAccessibleLinks(html: string) {
  if (typeof window === "undefined") {
    return html.replace(/<a\b([^>]*)>/gi, (full, attrs) => {
      const hasTargetBlank = /target\s*=\s*(["'])_blank\1/i.test(attrs);
      if (!hasTargetBlank) return full;

      if (/rel\s*=\s*(["'])(.*?)\1/i.test(attrs)) {
        return full.replace(/rel\s*=\s*(["'])(.*?)\1/i, (_, quote: string, value: string) => {
          const tokens = new Set(value.split(/\s+/).filter(Boolean));
          tokens.add("noopener");
          tokens.add("noreferrer");
          return `rel=${quote}${Array.from(tokens).join(" ")}${quote}`;
        });
      }

      return `<a${attrs} rel="noopener noreferrer">`;
    });
  }

  const container = window.document.createElement("div");
  container.innerHTML = html;

  container.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href")?.trim() ?? "";
    if (!href || !SAFE_URI_PATTERN.test(href)) {
      link.removeAttribute("href");
    }

    if (link.getAttribute("target") === "_blank") {
      const rel = new Set((link.getAttribute("rel") ?? "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      link.setAttribute("rel", Array.from(rel).join(" "));
    } else {
      link.removeAttribute("rel");
    }
  });

  return container.innerHTML;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function looksLikeEncodedHtml(value: string) {
  return /&lt;\/?[a-z][\s\S]*?&gt;/i.test(value);
}

function decodeHtmlEntities(value: string) {
  if (!value.includes("&")) return value;

  if (typeof window !== "undefined") {
    const textarea = window.document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  }

  return value
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&");
}