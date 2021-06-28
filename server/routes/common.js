const ctCommon = require('../controllers/common')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    server.get('/obtercategoriasdestaques', async (req, res, next) => {
        const result = await ctCommon.controllers().obtercategoriasdestaques(req)
        res.send(result);
        return next();
    });

    server.get('/obtercategorias', async (req, res, next) => {
        const result = await ctCommon.controllers().obtercategorias(req)
        res.send(result);
        return next();
    });

    server.get('/obtertags', async (req, res, next) => {
        const result = await ctCommon.controllers().obtertags(req)
        res.send(result);
        return next();
    });

    server.get('/obtersobre', async (req, res, next) => {
        const result = await ctCommon.controllers().obtersobre(req)
        res.send(result);
        return next();
    });

}