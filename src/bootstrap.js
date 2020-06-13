/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/order */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
