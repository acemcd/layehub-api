import path from 'path';
import fs from 'fs';
import imageThumbnail from 'image-thumbnail';

class UploadService {
  appCdnBase: string;
  appCdnThumbnailBase: string;
  constructor(config: AppConfig) {
    this.appCdnBase = config.appCdnBase;
    this.appCdnThumbnailBase = this.appCdnBase + '/preview';
  }

  public async getAllFiles() {
    console.log({ appCdnBase: this.appCdnBase });
    const result = fs.readdirSync(this.appCdnBase, { withFileTypes: true });
    const files = result
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);
    console.log({ files });
    return files;
  }

  private async createImageThumbnail(path: string) {
    try {
      const thumbnail = await imageThumbnail(path);
      return thumbnail;
    } catch (err) {
      console.error(err);
    }
  }

  private getThumbnailPath(filePath: string) {
    const ext = path.extname(filePath);
    const thumbnailPath = filePath.replace(ext, `.thumbnail${ext}`);
    return thumbnailPath;
  }

  public async createThumbnail(path: string) {
    const thumbnail = await this.createImageThumbnail(path);
    if (!thumbnail) {
      throw new Error('Thumbnail not created');
    }
    const thumbnailPath = this.getThumbnailPath(path);
    fs.writeFileSync(thumbnailPath, thumbnail);
    return thumbnailPath;
  }

  public async createThumbnails(files: string[]) {
    const previews = [];
    for (const file of files) {
      const thumbnailPath = await this.createThumbnail(
        path.join(this.appCdnBase, file)
      );
      console.log({ thumbnailPath });
      previews.push(thumbnailPath);
    }
    return previews;
  }
}
export default UploadService;
