const ctLogin = require('../controllers/BOlogin')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    server.post('/painel/login', async (req, res, next) => {
        const result = await ctLogin.controllers().login(req)
        res.send(result);
        return next();
    });

    

}