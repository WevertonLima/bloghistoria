const ctSobre = require('../controllers/BOsobre')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    server.get('/sobre', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctSobre.controllers().consultar(req)
        res.send(result);
        return next();
    });

    server.put('/sobre', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctSobre.controllers().atualizar(req)
        res.send(result);
        return next();
    });

}