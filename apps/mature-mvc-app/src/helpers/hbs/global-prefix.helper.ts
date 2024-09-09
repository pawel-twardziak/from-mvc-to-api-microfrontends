import hbs from 'hbs';

export function registerHbsGlobalPrefixHelper(globalPrefix: string) {
  hbs.registerHelper('globalPrefix', function () {
    return globalPrefix;
  });
}
