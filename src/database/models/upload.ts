import { UploadType } from '../../handlers/uploads';
import Model from '../utils/model';

class Upload extends Model implements IUpload {
  public id: string;
  public filename: string;
  public originalname: string;
  public description?: string;
  public src: string;
  public thumbnailSrc: string;
  public type: string;
  public size: number;
  public tags?: string;
  public createdAt?: string | undefined;
  public updatedAt?: string | undefined;

  static get tableName() {
    return 'uploads';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        filename: { type: 'string', minLength: 1, maxLength: 255 },
        originalname: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
        src: { type: 'string', minLength: 1, maxLength: 255 },
        thumbnailSrc: { type: 'string', minLength: 1, maxLength: 255 },
        type: { type: 'string', minLength: 1, maxLength: 255 },
        size: { type: 'number' },
        tags: { type: 'string', minLength: 1, maxLength: 255 },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    };
  }

  $beforeInsert() {
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  $beforeUpdate() {
    const now = new Date().toISOString();
    this.updatedAt = now;
  }
}

export default Upload;
