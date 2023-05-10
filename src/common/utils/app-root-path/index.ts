import path from 'node:path';
import resolve from './resolve';

export default function appRootPath(dirname: any) {
  let appRootPath: string = resolve(dirname);
  console.log(appRootPath);

  const publicInterface = {
    resolve: function (pathToModule: string): string {
      return path.join(appRootPath, pathToModule);
    },

    require: function (pathToModule: string): ReturnType<NodeRequire> {
      return require(publicInterface.resolve(pathToModule));
    },

    toString: function (): string {
      return appRootPath;
    },

    setPath: function (explicitlySetPath: string): void {
      appRootPath = path.resolve(explicitlySetPath);
      publicInterface.path = appRootPath;
    },

    path: appRootPath
  };

  return publicInterface;
}
export { appRootPath };
