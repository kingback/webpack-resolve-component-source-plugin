# webpack-resolve-component-source-plugin

Component source file resolver plugin of webpack.

## Why

Convenient to do tree-shaking or optimize helper codes.

## Example

```js
import Library from 'library'; // main: "lib/index.js"

// /cwd/node_modules/library/lib/index.js

↓ ↓ ↓ ↓ ↓ ↓

// /cwd/node_modules/library/src/index.js
```

## Usage

```js
// webpack.config.js
const WebpackResolveComponentSourcePlugin = require('webpack-resolve-component-source-plugin');

module.exports = {
  resolve: {
    plugins: [
      new WebpackResolveComponentSourcePlugin({
        extensions: '.js',
        sourceDirectory: 'src',
        libraryDirectory: 'lib'
      })
    ]
  }
}
```

### Options

#### extensions

* type: `String|Array|Object`
* default: `.js`

Extensions supported.

```js
new WebpackResolveComponentSourcePlugin({
  extensions: '.js', // short for js
  extensions: ['.js', '.jsx'], // short for js
  extensions: {
    js: ['.js', '.jsx', '.ts', '.tsx'],
    css: ['.css', '.less', '.scss', '.sass']
  }
})
```

#### sourceDirectory

* type: `String|Array`
* default: `src`

Source directory to resolve file.

```js
new WebpackResolveComponentSourcePlugin({
  sourceDirectory: 'src',
  sourceDirectory: ['src', 'es']
})
```

#### libraryDirectory

* type: `String|Array`
* default: `src`

Library directory to detect.

```js
new WebpackResolveComponentSourcePlugin({
  libraryDirectory: 'lib',
  libraryDirectory: ['lib', 'es']
})
```

### customResolver

* type: `Function`
* default: `null`

Custom resolver.

```js
new WebpackResolveComponentSourcePlugin({
  customResolver(path, request) {
    if (/\/moment\.js/.test(path)) {
      return path.replace(/\.moment\.js$/, '/src/moment.js');
    }
  }
})
```

#### include

* type: `String|Array|RegExp|Function`
* default: `null`

Include packages.

```js
new WebpackResolveComponentSourcePlugin({
  include: 'full/path/file.js',
  include: ['full/path/file.js', 'full/path/file2.js'],
  include: /\rax-/,
  include(path, request) {
    return /\/rax-/.test(path);
  }
})
```

#### exclude

* type: `String|Array|RegExp|Function`
* default: `null`

Exclude packages.

```js
new WebpackResolveComponentSourcePlugin({
  exclude: 'full/path/file.js',
  exclude: ['full/path/file.js', 'full/path/file2.js'],
  exclude: /\/rax-/,
  exclude(path, request) {
    return /\/rax-/.test(path);
  }
})
```
