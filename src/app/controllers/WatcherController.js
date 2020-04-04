import WatcherService from '../Services/WatcherService';
import Controller from './Controller';

class WatcherController extends Controller {
  constructor() {
    super(WatcherService);
  }
}

export default new WatcherController();
