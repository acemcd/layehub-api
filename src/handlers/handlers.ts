import Services from '../services/services';
import UsersHandler from './users';
import FontsHandler from './fonts';
import DesignsHandler from './designs';
import UploadHandler from './uploads';

class Handlers {
  public users: UsersHandler;
  public fonts: FontsHandler;
  public designs: DesignsHandler;
  public uploads: UploadHandler;

  constructor(services: Services) {
    this.users = new UsersHandler(services.users);
    this.fonts = new FontsHandler(services.fonts);
    this.designs = new DesignsHandler(services.designs);
    this.uploads = new UploadHandler(services.uploads);
  }
}

export default Handlers;
