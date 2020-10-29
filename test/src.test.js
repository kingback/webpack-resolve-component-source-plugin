const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

async function runWebpack(entry, sourceDirectory) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig(entry, sourceDirectory), function(error, stats) {
      if (error) {
        reject(error);
      } else {
        const file = path.join(__dirname, `bundle.${entry}.js`);
        const content = fs.readFileSync(file, 'utf-8');
        fs.unlinkSync(file);
        resolve(content);
      }
    })
  })
}

test('lib to es', async () => {
  const lib = await runWebpack('lib', 'src');
  const src = await runWebpack('src');
  expect(lib.replace(/_ali_rxpi_env__/g, '_ali_rxpi_env_src_index__')).toBe(src);
});