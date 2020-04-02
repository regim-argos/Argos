module.exports = {
  apps: [
    {
      name: 'API',
      script: 'dist/server.js',
      autorestart: true,
    },
    {
      name: 'queue',
      script: 'dist/queue.js',
      autorestart: true,
      instances: 2,
    },
  ],
};
