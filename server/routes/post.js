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

}