const ctPost = require('../controllers/BOpost')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    server.get('/post/consultar', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctPost.controllers().consultar(req)
        res.send(result);
        return next();
    });

    server.post('/post/adicionar', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctPost.controllers().inserir(req)
        res.send(result);
        return next();
    });

    server.put('/post/atualizar', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctPost.controllers().atualizar(req)
        res.send(result);
        return next();
    });

    server.get('/post/editar/:idnoticia', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctPost.controllers().obterPorId(req)
        res.send(result);
        return next();
    });

    server.post('/post/ativar', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctPost.controllers().atualizarStatus(req)
        res.send(result);
        return next();
    });

    server.post('/post/criarThumb', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctPost.controllers().criarThumb(req)
        res.send(result);
        return next();
    });

    server.post('/post/criarHTML', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctPost.controllers().criarHTML(req)
        res.send(result);
        return next();
    });

}