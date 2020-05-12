import NotificationService from '../Services/NotificationService';
import Controller from './Controller';

class NotificationController extends Controller {
  protected service = NotificationService;
}

export default new NotificationController();
