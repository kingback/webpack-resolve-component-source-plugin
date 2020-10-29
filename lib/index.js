const fs = require('fs');
const p = require('path');
const assign = require('object-assign');
const pluginName = 'WebpackResolveComponentSourcePlugin';

const {
  rfd,
  toRegExp,
  toRegExpStr,
  isIncluded,
  isExcluded,
  getOptions
} = require('./utils');

class WebpackResolveComponentSourcePlugin {
  constructor(options) {
    this.cache = [];
    this.options = getOptions(options);
  }

  apply(resolver) {
    const { include, exclude, extensions, libraryDirectory, sourceDirectory, customResolver } = this.options;
    const libRegExp = new RegExp(`^\\/\(${libraryDirectory.map(l => toRegExpStr(l)).join('|')}\)\\/`);
    const target = resolver.ensureHook("resolved");

    resolver.getHook('before-existing-file').tapAsync(pluginName, (request, resolveContext, callback) => {
      const { path, relativePath } = request;
      const inCache = path in this.cache;

      if (
        !inCache &&
        path.indexOf('node_modules') !== -1 &&
        isIncluded(include, path, request) &&
        !isExcluded(exclude, path, request)
      ) {
        if (customResolver) {
          this.cache[path] = customResolver(path, request) || '';
        }

        if (!this.cache[path]) {
          const ext = p.extname(path); // .js
          const fileExtensions = extensions[rfd(ext)]; // ['.js', '.jsx']
          if (
            fileExtensions &&
            libRegExp.test(rfd(relativePath))
          ) {
            fileExtensions.some((e) => {
              sourceDirectory.some((s) => {
                // /long/path/node_modules/component/lib/index.js => /long/path/node_modules/component/src/index.js
                const source = path
                  .replace(toRegExp(ext, true), e)
                  .replace(toRegExp(rfd(relativePath), true), ($0) => {
                    return $0.replace(libRegExp, `/${s}/`);
                  });
                if (fs.existsSync(source)) {
                  return !!(this.cache[path] = source);
                }
              });
              return !!this.cache[path];
            });
          }
        }
      }

      if (this.cache[path]) {
        resolver.doResolve(target, assign({}, request, {
          path: this.cache[path],
        }), resolveContext, `using source: ${this.cache[path]}`, callback);
      } else {
        !inCache && (this.cache[path] = '');
        callback();
      }
    });
  }
}

module.exports = WebpackResolveComponentSourcePlugin;