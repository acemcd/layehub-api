import path from 'path';
import fs from 'fs';
import imageThumbnail from 'image-thumbnail';
import Upload from '../database/models/upload';

const rootPath = '/home/dev/dev/layehub-api';
class UploadService {
  appCdnBase: string;
  appCdnThumbnailBase: string;
  constructor(config: AppConfig) {
    this.appCdnBase = config.appCdnBase;
    this.appCdnThumbnailBase = this.appCdnBase + '/thumbs';
  }

  public create = async (params: CreateUploadDto) => {
    const payload = {
      ...params
    };
    const upload = await Upload.query().insert(payload).returning('*');
    return upload;
  };

  public async findMany(params: FindUploadParams) {
    const query = Upload.query();
    if (params.type) {
      query.where('type', params.type);
    }

    const uploads = await query;
    return { uploads };
  }

  public async fetchAll() {
    const uploads = await Upload.query();
    return uploads;
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

  private getThumbnailPath(filename: string) {
    return {
      thumbPath: path.join(this.appCdnThumbnailBase, filename),
      thumbnailSrc: path.join(
        this.appCdnThumbnailBase.replace(rootPath, ''),
        filename
      )
    };
  }

  public async createThumbnail(filePath: string, filename: string) {
    const thumbnail = await this.createImageThumbnail(filePath);
    if (!thumbnail) {
      throw new Error('Thumbnail not created');
    }
    const { thumbPath, thumbnailSrc } = this.getThumbnailPath(filename);

    fs.writeFileSync(thumbPath, thumbnail);
    const src = filePath.replace(rootPath, '');
    return { src, thumbnailSrc };
  }

  public async createThumbnails(files: string[]) {
    const previews = [];
    for (const filename of files) {
      const filePath = path.join(this.appCdnBase, filename);

      const thumbnailPath = await this.createThumbnail(filePath, filename);

      console.log({ thumbnailPath });
      previews.push(thumbnailPath);
    }
    return previews;
  }
}
export default UploadService;
