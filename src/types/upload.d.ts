interface CreateUploadDto {
  filename: string;
  originalname: string;
  description?: string;
  src: string;
  thumbnailSrc: string;
  type: string;
  size?: number;
  tags?: string;
}

interface IUpload extends CreateUploadDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// interface FindDesign
type FindUploadParams = {
  name: string;
  description: string;
  tags: string;
  type: string;
  limit: number;
};
