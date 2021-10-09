const ctLogin = require('../controllers/login')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    server.post('/login', async (req, res, next) => {
        const result = await ctLogin.controllers().login(req)
        res.send(result);
        return next();
    });

    server.post('/usuario/cadastro', async (req, res, next) => {
        const result = await ctLogin.controllers().cadastro(req)
        res.send(result);
        return next();
    });

    server.post('/usuario/alterarSenha', Acesso.verificaTokenAcesso, async (req, res, next) => {
        const result = await ctLogin.controllers().alterarSenha(req)
        res.send(result);
        return next();
    });

    server.post('/usuario/recuperarSenha', async (req, res, next) => {
        const result = await ctLogin.controllers().emailRecuperarSenha(req)
        res.send(result);
        return next();
    });

    server.get('/check', Acesso.verificaTokenAcesso, async (req, res, next) => {
        res.send(true);
        return next();
    });

}