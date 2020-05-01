import 'dotenv/config';

import Queue from './lib/Queue';

import './tracer';

import './database';

Queue.processQueue();
