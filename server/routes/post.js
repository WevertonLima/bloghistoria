const ctPost = require('../controllers/post')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    server.get('/obterposts', async (req, res, next) => {
        const result = await ctPost.controllers().obterposts(req)
        res.send(result);
        return next();
    });

    server.get('/obterpostspopulares', async (req, res, next) => {
        const result = await ctPost.controllers().obterpostspopulares(req)
        res.send(result);
        return next();
    });

    server.get('/obterpostporid/:idnoticia', async (req, res, next) => {
        const result = await ctPost.controllers().obterpostporid(req)
        res.send(result);
        return next();
    });

    server.get('/obtercomentarios/:idnoticia', async (req, res, next) => {
        const result = await ctPost.controllers().obtercomentarios(req)
        res.send(result);
        return next();
    });

    server.get('/obtercurtidausuario/:idnoticia', async (req, res, next) => {
        const result = await ctPost.controllers().obtercurtidausuario(req)
        res.send(result);
        return next();
    });

    server.get('/obtertagspost/:idnoticia', async (req, res, next) => {
        const result = await ctPost.controllers().obtertagspost(req)
        res.send(result);
        return next();
    });

    server.post('/curtir', async (req, res, next) => {
        const result = await ctPost.controllers().curtir(req)
        res.send(result);
        return next();
    });

    server.post('/acesso', async (req, res, next) => {
        const result = await ctPost.controllers().acesso(req)
        res.send(result);
        return next();
    });

}