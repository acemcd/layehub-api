import path from 'node:path';
import { static as _static } from 'express';
import appRootPath from '../utils/app-root-path';

const localCDN = () => {
  const publicFolder = path.join(
    appRootPath(__dirname).toString(),
    '../public'
  );

  console.log({ publicFolder });

  return _static(publicFolder);
};

export default localCDN;
