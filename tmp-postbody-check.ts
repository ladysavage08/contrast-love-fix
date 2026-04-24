import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
const window = new JSDOM('').window as unknown as Window;
const purifier = createDOMPurify(window);
const input = '<p>Visit <a href="https://example.org" target="_blank">Example</a></p>';
const output = purifier.sanitize(input, {
  ALLOWED_TAGS: ['a','br','em','h2','h3','li','ol','p','section','strong','ul'],
  ALLOWED_ATTR: ['href','target','rel'],
  ALLOWED_URI_REGEXP: /^(?:(?:https?:|mailto:|tel:)|\/|#)/i,
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script','style'],
});
console.log(output);
