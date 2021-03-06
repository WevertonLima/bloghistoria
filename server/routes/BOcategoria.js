const ctCategoria = require('../controllers/BOcategoria')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

const checkAdm = true;

module.exports = (server) => {

    server.get('/categorias', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctCategoria.controllers().consultar(req)
        res.send(result);
        return next();
    });

    server.post('/categoria', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctCategoria.controllers().inserir(req)
        res.send(result);
        return next();
    });

    server.put('/categoria', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctCategoria.controllers().atualizar(req)
        res.send(result);
        return next();
    });

    server.get('/categoria/:idcategoria', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctCategoria.controllers().obterPorId(req)
        res.send(result);
        return next();
    });

    server.post('/categoria/ativar', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctCategoria.controllers().atualizarStatus(req)
        res.send(result);
        return next();
    });

    server.post('/categoria/destacar', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctCategoria.controllers().atualizarDestaque(req)
        res.send(result);
        return next();
    });
    
}