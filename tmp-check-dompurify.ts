import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
const window = new JSDOM('').window as unknown as Window;
const purifier = createDOMPurify(window);
console.log('keys', Object.keys(purifier).slice(0,20));
console.log('sanitize', typeof (purifier as any).sanitize);
console.log('instance type', typeof purifier);
