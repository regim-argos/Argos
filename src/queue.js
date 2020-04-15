import 'dotenv/config';

import Queue from './lib/Queue';

import './tracer';

Queue.processQueue();
