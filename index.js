const { server, restify, env } = require('./server/server');

server.get('/*.*', restify.plugins.serveStatic({
    directory: './client',
    default: 'home.html'
}));

server.listen(env.port || 3000, () => {
    console.log('\x1b[33m%s\x1b[0m', `AMBIENTE: ${env.ambiente}  URL: ${env.url} PORTA: ${env.port}`);
});