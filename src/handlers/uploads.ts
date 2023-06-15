import { Request, Response } from 'express';
import UploadService from '../services/uploads';
import { createUploadHandler } from '../common/utils/upload-handler';
import { CREATE_UPLOAD_REQUEST } from '../common/utils/schemas';

type FileUpload = {
  originalname: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export declare enum UploadType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER'
}

class UploadHandler {
  appCdnBase: string;
  uploadHandler: any;
  constructor(private uploadService: UploadService) {
    this.appCdnBase = uploadService.appCdnBase;
    this.uploadHandler = createUploadHandler({
      uploadsFolder: this.appCdnBase,
      fieldName: 'file'
    });
  }

  public async create(request: Request, response: Response) {
    const { file } = request;
    if (!file) {
      return response.status(500).send({ message: 'Server error' });
    }

    const { path, filename, originalname, size } = file as FileUpload;

    const { src, thumbnailSrc } = await this.uploadService.createThumbnail(
      path,
      filename
    );

    const input = CREATE_UPLOAD_REQUEST.parse({
      ...file,
      src,
      thumbnailSrc
    });

    const payload = Object.assign({}, input, {
      originalname,
      type: 'StaticImage',
      size
    });

    const upload = await this.uploadService.create(payload);

    response.json(upload);
  }
  public async list(request: Request, response: Response) {
    const uploads = await this.uploadService.fetchAll();
    response.json(uploads);
  }
  public async createPreviews(request: Request, response: Response) {
    const files = await this.uploadService.getAllFiles();
    const previews = await this.uploadService.createThumbnails(files);
    response.json({ previews });
  }
}
export default UploadHandler;
