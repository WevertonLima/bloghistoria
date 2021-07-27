const ctPost = require('../controllers/BOpost')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    server.get('/post/consultar', async (req, res, next) => {
        const result = await ctPost.controllers().consultar(req)
        res.send(result);
        return next();
    });

    server.post('/post/adicionar', Acesso.verificaTokenAcesso, async (req, res, next) => {
        const result = await ctPost.controllers().adicionar(req)
        res.send(result);
        return next();
    });

}