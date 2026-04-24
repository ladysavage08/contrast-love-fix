import { describe, expect, it } from "vitest";
import { normalizeSanitizedPostBody, sanitizePostBodyHtml } from "@/lib/postBodyHtml";

describe("post body HTML handling", () => {
  it("renders raw safe HTML without escaping tags", () => {
    const result = normalizeSanitizedPostBody("<h2>Update</h2><p>Important <strong>news</strong>.</p>");

    expect(result).toContain("<h2>Update</h2>");
    expect(result).toContain("<strong>news</strong>");
    expect(result).not.toContain("&lt;h2&gt;");
  });

  it("decodes previously escaped HTML and renders the sanitized markup", () => {
    const result = normalizeSanitizedPostBody("&lt;p&gt;Visit &lt;a href=\"https://example.org\" target=\"_blank\"&gt;Example&lt;/a&gt;&lt;/p&gt;");

    expect(result).toContain('<p>Visit <a href="https://example.org" target="_blank" rel="noopener noreferrer">Example</a></p>');
    expect(result).not.toContain("&lt;a");
  });

  it("keeps plain text posts working by wrapping paragraphs", () => {
    const result = normalizeSanitizedPostBody("First paragraph\n\nSecond line\nwrapped");

    expect(result).toBe("<p>First paragraph</p><p>Second line<br />wrapped</p>");
  });

  it("removes unsafe scripting from raw HTML", () => {
    const result = sanitizePostBodyHtml('<p>Hello</p><script>alert("xss")</script>');

    expect(result).toBe("<p>Hello</p>");
  });
});