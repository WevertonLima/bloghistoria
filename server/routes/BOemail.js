const ctEmail = require('../controllers/BOemail')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    server.get('/emails', Acesso.verificaTokenAcesso, Acesso.checkUsuarioAdm, async (req, res, next) => {
        const result = await ctEmail.controllers().consultar(req)
        res.send(result);
        return next();
    });

}