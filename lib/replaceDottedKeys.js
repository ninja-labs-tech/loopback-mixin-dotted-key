const debug = require('debug')('loopback:mixin:dotted-key');

const mutateKeysDeep = fn => (obj) => {
  Object.keys(obj || {}).filter(k => !k.startsWith('$')).forEach((key) => {
    fn(key, obj);
    if (Array.isArray(obj[key])) obj[key].filter(el => el && typeof el === 'object').forEach(mutateKeysDeep(fn));
    else if (typeof obj[key] === 'object') mutateKeysDeep(fn)(obj[key]);
  });
};

/* eslint-disable no-param-reassign */
const replaceStrInObjkey = (search, replace) => (key, obj) => {
  if (!key.includes(search)) return;
  obj[key.replace(new RegExp(`\\${search}`, 'g'), replace)] = obj[key];
  delete obj[key];
};

const defaultOptions = {
  search: '.',
  replace: '#',
};

module.exports = (Model, options) => {
  const { search, replace } = Object.assign(defaultOptions, options);
  debug(`replace dotted keys for Model: ${Model.modelName}`);

  Model.observe('before save', (ctx, next) => {
    const instance = ctx.instance.__data || ctx.data;
    const swipeSearchWithReplace = mutateKeysDeep(replaceStrInObjkey(search, replace));
    swipeSearchWithReplace(instance);
    next();
  });

  Model.observe('loaded', (ctx, next) => {
    if (!ctx.data) return;
    const swipeReplaceWithSearch = mutateKeysDeep(replaceStrInObjkey(replace, search));
    if (Array.isArray(ctx.data)) ctx.data.forEach(swipeReplaceWithSearch);
    else swipeReplaceWithSearch(ctx.data);
    next();
  });
};
