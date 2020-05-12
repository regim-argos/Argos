import Watcher from '../data/models/Watcher';

export default interface WatcherToNotification extends Watcher {
  oldLastChange: string;
}
