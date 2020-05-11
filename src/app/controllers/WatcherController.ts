import WatcherService from '../Services/WatcherService';
import Controller from './Controller';

class WatcherController extends Controller {
  protected service = WatcherService;
}

export default new WatcherController();
