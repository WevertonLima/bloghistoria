const ctEmail = require('../controllers/email')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    server.post('/email/adicionar', Acesso.verificaTokenAcesso, async (req, res, next) => {
        const result = await ctEmail.controllers().adicionar(req)
        res.send(result);
        return next();
    });

}