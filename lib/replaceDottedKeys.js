const debug = require('debug')('loopback:mixin:dotted-key');

const mutateKeysDeep = fn => (obj) => {
  Object.keys(obj || {}).forEach((key) => {
    fn(key, obj);
    if (Array.isArray(obj[key])) obj[key].filter(el => el && typeof el === 'object').forEach(mutateKeysDeep(fn));
    else if (typeof obj[key] === 'object') mutateKeysDeep(fn)(obj[key]);
  });
};

/* eslint-disable no-param-reassign */
const replaceStrInObjkey = (haystack, replace) => (key, obj) => {
  if (!key.includes(haystack)) return;
  obj[key.replace(new RegExp(`\\${haystack}`, 'g'), replace)] = obj[key];
  delete obj[key];
};

const defaultOptions = {
  haystack: '.',
  replace: '#',
};

module.exports = (Model, options) => {
  const { haystack, replace } = Object.assign(defaultOptions, options);
  debug(`replace dotted keys for Model: ${Model.modelName}`);

  Model.observe('before save', (ctx, next) => {
    const instance = ctx.instance || ctx.data;
    const swipeHaystackWithReplace = replaceStrInObjkey(haystack, replace);
    mutateKeysDeep(swipeHaystackWithReplace)(instance);
    next();
  });

  Model.observe('loaded', (ctx, next) => {
    if (!ctx.data) return;
    const swipeReplaceWithReplace = mutateKeysDeep(replaceStrInObjkey(replace, haystack));
    if (Array.isArray(ctx.data)) ctx.data.forEach(swipeReplaceWithReplace);
    else swipeReplaceWithReplace(ctx.data);
    next();
  });
};
