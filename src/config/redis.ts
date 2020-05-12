export default {
  host: process.env.REDIS_HOST as string,
  port: (process.env.REDIS_PORT as unknown) as number,
  password: process.env.REDIS_PASSWORD as string,
};
