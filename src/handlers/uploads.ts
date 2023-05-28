import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import UploadService from '../services/uploads';

class UploadHandler {
  constructor(private uploadService: UploadService) {}
  public async list(request: Request, response: Response) {
    const files = await this.uploadService.getAllFiles();
    console.log({ files });
    response.json({ files });
  }
  public async createPreviews(request: Request, response: Response) {
    const files = await this.uploadService.getAllFiles();
    const previews = await this.uploadService.createThumbnails(files);
    response.json({ previews });
  }
}
export default UploadHandler;
