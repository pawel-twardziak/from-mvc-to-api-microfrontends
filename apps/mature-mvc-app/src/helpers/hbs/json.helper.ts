import hbs from 'hbs';

export function registerHbsJsonHelper() {
  hbs.registerHelper('json', function (input: object) {
    try {
      return JSON.stringify(input, void 0, 2);
    } catch {
      return `[json ERROR] input: ${input}`;
    }
  });
}
