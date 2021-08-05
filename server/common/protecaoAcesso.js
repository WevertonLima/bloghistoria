var jwt = require('jsonwebtoken');
var SchemaObject = require('node-schema-object');

var UsuarioTokenAcesso = new SchemaObject({ tokenAcesso: String },
    {
        methods: {

            gerarTokenAcesso(dados) {
                return jwt.sign({ 'Email': dados.email, 'IdUsuario': dados.idusuario, 'Nome': dados.nome, 'IdTipoUsuario': dados.idtipousuario }, 'Token', { expiresIn: 36000 });
            },

            verificaTokenAcesso(req, res, next) {
                console.log('verificaTokenAcesso')
                var headerTokenAcesso = req.headers['authorization'];
                if (typeof headerTokenAcesso != 'undefined') {
                    try {
                        var decoded = jwt.verify(headerTokenAcesso, 'Token');
                        next();
                    } catch (err) {
                        res.send(401);
                    }
                } else {
                    res.send(401);
                }
            },

            checkUsuarioAdm(req, res, next) {
                console.log('checaUsuarioAdm')
                var headerTokenAcesso = req.headers['authorization'];
                if (typeof headerTokenAcesso != 'undefined') {
                    try {

                        var _decoded = jwt.decode(headerTokenAcesso, { complete: true });
                        console.log(_decoded.payload);
                        isAdm = _decoded.payload.IdTipoUsuario;

                        console.log('VALIDA ADM: ', isAdm)

                        if (isAdm != 1) { res.send(405); }
                        else { next(); }

                    } catch (err) {
                        res.send(401);
                    }
                } else {
                    res.send(401);
                }
            },

            retornaCodigoTokenAcesso(Valor, req) {
                var headerTokenAcesso = req;
                var decoded = jwt.decode(headerTokenAcesso, { complete: true });

                console.log(decoded.payload);

                if (Valor === "Email") {
                    return decoded.payload.Email;
                }
                else if (Valor === "IdUsuario") {
                    return decoded.payload.IdUsuario;
                }
                else if (Valor === "IdTipoUsuario") {
                    return decoded.payload.IdTipoUsuario;
                }
            }
        }
    }
);

module.exports = UsuarioTokenAcesso;