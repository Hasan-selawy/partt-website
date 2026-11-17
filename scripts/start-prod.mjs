process.env.NODE_ENV = 'production';
const { startServer } = await import('../server.mjs');
startServer().catch(error => {
  console.error(error.message);
  process.exit(1);
});
