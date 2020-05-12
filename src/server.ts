import app from './app';

app.server.listen(process.env.PORT || 3333, () => {
  // eslint-disable-next-line no-console
  console.log('Running...');
});
