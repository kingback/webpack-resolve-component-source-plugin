const defaultOptions = require('./defaults.json');
const assign = require('object-assign');

// .js => js
function rfd(path) {
  return path.replace(/^./, '');
}

// 'abc' => ['abc']
function toArray(arr) {
  return Array.isArray(arr) ? arr : [arr];
}

// 'abc' => string
function typeOf(o) {
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}

// /lib/index.js => /\/lib\/index\/.js$/
function toRegExpStr(path, end) {
  return path.replace(/\//g, '\\/').replace(/\./g, '\\.') + (end ? '$' : '');
}

// /lib/index.js => /\/lib\/index\/.js$/
function toRegExp(path, end) {
  return new RegExp(toRegExpStr(path, end));
}

function isIncluded(include, filename, request) {
  if (include) {
    switch (typeOf(include)) {
      case 'string':
        return include === filename;
      case 'regexp':
        return include.test(filename);
      case 'function':
        return include(filename, request);
      case 'array':
        var included = false;
        include.some(function(e) {
          return (included = isIncluded(e, filename, request));
        });
        return included;
      default:
        return false;
    }
  } else {
    return true;
  }
}

function isExcluded(exclude, filename, request) {
  if (exclude) {
    return isIncluded(exclude, filename, request);
  } else {
    return false;
  }
}

function getOptions(options) {
  options = assign(defaultOptions, options);
  
  options.sourceDirectory = toArray(options.sourceDirectory);
  options.libraryDirectory = toArray(options.libraryDirectory);
  
  if (typeof options.extensions === 'string') {
    options.extensions = [options.extensions];
  }

  if (Array.isArray(options.extensions)) {
    options.extensions = {
      js: options.extensions
    };
  }

  return options;
}

module.exports = {
  rfd,
  typeOf,
  toArray,
  toRegExp,
  toRegExpStr,
  isIncluded,
  isExcluded,
  getOptions
}