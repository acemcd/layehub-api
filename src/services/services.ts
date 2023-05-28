import UsersService from './users';
import FontsService from './fonts';
import DesignsService from './designs';
import UploadService from './uploads';

class Services {
  public config: AppConfig;
  public users: UsersService;
  public fonts: FontsService;
  public designs: DesignsService;
  public uploads: UploadService;
  constructor(config: AppConfig) {
    this.config = config;
    this.users = new UsersService();
    this.fonts = new FontsService();
    this.designs = new DesignsService();
    this.uploads = new UploadService(config);
  }
}

export default Services;
