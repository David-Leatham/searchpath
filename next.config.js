/** @type {import('next').NextConfig} */


const path = require('path');
const loaderUtils = require('loader-utils');

const commitHash = require('child_process').execSync('git rev-parse --short HEAD')

// based on https://github.com/vercel/next.js/blob/992c46e63bef20d7ab7e40131667ed3debaf67de/packages/next/build/webpack/config/blocks/css/loaders/getCssModuleLocalIdent.ts
const hashOnlyIdent = (context, _, exportName) => {
  
  let hashBeginning = loaderUtils
    .getHashDigest(
      Buffer.from(
        `filePath:${path
          .relative(context.rootContext, context.resourcePath)
          .replace(/\\+/g, '/')}#className:${exportName}`,
      ),
      'md4',
      'base64',
      12,
    )
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/^(-?\d|--)/, '_$1');

  let hashEnd = loaderUtils
    .getHashDigest(
      commitHash,
      'md4',
      'base64',
      4,
    )
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/^(-?\d|--)/, '_$1');

  return hashBeginning + '_' + hashEnd
}


const nextConfig = {
  reactStrictMode: true,
  webpack(config, { dev }) {
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use));

    if (!dev) {
      rules.forEach((rule) => {
        rule.use.forEach((moduleLoader) => {
          if (
            moduleLoader.loader?.includes('css-loader') &&
            !moduleLoader.loader?.includes('postcss-loader')
          )
            moduleLoader.options.modules.getLocalIdent = hashOnlyIdent;

            // earlier below statements were sufficient:
            // delete moduleLoader.options.modules.getLocalIdent;
            // moduleLoader.options.modules.localIdentName = '[hash:base64:6]';
        });
      });
    }

    return config;
  },
}

module.exports = nextConfig
