const path = require('path');
const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve').default;
const builtins = require('builtin-modules');

exports.generateRollupConfig = ({ packageDir }) => {
  const packageJSON = require(path.join(packageDir, 'package.json'));

  if (packageJSON.exports == null) {
    throw new Error('package.json에 exports 필드를 정의해주세요');
  }

  const entrypoints = Object.keys(packageJSON.exports).filter((x) => x !== './package.json');

  const external = (package) => {
    const dependencies = Object.keys(package.dependencies || {});
    const peerDependencies = Object.keys(packageJSON.peerDependencies || {});
    const externals = [...dependencies, ...peerDependencies, ...builtins];

    return externals.some((externalPackage) => {
      return package.startsWith(externalPackage);
    });
  };

  const extensions = ['.js', '.jsx', '.ts', '.tsx'];

  const buildJS = (input, output, format) => {
    const isESMFormat = format === 'es';

    return {
      input,
      external,
      output: [
        {
          format,
          ...(isESMFormat
            ? {
                dir: path.dirname(output),
                entryFileNames: `[name]${path.extname(output)}`,
                preserveModulesRoot: isESMFormat ? path.dirname(input) : undefined,
              }
            : { file: output }),
        },
      ],
      plugins: [
        resolve({
          extensions,
        }),
        commonjs(),
        babel({
          extensions,
          bableHelpers: 'bundled',
          rootMode: 'upward',
        }),
        json(),
      ],
      preserveModules: isESMFormat,
    };
  };

  const buildCJS = (input, output) => {
    return buildJS(input, output, 'cjs');
  };

  const buildES = (input, output) => {
    return buildJS(input, output, 'es');
  };

  return entrypoints.flatMap((entrypoint) => {
    const cjsEntrypoint = path.resolve(
      packageDir,
      ensure(handleCJSEntrypoint(packageJSON.exports, entrypoint), 'CJS entrypoint not found'),
    );
    const cjsOutput = path.resolve(
      packageDir,
      ensure(packageJSON?.publishConfig.exports?.[entrypoint].require, 'CJS outputfile not found'),
    );

    const esmEntrypoint = path.resolve(
      packageDir,
      ensure(handleESMEntrypoint(packageJSON.exports, entrypoint), 'ESM entrypoint not found'),
    );
    const esmOutput = path.resolve(
      packageDir,
      ensure(packageJSON?.publishConfig.exports?.[entrypoint].import, 'ESM outputfile not found'),
    );

    return [buildCJS(cjsEntrypoint, cjsOutput), buildESM(esmEntrypoint, esmOutput)];
  });
};

const handleCJSEntrypoint = (exports, entrypoint) => {
  if (exports?.[entrypoint].require != null) {
    return exports?.[entrypoint].require;
  }

  if (typeof exports?.[entrypoint] === 'string') {
    return exports?.[entrypoint];
  }

  return undefined;
};

const handleESMEntrypoint = (exports = {}, entrypoint) => {
  if (exports?.[entrypoint].import != null) {
    return exports?.[entrypoint].import;
  }

  if (typeof exports?.[entrypoint] === 'string') {
    return exports?.[entrypoint];
  }

  return undefined;
};

const ensure = (value, message) => {
  if (value == null) {
    throw new Error(message);
  }

  return value;
};
