const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('node:path');
const { rmSync, copyFileSync } = require('node:fs');
const {
  applyWebConfig,
} = require('@nx/webpack/src/plugins/nx-webpack-plugin/lib/apply-web-config');
const { normalizeOptions } = require('@nx/webpack');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const devMode = process.env.NODE_ENV !== 'production';

const copyPatterns = [
  {
    from: join(__dirname, '../../dist/apps/mature-mvc-app/main.css'), // '../../dist/apps/mature-mvc-app/main.css',
    to: join(
      __dirname,
      `../../dist/apps/mature-mvc-app/public/main${devMode ? '' : '.min'}.css`
    ),
  },
];

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('devMode', devMode);
console.log('copyPatterns', copyPatterns);

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/mature-mvc-app'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets', './src/public', './src/views'],
      optimization: true,
      outputHashing: 'none',
      generatePackageJson: false,
    }),
  ].concat([
    (compiler) => {
      console.log('applyWebConfig');
      applyWebConfig(
        normalizeOptions({
          target: 'node',
          compiler: void 0,
          runtimeChunk: false,
          index: void 0,
          main: void 0,
          optimization: true,
          generateIndexHtml: false,
          outputHashing: 'none',
          extractCss: true,
        }),
        compiler.options,
        { useNormalizedEntry: true }
      );
    },
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ['echo "Webpack Start"'],
        blocking: true,
        parallel: false,
      },
      onBuildEnd: {
        scripts: [
          () =>
            new Promise((resolve) => {
              console.log('run async onBuildEnd');
              setTimeout(() => {
                copyFileSync(copyPatterns[0].from, copyPatterns[0].to);
                rmSync(copyPatterns[0].from);
                console.log('end async onBuildEnd');
                resolve('ok');
              }, 0);
            }),
          'echo "Webpack End"',
        ],
        blocking: false,
        parallel: true,
      },
    }),
    // new CopyPlugin({
    //   patterns: copyPatterns,
    //   options: { concurrency: 1 },
    // }),
  ]),
};
