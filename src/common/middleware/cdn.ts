import path from 'node:path';
import { static as _static } from 'express';
import appRootPath from '../utils/app-root-path';

export function getCdnPath() {
  return path.join(appRootPath(__dirname).toString(), '../public');
}

const localCDN = () => {
  // const publicFolder = path.join(
  //   appRootPath(__dirname).toString(),
  //   '../public'
  // );
  const publicFolder = getCdnPath();

  console.log({ publicFolder });

  return _static(publicFolder);
};

export default localCDN;
