import path from 'path';
import multer from 'multer';
import { spawn } from 'child_process';
import fs from 'fs';
import type { NextFunction, Request, Response } from 'express';
import { getCdnPath } from '../middleware/cdn';

type FileType = 'images' | 'videos' | 'fonts' | 'designs' | 'components';

type UploadHandlerConfig = {
  fieldName: string;
  uploadsFolder: string;
  fileTypes?: {
    [key in FileType]: {
      uploadPath: string;
      maxSize: number;
      extensions: string[];
    };
  };
};

const DEFAULT_CONFIG = {
  fileTypes: {
    images: {
      uploadPath: getCdnPath(),
      maxSize: 204800,
      extensions: ['jpg', 'jpeg', 'png', 'gif']
    }
  }
};

function getFileExtension(file: Express.Multer.File) {
  const index = file.originalname.lastIndexOf('.') + 1;
  return file.originalname.substring(index).toLowerCase();
}

// const uploadFilter = function (
//   req: Request,
//   file: Express.Multer.File,
//   callback: multer.FileFilterCallback
// ) {
//   const fileExtension = getFileExtension(file);
//   const typeAllowed = uploadConfiguration.extensions.some((e) => e === fileExtension);
//   // file.mimetype.includes('video/');
//   if (!typeAllowed) {
//     callback(new Error('Invalid file type.'));
//     return;
//   }

//   callback(null, true);
// };

export function createUploadHandler(config: UploadHandlerConfig) {
  const uploadsFolder = config.uploadsFolder;
  const uploadConfiguration = DEFAULT_CONFIG.fileTypes.images;

  const storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, uploadsFolder);
    },
    filename(req, file, callback) {
      const uniqueSuffix = Math.random().toString(26).substring(4, 10);
      callback(null, `${Date.now()}-${uniqueSuffix}-${file.originalname}`);
    }
  });

  const upload = multer({ storage }).single(config.fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      upload(req, res, (err: any) => {
        if (err) return res.status(500).send(err.message);
        next();
      });
    } catch (err) {
      console.log(err);
    }
  };
}

// const createUploadHandler = (fieldname: string) => {
//   return {
//     upload: (req: Request, res: Response, next: NextFunction) => {
//       try {
//         upload(req, res, (err: any) => {
//           if (err) return res.status(500).send(err.message);
//           next();
//         });
//       } catch (err) {
//         console.log(err);
//       }
//     },
//   };
// };

// export { createUploadHandler };
