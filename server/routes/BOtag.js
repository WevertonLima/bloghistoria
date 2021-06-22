const ctTag = require('../controllers/BOtag')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    server.get('/tags', Acesso.verificaTokenAcesso, async (req, res, next) => {
        const result = await ctTag.controllers().consultar(req)
        res.send(result);
        return next();
    });

    server.post('/tag', Acesso.verificaTokenAcesso, async (req, res, next) => {
        const result = await ctTag.controllers().inserir(req)
        res.send(result);
        return next();
    });

    server.put('/tag', Acesso.verificaTokenAcesso, async (req, res, next) => {
        const result = await ctTag.controllers().atualizar(req)
        res.send(result);
        return next();
    });

    server.get('/tag/:idtag', Acesso.verificaTokenAcesso, async (req, res, next) => {
        const result = await ctTag.controllers().obterPorId(req)
        res.send(result);
        return next();
    });

    server.post('/tag/ativar', Acesso.verificaTokenAcesso, async (req, res, next) => {
        const result = await ctTag.controllers().atualizarStatus(req)
        res.send(result);
        return next();
    });

}