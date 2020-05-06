import NotificationService from '../Services/NotificationService';
import Controller from './Controller';

class NotificationController extends Controller {
  constructor() {
    super(NotificationService);
  }
}

export default new NotificationController();
