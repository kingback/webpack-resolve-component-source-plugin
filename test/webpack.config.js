const pwd = process.cwd();
const WebpackResolveComponentSourcePlugin = require('../lib/index');

module.exports = (entry, sourceDirectory) => {
  return {
    mode: 'production',
    entry: {
      [`test/bundle.${entry}`]: `./test/${entry}.js`
    },
    output: {
      path: pwd
    },
    resolve: {
      plugins: sourceDirectory ? [
        new WebpackResolveComponentSourcePlugin({
          sourceDirectory
        })
      ] : []
    },
    optimization: {
      minimize: false
    }
  }
}