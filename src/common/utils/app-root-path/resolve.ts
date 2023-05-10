/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

// Dependencies
import path from 'node:path';
// import module from 'module';
// Load global paths
const globalPaths = require('module').globalPaths;

// Guess at NPM's global install dir
let npmGlobalPrefix;
if ('win32' === process.platform) {
  npmGlobalPrefix = path.dirname(process.execPath);
} else {
  npmGlobalPrefix = path.dirname(path.dirname(process.execPath));
}
const npmGlobalModuleDir = path.resolve(npmGlobalPrefix, 'lib', 'node_modules');

// Save OS-specific path separator
const sep = path.sep;

// If we're in webpack, force it to use the original require() method
// const requireFunction =
//   'function' === typeof __webpack_require__ ||
//   'function' === typeof __non_webpack_require__
//     ? __non_webpack_require__
//     : require;
const requireFunction = require;

const isInstalledWithPNPM = function (resolved: any) {
  const pnpmDir = sep + '.pnpm';

  for (const globalPath of globalPaths) {
    if (
      -1 !== globalPath.indexOf(pnpmDir) &&
      -1 !== resolved.indexOf(pnpmDir)
    ) {
      return true;
    }
  }
  return false;
};

const getFirstPartFromNodeModules = function (resolved: any) {
  const nodeModulesDir = sep + 'node_modules';

  if (-1 !== resolved.indexOf(nodeModulesDir)) {
    const parts = resolved.split(nodeModulesDir);
    if (parts.length) {
      return parts[0];
    }
  }

  return null;
};

// Resolver
export default function resolve(dirname: string) {
  // Check for environmental variable
  if (process.env.APP_ROOT_PATH) {
    return path.resolve(process.env.APP_ROOT_PATH);
  }

  // Defer to Yarn Plug'n'Play if enabled
  if (process.versions.pnp) {
    try {
      const pnp = requireFunction('pnpapi');
      return pnp.getPackageInformation(pnp.topLevel).packageLocation;
    } catch (e) {
      console.error(e);
    }
  }

  // Defer to main process in electron renderer
  // if (
  //   'undefined' !== typeof window &&
  //   window.process &&
  //   'renderer' === window.process.type
  // ) {
  //   try {
  //     const remote = requireFunction('electron').remote;
  //     return remote.require('app-root-path').path;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  // Defer to AWS Lambda when executing there
  if (process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV) {
    return process.env.LAMBDA_TASK_ROOT;
  }

  const resolved = path.resolve(dirname);
  let alternateMethod = false;
  let appRootPath = null;

  // Check if the globalPaths contain some folders with '.pnpm' in the path
  // If yes this means it is most likely installed with pnpm
  if (isInstalledWithPNPM(resolved)) {
    appRootPath = getFirstPartFromNodeModules(resolved);

    if (appRootPath) {
      return appRootPath;
    }
  }

  // Make sure that we're not loaded from a global include path
  // Eg. $HOME/.node_modules
  //     $HOME/.node_libraries
  //     $PREFIX/lib/node
  globalPaths.forEach(function (globalPath: any) {
    if (!alternateMethod && 0 === resolved.indexOf(globalPath)) {
      alternateMethod = true;
    }
  });

  // If the app-root-path library isn't loaded globally,
  // and node_modules exists in the path, just split __dirname
  if (!alternateMethod) {
    appRootPath = getFirstPartFromNodeModules(resolved);
  }

  // If the above didn't work, or this module is loaded globally, then
  // resort to require.main.filename (See http://nodejs.org/api/modules.html)
  if (alternateMethod || null == appRootPath) {
    if (requireFunction.main) {
      appRootPath = path.dirname(requireFunction.main.filename);
    } else {
      // This is the case when app-root-path is bundle'd to a commonjs2 format and is being called from an esm file.
      // In those cases require.main is undefined (See https://nodejs.org/api/modules.html#accessing-the-main-module)
      // At that point we can only get the root from looking at the callee
      appRootPath = path.dirname(process.argv[1]);
    }
  }

  // Handle global bin/ directory edge-case
  if (
    alternateMethod &&
    -1 !== appRootPath.indexOf(npmGlobalModuleDir) &&
    appRootPath.length - 4 === appRootPath.indexOf(sep + 'bin')
  ) {
    appRootPath = appRootPath.slice(0, -4);
  }

  // Return
  return appRootPath;
}
